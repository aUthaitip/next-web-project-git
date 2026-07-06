'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

type Language = 'th' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('th');
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedLang = window.localStorage.getItem('lang') as Language | null;
    const initialLang = savedLang === 'th' || savedLang === 'en' ? savedLang : 'th';

    setLangState(initialLang);
    document.documentElement.lang = initialLang;
    document.documentElement.dir = 'ltr';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    window.localStorage.setItem('lang', lang);
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLanguage = () => {
    setIsSwitching(true);
    window.setTimeout(() => {
      setLangState((prev) => (prev === 'th' ? 'en' : 'th'));
      setIsSwitching(false);
    }, 220);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[lang];
    
    for (const k of keys) {
      if (current === undefined || current[k] === undefined) {
        // Fallback to TH language value
        let fallback = translations['th'];
        for (const fk of keys) {
          if (fallback === undefined || fallback[fk] === undefined) return key;
          fallback = fallback[fk];
        }
        return typeof fallback === 'string' ? fallback : key;
      }
      current = current[k];
    }
    return typeof current === 'string' ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLang, t }}>
      {isSwitching && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0d9488]" />
        </div>
      )}
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
