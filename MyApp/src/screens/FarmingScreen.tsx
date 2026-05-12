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

const { width } = Dimensions.get('window');

const REGIONS = ['All', 'Sheki', 'Gabala', 'Quba', 'Ganja', 'Masalli', 'Zagatala', 'Goychay'];

const FARMS = [
  {
    id: '1', name: 'Green Valley Farm', region: 'Sheki', type: 'Organic Farm',
    price: '₼45', rating: '4.8', reviews: 127, distance: '4.2 km',
    tags: ['Organic', 'Family-friendly', 'Guided Tours'],
    gradient: ['#0D3D24', '#2D9D63'] as [string, string],
    open: true,
  },
  {
    id: '2', name: 'Sunrise Orchard', region: 'Ganja', type: 'Fruit Orchard',
    price: '₼35', rating: '4.6', reviews: 89, distance: '12 km',
    tags: ['Fruit Picking', 'Seasonal', 'Tastings'],
    gradient: ['#52B788', '#95D5B2'] as [string, string],
    open: true,
  },
  {
    id: '3', name: 'Pomegranate Estate', region: 'Goychay', type: 'Pomegranate Farm',
    price: '₼50', rating: '4.9', reviews: 203, distance: '85 km',
    tags: ['UNESCO Region', 'Harvest Season', 'Wine'],
    gradient: ['#7B1E1E', '#E74C3C'] as [string, string],
    open: true,
  },
  {
    id: '4', name: 'Hazelnut Hills', region: 'Zagatala', type: 'Nut Farm',
    price: '₼40', rating: '4.7', reviews: 64, distance: '180 km',
    tags: ['Nuts', 'Forest Walk', 'Workshops'],
    gradient: ['#5C3317', '#A0522D'] as [string, string],
    open: false,
  },
  {
    id: '5', name: 'Masalli Tea Garden', region: 'Masalli', type: 'Tea Plantation',
    price: '₼25', rating: '4.6', reviews: 112, distance: '230 km',
    tags: ['Tea', 'Folk Music', 'Traditional'],
    gradient: ['#1A4A2E', '#52B788'] as [string, string],
    open: true,
  },
  {
    id: '6', name: 'Quba Apple Farm', region: 'Quba', type: 'Apple Orchard',
    price: '₼30', rating: '4.5', reviews: 77, distance: '170 km',
    tags: ['Apple Picking', 'Cider', 'Scenic'],
    gradient: ['#8B0000', '#E8773A'] as [string, string],
    open: true,
  },
];

type Props = { navigation: any };

export default function FarmingScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const farms = FARMS.filter((f) => {
    const matchRegion = region === 'All' || f.region === region;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.region.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  const toggleFav = (id: string) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.header}>
        <View style={[styles.hBubble, { width: 160, height: 160, top: -50, right: -40 }]} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Farming Places</Text>
            <Text style={styles.headerSub}>Discover farms across Azerbaijan</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddPlace')}
          >
            <Ionicons name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={COLORS.textLight} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search farms, regions…"
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* ── Region filter ────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.regionScroll}
        style={styles.regionBar}
      >
        {REGIONS.map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRegion(r)}
            style={[styles.regionChip, region === r && styles.regionChipActive]}
            activeOpacity={0.75}
          >
            <Text style={[styles.regionText, region === r && styles.regionTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Farm list ────────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text style={styles.countLabel}>{farms.length} farms found</Text>

        {farms.map((farm) => (
          <TouchableOpacity key={farm.id} style={styles.farmCard} activeOpacity={0.88}>
            {/* Card header */}
            <LinearGradient colors={farm.gradient} style={styles.cardHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.cardHeroDeco} />
              <View style={styles.cardHeroTop}>
                <View style={[styles.openBadge, { backgroundColor: farm.open ? 'rgba(46,204,113,0.25)' : 'rgba(231,76,60,0.25)' }]}>
                  <View style={[styles.openDot, { backgroundColor: farm.open ? '#2ECC71' : '#E74C3C' }]} />
                  <Text style={[styles.openText, { color: farm.open ? '#2ECC71' : '#E74C3C' }]}>
                    {farm.open ? 'Open' : 'Closed'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => toggleFav(farm.id)}>
                  <Ionicons
                    name={favorites.includes(farm.id) ? 'heart' : 'heart-outline'}
                    size={22}
                    color={favorites.includes(farm.id) ? '#E74C3C' : COLORS.white}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.cardHeroBottom}>
                <Text style={styles.farmType}>{farm.type}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={11} color="#FFD700" />
                  <Text style={styles.ratingText}>{farm.rating}</Text>
                  <Text style={styles.reviewsText}>({farm.reviews})</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Card body */}
            <View style={styles.cardBody}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.farmName}>{farm.name}</Text>
                <Text style={styles.farmPrice}>{farm.price}<Text style={styles.farmPriceSub}>/person</Text></Text>
              </View>

              <View style={styles.farmMeta}>
                <Ionicons name="location-outline" size={12} color={COLORS.textLight} />
                <Text style={styles.farmMetaText}>{farm.region}</Text>
                <View style={styles.metaDot} />
                <Ionicons name="navigate-outline" size={12} color={COLORS.textLight} />
                <Text style={styles.farmMetaText}>{farm.distance}</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }} contentContainerStyle={{ gap: 6 }}>
                {farm.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.routeBtn}>
                  <Ionicons name="navigate-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.routeBtnText}>Get Route</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>Book Visit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 28, overflow: 'hidden' },
  hBubble: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.07)' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white, marginBottom: 2 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)' },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 12,
    paddingHorizontal: 14, height: 46,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },

  // Region filter
  regionBar: { maxHeight: 56, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  regionScroll: { paddingHorizontal: 16, alignItems: 'center', gap: 8 },
  regionChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: COLORS.cardAlt, borderWidth: 1, borderColor: COLORS.border,
  },
  regionChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  regionText: { fontSize: 13, fontWeight: '600', color: COLORS.textMedium },
  regionTextActive: { color: COLORS.white },

  // List
  list: { padding: 16 },
  countLabel: { fontSize: 13, color: COLORS.textLight, marginBottom: 12, fontWeight: '500' },

  // Farm card
  farmCard: {
    backgroundColor: COLORS.card, borderRadius: 18, marginBottom: 14,
    overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  },
  cardHero: { height: 110, padding: 14, justifyContent: 'space-between', overflow: 'hidden' },
  cardHeroDeco: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  cardHeroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  openBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  openDot: { width: 6, height: 6, borderRadius: 3 },
  openText: { fontSize: 11, fontWeight: '700' },
  cardHeroBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  farmType: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, color: COLORS.white, fontWeight: '700' },
  reviewsText: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },

  cardBody: { padding: 14 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  farmName: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, flex: 1 },
  farmPrice: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  farmPriceSub: { fontSize: 11, fontWeight: '400', color: COLORS.textLight },

  farmMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  farmMetaText: { fontSize: 12, color: COLORS.textLight },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.border },

  tag: {
    backgroundColor: COLORS.primaryXLight,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  tagText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },

  cardActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  routeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: 12, paddingVertical: 10,
  },
  routeBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  bookBtn: {
    flex: 1.5, backgroundColor: COLORS.primary,
    borderRadius: 12, paddingVertical: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  bookBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.white },
});
