import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

// ── Azerbaijan bounding box ───────────────────────────────────────────────────
const AZ = {
  minLat: 38.25, maxLat: 41.95,
  minLng: 44.75, maxLng: 50.75,
  centerLat: 40.15, centerLng: 47.75,
};

const INITIAL_REGION: Region = {
  latitude: AZ.centerLat,
  longitude: AZ.centerLng,
  latitudeDelta: 4.0,
  longitudeDelta: 5.5,
};

// Clamp a region so the map never drifts outside Azerbaijan
const clamp = (region: Region): Region => ({
  latitude:       Math.max(AZ.minLat, Math.min(AZ.maxLat, region.latitude)),
  longitude:      Math.max(AZ.minLng, Math.min(AZ.maxLng, region.longitude)),
  latitudeDelta:  Math.min(Math.max(region.latitudeDelta, 0.05), 4.2),
  longitudeDelta: Math.min(Math.max(region.longitudeDelta, 0.05), 5.8),
});

// ── Markers ───────────────────────────────────────────────────────────────────
const ALL_MARKERS = [
  { id: 'f1', title: 'Green Valley Farm',    sub: 'Sheki · ₼45/person',   lat: 41.1984, lng: 47.1705, color: COLORS.primary,        cat: 'Farm'     },
  { id: 'f2', title: 'Sunrise Orchard',      sub: 'Ganja · ₼35/person',   lat: 40.6828, lng: 46.3606, color: COLORS.primary,        cat: 'Farm'     },
  { id: 'f3', title: 'Pomegranate Estate',   sub: 'Goychay · ₼50/person', lat: 40.6560, lng: 47.7400, color: '#C0392B',             cat: 'Farm'     },
  { id: 'f4', title: 'Hazelnut Hills',       sub: 'Zagatala · ₼40/person',lat: 41.6330, lng: 46.6390, color: '#A67C52',             cat: 'Farm'     },
  { id: 'h1', title: 'Sunrise Horse Ranch',  sub: 'Gabala · ₼60/person',  lat: 40.9893, lng: 47.8418, color: '#A67C52',             cat: 'Horse'    },
  { id: 'h2', title: 'Karabakh Stud Farm',   sub: 'Aghdam · ₼80/person',  lat: 39.9910, lng: 46.9270, color: '#C0392B',             cat: 'Horse'    },
  { id: 'c1', title: 'Mountain Camp Site',   sub: 'Lahij · ₼30/person',   lat: 40.8370, lng: 48.3790, color: '#E67E22',             cat: 'Camp'     },
  { id: 'c2', title: 'Riverside Wild Camp',  sub: 'Gabala · ₼25/person',  lat: 40.9700, lng: 47.8200, color: '#E67E22',             cat: 'Camp'     },
  { id: 'p1', title: 'Maiden Tower',         sub: 'Baku · UNESCO',         lat: 40.3660, lng: 49.8370, color: COLORS.historicalLight, cat: 'Historic' },
  { id: 'p2', title: 'Sheki Khan Palace',    sub: 'Sheki · Palace',        lat: 41.1960, lng: 47.1750, color: COLORS.historicalLight, cat: 'Historic' },
  { id: 'p3', title: 'Gobustan Rock Art',    sub: 'Gobustan · UNESCO',     lat: 40.0732, lng: 49.3697, color: COLORS.historicalLight, cat: 'Historic' },
  { id: 'p4', title: 'Ateshgah Fire Temple', sub: 'Surakhani',             lat: 40.4095, lng: 50.0043, color: COLORS.historicalLight, cat: 'Historic' },
];

const FILTERS = ['All', 'Farm', 'Horse', 'Camp', 'Historic'] as const;
const FILTER_COLORS: Record<string, string> = {
  All: COLORS.primary, Farm: COLORS.primary,
  Horse: '#A67C52', Camp: '#E67E22', Historic: COLORS.historicalLight,
};

type Props = { navigation: any };

export default function FullMapScreen({ navigation }: Props) {
  const mapRef = useRef<MapView>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selected, setSelected]         = useState<string | null>(null);
  const [region, setRegion]             = useState<Region>(INITIAL_REGION);
  const [userLoc, setUserLoc]           = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError]         = useState('');
  const [locLoading, setLocLoading]     = useState(true);

  // ── Request GPS on mount ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocError('Location permission denied');
          setLocLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } catch {
        setLocError('Could not get location');
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

  // ── Go to my location ─────────────────────────────────────────────────────
  const goToMyLocation = () => {
    if (!userLoc) return;
    // Only centre if inside Azerbaijan, otherwise show a clamped region
    const clamped = clamp({
      latitude:       userLoc.lat,
      longitude:      userLoc.lng,
      latitudeDelta:  0.3,
      longitudeDelta: 0.3,
    });
    mapRef.current?.animateToRegion(clamped, 800);
  };

  // ── Enforce Azerbaijan boundary on drag ───────────────────────────────────
  const onRegionChangeComplete = (r: Region) => {
    const clamped = clamp(r);
    if (
      Math.abs(clamped.latitude - r.latitude) > 0.001 ||
      Math.abs(clamped.longitude - r.longitude) > 0.001
    ) {
      mapRef.current?.animateToRegion(clamped, 300);
    }
    setRegion(clamped);
  };

  const markers = activeFilter === 'All'
    ? ALL_MARKERS
    : ALL_MARKERS.filter((m) => m.cat === activeFilter);

  const sel = ALL_MARKERS.find((m) => m.id === selected);

  return (
    <View style={styles.container}>
      {/* ── Full-screen map ────────────────────────────────────────────── */}
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
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            pinColor={m.color}
            onPress={() => setSelected(m.id === selected ? null : m.id)}
          />
        ))}
      </MapView>

      {/* ── Top overlay ────────────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.topOverlay}>
        {/* Header bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.titleBlock}>
            <Text style={styles.topTitle}>Azerbaijan Map</Text>
            <View style={styles.azBadge}>
              <Ionicons name="flag" size={10} color={COLORS.primary} />
              <Text style={styles.azBadgeText}>AZ only</Text>
            </View>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{markers.length} places</Text>
          </View>
        </View>

        {/* Category filters */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => { setActiveFilter(f); setSelected(null); }}
                style={[styles.filterChip, active && { backgroundColor: FILTER_COLORS[f], borderColor: FILTER_COLORS[f] }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      {/* ── Selected place card ───────────────────────────────────────── */}
      {sel && (
        <View style={styles.placeCard}>
          <View style={[styles.accent, { backgroundColor: sel.color }]} />
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{sel.title}</Text>
            <View style={styles.placeMetaRow}>
              <Ionicons name="location-outline" size={12} color={COLORS.textLight} />
              <Text style={styles.placeMeta}>{sel.sub}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.routeBtn}>
            <Ionicons name="navigate" size={14} color={COLORS.white} />
            <Text style={styles.routeText}>Route</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      )}

      {/* ── GPS / My-location button ───────────────────────────────────── */}
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
        {locError !== '' && (
          <View style={styles.locErrorBadge}>
            <Text style={styles.locErrorText}>{locError}</Text>
          </View>
        )}
      </SafeAreaView>
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
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.cardAlt, justifyContent: 'center', alignItems: 'center',
  },
  titleBlock: { flex: 1, gap: 2 },
  topTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  azBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryXLight,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  azBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  countBadge: {
    backgroundColor: COLORS.primaryXLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  countText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  // Filters
  filterRow: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 14, paddingBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    backgroundColor: COLORS.white, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: 'rgba(0,0,0,0.1)', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  filterText: { fontSize: 13, fontWeight: '700', color: COLORS.textMedium },
  filterTextActive: { color: COLORS.white },

  // Place card
  placeCard: {
    position: 'absolute', bottom: 110, left: 14, right: 14,
    backgroundColor: COLORS.white, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 14, elevation: 8,
  },
  accent: { width: 5, alignSelf: 'stretch' },
  placeInfo: { flex: 1, padding: 14 },
  placeName: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  placeMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  placeMeta: { fontSize: 12, color: COLORS.textLight },
  routeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.primary, paddingHorizontal: 14,
    paddingVertical: 9, borderRadius: 12, marginRight: 8,
  },
  routeText: { fontSize: 13, fontWeight: '700', color: COLORS.white },
  closeBtn: { paddingHorizontal: 10 },

  // GPS FAB
  fab: { position: 'absolute', bottom: 0, right: 14, alignItems: 'flex-end', gap: 8 },
  myLocBtn: {
    marginBottom: 110,
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 5,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  myLocBtnDisabled: { opacity: 0.5 },
  locErrorBadge: {
    position: 'absolute', bottom: 170, right: 0,
    backgroundColor: COLORS.error + 'EE',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  locErrorText: { fontSize: 11, color: COLORS.white, fontWeight: '600' },
});
