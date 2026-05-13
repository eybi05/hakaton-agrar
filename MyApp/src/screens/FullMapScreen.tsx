import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  ScrollView, Modal, Image, Dimensions, Pressable,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { getPhotos } from '../data/placeImages';

const { width, height } = Dimensions.get('window');

// ── Azerbaijan boundary ───────────────────────────────────────────────────────
const AZ = { minLat: 38.25, maxLat: 41.95, minLng: 44.75, maxLng: 50.75 };
const INITIAL: Region = { latitude: 40.15, longitude: 47.75, latitudeDelta: 4.0, longitudeDelta: 5.5 };
const clamp = (r: Region): Region => ({
  latitude:       Math.max(AZ.minLat, Math.min(AZ.maxLat, r.latitude)),
  longitude:      Math.max(AZ.minLng, Math.min(AZ.maxLng, r.longitude)),
  latitudeDelta:  Math.min(Math.max(r.latitudeDelta, 0.05), 4.2),
  longitudeDelta: Math.min(Math.max(r.longitudeDelta, 0.05), 5.8),
});

// ── Types ─────────────────────────────────────────────────────────────────────
type Review  = { author: string; text: string; rating: number; date: string };
type Place   = {
  id: string; title: string; sub: string;
  lat: number; lng: number; color: string; cat: string;
  gradient: [string, string];
  description: string; rating: string; reviews: number;
  userReviews: Review[];
};

// ── All places ────────────────────────────────────────────────────────────────
const PLACES: Place[] = [
  {
    id: 'f1', cat: 'Farm', title: 'Green Valley Farm', sub: 'Şəki · ₼45/nəfər',
    lat: 41.1984, lng: 47.1705, color: COLORS.primary, gradient: ['#0D3D24', '#2D9D63'],
    rating: '4.8', reviews: 127,
    description: 'Üzvi kənd təsərrüfatı, meyvə dərimi, anbar turları və sakit vadi mənzərəsi ilə yaşıl dərənin dərinliyindəki unikal ferma təcrübəsi.',
    userReviews: [
      { author: 'Aynur K.',  text: 'Çox gözəl yer! Alma dərimi əyləncəli keçdi. Mütləq gəlin!',          rating: 5, date: 'Okt 2024' },
      { author: 'Rauf M.',   text: 'Ailə ilə gəldik, uşaqlar üçün ideal. Sahiblər çox mehribandır.',      rating: 5, date: 'Sen 2024' },
      { author: 'Leyla Ə.', text: 'Yerli məhsullar dadlı idi, qiymət münasib.',                           rating: 4, date: 'Avq 2024' },
    ],
  },
  {
    id: 'f2', cat: 'Farm', title: 'Sunrise Orchard', sub: 'Gəncə · ₼35/nəfər',
    lat: 40.6828, lng: 46.3606, color: '#52B788', gradient: ['#1A4A2E', '#52B788'],
    rating: '4.6', reviews: 89,
    description: 'Gəncə ətrafında alma, armud və mövsümi meyvə bağı. Ailə üçün əlverişli rehbərli turlar.',
    userReviews: [
      { author: 'Nigar T.',  text: 'Meyvə bağı möhtəşəm idi! Çox rəngarəng meyvə növləri var.',           rating: 5, date: 'Okt 2024' },
      { author: 'Orxan S.', text: 'Gəncəyə gəldikdə mütləq buraya uğrayın.',                              rating: 4, date: 'Sen 2024' },
    ],
  },
  {
    id: 'f3', cat: 'Farm', title: 'Pomegranate Estate', sub: 'Göyçay · ₼50/nəfər',
    lat: 40.6560, lng: 47.7400, color: '#C0392B', gradient: ['#7B1E1E', '#E74C3C'],
    rating: '4.9', reviews: 203,
    description: 'Azərbaycanın nar paytaxtı Göyçayda nar dərimi turları. Oktyabr Nar Festivalı dövründə mütləq gəlin!',
    userReviews: [
      { author: 'Şəhriyar H.', text: 'Festival dövründə gəldik — heyrətamiz idi!',                        rating: 5, date: 'Okt 2024' },
      { author: 'Gülnar A.',   text: 'Nar şirəsi dadılmaz idi. Bu yer olmasa olmaz!',                      rating: 5, date: 'Okt 2024' },
      { author: 'Elnur B.',    text: 'Möhtəşəm mənzərə, mehriban sahiblər.',                               rating: 5, date: 'Sen 2024' },
    ],
  },
  {
    id: 'f4', cat: 'Farm', title: 'Hazelnut Hills', sub: 'Zaqatala · ₼40/nəfər',
    lat: 41.6330, lng: 46.6390, color: '#A67C52', gradient: ['#5C3317', '#A0522D'],
    rating: '4.7', reviews: 64,
    description: 'Zaqatala fındıq bağlarında gəzinti, emal prosesi ilə tanışlıq və təzə qovrulmuş fındıq dadı.',
    userReviews: [
      { author: 'Kamran Y.', text: 'Sakit, yaşıl yer. Fındıq qovrulması maraqlı idi.',                    rating: 5, date: 'Sen 2024' },
      { author: 'Sevinc M.', text: 'Zaqatalaya gəlsəniz mütləq buraya gəlin.',                             rating: 4, date: 'Avq 2024' },
    ],
  },
  {
    id: 'h1', cat: 'Horse', title: 'Sunrise Horse Ranch', sub: 'Qəbələ · ₼60/nəfər',
    lat: 40.9893, lng: 47.8418, color: '#A67C52', gradient: ['#5C3317', '#E8773A'],
    rating: '4.9', reviews: 312,
    description: 'Dağ çəmənliklərindəki rehbərli at mərişi turları. Yeni başlayanlar üçün mükəmməl — bütün bacarıq səviyyələri qəbul edilir.',
    userReviews: [
      { author: 'Tural İ.',  text: 'İlk at miniş təcrübəm idi. Rehbər çox səbirli idi!',                  rating: 5, date: 'Noy 2024' },
      { author: 'Aida C.',   text: 'Mənzərə heyrətləndirici. At da çox yumşaq xasiyyətli idi.',            rating: 5, date: 'Okt 2024' },
    ],
  },
  {
    id: 'h2', cat: 'Horse', title: 'Karabakh Stud Farm', sub: 'Ağdam · ₼80/nəfər',
    lat: 39.9910, lng: 46.9270, color: '#C0392B', gradient: ['#7B1E1E', '#A67C52'],
    rating: '4.8', reviews: 178,
    description: 'Azərbaycanın milli atı Qarabağ cinsi ilə tanışlıq. Açıq düzənlikdə at sürmə imkanı.',
    userReviews: [
      { author: 'Fərid Q.',  text: 'Qarabağ atları inanılmaz gözəldir! Unutmayacağam.',                    rating: 5, date: 'Okt 2024' },
      { author: 'Nərmin R.', text: 'Tarixi yer, gözəl atlar. Qiymət buna dəyər.',                          rating: 4, date: 'Sen 2024' },
    ],
  },
  {
    id: 'c1', cat: 'Camp', title: 'Mountain Camp Site', sub: 'Lahıc · ₼30/nəfər',
    lat: 40.8370, lng: 48.3790, color: '#E67E22', gradient: ['#1A3A6E', '#4FC3F7'],
    rating: '4.7', reviews: 95,
    description: 'Çadır və ya qlamping günbəzi — dağ zirvələrini buludda oyanmaq üçün ideal. Gecə yıldız müşahidəsi daxildir.',
    userReviews: [
      { author: 'Murad P.', text: 'Səhər açılan dağ mənzərəsi sözlə ifadə edilməzdir.',                   rating: 5, date: 'İyul 2024' },
      { author: 'Günel V.', text: 'Gecə yıldızlara baxmaq çox romantik idi.',                              rating: 5, date: 'Avq 2024' },
    ],
  },
  {
    id: 'c2', cat: 'Camp', title: 'Riverside Wild Camp', sub: 'Qəbələ · ₼25/nəfər',
    lat: 40.9700, lng: 47.8200, color: '#E67E22', gradient: ['#1A4A2E', '#1B6CA8'],
    rating: '4.6', reviews: 72,
    description: 'Şəffaf çayın kənarında düşərgə. Gecə yürüşləri, tonqal hekayələri daxildir.',
    userReviews: [
      { author: 'Əli N.', text: 'Çay səsi ilə yatmaq əla idi. Mükəmməl tərk-etmə yeri.',                  rating: 5, date: 'İyun 2024' },
      { author: 'Sona X.', text: 'Sadə amma gözəl. Tonqal gecəsi çox əyləncəli idi.',                      rating: 4, date: 'İyul 2024' },
    ],
  },
  {
    id: 'p1', cat: 'Historic', title: 'Maiden Tower', sub: 'Bakı · UNESCO',
    lat: 40.3660, lng: 49.8370, color: COLORS.historicalLight, gradient: ['#1A3A6E', '#3B6CB0'],
    rating: '4.9', reviews: 2841,
    description: 'Bakının simvolu olan 12-ci əsr qülləsi. Xəzər dənizinə nəzər yetirir, UNESCO Dünya İrsi Siyahısındadır.',
    userReviews: [
      { author: 'Zəhra E.',  text: 'Azərbaycanın ən ikonik yeri! Mənzərə inanılmazdır.',                   rating: 5, date: 'Noy 2024' },
      { author: 'Arif B.',   text: 'UNESCO abidəsi görməyə dəyər. Tarixi hiss olunur.',                    rating: 5, date: 'Okt 2024' },
      { author: 'Lalə C.',   text: 'Çox möhtəşəm memarlıq. Tövsiyə edirəm.',                               rating: 5, date: 'Okt 2024' },
    ],
  },
  {
    id: 'p2', cat: 'Historic', title: 'Sheki Khan Palace', sub: 'Şəki · Saray',
    lat: 41.1960, lng: 47.1750, color: COLORS.historicalLight, gradient: ['#4A1D96', '#7C3AED'],
    rating: '4.9', reviews: 1654,
    description: '18-ci əsr sarayı. Vitraj pəncərələri və fresk naxışları ilə Azərbaycan memarlığının şah əsəri.',
    userReviews: [
      { author: 'Vüsal D.',  text: 'Vitraj pəncərələr möhtəşəmdir. Şəkiyə gəlsəniz mütləq görün!',        rating: 5, date: 'Sen 2024' },
      { author: 'Könül T.', text: 'Heyranedici sənətkarlıq. Daxilindəki fresklər göz oxşayır.',            rating: 5, date: 'Avq 2024' },
    ],
  },
  {
    id: 'p3', cat: 'Historic', title: 'Gobustan Rock Art', sub: 'Qobustan · UNESCO',
    lat: 40.0732, lng: 49.3697, color: COLORS.historicalLight, gradient: ['#5C3317', '#A0522D'],
    rating: '4.7', reviews: 892,
    description: 'E.ə. 40.000 il əvvələ aid qayaüstü rəsmlər — Azərbaycanın ən qədim miras abidəsi.',
    userReviews: [
      { author: 'Rəşad H.', text: 'Çox nadir yer. Tarixə baxmaq kimi hissiyat verdi.',                    rating: 5, date: 'Okt 2024' },
      { author: 'İlham G.', text: '12,000 il əvvəlin rəsmlərini görmək inanılmazdır.',                     rating: 4, date: 'Avq 2024' },
    ],
  },
  {
    id: 'p4', cat: 'Historic', title: 'Ateshgah Fire Temple', sub: 'Suraxanı',
    lat: 40.4095, lng: 50.0043, color: COLORS.historicalLight, gradient: ['#8B2500', '#E8773A'],
    rating: '4.8', reviews: 1102,
    description: '17-ci əsr Zərdüşt od-tapınaq məbədi — əbədi alışan təbii qaz şöləsi üzərinde tikilmişdir.',
    userReviews: [
      { author: 'Cavid Ə.', text: 'Odun heç vaxt sönmədiyi yeri görmək mistik bir hiss idi.',              rating: 5, date: 'Noy 2024' },
      { author: 'Nərmin K.', text: 'Çox maraqlı tarixi. Rehberli tur tövsiyə edilir.',                     rating: 5, date: 'Okt 2024' },
    ],
  },
];

const FILTERS = ['Hamısı', 'Farm', 'Horse', 'Camp', 'Historic'] as const;
const FILTER_COLORS: Record<string, string> = {
  Hamısı: COLORS.primary, Farm: COLORS.primary,
  Horse: '#A67C52', Camp: '#E67E22', Historic: COLORS.historicalLight,
};
const FILTER_LABELS: Record<string, string> = {
  Hamısı: 'Hamısı', Farm: '🌿 Ferma', Horse: '🐴 At', Camp: '⛺ Düşərgə', Historic: '🏛️ Tarixi',
};

type Props = { navigation: any };

export default function FullMapScreen({ navigation }: Props) {
  const mapRef = useRef<MapView>(null);
  const [filter,   setFilter]   = useState('Hamısı');
  const [selected, setSelected] = useState<Place | null>(null);
  const [userLoc,  setUserLoc]  = useState<{ lat: number; lng: number } | null>(null);
  const [loading,  setLoading]  = useState(true);

  // ── GPS ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goToMyLocation = () => {
    if (!userLoc) return;
    mapRef.current?.animateToRegion(
      clamp({ latitude: userLoc.lat, longitude: userLoc.lng, latitudeDelta: 0.3, longitudeDelta: 0.3 }),
      800,
    );
  };

  const onRegionChangeComplete = (r: Region) => {
    const c = clamp(r);
    if (Math.abs(c.latitude - r.latitude) > 0.001 || Math.abs(c.longitude - r.longitude) > 0.001) {
      mapRef.current?.animateToRegion(c, 300);
    }
  };

  const markers = filter === 'Hamısı' ? PLACES : PLACES.filter((p) => p.cat === filter);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Full-screen map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={!!userLoc}
        showsMyLocationButton={false}
        showsCompass
        minZoomLevel={6}
        maxZoomLevel={15}
      >
        {markers.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            pinColor={p.color}
            onPress={() => setSelected(p)}
          />
        ))}
      </MapView>

      {/* ── Top overlay ─────────────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.topLayer}>
        {/* Header bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>Azerbaijan Map</Text>
            <Text style={styles.topSub}>🇦🇿 Yalnız Azərbaycan · {markers.length} yer</Text>
          </View>
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          keyboardShouldPersistTaps="handled"
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterChip, active && { backgroundColor: FILTER_COLORS[f], borderColor: FILTER_COLORS[f] }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, active && { color: COLORS.white }]}>{FILTER_LABELS[f]}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {/* ── My-location button ────────────────────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.fabWrap}>
        <TouchableOpacity
          style={[styles.myLocBtn, !userLoc && { opacity: 0.4 }]}
          onPress={goToMyLocation}
          disabled={!userLoc}
        >
          {loading
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Ionicons name="locate" size={22} color={userLoc ? COLORS.primary : COLORS.textLight} />
          }
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Place Detail Modal ────────────────────────────────────────── */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <View style={styles.modalWrap}>
            {/* Dim overlay — tap to close */}
            <Pressable style={styles.modalDim} onPress={() => setSelected(null)} />

            {/* Detail sheet */}
            <View style={styles.sheet}>
              {/* Drag handle */}
              <View style={styles.handle} />

              {/* Hero gradient */}
              <LinearGradient colors={selected.gradient} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.heroDeco} />
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                  <Ionicons name="close" size={18} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.heroBottom}>
                  <View style={styles.ratingRow}>
                    {[1,2,3,4,5].map((s) => (
                      <Ionicons key={s} name="star" size={13} color={parseFloat(selected.rating) >= s ? '#FFD700' : 'rgba(255,255,255,0.3)'} />
                    ))}
                    <Text style={styles.ratingNum}>{selected.rating}</Text>
                    <Text style={styles.ratingCount}>({selected.reviews.toLocaleString()} rəy)</Text>
                  </View>
                  <Text style={styles.heroTitle}>{selected.title}</Text>
                  <View style={styles.heroLocRow}>
                    <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.heroLoc}>{selected.sub}</Text>
                  </View>
                </View>
              </LinearGradient>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.sheetBody}
                keyboardShouldPersistTaps="handled"
              >
                {/* ── Photo carousel ────────────────────────────────────── */}
                <Text style={styles.sectionTitle}>📷 Şəkillər</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.photoScroll}
                >
                  {getPhotos(selected.id).map((src, i) => (
                    <Image
                      key={i}
                      source={src}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
                <Text style={styles.photoHint}>
                  📁 Öz şəkillərinizi əlavə etmək üçün:{'\n'}
                  <Text style={styles.photoHintPath}>assets/places/{selected.id}_*/  →  src/data/placeImages.ts</Text>
                </Text>

                {/* ── Description ───────────────────────────────────────── */}
                <Text style={styles.sectionTitle}>ℹ️ Haqqında</Text>
                <Text style={styles.desc}>{selected.description}</Text>

                {/* ── User reviews ──────────────────────────────────────── */}
                <Text style={styles.sectionTitle}>💬 İstifadəçi Rəyləri</Text>
                {selected.userReviews.map((r, i) => (
                  <View key={i} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{r.author[0]}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewAuthor}>{r.author}</Text>
                        <Text style={styles.reviewDate}>{r.date}</Text>
                      </View>
                      <View style={styles.reviewStars}>
                        {Array.from({ length: r.rating }).map((_, s) => (
                          <Ionicons key={s} name="star" size={11} color="#FFD700" />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{r.text}</Text>
                  </View>
                ))}

                {/* ── CTA ───────────────────────────────────────────────── */}
                <TouchableOpacity style={styles.routeBtn} activeOpacity={0.88}>
                  <LinearGradient colors={selected.gradient} style={styles.routeBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Ionicons name="navigate" size={18} color={COLORS.white} />
                    <Text style={styles.routeBtnText}>Marşrut Al</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 16 }} />
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Top overlay
  topLayer: { position: 'absolute', top: 0, left: 0, right: 0 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 14, marginTop: 8, marginBottom: 8,
    backgroundColor: COLORS.white, borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: 'rgba(0,0,0,0.18)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 6,
  },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.cardAlt, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  topSub: { fontSize: 11, color: COLORS.textLight, marginTop: 1 },

  filterScroll: { paddingHorizontal: 14, gap: 8, paddingBottom: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    backgroundColor: COLORS.white, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: 'rgba(0,0,0,0.08)', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 3, elevation: 2,
  },
  filterText: { fontSize: 13, fontWeight: '700', color: COLORS.textMedium },

  // FAB
  fabWrap: { position: 'absolute', bottom: 0, right: 14, alignItems: 'flex-end' },
  myLocBtn: {
    marginBottom: 110, width: 50, height: 50, borderRadius: 25,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 5,
    borderWidth: 1.5, borderColor: COLORS.border,
  },

  // Modal
  modalWrap: { flex: 1, justifyContent: 'flex-end' },
  modalDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },

  // Detail sheet
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: height * 0.88,
    shadowColor: 'rgba(0,0,0,0.3)', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 24,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.divider, alignSelf: 'center', marginTop: 10, marginBottom: 4 },

  // Hero
  hero: { height: 160, padding: 16, justifyContent: 'space-between', overflow: 'hidden' },
  heroDeco: { position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)' },
  closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.28)', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' },
  heroBottom: { gap: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingNum: { fontSize: 13, fontWeight: '800', color: COLORS.white, marginLeft: 4 },
  ratingCount: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white, letterSpacing: -0.3 },
  heroLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroLoc: { fontSize: 13, color: 'rgba(255,255,255,0.82)' },

  // Body
  sheetBody: { padding: 16, gap: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginTop: 14, marginBottom: 8 },

  // Photos
  photoScroll: { gap: 10 },
  photo: { width: 200, height: 130, borderRadius: 14 },
  photoHint: { fontSize: 11, color: COLORS.textLight, marginTop: 8, lineHeight: 16 },
  photoHintPath: { fontSize: 10, color: COLORS.primary, fontFamily: 'monospace' },

  // Description
  desc: { fontSize: 14, color: COLORS.textMedium, lineHeight: 22 },

  // Reviews
  reviewCard: { backgroundColor: COLORS.cardAlt, borderRadius: 14, padding: 12, marginBottom: 8, gap: 8 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 15, fontWeight: '800', color: COLORS.white },
  reviewAuthor: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  reviewDate: { fontSize: 11, color: COLORS.textLight },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewText: { fontSize: 13, color: COLORS.textMedium, lineHeight: 20 },

  // CTA
  routeBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 10 },
  routeBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 15 },
  routeBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
