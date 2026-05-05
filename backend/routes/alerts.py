from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
import smtplib
import os
import httpx
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from database import get_db
from models import AlertSubscription

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


# ── SMS sending via twilio ──────────────────────────────────────────────────

async def send_sms(phone: str, message: str):
    account_sid  = os.getenv("TWILIO_ACCOUNT_SID", "")
    auth_token   = os.getenv("TWILIO_AUTH_TOKEN", "")
    from_number  = os.getenv("TWILIO_FROM_NUMBER", "")

    if not account_sid or not auth_token or not from_number:
        print(f"[SMS] Twilio not configured. Would send to {phone}: {message}")
        return

    # Clean phone — add +91 if no country code
    clean_phone = phone.strip()
    if not clean_phone.startswith("+"):
        if clean_phone.startswith("91") and len(clean_phone) == 12:
            clean_phone = "+" + clean_phone
        else:
            clean_phone = "+91" + clean_phone

    try:
        from twilio.rest import Client
        client = Client(account_sid, auth_token)
        msg = client.messages.create(
            body=message,
            from_=from_number,
            to=clean_phone
        )
        print(f"[SMS] ✓ Sent to {phone} — SID: {msg.sid}")
    except Exception as e:
        print(f"[SMS] ✗ Failed to send to {phone}: {e}")


# ── Email sending ─────────────────────────────────────────────────────────────

def send_email(to_email: str, subject: str, html_body: str):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")

    if not smtp_user or not smtp_pass:
        print(f"[Email] SMTP not configured. Skipping email to {to_email}")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"TrackMate Alerts <{smtp_user}>"
        msg["To"]      = to_email
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, to_email, msg.as_string())

        print(f"[Email] ✓ Sent to {to_email} — {subject}")
    except Exception as e:
        print(f"[Email] ✗ Failed: {e}")


# ── Email templates ───────────────────────────────────────────────────────────

def build_welcome_email(email: str) -> str:
    return f"""
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;
                background:#fff;border-radius:16px;overflow:hidden;
                border:1px solid #FFE4D6">
      <div style="background:linear-gradient(135deg,#E8440A,#FF6B2B);
                  padding:36px 24px;text-align:center">
        <h1 style="color:white;font-size:28px;margin:0;font-weight:800">TrackMate</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">
          Package Tracking Alerts
        </p>
      </div>
      <div style="padding:32px 24px">
        <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 8px;font-weight:700">
          Thank you for subscribing! 🎉
        </h2>
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 24px">
          Hi there! Thank you for subscribing to alerts on <strong>TrackMate</strong>.<br/>
          You will receive notifications at <strong style="color:#E8440A">{email}</strong>
          whenever your package status changes.
        </p>
        <div style="background:#FFF8F5;border-radius:12px;padding:20px;
                    border:1px solid #FFE4D6;margin-bottom:20px">
          <p style="color:#E8440A;font-size:12px;font-weight:700;margin:0 0 12px;
                    text-transform:uppercase;letter-spacing:0.08em">
            You will be notified when
          </p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:7px 0;font-size:13px;color:#555;border-bottom:1px solid #FFE4D6">📦 &nbsp;Package is picked up</td></tr>
            <tr><td style="padding:7px 0;font-size:13px;color:#555;border-bottom:1px solid #FFE4D6">🚚 &nbsp;Package is in transit</td></tr>
            <tr><td style="padding:7px 0;font-size:13px;color:#555;border-bottom:1px solid #FFE4D6">🛵 &nbsp;Package is out for delivery</td></tr>
            <tr><td style="padding:7px 0;font-size:13px;color:#555">✅ &nbsp;Package has been delivered</td></tr>
          </table>
        </div>
      </div>
      <div style="padding:20px 24px;background:#FFF8F5;text-align:center;
                  border-top:1px solid #FFE4D6">
        <p style="color:#E8440A;font-size:13px;font-weight:700;margin:0 0 4px">TrackMate</p>
        <p style="color:#bbb;font-size:11px;margin:0">
          © 2025 TrackMate · You received this because you subscribed.
        </p>
      </div>
    </div>
    """


def build_tracking_alert_email(
    email: str, tracking_id: str, status: str, location: str, courier: str
) -> str:
    status_display = status.replace("_", " ").title()
    status_styles = {
        "in_transit":       ("#1D4ED8", "#EFF6FF", "🚚"),
        "out_for_delivery": ("#92400E", "#FFFBEB", "🛵"),
        "delivered":        ("#065F46", "#ECFDF5", "✅"),
        "picked_up":        ("#5B21B6", "#F5F3FF", "📦"),
        "pending":          ("#374151", "#F9FAFB", "⏳"),
    }
    text_color, bg_color, emoji = status_styles.get(status, ("#374151", "#F9FAFB", "📦"))

    return f"""
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;
                background:#fff;border-radius:16px;overflow:hidden;
                border:1px solid #FFE4D6">
      <div style="background:linear-gradient(135deg,#E8440A,#FF6B2B);
                  padding:24px;text-align:center">
        <h1 style="color:white;font-size:22px;margin:0;font-weight:800">TrackMate</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px">Shipment Update</p>
      </div>
      <div style="padding:24px">
        <p style="color:#666;font-size:14px;margin:0 0 16px">
          Your package has a new status update:
        </p>
        <div style="background:{bg_color};border-radius:12px;padding:18px 20px;
                    margin-bottom:20px;border:1px solid {text_color}22">
          <p style="color:{text_color};font-size:20px;font-weight:800;margin:0 0 6px">
            {emoji} {status_display}
          </p>
          <p style="color:#666;font-size:13px;margin:0">📍 {location}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tr>
            <td style="padding:10px 0;color:#999;border-bottom:1px solid #f5f5f5">Tracking ID</td>
            <td style="padding:10px 0;color:#333;font-weight:700;text-align:right;
                       border-bottom:1px solid #f5f5f5">{tracking_id}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#999">Courier</td>
            <td style="padding:10px 0;color:#333;font-weight:700;text-align:right">{courier}</td>
          </tr>
        </table>
      </div>
      <div style="padding:16px 24px;background:#FFF8F5;text-align:center;
                  border-top:1px solid #FFE4D6">
        <p style="color:#bbb;font-size:11px;margin:0">
          © 2025 TrackMate · You subscribed to these alerts.
        </p>
      </div>
    </div>
    """


# ── SMS templates ─────────────────────────────────────────────────────────────

def build_welcome_sms(tracking_id: str) -> str:
    return (
        f"TrackMate: You have subscribed to alerts for tracking ID {tracking_id}. "
        f"You will receive SMS updates whenever your package status changes."
    )

def build_status_sms(tracking_id: str, status: str, location: str) -> str:
    status_display = status.replace("_", " ").upper()
    return (
        f"TrackMate Alert: Your package {tracking_id} is now {status_display}. "
        f"Current location: {location}. Track at trackmate.in"
    )


# ── Request models ────────────────────────────────────────────────────────────

class GlobalAlertRequest(BaseModel):
    email: str

class AlertRequest(BaseModel):
    tracking_id: str
    email: Optional[str] = None
    phone: Optional[str] = None


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/subscribe-global")
async def subscribe_global(
    req: GlobalAlertRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(
        select(AlertSubscription).where(
            AlertSubscription.email == req.email,
            AlertSubscription.tracking_id == "GLOBAL"
        )
    )
    if existing.scalar_one_or_none():
        return {"message": "Already subscribed!"}

    sub = AlertSubscription(tracking_id="GLOBAL", email=req.email)
    db.add(sub)
    await db.commit()

    background_tasks.add_task(
        send_email,
        req.email,
        "Welcome to TrackMate Alerts! 🚚",
        build_welcome_email(req.email)
    )
    return {"message": "Subscribed successfully!"}


@router.post("/subscribe")
async def subscribe(
    req: AlertRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    sub = AlertSubscription(
        tracking_id=req.tracking_id,
        email=req.email,
        phone=req.phone,
    )
    db.add(sub)
    await db.commit()

    # Send welcome email
    if req.email:
        background_tasks.add_task(
            send_email,
            req.email,
            f"TrackMate: Alerts set for {req.tracking_id} 📦",
            build_welcome_email(req.email)
        )

    # Send welcome SMS
    if req.phone:
        background_tasks.add_task(
            send_sms,
            req.phone,
            build_welcome_sms(req.tracking_id)
        )

    return {"message": "Subscribed successfully! You will receive email and SMS updates."}


@router.get("/subscriptions/{tracking_id}")
async def get_subscriptions(tracking_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AlertSubscription).where(AlertSubscription.tracking_id == tracking_id)
    )
    return result.scalars().all()

