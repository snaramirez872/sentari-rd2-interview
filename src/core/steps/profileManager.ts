import { Profile } from "@/lib/types";

/**
 * Profile Manager - Handles profile loading and saving
 * For now, uses in-memory storage. In production, this would use a database
 */
class ProfileManager {
  private static instance: ProfileManager;
  private currentProfile: Profile | null = null;

  private constructor() {}

  static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager();
    }
    return ProfileManager.instance;
  }

  /**
   * Load or initialize user profile
   * @returns Current profile or new default profile
   */
  async loadProfile(): Promise<Profile> {
    if (this.currentProfile) {
      return this.currentProfile;
    }

    // Initialize default profile
    const defaultProfile: Profile = {
      top_themes: [],
      theme_count: {},
      dominant_vibe: "neutral",
      vibe_count: {},
      bucket_count: {},
      trait_pool: [],
      last_theme: []
    };

    this.currentProfile = defaultProfile;
    console.log(`[PROFILE_MANAGER] Created new default profile`);
    return defaultProfile;
  }

  /**
   * Save updated profile
   * @param profile - Updated profile to save
   */
  async saveProfile(profile: Profile): Promise<void> {
    this.currentProfile = profile;
    console.log(`[PROFILE_MANAGER] Profile updated and saved`);
  }

  /**
   * Get current profile
   * @returns Current profile or null if not loaded
   */
  getCurrentProfile(): Profile | null {
    return this.currentProfile;
  }
}

export const profileManager = ProfileManager.getInstance(); 