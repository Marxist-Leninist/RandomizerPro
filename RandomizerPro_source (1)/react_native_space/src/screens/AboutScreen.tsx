import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';

const AboutScreen: React.FC = () => {
  const features = [
    'Number Randomizer with custom ranges',
    'Dice Roller supporting D4, D6, D8, D10, D12, D20',
    'Coin Flipper with statistics tracking',
    'Random Picker with custom lists',
    'Color Randomizer with favorites',
    'Decision Maker with custom options',
    'Complete history of all randomizations',
    'Share results with friends',
    'Haptic feedback for better UX',
    'All data stored locally on your device',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.appIcon}>
            🎲
          </Text>
          <Text variant="headlineMedium" style={styles.appName}>
            Randomizer Pro
          </Text>
          <Text variant="bodyMedium" style={styles.version}>
            Version {APP_VERSION}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Randomizer Pro is your all-in-one tool for making random decisions, generating
              numbers, rolling dice, flipping coins, and much more. Perfect for games, decision
              making, or just having fun!
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Features
            </Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text variant="bodyMedium">• {feature}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Privacy
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              We respect your privacy. All data is stored locally on your device. No personal
              information is collected or transmitted to external servers.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Credits
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Developed with ❤️ using React Native and Expo
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.copyright}>
            © 2024 Randomizer Pro. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 24,
  },
  appIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    color: '#666',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 22,
    color: '#333',
  },
  featureRow: {
    paddingVertical: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  copyright: {
    color: '#666',
  },
});

export default AboutScreen;