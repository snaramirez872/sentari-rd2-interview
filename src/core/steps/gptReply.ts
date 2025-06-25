import { ParsedEntry, MetaData, Profile } from "@/lib/types";

/**
 * STEP 11 - GPT_REPLY
 * Generates empathetic responses based on user's diary entry
 * Response must be <= 55 characters
 * 
 * @param rawText - Original diary text
 * @param parsedEntry - Parsed analysis of the entry
 * @param metaData - Extracted metadata
 * @returns Empathetic response string
 */
export function generateEmpathicReply(
  rawText: string,
  parsedEntry: ParsedEntry,
  metaData: MetaData
): string {
  console.log(`[GPT_REPLY] input=<${rawText.substring(0, 50)}...> | vibe=<${parsedEntry.vibe.join(', ')}> | theme=<${parsedEntry.theme.join(', ')}>`);

  // Analyze the emotional context
  const isPositive = parsedEntry.vibe.some(vibe => 
    ['positive', 'happy', 'excited', 'accomplished', 'grateful', 'joyful'].includes(vibe)
  );
  
  const isNegative = parsedEntry.vibe.some(vibe => 
    ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'overwhelmed'].includes(vibe)
  );

  const isQuestioning = metaData.punctuationFlags.includes('has_question');
  const isExcited = metaData.punctuationFlags.includes('has_exclamation');
  const isHesitant = metaData.punctuationFlags.includes('has_hesitation');

  // Generate response based on context
  let response = "";

  // Priority 1: Check for questions first
  if (isQuestioning) {
    response = "Great questions! Trust your instincts 💭";
  }
  // Priority 2: Check for hesitation
  else if (isHesitant) {
    response = "It's okay to feel uncertain. You're not alone 🤗";
  }
  // Priority 3: Check for positive emotions
  else if (isPositive) {
    if (isExcited) {
      response = "That's amazing! Your energy is contagious! 🌟";
    } else if (parsedEntry.theme.some(theme => ['work', 'productivity', 'career'].includes(theme))) {
      response = "You're crushing it! Keep up the great work! 💪";
    } else if (parsedEntry.theme.some(theme => ['family', 'friends', 'relationships'].includes(theme))) {
      response = "Love that connection! Relationships are everything ❤️";
    } else if (parsedEntry.theme.some(theme => ['health', 'body', 'fitness'].includes(theme))) {
      response = "Your health journey is inspiring! Keep going! 🌱";
    } else if (parsedEntry.theme.some(theme => ['learning', 'growth', 'education'].includes(theme))) {
      response = "Learning is beautiful! Keep exploring! 📚";
    } else {
      response = "You're doing great! Keep shining! ✨";
    }
  }
  // Priority 4: Check for negative emotions
  else if (isNegative) {
    if (parsedEntry.theme.some(theme => ['work', 'stress', 'career'].includes(theme))) {
      response = "Work stress is tough. You've got this! 💪";
    } else if (parsedEntry.theme.some(theme => ['health', 'body', 'medical'].includes(theme))) {
      response = "Your health matters. Take care of yourself! 🌱";
    } else if (parsedEntry.theme.some(theme => ['family', 'relationships'].includes(theme))) {
      response = "Relationships can be complex. You're handling it well 🤗";
    } else {
      response = "I hear you. Better days are coming! 🌅";
    }
  }
  // Priority 5: Check for reflection
  else if (parsedEntry.intent === 'reflection' || parsedEntry.intent === 'contemplation') {
    response = "Deep thoughts! You're growing every day 🌱";
  }
  // Priority 6: Check for specific themes even with neutral emotions
  else if (parsedEntry.theme.some(theme => ['learning', 'growth'].includes(theme))) {
    response = "Learning is beautiful! Keep exploring! 📚";
  }
  // Default empathetic response
  else {
    response = "Thanks for sharing! I'm here for you 🤗";
  }

  // Ensure response is <= 55 characters
  if (response.length > 55) {
    response = response.substring(0, 52) + "...";
  }

  console.log(`[GPT_REPLY] output=<${response}> | length=<${response.length}> | NOTE: Generated empathic response.`);
  
  return response;
}

/**
 * Alternative: Generate response based on dominant profile vibe
 */
export function generateProfileBasedReply(
  rawText: string,
  parsedEntry: ParsedEntry,
  profile: Profile
): string {
  const dominantVibe = profile.dominant_vibe;
  const recentThemes = profile.last_theme;
  
  let response = "";
  
  // Check if this entry continues a theme
  const themeContinuation = recentThemes.some((theme: string) => 
    parsedEntry.theme.includes(theme)
  );
  
  if (themeContinuation) {
    response = "You're really exploring this! Love the consistency 🔄";
  } else if (dominantVibe === 'positive' && parsedEntry.vibe.includes('positive')) {
    response = "Your positivity is inspiring! Keep it up! 🌟";
  } else if (dominantVibe === 'neutral' && parsedEntry.vibe.includes('positive')) {
    response = "Love this shift! You're finding your groove! ✨";
  } else if (dominantVibe === 'positive' && parsedEntry.vibe.some(v => ['sad', 'angry', 'frustrated'].includes(v))) {
    response = "It's okay to have tough days. You're still amazing! 💪";
  } else {
    response = "Every entry shapes your story. Keep writing! 📝";
  }
  
  // Ensure response is <= 55 characters
  if (response.length > 55) {
    response = response.substring(0, 52) + "...";
  }
  
  return response;
} 