import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { UserProvider, useUser } from './src/context/UserContext';
import { TokenProvider } from './src/context/TokenContext';
import { BadgeProvider } from './src/context/BadgeContext';
import { LanguageProvider } from './src/context/LanguageContext';

function AppRoot() {
  const { isLoggedIn } = useUser();
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      {isLoggedIn ? <AppNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <TokenProvider>
          <BadgeProvider>
            <SafeAreaProvider>
              <AppRoot />
            </SafeAreaProvider>
          </BadgeProvider>
        </TokenProvider>
      </LanguageProvider>
    </UserProvider>
  );
}
