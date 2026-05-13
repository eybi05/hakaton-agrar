import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Dimensions, Image, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser, UserRole } from '../context/UserContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login } = useUser();
  const [role,     setRole]     = useState<UserRole>('tourist');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => login(username || 'Guest', role);

  return (
    <View style={styles.root}>

      {/* ══════════════════════════════════════════════════════
          LANDSCAPE — all absolutely positioned layers
      ══════════════════════════════════════════════════════ */}

      {/* Sky — golden hour */}
      <LinearGradient
        colors={['#F4C97A', '#F0A84A', '#E8883A', '#B85C3A', '#7A3828']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 0.55 }}
      />
      {/* Atmosphere haze */}
      <LinearGradient
        colors={['transparent', 'rgba(180,120,60,0.38)', 'transparent']}
        style={[StyleSheet.absoluteFillObject, { top: height * 0.26 }]}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      />

      {/* Sun glow + core */}
      <View style={styles.sunGlow} />
      <View style={styles.sunCore} />

      {/* Mountain ridges */}
      <View style={[styles.ridge, { bottom: height * 0.37, left: -40, right: width * 0.35, height: height * 0.18, backgroundColor: '#8FA3B1', borderTopLeftRadius: width * 0.9, borderTopRightRadius: width * 0.3, opacity: 0.65 }]} />
      <View style={[styles.ridge, { bottom: height * 0.36, left: width * 0.4, right: -60, height: height * 0.20, backgroundColor: '#7A95A8', borderTopLeftRadius: width * 0.2, borderTopRightRadius: width * 0.8, opacity: 0.55 }]} />

      {/* Mid hills */}
      <View style={[styles.ridge, { bottom: height * 0.28, left: -30, right: width * 0.2, height: height * 0.16, backgroundColor: '#6B8C5A', borderTopLeftRadius: width * 0.7, borderTopRightRadius: width * 0.5 }]} />
      <View style={[styles.ridge, { bottom: height * 0.27, left: width * 0.5, right: -20, height: height * 0.14, backgroundColor: '#5A7A4A', borderTopLeftRadius: width * 0.3, borderTopRightRadius: width * 0.7 }]} />

      {/* Terrace lines */}
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.terrace, { bottom: height * (0.3 + i * 0.025), left: 10, width: width * 0.38 }]} />
      ))}

      {/* Farmhouse */}
      <View style={styles.houseBase} />
      <View style={styles.houseRoof} />
      <View style={styles.houseChimney} />
      <View style={styles.houseWindow} />
      <View style={styles.houseDoor} />

      {/* Pond */}
      <View style={styles.pond} />

      {/* Deep foreground */}
      <LinearGradient
        colors={['#2A4D1E', '#1C3A14', '#142A0E']}
        style={[styles.ridge, { bottom: 0, left: 0, right: 0, height: height * 0.28, borderTopLeftRadius: 60, borderTopRightRadius: 100 }]}
      />

      {/* Trees */}
      {[{ x: 0.08, b: 0.26 }, { x: 0.20, b: 0.27 }, { x: 0.58, b: 0.24 }, { x: 0.72, b: 0.27 }, { x: 0.84, b: 0.25 }].map((t, i) => (
        <View key={i} style={[styles.tree, { left: width * t.x, bottom: height * t.b }]} />
      ))}

      {/* Top vignette */}
      <LinearGradient
        colors={['rgba(10,20,8,0.75)', 'rgba(10,20,8,0.3)', 'transparent']}
        style={[StyleSheet.absoluteFillObject, { height: height * 0.3 }]}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      />

      {/* ══════════════════════════════════════════════════════
          FLEX LAYOUT — sits ON TOP of the landscape
          Logo takes natural height, spacer fills middle,
          KeyboardAvoidingView + glass panel at bottom.
          When keyboard opens, KAV pushes glass panel up.
      ══════════════════════════════════════════════════════ */}
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>

        {/* Logo */}
        <View style={styles.logoArea} pointerEvents="none">
          <Image source={require('../../assets/icon.png')} style={styles.logoImg} resizeMode="contain" />
          <Text style={styles.appName}>FARMILE</Text>
          <Text style={styles.slogan}>Nature's smile in every mile</Text>
        </View>

        {/* Spacer — shows the landscape */}
        <View style={{ flex: 1 }} />

        {/* Glass panel — in normal flow so KAV works */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.glassPanel}>

              <View style={styles.handle} />

              {/* Role toggle */}
              <View style={styles.roleToggle}>
                {(['tourist', 'farmer'] as UserRole[]).map((r) => {
                  const active = role === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setRole(r)}
                      style={[styles.roleTab, active && styles.roleTabActive]}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.roleTabEmoji}>{r === 'tourist' ? '🧳' : '👨‍🌾'}</Text>
                      <Text style={[styles.roleTabText, active && styles.roleTabTextActive]}>
                        {r === 'tourist' ? 'Tourist' : 'Farmer'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Username */}
              <View style={styles.field}>
                <Ionicons name="person-outline" size={16} color="rgba(255,255,255,0.5)" />
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Your name"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <View style={styles.field}>
                <Ionicons name="lock-closed-outline" size={16} color="rgba(255,255,255,0.5)" />
                <TextInput
                  style={[styles.fieldInput, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                  <Ionicons
                    name={showPass ? 'eye-outline' : 'eye-off-outline'}
                    size={16} color="rgba(255,255,255,0.4)"
                  />
                </TouchableOpacity>
              </View>

              {/* SIGN IN — deep forest green */}
              <TouchableOpacity style={styles.signInBtn} onPress={handleLogin} activeOpacity={0.88}>
                <Text style={styles.signInText}>
                  {role === 'farmer' ? 'ENTER AS FARMER' : 'SIGN  IN'}
                </Text>
                <Ionicons name="arrow-forward-circle" size={18} color="rgba(200,240,200,0.85)" />
              </TouchableOpacity>

              {/* Guest — sage green */}
              <TouchableOpacity style={styles.guestBtn} onPress={handleLogin} activeOpacity={0.8}>
                <Text style={styles.guestText}>Continue as Guest</Text>
              </TouchableOpacity>

              {/* Social */}
              <View style={styles.socialRow}>
                <View style={styles.socialLine} />
                <Text style={styles.socialLabel}>or continue with</Text>
                <View style={styles.socialLine} />
              </View>
              <View style={styles.socialBtns}>
                <TouchableOpacity style={styles.socialBtn} onPress={handleLogin}>
                  <Text style={styles.socialG}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} onPress={handleLogin}>
                  <Ionicons name="logo-apple" size={16} color="rgba(255,255,255,0.75)" />
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1C3A14' },

  // Landscape
  sunGlow: { position: 'absolute', top: height * 0.12, left: width * 0.55, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,200,80,0.22)' },
  sunCore: { position: 'absolute', top: height * 0.145, left: width * 0.60, width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,220,100,0.6)' },
  ridge:   { position: 'absolute', left: 0, right: 0 },
  terrace: { position: 'absolute', height: 2.5, backgroundColor: 'rgba(220,180,100,0.5)', borderRadius: 2 },
  houseBase:    { position: 'absolute', bottom: height * 0.27, left: width * 0.38, width: 48, height: 34, backgroundColor: '#8C7254', borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  houseRoof:    { position: 'absolute', bottom: height * 0.27 + 34, left: width * 0.38 - 6, width: 0, height: 0, borderLeftWidth: 30, borderRightWidth: 30, borderBottomWidth: 20, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#5C3D28' },
  houseChimney: { position: 'absolute', bottom: height * 0.27 + 42, left: width * 0.38 + 32, width: 7, height: 14, backgroundColor: '#4A3020' },
  houseWindow:  { position: 'absolute', bottom: height * 0.27 + 14, left: width * 0.38 + 10, width: 10, height: 10, backgroundColor: 'rgba(255,220,100,0.7)', borderRadius: 1 },
  houseDoor:    { position: 'absolute', bottom: height * 0.27, left: width * 0.38 + 26, width: 9, height: 14, backgroundColor: '#3A2814', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  pond:         { position: 'absolute', bottom: height * 0.26, left: width * 0.22, width: 36, height: 16, backgroundColor: 'rgba(100,160,200,0.55)', borderRadius: 18 },
  tree:         { position: 'absolute', width: 18, height: 32, backgroundColor: '#1A3A10', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },

  // Flex overlay
  overlay: { flex: 1 },

  // Logo
  logoArea: { alignItems: 'center', paddingTop: 6, gap: 3 },
  logoImg:  { width: 44, height: 44, borderRadius: 10, marginBottom: 2 },
  appName:  { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 6, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },
  slogan:   { fontSize: 11, color: 'rgba(255,255,255,0.72)', fontWeight: '600', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },

  // Glass panel
  glassPanel: {
    backgroundColor: 'rgba(10,28,10,0.80)',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderLeftWidth: 0.5, borderRightWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.13)',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 11,
  },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.22)', alignSelf: 'center', marginBottom: 2 },

  // Role toggle
  roleToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 13, padding: 3, gap: 3 },
  roleTab:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 11 },
  roleTabActive: { backgroundColor: '#1B4332' },
  roleTabEmoji:  { fontSize: 14 },
  roleTabText:   { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  roleTabTextActive: { color: '#fff' },

  // Fields
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  fieldInput: { flex: 1, fontSize: 14, color: '#fff' },

  // SIGN IN
  signInBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 15, borderRadius: 50, backgroundColor: '#1B4332', shadowColor: '#0D2B1E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.55, shadowRadius: 10, elevation: 6 },
  signInText: { fontSize: 15, fontWeight: '900', color: '#C8F0D0', letterSpacing: 2 },

  // Guest
  guestBtn: { paddingVertical: 13, borderRadius: 50, backgroundColor: 'rgba(82,121,111,0.5)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(130,180,150,0.3)' },
  guestText: { fontSize: 14, fontWeight: '700', color: 'rgba(200,240,210,0.85)', letterSpacing: 0.3 },

  // Social
  socialRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  socialLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  socialLabel:{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '600' },
  socialBtns: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  socialBtn:  { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.09)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  socialG:    { fontSize: 16, fontWeight: '900', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' },
});
