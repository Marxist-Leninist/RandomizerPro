import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

interface AnimatedNumberProps {
  value: number | string;
  variant?: 'displayLarge' | 'displayMedium' | 'displaySmall' | 'headlineLarge';
  color?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  variant = 'displayLarge',
  color = '#6200EE',
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 100 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text variant={variant} style={[styles.text, { color }]}>
        {value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

export default AnimatedNumber;