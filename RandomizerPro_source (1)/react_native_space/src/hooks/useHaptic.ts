import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../context/SettingsContext';

export const useHaptic = () => {
  const { settings } = useSettings();

  const triggerLight = useCallback(async () => {
    if (settings.hapticFeedback) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Haptics not supported on this device
      }
    }
  }, [settings.hapticFeedback]);

  const triggerMedium = useCallback(async () => {
    if (settings.hapticFeedback) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not supported on this device
      }
    }
  }, [settings.hapticFeedback]);

  const triggerHeavy = useCallback(async () => {
    if (settings.hapticFeedback) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (error) {
        // Haptics not supported on this device
      }
    }
  }, [settings.hapticFeedback]);

  const triggerSuccess = useCallback(async () => {
    if (settings.hapticFeedback) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        // Haptics not supported on this device
      }
    }
  }, [settings.hapticFeedback]);

  return {
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
  };
};