import {
    Easing,
    Extrapolate,
    interpolate,
    SharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

// Spring configurations
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const gentleSpringConfig = {
  damping: 20,
  stiffness: 100,
  mass: 1,
};

export const bouncySpringConfig = {
  damping: 10,
  stiffness: 200,
  mass: 0.8,
};

// Timing configurations
export const timingConfig = {
  duration: 300,
  easing: Easing.out(Easing.cubic),
};

export const fastTimingConfig = {
  duration: 150,
  easing: Easing.out(Easing.quad),
};

export const slowTimingConfig = {
  duration: 500,
  easing: Easing.out(Easing.cubic),
};

// Common animation functions
export const fadeIn = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withTiming(1, timingConfig)
  );
};

export const fadeOut = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withTiming(0, timingConfig)
  );
};

export const slideInFromBottom = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withSpring(0, springConfig)
  );
};

export const slideOutToBottom = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withSpring(100, springConfig)
  );
};

export const slideInFromRight = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withSpring(0, springConfig)
  );
};

export const slideOutToRight = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withSpring(-100, springConfig)
  );
};

export const scaleIn = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withSpring(1, bouncySpringConfig)
  );
};

export const scaleOut = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withTiming(0, fastTimingConfig)
  );
};

export const bounceIn = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withSequence(
      withTiming(1.2, { duration: 200, easing: Easing.out(Easing.quad) }),
      withSpring(1, bouncySpringConfig)
    )
  );
};

export const shake = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    )
  );
};

export const pulse = (value: SharedValue<number>, delay: number = 0) => {
  return withDelay(
    delay,
    withSequence(
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 }),
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 })
    )
  );
};

// Interpolation helpers
export const createOpacityInterpolation = (value: SharedValue<number>) => {
  return interpolate(
    value.value,
    [0, 1],
    [0, 1],
    Extrapolate.CLAMP
  );
};

export const createScaleInterpolation = (value: SharedValue<number>) => {
  return interpolate(
    value.value,
    [0, 1],
    [0.8, 1],
    Extrapolate.CLAMP
  );
};

export const createTranslateYInterpolation = (value: SharedValue<number>) => {
  return interpolate(
    value.value,
    [0, 1],
    [50, 0],
    Extrapolate.CLAMP
  );
};

export const createTranslateXInterpolation = (value: SharedValue<number>) => {
  return interpolate(
    value.value,
    [0, 1],
    [-50, 0],
    Extrapolate.CLAMP
  );
};

// Stagger animations
export const staggerAnimation = (
  values: SharedValue<number>[],
  staggerDelay: number = 100
) => {
  values.forEach((value, index) => {
    value.value = withDelay(
      index * staggerDelay,
      withSpring(1, springConfig)
    );
  });
};

// Success animation sequence
export const successAnimation = (value: SharedValue<number>) => {
  return withSequence(
    withTiming(1.2, { duration: 200 }),
    withSpring(1, bouncySpringConfig)
  );
};

// Error animation sequence
export const errorAnimation = (value: SharedValue<number>) => {
  return withSequence(
    withTiming(-5, { duration: 100 }),
    withTiming(5, { duration: 100 }),
    withTiming(-5, { duration: 100 }),
    withTiming(5, { duration: 100 }),
    withTiming(0, { duration: 100 })
  );
};

// Loading animation
export const loadingAnimation = (value: SharedValue<number>) => {
  return withTiming(1, {
    duration: 1000,
    easing: Easing.inOut(Easing.ease),
  });
};

// Card flip animation
export const flipCard = (value: SharedValue<number>) => {
  return withSequence(
    withTiming(0.5, { duration: 150 }),
    withTiming(1, { duration: 150 })
  );
};

// Page transition animations
export const pageTransitionIn = (value: SharedValue<number>) => {
  return withSpring(0, springConfig);
};

export const pageTransitionOut = (value: SharedValue<number>) => {
  return withTiming(-100, timingConfig);
};

// Button press animation
export const buttonPress = (value: SharedValue<number>) => {
  return withSequence(
    withTiming(0.95, { duration: 100 }),
    withSpring(1, gentleSpringConfig)
  );
};

// List item animations
export const listItemEnter = (value: SharedValue<number>, index: number) => {
  return withDelay(
    index * 50,
    withSpring(1, springConfig)
  );
};

export const listItemExit = (value: SharedValue<number>) => {
  return withTiming(0, fastTimingConfig);
};

// Modal animations
export const modalEnter = (value: SharedValue<number>) => {
  return withSpring(1, springConfig);
};

export const modalExit = (value: SharedValue<number>) => {
  return withTiming(0, timingConfig);
};

// Tab bar animations
export const tabBarSlide = (value: SharedValue<number>, direction: 'left' | 'right') => {
  const translateX = direction === 'left' ? -100 : 100;
  return withSpring(translateX, springConfig);
};

// Progress bar animation
export const progressAnimation = (value: SharedValue<number>, target: number) => {
  return withTiming(target, {
    duration: 800,
    easing: Easing.out(Easing.cubic),
  });
};

// Notification slide in
export const notificationSlideIn = (value: SharedValue<number>) => {
  return withSpring(0, springConfig);
};

export const notificationSlideOut = (value: SharedValue<number>) => {
  return withTiming(-100, timingConfig);
};
