# Sentari RD2 Interview

Implemented a 13-step pipeline that processes diary transcripts into emotionally intelligent AI replies and updates a long-term user profile.

## Features
- 13-step modular pipeline for diary transcript analysis
- Rule-based and AI-powered parsing
- Empathic reply generation
- Long-term user profile updating
- Audio transcription (Whisper)
- Cost and latency tracking per step

## Project Structure
- `src/` — Frontend and core pipeline logic
- `backend/` — FastAPI server for audio transcription and embeddings

## Install

**Frontend (Next.js + React):**
```sh
npm install
```

**Backend (FastAPI + Python):**
```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run

**Start the backend:**
```sh
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Start the frontend:**
```sh
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

**Run tests:**
```sh
npm test
```

## License
MIT
