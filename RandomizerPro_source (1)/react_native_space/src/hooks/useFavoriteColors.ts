import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteColor } from '../types';
import { STORAGE_KEYS } from '../utils/storage';

export const useFavoriteColors = () => {
  const [favorites, setFavorites] = useState<FavoriteColor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_COLORS);
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteColor[];
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Failed to load favorite colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = useCallback(
    async (hex: string, rgb: { r: number; g: number; b: number }) => {
      const favorite: FavoriteColor = {
        id: Date.now().toString(),
        hex,
        rgb,
        timestamp: Date.now(),
      };
      const updated = [favorite, ...favorites];
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_COLORS, JSON.stringify(updated));
        setFavorites(updated);
      } catch (error) {
        console.error('Failed to add favorite color:', error);
        throw error;
      }
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      const updated = favorites.filter((fav) => fav.id !== id);
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_COLORS, JSON.stringify(updated));
        setFavorites(updated);
      } catch (error) {
        console.error('Failed to remove favorite color:', error);
        throw error;
      }
    },
    [favorites]
  );

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
  };
};