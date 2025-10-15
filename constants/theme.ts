import type { MD3Theme } from 'react-native-paper';
import { MD3LightTheme, configureFonts } from 'react-native-paper';

// Custom font configuration
const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: -0.25,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

// LoanTrack Light Theme
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors - Blue palette
    primary: '#2196F3',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E3F2FD',
    onPrimaryContainer: '#0D47A1',
    
    // Secondary colors - Light blue
    secondary: '#64B5F6',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E1F5FE',
    onSecondaryContainer: '#01579B',
    
    // Tertiary colors - Gray
    tertiary: '#90A4AE',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#ECEFF1',
    onTertiaryContainer: '#263238',
    
    // Error colors
    error: '#F44336',
    onError: '#FFFFFF',
    errorContainer: '#FFEBEE',
    onErrorContainer: '#B71C1C',
    
    // Background colors
    background: '#FFFFFF',
    onBackground: '#212121',
    surface: '#FFFFFF',
    onSurface: '#212121',
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: '#424242',
    
    // Outline colors
    outline: '#BDBDBD',
    outlineVariant: '#E0E0E0',
    
    // Shadow
    shadow: '#000000',
    scrim: '#000000',
    
    // Surface tint (removed as it's not part of MD3Colors)
    
    // Inverse colors
    inverseSurface: '#303030',
    inversePrimary: '#90CAF9',
  },
  roundness: 8,
};

// Status colors for loan states
export const statusColors = {
  pending: '#FF9800',
  approved: '#4CAF50',
  rejected: '#F44336',
  clarification: '#FF5722',
  draft: '#9E9E9E',
};

// Additional theme utilities
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Color utilities
export const Colors = {
  primary: '#2196F3',
  secondary: '#64B5F6',
  tertiary: '#90A4AE',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#424242',
  border: '#E0E0E0',
  disabled: '#9E9E9E',
  light: '#FFFFFF',
  dark: '#212121',
};

// Font utilities
export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  rounded: 'System',
  mono: 'System',
};

export default lightTheme;