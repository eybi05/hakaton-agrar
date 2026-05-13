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
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { COLORS } from '../theme/colors';
import TokenBar from '../components/TokenBar';
import { useBadges } from '../context/BadgeContext';
import { useTokens } from '../context/TokenContext';
import { MARKETPLACE_ITEMS, MarketplaceItem } from '../data/marketplaceData';

// Azerbaijan bounding box — map cannot scroll outside this
const AZ_BOUNDS = { minLat: 38.25, maxLat: 41.95, minLng: 44.75, maxLng: 50.75 };
const AZ_REGION = { latitude: 40.1, longitude: 47.7, latitudeDelta: 4.2, longitudeDelta: 5.8 };

const { width } = Dimensions.get('window');

// ── Subscription plans (different heights via feature count) ──────────────────
const PLANS = [
  {
    id: '1',
    duration: '1 Day',
    price: '$5',
    perDay: '$5 / day',
    badge: null,
    cardHeight: 210,
    features: ['Full access', 'All categories'],
    gradient: ['#2C2C4E', '#4A4A78'] as [string, string],
    btnColor: '#2C2C4E',
  },
  {
    id: '2',
    duration: '10 Days',
    price: '$39',
    perDay: '$3.9 / day',
    badge: 'Most Popular',
    cardHeight: 270,
    features: ['Full access', 'All categories', 'Offline mode', 'Map view'],
    gradient: [COLORS.primaryDark, COLORS.primaryLight] as [string, string],
    btnColor: COLORS.primaryDark,
  },
  {
    id: '3',
    duration: '30 Days',
    price: '$199',
    perDay: '$6.6 / day',
    badge: 'Best Value',
    cardHeight: 320,
    features: ['Full access', 'All categories', 'Offline mode', 'Map view', 'Priority support', 'Exclusive deals'],
    gradient: ['#7B4A00', '#E8A020'] as [string, string],
    btnColor: '#7B4A00',
  },
];

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', label: 'Farms',             icon: 'leaf-outline'         },
  { id: '2', label: 'Village Tours',     icon: 'home-outline'         },
  { id: '3', label: 'Horse Riding',      icon: 'paw'                  },
  { id: '4', label: 'Organic Food',      icon: 'nutrition'            },
  { id: '5', label: 'Camping',           icon: 'flame-outline'        },
  { id: '6', label: 'Local Hotels',      icon: 'bed-outline'          },
  { id: '7', label: 'Traditional Foods', icon: 'restaurant-outline'   },
  { id: '8', label: 'Nature',            icon: 'partly-sunny-outline' },
];

// ── Map markers ───────────────────────────────────────────────────────────────
const MARKERS = [
  { id: '1', title: 'Green Valley Farm',       region: 'Sheki',  lat: 41.1984, lng: 47.1705, color: COLORS.primary  },
  { id: '2', title: 'Sunrise Horse Ranch',     region: 'Gabala', lat: 40.9893, lng: 47.8418, color: '#A67C52'       },
  { id: '3', title: 'Mountain Camp Site',      region: 'Lahij',  lat: 40.8370, lng: 48.3790, color: '#1A3A6E'       },
  { id: '4', title: 'Lahij Craft Village',     region: 'Lahij',  lat: 40.8420, lng: 48.3830, color: '#5C6BC0'       },
  { id: '5', title: 'Pomegranate Estate',      region: 'Goychay',lat: 40.6560, lng: 47.7400, color: '#C0392B'       },
  { id: '6', title: 'Sheki Khan Palace',       region: 'Sheki',  lat: 41.1960, lng: 47.1750, color: '#4A1D96'       },
];

const USER_NAME = 'Daşdəmir';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return `Good morning, ${USER_NAME} ☀️`;
  if (h >= 12 && h < 17) return `Good afternoon, ${USER_NAME} 🌤️`;
  if (h >= 17 && h < 21) return `Good evening, ${USER_NAME} 🌇`;
  return `Good night, ${USER_NAME} 🌙`;
};

type Props = { navigation: any };

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch]           = useState('');
  const [selectedPlan, setSelectedPlan] = useState('2');
  const [marketCat, setMarketCat]     = useState('Hamısı');
  const { notifications, clearNotifications } = useBadges();
  const { balance, spendTokens }      = useTokens();

  // ── Live search filtering ──────────────────────────────────────────────────
  const searchLower = search.toLowerCase();
  const filteredCategories = CATEGORIES.filter(
    (c) => !search || c.label.toLowerCase().includes(searchLower),
  );
  const filteredMarket = MARKETPLACE_ITEMS.filter(
    (m) =>
      (!search || m.azName.toLowerCase().includes(searchLower) || m.name.toLowerCase().includes(searchLower)) &&
      (marketCat === 'Hamısı' || m.category === marketCat),
  );

  const handleBuy = (item: MarketplaceItem) => {
    if (spendTokens(item.tokenCost)) {
      alert(`✅ ${item.azName} — ${item.discount} endirimi aktiv edildi!`);
    } else {
      alert(`❌ Kifayət qədər token yoxdur. Lazımi: ${item.tokenCost}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.topTitle}>Find your farm escape</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={clearNotifications}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            {notifications > 0 ? (
              <View style={styles.notifCount}>
                <Text style={styles.notifCountText}>{notifications > 9 ? '9+' : notifications}</Text>
              </View>
            ) : (
              <View style={styles.notifDot} />
            )}
          </TouchableOpacity>
        </View>

        {/* ── Token bar ────────────────────────────────────────────────── */}
        <TokenBar />

        {/* ── Search bar ───────────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textLight} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search farms, tours, experiences…"
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={{ marginRight: 4 }}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={17} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* ── Token Marketplace ────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Token ilə Al</Text>
          <Text style={styles.balancePill}>🪙 {balance.toLocaleString()}</Text>
        </View>

        {/* Category filter for marketplace */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marketCatScroll}>
          {['Hamısı', 'Transport', 'Restaurant', 'Farm Hotel', 'Special Tour'].map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setMarketCat(cat)}
              style={[styles.marketCatChip, marketCat === cat && styles.marketCatChipActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.marketCatText, marketCat === cat && styles.marketCatTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marketScroll}>
          {filteredMarket.map((item) => (
            <View key={item.id} style={styles.marketCard}>
              <LinearGradient colors={item.gradient} style={styles.marketGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.marketDeco} />
                <Text style={styles.marketEmoji}>{item.emoji}</Text>
                <Text style={styles.marketDiscount}>{item.discount} OFF</Text>
                <Text style={styles.marketName}>{item.azName}</Text>
                <Text style={styles.marketDesc} numberOfLines={2}>{item.description}</Text>
                <TouchableOpacity style={styles.marketBuyBtn} onPress={() => handleBuy(item)} activeOpacity={0.85}>
                  <Text style={styles.marketBuyText}>🪙 {item.tokenCost}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ))}
          {filteredMarket.length === 0 && (
            <View style={styles.marketEmpty}>
              <Text style={styles.marketEmptyText}>Nəticə tapılmadı</Text>
            </View>
          )}
        </ScrollView>

        {/* ── Buy Subscription ─────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Buy Subscription</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Learn more</Text>
          </TouchableOpacity>
        </View>

        {/*
          Different heights: alignItems:'flex-end' anchors all cards to the
          bottom of the scroll row so the tallest card sits flush while shorter
          ones appear shorter above the baseline.
        */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.planScroll}
          alwaysBounceHorizontal={false}
        >
          {PLANS.map((plan) => {
            const active = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.88}
                style={[
                  styles.planWrapper,
                  { height: plan.cardHeight },
                  active && styles.planWrapperActive,
                ]}
              >
                <LinearGradient
                  colors={plan.gradient}
                  style={styles.planGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.planDeco} />

                  {/* Badge */}
                  {plan.badge ? (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  ) : (
                    <View style={{ height: 24 }} />
                  )}

                  {/* Price */}
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPerDay}>{plan.perDay}</Text>
                  <Text style={styles.planDuration}>{plan.duration}</Text>

                  <View style={styles.planDivider} />

                  {/* Features */}
                  <View style={styles.planFeatures}>
                    {plan.features.map((f) => (
                      <View key={f} style={styles.planFeatureRow}>
                        <Ionicons name="checkmark-circle" size={13} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.planFeatureText}>{f}</Text>
                      </View>
                    ))}
                  </View>

                  {/* CTA */}
                  <TouchableOpacity style={styles.planBtn} activeOpacity={0.85}>
                    <Text style={[styles.planBtnText, { color: plan.btnColor }]}>Get Started</Text>
                  </TouchableOpacity>
                </LinearGradient>

                {/* Active selection ring */}
                {active && <View style={[styles.activeRing, { borderColor: plan.gradient[1] }]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Browse Categories ────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Browse Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Centered grid — justifyContent:'center' on each row */}
        <View style={styles.catGrid}>
          {filteredCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Category', { category: cat.label })}
            >
              <View style={styles.catIconWrap}>
                <Ionicons name={cat.icon as any} size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.catLabel} numberOfLines={2}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Map ──────────────────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Explore on Map</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FullMap')}>
            <Text style={styles.seeAll}>Full map ↗</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapWrap}>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={AZ_REGION}
            scrollEnabled={false}
            zoomEnabled={false}
            showsUserLocation
            showsMyLocationButton={false}
            minZoomLevel={6}
            maxZoomLevel={14}
          >
            {MARKERS.map((m) => (
              <Marker
                key={m.id}
                coordinate={{ latitude: m.lat, longitude: m.lng }}
                title={m.title}
                description={m.region}
                pinColor={m.color}
              />
            ))}
          </MapView>

          {/* Map overlay legend */}
          <View style={styles.mapLegend}>
            <Ionicons name="location" size={14} color={COLORS.primary} />
            <Text style={styles.mapLegendText}>{MARKERS.length} places near you</Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 8 },

  // Top bar
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10,
  },
  greeting: { fontSize: 13, color: COLORS.textLight, marginBottom: 2 },
  topTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.3 },
  notifBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 3,
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.error, borderWidth: 1.5, borderColor: COLORS.card,
  },
  notifCount: {
    position: 'absolute', top: 5, right: 5,
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.error,
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: COLORS.card,
  },
  notifCountText: { fontSize: 10, fontWeight: '800', color: COLORS.white },

  // Search bar
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 14,
    marginHorizontal: 20, marginBottom: 4,
    paddingLeft: 16, paddingRight: 6, paddingVertical: 6,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark, paddingVertical: 6 },
  filterBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginLeft: 6,
  },

  // Marketplace
  balancePill: { fontSize: 13, fontWeight: '700', color: COLORS.gold },
  marketCatScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  marketCatChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18,
    backgroundColor: COLORS.cardAlt, borderWidth: 1.5, borderColor: COLORS.border,
  },
  marketCatChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  marketCatText: { fontSize: 12, fontWeight: '700', color: COLORS.textMedium },
  marketCatTextActive: { color: COLORS.white },
  marketScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  marketCard: {
    width: width * 0.54, borderRadius: 18,
    shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 5,
  },
  marketGrad: { borderRadius: 18, padding: 16, gap: 6, overflow: 'hidden', minHeight: 180 },
  marketDeco: {
    position: 'absolute', top: -30, right: -30,
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  marketEmoji: { fontSize: 28 },
  marketDiscount: { fontSize: 22, fontWeight: '900', color: COLORS.white, letterSpacing: -0.5 },
  marketName: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  marketDesc: { fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 15 },
  marketBuyBtn: {
    marginTop: 6, backgroundColor: COLORS.white,
    borderRadius: 12, paddingVertical: 9, alignItems: 'center',
  },
  marketBuyText: { fontSize: 13, fontWeight: '800', color: COLORS.textDark },
  marketEmpty: { padding: 32, alignItems: 'center' },
  marketEmptyText: { fontSize: 14, color: COLORS.textLight },

  // Section header
  secRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 22, marginBottom: 12,
  },
  secTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  seeAll: { fontSize: 13, color: COLORS.primaryLight, fontWeight: '600' },

  // Plans — anchored to bottom so different heights are obvious
  planScroll: {
    paddingHorizontal: 16, gap: 12,
    alignItems: 'flex-end',    // cards sit on the same baseline; taller ones rise higher
    paddingBottom: 6,
  },
  planWrapper: {
    width: width * 0.58, borderRadius: 20,
    shadowColor: 'rgba(0,0,0,0.22)', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1, shadowRadius: 14, elevation: 7,
    overflow: 'visible',
  },
  planWrapperActive: {
    shadowColor: 'rgba(0,0,0,0.38)', elevation: 12,
    transform: [{ scale: 1.03 }],
  },
  planGradient: { flex: 1, borderRadius: 20, padding: 18, overflow: 'hidden', gap: 8 },
  planDeco: {
    position: 'absolute', top: -40, right: -40,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  planBadgeText: { fontSize: 11, color: COLORS.white, fontWeight: '700' },
  planPrice: { fontSize: 36, fontWeight: '900', color: COLORS.white, letterSpacing: -1 },
  planPerDay: { fontSize: 11, color: 'rgba(255,255,255,0.62)', marginTop: -6 },
  planDuration: { fontSize: 15, color: 'rgba(255,255,255,0.92)', fontWeight: '700' },
  planDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  planFeatures: { flex: 1, gap: 7 },
  planFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  planFeatureText: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  planBtn: {
    backgroundColor: COLORS.white, borderRadius: 12,
    paddingVertical: 11, alignItems: 'center',
  },
  planBtnText: { fontSize: 14, fontWeight: '700' },
  activeRing: {
    position: 'absolute', inset: -3 as any,
    borderRadius: 23, borderWidth: 2.5,
  },

  // Categories — centered
  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16, gap: 10,
  },
  catCard: {
    width: (width - 72) / 4,
    backgroundColor: COLORS.card, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', gap: 7,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 1,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  catIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.primaryXLight,
    justifyContent: 'center', alignItems: 'center',
  },
  catLabel: {
    fontSize: 10, fontWeight: '600', color: COLORS.textMedium,
    textAlign: 'center', lineHeight: 13,
  },

  // Map
  mapWrap: {
    marginHorizontal: 16, borderRadius: 18, overflow: 'hidden',
    height: 280,
    shadowColor: 'rgba(0,0,0,0.15)', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 5,
  },
  map: { flex: 1 },
  mapLegend: {
    position: 'absolute', bottom: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    shadowColor: 'rgba(0,0,0,0.15)', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 3,
  },
  mapLegendText: { fontSize: 12, fontWeight: '600', color: COLORS.textDark },
});
