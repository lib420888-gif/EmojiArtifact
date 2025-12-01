import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import es from './translations/es.json';
import it from './translations/it.json';

const i18n = new I18n({
  en,
  fr,
  de,
  es,
  it,
});

i18n.locale = Localization.locale || 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const t = (key: string, params?: Record<string, any>) => {
  return i18n.t(key, params);
};

export const changeLanguage = (language: string) => {
  i18n.locale = language;
};

export const getCurrentLanguage = () => i18n.locale;

export default i18n;