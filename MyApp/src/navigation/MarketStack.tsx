import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketScreen from '../screens/MarketScreen';

const Stack = createNativeStackNavigator();

export default function MarketStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MarketMain" component={MarketScreen} />
    </Stack.Navigator>
  );
}
