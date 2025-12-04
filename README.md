# 🛕 TeerthFlow  

A modern, responsive web application for discovering and exploring Hindu pilgrimage sites (Teerths) across India. Built with **React**, **TypeScript**, and modern web technologies.  

![TeerthFlow](https://img.shields.io/badge/TeerthFlow-Pilgrimage%20Guide-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-4.4.0-purple)

---

## 📸 Project Overview  
## Crowd Level Detection Dashboard for Temples  

A real-time crowd monitoring and visualization system using **ESP8266-based IR sensors**, a **Flask backend**, and a **React frontend**.  
Designed to help pilgrims and administrators monitor people counts and crowd levels in temples.  
<br>

This project integrates **IoT and web technologies** to enhance temple management:  

- **ESP8266 microcontrollers with IR sensors** → detect people entering and exiting  
- **Flask backend** → process data from ESP devices over HTTP  
- **React dashboard** → visualize real-time crowd levels for each temple
<br>
 It bridges spirituality with modern digital tools by providing an **interactive pilgrimage and crowd-monitoring guide**.  


  
---

## 📦 Features  

✅ Modern UI built with React + TypeScript   
✅ Real-time crowd detection  
✅ Crowd categorization: Low / Medium / High  
✅ Per-temple tracking with dynamic updates  
✅ WebSocket support for live updates (optional)  
✅ Mobile-friendly dashboard UI

---

## 🚀 Getting Started
## 🧠 Requirements
- Node.js (v16+)
- Python (3.10+)
- Flask & Flask-CORS
- React (Vite or Create React App)
- ESP8266 module (NodeMCU recommended)

---

## 🐍 Backend Setup
📁 Go to the backend directory:

```bash
cd backend
````
---

🛠️ Create a virtual environment (optional):

````bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
````
---
📦 Install dependencies:

```bash
pip install -r requirements.txt
```
---

▶️ Run the backend:
```bash
python app.py
````
Backend will start on: http://localhost:5000

---
## ⚛️ Frontend Setup
📁 Go to the frontend directory:

```bash
cd frontend
```
---
📦 Install dependencies:

```bash
npm install
```
---

▶️ Start the dev server:

```bash
npm run dev
```
Frontend runs on: http://localhost:5173

---
## 📡 ESP8266 Firmware
- Program the ESP8266 with the Arduino sketch in firmware/esp8266_crowd_counter.ino

- Update Wi-Fi SSID, Password, and backend IP address in the code

- IR sensors should be connected to D1 (entry) and D2 (exit)


## 🧠 How Crowd Level is Calculated

| People Count | Crowd Level |
|--------------|-------------|
| 0–20         | Low         |
| 21–40        | Medium      |
| 41+          | High        |



You can customize this logic in app.py.
