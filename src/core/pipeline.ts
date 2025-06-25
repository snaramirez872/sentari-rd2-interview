import { extractMetaData } from "./steps/metaExtract";
import { extractRawText } from "./steps/rawTextIn";
import { extractEmbedding, cosineSimilarity } from "./steps/embedding";
import { updateProfile } from "./steps/profileUpdate";
import { profileManager } from "./steps/profileManager";
import { entryStorage } from "./steps/entryStorage";
import { generateEmpathicReply, generateProfileBasedReply } from "./steps/gptReply";
import { checkCarryIn } from "./steps/carryIn";
import { checkContrast } from "./steps/contrastCheck";

export async function runPipeline(text: string) {
  // Step 1 - RAW_TEXT_IN - Accept the Transcript
  const rawText = extractRawText(text);
  
  // Step 2 - EMBEDDING - Create n-dim MiniLM vector (or mock)
  const embedding = await extractEmbedding(rawText);
  
  // Step 3 - FETCH_RECENT - Load Last 5 Entries
  const recentEntries = await entryStorage.loadRecentEntries(5);

  // Step 4 - FETCH_PROFILE - Load or init User Profile
  const currentProfile = await profileManager.loadProfile();

  // Step 5 - META_EXTRACT - Extract top words, length, punctuation flags
  const metaData = extractMetaData(rawText);

  // Step 6 - PARSE_ENTRY - Use ChatGPT-1 or rule-based extraction
  // TODO: Implement parsing logic
  const parsedEntry = {
    theme: ["general"],
    vibe: ["neutral"],
    intent: "reflection",
    subtext: "personal thought",
    persona_trait: ["thoughtful"],
    bucket: ["daily"]
  };

  // Step 7 - CARRY_IN - Check if theme/vibe overlap or cosine > 0.86
  const carryIn = checkCarryIn(parsedEntry, embedding, recentEntries);

  // Step 8 - CONTRAST_CHECK - Compare new vibe vs dominant profile vibe
  const emotionFlip = checkContrast(parsedEntry, currentProfile);

  // Step 9 - PROFILE_UPDATE - Mutate profile fields
  const updatedProfile = updateProfile(currentProfile, parsedEntry, carryIn, emotionFlip);
  await profileManager.saveProfile(updatedProfile);

  // Step 10 - SAVE_ENTRY - Save full object
  const savedEntry = await entryStorage.saveEntry(rawText, parsedEntry, metaData, embedding, carryIn);

  // Step 11 - GPT_REPLY - Generate <= 55-char empathic response
  const empathicResponse = entryStorage.getEntryCount() >= 99
  ? generateProfileBasedReply(rawText, parsedEntry, currentProfile, carryIn, emotionFlip)
  : generateEmpathicReply(rawText, parsedEntry, metaData, carryIn, emotionFlip, currentProfile);

  // Step 12 - PUBLISH - Package `{entryId, response_text, carry_in}`
  // TODO: Implement publishing logicZ

  // Step 13 - COST_LATENCY_LOG - Print mock cost + time used
  // TODO: Implement cost and latency logging

  return {
    rawText,
    metaData,
    parsedEntry,
    savedEntry,
    updatedProfile,
    empathicResponse,
    recentEntries: recentEntries.length
  };
}
