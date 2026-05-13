export interface MarketplaceItem {
  id: string;
  category: 'Transport' | 'Restaurant' | 'Farm Hotel' | 'Special Tour';
  azName: string;
  name: string;
  description: string;
  emoji: string;
  tokenCost: number;
  discount: string;
  gradient: [string, string];
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  // ── Transport ─────────────────────────────────────────────────────────────
  {
    id: 'm_uber',
    category: 'Transport',
    azName: 'Uber Endirimi',
    name: 'Uber Discount',
    description: 'Növbəti Uber sürüşünüzdə',
    emoji: '🚗',
    tokenCost: 200,
    discount: '20%',
    gradient: ['#1A1A1A', '#3D3D3D'],
  },

  // ── Restaurants ───────────────────────────────────────────────────────────
  {
    id: 'm_shirvanshah',
    category: 'Restaurant',
    azName: 'Şirvanşah Restoran',
    name: 'Shirvanshah Restaurant',
    description: 'Ənənəvi Azərbaycan mətbəxi',
    emoji: '🍽️',
    tokenCost: 150,
    discount: '15%',
    gradient: ['#7B1E1E', '#C0392B'],
  },
  {
    id: 'm_nargiz',
    category: 'Restaurant',
    azName: 'Nərgiz Restoranı',
    name: 'Nargiz Restaurant',
    description: 'Kənd üslubu yemək təcrübəsi',
    emoji: '🥘',
    tokenCost: 120,
    discount: '10%',
    gradient: ['#5C3317', '#A0522D'],
  },
  {
    id: 'm_buta',
    category: 'Restaurant',
    azName: 'Buta Restoran',
    name: 'Buta Restaurant',
    description: 'Müasir Azərbaycan füzyon mətbəxi',
    emoji: '🌿',
    tokenCost: 180,
    discount: '18%',
    gradient: ['#1A4A2E', '#2D9D63'],
  },
  {
    id: 'm_dolma',
    category: 'Restaurant',
    azName: 'Dolma Evi',
    name: 'Dolma House',
    description: 'Ev yeməkləri — Şəki üslubu',
    emoji: '🫙',
    tokenCost: 100,
    discount: '12%',
    gradient: ['#4A1D96', '#7C3AED'],
  },

  // ── Farm Hotels ───────────────────────────────────────────────────────────
  {
    id: 'm_khans_inn',
    category: 'Farm Hotel',
    azName: 'Xanın Bağ Oteli',
    name: "Khan's Garden Inn",
    description: 'Şəkidə tarixi karvansara',
    emoji: '🏡',
    tokenCost: 400,
    discount: '25%',
    gradient: ['#26A69A', '#00695C'],
  },
  {
    id: 'm_forest_lodge',
    category: 'Farm Hotel',
    azName: 'Meşə Lodj',
    name: 'Gabala Forest Lodge',
    description: 'Meşəyə baxan dağ lojjası',
    emoji: '🌲',
    tokenCost: 500,
    discount: '20%',
    gradient: ['#0D3D24', '#2D9D63'],
  },

  // ── Special Tours ─────────────────────────────────────────────────────────
  {
    id: 'm_sheki_tour',
    category: 'Special Tour',
    azName: 'Şəki İrs Turu',
    name: 'Sheki Heritage Tour',
    description: 'Şəkinin tarixi yerləri — bütün gün',
    emoji: '🏛️',
    tokenCost: 300,
    discount: '30%',
    gradient: ['#1A3A6E', '#3B6CB0'],
  },
  {
    id: 'm_grape_tour',
    category: 'Special Tour',
    azName: 'Üzüm Bağı Turu',
    name: 'Vineyard Tour',
    description: 'Şamaxı üzüm bağları və şərab degustasiyas',
    emoji: '🍇',
    tokenCost: 250,
    discount: '25%',
    gradient: ['#7B1E1E', '#9B59B6'],
  },
  {
    id: 'm_horse_tour',
    category: 'Special Tour',
    azName: 'Qarabağ At Turu',
    name: 'Karabakh Horse Tour',
    description: 'Qarabağ cinsi atla gəzinti',
    emoji: '🐴',
    tokenCost: 350,
    discount: '20%',
    gradient: ['#8B5E3C', '#E8773A'],
  },
];

export const MARKETPLACE_CATEGORIES = ['Hamısı', 'Transport', 'Restaurant', 'Farm Hotel', 'Special Tour'] as const;
