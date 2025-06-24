import { extractMetaData } from "./steps/metaExtract";
import { extractRawText } from "./steps/rawTextIn";
import { extractEmbedding } from "./steps/embedding";
import { store } from "./store"; 

const userId = "demo";        // temp hard-code

// ── Step 3 – FETCH_RECENT ─────────────────────────────
const recent = store.getLastEntries(userId, 5);
log("[FETCH_RECENT]", { recent });

// ── Step 4 – FETCH_PROFILE ────────────────────────────
let profile = store.getProfile(userId);
log("[FETCH_PROFILE]", { profile });

export function runPipeline(text: string) {
  // Step 1 - RAW_TEXT_IN - Accept the Transcript
  const rawText = extractRawText(text);
  // Step 2 - EMBEDDING - Create n-dim MiniLM vector (or mock)
  const embedding = extractEmbedding(rawText)
  // Step 3 - FETCH_RECENT - Load Last 5 Entries

  // Step 4 - FETCH_PROFILE - Load or init User Profile

  // Step 5 - META_EXTRACT - Extract top words, length, punctuation flags
  const metaData = extractMetaData(rawText); // Replace placeholder with rawText later

  // Step 6 - PARSE_ENTRY - Use ChatGPT-1 or rule-based extraction

  // Step 7 - CARRY_IN - Check if theme/vibe overlap or cosine > 0.86

  // Step 8 - CONTRAST_CHECK - Compare new vibe vs dominant profile vibe

  // Step 9 - PROFILE_UPDATE - Mutate profile fields

  // Step 10 - SAVE_ENTRY - Save full object

  // Step 11 - GPT_REPLY - Generate <= 55-char empathic response

  // Step 12 - PUBLISH - Package `{entryId, response_text, carry_in}`

  // Step 13 - COST_LATENCY_LOG - Print mock cost + time used
  //temporary just to return something for now
  return {
    rawText,
    metaData,
  };
}
