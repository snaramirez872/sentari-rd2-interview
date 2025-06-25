import { Embedding } from "@/lib/types";

/**
 * STEP 2 - Embedding
 * Creates a number array that shows the important parts of the raw text
 * - Uses mock implementation for task demonstration
 * - In production, would call python backend to use sentence-transformers package
 * 
 * @param rawText - Original Diary Entry Text
 * @returns Embedding object
 */
export async function extractEmbedding(rawText: string): Promise<Embedding> {
	// Mock implementation for task demonstration
	// In production, this would call the Python backend
	const mockEmbedding: Embedding = new Array(384).fill(0).map(() => Math.random() * 2 - 1); // Random 384-dim vector
	
	console.log(`[EMBEDDING] input=<${rawText.substring(0, 50)}...> | output=<${mockEmbedding.length} dimensions> | NOTE: Mock embedding for demonstration.`);
	return mockEmbedding;
}

/**
 * Utility: Cosine Similarity between two vectors
 * @param a - First embedding
 * @param b - Second embedding
 * @returns Cosine similarity value between -1 and 1
 */
export function cosineSimilarity(a: number[], b: number[]): number {
	if (a.length !== b.length) throw new Error('Embeddings must be same length');
	let dot = 0, normA = 0, normB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}