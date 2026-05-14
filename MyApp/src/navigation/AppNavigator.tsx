import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform, Text } from 'react-native';

import HomeStack from './HomeStack';
import HistoricalStack from './HistoricalStack';
import FarmingStack from './FarmingStack';
import MarketStack from './MarketStack';
import MissionsStack from './MissionsStack';
import ChatbotScreen from '../screens/ChatbotScreen';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',       component: HomeStack,       icon: 'home',        label: '🏡', navKey: 'home'       },
  { name: 'Historical', component: HistoricalStack, icon: 'business',    label: '🏛️', navKey: 'historical' },
  { name: 'Farming',    component: FarmingStack,    icon: 'leaf',        label: '🌾', navKey: 'farming'    },
  { name: 'Market',     component: MarketStack,     icon: 'storefront',  label: '🛒', navKey: 'market'     },
  { name: 'Missions',   component: MissionsStack,   icon: 'trophy',      label: '🎯', navKey: 'missions'   },
  { name: 'AgroBot',    component: ChatbotScreen,   icon: 'chatbubbles', label: '🤖', navKey: 'chatbot'    },
] as const;

const ACTIVE_COLORS: Record<string, string> = {
  Home:       '#1B4332',
  Historical: '#1A3A6E',
  Farming:    '#1B4332',
  Market:     '#BC6C25',
  Missions:   '#A0522D',
  AgroBot:    '#4A1D96',
};

export default function AppNavigator() {
  const { t } = useLanguage();
  const { role } = useUser();

  const visibleTabs = TABS.filter(
    (tab) => !(role === 'farmer' && tab.name === 'Missions'),
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const activeColor = ACTIVE_COLORS[route.name] ?? COLORS.primary;
        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarIcon: ({ focused, color }) => {
            const tab = TABS.find((t) => t.name === route.name);
            const iconName = tab
              ? focused ? tab.icon : (`${tab.icon}-outline` as any)
              : 'ellipse-outline';
            return (
              <View style={[
                styles.iconWrap,
                focused && { backgroundColor: activeColor + '1A' },
              ]}>
                {focused ? (
                  <View style={[styles.activeDot, { backgroundColor: activeColor }]} />
                ) : null}
                <Ionicons name={iconName} size={20} color={color} />
              </View>
            );
          },
        };
      }}
    >
      {visibleTabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: t.nav[tab.navKey] }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(245,239,230,0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(180,158,130,0.22)',
    elevation: 24,
    shadowColor: 'rgba(13,27,13,0.2)',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 18,
    height: Platform.OS === 'ios' ? 90 : 72,
    paddingBottom: Platform.OS === 'ios' ? 26 : 12,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: -1,
    letterSpacing: 0.2,
  },
  iconWrap: {
    width: 42, height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    top: 4, width: 4, height: 4, borderRadius: 2,
  },
});
