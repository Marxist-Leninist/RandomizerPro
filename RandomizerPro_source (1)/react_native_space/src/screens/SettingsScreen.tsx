import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Switch, SegmentedButtons, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { AppSettings } from '../types';

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const theme = useTheme();

  const handleToggleHaptic = async () => {
    await updateSettings({ hapticFeedback: !settings.hapticFeedback });
  };

  const handleToggleSound = async () => {
    await updateSettings({ soundEffects: !settings.soundEffects });
  };

  const handleThemeChange = async (theme: AppSettings['theme']) => {
    await updateSettings({ theme });
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Settings
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Preferences
            </Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text variant="bodyLarge">Haptic Feedback</Text>
                <Text variant="bodySmall" style={styles.settingDescription}>
                  Vibrate on button presses and actions
                </Text>
              </View>
              <Switch value={settings.hapticFeedback} onValueChange={handleToggleHaptic} />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text variant="bodyLarge">Sound Effects</Text>
                <Text variant="bodySmall" style={styles.settingDescription}>
                  Play sounds for actions (Coming soon)
                </Text>
              </View>
              <Switch
                value={settings.soundEffects}
                onValueChange={handleToggleSound}
                disabled
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Appearance
            </Text>
            <Text variant="bodySmall" style={styles.themeDescription}>
              Choose your preferred theme
            </Text>
            <SegmentedButtons
              value={settings.theme}
              onValueChange={(value) => handleThemeChange(value as AppSettings['theme'])}
              buttons={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Data
            </Text>
            <Text variant="bodyMedium" style={styles.dataInfo}>
              All your data is stored locally on your device.
            </Text>
            <Text variant="bodySmall" style={styles.dataSubtext}>
              • History limited to 100 most recent entries
              {"\n"}• Custom lists and favorites are stored persistently
              {"\n"}• No data is sent to external servers
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingDescription: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    marginVertical: 12,
  },
  themeDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 12,
  },
  dataInfo: {
    marginBottom: 12,
  },
  dataSubtext: {
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
});

export default SettingsScreen;