# TrackMate 🚚

A full-stack courier tracking application that tracks packages from 12+ Indian courier services in real time.

## Features

- 📦 Track packages from DTDC, Blue Dart, India Post, Shiprocket, Delhivery, Ekart, XpressBees, Shadowfax, Ecom Express, Trackon, Shree Maruti, Gati KWE
- 🗺️ Live map tracking with MapLibre + OpenFreeMap
- 📧 Email alerts via Gmail SMTP
- 📱 SMS alerts via Twilio
- 🕐 Full tracking history timeline
- 💾 Package history saved locally

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- MapLibre GL JS + OpenFreeMap
- React Router

**Backend**
- Python + FastAPI
- SQLAlchemy + SQLite
- Twilio SMS
- Gmail SMTP

## Setup

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
cp .env.example .env
uvicorn main:app --reload --port 8000

### Frontend
cd frontend
npm install --legacy-peer-deps
npm run dev

## Test Tracking IDs

| ID | Courier | Status |
|---|---|---|
| TM100001 | DTDC | In Transit |
| TM100006 | DTDC | Out for Delivery |
| TM100011 | India Post | Delivered |
| TM100016 | Shree Maruti | Picked Up |
| TM100019 | India Post | Pending |
| TM100022 | Delhivery | Out for Delivery |