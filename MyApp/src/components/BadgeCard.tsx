import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BadgeDefinition, UserBadge } from '../types/badges';
import { COLORS } from '../theme/colors';
import { CATEGORY_THEMES } from '../data/badgeData';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 3;

// Bronze / Silver / Gold gradients per level
const LEVEL_GRADIENTS: Record<number, readonly [string, string]> = {
  1: ['#A0522D', '#CD853F'],   // bronze
  2: ['#708090', '#C0C0C0'],   // silver
  3: ['#B8860B', '#FFD700'],   // gold
};

const LEVEL_STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐'];

interface Props {
  definition: BadgeDefinition;
  userBadge: UserBadge;
  onPress?: () => void;
}

export default function BadgeCard({ definition, userBadge, onPress }: Props) {
  const isUnlocked = userBadge.currentLevel > 0;
  const level      = userBadge.currentLevel;
  const theme      = CATEGORY_THEMES[definition.category] ?? {
    accent: '#888', cardTint: '#F5F5F5', lockedBg: '#DDD',
  };

  const nextLevel = definition.levels.find(
    (l) => l.level === Math.min(level + 1, 3) as 1 | 2 | 3,
  ) ?? definition.levels[definition.levels.length - 1];
  const progress = userBadge.currentProgress;
  const target   = nextLevel.target;
  const isMaxed  = level === 3 && progress >= target;
  const ratio    = Math.min(progress / target, 1);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.cardTint, borderTopColor: theme.accent }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Circle */}
      {isUnlocked ? (
        <LinearGradient
          colors={LEVEL_GRADIENTS[level] as [string, string]}
          style={[styles.circle, { shadowColor: theme.accent }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.emoji}>{definition.emoji}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.circleLocked, { backgroundColor: theme.lockedBg }]}>
          <Text style={[styles.emoji, styles.emojiLocked]}>{definition.emoji}</Text>
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={12} color="rgba(0,0,0,0.45)" />
          </View>
        </View>
      )}

      {/* Stars */}
      {isUnlocked && (
        <Text style={styles.stars}>{LEVEL_STARS[level]}</Text>
      )}

      {/* Name */}
      <Text
        style={[styles.name, isUnlocked ? { color: COLORS.textDark } : { color: COLORS.textLight }]}
        numberOfLines={2}
      >
        {definition.azName}
      </Text>

      {/* Progress bar */}
      {!isMaxed ? (
        <View style={styles.barTrack}>
          <View
            style={[styles.barFill, { width: `${ratio * 100}%` as any, backgroundColor: theme.accent }]}
          />
        </View>
      ) : null}

      {/* Progress label */}
      {isMaxed ? (
        <Text style={[styles.maxed, { color: theme.accent }]}>✓ Tamamlandı</Text>
      ) : (
        <Text style={[styles.progress, isUnlocked && { color: theme.accent }]}>
          {progress}/{target}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 4,
    gap: 4,
    borderRadius: 12,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  circle: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 6, elevation: 5,
  },
  circleLocked: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
  },

  emoji: { fontSize: 28 },
  emojiLocked: { opacity: 0.5 },

  lockOverlay: {
    position: 'absolute', bottom: 2, right: 2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center', alignItems: 'center',
  },

  stars: { fontSize: 9, letterSpacing: 1 },

  name: {
    fontSize: 11, fontWeight: '700',
    textAlign: 'center', lineHeight: 14,
  },

  barTrack: {
    width: '80%', height: 3, borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 2 },

  progress: { fontSize: 10, color: COLORS.textLight, fontWeight: '600' },
  maxed:    { fontSize: 10, fontWeight: '800' },
});
