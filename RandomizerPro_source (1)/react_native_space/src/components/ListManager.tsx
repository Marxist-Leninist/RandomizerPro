import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Keyboard } from 'react-native';
import { Text, Button, TextInput, IconButton, Card, Portal, Dialog, useTheme } from 'react-native-paper';
import { CustomList } from '../types';
import { validateListName, validateItem } from '../utils/validators';

interface ListManagerProps {
  lists: CustomList[];
  selectedListId: string | null;
  onSelectList: (id: string) => void;
  onCreateList: (name: string) => Promise<void>;
  onDeleteList: (id: string) => Promise<void>;
  onAddItem: (listId: string, item: string) => Promise<void>;
  onRemoveItem: (listId: string, index: number) => Promise<void>;
}

const ListManager: React.FC<ListManagerProps> = ({
  lists,
  selectedListId,
  onSelectList,
  onCreateList,
  onDeleteList,
  onAddItem,
  onRemoveItem,
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');
  
  const theme = useTheme();
  const styles = getStyles(theme);

  const selectedList = lists.find((l) => l.id === selectedListId);

  const handleCreateList = async () => {
    const validation = validateListName(newListName);
    if (!validation.valid) {
      setError(validation.error || '');
      return;
    }
    try {
      await onCreateList(newListName);
      setNewListName('');
      setShowCreateDialog(false);
      setError('');
    } catch (err) {
      setError('Failed to create list');
    }
  };

  const handleAddItem = async () => {
    if (!selectedListId) return;
    const validation = validateItem(newItem);
    if (!validation.valid) {
      setError(validation.error || '');
      return;
    }
    try {
      Keyboard.dismiss();
      await onAddItem(selectedListId, newItem);
      setNewItem('');
      setError('');
    } catch (err) {
      setError('Failed to add item');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listsSection}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">My Lists</Text>
          <Button mode="contained" onPress={() => setShowCreateDialog(true)} compact>
            New List
          </Button>
        </View>
        <FlatList
          data={lists}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              style={[
                styles.listCard,
                selectedListId === item.id && styles.listCardSelected,
              ]}
              onPress={() => onSelectList(item.id)}
            >
              <Card.Content>
                <Text variant="titleSmall">{item.name}</Text>
                <Text variant="bodySmall">{item.items.length} items</Text>
              </Card.Content>
            </Card>
          )}
          ListEmptyComponent={
            <Text variant="bodyMedium" style={styles.emptyText}>
              No lists yet. Create one!
            </Text>
          }
        />
      </View>

      {selectedList && (
        <View style={styles.itemsSection}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">{selectedList.name}</Text>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDeleteList(selectedList.id)}
            />
          </View>
          <View style={styles.addItemRow}>
            <TextInput
              mode="outlined"
              placeholder="Add new item"
              value={newItem}
              onChangeText={(text) => {
                setNewItem(text);
                setError('');
              }}
              style={styles.input}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
            />
            <Button 
              mode="contained" 
              onPress={(e) => {
                e?.preventDefault?.();
                handleAddItem();
              }}
              style={styles.addButton}
              delayLongPress={0}
            >
              Add
            </Button>
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          {selectedList.items.length === 0 ? (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No items yet. Add some!
            </Text>
          ) : (
            <View style={styles.itemsList}>
              {selectedList.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text variant="bodyMedium" style={styles.itemText}>
                    {item}
                  </Text>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => onRemoveItem(selectedList.id, index)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <Portal>
        <Dialog visible={showCreateDialog} onDismiss={() => setShowCreateDialog(false)}>
          <Dialog.Title>Create New List</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="List Name"
              value={newListName}
              onChangeText={(text) => {
                setNewListName(text);
                setError('');
              }}
              error={!!error}
            />
            {error && <Text style={styles.error}>{error}</Text>}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onPress={handleCreateList}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    minHeight: 400,
  },
  listsSection: {
    marginBottom: 24,
  },
  itemsSection: {
    marginBottom: 24,
  },
  itemsList: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listCard: {
    marginRight: 12,
    minWidth: 120,
  },
  listCardSelected: {
    backgroundColor: theme.dark ? theme.colors.primaryContainer : '#E8DEF8',
  },
  addItemRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginRight: 8,
    backgroundColor: theme.colors.surface,
  },
  addButton: {
    justifyContent: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    paddingLeft: 16,
    marginBottom: 8,
    elevation: 1,
  },
  itemText: {
    flex: 1,
    color: theme.colors.onSurfaceVariant,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginVertical: 24,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
});

export default ListManager;