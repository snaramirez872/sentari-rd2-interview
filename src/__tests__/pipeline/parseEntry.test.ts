// Tests provided by Amarnath
import { parseEntry } from '../../core/steps/parseEntry';
import { mockEntryTexts } from '../../lib/mockData';

describe('parseEntry', () => {
  it('should extract correct fields for a work-related, stressed entry', () => {
    const result = parseEntry(mockEntryTexts.one);
    expect(result.theme).toContain('work-life balance');
    expect(result.vibe).toContain('overwhelmed');
    expect(result.intent).toBeDefined();
    expect(result.subtext).toBeDefined();
    expect(result.persona_trait.length).toBeGreaterThan(0);
    expect(result.bucket.length).toBeGreaterThan(0);
  });

  it('should return general theme and neutral vibe for generic input', () => {
    const result = parseEntry(mockEntryTexts.two);
    expect(result.theme).toContain('general');
    expect(result.vibe).toContain('neutral');
  });

  it('should handle happy, excited input', () => {
    const result = parseEntry(mockEntryTexts.three);
    expect(result.vibe).toContain('excited');
    expect(result.theme.length).toBeGreaterThan(0);
  });

  it('should handle empty input gracefully', () => {
    const result = parseEntry(mockEntryTexts.four);
    expect(result.theme).toContain('general');
    expect(result.vibe).toContain('neutral');
  });
}); 