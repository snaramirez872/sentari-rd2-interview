import { Raw } from "@/lib/types";

export function extractRawText(rawText: string): Raw {
  console.log(
    `[RAW_TEXT_IN] input=<${rawText}> | output=<${rawText.trim()}> | NOTE: Accepted Transcript.`
  );
  return rawText.trim();
}
