import { BadgeDefinition } from '../types/badges';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ── Yeni Başlayan ─────────────────────────────────────────────────────────
  {
    id: 'first_hello',
    azName: 'Salam!',
    name: 'Hello!',
    description: 'İlk dəfə tətbiqi aç',
    category: 'Yeni Başlayan',
    emoji: '👋',
    activityType: 'open_app',
    levels: [
      { level: 1, target: 1,  rewardCoins: 20,  label: '1 gün açıldı'  },
      { level: 2, target: 3,  rewardCoins: 50,  label: '3 gün açıldı'  },
      { level: 3, target: 7,  rewardCoins: 100, label: '7 gün açıldı'  },
    ],
  },
  {
    id: 'first_love',
    azName: 'İlk Məhəbbət',
    name: 'First Love',
    description: 'İlk ferma ziyarətini et',
    category: 'Yeni Başlayan',
    emoji: '❤️',
    activityType: 'visit_farm',
    levels: [
      { level: 1, target: 1,  rewardCoins: 20,  label: '1 ferma'   },
      { level: 2, target: 5,  rewardCoins: 50,  label: '5 ferma'   },
      { level: 3, target: 10, rewardCoins: 100, label: '10 ferma'  },
    ],
  },
  {
    id: 'counter',
    azName: 'Sayğac',
    name: 'Counter',
    description: 'İlk fəaliyyətini tamamla',
    category: 'Yeni Başlayan',
    emoji: '⚡',
    activityType: 'complete_activity',
    levels: [
      { level: 1, target: 1,  rewardCoins: 20,  label: '1 fəaliyyət'   },
      { level: 2, target: 10, rewardCoins: 50,  label: '10 fəaliyyət'  },
      { level: 3, target: 25, rewardCoins: 100, label: '25 fəaliyyət'  },
    ],
  },

  // ── Təcrübəli ─────────────────────────────────────────────────────────────
  {
    id: 'streak',
    azName: 'Daim Təmasda',
    name: 'Always Connected',
    description: 'Tətbiqi ardıcıl istifadə et',
    category: 'Təcrübəli',
    emoji: '📅',
    activityType: 'use_app_streak',
    levels: [
      { level: 1, target: 3,  rewardCoins: 20,  label: '3 gün'   },
      { level: 2, target: 7,  rewardCoins: 50,  label: '7 gün'   },
      { level: 3, target: 30, rewardCoins: 100, label: '30 gün'  },
    ],
  },
  {
    id: 'invite_friend',
    azName: 'Dostunu Gətir',
    name: 'Bring a Friend',
    description: 'Dostlarını tətbiqə dəvət et',
    category: 'Təcrübəli',
    emoji: '👥',
    activityType: 'invite_friend',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 dost'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 dost'  },
      { level: 3, target: 5, rewardCoins: 100, label: '5 dost'  },
    ],
  },
  {
    id: 'buyer',
    azName: 'Bazarçı',
    name: 'Local Buyer',
    description: 'Yerli məhsul satın al',
    category: 'Təcrübəli',
    emoji: '🛍️',
    activityType: 'buy_local',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 alış-veriş'  },
      { level: 2, target: 5, rewardCoins: 50,  label: '5 alış-veriş'  },
      { level: 3, target: 10, rewardCoins: 100, label: '10 alış-veriş' },
    ],
  },

  // ── Farm Hero ─────────────────────────────────────────────────────────────
  {
    id: 'apple_collector',
    azName: 'Alma Toplayıcısı',
    name: 'Apple Collector',
    description: 'Ferma ziyarətlərində alma yığ',
    category: 'Farm Hero',
    emoji: '🍎',
    activityType: 'gather_apple',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 dəfə'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 dəfə'  },
      { level: 3, target: 7, rewardCoins: 100, label: '7 dəfə'  },
    ],
  },
  {
    id: 'grape_master',
    azName: 'Üzüm Ustası',
    name: 'Grape Master',
    description: 'Üzüm bağlarında üzüm yığ',
    category: 'Farm Hero',
    emoji: '🍇',
    activityType: 'gather_grape',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 dəfə'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 dəfə'  },
      { level: 3, target: 7, rewardCoins: 100, label: '7 dəfə'  },
    ],
  },
  {
    id: 'pomegranate_hero',
    azName: 'Nar Qəhrəmanı',
    name: 'Pomegranate Hero',
    description: 'Nar bağlarında nar yığ',
    category: 'Farm Hero',
    emoji: '🔴',
    activityType: 'gather_pomegranate',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 dəfə'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 dəfə'  },
      { level: 3, target: 7, rewardCoins: 100, label: '7 dəfə'  },
    ],
  },
  {
    id: 'cherry_picker',
    azName: 'Gilas Toplayıcısı',
    name: 'Cherry Picker',
    description: 'Gilas bağlarında gilas yığ',
    category: 'Farm Hero',
    emoji: '🍒',
    activityType: 'gather_cherry',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 dəfə'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 dəfə'  },
      { level: 3, target: 7, rewardCoins: 100, label: '7 dəfə'  },
    ],
  },
  {
    id: 'farm_helper',
    azName: 'Ferma Köməkçisi',
    name: 'Farm Helper',
    description: 'Ferma işlərinə kömək et',
    category: 'Farm Hero',
    emoji: '🌾',
    activityType: 'farm_task',
    levels: [
      { level: 1, target: 1,  rewardCoins: 20,  label: '1 tapşırıq'  },
      { level: 2, target: 5,  rewardCoins: 50,  label: '5 tapşırıq'  },
      { level: 3, target: 15, rewardCoins: 100, label: '15 tapşırıq' },
    ],
  },
  {
    id: 'local_food',
    azName: 'Yerli Dadlar',
    name: 'Local Food Lover',
    description: 'Yerli yeməkləri dadla',
    category: 'Farm Hero',
    emoji: '🍽️',
    activityType: 'try_local_food',
    levels: [
      { level: 1, target: 1,  rewardCoins: 20,  label: '1 yemək'  },
      { level: 2, target: 5,  rewardCoins: 50,  label: '5 yemək'  },
      { level: 3, target: 10, rewardCoins: 100, label: '10 yemək' },
    ],
  },

  // ── Animal Friend ─────────────────────────────────────────────────────────
  {
    id: 'horse_rider',
    azName: 'Atlı Turist',
    name: 'Horse Rider',
    description: 'At minmə fəaliyyətlərini tamamla',
    category: 'Animal Friend',
    emoji: '🐴',
    activityType: 'horse_riding',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 dəfə'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 dəfə'  },
      { level: 3, target: 5, rewardCoins: 100, label: '5 dəfə'  },
    ],
  },
  {
    id: 'animal_friend',
    azName: 'Heyvan Dostu',
    name: 'Animal Friend',
    description: 'Heyvanlara toxun və qidalandır',
    category: 'Animal Friend',
    emoji: '🐄',
    activityType: 'feed_animal',
    levels: [
      { level: 1, target: 1,  rewardCoins: 20,  label: '1 dəfə'  },
      { level: 2, target: 5,  rewardCoins: 50,  label: '5 dəfə'  },
      { level: 3, target: 10, rewardCoins: 100, label: '10 dəfə' },
    ],
  },

  // ── Region Kəşfiyyatçısı ──────────────────────────────────────────────────
  {
    id: 'region_explorer',
    azName: 'Region Səyyahı',
    name: 'Region Explorer',
    description: 'Müxtəlif regionları ziyarət et',
    category: 'Region Kəşfiyyatçısı',
    emoji: '🗺️',
    activityType: 'visit_region',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 region'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 region'  },
      { level: 3, target: 7, rewardCoins: 100, label: '7 region'  },
    ],
  },
  {
    id: 'sheki_explorer',
    azName: 'Şəki Kəşfiyyatçısı',
    name: 'Sheki Explorer',
    description: 'Şəkidəki aqroturizm yerlərini ziyarət et',
    category: 'Region Kəşfiyyatçısı',
    emoji: '🏛️',
    activityType: 'visit_sheki',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 yer'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 yer'  },
      { level: 3, target: 5, rewardCoins: 100, label: '5 yer'  },
    ],
  },
  {
    id: 'quba_explorer',
    azName: 'Quba Kəşfiyyatçısı',
    name: 'Quba Explorer',
    description: 'Qubadakı aqroturizm yerlərini ziyarət et',
    category: 'Region Kəşfiyyatçısı',
    emoji: '⛰️',
    activityType: 'visit_quba',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 yer'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 yer'  },
      { level: 3, target: 5, rewardCoins: 100, label: '5 yer'  },
    ],
  },
  {
    id: 'lankaran_explorer',
    azName: 'Lənkəran Kəşfiyyatçısı',
    name: 'Lankaran Explorer',
    description: 'Lənkərandakı aqroturizm yerlərini ziyarət et',
    category: 'Region Kəşfiyyatçısı',
    emoji: '🌊',
    activityType: 'visit_lankaran',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 yer'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 yer'  },
      { level: 3, target: 5, rewardCoins: 100, label: '5 yer'  },
    ],
  },
  {
    id: 'village_scout',
    azName: 'Kənd Kəşfiyyatçısı',
    name: 'Village Scout',
    description: 'Kənd yerlərini ziyarət et',
    category: 'Region Kəşfiyyatçısı',
    emoji: '🏘️',
    activityType: 'visit_village',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 kənd'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 kənd'  },
      { level: 3, target: 7, rewardCoins: 100, label: '7 kənd'  },
    ],
  },

  // ── Eco Turist ────────────────────────────────────────────────────────────
  {
    id: 'camera_explorer',
    azName: 'Kamera Kəşfiyyatçısı',
    name: 'Camera Explorer',
    description: 'Kamera ilə yer analiz et',
    category: 'Eco Turist',
    emoji: '📸',
    activityType: 'camera_scan',
    levels: [
      { level: 1, target: 1,  rewardCoins: 30,  label: '1 skan'  },
      { level: 2, target: 5,  rewardCoins: 75,  label: '5 skan'  },
      { level: 3, target: 15, rewardCoins: 150, label: '15 skan' },
    ],
  },
  {
    id: 'eco_tourist',
    azName: 'Yaşıl Turist',
    name: 'Eco Tourist',
    description: 'Ekoloji fəaliyyətlərə qatıl',
    category: 'Eco Turist',
    emoji: '🌱',
    activityType: 'eco_activity',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 fəaliyyət'  },
      { level: 2, target: 5, rewardCoins: 50,  label: '5 fəaliyyət'  },
      { level: 3, target: 10, rewardCoins: 100, label: '10 fəaliyyət' },
    ],
  },
  {
    id: 'discount_hunter',
    azName: 'Endirim Ovçusu',
    name: 'Discount Hunter',
    description: 'Endirim üçün token istifadə et',
    category: 'Eco Turist',
    emoji: '💰',
    activityType: 'use_discount',
    levels: [
      { level: 1, target: 1, rewardCoins: 20,  label: '1 endirim'  },
      { level: 2, target: 3, rewardCoins: 50,  label: '3 endirim'  },
      { level: 3, target: 5, rewardCoins: 100, label: '5 endirim'  },
    ],
  },

  // ── Legend ────────────────────────────────────────────────────────────────
  {
    id: 'legend',
    azName: 'Əfsanə',
    name: 'Legend',
    description: 'Bütün fəaliyyətləri tamamla',
    category: 'Legend',
    emoji: '🏆',
    activityType: 'complete_activity',
    levels: [
      { level: 1, target: 50,  rewardCoins: 100, label: '50 fəaliyyət'  },
      { level: 2, target: 100, rewardCoins: 200, label: '100 fəaliyyət' },
      { level: 3, target: 200, rewardCoins: 500, label: '200 fəaliyyət' },
    ],
  },
];

export const BADGE_CATEGORIES = [
  'Hamısı',
  'Yeni Başlayan',
  'Təcrübəli',
  'Farm Hero',
  'Animal Friend',
  'Region Kəşfiyyatçısı',
  'Eco Turist',
  'Legend',
] as const;

/** Visual theme per category — drives BadgeCard colors and section headers. */
export const CATEGORY_THEMES: Record<string, {
  icon: string;
  gradient: readonly [string, string];
  accent: string;
  cardTint: string;
  lockedBg: string;
}> = {
  'Yeni Başlayan': {
    icon: '🌅',
    gradient: ['#0284C7', '#38BDF8'],
    accent: '#0284C7',
    cardTint: '#F0F9FF',
    lockedBg: '#BAE6FD',
  },
  'Təcrübəli': {
    icon: '⭐',
    gradient: ['#1D4ED8', '#60A5FA'],
    accent: '#1D4ED8',
    cardTint: '#EFF6FF',
    lockedBg: '#BFDBFE',
  },
  'Farm Hero': {
    icon: '🌾',
    gradient: ['#92400E', '#F59E0B'],
    accent: '#D97706',
    cardTint: '#FFFBEB',
    lockedBg: '#FDE68A',
  },
  'Animal Friend': {
    icon: '🐾',
    gradient: ['#7C2D12', '#FB923C'],
    accent: '#EA580C',
    cardTint: '#FFF7ED',
    lockedBg: '#FED7AA',
  },
  'Region Kəşfiyyatçısı': {
    icon: '🗺️',
    gradient: ['#0F766E', '#2DD4BF'],
    accent: '#0F766E',
    cardTint: '#F0FDFA',
    lockedBg: '#99F6E4',
  },
  'Eco Turist': {
    icon: '🌿',
    gradient: ['#15803D', '#4ADE80'],
    accent: '#16A34A',
    cardTint: '#F0FDF4',
    lockedBg: '#BBF7D0',
  },
  'Legend': {
    icon: '👑',
    gradient: ['#4A1D96', '#D97706'],
    accent: '#7C3AED',
    cardTint: '#FAF5FF',
    lockedBg: '#DDD6FE',
  },
};
