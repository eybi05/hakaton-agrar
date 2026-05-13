import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BadgeDefinition, UserBadge } from '../types/badges';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 3; // 3-column grid with 16px side padding + 8px gaps

// Gradient per unlocked level
const LEVEL_GRADIENTS: Record<number, [string, string]> = {
  1: ['#1B5E3B', '#2D9D63'],
  2: ['#8B6400', '#F5C518'],
  3: ['#4A1D96', '#C0392B'],
};

interface Props {
  definition: BadgeDefinition;
  userBadge: UserBadge;
  onPress?: () => void;
}

export default function BadgeCard({ definition, userBadge, onPress }: Props) {
  const isUnlocked = userBadge.currentLevel > 0;
  const level      = userBadge.currentLevel;

  // Find the current target — show progress toward the NEXT level
  const nextLevel  = definition.levels.find((l) => l.level === Math.min(level + 1, 3) as 1|2|3)
                  ?? definition.levels[definition.levels.length - 1];
  const progress   = userBadge.currentProgress;
  const target     = nextLevel.target;
  const isMaxed    = level === 3 && progress >= target;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Circular icon */}
      {isUnlocked ? (
        <LinearGradient
          colors={LEVEL_GRADIENTS[level]}
          style={styles.circle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.emoji}>{definition.emoji}</Text>
          {/* Level star in corner */}
          <View style={styles.levelTag}>
            <Text style={styles.levelTagText}>Lv.{level}</Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.circleLocked}>
          <Text style={[styles.emoji, styles.emojiLocked]}>{definition.emoji}</Text>
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.8)" />
          </View>
        </View>
      )}

      {/* Name */}
      <Text style={[styles.name, !isUnlocked && styles.nameLocked]} numberOfLines={2}>
        {definition.azName}
      </Text>

      {/* Progress */}
      {isMaxed ? (
        <Text style={styles.maxed}>✓ Tamamlandı</Text>
      ) : (
        <Text style={[styles.progress, isUnlocked && styles.progressUnlocked]}>
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
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 6,
  },

  // Unlocked circle
  circle: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.3)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 4,
  },

  // Locked circle
  circleLocked: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#C8C8C8',
    justifyContent: 'center', alignItems: 'center',
  },

  emoji: { fontSize: 30 },
  emojiLocked: { opacity: 0.45 },

  // Level badge (top-right corner of circle)
  levelTag: {
    position: 'absolute', bottom: 2, right: 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 4, paddingVertical: 1, borderRadius: 6,
  },
  levelTagText: { fontSize: 8, color: COLORS.white, fontWeight: '800' },

  // Lock icon overlay
  lockOverlay: {
    position: 'absolute', bottom: 2, right: 2,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },

  name: { fontSize: 11, fontWeight: '700', color: COLORS.textDark, textAlign: 'center', lineHeight: 14 },
  nameLocked: { color: COLORS.textLight },

  progress: { fontSize: 11, color: COLORS.textLight, fontWeight: '600' },
  progressUnlocked: { color: COLORS.primary },

  maxed: { fontSize: 10, color: COLORS.success, fontWeight: '700' },
});
