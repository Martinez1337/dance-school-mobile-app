import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ScrollIndicator = ({ data, scrollX, itemWidth }) => {
  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [
          (i - 1) * itemWidth,
          i * itemWidth,
          (i + 1) * itemWidth,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={`dot-${i}`}
            style={[
              styles.dot,
              {
                transform: [{ scale }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d903e4',
    marginHorizontal: 4,
  },
});

export default ScrollIndicator;
 