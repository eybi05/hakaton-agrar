import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import TokenBadge from '../components/TokenBadge';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

const FILTERS = ['All', 'UNESCO', 'Castles', 'Palaces', 'Ancient', 'Temples'];

const PLACES = [
  {
    id: '1', name: 'Maiden Tower', location: 'Baku Old City',
    era: '12th century', tag: 'UNESCO', rating: '4.9',
    desc: 'Iconic cylindrical tower and symbol of Baku, overlooking the Caspian Sea.',
    gradient: ['#1A3A6E', '#3B6CB0'] as [string, string],
  },
  {
    id: '2', name: 'Icheri Sheher', location: 'Baku',
    era: 'Medieval', tag: 'UNESCO', rating: '4.8',
    desc: 'Baku\'s walled inner city — one of the oldest inhabited areas in the world.',
    gradient: ['#1A4A2E', '#2D9D63'] as [string, string],
  },
  {
    id: '3', name: 'Sheki Khan Palace', location: 'Sheki',
    era: '18th century', tag: 'Palaces', rating: '4.9',
    desc: 'Exquisite summer palace famed for its stained-glass windows and frescoes.',
    gradient: ['#4A1D96', '#7C3AED'] as [string, string],
  },
  {
    id: '4', name: 'Gobustan Rock Art', location: 'Gobustan',
    era: '10,000 BC', tag: 'UNESCO', rating: '4.7',
    desc: 'Thousands of prehistoric engravings depicting life, fauna and celestial bodies.',
    gradient: ['#5C3317', '#A0522D'] as [string, string],
  },
  {
    id: '5', name: 'Ateshgah Fire Temple', location: 'Surakhani',
    era: '17th century', tag: 'Temples', rating: '4.8',
    desc: 'Zoroastrian fire-worship temple built over a natural gas vent that burns eternally.',
    gradient: ['#8B2500', '#E8773A'] as [string, string],
  },
  {
    id: '6', name: 'Alinja Castle', location: 'Nakhchivan',
    era: '10th century', tag: 'Castles', rating: '4.6',
    desc: 'Dramatic hilltop fortress perched on a steep rock above the Alinja River valley.',
    gradient: ['#3D3D3D', '#666'] as [string, string],
  },
  {
    id: '7', name: 'Momine Khatun Mausoleum', location: 'Nakhchivan',
    era: '12th century', tag: 'UNESCO', rating: '4.8',
    desc: 'Octagonal mausoleum by the great architect Ajami — a masterpiece of Azerbaijani art.',
    gradient: ['#1A3A6E', '#6B4226'] as [string, string],
  },
  {
    id: '8', name: 'Diri Baba Mausoleum', location: 'Maraza',
    era: '15th century', tag: 'Ancient', rating: '4.7',
    desc: 'Two-storey tomb carved directly into the face of a sheer rock cliff.',
    gradient: ['#2D6A4F', '#52B788'] as [string, string],
  },
];

type Props = { navigation: any };

export default function HistoricalScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PLACES.filter((p) => {
    const matchFilter = activeFilter === 'All' || p.tag === activeFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <LinearGradient colors={[COLORS.historical, COLORS.historicalLight]} style={styles.header}>
        <View style={[styles.hBubble, { width: 160, height: 160, top: -50, right: -40 }]} />
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Historical Places</Text>
          <TokenBadge variant="light" />
        </View>
        <Text style={styles.headerSub}>Explore Azerbaijan's rich heritage</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={COLORS.textLight} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places, cities…"
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </LinearGradient>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
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

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        <Text style={styles.resultCount}>{filtered.length} places found</Text>
        <View style={styles.gridRow}>
          {filtered.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('PlaceDetail', { place })}
            >
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
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 28, overflow: 'hidden' },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  hBubble: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.07)' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 12,
    paddingHorizontal: 14, height: 46,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },

  // Filters
  filterBar: { maxHeight: 56, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  filterScroll: { paddingHorizontal: 16, alignItems: 'center', gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: COLORS.cardAlt, borderWidth: 1, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.historical, borderColor: COLORS.historical },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textMedium },
  filterChipTextActive: { color: COLORS.white },

  // Grid
  grid: { paddingHorizontal: 16, paddingTop: 14 },
  resultCount: { fontSize: 13, color: COLORS.textLight, marginBottom: 12, fontWeight: '500' },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  placeCard: {
    width: CARD_W, backgroundColor: COLORS.card, borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  cardImg: { height: 130, padding: 10, justifyContent: 'space-between', overflow: 'hidden' },
  cardImgDeco: {
    position: 'absolute', top: -30, right: -30,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  tagBadgeText: { fontSize: 10, color: COLORS.white, fontWeight: '700' },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
  },
  ratingText: { fontSize: 10, color: COLORS.white, fontWeight: '600' },

  cardBody: { padding: 10, gap: 3 },
  cardName: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  cardLocRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardLoc: { fontSize: 11, color: COLORS.textLight },
  cardEra: { fontSize: 11, color: COLORS.historicalLight, fontWeight: '600', marginTop: 1 },
});
