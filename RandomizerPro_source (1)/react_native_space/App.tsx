import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from './src/components/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';
import { HistoryProvider } from './src/context/HistoryContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    secondary: '#03DAC6',
    tertiary: '#018786',
    surface: '#FFFFFF',
    background: '#F5F5F5',
    error: '#B00020',
    onSurface: '#000000',
    onBackground: '#000000',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    secondary: '#03DAC6',
    tertiary: '#03DAC6',
    surface: '#1E1E1E',
    background: '#121212',
    error: '#CF6679',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
  },
};

function AppContent() {
  const systemColorScheme = useColorScheme();
  const { settings } = useSettings();
  
  const isDarkMode = 
    settings.theme === 'dark' || 
    (settings.theme === 'system' && systemColorScheme === 'dark');
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigationTheme = isDarkMode ? NavigationDarkTheme : NavigationDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <HistoryProvider>
          <RootNavigator />
        </HistoryProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
