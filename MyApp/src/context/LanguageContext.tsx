import React, { createContext, useContext, useState, ReactNode } from 'react';
import translations, { Language } from '../i18n/translations';

interface LanguageContextType {
  lang:    Language;
  setLang: (l: Language) => void;
  t:       typeof translations['en'];   // typed to the EN shape (same as AZ)
}

const LanguageContext = createContext<LanguageContextType>({
  lang:    'en',
  setLang: () => {},
  t:       translations.en,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const value: LanguageContextType = {
    lang,
    setLang,
    t: translations[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
