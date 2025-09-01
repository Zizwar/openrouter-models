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
  const keys = key.split('.');
  let result: unknown = msgs;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  return typeof result === 'string' ? result : key;
}