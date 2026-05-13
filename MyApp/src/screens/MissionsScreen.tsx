import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { useTokens } from '../context/TokenContext';
import { useBadges } from '../context/BadgeContext';
import { useUser } from '../context/UserContext';
import { BADGE_DEFINITIONS, CATEGORY_THEMES } from '../data/badgeData';

const { width } = Dimensions.get('window');

// ── Mission definitions ───────────────────────────────────────────────────────
type MissionType = 'camera' | 'manual';

interface Mission {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  reward: number;
  color: string;
  type: MissionType;
  requiredCount: number;   // how many camera scans OR manual completes needed
  activityType?: string;  // badge activity to trigger on complete
}

const MISSIONS: Mission[] = [
  {
    id: 'm1', emoji: '📸', title: 'First Camera Scan',
    desc: 'Use the camera once to analyze any scene',
    reward: 30, color: '#7C3AED', type: 'camera', requiredCount: 1,
    activityType: 'camera_scan',
  },
  {
    id: 'm2', emoji: '🎯', title: 'Camera Explorer',
    desc: 'Scan 5 different places with the camera',
    reward: 75, color: '#0284C7', type: 'camera', requiredCount: 5,
    activityType: 'camera_scan',
  },
  {
    id: 'm3', emoji: '📷', title: 'Photo Pro',
    desc: 'Reach 15 camera scans total',
    reward: 150, color: '#4F46E5', type: 'camera', requiredCount: 15,
    activityType: 'camera_scan',
  },
  {
    id: 'm4', emoji: '🌾', title: 'Farm Visit',
    desc: 'Check in at any farm experience',
    reward: 50, color: '#16A34A', type: 'manual', requiredCount: 1,
    activityType: 'visit_farm',
  },
  {
    id: 'm5', emoji: '🍎', title: 'Harvest Day',
    desc: 'Pick fruits at an orchard',
    reward: 40, color: '#EA580C', type: 'manual', requiredCount: 1,
    activityType: 'gather_apple',
  },
  {
    id: 'm6', emoji: '🐄', title: 'Animal Friend',
    desc: 'Interact with and feed farm animals',
    reward: 35, color: '#D97706', type: 'manual', requiredCount: 1,
    activityType: 'feed_animal',
  },
  {
    id: 'm7', emoji: '🏛️', title: 'History Explorer',
    desc: 'Visit a historical site in Azerbaijan',
    reward: 35, color: '#0F766E', type: 'manual', requiredCount: 1,
    activityType: 'visit_region',
  },
  {
    id: 'm8', emoji: '🌱', title: 'Go Green',
    desc: 'Complete an eco-friendly activity',
    reward: 40, color: '#15803D', type: 'manual', requiredCount: 1,
    activityType: 'eco_activity',
  },
  {
    id: 'm9', emoji: '🍽️', title: 'Local Taste',
    desc: 'Try traditional Azerbaijani food',
    reward: 30, color: '#DC2626', type: 'manual', requiredCount: 1,
    activityType: 'try_local_food',
  },
  {
    id: 'm10', emoji: '🐴', title: 'Horse Rider',
    desc: 'Go horse riding in the countryside',
    reward: 50, color: '#92400E', type: 'manual', requiredCount: 1,
    activityType: 'horse_riding',
  },
];

type Props = { navigation: any };

export default function MissionsScreen({ navigation }: Props) {
  const { balance, lifetime, cameraScans, addTokens } = useTokens();
  const { username, role } = useUser();
  const {
    userBadges, completeActivity,
    isLevelClaimable, claimBadgeLevel, getLevelReward,
    getUnlockedCount,
  } = useBadges();

  const [claimedMissions, setClaimedMissions] = useState<string[]>([]);

  const level         = Math.floor(lifetime / 1000) + 1;
  const levelProgress = (lifetime % 1000) / 1000;

  // Compute mission progress
  const getMissionProgress = (m: Mission): number => {
    if (m.type === 'camera') return Math.min(cameraScans / m.requiredCount, 1);
    return 0;
  };

  const isMissionClaimable = (m: Mission): boolean =>
    getMissionProgress(m) >= 1 && !claimedMissions.includes(m.id);

  const isMissionClaimed = (m: Mission): boolean =>
    claimedMissions.includes(m.id);

  const claimMissionReward = (m: Mission) => {
    if (!isMissionClaimable(m)) return;
    addTokens(m.reward);
    completeActivity(m.activityType ?? 'complete_activity');
    setClaimedMissions((p) => [...p, m.id]);
  };

  // All claimable badge levels, grouped
  const claimableBadges = useMemo(() =>
    BADGE_DEFINITIONS.flatMap((def) =>
      def.levels
        .filter((lvl) => isLevelClaimable(def.id, lvl.level))
        .map((lvl) => ({ def, level: lvl.level, coins: lvl.rewardCoins }))
    ),
  [userBadges, isLevelClaimable]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Token hero card ───────────────────────────────────────────── */}
        <LinearGradient
          colors={['#7C3810', '#A0522D', '#D4814A']}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <View style={[styles.heroDeco, { width: 190, height: 190, top: -70, right: -50 }]} />
          <View style={[styles.heroDeco, { width: 80, height: 80, bottom: -20, left: -20 }]} />

          <View style={styles.tokenHero}>
            <Text style={styles.tokenCoin}>🪙</Text>
            <Text style={styles.tokenBal}>{balance.toLocaleString()}</Text>
            <Text style={styles.tokenLabel}>Tokens</Text>
          </View>

          <View style={styles.levelRow}>
            <View style={styles.levelCircle}>
              <Text style={styles.levelNum}>{level}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{username}</Text>
              <Text style={styles.userSub}>{role === 'farmer' ? '👨‍🌾 Farmer' : '🧳 Tourist'} · Level {level} · {lifetime.toLocaleString()} total</Text>
            </View>
            <View style={styles.scanBadge}>
              <Ionicons name="camera" size={13} color="#fff" />
              <Text style={styles.scanText}>{cameraScans} scans</Text>
            </View>
          </View>

          <View style={styles.xpSection}>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>Progress to Level {level + 1}</Text>
              <Text style={styles.xpPct}>{Math.round(levelProgress * 100)}%</Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${levelProgress * 100}%` as any }]} />
            </View>
          </View>

          <View style={styles.statsRow}>
            {[
              { label: 'Balance',     value: balance.toLocaleString() },
              { label: 'Badges',      value: `${getUnlockedCount()}` },
              { label: 'Missions',    value: `${claimedMissions.length}` },
              { label: 'Camera',      value: `${cameraScans}` },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statNum}>{s.value}</Text>
                <Text style={styles.statLbl}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── Pending reward banner ──────────────────────────────────────── */}
        {claimableBadges.length > 0 && (
          <LinearGradient
            colors={['#0D2B1F', '#1B4332', '#52796F']}
            style={styles.pendingBanner}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Ionicons name="ribbon" size={18} color="#F5C518" />
            <Text style={styles.pendingText}>
              {claimableBadges.length} reward{claimableBadges.length > 1 ? 's' : ''} ready to collect!
            </Text>
            <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        )}

        {/* ── Missions section ──────────────────────────────────────────── */}
        <View style={styles.secHeader}>
          <Text style={styles.secIcon}>📋</Text>
          <Text style={styles.secTitle}>Missions</Text>
          <Text style={styles.secCount}>{claimedMissions.length}/{MISSIONS.length}</Text>
        </View>

        <View style={styles.missionList}>
          {MISSIONS.map((m) => {
            const prog     = getMissionProgress(m);
            const claimable = isMissionClaimable(m);
            const claimed  = isMissionClaimed(m);

            return (
              <View
                key={m.id}
                style={[styles.mCard, claimed && styles.mCardDone]}
              >
                <View style={[styles.mIcon, { backgroundColor: m.color + '18' }]}>
                  <Text style={styles.mEmoji}>{m.emoji}</Text>
                </View>
                <View style={styles.mInfo}>
                  <View style={styles.mTitleRow}>
                    <Text style={[styles.mTitle, claimed && styles.mTitleDone]} numberOfLines={1}>
                      {m.title}
                    </Text>
                    <View style={[styles.rewardChip, { backgroundColor: m.color + '15' }]}>
                      <Text style={styles.rewardChipCoin}>🪙</Text>
                      <Text style={[styles.rewardChipText, { color: m.color }]}>{m.reward}</Text>
                    </View>
                  </View>
                  <Text style={styles.mDesc}>{m.desc}</Text>

                  {m.type === 'camera' ? (
                    <Text style={styles.cameraHint}>
                      📸 {cameraScans}/{m.requiredCount} scans · Tap the camera button on any screen
                    </Text>
                  ) : !claimed && (
                    <Text style={styles.howToHint}>
                      💡 Complete this activity in the app to unlock
                    </Text>
                  )}

                  {/* Progress bar */}
                  <View style={styles.progTrack}>
                    <View
                      style={[styles.progFill, {
                        width: `${prog * 100}%` as any,
                        backgroundColor: claimed ? COLORS.success : m.color,
                      }]}
                    />
                  </View>

                  <View style={styles.mBottom}>
                    <Text style={styles.progLabel}>
                      {claimed ? '✓ Collected' : prog >= 1 ? '✓ Ready to collect' : `${Math.round(prog * 100)}% complete`}
                    </Text>
                    {claimable && (
                      <TouchableOpacity
                        style={[styles.collectBtn, { backgroundColor: m.color }]}
                        onPress={() => claimMissionReward(m)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.collectBtnText}>Collect 🪙{m.reward}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Rewards section ───────────────────────────────────────────── */}
        <View style={[styles.secHeader, { marginTop: 12 }]}>
          <Text style={styles.secIcon}>🏆</Text>
          <Text style={styles.secTitle}>Rewards</Text>
          <Text style={styles.secCount}>{getUnlockedCount()}/{BADGE_DEFINITIONS.length}</Text>
        </View>

        {/* Group badges by category */}
        {(() => {
          const grouped: Record<string, typeof BADGE_DEFINITIONS> = {};
          BADGE_DEFINITIONS.forEach((b) => {
            if (!grouped[b.category]) grouped[b.category] = [];
            grouped[b.category].push(b);
          });
          return Object.entries(grouped).map(([cat, defs]) => {
            const theme = CATEGORY_THEMES[cat];
            return (
              <View key={cat} style={styles.catGroup}>
                {/* Category header */}
                {theme ? (
                  <LinearGradient
                    colors={theme.gradient as [string, string]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.catHeader}
                  >
                    <Text style={styles.catIcon}>{theme.icon}</Text>
                    <Text style={styles.catTitle}>{cat}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.catHeaderPlain}>
                    <Text style={styles.catTitlePlain}>{cat}</Text>
                  </View>
                )}

                {/* Badge rows */}
                {defs.map((def) => {
                  const badge    = userBadges[def.id] ?? { id: def.id, currentProgress: 0, currentLevel: 0, claimedLevels: [] };
                  const progress = badge.currentProgress;
                  const theme2   = CATEGORY_THEMES[def.category];

                  return (
                    <View key={def.id} style={styles.badgeRow}>
                      {/* Emoji circle */}
                      <View style={[
                        styles.badgeCircle,
                        { backgroundColor: badge.currentLevel > 0 ? (theme2?.accent ?? COLORS.primary) : COLORS.border },
                      ]}>
                        <Text style={styles.badgeEmoji}>{def.emoji}</Text>
                      </View>

                      {/* Info */}
                      <View style={styles.badgeInfo}>
                        <View style={styles.badgeTitleRow}>
                          <Text style={styles.badgeName}>{def.azName}</Text>
                          {badge.currentLevel > 0 && (
                            <Text style={styles.badgeLvl}>Lv.{badge.currentLevel}</Text>
                          )}
                        </View>

                        {/* Progress bar toward next level */}
                        {(() => {
                          const nextLvl = def.levels.find((l) => l.level === Math.min(badge.currentLevel + 1, 3) as 1|2|3)
                                       ?? def.levels[def.levels.length - 1];
                          const ratio = Math.min(progress / nextLvl.target, 1);
                          return (
                            <View style={styles.badgeProgTrack}>
                              <View style={[styles.badgeProgFill, {
                                width: `${ratio * 100}%` as any,
                                backgroundColor: theme2?.accent ?? COLORS.primary,
                              }]} />
                            </View>
                          );
                        })()}

                        <Text style={styles.badgeProgLabel}>
                          {progress}/{def.levels.find((l) => l.level === Math.min(badge.currentLevel + 1, 3) as 1|2|3)?.target ?? def.levels[2].target}
                        </Text>
                      </View>

                      {/* Claim buttons for each unlocked unclaimed level */}
                      <View style={styles.claimCol}>
                        {def.levels.map((lvl) =>
                          isLevelClaimable(def.id, lvl.level) ? (
                            <TouchableOpacity
                              key={lvl.level}
                              style={[styles.claimBtn, { backgroundColor: theme2?.accent ?? COLORS.primary }]}
                              onPress={() => claimBadgeLevel(def.id, lvl.level)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.claimBtnText}>🪙{lvl.rewardCoins}</Text>
                            </TouchableOpacity>
                          ) : null
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          });
        })()}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Hero card
  heroCard: { padding: 20, gap: 14, overflow: 'hidden' },
  heroDeco: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.12)' },
  tokenHero: { alignItems: 'center', gap: 2 },
  tokenCoin: { fontSize: 36 },
  tokenBal:  { fontSize: 44, fontWeight: '900', color: COLORS.white, letterSpacing: -1 },
  tokenLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },

  levelRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.5)',
  },
  levelNum:  { fontSize: 22, fontWeight: '900', color: COLORS.white },
  userName:  { fontSize: 18, fontWeight: '800', color: COLORS.white },
  userSub:   { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  scanBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  scanText: { fontSize: 11, color: COLORS.white, fontWeight: '700' },

  xpSection: { gap: 6 },
  xpRow:    { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel:  { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  xpPct:    { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  xpTrack:  { height: 10, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 5, overflow: 'hidden' },
  xpFill:   { height: '100%', backgroundColor: COLORS.white, borderRadius: 5 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 2 },
  statNum:  { fontSize: 18, fontWeight: '800', color: COLORS.white },
  statLbl:  { fontSize: 10, color: 'rgba(255,255,255,0.75)' },

  // Pending banner
  pendingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  pendingText: { flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.white },

  // Section header
  secHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
  },
  secIcon:  { fontSize: 18 },
  secTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, flex: 1 },
  secCount: { fontSize: 13, fontWeight: '700', color: COLORS.textLight },

  // Mission cards
  missionList: { paddingHorizontal: 16, gap: 10 },
  mCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  mCardDone: { opacity: 0.6 },
  mIcon: {
    width: 46, height: 46, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'flex-start',
  },
  mEmoji: { fontSize: 22 },
  mInfo:  { flex: 1, gap: 4 },
  mTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mTitle:     { fontSize: 14, fontWeight: '700', color: COLORS.textDark, flex: 1 },
  mTitleDone: { textDecorationLine: 'line-through', color: COLORS.textLight },
  rewardChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  rewardChipCoin: { fontSize: 11 },
  rewardChipText: { fontSize: 11, fontWeight: '700' },
  mDesc:       { fontSize: 12, color: COLORS.textLight, lineHeight: 17 },
  cameraHint:  { fontSize: 11, color: '#7C3AED', fontWeight: '600', marginTop: 2 },
  howToHint:   { fontSize: 11, color: COLORS.textLight, fontStyle: 'italic', marginTop: 2 },
  progTrack:   { height: 5, backgroundColor: COLORS.divider, borderRadius: 3, overflow: 'hidden', marginTop: 4 },
  progFill:    { height: '100%', borderRadius: 3 },
  mBottom:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  progLabel:   { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
  collectBtn: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10,
  },
  collectBtnText: { fontSize: 12, fontWeight: '800', color: COLORS.white },

  // Rewards / badges
  catGroup: { marginBottom: 4 },
  catHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 6, marginTop: 8,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
  },
  catIcon:      { fontSize: 16 },
  catTitle:     { fontSize: 12, fontWeight: '800', color: COLORS.white, textTransform: 'uppercase', letterSpacing: 0.7 },
  catHeaderPlain: {
    paddingHorizontal: 16, paddingVertical: 6,
  },
  catTitlePlain: { fontSize: 12, fontWeight: '800', color: COLORS.textMedium, textTransform: 'uppercase', letterSpacing: 0.7 },

  badgeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  badgeCircle: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeEmoji: { fontSize: 20 },
  badgeInfo:  { flex: 1, gap: 3 },
  badgeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeName:  { fontSize: 13, fontWeight: '700', color: COLORS.textDark, flex: 1 },
  badgeLvl:   { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  badgeProgTrack: { height: 4, backgroundColor: COLORS.divider, borderRadius: 2, overflow: 'hidden' },
  badgeProgFill:  { height: '100%', borderRadius: 2 },
  badgeProgLabel: { fontSize: 10, color: COLORS.textLight },

  claimCol:  { justifyContent: 'center', gap: 4 },
  claimBtn:  { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  claimBtnText: { fontSize: 11, fontWeight: '800', color: COLORS.white },
});
