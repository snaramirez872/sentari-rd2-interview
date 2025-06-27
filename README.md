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
**Clone**
```sh
git clone https://github.com/snaramirez872/sentari-rd2-interview
```

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

## Meet the Team!
- Team Lead: Aditya Thakare | [LinkedIn](https://www.linkedin.com/in/aditya-thakare-990833150/)
    - Responsible for `CARRY_IN` and `CONTRAST_CHECK`
- Associate Team Lead: Hector Qui&ntilde;ones | [GitHub](https://github.com/hquino1)
    - Responsible for `EMBEDDING`
    - Implemented Back End
- Christina Murphy | [LinkedIn](https://www.linkedin.com/in/christinajmurphy/)
    - Responsible for `RAW_TEXT_IN` and `PUBLISH`
    - Implemented Front End
- Jiawei Lin | [LinkedIn](https://www.linkedin.com/in/jiawei-lin-349809259/)
    - Responsible for `FETCH_RECENT` and `FETCH_PROFILE`
    - Implemented Local Storage Saving (SIngle User Case)
- Sean Ramirez | [LinkedIn](https://www.linkedin.com/in/seanaramirez/) | [Website](https://seanramirez.vercel.app/)
    - Responsible for `META_EXTRACT`
    - Implemented Test Suite (with assistance from Amarnath, Christina, and Hector)
- Amarnath Kaushik | [LinkedIn](https://www.linkedin.com/in/amarnathskaushik/)
    - Responsible for `PARSE_ENTRY` and `COST_LATENCY_LOG`
- Preetham Dandu | [LinkedIn](https://www.linkedin.com/in/preetham-dandu/)
    - Responsible for `PROFILE_UPDATE`, `SAVE_ENTRY`, and `GPT_REPLY`

## License
MIT
