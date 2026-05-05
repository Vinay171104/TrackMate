import httpx
from typing import Optional
from .base import BaseScraper, TrackingResult, TrackingEvent

class DTDCScraper(BaseScraper):
    async def track(self, tracking_id: str) -> Optional[TrackingResult]:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    "https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnnTrack/DTDC_GET_CNDETAILS",
                    json={"cnNo": tracking_id, "type": "S"},
                    headers={
                        "Content-Type": "application/json",
                        "Origin": "https://www.dtdc.in",
                        "Referer": "https://www.dtdc.in/",
                        "User-Agent": "Mozilla/5.0"
                    }
                )
                data = resp.json()
                cn_list = data.get("cnDetList", [])
                if not cn_list:
                    return None
                scans = cn_list[0].get("scandetail", [])
                events = []
                for s in scans:
                    events.append(TrackingEvent(
                        timestamp=s.get("ActualTime", ""),
                        location=s.get("OfficeName", ""),
                        status=s.get("ScanStatus", ""),
                        description=s.get("ScanStatus", ""),
                        icon=self._determine_icon(s.get("ScanStatus", ""))
                    ))
                if not events:
                    return None
                latest = events[0]
                return TrackingResult(
                    tracking_id=tracking_id,
                    courier="DTDC Express",
                    courier_logo="/logos/dtdc.png",
                    status=self._map_status(latest.status),
                    current_location=latest.location,
                    estimated_delivery=cn_list[0].get("ExpectdDlvryDt"),
                    events=events,
                )
        except Exception as e:
            print(f"[DTDC] Error: {e}")
            return None