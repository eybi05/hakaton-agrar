import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Ionicons name="wallet-outline" size={56} color={COLORS.primaryLight} />
        <Text style={styles.title}>Wallet</Text>
        <Text style={styles.sub}>Manage your balance, add money, and view transaction history</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 10 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.textDark },
  sub: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 20 },
});
