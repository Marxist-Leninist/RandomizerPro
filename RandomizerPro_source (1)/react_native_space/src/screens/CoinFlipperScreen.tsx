import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Button, Card, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoinFlip from '../components/CoinFlip';
import { flipCoin } from '../utils/random';
import { useHistory } from '../context/HistoryContext';
import { useHaptic } from '../hooks/useHaptic';
import { useCoinStats } from '../hooks/useCoinStats';
import * as Sharing from 'expo-sharing';

const CoinFlipperScreen: React.FC = () => {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isFlipping, setIsFlipping] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  const { addHistoryEntry } = useHistory();
  const { triggerHeavy } = useHaptic();
  const { stats, incrementHeads, incrementTails, resetStats } = useCoinStats();

  const handleFlip = async () => {
    setIsFlipping(true);
    await triggerHeavy();
    
    setTimeout(async () => {
      const flipResult = flipCoin();
      setResult(flipResult);
      setIsFlipping(false);
      
      if (flipResult === 'heads') {
        await incrementHeads();
      } else {
        await incrementTails();
      }
      
      await addHistoryEntry('coin', flipResult.toUpperCase());
    }, 1000);
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(
          'data:text/plain;base64,' + btoa(`Coin Flip: ${result.toUpperCase()}`)
        );
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleReset = async () => {
    await resetStats();
    setSnackbarVisible(true);
  };

  const total = stats.heads + stats.tails;
  const headsPercentage = total > 0 ? ((stats.heads / total) * 100).toFixed(1) : 0;
  const tailsPercentage = total > 0 ? ((stats.tails / total) * 100).toFixed(1) : 0;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content style={styles.coinContainer}>
            <Text variant="headlineSmall" style={styles.title}>
              Coin Flipper
            </Text>
            
            <View style={styles.coinWrapper}>
              <CoinFlip result={result} isFlipping={isFlipping} size={200} />
            </View>
            
            {result && !isFlipping && (
              <Text variant="displaySmall" style={styles.resultText}>
                {result.toUpperCase()}!
              </Text>
            )}
            
            <Button 
              mode="contained" 
              onPress={handleFlip}
              disabled={isFlipping}
              style={styles.button}
              icon="sync"
            >
              {isFlipping ? 'Flipping...' : 'Flip Coin'}
            </Button>
            
            {result && !isFlipping && (
              <Button 
                mode="outlined" 
                onPress={handleShare}
                style={styles.shareButton}
                icon="share-variant"
              >
                Share Result
              </Button>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsHeader}>
              <Text variant="titleMedium" style={styles.statsTitle}>
                Statistics
              </Text>
              <Button mode="text" onPress={handleReset} compact>
                Reset
              </Button>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="displaySmall" style={styles.statNumber}>
                  {stats.heads}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Heads ({headsPercentage}%)
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statItem}>
                <Text variant="displaySmall" style={styles.statNumber}>
                  {stats.tails}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  Tails ({tailsPercentage}%)
                </Text>
              </View>
            </View>
            
            <Text variant="bodySmall" style={styles.totalFlips}>
              Total Flips: {total}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        Statistics reset!
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
  },
  card: {
    marginBottom: 16,
  },
  coinContainer: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 32,
    fontWeight: 'bold',
  },
  coinWrapper: {
    marginVertical: 32,
  },
  resultText: {
    marginTop: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  button: {
    marginTop: 16,
    minWidth: 200,
  },
  shareButton: {
    marginTop: 12,
    minWidth: 200,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 8,
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  totalFlips: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
});

export default CoinFlipperScreen;