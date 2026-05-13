import React, { useState } from 'react';
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

const DAILY_MISSIONS = [
  { id: '1', title: 'Visit a Farm',          desc: 'Check in at any farm experience',    xp: 50,  progress: 0.8,  done: false, icon: 'leaf-outline',       color: COLORS.primary },
  { id: '2', title: 'Leave a Review',         desc: 'Rate any experience you visited',    xp: 30,  progress: 1.0,  done: true,  icon: 'star-outline',       color: COLORS.goldLight },
  { id: '3', title: 'Complete Your Profile',  desc: 'Add photo and bio to your profile',  xp: 20,  progress: 1.0,  done: true,  icon: 'person-outline',     color: '#5C6BC0' },
  { id: '4', title: 'Share an Experience',    desc: 'Share a place with a friend',        xp: 25,  progress: 0.4,  done: false, icon: 'share-outline',      color: '#26A69A' },
  { id: '5', title: 'Explore Historical',     desc: 'View 3 historical places',           xp: 40,  progress: 0.33, done: false, icon: 'business-outline',   color: COLORS.historicalLight },
];

const WEEKLY_CHALLENGES = [
  { id: 'w1', title: 'Farm Explorer',        desc: 'Visit 3 different farm types',       xp: 150, progress: 0.67, icon: 'leaf',          color: COLORS.primary },
  { id: 'w2', title: 'History Buff',         desc: 'Visit 5 historical places',          xp: 200, progress: 0.4,  icon: 'business',      color: COLORS.historical },
  { id: 'w3', title: 'Top Reviewer',         desc: 'Write 5 detailed reviews',           xp: 100, progress: 0.6,  icon: 'star',          color: COLORS.goldLight },
];

const BADGES = [
  { id: 'b1',  label: 'First Farm',       icon: 'leaf',              earned: true,  color: COLORS.primary    },
  { id: 'b2',  label: 'Reviewer',         icon: 'star',              earned: true,  color: COLORS.goldLight  },
  { id: 'b3',  label: 'Camper',           icon: 'flame',             earned: true,  color: '#E67E22'         },
  { id: 'b4',  label: 'Food Lover',       icon: 'restaurant',        earned: true,  color: '#C0392B'         },
  { id: 'b5',  label: 'Explorer',         icon: 'compass',           earned: false, color: COLORS.textLight  },
  { id: 'b6',  label: 'Historian',        icon: 'business',          earned: false, color: COLORS.textLight  },
  { id: 'b7',  label: 'Horse Rider',      icon: 'paw',               earned: false, color: COLORS.textLight  },
  { id: 'b8',  label: 'Nature Lover',     icon: 'partly-sunny',      earned: false, color: COLORS.textLight  },
];

const LEVEL = 7;
const CURRENT_XP = 750;
const NEXT_LEVEL_XP = 1000;
const TOTAL_XP = 4750;

export default function MissionsScreen() {
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');

  const dailyDone = DAILY_MISSIONS.filter((m) => m.done).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Level hero card ──────────────────────────────────────────── */}
        <LinearGradient colors={[COLORS.gold, '#E6A817', '#F5C518']} style={styles.levelCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={[styles.ldeco, { width: 180, height: 180, top: -60, right: -50 }]} />
          <View style={[styles.ldeco, { width: 80, height: 80, bottom: -20, left: -20 }]} />

          <View style={styles.levelRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNum}>{LEVEL}</Text>
            </View>
            <View>
              <Text style={styles.levelTitle}>AgroExplorer</Text>
              <Text style={styles.levelSub}>Level {LEVEL} · {TOTAL_XP.toLocaleString()} XP total</Text>
            </View>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={14} color="#E67E22" />
              <Text style={styles.streakText}>7 day streak</Text>
            </View>
          </View>

          <View style={styles.xpSection}>
            <View style={styles.xpBarRow}>
              <Text style={styles.xpLabel}>Progress to Level {LEVEL + 1}</Text>
              <Text style={styles.xpFrac}>{CURRENT_XP} / {NEXT_LEVEL_XP} XP</Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${(CURRENT_XP / NEXT_LEVEL_XP) * 100}%` as any }]} />
            </View>
          </View>

          <View style={styles.statsRow}>
            {[{ label: 'Daily Done', value: `${dailyDone}/${DAILY_MISSIONS.length}` }, { label: 'Badges', value: `${BADGES.filter(b=>b.earned).length}` }, { label: 'Total XP', value: TOTAL_XP.toLocaleString() }].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statNum}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── Mission tabs ─────────────────────────────────────────────── */}
        <View style={styles.tabRow}>
          {(['daily', 'weekly'] as const).map((t) => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'daily' ? 'Daily Missions' : 'Weekly Challenges'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Mission list ─────────────────────────────────────────────── */}
        <View style={styles.missionList}>
          {(tab === 'daily' ? DAILY_MISSIONS : WEEKLY_CHALLENGES).map((m) => (
            <View key={m.id} style={[styles.missionCard, (m as any).done && styles.missionCardDone]}>
              <View style={[styles.missionIcon, { backgroundColor: m.color + '18' }]}>
                <Ionicons name={m.icon as any} size={22} color={m.done ? COLORS.textLight : m.color} />
              </View>
              <View style={styles.missionInfo}>
                <View style={styles.missionTitleRow}>
                  <Text style={[styles.missionTitle, (m as any).done && styles.missionTitleDone]}>{m.title}</Text>
                  <View style={[styles.xpChip, { backgroundColor: m.color + '18' }]}>
                    <Text style={[styles.xpChipText, { color: m.color }]}>+{m.xp} XP</Text>
                  </View>
                </View>
                <Text style={styles.missionDesc}>{m.desc}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${m.progress * 100}%` as any, backgroundColor: m.done ? COLORS.success : m.color }]} />
                </View>
                <Text style={styles.progressLabel}>
                  {m.done ? 'Completed ✓' : `${Math.round(m.progress * 100)}% complete`}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Achievements ─────────────────────────────────────────────── */}
        <View style={styles.secRow}>
          <Text style={styles.secTitle}>Achievement Badges</Text>
          <Text style={styles.secSub}>{BADGES.filter(b => b.earned).length}/{BADGES.length} earned</Text>
        </View>

        <View style={styles.badgeGrid}>
          {BADGES.map((b) => (
            <View key={b.id} style={[styles.badgeCard, !b.earned && styles.badgeCardLocked]}>
              <View style={[styles.badgeIcon, { backgroundColor: b.earned ? b.color + '18' : COLORS.cardAlt }]}>
                <Ionicons name={b.icon as any} size={26} color={b.earned ? b.color : COLORS.textLight} />
                {!b.earned && (
                  <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={12} color={COLORS.textLight} />
                  </View>
                )}
              </View>
              <Text style={[styles.badgeLabel, !b.earned && styles.badgeLabelLocked]}>{b.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Level card
  levelCard: { padding: 20, gap: 16, overflow: 'hidden' },
  ldeco: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.12)' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelBadge: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.5)',
  },
  levelNum: { fontSize: 22, fontWeight: '900', color: COLORS.white },
  levelTitle: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  levelSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  streakBadge: {
    marginLeft: 'auto' as any,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  streakText: { fontSize: 11, color: COLORS.white, fontWeight: '700' },

  xpSection: { gap: 8 },
  xpBarRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  xpFrac: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  xpTrack: { height: 10, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 5, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: 5 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 2 },
  statNum: { fontSize: 20, fontWeight: '800', color: COLORS.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },

  // Tabs
  tabRow: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.gold },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  tabTextActive: { color: COLORS.textDark },

  // Missions
  missionList: { padding: 16, gap: 10 },
  missionCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  missionCardDone: { opacity: 0.65 },
  missionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  missionInfo: { flex: 1, gap: 4 },
  missionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, flex: 1 },
  missionTitleDone: { textDecorationLine: 'line-through', color: COLORS.textLight },
  xpChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  xpChipText: { fontSize: 11, fontWeight: '700' },
  missionDesc: { fontSize: 12, color: COLORS.textLight },
  progressTrack: { height: 5, backgroundColor: COLORS.divider, borderRadius: 3, overflow: 'hidden', marginTop: 4 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },

  // Section
  secRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 12 },
  secTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  secSub: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },

  // Badges
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  badgeCard: {
    width: (width - 56) / 4, alignItems: 'center', gap: 6,
    backgroundColor: COLORS.card, borderRadius: 14, padding: 10,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 1,
  },
  badgeCardLocked: { opacity: 0.55 },
  badgeIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  lockOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.cardAlt, borderWidth: 1, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textDark, textAlign: 'center' },
  badgeLabelLocked: { color: COLORS.textLight },
});
