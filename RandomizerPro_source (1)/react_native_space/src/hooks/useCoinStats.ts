import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CoinStats } from '../types';
import { STORAGE_KEYS } from '../utils/storage';

const defaultStats: CoinStats = {
  heads: 0,
  tails: 0,
};

export const useCoinStats = () => {
  const [stats, setStats] = useState<CoinStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.COIN_STATS);
      if (stored) {
        const parsed = JSON.parse(stored) as CoinStats;
        setStats(parsed);
      }
    } catch (error) {
      console.error('Failed to load coin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementHeads = useCallback(async () => {
    const updated = { ...stats, heads: stats.heads + 1 };
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COIN_STATS, JSON.stringify(updated));
      setStats(updated);
    } catch (error) {
      console.error('Failed to update coin stats:', error);
    }
  }, [stats]);

  const incrementTails = useCallback(async () => {
    const updated = { ...stats, tails: stats.tails + 1 };
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COIN_STATS, JSON.stringify(updated));
      setStats(updated);
    } catch (error) {
      console.error('Failed to update coin stats:', error);
    }
  }, [stats]);

  const resetStats = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COIN_STATS, JSON.stringify(defaultStats));
      setStats(defaultStats);
    } catch (error) {
      console.error('Failed to reset coin stats:', error);
    }
  }, []);

  return {
    stats,
    loading,
    incrementHeads,
    incrementTails,
    resetStats,
  };
};