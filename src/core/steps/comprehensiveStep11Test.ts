import { generateEmpathicReply, generateProfileBasedReply } from "./gptReply";
import { Profile } from "@/lib/types";

/**
 * Comprehensive test for Step 11 - checking all edge cases and requirements
 */
export function comprehensiveStep11Test() {
  console.log("🔍 Comprehensive Step 11 Testing...");

  // Test 1: Check character limit compliance
  console.log("\n📏 Test 1: Character Limit Compliance");
  const longTextTest = "This is a very long diary entry that should test the character limit functionality of our response generation system to ensure it properly truncates responses that exceed the 55 character limit requirement.";
  const longParsedEntry = {
    theme: ["testing", "long", "entry"],
    vibe: ["positive", "excited", "accomplished"],
    intent: "testing",
    subtext: "testing character limits",
    persona_trait: ["thorough", "detailed"],
    bucket: ["test"]
  };
  const longMetaData = {
    topWords: ["very", "long", "entry"],
    wordCount: 25,
    punctuationFlags: ["has_exclamation"]
  };
  const longProfile: Profile = {
    top_themes: ["testing"],
    theme_count: { testing: 1 },
    dominant_vibe: "positive",
    vibe_count: { positive: 1 },
    bucket_count: { test: 1 },
    trait_pool: ["thorough"],
    last_theme: ["testing"]
  };

  const longResponse = generateEmpathicReply(longTextTest, longParsedEntry, longMetaData);
  console.log(`Long text response: "${longResponse}"`);
  console.log(`Length: ${longResponse.length} characters`);
  console.log(`✅ ${longResponse.length <= 55 ? 'PASS' : 'FAIL'}: Character limit respected`);

  // Test 2: Check all emotion types
  console.log("\n😊 Test 2: All Emotion Types");
  const emotionTests = [
    {
      name: "Very Positive",
      vibe: ["joyful", "excited", "grateful"],
      expected: "positive"
    },
    {
      name: "Very Negative", 
      vibe: ["sad", "angry", "frustrated"],
      expected: "negative"
    },
    {
      name: "Mixed Emotions",
      vibe: ["happy", "worried"],
      expected: "mixed"
    },
    {
      name: "Neutral",
      vibe: ["neutral", "calm"],
      expected: "neutral"
    }
  ];

  emotionTests.forEach(test => {
    const testEntry = {
      theme: ["test"],
      vibe: test.vibe,
      intent: "test",
      subtext: "testing emotions",
      persona_trait: ["test"],
      bucket: ["test"]
    };
    const testMeta = {
      topWords: ["test"],
      wordCount: 5,
      punctuationFlags: ["none"]
    };
    
    const response = generateEmpathicReply("Test entry", testEntry, testMeta);
    console.log(`${test.name}: "${response}" (${response.length} chars)`);
  });

  // Test 3: Check punctuation flags
  console.log("\n🔤 Test 3: Punctuation Flags");
  const punctuationTests = [
    {
      name: "Question",
      flags: ["has_question"],
      expected: "questioning"
    },
    {
      name: "Exclamation",
      flags: ["has_exclamation"],
      expected: "excited"
    },
    {
      name: "Hesitation",
      flags: ["has_hesitation"],
      expected: "hesitant"
    },
    {
      name: "None",
      flags: ["none"],
      expected: "neutral"
    }
  ];

  punctuationTests.forEach(test => {
    const testEntry = {
      theme: ["test"],
      vibe: ["neutral"],
      intent: "test",
      subtext: "testing punctuation",
      persona_trait: ["test"],
      bucket: ["test"]
    };
    const testMeta = {
      topWords: ["test"],
      wordCount: 5,
      punctuationFlags: test.flags
    };
    
    const response = generateEmpathicReply("Test entry", testEntry, testMeta);
    console.log(`${test.name}: "${response}" (${response.length} chars)`);
  });

  // Test 4: Check theme-specific responses
  console.log("\n🎯 Test 4: Theme-Specific Responses");
  const themeTests = [
    { theme: ["work", "productivity"], name: "Work/Productivity" },
    { theme: ["family", "friends"], name: "Family/Friends" },
    { theme: ["health", "body"], name: "Health/Body" },
    { theme: ["learning", "growth"], name: "Learning/Growth" },
    { theme: ["career", "reflection"], name: "Career/Reflection" }
  ];

  themeTests.forEach(test => {
    const testEntry = {
      theme: test.theme,
      vibe: ["positive"],
      intent: "test",
      subtext: "testing themes",
      persona_trait: ["test"],
      bucket: ["test"]
    };
    const testMeta = {
      topWords: ["test"],
      wordCount: 5,
      punctuationFlags: ["none"]
    };
    
    const response = generateEmpathicReply("Test entry", testEntry, testMeta);
    console.log(`${test.name}: "${response}" (${response.length} chars)`);
  });

  // Test 5: Check profile-based responses
  console.log("\n👤 Test 5: Profile-Based Responses");
  const profileTests = [
    {
      name: "Theme Continuation",
      profile: { ...longProfile, last_theme: ["work"] },
      entry: { ...longParsedEntry, theme: ["work", "productivity"] }
    },
    {
      name: "Positive Continuation",
      profile: { ...longProfile, dominant_vibe: "positive" },
      entry: { ...longParsedEntry, vibe: ["positive"] }
    },
    {
      name: "Neutral to Positive",
      profile: { ...longProfile, dominant_vibe: "neutral" },
      entry: { ...longParsedEntry, vibe: ["positive"] }
    }
  ];

  profileTests.forEach(test => {
    const response = generateProfileBasedReply("Test entry", test.entry, test.profile);
    console.log(`${test.name}: "${response}" (${response.length} chars)`);
  });

  // Test 6: Check edge cases
  console.log("\n⚠️ Test 6: Edge Cases");
  
  // Empty entry
  const emptyResponse = generateEmpathicReply("", longParsedEntry, longMetaData);
  console.log(`Empty text: "${emptyResponse}" (${emptyResponse.length} chars)`);
  
  // Very short entry
  const shortResponse = generateEmpathicReply("Hi", longParsedEntry, longMetaData);
  console.log(`Short text: "${shortResponse}" (${shortResponse.length} chars)`);
  
  // Special characters
  const specialResponse = generateEmpathicReply("I'm feeling 😊 today!", longParsedEntry, longMetaData);
  console.log(`Special chars: "${specialResponse}" (${specialResponse.length} chars)`);

  console.log("\n🎉 Comprehensive Step 11 testing completed!");
  return true;
}

// Run test if this file is executed directly
if (require.main === module) {
  comprehensiveStep11Test();
} 