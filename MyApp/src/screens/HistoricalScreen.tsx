import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Dimensions, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import TokenBar from '../components/TokenBar';
import LangToggle from '../components/LangToggle';
import { useLanguage } from '../context/LanguageContext';
import { getHistoricalPhotos, hasRealPhoto } from '../data/historicalImages';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

const FILTERS = ['All', 'UNESCO', 'Castles', 'Palaces', 'Ancient', 'Temples', 'Nature', 'Cultural'];

export type HistoricalPlace = {
  id: string;
  name: string;
  location: string;
  era: string;
  tag: string;
  rating: string;
  desc: string;
  fullDesc: string;
  bullets: string[];
  gradient: [string, string];
  info: { label: string; value: string; icon: string }[];
};

const PLACES: HistoricalPlace[] = [
  // ── Existing entries (enriched) ─────────────────────────────────────────────
  {
  id: '1',
  name: 'Maiden Tower',
  location: 'Baku Old City',
  era: '12th Century',
  tag: 'UNESCO',
  rating: '4.9',

  desc: 'The iconic symbol of Baku, offering panoramic views over the Caspian Sea and the ancient Old City.',

  fullDesc:
    'Standing proudly within the historic walls of Icherisheher, the Maiden Tower (Qız Qalası) is one of Azerbaijan’s most famous architectural monuments and a masterpiece of medieval engineering. Built during the 12th century, this mysterious cylindrical tower rises 29.5 meters above the old city and continues to fascinate historians and travelers alike. Scholars still debate its original purpose, with theories ranging from a defensive watchtower to a Zoroastrian fire temple or astronomical observatory. Today, the tower functions as a museum showcasing the rich history of Baku and provides breathtaking panoramic views of the Caspian Sea and the UNESCO-listed Old City from its rooftop.',

  bullets: [
    'One of the most recognizable landmarks and symbols of Azerbaijan.',
    'Located inside the UNESCO-listed Walled City of Baku (Icherisheher).',
    'Built in the 12th century with unique cylindrical medieval architecture.',
    'Its original purpose remains a historical mystery debated by archaeologists.',
    'Contains a museum presenting the cultural and historical evolution of Baku.',
    'The rooftop viewing platform offers stunning views of the Caspian Sea and Old City.',
  ],

  gradient: ['#163B72', '#4A7BD1'],

  info: [
    {
      label: 'Visitor Hours',
      value: '10:00 – 18:00',
      icon: 'time-outline',
    },
    {
      label: 'Entry Fee',
      value: '₼5 per person',
      icon: 'wallet-outline',
    },
    {
      label: 'Location',
      value: 'Icherisheher, Baku',
      icon: 'location-outline',
    },
    {
      label: 'Best Season',
      value: 'All Year',
      icon: 'sunny-outline',
    },
  ],
},
  {
    id: '2', name: 'Icheri Sheher', location: 'Baku', era: 'Medieval',
    tag: 'UNESCO', rating: '4.8',
    desc: 'Baku\'s walled inner city — one of the oldest inhabited areas in the world.',
    fullDesc: 'Icheri Sheher, the Walled City of Baku, is the historic core of the capital and one of the oldest continuously inhabited places in the world. Enclosed by ancient stone walls, it is a living museum of narrow winding alleys, medieval mosques, caravanserais, and bathhouses that tell the story of a city at the crossroads of East and West. Recognised as a UNESCO World Heritage Site, the old city was also famously used as a filming location for the James Bond film "The World Is Not Enough." Walking its lanes at dusk, when the ancient stones are bathed in golden light, is a genuinely unforgettable experience.',
    bullets: [
      'A UNESCO World Heritage Site and one of the oldest continuously inhabited urban areas in the world.',
      'Enclosed by ancient stone defensive walls dating back to the 11th–12th centuries.',
      'Contains over 900 historic buildings including mosques, caravanserais, palaces, and bathhouses.',
      'Served as a major stop on the ancient Silk Road trade routes.',
      'A famous filming location for James Bond\'s "The World Is Not Enough" (1999).',
    ],
    gradient: ['#1A4A2E', '#2D9D63'],
    info: [{ label: 'Visitor Hours', value: 'Always open', icon: 'time-outline' }, { label: 'Entry Fee', value: 'Free', icon: 'wallet-outline' }, { label: 'Location', value: 'Central Baku', icon: 'location-outline' }, { label: 'Best Season', value: 'Spring & Autumn', icon: 'sunny-outline' }],
  },
  {
    id: '3', name: 'Sheki Khan Palace', location: 'Sheki', era: '18th century',
    tag: 'UNESCO', rating: '4.9',
    desc: 'Exquisite summer palace famed for its stained-glass windows and frescoes.',
    fullDesc: 'Stepping into the Palace of Shaki Khans is like walking into a vibrant jewelry box, where the 18th-century opulence of the Silk Road is captured in every hand-painted petal and glass shard. This UNESCO World Heritage gem is world-renowned for its "Shebeke" windows — ethereal wooden lattices filled with thousands of pieces of colored Venetian glass that transform the sunlight into a swirling kaleidoscope of ruby, turquoise, and amber across the floors. Built without a single nail, the two-story structure is a testament to impossible craftsmanship, featuring walls draped in intricate frescoes of hunting scenes, mythical beasts, and floral arabesques that haven\'t lost their brilliance in over 250 years. Guarded by two towering plane trees that have stood since the 1530s, the palace offers a serene, almost mystical atmosphere that perfectly captures the soul of Azerbaijan\'s ancient history.',
    bullets: [
      '18th-century architectural masterpiece located in Sheki, Azerbaijan.',
      'Built by Huseyn Khan Mushtaq, once served as the summer residence of the Sheki Khans.',
      'Famous for its intricate stained glass windows, known as shabaka, along with its colorful frescoes and detailed wooden carvings.',
      'Today, it is recognized as a UNESCO World Heritage Site.',
      'Considered one of the most important symbols of Azerbaijani artistry, culture, and craftsmanship.',
    ],
    gradient: ['#4A1D96', '#7C3AED'],
    info: [{ label: 'Visitor Hours', value: '09:00 – 18:00', icon: 'time-outline' }, { label: 'Entry Fee', value: '₼5 / person', icon: 'wallet-outline' }, { label: 'Language', value: 'Azerbaijani, EN', icon: 'language-outline' }, { label: 'Best Season', value: 'Apr – Oct', icon: 'sunny-outline' }],
  },
  {
    id: '4', name: 'Gobustan Rock Art', location: 'Gobustan', era: '10,000 BC',
    tag: 'UNESCO', rating: '4.7',
    desc: 'Thousands of prehistoric engravings depicting life, fauna and celestial bodies.',
    fullDesc: 'Gobustan State Historical-Artistic Reserve contains around 6,000 rock engravings spanning more than 40,000 years of human history. The carvings depict humans, animals, ritual dances, boats, and solar symbols that provide a unique window into prehistoric life in the South Caucasus. Together with the mud volcanoes and the ruins of ancient settlements, Gobustan forms one of the most remarkable cultural landscapes in the world. The adjacent modern museum uses interactive displays and replica panels to bring the ancient carvings to vivid life.',
    bullets: [
      'Contains approximately 6,000 rock engravings spanning 40,000 years of human history.',
      'Listed as a UNESCO World Heritage Site for its outstanding universal cultural value.',
      'Carvings depict hunting scenes, ritual dances, animals, boats, and solar symbols.',
      'Located approximately 65 km south of Baku, easily combined with a visit to the mud volcanoes.',
      'The on-site museum uses advanced multimedia displays to bring the carvings to life.',
    ],
    gradient: ['#5C3317', '#A0522D'],
    info: [{ label: 'Visitor Hours', value: '09:00 – 17:00', icon: 'time-outline' }, { label: 'Entry Fee', value: '₼5 / person', icon: 'wallet-outline' }, { label: 'Distance', value: '65 km from Baku', icon: 'navigate-outline' }, { label: 'Best Season', value: 'Spring & Autumn', icon: 'sunny-outline' }],
  },
  {
    id: '5', name: 'Ateshgah Fire Temple', location: 'Surakhani', era: '17th century',
    tag: 'Temples', rating: '4.8',
    desc: 'Zoroastrian fire-worship temple built over a natural gas vent that burns eternally.',
    fullDesc: 'The Ateshgah of Baku is a medieval castle-like religious temple that was a place of worship for Zoroastrians, Hindus, and Sikhs. Built over a natural gas vent on the Absheron Peninsula, the central eternal flame has burned for centuries without any human intervention, earning the site its poetic name — "House of Fire." Indian merchants traveling the Silk Road funded much of the construction, explaining the Hindu and Sanskrit inscriptions found alongside Azerbaijani ones. Today the former monks\' cells contain exhibits of ascetic life, and the central flame, though now aided by a gas pipe since the natural vent was exhausted in the 20th century, still burns with its ancient, meditative glow.',
    bullets: [
      'A medieval Zoroastrian, Hindu, and Sikh fire-worship temple on the Absheron Peninsula.',
      'Named "House of Fire" after the natural gas vent that kept a flame burning for centuries.',
      'Built primarily by Indian Silk Road merchants, with inscriptions in Sanskrit and Hindi.',
      'The pentagonal complex surrounds a central atargah (fire altar) with monks\' cells on all sides.',
      'Today a museum-reserve open to the public, approximately 30 km from central Baku.',
    ],
    gradient: ['#8B2500', '#E8773A'],
    info: [{ label: 'Visitor Hours', value: '09:00 – 18:00', icon: 'time-outline' }, { label: 'Entry Fee', value: '₼4 / person', icon: 'wallet-outline' }, { label: 'Distance', value: '30 km from Baku', icon: 'navigate-outline' }, { label: 'Best Season', value: 'Year-round', icon: 'sunny-outline' }],
  },
  {
    id: '6', name: 'Alinja Castle', location: 'Nakhchivan', era: '10th century',
    tag: 'Castles', rating: '4.7',
    desc: 'Dramatic hilltop fortress that defied Tamerlane for 14 years.',
    fullDesc: 'Welcome to Alinja Castle, the legendary "Machu Picchu of the Caucasus"! As you stand at the base of this craggy volcanic peak in Nakhchivan, you\'re looking at a fortress that once defied the Great Tamerlane for an incredible 14 years. To reach the summit, you\'ll embark on a rewarding climb up roughly 1,500 stone steps, passing ancient walls and rock-cut water cisterns that have stood for centuries. Once you reach the top, the air is thin and crisp, offering a breathtaking 360-degree panorama of the rugged Culfa mountains and the distant Iranian border. It is a place where history feels tangible and the sheer scale of the landscape makes every bit of the hike worth the effort.',
    bullets: [
      'Named the "Machu Picchu of the Caucasus" because of its dramatic mountain setting and historic fortress ruins.',
      'The castle stands on a craggy volcanic peak in Nakhchivan and resisted the forces of Timur for 14 years.',
      'Visitors reach the summit by climbing around 1,500 stone steps past ancient walls and rock-cut cisterns.',
      'Offers breathtaking 360° panoramic views of the Culfa mountains and the distant Iranian border.',
      'Admired for its combination of natural beauty, military history, and unforgettable hiking experience.',
    ],
    gradient: ['#3D3D3D', '#666666'],
    info: [{ label: 'Visitor Hours', value: 'Always open', icon: 'time-outline' }, { label: 'Entry Fee', value: 'Free', icon: 'wallet-outline' }, { label: 'Difficulty', value: 'Moderate hike', icon: 'walk-outline' }, { label: 'Best Season', value: 'Spring & Autumn', icon: 'sunny-outline' }],
  },
  {
    id: '7', name: 'Momine Khatun Mausoleum', location: 'Nakhchivan', era: '12th century',
    tag: 'UNESCO', rating: '4.8',
    desc: 'Octagonal mausoleum by architect Ajami — a masterpiece of Azerbaijani art.',
    fullDesc: 'The Mausoleum of Momine Khatun is a 12th-century architectural masterpiece designed by the renowned Azerbaijani architect Ajami Nakhchivani, who is widely regarded as the founder of Azerbaijani classical architecture. The ten-sided tower rises 26 metres and is clad in intricately carved terracotta brickwork forming geometric star patterns and calligraphic friezes that have been studied by architects and historians for centuries. Built in honour of the wife of the Eldiguzid ruler Jahan Pahlavan, it stands as a testament to the sophistication of medieval Islamic art and science in Azerbaijan.',
    bullets: [
      'A 12th-century mausoleum designed by the legendary Azerbaijani architect Ajami Nakhchivani.',
      'The ten-sided tower stands 26 metres tall, clad in ornate terracotta brickwork.',
      'Features intricate geometric star patterns and calligraphic friezes considered a masterpiece of Islamic art.',
      'Listed as a UNESCO World Heritage Site alongside the Yusuf ibn Kuseyir mausoleum nearby.',
      'Built to honour the wife of the Eldiguzid ruler and has survived over 850 years.',
    ],
    gradient: ['#1A3A6E', '#6B4226'],
    info: [{ label: 'Visitor Hours', value: '09:00 – 17:00', icon: 'time-outline' }, { label: 'Entry Fee', value: '₼2 / person', icon: 'wallet-outline' }, { label: 'Location', value: 'Nakhchivan city', icon: 'location-outline' }, { label: 'Best Season', value: 'Apr – Oct', icon: 'sunny-outline' }],
  },
  {
    id: '8', name: 'Diri Baba Mausoleum', location: 'Maraza', era: '15th century',
    tag: 'Ancient', rating: '4.7',
    desc: 'Two-storey tomb carved directly into the face of a sheer rock cliff.',
    fullDesc: 'The Diri Baba Mausoleum is one of the most hauntingly beautiful and unusual architectural monuments in Azerbaijan. Built in 1402, the two-storey mausoleum is carved directly into a sheer, overhanging limestone cliff in the village of Maraza, seemingly defying gravity. According to local legend, a holy man named Diri Baba (meaning "Living Elder") is buried here and is said to have risen from the dead, lending the site an air of spiritual mysticism. The carved stone stalactites and honeycomb niches of its facade represent a pinnacle of medieval Azerbaijani stone-masonry.',
    bullets: [
      'Built in 1402, carved directly into an overhanging limestone cliff in the village of Maraza.',
      'Its name "Diri Baba" means "Living Elder," referencing a local legend of resurrection.',
      'Represents one of the finest examples of medieval Azerbaijani stone-carving and cliff architecture.',
      'The two-storey structure features ornate carved stalactites and honeycomb niches on its facade.',
      'Located approximately 70 km north of Baku, making it an excellent day-trip destination.',
    ],
    gradient: ['#2D6A4F', '#52B788'],
    info: [{ label: 'Visitor Hours', value: 'Always open', icon: 'time-outline' }, { label: 'Entry Fee', value: 'Free', icon: 'wallet-outline' }, { label: 'Distance', value: '70 km from Baku', icon: 'navigate-outline' }, { label: 'Best Season', value: 'Year-round', icon: 'sunny-outline' }],
  },

  // ── 6 new locations ──────────────────────────────────────────────────────────
  {
    id: '9', name: 'Khizi Candy Cane Mountains', location: 'Khizi', era: 'Geological',
    tag: 'Nature', rating: '4.8',
    desc: 'Surreal striped shale hills of crimson, pink, and white — Azerbaijan\'s psychedelic landscape.',
    fullDesc: 'Welcome to the breathtaking Khizi Mountains, Azerbaijan\'s very own psychedelic landscape! As you drive about 90 minutes north of Baku, the horizon transforms into a series of rolling shale hills famously nicknamed the Candy Cane Mountains for their vibrant swirls of crimson, pink, and white. These surreal stripes were formed over millions of years as shifting groundwater changed the oxidation state of iron in the rock, and if you look closely at your feet while hiking, you might even spot fossilised prehistoric squid shells called belemnites scattered on the surface. To get the best experience, try to arrive during the "golden hour" at sunrise or sunset when the low light makes the colors practically glow. It\'s a quiet, otherworldly spot that feels more like walking on Mars than staying on Earth.',
    bullets: [
      'One of Azerbaijan\'s most unique natural landscapes, located about 90 minutes north of Baku.',
      'Famously known as the "Candy Cane Mountains" because of their striking red, pink, and white striped hills.',
      'Colorful patterns formed over millions of years through geological processes involving iron oxidation in the rocks.',
      'Visitors hiking through the area may find fossilised prehistoric squid shells called belemnites on the surface.',
      'Best visited at sunrise or sunset when the golden light makes the mountain colors appear even more vivid.',
      'Considered a must-see for travelers seeking unusual landscapes and peaceful scenery away from the city.',
    ],
    gradient: ['#8B1A1A', '#C0614A'],
    info: [{ label: 'Visitor Hours', value: 'Always open', icon: 'time-outline' }, { label: 'Entry Fee', value: 'Free', icon: 'wallet-outline' }, { label: 'Distance', value: '~90 min from Baku', icon: 'navigate-outline' }, { label: 'Best Time', value: 'Sunrise / Sunset', icon: 'sunny-outline' }],
  },
  {
    id: '10', name: 'Lavender Fields · Chukhur Gabala', location: 'Qəbələ', era: 'Agrotourism',
    tag: 'Nature', rating: '4.9',
    desc: 'Rows of purple lavender against the dramatic peaks of the Greater Caucasus.',
    fullDesc: 'Welcome to the purple heart of Azerbaijan! As you step into the lavender fields of Chukhur Gabala, you\'ll immediately feel like you\'ve been transported to a mountain-fringed version of the French countryside. Nestled against the dramatic peaks of the Greater Caucasus, these vibrant rows of purple offer a sensory overload of sweet, calming aromas and breathtaking views. To catch the fields at their most photogenic, visit between mid-June and early July before the annual harvest begins. It\'s the perfect spot to slow down, snap some incredible photos, and pick up some organic lavender oil or honey from the local farm shop. Since it\'s just a short drive from the centre of Qabala and right next to the ancient ruins of the city\'s historical gates, it\'s an easy and refreshing addition to your mountain itinerary.',
    bullets: [
      'Known as the "purple heart of Azerbaijan" for its beautiful rows of blooming lavender.',
      'Located near the peaks of the Greater Caucasus Mountains, offering breathtaking scenery and calming aromas.',
      'Best time to visit is between mid-June and early July, before the annual lavender harvest begins.',
      'Visitors come to take photos, enjoy the peaceful atmosphere, and explore the colorful summer landscape.',
      'Local farm shops in the area sell organic lavender products such as lavender oil and honey.',
      'Close to the historic ruins and ancient gates of Qabala, making it a popular stop for travelers in the region.',
    ],
    gradient: ['#5B2C8D', '#9B59B6'],
    info: [{ label: 'Best Season', value: 'Mid-Jun – Jul', icon: 'sunny-outline' }, { label: 'Entry Fee', value: 'Free', icon: 'wallet-outline' }, { label: 'Location', value: 'Near Qabala', icon: 'location-outline' }, { label: 'Products', value: 'Lavender oil, honey', icon: 'cart-outline' }],
  },
  {
    id: '11', name: 'St. George\'s Church', location: 'Qax (Ingiloy)', era: 'Built 1855',
    tag: 'Cultural', rating: '4.7',
    desc: 'Active Georgian Orthodox church capturing the multicultural soul of Qax.',
    fullDesc: 'Welcome to the beautiful region of Qax! St. George\'s Church in the village of Qax-Ingiloy is a true hidden gem that perfectly captures the multicultural soul of Azerbaijan. Built in 1855, this active Georgian Orthodox church stands as a vibrant centre for the local Ingiloy community, featuring a charming white-stone exterior and a traditional bell tower set against the lush, green backdrop of the Greater Caucasus foothills. When you step inside, you\'ll be greeted by colorful, well-preserved frescoes and a serene atmosphere that feels worlds away from the hustle of modern life. It\'s a peaceful spot to witness the region\'s religious harmony firsthand, and because it\'s so close to the centre of Qax, it\'s the perfect cultural stop before heading deeper into the mountains to explore the waterfalls of Ilisu.',
    bullets: [
      'A historic Georgian Orthodox church located in the Qax region of Azerbaijan.',
      'Built in 1855, serving as an important religious and cultural centre for the local Ingiloy community.',
      'Known for its white-stone exterior, traditional bell tower, and scenic setting near the Caucasus foothills.',
      'Inside, visitors can admire colorful frescoes and experience a calm, peaceful atmosphere.',
      'Seen as a symbol of the multicultural and religious harmony found in the Qax region.',
      'A popular cultural stop for travelers exploring nearby mountain attractions such as Ilisu waterfalls.',
    ],
    gradient: ['#1A3A6E', '#5C6BC0'],
    info: [{ label: 'Visitor Hours', value: 'Always open', icon: 'time-outline' }, { label: 'Entry Fee', value: 'Free', icon: 'wallet-outline' }, { label: 'Location', value: 'Qax-Ingiloy village', icon: 'location-outline' }, { label: 'Best Season', value: 'Spring & Summer', icon: 'sunny-outline' }],
  },
  {
    id: '12', name: 'Gurgur Waterfall', location: 'Guba (Griz village)', era: 'Natural',
    tag: 'Nature', rating: '4.9',
    desc: 'Hidden mountain gem near Griz village — spectacular in summer and frozen blue in winter.',
    fullDesc: 'If you\'re looking for a true escape from the typical tourist trail, Gurgur Waterfall is the hidden mountain gem you\'ve been dreaming of. Tucked deep within the Guba region near the ancient, high-altitude village of Griz, this stunning site offers a raw and unfiltered connection with nature. To get there, you\'ll trade paved roads for a rugged 4×4 adventure through the clouds, followed by a scenic hike through the dramatic Gudyalchay Canyon. Whether you visit in the summer to see the lush greenery and hear the powerful "gurgling" rush of the falls or brave the winter to witness it frozen into a spectacular pillar of blue ice, the experience is nothing short of cinematic. It\'s the perfect place to breathe in the crisp Caucasus air, enjoy a glass of mountain tea with the incredibly hospitable local Griz people, and capture some of the most dramatic landscapes Azerbaijan has to offer.',
    bullets: [
      'A hidden natural attraction located near the high-altitude village of Griz in the Guba region.',
      'Reaching the waterfall involves a rugged 4×4 journey followed by a scenic hike through the Gudyalchay Canyon.',
      'Famous for its powerful rushing water, lush mountain scenery, and untouched natural beauty.',
      'During winter, the waterfall can freeze into a striking pillar of blue ice — a spectacular sight.',
      'Travelers can experience the hospitality of the local Griz community and enjoy traditional mountain tea.',
      'Considered one of Azerbaijan\'s most adventurous and breathtaking destinations for nature lovers and hikers.',
    ],
    gradient: ['#0D3D5E', '#4FC3F7'],
    info: [{ label: 'Access', value: '4×4 vehicle needed', icon: 'car-outline' }, { label: 'Entry Fee', value: 'Free', icon: 'wallet-outline' }, { label: 'Best Season', value: 'Jun–Sep / Winter ice', icon: 'sunny-outline' }, { label: 'Location', value: 'Guba region, Griz', icon: 'location-outline' }],
  },
];

type Props = { navigation: any };

export default function HistoricalScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch]             = useState('');
  const { t }                           = useLanguage();

  const filtered = PLACES.filter((p) => {
    const matchFilter = activeFilter === 'All' || p.tag === activeFilter;
    const matchSearch  =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <LinearGradient colors={[COLORS.historical, COLORS.historicalLight]} style={styles.header}>
        <View style={[styles.hBubble, { width: 160, height: 160, top: -50, right: -40 }]} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{t.historical.title}</Text>
          <LangToggle variant="light" />
        </View>
        <Text style={styles.headerSub}>{t.historical.subtitle}</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={COLORS.textLight} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.historical.searchHint}
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={17} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* ── Token bar ───────────────────────────────────────────────────── */}
      <TokenBar />

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
        keyboardShouldPersistTaps="handled"
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid} keyboardShouldPersistTaps="handled">
        <Text style={styles.resultCount}>{filtered.length} {t.historical.found}</Text>
        <View style={styles.gridRow}>
          {filtered.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('PlaceDetail', { place })}
            >
              {hasRealPhoto(place.id) ? (
                <ImageBackground
                  source={getHistoricalPhotos(place.id)[0]}
                  style={styles.cardImg}
                  imageStyle={{ resizeMode: 'cover' }}
                >
                  {/* Dark gradient overlay for readability */}
                  <LinearGradient
                    colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{place.tag}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={9} color="#FFD700" />
                    <Text style={styles.ratingText}>{place.rating}</Text>
                  </View>
                </ImageBackground>
              ) : (
                <LinearGradient colors={place.gradient} style={styles.cardImg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <View style={styles.cardImgDeco} />
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{place.tag}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={9} color="#FFD700" />
                    <Text style={styles.ratingText}>{place.rating}</Text>
                  </View>
                </LinearGradient>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>{place.name}</Text>
                <View style={styles.cardLocRow}>
                  <Ionicons name="location-outline" size={11} color={COLORS.textLight} />
                  <Text style={styles.cardLoc}>{place.location}</Text>
                </View>
                <Text style={styles.cardEra}>{place.era}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 28, overflow: 'hidden' },
  hBubble: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.07)' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },

  filterBar: { backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.divider, paddingVertical: 10 },
  filterScroll: { paddingHorizontal: 14, alignItems: 'center', gap: 8 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22, backgroundColor: COLORS.historicalXLight, borderWidth: 1.5, borderColor: COLORS.historicalLight + '50' },
  filterChipActive: { backgroundColor: COLORS.historical, borderColor: COLORS.historical, shadowColor: COLORS.historical, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 4 },
  filterChipText: { fontSize: 13, fontWeight: '700', color: COLORS.historical },
  filterChipTextActive: { color: COLORS.white },

  grid: { paddingHorizontal: 16, paddingTop: 14 },
  resultCount: { fontSize: 13, color: COLORS.textLight, marginBottom: 12, fontWeight: '500' },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  placeCard: { width: CARD_W, backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden', shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2 },
  cardImg: { height: 130, padding: 10, justifyContent: 'space-between', overflow: 'hidden' },
  cardImgDeco: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)' },
  tagBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagBadgeText: { fontSize: 10, color: COLORS.white, fontWeight: '700' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  ratingText: { fontSize: 10, color: COLORS.white, fontWeight: '600' },

  cardBody: { padding: 10, gap: 3 },
  cardName: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  cardLocRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardLoc: { fontSize: 11, color: COLORS.textLight },
  cardEra: { fontSize: 11, color: COLORS.historicalLight, fontWeight: '600', marginTop: 1 },
});
