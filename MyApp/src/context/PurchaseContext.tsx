import React, { createContext, useContext, useState } from 'react';

export interface Purchase {
  id: string;
  itemId: string;
  name: string;
  emoji: string;
  discount: string;
  tokenCost: number;
  purchasedAt: string;
}

interface PurchaseContextType {
  purchases: Purchase[];
  addPurchase: (item: Omit<Purchase, 'id' | 'purchasedAt'>) => void;
}

const PurchaseContext = createContext<PurchaseContextType>({
  purchases: [],
  addPurchase: () => {},
});

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const addPurchase = (item: Omit<Purchase, 'id' | 'purchasedAt'>) => {
    setPurchases((prev) => [
      { ...item, id: Date.now().toString(), purchasedAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  return (
    <PurchaseContext.Provider value={{ purchases, addPurchase }}>
      {children}
    </PurchaseContext.Provider>
  );
}

export const usePurchases = () => useContext(PurchaseContext);
