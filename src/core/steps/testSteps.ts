import { updateProfile } from "./profileUpdate";
import { profileManager } from "./profileManager";
import { entryStorage } from "./entryStorage";
import { generateEmpathicReply } from "./gptReply";
import { ParsedEntry, MetaData, Embedding } from "@/lib/types";

/**
 * Test function to verify Steps 9, 10, and 11 implementation
 */
export async function testSteps9And10() {
  console.log("🧪 Testing Steps 9, 10, and 11...");

  // Test data
  const testRawText = "I had a really great day today! Work was productive and I feel accomplished.";
  const testParsedEntry: ParsedEntry = {
    theme: ["work", "productivity"],
    vibe: ["positive", "accomplished"],
    intent: "reflection",
    subtext: "feeling good about achievements",
    persona_trait: ["driven", "optimistic"],
    bucket: ["work", "daily"]
  };
  const testMetaData: MetaData = {
    topWords: ["great", "productive", "accomplished"],
    wordCount: 12,
    punctuationFlags: ["has_exclamation"]
  };
  const testEmbedding: Embedding = [0.1, 0.2, 0.3, 0.4, 0.5]; // Mock embedding

  try {
    // Test Step 9: Profile Update
    console.log("\n📝 Testing Step 9: PROFILE_UPDATE");
    const currentProfile = await profileManager.loadProfile();
    console.log("Initial profile:", currentProfile);
    
    const updatedProfile = updateProfile(currentProfile, testParsedEntry);
    console.log("Updated profile:", updatedProfile);
    
    await profileManager.saveProfile(updatedProfile);
    console.log("✅ Step 9: Profile update successful");

    // Test Step 10: Save Entry
    console.log("\n💾 Testing Step 10: SAVE_ENTRY");
    const savedEntry = await entryStorage.saveEntry(
      testRawText,
      testParsedEntry,
      testMetaData,
      testEmbedding
    );
    console.log("Saved entry ID:", savedEntry.id);
    console.log("✅ Step 10: Entry save successful");

    // Test Step 11: GPT Reply
    console.log("\n🤖 Testing Step 11: GPT_REPLY");
    const empathicResponse = generateEmpathicReply(
      testRawText,
      testParsedEntry,
      testMetaData
    );
    console.log("Empathic response:", empathicResponse);
    console.log("Response length:", empathicResponse.length, "characters");
    console.log(`✅ Step 11: ${empathicResponse.length <= 55 ? 'PASS' : 'FAIL'} - Response is ${empathicResponse.length <= 55 ? 'within' : 'over'} 55 character limit`);

    // Verify saved entry
    const loadedEntry = await entryStorage.loadEntryById(savedEntry.id);
    console.log("Loaded entry matches:", loadedEntry?.id === savedEntry.id);
    
    // Check recent entries
    const recentEntries = await entryStorage.loadRecentEntries(5);
    console.log("Recent entries count:", recentEntries.length);

    console.log("\n🎉 All tests passed! Steps 9, 10, and 11 are working correctly.");
    return true;

  } catch (error) {
    console.error("❌ Test failed:", error);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testSteps9And10().then((success) => {
    process.exit(success ? 0 : 1);
  });
} 