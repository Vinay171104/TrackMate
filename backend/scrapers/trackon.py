import httpx
from typing import Optional
from .base import BaseScraper, TrackingResult, TrackingEvent

class TrackonScraper(BaseScraper):
    async def track(self, tracking_id: str) -> Optional[TrackingResult]:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(
                    "https://trackon.in/NewTrack/track",
                    params={"tn": tracking_id},
                    headers={"User-Agent": "Mozilla/5.0", "X-Requested-With": "XMLHttpRequest"}
                )
                data = resp.json()
                scans = data.get("scans", [])
                events = []
                for s in scans:
                    events.append(TrackingEvent(
                        timestamp=s.get("scan_time", ""),
                        location=s.get("location", ""),
                        status=s.get("remarks", ""),
                        description=s.get("remarks", ""),
                        icon=self._determine_icon(s.get("remarks", ""))
                    ))
                if not events:
                    return None
                latest = events[0]
                return TrackingResult(
                    tracking_id=tracking_id,
                    courier="Trackon Couriers",
                    courier_logo="/logos/trackon.png",
                    status=self._map_status(latest.status),
                    current_location=latest.location,
                    estimated_delivery=None,
                    events=events,
                )
        except Exception as e:
            print(f"[Trackon] Error: {e}")
            return None