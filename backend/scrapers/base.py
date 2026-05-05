from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class TrackingEvent:
    timestamp: str
    location: str
    status: str
    description: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    icon: str = "package"

@dataclass
class TrackingResult:
    tracking_id: str
    courier: str
    courier_logo: str
    status: str
    current_location: str
    estimated_delivery: Optional[str]
    events: List[TrackingEvent] = field(default_factory=list)
    lat: Optional[float] = None
    lng: Optional[float] = None

class BaseScraper(ABC):
    @abstractmethod
    async def track(self, tracking_id: str) -> Optional[TrackingResult]:
        pass

    def _determine_icon(self, status_text: str) -> str:
        s = status_text.lower()
        if any(w in s for w in ["picked up", "collected", "booked"]):
            return "pickup"
        elif any(w in s for w in ["out for delivery"]):
            return "delivery_bike"
        elif any(w in s for w in ["delivered"]):
            return "delivered"
        elif any(w in s for w in ["hub", "arrived at", "reached", "centre"]):
            return "hub"
        elif any(w in s for w in ["in transit", "dispatched", "departed", "shipped"]):
            return "truck"
        return "package"

    def _map_status(self, raw: str) -> str:
        r = raw.lower()
        if "delivered" in r:
            return "delivered"
        if "out for delivery" in r:
            return "out_for_delivery"
        if any(w in r for w in ["transit", "dispatch", "shipped", "departed"]):
            return "in_transit"
        if any(w in r for w in ["picked", "booked", "collected"]):
            return "picked_up"
        return "pending"