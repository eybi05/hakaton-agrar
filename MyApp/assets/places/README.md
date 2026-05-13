# Place Photos

Drop your photos into subfolders named by place ID, then register them in:
  src/data/placeImages.ts

## Folder structure
```
assets/places/
  f1_green_valley/      ← Green Valley Farm
    photo1.jpg
    photo2.jpg
    photo3.jpg
  f2_sunrise_orchard/   ← Sunrise Orchard
    photo1.jpg
  h1_horse_ranch/       ← Sunrise Horse Ranch
    photo1.jpg
  c1_mountain_camp/     ← Mountain Camp Site
    photo1.jpg
  p1_maiden_tower/      ← Maiden Tower
    photo1.jpg
  p2_khan_palace/       ← Sheki Khan Palace
    photo1.jpg
  p3_gobustan/          ← Gobustan Rock Art
    photo1.jpg
  p4_ateshgah/          ← Ateshgah Fire Temple
    photo1.jpg
  (add more as needed)
```

## Supported formats
JPG, PNG, WebP

## After adding photos
Update src/data/placeImages.ts and add:
  'placeId': [require('../../assets/places/folder/photo1.jpg'), ...]
