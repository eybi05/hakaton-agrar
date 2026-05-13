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
      <View>
        <Text style={[styles.label, isLight ? styles.labelLight : styles.labelDark]}>Tokens</Text>
        <Text style={[styles.amount, isLight ? styles.amountLight : styles.amountDark]}>
          {balance.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  badgeDark: {
    backgroundColor: COLORS.goldXLight,
    borderWidth: 1.5,
    borderColor: COLORS.goldLight + '70',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  badgeLight: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  coin: { fontSize: 22 },
  label: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
  labelDark: { color: COLORS.gold },
  labelLight: { color: 'rgba(255,255,255,0.72)' },
  amount: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  amountDark: { color: COLORS.gold },
  amountLight: { color: COLORS.white },
});
