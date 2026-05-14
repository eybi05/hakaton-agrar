import React, { useRef, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Pressable,
  Modal, Animated, Dimensions, Alert, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { useTokens } from '../context/TokenContext';
import { usePurchases, Purchase } from '../context/PurchaseContext';

const { width, height } = Dimensions.get('window');

interface Props {
  isSubscribed: boolean;
  activePlan: string | null;
  onSubscribePress: () => void;
  onLogout: () => void;
}

// ── Deterministic passport number ────────────────────────────────────────────
function makePassportNo(name: string): string {
  const hash = name.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffffff, 0);
  return 'AZG' + String(hash).padStart(6, '0').slice(-6);
}

// ── MRZ (machine-readable zone) lines ────────────────────────────────────────
function makeMRZ(name: string, passNo: string, country: string): [string, string] {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '<').padEnd(24, '<');
  const ctry  = country ? country.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3).padEnd(3, '<') : 'AZE';
  const line1 = `AGRO<<${clean}`.slice(0, 30);
  const line2 = `${passNo}${ctry}${'<'.repeat(13)}`.slice(0, 30);
  return [line1, line2];
}

// ════════════════════════════════════════════════════════════════════════════
// PassportModal
// ════════════════════════════════════════════════════════════════════════════
function PassportModal({
  visible, onClose, username, country, role, isLocal,
  passportNo, stamps, purchases,
}: {
  visible: boolean; onClose: () => void;
  username: string; country: string; role: string; isLocal: boolean;
  passportNo: string; stamps: Stamp[]; purchases: Purchase[];
}) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: height, duration: 260, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const [mrz1, mrz2] = makeMRZ(username, passportNo, country);
  const countryDisplay = country || (isLocal ? 'Azerbaijan' : 'International');
  const flag = isLocal ? '🇦🇿' : '🌍';
  const earnedCount = stamps.filter(s => s.earned).length;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[passStyles.overlay, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

        <Animated.View style={[passStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Drag handle */}
          <View style={passStyles.handle} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={passStyles.scroll}>

            {/* Header */}
            <Text style={passStyles.sheetTitle}>Digital Passport</Text>
            <Text style={passStyles.sheetSub}>Farmile Agrotourism Authority</Text>

            {/* ── Cover page ── */}
            <LinearGradient colors={[COLORS.primaryDark, '#0A1E10', COLORS.primary]} style={passStyles.cover}>
              <View style={passStyles.coverDeco1} />
              <View style={passStyles.coverDeco2} />
              <View style={passStyles.coverTop}>
                <Text style={passStyles.coverAppName}>FARMILE</Text>
                <Text style={passStyles.coverLeaf}>🌿</Text>
              </View>
              <Text style={passStyles.coverPassport}>AGRO PASSPORT</Text>
              <Text style={passStyles.coverAuthority}>Azerbaijan Agrotourism Authority</Text>
              <Text style={passStyles.coverIcon}>🛂</Text>
            </LinearGradient>

            {/* ── Data page ── */}
            <View style={passStyles.dataPage}>
              <View style={passStyles.dataPageDeco} />

              {/* Photo + basic info */}
              <View style={passStyles.dataTopRow}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={passStyles.dataAvatar}>
                  <Text style={passStyles.dataAvatarText}>{(username || 'G')[0].toUpperCase()}</Text>
                </LinearGradient>
                <View style={passStyles.dataInfo}>
                  <Text style={passStyles.dataFieldLabel}>FULL NAME</Text>
                  <Text style={passStyles.dataFieldValue}>{username || 'Guest'}</Text>
                  <Text style={passStyles.dataFieldLabel} style={{ marginTop: 6 }}>NATIONALITY</Text>
                  <Text style={passStyles.dataFieldValue}>{flag} {countryDisplay}</Text>
                </View>
              </View>

              {/* Detail fields */}
              <View style={passStyles.dataFields}>
                <View style={passStyles.dataField}>
                  <Text style={passStyles.dataFieldLabel}>ROLE</Text>
                  <Text style={passStyles.dataFieldValue}>{role === 'farmer' ? '👨‍🌾 Farmer' : '🧳 Tourist'}</Text>
                </View>
                <View style={passStyles.dataField}>
                  <Text style={passStyles.dataFieldLabel}>ACCESS</Text>
                  <Text style={passStyles.dataFieldValue}>{isLocal ? '✅ Unlimited' : '🔐 Subscription'}</Text>
                </View>
                <View style={passStyles.dataField}>
                  <Text style={passStyles.dataFieldLabel}>PASSPORT NO.</Text>
                  <Text style={passStyles.dataFieldValue}>{passportNo}</Text>
                </View>
                <View style={passStyles.dataField}>
                  <Text style={passStyles.dataFieldLabel}>STAMPS</Text>
                  <Text style={passStyles.dataFieldValue}>{earnedCount}/{stamps.length} collected</Text>
                </View>
              </View>

              {/* MRZ */}
              <View style={passStyles.mrz}>
                <Text style={passStyles.mrzText}>{mrz1}</Text>
                <Text style={passStyles.mrzText}>{mrz2}</Text>
              </View>
            </View>

            {/* ── Stamps ── */}
            <View style={passStyles.stampsSection}>
              <Text style={passStyles.stampsSectionTitle}>Journey Stamps</Text>
              <View style={passStyles.stampsRow}>
                {stamps.map((s) => (
                  <View key={s.id} style={passStyles.stampWrap}>
                    <View style={[passStyles.stampCircle, s.earned && passStyles.stampCircleEarned]}>
                      <Text style={passStyles.stampEmoji}>{s.emoji}</Text>
                      {s.earned && <View style={passStyles.stampCheck}><Ionicons name="checkmark" size={8} color="#fff" /></View>}
                    </View>
                    <Text style={[passStyles.stampLabel, s.earned && passStyles.stampLabelEarned]}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── Purchases ── */}
            {purchases.length > 0 && (
              <View style={passStyles.purchasesSection}>
                <Text style={passStyles.purchasesSectionTitle}>Active Discounts ({purchases.length})</Text>
                {purchases.map((p) => (
                  <View key={p.id} style={passStyles.purchaseItem}>
                    <Text style={passStyles.purchaseItemEmoji}>{p.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={passStyles.purchaseItemName}>{p.name}</Text>
                      <Text style={passStyles.purchaseItemMeta}>{p.discount} off · 🪙 {p.tokenCost}</Text>
                    </View>
                    <Text style={passStyles.purchaseItemDate}>
                      {new Date(p.purchasedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Close */}
            <TouchableOpacity style={passStyles.closeBtn} onPress={onClose} activeOpacity={0.85}>
              <Ionicons name="chevron-down" size={18} color={COLORS.textMedium} />
              <Text style={passStyles.closeBtnText}>Close Passport</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Stamp type
// ════════════════════════════════════════════════════════════════════════════
interface Stamp { id: string; emoji: string; label: string; earned: boolean; }

// ════════════════════════════════════════════════════════════════════════════
// ProfilePassport — main export
// ════════════════════════════════════════════════════════════════════════════
export default function ProfilePassport({ isSubscribed, activePlan, onSubscribePress, onLogout }: Props) {
  const { username, role, isLocal, country } = useUser();
  const { balance, lifetime }                = useTokens();
  const { purchases }                        = usePurchases();
  const [modalVisible, setModalVisible]      = useState(false);

  const level      = Math.floor(lifetime / 1000) + 1;
  const avatarLetter = (username || 'G')[0].toUpperCase();
  const passportNo   = useMemo(() => makePassportNo(username || 'Guest'), [username]);
  const countryDisplay = country || (isLocal ? 'Azerbaijan' : 'International');
  const flag = isLocal ? '🇦🇿' : country ? '🌍' : '';

  const stamps: Stamp[] = [
    { id: '1', emoji: '🛂', label: 'Member',     earned: true },
    { id: '2', emoji: '🌾', label: 'Explorer',   earned: role === 'farmer' || purchases.length > 0 },
    { id: '3', emoji: '🪙', label: 'Earner',     earned: lifetime > 0 },
    { id: '4', emoji: '🏆', label: 'Subscriber', earned: isSubscribed },
  ];
  const earnedCount = stamps.filter(s => s.earned).length;
  const [mrz1] = makeMRZ(username, passportNo, country);

  return (
    <>
      <View style={styles.card}>

        {/* ── 1. Top Profile Header ─────────────────────────────────────────── */}
        <View style={styles.header}>
          {/* Left: avatar + info */}
          <View style={styles.headerLeft}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </LinearGradient>
            <View style={styles.headerMeta}>
              <Text style={styles.headerName} numberOfLines={1}>{username || 'Guest'}</Text>
              <Text style={styles.headerRole}>{role === 'farmer' ? '👨‍🌾 Farmer' : '🧳 Tourist'}</Text>
              {isSubscribed ? (
                <View style={styles.subBadge}>
                  <Ionicons name="checkmark-circle" size={11} color={COLORS.success} />
                  <Text style={styles.subBadgeText}>{activePlan}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={onSubscribePress} activeOpacity={0.75}>
                  <Text style={styles.subLink}>Subscribe →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Right: passport logo (clickable) + token */}
          <View style={styles.headerRight}>
            <Pressable style={styles.passportLogoBtn} onPress={() => setModalVisible(true)}>
              <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.passportLogo}>
                <View style={styles.passportLogoDeco} />
                <Text style={styles.passportLogoLeaf}>🌿</Text>
                <Text style={styles.passportLogoText}>AGRO</Text>
                <Text style={styles.passportLogoSub}>PASSPORT</Text>
                <View style={styles.passportLogoTap}>
                  <Ionicons name="expand-outline" size={9} color="rgba(255,255,255,0.7)" />
                </View>
              </LinearGradient>
            </Pressable>
            <View style={styles.tokenCol}>
              <Text style={styles.tokenEmoji}>🪙</Text>
              <Text style={styles.tokenBalance}>{balance.toLocaleString()}</Text>
              <Text style={styles.tokenLevel}>Lv.{level}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── 2. Digital Passport Card ─────────────────────────────────────── */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Digital Passport</Text>
          <Text style={styles.sectionSub}>Your agrotourism journey</Text>
        </View>

        <Pressable onPress={() => setModalVisible(true)} style={styles.miniPassport}>
          <LinearGradient colors={[COLORS.primaryDark, '#163A22', COLORS.primaryLight + 'CC']}
            style={styles.miniPassportGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>

            {/* Decorative watermark */}
            <View style={styles.miniPassportDeco1} />
            <View style={styles.miniPassportDeco2} />
            <Text style={styles.miniPassportWatermark}>FARMILE</Text>

            {/* Left info */}
            <View style={styles.miniPassportLeft}>
              <Text style={styles.miniPassportAppName}>🌿 AGRO PASSPORT</Text>
              <View style={{ height: 10 }} />
              <Text style={styles.miniPassportFieldLabel}>NAME</Text>
              <Text style={styles.miniPassportFieldValue}>{username || 'Guest'}</Text>
              <Text style={styles.miniPassportFieldLabel} style={{ marginTop: 6 }}>COUNTRY</Text>
              <Text style={styles.miniPassportFieldValue}>{flag} {countryDisplay}</Text>
            </View>

            {/* Right: avatar + ID */}
            <View style={styles.miniPassportRight}>
              <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.08)']} style={styles.miniPassportAvatar}>
                <Text style={styles.miniPassportAvatarText}>{avatarLetter}</Text>
              </LinearGradient>
              <Text style={styles.miniPassportId}>{passportNo}</Text>
            </View>

            {/* MRZ strip */}
            <View style={styles.miniPassportMRZ}>
              <Text style={styles.miniPassportMRZText}>{mrz1.slice(0, 28)}</Text>
            </View>
          </LinearGradient>
        </Pressable>

        <View style={styles.divider} />

        {/* ── 3. Stamp Collection ──────────────────────────────────────────── */}
        <View style={styles.stampsHeader}>
          <Text style={styles.stampsSectionTitle}>Journey Stamps</Text>
          <View style={styles.stampsCountPill}>
            <Text style={styles.stampsCountText}>{earnedCount}/{stamps.length} collected</Text>
          </View>
        </View>

        <View style={styles.stampsRow}>
          {stamps.map((s) => (
            <View key={s.id} style={styles.stampItem}>
              <View style={[styles.stampCircle, s.earned && styles.stampCircleActive]}>
                <Text style={styles.stampEmoji}>{s.emoji}</Text>
                {s.earned && (
                  <View style={styles.stampCheckmark}>
                    <Ionicons name="checkmark" size={8} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={[styles.stampLabel, s.earned && styles.stampLabelActive]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* ── 4. Share Passport Button ─────────────────────────────────────── */}
        <TouchableOpacity style={styles.shareBtn} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
          <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
          <Text style={styles.shareBtnText}>View & Share Passport</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* ── 5. Logout ────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => Alert.alert('Log out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: onLogout },
          ])}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={17} color={COLORS.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* ── Passport Modal ───────────────────────────────────────────────── */}
      <PassportModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        username={username}
        country={countryDisplay}
        role={role}
        isLocal={isLocal}
        passportNo={passportNo}
        stamps={stamps}
        purchases={purchases}
      />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STYLES — main card
// ════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20, backgroundColor: COLORS.card, borderRadius: 24,
    padding: 20, gap: 16,
    shadowColor: 'rgba(13,27,13,0.14)', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 14, elevation: 5,
    borderWidth: 1, borderColor: COLORS.divider,
  },

  // Header
  header:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar:       { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  avatarText:   { fontSize: 22, fontWeight: '900', color: COLORS.white },
  headerMeta:   { gap: 3, flex: 1 },
  headerName:   { fontSize: 17, fontWeight: '800', color: COLORS.textDark },
  headerRole:   { fontSize: 12, color: COLORS.textLight },
  subBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: COLORS.primaryXLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 2 },
  subBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.success },
  subLink:      { fontSize: 11, color: COLORS.primaryLight, fontWeight: '700', marginTop: 2 },

  headerRight:  { alignItems: 'center', gap: 10, flexShrink: 0 },

  // Passport logo button
  passportLogoBtn: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  passportLogo:    { width: 70, height: 54, borderRadius: 10, padding: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  passportLogoDeco:{ position: 'absolute', top: -12, right: -12, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)' },
  passportLogoLeaf:{ fontSize: 11, position: 'absolute', top: 5, right: 7 },
  passportLogoText:{ fontSize: 11, fontWeight: '900', color: COLORS.white, letterSpacing: 0.5 },
  passportLogoSub: { fontSize: 7.5, fontWeight: '600', color: 'rgba(255,255,255,0.65)', letterSpacing: 0.3 },
  passportLogoTap: { position: 'absolute', top: 5, left: 6 },

  // Token column
  tokenCol:     { alignItems: 'center', gap: 1 },
  tokenEmoji:   { fontSize: 18 },
  tokenBalance: { fontSize: 15, fontWeight: '900', color: COLORS.gold },
  tokenLevel:   { fontSize: 10, color: COLORS.textLight, fontWeight: '600' },

  divider: { height: 1, backgroundColor: COLORS.divider },

  // Section title
  sectionTitleRow: { gap: 2 },
  sectionTitle:    { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  sectionSub:      { fontSize: 12, color: COLORS.textLight },

  // Mini passport card
  miniPassport:    { borderRadius: 18, overflow: 'hidden', shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  miniPassportGrad:{ padding: 16, minHeight: 130, overflow: 'hidden', flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  miniPassportDeco1:{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)' },
  miniPassportDeco2:{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)' },
  miniPassportWatermark:{ position: 'absolute', bottom: 28, right: 16, fontSize: 28, fontWeight: '900', color: 'rgba(255,255,255,0.05)', letterSpacing: 6 },
  miniPassportLeft:    { flex: 1 },
  miniPassportAppName: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 1 },
  miniPassportFieldLabel:{ fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 4 },
  miniPassportFieldValue:{ fontSize: 13, fontWeight: '700', color: COLORS.white },
  miniPassportRight:   { alignItems: 'center', gap: 6 },
  miniPassportAvatar:  { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  miniPassportAvatarText:{ fontSize: 18, fontWeight: '900', color: COLORS.white },
  miniPassportId:      { fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 1 },
  miniPassportMRZ:     { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 12, paddingVertical: 5 },
  miniPassportMRZText: { fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },

  // Stamps
  stampsHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stampsSectionTitle:{ fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  stampsCountPill:   { backgroundColor: COLORS.primaryXLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  stampsCountText:   { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  stampsRow:         { flexDirection: 'row', justifyContent: 'space-between' },
  stampItem:         { alignItems: 'center', gap: 5, flex: 1 },
  stampCircle:       { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.inputBg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.divider, position: 'relative' },
  stampCircleActive: { backgroundColor: COLORS.primaryXLight, borderColor: COLORS.primary },
  stampEmoji:        { fontSize: 22 },
  stampCheckmark:    { position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.card },
  stampLabel:        { fontSize: 10, fontWeight: '600', color: COLORS.border, textAlign: 'center' },
  stampLabelActive:  { color: COLORS.primary, fontWeight: '700' },

  // Share button
  shareBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primaryXLight, borderRadius: 50, paddingVertical: 13, borderWidth: 1.5, borderColor: COLORS.primary + '40' },
  shareBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  // Logout
  logoutBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFF0F0', borderRadius: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#FFCCCC' },
  logoutText: { fontSize: 14, fontWeight: '700', color: COLORS.error },
});

// ════════════════════════════════════════════════════════════════════════════
// STYLES — passport modal
// ════════════════════════════════════════════════════════════════════════════
const passStyles = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.52)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.background, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: height * 0.92,
    borderTopWidth: 1, borderColor: COLORS.divider,
  },
  handle:   { width: 44, height: 5, borderRadius: 2.5, backgroundColor: COLORS.divider, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  scroll:   { paddingHorizontal: 20, paddingBottom: 20 },

  sheetTitle: { fontSize: 22, fontWeight: '900', color: COLORS.textDark, marginTop: 8 },
  sheetSub:   { fontSize: 13, color: COLORS.textLight, marginTop: 2, marginBottom: 18 },

  // Cover page
  cover: { borderRadius: 20, padding: 22, minHeight: 170, overflow: 'hidden', marginBottom: 14 },
  coverDeco1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' },
  coverDeco2: { position: 'absolute', bottom: -30, left: -30, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.05)' },
  coverTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  coverAppName:    { fontSize: 16, fontWeight: '900', color: COLORS.white, letterSpacing: 4 },
  coverLeaf:       { fontSize: 22 },
  coverPassport:   { fontSize: 22, fontWeight: '900', color: COLORS.white, letterSpacing: 3, marginBottom: 4 },
  coverAuthority:  { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '500', letterSpacing: 0.5, marginBottom: 14 },
  coverIcon:       { fontSize: 36, alignSelf: 'center' },

  // Data page
  dataPage:   { backgroundColor: COLORS.card, borderRadius: 20, padding: 18, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.divider },
  dataPageDeco:{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.primaryXLight + '60' },
  dataTopRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  dataAvatar: { width: 68, height: 68, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  dataAvatarText: { fontSize: 28, fontWeight: '900', color: COLORS.white },
  dataInfo:   { flex: 1, justifyContent: 'center', gap: 2 },
  dataFields: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  dataField:  { width: '45%', gap: 2 },
  dataFieldLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textLight, letterSpacing: 0.8, textTransform: 'uppercase' },
  dataFieldValue: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },

  mrz: { backgroundColor: COLORS.inputBg, borderRadius: 8, padding: 10, gap: 3 },
  mrzText: { fontSize: 9, fontFamily: 'monospace', color: COLORS.textLight, letterSpacing: 1.5 },

  // Stamps section in modal
  stampsSection:      { backgroundColor: COLORS.card, borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: COLORS.divider },
  stampsSectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 14 },
  stampsRow:          { flexDirection: 'row', justifyContent: 'space-between' },
  stampWrap:          { alignItems: 'center', gap: 6, flex: 1 },
  stampCircle:        { width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.inputBg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.divider, position: 'relative' },
  stampCircleEarned:  { backgroundColor: COLORS.primaryXLight, borderColor: COLORS.primary },
  stampEmoji:         { fontSize: 24 },
  stampCheck:         { position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.card },
  stampLabel:         { fontSize: 10, fontWeight: '600', color: COLORS.border, textAlign: 'center' },
  stampLabelEarned:   { color: COLORS.primary, fontWeight: '700' },

  // Purchases in modal
  purchasesSection:      { backgroundColor: COLORS.card, borderRadius: 20, padding: 18, marginBottom: 14, gap: 10, borderWidth: 1, borderColor: COLORS.divider },
  purchasesSectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  purchaseItem:          { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.background, borderRadius: 12, padding: 10 },
  purchaseItemEmoji:     { fontSize: 22 },
  purchaseItemName:      { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  purchaseItemMeta:      { fontSize: 11, color: COLORS.textLight },
  purchaseItemDate:      { fontSize: 11, color: COLORS.textLight, fontWeight: '600' },

  closeBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.card, borderRadius: 18, paddingVertical: 15, borderWidth: 1, borderColor: COLORS.divider, marginTop: 8 },
  closeBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.textMedium },
});
