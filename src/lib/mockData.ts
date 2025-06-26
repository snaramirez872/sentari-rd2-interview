import { ParsedEntry, Embedding, FullEntries } from "./types";

// The following is mock data used in our testing suite

// Mock Data for Raw Text Input Unit Tests Provided by Sean
export const mockTranscripts = {
    one: "I keep checking Slack even when I'm exhausted. I know I need rest, but I'm scared I'll miss something important.",
    two: "   I've been tired recently.   ",
    three: "\nI really need to get this done\n"
};

// Mock Data for Check Carry In Unit Tests Provided by Christina
export const baseParsedEntry: ParsedEntry = {
    theme: ["reflection"],
    vibe: ["calm"],
    intent: "note",
    subtext: "thoughts",
    persona_trait: ["introspective"],
    bucket: ["daily"],
};

export const baseEmbedding: Embedding = [0.2, 0.2, 0.3];

export const recentEntry: FullEntries = {
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

export const noThemeOrVibeOverlap: FullEntries = {
    ...recentEntry,
    parsed: { ...recentEntry.parsed, theme: [], vibe: [] },
};

export const noMatchEntry: FullEntries = {
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

// Mock Data for Parse Entry Unit Tests Provided by Amarnath
export const mockEntryTexts = {
    one: "I had a really stressful day at work today. My boss was being unreasonable and I feel overwhelmed with all the deadlines.",
    two: "Hello, this is a test entry with no strong emotion or topic.",
    three: "I am so excited and thrilled about my new project!",
    four: ''
};
