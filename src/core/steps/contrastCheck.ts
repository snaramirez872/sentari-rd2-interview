import { ParsedEntry, Profile } from "@/lib/types";

/**
 * STEP 8 - CONTRAST_CHECK
 * Compares new entry's vibe(s) to profile's dominant vibe
 * Logs as per spec
 */
export function checkContrast(parsedEntry: ParsedEntry, currentProfile: Profile): boolean {
  let emotionFlip = false;
  if (currentProfile.dominant_vibe && parsedEntry.vibe.length > 0) {
    // Mock: If new vibe is not the same as dominant, mark as flip
    emotionFlip = !parsedEntry.vibe.includes(currentProfile.dominant_vibe);
  }
  console.log(`[CONTRAST_CHECK] input=<new:${parsedEntry.vibe}, dominant:${currentProfile.dominant_vibe}> | output=<${emotionFlip}> | note=Emotion flip if new vibe differs from dominant.`);
  return emotionFlip;
} 