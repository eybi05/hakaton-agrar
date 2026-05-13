/**
 * Place image registry.
 *
 * HOW TO ADD YOUR OWN PHOTOS:
 *  1. Drop photos into  assets/places/<folder>/photo1.jpg  etc.
 *  2. Add a require() line below for the place ID.
 *  3. The app will show them in a photo carousel in the map detail sheet.
 *
 * Until you add real photos, the app shows a colour-gradient placeholder.
 */

// Uncomment and fill in as you upload photos:
// const GREEN_VALLEY   = [require('../../assets/places/f1_green_valley/photo1.jpg')];
// const MAIDEN_TOWER   = [require('../../assets/places/p1_maiden_tower/photo1.jpg')];

export const PLACE_PHOTOS: Record<string, any[]> = {
  // 'f1': GREEN_VALLEY,
  // 'p1': MAIDEN_TOWER,
  // ...add more here
};

/** Returns the photo array for a place, or [] when none uploaded yet. */
export function getPhotos(placeId: string): any[] {
  return PLACE_PHOTOS[placeId] ?? [];
}
