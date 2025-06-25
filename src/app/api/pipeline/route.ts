import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/core/pipeline";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const result = await runPipeline(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Pipeline error:", error);
    return NextResponse.json({ error: "Pipeline processing failed" }, { status: 500 });
  }
}
