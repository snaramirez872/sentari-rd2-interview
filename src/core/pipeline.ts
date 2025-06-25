import { extractMetaData } from "./steps/metaExtract";
import { extractRawText } from "./steps/rawTextIn";
import { extractEmbedding } from "./steps/embedding";
import { parseEntry } from "./steps/parseEntry";
import { updateProfile } from "./steps/profileUpdate";
import { profileManager } from "./steps/profileManager";
import { entryStorage } from "./steps/entryStorage";
import { generateEmpathicReply } from "./steps/gptReply";

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
  const parsedEntry = parseEntry(rawText);
  console.log(`[PARSE_ENTRY] input=<${rawText.substring(0, 50)}...> | output=<${parsedEntry.theme.join(', ')}> | note=<Parsed entry fields>`);

  // Step 7 - CARRY_IN - Check if theme/vibe overlap or cosine > 0.86
  // TODO: Implement carry-in logic

  // Step 8 - CONTRAST_CHECK - Compare new vibe vs dominant profile vibe
  // TODO: Implement contrast checking

  // Step 9 - PROFILE_UPDATE - Mutate profile fields
  const updatedProfile = updateProfile(currentProfile, parsedEntry);
  await profileManager.saveProfile(updatedProfile);

  // Step 10 - SAVE_ENTRY - Save full object
  const savedEntry = await entryStorage.saveEntry(rawText, parsedEntry, metaData, embedding);

  // Step 11 - GPT_REPLY - Generate <= 55-char empathic response
  const empathicResponse = generateEmpathicReply(rawText, parsedEntry, metaData);

  // Step 12 - PUBLISH - Package `{entryId, response_text, carry_in}`
  // TODO: Implement publishing logic

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
