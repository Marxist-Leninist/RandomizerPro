import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Snackbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedNumber from '../components/AnimatedNumber';
import { generateRandomNumber } from '../utils/random';
import { validateNumberRange } from '../utils/validators';
import { useHistory } from '../context/HistoryContext';
import { useHaptic } from '../hooks/useHaptic';
import * as Sharing from 'expo-sharing';

const NumberRandomizerScreen: React.FC = () => {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { addHistoryEntry } = useHistory();
  const { triggerMedium, triggerLight } = useHaptic();
  const theme = useTheme();
  const styles = getStyles(theme);

  const getDecimalPlaces = (value: string): number => {
    const parts = value.split('.');
    return parts.length > 1 ? parts[1].length : 0;
  };

  const handleGenerate = async () => {
    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    const validation = validateNumberRange(minNum, maxNum);
    
    if (!validation.valid) {
      setError(validation.error || '');
      triggerLight();
      return;
    }
    
    setError('');
    const minDecimals = getDecimalPlaces(min);
    const maxDecimals = getDecimalPlaces(max);
    const decimalPlaces = Math.max(minDecimals, maxDecimals);
    
    const randomNum = generateRandomNumber(minNum, maxNum, decimalPlaces);
    setResult(randomNum);
    await triggerMedium();
    await addHistoryEntry('number', randomNum.toString(), `Range: ${minNum} - ${maxNum}, Decimals: ${decimalPlaces}`);
  };

  const handleShare = async () => {
    if (result === null) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync('data:text/plain;base64,' + btoa(`Random Number: ${result}`));
      } else {
        setSnackbarMessage('Sharing not available');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.title}>
                Number Randomizer
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Generate a random number within your specified range. Decimal precision is automatically matched to your input.
              </Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="Minimum"
                    value={min}
                    onChangeText={(text) => {
                      setMin(text);
                      setError('');
                    }}
                    keyboardType="decimal-pad"
                    error={!!error}
                    style={styles.input}
                  />
                </View>
                <Text variant="headlineMedium" style={styles.separator}>-</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="Maximum"
                    value={max}
                    onChangeText={(text) => {
                      setMax(text);
                      setError('');
                    }}
                    keyboardType="decimal-pad"
                    error={!!error}
                    style={styles.input}
                  />
                </View>
              </View>
              
              {error && <Text style={styles.error}>{error}</Text>}
              
              <Button 
                mode="contained" 
                onPress={handleGenerate}
                style={styles.button}
                icon="shuffle"
              >
                Generate Number
              </Button>
            </Card.Content>
          </Card>
          
          {result !== null && (
            <Card style={styles.resultCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.resultLabel}>
                  Your Random Number
                </Text>
                <AnimatedNumber value={result} />
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
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 24,
    color: theme.colors.onSurfaceVariant,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  separator: {
    marginHorizontal: 8,
    color: theme.colors.onSurfaceVariant,
  },
  button: {
    marginTop: 8,
  },
  shareButton: {
    marginTop: 16,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 8,
  },
  resultCard: {
    alignItems: 'center',
  },
  resultLabel: {
    marginBottom: 16,
    color: theme.colors.onSurfaceVariant,
  },
});

export default NumberRandomizerScreen;