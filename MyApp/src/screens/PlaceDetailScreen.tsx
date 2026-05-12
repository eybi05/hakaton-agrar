import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

const INFO_ITEMS = [
  { label: 'Visitor Hours', value: '09:00 – 18:00', icon: 'time-outline' },
  { label: 'Entry Fee',     value: '₼5 / person',   icon: 'wallet-outline' },
  { label: 'Language',      value: 'Azerbaijani, EN', icon: 'language-outline' },
  { label: 'Best Season',   value: 'Apr – Oct',      icon: 'sunny-outline' },
];

type Props = {
  route: { params: { place: {
    id: string; name: string; location: string; era: string;
    tag: string; rating: string; desc: string;
    gradient: [string, string];
  }}};
  navigation: any;
};

export default function PlaceDetailScreen({ route, navigation }: Props) {
  const { place } = route.params;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <LinearGradient colors={place.gradient} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.heroDeco1} />
          <View style={styles.heroDeco2} />

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={styles.tagRow}>
              <View style={styles.tagChip}>
                <Text style={styles.tagChipText}>{place.tag}</Text>
              </View>
              <View style={styles.ratingChip}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>{place.rating}</Text>
              </View>
            </View>
            <Text style={styles.heroName}>{place.name}</Text>
            <View style={styles.locRow}>
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.locText}>{place.location}, Azerbaijan</Text>
            </View>
            <Text style={styles.eraText}>{place.era}</Text>
          </View>
        </LinearGradient>

        {/* ── Description ───────────────────────────────────────────── */}
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>About This Place</Text>
          <Text style={styles.descText}>{place.desc}</Text>
          <Text style={styles.descText}>
            {'\n'}This remarkable site stands as a testament to Azerbaijan's layered history. Visitors from around the world travel here to experience the unique blend of architecture, culture, and natural beauty that defines this location. Guided tours are available daily in multiple languages.
          </Text>

          {/* ── Info grid ─────────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Visitor Info</Text>
          <View style={styles.infoGrid}>
            {INFO_ITEMS.map((item) => (
              <View key={item.label} style={styles.infoCard}>
                <View style={[styles.infoIcon, { backgroundColor: COLORS.historicalXLight }]}>
                  <Ionicons name={item.icon as any} size={18} color={COLORS.historical} />
                </View>
                <Text style={styles.infoValue}>{item.value}</Text>
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Nearby ────────────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Nearby Experiences</Text>
          {['Local Cuisine Tour', 'Traditional Craft Workshop', 'Guided History Walk'].map((n) => (
            <TouchableOpacity key={n} style={styles.nearbyRow} activeOpacity={0.8}>
              <View style={[styles.nearbyIcon, { backgroundColor: COLORS.primaryXLight }]}>
                <Ionicons name="compass-outline" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.nearbyName}>{n}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Entry Fee</Text>
          <Text style={styles.bottomPrice}>₼5 <Text style={styles.bottomPriceSub}>/person</Text></Text>
        </View>
        <TouchableOpacity style={styles.planBtn}>
          <LinearGradient colors={[COLORS.historical, COLORS.historicalLight]} style={styles.planBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.planBtnText}>Plan My Visit</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Hero
  hero: { height: 280, padding: 20, justifyContent: 'space-between', overflow: 'hidden' },
  heroDeco1: {
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDeco2: {
    position: 'absolute', bottom: -30, left: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'flex-start',
  },
  heroContent: { gap: 6 },
  tagRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  tagChip: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  tagChipText: { fontSize: 11, color: COLORS.white, fontWeight: '700' },
  ratingChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  ratingText: { fontSize: 12, color: COLORS.white, fontWeight: '600' },
  heroName: { fontSize: 26, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locText: { fontSize: 13, color: 'rgba(255,255,255,0.82)' },
  eraText: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },

  // Body
  body: { padding: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark, marginTop: 20, marginBottom: 10 },
  descText: { fontSize: 14, color: COLORS.textMedium, lineHeight: 22 },

  // Info grid
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoCard: {
    width: (width - 56) / 2, backgroundColor: COLORS.card,
    borderRadius: 14, padding: 14, gap: 6,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  infoIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoValue: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  infoLabel: { fontSize: 11, color: COLORS.textLight },

  // Nearby
  nearbyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.card, borderRadius: 12,
    padding: 14, marginBottom: 8,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 1,
  },
  nearbyIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  nearbyName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textDark },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.card, paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
    shadowColor: 'rgba(0,0,0,0.1)', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 10,
  },
  bottomLabel: { fontSize: 12, color: COLORS.textLight },
  bottomPrice: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  bottomPriceSub: { fontSize: 13, fontWeight: '400', color: COLORS.textLight },
  planBtn: { borderRadius: 14, overflow: 'hidden' },
  planBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  planBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
