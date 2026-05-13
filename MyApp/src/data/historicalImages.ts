/**
 * ═══════════════════════════════════════════════════════════════════
 *  HOW TO ADD MORE PHOTOS — Historical Places
 * ═══════════════════════════════════════════════════════════════════
 *
 *  1. Drop your JPG / PNG file into the matching folder:
 *     assets/historical/1_maiden_tower/
 *     assets/historical/2_icheri_sheher/
 *     assets/historical/3_sheki_palace/
 *     assets/historical/4_gobustan/
 *     assets/historical/5_ateshgah/
 *     assets/historical/6_alinja_castle/
 *     assets/historical/7_momine_khatun/
 *     assets/historical/8_diri_baba/
 *     assets/historical/9_khizi_mountains/
 *     assets/historical/10_lavender_fields/
 *     assets/historical/11_st_george_church/
 *     assets/historical/12_gurgur_waterfall/
 *
 *  2. Add a require() line to its array below.
 *  3. Run:  npx expo start --clear
 * ═══════════════════════════════════════════════════════════════════
 */

// ── 1. Maiden Tower — 1 photo ────────────────────────────────────────────────
const MAIDEN_TOWER = [
  require('../../assets/historical/1_maiden_tower/p1.png'),
  require('../../assets/historical/1_maiden_tower/p2.png'),
  require('../../assets/historical/1_maiden_tower/p3.png'),
];

// ── 2. Icheri Sheher — 1 photo ───────────────────────────────────────────────
const ICHERI_SHEHER = [
  require('../../assets/historical/2_icheri_sheher/p1.png'),
  require('../../assets/historical/2_icheri_sheher/p2.png'),
  require('../../assets/historical/2_icheri_sheher/p3.png'),
];

// ── 3. Sheki Khan Palace — 3 photos ─────────────────────────────────────────
const SHEKI_PALACE = [
  require('../../assets/historical/3_sheki_palace/p1.png'),
  require('../../assets/historical/3_sheki_palace/p2.png'),
  require('../../assets/historical/3_sheki_palace/p3.png'),
];

// ── 4. Gobustan Rock Art — 1 photo ──────────────────────────────────────────
const GOBUSTAN = [
  require('../../assets/historical/4_gobustan/p1.png'),
  require('../../assets/historical/4_gobustan/p2.png'),
  require('../../assets/historical/4_gobustan/p3.png'),
];

// ── 5. Ateshgah Fire Temple — 1 photo ───────────────────────────────────────
const ATESHGAH = [
  require('../../assets/historical/5_ateshgah/p1.png'),
  require('../../assets/historical/5_ateshgah/p2.png'),
  require('../../assets/historical/5_ateshgah/p3.png'),
];

// ── 6. Alinja Castle — 1 photo ──────────────────────────────────────────────
const ALINJA = [
  require('../../assets/historical/6_alinja_castle/p1.png'),
  require('../../assets/historical/6_alinja_castle/p2.png'),
  require('../../assets/historical/6_alinja_castle/p3.png'),
];

// ── 7. Momine Khatun Mausoleum — 1 photo ────────────────────────────────────
const MOMINE = [
  require('../../assets/historical/7_momine_khatun/p1.png'),
  require('../../assets/historical/7_momine_khatun/p2.png'),
  require('../../assets/historical/7_momine_khatun/p3.png'),
];

// ── 8. Diri Baba Mausoleum — 1 photo ────────────────────────────────────────
const DIRI_BABA = [
  require('../../assets/historical/8_diri_baba/p1.png'),
  require('../../assets/historical/8_diri_baba/p2.png'),
  require('../../assets/historical/8_diri_baba/p3.png'),
];

// ── 9. Khizi Mountains — 1 photo ────────────────────────────────────────────
const KHIZI = [
  require('../../assets/historical/9_khizi_mountains/p1.png'),
  require('../../assets/historical/9_khizi_mountains/p2.png'),
  require('../../assets/historical/9_khizi_mountains/p3.png'),
];

// ── 10. Lavender Fields — 3 photos ──────────────────────────────────────────
const LAVENDER = [
  require('../../assets/historical/10_lavender_fields/p1.png'),
  require('../../assets/historical/10_lavender_fields/p2.png'),
  require('../../assets/historical/10_lavender_fields/p3.png'),
];

// ── 11. St. George's Church — no photos yet ─────────────────────────────────
const ST_GEORGE = [
  require('../../assets/historical/11_st_george_church/p1.png'),
  require('../../assets/historical/11_st_george_church/p2.png'),
  require('../../assets/historical/11_st_george_church/p3.png'),
];

// ── 12. Gurgur Waterfall — 3 photos ─────────────────────────────────────────
const GURGUR = [
  require('../../assets/historical/12_gurgur_waterfall/p1.png'),
  require('../../assets/historical/12_gurgur_waterfall/p2.png'),
  require('../../assets/historical/12_gurgur_waterfall/p3.png'),
];

// ── Registry ─────────────────────────────────────────────────────────────────
const HISTORICAL_PHOTOS: Record<string, any[]> = {
  '1':  MAIDEN_TOWER,
  '2':  ICHERI_SHEHER,
  '3':  SHEKI_PALACE,
  '4':  GOBUSTAN,
  '5':  ATESHGAH,
  '6':  ALINJA,
  '7':  MOMINE,
  '8':  DIRI_BABA,
  '9':  KHIZI,
  '10': LAVENDER,
  '11': ST_GEORGE,
  '12': GURGUR,
};

const PLACEHOLDER = require('../../assets/places/placeholder.png');

/** Returns photos for a historical place, or 3× placeholder if none uploaded. */
export function getHistoricalPhotos(id: string): any[] {
  return HISTORICAL_PHOTOS[id] ?? [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];
}

/** True when real photos are available for this place (not just placeholders). */
export function hasRealPhoto(id: string): boolean {
  return id in HISTORICAL_PHOTOS;
}
