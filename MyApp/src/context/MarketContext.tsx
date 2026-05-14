import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  priceUnit: string;
  category: string;
  emoji: string;
  region: string;
  contact: string;
  seller: string;
  listedAt: string;
  photos: string[];
}

interface MarketContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'listedAt'>) => void;
}

const MarketContext = createContext<MarketContextType>({
  products: [],
  addProduct: () => {},
});

const SEED_PRODUCTS: Product[] = [
  {
    id: 's1', name: 'Fresh Pomegranates', description: 'Organic pomegranates from Goychay. Sweet and juicy, harvested this season.',
    price: '2.50', priceUnit: 'per kg', category: 'Fruits', emoji: '🍎',
    region: 'Goychay', contact: '+994 55 123 45 67', seller: 'Farmer Huseyn', listedAt: new Date(Date.now() - 86400000).toISOString(), photos: [],
  },
  {
    id: 's2', name: 'Mountain Honey', description: 'Pure wild honey collected from Gabala highlands. 100% natural, no additives.',
    price: '12.00', priceUnit: 'per jar', category: 'Honey', emoji: '🍯',
    region: 'Gabala', contact: '+994 70 987 65 43', seller: 'Beekeeper Anar', listedAt: new Date(Date.now() - 172800000).toISOString(), photos: [],
  },
  {
    id: 's3', name: 'Village Eggs', description: 'Free-range village eggs. Hens raised on natural feed. 30 pieces per tray.',
    price: '4.00', priceUnit: 'per dozen', category: 'Eggs', emoji: '🥚',
    region: 'Sheki', contact: '+994 51 222 33 44', seller: 'Leyla Farm', listedAt: new Date(Date.now() - 259200000).toISOString(), photos: [],
  },
  {
    id: 's4', name: 'Fresh Matsoni', description: 'Traditional Azerbaijani yogurt made from cow milk. Thick and creamy.',
    price: '1.80', priceUnit: 'per liter', category: 'Dairy', emoji: '🥛',
    region: 'Zagatala', contact: '+994 77 444 55 66', seller: 'Dairy Nurlan', listedAt: new Date(Date.now() - 345600000).toISOString(), photos: [],
  },
];

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);

  const addProduct = (product: Omit<Product, 'id' | 'listedAt'>) => {
    setProducts((prev) => [
      { ...product, id: Date.now().toString(), listedAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  return (
    <MarketContext.Provider value={{ products, addProduct }}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => useContext(MarketContext);
