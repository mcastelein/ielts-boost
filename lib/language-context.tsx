"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Locale, t as translate, type TranslationKey } from "@/lib/translations";

interface LanguageContextValue {
  locale: Locale;
  feedbackLocale: Locale;
  setLocale: (locale: Locale) => void;
  setFeedbackLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const UI_LANG_KEY = "ieltsboost_ui_lang";
const FEEDBACK_LANG_KEY = "ieltsboost_feedback_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [feedbackLocale, setFeedbackLocaleState] = useState<Locale>("zh");
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUI = localStorage.getItem(UI_LANG_KEY) as Locale | null;
    const storedFeedback = localStorage.getItem(FEEDBACK_LANG_KEY) as Locale | null;
    if (storedUI === "en" || storedUI === "zh") setLocaleState(storedUI);
    if (storedFeedback === "en" || storedFeedback === "zh") setFeedbackLocaleState(storedFeedback);
    setLoaded(true);
  }, []);

  // Sync to localStorage and DB when changed
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(UI_LANG_KEY, newLocale);
    // Update html lang attribute
    document.documentElement.lang = newLocale === "zh" ? "zh-CN" : "en";
    // Sync to DB for authenticated users
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from("user_settings")
          .update({ ui_language: newLocale })
          .eq("user_id", data.user.id)
          .then(() => {});
      }
    });
  }, []);

  const setFeedbackLocale = useCallback((newLocale: Locale) => {
    setFeedbackLocaleState(newLocale);
    localStorage.setItem(FEEDBACK_LANG_KEY, newLocale);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from("user_settings")
          .update({ feedback_language: newLocale })
          .eq("user_id", data.user.id)
          .then(() => {});
      }
    });
  }, []);

  // Set html lang on initial load
  useEffect(() => {
    if (loaded) {
      document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    }
  }, [loaded, locale]);

  const t = useCallback(
    (key: TranslationKey) => translate(key, locale),
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{ locale, feedbackLocale, setLocale, setFeedbackLocale, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
