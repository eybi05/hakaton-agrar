/**
 * CameraAnalyzer — camera + AI-style image analysis with token rewards.
 *
 * Takes a photo → shows a realistic analysis response → rewards tokens.
 * Drop anywhere as  <CameraAnalyzer />  (renders as an absolute FAB).
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ScrollView, Image, ActivityIndicator, Dimensions,
  Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTokens } from '../context/TokenContext';
import { useBadges } from '../context/BadgeContext';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

// ── Pre-written analysis responses ────────────────────────────────────────────
// Each entry represents a different scenario the user might photograph.
type AnalysisResult = {
  icon:     string;
  heading:  string;
  body:     string;
  tokens:   number;
  badge:    string;
};

const ANALYSIS_POOL: AnalysisResult[] = [
  {
    icon:    '🌿',
    heading: 'Organic Farm Detected',
    body:
      'The image shows a well-maintained organic farm typical of the Sheki-Zagatala region. ' +
      'Row crops appear to include leafy vegetables and herbs cultivated without synthetic fertilisers. ' +
      'The soil condition looks rich and loamy — ideal for organic yield. ' +
      'Nearby tree lines suggest a traditional agroforestry system that improves biodiversity and soil moisture retention. ' +
      'This type of farm qualifies for the GEORG Organic Farming badge and earns bonus tokens.',
    tokens:  25,
    badge:   'Organic Farm',
  },
  {
    icon:    '🍎',
    heading: 'Fruit Orchard Identified',
    body:
      'A thriving fruit orchard is visible in this image. The tree canopy density and branch structure are consistent with apple or pear varieties commonly grown in Guba and Shamakhi districts. ' +
      'Fruit size and coloration suggest mid-to-late harvest season. ' +
      'The orchard layout follows a high-density planting pattern which maximises yield per hectare. ' +
      'This area is likely part of Azerbaijan\'s famous fruit belt that produces over 40% of the country\'s fresh fruit exports. ' +
      'Excellent condition — worth a personal visit during harvest season (September–October).',
    tokens:  20,
    badge:   'Fruit Orchard',
  },
  {
    icon:    '🏛️',
    heading: 'Historical Architecture Recognised',
    body:
      'The structure in the frame displays characteristics of medieval Azerbaijani stone architecture, commonly found in the Nakhchivan and Sheki regions. ' +
      'The arched entryway and carved geometric patterns on the facade are consistent with 12th–14th century craftsmanship. ' +
      'Similar designs appear on UNESCO-listed monuments such as the Momine Khatun Mausoleum. ' +
      'The stonework shows minimal weathering, suggesting either recent restoration or exceptional material quality. ' +
      'Highly recommended for cultural tourism itineraries.',
    tokens:  30,
    badge:   'Heritage Site',
  },
  {
    icon:    '🐄',
    heading: 'Livestock Activity Observed',
    body:
      'The scene shows healthy livestock — likely cattle or buffalo — in an open pasture setting. ' +
      'The animals\' coat condition and body weight suggest good nutrition, consistent with the lush grazing lands of the Karabakh and Mil plains. ' +
      'Free-range grazing practices like this produce higher-quality dairy products prized in local markets. ' +
      'Visitors to this type of farm can often participate in milking sessions and taste fresh village cheeses. ' +
      'This qualifies as an Animal Friend activity and earns you extra tokens.',
    tokens:  20,
    badge:   'Animal Friend',
  },
  {
    icon:    '🍇',
    heading: 'Vineyard & Grape Cultivation',
    body:
      'Rows of cultivated grapevines are clearly visible. The trellis system and vine spacing align with traditional Azerbaijani viticulture practices used in Shamakhi, Goygol, and Tovuz regions. ' +
      'Leaf density and cluster formation indicate the Rkatsiteli or Bayanshira grape variety — both native to the South Caucasus. ' +
      'Optimal harvest window appears to be 3–4 weeks away based on cluster maturity. ' +
      'This vineyard likely produces wine, raisins, and the famous Azerbaijani şərab (grape wine) enjoyed at rural guesthouses throughout the region.',
    tokens:  22,
    badge:   'Vineyard Explorer',
  },
  {
    icon:    '⛰️',
    heading: 'Mountain Landscape Captured',
    body:
      'The image captures a striking mountain panorama consistent with the Greater or Lesser Caucasus range in northern Azerbaijan. ' +
      'The visible vegetation zones — from dense beech forest at mid-elevation to alpine meadows above — indicate an altitude of approximately 1,800–2,400 metres. ' +
      'Rock formations along the ridgeline show typical limestone karst features. ' +
      'This area is a prime habitat for rare species including the Caucasian tur (mountain goat), Persian leopard, and over 60 endemic plant species. ' +
      'Ideal for trekking, photography, and eco-tourism.',
    tokens:  28,
    badge:   'Mountain Explorer',
  },
  {
    icon:    '🌾',
    heading: 'Grain Field Detected',
    body:
      'A large grain field — most likely wheat or barley — fills the frame. The even crop height and golden colouration indicate this field is approaching peak harvest readiness. ' +
      'The agricultural region shown is consistent with the Kur-Araz lowlands, Azerbaijan\'s primary breadbasket. ' +
      'Combine harvester tracks visible at the field edges suggest mechanised farming practices. ' +
      'This region contributes significantly to the country\'s grain self-sufficiency programme. ' +
      'Traditional hand-harvesting workshops are still organised for tourists in smaller villages nearby.',
    tokens:  18,
    badge:   'Grain Harvest',
  },
  {
    icon:    '🌺',
    heading: 'Floral & Botanical Scene',
    body:
      'The image contains a rich display of wildflowers typical of Azerbaijani mountain meadows. ' +
      'Species identifiable include Caucasian rhododendron (Rhododendron caucasicum), wild thyme (Thymus serpyllum), and what appears to be a yellow-flowered St John\'s Wort. ' +
      'These plants have traditional medicinal uses documented in Azerbaijani folk medicine for centuries. ' +
      'The biodiversity visible in a single frame suggests this meadow is in a protected zone or national park. ' +
      'Best visited in May–June when bloom density reaches its peak.',
    tokens:  22,
    badge:   'Nature Lover',
  },
  {
    icon:    '🏡',
    heading: 'Rural Guesthouse / Homestay',
    body:
      'The building shown is a traditional Azerbaijani rural home (kənd evi), featuring a characteristic flat or low-pitched roof, stone or clay-brick construction, and an enclosed courtyard typical of the Sheki or Lahij region. ' +
      'This style of architecture dates back several centuries and is well-adapted to the local climate — cool in summer, warm in winter. ' +
      'Many such homes now operate as family guesthouses offering authentic village meals, traditional bread baking (tandır), and overnight accommodation. ' +
      'A perfect base for exploring the surrounding farmland and forests.',
    tokens:  20,
    badge:   'Local Hotels',
  },
  {
    icon:    '🍽️',
    heading: 'Traditional Food Identified',
    body:
      'The dish or food item in the image is consistent with traditional Azerbaijani village cuisine. ' +
      'The preparation method and ingredients — which appear to include fresh herbs, pomegranate seeds, and slow-cooked meat — are characteristic of piti (the famous Sheki clay-pot stew) or a variation of dovga (yoghurt herb soup). ' +
      'These recipes are passed down through generations and vary significantly between regions. ' +
      'The freshness of the herbs and quality of the cookware suggest this was prepared in a traditional village kitchen. ' +
      'Highly recommended for food tourism experiences.',
    tokens:  20,
    badge:   'Food Lover',
  },
  {
    icon:    '🌲',
    heading: 'Forest & Eco Zone Detected',
    body:
      'A dense mixed forest is visible — predominantly Oriental beech (Fagus orientalis) and Caucasian oak (Quercus macranthera), species that form the backbone of Azerbaijan\'s mountain forest ecosystem. ' +
      'Forest floor coverage is rich with ferns and mosses, indicating high humidity and minimal human disturbance. ' +
      'This type of old-growth forest provides critical habitat for Brown bears, wolves, and over 200 bird species. ' +
      'Eco-tourism activities such as guided wildlife walks and bird-watching tours are available in protected zones near Ismayilli and Gabala. ' +
      'Leave no trace — this ecosystem is irreplaceable.',
    tokens:  25,
    badge:   'Eco Tourist',
  },
  {
    icon:    '🐴',
    heading: 'Equestrian Activity Spotted',
    body:
      'The image shows horses or equestrian activity in a rural setting. The breed characteristics — compact body, high-set tail, and refined head — suggest Karabakh horses, Azerbaijan\'s ancient national breed known since the 4th century BC. ' +
      'These horses are celebrated for their endurance, intelligence, and distinctive golden chestnut coat. ' +
      'Horse riding tours in this region typically last 1–3 hours and cover mountain trails with panoramic views. ' +
      'Beginners are welcome at most ranches. This activity earns bonus tokens under the Horse Rider achievement.',
    tokens:  28,
    badge:   'Horse Rider',
  },
];

function getRandomAnalysis(): AnalysisResult {
  return ANALYSIS_POOL[Math.floor(Math.random() * ANALYSIS_POOL.length)];
}

// Simulate processing delay (1.8 – 3 seconds)
function fakeDelay(): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    const delay = 1800 + Math.random() * 1200;
    setTimeout(() => resolve(getRandomAnalysis()), delay);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
type Phase = 'idle' | 'analyzing' | 'done' | 'error';

export default function CameraAnalyzer() {
  const { addTokens, incrementCameraScans }     = useTokens();
  const { completeActivity }                    = useBadges();
  const [visible,   setVisible]                 = useState(false);
  const [photoUri,  setPhotoUri]                = useState<string | null>(null);
  const [result,    setResult]                  = useState<AnalysisResult | null>(null);
  const [phase,     setPhase]                   = useState<Phase>('idle');
  const [errorMsg,  setErrorMsg]                = useState('');
  const [earnedTokens, setEarnedTokens]         = useState(0);

  const reset = useCallback(() => {
    setVisible(false);
    setPhotoUri(null);
    setResult(null);
    setPhase('idle');
    setErrorMsg('');
    setEarnedTokens(0);
  }, []);

  // ── Open camera ────────────────────────────────────────────────────────────
  const openCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access in Settings to use this feature.',
        [{ text: 'OK' }],
      );
      return;
    }

    const picked = await ImagePicker.launchCameraAsync({
      mediaTypes:    ['images'],
      quality:       0.75,
      allowsEditing: false,
    });

    if (picked.canceled || !picked.assets?.[0]) return;

    setPhotoUri(picked.assets[0].uri);
    setResult(null);
    setErrorMsg('');
    setEarnedTokens(0);
    setPhase('analyzing');
    setVisible(true);

    // Simulate DeepSeek analysis with a fake delay → get random result
    try {
      const analysis = await fakeDelay();
      addTokens(analysis.tokens);
      incrementCameraScans();
      completeActivity('camera_scan');
      setEarnedTokens(analysis.tokens);
      setResult(analysis);
      setPhase('done');
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Analysis failed.');
      setPhase('error');
    }
  }, [addTokens, incrementCameraScans, completeActivity]);

  const retake = useCallback(() => {
    setVisible(false);
    setTimeout(openCamera, 350);
  }, [openCamera]);

  return (
    <>
      {/* ── Floating camera button ──────────────────────────────────────── */}
      <TouchableOpacity style={styles.fab} onPress={openCamera} activeOpacity={0.85}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.fabGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="camera" size={26} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* ── Analysis modal ──────────────────────────────────────────────── */}
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={reset}
      >
        <SafeAreaView style={styles.sheet} edges={['top', 'bottom']}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.headerIcon}>
                <Ionicons name="camera" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.headerTitle}>AI Image Analysis</Text>
            </View>
            <TouchableOpacity onPress={reset} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Photo */}
            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
            )}

            {/* ── Analyzing state ─────────────────────────────────────── */}
            {phase === 'analyzing' && (
              <View style={styles.analyzingCard}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.analyzingTitle}>Analyzing with DeepSeek AI…</Text>
                <Text style={styles.analyzingSub}>
                  Identifying objects, environment and agro-tourism details
                </Text>
                <View style={styles.dotsRow}>
                  {['🌿', '🔍', '🤖'].map((e, i) => (
                    <Text key={i} style={styles.dotEmoji}>{e}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* ── Error state ─────────────────────────────────────────── */}
            {phase === 'error' && (
              <View style={styles.errorCard}>
                <Ionicons name="warning-outline" size={28} color={COLORS.error} />
                <Text style={styles.errorTitle}>Analysis Failed</Text>
                <Text style={styles.errorMsg}>{errorMsg}</Text>
              </View>
            )}

            {/* ── Result ──────────────────────────────────────────────── */}
            {phase === 'done' && result && (
              <>
                {/* Token reward banner */}
                <LinearGradient
                  colors={[COLORS.gold, '#E6A817']}
                  style={styles.rewardBanner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.rewardCoin}>🪙</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rewardTitle}>+{earnedTokens} Tokens Earned!</Text>
                    <Text style={styles.rewardSub}>
                      Badge unlocked: {result.badge}
                    </Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
                </LinearGradient>

                {/* Analysis card */}
                <View style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultIcon}>{result.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultTitle}>{result.heading}</Text>
                      <Text style={styles.resultSub}>DeepSeek Vision · AI Analysis</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.resultBody}>{result.body}</Text>
                </View>
              </>
            )}

            {/* Actions */}
            {phase !== 'analyzing' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.retakeBtn} onPress={retake} activeOpacity={0.85}>
                  <Ionicons name="camera-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.retakeBtnText}>Take Another Photo</Text>
                </TouchableOpacity>
                {phase === 'done' && (
                  <TouchableOpacity style={styles.closeAction} onPress={reset} activeOpacity={0.85}>
                    <Text style={styles.closeActionText}>Close</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // FAB
  fab: {
    position:      'absolute',
    bottom:        Platform.OS === 'ios' ? 105 : 85,
    right:         20,
    shadowColor:   COLORS.primary,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius:  10,
    elevation:     10,
    zIndex:        999,
  },
  fabGrad: {
    width: 58, height: 58, borderRadius: 29,
    justifyContent: 'center', alignItems: 'center',
  },

  // Sheet
  sheet: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.card,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.cardAlt, justifyContent: 'center', alignItems: 'center' },

  scrollContent: { padding: 16, gap: 14 },

  // Photo
  photo: { width: '100%', height: 260, borderRadius: 16 },

  // Analyzing
  analyzingCard: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 28,
    alignItems: 'center', gap: 12,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  analyzingTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, textAlign: 'center' },
  analyzingSub:   { fontSize: 13, color: COLORS.textLight, textAlign: 'center', lineHeight: 19 },
  dotsRow:        { flexDirection: 'row', gap: 12, marginTop: 4 },
  dotEmoji:       { fontSize: 22 },

  // Error
  errorCard: {
    backgroundColor: COLORS.error + '10', borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: COLORS.error + '30',
  },
  errorTitle: { fontSize: 15, fontWeight: '700', color: COLORS.error },
  errorMsg:   { fontSize: 13, color: COLORS.error, textAlign: 'center', lineHeight: 19 },

  // Token reward banner
  rewardBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, padding: 14,
  },
  rewardCoin:  { fontSize: 30 },
  rewardTitle: { fontSize: 16, fontWeight: '900', color: COLORS.white },
  rewardSub:   { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Result card
  resultCard: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16, gap: 12,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  resultIcon:   { fontSize: 28 },
  resultTitle:  { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  resultSub:    { fontSize: 11, color: COLORS.textLight, marginTop: 1 },
  divider:      { height: 1, backgroundColor: COLORS.divider },
  resultBody:   { fontSize: 14, color: COLORS.textMedium, lineHeight: 22 },

  // Actions
  actionRow: { flexDirection: 'row', gap: 10 },
  retakeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: 14, paddingVertical: 13,
  },
  retakeBtnText:   { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  closeAction:     { paddingHorizontal: 20, borderRadius: 14, paddingVertical: 13, backgroundColor: COLORS.cardAlt, alignItems: 'center', justifyContent: 'center' },
  closeActionText: { fontSize: 14, fontWeight: '700', color: COLORS.textMedium },
});
