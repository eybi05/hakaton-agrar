import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBadges } from '../context/BadgeContext';
import { BADGE_DEFINITIONS, BADGE_CATEGORIES, CATEGORY_THEMES } from '../data/badgeData';
import { BadgeCategory } from '../types/badges';
import BadgeCard from '../components/BadgeCard';
import TokenBar from '../components/TokenBar';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

// Activity demo buttons — so user can test the system
const DEMO_ACTIVITIES = [
  { label: '🍎 Alma yığ',       activityType: 'gather_apple'       },
  { label: '🍇 Üzüm yığ',       activityType: 'gather_grape'       },
  { label: '🐴 At min',         activityType: 'horse_riding'       },
  { label: '🐄 Heyvan bəslə',   activityType: 'feed_animal'        },
  { label: '🌾 Ferma işi',       activityType: 'farm_task'          },
  { label: '🗺️ Region ziyarəti', activityType: 'visit_region'       },
  { label: '❤️ Ferma ziyarəti', activityType: 'visit_farm'         },
  { label: '🍽️ Yerli yemək',    activityType: 'try_local_food'     },
  { label: '🌱 Eko fəaliyyət',   activityType: 'eco_activity'       },
  { label: '🏘️ Kənd ziyarəti',  activityType: 'visit_village'      },
];

type Props = { navigation: any };

export default function RewardsScreen({ navigation }: Props) {
  const { userBadges, completeActivity, getUnlockedCount, getTotalCount } = useBadges();
  const [activeCategory, setActiveCategory] = useState<string>('Hamısı');
  const [showDemo, setShowDemo] = useState(false);

  const unlockedCount = getUnlockedCount();
  const totalCount    = getTotalCount();

  // Filter badges by selected category
  const filteredBadges = BADGE_DEFINITIONS.filter(
    (b) => activeCategory === 'Hamısı' || b.category === activeCategory,
  );

  // Group by category for display
  const grouped: Record<string, typeof BADGE_DEFINITIONS> = {};
  filteredBadges.forEach((b) => {
    if (!grouped[b.category]) grouped[b.category] = [];
    grouped[b.category].push(b);
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <LinearGradient colors={['#4A1D96', '#7C3AED']} style={styles.header}>
        <View style={[styles.hBubble, { width: 160, height: 160, top: -50, right: -40 }]} />

        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Mükafatlar</Text>
            <Text style={styles.headerSub}>Açılıb: {unlockedCount}/{totalCount}</Text>
          </View>
          {/* Demo toggle */}
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => setShowDemo((v) => !v)}
          >
            <Ionicons name="play-circle-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Ranking pill */}
        <TouchableOpacity style={styles.rankingBtn} activeOpacity={0.8}>
          <Ionicons name="trophy" size={14} color="#F5C518" />
          <Text style={styles.rankingText}>34 şəxs arasındakı yeriniz: 14</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Overall progress bar */}
        <View style={styles.overallBar}>
          <View style={[styles.overallFill, { width: `${(unlockedCount / totalCount) * 100}%` as any }]} />
        </View>
      </LinearGradient>

      {/* ── Token bar ────────────────────────────────────────────────── */}
      <TokenBar />

      {/* ── Demo activity buttons ─────────────────────────────────────── */}
      {showDemo && (
        <View style={styles.demoPanel}>
          <Text style={styles.demoPanelTitle}>Fəaliyyət simulyasiyası (test üçün)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
            {DEMO_ACTIVITIES.map((a) => (
              <TouchableOpacity
                key={a.activityType}
                style={styles.demoChip}
                onPress={() => completeActivity(a.activityType)}
                activeOpacity={0.75}
              >
                <Text style={styles.demoChipText}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Category filter ───────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
        style={styles.catBar}
      >
        {BADGE_CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          const catTheme = CATEGORY_THEMES[cat];
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.catChip,
                active && catTheme
                  ? { backgroundColor: catTheme.accent, borderColor: catTheme.accent }
                  : active && styles.catChipActive,
              ]}
              activeOpacity={0.75}
            >
              {catTheme && <Text style={styles.catChipIcon}>{catTheme.icon}</Text>}
              <Text style={[styles.catChipText, active && styles.catChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Badge grid ────────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {Object.entries(grouped).map(([category, badges]) => {
          const theme = CATEGORY_THEMES[category];
          const unlockedInCat = badges.filter(
            (b) => (userBadges[b.id]?.currentLevel ?? 0) > 0,
          ).length;
          return (
          <View key={category} style={styles.categorySection}>
            {/* Category header */}
            {theme ? (
              <LinearGradient
                colors={theme.gradient as [string, string]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.categoryHeader}
              >
                <Text style={styles.categoryIcon}>{theme.icon}</Text>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.categoryCount}>{unlockedInCat}/{badges.length}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.categoryHeaderPlain}>
                <View style={styles.categoryLine} />
                <Text style={[styles.categoryTitle, { color: COLORS.textMedium }]}>{category}</Text>
                <View style={styles.categoryLine} />
              </View>
            )}

            {/* Badge row — 3 per row */}
            <View style={styles.badgeRow}>
              {badges.map((def) => (
                <BadgeCard
                  key={def.id}
                  definition={def}
                  userBadge={userBadges[def.id] ?? { id: def.id, currentProgress: 0, currentLevel: 0, claimedLevels: [] }}
                />
              ))}
              {/* Filler to keep grid aligned */}
              {badges.length % 3 !== 0 &&
                Array.from({ length: 3 - (badges.length % 3) }).map((_, i) => (
                  <View key={`filler-${i}`} style={{ width: (width - 48) / 3 }} />
                ))
              }
            </View>
          </View>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 18, overflow: 'hidden', gap: 12 },
  hBubble: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.07)' },

  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 1 },
  demoBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },

  rankingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
  },
  rankingText: { fontSize: 12, color: COLORS.white, fontWeight: '600' },

  overallBar: {
    height: 6, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3, overflow: 'hidden',
  },
  overallFill: { height: '100%', backgroundColor: '#F5C518', borderRadius: 3 },

  // Demo panel
  demoPanel: {
    backgroundColor: COLORS.aiXLight,
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  demoPanelTitle: {
    fontSize: 11, color: COLORS.aiLight, fontWeight: '700',
    paddingHorizontal: 16, marginBottom: 6,
  },
  demoScroll: { paddingHorizontal: 16, gap: 8 },
  demoChip: {
    backgroundColor: COLORS.aiLight,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16,
  },
  demoChipText: { fontSize: 12, color: COLORS.white, fontWeight: '600' },

  // Category filter
  catBar: {
    maxHeight: 56, backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  catScroll: { paddingHorizontal: 14, alignItems: 'center', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 22,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  catChipActive: { backgroundColor: '#4A1D96', borderColor: '#4A1D96' },
  catChipIcon: { fontSize: 13 },
  catChipText: { fontSize: 12, fontWeight: '700', color: COLORS.textMedium },
  catChipTextActive: { color: COLORS.white },

  // Badge grid
  grid: { paddingHorizontal: 16, paddingTop: 8 },

  categorySection: { marginBottom: 18 },

  // Gradient themed header
  categoryHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    marginBottom: 10,
  },
  categoryIcon: { fontSize: 18 },
  categoryTitle: {
    fontSize: 13, fontWeight: '800', color: COLORS.white,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  categoryCount: {
    fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.75)',
  },

  // Fallback plain header (for 'Hamısı' etc.)
  categoryHeaderPlain: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4,
  },
  categoryLine: { flex: 1, height: 1, backgroundColor: COLORS.divider },

  badgeRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'flex-start', gap: 8,
  },
});
