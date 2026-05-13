import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import type { HistoricalPlace } from './HistoricalScreen';
import { getHistoricalPhotos } from '../data/historicalImages';
import { getAudio, hasAudio } from '../data/historicalAudio';

const { width } = Dimensions.get('window');

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

type Props = {
  route: { params: { place: HistoricalPlace } };
  navigation: any;
};

export default function PlaceDetailScreen({ route, navigation }: Props) {
  const { place } = route.params;
  const { t }     = useLanguage();
  const photos    = getHistoricalPhotos(place.id);
  const audioSrc  = getAudio(place.id);

  // ── Audio state ────────────────────────────────────────────────────────────
  const [sound,      setSound]      = useState<Audio.Sound | null>(null);
  const [playing,    setPlaying]    = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [loading,    setLoading]    = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => { sound?.unloadAsync(); };
  }, [sound]);

  const loadAndPlay = useCallback(async () => {
    if (!audioSrc) return;
    try {
      setLoading(true);
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      if (sound) {
        // Already loaded — toggle play/pause
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
            setPlaying(false);
          } else {
            if (status.positionMillis >= status.durationMillis!) {
              await sound.setPositionAsync(0);
            }
            await sound.playAsync();
            setPlaying(true);
          }
        }
      } else {
        // First load
        const { sound: newSound } = await Audio.Sound.createAsync(
          audioSrc,
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setPositionMs(status.positionMillis);
              setDurationMs(status.durationMillis ?? 0);
              setPlaying(status.isPlaying);
              if (status.didJustFinish) {
                setPlaying(false);
                setPositionMs(0);
              }
            }
          },
        );
        setSound(newSound);
        setPlaying(true);
      }
    } catch (e) {
      console.warn('Audio error:', e);
    } finally {
      setLoading(false);
    }
  }, [sound, audioSrc]);

  const seek = useCallback(async (ratio: number) => {
    if (!sound || durationMs === 0) return;
    await sound.setPositionAsync(Math.floor(ratio * durationMs));
  }, [sound, durationMs]);

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* ── Hero gradient ──────────────────────────────────────────────── */}
        <LinearGradient colors={place.gradient} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.deco1} />
          <View style={styles.deco2} />

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.heroMeta}>
            <View style={styles.heroTopRow}>
              <View style={styles.tagChip}>
                <Text style={styles.tagText}>{place.tag}</Text>
              </View>
              <View style={styles.ratingChip}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>{place.rating}</Text>
              </View>
            </View>
            <Text style={styles.heroName}>{place.name}</Text>
            <View style={styles.heroLocRow}>
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.82)" />
              <Text style={styles.heroLoc}>{place.location}, Azerbaijan</Text>
            </View>
            <Text style={styles.heroEra}>{place.era}</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>

          {/* ── Audio Player ─────────────────────────────────────────────── */}
          {hasAudio(place.id) ? (
            <View style={styles.audioCard}>
              <LinearGradient colors={place.gradient} style={styles.audioGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.audioLeft}>
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={loadAndPlay}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={loading ? 'hourglass-outline' : playing ? 'pause' : 'play'}
                      size={22}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                  <View style={styles.audioInfo}>
                    <Text style={styles.audioTitle}>{t.placeDetail.audioGuide}</Text>
                    <Text style={styles.audioSub}>{t.placeDetail.audioSubtitle}</Text>
                  </View>
                </View>
                <Text style={styles.audioTime}>
                  {fmtTime(positionMs)}{durationMs > 0 ? ` / ${fmtTime(durationMs)}` : ''}
                </Text>
              </LinearGradient>

              {/* Progress bar — tap to seek */}
              <TouchableOpacity
                activeOpacity={1}
                style={styles.progressBar}
                onPress={(e) => seek(e.nativeEvent.locationX / (width - 32))}
              >
                <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Coming Soon placeholder ──────────────────────────────────── */
            <View style={styles.audioComingSoon}>
              <Ionicons name="mic-outline" size={22} color={COLORS.textLight} />
              <View style={{ flex: 1 }}>
                <Text style={styles.audioComingSoonTitle}>Səs Bələdçisi</Text>
                <Text style={styles.audioComingSoonSub}>Audio guide — tezliklə əlavə ediləcək</Text>
              </View>
              <View style={styles.soonBadge}>
                <Text style={styles.soonBadgeText}>Tezliklə</Text>
              </View>
            </View>
          )}

          {/* ── Photo carousel ───────────────────────────────────────────── */}
          <Text style={styles.secTitle}>📷 {t.placeDetail.photos}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoScroll}
          >
            {photos.map((src, i) => (
              <Image key={i} source={src} style={styles.photo} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* ── Full description ─────────────────────────────────────────── */}
          <Text style={styles.secTitle}>ℹ️ {t.placeDetail.about}</Text>
          <Text style={styles.descText}>{place.fullDesc ?? place.desc}</Text>

          {/* ── Bullet points ────────────────────────────────────────────── */}
          {place.bullets && place.bullets.length > 0 && (
            <>
              <Text style={styles.secTitle}>📌 {t.placeDetail.keyFacts}</Text>
              <View style={styles.bulletList}>
                {place.bullets.map((b, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <LinearGradient
                      colors={place.gradient}
                      style={styles.bulletDot}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.bulletNum}>{i + 1}</Text>
                    </LinearGradient>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ── Visitor info ─────────────────────────────────────────────── */}
          <Text style={styles.secTitle}>🕐 {t.placeDetail.visitorInfo}</Text>
          <View style={styles.infoGrid}>
            {(place.info ?? DEFAULT_INFO).map((item) => (
              <View key={item.label} style={styles.infoCard}>
                <View style={[styles.infoIconWrap, { backgroundColor: COLORS.historicalXLight }]}>
                  <Ionicons name={item.icon as any} size={18} color={COLORS.historical} />
                </View>
                <Text style={styles.infoValue}>{item.value}</Text>
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Nearby ───────────────────────────────────────────────────── */}
          <Text style={styles.secTitle}>🧭 {t.placeDetail.nearby}</Text>
          {([
            { key: 'nearby1', icon: 'restaurant-outline' },
            { key: 'nearby2', icon: 'hammer-outline'     },
            { key: 'nearby3', icon: 'walk-outline'       },
          ] as const).map(({ key, icon }) => (
            <TouchableOpacity key={key} style={styles.nearbyRow} activeOpacity={0.8}>
              <View style={[styles.nearbyIcon, { backgroundColor: COLORS.primaryXLight }]}>
                <Ionicons name={icon} size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.nearbyLabel}>{t.placeDetail[key]}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Giriş haqqı</Text>
          <Text style={styles.bottomFee}>
            {place.info?.find(i => i.label === 'Entry Fee')?.value ?? '₼5'}
            <Text style={styles.bottomFeeSub}> /nəfər</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.planBtn} activeOpacity={0.88}>
          <LinearGradient
            colors={place.gradient}
            style={styles.planBtnGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="navigate" size={16} color={COLORS.white} />
            <Text style={styles.planBtnText}>{t.placeDetail.planVisit}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const DEFAULT_INFO = [
  { label: 'Visitor Hours', value: '09:00 – 18:00', icon: 'time-outline'      },
  { label: 'Entry Fee',     value: '₼5 / person',   icon: 'wallet-outline'    },
  { label: 'Language',      value: 'Azerbaijani, EN', icon: 'language-outline' },
  { label: 'Best Season',   value: 'Apr – Oct',      icon: 'sunny-outline'     },
];

// Nearby items are translated inline via t.placeDetail in the JSX

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Hero
  hero: { height: 290, padding: 20, justifyContent: 'space-between', overflow: 'hidden' },
  deco1: { position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.08)' },
  deco2: { position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.06)' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.28)', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
  heroMeta: { gap: 6 },
  heroTopRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  tagChip: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 11, color: COLORS.white, fontWeight: '700' },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.28)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  ratingText: { fontSize: 12, color: COLORS.white, fontWeight: '600' },
  heroName: { fontSize: 26, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5 },
  heroLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroLoc: { fontSize: 13, color: 'rgba(255,255,255,0.82)' },
  heroEra: { fontSize: 12, color: 'rgba(255,255,255,0.62)', fontWeight: '500' },

  // Body
  body: { padding: 16 },
  secTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginTop: 22, marginBottom: 10 },

  // Audio player
  audioCard: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.15)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 4,
    marginTop: 16,
  },
  audioGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  audioLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  audioInfo: { gap: 2 },
  audioTitle: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  audioSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  audioTime: { fontSize: 13, fontWeight: '700', color: COLORS.white },
  progressBar: {
    height: 5, backgroundColor: 'rgba(0,0,0,0.15)',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.white },

  // Audio coming soon
  audioComingSoon: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginTop: 16,
    borderWidth: 1.5, borderColor: COLORS.divider, borderStyle: 'dashed',
  },
  audioComingSoonTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  audioComingSoonSub: { fontSize: 11, color: COLORS.textLight, marginTop: 1 },
  soonBadge: { backgroundColor: COLORS.historicalXLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  soonBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.historical },

  // Photos
  photoScroll: { gap: 10, paddingBottom: 4 },
  photo: { width: 220, height: 145, borderRadius: 14 },

  // Description
  descText: { fontSize: 14, color: COLORS.textMedium, lineHeight: 23 },

  // Bullet points
  bulletList: { gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  bulletDot: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginTop: 1, flexShrink: 0 },
  bulletNum: { fontSize: 11, fontWeight: '800', color: COLORS.white },
  bulletText: { flex: 1, fontSize: 14, color: COLORS.textMedium, lineHeight: 21 },

  // Info grid
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoCard: { width: (width - 48) / 2, backgroundColor: COLORS.card, borderRadius: 14, padding: 14, gap: 6, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2 },
  infoIconWrap: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoValue: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  infoLabel: { fontSize: 11, color: COLORS.textLight },

  // Nearby
  nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 8, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4, elevation: 1 },
  nearbyIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  nearbyLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textDark },

  // Bottom bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: COLORS.divider, shadowColor: 'rgba(0,0,0,0.1)', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 1, shadowRadius: 8, elevation: 10 },
  bottomLabel: { fontSize: 12, color: COLORS.textLight },
  bottomFee: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  bottomFeeSub: { fontSize: 13, fontWeight: '400', color: COLORS.textLight },
  planBtn: { borderRadius: 14, overflow: 'hidden' },
  planBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  planBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
