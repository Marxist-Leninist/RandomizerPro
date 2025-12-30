import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { FavoriteColor } from '../types';

interface ColorCardProps {
  color: FavoriteColor;
  onRemove: (id: string) => void;
  onShowToast: (message: string) => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, onRemove, onShowToast }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  const handleCopy = async () => {
    await Clipboard.setStringAsync(color.hex);
    onShowToast(`Copied ${color.hex}`);
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={handleCopy} style={styles.pressable}>
        <View style={[styles.colorPreview, { backgroundColor: color.hex }]} />
        <View style={styles.info}>
          <Text variant="titleMedium" style={styles.hex}>
            {color.hex}
          </Text>
          <Text variant="bodySmall" style={styles.rgb}>
            RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
          </Text>
        </View>
      </Pressable>
      <IconButton icon="delete" size={20} onPress={() => onRemove(color.id)} />
    </View>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  pressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  hex: {
    fontWeight: 'bold',
    color: theme.colors.onSurfaceVariant,
  },
  rgb: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
});

export default ColorCard;