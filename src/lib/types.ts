// Raw input
export type Raw = string;

// Embedding
export type Embedding = number[];

// Profile + Parsed Structure + MetaData
export type Profile = {
    top_themes: string[];
    theme_count: Record<string, number>;
    dominant_vibe: string;
    vibe_count: Record<string, number>;
    bucket_count: Record<string, number>;
    trait_pool: string[];
    last_theme: string[];
};

export type ParsedEntry = {
    theme: string[];
    vibe: string[];
    intent: string;
    subtext: string;
    persona_trait: string[];
    bucket: string[];
};

export type MetaData = {
    topWords: string[];
    wordCount: number;
    punctuationFlags: string[];
};

// Full info for Storage
export type FullEntries = {
    id: string;
    raw_text: string;
    parsed: ParsedEntry;
    meta: MetaData;
    embedding: Embedding;
    timestamp: string;
    carryIn: boolean;
};

// Response
export type PublishedResponse = {
    entryId: string;
    response_text: string;
    carry_in: boolean;
};

// Transcript from transcribe.py
export type TranscriptResponse = {
    transcript: string;
};
