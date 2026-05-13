import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

import HomeStack from './HomeStack';
import HistoricalStack from './HistoricalStack';
import FarmingStack from './FarmingStack';
import MissionsStack from './MissionsStack';
import ChatbotScreen from '../screens/ChatbotScreen';
import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',       component: HomeStack,       icon: 'home',         label: 'Home'       },
  { name: 'Historical', component: HistoricalStack, icon: 'business',     label: 'Historical' },
  { name: 'Farming',    component: FarmingStack,    icon: 'leaf',         label: 'Farming'    },
  { name: 'Missions',   component: MissionsStack,   icon: 'trophy',       label: 'Missions'   },
  { name: 'AgroBot',    component: ChatbotScreen,   icon: 'chatbubbles',  label: 'AgroBot'    },
] as const;

const ACTIVE_COLORS: Record<string, string> = {
  Home:       COLORS.primary,
  Historical: COLORS.historical,
  Farming:    COLORS.primary,
  Missions:   COLORS.gold,
  AgroBot:    COLORS.aiLight,
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: ACTIVE_COLORS[route.name] ?? COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarIcon: ({ focused, color, size }) => {
          const tab = TABS.find((t) => t.name === route.name);
          const iconName = tab
            ? focused ? tab.icon : (`${tab.icon}-outline` as any)
            : 'ellipse-outline';

          const activeColor = ACTIVE_COLORS[route.name] ?? COLORS.primary;
          return (
            <View style={[styles.iconWrap, focused && { backgroundColor: activeColor + '18' }]}>
              <Ionicons name={iconName} size={21} color={color} />
            </View>
          );
        },
      })}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    elevation: 24,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    height: Platform.OS === 'ios' ? 86 : 66,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: -3,
  },
  iconWrap: {
    width: 36, height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
