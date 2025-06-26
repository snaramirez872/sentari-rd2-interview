import { ParsedEntry, MetaData, Profile, FullEntries, PublishedResponse } from "../../lib/types";

export interface StepCost {
  step: string;
  latency: number;
  cost: number;
  tokens?: number; // Only for AI operations
  processingUnits?: number; // For local rule-based operations
  description: string;
  type: 'ai' | 'local' | 'database';
}

export interface PipelineMetrics {
  totalLatency: number;
  totalCost: number;
  totalAITokens: number;
  totalProcessingUnits: number;
  stepBreakdown: StepCost[];
}

export function logCostLatency(
  stepCosts: StepCost[],
  totalLatency: number
): PipelineMetrics {
  const totalCost = stepCosts.reduce((sum, step) => sum + step.cost, 0);
  const totalAITokens = stepCosts.reduce((sum, step) => sum + (step.tokens || 0), 0);
  const totalProcessingUnits = stepCosts.reduce((sum, step) => sum + (step.processingUnits || 0), 0);

  const metrics: PipelineMetrics = {
    totalLatency,
    totalCost,
    totalAITokens,
    totalProcessingUnits,
    stepBreakdown: stepCosts
  };

  // Log the complete breakdown
  console.log("\n[COST_LATENCY_LOG] ===== PIPELINE METRICS =====");
  console.log(`Total Latency: ${totalLatency}ms`);
  console.log(`Total Cost: $${totalCost.toFixed(4)}`);
  console.log(`AI Tokens: ${totalAITokens} (only AI operations)`);
  console.log(`Processing Units: ${totalProcessingUnits} (local operations)`);
  console.log("\nStep-by-Step Breakdown:");
  
  stepCosts.forEach(step => {
    if (step.type === 'ai') {
      console.log(`  ${step.step}: ${step.latency}ms | $${step.cost.toFixed(4)} | ${step.tokens} AI tokens | ${step.description}`);
    } else if (step.type === 'local') {
      console.log(`  ${step.step}: ${step.latency}ms | $${step.cost.toFixed(4)} | ${step.processingUnits} processing units | ${step.description} (local)`);
    } else {
      console.log(`  ${step.step}: ${step.latency}ms | $${step.cost.toFixed(4)} | ${step.processingUnits} processing units | ${step.description} (database)`);
    }
  });
  
  console.log(`\n[COST_LATENCY_LOG] input=<> | output=<latency: ${totalLatency}ms, cost: $${totalCost.toFixed(4)}, ai_tokens: ${totalAITokens}, processing_units: ${totalProcessingUnits}> | note=<Complete cost and latency breakdown>`);

  return metrics;
}

// Helper function to create step cost entries
export function createStepCost(
  step: string,
  latency: number,
  cost: number,
  tokensOrUnits: number,
  description: string,
  type: 'ai' | 'local' | 'database'
): StepCost {
  if (type === 'ai') {
    return {
      step,
      latency,
      cost,
      tokens: tokensOrUnits,
      description,
      type
    };
  } else {
    return {
      step,
      latency,
      cost,
      processingUnits: tokensOrUnits,
      description,
      type
    };
  }
} 