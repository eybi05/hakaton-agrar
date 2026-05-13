import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { TokenProvider } from './src/context/TokenContext';

export default function App() {
  return (
    <TokenProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor="transparent" translucent />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </TokenProvider>
  );
}
