import React, { memo, useEffect } from 'react'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

interface SizeScaleProps {}

const SizeScaleAnimated: React.FC<React.PropsWithChildren<SizeScaleProps>> = ({ children }) => {
  const animValue = useSharedValue(0)
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(animValue.value, [0, 1], [0.5, 1]) }],
    opacity: interpolate(animValue.value, [0, 1], [0, 1]),
  }))
  useEffect(() => {
    animValue.value = withSpring(1, {
      duration: 330,
    })
  }, [])
  return <Animated.View style={scaleStyle}>{children}</Animated.View>
}

export default memo(SizeScaleAnimated)
