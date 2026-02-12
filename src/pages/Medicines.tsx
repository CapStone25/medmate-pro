import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Medicine } from "@/types";
import { categories } from "@/utils/medicineImages";
import MedicineCard from "@/components/MedicineCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import usePageTitle from "@/hooks/usePageTitle";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useTranslation } from "react-i18next";
import { useTranslatedMedicines } from "@/hooks/useTranslatedMedicine";

const Medicines = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  usePageTitle(t("medicines.catalog"));

  useEffect(() => {
    const fetchMedicines = async () => {
      const { data, error } = await supabase.from("medicines").select("*").order("name");
      if (!error && data) setMedicines(data as unknown as Medicine[]);
      setLoading(false);
    };
    fetchMedicines();
  }, []);

  const { getTranslated, loading: translating } = useTranslatedMedicines(medicines);

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      const q = query.toLowerCase();
      const tr = getTranslated(m.id);
      const matchesQuery = query === "" ||
        m.name.toLowerCase().includes(q) ||
        m.generic_name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (tr?.name?.toLowerCase().includes(q)) ||
        (tr?.description?.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory, medicines, getTranslated]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && isAuthenticated && user) {
      await supabase.from("search_history").insert({
        user_id: user.id,
        query: query.trim(),
      } as any);
    }
  }, [query, isAuthenticated, user]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setSelectedCategory("All");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> {t("medicines.backToHome")}
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground mb-1 sm:mb-2">{t("medicines.catalog")}</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t("medicines.browsing", { count: medicines.length })}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-xl px-3 sm:px-4 py-2 self-start sm:self-auto">
                <Search className="w-4 h-4" />
                <span><span className="font-semibold text-foreground"><AnimatedCounter value={filteredMedicines.length} duration={0.5} /></span> {t("medicines.results")}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <div className="flex gap-2 sm:gap-3">
              <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
                <input type="text" placeholder={t("medicines.searchPlaceholder")}
                  value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
              </form>
              <Button variant="outline" className="rounded-xl gap-2 shrink-0 px-3 sm:px-4" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">{t("medicines.filters")}</span>
              </Button>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    {categories.map(cat => (
                      <motion.button key={cat} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCategory(cat)}
                        className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                          selectedCategory === cat ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                        }`}>
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="h-36 sm:h-48 bg-muted" />
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="h-4 sm:h-5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 sm:h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredMedicines.length > 0 ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {filteredMedicines.map((medicine, i) => (
                    <MedicineCard
                      key={medicine.id}
                      medicine={medicine}
                      index={i}
                      translated={getTranslated(medicine.id)}
                      translating={translating}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center py-16 sm:py-20">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4 sm:mb-6 text-3xl sm:text-4xl">🔍</div>
                  <h3 className="text-lg sm:text-xl font-semibold font-display text-foreground mb-2">{t("medicines.noResults")}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{t("medicines.noResultsDesc")}</p>
                  <Button variant="outline" onClick={clearFilters} className="rounded-xl">{t("medicines.clearFilters")}</Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Medicines;
