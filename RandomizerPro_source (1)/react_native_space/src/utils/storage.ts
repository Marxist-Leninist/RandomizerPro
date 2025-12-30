/**
 * AsyncStorage key constants
 */

export const STORAGE_KEYS = {
  HISTORY: '@randomizer_history',
  LISTS: '@randomizer_lists',
  FAVORITE_COLORS: '@randomizer_favorite_colors',
  SETTINGS: '@randomizer_settings',
  COIN_STATS: '@randomizer_coin_stats',
} as const;

export const MAX_HISTORY_ENTRIES = 100;