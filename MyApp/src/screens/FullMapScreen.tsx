import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  ScrollView, Animated, Dimensions, Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { getPhotos } from '../data/placeImages';

const { width, height } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.62;

// ── Azerbaijan boundary ───────────────────────────────────────────────────────
const AZ = { minLat: 38.25, maxLat: 41.95, minLng: 44.75, maxLng: 50.75 };
const INITIAL_REGION: Region = { latitude: 40.15, longitude: 47.75, latitudeDelta: 4.0, longitudeDelta: 5.5 };
const clamp = (r: Region): Region => ({
  latitude:       Math.max(AZ.minLat, Math.min(AZ.maxLat, r.latitude)),
  longitude:      Math.max(AZ.minLng, Math.min(AZ.maxLng, r.longitude)),
  latitudeDelta:  Math.min(Math.max(r.latitudeDelta, 0.05), 4.2),
  longitudeDelta: Math.min(Math.max(r.longitudeDelta, 0.05), 5.8),
});

// ── Place data ────────────────────────────────────────────────────────────────
type Review = { author: string; text: string; rating: number; date: string };
type PlaceDetail = {
  id: string; title: string; sub: string; lat: number; lng: number;
  color: string; cat: string; gradient: [string, string];
  description: string; rating: string; reviews: number;
  userReviews: Review[];
};

const ALL_PLACES: PlaceDetail[] = [
  {
    id: 'f1', title: 'Green Valley Farm', sub: 'Sheki · ₼45/person',
    lat: 41.1984, lng: 47.1705, color: COLORS.primary, cat: 'Farm',
    gradient: ['#0D3D24', '#2D9D63'],
    description: 'Üzvi kənd təsərrüfatı, meyvə dərimi, anbar turları və sakit vadi mənzərəsi ilə yaşıl dərənin dərinliyindəki unikal bir ferma təcrübəsi.',
    rating: '4.8', reviews: 127,
    userReviews: [
      { author: 'Aynur K.', text: 'Çox gözəl yer idi! Alma dərimi prosesi olduqca əyləncəli keçdi. Mütləq gelin!', rating: 5, date: 'Oktyabr 2024' },
      { author: 'Rauf M.', text: 'Ailəmlə birlikdə gəldik. Uşaqlar üçün ideal yer. Ferma sahibləri çox mehriban.', rating: 5, date: 'Sentyabr 2024' },
      { author: 'Leyla Ə.', text: 'Yerli məhsullar çox dadlı idi. Qiymət münasibdir.', rating: 4, date: 'Avqust 2024' },
    ],
  },
  {
    id: 'f2', title: 'Sunrise Orchard', sub: 'Ganja · ₼35/person',
    lat: 40.6828, lng: 46.3606, color: COLORS.primary, cat: 'Farm',
    gradient: ['#52B788', '#95D5B2'],
    description: 'Gəncə ətrafında yerləşən alma, armud və mövsümi meyvə bağı. Ailə üçün əlverişli rehbərli turlar.',
    rating: '4.6', reviews: 89,
    userReviews: [
      { author: 'Nigar T.', text: 'Meyvə bağı möhtəşəm idi. Çox rəngarəng meyvə növləri var.', rating: 5, date: 'Oktyabr 2024' },
      { author: 'Orxan S.', text: 'Gəncəyə gələndə mütləq buraya da uğrayın.', rating: 4, date: 'Sentyabr 2024' },
    ],
  },
  {
    id: 'f3', title: 'Pomegranate Estate', sub: 'Goychay · ₼50/person',
    lat: 40.6560, lng: 47.7400, color: '#C0392B', cat: 'Farm',
    gradient: ['#7B1E1E', '#E74C3C'],
    description: 'Azərbaycanın nar paytaxtı Göyçayda yerləşən bu bağda nar dərimi turları keçirilir.',
    rating: '4.9', reviews: 203,
    userReviews: [
      { author: 'Şəhriyar H.', text: 'Oktyabr ayında gəldik — nar festivalı dövründə. Heyrətamiz idi!', rating: 5, date: 'Oktyabr 2024' },
      { author: 'Gülnar A.', text: 'Nar şirəsi dadılmaz idi. Bu yer olmasa olmaz!', rating: 5, date: 'Oktyabr 2024' },
      { author: 'Elnur B.', text: 'Möhtəşəm mənzərə, mehriban sahiblər.', rating: 5, date: 'Sentyabr 2024' },
    ],
  },
  {
    id: 'f4', title: 'Hazelnut Hills', sub: 'Zagatala · ₼40/person',
    lat: 41.6330, lng: 46.6390, color: '#A67C52', cat: 'Farm',
    gradient: ['#5C3317', '#A0522D'],
    description: 'Zaqatala fındıq bağları arasında gəzinti, emal prosesi ilə tanışlıq və təzə qovrulmuş fındıq dadı.',
    rating: '4.7', reviews: 64,
    userReviews: [
      { author: 'Kamran Y.', text: 'Çox sakit, yaşıl bir yer. Fındıq qovrulması prosesi maraqlı idi.', rating: 5, date: 'Sentyabr 2024' },
      { author: 'Sevinc M.', text: 'Zaqatalaya gəldikdə mütləq buraya gəlin.', rating: 4, date: 'Avqust 2024' },
    ],
  },
  {
    id: 'h1', title: 'Sunrise Horse Ranch', sub: 'Gabala · ₼60/person',
    lat: 40.9893, lng: 47.8418, color: '#A67C52', cat: 'Horse',
    gradient: ['#5C3317', '#E8773A'],
    description: 'Dağ çəmənliklərindəki rehbərli at mərişi turları. Yeni başlayanlar üçün mükəmməl — bütün bacarıq səviyyələri qəbul edilir.',
    rating: '4.9', reviews: 312,
    userReviews: [
      { author: 'Tural İ.', text: 'İlk at miniş təcrübəm idi. Rehbər çox səbirli idi!', rating: 5, date: 'Noyabr 2024' },
      { author: 'Aida C.', text: 'Mənzərə heyrətləndirici. At da çox yumşaq xasiyyətli idi.', rating: 5, date: 'Oktyabr 2024' },
    ],
  },
  {
    id: 'h2', title: 'Karabakh Stud Farm', sub: 'Aghdam · ₼80/person',
    lat: 39.9910, lng: 46.9270, color: '#C0392B', cat: 'Horse',
    gradient: ['#7B1E1E', '#A67C52'],
    description: 'Azərbaycanın milli atı Qarabağ cinsi ilə tanışlıq. Açıq düzənlikdə at sürmə imkanı.',
    rating: '4.8', reviews: 178,
    userReviews: [
      { author: 'Fərid Q.', text: 'Qarabağ atları inanılmaz gözəldir! Bunu heç vaxt unutmayacağam.', rating: 5, date: 'Oktyabr 2024' },
      { author: 'Nərmin R.', text: 'Tarixi yer, gözəl atlar. Qiymət buna dəyər.', rating: 4, date: 'Sentyabr 2024' },
    ],
  },
  {
    id: 'c1', title: 'Mountain Camp Site', sub: 'Lahij · ₼30/person',
    lat: 40.8370, lng: 48.3790, color: '#E67E22', cat: 'Camp',
    gradient: ['#1A3A6E', '#4FC3F7'],
    description: 'Çadır və ya qlamping günbəzi — dağ zirvələrini buludda oyanmaq üçün ideal. Təbiətin içindəki sülh.',
    rating: '4.7', reviews: 95,
    userReviews: [
      { author: 'Murad P.', text: 'Səhər açılan dağ mənzərəsi sözlə ifadə edilməzdir.', rating: 5, date: 'İyul 2024' },
      { author: 'Günel V.', text: 'Gecə yıldızlara baxmaq olduqca romantikdir.', rating: 5, date: 'Avqust 2024' },
    ],
  },
  {
    id: 'c2', title: 'Riverside Wild Camp', sub: 'Gabala · ₼25/person',
    lat: 40.9700, lng: 47.8200, color: '#E67E22', cat: 'Camp',
    gradient: ['#1A4A2E', '#1B6CA8'],
    description: 'Şəffaf çayın kənarında düşərgə qurun. Gecə yürüşləri, tonqal hekayələri daxildir.',
    rating: '4.6', reviews: 72,
    userReviews: [
      { author: 'Əli N.', text: 'Çay səsi ilə yatmaq əla idi. Mükəmməl tərk-etmə yeri.', rating: 5, date: 'İyun 2024' },
      { author: 'Sona X.', text: 'Sadə amma gözəl. Tonqal gecəsi çox əyləncəli idi.', rating: 4, date: 'İyul 2024' },
    ],
  },
  {
    id: 'p1', title: 'Maiden Tower', sub: 'Baku · UNESCO',
    lat: 40.3660, lng: 49.8370, color: COLORS.historicalLight, cat: 'Historic',
    gradient: ['#1A3A6E', '#3B6CB0'],
    description: 'Bakının simvolu olan 12-ci əsr qülləsi. Xəzər dənizinə nəzər yetirir, UNESCO Dünya İrsi Siyahısındadır.',
    rating: '4.9', reviews: 2841,
    userReviews: [
      { author: 'Zəhra E.', text: 'Azərbaycanın ən ikonik yeri! Mənzərə inanılmazdır.', rating: 5, date: 'Noyabr 2024' },
      { author: 'Arif B.', text: 'UNESCO abidəsi görməyə dəyər. Tarixi hiss olunur.', rating: 5, date: 'Oktyabr 2024' },
      { author: 'Lalə C.', text: 'Çox möhtəşəm memarlıq. Tövsiyə edirəm.', rating: 5, date: 'Oktyabr 2024' },
    ],
  },
  {
    id: 'p2', title: 'Sheki Khan Palace', sub: 'Sheki · Palace',
    lat: 41.1960, lng: 47.1750, color: COLORS.historicalLight, cat: 'Historic',
    gradient: ['#4A1D96', '#7C3AED'],
    description: '18-ci əsr sarayı. Vitraj pəncərələri və fresk naxışları ilə Azərbaycan memarlığının şah əsəri.',
    rating: '4.9', reviews: 1654,
    userReviews: [
      { author: 'Vüsal D.', text: 'Vitraj pəncərələr möhtəşəmdir. Şəkiyə gəlsəniz mütləq görün!', rating: 5, date: 'Sentyabr 2024' },
      { author: 'Könül T.', text: 'Heyranedici sənətkarlıq. Daxilindəki frescolar göz oxşayır.', rating: 5, date: 'Avqust 2024' },
    ],
  },
  {
    id: 'p3', title: 'Gobustan Rock Art', sub: 'Gobustan · UNESCO',
    lat: 40.0732, lng: 49.3697, color: COLORS.historicalLight, cat: 'Historic',
    gradient: ['#5C3317', '#A0522D'],
    description: 'E.ə. 40.000 il əvvələ aid qayaüstü rəsmlər — Azərbaycanın ən qədim miras abidəsi.',
    rating: '4.7', reviews: 892,
    userReviews: [
      { author: 'Rəşad H.', text: 'Çox nadir bir yer. Tarixə baxmaq kimi hissiyat verdi.', rating: 5, date: 'Oktyabr 2024' },
      { author: 'İlham G.', text: '12,000 il əvvəlin rəsmlərini görmək inanılmazdır.', rating: 4, date: 'Avqust 2024' },
    ],
  },
  {
    id: 'p4', title: 'Ateshgah Fire Temple', sub: 'Surakhani',
    lat: 40.4095, lng: 50.0043, color: COLORS.historicalLight, cat: 'Historic',
    gradient: ['#8B2500', '#E8773A'],
    description: '17-ci əsr Zərdüşt od-tapınaq məbədi — əbədi alışan təbii qaz şöləsi üzərində tikilmişdir.',
    rating: '4.8', reviews: 1102,
    userReviews: [
      { author: 'Cavid Ə.', text: 'Odun heç vaxt sönmədiyi yeri görmək mistik bir hiss idi.', rating: 5, date: 'Noyabr 2024' },
      { author: 'Nərmin K.', text: 'Çox maraqlı tarixi. Rehberli tur tövsiyə edilir.', rating: 5, date: 'Oktyabr 2024' },
    ],
  },
];

const FILTERS = ['All', 'Farm', 'Horse', 'Camp', 'Historic'] as const;
const FILTER_COLORS: Record<string, string> = {
  All: COLORS.primary, Farm: COLORS.primary,
  Horse: '#A67C52', Camp: '#E67E22', Historic: COLORS.historicalLight,
};

type Props = { navigation: any };

export default function FullMapScreen({ navigation }: Props) {
  const mapRef   = useRef<MapView>(null);
  const sheetY   = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected]         = useState<PlaceDetail | null>(null);
  const [userLoc, setUserLoc]           = useState<{ lat: number; lng: number } | null>(null);
  const [locLoading, setLocLoading]     = useState(true);

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
        setLocLoading(false);
      }
    })();
  }, []);

  // ── Sheet animation ────────────────────────────────────────────────────────
  const openSheet = (place: PlaceDetail) => {
    setSelected(place);
    Animated.spring(sheetY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 180 }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetY, { toValue: SHEET_HEIGHT, useNativeDriver: true, duration: 220 }).start(() => setSelected(null));
  };

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

  const markers = activeFilter === 'All' ? ALL_PLACES : ALL_PLACES.filter((m) => m.cat === activeFilter);

  return (
    <View style={styles.container}>
      {/* ── Full-screen map ─────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={!!userLoc}
        showsMyLocationButton={false}
        showsCompass
        minZoomLevel={6}
        maxZoomLevel={15}
        onPress={closeSheet}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            pinColor={m.color}
            onPress={() => openSheet(m)}
          />
        ))}
      </MapView>

      {/* ── Top overlay ─────────────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.topOverlay}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.titleBlock}>
            <Text style={styles.topTitle}>Azerbaijan Map</Text>
            <View style={styles.azBadge}>
              <Text style={styles.azBadgeText}>🇦🇿 AZ only</Text>
            </View>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{markers.length} yer</Text>
          </View>
        </View>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => { setActiveFilter(f); closeSheet(); }}
                style={[styles.filterChip, active && { backgroundColor: FILTER_COLORS[f], borderColor: FILTER_COLORS[f] }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      {/* ── GPS button ──────────────────────────────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.fab}>
        <TouchableOpacity
          style={[styles.myLocBtn, !userLoc && styles.myLocBtnDisabled]}
          onPress={goToMyLocation}
          disabled={!userLoc}
        >
          {locLoading
            ? <ActivityIndicator size="small" color={COLORS.primary} />
            : <Ionicons name="locate" size={22} color={userLoc ? COLORS.primary : COLORS.textLight} />
          }
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Place detail bottom sheet ────────────────────────────────────── */}
      {selected && (
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          {/* Sheet header */}
          <LinearGradient colors={selected.gradient} style={styles.sheetHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.sheetHeroDeco} />
            <TouchableOpacity style={styles.sheetClose} onPress={closeSheet}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.sheetHeroBottom}>
              <View style={styles.ratingChip}>
                <Ionicons name="star" size={11} color="#FFD700" />
                <Text style={styles.ratingText}>{selected.rating}</Text>
                <Text style={styles.reviewCount}>({selected.reviews})</Text>
              </View>
              <Text style={styles.sheetTitle}>{selected.title}</Text>
              <View style={styles.sheetLocRow}>
                <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.sheetLoc}>{selected.sub}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Photo carousel */}
          <View style={styles.photoSection}>
            <Text style={styles.photoSectionTitle}>Şəkillər</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoScroll}>
              {/* Try to load real photos, fall back to gradient placeholders */}
              {getPhotos(selected.id).length > 0
                ? getPhotos(selected.id).map((src, i) => (
                    <Image key={i} source={src} style={styles.photo} resizeMode="cover" />
                  ))
                : [selected.gradient, ['#1A3A6E','#52B788'] as [string,string], ['#5C3317','#A0522D'] as [string,string]].map((g, i) => (
                    <LinearGradient key={i} colors={g as [string,string]} style={styles.photoPlaceholder}>
                      <Ionicons name="camera-outline" size={24} color="rgba(255,255,255,0.5)" />
                      <Text style={styles.photoPlaceholderText}>Tezliklə</Text>
                    </LinearGradient>
                  ))
              }
            </ScrollView>
          </View>

          <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
            {/* Description */}
            <Text style={styles.sheetDesc}>{selected.description}</Text>

            {/* Reviews */}
            <Text style={styles.reviewsTitle}>İstifadəçi rəyləri</Text>
            {selected.userReviews.map((r, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{r.author[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Ionicons key={s} name="star" size={12} color="#FFD700" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.routeBtn}>
              <Ionicons name="navigate" size={16} color={COLORS.white} />
              <Text style={styles.routeText}>Marşrut al</Text>
            </TouchableOpacity>

            <View style={{ height: 24 }} />
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Top overlay
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 14, marginTop: 8, marginBottom: 8,
    backgroundColor: COLORS.white, borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: 'rgba(0,0,0,0.18)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 6,
  },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.cardAlt, justifyContent: 'center', alignItems: 'center' },
  titleBlock: { flex: 1, gap: 2 },
  topTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  azBadge: { backgroundColor: COLORS.primaryXLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' },
  azBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  countBadge: { backgroundColor: COLORS.primaryXLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  countText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingBottom: 6 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: COLORS.white, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: 'rgba(0,0,0,0.08)', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 3, elevation: 2,
  },
  filterText: { fontSize: 13, fontWeight: '700', color: COLORS.textMedium },
  filterTextActive: { color: COLORS.white },

  // GPS
  fab: { position: 'absolute', bottom: 0, right: 14, alignItems: 'flex-end' },
  myLocBtn: {
    marginBottom: 110, width: 50, height: 50, borderRadius: 25,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 5,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  myLocBtnDisabled: { opacity: 0.5 },

  // Bottom sheet
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: SHEET_HEIGHT, backgroundColor: COLORS.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: 'rgba(0,0,0,0.3)', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 20,
    overflow: 'hidden',
  },
  sheetHero: { height: 140, padding: 16, justifyContent: 'space-between', overflow: 'hidden' },
  sheetHeroDeco: { position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.09)' },
  sheetClose: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' },
  sheetHeroBottom: { gap: 3 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.25)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  ratingText: { fontSize: 12, color: COLORS.white, fontWeight: '700' },
  reviewCount: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: COLORS.white },
  sheetLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sheetLoc: { fontSize: 12, color: 'rgba(255,255,255,0.82)' },

  // Photos
  photoSection: { paddingVertical: 10 },
  photoSectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, paddingHorizontal: 16, marginBottom: 8 },
  photoScroll: { paddingHorizontal: 16, gap: 10 },
  photo: { width: 130, height: 90, borderRadius: 12 },
  photoPlaceholder: { width: 130, height: 90, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 4 },
  photoPlaceholderText: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  // Body
  sheetBody: { flex: 1, paddingHorizontal: 16 },
  sheetDesc: { fontSize: 14, color: COLORS.textMedium, lineHeight: 21, marginBottom: 14 },

  // Reviews
  reviewsTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 10 },
  reviewCard: { backgroundColor: COLORS.cardAlt, borderRadius: 14, padding: 12, marginBottom: 10, gap: 8 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { fontSize: 14, fontWeight: '800', color: COLORS.white },
  reviewAuthor: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  reviewDate: { fontSize: 11, color: COLORS.textLight },
  reviewStars: { flexDirection: 'row', gap: 1 },
  reviewText: { fontSize: 13, color: COLORS.textMedium, lineHeight: 19 },

  // Route button
  routeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 14, marginTop: 8,
  },
  routeText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
