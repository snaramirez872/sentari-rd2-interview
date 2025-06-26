import { extractMetaData } from "./steps/metaExtract";
import { extractRawText } from "./steps/rawTextIn";
import { extractEmbedding } from "./steps/embedding";
import { updateProfile } from "./steps/profileUpdate";
import { profileManager } from "./steps/profileManager";
import { entryStorage } from "./steps/entryStorage";
import { generateEmpathicReply, generateProfileBasedReply } from "./steps/gptReply";
import { checkCarryIn } from "./steps/carryIn";
import { checkContrast } from "./steps/contrastCheck";
import { parseEntry } from "./steps/parseEntry";
import { publishEntry } from "./steps/publish";
import { logCostLatency, createStepCost, StepCost } from "./steps/costLatencyLog";
import { calculateEmbeddingCost, calculateGPTReplyCost, calculateLocalOperationCost, calculateDatabaseCost } from "./utils/costCalculator";
import { v4 as uuidv4 } from "uuid";

export async function runPipeline(text: string) {
  // Start timing for Step 13
  const startTime = Date.now();
  const stepCosts: StepCost[] = [];
  
  // Step 1 - RAW_TEXT_IN - Accept the Transcript
  const step1Start = Date.now();
  const rawText = extractRawText(text);
  const step1Latency = Date.now() - step1Start;
  const step1Costs = calculateLocalOperationCost('text_validation', rawText.length);
  stepCosts.push(createStepCost("RAW_TEXT_IN", step1Latency, step1Costs.cost, step1Costs.processingUnits, "Text input validation and preprocessing", "local"));

  // Step 2 - EMBEDDING - Create n-dim MiniLM vector (or mock)
  const step2Start = Date.now();
  const embedding = await extractEmbedding(rawText);
  const step2Latency = Date.now() - step2Start;
  const step2Costs = calculateEmbeddingCost(rawText);
  stepCosts.push(createStepCost("EMBEDDING", step2Latency, step2Costs.cost, step2Costs.tokens, "Generate text embedding vector using AI service", "ai"));

  // Step 3 - FETCH_RECENT - Load Last 5 Entries
  const step3Start = Date.now();
  const recentEntries = await entryStorage.loadRecentEntries(5);
  const step3Latency = Date.now() - step3Start;
  const step3Costs = calculateDatabaseCost('read', recentEntries.length);
  stepCosts.push(createStepCost("FETCH_RECENT", step3Latency, step3Costs.cost, step3Costs.processingUnits, "Load last 5 diary entries", "database"));

  // Step 4 - FETCH_PROFILE - Load or init User Profile
  const step4Start = Date.now();
  const currentProfile = await profileManager.loadProfile();
  const step4Latency = Date.now() - step4Start;
  const step4Costs = calculateDatabaseCost('read', 1); // Single profile
  stepCosts.push(createStepCost("FETCH_PROFILE", step4Latency, step4Costs.cost, step4Costs.processingUnits, "Load user profile data", "database"));

  // Step 5 - META_EXTRACT - Extract top words, length, punctuation flags
  const step5Start = Date.now();
  const metaData = extractMetaData(rawText);
  const step5Latency = Date.now() - step5Start;
  const step5Costs = calculateLocalOperationCost('text_analysis', rawText.length);
  stepCosts.push(createStepCost("META_EXTRACT", step5Latency, step5Costs.cost, step5Costs.processingUnits, "Extract metadata from text (word count, punctuation)", "local"));

  // Step 6 - PARSE_ENTRY - Use ChatGPT-1 or rule-based extraction
  const step6Start = Date.now();
  const parsedEntry = parseEntry(rawText);
  const step6Latency = Date.now() - step6Start;
  const step6Costs = calculateLocalOperationCost('pattern_matching', rawText.length);
  stepCosts.push(createStepCost("PARSE_ENTRY", step6Latency, step6Costs.cost, step6Costs.processingUnits, "Parse entry themes, vibes, intents using pattern matching", "local"));
  console.log(`[PARSE_ENTRY] input=<${rawText.substring(0, 50)}...> | output=<${parsedEntry.theme.join(', ')}> | note=<Parsed entry fields>`);

  // Step 7 - CARRY_IN - Check if theme/vibe overlap or cosine > 0.86
  const step7Start = Date.now();
  const carryIn = checkCarryIn(parsedEntry, embedding, recentEntries);
  const step7Latency = Date.now() - step7Start;
  const step7Costs = calculateLocalOperationCost('similarity_calc', recentEntries.length);
  stepCosts.push(createStepCost( "CARRY_IN", step7Latency, step7Costs.cost, step7Costs.processingUnits, "Check theme/vibe overlap with recent entries", "local"));

  // Step 8 - CONTRAST_CHECK - Compare new vibe vs dominant profile vibe
  const step8Start = Date.now();
  const emotionFlip = checkContrast(parsedEntry, currentProfile);
  const step8Latency = Date.now() - step8Start;
  const step8Costs = calculateLocalOperationCost('text_analysis', 1); // Simple comparison
  stepCosts.push(createStepCost("CONTRAST_CHECK", step8Latency, step8Costs.cost, step8Costs.processingUnits, "Compare new vibe vs profile dominant vibe", "local"));

  // Step 9 - PROFILE_UPDATE - Mutate profile fields
  const step9Start = Date.now();
  const updatedProfile = updateProfile(currentProfile, parsedEntry, carryIn, emotionFlip);
  await profileManager.saveProfile(updatedProfile);
  const step9Latency = Date.now() - step9Start;
  const step9Costs = calculateLocalOperationCost('data_update', 1); // Profile update
  stepCosts.push(createStepCost("PROFILE_UPDATE", step9Latency, step9Costs.cost, step9Costs.processingUnits, "Update user profile with new entry data", "local"));

  // Step 10 - SAVE_ENTRY - Save full object
  const step10Start = Date.now();
  const savedEntry = await entryStorage.saveEntry(rawText, parsedEntry, metaData, embedding, carryIn);
  const step10Latency = Date.now() - step10Start;
  const step10Costs = calculateDatabaseCost('write', 1); // Single entry write
  stepCosts.push(createStepCost("SAVE_ENTRY", step10Latency, step10Costs.cost, step10Costs.processingUnits, "Save complete entry to database", "database"));

  // Step 11 - GPT_REPLY - Generate <= 55-char empathic response
  const step11Start = Date.now();
  const empathicResponse = entryStorage.getEntryCount() >= 99
  ? generateProfileBasedReply(rawText, parsedEntry, currentProfile, carryIn, emotionFlip)
  : generateEmpathicReply(rawText, parsedEntry, metaData, carryIn, emotionFlip, currentProfile);
  const step11Latency = Date.now() - step11Start;
  const step11Costs = calculateGPTReplyCost(rawText, parsedEntry, empathicResponse);
  stepCosts.push(createStepCost("GPT_REPLY", step11Latency, step11Costs.cost, step11Costs.tokens, "Generate empathic AI response", "ai"));

  // Step 12 - PUBLISH - Package `{entryId, response_text, carry_in}`
  const step12Start = Date.now();
  const publishedEntry = publishEntry(uuidv4(), empathicResponse, carryIn);
  const step12Latency = Date.now() - step12Start;
  const step12Costs = calculateLocalOperationCost('response_package', empathicResponse.length);
  stepCosts.push(createStepCost("PUBLISH", step12Latency, step12Costs.cost, step12Costs.processingUnits, "Package final response for delivery", "local"));

  // Step 13 - COST_LATENCY_LOG - Print comprehensive cost + time breakdown
  const endTime = Date.now();
  const totalLatency = endTime - startTime;
  
  const metrics = logCostLatency(stepCosts, totalLatency);

  return {
    rawText,
    metaData,
    parsedEntry,
    savedEntry,
    updatedProfile,
    empathicResponse,
    recentEntries: recentEntries.length,
    publishedEntry,
    carryIn,
    metrics, // Include the metrics in the return
  };
}
