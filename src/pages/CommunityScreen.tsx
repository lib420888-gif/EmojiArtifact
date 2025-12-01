import React from 'react';
import { View, Text } from 'react-native';
import { getCurrentTheme } from '../utils/theme';
import { t } from '../localization/i18n';

const CommunityScreen = () => {
  const theme = getCurrentTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.default }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 24 }}>
        {t('community.title')}
      </Text>
    </View>
  );
};

export default CommunityScreen;