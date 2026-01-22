# TeerthFlow – IOT & AI based smart crowd supervision system

TeerthFlow helps pilgrims discover temples across India, view live/forecasted crowd levels, plan itineraries, and receive smart recommendations. A companion computer-vision service detects crowd density from video feeds and can raise alerts.

## Problem Statement & Solution
- **Problem:** Pilgrims face long waits and unpredictable crowd surges at temples, lacking a single place to discover sites, plan visits, and get real-time safety signals.
- **Solution:** Our solution is a hardware-driven Smart Crowd Management System using ESP32-CAMs, IR/ultrasonic counters, and Raspberry Pi edge gateways installed across temple entry, exit, and high-traffic zones.
These devices continuously measure real-time crowd flow, fuse multi-sensor data, and run on-edge CV models to detect density surges and abnormal movement.
The gateway triggers instant on-site alerts through signage, sirens, and staff notifications without relying on cloud latency.
A cloud dashboard displays live & predicted crowd load and helps visitors plan safer itineraries while enabling authorities to prevent stampede-risk situations.

## Features

-Smart hardware sensing using ESP32-CAMs and IR/ultrasonic counters for real-time entry/exit tracking.

-On-edge crowd analytics on Raspberry Pi/Jetson (density estimation, anomaly detection, device health monitoring).

-Live dashboard showing crowd load, gate flow, sensor status, alerts, and predictions for safer planning.

-Itinerary & guidance system suggesting optimal visit times/routes based on real sensor data.

-Automated safety alerts via signage, sirens, and staff notifications triggered directly by edge hardware.

## Technologies Used
#Hardware & Edge Compute

-ESP32-CAM (OV3660), IR/Ultrasonic sensors, break-beam counters

-Raspberry Pi 4/5 gateway, optional NVIDIA Jetson Nano/Orin for heavier CV

-MQTT/HTTPS for device-to-gateway communication

-PoE/Wi-Fi mesh + battery/solar backup infrastructure

#Edge & CV Processing

-Python, OpenCV (YuNet / lightweight detectors), TensorFlow/PyTorch-based risk models

-Raspberry Pi inference pipeline for density maps, motion anomaly detection

-Local Flask/FastAPI service for sensor fusion & alert logic

#Cloud & Dashboard

-Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui (admin & visitor dashboards)

-Recharts for analytics, Mapbox-GL for temple layouts

-Supabase (auth, DB, real-time logs) for data syncing from gateways

-React Query & Context providers for state management

#Alerts & Communication

-Local actuators (siren, LED signage) controlled by Pi

-Cloud-triggered SMS/Email alerts via Mailjet/WhatsApp APIs

## Project Structure (key parts)
- `src/pages/*`: Routes (home, dashboard, itinerary, temple/state details, auth).
- `src/components/*`: UI building blocks, charts, cards, and layout.
- `src/data/mockData.ts`: Mock states/temples/crowd data and helpers.
- `src/integrations/supabase/*`: Supabase client and generated types.
- `Density Detection and alert generation models/alert.py`: Optional CV/alert service using YuNet + GRU.

## Prerequisites
- Node.js 18+ and npm.
- (Optional CV service) Python 3.9+ with pip, a webcam/video feed, and Mailjet credentials.

## Steps to Install and Run (Web App)
```sh
cd TeerthFlow
npm install
npm run dev        # starts Vite on localhost:5173 by default
```
Build for production:
```sh
npm run build
npm run preview    # serve the production build locally
```

## Required Environment Variables
Create a `.env` file in `TeerthFlow/` (Vite uses the `VITE_` prefix):
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```
Optional (recommended for the CV/alert service to avoid hard-coded secrets):
```
MAILJET_API_KEY=<mailjet-key>
MAILJET_SECRET_KEY=<mailjet-secret>
MAIL_FROM=<from-email>
MAIL_FROM_NAME=<from-name>
MAIL_TO=<to-email>
MAIL_TO_NAME=<to-name>
```
Replace the hard-coded values in `Density Detection and alert generation models/alert.py` or update the script to read these variables.

## Steps to Run the Density Detection & Alert Service (Optional)
1) Install dependencies:
```sh
cd "TeerthFlow/Density Detection and alert generation models"
pip install -r requirements.txt  # if present
# or install manually:
pip install opencv-python torch flask requests numpy
```
2) Place models in this folder (already included):
- `face_detection_yunet_2023mar.onnx`
- `tiny_risk_model.pth`

3) Run against a webcam or stream:
```sh
python alert.py 0 --yunet face_detection_yunet_2023mar.onnx --weights tiny_risk_model.pth --api-port 8000
```
The Flask API exposes `GET /stampede` returning `{ "status": 0 | 1 }`. When risk exceeds the threshold, the script can send an email via Mailjet.

## Sample Inputs / Usage Scenarios
- Web: Search a state from the hero search, open a temple page to view crowd stats and recommendations, then add visits to the itinerary planner and mark them as visited in the dashboard.
- CV service: Point a webcam at a crowd, run `alert.py 0`, and poll `http://localhost:8000/stampede` for status; configure Mailjet to receive alerts.

## Notes
- The app ships with mock data; wire Supabase tables to replace mock crowd counts and temple data.
- Mapbox may require an access token if you extend the map integration.
- For production, move secrets out of code and into environment variables.
