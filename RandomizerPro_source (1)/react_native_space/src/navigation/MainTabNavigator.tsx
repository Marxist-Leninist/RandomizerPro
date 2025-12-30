import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';

import NumberRandomizerScreen from '../screens/NumberRandomizerScreen';
import DiceRollerScreen from '../screens/DiceRollerScreen';
import CoinFlipperScreen from '../screens/CoinFlipperScreen';
import PickerScreen from '../screens/PickerScreen';
import ColorRandomizerScreen from '../screens/ColorRandomizerScreen';
import DecisionMakerScreen from '../screens/DecisionMakerScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Number"
        component={NumberRandomizerScreen}
        options={{
          title: 'Number',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="numeric" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Dice"
        component={DiceRollerScreen}
        options={{
          title: 'Dice',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dice-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Coin"
        component={CoinFlipperScreen}
        options={{
          title: 'Coin',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="circle-double" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Picker"
        component={PickerScreen}
        options={{
          title: 'Picker',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Color"
        component={ColorRandomizerScreen}
        options={{
          title: 'Color',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="palette" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Decision"
        component={DecisionMakerScreen}
        options={{
          title: 'Decision',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="help-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;