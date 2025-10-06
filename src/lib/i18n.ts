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

export function t(key: string, locale: Locale, values?: Record<string, string | number>): string {
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
  
  if (typeof result === 'string') {
    if (values) {
      return result.replace(/\{(\w+)\}/g, (match, key) => {
        return values[key] !== undefined ? String(values[key]) : match;
      });
    }
    return result;
  }

  return key;
}