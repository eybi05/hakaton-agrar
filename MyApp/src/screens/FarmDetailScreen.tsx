import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

const TYPE_EMOJI: Record<string, string> = {
  'Organic Farm':    '🌿',
  'Fruit Orchard':   '🍎',
  'Pomegranate Farm':'🌸',
  'Nut Farm':        '🌰',
  'Tea Plantation':  '🫖',
  'Apple Orchard':   '🍏',
  'Vineyard':        '🍇',
  'Livestock':       '🐄',
  'Other':           '🏡',
};

type Props = { navigation: any; route: any };

export default function FarmDetailScreen({ navigation, route }: Props) {
  const farm = route.params?.farm;
  const [activePhoto, setActivePhoto] = useState(0);

  if (!farm) return null;

  const emoji = TYPE_EMOJI[farm.type] ?? '🏡';
  const photos: string[] = farm.photos ?? [];

  const handleBook = () => {
    Alert.alert(
      '🌾 Book a Visit',
      `You're about to request a visit to ${farm.name}.\n\nA confirmation will be sent within 24 hours.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => Alert.alert('✅ Requested!', 'Your visit request has been sent.') },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <View style={styles.hero}>
          {photos.length > 0 ? (
            <Image source={{ uri: photos[activePhoto] }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={farm.gradient ?? [COLORS.primaryDark, COLORS.primary]}
              style={styles.heroImage}
            >
              <Text style={styles.heroEmoji}>{emoji}</Text>
            </LinearGradient>
          )}

          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)']}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          </TouchableOpacity>

          {/* Open/closed badge */}
          <View style={[styles.openBadge, { backgroundColor: farm.open ? 'rgba(46,204,113,0.25)' : 'rgba(231,76,60,0.25)' }]}>
            <View style={[styles.openDot, { backgroundColor: farm.open ? '#2ECC71' : '#E74C3C' }]} />
            <Text style={[styles.openText, { color: farm.open ? '#2ECC71' : '#E74C3C' }]}>
              {farm.open ? 'Open' : 'Closed'}
            </Text>
          </View>

          {/* Farm name overlay */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroName}>{farm.name}</Text>
            <View style={styles.heroMeta}>
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.85)" />
              <Text style={styles.heroMetaText}>{farm.region}</Text>
              <View style={styles.heroDot} />
              <Text style={styles.heroMetaText}>{farm.type}</Text>
            </View>
          </View>
        </View>

        {/* ── Photo gallery dots (if multiple photos) ────────────── */}
        {photos.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbRow}
          >
            {photos.map((uri, i) => (
              <TouchableOpacity key={i} onPress={() => setActivePhoto(i)} activeOpacity={0.8}>
                <Image
                  source={{ uri }}
                  style={[styles.thumb, i === activePhoto && styles.thumbActive]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Stats row ──────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.statNum}>{farm.rating}</Text>
            <Text style={styles.statLbl}>({farm.reviews} reviews)</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="cash-outline" size={16} color={COLORS.primary} />
            <Text style={styles.statNum}>{farm.price}</Text>
            <Text style={styles.statLbl}>per person</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="navigate-outline" size={16} color={COLORS.primary} />
            <Text style={styles.statNum}>{farm.distance}</Text>
            <Text style={styles.statLbl}>away</Text>
          </View>
        </View>

        {/* ── Tags ───────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsRow}
        >
          {(farm.tags ?? []).map((tag: string) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── About ──────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Farm</Text>
          <Text style={styles.aboutText}>
            {`Welcome to ${farm.name}, located in the beautiful ${farm.region} region of Azerbaijan. ` +
             `This ${farm.type.toLowerCase()} offers an authentic agro-tourism experience, ` +
             `connecting visitors with local farming traditions and natural landscapes. ` +
             `Whether you're looking to pick fresh produce, learn traditional farming techniques, ` +
             `or simply enjoy the peaceful rural atmosphere, ${farm.name} provides an unforgettable experience.`}
          </Text>
        </View>

        {/* ── What to expect ─────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          {[
            { icon: '🌅', text: 'Guided farm tours with local experts' },
            { icon: '🍽️', text: 'Traditional Azerbaijani food & drinks' },
            { icon: '📸', text: 'Photo opportunities in scenic surroundings' },
            { icon: '🛍️', text: 'Fresh local produce to take home' },
          ].map((item) => (
            <View key={item.text} style={styles.expectRow}>
              <Text style={styles.expectEmoji}>{item.icon}</Text>
              <Text style={styles.expectText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* ── Visit info ─────────────────────────────────────────── */}
        <View style={styles.infoCard}>
          {[
            { label: 'Hours',    value: '08:00 – 18:00', icon: 'time-outline' },
            { label: 'Region',   value: farm.region,      icon: 'location-outline' },
            { label: 'Price',    value: `${farm.price}/person`, icon: 'cash-outline' },
            { label: 'Type',     value: farm.type,         icon: 'leaf-outline' },
          ].map((r) => (
            <View key={r.label} style={styles.infoRow}>
              <Ionicons name={r.icon as any} size={16} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{r.label}</Text>
              <Text style={styles.infoValue}>{r.value}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky action bar ────────────────────────────────────── */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.routeBtn} activeOpacity={0.8}>
          <Ionicons name="navigate-outline" size={18} color={COLORS.primary} />
          <Text style={styles.routeBtnText}>Get Route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook} activeOpacity={0.85}>
          <LinearGradient
            colors={[COLORS.primaryDark, COLORS.primary]}
            style={styles.bookBtnGrad}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={styles.bookBtnText}>Book a Visit</Text>
            <Text style={styles.bookBtnPrice}>{farm.price}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Hero
  hero:      { height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  heroEmoji: { fontSize: 80, opacity: 0.85 },
  backBtn: {
    position: 'absolute', top: 16, left: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },
  openBadge: {
    position: 'absolute', top: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  openDot:  { width: 6, height: 6, borderRadius: 3 },
  openText: { fontSize: 12, fontWeight: '700' },
  heroBottom: {
    position: 'absolute', bottom: 18, left: 18, right: 18, gap: 5,
  },
  heroName: { fontSize: 26, fontWeight: '900', color: COLORS.white, letterSpacing: -0.5 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  heroDot:  { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.5)' },

  // Gallery thumbs
  thumbRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  thumb:     { width: 72, height: 56, borderRadius: 8 },
  thumbActive: { borderWidth: 2.5, borderColor: COLORS.primary },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, marginHorizontal: 16,
    borderRadius: 14, padding: 14, marginTop: 12,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  statItem:    { flex: 1, alignItems: 'center', gap: 2 },
  statNum:     { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  statLbl:     { fontSize: 10, color: COLORS.textLight },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.divider },

  // Tags
  tagsRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tag:     { backgroundColor: COLORS.primaryXLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

  // Section
  section:      { paddingHorizontal: 16, marginTop: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 },
  aboutText:    { fontSize: 14, color: COLORS.textMedium, lineHeight: 22 },
  expectRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 7 },
  expectEmoji:  { fontSize: 20, width: 28 },
  expectText:   { fontSize: 14, color: COLORS.textMedium, flex: 1 },

  // Info card
  infoCard: {
    margin: 16, backgroundColor: COLORS.card, borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  infoLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textMedium, width: 60 },
  infoValue: { fontSize: 13, color: COLORS.textDark, flex: 1, textAlign: 'right' },

  // Action bar
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    backgroundColor: COLORS.card,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
    shadowColor: 'rgba(0,0,0,0.1)', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 8,
  },
  routeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 13, paddingHorizontal: 18,
  },
  routeBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  bookBtn:      { flex: 1, borderRadius: 14, overflow: 'hidden' },
  bookBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13,
  },
  bookBtnText:  { fontSize: 15, fontWeight: '800', color: COLORS.white },
  bookBtnPrice: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.75)' },
});
