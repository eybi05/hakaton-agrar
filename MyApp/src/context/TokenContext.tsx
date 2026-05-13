import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TokenContextType {
  balance: number;
  lifetime: number;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
}

const TokenContext = createContext<TokenContextType>({
  balance: 0,
  lifetime: 0,
  addTokens: () => {},
  spendTokens: () => false,
});

export const useTokens = () => useContext(TokenContext);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [lifetime, setLifetime] = useState(0);

  const addTokens = (amount: number) => {
    setBalance((b) => b + amount);
    setLifetime((l) => l + amount);
  };

  const spendTokens = (amount: number): boolean => {
    if (balance < amount) return false;
    setBalance((b) => b - amount);
    return true;
  };

  return (
    <TokenContext.Provider value={{ balance, lifetime, addTokens, spendTokens }}>
      {children}
    </TokenContext.Provider>
  );
}
