from .mock import MockScraper, MOCK_DATA
from .dtdc import DTDCScraper
from .indiapost import IndiaPostScraper
from .bluedart import BlueDartScraper
from .trackon import TrackonScraper
from .shiprocket import ShiprocketScraper
from .shreemaruti import ShreeMarutiScraper

SCRAPERS = {
    "mock":        MockScraper(),
    "dtdc":        DTDCScraper(),
    "indiapost":   IndiaPostScraper(),
    "bluedart":    BlueDartScraper(),
    "trackon":     TrackonScraper(),
    "shiprocket":  ShiprocketScraper(),
    "shreemaruti": ShreeMarutiScraper(),
}

async def auto_detect_and_track(tracking_id: str):
    # Check mock data first
    mock_result = await MockScraper().track(tracking_id)
    if mock_result:
        return mock_result
    # Then try real scrapers
    for name, scraper in SCRAPERS.items():
        if name == "mock":
            continue
        result = await scraper.track(tracking_id)
        if result:
            return result
    return None