import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FarmingScreen from '../screens/FarmingScreen';
import AddPlaceScreen from '../screens/AddPlaceScreen';
import FarmDetailScreen from '../screens/FarmDetailScreen';

const Stack = createNativeStackNavigator();

export default function FarmingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FarmingMain" component={FarmingScreen} />
      <Stack.Screen name="FarmDetail"  component={FarmDetailScreen} />
      <Stack.Screen name="AddPlace"    component={AddPlaceScreen} />
    </Stack.Navigator>
  );
}
