/**
 * Audio guide registry for historical places.
 *
 * HOW TO ADD MORE AUDIO:
 *  1. Put the file in:  assets/sounds/historical/
 *     Naming convention:  {id}_{slug}_{lang}.mp3
 *     e.g.  2_icheri_sheher_en.mp3  /  2_icheri_sheher_ru.mp3
 *
 *  2. Add a new entry in AUDIO_REGISTRY below.
 *
 *  3. Run:  npx expo start --clear
 *
 * Currently only place '1' (Maiden Tower) has EN + RU audio.
 * All other places can be added the same way.
 */

export type AudioLang = 'en' | 'ru';

type PlaceAudio = {
  en?: any;   // require() result for English MP3
  ru?: any;   // require() result for Russian MP3
};

// ── Registry ─────────────────────────────────────────────────────────────────
// Only id '1' is active — add others as files are uploaded.
const AUDIO_REGISTRY: Record<string, PlaceAudio> = {
  '1': {
    en: require('../../assets/sounds/historical/1_maiden_tower_en.mp3'),
    ru: require('../../assets/sounds/historical/1_maiden_tower_ru.mp3'),
  },

  // Uncomment and fill in as you add files:
  // '2':  { en: require('...2_icheri_sheher_en.mp3'), ru: require('...2_icheri_sheher_ru.mp3') },
  // '3':  { en: require('...3_sheki_palace_en.mp3'),  ru: require('...3_sheki_palace_ru.mp3')  },
  // '4':  { en: require('...4_gobustan_en.mp3'),       ru: require('...4_gobustan_ru.mp3')       },
  // '5':  { en: require('...5_ateshgah_en.mp3'),       ru: require('...5_ateshgah_ru.mp3')       },
  // '6':  { en: require('...6_alinja_castle_en.mp3'),  ru: require('...6_alinja_castle_ru.mp3')  },
  // '7':  { en: require('...7_momine_khatun_en.mp3'),  ru: require('...7_momine_khatun_ru.mp3')  },
  // '8':  { en: require('...8_diri_baba_en.mp3'),      ru: require('...8_diri_baba_ru.mp3')      },
  // '9':  { en: require('...9_khizi_mountains_en.mp3'),ru: require('...9_khizi_mountains_ru.mp3') },
  // '10': { en: require('...10_lavender_fields_en.mp3'),ru: require('...10_lavender_fields_ru.mp3') },
  // '11': { en: require('...11_st_george_church_en.mp3'), ru: require('...11_st_george_church_ru.mp3') },
  // '12': { en: require('...12_gurgur_waterfall_en.mp3'),  ru: require('...12_gurgur_waterfall_ru.mp3')  },
};

/** Returns the audio source for a specific place + language, or null. */
export function getAudioForLang(id: string, lang: AudioLang): any | null {
  return AUDIO_REGISTRY[id]?.[lang] ?? null;
}

/** True when a place has at least one language of audio available. */
export function hasAnyAudio(id: string): boolean {
  const entry = AUDIO_REGISTRY[id];
  return !!(entry?.en || entry?.ru);
}

/** Returns the list of languages available for a place. */
export function getAvailableLangs(id: string): AudioLang[] {
  const entry = AUDIO_REGISTRY[id];
  if (!entry) return [];
  const langs: AudioLang[] = [];
  if (entry.en) langs.push('en');
  if (entry.ru) langs.push('ru');
  return langs;
}

// Legacy single-audio helpers — kept for backward compatibility
export const getAudio  = (id: string) => getAudioForLang(id, 'en');
export const hasAudio  = (id: string) => hasAnyAudio(id);
