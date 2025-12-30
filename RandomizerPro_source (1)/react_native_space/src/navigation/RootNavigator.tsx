import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={({ navigation }) => ({
          title: 'Randomizer Pro',
          headerRight: () => (
            <>
              <IconButton
                icon="cog"
                size={24}
                onPress={() => navigation.navigate('Settings')}
              />
              <IconButton
                icon="information"
                size={24}
                onPress={() => navigation.navigate('About')}
              />
            </>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;