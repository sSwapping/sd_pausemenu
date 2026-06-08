import i18next from "i18next";
import { initReactI18next } from "react-i18next";

type Locales = Record<string, unknown>;

export const initLocales = async (): Promise<void> => {
  try {
    const response = await fetch("locales.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch locales.json: ${response.status}`);
    }

    const rawLocales = await response.text();
    const locales: Locales = rawLocales.trim()
      ? (JSON.parse(rawLocales) as Locales)
      : {};

    await i18next.use(initReactI18next).init({
      resources: { en: { translation: locales } },
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
  } catch (error) {
    console.error("Failed to load locales:", error);
    await i18next.use(initReactI18next).init({
      resources: { en: { translation: {} } },
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
  }
};
