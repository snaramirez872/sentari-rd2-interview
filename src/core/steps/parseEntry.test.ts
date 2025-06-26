import { parseEntry } from './parseEntry';

describe('parseEntry', () => {
  it('should extract correct fields for a work-related, stressed entry', () => {
    const text = 'I had a really stressful day at work today. My boss was being unreasonable and I feel overwhelmed with all the deadlines.';
    const result = parseEntry(text);
    expect(result.theme).toContain('work-life balance');
    expect(result.vibe).toContain('overwhelmed');
    expect(result.intent).toBeDefined();
    expect(result.subtext).toBeDefined();
    expect(result.persona_trait.length).toBeGreaterThan(0);
    expect(result.bucket.length).toBeGreaterThan(0);
  });

  it('should return general theme and neutral vibe for generic input', () => {
    const text = 'Hello, this is a test entry with no strong emotion or topic.';
    const result = parseEntry(text);
    expect(result.theme).toContain('general');
    expect(result.vibe).toContain('neutral');
  });

  it('should handle happy, excited input', () => {
    const text = 'I am so excited and thrilled about my new project!';
    const result = parseEntry(text);
    expect(result.vibe).toContain('excited');
    expect(result.theme.length).toBeGreaterThan(0);
  });

  it('should handle empty input gracefully', () => {
    const text = '';
    const result = parseEntry(text);
    expect(result.theme).toContain('general');
    expect(result.vibe).toContain('neutral');
  });
}); 