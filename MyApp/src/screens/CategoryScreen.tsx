import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import TokenBadge from '../components/TokenBadge';

const { width } = Dimensions.get('window');

// ── Per-category listings ──────────────────────────────────────────────────────
const LISTINGS: Record<string, {
  id: string;
  name: string;
  location: string;
  price: string;
  rating: string;
  desc: string;
  gradient: [string, string];
}[]> = {
  Farms: [
    { id: '1', name: 'Green Valley Farm', location: 'Sheki, Azerbaijan', price: '₼45', rating: '4.8', desc: 'Experience organic farming, fresh produce picking, and barn tours in a serene valley setting.', gradient: ['#2D6A4F', '#52B788'] },
    { id: '2', name: 'Sunrise Orchard', location: 'Ganja, Azerbaijan', price: '₼35', rating: '4.6', desc: 'Pick apples, pears and seasonal fruits straight from the tree with family-friendly guided tours.', gradient: ['#52B788', '#95D5B2'] },
    { id: '3', name: 'Pomegranate Estate', location: 'Goychay, Azerbaijan', price: '₼50', rating: '4.9', desc: 'Azerbaijans famous pomegranate heartland — harvest season tours with tastings included.', gradient: ['#C0392B', '#E74C3C'] },
    { id: '4', name: 'Hazelnut Hills', location: 'Zagatala, Azerbaijan', price: '₼40', rating: '4.7', desc: 'Walk through hazelnut groves, learn about processing, and take home fresh-roasted bags.', gradient: ['#A67C52', '#C9A87C'] },
  ],
  'Village Tours': [
    { id: '1', name: 'Lahij Craft Village', location: 'Lahij, Azerbaijan', price: '₼30', rating: '4.9', desc: 'A medieval coppersmith village — watch artisans at work on hand-beaten bowls and jugs.', gradient: ['#5C6BC0', '#7986CB'] },
    { id: '2', name: 'Khinalug Highlands', location: 'Quba, Azerbaijan', price: '₼55', rating: '4.8', desc: 'One of the world\'s oldest villages at 2,200 m altitude with stunning Caucasus panoramas.', gradient: ['#1B6CA8', '#4FC3F7'] },
    { id: '3', name: 'Masallı Tea Village', location: 'Masalli, Azerbaijan', price: '₼25', rating: '4.6', desc: 'Tour tea plantations, visit a traditional tea house, and enjoy live folk music performances.', gradient: ['#26A69A', '#4DB6AC'] },
    { id: '4', name: 'Sheki Old Town', location: 'Sheki, Azerbaijan', price: '₼20', rating: '4.7', desc: 'Stroll through caravanserais, silk workshops, and the famous Khan\'s Palace stained-glass windows.', gradient: ['#8E44AD', '#9B59B6'] },
  ],
  'Horse Riding': [
    { id: '1', name: 'Sunrise Horse Ranch', location: 'Gabala, Azerbaijan', price: '₼60', rating: '4.9', desc: 'Guided trail rides through mountain meadows for all skill levels — beginners welcome.', gradient: ['#A67C52', '#F4A261'] },
    { id: '2', name: 'Karabakh Stud Farm', location: 'Aghdam, Azerbaijan', price: '₼80', rating: '4.8', desc: 'Ride the legendary Karabakh breed — Azerbaijan\'s national horse — across open steppe.', gradient: ['#C0392B', '#A67C52'] },
    { id: '3', name: 'Forest Trail Rides', location: 'Quba, Azerbaijan', price: '₼45', rating: '4.7', desc: 'Two-hour rides through dense pine and beech forests with a riverside picnic stop.', gradient: ['#2D6A4F', '#A67C52'] },
    { id: '4', name: 'Sunset Polo Club', location: 'Baku suburbs, Azerbaijan', price: '₼100', rating: '4.9', desc: 'Polo lessons and sunset rides with a traditional BBQ dinner included.', gradient: ['#E67E22', '#F39C12'] },
  ],
  'Organic Food': [
    { id: '1', name: 'Farm-to-Table Feast', location: 'Sheki, Azerbaijan', price: '₼35', rating: '4.8', desc: 'A 5-course dinner made entirely from ingredients grown on-site, cooked in a clay oven.', gradient: ['#D35400', '#E67E22'] },
    { id: '2', name: 'Honey & Herb Garden', location: 'Gabala, Azerbaijan', price: '₼25', rating: '4.7', desc: 'Tour an apiary, harvest herbs, and enjoy honey tastings paired with village breads.', gradient: ['#F39C12', '#F1C40F'] },
    { id: '3', name: 'Dairy & Cheese Barn', location: 'Shamakhi, Azerbaijan', price: '₼30', rating: '4.6', desc: 'Watch traditional cheesemaking, try fresh kefir, and take home hand-wrapped village cheeses.', gradient: ['#52B788', '#D35400'] },
    { id: '4', name: 'Walnut Oil Press', location: 'Qakh, Azerbaijan', price: '₼20', rating: '4.5', desc: 'Cold-press walnut oil demonstration with olive-oil style tasting flight and market stall.', gradient: ['#A67C52', '#D35400'] },
  ],
  Camping: [
    { id: '1', name: 'Mountain Camp Site', location: 'Lahij, Azerbaijan', price: '₼30', rating: '4.7', desc: 'Tent or glamping dome — wake up to misty mountain peaks and birdsong above the clouds.', gradient: ['#1B6CA8', '#4FC3F7'] },
    { id: '2', name: 'Riverside Wild Camp', location: 'Gabala, Azerbaijan', price: '₼25', rating: '4.6', desc: 'Camp beside a crystal-clear river; guided night hikes and bonfire storytelling included.', gradient: ['#2D6A4F', '#1B6CA8'] },
    { id: '3', name: 'Stargazer Plateau', location: 'Nakhchivan, Azerbaijan', price: '₼40', rating: '4.8', desc: 'Remote plateau far from city lights — ideal for astrophotography and meteor showers.', gradient: ['#2C3E50', '#4FC3F7'] },
    { id: '4', name: 'Eco Glamping Retreat', location: 'Guba, Azerbaijan', price: '₼65', rating: '4.9', desc: 'Luxury canvas tents with wood-burning stoves, outdoor bathtubs, and forest yoga sessions.', gradient: ['#52B788', '#2D6A4F'] },
  ],
  'Local Hotels': [
    { id: '1', name: 'Khan\'s Garden Inn', location: 'Sheki, Azerbaijan', price: '₼85', rating: '4.8', desc: 'Restored 19th-century caravanserai with courtyard garden, traditional rooms and local breakfast.', gradient: ['#26A69A', '#00695C'] },
    { id: '2', name: 'Gabala Forest Lodge', location: 'Gabala, Azerbaijan', price: '₼110', rating: '4.9', desc: 'Chalet-style lodge surrounded by forest, with mountain views and a spa facility on-site.', gradient: ['#2D6A4F', '#52B788'] },
    { id: '3', name: 'Shamakhi Heritage Hotel', location: 'Shamakhi, Azerbaijan', price: '₼70', rating: '4.6', desc: 'Centuries-old merchant house converted to a boutique hotel; rooftop terrace with vineyard views.', gradient: ['#8E44AD', '#6C3483'] },
    { id: '4', name: 'Mud Volcano Guesthouse', location: 'Gobustan, Azerbaijan', price: '₼55', rating: '4.5', desc: 'Family-run guesthouse next to the mud volcano park; homestay meals and jeep tour packages.', gradient: ['#A67C52', '#7D5A3C'] },
  ],
  'Traditional Foods': [
    { id: '1', name: 'Piti Pottery Kitchen', location: 'Sheki, Azerbaijan', price: '₼30', rating: '4.9', desc: 'Cook the famous Sheki piti (lamb & chickpea stew) in hand-made clay pots over an open fire.', gradient: ['#C0392B', '#922B21'] },
    { id: '2', name: 'Dolma & Bread Workshop', location: 'Qakh, Azerbaijan', price: '₼25', rating: '4.7', desc: 'Roll dolma leaves and bake traditional tandır bread with a village grandmother as your guide.', gradient: ['#2D6A4F', '#C0392B'] },
    { id: '3', name: 'Pakhlava Sweets Tour', location: 'Ganja, Azerbaijan', price: '₼20', rating: '4.8', desc: 'Tour a family bakery producing the region\'s finest pakhlava, shekerbura, and mutaki pastries.', gradient: ['#E67E22', '#C0392B'] },
    { id: '4', name: 'Grape & Wine Cellar', location: 'Shamakhi, Azerbaijan', price: '₼40', rating: '4.6', desc: 'Taste rare local grape varietals, tour underground wine cellars, and learn about qovurma (cured meat).', gradient: ['#8E44AD', '#C0392B'] },
  ],
  'Nature Activities': [
    { id: '1', name: 'Tufandag Cable Car Hike', location: 'Gabala, Azerbaijan', price: '₼35', rating: '4.8', desc: 'Cable car to the summit followed by a guided alpine wildflower hike with a hot tea stop.', gradient: ['#27AE60', '#1E8449'] },
    { id: '2', name: 'Goygol Lake Trek', location: 'Goygol, Azerbaijan', price: '₼30', rating: '4.9', desc: 'Trek through mixed forest to a mirror-calm glacial lake surrounded by the Lesser Caucasus.', gradient: ['#1B6CA8', '#27AE60'] },
    { id: '3', name: 'Bird-watching Safari', location: 'Shirvan, Azerbaijan', price: '₼45', rating: '4.7', desc: 'Guided dawn safari in the Shirvan National Park to spot flamingos, pelicans and eagles.', gradient: ['#F39C12', '#27AE60'] },
    { id: '4', name: 'Waterfall Kayak Day', location: 'Quba, Azerbaijan', price: '₼55', rating: '4.8', desc: 'Kayak down the Qudyalchay river to the base of Afurja waterfall — life jackets & guide included.', gradient: ['#1B6CA8', '#4FC3F7'] },
  ],
};

// ── Category meta (icon + colors from HomeScreen) ─────────────────────────────
const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  Farms:              { icon: 'leaf',         color: '#2D6A4F', bg: '#D8F3DC' },
  'Village Tours':    { icon: 'home',         color: '#5C6BC0', bg: '#E8EAF6' },
  'Horse Riding':     { icon: 'paw',          color: '#A67C52', bg: '#F3E5D0' },
  'Organic Food':     { icon: 'nutrition',    color: '#D35400', bg: '#FBE9E7' },
  Camping:            { icon: 'flame',        color: '#E67E22', bg: '#FFF3E0' },
  'Local Hotels':     { icon: 'bed',          color: '#26A69A', bg: '#E0F2F1' },
  'Traditional Foods':{ icon: 'restaurant',  color: '#C0392B', bg: '#FDEDEC' },
  'Nature Activities':{ icon: 'partly-sunny', color: '#27AE60', bg: '#EAFAF1' },
};

type Props = {
  route: { params: { category: string } };
  navigation: any;
};

export default function CategoryScreen({ route, navigation }: Props) {
  const { category } = route.params;
  const meta = CATEGORY_META[category] ?? { icon: 'grid', color: COLORS.primary, bg: COLORS.primaryXLight };
  const listings = LISTINGS[category] ?? [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: meta.bg }]} edges={['top']}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={meta.color} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.headerIcon, { backgroundColor: meta.color + '22' }]}>
            <Ionicons name={meta.icon as any} size={20} color={meta.color} />
          </View>
          <Text style={[styles.headerTitle, { color: meta.color }]}>{category}</Text>
        </View>
        <TokenBadge variant="dark" />
      </View>

      {/* ── Listing count ────────────────────────────────────────────────────── */}
      <Text style={styles.countLabel}>{listings.length} experiences available</Text>

      {/* ── Cards ────────────────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {listings.map((item) => (
          <TouchableOpacity key={item.id} activeOpacity={0.88} style={styles.card}>
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              {/* Decorative circle */}
              <View style={styles.decorCircle} />

              <View style={styles.cardContent}>
                {/* Rating */}
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>

                <Text style={styles.cardName}>{item.name}</Text>

                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>

                <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.price}>
                    {item.price} <Text style={styles.priceSub}>/ person</Text>
                  </Text>
                  <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },

  countLabel: {
    fontSize: 13,
    color: COLORS.textMedium,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  scroll: { flex: 1 },
  listContent: { paddingHorizontal: 16, gap: 14 },

  card: { borderRadius: 20, overflow: 'hidden' },
  cardGradient: {
    padding: 20,
    minHeight: 185,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  cardContent: { gap: 5 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  ratingText: { fontSize: 11, color: COLORS.white, fontWeight: '600' },

  cardName: { fontSize: 18, fontWeight: '700', color: COLORS.white },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  cardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
    lineHeight: 18,
    marginTop: 2,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  priceSub: { fontSize: 11, fontWeight: '400', color: 'rgba(255,255,255,0.75)' },

  bookBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});
