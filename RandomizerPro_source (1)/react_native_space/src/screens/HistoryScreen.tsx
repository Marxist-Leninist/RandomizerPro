import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card, SegmentedButtons, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryItem from '../components/HistoryItem';
import { useHistory } from '../context/HistoryContext';
import { RandomizerType } from '../types';

const HistoryScreen: React.FC = () => {
  const [filter, setFilter] = useState<RandomizerType | 'all'>('all');
  const { history, clearHistory, filterHistory } = useHistory();
  const theme = useTheme();

  const displayHistory = filter === 'all' ? history : filterHistory(filter);
  const styles = getStyles(theme);

  const handleClearHistory = () => {
    clearHistory();
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          History
        </Text>
        {history.length > 0 && (
          <Button mode="text" onPress={handleClearHistory}>
            Clear All
          </Button>
        )}
      </View>

      <Card style={styles.filterCard}>
        <Card.Content>
          <Text variant="labelMedium" style={styles.filterLabel}>
            Filter by Type
          </Text>
          <View key="filter-row-1">
            <SegmentedButtons
              value={filter}
              onValueChange={(value) => setFilter(value as RandomizerType | 'all')}
              buttons={[
                { value: 'all', label: 'All' },
                { value: 'number', label: 'Number' },
                { value: 'dice', label: 'Dice' },
              ]}
              style={styles.segmented}
            />
          </View>
          <View key="filter-row-2">
            <SegmentedButtons
              value={filter}
              onValueChange={(value) => setFilter(value as RandomizerType | 'all')}
              buttons={[
                { value: 'coin', label: 'Coin' },
                { value: 'picker', label: 'Picker' },
                { value: 'color', label: 'Color' },
              ]}
              style={styles.segmented}
            />
          </View>
          <View key="filter-row-3">
            <SegmentedButtons
              value={filter}
              onValueChange={(value) => setFilter(value as RandomizerType | 'all')}
              buttons={[{ value: 'decision', label: 'Decision' }]}
              style={styles.segmented}
            />
          </View>
        </Card.Content>
      </Card>

      <FlatList
        data={displayHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryItem entry={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="headlineMedium" style={styles.emptyIcon}>
              📄
            </Text>
            <Text variant="titleMedium" style={styles.emptyText}>
              No history yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Your randomization results will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  filterCard: {
    margin: 16,
    marginTop: 8,
  },
  filterLabel: {
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default HistoryScreen;