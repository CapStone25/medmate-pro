import { useState, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { medicines, categories } from "@/data/medicines";
import MedicineCard from "@/components/MedicineCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import usePageTitle from "@/hooks/usePageTitle";
import AnimatedCounter from "@/components/AnimatedCounter";

const Medicines = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(true);
  const { addToSearchHistory, isAuthenticated } = useAuth();

  usePageTitle("Medicine Catalog");

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      const q = query.toLowerCase();
      const matchesQuery = query === "" ||
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && isAuthenticated) {
      addToSearchHistory(query.trim());
    }
  }, [query, isAuthenticated, addToSearchHistory]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setSelectedCategory("All");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-2">
                  Medicine Catalog
                </h1>
                <p className="text-muted-foreground">
                  Browse our comprehensive database of{" "}
                  <span className="font-semibold text-foreground">{medicines.length}</span> medicines
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-xl px-4 py-2">
                <Search className="w-4 h-4" />
                <span>
                  <span className="font-semibold text-foreground">
                    <AnimatedCounter value={filteredMedicines.length} duration={0.5} />
                  </span> results
                </span>
              </div>
            </div>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="flex gap-3">
              <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, category, or description..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </form>
              <Button
                variant="outline"
                className="rounded-xl gap-2 shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    {categories.map(cat => (
                      <motion.button
                        key={cat}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedCategory === cat
                            ? "bg-primary text-primary-foreground shadow-glow"
                            : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                        }`}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {filteredMedicines.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredMedicines.map((medicine, i) => (
                  <MedicineCard key={medicine.id} medicine={medicine} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6 text-4xl">
                  🔍
                </div>
                <h3 className="text-xl font-semibold font-display text-foreground mb-2">No medicines found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
                <Button variant="outline" onClick={clearFilters} className="rounded-xl">
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Medicines;
