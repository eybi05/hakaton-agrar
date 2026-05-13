import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTokens } from '../context/TokenContext';
import { COLORS } from '../theme/colors';

interface Props {
  /** 'light' → white pill for dark/gradient headers
   *  'dark'  → gold pill for white/light headers      */
  variant?: 'light' | 'dark';
  onPress?: () => void;
}

export default function TokenBadge({ variant = 'dark', onPress }: Props) {
  const { balance } = useTokens();
  const isLight = variant === 'light';

  return (
    <TouchableOpacity
      style={[styles.badge, isLight ? styles.badgeLight : styles.badgeDark]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <Text style={styles.coin}>🪙</Text>
      <Text style={[styles.amount, isLight ? styles.amountLight : styles.amountDark]}>
        {balance.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeDark: {
    backgroundColor: COLORS.goldXLight,
    borderWidth: 1,
    borderColor: COLORS.goldLight + '60',
  },
  badgeLight: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  coin: { fontSize: 13 },
  amount: { fontSize: 13, fontWeight: '700' },
  amountDark: { color: COLORS.gold },
  amountLight: { color: COLORS.white },
});
