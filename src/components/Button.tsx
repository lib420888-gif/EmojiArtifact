import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { getCurrentTheme, Theme } from '../utils/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isDarkMode?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  isDarkMode = false,
  style,
  ...props
}) => {
  const theme = getCurrentTheme(isDarkMode);
  const styles = createStyles(theme);

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = [styles.button];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
    }

    switch (size) {
      case 'sm':
        baseStyle.push(styles.buttonSm);
        break;
      case 'lg':
        baseStyle.push(styles.buttonLg);
        break;
      default:
        baseStyle.push(styles.buttonMd);
    }

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }

    baseStyle.push(style as ViewStyle);
    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle = [styles.text];
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        baseStyle.push(styles.textLight);
        break;
      case 'outline':
        baseStyle.push(styles.textPrimary);
        break;
      case 'ghost':
        baseStyle.push(styles.textPrimary);
        break;
    }

    switch (size) {
      case 'sm':
        baseStyle.push(styles.textSm);
        break;
      case 'lg':
        baseStyle.push(styles.textLg);
        break;
      default:
        baseStyle.push(styles.textMd);
    }

    if (disabled || loading) {
      baseStyle.push(styles.textDisabled);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    buttonSm: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 32,
    },
    buttonMd: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 44,
    },
    buttonLg: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: 56,
    },
    fullWidth: {
      width: '100%',
    },
    disabled: {
      opacity: 0.6,
    },
    text: {
      fontFamily: theme.typography.fontFamily.medium,
      textAlign: 'center',
    },
    textLight: {
      color: '#FFFFFF',
    },
    textPrimary: {
      color: theme.colors.primary,
    },
    textSm: {
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.tight,
    },
    textMd: {
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.normal,
    },
    textLg: {
      fontSize: theme.typography.fontSize.lg,
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    textDisabled: {
      color: theme.colors.textDisabled,
    },
  });