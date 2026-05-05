import httpx
from typing import Optional
from .base import BaseScraper, TrackingResult, TrackingEvent

class ShiprocketScraper(BaseScraper):
    async def track(self, tracking_id: str) -> Optional[TrackingResult]:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(
                    f"https://shiprocket.co/tracking/{tracking_id}",
                    headers={"User-Agent": "Mozilla/5.0"}
                )
                # Shiprocket tracking page embeds JSON in a script tag
                import re, json
                match = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.*?});', resp.text, re.DOTALL)
                if not match:
                    return None
                state = json.loads(match.group(1))
                activities = state.get("tracking", {}).get("trackingData", {}).get("tracking_data", {}).get("shipment_track_activities", [])
                events = []
                for a in activities:
                    events.append(TrackingEvent(
                        timestamp=a.get("date", ""),
                        location=a.get("location", ""),
                        status=a.get("activity", ""),
                        description=a.get("activity", ""),
                        icon=self._determine_icon(a.get("activity", ""))
                    ))
                if not events:
                    return None
                latest = events[0]
                return TrackingResult(
                    tracking_id=tracking_id,
                    courier="Shiprocket",
                    courier_logo="/logos/shiprocket.png",
                    status=self._map_status(latest.status),
                    current_location=latest.location,
                    estimated_delivery=None,
                    events=events,
                )
        except Exception as e:
            print(f"[Shiprocket] Error: {e}")
            return None