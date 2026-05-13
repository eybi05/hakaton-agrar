import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser, UserRole } from '../context/UserContext';
import { COLORS } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const ROLES: { id: UserRole; emoji: string; label: string; desc: string }[] = [
  {
    id:    'tourist',
    emoji: '🧳',
    label: 'Tourist',
    desc:  'Explore farms, historical sites & earn rewards',
  },
  {
    id:    'farmer',
    emoji: '👨‍🌾',
    label: 'Farmer',
    desc:  'List your farm & connect with visitors',
  },
];

export default function LoginScreen() {
  const { login } = useUser();

  const [role,     setRole]     = useState<UserRole>('tourist');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    login(username || 'Guest', role);
  };

  return (
    <LinearGradient
      colors={['#0D3D24', '#1B5E3B', '#2D9D63']}
      style={styles.bg}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      {/* Decorative circles */}
      <View style={[styles.deco, { width: 300, height: 300, top: -100, left: -80, opacity: 0.08 }]} />
      <View style={[styles.deco, { width: 200, height: 200, bottom: 60, right: -60, opacity: 0.08 }]} />
      <View style={[styles.deco, { width: 120, height: 120, top: height * 0.35, left: -30, opacity: 0.06 }]} />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Logo ─────────────────────────────────────────────── */}
            <View style={styles.logoBlock}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../../assets/icon.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.logoText}>Farmile</Text>
              <Text style={styles.tagline}>Nature's smile in every mile</Text>
              <Text style={styles.subTagline}>Azerbaijan's Agro-Tourism Platform</Text>
            </View>

            {/* ── Role selection ───────────────────────────────────── */}
            <Text style={styles.sectionLabel}>I am a…</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => {
                const active = role === r.id;
                return (
                  <TouchableOpacity
                    key={r.id}
                    onPress={() => setRole(r.id)}
                    style={[styles.roleCard, active && styles.roleCardActive]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.roleEmoji}>{r.emoji}</Text>
                    <Text style={[styles.roleLabel, active && styles.roleLabelActive]}>
                      {r.label}
                    </Text>
                    <Text style={[styles.roleDesc, active && styles.roleDescActive]}>
                      {r.desc}
                    </Text>
                    {active && (
                      <View style={styles.roleCheck}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Inputs ───────────────────────────────────────────── */}
            <Text style={styles.sectionLabel}>Your Details</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.6)" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPass ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color="rgba(255,255,255,0.5)"
                />
              </TouchableOpacity>
            </View>

            {/* ── Login button ─────────────────────────────────────── */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
              <LinearGradient
                colors={['#F5C518', '#E6A817', '#B8860B']}
                style={styles.loginBtnGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginBtnText}>
                  {role === 'farmer' ? '🌾 Enter as Farmer' : '🧳 Start Exploring'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#000" />
              </LinearGradient>
            </TouchableOpacity>

            {/* ── Guest skip ───────────────────────────────────────── */}
            <TouchableOpacity onPress={handleLogin} style={styles.guestBtn} activeOpacity={0.7}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>

            {/* ── Features ─────────────────────────────────────────── */}
            <View style={styles.featuresRow}>
              {['🗺️ Explore Map', '🏛️ History', '🌾 Farms', '🪙 Earn Tokens'].map((f) => (
                <View key={f} style={styles.featureChip}>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  deco: { position: 'absolute', borderRadius: 999, backgroundColor: '#fff' },

  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 0,
  },

  // Logo
  logoBlock: { alignItems: 'center', marginBottom: 32, gap: 6 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 8,
    overflow: 'hidden',
  },
  logoImage:   { width: 90, height: 90 },
  logoText:    { fontSize: 38, fontWeight: '900', color: COLORS.white, letterSpacing: 3 },
  tagline:     { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600', letterSpacing: 0.5 },
  subTagline:  { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  sectionLabel: {
    fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 4,
  },

  // Role cards
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleCard: {
    flex: 1, borderRadius: 16, padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
    gap: 6, position: 'relative',
  },
  roleCardActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  roleEmoji:      { fontSize: 28 },
  roleLabel:      { fontSize: 16, fontWeight: '800', color: 'rgba(255,255,255,0.85)' },
  roleLabelActive:{ color: COLORS.primaryDark },
  roleDesc:       { fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 15 },
  roleDescActive: { color: COLORS.textMedium },
  roleCheck: { position: 'absolute', top: 10, right: 10 },

  // Inputs
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14, paddingHorizontal: 14, height: 52,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.white },
  eyeBtn: { padding: 4 },

  // Login button
  loginBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  loginBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 15,
  },
  loginBtnText: { fontSize: 16, fontWeight: '900', color: '#000', letterSpacing: 0.3 },

  // Guest
  guestBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  guestText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },

  // Features row
  featuresRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    justifyContent: 'center', marginTop: 20,
  },
  featureChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  featureText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
});
