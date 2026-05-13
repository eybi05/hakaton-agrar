import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TokenContextType {
  balance: number;
  lifetime: number;
  cameraScans: number;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
  incrementCameraScans: () => void;
}

const TokenContext = createContext<TokenContextType>({
  balance: 0,
  lifetime: 0,
  cameraScans: 0,
  addTokens: () => {},
  spendTokens: () => false,
  incrementCameraScans: () => {},
});

export const useTokens = () => useContext(TokenContext);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance]         = useState(0);
  const [lifetime, setLifetime]       = useState(0);
  const [cameraScans, setCameraScans] = useState(0);

  const addTokens = (amount: number) => {
    setBalance((b) => b + amount);
    setLifetime((l) => l + amount);
  };

  const spendTokens = (amount: number): boolean => {
    if (balance < amount) return false;
    setBalance((b) => b - amount);
    return true;
  };

  const incrementCameraScans = () => setCameraScans((n) => n + 1);

  return (
    <TokenContext.Provider value={{ balance, lifetime, cameraScans, addTokens, spendTokens, incrementCameraScans }}>
      {children}
    </TokenContext.Provider>
  );
}
