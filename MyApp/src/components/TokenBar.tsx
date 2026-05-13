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

  const goToMissions = () => {
    // Navigate to the Missions tab from anywhere in the app
    navigation.navigate('Missions');
  };

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
          <View>
            <Text style={styles.balance}>{balance.toLocaleString()}</Text>
            <Text style={styles.label}>GEORG Tokens</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Level + progress */}
        <View style={styles.mid}>
          <Text style={styles.levelText}>Lv. {level}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>

        {/* +Earn → goes to Missions */}
        <TouchableOpacity style={styles.earnBtn} activeOpacity={0.8} onPress={goToMissions}>
          <Ionicons name="add" size={13} color={COLORS.gold} />
          <Text style={styles.earnText}>Earn</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 14,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 12,
    overflow: 'hidden',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coin: { fontSize: 26 },
  balance: { fontSize: 20, fontWeight: '900', color: COLORS.white, letterSpacing: -0.5 },
  label: { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: '600', letterSpacing: 0.3 },

  divider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.25)' },

  mid: { flex: 1, gap: 5 },
  levelText: { fontSize: 12, fontWeight: '800', color: COLORS.white },
  progressTrack: { height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: 3 },

  earnBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
  },
  earnText: { fontSize: 12, fontWeight: '800', color: COLORS.gold },
});
