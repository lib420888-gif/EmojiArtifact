import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { getCurrentTheme, Theme } from '../utils/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  fullWidth?: boolean;
  isDarkMode?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'md',
  leftIcon,
  rightIcon,
  onRightIconPress,
  fullWidth = false,
  isDarkMode = false,
  containerStyle,
  labelStyle,
  inputStyle,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const theme = getCurrentTheme(isDarkMode);
  const styles = createStyles(theme);

  const isPassword = secureTextEntry;
  const shouldShowPasswordToggle = isPassword && !secureTextEntry;

  const getContainerStyle = (): ViewStyle[] => {
    const baseStyle = [styles.container];
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    baseStyle.push(containerStyle as ViewStyle);
    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle[] => {
    const baseStyle = [styles.inputContainer];
    
    switch (variant) {
      case 'outlined':
        baseStyle.push(styles.outlined);
        if (isFocused) {
          baseStyle.push(styles.outlinedFocused);
        }
        if (error) {
          baseStyle.push(styles.outlinedError);
        }
        break;
      case 'filled':
        baseStyle.push(styles.filled);
        if (isFocused) {
          baseStyle.push(styles.filledFocused);
        }
        if (error) {
          baseStyle.push(styles.filledError);
        }
        break;
      case 'standard':
        baseStyle.push(styles.standard);
        if (isFocused) {
          baseStyle.push(styles.standardFocused);
        }
        if (error) {
          baseStyle.push(styles.standardError);
        }
        break;
    }

    switch (size) {
      case 'sm':
        baseStyle.push(styles.inputContainerSm);
        break;
      case 'lg':
        baseStyle.push(styles.inputContainerLg);
        break;
      default:
        baseStyle.push(styles.inputContainerMd);
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle[] => {
    const baseStyle = [styles.input];
    
    switch (size) {
      case 'sm':
        baseStyle.push(styles.inputSm);
        break;
      case 'lg':
        baseStyle.push(styles.inputLg);
        break;
      default:
        baseStyle.push(styles.inputMd);
    }

    baseStyle.push(inputStyle as TextStyle);
    return baseStyle;
  };

  const getLabelStyle = (): TextStyle[] => {
    const baseStyle = [styles.label];
    if (isFocused) {
      baseStyle.push(styles.labelFocused);
    }
    if (error) {
      baseStyle.push(styles.labelError);
    }
    baseStyle.push(labelStyle as TextStyle);
    return baseStyle;
  };

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getRightIcon = () => {
    if (isPassword && !rightIcon) {
      return (
        <TouchableOpacity
          onPress={handlePasswordToggle}
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>
            {isPasswordVisible ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      );
    }
    
    if (rightIcon && onRightIconPress) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.iconButton}
        >
          {rightIcon}
        </TouchableOpacity>
      );
    }

    return rightIcon;
  };

  return (
    <View style={getContainerStyle()}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={getInputStyle()}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {getRightIcon() && (
          <View style={styles.rightIcon}>
            {getRightIcon()}
          </View>
        )}
      </View>

      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            error ? styles.helperTextError : styles.helperTextDefault,
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    fullWidth: {
      width: '100%',
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    labelFocused: {
      color: theme.colors.primary,
    },
    labelError: {
      color: theme.colors.error,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
    },
    inputContainerSm: {
      minHeight: 40,
    },
    inputContainerMd: {
      minHeight: 48,
    },
    inputContainerLg: {
      minHeight: 56,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
    },
    outlinedFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    outlinedError: {
      borderColor: theme.colors.error,
      borderWidth: 2,
    },
    filled: {
      backgroundColor: theme.colors.surface,
      borderColor: 'transparent',
    },
    filledFocused: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
    },
    filledError: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.error,
    },
    standard: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderBottomColor: theme.colors.border,
      borderRadius: 0,
    },
    standardFocused: {
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: 2,
    },
    standardError: {
      borderBottomColor: theme.colors.error,
      borderBottomWidth: 2,
    },
    input: {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
    },
    inputSm: {
      fontSize: theme.typography.fontSize.sm,
      paddingHorizontal: theme.spacing.sm,
    },
    inputLg: {
      fontSize: theme.typography.fontSize.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    leftIcon: {
      marginLeft: theme.spacing.md,
      marginRight: theme.spacing.xs,
    },
    rightIcon: {
      marginRight: theme.spacing.md,
      marginLeft: theme.spacing.xs,
    },
    iconButton: {
      padding: theme.spacing.xs,
    },
    iconText: {
      fontSize: theme.typography.fontSize.md,
    },
    helperText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      marginTop: theme.spacing.xs,
    },
    helperTextDefault: {
      color: theme.colors.textSecondary,
    },
    helperTextError: {
      color: theme.colors.error,
    },
  });