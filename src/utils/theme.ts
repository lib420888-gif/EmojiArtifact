export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textDisabled: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
    // Light/Dark mode specific
    primaryLight: string;
    primaryDark: string;
    backgroundLight: string;
    backgroundDark: string;
    surfaceLight: string;
    surfaceDark: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
    xl: object;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#6366F1', // Indigo 500
    secondary: '#8B5CF6', // Violet 500
    background: '#FFFFFF',
    surface: '#F9FAFB', // Gray 50
    text: '#111827', // Gray 900
    textSecondary: '#6B7280', // Gray 500
    textDisabled: '#9CA3AF', // Gray 400
    border: '#E5E7EB', // Gray 200
    error: '#EF4444', // Red 500
    warning: '#F59E0B', // Amber 500
    success: '#10B981', // Emerald 500
    info: '#3B82F6', // Blue 500
    primaryLight: '#A5B4FC', // Indigo 300
    primaryDark: '#4338CA', // Indigo 700
    backgroundLight: '#F9FAFB',
    backgroundDark: '#F3F4F6',
    surfaceLight: '#FFFFFF',
    surfaceDark: '#F9FAFB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.2,
      shadowRadius: 25,
      elevation: 12,
    },
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#818CF8', // Indigo 400
    secondary: '#A78BFA', // Violet 400
    background: '#111827', // Gray 900
    surface: '#1F2937', // Gray 800
    text: '#F9FAFB', // Gray 50
    textSecondary: '#D1D5DB', // Gray 300
    textDisabled: '#9CA3AF', // Gray 400
    border: '#374151', // Gray 700
    error: '#F87171', // Red 400
    warning: '#FBBF24', // Amber 400
    success: '#34D399', // Emerald 400
    info: '#60A5FA', // Blue 400
    primaryLight: '#A5B4FC', // Indigo 300
    primaryDark: '#4338CA', // Indigo 700
    backgroundLight: '#1F2937',
    backgroundDark: '#0F172A',
    surfaceLight: '#374151',
    surfaceDark: '#1F2937',
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography,
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.6,
      shadowRadius: 25,
      elevation: 12,
    },
  },
};

// GDPR compliant theme colors
export const gdprColors = {
  consent: {
    background: '#F0F9FF', // Light blue
    text: '#1E40AF', // Blue 800
    button: '#3B82F6', // Blue 500
  },
  privacy: {
    background: '#FDF2F8', // Light pink
    text: '#BE185D', // Pink 800
    button: '#EC4899', // Pink 500
  },
  dataControl: {
    background: '#F0FDF4', // Light green
    text: '#166534', // Green 800
    button: '#22C55E', // Green 500
  },
};

// Export type for use in components
export type ThemeType = typeof lightTheme;

// Helper function to get current theme based on appearance
export const getCurrentTheme = (isDarkMode: boolean): Theme => {
  return isDarkMode ? darkTheme : lightTheme;
};