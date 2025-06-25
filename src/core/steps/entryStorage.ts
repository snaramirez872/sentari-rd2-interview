import { FullEntries, ParsedEntry, MetaData, Embedding } from "@/lib/types";

/**
 * Entry Storage - Handles saving and loading entries
 * For now, uses in-memory storage. In production, this would use a database
 */
class EntryStorage {
  private static instance: EntryStorage;
  private entries: Map<string, FullEntries> = new Map();

  private constructor() {}

  static getInstance(): EntryStorage {
    if (!EntryStorage.instance) {
      EntryStorage.instance = new EntryStorage();
    }
    return EntryStorage.instance;
  }

  /**
   * Save a complete entry
   * @param rawText - Original transcript text
   * @param parsedEntry - Parsed analysis of the entry
   * @param metaData - Extracted metadata
   * @param embedding - Vector embedding of the text
   * @returns Saved entry with ID and timestamp
   */
  async saveEntry(
    rawText: string,
    parsedEntry: ParsedEntry,
    metaData: MetaData,
    embedding: Embedding
  ): Promise<FullEntries> {
    console.log(`[ENTRY_STORAGE] input=<${rawText.substring(0, 50)}...> | parsed=<${JSON.stringify(parsedEntry)}>`);

    // Generate unique ID (timestamp + random suffix)
    const timestamp = new Date().toISOString();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const entryId = `${Date.now()}-${randomSuffix}`;

    // Create full entry object
    const fullEntry: FullEntries = {
      id: entryId,
      raw_text: rawText,
      parsed: parsedEntry,
      meta: metaData,
      embedding: embedding,
      timestamp: timestamp
    };

    // Store in memory
    this.entries.set(entryId, fullEntry);

    console.log(`[ENTRY_STORAGE] output=<${entryId}> | NOTE: Saved complete entry object.`);
    
    return fullEntry;
  }

  /**
   * Load all saved entries
   * @returns Array of all entries
   */
  async loadAllEntries(): Promise<FullEntries[]> {
    return Array.from(this.entries.values());
  }

  /**
   * Load recent entries (last N entries)
   * @param count - Number of recent entries to load
   * @returns Array of recent entries
   */
  async loadRecentEntries(count: number = 5): Promise<FullEntries[]> {
    const allEntries = await this.loadAllEntries();
    return allEntries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, count);
  }

  /**
   * Load a specific entry by ID
   * @param entryId - ID of the entry to load
   * @returns Entry or null if not found
   */
  async loadEntryById(entryId: string): Promise<FullEntries | null> {
    return this.entries.get(entryId) || null;
  }

  /**
   * Get total number of entries
   * @returns Number of stored entries
   */
  getEntryCount(): number {
    return this.entries.size;
  }
}

export const entryStorage = EntryStorage.getInstance(); 