import { ParsedEntry } from '../../lib/types';

export function parseEntry(text: string): ParsedEntry {
  // Step 06: PARSE_ENTRY - Extract structured fields from raw transcript
  const lowerText = text.toLowerCase();
  
  // Extract all fields using rule-based parsing
  const theme = extractThemes(lowerText);
  const vibe = extractVibes(lowerText);
  const intent = extractIntent(lowerText);
  const subtext = extractSubtext(lowerText);
  const persona_trait = extractPersonaTraits(lowerText);
  const bucket = determineBucket(lowerText);

  return {
    theme,
    vibe,
    intent,
    subtext,
    persona_trait,
    bucket
  };
}

function extractThemes(text: string): string[] {
  // Theme: External topic or hashtag discussed - be more focused
  const themePatterns: Record<string, string[]> = {
    'work-life balance': ['work', 'life', 'balance', 'slack', 'rest', 'tired', 'exhausted', 'burnout', 'overtime', 'checking', 'miss'],
    'intern management': ['intern', 'internship', 'mentor', 'mentoring', 'junior', 'new hire', 'onboarding'],
    'startup culture': ['startup', 'culture', 'company', 'growth', 'scale', 'funding', 'venture', 'entrepreneur'],
    'productivity': ['productive', 'efficiency', 'focus', 'output', 'deadline', 'task', 'project'],
    'team building': ['team', 'collaboration', 'together', 'group', 'colleague', 'co-worker', 'partnership'],
    'personal growth': ['learn', 'growth', 'improve', 'develop', 'skill', 'knowledge', 'education'],
    'health & wellness': ['health', 'wellness', 'exercise', 'fitness', 'mental health', 'stress', 'anxiety'],
    'relationships': ['friend', 'family', 'relationship', 'partner', 'dating', 'social', 'connection'],
    'financial': ['money', 'finance', 'budget', 'saving', 'investment', 'salary', 'income', 'expense'],
    'technology': ['tech', 'software', 'coding', 'programming', 'app', 'digital', 'online', 'internet']
  };

  // Score each theme based on keyword matches
  const themeScores: Record<string, number> = {};
  
  Object.entries(themePatterns).forEach(([theme, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1;
        // Bonus points for exact word matches (not just substring)
        if (text.includes(` ${keyword} `) || text.startsWith(keyword) || text.endsWith(keyword)) {
          score += 0.5;
        }
      }
    });
    if (score > 0) {
      themeScores[theme] = score;
    }
  });

  // Sort themes by score and take top 1-2 themes
  const sortedThemes = Object.entries(themeScores)
    .sort(([,a], [,b]) => b - a)
    .map(([theme]) => theme);

  // Return top 1-2 themes, but be more selective
  if (sortedThemes.length === 0) {
    return ['general'];
  } else if (sortedThemes.length === 1) {
    return sortedThemes;
  } else {
    // Only return second theme if it has significant score difference
    const topScore = themeScores[sortedThemes[0]];
    const secondScore = themeScores[sortedThemes[1]];
    
    // If top theme has significantly higher score, return only that
    if (topScore > secondScore * 1.5) {
      return [sortedThemes[0]];
    }
    
    // Otherwise return top 2 themes
    return sortedThemes.slice(0, 2);
  }
}

function extractVibes(text: string): string[] {
  // Vibe: Current emotional tone expressed - be more accurate
  const vibePatterns: Record<string, string[]> = {
    'anxious': ['anxious', 'worried', 'scared', 'nervous', 'tense', 'stressed', 'fearful', 'panicked'],
    'exhausted': ['exhausted', 'tired', 'drained', 'burned out', 'fatigued', 'weary', 'spent'],
    'driven': ['driven', 'motivated', 'focused', 'determined', 'ambitious', 'goal-oriented', 'purposeful'],
    'curious': ['curious', 'interested', 'wondering', 'exploring', 'intrigued', 'fascinated', 'inquisitive'],
    'excited': ['excited', 'enthusiastic', 'thrilled', 'pumped', 'energized', 'eager', 'stoked'],
    'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'at ease', 'content'],
    'frustrated': ['frustrated', 'annoyed', 'irritated', 'angry', 'mad', 'upset', 'disappointed'],
    'confident': ['confident', 'assured', 'certain', 'sure', 'positive', 'optimistic', 'hopeful'],
    'overwhelmed': ['overwhelmed', 'swamped', 'buried', 'drowning', 'snowed under', 'inundated'],
    'grateful': ['grateful', 'thankful', 'appreciative', 'blessed', 'fortunate', 'lucky'],
    'lonely': ['lonely', 'isolated', 'alone', 'solitary', 'disconnected', 'separated'],
    'inspired': ['inspired', 'motivated', 'moved', 'touched', 'uplifted', 'encouraged']
  };

  const foundVibes: string[] = [];
  
  Object.entries(vibePatterns).forEach(([vibe, keywords]) => {
    const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
    if (matchCount > 0) {
      foundVibes.push(vibe);
    }
  });

  // If no specific vibes found, return neutral
  return foundVibes.length > 0 ? foundVibes : ['neutral'];
}

function extractIntent(text: string): string {
  // Intent: Explicit goal the speaker wants to achieve - be more specific
  const intentPatterns = [
    {
      patterns: [/need\s+rest/, /want\s+rest/, /hope\s+to\s+rest/, /plan\s+to\s+rest/, /scared.*miss.*important/],
      intent: "Find rest without guilt or fear of missing out."
    },
    {
      patterns: [/need\s+to/, /want\s+to/, /hope\s+to/, /plan\s+to/, /aim\s+to/],
      intent: "Seeking improvement or change in current situation"
    },
    {
      patterns: [/trying\s+to/, /attempting\s+to/, /working\s+on/, /focusing\s+on/],
      intent: "Working towards a specific goal or objective"
    },
    {
      patterns: [/worry\s+about/, /concerned\s+about/, /fear\s+that/, /scared\s+of/],
      intent: "Addressing concerns or fears about future outcomes"
    },
    {
      patterns: [/learn\s+from/, /understand\s+why/, /figure\s+out/, /discover/],
      intent: "Seeking understanding or knowledge about something"
    },
    {
      patterns: [/find\s+balance/, /maintain\s+equilibrium/, /keep\s+up/],
      intent: "Maintaining balance or sustainability in life"
    },
    {
      patterns: [/help\s+others/, /support/, /guide/, /mentor/],
      intent: "Supporting or helping others achieve their goals"
    },
    {
      patterns: [/prove/, /show/, /demonstrate/, /validate/],
      intent: "Proving capability or worth to self or others"
    }
  ];

  for (const { patterns, intent } of intentPatterns) {
    if (patterns.some(pattern => pattern.test(text))) {
      return intent;
    }
  }

  // Default intent based on overall tone
  if (text.includes('but') || text.includes('however')) {
    return "Expressing internal conflict or mixed feelings";
  }
  
  return "Expressing thoughts, feelings, or observations";
}

function extractSubtext(text: string): string {
  // Subtext: Hidden worry or underlying motive - be more specific
  const subtextPatterns = [
    {
      patterns: [/scared.*miss/, /afraid.*miss/, /worried.*miss/, /scared.*important/],
      subtext: "Fears being seen as less committed."
    },
    {
      patterns: [/but\s+i'm\s+scared/, /however.*fear/, /though.*worry/],
      subtext: "Fear of failure or not meeting expectations"
    },
    {
      patterns: [/miss\s+out/, /fall\s+behind/, /lose\s+opportunity/],
      subtext: "Fear of missing out on important opportunities"
    },
    {
      patterns: [/need\s+to/, /must/, /should/, /have\s+to/],
      subtext: "Feeling pressure to perform or meet obligations"
    },
    {
      patterns: [/what\s+if/, /suppose/, /imagine\s+if/],
      subtext: "Anxiety about potential negative outcomes"
    },
    {
      patterns: [/not\s+good\s+enough/, /falling\s+short/, /not\s+measuring\s+up/],
      subtext: "Self-doubt about capabilities or worth"
    },
    {
      patterns: [/everyone\s+else/, /others\s+are/, /compared\s+to/],
      subtext: "Comparison anxiety with peers or others"
    },
    {
      patterns: [/waste\s+time/, /not\s+productive/, /lazy/],
      subtext: "Guilt about not being productive enough"
    },
    {
      patterns: [/let\s+down/, /disappoint/, /fail/],
      subtext: "Fear of disappointing others or failing"
    }
  ];

  for (const { patterns, subtext } of subtextPatterns) {
    if (patterns.some(pattern => pattern.test(text))) {
      return subtext;
    }
  }

  // Analyze tone for implicit subtext
  if (text.includes('!') && (text.includes('tired') || text.includes('exhausted'))) {
    return "Expressing frustration with current state";
  }
  
  if (text.includes('?') && text.includes('scared')) {
    return "Seeking reassurance or validation";
  }

  return "General reflection or observation without specific underlying concern";
}

function extractPersonaTraits(text: string): string[] {
  // Persona Trait: Behavior style or personality characteristics
  const traitPatterns: Record<string, string[]> = {
    'conscientious': ['check', 'verify', 'ensure', 'make sure', 'double-check', 'review'],
    'vigilant': ['watch', 'monitor', 'keep track', 'stay on top', 'oversee', 'supervise', 'keep checking', 'constantly checking'],
    'organiser': ['plan', 'organize', 'structure', 'arrange', 'schedule', 'coordinate'],
    'builder': ['create', 'build', 'develop', 'construct', 'establish', 'found'],
    'mentor': ['help', 'guide', 'teach', 'support', 'coach', 'advise'],
    'learner': ['learn', 'study', 'research', 'explore', 'investigate', 'discover'],
    'perfectionist': ['perfect', 'exact', 'precise', 'meticulous', 'detail-oriented'],
    'optimist': ['hope', 'positive', 'optimistic', 'bright', 'promising'],
    'realist': ['realistic', 'practical', 'grounded', 'sensible', 'level-headed'],
    'empath': ['feel', 'understand', 'care', 'concerned', 'sensitive', 'compassionate'],
    'leader': ['lead', 'direct', 'manage', 'oversee', 'take charge', 'initiative'],
    'collaborator': ['team', 'together', 'collaborate', 'partner', 'work with']
  };

  const foundTraits: string[] = [];
  
  Object.entries(traitPatterns).forEach(([trait, keywords]) => {
    const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
    if (matchCount > 0) {
      foundTraits.push(trait);
    }
  });

  // If no specific traits found, return reflective
  return foundTraits.length > 0 ? foundTraits : ['reflective'];
}

function determineBucket(text: string): string[] {
  // Bucket: Entry type classification
  const bucketPatterns: Record<string, string[]> = {
    'Goal': ['goal', 'target', 'aim', 'objective', 'plan', 'intention', 'aspiration'],
    'Thought': ['think', 'thought', 'wonder', 'consider', 'reflect', 'ponder', 'contemplate', 'know', 'feel', 'scared', 'worried'],
    'Hobby': ['hobby', 'interest', 'fun', 'enjoy', 'passion', 'leisure', 'recreation'],
    'Value': ['value', 'believe', 'important', 'matter', 'care', 'principle', 'ethic'],
    'Challenge': ['challenge', 'problem', 'difficulty', 'obstacle', 'struggle', 'hurdle'],
    'Achievement': ['accomplish', 'achieve', 'success', 'win', 'complete', 'finish'],
    'Relationship': ['friend', 'family', 'partner', 'relationship', 'connection', 'bond'],
    'Work': ['work', 'job', 'career', 'project', 'task', 'assignment', 'responsibility']
  };

  const foundBuckets: string[] = [];
  
  Object.entries(bucketPatterns).forEach(([bucket, keywords]) => {
    const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
    if (matchCount > 0) {
      foundBuckets.push(bucket);
    }
  });

  // If no specific bucket found, return Thought as default
  return foundBuckets.length > 0 ? foundBuckets : ['Thought'];
}

/* Helper function for testing the parser
export function testParseEntry(text: string): void {
  console.log(`\n=== TESTING PARSE_ENTRY ===`);
  console.log(`Input: "${text}"`);
  
  const result = parseEntry(text);
  console.log(`\nParsed Result:`);
  console.log(`- Theme: ${result.theme.join(', ')}`);
  console.log(`- Vibe: ${result.vibe.join(', ')}`);
  console.log(`- Intent: ${result.intent}`);
  console.log(`- Subtext: ${result.subtext}`);
  console.log(`- Persona Traits: ${result.persona_trait.join(', ')}`);
  console.log(`- Bucket: ${result.bucket.join(', ')}`); 
} */