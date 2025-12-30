import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { DiceType } from '../types';

interface DiceVisualProps {
  value: number;
  sides: DiceType;
  size?: number;
  animate?: boolean;
}

const DiceVisual: React.FC<DiceVisualProps> = ({ value, sides, size = 60, animate = false }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (animate) {
      rotation.value = withSequence(
        withTiming(360, { duration: 300, easing: Easing.ease }),
        withTiming(0, { duration: 0 })
      );
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [value, animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      <View style={[styles.dice, { width: size, height: size }]}>
        <Text variant="titleLarge" style={styles.value}>
          {value}
        </Text>
        <Text variant="labelSmall" style={styles.sides}>
          D{sides}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  dice: {
    backgroundColor: '#6200EE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  value: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sides: {
    color: '#fff',
    opacity: 0.7,
    fontSize: 10,
  },
});

export default DiceVisual;