import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoricalScreen from '../screens/HistoricalScreen';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';

const Stack = createNativeStackNavigator();

export default function HistoricalStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoricalMain" component={HistoricalScreen} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
    </Stack.Navigator>
  );
}
