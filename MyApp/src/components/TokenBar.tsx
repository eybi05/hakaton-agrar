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
        colors={['#8B6400', COLORS.gold, '#E6A817']}
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
          <Ionicons name="add" size={11} color={COLORS.gold} />
          <Text style={styles.earnText}>Earn</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 3,
    borderRadius: 10,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 3,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 10,
    overflow: 'hidden',
  },
  left:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  coin:    { fontSize: 16 },
  balance: { fontSize: 15, fontWeight: '900', color: COLORS.white, letterSpacing: -0.3 },
  label:   { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  divider: { width: 1, height: 22, backgroundColor: 'rgba(255,255,255,0.25)' },

  mid:           { flex: 1, gap: 3 },
  levelText:     { fontSize: 10, fontWeight: '800', color: COLORS.white },
  progressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: COLORS.white, borderRadius: 2 },

  earnBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7,
  },
  earnText: { fontSize: 10, fontWeight: '800', color: COLORS.gold },
});
