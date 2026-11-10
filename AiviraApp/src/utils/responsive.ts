import { Dimensions, PixelRatio, useWindowDimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Standard mobile baseline dimensions (iPhone 13/14/15 & standard modern Android 390 x 844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale horizontally based on standard screen width
 */
export const scale = (size: number): number => {
  const currentWidth = Dimensions.get('window').width;
  return (currentWidth / BASE_WIDTH) * size;
};

/**
 * Scale vertically based on standard screen height
 */
export const verticalScale = (size: number): number => {
  const currentHeight = Dimensions.get('window').height;
  return (currentHeight / BASE_HEIGHT) * size;
};

/**
 * Moderate scale with dampening factor (default 0.5)
 * Prevents elements from shrinking too small on compact phones or exploding on large devices.
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Responsive Font Size with accessibility and max limit protection
 */
export const rf = (fontSize: number, maxScale = 1.25): number => {
  const scaled = moderateScale(fontSize, 0.4);
  const fontScale = PixelRatio.getFontScale();
  const adjusted = scaled * Math.min(fontScale, maxScale);
  return Math.round(adjusted);
};

/**
 * Width percentage string/number
 */
export const wp = (percentage: number): number => {
  const currentWidth = Dimensions.get('window').width;
  return (percentage * currentWidth) / 100;
};

/**
 * Height percentage string/number
 */
export const hp = (percentage: number): number => {
  const currentHeight = Dimensions.get('window').height;
  return (percentage * currentHeight) / 100;
};

/**
 * Device size classification flags
 */
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 430;
export const isLargeDevice = SCREEN_WIDTH >= 430 && SCREEN_WIDTH < 768;
export const isTablet = SCREEN_WIDTH >= 768;

/**
 * Hook to react dynamically to orientation changes or foldables unfolding
 */
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 375;
  const isTabletDevice = width >= 768;

  const dynamicScale = (size: number) => (width / BASE_WIDTH) * size;
  const dynamicVerticalScale = (size: number) => (height / BASE_HEIGHT) * size;
  const dynamicModerateScale = (size: number, factor = 0.5) => size + (dynamicScale(size) - size) * factor;
  const dynamicRf = (size: number) => Math.round(dynamicModerateScale(size, 0.35));

  // Dynamic layout values
  const horizontalPadding = isSmall ? 14 : isTabletDevice ? 32 : 20;
  const cardRadius = isSmall ? 14 : isTabletDevice ? 24 : 18;
  const gridItemWidth = isTabletDevice ? '31%' : '48%';

  return {
    width,
    height,
    isSmall,
    isTablet: isTabletDevice,
    scale: dynamicScale,
    verticalScale: dynamicVerticalScale,
    moderateScale: dynamicModerateScale,
    rf: dynamicRf,
    horizontalPadding,
    cardRadius,
    gridItemWidth,
  };
};

