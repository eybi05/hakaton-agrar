import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

// ── Category data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', name: 'Farms',             icon: 'leaf',          color: '#2D6A4F', bg: '#D8F3DC' },
  { id: '2', name: 'Village Tours',     icon: 'home',          color: '#5C6BC0', bg: '#E8EAF6' },
  { id: '3', name: 'Horse Riding',      icon: 'paw',           color: '#A67C52', bg: '#F3E5D0' },
  { id: '4', name: 'Organic Food',      icon: 'nutrition',     color: '#D35400', bg: '#FBE9E7' },
  { id: '5', name: 'Camping',           icon: 'flame',         color: '#E67E22', bg: '#FFF3E0' },
  { id: '6', name: 'Local Hotels',      icon: 'bed',           color: '#26A69A', bg: '#E0F2F1' },
  { id: '7', name: 'Traditional Foods', icon: 'restaurant',    color: '#C0392B', bg: '#FDEDEC' },
  { id: '8', name: 'Nature Activities', icon: 'partly-sunny',  color: '#27AE60', bg: '#EAFAF1' },
];

// ── Featured places ────────────────────────────────────────────────────────────
const FEATURED = [
  {
    id: '1',
    name: 'Green Valley Farm',
    location: 'Sheki, Azerbaijan',
    price: '₼45',
    rating: '4.8',
    gradient: ['#2D6A4F', '#52B788'] as [string, string],
  },
  {
    id: '2',
    name: 'Sunrise Horse Ranch',
    location: 'Gabala, Azerbaijan',
    price: '₼60',
    rating: '4.9',
    gradient: ['#A67C52', '#F4A261'] as [string, string],
  },
  {
    id: '3',
    name: 'Mountain Camp Site',
    location: 'Lahij, Azerbaijan',
    price: '₼30',
    rating: '4.7',
    gradient: ['#1B6CA8', '#4FC3F7'] as [string, string],
  },
];

type Props = { navigation: any };

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.headerTitle}>Find your farm escape</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            {/* Red dot for unread notifications */}
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── Search bar ─────────────────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={COLORS.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search farms, tours, activities..."
              placeholderTextColor={COLORS.textLight}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* ── Wallet balance banner ───────────────────────────────────────────── */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.walletBanner}
        >
          <View style={styles.walletLeft}>
            <Text style={styles.walletLabel}>My Wallet</Text>
            <Text style={styles.walletAmount}>₼ 250.00</Text>
            <Text style={styles.walletSub}>🪙 120 reward coins</Text>
          </View>
          <TouchableOpacity style={styles.topUpBtn}>
            <Ionicons name="add-circle-outline" size={16} color={COLORS.primary} />
            <Text style={styles.topUpText}>Top Up</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── Categories ─────────────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* 2-column grid of category cards */}
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={[styles.catCard, { backgroundColor: cat.bg }]} activeOpacity={0.8} onPress={() => navigation.navigate('Category', { category: cat.name })}>
              <View style={[styles.catIconWrap, { backgroundColor: cat.color + '22' }]}>
                <Ionicons name={cat.icon as any} size={26} color={cat.color} />
              </View>
              <Text style={[styles.catName, { color: cat.color }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Featured places ─────────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Places</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={FEATURED}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.88} style={styles.featuredCard}>
              <LinearGradient
                colors={item.gradient}
                style={styles.featuredGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Decorative circle */}
                <View style={styles.featuredCircle} />

                <View style={styles.featuredContent}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <Text style={styles.featuredName}>{item.name}</Text>
                  <View style={styles.featuredMeta}>
                    <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.featuredLocation}>{item.location}</Text>
                  </View>
                  <View style={styles.featuredFooter}>
                    <Text style={styles.featuredPrice}>
                      {item.price} <Text style={styles.featuredPriceSub}>/ person</Text>
                    </Text>
                    <TouchableOpacity style={styles.bookNowBtn}>
                      <Text style={styles.bookNowText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />

        {/* Bottom padding */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greeting: { fontSize: 13, color: COLORS.textLight, marginBottom: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: COLORS.card,
  },

  // Search
  searchRow: { flexDirection: 'row', paddingHorizontal: 20, marginVertical: 12, gap: 10 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Wallet banner
  walletBanner: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  walletLeft: { gap: 4 },
  walletLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  walletAmount: { fontSize: 26, fontWeight: '800', color: COLORS.white },
  walletSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  topUpText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  catCard: {
    width: (width - 42) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  catIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: { fontSize: 13, fontWeight: '600', textAlign: 'center' },

  // Featured cards
  featuredCard: { marginRight: 12 },
  featuredGradient: {
    width: width * 0.62,
    height: 185,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  featuredContent: { gap: 4 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 2,
  },
  ratingText: { fontSize: 11, color: COLORS.white, fontWeight: '600' },
  featuredName: { fontSize: 15, fontWeight: '700', color: COLORS.white },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  featuredLocation: { fontSize: 11, color: 'rgba(255,255,255,0.85)' },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  featuredPrice: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  featuredPriceSub: { fontSize: 11, fontWeight: '400', color: 'rgba(255,255,255,0.75)' },
  bookNowBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bookNowText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
});
