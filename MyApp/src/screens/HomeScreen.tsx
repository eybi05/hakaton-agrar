import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Dimensions, Alert, Modal, Pressable, ImageBackground, Image,
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
import { usePurchases } from '../context/PurchaseContext';

const { width } = Dimensions.get('window');
const H_PAD = 20;

const AZ_REGION = { latitude: 40.1, longitude: 47.7, latitudeDelta: 4.2, longitudeDelta: 5.8 };

const TOURIST_PLANS = [
  {
    id: '1', duration: '1 Day', price: '$3', originalPrice: null as string | null, perDay: '$3 / day', badge: null,
    features: ['Full access', 'All categories'],
    gradient: ['#2C2C4E', '#4A4A78'] as [string, string], btnColor: '#2C2C4E',
  },
  {
    id: '2', duration: '10 Days', price: '$25', originalPrice: '$30' as string | null, perDay: '$2.5 / day', badge: 'Most Popular',
    features: ['Full access', 'All categories', 'Offline mode', 'Map view'],
    gradient: [COLORS.primaryDark, COLORS.primaryLight] as [string, string], btnColor: COLORS.primaryDark,
  },
  {
    id: '3', duration: '30 Days', price: '$45', originalPrice: '$90' as string | null, perDay: '$1.5 / day', badge: 'Best Value',
    features: ['Full access', 'All categories', 'Offline mode', 'Map view', 'Priority support', 'Exclusive discounts'],
    gradient: ['#7B4A00', '#E8A020'] as [string, string], btnColor: '#7B4A00',
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

const SUGGESTED_PLACES = [
  {
    id: 'sp1', name: 'Green Valley Farm', region: 'Sheki', type: 'Organic Farm',
    rating: 4.9, reviews: 214,
    desc: 'Stay in a real Azerbaijani farm surrounded by walnut forests.',
    tag: 'Top Rated', tagColor: COLORS.primary,
    gradient: [COLORS.primaryDark, COLORS.primaryLight] as [string, string],
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=700&h=420&fit=crop&q=80',
  },
  {
    id: 'sp2', name: 'Sunrise Horse Ranch', region: 'Gabala', type: 'Horse Riding',
    rating: 4.7, reviews: 138,
    desc: 'Trail rides through Caucasus mountain meadows at sunrise.',
    tag: 'Popular', tagColor: '#A67C52',
    gradient: ['#6B3A1F', '#A67C52'] as [string, string],
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=700&h=420&fit=crop&q=80',
  },
  {
    id: 'sp3', name: 'Mountain Camp Site', region: 'Lahij', type: 'Camping',
    rating: 4.8, reviews: 97,
    desc: 'Sleep under the stars in ancient Lahij village highlands.',
    tag: 'Adventure', tagColor: '#1A3A6E',
    gradient: ['#1A3A6E', '#3B6CB0'] as [string, string],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&h=420&fit=crop&q=80',
  },
  {
    id: 'sp4', name: 'Pomegranate Estate', region: 'Goychay', type: 'Orchard Tour',
    rating: 4.6, reviews: 83,
    desc: 'Pick fresh pomegranates and taste award-winning local jam.',
    tag: 'Seasonal', tagColor: '#C0392B',
    gradient: ['#7B1A1A', '#C0392B'] as [string, string],
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=700&h=420&fit=crop&q=80',
  },
  {
    id: 'sp5', name: 'Sheki Silk Workshop', region: 'Sheki', type: 'Traditional Craft',
    rating: 4.8, reviews: 162,
    desc: 'Watch artisans weave kelaghayi silk scarves by hand.',
    tag: 'Cultural', tagColor: '#7B4A00',
    gradient: ['#7B4A00', '#E8A020'] as [string, string],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=420&fit=crop&q=80',
  },
  {
    id: 'sp6', name: 'Quba Eco Resort', region: 'Quba', type: 'Eco Stay',
    rating: 4.7, reviews: 119,
    desc: 'Wooden cabins nestled in apple orchards with mountain views.',
    tag: 'New', tagColor: COLORS.success,
    gradient: ['#1B4332', '#52796F'] as [string, string],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&h=420&fit=crop&q=80',
  },
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
  const [isSubscribed, setIsSubscribed] = useState(isLocal);
  const [activePlan, setActivePlan]     = useState<string | null>(isLocal ? 'Local Access' : null);
  const [passportMode, setPassportMode] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [pendingItem, setPendingItem]   = useState<MarketplaceItem | null>(null);

  const { notifications }        = useBadges();
  const { balance, spendTokens, addTokens, lifetime } = useTokens();
  const { t }                    = useLanguage();
  const { username, role, isLocal, country, logout } = useUser();
  const { purchases, addPurchase } = usePurchases();

  const PLANS = TOURIST_PLANS;

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
    addPurchase({ itemId: item.id, name: item.azName, emoji: item.emoji, discount: item.discount, tokenCost: item.tokenCost });
    Alert.alert('✅ Activated!', `${item.discount} discount for ${item.azName} added!`, [{ text: 'Great!' }]);
  };

  const subscribeToPlan = (planId: string) => {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    setIsSubscribed(true); setActivePlan(plan.duration);
    setSelectedPlan(planId); setShowSubModal(false);
    addTokens(200);
    Alert.alert('🎉 Subscribed!', `${plan.duration} plan is now active.\n+200 bonus tokens added to your wallet!`, [{ text: 'Great!' }]);
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
            {role !== 'farmer' && (
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
            )}
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════
            TOKEN BALANCE CARD (tourists only)
        ══════════════════════════════════════════════════════ */}
        {role !== 'farmer' && <TouchableOpacity
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
        </TouchableOpacity>}

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
            SUGGESTED PLACES (tourists, not searching)
        ══════════════════════════════════════════════════════ */}
        {!isSearching && role !== 'farmer' && (
          <>
            <View style={styles.suggestHeader}>
              <View>
                <Text style={styles.suggestTitle}>Suggested for You</Text>
                <Text style={styles.suggestSub}>Handpicked experiences in Azerbaijan</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestScroll}
              decelerationRate="fast"
              snapToInterval={width * 0.68 + 14}
              snapToAlignment="start"
            >
              {SUGGESTED_PLACES.map((place) => (
                <TouchableOpacity
                  key={place.id}
                  style={styles.suggestCard}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('Category', { category: place.type })}
                >
                  {/* Card hero photo */}
                  <ImageBackground
                    source={{ uri: place.image }}
                    style={styles.suggestCardHero}
                    imageStyle={{ resizeMode: 'cover' }}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.04)', 'rgba(0,0,0,0.52)']}
                      style={StyleSheet.absoluteFillObject}
                    />

                    {/* Tag pill */}
                    <View style={styles.suggestTag}>
                      <Text style={styles.suggestTagText}>{place.tag}</Text>
                    </View>

                    {/* Rating badge */}
                    <View style={styles.suggestRating}>
                      <Ionicons name="star" size={11} color="#FFD700" />
                      <Text style={styles.suggestRatingText}>{place.rating}</Text>
                    </View>
                  </ImageBackground>

                  {/* Card body */}
                  <View style={styles.suggestBody}>
                    <Text style={styles.suggestName} numberOfLines={1}>{place.name}</Text>
                    <View style={styles.suggestMeta}>
                      <Ionicons name="location-outline" size={12} color={COLORS.textLight} />
                      <Text style={styles.suggestRegion}>{place.region}</Text>
                      <Text style={styles.suggestDot}>·</Text>
                      <Text style={styles.suggestType}>{place.type}</Text>
                    </View>
                    <Text style={styles.suggestDesc} numberOfLines={2}>{place.desc}</Text>
                    <View style={styles.suggestFooter}>
                      <Text style={styles.suggestReviews}>{place.reviews} reviews</Text>
                      <View style={styles.suggestExploreBtn}>
                        <Text style={styles.suggestExploreBtnText}>Explore</Text>
                        <Ionicons name="arrow-forward" size={12} color={COLORS.primary} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

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
                      {item.logoText ? (
                        <Text style={styles.searchLogoText}>{item.logoText}</Text>
                      ) : (
                        <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                      )}
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

            {/* ── Benefits Banner + Discounts + Plans (tourists only) ── */}
            {role !== 'farmer' && (<>

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
                      {item.logoText ? (
                        <View style={styles.discountLogoWrap}>
                          <Text style={styles.discountLogoText}>{item.logoText}</Text>
                        </View>
                      ) : (
                        <Text style={styles.discountEmoji}>{item.emoji}</Text>
                      )}
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

                      <View style={styles.planPriceRow}>
                        {plan.originalPrice && (
                          <Text style={styles.planOriginalPrice}>{plan.originalPrice}</Text>
                        )}
                        <Text style={styles.planPrice}>{plan.price}</Text>
                      </View>
                      <Text style={styles.planPerDay}>{plan.perDay}</Text>
                      <Text style={styles.planDuration}>{plan.duration}</Text>

                      <View style={{ flex: 1 }} />

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

            </>)}

            {/* ── My Profile ───────────────────────────────────── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Profile</Text>
            </View>

            <View style={styles.profileCard}>
              {/* ── Header row (always visible) ── */}
              <View style={styles.profileTop}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>{avatarLetter}</Text>
                </LinearGradient>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{username || 'Guest'}</Text>
                  <Text style={styles.profileRole}>{role === 'farmer' ? '👨‍🌾 Farmer' : '🧳 Tourist'}</Text>
                  {isSubscribed ? (
                    <View style={styles.profileSubBadge}>
                      <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                      <Text style={styles.profileSubBadgeText}>{activePlan} plan</Text>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => setShowSubModal(true)} activeOpacity={0.8}>
                      <Text style={styles.profileSubLink}>Subscribe →</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* ── Passport sticker toggle ── */}
                <TouchableOpacity
                  style={[styles.passportSticker, passportMode && styles.passportStickerOn]}
                  onPress={() => setPassportMode(v => !v)}
                  activeOpacity={0.82}
                >
                  <LinearGradient
                    colors={passportMode ? ['#7B1A1A', '#C0392B'] : [COLORS.primaryDark, COLORS.primary]}
                    style={styles.passportStickerGrad}
                  >
                    <View style={styles.passportStickerInner}>
                      <Text style={styles.passportStickerEmoji}>🌿</Text>
                      <Text style={styles.passportStickerTop}>AGRO</Text>
                      <Text style={styles.passportStickerBot}>PASSPORT</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.profileTokenCol}>
                  <Text style={styles.profileTokenEmoji}>🪙</Text>
                  <Text style={styles.profileTokenCount}>{balance.toLocaleString()}</Text>
                  <Text style={styles.profileTokenLabel}>Lv.{Math.floor(lifetime / 1000) + 1}</Text>
                </View>
              </View>

              <View style={styles.profileDivider} />

              {/* ══════════════════════════════════════════
                  VIEW A — Active Discounts (default)
              ══════════════════════════════════════════ */}
              {!passportMode && (<>
                <View style={styles.purchasesHeader}>
                  <Text style={styles.purchasesTitle}>Active Discounts</Text>
                  <View style={styles.purchaseCount}>
                    <Text style={styles.purchaseCountText}>{purchases.length}</Text>
                  </View>
                </View>

                {purchases.length === 0 ? (
                  <View style={styles.noPurchases}>
                    <Ionicons name="receipt-outline" size={28} color={COLORS.border} />
                    <Text style={styles.noPurchasesText}>No purchases yet</Text>
                    <Text style={styles.noPurchasesSub}>Use tokens to activate discounts below</Text>
                  </View>
                ) : (
                  <View style={styles.purchaseList}>
                    {purchases.map((p) => (
                      <View key={p.id} style={styles.purchaseRow}>
                        <View style={styles.purchaseEmojiWrap}>
                          <Text style={styles.purchaseEmoji}>{p.emoji}</Text>
                        </View>
                        <View style={styles.purchaseInfo}>
                          <Text style={styles.purchaseName}>{p.name}</Text>
                          <Text style={styles.purchaseMeta}>{p.discount} off · 🪙 {p.tokenCost}</Text>
                        </View>
                        <Text style={styles.purchaseDate}>
                          {new Date(p.purchasedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>)}

              {/* ══════════════════════════════════════════
                  VIEW B — Digital Passport
              ══════════════════════════════════════════ */}
              {passportMode && (() => {
                const parts        = (username || 'Guest').split(' ');
                const firstName    = parts[0];
                const surname      = parts.length > 1 ? parts.slice(1).join(' ') : null;
                const countryLabel = country || (isLocal ? 'Azerbaijan' : '—');
                const ppStamps = [
                  { id: '1', emoji: '🍎', topText: 'POMEGRANATE', botText: 'FESTIVAL', earned: true,                    color: '#C0392B' },
                  { id: '2', emoji: '🍇', topText: 'GRAPE',       botText: 'TOUR',     earned: purchases.length > 0,    color: '#6B3FA0' },
                  { id: '3', emoji: '🍃', topText: 'NATURE',      botText: 'WALK',     earned: lifetime > 200,          color: COLORS.primary },
                  { id: '4', emoji: '🚜', topText: 'FARM',        botText: 'LIFE',     earned: isSubscribed,            color: '#A0522D' },
                ];
                const earned = ppStamps.filter(s => s.earned).length;
                return (
                  <>
                    {/* Section title */}
                    <View style={styles.dpTitleRow}>
                      <View style={styles.dpTitleIcon}>
                        <Ionicons name="book-outline" size={16} color={COLORS.primary} />
                      </View>
                      <View>
                        <Text style={styles.dpTitle}>Digital Passport</Text>
                        <Text style={styles.dpSubtitle}>Your agrotourism journey</Text>
                      </View>
                    </View>

                    {/* Passport data card */}
                    <View style={styles.dpCard}>
                      {/* Faint landscape background */}
                      <Text style={styles.dpBgIllustration}>🌿🏡🌾</Text>

                      {/* Data rows */}
                      <View style={styles.dpRows}>
                        <View style={styles.dpRow}>
                          <Text style={styles.dpLabel}>Name</Text>
                          <View style={styles.dpSep} />
                          <Text style={styles.dpValue}>{firstName}</Text>
                        </View>
                        {surname && (
                          <View style={styles.dpRow}>
                            <Text style={styles.dpLabel}>Surname</Text>
                            <View style={styles.dpSep} />
                            <Text style={styles.dpValue}>{surname}</Text>
                          </View>
                        )}
                        <View style={styles.dpRow}>
                          <Text style={styles.dpLabel}>Country</Text>
                          <View style={styles.dpSep} />
                          <Text style={styles.dpValue}>{countryLabel}</Text>
                        </View>
                      </View>

                      {/* AGRO PASSPORT watermark badge */}
                      <View style={styles.dpWatermark}>
                        <View style={styles.dpWatermarkCircle}>
                          <Ionicons name="globe-outline" size={16} color={COLORS.primaryXLight} />
                          <Text style={styles.dpWatermarkLine1}>AGRO</Text>
                          <Text style={styles.dpWatermarkLine2}>PASSPORT</Text>
                        </View>
                      </View>
                    </View>

                    {/* Stamp Collection */}
                    <View style={styles.stampSection}>
                      <View style={styles.stampHeaderRow}>
                        <Text style={styles.stampSectionTitle}>Stamp Collection</Text>
                        <Text style={styles.stampCount}>{earned}/4 collected</Text>
                      </View>
                      <View style={styles.stampTrack}>
                        {ppStamps.map((s, i) => (
                          <React.Fragment key={s.id}>
                            {/* Individual stamp with arc labels */}
                            <View style={styles.stampWrap}>
                              {/* Top arc label */}
                              <Text style={[
                                styles.stampArcText,
                                s.earned ? { color: s.color } : { color: COLORS.border },
                              ]}>
                                {s.topText}
                              </Text>

                              {/* Circle */}
                              <View style={[
                                styles.ppStampRing,
                                s.earned
                                  ? { borderColor: s.color, borderStyle: 'solid' }
                                  : { borderColor: COLORS.border, borderStyle: 'dashed' },
                              ]}>
                                <View style={[
                                  styles.ppStampFill,
                                  s.earned && { backgroundColor: s.color + '18' },
                                ]}>
                                  <Text style={[styles.ppStampEmoji, !s.earned && { opacity: 0.35 }]}>
                                    {s.emoji}
                                  </Text>
                                </View>
                                {s.earned && (
                                  <View style={[styles.ppStampCheck, { backgroundColor: s.color }]}>
                                    <Ionicons name="checkmark" size={8} color="#fff" />
                                  </View>
                                )}
                              </View>

                              {/* Bottom arc label */}
                              <Text style={[
                                styles.stampArcText,
                                s.earned ? { color: s.color } : { color: COLORS.border },
                              ]}>
                                {s.botText}
                              </Text>
                            </View>

                            {/* Dashed connector */}
                            {i < ppStamps.length - 1 && (
                              <View style={[
                                styles.stampDash,
                                s.earned && ppStamps[i + 1].earned && { borderColor: s.color },
                              ]} />
                            )}
                          </React.Fragment>
                        ))}
                      </View>
                    </View>

                    {/* Share Passport — extra top margin */}
                    <TouchableOpacity style={styles.sharePassportBtn} activeOpacity={0.85}>
                      <Ionicons name="share-outline" size={18} color={COLORS.textMedium} />
                      <Text style={styles.sharePassportText}>Share Passport</Text>
                    </TouchableOpacity>
                  </>
                );
              })()}

              {/* Logout — always at bottom */}
              <View style={styles.profileDivider} />
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => Alert.alert('Log out', 'Are you sure you want to log out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Log out', style: 'destructive', onPress: logout },
                ])}
                activeOpacity={0.85}
              >
                <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>

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
              {(role === 'farmer' || isSubscribed) && (
                <TouchableOpacity onPress={() => navigation.navigate('FullMap')}>
                  <Text style={styles.seeAll}>Full map ↗</Text>
                </TouchableOpacity>
              )}
            </View>

            {(role === 'farmer' || isSubscribed) ? (
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
            ) : (
              <TouchableOpacity
                style={styles.mapLocked}
                onPress={() => setShowSubModal(true)}
                activeOpacity={0.88}
              >
                <LinearGradient colors={[COLORS.primaryXLight, COLORS.cardAlt]} style={styles.mapLockedGrad}>
                  <View style={styles.mapLockedIconWrap}>
                    <Ionicons name="map-outline" size={36} color={COLORS.primary} />
                    <View style={styles.mapLockedBadge}>
                      <Ionicons name="lock-closed" size={12} color={COLORS.white} />
                    </View>
                  </View>
                  <Text style={styles.mapLockedTitle}>Subscribe to Explore the Map</Text>
                  <Text style={styles.mapLockedSub}>
                    Discover {MARKERS.length} farms, camps, and hidden gems across Azerbaijan
                  </Text>
                  <View style={styles.mapLockedBtn}>
                    <Text style={styles.mapLockedBtnText}>Subscribe Now →</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

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

  // ── Suggested Places ────────────────────────────────────────────────────
  suggestHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: H_PAD, marginTop: 28, marginBottom: 14,
  },
  suggestTitle:  { fontSize: 20, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.3 },
  suggestSub:    { fontSize: 13, color: COLORS.textLight, marginTop: 2 },

  suggestScroll: { paddingHorizontal: H_PAD, paddingBottom: 8, gap: 14 },

  suggestCard: {
    width: width * 0.66,
    backgroundColor: COLORS.card, borderRadius: 22,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.14)', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1, shadowRadius: 14, elevation: 6,
  },
  suggestCardHero: {
    height: 148, padding: 14,
    justifyContent: 'space-between', alignItems: 'flex-start',
    overflow: 'hidden',
  },
  suggestTag: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  suggestTagText:   { fontSize: 11, fontWeight: '700', color: COLORS.white },
  suggestRating: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.28)', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-end',
  },
  suggestRatingText: { fontSize: 12, fontWeight: '800', color: COLORS.white },

  suggestBody:    { padding: 14, gap: 6 },
  suggestName:    { fontSize: 16, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.2 },
  suggestMeta:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suggestRegion:  { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
  suggestDot:     { fontSize: 12, color: COLORS.border },
  suggestType:    { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
  suggestDesc:    { fontSize: 13, color: COLORS.textMedium, lineHeight: 18 },
  suggestFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  suggestReviews: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
  suggestExploreBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primaryXLight, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  suggestExploreBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

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
  discountLogoWrap: {
    backgroundColor: COLORS.white, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 7,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  discountLogoText: {
    fontSize: 22, fontWeight: '900', color: '#000000',
    letterSpacing: -0.5,
  },
  searchLogoText: {
    fontSize: 12, fontWeight: '900', color: COLORS.white,
    letterSpacing: -0.3,
  },
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
  planBadgeText:     { fontSize: 11, color: COLORS.white, fontWeight: '700' },
  planPriceRow:      { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  planOriginalPrice: {
    fontSize: 22, fontWeight: '700', color: 'rgba(255,255,255,0.45)',
    textDecorationLine: 'line-through', marginBottom: 4,
  },
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
  mapLocked: {
    marginHorizontal: H_PAD, borderRadius: 24, overflow: 'hidden',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 4,
  },
  mapLockedGrad: {
    paddingVertical: 36, paddingHorizontal: 24,
    alignItems: 'center', gap: 12,
    borderWidth: 1.5, borderColor: COLORS.primaryXLight, borderRadius: 24,
  },
  mapLockedIconWrap: { position: 'relative', marginBottom: 4 },
  mapLockedBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.card,
  },
  mapLockedTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, textAlign: 'center' },
  mapLockedSub:   { fontSize: 13, color: COLORS.textLight, textAlign: 'center', lineHeight: 20 },
  mapLockedBtn: {
    marginTop: 4, backgroundColor: COLORS.primary,
    borderRadius: 50, paddingHorizontal: 28, paddingVertical: 13,
  },
  mapLockedBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },

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

  // ── Profile Section ─────────────────────────────────────────────────────
  profileCard: {
    marginHorizontal: H_PAD,
    backgroundColor: COLORS.card, borderRadius: 22,
    padding: 20,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 4,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  profileTop:        { flexDirection: 'row', alignItems: 'center', gap: 14 },
  profileAvatar: {
    width: 52, height: 52, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  profileAvatarText: { fontSize: 22, fontWeight: '900', color: COLORS.white },
  profileInfo:       { flex: 1, gap: 4 },
  profileName:       { fontSize: 17, fontWeight: '800', color: COLORS.textDark },
  profileRole:       { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
  profileSubBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primaryXLight, alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 2,
  },
  profileSubBadgeText: { fontSize: 11, color: COLORS.success, fontWeight: '700' },
  profileSubLink:      { fontSize: 12, color: COLORS.primaryLight, fontWeight: '700', marginTop: 2 },
  profileTokenCol:   { alignItems: 'center', gap: 2, flexShrink: 0 },
  profileTokenEmoji: { fontSize: 22 },
  profileTokenCount: { fontSize: 18, fontWeight: '900', color: COLORS.gold },
  profileTokenLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: '600' },

  profileDivider:   { height: 1, backgroundColor: COLORS.divider, marginVertical: 16 },

  purchasesHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  purchasesTitle:   { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  purchaseCount: {
    minWidth: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS.primaryXLight, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6,
  },
  purchaseCountText: { fontSize: 11, fontWeight: '800', color: COLORS.primary },

  noPurchases:     { alignItems: 'center', paddingVertical: 20, gap: 6 },
  noPurchasesText: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  noPurchasesSub:  { fontSize: 12, color: COLORS.textLight, textAlign: 'center' },

  purchaseList:    { gap: 10 },
  purchaseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.background, borderRadius: 14, padding: 12,
  },
  purchaseEmojiWrap: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: COLORS.goldXLight, justifyContent: 'center', alignItems: 'center',
  },
  purchaseEmoji:  { fontSize: 20 },
  purchaseInfo:   { flex: 1, gap: 2 },
  purchaseName:   { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  purchaseMeta:   { fontSize: 11, color: COLORS.textLight },
  purchaseDate:   { fontSize: 11, color: COLORS.textLight, fontWeight: '600' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FFF0F0', borderRadius: 14, paddingVertical: 13,
    borderWidth: 1, borderColor: '#FFCCCC',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.error },

  // ── Passport sticker toggle button ──────────────────────────────────────
  passportSticker: {
    width: 66, height: 66, borderRadius: 14, overflow: 'hidden',
    shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
    flexShrink: 0,
  },
  passportStickerOn: {
    shadowColor: '#C0392B', shadowOpacity: 0.4,
  },
  passportStickerGrad: {
    flex: 1, padding: 2,
  },
  passportStickerInner: {
    flex: 1, borderRadius: 12, borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', gap: 1,
  },
  passportStickerEmoji: { fontSize: 20 },
  passportStickerTop:   { fontSize: 7.5, fontWeight: '900', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
  passportStickerBot:   { fontSize: 7, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 },

  // ── Digital Passport view ────────────────────────────────────────────────
  dpTitleRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dpTitleIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: COLORS.primaryXLight, justifyContent: 'center', alignItems: 'center',
  },
  dpTitle:    { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  dpSubtitle: { fontSize: 12, color: COLORS.textLight },

  dpCard: {
    backgroundColor: COLORS.cardAlt, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.divider,
    padding: 16, flexDirection: 'row',
    alignItems: 'center', overflow: 'hidden', minHeight: 100,
  },
  dpBgIllustration: {
    position: 'absolute', bottom: 8, right: 72,
    fontSize: 36, opacity: 0.09, letterSpacing: 4,
  },
  dpRows: { flex: 1, gap: 10 },
  dpRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dpLabel:{ fontSize: 13, color: COLORS.textLight, fontWeight: '500', width: 60 },
  dpSep:  { width: 1, height: 14, backgroundColor: COLORS.border },
  dpValue:{ fontSize: 14, fontWeight: '700', color: COLORS.textDark },

  dpWatermark: { alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  dpWatermarkCircle: {
    width: 58, height: 58, borderRadius: 29,
    borderWidth: 2, borderColor: COLORS.primary + '50',
    backgroundColor: COLORS.primaryXLight,
    justifyContent: 'center', alignItems: 'center', gap: 1,
  },
  dpWatermarkLine1: { fontSize: 9, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },
  dpWatermarkLine2: { fontSize: 7, fontWeight: '700', color: COLORS.primaryLight, letterSpacing: 0.5 },

  // ── Stamp Collection ─────────────────────────────────────────────────────
  stampSection:      { gap: 14 },
  stampHeaderRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stampSectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  stampCount:        { fontSize: 12, fontWeight: '600', color: COLORS.textLight },
  stampTrack:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  stampWrap:    { alignItems: 'center', gap: 4 },
  stampArcText: { fontSize: 7, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },

  ppStampRing: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 2.5, justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  ppStampFill: {
    width: 54, height: 54, borderRadius: 27,
    justifyContent: 'center', alignItems: 'center',
  },
  ppStampEmoji: { fontSize: 24 },
  ppStampCheck: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.card,
  },
  stampDash: {
    flex: 1, height: 0, borderTopWidth: 1.5,
    borderColor: COLORS.divider, borderStyle: 'dashed',
    marginHorizontal: 3, marginTop: 18,
  },

  // ── Share Passport ───────────────────────────────────────────────────────
  sharePassportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.cardAlt, borderRadius: 14, paddingVertical: 13,
    borderWidth: 1, borderColor: COLORS.divider,
    marginTop: 8,
  },
  sharePassportText: { fontSize: 14, fontWeight: '700', color: COLORS.textMedium },

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
