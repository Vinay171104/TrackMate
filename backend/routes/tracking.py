from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json

from database import get_db
from models import TrackingRecord, AlertSubscription
from scrapers import auto_detect_and_track, SCRAPERS
from routes.alerts import send_email, send_sms, build_tracking_alert_email, build_status_sms

router = APIRouter(prefix="/api", tags=["tracking"])

_mem_cache   = {}
_status_cache = {}


async def cache_get(key):
    return _mem_cache.get(key)

async def cache_set(key, value):
    _mem_cache[key] = value


async def notify_if_status_changed(
    tracking_id: str,
    new_status: str,
    location: str,
    courier: str,
    db: AsyncSession,
    background_tasks: BackgroundTasks
):
    old_status = _status_cache.get(tracking_id)
    if old_status == new_status:
        return

    _status_cache[tracking_id] = new_status

    result = await db.execute(
        select(AlertSubscription).where(
            AlertSubscription.tracking_id.in_([tracking_id, "GLOBAL"]),
            AlertSubscription.active == True,
        )
    )
    subscribers = result.scalars().all()

    for sub in subscribers:
        # Send email alert
        if sub.email:
            background_tasks.add_task(
                send_email,
                sub.email,
                f"TrackMate: Your package is now {new_status.replace('_', ' ')} 📦",
                build_tracking_alert_email(
                    sub.email, tracking_id, new_status, location, courier
                )
            )
        # Send SMS alert
        if sub.phone:
            background_tasks.add_task(
                send_sms,
                sub.phone,
                build_status_sms(tracking_id, new_status, location)
            )

    if subscribers:
        print(f"[Alerts] Notified {len(subscribers)} subscriber(s) → {tracking_id} is {new_status}")


@router.get("/track/{tracking_id}")
async def track_package(
    tracking_id: str,
    background_tasks: BackgroundTasks,
    courier: str = None,
    db: AsyncSession = Depends(get_db)
):
    cache_key = f"track:{tracking_id}:{courier or 'auto'}"
    cached = await cache_get(cache_key)
    if cached:
        return json.loads(cached)

    if courier and courier in SCRAPERS:
        result = await SCRAPERS[courier].track(tracking_id)
    else:
        result = await auto_detect_and_track(tracking_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Tracking information not found. Please check your tracking ID."
        )

    result_dict = {
        "tracking_id": result.tracking_id,
        "courier": result.courier,
        "courier_logo": result.courier_logo,
        "status": result.status,
        "current_location": result.current_location,
        "estimated_delivery": result.estimated_delivery,
        "lat": result.lat,
        "lng": result.lng,
        "events": [
            {
                "timestamp": e.timestamp,
                "location": e.location,
                "status": e.status,
                "description": e.description,
                "icon": e.icon,
                "lat": e.lat,
                "lng": e.lng,
            }
            for e in result.events
        ],
    }

    record = TrackingRecord(
        tracking_id=result.tracking_id,
        courier=result.courier,
        status=result.status,
        events=result_dict["events"],
        current_location=result.current_location,
        estimated_delivery=result.estimated_delivery,
    )
    db.add(record)
    await db.commit()

    await notify_if_status_changed(
        tracking_id=result.tracking_id,
        new_status=result.status,
        location=result.current_location,
        courier=result.courier,
        db=db,
        background_tasks=background_tasks,
    )

    await cache_set(cache_key, json.dumps(result_dict))
    return result_dict


@router.get("/couriers")
async def list_couriers():
    return list(SCRAPERS.keys())


@router.get("/history/{tracking_id}")
async def get_history(tracking_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TrackingRecord)
        .where(TrackingRecord.tracking_id == tracking_id)
        .order_by(TrackingRecord.created_at.desc())
    )
    records = result.scalars().all()
    return [
        {
            "id": r.id,
            "tracking_id": r.tracking_id,
            "courier": r.courier,
            "status": r.status,
            "current_location": r.current_location,
            "estimated_delivery": r.estimated_delivery,
            "created_at": str(r.created_at),
        }
        for r in records
    ]