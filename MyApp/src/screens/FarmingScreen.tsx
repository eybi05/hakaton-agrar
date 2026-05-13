import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Dimensions, Image, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme/colors';
import TokenBar from '../components/TokenBar';

const { width } = Dimensions.get('window');

const REGIONS = ['All', 'Sheki', 'Gabala', 'Quba', 'Ganja', 'Masalli', 'Zagatala', 'Goychay'];

const FARM_TYPES = [
  'Organic Farm', 'Fruit Orchard', 'Vineyard',
  'Livestock', 'Tea Plantation', 'Nut Farm', 'Other',
];

const TYPE_EMOJI: Record<string, string> = {
  'Organic Farm':    '🌿',
  'Fruit Orchard':   '🍎',
  'Pomegranate Farm':'🌸',
  'Nut Farm':        '🌰',
  'Tea Plantation':  '🫖',
  'Apple Orchard':   '🍏',
  'Vineyard':        '🍇',
  'Livestock':       '🐄',
  'Other':           '🏡',
};

interface Farm {
  id: string;
  name: string;
  region: string;
  type: string;
  price: string;
  rating: string;
  reviews: number;
  distance: string;
  tags: string[];
  gradient: [string, string];
  open: boolean;
  photos?: string[];
  isUserAdded?: boolean;
}

const INITIAL_FARMS: Farm[] = [
  {
    id: '1', name: 'Green Valley Farm', region: 'Sheki', type: 'Organic Farm',
    price: '₼45', rating: '4.8', reviews: 127, distance: '4.2 km',
    tags: ['Organic', 'Family-friendly', 'Guided Tours'],
    gradient: ['#0D3D24', '#2D9D63'], open: true,
  },
  {
    id: '2', name: 'Sunrise Orchard', region: 'Ganja', type: 'Fruit Orchard',
    price: '₼35', rating: '4.6', reviews: 89, distance: '12 km',
    tags: ['Fruit Picking', 'Seasonal', 'Tastings'],
    gradient: ['#52B788', '#95D5B2'], open: true,
  },
  {
    id: '3', name: 'Pomegranate Estate', region: 'Goychay', type: 'Pomegranate Farm',
    price: '₼50', rating: '4.9', reviews: 203, distance: '85 km',
    tags: ['UNESCO Region', 'Harvest Season', 'Wine'],
    gradient: ['#7B1E1E', '#E74C3C'], open: true,
  },
  {
    id: '4', name: 'Hazelnut Hills', region: 'Zagatala', type: 'Nut Farm',
    price: '₼40', rating: '4.7', reviews: 64, distance: '180 km',
    tags: ['Nuts', 'Forest Walk', 'Workshops'],
    gradient: ['#5C3317', '#A0522D'], open: false,
  },
  {
    id: '5', name: 'Masalli Tea Garden', region: 'Masalli', type: 'Tea Plantation',
    price: '₼25', rating: '4.6', reviews: 112, distance: '230 km',
    tags: ['Tea', 'Folk Music', 'Traditional'],
    gradient: ['#1A4A2E', '#52B788'], open: true,
  },
  {
    id: '6', name: 'Quba Apple Farm', region: 'Quba', type: 'Apple Orchard',
    price: '₼30', rating: '4.5', reviews: 77, distance: '170 km',
    tags: ['Apple Picking', 'Cider', 'Scenic'],
    gradient: ['#8B0000', '#E8773A'], open: true,
  },
  {
    id: '7', name: 'Sheki Silk Valley', region: 'Sheki', type: 'Organic Farm',
    price: '₼55', rating: '4.8', reviews: 148, distance: '6 km',
    tags: ['Silk', 'Heritage', 'Workshops'],
    gradient: ['#1e3a5f', '#4a90d9'], open: true,
  },
  {
    id: '8', name: 'Gabala Vineyard Estate', region: 'Gabala', type: 'Vineyard',
    price: '₼60', rating: '4.9', reviews: 95, distance: '220 km',
    tags: ['Wine Tasting', 'Scenic Views', 'Events'],
    gradient: ['#4a0e8f', '#9b59b6'], open: true,
  },
];

type Section = 'search' | 'add';

type Props = { navigation: any };

export default function FarmingScreen({ navigation }: Props) {
  const [section,    setSection]    = useState<Section>('search');
  const [search,     setSearch]     = useState('');
  const [favorites,  setFavorites]  = useState<string[]>([]);
  const [farms,      setFarms]      = useState<Farm[]>(INITIAL_FARMS);

  // Add form state
  const [newName,    setNewName]    = useState('');
  const [newRegion,  setNewRegion]  = useState('Sheki');
  const [newType,    setNewType]    = useState('Organic Farm');
  const [newPrice,   setNewPrice]   = useState('');
  const [newDesc,    setNewDesc]    = useState('');
  const [newPhotos,  setNewPhotos]  = useState<string[]>([]);

  const filteredFarms = farms.filter((f) =>
    !search ||
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.region.toLowerCase().includes(search.toLowerCase()) ||
    f.type.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleFav = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const pickPhoto = async (fromCamera: boolean) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access in Settings.');
      return;
    }
    if (fromCamera) {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.75, allowsEditing: true, aspect: [4, 3] });
      if (!result.canceled && result.assets?.[0]) {
        setNewPhotos((prev) => [...prev, result.assets[0].uri]);
      }
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.75,
        allowsMultipleSelection: true,
        selectionLimit: 6,
      });
      if (!result.canceled && result.assets?.length) {
        setNewPhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
      }
    }
  };

  const removePhoto = (index: number) =>
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));

  const submitFarm = () => {
    if (!newName.trim()) {
      Alert.alert('Missing Name', 'Please enter a farm name.');
      return;
    }
    const GRADIENTS: [string, string][] = [
      ['#0D3D24', '#2D9D63'], ['#52B788', '#95D5B2'],
      ['#1A4A2E', '#52B788'], ['#4a0e8f', '#9b59b6'],
      ['#7B1E1E', '#E74C3C'], ['#5C3317', '#A0522D'],
    ];
    const grad = GRADIENTS[farms.length % GRADIENTS.length];
    const newFarm: Farm = {
      id: `u${Date.now()}`,
      name:     newName.trim(),
      region:   newRegion,
      type:     newType,
      price:    newPrice.trim() ? `₼${newPrice.trim()}` : '₼Free',
      rating:   '5.0',
      reviews:  0,
      distance: '—',
      tags:     [newType, newRegion],
      gradient: grad,
      open:     true,
      photos:   newPhotos.length ? newPhotos : undefined,
      isUserAdded: true,
    };
    setFarms((prev) => [newFarm, ...prev]);
    setSection('search');
    // Reset form
    setNewName(''); setNewRegion('Sheki'); setNewType('Organic Farm');
    setNewPrice(''); setNewDesc(''); setNewPhotos([]);
    Alert.alert('🌾 Farm Added!', `"${newFarm.name}" has been listed successfully.`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.header}>
        <View style={[styles.hBubble, { width: 160, height: 160, top: -50, right: -40 }]} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Farming</Text>
            <Text style={styles.headerSub}>Agro-tourism experiences</Text>
          </View>
        </View>

        {/* Section toggle */}
        <View style={styles.toggleRow}>
          {(['search', 'add'] as Section[]).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setSection(s)}
              style={[styles.toggleBtn, section === s && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={s === 'search' ? 'search' : 'add-circle'}
                size={15}
                color={section === s ? COLORS.primary : 'rgba(255,255,255,0.7)'}
              />
              <Text style={[styles.toggleText, section === s && styles.toggleTextActive]}>
                {s === 'search' ? 'Search' : 'Add Farm'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search bar (only when searching) */}
        {section === 'search' && (
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={17} color={COLORS.textLight} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search farms, regions, types…"
              placeholderTextColor={COLORS.textLight}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </LinearGradient>

      <TokenBar />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SEARCH SECTION                                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {section === 'search' && (
        <>
          {/* Farm list */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            <Text style={styles.countLabel}>{filteredFarms.length} farms found</Text>

            {filteredFarms.map((farm) => {
              const emoji = TYPE_EMOJI[farm.type] ?? '🏡';
              return (
                <TouchableOpacity
                  key={farm.id}
                  style={styles.farmCard}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('FarmDetail', { farm })}
                >
                  {/* Photo or gradient header */}
                  {farm.photos?.[0] ? (
                    <View style={styles.cardHero}>
                      <Image source={{ uri: farm.photos[0] }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                      <View style={styles.photoOverlay} />
                      <View style={styles.cardHeroContent}>
                        <View style={[styles.openBadge, { backgroundColor: farm.open ? 'rgba(46,204,113,0.25)' : 'rgba(231,76,60,0.25)' }]}>
                          <View style={[styles.openDot, { backgroundColor: farm.open ? '#2ECC71' : '#E74C3C' }]} />
                          <Text style={[styles.openText, { color: farm.open ? '#2ECC71' : '#E74C3C' }]}>
                            {farm.open ? 'Open' : 'Closed'}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => toggleFav(farm.id)}>
                          <Ionicons name={favorites.includes(farm.id) ? 'heart' : 'heart-outline'} size={22} color={favorites.includes(farm.id) ? '#E74C3C' : '#fff'} />
                        </TouchableOpacity>
                      </View>
                      {farm.isUserAdded && (
                        <View style={styles.userAddedBadge}>
                          <Text style={styles.userAddedText}>Your listing</Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <LinearGradient colors={farm.gradient} style={styles.cardHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <View style={styles.cardHeroDeco} />
                      {/* Large centered emoji */}
                      <Text style={styles.farmTypeEmoji}>{emoji}</Text>
                      <View style={styles.cardHeroContent}>
                        <View style={[styles.openBadge, { backgroundColor: farm.open ? 'rgba(46,204,113,0.25)' : 'rgba(231,76,60,0.25)' }]}>
                          <View style={[styles.openDot, { backgroundColor: farm.open ? '#2ECC71' : '#E74C3C' }]} />
                          <Text style={[styles.openText, { color: farm.open ? '#2ECC71' : '#E74C3C' }]}>
                            {farm.open ? 'Open' : 'Closed'}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => toggleFav(farm.id)}>
                          <Ionicons name={favorites.includes(farm.id) ? 'heart' : 'heart-outline'} size={22} color={favorites.includes(farm.id) ? '#E74C3C' : '#fff'} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.cardHeroBottom}>
                        <Text style={styles.farmType}>{farm.type}</Text>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={11} color="#FFD700" />
                          <Text style={styles.ratingText}>{farm.rating}</Text>
                          <Text style={styles.reviewsText}>({farm.reviews})</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  )}

                  {/* Card body */}
                  <View style={styles.cardBody}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.farmName}>{farm.name}</Text>
                      <Text style={styles.farmPrice}>{farm.price}<Text style={styles.farmPriceSub}>/person</Text></Text>
                    </View>
                    <View style={styles.farmMeta}>
                      <Ionicons name="location-outline" size={12} color={COLORS.textLight} />
                      <Text style={styles.farmMetaText}>{farm.region}</Text>
                      <View style={styles.metaDot} />
                      <Ionicons name="navigate-outline" size={12} color={COLORS.textLight} />
                      <Text style={styles.farmMetaText}>{farm.distance}</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }} contentContainerStyle={{ gap: 6 }}>
                      {farm.tags.map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </ScrollView>
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.routeBtn}>
                        <Ionicons name="navigate-outline" size={14} color={COLORS.primary} />
                        <Text style={styles.routeBtnText}>Get Route</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Book Visit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {filteredFarms.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🌾</Text>
                <Text style={styles.emptyText}>No farms found</Text>
                <Text style={styles.emptySub}>Try a different region or search term</Text>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ADD SECTION                                                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {section === 'add' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.addScroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Photo picker */}
            <Text style={styles.fieldLabel}>Farm Photo</Text>
            <View style={styles.photoRow}>
              <TouchableOpacity style={styles.photoBtn} onPress={() => pickPhoto(true)} activeOpacity={0.8}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.photoBtnGrad}>
                  <Ionicons name="camera" size={22} color={COLORS.white} />
                  <Text style={styles.photoBtnText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={() => pickPhoto(false)} activeOpacity={0.8}>
                <View style={styles.photoBtnOutline}>
                  <Ionicons name="image-outline" size={22} color={COLORS.primary} />
                  <Text style={[styles.photoBtnText, { color: COLORS.primary }]}>Upload</Text>
                </View>
              </TouchableOpacity>
            </View>

            {newPhotos.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photoPreviewScroll}
                style={{ marginTop: 6 }}
              >
                {newPhotos.map((uri, idx) => (
                  <View key={`${uri}-${idx}`} style={styles.previewWrap}>
                    <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
                    <TouchableOpacity style={styles.removePhoto} onPress={() => removePhoto(idx)}>
                      <Ionicons name="close-circle" size={22} color="#E74C3C" />
                    </TouchableOpacity>
                    {idx === 0 && (
                      <View style={styles.mainBadge}>
                        <Text style={styles.mainBadgeText}>Main</Text>
                      </View>
                    )}
                  </View>
                ))}
                {/* Add more button */}
                {newPhotos.length < 6 && (
                  <TouchableOpacity style={styles.addMorePhoto} onPress={() => pickPhoto(false)} activeOpacity={0.75}>
                    <Ionicons name="add" size={28} color={COLORS.primary} />
                    <Text style={styles.addMoreText}>Add</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}

            {/* Farm name */}
            <Text style={styles.fieldLabel}>Farm Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Green Valley Orchard"
              placeholderTextColor={COLORS.textLight}
              value={newName}
              onChangeText={setNewName}
            />

            {/* Farm type */}
            <Text style={styles.fieldLabel}>Farm Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeScroll}>
              {FARM_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setNewType(t)}
                  style={[styles.typeChip, newType === t && styles.typeChipActive]}
                  activeOpacity={0.75}
                >
                  <Text style={styles.typeChipEmoji}>{TYPE_EMOJI[t] ?? '🏡'}</Text>
                  <Text style={[styles.typeChipText, newType === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Region */}
            <Text style={styles.fieldLabel}>Region</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sheki, Gabala, Quba…"
              placeholderTextColor={COLORS.textLight}
              value={newRegion}
              onChangeText={setNewRegion}
            />

            {/* Price */}
            <Text style={styles.fieldLabel}>Price per Person (₼)</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="e.g. 45"
                placeholderTextColor={COLORS.textLight}
                keyboardType="numeric"
                value={newPrice}
                onChangeText={setNewPrice}
              />
              <TouchableOpacity
                style={styles.randomBtn}
                activeOpacity={0.75}
                onPress={() => {
                  const prices = ['20', '25', '30', '35', '40', '45', '50', '55', '60', '70', '80'];
                  setNewPrice(prices[Math.floor(Math.random() * prices.length)]);
                }}
              >
                <Text style={styles.randomBtnEmoji}>🎲</Text>
                <Text style={styles.randomBtnText}>Random</Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Tell visitors what makes your farm special…"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={newDesc}
              onChangeText={setNewDesc}
            />

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={submitFarm} activeOpacity={0.85}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.submitGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.submitText}>List My Farm</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 16, overflow: 'hidden', gap: 12 },
  hBubble: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.07)' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white, marginBottom: 2 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)' },

  // Section toggle
  toggleRow: {
    flexDirection: 'row', gap: 8,
    backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: 4,
  },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 8, borderRadius: 9,
  },
  toggleBtnActive: { backgroundColor: COLORS.white },
  toggleText:      { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.75)' },
  toggleTextActive:{ color: COLORS.primary },

  // Search bar
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 12,
    paddingHorizontal: 14, height: 46,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },

  // Region filter
  regionBar: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
    paddingVertical: 10,
  },
  regionScroll: { paddingHorizontal: 14, alignItems: 'center', gap: 8 },
  regionChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22,
    backgroundColor: COLORS.primaryXLight,
    borderWidth: 1.5, borderColor: COLORS.primaryLight + '50',
  },
  regionChipActive: {
    backgroundColor: COLORS.primary, borderColor: COLORS.primary,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35, shadowRadius: 6, elevation: 4,
  },
  regionText:       { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  regionTextActive: { color: COLORS.white },

  // Farm list
  list:       { padding: 16 },
  countLabel: { fontSize: 13, color: COLORS.textLight, marginBottom: 12, fontWeight: '500' },

  // Farm card
  farmCard: {
    backgroundColor: COLORS.card, borderRadius: 18, marginBottom: 14, overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  },
  cardHero: {
    height: 130, justifyContent: 'space-between', overflow: 'hidden',
    padding: 14,
  },
  cardHeroDeco: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  farmTypeEmoji: {
    position: 'absolute',
    alignSelf: 'center',
    top: 20,
    fontSize: 50,
    opacity: 0.85,
  },
  cardHeroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardHeroBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  openBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  openDot:   { width: 6, height: 6, borderRadius: 3 },
  openText:  { fontSize: 11, fontWeight: '700' },
  farmType:  { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText:  { fontSize: 12, color: COLORS.white, fontWeight: '700' },
  reviewsText: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  userAddedBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: COLORS.gold, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  userAddedText: { fontSize: 10, fontWeight: '800', color: '#000' },

  cardBody: { padding: 14 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  farmName:     { fontSize: 16, fontWeight: '700', color: COLORS.textDark, flex: 1 },
  farmPrice:    { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  farmPriceSub: { fontSize: 11, fontWeight: '400', color: COLORS.textLight },
  farmMeta:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  farmMetaText: { fontSize: 12, color: COLORS.textLight },
  metaDot:      { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.border },
  tag:          { backgroundColor: COLORS.primaryXLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  tagText:      { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  cardActions:  { flexDirection: 'row', gap: 10, marginTop: 12 },
  routeBtn:     {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 12, paddingVertical: 10,
  },
  routeBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  bookBtn:      { flex: 1.5, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  bookBtnText:  { fontSize: 13, fontWeight: '700', color: COLORS.white },

  emptyState:  { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji:  { fontSize: 44, marginBottom: 12 },
  emptyText:   { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  emptySub:    { fontSize: 13, color: COLORS.textLight, marginTop: 4 },

  // Add form
  addScroll:  { padding: 16, gap: 4 },
  priceRow:   { flexDirection: 'row', gap: 10, alignItems: 'center' },
  randomBtn:  {
    backgroundColor: COLORS.primaryXLight,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12,
    alignItems: 'center', gap: 2,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  randomBtnEmoji: { fontSize: 18 },
  randomBtnText:  { fontSize: 10, fontWeight: '700', color: COLORS.primary },

  fieldLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginTop: 12, marginBottom: 6 },
  input:      {
    backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: COLORS.textDark,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  inputMulti: { height: 100, paddingTop: 12 },

  // Photo buttons
  photoRow:       { flexDirection: 'row', gap: 10 },
  photoBtn:       { flex: 1 },
  photoBtnGrad:   { borderRadius: 12, paddingVertical: 14, alignItems: 'center', gap: 6 },
  photoBtnOutline: {
    borderRadius: 12, paddingVertical: 14, alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.card,
  },
  photoBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.white },

  photoPreviewScroll: { gap: 10, paddingVertical: 2 },
  previewWrap: {
    width: 140, height: 120, borderRadius: 12, overflow: 'hidden',
    position: 'relative',
  },
  preview:     { width: '100%', height: '100%' },
  removePhoto: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12,
  },
  mainBadge: {
    position: 'absolute', bottom: 6, left: 6,
    backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  mainBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  addMorePhoto: {
    width: 100, height: 120, borderRadius: 12,
    backgroundColor: COLORS.cardAlt, borderWidth: 1.5,
    borderColor: COLORS.primary, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', gap: 4,
  },
  addMoreText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

  // Type / region chips
  typeScroll:        { gap: 8, paddingVertical: 2 },
  typeChip:          {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.cardAlt, borderWidth: 1.5, borderColor: COLORS.border,
  },
  typeChipActive:    { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeChipEmoji:     { fontSize: 14 },
  typeChipText:      { fontSize: 13, fontWeight: '700', color: COLORS.textMedium },
  typeChipTextActive:{ color: COLORS.white },

  // Submit
  submitBtn:  { marginTop: 24, borderRadius: 14, overflow: 'hidden' },
  submitGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  submitText: { fontSize: 16, fontWeight: '800', color: COLORS.white },
});
