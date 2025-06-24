import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { spawn } from "child_process";

// Convert p ython transcriber to a Node.js function
function runPythonTranscriber(
  filePath: string
): Promise<{ transcript: string }> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve("./app/api/audio/python/transcribe.py");

    const py = spawn("python", [scriptPath, filePath]);

    let result = "";
    let error = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      error += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python exited with code ${code}: ${error}`));
      } else {
        try {
          resolve(JSON.parse(result));
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${result}`));
        }
      }
    });
  });
}

// This is the API route for handling audio file uploads and transcription
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;

  if (!audioFile) {
    return NextResponse.json({ error: "No audio uploaded" }, { status: 400 });
  }

  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filename = `temp-${Date.now()}.webm`;

  await writeFile(filename, buffer);

  try {
    const { transcript } = await runPythonTranscriber(filename);
    return NextResponse.json({ transcript });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
