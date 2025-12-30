import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, useTheme, Button, Card, SegmentedButtons, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DiceVisual from '../components/DiceVisual';
import { rollMultipleDice } from '../utils/random';
import { useHistory } from '../context/HistoryContext';
import { useHaptic } from '../hooks/useHaptic';
import { DiceType } from '../types';
import * as Sharing from 'expo-sharing';

interface DiceRollHistory {
  id: string;
  results: number[];
  total: number;
  sides: DiceType;
  count: number;
}

const DiceRollerScreen: React.FC = () => {
  const [diceType, setDiceType] = useState<DiceType>(6);
  const theme = useTheme();
  const styles = getStyles(theme);
  const [diceCount, setDiceCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [rollHistory, setRollHistory] = useState<DiceRollHistory[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  const { addHistoryEntry } = useHistory();
  const { triggerHeavy } = useHaptic();

  const handleRoll = async () => {
    const rolled = rollMultipleDice(diceType, diceCount);
    const total = rolled.reduce((sum, val) => sum + val, 0);
    
    setResults(rolled);
    await triggerHeavy();
    
    const historyEntry: DiceRollHistory = {
      id: Date.now().toString(),
      results: rolled,
      total,
      sides: diceType,
      count: diceCount,
    };
    setRollHistory([historyEntry, ...rollHistory.slice(0, 4)]);
    
    await addHistoryEntry(
      'dice',
      `Total: ${total}`,
      `${diceCount}d${diceType}: ${rolled.join(', ')}`
    );
  };

  const handleShare = async () => {
    if (results.length === 0) return;
    const total = results.reduce((sum, val) => sum + val, 0);
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(
          'data:text/plain;base64,' + btoa(`Dice Roll: ${diceCount}d${diceType} = ${total}`)
        );
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const total = results.reduce((sum, val) => sum + val, 0);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Dice Roller
            </Text>
            
            <Text variant="labelLarge" style={styles.label}>Dice Type</Text>
            <View style={styles.buttonRow}>
              <SegmentedButtons
                value={diceType.toString()}
                onValueChange={(value) => setDiceType(parseInt(value) as DiceType)}
                buttons={[
                  { value: '4', label: 'D4' },
                  { value: '6', label: 'D6' },
                  { value: '8', label: 'D8' },
                ]}
                style={styles.segmented}
              />
            </View>
            <View style={styles.buttonRow}>
              <SegmentedButtons
                value={diceType.toString()}
                onValueChange={(value) => setDiceType(parseInt(value) as DiceType)}
                buttons={[
                  { value: '10', label: 'D10' },
                  { value: '12', label: 'D12' },
                  { value: '20', label: 'D20' },
                ]}
                style={styles.segmented}
              />
            </View>
            
            <Text variant="labelLarge" style={styles.label}>Number of Dice</Text>
            <View style={styles.buttonRow}>
              <SegmentedButtons
                value={diceCount.toString()}
                onValueChange={(value) => setDiceCount(parseInt(value))}
                buttons={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                ]}
                style={styles.segmented}
              />
            </View>
            <View style={styles.buttonRow}>
              <SegmentedButtons
                value={diceCount.toString()}
                onValueChange={(value) => setDiceCount(parseInt(value))}
                buttons={[
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                  { value: '6', label: '6' },
                ]}
                style={styles.segmented}
              />
            </View>
            
            <Button 
              mode="contained" 
              onPress={handleRoll}
              style={styles.button}
              icon="dice-multiple"
            >
              Roll Dice
            </Button>
          </Card.Content>
        </Card>
        
        {results.length > 0 && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.resultLabel}>
                Results
              </Text>
              <View style={styles.diceContainer}>
                {results.map((result, index) => (
                  <DiceVisual
                    key={index}
                    value={result}
                    sides={diceType}
                    animate
                  />
                ))}
              </View>
              <Text variant="displaySmall" style={styles.total}>
                Total: {total}
              </Text>
              <Button 
                mode="outlined" 
                onPress={handleShare}
                style={styles.shareButton}
                icon="share-variant"
              >
                Share Result
              </Button>
            </Card.Content>
          </Card>
        )}
        
        {rollHistory.length > 0 && (
          <Card style={styles.historyCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.historyTitle}>
                Recent Rolls
              </Text>
              {rollHistory.map((roll) => (
                <View key={roll.id} style={styles.historyItem}>
                  <Text variant="bodyMedium">
                    {roll.count}d{roll.sides}: {roll.results.join(' + ')} = {roll.total}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        Dice rolled!
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
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    overflow: 'visible',
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
  },
  buttonRow: {
    width: '100%',
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 0,
  },
  button: {
    marginTop: 24,
  },
  shareButton: {
    marginTop: 16,
  },
  resultCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  resultLabel: {
    marginBottom: 16,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  diceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  total: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 8,
  },
  historyCard: {
    marginBottom: 16,
  },
  historyTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});

export default DiceRollerScreen;