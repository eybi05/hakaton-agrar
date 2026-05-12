import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

const STEPS = ['Type', 'Details', 'Location', 'Review'];

const TYPES = [
  { id: 'farm',       label: 'Farm',        icon: 'leaf',               color: COLORS.primary },
  { id: 'orchard',    label: 'Orchard',     icon: 'nutrition',          color: '#D35400' },
  { id: 'ranch',      label: 'Ranch',       icon: 'paw',                color: '#A67C52' },
  { id: 'campsite',   label: 'Campsite',    icon: 'flame-outline',      color: '#E67E22' },
  { id: 'guesthouse', label: 'Guesthouse',  icon: 'bed-outline',        color: '#26A69A' },
  { id: 'other',      label: 'Other',       icon: 'grid-outline',       color: COLORS.textMedium },
];

const REGIONS = ['Sheki', 'Gabala', 'Quba', 'Ganja', 'Masalli', 'Zagatala', 'Goychay', 'Baku', 'Nakhchivan', 'Other'];

type Props = { navigation: any };

export default function AddPlaceScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canNext = () => {
    if (step === 0) return selectedType !== '';
    if (step === 1) return name.trim().length > 2 && description.trim().length > 10;
    if (step === 2) return region !== '' && price !== '';
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.successWrap}>
          <LinearGradient colors={[COLORS.primaryDark, COLORS.primaryLight]} style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.successTitle}>Place Submitted!</Text>
          <Text style={styles.successSub}>Your listing for "{name}" is under review. We'll notify you once it's approved (usually within 24 hours).</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Back to Farming</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step > 0 ? setStep((s) => s - 1) : navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add a Place</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Step indicator ───────────────────────────────────────────── */}
      <View style={styles.stepBar}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, i <= step && styles.stepDotActive, i < step && styles.stepDotDone]}>
                {i < step
                  ? <Ionicons name="checkmark" size={12} color={COLORS.white} />
                  : <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* ── Step 0: Type ──────────────────────────────────────────── */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>What type of place?</Text>
            <Text style={styles.stepHint}>Choose the category that best describes your place.</Text>
            <View style={styles.typeGrid}>
              {TYPES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setSelectedType(t.id)}
                  style={[styles.typeCard, selectedType === t.id && styles.typeCardActive, selectedType === t.id && { borderColor: t.color }]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.typeIcon, { backgroundColor: t.color + '18' }, selectedType === t.id && { backgroundColor: t.color + '30' }]}>
                    <Ionicons name={t.icon as any} size={28} color={t.color} />
                  </View>
                  <Text style={[styles.typeLabel, selectedType === t.id && { color: t.color }]}>{t.label}</Text>
                  {selectedType === t.id && (
                    <View style={[styles.typeCheck, { backgroundColor: t.color }]}>
                      <Ionicons name="checkmark" size={10} color={COLORS.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Step 1: Details ───────────────────────────────────────── */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Basic Information</Text>
            <Text style={styles.stepHint}>Tell visitors what makes your place special.</Text>

            <Text style={styles.fieldLabel}>Place Name *</Text>
            <TextInput
              style={styles.textField}
              placeholder="e.g. Green Valley Organic Farm"
              placeholderTextColor={COLORS.textLight}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.fieldLabel}>Description *</Text>
            <TextInput
              style={[styles.textField, styles.textArea]}
              placeholder="Describe your place, activities, and what visitors can expect…"
              placeholderTextColor={COLORS.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length} / 500 characters</Text>

            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={32} color={COLORS.textLight} />
              <Text style={styles.photoText}>Tap to add photos</Text>
              <Text style={styles.photoHint}>Up to 5 photos • JPG, PNG</Text>
            </View>
          </View>
        )}

        {/* ── Step 2: Location & Pricing ────────────────────────────── */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Location & Pricing</Text>
            <Text style={styles.stepHint}>Help visitors find you and plan their budget.</Text>

            <Text style={styles.fieldLabel}>Region *</Text>
            <View style={styles.regionGrid}>
              {REGIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRegion(r)}
                  style={[styles.regionChip, region === r && styles.regionChipActive]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.regionText, region === r && styles.regionTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Price per Person (₼) *</Text>
            <TextInput
              style={styles.textField}
              placeholder="e.g. 45"
              placeholderTextColor={COLORS.textLight}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <Text style={styles.fieldLabel}>Max Capacity (persons)</Text>
            <TextInput
              style={styles.textField}
              placeholder="e.g. 20"
              placeholderTextColor={COLORS.textLight}
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
            />

            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={32} color={COLORS.textLight} />
              <Text style={styles.photoText}>Tap to pin exact location</Text>
              <Text style={styles.photoHint}>Improves discoverability</Text>
            </View>
          </View>
        )}

        {/* ── Step 3: Review ────────────────────────────────────────── */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Review Your Listing</Text>
            <Text style={styles.stepHint}>Confirm the details before submitting.</Text>

            <View style={styles.reviewCard}>
              <LinearGradient colors={[COLORS.primaryDark, COLORS.primaryLight]} style={styles.reviewHero}>
                <Ionicons name="leaf" size={36} color="rgba(255,255,255,0.4)" style={{ alignSelf: 'center', marginTop: 20 }} />
              </LinearGradient>
              <View style={styles.reviewBody}>
                {[
                  { label: 'Type',     value: TYPES.find(t => t.id === selectedType)?.label ?? '—' },
                  { label: 'Name',     value: name || '—' },
                  { label: 'Region',   value: region || '—' },
                  { label: 'Price',    value: price ? `₼${price} / person` : '—' },
                  { label: 'Capacity', value: capacity ? `${capacity} persons` : 'Not specified' },
                ].map((row) => (
                  <View key={row.label} style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>{row.label}</Text>
                    <Text style={styles.reviewValue}>{row.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.tosRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.primary} />
              <Text style={styles.tosText}>
                By submitting, you agree to our <Text style={styles.tosLink}>listing guidelines</Text> and <Text style={styles.tosLink}>terms of service</Text>.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Next / Submit button ──────────────────────────────────────── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canNext()}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={canNext() ? [COLORS.primaryDark, COLORS.primaryLight] : [COLORS.border, COLORS.border]}
            style={styles.nextBtnGrad}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.nextBtnText, !canNext() && { color: COLORS.textLight }]}>
              {step === STEPS.length - 1 ? 'Submit Listing' : 'Continue'}
            </Text>
            <Ionicons name={step === STEPS.length - 1 ? 'checkmark' : 'arrow-forward'} size={18} color={canNext() ? COLORS.white : COLORS.textLight} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },

  // Step bar
  stepBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.cardAlt, borderWidth: 2, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  stepDotActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryXLight },
  stepDotDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNum: { fontSize: 12, fontWeight: '700', color: COLORS.textLight },
  stepNumActive: { color: COLORS.primary },
  stepLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: '600' },
  stepLabelActive: { color: COLORS.primary },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginHorizontal: 4, marginBottom: 12 },
  stepLineDone: { backgroundColor: COLORS.primary },

  body: { padding: 20 },
  stepContent: { gap: 4 },
  stepHeading: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  stepHint: { fontSize: 14, color: COLORS.textLight, marginBottom: 16, lineHeight: 20 },

  // Type grid
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  typeCard: {
    width: (width - 56) / 2, backgroundColor: COLORS.card,
    borderRadius: 16, padding: 16, alignItems: 'center', gap: 10,
    borderWidth: 2, borderColor: COLORS.border,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  typeCardActive: { backgroundColor: COLORS.cardAlt },
  typeIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  typeLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  typeCheck: {
    position: 'absolute', top: 10, right: 10,
    width: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },

  // Form fields
  fieldLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginTop: 16, marginBottom: 6 },
  textField: {
    backgroundColor: COLORS.card, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: COLORS.textDark,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  textArea: { minHeight: 120, paddingTop: 12 },
  charCount: { fontSize: 11, color: COLORS.textLight, textAlign: 'right', marginTop: 4 },

  photoPlaceholder: {
    backgroundColor: COLORS.card, borderRadius: 14,
    borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed',
    padding: 24, alignItems: 'center', gap: 6, marginTop: 16,
  },
  photoText: { fontSize: 14, fontWeight: '600', color: COLORS.textMedium },
  photoHint: { fontSize: 12, color: COLORS.textLight },

  mapPlaceholder: {
    backgroundColor: COLORS.card, borderRadius: 14,
    borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed',
    padding: 24, alignItems: 'center', gap: 6, marginTop: 16,
  },

  // Region grid
  regionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  regionChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.cardAlt, borderWidth: 1.5, borderColor: COLORS.border,
  },
  regionChipActive: { backgroundColor: COLORS.primaryXLight, borderColor: COLORS.primary },
  regionText: { fontSize: 13, fontWeight: '600', color: COLORS.textMedium },
  regionTextActive: { color: COLORS.primary },

  // Review card
  reviewCard: {
    backgroundColor: COLORS.card, borderRadius: 18, overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3, marginTop: 8,
  },
  reviewHero: { height: 100, justifyContent: 'center', alignItems: 'center' },
  reviewBody: { padding: 16, gap: 12 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewLabel: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
  reviewValue: { fontSize: 14, color: COLORS.textDark, fontWeight: '700' },

  tosRow: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: COLORS.primaryXLight, borderRadius: 12,
    padding: 12, marginTop: 16,
  },
  tosText: { flex: 1, fontSize: 12, color: COLORS.textMedium, lineHeight: 18 },
  tosLink: { color: COLORS.primary, fontWeight: '600' },

  // Footer
  footer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.divider },
  nextBtn: { borderRadius: 14, overflow: 'hidden' },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },

  // Success
  successWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  successCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  successTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textDark },
  successSub: { fontSize: 15, color: COLORS.textMedium, textAlign: 'center', lineHeight: 22 },
  doneBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingHorizontal: 32, paddingVertical: 14, marginTop: 8,
  },
  doneBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
