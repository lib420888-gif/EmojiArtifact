import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getCurrentTheme } from '../utils/theme';
import { t } from '../localization/i18n';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { emojiGenerationService } from '../services/emojiGeneration';
import { useAuth } from '../hooks/useAuth';

const GenerateScreen = () => {
  const theme = getCurrentTheme();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cartoon');
  const [category, setCategory] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmoji, setGeneratedEmoji] = useState<string | null>(null);

  const styles = ['cartoon', 'realistic', 'minimalist', 'detailed'];
  const categories = ['general', 'emotions', 'animals', 'food', 'nature', 'objects'];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert(t('common.error'), t('generate.emptyPrompt'));
      return;
    }

    if (!user) {
      Alert.alert(t('common.error'), t('generate.needLogin'));
      return;
    }

    setIsGenerating(true);
    try {
      const result = await emojiGenerationService.generateEmoji(
        prompt,
        style,
        category,
        user.id
      );

      if (result) {
        setGeneratedEmoji(result.url);
        Alert.alert(t('common.success'), t('generate.success'));
      } else {
        Alert.alert(t('common.error'), t('generate.failed'));
      }
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert(t('common.error'), t('generate.error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (generatedEmoji) {
      Alert.alert(t('common.success'), t('generate.saved'));
    }
  };

  const handleShare = async () => {
    if (generatedEmoji) {
      // 这里可以集成分享功能
      Alert.alert(t('common.info'), t('generate.shareComingSoon'));
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {t('generate.title')}
        </Text>
        
        <Card style={styles.card} isDarkMode={theme.isDark}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            {t('generate.promptLabel')}
          </Text>
          <Input
            placeholder={t('generate.promptPlaceholder')}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={3}
            isDarkMode={theme.isDark}
            style={styles.input}
          />
        </Card>

        <Card style={styles.card} isDarkMode={theme.isDark}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            {t('generate.styleLabel')}
          </Text>
          <View style={styles.buttonGroup}>
            {styles.map((s) => (
              <Button
                key={s}
                title={t(`generate.style.${s}`)}
                variant={style === s ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setStyle(s)}
                isDarkMode={theme.isDark}
                style={styles.optionButton}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.card} isDarkMode={theme.isDark}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            {t('generate.categoryLabel')}
          </Text>
          <View style={styles.buttonGroup}>
            {categories.map((cat) => (
              <Button
                key={cat}
                title={t(`generate.category.${cat}`)}
                variant={category === cat ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setCategory(cat)}
                isDarkMode={theme.isDark}
                style={styles.optionButton}
              />
            ))}
          </View>
        </Card>

        <Button
          title={isGenerating ? t('generate.generating') : t('generate.generateButton')}
          variant="primary"
          size="lg"
          onPress={handleGenerate}
          loading={isGenerating}
          disabled={!prompt.trim() || !user}
          isDarkMode={theme.isDark}
          style={styles.generateButton}
        />

        {generatedEmoji && (
          <Card style={styles.resultCard} isDarkMode={theme.isDark}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              {t('generate.result')}
            </Text>
            {/* 这里需要添加图片显示组件 */}
            <View style={styles.resultActions}>
              <Button
                title={t('generate.save')}
                variant="secondary"
                onPress={handleSave}
                isDarkMode={theme.isDark}
                style={styles.actionButton}
              />
              <Button
                title={t('generate.share')}
                variant="outline"
                onPress={handleShare}
                isDarkMode={theme.isDark}
                style={styles.actionButton}
              />
            </View>
          </Card>
        )}

        <Card style={styles.tipsCard} isDarkMode={theme.isDark}>
          <Text style={[styles.tipsTitle, { color: theme.colors.text.primary }]}>
            {t('generate.tips.title')}
          </Text>
          <Text style={[styles.tipsText, { color: theme.colors.text.secondary }]}>
            {t('generate.tips.content')}
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  generateButton: {
    marginVertical: 24,
  },
  resultCard: {
    marginBottom: 16,
    padding: 16,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  tipsCard: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GenerateScreen;