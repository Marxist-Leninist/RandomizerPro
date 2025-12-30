import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme, Button, Card, TextInput, Chip, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { makeDecision } from '../utils/random';
import { useHistory } from '../context/HistoryContext';
import { useHaptic } from '../hooks/useHaptic';
import * as Sharing from 'expo-sharing';

const DecisionMakerScreen: React.FC = () => {
  const [customOptions, setCustomOptions] = useState<string[]>(['Yes', 'No']);
  const theme = useTheme();
  const styles = getStyles(theme);
  const [newOption, setNewOption] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isDeciding, setIsDeciding] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { addHistoryEntry } = useHistory();
  const { triggerSuccess } = useHaptic();
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isDeciding) {
      scale.value = withSequence(
        withTiming(0.8, { duration: 200, easing: Easing.ease }),
        withTiming(1.2, { duration: 300, easing: Easing.ease }),
        withTiming(1, { duration: 200, easing: Easing.ease })
      );
      opacity.value = withSequence(
        withTiming(0.5, { duration: 200 }),
        withTiming(1, { duration: 300 })
      );
    }
  }, [isDeciding]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleDecide = async () => {
    if (customOptions.length === 0) {
      setSnackbarMessage('Add at least one option!');
      setSnackbarVisible(true);
      return;
    }
    
    setIsDeciding(true);
    await triggerSuccess();
    
    setTimeout(async () => {
      const decision = makeDecision(customOptions);
      setResult(decision);
      setIsDeciding(false);
      await addHistoryEntry('decision', decision, `Options: ${customOptions.join(', ')}`);
    }, 700);
  };

  const handleAddOption = () => {
    if (newOption.trim() && !customOptions.includes(newOption.trim())) {
      setCustomOptions([...customOptions, newOption.trim()]);
      setNewOption('');
    } else if (customOptions.includes(newOption.trim())) {
      setSnackbarMessage('Option already exists!');
      setSnackbarVisible(true);
    }
  };

  const handleRemoveOption = (option: string) => {
    setCustomOptions(customOptions.filter((o) => o !== option));
  };

  const handleResetToDefault = () => {
    setCustomOptions(['Yes', 'No']);
    setSnackbarMessage('Reset to default options');
    setSnackbarVisible(true);
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(
          'data:text/plain;base64,' + btoa(`Decision: ${result}`)
        );
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
                Decision Maker
              </Text>
              
              {result && !isDeciding && (
                <Animated.View style={[styles.resultContainer, animatedStyle]}>
                  <Text variant="displayLarge" style={styles.resultText}>
                    {result}
                  </Text>
                </Animated.View>
              )}
              
              {isDeciding && (
                <View style={styles.resultContainer}>
                  <Text variant="displayLarge" style={styles.decidingText}>
                    🤔
                  </Text>
                </View>
              )}
              
              <Button 
                mode="contained" 
                onPress={handleDecide}
                disabled={isDeciding || customOptions.length === 0}
                style={styles.button}
                icon="help-circle"
              >
                {isDeciding ? 'Deciding...' : 'Decide For Me'}
              </Button>
              
              {result && !isDeciding && (
                <Button 
                  mode="outlined" 
                  onPress={handleShare}
                  style={styles.shareButton}
                  icon="share-variant"
                >
                  Share Decision
                </Button>
              )}
            </Card.Content>
          </Card>
          
          <Card style={styles.optionsCard}>
            <Card.Content>
              <View style={styles.optionsHeader}>
                <Text variant="titleMedium" style={styles.optionsTitle}>
                  Decision Options
                </Text>
                <Button mode="text" onPress={handleResetToDefault} compact>
                  Reset
                </Button>
              </View>
              
              <View style={styles.chipsContainer}>
                {customOptions.map((option) => (
                  <Chip
                    key={option}
                    onClose={() => handleRemoveOption(option)}
                    style={styles.chip}
                  >
                    {option}
                  </Chip>
                ))}
              </View>
              
              <View style={styles.addOptionRow}>
                <TextInput
                  mode="outlined"
                  placeholder="Add custom option"
                  value={newOption}
                  onChangeText={setNewOption}
                  style={styles.input}
                  onSubmitEditing={handleAddOption}
                />
                <Button 
                  mode="contained" 
                  onPress={handleAddOption}
                  style={styles.addButton}
                  disabled={!newOption.trim()}
                >
                  Add
                </Button>
              </View>
              
              <Text variant="bodySmall" style={styles.hint}>
                Add your own custom options or use the default Yes/No
              </Text>
            </Card.Content>
          </Card>
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
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    marginBottom: 24,
  },
  resultText: {
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
  },
  decidingText: {
    fontSize: 80,
  },
  button: {
    marginBottom: 8,
  },
  shareButton: {
    marginTop: 8,
  },
  optionsCard: {
    marginBottom: 16,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionsTitle: {
    fontWeight: 'bold',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  addOptionRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: theme.colors.surface,
  },
  addButton: {
    justifyContent: 'center',
  },
  hint: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
});

export default DecisionMakerScreen;