import { MetaData } from "@/lib/types";

/**
 * STEP 5 - META_EXTRACT
 * Extracts metadata from raw text which includes
 * - Top 5 Frequent Words (Excluding short and common words such as "the", "and", "with", etc.)
 * - Total Word Count
 * - Punctuation Flags: ?, !, ...
 * 
 * @param rawText - Original Diary Entry Text
 * @returns MetaData object
 */
export function extractMetaData(rawText: string): MetaData {
    // The short and common words that are excluded
    const shortWords = ["and", "are", "but", "for", "that", "the", "this", "with", "you"];
    
    const loweredRawText = rawText.toLowerCase();

    const words = loweredRawText
        .replace(/[^\w\s]/g, "") // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 2 && !shortWords.includes(word));

    // Counting the words
    const wordCounts: Record<string, number> = {};
    
    for (const word of words)
        wordCounts[word] = (wordCounts[word] || 0) + 1;

    // Finding the Top 5 Words
    const topWords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1]) // Sorts in descending order
        .slice(0, 5)
        .map(([word]) => word); // Keeps only the word parts of the [word, count] arrays from wordCounts
    
    // Processing the punctuations
    const punctuationFlags: string[] =[];

    if (loweredRawText.includes("!")) punctuationFlags.push("has_exclamation");
    if (loweredRawText.includes("?")) punctuationFlags.push("has_question");
    if (loweredRawText.includes("...") || /um+|uh+|you know/.test(loweredRawText)) punctuationFlags.push("has_hesitation");

    // After going through the previous 3 branches and no changes (nothing is pushed)
    if (punctuationFlags.length === 0) punctuationFlags.push("none");

    const metadata: MetaData = {
        topWords,
        wordCount: loweredRawText.trim().split(/|s+/).length,
        punctuationFlags
    };

    console.log(`[META_EXTRACT] input=<${rawText}> | output=<${JSON.stringify(metadata)}> | NOTE: Extracted Word Stats and Punctuation.`)

    return metadata;
}
