import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Dimensions, Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme/colors';
import { useMarket, Product } from '../context/MarketContext';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');
const H_PAD = 20;

const CATEGORIES = [
  { id: 'all',       label: 'All',       emoji: '🛒' },
  { id: 'Vegetables',label: 'Vegetables', emoji: '🥦' },
  { id: 'Fruits',    label: 'Fruits',     emoji: '🍎' },
  { id: 'Dairy',     label: 'Dairy',      emoji: '🥛' },
  { id: 'Honey',     label: 'Honey',      emoji: '🍯' },
  { id: 'Herbs',     label: 'Herbs',      emoji: '🌿' },
  { id: 'Eggs',      label: 'Eggs',       emoji: '🥚' },
  { id: 'Poultry',   label: 'Poultry',    emoji: '🍗' },
  { id: 'Meat',      label: 'Meat',       emoji: '🥩' },
  { id: 'Homemade',  label: 'Homemade',   emoji: '🍶' },
  { id: 'Other',     label: 'Other',      emoji: '📦' },
];

const SELL_CATEGORIES = CATEGORIES.slice(1); // no 'All'

// Curated Unsplash photos — one per category, matched to the product type
const CATEGORY_IMAGES: Record<string, string> = {
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&q=80',
  Fruits:     'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop&q=80',
  Dairy:      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&q=80',
  Honey:      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&q=80',
  Herbs:      'https://images.unsplash.com/photo-1611689342806-0ad8278e7f29?w=400&h=400&fit=crop&q=80',
  Eggs:       'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&q=80',
  Poultry:    'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=400&h=400&fit=crop&q=80',
  Meat:       'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop&q=80',
  Homemade:   'https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=400&h=400&fit=crop&q=80',
  Other:      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80',
};

const REGIONS = ['Sheki', 'Gabala', 'Quba', 'Ganja', 'Masalli', 'Zagatala', 'Goychay', 'Baku', 'Nakhchivan', 'Other'];
const PRICE_UNITS = ['per kg', 'per piece', 'per dozen', 'per liter', 'per jar', 'negotiable'];

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

type Props = { navigation: any };

export default function MarketScreen({ navigation }: Props) {
  const { products, addProduct } = useMarket();
  const { username, role } = useUser();

  // ── Tab state
  const [activeTab, setActiveTab] = useState<'browse' | 'sell'>('browse');

  // ── Browse state
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // ── Sell (add product) state
  const [sellCategory, setSellCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('per kg');
  const [region, setRegion] = useState('');
  const [contact, setContact] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const pickPhotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to add product photos.', [{ text: 'OK' }]);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - photos.length,
    });
    if (!result.canceled) {
      setPhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 5));
    }
  };

  const removePhoto = (uri: string) => setPhotos((prev) => prev.filter((p) => p !== uri));

  // ── Filtered products
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, search, activeCategory]);

  const canSubmit = sellCategory && productName.trim().length > 1 && description.trim().length > 5 && price.trim() && region;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const cat = SELL_CATEGORIES.find((c) => c.id === sellCategory);
    addProduct({
      name: productName.trim(),
      description: description.trim(),
      price: price.trim(),
      priceUnit,
      category: sellCategory,
      emoji: cat?.emoji ?? '📦',
      region,
      contact: contact.trim() || 'Contact via app',
      seller: username || 'Anonymous',
      photos,
    });
    setSubmitted(true);
  };

  const resetSellForm = () => {
    setSellCategory(''); setProductName(''); setDescription('');
    setPrice(''); setPriceUnit('per kg'); setRegion(''); setContact('');
    setPhotos([]); setSubmitted(false);
  };

  // ── Success state
  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.successWrap}>
          <LinearGradient colors={[COLORS.accent, '#D4814A']} style={styles.successCircle}>
            <Ionicons name="checkmark" size={44} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.successTitle}>Product Listed! 🎉</Text>
          <Text style={styles.successSub}>Your product is now visible to buyers in the market.</Text>
          <TouchableOpacity style={styles.successBtn} onPress={() => { resetSellForm(); setActiveTab('browse'); }} activeOpacity={0.88}>
            <Text style={styles.successBtnText}>Browse Market</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.successBtnOutline} onPress={resetSellForm} activeOpacity={0.88}>
            <Text style={styles.successBtnOutlineText}>Add Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Market</Text>
          <Text style={styles.headerSub}>{products.length} products listed</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeEmoji}>🛒</Text>
        </View>
      </View>

      {/* ── Tab Toggle ── */}
      <View style={styles.tabWrap}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'browse' && styles.tabBtnActive]}
          onPress={() => setActiveTab('browse')}
          activeOpacity={0.85}
        >
          <Ionicons name={activeTab === 'browse' ? 'search' : 'search-outline'} size={16} color={activeTab === 'browse' ? COLORS.white : COLORS.textMedium} />
          <Text style={[styles.tabBtnText, activeTab === 'browse' && styles.tabBtnTextActive]}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'sell' && styles.tabBtnActiveSell]}
          onPress={() => setActiveTab('sell')}
          activeOpacity={0.85}
        >
          <Ionicons name={activeTab === 'sell' ? 'add-circle' : 'add-circle-outline'} size={16} color={activeTab === 'sell' ? COLORS.white : COLORS.textMedium} />
          <Text style={[styles.tabBtnText, activeTab === 'sell' && styles.tabBtnTextActive]}>Sell / Add</Text>
        </TouchableOpacity>
      </View>

      {/* ══════════════════════════════════════════════════════
          BROWSE TAB
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'browse' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.browseScroll}>

          {/* Search */}
          <View style={styles.searchWrap}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={19} color={COLORS.textLight} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products, regions, sellers…"
                placeholderTextColor={COLORS.textLight}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Category filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catChipLabel, activeCategory === cat.id && styles.catChipLabelActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Results count */}
          <View style={styles.resultsRow}>
            <Text style={styles.resultsText}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</Text>
          </View>

          {/* Product cards */}
          {filtered.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>🌾</Text>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySub}>Try a different category or keyword</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => setActiveTab('sell')} activeOpacity={0.85}>
                <Text style={styles.emptyBtnText}>Be the first to sell</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.productList}>
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      )}

      {/* ══════════════════════════════════════════════════════
          SELL / ADD PRODUCT TAB
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'sell' && role === 'tourist' && (
        <View style={styles.lockedWrap}>
          <View style={styles.lockedCard}>
            <LinearGradient colors={[COLORS.primaryXLight, COLORS.cardAlt]} style={styles.lockedGrad}>
              <View style={styles.lockedIconWrap}>
                <Ionicons name="storefront-outline" size={40} color={COLORS.primary} />
                <View style={styles.lockedBadge}>
                  <Ionicons name="lock-closed" size={13} color={COLORS.white} />
                </View>
              </View>
              <Text style={styles.lockedTitle}>Farmers Only</Text>
              <Text style={styles.lockedSub}>
                Only registered farmers can list products on the market.{'\n'}
                You are browsing as a <Text style={styles.lockedRole}>Tourist 🧳</Text>
              </Text>
              <View style={styles.lockedDivider} />
              <View style={styles.lockedFeatureList}>
                {['Browse all products', 'Contact sellers directly', 'Filter by region & category'].map((f) => (
                  <View key={f} style={styles.lockedFeatureRow}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.lockedFeatureText}>{f}</Text>
                  </View>
                ))}
                {['List your own products', 'Manage your listings'].map((f) => (
                  <View key={f} style={styles.lockedFeatureRow}>
                    <Ionicons name="lock-closed-outline" size={16} color={COLORS.border} />
                    <Text style={styles.lockedFeatureTextOff}>{f}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.lockedBtn} onPress={() => setActiveTab('browse')} activeOpacity={0.88}>
                <Text style={styles.lockedBtnText}>Browse Products</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      )}

      {activeTab === 'sell' && role === 'farmer' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sellScroll} keyboardShouldPersistTaps="handled">

            {/* Step indicator */}
            <View style={styles.sellBanner}>
              <LinearGradient colors={[COLORS.accent, '#D4814A']} style={styles.sellBannerGrad}>
                <View style={styles.sellBannerDeco} />
                <Text style={styles.sellBannerTitle}>List Your Product</Text>
                <Text style={styles.sellBannerSub}>Connect with tourists & buyers across Azerbaijan</Text>
              </LinearGradient>
            </View>

            {/* Category picker */}
            <Text style={styles.fieldLabel}>Category <Text style={styles.required}>*</Text></Text>
            <View style={styles.categoryGrid}>
              {SELL_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryTile, sellCategory === cat.id && styles.categoryTileActive]}
                  onPress={() => setSellCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryTileEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.categoryTileLabel, sellCategory === cat.id && styles.categoryTileLabelActive]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Product name */}
            <Text style={styles.fieldLabel}>Product Name <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Fresh Pomegranates"
                placeholderTextColor={COLORS.textLight}
                value={productName}
                onChangeText={setProductName}
                maxLength={60}
              />
            </View>

            {/* Description */}
            <Text style={styles.fieldLabel}>Description <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputWrap, styles.textAreaWrap]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your product — quality, origin, harvest date…"
                placeholderTextColor={COLORS.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={200}
                textAlignVertical="top"
              />
            </View>

            {/* Photos */}
            <Text style={styles.fieldLabel}>
              Photos <Text style={styles.optional}>({photos.length}/5)</Text>
            </Text>
            <View style={styles.photoSection}>
              {/* Existing photo thumbnails */}
              {photos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoScroll}>
                  {photos.map((uri) => (
                    <View key={uri} style={styles.photoThumb}>
                      <Image source={{ uri }} style={styles.photoThumbImg} />
                      <TouchableOpacity style={styles.photoRemoveBtn} onPress={() => removePhoto(uri)} activeOpacity={0.8}>
                        <Ionicons name="close" size={12} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {/* Add more button inside the scroll row */}
                  {photos.length < 5 && (
                    <TouchableOpacity style={styles.photoAddMore} onPress={pickPhotos} activeOpacity={0.8}>
                      <Ionicons name="add" size={24} color={COLORS.accent} />
                    </TouchableOpacity>
                  )}
                </ScrollView>
              )}
              {/* Primary add button when no photos yet */}
              {photos.length === 0 && (
                <TouchableOpacity style={styles.photoPickerBtn} onPress={pickPhotos} activeOpacity={0.85}>
                  <LinearGradient colors={[COLORS.accentLight, COLORS.goldXLight]} style={styles.photoPickerGrad}>
                    <View style={styles.photoPickerIcon}>
                      <Ionicons name="camera-outline" size={28} color={COLORS.accent} />
                    </View>
                    <Text style={styles.photoPickerTitle}>Add Product Photos</Text>
                    <Text style={styles.photoPickerSub}>Up to 5 photos · Tap to browse gallery</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* Price */}
            <Text style={styles.fieldLabel}>Price <Text style={styles.required}>*</Text></Text>
            <View style={styles.priceRow}>
              <View style={[styles.inputWrap, { flex: 1 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textLight}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.unitPicker}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.unitScroll}>
                  {PRICE_UNITS.map((u) => (
                    <TouchableOpacity
                      key={u}
                      style={[styles.unitChip, priceUnit === u && styles.unitChipActive]}
                      onPress={() => setPriceUnit(u)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.unitChipText, priceUnit === u && styles.unitChipTextActive]}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Region */}
            <Text style={styles.fieldLabel}>Region <Text style={styles.required}>*</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionScroll}>
              {REGIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.regionChip, region === r && styles.regionChipActive]}
                  onPress={() => setRegion(r)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.regionChipText, region === r && styles.regionChipTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Contact */}
            <Text style={styles.fieldLabel}>Contact <Text style={styles.optional}>(optional)</Text></Text>
            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={17} color={COLORS.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 0 }]}
                placeholder="+994 55 000 00 00"
                placeholderTextColor={COLORS.textLight}
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              activeOpacity={canSubmit ? 0.88 : 1}
            >
              <LinearGradient
                colors={canSubmit ? [COLORS.accent, '#D4814A'] : [COLORS.border, COLORS.border]}
                style={styles.submitBtnGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Ionicons name="storefront-outline" size={20} color={canSubmit ? COLORS.white : COLORS.textLight} />
                <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>
                  List Product
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const hasPhoto = product.photos && product.photos.length > 0;
  const coverUri = hasPhoto
    ? product.photos[0]
    : CATEGORY_IMAGES[product.category] ?? CATEGORY_IMAGES.Other;
  return (
    <View style={cardStyles.card}>
      <Image source={{ uri: coverUri }} style={cardStyles.photo} resizeMode="cover" />
      {hasPhoto && product.photos.length > 1 && product.photos && (
        <View style={cardStyles.photoCount}>
          <Ionicons name="images-outline" size={10} color={COLORS.white} />
          <Text style={cardStyles.photoCountText}>{product.photos.length}</Text>
        </View>
      )}
      <View style={cardStyles.info}>
        <Text style={cardStyles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={cardStyles.desc} numberOfLines={2}>{product.description}</Text>
        <View style={cardStyles.metaRow}>
          <View style={cardStyles.metaItem}>
            <Ionicons name="location-outline" size={12} color={COLORS.textLight} />
            <Text style={cardStyles.metaText}>{product.region}</Text>
          </View>
          <View style={cardStyles.metaItem}>
            <Ionicons name="person-outline" size={12} color={COLORS.textLight} />
            <Text style={cardStyles.metaText}>{product.seller}</Text>
          </View>
          <Text style={cardStyles.ago}>{timeAgo(product.listedAt)}</Text>
        </View>
      </View>
      <View style={cardStyles.priceCol}>
        <Text style={cardStyles.price}>${product.price}</Text>
        <Text style={cardStyles.unit}>{product.priceUnit}</Text>
        <TouchableOpacity
          style={cardStyles.contactBtn}
          onPress={() => Alert.alert('Contact Seller', `${product.seller}\n${product.contact}`, [{ text: 'OK' }])}
          activeOpacity={0.85}
        >
          <Ionicons name="call" size={13} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: H_PAD, paddingTop: 22, paddingBottom: 18,
  },
  headerTitle:  { fontSize: 28, fontWeight: '900', color: COLORS.textDark, letterSpacing: -0.5 },
  headerSub:    { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  headerBadge:  {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: COLORS.goldXLight, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.gold + '40',
  },
  headerBadgeEmoji: { fontSize: 22 },

  // ── Tabs ────────────────────────────────────────────────────────────────
  tabWrap: {
    flexDirection: 'row', marginHorizontal: H_PAD, marginBottom: 16,
    backgroundColor: COLORS.inputBg, borderRadius: 16, padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 13,
  },
  tabBtnActive:     { backgroundColor: COLORS.primary },
  tabBtnActiveSell: { backgroundColor: COLORS.accent },
  tabBtnText:       { fontSize: 14, fontWeight: '700', color: COLORS.textMedium },
  tabBtnTextActive: { color: COLORS.white },

  // ── Browse ──────────────────────────────────────────────────────────────
  browseScroll: { paddingBottom: 20 },
  searchWrap:   { paddingHorizontal: H_PAD, marginBottom: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.card, borderRadius: 16,
    paddingHorizontal: 16, height: 52,
    borderWidth: 1, borderColor: COLORS.divider,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textDark },

  catScroll:         { paddingHorizontal: H_PAD, paddingBottom: 4, gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.card, borderRadius: 50,
    paddingHorizontal: 14, paddingVertical: 9,
    borderWidth: 1, borderColor: COLORS.divider,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 3, elevation: 1,
  },
  catChipActive:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipEmoji:      { fontSize: 15 },
  catChipLabel:      { fontSize: 13, fontWeight: '600', color: COLORS.textMedium },
  catChipLabelActive:{ color: COLORS.white },

  resultsRow:  { paddingHorizontal: H_PAD, marginTop: 14, marginBottom: 8 },
  resultsText: { fontSize: 13, fontWeight: '700', color: COLORS.textLight },

  emptyWrap:  { alignItems: 'center', paddingTop: 48, paddingHorizontal: H_PAD, gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  emptySub:   { fontSize: 14, color: COLORS.textLight, textAlign: 'center' },
  emptyBtn: {
    marginTop: 8, backgroundColor: COLORS.accent, borderRadius: 50,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  emptyBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },

  productList: { paddingHorizontal: H_PAD, gap: 12 },

  // ── Sell ────────────────────────────────────────────────────────────────
  sellScroll: { paddingBottom: 20 },

  sellBanner: { marginHorizontal: H_PAD, marginBottom: 24, borderRadius: 20, overflow: 'hidden' },
  sellBannerGrad: { padding: 22, overflow: 'hidden' },
  sellBannerDeco: {
    position: 'absolute', top: -40, right: -40,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sellBannerTitle: { fontSize: 22, fontWeight: '900', color: COLORS.white, marginBottom: 4 },
  sellBannerSub:   { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },

  fieldLabel:  { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 10, paddingHorizontal: H_PAD },
  required:    { color: COLORS.error },
  optional:    { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },

  categoryGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: H_PAD, gap: 10, marginBottom: 24,
  },
  categoryTile: {
    width: (width - H_PAD * 2 - 40) / 5,
    backgroundColor: COLORS.card, borderRadius: 14,
    paddingVertical: 12, alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: COLORS.divider,
  },
  categoryTileActive:      { borderColor: COLORS.accent, backgroundColor: COLORS.accentLight },
  categoryTileEmoji:       { fontSize: 22 },
  categoryTileLabel:       { fontSize: 9.5, fontWeight: '600', color: COLORS.textMedium, textAlign: 'center' },
  categoryTileLabelActive: { color: COLORS.accent },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 14,
    paddingHorizontal: 16, marginHorizontal: H_PAD, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.divider,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 1,
  },
  textAreaWrap: { alignItems: 'flex-start', paddingVertical: 12 },
  inputIcon:    { marginRight: 8 },
  input:        { flex: 1, fontSize: 15, color: COLORS.textDark, paddingVertical: 14 },
  textArea:     { minHeight: 80, textAlignVertical: 'top' },

  priceRow: { flexDirection: 'column', gap: 8, marginBottom: 20 },
  unitPicker:   { paddingHorizontal: H_PAD },
  unitScroll:   { gap: 8 },
  unitChip: {
    backgroundColor: COLORS.card, borderRadius: 50,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  unitChipActive:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  unitChipText:       { fontSize: 13, fontWeight: '600', color: COLORS.textMedium },
  unitChipTextActive: { color: COLORS.white },

  regionScroll:       { paddingHorizontal: H_PAD, marginBottom: 24, gap: 8 },
  regionChip: {
    backgroundColor: COLORS.card, borderRadius: 50,
    paddingHorizontal: 16, paddingVertical: 9,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  regionChipActive:    { backgroundColor: COLORS.primaryXLight, borderColor: COLORS.primary },
  regionChipText:      { fontSize: 13, fontWeight: '600', color: COLORS.textMedium },
  regionChipTextActive:{ color: COLORS.primary },

  // ── Farmer-only locked state ─────────────────────────────────────────────
  lockedWrap:        { flex: 1, padding: H_PAD, justifyContent: 'center' },
  lockedCard:        { borderRadius: 24, overflow: 'hidden' },
  lockedGrad:        { padding: 28, alignItems: 'center', gap: 14 },
  lockedIconWrap:    { position: 'relative', marginBottom: 4 },
  lockedBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.card,
  },
  lockedTitle:        { fontSize: 22, fontWeight: '900', color: COLORS.textDark },
  lockedSub:          { fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 },
  lockedRole:         { fontWeight: '700', color: COLORS.textDark },
  lockedDivider:      { width: '100%', height: 1, backgroundColor: COLORS.divider },
  lockedFeatureList:  { width: '100%', gap: 10 },
  lockedFeatureRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lockedFeatureText:  { fontSize: 14, color: COLORS.textDark, fontWeight: '500' },
  lockedFeatureTextOff:{ fontSize: 14, color: COLORS.border, fontWeight: '500' },
  lockedBtn: {
    width: '100%', backgroundColor: COLORS.primary,
    borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  lockedBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },

  // ── Photo picker ────────────────────────────────────────────────────────
  photoSection:     { marginHorizontal: H_PAD, marginBottom: 20 },
  photoScroll:      { gap: 10, paddingVertical: 2 },
  photoThumb: {
    width: 90, height: 90, borderRadius: 14, overflow: 'visible',
  },
  photoThumbImg:    { width: 90, height: 90, borderRadius: 14 },
  photoRemoveBtn: {
    position: 'absolute', top: -6, right: -6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS.error, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.background,
    zIndex: 10,
  },
  photoAddMore: {
    width: 90, height: 90, borderRadius: 14,
    backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.accent, borderStyle: 'dashed',
  },
  photoPickerBtn:  { borderRadius: 16, overflow: 'hidden' },
  photoPickerGrad: {
    paddingVertical: 22, alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderColor: COLORS.accent + '40', borderRadius: 16,
  },
  photoPickerIcon: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center',
    marginBottom: 2,
    shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
  },
  photoPickerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.accent },
  photoPickerSub:   { fontSize: 13, color: COLORS.textLight },

  submitBtn:         { marginHorizontal: H_PAD, borderRadius: 18, overflow: 'hidden', marginTop: 8 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 18,
  },
  submitBtnText:         { fontSize: 17, fontWeight: '800', color: COLORS.white },
  submitBtnTextDisabled: { color: COLORS.textLight },

  // ── Success ──────────────────────────────────────────────────────────────
  successWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 36, gap: 16,
  },
  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  successTitle: { fontSize: 26, fontWeight: '900', color: COLORS.textDark, textAlign: 'center' },
  successSub:   { fontSize: 15, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 },
  successBtn: {
    width: '100%', backgroundColor: COLORS.accent, borderRadius: 18,
    paddingVertical: 18, alignItems: 'center', marginTop: 8,
  },
  successBtnText: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  successBtnOutline: {
    width: '100%', backgroundColor: COLORS.card, borderRadius: 18,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.divider,
  },
  successBtnOutlineText: { fontSize: 15, fontWeight: '700', color: COLORS.textMedium },
});

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: COLORS.card, borderRadius: 18, padding: 16,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: COLORS.divider,
    gap: 12,
  },
  photo: {
    width: 72, height: 72, borderRadius: 14, flexShrink: 0,
  },
  photoCount: {
    position: 'absolute', bottom: 4, left: 4,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 8,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  photoCountText: { fontSize: 10, fontWeight: '700', color: COLORS.white },
  emojiWrap: {
    width: 72, height: 72, borderRadius: 14,
    backgroundColor: COLORS.goldXLight, justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  emoji:    { fontSize: 30 },
  info:     { flex: 1, gap: 4 },
  name:     { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  desc:     { fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: COLORS.textLight },
  ago:      { fontSize: 11, color: COLORS.border, marginLeft: 'auto' },
  priceCol: { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  price:    { fontSize: 18, fontWeight: '900', color: COLORS.accent },
  unit:     { fontSize: 10, color: COLORS.textLight, fontWeight: '600' },
  contactBtn: {
    width: 34, height: 34, borderRadius: 11,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginTop: 4,
  },
});
