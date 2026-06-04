# EcoWise 🌍

A sustainable lifestyle platform that uses AI to help users manage waste, track carbon footprint, and adopt eco-friendly habits.

## Features

- 📸 **AI Waste Scanner**: Upload a photo of waste, and our CNN model will instantly classify it into 6 categories (Cardboard, Glass, Metal, Paper, Plastic, Trash) and provide proper disposal instructions.
- 📊 **Carbon Footprint Tracking**: Log your daily waste, energy usage, transportation, and water consumption to track your environmental impact.
- 🤖 **AI Predictions**: Get insights and predictions on your future waste generation based on your habits (Linear Regression).
- 💡 **Smart Recommendations**: Receive personalized tips for a zero-waste lifestyle.
- 🏆 **Gamification & Leaderboard**: Earn points, collect badges, and compete with the community to save the planet.

## Architecture

EcoWise is built using a modern 3-tier architecture:
- **Frontend**: React, Vite, Framer Motion, Recharts
- **Backend (API)**: Node.js, Express, Supabase (Database & Auth)
- **Machine Learning**: Python, FastAPI, TensorFlow/Keras (CNN with Transfer Learning)

## Getting Started

### Prerequisites
- Node.js
- Python 3.9+
- Supabase account (for database)

### 1. Backend (Node.js)
```bash
cd backend
npm install
# Make sure to set up your Supabase connection
npm run dev
```
The backend will run on `http://localhost:5000`.

### 2. Machine Learning API (Python)
```bash
cd model
pip install -r requirements.txt
python -m uvicorn ecowise_api:app --reload
```
The ML API will run on `http://localhost:8000`.

### 3. Frontend (React)
```bash
cd frontend
npm install
# The frontend uses Vite proxy to connect to the backend during development
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Disclaimer
This project is part of the Capstone Project for Coding Camp DBS 2026.
