from fastapi import FastAPI
from sentence_transformers import SentenceTransformer

app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")
# create virtual env and call it venv
# pip install -r requirements.txt inside venv
# run using uvicorn main:app --reload
@app.get("/embed")
def embedding(rawText: str):
  embedding = model.encode(rawText).tolist()
  return {"embedding": embedding}