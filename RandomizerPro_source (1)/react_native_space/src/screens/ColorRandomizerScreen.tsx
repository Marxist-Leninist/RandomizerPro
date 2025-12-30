import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Pressable } from 'react-native';
import { Text, useTheme, Button, Card, Snackbar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { generateRandomColor } from '../utils/random';
import { useHistory } from '../context/HistoryContext';
import { useHaptic } from '../hooks/useHaptic';
import { useFavoriteColors } from '../hooks/useFavoriteColors';
import ColorCard from '../components/ColorCard';
import * as Sharing from 'expo-sharing';

const ColorRandomizerScreen: React.FC = () => {
  const [currentColor, setCurrentColor] = useState(generateRandomColor());
  const theme = useTheme();
  const styles = getStyles(theme);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { addHistoryEntry } = useHistory();
  const { triggerLight } = useHaptic();
  const { favorites, addFavorite, removeFavorite } = useFavoriteColors();

  const handleGenerate = async () => {
    const newColor = generateRandomColor();
    setCurrentColor(newColor);
    await triggerLight();
    await addHistoryEntry(
      'color',
      newColor.hex,
      `RGB(${newColor.rgb.r}, ${newColor.rgb.g}, ${newColor.rgb.b})`
    );
  };

  const handleCopyHex = async () => {
    await Clipboard.setStringAsync(currentColor.hex);
    setSnackbarMessage(`Copied ${currentColor.hex}`);
    setSnackbarVisible(true);
  };

  const handleSaveFavorite = async () => {
    try {
      await addFavorite(currentColor.hex, currentColor.rgb);
      setSnackbarMessage('Color saved to favorites!');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Failed to save color');
      setSnackbarVisible(true);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await removeFavorite(id);
      setSnackbarMessage('Color removed from favorites');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Failed to remove color');
      setSnackbarVisible(true);
    }
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(
          'data:text/plain;base64,' +
            btoa(`Color: ${currentColor.hex}\nRGB(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`)
        );
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Color Randomizer
            </Text>
            
            <Pressable onPress={handleCopyHex} style={styles.colorPreviewContainer}>
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: currentColor.hex },
                ]}
              >
                <View style={styles.colorInfo}>
                  <Text variant="displaySmall" style={styles.hexText}>
                    {currentColor.hex}
                  </Text>
                  <Text variant="titleMedium" style={styles.rgbText}>
                    RGB({currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b})
                  </Text>
                </View>
              </View>
            </Pressable>
            
            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                onPress={handleGenerate}
                style={styles.generateButton}
                icon="shuffle"
              >
                Generate
              </Button>
              <IconButton
                icon="content-copy"
                mode="contained"
                onPress={handleCopyHex}
                size={24}
              />
              <IconButton
                icon="heart"
                mode="contained"
                onPress={handleSaveFavorite}
                size={24}
              />
              <IconButton
                icon="share-variant"
                mode="contained"
                onPress={handleShare}
                size={24}
              />
            </View>
          </Card.Content>
        </Card>
        
        {favorites.length > 0 && (
          <Card style={styles.favoritesCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.favoritesTitle}>
                Favorite Colors
              </Text>
              <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ColorCard
                    color={item}
                    onRemove={handleRemoveFavorite}
                    onShowToast={(msg) => {
                      setSnackbarMessage(msg);
                      setSnackbarVisible(true);
                    }}
                  />
                )}
                scrollEnabled={false}
              />
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  colorPreviewContainer: {
    marginBottom: 16,
  },
  colorPreview: {
    height: 300,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  colorInfo: {
    backgroundColor: theme.dark 
      ? 'rgba(30, 30, 30, 0.95)' 
      : 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  hexText: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  rgbText: {
    color: theme.colors.onSurfaceVariant,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  generateButton: {
    flex: 1,
    marginRight: 8,
  },
  favoritesCard: {
    marginBottom: 16,
  },
  favoritesTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});

export default ColorRandomizerScreen;