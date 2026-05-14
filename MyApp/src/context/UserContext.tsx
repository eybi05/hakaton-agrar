import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'tourist' | 'farmer';

interface UserContextType {
  username: string;
  role: UserRole;
  isLocal: boolean;
  country: string;
  isLoggedIn: boolean;
  login: (username: string, role: UserRole, isLocal?: boolean, country?: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  username: '',
  role: 'tourist',
  isLocal: false,
  country: '',
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [username,   setUsername]   = useState('');
  const [role,       setRole]       = useState<UserRole>('tourist');
  const [isLocal,    setIsLocal]    = useState(false);
  const [country,    setCountry]    = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = React.useCallback((name: string, r: UserRole, local = false, ctry = '') => {
    setUsername((name ?? '').trim() || 'Guest');
    setRole(r);
    setIsLocal(local);
    setCountry(ctry);
    setIsLoggedIn(true);
  }, []);

  const logout = React.useCallback(() => {
    setUsername('');
    setIsLocal(false);
    setCountry('');
    setIsLoggedIn(false);
  }, []);

  return (
    <UserContext.Provider value={{ username, role, isLocal, country, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
