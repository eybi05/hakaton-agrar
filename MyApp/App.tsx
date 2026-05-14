import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { UserProvider, useUser } from './src/context/UserContext';
import { TokenProvider } from './src/context/TokenContext';
import { BadgeProvider } from './src/context/BadgeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { PurchaseProvider } from './src/context/PurchaseContext';
import { MarketProvider } from './src/context/MarketContext';

function AppRoot() {
  const { isLoggedIn } = useUser();
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <TokenProvider>
          <BadgeProvider>
            <PurchaseProvider>
              <MarketProvider>
                <SafeAreaProvider>
                  <AppRoot />
                </SafeAreaProvider>
              </MarketProvider>
            </PurchaseProvider>
          </BadgeProvider>
        </TokenProvider>
      </LanguageProvider>
    </UserProvider>
  );
}
