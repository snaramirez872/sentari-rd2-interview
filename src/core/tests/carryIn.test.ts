import { checkCarryIn } from "../../core/steps/carryIn";
import { ParsedEntry, Embedding, FullEntries } from "../../lib/types";
import { cosineSimilarity } from "../../core/steps/embedding";

// Mock cosineSimilarity
jest.mock("../../core/steps/embedding", () => ({
  cosineSimilarity: jest.fn(() => 0.5), // Default mock value for tests
}));

const mockCosineSimilarity = cosineSimilarity as jest.Mock;

describe("checkCarryIn", () => {
  const baseParsedEntry: ParsedEntry = {
    theme: ["reflection"],
    vibe: ["calm"],
    intent: "note",
    subtext: "thoughts",
    persona_trait: ["introspective"],
    bucket: ["daily"],
  };

  const baseEmbedding: Embedding = [0.1, 0.2, 0.3];

  const recentEntry: FullEntries = {
    id: "entry-1",
    raw_text: "some text",
    parsed: {
      theme: ["reflection"],
      vibe: ["curious"],
      intent: "note",
      subtext: "some thought",
      persona_trait: ["thoughtful"],
      bucket: ["daily"],
    },
    meta: {
      topWords: ["some", "text"],
      wordCount: 10,
      punctuationFlags: ["!"],
    },
    embedding: [0.1, 0.2, 0.3],
    timestamp: new Date().toISOString(),
    carryIn: false,
  };

  it("returns true when theme overlaps", () => {
    const result = checkCarryIn(baseParsedEntry, baseEmbedding, [recentEntry]);
    expect(result).toBe(true);
  });

  it("returns true when cosine similarity > 0.86", () => {
    mockCosineSimilarity.mockReturnValue(0.95);

    const noThemeOrVibeOverlap: FullEntries = {
      ...recentEntry,
      parsed: { ...recentEntry.parsed, theme: [], vibe: [] },
    };

    const result = checkCarryIn(baseParsedEntry, baseEmbedding, [
      noThemeOrVibeOverlap,
    ]);
    expect(result).toBe(true);
  });

  it("returns false when no overlap or similarity", () => {
    mockCosineSimilarity.mockReturnValue(0.5);

    const noMatchEntry: FullEntries = {
      ...recentEntry,
      parsed: {
        theme: [],
        vibe: [],
        intent: "",
        subtext: "",
        persona_trait: [],
        bucket: [],
      },
    };

    const result = checkCarryIn(baseParsedEntry, baseEmbedding, [noMatchEntry]);
    expect(result).toBe(false);
  });

  it("returns false with no recent entries", () => {
    const result = checkCarryIn(baseParsedEntry, baseEmbedding, []);
    expect(result).toBe(false);
  });
});
