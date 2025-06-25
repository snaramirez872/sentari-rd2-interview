import { Profile, ParsedEntry } from "@/lib/types";

/**
 * STEP 9 - PROFILE_UPDATE
 * Mutates profile fields based on new entry analysis
 * Updates themes, vibes, traits, and bucket counts
 * 
 * @param currentProfile - Current user profile
 * @param parsedEntry - Parsed analysis of new entry
 * @param carryIn - Whether the entry is a carry-in
 * @param emotionalFlip - Whether the entry is an emotional flip
 * @returns Updated Profile object
 */
export function updateProfile(currentProfile: Profile, parsedEntry: ParsedEntry, carryIn: boolean, emotionalFlip: boolean): Profile {
  console.log(`[PROFILE_UPDATE] input=<${JSON.stringify(currentProfile)}> | new_entry=<${JSON.stringify(parsedEntry)}>`);

  // Create a copy of current profile to mutate
  const updatedProfile: Profile = { ...currentProfile };

  // Update themes
  parsedEntry.theme.forEach(theme => {
    if (!updatedProfile.top_themes.includes(theme)) {
      updatedProfile.top_themes.push(theme);
    }
    updatedProfile.theme_count[theme] = (updatedProfile.theme_count[theme] || 0) + 1;
  });

  // Update vibes
  parsedEntry.vibe.forEach(vibe => {
    updatedProfile.vibe_count[vibe] = (updatedProfile.vibe_count[vibe] || 0) + 1;
  });

  // Update dominant vibe (most frequent)
  const dominantVibe = Object.entries(updatedProfile.vibe_count)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
  updatedProfile.dominant_vibe = dominantVibe;

  // Update buckets
  parsedEntry.bucket.forEach(bucket => {
    updatedProfile.bucket_count[bucket] = (updatedProfile.bucket_count[bucket] || 0) + 1;
  });

  // Update trait pool
  parsedEntry.persona_trait.forEach(trait => {
    if (!updatedProfile.trait_pool.includes(trait)) {
      updatedProfile.trait_pool.push(trait);
    }
  });

  // Update last theme
  updatedProfile.last_theme = [...parsedEntry.theme];

  console.log(`[PROFILE_UPDATE] output=<${JSON.stringify(updatedProfile)}> | NOTE: Updated profile with new entry data.`);
  
  return updatedProfile;
} 