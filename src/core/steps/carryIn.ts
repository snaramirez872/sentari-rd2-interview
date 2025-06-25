import { ParsedEntry, FullEntries, Embedding } from "@/lib/types";
import { cosineSimilarity } from "./embedding";

/**
 * STEP 7 - CARRY_IN
 * Checks if theme/vibe overlap or cosine similarity > 0.86 with recent entries
 * Logs as per spec
 */
export function checkCarryIn(parsedEntry: ParsedEntry, embedding: Embedding, recentEntries: FullEntries[]): boolean {
  let carryIn = false;
  if (recentEntries.length > 0) {
    for (const entry of recentEntries) {
      const themeOverlap = entry.parsed.theme.some(t => parsedEntry.theme.includes(t));
      const vibeOverlap = entry.parsed.vibe.some(v => parsedEntry.vibe.includes(v));
      const sim = cosineSimilarity(entry.embedding, embedding);
      if (themeOverlap || vibeOverlap || sim > 0.86) {
        carryIn = true;
        break;
      }
    }
  }
  console.log(`[CARRY_IN] input=<themes:${parsedEntry.theme}, vibes:${parsedEntry.vibe}> | output=<${carryIn}> | note=Overlap or cosine>0.86 with recent entries`);
  return carryIn;
} 