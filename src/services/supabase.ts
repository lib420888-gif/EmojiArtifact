import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// 从Expo配置中获取Supabase配置
const expoConfig = Constants.expoConfig?.extra?.expoConfig;
const SUPABASE_URL = expoConfig?.supabaseUrl || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = expoConfig?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase configuration:', { SUPABASE_URL: !!SUPABASE_URL, SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY });
  throw new Error('Missing Supabase environment variables. Please check your app.config.ts and .env file.');
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      emojis: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          image_url: string;
          style: string;
          is_public: boolean;
          likes_count: number;
          downloads_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          image_url: string;
          style: string;
          is_public?: boolean;
          likes_count?: number;
          downloads_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt?: string;
          image_url?: string;
          style?: string;
          is_public?: boolean;
          likes_count?: number;
          downloads_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          emoji_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          emoji_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          emoji_id?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});