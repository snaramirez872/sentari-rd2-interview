/**
 * Dynamic Cost Calculator for Sentari Pipeline
 * Calculates realistic token counts and processing units based on actual data
 */

// AI Service Pricing (per 1000 tokens)
const AI_PRICING = {
  GPT_3_5_TURBO: 0.002, // $0.002 per 1K tokens
  EMBEDDING: 0.0001,    // $0.0001 per 1K tokens
};

// Infrastructure costs (per operation)
const INFRASTRUCTURE_COSTS = {
  TEXT_VALIDATION: 0.0001,
  DATABASE_READ: 0.0002,
  DATABASE_WRITE: 0.0004,
  TEXT_ANALYSIS: 0.0003,
  PATTERN_MATCHING: 0.0010,
  SIMILARITY_CALC: 0.0004,
  DATA_UPDATE: 0.0006,
  RESPONSE_PACKAGE: 0.0001,
};

/**
 * Estimate tokens based on text length (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Calculate AI token cost based on actual token count
 */
export function calculateAITokenCost(tokens: number, model: 'gpt' | 'embedding' = 'gpt'): number {
  const pricePer1K = model === 'gpt' ? AI_PRICING.GPT_3_5_TURBO : AI_PRICING.EMBEDDING;
  return (tokens / 1000) * pricePer1K;
}

/**
 * Estimate processing units based on operation complexity and data size
 */
export function estimateProcessingUnits(operation: string, dataSize: number = 0): number {
  const baseUnits = {
    'text_validation': 5 + Math.ceil(dataSize / 10),
    'database_read': 15 + Math.ceil(dataSize / 5),
    'database_write': 20 + Math.ceil(dataSize / 5),
    'text_analysis': 10 + Math.ceil(dataSize / 8),
    'pattern_matching': 25 + Math.ceil(dataSize / 4),
    'similarity_calc': 20 + Math.ceil(dataSize / 3),
    'data_update': 15 + Math.ceil(dataSize / 6),
    'response_package': 5 + Math.ceil(dataSize / 20),
  };
  
  return baseUnits[operation as keyof typeof baseUnits] || 10;
}

/**
 * Calculate infrastructure cost based on operation type
 */
export function calculateInfrastructureCost(operation: string): number {
  return INFRASTRUCTURE_COSTS[operation as keyof typeof INFRASTRUCTURE_COSTS] || 0.0001;
}

/**
 * Calculate embedding tokens and cost
 */
export function calculateEmbeddingCost(text: string): { tokens: number; cost: number } {
  const tokens = estimateTokens(text);
  const cost = calculateAITokenCost(tokens, 'embedding');
  return { tokens, cost };
}

/**
 * Calculate GPT reply tokens and cost
 */
export function calculateGPTReplyCost(
  inputText: string, 
  parsedEntry: any, 
  responseText: string
): { tokens: number; cost: number } {
  // Build input context
  const inputContext = `${inputText} [vibe: ${parsedEntry.vibe.join(', ')}] [theme: ${parsedEntry.theme.join(', ')}]`;
  const inputTokens = estimateTokens(inputContext);
  const outputTokens = estimateTokens(responseText);
  const totalTokens = inputTokens + outputTokens;
  
  const cost = calculateAITokenCost(totalTokens, 'gpt');
  return { tokens: totalTokens, cost };
}

/**
 * Calculate processing units and cost for local operations
 */
export function calculateLocalOperationCost(
  operation: string, 
  dataSize: number = 0
): { processingUnits: number; cost: number } {
  const processingUnits = estimateProcessingUnits(operation, dataSize);
  const cost = calculateInfrastructureCost(operation);
  return { processingUnits, cost };
}

/**
 * Calculate database operation cost
 */
export function calculateDatabaseCost(
  operation: 'read' | 'write', 
  dataSize: number = 0
): { processingUnits: number; cost: number } {
  const opType = operation === 'read' ? 'database_read' : 'database_write';
  const processingUnits = estimateProcessingUnits(opType, dataSize);
  const cost = calculateInfrastructureCost(opType);
  return { processingUnits, cost };
}
