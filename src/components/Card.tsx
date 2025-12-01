import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { getCurrentTheme, Theme } from '../utils/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  isDarkMode?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  borderRadius = 'md',
  shadow = 'sm',
  isDarkMode = false,
  style,
  onPress,
}) => {
  const theme = getCurrentTheme(isDarkMode);
  const styles = createStyles(theme);

  const getCardStyle = (): ViewStyle[] => {
    const baseStyle = [styles.card];
    
    switch (variant) {
      case 'elevated':
        baseStyle.push(styles.elevated);
        break;
      case 'outlined':
        baseStyle.push(styles.outlined);
        break;
      case 'filled':
        baseStyle.push(styles.filled);
        break;
      default:
        baseStyle.push(styles.default);
    }

    switch (padding) {
      case 'none':
        baseStyle.push(styles.paddingNone);
        break;
      case 'sm':
        baseStyle.push(styles.paddingSm);
        break;
      case 'lg':
        baseStyle.push(styles.paddingLg);
        break;
      default:
        baseStyle.push(styles.paddingMd);
    }

    switch (borderRadius) {
      case 'none':
        baseStyle.push(styles.borderRadiusNone);
        break;
      case 'sm':
        baseStyle.push(styles.borderRadiusSm);
        break;
      case 'lg':
        baseStyle.push(styles.borderRadiusLg);
        break;
      default:
        baseStyle.push(styles.borderRadiusMd);
    }

    switch (shadow) {
      case 'none':
        break;
      case 'sm':
        baseStyle.push(theme.shadows.sm);
        break;
      case 'md':
        baseStyle.push(theme.shadows.md);
        break;
      case 'lg':
        baseStyle.push(theme.shadows.lg);
        break;
      case 'xl':
        baseStyle.push(theme.shadows.xl);
        break;
    }

    baseStyle.push(style as ViewStyle);
    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={getCardStyle()}>{children}</View>;
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      overflow: 'hidden',
    },
    default: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    elevated: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    filled: {
      backgroundColor: theme.colors.primary + '10', // 10% opacity
      borderWidth: 1,
      borderColor: theme.colors.primary + '30', // 30% opacity
    },
    paddingNone: {
      padding: 0,
    },
    paddingSm: {
      padding: theme.spacing.sm,
    },
    paddingMd: {
      padding: theme.spacing.md,
    },
    paddingLg: {
      padding: theme.spacing.lg,
    },
    borderRadiusNone: {
      borderRadius: 0,
    },
    borderRadiusSm: {
      borderRadius: theme.borderRadius.sm,
    },
    borderRadiusMd: {
      borderRadius: theme.borderRadius.md,
    },
    borderRadiusLg: {
      borderRadius: theme.borderRadius.lg,
    },
  });