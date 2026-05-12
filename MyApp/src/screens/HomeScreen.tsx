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
const FEAT_W = width * 0.70;

const CATEGORIES = [
  { id: '0', label: 'All',               icon: 'grid-outline'          },
  { id: '1', label: 'Farms',             icon: 'leaf-outline'          },
  { id: '2', label: 'Village Tours',     icon: 'home-outline'          },
  { id: '3', label: 'Horse Riding',      icon: 'paw'                   },
  { id: '4', label: 'Organic Food',      icon: 'nutrition'             },
  { id: '5', label: 'Camping',           icon: 'flame-outline'         },
  { id: '6', label: 'Local Hotels',      icon: 'bed-outline'           },
  { id: '7', label: 'Traditional Foods', icon: 'restaurant-outline'    },
  { id: '8', label: 'Nature Activities', icon: 'partly-sunny-outline'  },
];

const FEATURED = [
  { id: '1', name: 'Green Valley Farm',   region: 'Sheki',   price: '₼45', rating: '4.8', tag: 'Organic',   gradient: ['#0D3D24', '#2D9D63'] as [string, string] },
  { id: '2', name: 'Sunrise Horse Ranch', region: 'Gabala',  price: '₼60', rating: '4.9', tag: 'Adventure', gradient: ['#5C3317', '#E8773A'] as [string, string] },
  { id: '3', name: 'Mountain Camp Site',  region: 'Lahij',   price: '₼30', rating: '4.7', tag: 'Camping',   gradient: ['#1A3A6E', '#4FC3F7'] as [string, string] },
  { id: '4', name: 'Pomegranate Estate',  region: 'Goychay', price: '₼50', rating: '4.9', tag: 'Harvest',   gradient: ['#7B1E1E', '#E74C3C'] as [string, string] },
];

const POPULAR = [
  { id: '1', name: 'Lahij Coppersmith Village', region: 'Lahij',  price: '₼30', rating: '4.9', color: '#5C6BC0', icon: 'home-outline'          },
  { id: '2', name: 'Honey & Herb Experience',   region: 'Gabala', price: '₼25', rating: '4.7', color: '#D35400', icon: 'nutrition'             },
  { id: '3', name: 'Tufandag Cable Car Trek',   region: 'Gabala', price: '₼35', rating: '4.8', color: '#27AE60', icon: 'partly-sunny-outline'  },
  { id: '4', name: 'Sheki Piti Clay Kitchen',   region: 'Sheki',  price: '₼30', rating: '4.9', color: '#C0392B', icon: 'restaurant-outline'    },
];

type Props = { navigation: any };

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('0');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={[styles.bubble, { width: 220, height: 220, top: -70, right: -60 }]} />
          <View style={[styles.bubble, { width: 100, height: 100, bottom: 10, left: -30 }]} />

          <View style={styles.heroTop}>
            <View>
              <View style={styles.locRow}>
                <Ionicons name="location" size={13} color={COLORS.goldLight} />
                <Text style={styles.locText}>Baku, Azerbaijan</Text>
              </View>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.heroTitle}>Find Your Farm Escape</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={COLORS.textLight} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search farms, tours, experiences…"
              placeholderTextColor={COLORS.textLight}
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.filterChip}>
              <Ionicons name="options-outline" size={15} color={COLORS.primary} />
              <Text style={styles.filterChipText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ── Quick stats (overlaps hero) ──────────────────────────────── */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statHalf} activeOpacity={0.85}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.primaryXLight }]}>
              <Ionicons name="wallet-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>₼ 250.00</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeText}>Top Up</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity style={styles.statHalf} activeOpacity={0.85}>
            <View style={[styles.statIcon, { backgroundColor: '#E8EAF6' }]}>
              <Ionicons name="calendar-outline" size={18} color="#5C6BC0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statLabel}>Bookings</Text>
              <Text style={[styles.statValue, { color: '#5C6BC0' }]}>3 Active</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: '#E8EAF6' }]}>
              <Text style={[styles.statBadgeText, { color: '#5C6BC0' }]}>View</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Categories ───────────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Browse Categories</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setActiveCat(cat.id);
                  if (cat.id !== '0') navigation.navigate('Category', { category: cat.label });
                }}
                style={[styles.catPill, active && styles.catPillActive]}
                activeOpacity={0.75}
              >
                <Ionicons name={cat.icon as any} size={14} color={active ? COLORS.white : COLORS.textMedium} />
                <Text style={[styles.catPillText, active && styles.catPillTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Featured experiences ─────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Featured Experiences</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featScroll}>
          {FEATURED.map((item) => (
            <TouchableOpacity key={item.id} style={{ width: FEAT_W }} activeOpacity={0.88}>
              <LinearGradient colors={item.gradient} style={styles.featCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.featDeco} />
                <View style={styles.featTop}>
                  <View style={styles.featTagBadge}>
                    <Text style={styles.featTagText}>{item.tag}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={10} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <View style={styles.featBottom}>
                  <Text style={styles.featName}>{item.name}</Text>
                  <View style={styles.featLocRow}>
                    <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.featLoc}>{item.region}, Azerbaijan</Text>
                  </View>
                  <View style={styles.featFooter}>
                    <Text style={styles.featPrice}>{item.price}<Text style={styles.featPriceSub}> /person</Text></Text>
                    <TouchableOpacity style={styles.bookBtn}>
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Popular near you ─────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Popular Near You</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <View style={styles.popularWrap}>
          {POPULAR.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.popularRow, i < POPULAR.length - 1 && styles.popularBorder]}
              activeOpacity={0.8}
            >
              <View style={[styles.popularThumb, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <View style={styles.popularInfo}>
                <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.popularMetaRow}>
                  <Ionicons name="location-outline" size={11} color={COLORS.textLight} />
                  <Text style={styles.popularMeta}>{item.region}</Text>
                </View>
              </View>
              <View style={styles.popularRight}>
                <Text style={styles.popularPrice}>{item.price}</Text>
                <View style={styles.popularRatRow}>
                  <Ionicons name="star" size={10} color={COLORS.goldLight} />
                  <Text style={styles.popularRat}>{item.rating}</Text>
                </View>
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

  // Hero
  hero: {
    paddingTop: 12, paddingHorizontal: 20, paddingBottom: 36,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute', borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 18,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locText: { fontSize: 12, color: 'rgba(255,255,255,0.72)', fontWeight: '500' },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 2 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white, letterSpacing: -0.4 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center', alignItems: 'center',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#E74C3C', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.8)',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 14,
    paddingHorizontal: 14, height: 50,
    shadowColor: 'rgba(0,0,0,0.25)', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primaryXLight,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  filterChipText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  // Stats
  statsRow: {
    flexDirection: 'row', marginHorizontal: 16, marginTop: -22,
    backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 14, elevation: 7,
  },
  statHalf: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  statDivider: { width: 1, backgroundColor: COLORS.divider, marginVertical: 10 },
  statIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
  statValue: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },
  statBadge: { backgroundColor: COLORS.primaryXLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statBadgeText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },

  // Section header
  secRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 22, marginBottom: 12,
  },
  secTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  seeAll: { fontSize: 13, color: COLORS.primaryLight, fontWeight: '600' },

  // Category pills
  catScroll: { paddingHorizontal: 16, gap: 8 },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    backgroundColor: COLORS.card, borderRadius: 24,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 3, elevation: 1,
  },
  catPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catPillText: { fontSize: 13, fontWeight: '600', color: COLORS.textMedium },
  catPillTextActive: { color: COLORS.white },

  // Featured cards
  featScroll: { paddingHorizontal: 16, gap: 12 },
  featCard: {
    height: 195, borderRadius: 20, padding: 16,
    justifyContent: 'space-between', overflow: 'hidden',
  },
  featDeco: {
    position: 'absolute', top: -45, right: -45,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  featTop: { flexDirection: 'row', justifyContent: 'space-between' },
  featTagBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  featTagText: { fontSize: 11, color: COLORS.white, fontWeight: '600' },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10,
  },
  ratingText: { fontSize: 11, color: COLORS.white, fontWeight: '600' },
  featBottom: { gap: 4 },
  featName: { fontSize: 17, fontWeight: '700', color: COLORS.white },
  featLocRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  featLoc: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  featFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  featPrice: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  featPriceSub: { fontSize: 11, fontWeight: '400', color: 'rgba(255,255,255,0.7)' },
  bookBtn: { backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  bookBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  // Popular list
  popularWrap: {
    marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 16,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2, overflow: 'hidden',
  },
  popularRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  popularBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  popularThumb: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  popularInfo: { flex: 1 },
  popularName: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 3 },
  popularMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  popularMeta: { fontSize: 12, color: COLORS.textLight },
  popularRight: { alignItems: 'flex-end', gap: 3 },
  popularPrice: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  popularRatRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  popularRat: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
});
