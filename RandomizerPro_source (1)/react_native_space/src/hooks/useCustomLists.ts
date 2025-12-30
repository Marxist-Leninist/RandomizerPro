import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomList } from '../types';
import { STORAGE_KEYS } from '../utils/storage';

export const useCustomLists = () => {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
      if (stored) {
        const parsed = JSON.parse(stored) as CustomList[];
        setLists(parsed);
      }
    } catch (error) {
      console.error('Failed to load lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLists = async (updatedLists: CustomList[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(updatedLists));
      setLists(updatedLists);
    } catch (error) {
      console.error('Failed to save lists:', error);
      throw error;
    }
  };

  const createList = async (name: string) => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newList: CustomList = {
      id: `${timestamp}-${randomSuffix}`,
      name,
      items: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const updatedLists = [...lists, newList];
    await saveLists(updatedLists);
    return newList;
  };

  const updateList = async (id: string, updates: Partial<Omit<CustomList, 'id' | 'createdAt'>>) => {
    const updatedLists = lists.map((list) =>
      list.id === id ? { ...list, ...updates, updatedAt: Date.now() } : list
    );
    await saveLists(updatedLists);
  };

  const deleteList = async (id: string) => {
    const updatedLists = lists.filter((list) => list.id !== id);
    await saveLists(updatedLists);
  };

  const addItemToList = async (listId: string, item: string) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;
    const updatedItems = [...list.items, item];
    const updatedLists = lists.map((l) =>
      l.id === listId ? { ...l, items: updatedItems, updatedAt: Date.now() } : l
    );
    await saveLists(updatedLists);
  };

  const removeItemFromList = async (listId: string, itemIndex: number) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;
    const updatedItems = list.items.filter((_, index) => index !== itemIndex);
    const updatedLists = lists.map((l) =>
      l.id === listId ? { ...l, items: updatedItems, updatedAt: Date.now() } : l
    );
    await saveLists(updatedLists);
  };

  return {
    lists,
    loading,
    createList,
    updateList,
    deleteList,
    addItemToList,
    removeItemFromList,
  };
};