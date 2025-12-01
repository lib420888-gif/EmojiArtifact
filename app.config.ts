import 'dotenv/config';

export default {
  name: 'EmojiArtifact',
  version: '1.0.0',
  slug: 'emoji-artifact',
  scheme: 'emoji-artifact',
  platforms: ['ios', 'android', 'web'],
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    expoConfig: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      geminiProxyUrl: process.env.GEMINI_PROXY_URL || 'https://your-proxy-url.vercel.app/api/gemini-generate-emoji'
    }
  }
};