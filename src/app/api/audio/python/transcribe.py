#Transcribe audio using the Whisper model


import sys
import json
from faster_whisper import WhisperModel

def main(audio_path):
    model = WhisperModel("tiny")
    segments, _ = model.transcribe(audio_path)
    transcript = " ".join([seg.text for seg in segments])
    print(json.dumps({"transcript": transcript}))

if __name__ == "__main__":
    audio_path = sys.argv[1]
    main(audio_path)
