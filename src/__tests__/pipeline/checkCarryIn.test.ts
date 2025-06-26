// Tests provided by Christina
import { checkCarryIn } from "../../core/steps/carryIn";
import { cosineSimilarity } from "../../core/steps/embedding";
import { 
    baseParsedEntry, 
    baseEmbedding, 
    recentEntry, 
    noThemeOrVibeOverlap, 
    noMatchEntry } from "../../lib/mockData";

jest.mock("../../core/steps/embedding", () => ({
    cosineSimilarity: jest.fn(() => 0.5), // Default mock value for tests
}));

export const mockCosineSimilarity = cosineSimilarity as jest.Mock;

describe("checkCarryIn", () => {
    it("returns true when theme overlaps", () => {
        const result = checkCarryIn(baseParsedEntry, baseEmbedding, [recentEntry]);
        expect(result).toBe(true);
    });

    it('returns true when cosine similarity > 0.86', () => {
        mockCosineSimilarity.mockReturnValue(0.95);
        const result = checkCarryIn(baseParsedEntry, baseEmbedding, [noThemeOrVibeOverlap]);
        expect(result).toBe(true);
    });

    it('returns false when no overlap or similarity', () => {
        mockCosineSimilarity.mockReturnValue(0.5);
        const result = checkCarryIn(baseParsedEntry, baseEmbedding, [noMatchEntry]);
        expect(result).toBe(false);
    });

    it('returns false when no recent entries', () => {
        const result = checkCarryIn(baseParsedEntry, baseEmbedding, []);
        expect(result).toBe(false);
    });
});
