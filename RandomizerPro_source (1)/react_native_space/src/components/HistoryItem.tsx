import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { HistoryEntry } from '../types';

interface HistoryItemProps {
  entry: HistoryEntry;
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    number: 'Number',
    dice: 'Dice',
    coin: 'Coin',
    picker: 'Picker',
    color: 'Color',
    decision: 'Decision',
  };
  return labels[type] || type;
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    number: '#2196F3',
    dice: '#4CAF50',
    coin: '#FFD700',
    picker: '#9C27B0',
    color: '#FF5722',
    decision: '#FF9800',
  };
  return colors[type] || '#666';
};

const HistoryItem: React.FC<HistoryItemProps> = ({ entry }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(entry.type) }]}>
            <Text variant="labelSmall" style={styles.typeText}>
              {getTypeLabel(entry.type)}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.timestamp}>
            {formatDate(entry.timestamp)}
          </Text>
        </View>
        <Text variant="titleMedium" style={styles.result}>
          {entry.result}
        </Text>
        {entry.details && (
          <Text variant="bodySmall" style={styles.details}>
            {entry.details}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timestamp: {
    color: theme.colors.onSurfaceVariant,
  },
  result: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    color: theme.colors.onSurfaceVariant,
  },
});

export default HistoryItem;