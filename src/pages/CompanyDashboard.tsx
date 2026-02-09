import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Medicine } from "@/types";
import { Building2, Plus, Pill, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { categories } from "@/data/medicines";

const CompanyDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [companyMedicines, setCompanyMedicines] = useState<Partial<Medicine>[]>([]);
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    category: "Antibiotic",
    description: "",
    dosage: "",
    price: "",
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "company") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMedicine: Partial<Medicine> = {
      id: Date.now().toString(),
      ...form,
      manufacturer: user.companyName || user.name,
      requiresPrescription: true,
      sideEffects: [],
    };
    setCompanyMedicines(prev => [newMedicine, ...prev]);
    setForm({ name: "", genericName: "", category: "Antibiotic", description: "", dosage: "", price: "" });
    setShowForm(false);
    toast.success("Prescription added successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                    <Building2 className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold font-display text-foreground">{user.companyName || user.name}</h1>
                    <p className="text-muted-foreground">Company Dashboard</p>
                  </div>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Prescription
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{companyMedicines.length}</p>
                    <p className="text-xs text-muted-foreground">Prescriptions Added</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{user.companyName || "—"}</p>
                    <p className="text-xs text-muted-foreground">Company</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-card mb-8"
              >
                <h2 className="text-xl font-semibold font-display text-foreground mb-5">Add New Prescription</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Medicine Name</Label>
                      <Input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Amoxicillin"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Generic Name</Label>
                      <Input
                        value={form.genericName}
                        onChange={e => setForm(f => ({ ...f, genericName: e.target.value }))}
                        placeholder="e.g. Amoxicillin Trihydrate"
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                      >
                        {categories.filter(c => c !== "All").map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input
                        value={form.dosage}
                        onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
                        placeholder="e.g. 500mg twice daily"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="e.g. $9.99"
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe the medicine..."
                      required
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit">Add Prescription</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Medicines List */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3">
                <Pill className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold font-display text-foreground">Your Prescriptions</h2>
              </div>
              {companyMedicines.length > 0 ? (
                <div className="divide-y divide-border">
                  {companyMedicines.map(m => (
                    <div key={m.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.genericName} • {m.category} • {m.price}</p>
                        </div>
                        <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 text-2xl">
                    💊
                  </div>
                  <h3 className="text-lg font-semibold font-display text-foreground mb-2">No prescriptions yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add your first prescription to get started</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Prescription
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;
