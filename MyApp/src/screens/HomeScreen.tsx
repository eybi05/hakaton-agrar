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
import { useBadges } from '../context/BadgeContext';
import { useTokens } from '../context/TokenContext';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import LangToggle from '../components/LangToggle';
import { MARKETPLACE_ITEMS, MarketplaceItem } from '../data/marketplaceData';
import CameraAnalyzer from '../components/CameraAnalyzer';

const { width } = Dimensions.get('window');
const H_PAD = 20;

const AZ_REGION = { latitude: 40.1, longitude: 47.7, latitudeDelta: 4.2, longitudeDelta: 5.8 };

const TOURIST_PLANS = [
  {
    id: '1', duration: '1 Day', price: '$3', perDay: '$3 / day', badge: null,
    features: ['Full access', 'All categories'],
    gradient: ['#2C2C4E', '#4A4A78'] as [string, string], btnColor: '#2C2C4E',
  },
  {
    id: '2', duration: '10 Days', price: '$25', perDay: '$2.5 / day', badge: 'Most Popular',
    features: ['Full access', 'All categories', 'Offline mode', 'Map view'],
    gradient: [COLORS.primaryDark, COLORS.primaryLight] as [string, string], btnColor: COLORS.primaryDark,
  },
  {
    id: '3', duration: '30 Days', price: '$45', perDay: '$1.5 / day', badge: 'Best Value',
    features: ['Full access', 'All categories', 'Offline mode', 'Map view', 'Priority support', 'Exclusive discounts'],
    gradient: ['#7B4A00', '#E8A020'] as [string, string], btnColor: '#7B4A00',
  },
];

const FARMER_PLANS = [
  {
    id: '1', duration: '30 Days', price: '$15', perDay: '$0.50 / day', badge: 'Farmer Special',
    features: ['List your farm', 'Reach tourists', 'Booking management', 'Analytics dashboard', 'Priority placement'],
    gradient: [COLORS.primaryDark, COLORS.primaryLight] as [string, string], btnColor: COLORS.primaryDark,
  },
];

const TOKEN_BENEFITS = [
  { emoji: '🚗', label: 'Uber',     disc: '20% off' },
  { emoji: '🍽️', label: 'Dining',   disc: '10–18%'  },
  { emoji: '🏡', label: 'Hotels',   disc: '20–25%'  },
  { emoji: '🗺️', label: 'Tours',    disc: '20–30%'  },
];

const CATEGORIES = [
  { id: '1', label: 'Farms',             icon: 'leaf-outline'         },
  { id: '2', label: 'Village Tours',     icon: 'home-outline'         },
  { id: '3', label: 'Horse Riding',      icon: 'paw'                  },
  { id: '4', label: 'Organic Food',      icon: 'nutrition'            },
  { id: '5', label: 'Camping',           icon: 'flame-outline'        },
  { id: '6', label: 'Local Hotels',      icon: 'bed-outline'          },
  { id: '7', label: 'Traditional Food',  icon: 'restaurant-outline'   },
  { id: '8', label: 'Nature',            icon: 'partly-sunny-outline' },
];

const MARKERS = [
  { id: '1', title: 'Green Valley Farm',   region: 'Sheki',   lat: 41.1984, lng: 47.1705, color: COLORS.primary  },
  { id: '2', title: 'Sunrise Horse Ranch', region: 'Gabala',  lat: 40.9893, lng: 47.8418, color: '#A67C52'       },
  { id: '3', title: 'Mountain Camp Site',  region: 'Lahij',   lat: 40.8370, lng: 48.3790, color: '#1A3A6E'       },
  { id: '4', title: 'Lahij Craft Village', region: 'Lahij',   lat: 40.8420, lng: 48.3830, color: '#5C6BC0'       },
  { id: '5', title: 'Pomegranate Estate',  region: 'Goychay', lat: 40.6560, lng: 47.7400, color: '#C0392B'       },
  { id: '6', title: 'Sheki Khan Palace',   region: 'Sheki',   lat: 41.1960, lng: 47.1750, color: '#7B4A00'       },
];

const getGreeting = (t: any, name: string) => {
  const h = new Date().getHours();
  const emoji = h < 12 ? '☀️' : h < 17 ? '🌤️' : h < 21 ? '🌇' : '🌙';
  const label = h < 12 ? t.home.greetingMorning : h < 17 ? t.home.greetingAfternoon : h < 21 ? t.home.greetingEvening : t.home.greetingNight;
  return `${label} ${emoji}`;
};

type Props = { navigation: any };

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch]             = useState('');
  const [selectedPlan, setSelectedPlan] = useState('2');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activePlan, setActivePlan]     = useState<string | null>(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [pendingItem, setPendingItem]   = useState<MarketplaceItem | null>(null);

  const { notifications }        = useBadges();
  const { balance, spendTokens, lifetime } = useTokens();
  const { t }                    = useLanguage();
  const { username, role }       = useUser();

  const PLANS = role === 'farmer' ? FARMER_PLANS : TOURIST_PLANS;

  const level    = Math.floor(lifetime / 1000) + 1;
  const progress = (lifetime % 1000) / 1000;

  const q            = search.trim().toLowerCase();
  const isSearching  = q.length > 0;
  const matchedCats  = isSearching ? CATEGORIES.filter((c) => c.label.toLowerCase().includes(q)) : CATEGORIES;
  const matchedMarket = MARKETPLACE_ITEMS.filter(
    (m) => !isSearching || m.azName.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q),
  );
  const hasAnyResult = matchedCats.length > 0 || matchedMarket.length > 0;

  const handleBuy = (item: MarketplaceItem) => {
    if (!isSubscribed) { setPendingItem(item); setShowSubModal(true); return; }
    if (!spendTokens(item.tokenCost)) {
      Alert.alert('Not enough tokens', `${item.azName} requires 🪙${item.tokenCost}. You have 🪙${balance}.`, [{ text: 'OK' }]);
      return;
    }
    Alert.alert('✅ Activated!', `${item.discount} discount for ${item.azName} added!`, [{ text: 'Great!' }]);
  };

  const subscribeToPlan = (planId: string) => {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    setIsSubscribed(true); setActivePlan(plan.duration);
    setSelectedPlan(planId); setShowSubModal(false);
    Alert.alert('🎉 Subscribed!', `${plan.duration} plan is now active.`, [{ text: 'Great!' }]);
  };

  const avatarLetter = (username || 'G')[0].toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >

        {/* ══════════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════════ */}
        <View style={styles.header}>
          {/* Avatar + greeting */}
          <View style={styles.headerLeft}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </LinearGradient>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{getGreeting(t, username)}</Text>
              <Text style={styles.headerName} numberOfLines={1}>
                {username || 'Welcome'}
                <Text style={styles.headerRoleEmoji}>{role === 'farmer' ? '  👨‍🌾' : '  🧳'}</Text>
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.headerRight}>
            <LangToggle variant="dark" />
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Missions')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
              {notifications > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{notifications > 9 ? '9+' : notifications}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════
            TOKEN BALANCE CARD
        ══════════════════════════════════════════════════════ */}
        <TouchableOpacity
          style={styles.tokenCard}
          onPress={() => navigation.navigate('Missions')}
          activeOpacity={0.92}
        >
          <LinearGradient
            colors={['#7C3810', COLORS.gold, '#D4814A']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.tokenGrad}
          >
            <View style={styles.tokenDecoLarge} />
            <View style={styles.tokenDecoSmall} />

            {/* Balance */}
            <View style={styles.tokenLeft}>
              <Text style={styles.tokenCoin}>🪙</Text>
              <View style={styles.tokenBalanceGroup}>
                <Text style={styles.tokenBalance}>{balance.toLocaleString()}</Text>
                <Text style={styles.tokenLabel}>tokens</Text>
              </View>
            </View>

            {/* Level + progress */}
            <View style={styles.tokenMid}>
              <View style={styles.tokenLevelRow}>
                <Text style={styles.tokenLevelText}>Level {level}</Text>
                <Text style={styles.tokenPct}>{Math.round(progress * 100)}%</Text>
              </View>
              <View style={styles.tokenTrack}>
                <View style={[styles.tokenFill, { width: `${progress * 100}%` as any }]} />
              </View>
              <Text style={styles.tokenNextLevel}>{Math.round(progress * 1000)}/1000 to next level</Text>
            </View>

            {/* Earn button */}
            <TouchableOpacity
              style={styles.earnBtn}
              onPress={() => navigation.navigate('Missions')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={15} color={COLORS.gold} />
              <Text style={styles.earnText}>Earn</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* ══════════════════════════════════════════════════════
            SEARCH BAR
        ══════════════════════════════════════════════════════ */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder={t.home.searchPlaceholder}
              placeholderTextColor={COLORS.textLight}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {isSearching && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={19} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════════════════
            SEARCH RESULTS
        ══════════════════════════════════════════════════════ */}
        {isSearching && (
          <View style={styles.searchPanel}>
            <Text style={styles.searchLabel}>{t.home.searchResults} «{search}»</Text>

            {!hasAnyResult && (
              <View style={styles.emptySearch}>
                <Ionicons name="search-outline" size={40} color={COLORS.border} />
                <Text style={styles.emptySearchTitle}>No results</Text>
                <Text style={styles.emptySearchSub}>Try a different keyword</Text>
              </View>
            )}

            {matchedCats.length > 0 && (
              <>
                <Text style={styles.searchGroup}>{t.home.categories}</Text>
                {matchedCats.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.searchRow}
                    onPress={() => { setSearch(''); navigation.navigate('Category', { category: cat.label }); }}
                    activeOpacity={0.75}
                  >
                    <View style={styles.searchRowIcon}>
                      <Ionicons name={cat.icon as any} size={17} color={COLORS.primary} />
                    </View>
                    <Text style={styles.searchRowLabel}>{cat.label}</Text>
                    <Ionicons name="chevron-forward" size={15} color={COLORS.border} />
                  </TouchableOpacity>
                ))}
              </>
            )}

            {matchedMarket.length > 0 && (
              <>
                <Text style={styles.searchGroup}>Discounts</Text>
                {matchedMarket.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.searchRow} onPress={() => handleBuy(item)} activeOpacity={0.75}>
                    <View style={[styles.searchRowIcon, { backgroundColor: item.gradient[0] + '20' }]}>
                      <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.searchRowLabel}>{item.azName}</Text>
                      <Text style={styles.searchRowSub}>{item.discount} off · 🪙 {item.tokenCost}</Text>
                    </View>
                    <View style={styles.buyChip}><Text style={styles.buyChipText}>Use</Text></View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT (hidden while searching)
        ══════════════════════════════════════════════════════ */}
        {!isSearching && (
          <>

            {/* ── Benefits Banner ─────────────────────────────── */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>{t.home.tokenBenefits}</Text>
                <Text style={styles.sectionSub}>{t.home.tokenSubtitle}</Text>
              </View>
              <View style={styles.balancePill}>
                <Text style={styles.balancePillText}>🪙 {balance.toLocaleString()}</Text>
              </View>
            </View>

            <LinearGradient colors={['#0D2B1F', '#1B4332']} style={styles.benefitsBanner}>
              {/* Decorative circles */}
              <View style={[styles.bannerDeco, { width: 220, height: 220, top: -80, right: -80 }]} />
              <View style={[styles.bannerDeco, { width: 110, height: 110, bottom: -45, left: -35 }]} />

              {/* Status row */}
              <View style={styles.bannerStatus}>
                <View style={[styles.bannerStatusDot, { backgroundColor: isSubscribed ? COLORS.success : COLORS.gold }]} />
                <Text style={styles.bannerStatusText}>
                  {isSubscribed ? `Active · ${activePlan}` : 'Subscription required'}
                </Text>
              </View>

              <Text style={styles.bannerTitle}>
                {isSubscribed ? '✅ Discounts Unlocked' : '🔐 Unlock Exclusive Discounts'}
              </Text>
              <Text style={styles.bannerSub}>
                {isSubscribed
                  ? 'Use your tokens across all partner businesses'
                  : 'Subscribe to access token-powered discounts'}
              </Text>

              {/* Benefits grid */}
              <View style={styles.benefitsGrid}>
                {TOKEN_BENEFITS.map((b) => (
                  <View key={b.label} style={styles.benefitTile}>
                    <Text style={styles.benefitEmoji}>{b.emoji}</Text>
                    <Text style={styles.benefitLabel}>{b.label}</Text>
                    <Text style={styles.benefitDisc}>{b.disc}</Text>
                  </View>
                ))}
              </View>

              {!isSubscribed && (
                <TouchableOpacity style={styles.subscribeCTA} onPress={() => setShowSubModal(true)} activeOpacity={0.88}>
                  <Text style={styles.subscribeCTAText}>{t.home.subscribeNow}</Text>
                  <Ionicons name="arrow-forward" size={17} color={COLORS.primaryDark} />
                </TouchableOpacity>
              )}
            </LinearGradient>

            {/* ── Discount Cards ───────────────────────────────── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.discountScroll}
              decelerationRate="fast"
              snapToInterval={width * 0.66 + 16}
              snapToAlignment="start"
            >
              {matchedMarket.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.discountCard}
                  onPress={() => handleBuy(item)}
                  activeOpacity={0.88}
                >
                  <LinearGradient colors={item.gradient} style={styles.discountGrad}>
                    <View style={[styles.discountDeco, { width: 130, height: 130, top: -44, right: -44 }]} />
                    <View style={[styles.discountDeco, { width: 70, height: 70, bottom: -24, left: -24 }]} />

                    {/* Lock badge */}
                    {!isSubscribed && (
                      <View style={styles.discountLock}>
                        <Ionicons name="lock-closed" size={12} color="rgba(255,255,255,0.9)" />
                      </View>
                    )}

                    <View>
                      <Text style={styles.discountEmoji}>{item.emoji}</Text>
                      <Text style={styles.discountPct}>{item.discount}</Text>
                      <Text style={styles.discountOff}>OFF</Text>
                    </View>

                    <View>
                      <Text style={styles.discountName}>{item.azName}</Text>
                      <Text style={styles.discountDesc} numberOfLines={2}>{item.description}</Text>
                      <View style={[styles.discountBtn, !isSubscribed && styles.discountBtnLocked]}>
                        <Text style={styles.discountBtnText}>
                          {isSubscribed ? `🪙 ${item.tokenCost}` : '🔒 Subscribe'}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Subscription Plans ───────────────────────────── */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>{t.home.subscription}</Text>
                <Text style={styles.sectionSub}>{t.home.subSubtitle}</Text>
              </View>
              {isSubscribed && (
                <View style={styles.activePill}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  <Text style={styles.activePillText}>Active</Text>
                </View>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plansScroll}
              decelerationRate="fast"
            >
              {PLANS.map((plan) => {
                const isSelected   = selectedPlan === plan.id;
                const isPurchased  = isSubscribed && activePlan === plan.duration;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedPlan(plan.id)}
                    activeOpacity={0.88}
                    style={[styles.planCard, isSelected && styles.planCardActive]}
                  >
                    <LinearGradient colors={plan.gradient} style={styles.planGrad}>
                      <View style={[styles.discountDeco, { width: 130, height: 130, top: -44, right: -44 }]} />

                      {/* Badge */}
                      {plan.badge ? (
                        <View style={styles.planBadge}>
                          <Text style={styles.planBadgeText}>{plan.badge}</Text>
                        </View>
                      ) : <View style={{ height: 28 }} />}

                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planPerDay}>{plan.perDay}</Text>
                      <Text style={styles.planDuration}>{plan.duration}</Text>

                      <View style={styles.planDivider} />

                      <View style={styles.planFeatures}>
                        {plan.features.map((f) => (
                          <View key={f} style={styles.planFeatureRow}>
                            <Ionicons name="checkmark-circle" size={14} color="rgba(255,255,255,0.85)" />
                            <Text style={styles.planFeatureText}>{f}</Text>
                          </View>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={[styles.planBtn, isPurchased && styles.planBtnActive]}
                        onPress={() => subscribeToPlan(plan.id)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.planBtnText, { color: isPurchased ? COLORS.white : plan.btnColor }]}>
                          {isPurchased ? `✓ ${t.plans.active}` : t.plans.subscribeBtn}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    {isSelected && <View style={[styles.planRing, { borderColor: plan.gradient[1] }]} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ── Browse Categories ────────────────────────────── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.home.browseCategories}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>{t.common.seeAll}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.catCard}
                  activeOpacity={0.78}
                  onPress={() => navigation.navigate('Category', { category: cat.label })}
                >
                  <LinearGradient
                    colors={[COLORS.primaryXLight, COLORS.card]}
                    style={styles.catIconWrap}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name={cat.icon as any} size={23} color={COLORS.primary} />
                  </LinearGradient>
                  <Text style={styles.catLabel} numberOfLines={2}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Map ─────────────────────────────────────────── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore on Map</Text>
              <TouchableOpacity onPress={() => navigation.navigate('FullMap')}>
                <Text style={styles.seeAll}>Full map ↗</Text>
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
              <TouchableOpacity
                style={styles.mapOverlayBtn}
                onPress={() => navigation.navigate('FullMap')}
                activeOpacity={0.85}
              >
                <View style={styles.mapLegend}>
                  <Ionicons name="location" size={14} color={COLORS.primary} />
                  <Text style={styles.mapLegendText}>{MARKERS.length} nearby places</Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.textLight} />
                </View>
              </TouchableOpacity>
            </View>

          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <CameraAnalyzer />

      {/* ── Subscription Modal ─────────────────────────────────── */}
      <Modal visible={showSubModal} transparent animationType="slide" onRequestClose={() => setShowSubModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowSubModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t.market.subModal}</Text>
            {pendingItem && (
              <View style={styles.modalBanner}>
                <Text style={styles.modalBannerText}>
                  {pendingItem.emoji}  {pendingItem.azName} · {pendingItem.discount} off
                </Text>
              </View>
            )}
            <Text style={styles.modalSub}>Choose a plan to unlock all discounts:</Text>
            <View style={styles.modalPlans}>
              {PLANS.map((plan) => (
                <TouchableOpacity key={plan.id} style={styles.modalPlanRow} onPress={() => subscribeToPlan(plan.id)} activeOpacity={0.85}>
                  <LinearGradient colors={plan.gradient} style={styles.modalPlanGrad}>
                    <View>
                      <Text style={styles.modalPlanDuration}>{plan.duration}</Text>
                      <Text style={styles.modalPlanSub}>{plan.perDay}</Text>
                    </View>
                    <Text style={styles.modalPlanPrice}>{plan.price}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowSubModal(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STYLES — spacing system:  section gap = 36, H_PAD = 20, card radius = 22
// ════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 48 },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: H_PAD, paddingTop: 22, paddingBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  avatar: {
    width: 50, height: 50, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText:  { fontSize: 20, fontWeight: '900', color: COLORS.white },
  headerText:  { gap: 2, flex: 1 },
  greeting:    { fontSize: 13, color: COLORS.textLight, fontWeight: '500', letterSpacing: 0.3 },
  headerName:  { fontSize: 21, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.4 },
  headerRoleEmoji: { fontSize: 17 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  notifBadge: {
    position: 'absolute', top: 7, right: 7,
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: COLORS.error,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: COLORS.background,
  },
  notifBadgeText: { fontSize: 9, fontWeight: '900', color: COLORS.white },

  // ── Token Card ───────────────────────────────────────────────────────────
  tokenCard: {
    marginHorizontal: H_PAD, marginTop: 2, marginBottom: 16,
    borderRadius: 22,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32, shadowRadius: 14, elevation: 7,
  },
  tokenGrad: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 22, paddingVertical: 20, paddingHorizontal: 20,
    gap: 16, overflow: 'hidden',
  },
  tokenDecoLarge: {
    position: 'absolute', top: -44, right: -44,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  tokenDecoSmall: {
    position: 'absolute', bottom: -22, left: -12,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tokenLeft:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tokenCoin:         { fontSize: 32 },
  tokenBalanceGroup: { gap: 1 },
  tokenBalance:      { fontSize: 26, fontWeight: '900', color: COLORS.white, letterSpacing: -0.5 },
  tokenLabel:        { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  tokenMid:          { flex: 1, gap: 5 },
  tokenLevelRow:     { flexDirection: 'row', justifyContent: 'space-between' },
  tokenLevelText:    { fontSize: 12, fontWeight: '800', color: COLORS.white },
  tokenPct:          { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  tokenTrack:        { height: 7, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  tokenFill:         { height: '100%', backgroundColor: COLORS.white, borderRadius: 4 },
  tokenNextLevel:    { fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },
  earnBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
  },
  earnText: { fontSize: 12, fontWeight: '800', color: COLORS.gold },

  // ── Search ──────────────────────────────────────────────────────────────
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: H_PAD, marginBottom: 16,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.card, borderRadius: 16,
    paddingHorizontal: 16, height: 52,
    borderWidth: 1, borderColor: COLORS.divider,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textDark },
  filterBtn: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },

  // ── Search Panel ────────────────────────────────────────────────────────
  searchPanel: {
    marginHorizontal: H_PAD, marginTop: 8,
    backgroundColor: COLORS.card, borderRadius: 20, padding: 20,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  searchLabel:     { fontSize: 12, fontWeight: '700', color: COLORS.textLight, marginBottom: 12 },
  emptySearch:     { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptySearchTitle:{ fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  emptySearchSub:  { fontSize: 13, color: COLORS.textLight },
  searchGroup:     { fontSize: 11, fontWeight: '800', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, marginBottom: 10 },
  searchRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  searchRowIcon:   { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primaryXLight, justifyContent: 'center', alignItems: 'center' },
  searchRowLabel:  { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  searchRowSub:    { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  buyChip:         { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12 },
  buyChipText:     { fontSize: 12, fontWeight: '700', color: COLORS.white },

  // ── Section Header ──────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: H_PAD, marginTop: 36, marginBottom: 16,
  },
  sectionHeaderLeft: { gap: 3 },
  sectionTitle:  { fontSize: 20, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.3 },
  sectionSub:    { fontSize: 13, color: COLORS.textLight },
  seeAll:        { fontSize: 13, color: COLORS.primaryLight, fontWeight: '600' },
  balancePill:   { backgroundColor: COLORS.goldXLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: COLORS.gold + '40' },
  balancePillText:{ fontSize: 13, fontWeight: '700', color: COLORS.gold },

  // ── Benefits Banner ─────────────────────────────────────────────────────
  benefitsBanner: {
    marginHorizontal: H_PAD, borderRadius: 24,
    paddingHorizontal: 24, paddingVertical: 28,
    overflow: 'hidden', gap: 18,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 18, elevation: 7,
  },
  bannerDeco:       { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.05)' },
  bannerStatus:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerStatusDot:  { width: 8, height: 8, borderRadius: 4 },
  bannerStatusText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 0.4 },
  bannerTitle:      { fontSize: 21, fontWeight: '900', color: COLORS.white, lineHeight: 28 },
  bannerSub:        { fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 21 },
  benefitsGrid:     { flexDirection: 'row', justifyContent: 'space-between' },
  benefitTile:      { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 12, paddingHorizontal: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, marginHorizontal: 3 },
  benefitEmoji:     { fontSize: 24 },
  benefitLabel:     { fontSize: 11, fontWeight: '700', color: COLORS.white },
  benefitDisc:      { fontSize: 10, color: COLORS.goldLight, fontWeight: '600', textAlign: 'center' },
  subscribeCTA: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.white, borderRadius: 50, paddingVertical: 16, marginTop: 4,
    shadowColor: 'rgba(0,0,0,0.15)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  subscribeCTAText: { fontSize: 16, fontWeight: '800', color: COLORS.primaryDark },

  // ── Discount Cards ──────────────────────────────────────────────────────
  discountScroll: { paddingHorizontal: H_PAD, paddingTop: 6, paddingBottom: 8, gap: 16 },
  discountCard: {
    width: width * 0.65, borderRadius: 22,
    shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1, shadowRadius: 14, elevation: 6,
  },
  discountGrad: { borderRadius: 22, padding: 22, minHeight: 220, justifyContent: 'space-between', overflow: 'hidden' },
  discountDeco: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  discountLock: {
    position: 'absolute', top: 16, right: 16,
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center', alignItems: 'center',
  },
  discountEmoji:  { fontSize: 36, marginBottom: 6 },
  discountPct:    { fontSize: 38, fontWeight: '900', color: COLORS.white, letterSpacing: -1, lineHeight: 42 },
  discountOff:    { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginTop: -2, letterSpacing: 2 },
  discountName:   { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  discountDesc:   { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 17 },
  discountBtn:    { backgroundColor: COLORS.white, borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  discountBtnLocked: { backgroundColor: 'rgba(255,255,255,0.2)' },
  discountBtnText:{ fontSize: 13, fontWeight: '800', color: COLORS.textDark },

  // ── Active pill ─────────────────────────────────────────────────────────
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.primaryXLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  activePillText: { fontSize: 12, fontWeight: '700', color: COLORS.success },

  // ── Plan Cards ──────────────────────────────────────────────────────────
  plansScroll: { paddingHorizontal: H_PAD, gap: 16, alignItems: 'flex-end', paddingBottom: 10 },
  planCard: {
    width: width * 0.62, borderRadius: 24, overflow: 'visible',
    shadowColor: 'rgba(0,0,0,0.2)', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 8,
    minHeight: 280,
  },
  planCardActive: {
    shadowColor: 'rgba(0,0,0,0.35)', elevation: 16,
    transform: [{ scale: 1.02 }],
  },
  planGrad:      { flex: 1, borderRadius: 24, padding: 22, overflow: 'hidden', gap: 12, minHeight: 280 },
  planBadge:     { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  planBadgeText: { fontSize: 11, color: COLORS.white, fontWeight: '700' },
  planPrice:     { fontSize: 42, fontWeight: '900', color: COLORS.white, letterSpacing: -1.5 },
  planPerDay:    { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: -10 },
  planDuration:  { fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  planDivider:   { height: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  planFeatures:  { flex: 1, gap: 9 },
  planFeatureRow:{ flexDirection: 'row', alignItems: 'center', gap: 9 },
  planFeatureText:{ fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  planBtn:       { backgroundColor: COLORS.white, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  planBtnActive: { backgroundColor: COLORS.success },
  planBtnText:   { fontSize: 15, fontWeight: '700' },
  planRing: {
    position: 'absolute', inset: -4 as any,
    borderRadius: 28, borderWidth: 2.5,
  },

  // ── Categories ──────────────────────────────────────────────────────────
  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: H_PAD, gap: 14,
  },
  catCard: {
    width: (width - H_PAD * 2 - 42) / 4,
    backgroundColor: COLORS.card, borderRadius: 18,
    paddingVertical: 18, alignItems: 'center', gap: 10,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  catIconWrap: {
    width: 48, height: 48, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  catLabel: { fontSize: 10.5, fontWeight: '600', color: COLORS.textMedium, textAlign: 'center', lineHeight: 14 },

  // ── Map ─────────────────────────────────────────────────────────────────
  mapWrap: {
    marginHorizontal: H_PAD, borderRadius: 24, overflow: 'hidden', height: 260,
    shadowColor: 'rgba(0,0,0,0.12)', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 6,
  },
  map: { flex: 1 },
  mapOverlayBtn: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  mapLegend: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 11,
    borderRadius: 50,
    shadowColor: 'rgba(0,0,0,0.12)', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
    alignSelf: 'flex-start',
  },
  mapLegendText: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.textDark },

  // ── Subscription Modal ──────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet:   {
    backgroundColor: COLORS.card, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 26, paddingTop: 18, paddingBottom: 40, gap: 16,
  },
  modalHandle:  { width: 44, height: 5, borderRadius: 2.5, backgroundColor: COLORS.divider, alignSelf: 'center', marginBottom: 4 },
  modalTitle:   { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  modalBanner:  { backgroundColor: COLORS.primaryXLight, borderRadius: 16, padding: 16 },
  modalBannerText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  modalSub:     { fontSize: 14, color: COLORS.textLight },
  modalPlans:   { gap: 12 },
  modalPlanRow: { borderRadius: 18, overflow: 'hidden' },
  modalPlanGrad:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 18 },
  modalPlanDuration:{ fontSize: 17, fontWeight: '800', color: COLORS.white },
  modalPlanSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 3 },
  modalPlanPrice:   { fontSize: 26, fontWeight: '900', color: COLORS.white },
  modalClose:   { backgroundColor: COLORS.cardAlt, borderRadius: 18, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.divider },
  modalCloseText:   { fontSize: 15, fontWeight: '700', color: COLORS.textMedium },
});
