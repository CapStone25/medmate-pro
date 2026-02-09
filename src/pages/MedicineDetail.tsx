import { useParams, Link, useNavigate } from "react-router-dom";
import { medicines, getCategoryColor, getCategoryIcon } from "@/data/medicines";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Pill, Building2, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const MedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToSearchHistory, isAuthenticated } = useAuth();
  const medicine = medicines.find(m => m.id === id);

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold font-display mb-4">Medicine not found</h1>
            <Link to="/medicines"><Button>Browse Medicines</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  // Track view in search history
  if (isAuthenticated) {
    addToSearchHistory(medicine.name, medicine.id, medicine.name);
  }

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
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getCategoryColor(medicine.category)} flex items-center justify-center text-4xl shadow-lg flex-shrink-0`}>
                  {getCategoryIcon(medicine.category)}
                </div>
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
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Dosage</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Manufacturer</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Price</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{medicine.price}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold font-display text-foreground mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{medicine.description}</p>
              </div>

              {/* Side Effects */}
              <div className="bg-destructive/5 rounded-xl p-5 border border-destructive/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h2 className="text-xl font-semibold font-display text-foreground">Side Effects</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicine.sideEffects.map((effect, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MedicineDetail;
