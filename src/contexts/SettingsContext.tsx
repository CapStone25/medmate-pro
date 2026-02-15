import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n";

export type ColorBlindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

interface SettingsContextType {
  theme: "light" | "dark";
  ttsEnabled: boolean;
  ttsAutoRead: boolean;
  colorBlindMode: ColorBlindMode;
  language: string;
  setTheme: (theme: "light" | "dark") => void;
  setTtsEnabled: (enabled: boolean) => void;
  setTtsAutoRead: (enabled: boolean) => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  setLanguage: (lang: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const colorBlindFilters: Record<ColorBlindMode, string> = {
  none: "none",
  protanopia: "url(#protanopia)",
  deuteranopia: "url(#deuteranopia)",
  tritanopia: "url(#tritanopia)",
  achromatopsia: "grayscale(100%)",
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("rxvault_theme");
    return (saved as "light" | "dark") || "light";
  });
  const [ttsEnabled, setTtsEnabledState] = useState(true);
  const [ttsAutoRead, setTtsAutoReadState] = useState(false);
  const [colorBlindMode, setColorBlindModeState] = useState<ColorBlindMode>("none");
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem("rxvault_language") || "en";
    // Normalize to 2-char code (e.g., "en-US" -> "en")
    return stored.split("-")[0].toLowerCase();
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("rxvault_theme", theme);
  }, [theme]);

  // Apply color blind filter
  useEffect(() => {
    const filter = colorBlindFilters[colorBlindMode];
    document.documentElement.style.filter = filter === "none" ? "" : filter;
  }, [colorBlindMode]);

  // Apply language direction (RTL for Arabic)
  useEffect(() => {
    const lang = languages.find(l => l.code === language);
    document.documentElement.dir = lang?.dir || "ltr";
    document.documentElement.lang = language;
    i18n.changeLanguage(language);
    localStorage.setItem("rxvault_language", language);
  }, [language, i18n]);

  // Load settings from DB
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const settings = data as any;
          setThemeState(settings.theme as "light" | "dark");
          setTtsEnabledState(settings.tts_enabled);
          setTtsAutoReadState(settings.tts_auto_read);
          setColorBlindModeState(settings.colorblind_mode as ColorBlindMode);
          if (settings.language) setLanguageState(settings.language);
        }
      });
  }, [isAuthenticated, user]);

  const saveSettings = useCallback(async (updates: Record<string, any>) => {
    if (!user) return;
    await supabase.from("user_settings").update(updates).eq("user_id", user.id);
  }, [user]);

  const setTheme = useCallback((t: "light" | "dark") => {
    setThemeState(t);
    saveSettings({ theme: t });
  }, [saveSettings]);

  const setTtsEnabled = useCallback((enabled: boolean) => {
    setTtsEnabledState(enabled);
    saveSettings({ tts_enabled: enabled });
  }, [saveSettings]);

  const setTtsAutoRead = useCallback((enabled: boolean) => {
    setTtsAutoReadState(enabled);
    saveSettings({ tts_auto_read: enabled });
  }, [saveSettings]);

  const setColorBlindMode = useCallback((mode: ColorBlindMode) => {
    setColorBlindModeState(mode);
    saveSettings({ colorblind_mode: mode });
  }, [saveSettings]);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    saveSettings({ language: lang });
  }, [saveSettings]);

  return (
    <SettingsContext.Provider value={{
      theme, ttsEnabled, ttsAutoRead, colorBlindMode, language,
      setTheme, setTtsEnabled, setTtsAutoRead, setColorBlindMode, setLanguage,
    }}>
      {/* SVG Filters for color blindness */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
