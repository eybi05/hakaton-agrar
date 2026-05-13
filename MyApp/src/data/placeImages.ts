/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOW TO ADD YOUR OWN PHOTOS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  1. Drop your photos (JPG or PNG) into the matching subfolder:
 *
 *     assets/places/f1_green_valley/     ← Green Valley Farm
 *     assets/places/f2_sunrise_orchard/  ← Sunrise Orchard
 *     assets/places/f3_pomegranate/      ← Pomegranate Estate
 *     assets/places/f4_hazelnut/         ← Hazelnut Hills
 *     assets/places/h1_horse_ranch/      ← Sunrise Horse Ranch
 *     assets/places/h2_karabakh/         ← Karabakh Stud Farm
 *     assets/places/c1_mountain_camp/    ← Mountain Camp Site
 *     assets/places/c2_riverside_camp/   ← Riverside Wild Camp
 *     assets/places/p1_maiden_tower/     ← Maiden Tower
 *     assets/places/p2_khan_palace/      ← Sheki Khan Palace
 *     assets/places/p3_gobustan/         ← Gobustan Rock Art
 *     assets/places/p4_ateshgah/         ← Ateshgah Fire Temple
 *
 *  2. Uncomment the matching line below and add your filenames.
 *
 *  3. Restart Expo ( npx expo start --clear ).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Placeholder shown when no real photos are uploaded yet
const PLACEHOLDER = require('../../assets/places/placeholder.png');

// ── Uncomment and edit as you add photos ────────────────────────────────────

// const F1 = [
//   require('../../assets/places/f1_green_valley/photo1.jpg'),
//   require('../../assets/places/f1_green_valley/photo2.jpg'),
// ];

// const F2 = [
//   require('../../assets/places/f2_sunrise_orchard/photo1.jpg'),
// ];

// const F3 = [
//   require('../../assets/places/f3_pomegranate/photo1.jpg'),
// ];

// const F4 = [
//   require('../../assets/places/f4_hazelnut/photo1.jpg'),
// ];

// const H1 = [
//   require('../../assets/places/h1_horse_ranch/photo1.jpg'),
// ];

// const H2 = [
//   require('../../assets/places/h2_karabakh/photo1.jpg'),
// ];

// const C1 = [
//   require('../../assets/places/c1_mountain_camp/photo1.jpg'),
// ];

// const C2 = [
//   require('../../assets/places/c2_riverside_camp/photo1.jpg'),
// ];

// const P1 = [
//   require('../../assets/places/p1_maiden_tower/photo1.jpg'),
// ];

// const P2 = [
//   require('../../assets/places/p2_khan_palace/photo1.jpg'),
// ];

// const P3 = [
//   require('../../assets/places/p3_gobustan/photo1.jpg'),
// ];

// const P4 = [
//   require('../../assets/places/p4_ateshgah/photo1.jpg'),
// ];

// ── Registry: map place ID → photo array ────────────────────────────────────
const REGISTRY: Record<string, any[]> = {
  // Replace PLACEHOLDER with your variable once you add photos:
  // f1: F1,
  // f2: F2,
  // f3: F3,
  // f4: F4,
  // h1: H1,
  // h2: H2,
  // c1: C1,
  // c2: C2,
  // p1: P1,
  // p2: P2,
  // p3: P3,
  // p4: P4,
};

/**
 * Returns the photo array for a place.
 * Falls back to 3× placeholder when no photos are uploaded yet.
 */
export function getPhotos(placeId: string): any[] {
  return REGISTRY[placeId] ?? [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];
}
