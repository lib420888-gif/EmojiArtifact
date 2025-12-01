import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { userProfileService } from '../services/userProfile';
import { emojiManagementService } from '../services/emojiManagement';
import { supabase } from '../services/supabase';
import { getCurrentTheme } from '../theme/theme';

interface UserStats {
  totalEmojis: number;
  totalLikes: number;
  followersCount: number;
  followingCount: number;
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const theme = getCurrentTheme();

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [userStats, userEmojis, followers, following] = await Promise.all([
        userProfileService.getUserStats(user.id),
        emojiManagementService.getUserEmojis(user.id),
        userProfileService.getFollowers(user.id),
        userProfileService.getFollowing(user.id),
      ]);

      setStats({
        totalEmojis: userEmojis.length,
        totalLikes: userEmojis.reduce((sum, emoji) => sum + emoji.likes_count, 0),
        followersCount: followers.length,
        followingCount: following.length,
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    // 简化的头像上传处理
    setUploadingAvatar(true);
    try {
      // 这里可以添加真实的图片选择逻辑
      Alert.alert(t('profile.avatarUpdated'), '', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Avatar upload failed:', error);
      Alert.alert(t('common.error'), t('profile.avatarUploadFailed'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logoutTitle'),
      t('profile.logoutMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              await supabase.auth.signOut();
            } catch (error) {
              console.error('Logout failed:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('profile.notLoggedIn')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAvatarUpload} disabled={uploadingAvatar}>
          <View style={styles.avatarContainer}>
            {user.user_metadata?.avatar_url ? (
              <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.avatarText}>
                  {user.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {uploadingAvatar && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {user.user_metadata?.full_name || user.email}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
          {user.email}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {stats?.totalEmojis || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t('profile.emojis')}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {stats?.totalLikes || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t('profile.likes')}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {stats?.followersCount || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t('profile.followers')}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {stats?.followingCount || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t('profile.following')}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {t('profile.editProfile')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {t('profile.myEmojis')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {t('profile.likedEmojis')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {t('profile.settings')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {t('profile.help')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={[styles.menuText, styles.logoutText]}>
            {t('profile.logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
  },
  logoutItem: {
    marginTop: 20,
  },
  logoutText: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
});