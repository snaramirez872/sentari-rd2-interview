from fastapi import FastAPI, UploadFile
from sentence_transformers import SentenceTransformer
from faster_whisper import WhisperModel
from fastapi.middleware.cors import CORSMiddleware
import tempfile

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
model = SentenceTransformer("all-MiniLM-L6-v2")
whisper_model = WhisperModel("tiny")
# create virtual env and call it venv
# pip install -r requirements.txt inside venv
# run using uvicorn main:app --reload
@app.get("/embed")
def embedding(rawText: str):
  embedding = model.encode(rawText).tolist()
  return {"embedding": embedding}

@app.post("/transcribe")
async def transcription(audio: UploadFile = (...)):
  audio_bytes = await audio.read()

  with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
    tmp.write(audio_bytes)
    audio_path = tmp.name
  
  segments, _ = whisper_model.transcribe(audio_path)
  transcript = " ".join([seg.text for seg in segments])
  print({"transcript": transcript})

  return {"transcript": transcript}
  