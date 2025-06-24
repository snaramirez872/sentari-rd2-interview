"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioURL(URL.createObjectURL(blob));

      const formData = new FormData();
      formData.append("audio", blob);

      const res = await fetch("/api/audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    };

    mediaRecorder.start();
    setRecording(true);
    mediaRecorderRef.current = mediaRecorder;
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      {audioURL && <audio src={audioURL} controls />}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
