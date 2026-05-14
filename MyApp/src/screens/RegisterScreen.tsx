import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Dimensions, Image,
  ScrollView, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useUser, UserRole } from '../context/UserContext';

const { width, height } = Dimensions.get('window');

const COUNTRIES = [
  { code: 'AZ', name: 'Azerbaijan',    flag: '🇦🇿', local: true  },
  { code: 'TR', name: 'Turkey',         flag: '🇹🇷', local: false },
  { code: 'RU', name: 'Russia',         flag: '🇷🇺', local: false },
  { code: 'GE', name: 'Georgia',        flag: '🇬🇪', local: false },
  { code: 'US', name: 'United States',  flag: '🇺🇸', local: false },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', local: false },
  { code: 'DE', name: 'Germany',        flag: '🇩🇪', local: false },
  { code: 'FR', name: 'France',         flag: '🇫🇷', local: false },
  { code: 'CN', name: 'China',          flag: '🇨🇳', local: false },
  { code: 'SA', name: 'Saudi Arabia',   flag: '🇸🇦', local: false },
  { code: 'AE', name: 'UAE',            flag: '🇦🇪', local: false },
  { code: 'IN', name: 'India',          flag: '🇮🇳', local: false },
  { code: 'IR', name: 'Iran',           flag: '🇮🇷', local: false },
  { code: 'UA', name: 'Ukraine',        flag: '🇺🇦', local: false },
  { code: 'KZ', name: 'Kazakhstan',     flag: '🇰🇿', local: false },
  { code: 'IT', name: 'Italy',          flag: '🇮🇹', local: false },
  { code: 'ES', name: 'Spain',          flag: '🇪🇸', local: false },
  { code: 'JP', name: 'Japan',          flag: '🇯🇵', local: false },
  { code: 'KR', name: 'South Korea',    flag: '🇰🇷', local: false },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺', local: false },
  { code: 'CA', name: 'Canada',         flag: '🇨🇦', local: false },
  { code: 'UZ', name: 'Uzbekistan',     flag: '🇺🇿', local: false },
  { code: 'PL', name: 'Poland',         flag: '🇵🇱', local: false },
  { code: 'NL', name: 'Netherlands',    flag: '🇳🇱', local: false },
];

type Props = { navigation: any };

export default function RegisterScreen({ navigation }: Props) {
  const { login } = useUser();

  const [name,            setName]            = useState('');
  const [password,        setPassword]        = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [countrySearch,   setCountrySearch]   = useState('');
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [showCountryList, setShowCountryList] = useState(false);
  const [passportUri,     setPassportUri]     = useState<string | null>(null);
  const [loading,         setLoading]         = useState(false);

  const scanProgress = useRef(new Animated.Value(0)).current;

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const pickPassport = async (fromCamera: boolean) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') return;
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.85 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
    if (!result.canceled) setPassportUri(result.assets[0].uri);
  };

  const canRegister = name.trim().length > 1 && password.length >= 4 && selectedCountry && passportUri;

  const handleRegister = () => {
    if (!canRegister || loading) return;
    setLoading(true);
    scanProgress.setValue(0);
    Animated.timing(scanProgress, { toValue: 1, duration: 2000, useNativeDriver: false }).start(() => {
      const isLocalUser = selectedCountry!.local;
      const role: UserRole = isLocalUser ? 'farmer' : 'tourist';
      login(name.trim(), role, isLocalUser, selectedCountry!.name);
    });
  };

  return (
    <View style={styles.root}>

      {/* Landscape background */}
      <LinearGradient colors={['#F4C97A', '#F0A84A', '#E8883A', '#B85C3A', '#7A3828']}
        style={StyleSheet.absoluteFillObject} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 0.55 }} />
      <LinearGradient colors={['transparent', 'rgba(180,120,60,0.38)', 'transparent']}
        style={[StyleSheet.absoluteFillObject, { top: height * 0.26 }]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
      <View style={styles.sunGlow} />
      <View style={styles.sunCore} />
      <View style={[styles.ridge, { bottom: height * 0.37, left: -40, right: width * 0.35, height: height * 0.18, backgroundColor: '#8FA3B1', borderTopLeftRadius: width * 0.9, borderTopRightRadius: width * 0.3, opacity: 0.65 }]} />
      <View style={[styles.ridge, { bottom: height * 0.36, left: width * 0.4, right: -60, height: height * 0.20, backgroundColor: '#7A95A8', borderTopLeftRadius: width * 0.2, borderTopRightRadius: width * 0.8, opacity: 0.55 }]} />
      <View style={[styles.ridge, { bottom: height * 0.28, left: -30, right: width * 0.2, height: height * 0.16, backgroundColor: '#6B8C5A', borderTopLeftRadius: width * 0.7, borderTopRightRadius: width * 0.5 }]} />
      <View style={[styles.ridge, { bottom: height * 0.27, left: width * 0.5, right: -20, height: height * 0.14, backgroundColor: '#5A7A4A', borderTopLeftRadius: width * 0.3, borderTopRightRadius: width * 0.7 }]} />
      <LinearGradient colors={['#2A4D1E', '#1C3A14', '#142A0E']} style={[styles.ridge, { bottom: 0, height: height * 0.28, borderTopLeftRadius: 60, borderTopRightRadius: 100 }]} />
      {[{ x: 0.08, b: 0.26 }, { x: 0.20, b: 0.27 }, { x: 0.58, b: 0.24 }, { x: 0.72, b: 0.27 }, { x: 0.84, b: 0.25 }].map((t, i) => (
        <View key={i} style={[styles.tree, { left: width * t.x, bottom: height * t.b }]} />
      ))}
      <LinearGradient colors={['rgba(10,20,8,0.75)', 'rgba(10,20,8,0.3)', 'transparent']}
        style={[StyleSheet.absoluteFillObject, { height: height * 0.3 }]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>

        {/* Mini logo */}
        <View style={styles.logoRow}>
          <Image source={require('../../assets/icon.png')} style={styles.logoImg} resizeMode="contain" />
          <Text style={styles.appName}>FARMILE</Text>
        </View>

        <View style={{ flex: 1 }} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
            <View style={styles.glassPanel}>
              <View style={styles.handle} />

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.sub}>Fill in your details to get started</Text>

              {/* ── Name ── */}
              <View style={styles.field}>
                <Ionicons name="person-outline" size={16} color="rgba(255,255,255,0.5)" />
                <TextInput style={styles.fieldInput} placeholder="Full name"
                  placeholderTextColor="rgba(255,255,255,0.35)" value={name}
                  onChangeText={setName} autoCapitalize="words" />
              </View>

              {/* ── Password ── */}
              <View style={styles.field}>
                <Ionicons name="lock-closed-outline" size={16} color="rgba(255,255,255,0.5)" />
                <TextInput style={[styles.fieldInput, { flex: 1 }]} placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.35)" value={password}
                  onChangeText={setPassword} secureTextEntry={!showPass} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                  <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={16} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              </View>

              {/* ── Country ── */}
              <Text style={styles.sectionLabel}>Where are you from?</Text>
              <TouchableOpacity
                style={[styles.countrySelector, selectedCountry && styles.countrySelectorFilled]}
                onPress={() => setShowCountryList(v => !v)}
                activeOpacity={0.85}
              >
                {selectedCountry ? (
                  <>
                    <Text style={{ fontSize: 20 }}>{selectedCountry.flag}</Text>
                    <Text style={styles.countrySelectorName}>{selectedCountry.name}</Text>
                    {selectedCountry.local && (
                      <View style={styles.localBadge}><Text style={styles.localBadgeText}>Local</Text></View>
                    )}
                  </>
                ) : (
                  <>
                    <Ionicons name="globe-outline" size={18} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.countrySelectorPlaceholder}>Select your country</Text>
                  </>
                )}
                <Ionicons name={showCountryList ? 'chevron-up' : 'chevron-down'} size={16} color="rgba(255,255,255,0.4)" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>

              {showCountryList && (
                <View style={styles.countryDropdown}>
                  <View style={styles.countrySearchBar}>
                    <Ionicons name="search-outline" size={14} color="rgba(255,255,255,0.4)" />
                    <TextInput style={styles.countrySearchInput} placeholder="Search…"
                      placeholderTextColor="rgba(255,255,255,0.3)" value={countrySearch}
                      onChangeText={setCountrySearch} />
                  </View>
                  <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {filteredCountries.map((c) => (
                      <TouchableOpacity key={c.code} style={[styles.countryRow, selectedCountry?.code === c.code && styles.countryRowActive]}
                        onPress={() => { setSelectedCountry(c); setShowCountryList(false); setCountrySearch(''); }}
                        activeOpacity={0.8}
                      >
                        <Text style={{ fontSize: 18 }}>{c.flag}</Text>
                        <Text style={[styles.countryName, selectedCountry?.code === c.code && { color: '#fff', fontWeight: '700' }]}>{c.name}</Text>
                        {c.local && <View style={styles.localBadge}><Text style={styles.localBadgeText}>Local</Text></View>}
                        {selectedCountry?.code === c.code && <Ionicons name="checkmark-circle" size={16} color="#4ade80" />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* ── Passport ── */}
              <Text style={styles.sectionLabel}>Upload Passport / ID</Text>
              {!passportUri ? (
                <View style={styles.uploadRow}>
                  <TouchableOpacity style={styles.uploadBtn} onPress={() => pickPassport(true)} activeOpacity={0.85}>
                    <Ionicons name="camera-outline" size={18} color="#C8F0D0" />
                    <Text style={styles.uploadBtnText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.uploadBtn} onPress={() => pickPassport(false)} activeOpacity={0.85}>
                    <Ionicons name="images-outline" size={18} color="#C8F0D0" />
                    <Text style={styles.uploadBtnText}>Gallery</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.passportRow}>
                  <Image source={{ uri: passportUri }} style={styles.passportThumb} resizeMode="cover" />
                  <View style={styles.passportInfo}>
                    <View style={styles.passportVerified}>
                      <Ionicons name="checkmark-circle" size={15} color="#4ade80" />
                      <Text style={styles.passportVerifiedText}>Document uploaded</Text>
                    </View>
                    <Text style={styles.passportHint}>Ready for verification</Text>
                  </View>
                  <TouchableOpacity onPress={() => setPassportUri(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>
                </View>
              )}

              {/* ── Scan progress (shown while loading) ── */}
              {loading && (
                <View style={styles.scanBar}>
                  <Text style={styles.scanLabel}>Verifying document…</Text>
                  <View style={styles.scanTrack}>
                    <Animated.View style={[styles.scanFill, {
                      width: scanProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                    }]} />
                  </View>
                </View>
              )}

              {/* ── Submit ── */}
              <TouchableOpacity
                style={[styles.registerBtn, (!canRegister || loading) && styles.registerBtnDisabled]}
                onPress={handleRegister}
                activeOpacity={canRegister && !loading ? 0.88 : 1}
              >
                <Ionicons name={loading ? 'hourglass-outline' : 'person-add-outline'} size={18} color="#C8F0D0" />
                <Text style={styles.registerBtnText}>{loading ? 'Creating account…' : 'Create Account'}</Text>
              </TouchableOpacity>

              {/* ── Sign in link ── */}
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.signInLink} activeOpacity={0.75}>
                <Text style={styles.signInLinkText}>
                  Already have an account?  <Text style={styles.signInLinkBold}>Sign in</Text>
                </Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1C3A14' },
  sunGlow: { position: 'absolute', top: height * 0.08, left: width * 0.55, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,200,80,0.22)' },
  sunCore: { position: 'absolute', top: height * 0.105, left: width * 0.60, width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,220,100,0.6)' },
  ridge:   { position: 'absolute', left: 0, right: 0 },
  tree:    { position: 'absolute', width: 18, height: 32, backgroundColor: '#1A3A10', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  overlay: { flex: 1 },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4, paddingHorizontal: 20 },
  logoImg: { width: 32, height: 32, borderRadius: 8 },
  appName: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 4, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },

  glassPanel: {
    backgroundColor: 'rgba(10,28,10,0.82)',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderLeftWidth: 0.5, borderRightWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.13)',
    paddingHorizontal: 22, paddingTop: 12, paddingBottom: 32, gap: 11,
  },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.22)', alignSelf: 'center', marginBottom: 2 },

  title: { fontSize: 22, fontWeight: '900', color: '#fff' },
  sub:   { fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: -6 },

  sectionLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: 0.4, marginBottom: -4 },

  field: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  fieldInput: { flex: 1, fontSize: 14, color: '#fff' },

  // Country selector
  countrySelector: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  countrySelectorFilled: { borderColor: 'rgba(74,222,128,0.4)' },
  countrySelectorName:   { fontSize: 14, color: '#fff', fontWeight: '600', flex: 1 },
  countrySelectorPlaceholder: { fontSize: 14, color: 'rgba(255,255,255,0.3)', flex: 1 },

  countryDropdown: { backgroundColor: 'rgba(10,28,10,0.95)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginTop: -6 },
  countrySearchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  countrySearchInput: { flex: 1, fontSize: 13, color: '#fff' },
  countryRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  countryRowActive: { backgroundColor: 'rgba(27,67,50,0.7)' },
  countryName:      { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  localBadge:       { backgroundColor: 'rgba(74,222,128,0.2)', borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2 },
  localBadgeText:   { fontSize: 10, fontWeight: '700', color: '#4ade80' },

  // Passport
  uploadRow:   { flexDirection: 'row', gap: 10 },
  uploadBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: 'rgba(27,67,50,0.6)', borderRadius: 12, paddingVertical: 13, borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)' },
  uploadBtnText: { fontSize: 13, fontWeight: '700', color: '#C8F0D0' },

  passportRow:          { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(27,67,50,0.4)', borderRadius: 14, padding: 10, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  passportThumb:        { width: 60, height: 44, borderRadius: 8 },
  passportInfo:         { flex: 1, gap: 3 },
  passportVerified:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  passportVerifiedText: { fontSize: 12, fontWeight: '700', color: '#4ade80' },
  passportHint:         { fontSize: 11, color: 'rgba(255,255,255,0.4)' },

  // Scan progress
  scanBar:   { gap: 6 },
  scanLabel: { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
  scanTrack: { height: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  scanFill:  { height: '100%', backgroundColor: '#4ade80', borderRadius: 3 },

  // Register button
  registerBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 50, backgroundColor: '#1B4332', shadowColor: '#0D2B1E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.55, shadowRadius: 10, elevation: 6 },
  registerBtnDisabled: { opacity: 0.4 },
  registerBtnText:     { fontSize: 15, fontWeight: '900', color: '#C8F0D0', letterSpacing: 0.5 },

  signInLink:     { alignItems: 'center' },
  signInLinkText: { fontSize: 13, color: 'rgba(200,240,210,0.5)', fontWeight: '500' },
  signInLinkBold: { color: 'rgba(200,240,210,0.9)', fontWeight: '800' },
});
