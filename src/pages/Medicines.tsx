import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { medicines, categories } from "@/data/medicines";
import MedicineCard from "@/components/MedicineCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Medicines = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToSearchHistory, isAuthenticated } = useAuth();

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      const matchesQuery = query === "" ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.genericName.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && isAuthenticated) {
      addToSearchHistory(query.trim());
    }
  };

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
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-2">
              Medicine Catalog
            </h1>
            <p className="text-muted-foreground">
              Browse our comprehensive database of {medicines.length} medicines
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </form>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          {filteredMedicines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedicines.map((medicine, i) => (
                <MedicineCard key={medicine.id} medicine={medicine} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 text-3xl">
                🔍
              </div>
              <h3 className="text-xl font-semibold font-display text-foreground mb-2">No medicines found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline" onClick={() => { setQuery(""); setSelectedCategory("All"); }}>
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Medicines;
