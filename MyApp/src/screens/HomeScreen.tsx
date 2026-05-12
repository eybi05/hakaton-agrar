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

// ── Subscription plans ────────────────────────────────────────────────────────
const PLANS = [
  {
    id: '1',
    duration: '1 Day',
    price: '$5',
    perDay: '$5/day',
    badge: null,
    features: ['Full access', 'All categories', 'Map view'],
    gradient: ['#3A3A5C', '#5C5C8A'] as [string, string],
  },
  {
    id: '2',
    duration: '10 Days',
    price: '$39',
    perDay: '$3.9/day',
    badge: 'Most Popular',
    features: ['Full access', 'All categories', 'Map view', 'Offline mode', 'Priority support'],
    gradient: [COLORS.primaryDark, COLORS.primaryLight] as [string, string],
  },
  {
    id: '3',
    duration: '30 Days',
    price: '$199',
    perDay: '$6.6/day',
    badge: 'Best Value',
    features: ['Full access', 'All categories', 'Map view', 'Offline mode', 'Priority support', 'Exclusive deals'],
    gradient: ['#7B4A00', '#E8A020'] as [string, string],
  },
];

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', label: 'Farms',              icon: 'leaf-outline'          },
  { id: '2', label: 'Village Tours',      icon: 'home-outline'          },
  { id: '3', label: 'Horse Riding',       icon: 'paw'                   },
  { id: '4', label: 'Organic Food',       icon: 'nutrition'             },
  { id: '5', label: 'Camping',            icon: 'flame-outline'         },
  { id: '6', label: 'Local Hotels',       icon: 'bed-outline'           },
  { id: '7', label: 'Traditional Foods',  icon: 'restaurant-outline'    },
  { id: '8', label: 'Nature Activities',  icon: 'partly-sunny-outline'  },
];

// ── Popular places ────────────────────────────────────────────────────────────
const POPULAR = [
  { id: '1', name: 'Lahij Coppersmith Village', region: 'Lahij',  price: '₼30', rating: '4.9', color: '#5C6BC0', icon: 'home-outline',         category: 'Village Tours'      },
  { id: '2', name: 'Honey & Herb Experience',   region: 'Gabala', price: '₼25', rating: '4.7', color: '#D35400', icon: 'nutrition',            category: 'Organic Food'       },
  { id: '3', name: 'Tufandag Cable Car Trek',   region: 'Gabala', price: '₼35', rating: '4.8', color: '#27AE60', icon: 'partly-sunny-outline', category: 'Nature Activities'  },
  { id: '4', name: 'Sheki Piti Clay Kitchen',   region: 'Sheki',  price: '₼30', rating: '4.9', color: '#C0392B', icon: 'restaurant-outline',   category: 'Traditional Foods'  },
  { id: '5', name: 'Sunrise Horse Ranch',       region: 'Gabala', price: '₼60', rating: '4.9', color: '#A67C52', icon: 'paw',                  category: 'Horse Riding'       },
  { id: '6', name: 'Green Valley Farm',         region: 'Sheki',  price: '₼45', rating: '4.8', color: COLORS.primary, icon: 'leaf-outline',    category: 'Farms'              },
];

type Props = { navigation: any };

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('2');

  const filteredPopular = POPULAR.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.region.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.topTitle}>Find your farm escape</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

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
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={17} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* ── Buy Subscription ─────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Buy Subscription</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Learn more</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.planScroll}
        >
          {PLANS.map((plan) => {
            const active = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.88}
                style={[styles.planCard, active && styles.planCardActive]}
              >
                <LinearGradient
                  colors={plan.gradient}
                  style={styles.planGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Decorative circle */}
                  <View style={styles.planDeco} />

                  {/* Badge */}
                  {plan.badge && (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  )}

                  {/* Price */}
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPerDay}>{plan.perDay}</Text>
                  </View>

                  {/* Duration */}
                  <Text style={styles.planDuration}>{plan.duration}</Text>

                  {/* Divider */}
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
                    <Text style={[styles.planBtnText, { color: plan.gradient[0] }]}>Get Started</Text>
                  </TouchableOpacity>
                </LinearGradient>
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

        <View style={styles.catGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Category', { category: cat.label })}
            >
              <Ionicons name={cat.icon as any} size={22} color={COLORS.primary} />
              <Text style={styles.catLabel} numberOfLines={2}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Popular Near You ─────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Popular Near You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.popularWrap}>
          {(search.length > 0 ? filteredPopular : POPULAR).map((item, i) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.popularRow, i < POPULAR.length - 1 && styles.popularBorder]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Category', { category: item.category })}
            >
              <View style={[styles.popularThumb, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <View style={styles.popularInfo}>
                <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.popularMetaRow}>
                  <Ionicons name="location-outline" size={11} color={COLORS.textLight} />
                  <Text style={styles.popularMeta}>{item.region}</Text>
                  <View style={styles.metaDot} />
                  <Text style={[styles.popularMeta, { color: item.color }]}>{item.category}</Text>
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

          {search.length > 0 && filteredPopular.length === 0 && (
            <View style={styles.emptySearch}>
              <Ionicons name="search-outline" size={32} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No results for "{search}"</Text>
            </View>
          )}
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

  // Section header
  secRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 22, marginBottom: 12,
  },
  secTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  seeAll: { fontSize: 13, color: COLORS.primaryLight, fontWeight: '600' },

  // Subscription plans
  planScroll: { paddingHorizontal: 16, gap: 12 },
  planCard: {
    width: width * 0.60, borderRadius: 20,
    shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 6,
  },
  planCardActive: {
    shadowColor: 'rgba(0,0,0,0.35)', shadowRadius: 16, elevation: 10,
    transform: [{ scale: 1.02 }],
  },
  planGradient: {
    borderRadius: 20, padding: 18, overflow: 'hidden', gap: 10,
  },
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

  planPriceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  planPrice: { fontSize: 34, fontWeight: '900', color: COLORS.white, letterSpacing: -1 },
  planPerDay: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 5 },
  planDuration: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '700' },

  planDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 2 },

  planFeatures: { gap: 6 },
  planFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  planFeatureText: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  planBtn: {
    backgroundColor: COLORS.white, borderRadius: 12,
    paddingVertical: 11, alignItems: 'center', marginTop: 4,
  },
  planBtnText: { fontSize: 14, fontWeight: '700' },

  // Category grid
  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, gap: 10,
  },
  catCard: {
    width: (width - 52) / 4,
    backgroundColor: COLORS.card, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', gap: 7,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 1,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  catLabel: {
    fontSize: 10, fontWeight: '600', color: COLORS.textMedium,
    textAlign: 'center', lineHeight: 13,
  },

  // Popular list
  popularWrap: {
    marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 16,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2, overflow: 'hidden',
  },
  popularRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  popularBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  popularThumb: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  popularInfo: { flex: 1 },
  popularName: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 3 },
  popularMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  popularMeta: { fontSize: 11, color: COLORS.textLight },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.border },
  popularRight: { alignItems: 'flex-end', gap: 3 },
  popularPrice: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  popularRatRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  popularRat: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },

  // Empty
  emptySearch: { padding: 32, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 14, color: COLORS.textLight, textAlign: 'center' },
});
