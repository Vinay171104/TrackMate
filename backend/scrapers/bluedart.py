import httpx
from typing import Optional
from .base import BaseScraper, TrackingResult, TrackingEvent

class BlueDartScraper(BaseScraper):
    async def track(self, tracking_id: str) -> Optional[TrackingResult]:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(
                    f"https://www.bluedart.com/tracking",
                    params={"trackFor": "0", "handler": "tnt", "action": "awbform", "trackno": tracking_id},
                    headers={"User-Agent": "Mozilla/5.0"}
                )
                # BlueDart returns HTML — parse scan events
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(resp.text, "html.parser")
                rows = soup.select(".table-responsive tr")[1:]
                events = []
                for row in rows:
                    cols = [td.get_text(strip=True) for td in row.select("td")]
                    if len(cols) >= 3:
                        events.append(TrackingEvent(
                            timestamp=f"{cols[0]} {cols[1]}",
                            location=cols[3] if len(cols) > 3 else "",
                            status=cols[2],
                            description=cols[2],
                            icon=self._determine_icon(cols[2])
                        ))
                if not events:
                    return None
                latest = events[0]
                return TrackingResult(
                    tracking_id=tracking_id,
                    courier="Blue Dart",
                    courier_logo="/logos/bluedart.png",
                    status=self._map_status(latest.status),
                    current_location=latest.location,
                    estimated_delivery=None,
                    events=events,
                )
        except Exception as e:
            print(f"[BlueDart] Error: {e}")
            return None