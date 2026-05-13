import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'tourist' | 'farmer';

interface UserContextType {
  username: string;
  role: UserRole;
  isLoggedIn: boolean;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  username: '',
  role: 'tourist',
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [username,   setUsername]   = useState('');
  const [role,       setRole]       = useState<UserRole>('tourist');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = React.useCallback((name: string, r: UserRole) => {
    const finalName = (name ?? '').trim() || 'Guest';
    setUsername(finalName);
    setRole(r);
    setIsLoggedIn(true);
  }, []);

  const logout = React.useCallback(() => {
    setUsername('');
    setIsLoggedIn(false);
  }, []);

  return (
    <UserContext.Provider value={{ username, role, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
