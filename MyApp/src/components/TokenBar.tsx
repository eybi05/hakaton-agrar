import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTokens } from '../context/TokenContext';
import { COLORS } from '../theme/colors';

interface Props {
  onPress?: () => void;
}

export default function TokenBar({ onPress }: Props) {
  const { balance, lifetime } = useTokens();
  const navigation = useNavigation<any>();

  const level    = Math.floor(lifetime / 1000) + 1;
  const progress = (lifetime % 1000) / 1000;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={styles.wrapper}>
      <LinearGradient
        colors={['#7C3810', COLORS.gold, '#D4814A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bar}
      >
        {/* Coin + balance */}
        <View style={styles.left}>
          <Text style={styles.coin}>🪙</Text>
          <Text style={styles.balance}>{balance.toLocaleString()}</Text>
          <Text style={styles.label}>tokens</Text>
        </View>

        <View style={styles.divider} />

        {/* Level + progress */}
        <View style={styles.mid}>
          <Text style={styles.levelText}>Lv.{level}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>

        {/* +Earn */}
        <TouchableOpacity
          style={styles.earnBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Missions')}
        >
          <Ionicons name="add" size={13} color={COLORS.gold} />
          <Text style={styles.earnText}>Earn</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 12,
    overflow: 'hidden',
  },
  left:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coin:    { fontSize: 20 },
  balance: { fontSize: 17, fontWeight: '900', color: COLORS.white, letterSpacing: -0.3 },
  label:   { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  divider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.25)' },

  mid:           { flex: 1, gap: 4 },
  levelText:     { fontSize: 11, fontWeight: '800', color: COLORS.white },
  progressTrack: { height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: COLORS.white, borderRadius: 3 },

  earnBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
  },
  earnText: { fontSize: 11, fontWeight: '800', color: COLORS.gold },
});
