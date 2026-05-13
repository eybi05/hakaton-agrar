import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Dimensions, Alert, Modal, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { COLORS } from '../theme/colors';
import TokenBar from '../components/TokenBar';
import { useBadges } from '../context/BadgeContext';
import { useTokens } from '../context/TokenContext';
import { useLanguage } from '../context/LanguageContext';
import LangToggle from '../components/LangToggle';
import { MARKETPLACE_ITEMS, MarketplaceItem, MARKETPLACE_CATEGORIES } from '../data/marketplaceData';

const { width } = Dimensions.get('window');

const AZ_REGION = { latitude: 40.1, longitude: 47.7, latitudeDelta: 4.2, longitudeDelta: 5.8 };

// ── Subscription plans ─────────────────────────────────────────────────────────
const PLANS = [
  {
    id: '1', duration: '1 Gün', price: '$5', perDay: '$5 / gün', badge: null,
    cardHeight: 210, features: ['Tam giriş', 'Bütün kateqoriyalar'],
    gradient: ['#2C2C4E', '#4A4A78'] as [string, string], btnColor: '#2C2C4E',
  },
  {
    id: '2', duration: '10 Gün', price: '$39', perDay: '$3.9 / gün', badge: 'Ən Populyar',
    cardHeight: 270, features: ['Tam giriş', 'Bütün kateqoriyalar', 'Oflayn rejim', 'Xəritə görünüşü'],
    gradient: [COLORS.primaryDark, COLORS.primaryLight] as [string, string], btnColor: COLORS.primaryDark,
  },
  {
    id: '3', duration: '30 Gün', price: '$199', perDay: '$6.6 / gün', badge: 'Ən Sərfəli',
    cardHeight: 320,
    features: ['Tam giriş', 'Bütün kateqoriyalar', 'Oflayn rejim', 'Xəritə görünüşü', 'Prioritet dəstək', 'Eksklüziv endirimlər'],
    gradient: ['#7B4A00', '#E8A020'] as [string, string], btnColor: '#7B4A00',
  },
];

// ── Token benefit highlights ────────────────────────────────────────────────────
const TOKEN_BENEFITS = [
  { emoji: '🚗', label: 'Uber',          desc: '20% endirim'  },
  { emoji: '🍽️', label: 'Restoranlar',   desc: '10–18% endirim' },
  { emoji: '🏡', label: 'Ferma otellər', desc: '20–25% endirim' },
  { emoji: '🗺️', label: 'Xüsusi turlar', desc: '20–30% endirim' },
];

// ── Categories ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', label: 'Farms',             icon: 'leaf-outline'         },
  { id: '2', label: 'Village Tours',     icon: 'home-outline'         },
  { id: '3', label: 'Horse Riding',      icon: 'paw'                  },
  { id: '4', label: 'Organic Food',      icon: 'nutrition'            },
  { id: '5', label: 'Camping',           icon: 'flame-outline'        },
  { id: '6', label: 'Local Hotels',      icon: 'bed-outline'          },
  { id: '7', label: 'Traditional Foods', icon: 'restaurant-outline'   },
  { id: '8', label: 'Nature',            icon: 'partly-sunny-outline' },
];

const MARKERS = [
  { id: '1', title: 'Green Valley Farm',   region: 'Sheki',   lat: 41.1984, lng: 47.1705, color: COLORS.primary        },
  { id: '2', title: 'Sunrise Horse Ranch', region: 'Gabala',  lat: 40.9893, lng: 47.8418, color: '#A67C52'             },
  { id: '3', title: 'Mountain Camp Site',  region: 'Lahij',   lat: 40.8370, lng: 48.3790, color: '#1A3A6E'             },
  { id: '4', title: 'Lahij Craft Village', region: 'Lahij',   lat: 40.8420, lng: 48.3830, color: '#5C6BC0'             },
  { id: '5', title: 'Pomegranate Estate',  region: 'Goychay', lat: 40.6560, lng: 47.7400, color: '#C0392B'             },
  { id: '6', title: 'Sheki Khan Palace',   region: 'Sheki',   lat: 41.1960, lng: 47.1750, color: '#4A1D96'             },
];

const USER_NAME = 'Daşdəmir';

const getGreeting = (t: any) => {
  const h = new Date().getHours();
  const emoji = h >= 5 && h < 12 ? '☀️' : h < 17 ? '🌤️' : h < 21 ? '🌇' : '🌙';
  const label = h >= 5 && h < 12 ? t.home.greetingMorning
              : h >= 12 && h < 17 ? t.home.greetingAfternoon
              : h >= 17 && h < 21 ? t.home.greetingEvening
              : t.home.greetingNight;
  return `${label}, ${USER_NAME} ${emoji}`;
};

type Props = { navigation: any };

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch]             = useState('');
  const [selectedPlan, setSelectedPlan] = useState('2');
  const [marketCat, setMarketCat]       = useState('Hamısı');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activePlan, setActivePlan]     = useState<string | null>(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [pendingItem, setPendingItem]   = useState<MarketplaceItem | null>(null);

  const { notifications, clearNotifications } = useBadges();
  const { balance, spendTokens }              = useTokens();
  const { t }                                 = useLanguage();

  // ── Search: filter across categories AND marketplace ───────────────────────
  const q = search.trim().toLowerCase();
  const isSearching = q.length > 0;

  const matchedCategories = isSearching
    ? CATEGORIES.filter((c) => c.label.toLowerCase().includes(q))
    : CATEGORIES;

  const matchedMarket = MARKETPLACE_ITEMS.filter(
    (m) =>
      (!isSearching || m.azName.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) &&
      (marketCat === 'Hamısı' || m.category === marketCat),
  );

  const hasAnyResult = matchedCategories.length > 0 || matchedMarket.length > 0;

  // ── Subscription gate ──────────────────────────────────────────────────────
  const handleBuy = (item: MarketplaceItem) => {
    if (!isSubscribed) {
      setPendingItem(item);
      setShowSubModal(true);
      return;
    }
    if (!spendTokens(item.tokenCost)) {
      Alert.alert(
        '❌ Token Çatışmır',
        `${item.azName} üçün ${item.tokenCost} 🪙 lazımdır.\nBakiyəniz: ${balance} 🪙\n\nMissions bölümündən token qazana bilərsiniz.`,
        [{ text: 'Tamam' }],
      );
      return;
    }
    Alert.alert('✅ Aktivləşdirildi!', `${item.azName}\n${item.discount} endirimi hesabınıza əlavə edildi!`, [{ text: 'Əla!' }]);
  };

  const subscribeToPlan = (planId: string) => {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    setIsSubscribed(true);
    setActivePlan(plan.duration);
    setSelectedPlan(planId);
    setShowSubModal(false);
    Alert.alert('🎉 Abunəlik Aktivləşdi!', `${plan.duration} abunəliyi aktiv edildi.\nİndi bütün endirimlərдən istifadə edə bilərsiniz!`, [{ text: 'Əla!' }]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* keyboardShouldPersistTaps="handled" fixes taps on filter chips when keyboard is open */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{getGreeting(t)}</Text>
            <Text style={styles.topTitle}>{t.home.subtitle}</Text>
          </View>
          <LangToggle variant="dark" />
          <TouchableOpacity style={styles.notifBtn} onPress={clearNotifications}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            {notifications > 0 ? (
              <View style={styles.notifCount}>
                <Text style={styles.notifCountText}>{notifications > 9 ? '9+' : notifications}</Text>
              </View>
            ) : (
              <View style={styles.notifDot} />
            )}
          </TouchableOpacity>
        </View>

        {/* ── Token bar ──────────────────────────────────────────────────── */}
        <TokenBar />

        {/* ── Search bar ─────────────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textLight} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.home.searchPlaceholder}
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearch('')} style={{ marginRight: 4 }}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={17} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* ── SEARCH RESULTS (only when typing) ─────────────────────────── */}
        {isSearching && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsTitle}>
              {t.home.searchResults} «{search}»
            </Text>

            {!hasAnyResult && (
              <View style={styles.noResult}>
                <Ionicons name="search-outline" size={36} color={COLORS.textLight} />
                <Text style={styles.noResultTitle}>Nəticə tapılmadı</Text>
                <Text style={styles.noResultSub}>«{search}» ilə uyğun kateqoriya və ya xidmət yoxdur.</Text>
              </View>
            )}

            {/* Matching categories */}
            {matchedCategories.length > 0 && (
              <>
                <Text style={styles.searchGroupLabel}>{t.home.categories}</Text>
                {matchedCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.searchCatRow}
                    onPress={() => { setSearch(''); navigation.navigate('Category', { category: cat.label }); }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.searchCatIcon}>
                      <Ionicons name={cat.icon as any} size={18} color={COLORS.primary} />
                    </View>
                    <Text style={styles.searchCatLabel}>{cat.label}</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Matching marketplace */}
            {matchedMarket.length > 0 && (
              <>
                <Text style={styles.searchGroupLabel}>Endirimlər</Text>
                {matchedMarket.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.searchMarketRow}
                    onPress={() => handleBuy(item)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.searchMarketIcon, { backgroundColor: item.gradient[0] + '22' }]}>
                      <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.searchMarketName}>{item.azName}</Text>
                      <Text style={styles.searchMarketDisc}>{item.discount} endirim · 🪙 {item.tokenCost}</Text>
                    </View>
                    <View style={styles.buyChip}>
                      <Text style={styles.buyChipText}>Al</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}

        {/* ── Everything below hidden while searching ────────────────────── */}
        {!isSearching && (
          <>
            {/* ── Token Benefits intro ─────────────────────────────────── */}
            <View style={styles.secRow}>
              <View>
                <Text style={styles.secTitle}>{t.home.tokenBenefits}</Text>
                <Text style={styles.secSubtitle}>{t.home.tokenSubtitle}</Text>
              </View>
              <Text style={styles.balancePill}>🪙 {balance.toLocaleString()}</Text>
            </View>

            {/* Benefits banner */}
            <LinearGradient colors={[COLORS.primaryDark, '#1A4A2E']} style={styles.benefitsBanner}>
              <View style={styles.benefitsBannerDeco} />
              <Text style={styles.benefitsBannerTitle}>
                {isSubscribed ? `✅ ${t.home.subActive} · ${activePlan}` : `🔒 ${t.home.subRequired}`}
              </Text>
              <Text style={styles.benefitsBannerSub}>
                {isSubscribed
                  ? 'Bütün endirimlərдən token ilə istifadə edə bilərsiniz'
                  : 'Endirimlərдən istifadə üçün abunəlik tələb olunur'}
              </Text>
              <View style={styles.benefitsRow}>
                {TOKEN_BENEFITS.map((b) => (
                  <View key={b.label} style={styles.benefitItem}>
                    <Text style={styles.benefitEmoji}>{b.emoji}</Text>
                    <Text style={styles.benefitLabel}>{b.label}</Text>
                    <Text style={styles.benefitDesc}>{b.desc}</Text>
                  </View>
                ))}
              </View>
              {!isSubscribed && (
                <TouchableOpacity style={styles.subscribeNowBtn} onPress={() => setShowSubModal(true)}>
                  <Text style={styles.subscribeNowText}>{t.home.subscribeNow}</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>

            {/* Marketplace category filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.marketCatScroll}
              keyboardShouldPersistTaps="handled"
            >
              {MARKETPLACE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setMarketCat(cat)}
                  style={[styles.marketCatChip, marketCat === cat && styles.marketCatChipActive]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.marketCatText, marketCat === cat && styles.marketCatTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Marketplace cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.marketScroll}
              keyboardShouldPersistTaps="handled"
            >
              {matchedMarket.map((item) => (
                <View key={item.id} style={styles.marketCard}>
                  <LinearGradient colors={item.gradient} style={styles.marketGrad}>
                    <View style={styles.marketDeco} />
                    {!isSubscribed && (
                      <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={14} color={COLORS.white} />
                      </View>
                    )}
                    <Text style={styles.marketEmoji}>{item.emoji}</Text>
                    <Text style={styles.marketDiscount}>{item.discount} OFF</Text>
                    <Text style={styles.marketName}>{item.azName}</Text>
                    <Text style={styles.marketDesc} numberOfLines={2}>{item.description}</Text>
                    <TouchableOpacity
                      style={[styles.marketBuyBtn, !isSubscribed && styles.marketBuyBtnLocked]}
                      onPress={() => handleBuy(item)}
                      activeOpacity={0.85}
                    >
                      {isSubscribed
                        ? <Text style={styles.marketBuyText}>🪙 {item.tokenCost} {t.market.buyWith}</Text>
                        : <Text style={styles.marketBuyText}>🔒 {t.market.lockLabel}</Text>
                      }
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              ))}
              {matchedMarket.length === 0 && (
                <View style={styles.marketEmpty}>
                  <Text style={styles.marketEmptyText}>Bu kateqoriyada nəticə yoxdur</Text>
                </View>
              )}
            </ScrollView>

            {/* ── Subscription plans ────────────────────────────────────── */}
            <View style={styles.secRow}>
              <View>
                <Text style={styles.secTitle}>{t.home.subscription}</Text>
                <Text style={styles.secSubtitle}>{t.home.subSubtitle}</Text>
              </View>
              {isSubscribed && (
                <View style={styles.activeBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  <Text style={styles.activeBadgeText}>Aktiv</Text>
                </View>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.planScroll}
              keyboardShouldPersistTaps="handled"
              alwaysBounceHorizontal={false}
            >
              {PLANS.map((plan) => {
                const active = selectedPlan === plan.id;
                const isPurchased = isSubscribed && activePlan === plan.duration;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedPlan(plan.id)}
                    activeOpacity={0.88}
                    style={[styles.planWrapper, { height: plan.cardHeight }, active && styles.planWrapperActive]}
                  >
                    <LinearGradient colors={plan.gradient} style={styles.planGradient}>
                      <View style={styles.planDeco} />
                      {plan.badge ? (
                        <View style={styles.planBadge}>
                          <Text style={styles.planBadgeText}>{plan.badge}</Text>
                        </View>
                      ) : <View style={{ height: 24 }} />}
                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planPerDay}>{plan.perDay}</Text>
                      <Text style={styles.planDuration}>{plan.duration}</Text>
                      <View style={styles.planDivider} />
                      <View style={styles.planFeatures}>
                        {plan.features.map((f) => (
                          <View key={f} style={styles.planFeatureRow}>
                            <Ionicons name="checkmark-circle" size={13} color="rgba(255,255,255,0.85)" />
                            <Text style={styles.planFeatureText}>{f}</Text>
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity
                        style={[styles.planBtn, isPurchased && styles.planBtnActive]}
                        activeOpacity={0.85}
                        onPress={() => subscribeToPlan(plan.id)}
                      >
                        <Text style={[styles.planBtnText, { color: isPurchased ? COLORS.white : plan.btnColor }]}>
                          {isPurchased ? `✓ ${t.plans.active}` : t.plans.subscribeBtn}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    {active && <View style={[styles.activeRing, { borderColor: plan.gradient[1] }]} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ── Browse Categories ──────────────────────────────────────── */}
            <View style={styles.secRow}>
              <Text style={styles.secTitle}>{t.home.browseCategories}</Text>
              <TouchableOpacity><Text style={styles.seeAll}>{t.common.seeAll}</Text></TouchableOpacity>
            </View>

            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.catCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Category', { category: cat.label })}
                >
                  <View style={styles.catIconWrap}>
                    <Ionicons name={cat.icon as any} size={22} color={COLORS.primary} />
                  </View>
                  <Text style={styles.catLabel} numberOfLines={2}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Map ───────────────────────────────────────────────────── */}
            <View style={styles.secRow}>
              <Text style={styles.secTitle}>Xəritədə kəşf et</Text>
              <TouchableOpacity onPress={() => navigation.navigate('FullMap')}>
                <Text style={styles.seeAll}>Tam xəritə ↗</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mapWrap}>
              <MapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={AZ_REGION}
                scrollEnabled={false}
                zoomEnabled={false}
                showsUserLocation
                showsMyLocationButton={false}
                minZoomLevel={6}
                maxZoomLevel={14}
              >
                {MARKERS.map((m) => (
                  <Marker key={m.id} coordinate={{ latitude: m.lat, longitude: m.lng }} title={m.title} description={m.region} pinColor={m.color} />
                ))}
              </MapView>
              <View style={styles.mapLegend}>
                <Ionicons name="location" size={14} color={COLORS.primary} />
                <Text style={styles.mapLegendText}>{MARKERS.length} yer yaxınlığınızda</Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Subscription Modal ──────────────────────────────────────────── */}
      <Modal visible={showSubModal} transparent animationType="slide" onRequestClose={() => setShowSubModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowSubModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t.market.subModal}</Text>
            {pendingItem && (
              <View style={styles.modalItemBanner}>
                <Text style={styles.modalItemText}>
                  {pendingItem.emoji} {pendingItem.azName} · {pendingItem.discount} endirim üçün abunəlik tələb olunur
                </Text>
              </View>
            )}
            <Text style={styles.modalSub}>Endirimlərдən istifadə etmək üçün bir plan seçin:</Text>
            {PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.modalPlanRow}
                onPress={() => subscribeToPlan(plan.id)}
                activeOpacity={0.85}
              >
                <LinearGradient colors={plan.gradient} style={styles.modalPlanGrad}>
                  <View>
                    <Text style={styles.modalPlanDuration}>{plan.duration}</Text>
                    <Text style={styles.modalPlanPerDay}>{plan.perDay}</Text>
                  </View>
                  <Text style={styles.modalPlanPrice}>{plan.price}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowSubModal(false)}>
              <Text style={styles.modalCloseText}>Bağla</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 16 },

  // Top bar
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  greeting: { fontSize: 13, color: COLORS.textLight, marginBottom: 2 },
  topTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.3 },
  notifBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 3 },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error, borderWidth: 1.5, borderColor: COLORS.card },
  notifCount: { position: 'absolute', top: 5, right: 5, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.error, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: COLORS.card },
  notifCountText: { fontSize: 10, fontWeight: '800', color: COLORS.white },

  // Search
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 14, marginHorizontal: 20, marginBottom: 4, paddingLeft: 16, paddingRight: 6, paddingVertical: 6, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark, paddingVertical: 6 },
  filterBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },

  // Search results panel
  searchResults: { margin: 16, backgroundColor: COLORS.card, borderRadius: 16, padding: 16, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3 },
  searchResultsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textLight, marginBottom: 12 },
  noResult: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  noResultTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  noResultSub: { fontSize: 13, color: COLORS.textLight, textAlign: 'center' },
  searchGroupLabel: { fontSize: 12, fontWeight: '800', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 12, marginBottom: 6 },
  searchCatRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  searchCatIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: COLORS.primaryXLight, justifyContent: 'center', alignItems: 'center' },
  searchCatLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  searchMarketRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  searchMarketIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  searchMarketName: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  searchMarketDisc: { fontSize: 12, color: COLORS.textLight },
  buyChip: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  buyChipText: { fontSize: 12, fontWeight: '700', color: COLORS.white },

  // Section header
  secRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginTop: 22, marginBottom: 12 },
  secTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark },
  secSubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 1 },
  seeAll: { fontSize: 13, color: COLORS.primaryLight, fontWeight: '600' },
  balancePill: { fontSize: 13, fontWeight: '700', color: COLORS.gold },

  // Benefits banner
  benefitsBanner: { marginHorizontal: 16, borderRadius: 18, padding: 18, gap: 10, overflow: 'hidden' },
  benefitsBannerDeco: { position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.06)' },
  benefitsBannerTitle: { fontSize: 14, fontWeight: '800', color: COLORS.white },
  benefitsBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  benefitsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  benefitItem: { alignItems: 'center', gap: 3, flex: 1 },
  benefitEmoji: { fontSize: 22 },
  benefitLabel: { fontSize: 11, fontWeight: '700', color: COLORS.white },
  benefitDesc: { fontSize: 9, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },
  subscribeNowBtn: { backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  subscribeNowText: { fontSize: 14, fontWeight: '800', color: COLORS.primaryDark },

  // Marketplace
  marketCatScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 8, marginTop: 12 },
  marketCatChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, backgroundColor: COLORS.cardAlt, borderWidth: 1.5, borderColor: COLORS.border },
  marketCatChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  marketCatText: { fontSize: 13, fontWeight: '700', color: COLORS.textMedium },
  marketCatTextActive: { color: COLORS.white },
  marketScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  marketCard: { width: width * 0.56, borderRadius: 18, shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5 },
  marketGrad: { borderRadius: 18, padding: 16, gap: 6, overflow: 'hidden', minHeight: 185 },
  marketDeco: { position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.09)' },
  lockOverlay: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.35)', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  marketEmoji: { fontSize: 28 },
  marketDiscount: { fontSize: 24, fontWeight: '900', color: COLORS.white, letterSpacing: -0.5 },
  marketName: { fontSize: 13, fontWeight: '700', color: COLORS.white },
  marketDesc: { fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 15, flex: 1 },
  marketBuyBtn: { marginTop: 6, backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 9, alignItems: 'center' },
  marketBuyBtnLocked: { backgroundColor: 'rgba(255,255,255,0.25)' },
  marketBuyText: { fontSize: 12, fontWeight: '800', color: COLORS.textDark },
  marketEmpty: { padding: 32, alignItems: 'center', width: width - 32 },
  marketEmptyText: { fontSize: 14, color: COLORS.textLight },

  // Active subscription badge
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryXLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.success },

  // Plans
  planScroll: { paddingHorizontal: 16, gap: 12, alignItems: 'flex-end', paddingBottom: 6 },
  planWrapper: { width: width * 0.58, borderRadius: 20, shadowColor: 'rgba(0,0,0,0.22)', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 14, elevation: 7, overflow: 'visible' },
  planWrapperActive: { shadowColor: 'rgba(0,0,0,0.38)', elevation: 12, transform: [{ scale: 1.03 }] },
  planGradient: { flex: 1, borderRadius: 20, padding: 18, overflow: 'hidden', gap: 8 },
  planDeco: { position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.09)' },
  planBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  planBadgeText: { fontSize: 11, color: COLORS.white, fontWeight: '700' },
  planPrice: { fontSize: 36, fontWeight: '900', color: COLORS.white, letterSpacing: -1 },
  planPerDay: { fontSize: 11, color: 'rgba(255,255,255,0.62)', marginTop: -6 },
  planDuration: { fontSize: 15, color: 'rgba(255,255,255,0.92)', fontWeight: '700' },
  planDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  planFeatures: { flex: 1, gap: 7 },
  planFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  planFeatureText: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  planBtn: { backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  planBtnActive: { backgroundColor: COLORS.success },
  planBtnText: { fontSize: 14, fontWeight: '700' },
  activeRing: { position: 'absolute', inset: -3 as any, borderRadius: 23, borderWidth: 2.5 },

  // Categories
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 16, gap: 10 },
  catCard: { width: (width - 72) / 4, backgroundColor: COLORS.card, borderRadius: 14, paddingVertical: 14, alignItems: 'center', gap: 7, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: COLORS.divider },
  catIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primaryXLight, justifyContent: 'center', alignItems: 'center' },
  catLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textMedium, textAlign: 'center', lineHeight: 13 },

  // Map
  mapWrap: { marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', height: 260, shadowColor: 'rgba(0,0,0,0.15)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 5 },
  map: { flex: 1 },
  mapLegend: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, shadowColor: 'rgba(0,0,0,0.15)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 3 },
  mapLegendText: { fontSize: 12, fontWeight: '600', color: COLORS.textDark },

  // Subscription modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.divider, alignSelf: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  modalItemBanner: { backgroundColor: COLORS.primaryXLight, borderRadius: 12, padding: 12 },
  modalItemText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  modalSub: { fontSize: 13, color: COLORS.textLight },
  modalPlanRow: { borderRadius: 14, overflow: 'hidden' },
  modalPlanGrad: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  modalPlanDuration: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  modalPlanPerDay: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  modalPlanPrice: { fontSize: 22, fontWeight: '900', color: COLORS.white },
  modalClose: { backgroundColor: COLORS.cardAlt, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  modalCloseText: { fontSize: 15, fontWeight: '700', color: COLORS.textMedium },
});
