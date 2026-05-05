import httpx
from typing import Optional
from bs4 import BeautifulSoup
from .base import BaseScraper, TrackingResult, TrackingEvent

class IndiaPostScraper(BaseScraper):
    async def track(self, tracking_id: str) -> Optional[TrackingResult]:
        try:
            async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
                resp = await client.post(
                    "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/TrackConsignmentStatus.aspx",
                    data={"conNo": tracking_id},
                    headers={
                        "User-Agent": "Mozilla/5.0",
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                )
                soup = BeautifulSoup(resp.text, "html.parser")
                rows = soup.select("table tr")[1:]
                events = []
                for row in rows:
                    cols = [td.get_text(strip=True) for td in row.select("td")]
                    if len(cols) >= 2:
                        events.append(TrackingEvent(
                            timestamp=cols[0],
                            location=cols[2] if len(cols) > 2 else "India",
                            status=cols[1],
                            description=cols[1],
                            icon=self._determine_icon(cols[1])
                        ))
                if not events:
                    return None
                latest = events[0]
                return TrackingResult(
                    tracking_id=tracking_id,
                    courier="India Post",
                    courier_logo="/logos/indiapost.png",
                    status=self._map_status(latest.status),
                    current_location=latest.location,
                    estimated_delivery=None,
                    events=events,
                )
        except Exception as e:
            print(f"[IndiaPost] Error: {e}")
            return None