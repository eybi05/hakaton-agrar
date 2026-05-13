/**
 * ═══════════════════════════════════════════════════════════════════
 *  HOW TO ADD AUDIO GUIDES — Historical Places
 * ═══════════════════════════════════════════════════════════════════
 *
 *  1. Record or obtain an MP3 audio guide (ideally 1–3 minutes).
 *
 *  2. Name the file exactly:
 *       1_maiden_tower.mp3
 *       2_icheri_sheher.mp3
 *       3_sheki_palace.mp3
 *       4_gobustan.mp3
 *       5_ateshgah.mp3
 *       6_alinja_castle.mp3
 *       7_momine_khatun.mp3
 *       8_diri_baba.mp3
 *       9_khizi_mountains.mp3
 *       10_lavender_fields.mp3
 *       11_st_george_church.mp3
 *       12_gurgur_waterfall.mp3
 *
 *  3. Drop the file into:
 *       assets/sounds/historical/
 *
 *  4. Uncomment the matching line in AUDIO_REGISTRY below.
 *
 *  5. Run:  npx expo start --clear
 *
 *  SUPPORTED FORMATS: MP3, AAC, WAV, OGG
 * ═══════════════════════════════════════════════════════════════════
 */

// Uncomment each line as you add the real audio file:
const AUDIO_REGISTRY: Record<string, any> = {
  // '1':  require('../../assets/sounds/historical/1_maiden_tower.mp3'),
  // '2':  require('../../assets/sounds/historical/2_icheri_sheher.mp3'),
  // '3':  require('../../assets/sounds/historical/3_sheki_palace.mp3'),
  // '4':  require('../../assets/sounds/historical/4_gobustan.mp3'),
  // '5':  require('../../assets/sounds/historical/5_ateshgah.mp3'),
  // '6':  require('../../assets/sounds/historical/6_alinja_castle.mp3'),
  // '7':  require('../../assets/sounds/historical/7_momine_khatun.mp3'),
  // '8':  require('../../assets/sounds/historical/8_diri_baba.mp3'),
  // '9':  require('../../assets/sounds/historical/9_khizi_mountains.mp3'),
  // '10': require('../../assets/sounds/historical/10_lavender_fields.mp3'),
  // '11': require('../../assets/sounds/historical/11_st_george_church.mp3'),
  // '12': require('../../assets/sounds/historical/12_gurgur_waterfall.mp3'),
};

/** Returns the audio source for a place, or null if not yet uploaded. */
export function getAudio(id: string): any | null {
  return AUDIO_REGISTRY[id] ?? null;
}

/** True when a real audio file is registered for this place. */
export function hasAudio(id: string): boolean {
  return id in AUDIO_REGISTRY;
}
