import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import type { HistoricalPlace } from './HistoricalScreen';
import { getHistoricalPhotos } from '../data/historicalImages';
import {
  getAudioForLang,
  hasAnyAudio,
  getAvailableLangs,
  type AudioLang,
} from '../data/historicalAudio';

const { width } = Dimensions.get('window');

const fmtTime = (secs: number) => {
  const s = Math.max(0, Math.floor(secs));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const LANG_META: Record<AudioLang, { flag: string; label: string }> = {
  en: { flag: '🇬🇧', label: 'English' },
  ru: { flag: '🇷🇺', label: 'Русский' },
};

type Props = {
  route: { params: { place: HistoricalPlace } };
  navigation: any;
};

export default function PlaceDetailScreen({ route, navigation }: Props) {
  const { place }  = route.params;
  const { t }      = useLanguage();
  const photos     = getHistoricalPhotos(place.id);
  const availLangs = getAvailableLangs(place.id);
  const showPlayer = hasAnyAudio(place.id);

  // Active language — default to first available (EN if present)
  const [activeLang, setActiveLang] = useState<AudioLang>(
    availLangs[0] ?? 'en',
  );

  // expo-audio player — initialised with the EN source for this place
  const initialSrc = getAudioForLang(place.id, activeLang);
  const player     = useAudioPlayer(initialSrc ?? null);

  // Detect natural playback end
  const wasPlaying = useRef(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (wasPlaying.current && !player.playing) setEnded(true);
    if (player.playing) { wasPlaying.current = true; setEnded(false); }
  }, [player.playing]);

  // Reset on place change
  useEffect(() => {
    player.pause();
    wasPlaying.current = false;
    setEnded(false);
    const langs = getAvailableLangs(place.id);
    setActiveLang(langs[0] ?? 'en');
  }, [place.id]);

  // ── Language switch ──────────────────────────────────────────────────────
  const switchLang = (lang: AudioLang) => {
    if (lang === activeLang) return;
    const src = getAudioForLang(place.id, lang);
    if (!src) return;
    player.pause();
    player.replace(src);
    setActiveLang(lang);
    wasPlaying.current = false;
    setEnded(false);
  };

  // ── Play / Pause ─────────────────────────────────────────────────────────
  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      // Replay from start if track ended
      if (ended || (player.duration > 0 && player.currentTime >= player.duration)) {
        player.seekTo(0);
        setEnded(false);
      }
      player.play();
    }
  };

  const progress = player.duration > 0 ? player.currentTime / player.duration : 0;

  // ── Seek ─────────────────────────────────────────────────────────────────
  const seek = (tapX: number, barWidth: number) => {
    if (player.duration === 0 || barWidth === 0) return;
    const ratio = Math.min(1, Math.max(0, tapX / barWidth));
    player.seekTo(ratio * player.duration);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <LinearGradient colors={place.gradient} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.deco1} />
          <View style={styles.deco2} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.heroMeta}>
            <View style={styles.heroTopRow}>
              <View style={styles.tagChip}><Text style={styles.tagText}>{place.tag}</Text></View>
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

          {/* ── Audio Guide (only shown when audio files are registered) ───── */}
          {showPlayer && (
            <View style={styles.audioCard}>
              {/* Header */}
              <View style={styles.audioHeader}>
                <LinearGradient colors={place.gradient} style={styles.audioIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Ionicons name="headset" size={18} color={COLORS.white} />
                </LinearGradient>
                <View>
                  <Text style={styles.audioTitle}>Audio Guide</Text>
                  <Text style={styles.audioSub}>Choose your language</Text>
                </View>
              </View>

              {/* Language selector — only shows buttons for available langs */}
              <View style={styles.langRow}>
                {availLangs.map((lang) => {
                  const active = lang === activeLang;
                  const meta   = LANG_META[lang];
                  return (
                    <TouchableOpacity
                      key={lang}
                      onPress={() => switchLang(lang)}
                      activeOpacity={0.8}
                      style={[
                        styles.langBtn,
                        active && { backgroundColor: place.gradient[0], borderColor: place.gradient[0] },
                      ]}
                    >
                      <Text style={styles.langFlag}>{meta.flag}</Text>
                      <Text style={[styles.langLabel, active && styles.langLabelActive]}>
                        {meta.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Player row: play/pause · progress bar · time */}
              <View style={styles.playerRow}>
                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={[styles.playBtn, { backgroundColor: place.gradient[0] }]}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={player.playing ? 'pause' : ended ? 'refresh' : 'play'}
                    size={20}
                    color={COLORS.white}
                  />
                </TouchableOpacity>

                {/* Progress bar */}
                <TouchableOpacity
                  style={styles.progressWrap}
                  activeOpacity={1}
                  onPress={(e) => seek(e.nativeEvent.locationX, e.nativeEvent.target as unknown as number)}
                >
                  <View
                    style={styles.progressTrack}
                    onLayout={() => {}}
                    // measure the actual rendered width for accurate seek
                    onTouchEnd={(e) => seek(e.nativeEvent.locationX, width - 32 - 56 - 52)}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress * 100}%` as any, backgroundColor: place.gradient[0] },
                      ]}
                    />
                    {/* Thumb */}
                    {progress > 0 && (
                      <View
                        style={[
                          styles.progressThumb,
                          { left: `${progress * 100}%` as any, backgroundColor: place.gradient[0] },
                        ]}
                      />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Time */}
                <Text style={styles.timeText}>
                  {player.duration > 0
                    ? `${fmtTime(player.currentTime)} / ${fmtTime(player.duration)}`
                    : fmtTime(player.currentTime)}
                </Text>
              </View>
            </View>
          )}

          {/* ── Photos ───────────────────────────────────────────────────── */}
          <Text style={styles.secTitle}>📷 {t.placeDetail.photos}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoScroll}>
            {photos.map((src, i) => (
              <Image key={i} source={src} style={styles.photo} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* ── Description ──────────────────────────────────────────────── */}
          <Text style={styles.secTitle}>ℹ️ {t.placeDetail.about}</Text>
          <Text style={styles.descText}>{place.fullDesc ?? place.desc}</Text>

          {/* ── Key facts ────────────────────────────────────────────────── */}
          {place.bullets?.length > 0 && (
            <>
              <Text style={styles.secTitle}>📌 {t.placeDetail.keyFacts}</Text>
              <View style={styles.bulletList}>
                {place.bullets.map((b, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <LinearGradient colors={place.gradient} style={styles.bulletDot} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
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
          <Text style={styles.bottomLabel}>{t.placeDetail.entryFee}</Text>
          <Text style={styles.bottomFee}>
            {place.info?.find(i => i.label === 'Entry Fee')?.value ?? '₼5'}
            <Text style={styles.bottomFeeSub}> {t.placeDetail.perPerson}</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.planBtn} activeOpacity={0.88}>
          <LinearGradient colors={place.gradient} style={styles.planBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="navigate" size={16} color={COLORS.white} />
            <Text style={styles.planBtnText}>{t.placeDetail.planVisit}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const DEFAULT_INFO = [
  { label: 'Visitor Hours', value: '09:00 – 18:00', icon: 'time-outline'     },
  { label: 'Entry Fee',     value: '₼5 / person',   icon: 'wallet-outline'   },
  { label: 'Language',      value: 'English, AZ',   icon: 'language-outline' },
  { label: 'Best Season',   value: 'Apr – Oct',      icon: 'sunny-outline'    },
];

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

  body: { padding: 16 },
  secTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginTop: 22, marginBottom: 10 },

  // ── Audio card ──────────────────────────────────────────────────────────
  audioCard: {
    backgroundColor: COLORS.card, borderRadius: 18, padding: 16,
    shadowColor: 'rgba(0,0,0,0.10)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 4,
    marginTop: 16, gap: 14,
  },
  audioHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  audioIcon:   { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  audioTitle:  { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  audioSub:    { fontSize: 11, color: COLORS.textLight, marginTop: 2 },

  // Language buttons
  langRow: { flexDirection: 'row', gap: 10 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22,
    backgroundColor: COLORS.cardAlt, borderWidth: 1.5, borderColor: COLORS.border,
  },
  langFlag:        { fontSize: 18 },
  langLabel:       { fontSize: 13, fontWeight: '700', color: COLORS.textMedium },
  langLabelActive: { color: COLORS.white },

  // Player
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  progressWrap:  { flex: 1, justifyContent: 'center', paddingVertical: 10 },
  progressTrack: {
    height: 5, borderRadius: 3,
    backgroundColor: COLORS.divider,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressThumb: {
    position: 'absolute', top: -4,
    width: 13, height: 13, borderRadius: 7,
    marginLeft: -6,
  },
  timeText: { fontSize: 11, fontWeight: '600', color: COLORS.textLight, minWidth: 52, textAlign: 'right' },

  // Photos
  photoScroll: { gap: 10, paddingBottom: 4 },
  photo: { width: 220, height: 145, borderRadius: 14 },
  descText: { fontSize: 14, color: COLORS.textMedium, lineHeight: 23 },

  // Bullets
  bulletList: { gap: 10 },
  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  bulletDot:  { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginTop: 1, flexShrink: 0 },
  bulletNum:  { fontSize: 11, fontWeight: '800', color: COLORS.white },
  bulletText: { flex: 1, fontSize: 14, color: COLORS.textMedium, lineHeight: 21 },

  // Info grid
  infoGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoCard:    { width: (width - 48) / 2, backgroundColor: COLORS.card, borderRadius: 14, padding: 14, gap: 6, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2 },
  infoIconWrap:{ width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoValue:   { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  infoLabel:   { fontSize: 11, color: COLORS.textLight },

  // Nearby
  nearbyRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 8, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4, elevation: 1 },
  nearbyIcon:  { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  nearbyLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textDark },

  // Bottom bar
  bottomBar:    { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: COLORS.divider, shadowColor: 'rgba(0,0,0,0.1)', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 1, shadowRadius: 8, elevation: 10 },
  bottomLabel:  { fontSize: 12, color: COLORS.textLight },
  bottomFee:    { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  bottomFeeSub: { fontSize: 13, fontWeight: '400', color: COLORS.textLight },
  planBtn:      { borderRadius: 14, overflow: 'hidden' },
  planBtnGrad:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  planBtnText:  { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
