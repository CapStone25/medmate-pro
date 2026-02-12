import { useState, useEffect, useCallback, useRef } from "react";
import { Medicine } from "@/types";
import { useSettings } from "@/contexts/SettingsContext";

// In-memory cache: lang -> medicineId -> translated fields
const translationCache = new Map<string, Map<string, TranslatedFields>>();

interface TranslatedFields {
  name: string;
  generic_name: string;
  description: string;
  dosage: string;
  manufacturer: string;
  category: string;
  side_effects: string[];
  active_ingredient: string | null;
  form: string | null;
}

function getOriginalFields(m: Medicine): TranslatedFields {
  return {
    name: m.name,
    generic_name: m.generic_name,
    description: m.description,
    dosage: m.dosage,
    manufacturer: m.manufacturer,
    category: m.category,
    side_effects: m.side_effects,
    active_ingredient: m.active_ingredient || null,
    form: m.form || null,
  };
}

export function useTranslatedMedicine(medicine: Medicine | null) {
  const { language } = useSettings();
  const [translated, setTranslated] = useState<TranslatedFields | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!medicine) return;

    if (language === "en") {
      setTranslated(getOriginalFields(medicine));
      return;
    }

    // Check cache
    const langCache = translationCache.get(language);
    if (langCache?.has(medicine.id)) {
      setTranslated(langCache.get(medicine.id)!);
      return;
    }

    const translate = async () => {
      setLoading(true);
      try {
        const textsToTranslate = {
          name: medicine.name,
          generic_name: medicine.generic_name,
          description: medicine.description,
          dosage: medicine.dosage,
          manufacturer: medicine.manufacturer,
          category: medicine.category,
          side_effects: medicine.side_effects.join(" | "),
          active_ingredient: medicine.active_ingredient || "",
          form: medicine.form || "",
        };

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ texts: textsToTranslate, targetLang: language }),
          }
        );

        const data = await response.json();
        const t = data.translations || textsToTranslate;

        const result: TranslatedFields = {
          name: t.name || medicine.name,
          generic_name: t.generic_name || medicine.generic_name,
          description: t.description || medicine.description,
          dosage: t.dosage || medicine.dosage,
          manufacturer: t.manufacturer || medicine.manufacturer,
          category: t.category || medicine.category,
          side_effects: typeof t.side_effects === "string" 
            ? t.side_effects.split(" | ").map((s: string) => s.trim()).filter(Boolean)
            : medicine.side_effects,
          active_ingredient: t.active_ingredient || medicine.active_ingredient,
          form: t.form || medicine.form,
        };

        // Cache
        if (!translationCache.has(language)) translationCache.set(language, new Map());
        translationCache.get(language)!.set(medicine.id, result);

        setTranslated(result);
      } catch (e) {
        console.error("Translation error:", e);
        setTranslated(getOriginalFields(medicine));
      } finally {
        setLoading(false);
      }
    };

    translate();
  }, [medicine, language]);

  return { translated, loading };
}

// Batch translation for lists (e.g. medicine cards)
export function useTranslatedMedicines(medicines: Medicine[]) {
  const { language } = useSettings();
  const [translatedMap, setTranslatedMap] = useState<Map<string, TranslatedFields>>(new Map());
  const [loading, setLoading] = useState(false);
  const prevKey = useRef("");

  useEffect(() => {
    if (medicines.length === 0) return;

    const key = `${language}-${medicines.map(m => m.id).join(",")}`;
    if (key === prevKey.current) return;
    prevKey.current = key;

    if (language === "en") {
      const map = new Map<string, TranslatedFields>();
      medicines.forEach(m => map.set(m.id, getOriginalFields(m)));
      setTranslatedMap(map);
      return;
    }

    // Check if all are cached
    const langCache = translationCache.get(language);
    const uncached = medicines.filter(m => !langCache?.has(m.id));

    if (uncached.length === 0 && langCache) {
      const map = new Map<string, TranslatedFields>();
      medicines.forEach(m => map.set(m.id, langCache.get(m.id)!));
      setTranslatedMap(map);
      return;
    }

    // Fill with originals first, then translate in background
    const map = new Map<string, TranslatedFields>();
    medicines.forEach(m => {
      const cached = langCache?.get(m.id);
      map.set(m.id, cached || getOriginalFields(m));
    });
    setTranslatedMap(map);

    if (uncached.length === 0) return;

    const translateBatch = async () => {
      setLoading(true);
      // Translate in chunks of 5
      const chunks = [];
      for (let i = 0; i < uncached.length; i += 5) {
        chunks.push(uncached.slice(i, i + 5));
      }

      for (const chunk of chunks) {
        const batchTexts: Record<string, any> = {};
        chunk.forEach(m => {
          batchTexts[m.id] = {
            name: m.name,
            generic_name: m.generic_name,
            description: m.description,
            dosage: m.dosage,
            manufacturer: m.manufacturer,
            category: m.category,
            side_effects: m.side_effects.join(" | "),
            active_ingredient: m.active_ingredient || "",
            form: m.form || "",
          };
        });

        try {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({ texts: batchTexts, targetLang: language }),
            }
          );

          const data = await response.json();
          const translations = data.translations || batchTexts;

          if (!translationCache.has(language)) translationCache.set(language, new Map());
          const lc = translationCache.get(language)!;

          setTranslatedMap(prev => {
            const next = new Map(prev);
            Object.entries(translations).forEach(([id, t]: [string, any]) => {
              const original = chunk.find(m => m.id === id);
              if (!original) return;
              const result: TranslatedFields = {
                name: t.name || original.name,
                generic_name: t.generic_name || original.generic_name,
                description: t.description || original.description,
                dosage: t.dosage || original.dosage,
                manufacturer: t.manufacturer || original.manufacturer,
                category: t.category || original.category,
                side_effects: typeof t.side_effects === "string"
                  ? t.side_effects.split(" | ").map((s: string) => s.trim()).filter(Boolean)
                  : original.side_effects,
                active_ingredient: t.active_ingredient || original.active_ingredient,
                form: t.form || original.form,
              };
              lc.set(id, result);
              next.set(id, result);
            });
            return next;
          });
        } catch (e) {
          console.error("Batch translation error:", e);
        }
      }
      setLoading(false);
    };

    translateBatch();
  }, [medicines, language]);

  const getTranslated = useCallback(
    (id: string) => translatedMap.get(id),
    [translatedMap]
  );

  return { getTranslated, loading };
}
