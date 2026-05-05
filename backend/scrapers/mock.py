from typing import Optional
from datetime import datetime, timedelta
from .base import BaseScraper, TrackingResult, TrackingEvent

# ── 25 mock tracking records ──────────────────────────────────────────────────

MOCK_DATA = {

    # ── In Transit ────────────────────────────────────────────────────────────
    "TM100001": TrackingResult(
        tracking_id="TM100001",
        courier="DTDC Express",
        courier_logo="/couriers/dtdc.png",
        status="in_transit",
        current_location="Gurgaon Hub, Haryana",
        estimated_delivery="06 May 2026",
        lat=28.4595, lng=77.0266,
        events=[
            TrackingEvent("04 May 2026, 11:45 AM", "Gurgaon Hub, Haryana",       "In Transit",    "Package in transit to Jaipur hub",     lat=28.4595, lng=77.0266,  icon="truck"),
            TrackingEvent("04 May 2026, 08:30 AM", "Delhi Hub, Delhi",            "In Transit",    "Departed from Delhi hub",              lat=28.7041, lng=77.1025,  icon="truck"),
            TrackingEvent("03 May 2026, 06:15 PM", "Delhi Hub, Delhi",            "Reached Hub",   "Arrived at Delhi sorting hub",         lat=28.7041, lng=77.1025,  icon="hub"),
            TrackingEvent("03 May 2026, 10:30 AM", "DTDC Express, Mumbai",        "Picked Up",     "Shipment picked up from sender",       lat=19.0760, lng=72.8777,  icon="pickup"),
        ]
    ),

    "TM100002": TrackingResult(
        tracking_id="TM100002",
        courier="Blue Dart",
        courier_logo="/couriers/bluedart.png",
        status="in_transit",
        current_location="Pune Hub, Maharashtra",
        estimated_delivery="05 May 2026",
        lat=18.5204, lng=73.8567,
        events=[
            TrackingEvent("04 May 2026, 02:00 PM", "Pune Hub, Maharashtra",       "In Transit",    "Package moving to Bangalore",          lat=18.5204, lng=73.8567,  icon="truck"),
            TrackingEvent("04 May 2026, 09:00 AM", "Mumbai Hub, Maharashtra",     "Departed",      "Left Mumbai hub",                      lat=19.0760, lng=72.8777,  icon="truck"),
            TrackingEvent("03 May 2026, 07:00 PM", "Mumbai Hub, Maharashtra",     "Reached Hub",   "Arrived at Mumbai hub",                lat=19.0760, lng=72.8777,  icon="hub"),
            TrackingEvent("03 May 2026, 11:00 AM", "Blue Dart, Chennai",          "Picked Up",     "Shipment collected from sender",       lat=13.0827, lng=80.2707,  icon="pickup"),
        ]
    ),

    "TM100003": TrackingResult(
        tracking_id="TM100003",
        courier="Delhivery",
        courier_logo="/couriers/delhivery.png",
        status="in_transit",
        current_location="Hyderabad Hub, Telangana",
        estimated_delivery="07 May 2026",
        lat=17.3850, lng=78.4867,
        events=[
            TrackingEvent("04 May 2026, 03:30 PM", "Hyderabad Hub, Telangana",    "In Transit",    "Package in transit",                   lat=17.3850, lng=78.4867,  icon="truck"),
            TrackingEvent("04 May 2026, 07:00 AM", "Nagpur Hub, Maharashtra",     "In Transit",    "Departed Nagpur hub",                  lat=21.1458, lng=79.0882,  icon="truck"),
            TrackingEvent("03 May 2026, 11:00 PM", "Nagpur Hub, Maharashtra",     "Reached Hub",   "Arrived Nagpur sorting facility",      lat=21.1458, lng=79.0882,  icon="hub"),
            TrackingEvent("03 May 2026, 02:00 PM", "Delhivery, Kolkata",          "Picked Up",     "Shipment picked up",                   lat=22.5726, lng=88.3639,  icon="pickup"),
        ]
    ),

    "TM100004": TrackingResult(
        tracking_id="TM100004",
        courier="XpressBees",
        courier_logo="/couriers/xpressbees.png",
        status="in_transit",
        current_location="Ahmedabad Hub, Gujarat",
        estimated_delivery="06 May 2026",
        lat=23.0225, lng=72.5714,
        events=[
            TrackingEvent("04 May 2026, 01:00 PM", "Ahmedabad Hub, Gujarat",      "In Transit",    "Moving towards destination",           lat=23.0225, lng=72.5714,  icon="truck"),
            TrackingEvent("03 May 2026, 10:00 PM", "Surat Hub, Gujarat",          "In Transit",    "Departed Surat hub",                   lat=21.1702, lng=72.8311,  icon="truck"),
            TrackingEvent("03 May 2026, 04:00 PM", "Surat Hub, Gujarat",          "Reached Hub",   "Arrived at Surat hub",                 lat=21.1702, lng=72.8311,  icon="hub"),
            TrackingEvent("03 May 2026, 09:00 AM", "XpressBees, Mumbai",          "Picked Up",     "Package picked up from origin",        lat=19.0760, lng=72.8777,  icon="pickup"),
        ]
    ),

    "TM100005": TrackingResult(
        tracking_id="TM100005",
        courier="Ekart",
        courier_logo="/couriers/ekart.png",
        status="in_transit",
        current_location="Jaipur Hub, Rajasthan",
        estimated_delivery="06 May 2026",
        lat=26.9124, lng=75.7873,
        events=[
            TrackingEvent("04 May 2026, 12:00 PM", "Jaipur Hub, Rajasthan",       "In Transit",    "Package at Jaipur hub",                lat=26.9124, lng=75.7873,  icon="hub"),
            TrackingEvent("04 May 2026, 06:00 AM", "Delhi Hub, Delhi",            "Departed",      "Left Delhi facility",                  lat=28.7041, lng=77.1025,  icon="truck"),
            TrackingEvent("03 May 2026, 08:00 PM", "Delhi Hub, Delhi",            "Reached Hub",   "Arrived Delhi sorting centre",         lat=28.7041, lng=77.1025,  icon="hub"),
            TrackingEvent("03 May 2026, 10:00 AM", "Ekart, Noida",                "Picked Up",     "Shipment picked up from seller",       lat=28.5355, lng=77.3910,  icon="pickup"),
        ]
    ),

    # ── Out for Delivery ──────────────────────────────────────────────────────
    "TM100006": TrackingResult(
        tracking_id="TM100006",
        courier="DTDC Express",
        courier_logo="/couriers/dtdc.png",
        status="out_for_delivery",
        current_location="Koramangala, Bangalore",
        estimated_delivery="04 May 2026",
        lat=12.9352, lng=77.6245,
        events=[
            TrackingEvent("04 May 2026, 09:00 AM", "Koramangala, Bangalore",      "Out for Delivery", "Package out for delivery",          lat=12.9352, lng=77.6245,  icon="delivery_bike"),
            TrackingEvent("04 May 2026, 07:30 AM", "Bangalore Hub, Karnataka",    "Reached Hub",   "Arrived at delivery hub",              lat=12.9716, lng=77.5946,  icon="hub"),
            TrackingEvent("03 May 2026, 11:00 PM", "Chennai Hub, Tamil Nadu",     "In Transit",    "Package in transit to Bangalore",      lat=13.0827, lng=80.2707,  icon="truck"),
            TrackingEvent("03 May 2026, 02:00 PM", "DTDC Express, Chennai",       "Picked Up",     "Shipment picked up",                   lat=13.0827, lng=80.2707,  icon="pickup"),
        ]
    ),

    "TM100007": TrackingResult(
        tracking_id="TM100007",
        courier="Blue Dart",
        courier_logo="/couriers/bluedart.png",
        status="out_for_delivery",
        current_location="Bandra West, Mumbai",
        estimated_delivery="04 May 2026",
        lat=19.0596, lng=72.8295,
        events=[
            TrackingEvent("04 May 2026, 08:45 AM", "Bandra West, Mumbai",         "Out for Delivery", "Out for delivery — expected by 7 PM", lat=19.0596, lng=72.8295, icon="delivery_bike"),
            TrackingEvent("04 May 2026, 06:00 AM", "Mumbai Hub, Maharashtra",     "Reached Hub",   "Arrived at local delivery hub",        lat=19.0760, lng=72.8777,  icon="hub"),
            TrackingEvent("03 May 2026, 09:00 PM", "Pune Hub, Maharashtra",       "In Transit",    "Departed Pune hub",                    lat=18.5204, lng=73.8567,  icon="truck"),
            TrackingEvent("03 May 2026, 11:00 AM", "Blue Dart, Hyderabad",        "Picked Up",     "Shipment collected",                   lat=17.3850, lng=78.4867,  icon="pickup"),
        ]
    ),

    "TM100008": TrackingResult(
        tracking_id="TM100008",
        courier="Shadowfax",
        courier_logo="/couriers/shadowfax.png",
        status="out_for_delivery",
        current_location="Indiranagar, Bangalore",
        estimated_delivery="04 May 2026",
        lat=12.9784, lng=77.6408,
        events=[
            TrackingEvent("04 May 2026, 10:15 AM", "Indiranagar, Bangalore",      "Out for Delivery", "Delivery agent on the way",         lat=12.9784, lng=77.6408,  icon="delivery_bike"),
            TrackingEvent("04 May 2026, 08:00 AM", "Bangalore Hub, Karnataka",    "Reached Hub",   "At local delivery facility",           lat=12.9716, lng=77.5946,  icon="hub"),
            TrackingEvent("04 May 2026, 02:00 AM", "Hyderabad Hub, Telangana",    "In Transit",    "Left Hyderabad hub",                   lat=17.3850, lng=78.4867,  icon="truck"),
            TrackingEvent("03 May 2026, 03:00 PM", "Shadowfax, Hyderabad",        "Picked Up",     "Package picked up from merchant",      lat=17.3850, lng=78.4867,  icon="pickup"),
        ]
    ),

    "TM100009": TrackingResult(
        tracking_id="TM100009",
        courier="Ecom Express",
        courier_logo="/couriers/ecomexpress.png",
        status="out_for_delivery",
        current_location="Connaught Place, New Delhi",
        estimated_delivery="04 May 2026",
        lat=28.6315, lng=77.2167,
        events=[
            TrackingEvent("04 May 2026, 09:30 AM", "Connaught Place, New Delhi",  "Out for Delivery", "Package out for delivery",          lat=28.6315, lng=77.2167,  icon="delivery_bike"),
            TrackingEvent("04 May 2026, 07:00 AM", "Delhi Hub, Delhi",            "Reached Hub",   "Arrived at delivery hub",              lat=28.7041, lng=77.1025,  icon="hub"),
            TrackingEvent("03 May 2026, 08:00 PM", "Agra Hub, UP",                "In Transit",    "Departed Agra hub",                    lat=27.1767, lng=78.0081,  icon="truck"),
            TrackingEvent("03 May 2026, 10:00 AM", "Ecom Express, Lucknow",       "Picked Up",     "Shipment collected from sender",       lat=26.8467, lng=80.9462,  icon="pickup"),
        ]
    ),

    "TM100010": TrackingResult(
        tracking_id="TM100010",
        courier="Trackon",
        courier_logo="/couriers/trackon.png",
        status="out_for_delivery",
        current_location="Satellite, Ahmedabad",
        estimated_delivery="04 May 2026",
        lat=23.0204, lng=72.5078,
        events=[
            TrackingEvent("04 May 2026, 10:00 AM", "Satellite, Ahmedabad",        "Out for Delivery", "With delivery executive",           lat=23.0204, lng=72.5078,  icon="delivery_bike"),
            TrackingEvent("04 May 2026, 07:45 AM", "Ahmedabad Hub, Gujarat",      "Reached Hub",   "At Ahmedabad delivery hub",            lat=23.0225, lng=72.5714,  icon="hub"),
            TrackingEvent("03 May 2026, 06:00 PM", "Vadodara Hub, Gujarat",       "In Transit",    "Left Vadodara",                        lat=22.3072, lng=73.1812,  icon="truck"),
            TrackingEvent("03 May 2026, 09:00 AM", "Trackon, Surat",              "Picked Up",     "Package collected from origin",        lat=21.1702, lng=72.8311,  icon="pickup"),
        ]
    ),

    # ── Delivered ─────────────────────────────────────────────────────────────
    "TM100011": TrackingResult(
        tracking_id="TM100011",
        courier="India Post",
        courier_logo="/couriers/indiapost.png",
        status="delivered",
        current_location="Andheri West, Mumbai",
        estimated_delivery="02 May 2026",
        lat=19.1136, lng=72.8697,
        events=[
            TrackingEvent("02 May 2026, 02:30 PM", "Andheri West, Mumbai",        "Delivered",     "Package delivered successfully",       lat=19.1136, lng=72.8697,  icon="delivered"),
            TrackingEvent("02 May 2026, 09:00 AM", "Andheri PO, Mumbai",          "Out for Delivery", "Out for delivery",                  lat=19.1136, lng=72.8697,  icon="delivery_bike"),
            TrackingEvent("01 May 2026, 05:00 PM", "Mumbai GPO, Maharashtra",     "Reached Hub",   "Arrived at post office",               lat=18.9322, lng=72.8264,  icon="hub"),
            TrackingEvent("30 Apr 2026, 10:00 AM", "Kolkata GPO, West Bengal",    "In Transit",    "Dispatched from Kolkata",              lat=22.5726, lng=88.3639,  icon="truck"),
            TrackingEvent("29 Apr 2026, 11:00 AM", "Kolkata Post Office",         "Picked Up",     "Booked at post office",                lat=22.5726, lng=88.3639,  icon="pickup"),
        ]
    ),

    "TM100012": TrackingResult(
        tracking_id="TM100012",
        courier="Shiprocket",
        courier_logo="/couriers/shiprocket.png",
        status="delivered",
        current_location="Koramangala, Bangalore",
        estimated_delivery="01 May 2026",
        lat=12.9352, lng=77.6245,
        events=[
            TrackingEvent("01 May 2026, 04:00 PM", "Koramangala, Bangalore",      "Delivered",     "Delivered to customer",                lat=12.9352, lng=77.6245,  icon="delivered"),
            TrackingEvent("01 May 2026, 09:30 AM", "Bangalore Hub, Karnataka",    "Out for Delivery", "With delivery partner",             lat=12.9716, lng=77.5946,  icon="delivery_bike"),
            TrackingEvent("30 Apr 2026, 08:00 PM", "Bangalore Hub, Karnataka",    "Reached Hub",   "At local hub",                         lat=12.9716, lng=77.5946,  icon="hub"),
            TrackingEvent("30 Apr 2026, 10:00 AM", "Chennai Hub, Tamil Nadu",     "In Transit",    "In transit to Bangalore",              lat=13.0827, lng=80.2707,  icon="truck"),
            TrackingEvent("29 Apr 2026, 02:00 PM", "Shiprocket, Chennai",         "Picked Up",     "Package collected",                    lat=13.0827, lng=80.2707,  icon="pickup"),
        ]
    ),

    "TM100013": TrackingResult(
        tracking_id="TM100013",
        courier="Delhivery",
        courier_logo="/couriers/delhivery.png",
        status="delivered",
        current_location="Sector 15, Chandigarh",
        estimated_delivery="03 May 2026",
        lat=30.7333, lng=76.7794,
        events=[
            TrackingEvent("03 May 2026, 01:00 PM", "Sector 15, Chandigarh",       "Delivered",     "Package delivered",                    lat=30.7333, lng=76.7794,  icon="delivered"),
            TrackingEvent("03 May 2026, 08:00 AM", "Chandigarh Hub",              "Out for Delivery", "Out for delivery",                  lat=30.7333, lng=76.7794,  icon="delivery_bike"),
            TrackingEvent("02 May 2026, 09:00 PM", "Ambala Hub, Haryana",         "In Transit",    "Departed Ambala hub",                  lat=30.3782, lng=76.7767,  icon="truck"),
            TrackingEvent("02 May 2026, 11:00 AM", "Delhi Hub, Delhi",            "In Transit",    "Left Delhi",                           lat=28.7041, lng=77.1025,  icon="truck"),
            TrackingEvent("01 May 2026, 03:00 PM", "Delhivery, Jaipur",           "Picked Up",     "Shipment picked up",                   lat=26.9124, lng=75.7873,  icon="pickup"),
        ]
    ),

    "TM100014": TrackingResult(
        tracking_id="TM100014",
        courier="Ekart",
        courier_logo="/couriers/ekart.png",
        status="delivered",
        current_location="Salt Lake, Kolkata",
        estimated_delivery="02 May 2026",
        lat=22.5697, lng=88.4192,
        events=[
            TrackingEvent("02 May 2026, 03:45 PM", "Salt Lake, Kolkata",          "Delivered",     "Delivered successfully",               lat=22.5697, lng=88.4192,  icon="delivered"),
            TrackingEvent("02 May 2026, 10:00 AM", "Kolkata Hub, West Bengal",    "Out for Delivery", "With delivery agent",               lat=22.5726, lng=88.3639,  icon="delivery_bike"),
            TrackingEvent("01 May 2026, 11:00 PM", "Kolkata Hub, West Bengal",    "Reached Hub",   "Arrived at hub",                       lat=22.5726, lng=88.3639,  icon="hub"),
            TrackingEvent("01 May 2026, 08:00 AM", "Bhubaneswar Hub, Odisha",     "In Transit",    "In transit",                           lat=20.2961, lng=85.8245,  icon="truck"),
            TrackingEvent("30 Apr 2026, 02:00 PM", "Ekart, Bhubaneswar",          "Picked Up",     "Package picked up from seller",        lat=20.2961, lng=85.8245,  icon="pickup"),
        ]
    ),

    "TM100015": TrackingResult(
        tracking_id="TM100015",
        courier="Gati KWE",
        courier_logo="/couriers/gatikwe.png",
        status="delivered",
        current_location="Jubilee Hills, Hyderabad",
        estimated_delivery="01 May 2026",
        lat=17.4321, lng=78.4071,
        events=[
            TrackingEvent("01 May 2026, 05:00 PM", "Jubilee Hills, Hyderabad",    "Delivered",     "Package delivered to recipient",       lat=17.4321, lng=78.4071,  icon="delivered"),
            TrackingEvent("01 May 2026, 09:00 AM", "Hyderabad Hub, Telangana",    "Out for Delivery", "Out for delivery",                  lat=17.3850, lng=78.4867,  icon="delivery_bike"),
            TrackingEvent("30 Apr 2026, 10:00 PM", "Hyderabad Hub, Telangana",    "Reached Hub",   "At delivery hub",                      lat=17.3850, lng=78.4867,  icon="hub"),
            TrackingEvent("30 Apr 2026, 08:00 AM", "Pune Hub, Maharashtra",       "In Transit",    "In transit to Hyderabad",              lat=18.5204, lng=73.8567,  icon="truck"),
            TrackingEvent("29 Apr 2026, 11:00 AM", "Gati KWE, Pune",              "Picked Up",     "Shipment collected",                   lat=18.5204, lng=73.8567,  icon="pickup"),
        ]
    ),

    # ── Picked Up ─────────────────────────────────────────────────────────────
    "TM100016": TrackingResult(
        tracking_id="TM100016",
        courier="Shree Maruti",
        courier_logo="/couriers/shreemaruti.png",
        status="picked_up",
        current_location="Shree Maruti, Ahmedabad",
        estimated_delivery="07 May 2026",
        lat=23.0225, lng=72.5714,
        events=[
            TrackingEvent("04 May 2026, 03:00 PM", "Shree Maruti, Ahmedabad",     "Picked Up",     "Shipment picked up from sender",       lat=23.0225, lng=72.5714,  icon="pickup"),
        ]
    ),

    "TM100017": TrackingResult(
        tracking_id="TM100017",
        courier="DTDC Express",
        courier_logo="/couriers/dtdc.png",
        status="picked_up",
        current_location="DTDC, Pune",
        estimated_delivery="07 May 2026",
        lat=18.5204, lng=73.8567,
        events=[
            TrackingEvent("04 May 2026, 02:00 PM", "DTDC, Pune",                  "Picked Up",     "Package collected from origin",        lat=18.5204, lng=73.8567,  icon="pickup"),
        ]
    ),

    "TM100018": TrackingResult(
        tracking_id="TM100018",
        courier="Trackon",
        courier_logo="/couriers/trackon.png",
        status="picked_up",
        current_location="Trackon Office, Chennai",
        estimated_delivery="08 May 2026",
        lat=13.0827, lng=80.2707,
        events=[
            TrackingEvent("04 May 2026, 01:30 PM", "Trackon Office, Chennai",     "Picked Up",     "Shipment booked and picked up",        lat=13.0827, lng=80.2707,  icon="pickup"),
        ]
    ),

    # ── Pending ───────────────────────────────────────────────────────────────
    "TM100019": TrackingResult(
        tracking_id="TM100019",
        courier="India Post",
        courier_logo="/couriers/indiapost.png",
        status="pending",
        current_location="Origin Post Office, Jaipur",
        estimated_delivery="09 May 2026",
        lat=26.9124, lng=75.7873,
        events=[
            TrackingEvent("04 May 2026, 10:00 AM", "Origin Post Office, Jaipur",  "Pending",       "Shipment booked, awaiting pickup",     lat=26.9124, lng=75.7873,  icon="package"),
        ]
    ),

    "TM100020": TrackingResult(
        tracking_id="TM100020",
        courier="Shiprocket",
        courier_logo="/couriers/shiprocket.png",
        status="pending",
        current_location="Shiprocket Warehouse, Delhi",
        estimated_delivery="08 May 2026",
        lat=28.7041, lng=77.1025,
        events=[
            TrackingEvent("04 May 2026, 11:00 AM", "Shiprocket Warehouse, Delhi", "Pending",       "Label created, awaiting pickup",       lat=28.7041, lng=77.1025,  icon="package"),
        ]
    ),

    # ── Multi-city long journey ───────────────────────────────────────────────
    "TM100021": TrackingResult(
        tracking_id="TM100021",
        courier="Blue Dart",
        courier_logo="/couriers/bluedart.png",
        status="in_transit",
        current_location="Nagpur Hub, Maharashtra",
        estimated_delivery="06 May 2026",
        lat=21.1458, lng=79.0882,
        events=[
            TrackingEvent("04 May 2026, 04:00 PM", "Nagpur Hub, Maharashtra",     "In Transit",    "Package at Nagpur transit hub",        lat=21.1458, lng=79.0882,  icon="hub"),
            TrackingEvent("04 May 2026, 08:00 AM", "Hyderabad Hub, Telangana",    "In Transit",    "Departed Hyderabad",                   lat=17.3850, lng=78.4867,  icon="truck"),
            TrackingEvent("03 May 2026, 09:00 PM", "Hyderabad Hub, Telangana",    "Reached Hub",   "Arrived Hyderabad",                    lat=17.3850, lng=78.4867,  icon="hub"),
            TrackingEvent("03 May 2026, 06:00 AM", "Chennai Hub, Tamil Nadu",     "In Transit",    "Departed Chennai hub",                 lat=13.0827, lng=80.2707,  icon="truck"),
            TrackingEvent("02 May 2026, 08:00 PM", "Chennai Hub, Tamil Nadu",     "Reached Hub",   "Arrived Chennai hub",                  lat=13.0827, lng=80.2707,  icon="hub"),
            TrackingEvent("02 May 2026, 09:00 AM", "Blue Dart, Coimbatore",       "Picked Up",     "Package collected from sender",        lat=11.0168, lng=76.9558,  icon="pickup"),
        ]
    ),

    "TM100022": TrackingResult(
        tracking_id="TM100022",
        courier="Delhivery",
        courier_logo="/couriers/delhivery.png",
        status="out_for_delivery",
        current_location="Connaught Place, New Delhi",
        estimated_delivery="04 May 2026",
        lat=28.6315, lng=77.2167,
        events=[
            TrackingEvent("04 May 2026, 08:00 AM", "Connaught Place, New Delhi",  "Out for Delivery", "Package out for delivery",          lat=28.6315, lng=77.2167,  icon="delivery_bike"),
            TrackingEvent("04 May 2026, 06:30 AM", "Delhi Hub, Delhi",            "Reached Hub",   "Arrived delivery hub",                 lat=28.7041, lng=77.1025,  icon="hub"),
            TrackingEvent("03 May 2026, 11:00 PM", "Jaipur Hub, Rajasthan",       "In Transit",    "Departed Jaipur",                      lat=26.9124, lng=75.7873,  icon="truck"),
            TrackingEvent("03 May 2026, 03:00 PM", "Jaipur Hub, Rajasthan",       "Reached Hub",   "Arrived Jaipur hub",                   lat=26.9124, lng=75.7873,  icon="hub"),
            TrackingEvent("03 May 2026, 07:00 AM", "Jodhpur Hub, Rajasthan",      "In Transit",    "Left Jodhpur",                         lat=26.2389, lng=73.0243,  icon="truck"),
            TrackingEvent("02 May 2026, 05:00 PM", "Delhivery, Jodhpur",          "Picked Up",     "Shipment picked up",                   lat=26.2389, lng=73.0243,  icon="pickup"),
        ]
    ),

    "TM100023": TrackingResult(
        tracking_id="TM100023",
        courier="Ecom Express",
        courier_logo="/couriers/ecomexpress.png",
        status="delivered",
        current_location="Anna Nagar, Chennai",
        estimated_delivery="03 May 2026",
        lat=13.0850, lng=80.2101,
        events=[
            TrackingEvent("03 May 2026, 12:30 PM", "Anna Nagar, Chennai",         "Delivered",     "Package delivered",                    lat=13.0850, lng=80.2101,  icon="delivered"),
            TrackingEvent("03 May 2026, 08:30 AM", "Chennai Hub, Tamil Nadu",     "Out for Delivery", "With delivery agent",               lat=13.0827, lng=80.2707,  icon="delivery_bike"),
            TrackingEvent("02 May 2026, 10:00 PM", "Chennai Hub, Tamil Nadu",     "Reached Hub",   "At local hub",                         lat=13.0827, lng=80.2707,  icon="hub"),
            TrackingEvent("02 May 2026, 10:00 AM", "Ecom Express, Coimbatore",    "Picked Up",     "Package picked up",                    lat=11.0168, lng=76.9558,  icon="pickup"),
        ]
    ),

    "TM100024": TrackingResult(
        tracking_id="TM100024",
        courier="XpressBees",
        courier_logo="/couriers/xpressbees.png",
        status="in_transit",
        current_location="Bhopal Hub, Madhya Pradesh",
        estimated_delivery="06 May 2026",
        lat=23.2599, lng=77.4126,
        events=[
            TrackingEvent("04 May 2026, 05:00 PM", "Bhopal Hub, Madhya Pradesh",  "In Transit",    "Package moving to Lucknow",            lat=23.2599, lng=77.4126,  icon="truck"),
            TrackingEvent("04 May 2026, 10:00 AM", "Indore Hub, Madhya Pradesh",  "In Transit",    "Departed Indore",                      lat=22.7196, lng=75.8577,  icon="truck"),
            TrackingEvent("03 May 2026, 08:00 PM", "Indore Hub, Madhya Pradesh",  "Reached Hub",   "Arrived Indore hub",                   lat=22.7196, lng=75.8577,  icon="hub"),
            TrackingEvent("03 May 2026, 12:00 PM", "XpressBees, Mumbai",          "Picked Up",     "Collected from sender",                lat=19.0760, lng=72.8777,  icon="pickup"),
        ]
    ),

    "TM100025": TrackingResult(
        tracking_id="TM100025",
        courier="Shree Maruti",
        courier_logo="/couriers/shreemaruti.png",
        status="in_transit",
        current_location="Ludhiana Hub, Punjab",
        estimated_delivery="06 May 2026",
        lat=30.9010, lng=75.8573,
        events=[
            TrackingEvent("04 May 2026, 03:45 PM", "Ludhiana Hub, Punjab",        "In Transit",    "Package at Ludhiana hub",              lat=30.9010, lng=75.8573,  icon="hub"),
            TrackingEvent("04 May 2026, 09:00 AM", "Ambala Hub, Haryana",         "In Transit",    "Departed Ambala",                      lat=30.3782, lng=76.7767,  icon="truck"),
            TrackingEvent("03 May 2026, 07:00 PM", "Delhi Hub, Delhi",            "In Transit",    "Left Delhi hub",                       lat=28.7041, lng=77.1025,  icon="truck"),
            TrackingEvent("03 May 2026, 09:00 AM", "Shree Maruti, Delhi",         "Picked Up",     "Shipment picked up from origin",       lat=28.7041, lng=77.1025,  icon="pickup"),
        ]
    ),
}


class MockScraper(BaseScraper):
    async def track(self, tracking_id: str) -> Optional[TrackingResult]:
        return MOCK_DATA.get(tracking_id.upper())