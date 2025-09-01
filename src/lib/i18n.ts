import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';

const messages = {
  en: enMessages,
  ar: arMessages,
};

export type Locale = keyof typeof messages;

export function getMessages(locale: Locale) {
  return messages[locale] || messages.en;
}

export function t(key: string, locale: Locale): string {
  const msgs = getMessages(locale);
  return key.split('.').reduce((obj: any, k) => obj?.[k], msgs) || key;
}