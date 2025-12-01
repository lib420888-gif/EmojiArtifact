import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Wand2, Library, Users, User } from 'lucide-react-native';
import { View, Text } from 'react-native';

// Import pages
import HomeScreen from '../pages/HomeScreen';
import GenerateScreen from '../pages/GenerateScreen';
import LibraryScreen from '../pages/LibraryScreen';
import CommunityScreen from '../pages/CommunityScreen';
import ProfileScreen from '../pages/ProfileScreen';

// Import auth pages
import LoginScreen from '../pages/auth/LoginScreen';
import RegisterScreen from '../pages/auth/RegisterScreen';
import ForgotPasswordScreen from '../pages/auth/ForgotPasswordScreen';

// Import theme
import { getCurrentTheme } from '../utils/theme';
import { t } from '../localization/i18n';

// Define navigation types
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TabParamList = {
  Home: undefined;
  Generate: undefined;
  Library: undefined;
  Community: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab Navigator
const TabNavigator = () => {
  const theme = getCurrentTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          
          switch (route.name) {
            case 'Home':
              icon = <Home size={size} color={color} />;
              break;
            case 'Generate':
              icon = <Wand2 size={size} color={color} />;
              break;
            case 'Library':
              icon = <Library size={size} color={color} />;
              break;
            case 'Community':
              icon = <Users size={size} color={color} />;
              break;
            case 'Profile':
              icon = <User size={size} color={color} />;
              break;
          }
          
          return icon;
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.paper,
          borderTopColor: theme.colors.divider,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.background.paper,
          borderBottomColor: theme.colors.divider,
          borderBottomWidth: 1,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: t('navigation.home') }}
      />
      <Tab.Screen 
        name="Generate" 
        component={GenerateScreen} 
        options={{ title: t('navigation.generate') }}
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ title: t('navigation.library') }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen} 
        options={{ title: t('navigation.community') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: t('navigation.profile') }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const theme = getCurrentTheme();
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background.paper,
            borderBottomColor: theme.colors.divider,
            borderBottomWidth: 1,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          cardStyle: {
            backgroundColor: theme.colors.background.default,
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: t('auth.signIn') }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: t('auth.signUp') }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ title: t('common.resetPassword') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;