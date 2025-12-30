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

interface CoinFlipProps {
  result: 'heads' | 'tails' | null;
  isFlipping: boolean;
  size?: number;
}

const CoinFlip: React.FC<CoinFlipProps> = ({ result, isFlipping, size = 150 }) => {
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFlipping) {
      rotateY.value = withSequence(
        withTiming(1800, { duration: 1000, easing: Easing.ease }),
        withTiming(result === 'tails' ? 180 : 0, { duration: 0 })
      );
      scale.value = withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );
    }
  }, [isFlipping, result]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      <View style={[styles.coin, { width: size, height: size }]}>
        <Text variant="displaySmall" style={styles.text}>
          {result === 'heads' ? '👑' : result === 'tails' ? '🔢' : '🪙'}
        </Text>
        <Text variant="labelLarge" style={styles.label}>
          {result ? result.toUpperCase() : 'FLIP'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coin: {
    backgroundColor: '#FFD700',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 4,
    borderColor: '#FFA500',
  },
  text: {
    fontSize: 50,
  },
  label: {
    color: '#000',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default CoinFlip;