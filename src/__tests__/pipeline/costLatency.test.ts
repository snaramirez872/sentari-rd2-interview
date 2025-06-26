// Tests Provided by Amarnath
import { logCostLatency, createStepCost, StepCost } from '../../core/steps/costLatencyLog';

describe('logCostLatency', () => {
  it('should calculate totals correctly for a typical pipeline', () => {
    const steps: StepCost[] = [
      createStepCost('EMBEDDING', 50, 0.002, 100, 'Embedding step', 'ai'),
      createStepCost('PARSE_ENTRY', 10, 0, 1, 'Parse entry', 'local'),
      createStepCost('PROFILE_UPDATE', 5, 0, 1, 'Profile update', 'local'),
      createStepCost('GPT_REPLY', 100, 0.01, 50, 'Generate reply', 'ai'),
    ];
    const totalLatency = 165;
    const metrics = logCostLatency(steps, totalLatency);
    expect(metrics.totalLatency).toBe(totalLatency);
    expect(metrics.totalCost).toBeCloseTo(0.012);
    expect(metrics.totalAITokens).toBe(150);
    expect(metrics.totalProcessingUnits).toBe(2);
    expect(metrics.stepBreakdown.length).toBe(4);
  });

  it('should handle empty stepCosts array', () => {
    const metrics = logCostLatency([], 0);
    expect(metrics.totalLatency).toBe(0);
    expect(metrics.totalCost).toBe(0);
    expect(metrics.totalAITokens).toBe(0);
    expect(metrics.totalProcessingUnits).toBe(0);
    expect(metrics.stepBreakdown.length).toBe(0);
  });

  it('should handle only local steps', () => {
    const steps: StepCost[] = [
      createStepCost('PARSE_ENTRY', 10, 0, 1, 'Parse entry', 'local'),
      createStepCost('PROFILE_UPDATE', 5, 0, 1, 'Profile update', 'local'),
    ];
    const metrics = logCostLatency(steps, 15);
    expect(metrics.totalCost).toBe(0);
    expect(metrics.totalAITokens).toBe(0);
    expect(metrics.totalProcessingUnits).toBe(2);
  });
}); 