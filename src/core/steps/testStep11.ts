import { generateEmpathicReply, generateProfileBasedReply } from "./gptReply";
import { Profile } from "@/lib/types";

/**
 * Test function to verify Step 11 implementation
 */
export function testStep11() {
  console.log("🧪 Testing Step 11: GPT_REPLY...");

  // Test cases with different scenarios
  const testCases = [
    {
      name: "Positive Work Entry",
      rawText: "I had an amazing day at work! Completed all my tasks and got praised by my boss!",
      parsedEntry: {
        theme: ["work", "productivity"],
        vibe: ["positive", "accomplished"],
        intent: "celebration",
        subtext: "feeling proud of achievements",
        persona_trait: ["driven", "confident"],
        bucket: ["work", "success"]
      },
      metaData: {
        topWords: ["amazing", "completed", "praised"],
        wordCount: 15,
        punctuationFlags: ["has_exclamation"]
      }
    },
    {
      name: "Negative Stress Entry",
      rawText: "I'm feeling really stressed about work. Everything seems overwhelming.",
      parsedEntry: {
        theme: ["work", "stress"],
        vibe: ["stressed", "overwhelmed"],
        intent: "venting",
        subtext: "feeling overwhelmed by workload",
        persona_trait: ["anxious", "overwhelmed"],
        bucket: ["work", "stress"]
      },
      metaData: {
        topWords: ["stressed", "work", "overwhelming"],
        wordCount: 10,
        punctuationFlags: ["none"]
      }
    },
    {
      name: "Questioning Entry",
      rawText: "I wonder if I'm making the right career choices? Should I change paths?",
      parsedEntry: {
        theme: ["career", "reflection"],
        vibe: ["uncertain", "contemplative"],
        intent: "questioning",
        subtext: "doubting career decisions",
        persona_trait: ["thoughtful", "uncertain"],
        bucket: ["career", "reflection"]
      },
      metaData: {
        topWords: ["career", "choices", "paths"],
        wordCount: 12,
        punctuationFlags: ["has_question"]
      }
    },
    {
      name: "Family Connection Entry",
      rawText: "Spent quality time with my family today. It was so heartwarming!",
      parsedEntry: {
        theme: ["family", "connection"],
        vibe: ["grateful", "warm"],
        intent: "appreciation",
        subtext: "appreciating family bonds",
        persona_trait: ["grateful", "family-oriented"],
        bucket: ["family", "relationships"]
      },
      metaData: {
        topWords: ["family", "quality", "heartwarming"],
        wordCount: 11,
        punctuationFlags: ["has_exclamation"]
      }
    }
  ];

  const testProfile: Profile = {
    top_themes: ["work", "family"],
    theme_count: { work: 5, family: 3 },
    dominant_vibe: "positive",
    vibe_count: { positive: 8, stressed: 2 },
    bucket_count: { work: 5, family: 3 },
    trait_pool: ["driven", "family-oriented"],
    last_theme: ["work", "productivity"]
  };

  console.log("\n📝 Testing Empathic Response Generation:");
  
  testCases.forEach((testCase, index) => {
    console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`);
    console.log(`Input: "${testCase.rawText}"`);
    
    const response = generateEmpathicReply(
      testCase.rawText,
      testCase.parsedEntry,
      testCase.metaData
    );
    
    console.log(`Response: "${response}"`);
    console.log(`Length: ${response.length} characters`);
    console.log(`✅ ${response.length <= 55 ? 'PASS' : 'FAIL'}: Response is ${response.length <= 55 ? 'within' : 'over'} 55 character limit`);
  });

  console.log("\n📊 Testing Profile-Based Response Generation:");
  
  testCases.forEach((testCase, index) => {
    console.log(`\n--- Profile Test ${index + 1}: ${testCase.name} ---`);
    
    const profileResponse = generateProfileBasedReply(
      testCase.rawText,
      testCase.parsedEntry,
      testProfile
    );
    
    console.log(`Profile Response: "${profileResponse}"`);
    console.log(`Length: ${profileResponse.length} characters`);
    console.log(`✅ ${profileResponse.length <= 55 ? 'PASS' : 'FAIL'}: Response is ${profileResponse.length <= 55 ? 'within' : 'over'} 55 character limit`);
  });

  console.log("\n🎉 Step 11 testing completed!");
  return true;
}

// Run test if this file is executed directly
if (require.main === module) {
  testStep11();
} 