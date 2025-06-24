import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/core/pipeline";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const result = runPipeline(text);
  return NextResponse.json(result);
}

export default POST;
