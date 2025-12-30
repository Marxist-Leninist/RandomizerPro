import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Button, Card, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListManager from '../components/ListManager';
import { pickRandomItem } from '../utils/random';
import { useHistory } from '../context/HistoryContext';
import { useHaptic } from '../hooks/useHaptic';
import { useCustomLists } from '../hooks/useCustomLists';
import * as Sharing from 'expo-sharing';

const PickerScreen: React.FC = () => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const theme = useTheme();
  const styles = getStyles(theme);
  const [pickedItem, setPickedItem] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { addHistoryEntry } = useHistory();
  const { triggerSuccess } = useHaptic();
  const {
    lists,
    loading,
    createList,
    deleteList,
    addItemToList,
    removeItemFromList,
  } = useCustomLists();

  useEffect(() => {
    if (lists.length > 0 && !selectedListId) {
      setSelectedListId(lists[0].id);
    }
  }, [lists]);

  const handlePick = async () => {
    if (!selectedListId) {
      setSnackbarMessage('Please create a list first!');
      setSnackbarVisible(true);
      return;
    }
    
    const selectedList = lists.find((l) => l.id === selectedListId);
    if (!selectedList) {
      setSnackbarMessage('Selected list not found!');
      setSnackbarVisible(true);
      return;
    }
    
    if (selectedList.items.length === 0) {
      setSnackbarMessage('Add some items to the list first!');
      setSnackbarVisible(true);
      return;
    }
    
    const item = pickRandomItem(selectedList.items);
    if (item) {
      setPickedItem(item);
      await triggerSuccess();
      await addHistoryEntry('picker', item, `From: ${selectedList.name}`);
    }
  };

  const handleCreateList = async (name: string) => {
    try {
      const newList = await createList(name);
      setSelectedListId(newList.id);
      setSnackbarMessage('List created!');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Failed to create list');
      setSnackbarVisible(true);
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      await deleteList(id);
      setSelectedListId(lists.length > 1 ? lists[0].id : null);
      setSnackbarMessage('List deleted!');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Failed to delete list');
      setSnackbarVisible(true);
    }
  };

  const handleShare = async () => {
    if (!pickedItem) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(
          'data:text/plain;base64,' + btoa(`Randomly picked: ${pickedItem}`)
        );
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const selectedList = lists.find((l) => l.id === selectedListId);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Random Picker
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Create lists and pick random items
            </Text>
            
            {pickedItem && (
              <View style={styles.resultContainer}>
                <Text variant="titleMedium" style={styles.resultLabel}>
                  Picked Item
                </Text>
                <Text variant="headlineLarge" style={styles.pickedItemText}>
                  {pickedItem}
                </Text>
                <Button 
                  mode="outlined" 
                  onPress={handleShare}
                  style={styles.shareButton}
                  icon="share-variant"
                >
                  Share
                </Button>
              </View>
            )}
            
            <Button 
              mode="contained" 
              onPress={handlePick}
              disabled={lists.length === 0 || !selectedList || selectedList.items.length === 0}
              style={styles.button}
              icon="shuffle"
            >
              Pick Random Item
            </Button>
            
            {lists.length === 0 && (
              <Text variant="bodySmall" style={styles.hint}>
                Create a list below to get started
              </Text>
            )}
            {lists.length > 0 && selectedList && selectedList.items.length === 0 && (
              <Text variant="bodySmall" style={styles.hint}>
                Add items to your list to enable picking
              </Text>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.managerCard}>
          <Card.Content>
            <ListManager
              lists={lists}
              selectedListId={selectedListId}
              onSelectList={setSelectedListId}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onAddItem={addItemToList}
              onRemoveItem={removeItemFromList}
            />
          </Card.Content>
        </Card>
      </ScrollView>
      
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 16,
    color: theme.colors.onSurfaceVariant,
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 24,
    padding: 16,
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
  },
  resultLabel: {
    marginBottom: 12,
    color: theme.colors.onSurfaceVariant,
  },
  pickedItemText: {
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  hint: {
    marginTop: 8,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  shareButton: {
    marginTop: 12,
  },
  managerCard: {
    marginBottom: 16,
  },
});

export default PickerScreen;