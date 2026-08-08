'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import th from '@/locales/th.json';
import en from '@/locales/en.json';

type Language = 'th' | 'en';

const translations: Record<Language, any> = { th, en };

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
  const pathname = usePathname();
  const router = useRouter();

  // Initialize lang state based on URL prefix first, then localStorage, then default 'th'
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    let initialLang: Language = 'th';

    if (currentPath.startsWith('/en')) {
      initialLang = 'en';
    } else if (currentPath.startsWith('/th')) {
      initialLang = 'th';
    } else {
      const savedLang = window.localStorage.getItem('lang') as Language | null;
      initialLang = savedLang === 'th' || savedLang === 'en' ? savedLang : 'th';
    }

    setLangState(initialLang);
    document.documentElement.lang = initialLang;
    document.documentElement.dir = 'ltr';
  }, []);

  // Synchronize state and URL prefix during pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    const hasTh = currentPath.startsWith('/th');
    const hasEn = currentPath.startsWith('/en');

    if (!hasTh && !hasEn) {
      // If client-side navigation leads to non-prefixed page, redirect/replace it
      const targetPath = `/${lang}${currentPath === '/' ? '' : currentPath}${window.location.search}`;
      window.history.replaceState(null, '', targetPath);
    } else {
      const currentLocale = hasTh ? 'th' : 'en';
      if (currentLocale !== lang) {
        setLangState(currentLocale);
        window.localStorage.setItem('lang', currentLocale);
      }
    }
  }, [pathname, lang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    window.localStorage.setItem('lang', lang);
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (newLang === 'en' && currentPath.startsWith('/th')) {
        window.location.href = currentPath.replace(/^\/th/, '/en') + window.location.search;
      } else if (newLang === 'th' && currentPath.startsWith('/en')) {
        window.location.href = currentPath.replace(/^\/en/, '/th') + window.location.search;
      }
    }
  };

  const toggleLanguage = () => {
    setIsSwitching(true);
    window.setTimeout(() => {
      const nextLang = lang === 'th' ? 'en' : 'th';
      setLangState(nextLang);
      setIsSwitching(false);

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/th')) {
          window.location.href = currentPath.replace(/^\/th/, '/en') + window.location.search;
        } else if (currentPath.startsWith('/en')) {
          window.location.href = currentPath.replace(/^\/en/, '/th') + window.location.search;
        } else {
          window.location.href = `/${nextLang}${currentPath === '/' ? '' : currentPath}${window.location.search}`;
        }
      }
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
