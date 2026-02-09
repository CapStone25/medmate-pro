import { useParams, Link } from "react-router-dom";
import { medicines, getCategoryColor, getCategoryIcon } from "@/data/medicines";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Pill, Building2, DollarSign, Info, Stethoscope } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import MedicineCard from "@/components/MedicineCard";

const MedicineDetail = () => {
  const { id } = useParams();
  const { addToSearchHistory, isAuthenticated } = useAuth();
  const medicine = medicines.find(m => m.id === id);
  const hasTracked = useRef(false);

  usePageTitle(medicine?.name || "Medicine Not Found");

  // Track view in search history — only once per mount
  useEffect(() => {
    if (medicine && isAuthenticated && !hasTracked.current) {
      hasTracked.current = true;
      addToSearchHistory(medicine.name, medicine.id, medicine.name);
    }
  }, [medicine, isAuthenticated, addToSearchHistory]);

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6 text-4xl">
              💊
            </div>
            <h1 className="text-2xl font-bold font-display mb-2 text-foreground">Medicine not found</h1>
            <p className="text-muted-foreground mb-6">The medicine you're looking for doesn't exist.</p>
            <Link to="/medicines"><Button className="rounded-xl">Browse Medicines</Button></Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Related medicines (same category, exclude current)
  const relatedMedicines = medicines
    .filter(m => m.category === medicine.category && m.id !== medicine.id)
    .slice(0, 3);

  const infoCards = [
    { icon: Pill, label: "Dosage", value: medicine.dosage, color: "bg-primary/10 text-primary" },
    { icon: Building2, label: "Manufacturer", value: medicine.manufacturer, color: "bg-accent/10 text-accent" },
    { icon: DollarSign, label: "Price", value: medicine.price, color: "bg-secondary text-secondary-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/medicines" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Medicines
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
          >
            {/* Header */}
            <div className={`h-3 w-full bg-gradient-to-r ${getCategoryColor(medicine.category)}`} />
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getCategoryColor(medicine.category)} flex items-center justify-center text-4xl shadow-lg flex-shrink-0`}
                >
                  {getCategoryIcon(medicine.category)}
                </motion.div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold font-display text-foreground">{medicine.name}</h1>
                    <Badge variant={medicine.requiresPrescription ? "default" : "secondary"}>
                      {medicine.requiresPrescription ? "Prescription Required" : "Over the Counter"}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">{medicine.genericName}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {infoCards.map((info, i) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="bg-muted/50 rounded-xl p-4 hover:shadow-card transition-shadow duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center`}>
                        <info.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{info.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{info.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold font-display text-foreground">Description</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{medicine.description}</p>
              </motion.div>

              {/* Side Effects */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-destructive/5 rounded-xl p-5 border border-destructive/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h2 className="text-xl font-semibold font-display text-foreground">Side Effects</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicine.sideEffects.map((effect, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.05 }}
                      className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium"
                    >
                      {effect}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Related Medicines */}
          {relatedMedicines.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <Stethoscope className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold font-display text-foreground">Related Medicines</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedMedicines.map((med, i) => (
                  <MedicineCard key={med.id} medicine={med} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MedicineDetail;
