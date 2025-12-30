import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryEntry, RandomizerType } from '../types';
import { STORAGE_KEYS, MAX_HISTORY_ENTRIES } from '../utils/storage';

interface HistoryContextType {
  history: HistoryEntry[];
  addHistoryEntry: (type: RandomizerType, result: string, details?: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  filterHistory: (type?: RandomizerType) => HistoryEntry[];
  loading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryEntry[];
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHistoryEntry = useCallback(async (type: RandomizerType, result: string, details?: string) => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const entry: HistoryEntry = {
      id: `${timestamp}-${randomSuffix}`,
      type,
      result,
      details,
      timestamp,
    };

    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY_ENTRIES);
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated)).catch((error) =>
        console.error('Failed to save history:', error)
      );
      return updated;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, []);

  const filterHistory = useCallback(
    (type?: RandomizerType) => {
      if (!type) return history;
      return history.filter((entry) => entry.type === type);
    },
    [history]
  );

  return (
    <HistoryContext.Provider
      value={{ history, addHistoryEntry, clearHistory, filterHistory, loading }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};