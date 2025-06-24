export interface Entry {
  id: string;
  rawText: string;
  timestamp: number;
}

export interface Profile {
  dominant_vibe: string;
  theme_count: Record<string, number>;
}

class InMemoryStore {
  private entries  = new Map<string, Entry[]>();
  private profiles = new Map<string, Profile>();

  getLastEntries(userId: string, k = 5): Entry[] {
    return (this.entries.get(userId) ?? []).slice(-k).reverse();
  }

  getProfile(userId: string): Profile {
    if (!this.profiles.has(userId)) {
      this.profiles.set(userId, {
        dominant_vibe: "neutral",
        theme_count: {},
      });
    }
    return this.profiles.get(userId)!;
  }

  saveEntry(userId: string, e: Entry): string {
    const list = this.entries.get(userId) ?? [];
    list.push(e);
    this.entries.set(userId, list);
    return e.id;
  }
}

export const store = new InMemoryStore();
