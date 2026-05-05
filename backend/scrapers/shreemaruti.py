import httpx
from typing import Optional
from bs4 import BeautifulSoup
from .base import BaseScraper, TrackingResult, TrackingEvent

class ShreeMarutiScraper(BaseScraper):
    async def track(self, tracking_id: str) -> Optional[TrackingResult]:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    "https://www.shreemaruticouriers.com/track-shipment/",
                    data={"tracking_id": tracking_id},
                    headers={"User-Agent": "Mozilla/5.0"}
                )
                soup = BeautifulSoup(resp.text, "html.parser")
                rows = soup.select("table.tracking-table tr")[1:]
                events = []
                for row in rows:
                    cols = [td.get_text(strip=True) for td in row.select("td")]
                    if len(cols) >= 3:
                        events.append(TrackingEvent(
                            timestamp=cols[0],
                            location=cols[1],
                            status=cols[2],
                            description=cols[2],
                            icon=self._determine_icon(cols[2])
                        ))
                if not events:
                    return None
                latest = events[0]
                return TrackingResult(
                    tracking_id=tracking_id,
                    courier="Shree Maruti Couriers",
                    courier_logo="/logos/shreemaruti.png",
                    status=self._map_status(latest.status),
                    current_location=latest.location,
                    estimated_delivery=None,
                    events=events,
                )
        except Exception as e:
            print(f"[ShreeMaruti] Error: {e}")
            return None