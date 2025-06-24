import { Embedding } from "@/lib/types";

/**
 * STEP 2 - Embedding
 * Creates a number array that shows the important parts of the raw text
 * - Has to call python backend to use sentence-transformers package
 * 
 * 
 * 
 * @param rawText - Original Diary Entry Text
 * @returns Embedding object
 */
export async function extractEmbedding(rawText: string): Promise<Embedding> {
	// Call backend to use sentence-transformers
	const response = await fetch(`http://127.0.0.1:8000/embed?rawText=${rawText}`)

	if (response.ok){
		const data = await response.json()
		const embedding: Embedding = data.embedding
    console.log(`[EMBEDDING] input=<${rawText}> | output=<${embedding}> | NOTE: Embbeding array of raw text.`)
		return embedding
	} else {
		throw new Error(`Error attempting to embed raw text with status ${response.status}.`)
	}
}