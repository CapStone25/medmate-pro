import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Medicine, Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Building2, Pill, Trash2, Shield, AlertTriangle, Plus, X, Edit, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import usePageTitle from "@/hooks/usePageTitle";
import AnimatedCounter from "@/components/AnimatedCounter";
import { categories } from "@/utils/medicineImages";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<(Profile & { role?: string })[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteMed, setConfirmDeleteMed] = useState<string | null>(null);
  const [showMedForm, setShowMedForm] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "medicines">("medicines");
  const [form, setForm] = useState({
    name: "", generic_name: "", category: "Antibiotic", description: "", dosage: "", price: "",
    active_ingredient: "", form: "", side_effects: "", manufacturer: "",
  });

  usePageTitle(t("admin.title"));

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") { navigate("/login"); return; }
    const fetchData = async () => {
      const [profilesRes, rolesRes, medsRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("user_roles").select("*"),
        supabase.from("medicines").select("*").order("created_at", { ascending: false }),
      ]);
      const roles = (rolesRes.data || []) as any[];
      const profs = ((profilesRes.data || []) as unknown as Profile[]).map(p => ({
        ...p,
        role: roles.find((r: any) => r.user_id === p.user_id)?.role || "user",
      }));
      setProfiles(profs);
      if (medsRes.data) setMedicines(medsRes.data as unknown as Medicine[]);
    };
    fetchData();
  }, [isAuthenticated, role, navigate]);

  const handleRemoveUser = async (userId: string) => {
    if (confirmDelete !== userId) { setConfirmDelete(userId); return; }
    await supabase.from("profiles").delete().eq("user_id", userId);
    setProfiles(prev => prev.filter(p => p.user_id !== userId));
    setConfirmDelete(null);
    toast.success(t("admin.userRemoved"));
  };

  const handleMedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const medicineData = {
      name: form.name,
      generic_name: form.generic_name,
      category: form.category,
      description: form.description,
      dosage: form.dosage,
      price: form.price,
      manufacturer: form.manufacturer || "Admin",
      requires_prescription: true,
      active_ingredient: form.active_ingredient || null,
      form: form.form || null,
      side_effects: form.side_effects ? form.side_effects.split(",").map(s => s.trim()) : [],
    };

    if (editingMedId) {
      const { data, error } = await supabase.from("medicines").update(medicineData as any).eq("id", editingMedId).select().single();
      if (error) { toast.error(t("company.failedUpdate")); return; }
      setMedicines(prev => prev.map(m => m.id === editingMedId ? data as unknown as Medicine : m));
      toast.success(t("company.updated"));
    } else {
      const { data, error } = await supabase.from("medicines").insert(medicineData as any).select().single();
      if (error) { toast.error(t("company.failedAdd")); return; }
      setMedicines(prev => [data as unknown as Medicine, ...prev]);
      toast.success(t("company.added"));
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({ name: "", generic_name: "", category: "Antibiotic", description: "", dosage: "", price: "", active_ingredient: "", form: "", side_effects: "", manufacturer: "" });
    setShowMedForm(false);
    setEditingMedId(null);
  };

  const handleEditMed = (med: Medicine) => {
    setForm({
      name: med.name, generic_name: med.generic_name, category: med.category,
      description: med.description, dosage: med.dosage, price: med.price,
      active_ingredient: med.active_ingredient || "", form: med.form || "",
      side_effects: med.side_effects.join(", "), manufacturer: med.manufacturer,
    });
    setEditingMedId(med.id);
    setShowMedForm(true);
  };

  const handleDeleteMed = async (medId: string) => {
    if (confirmDeleteMed !== medId) { setConfirmDeleteMed(medId); return; }
    const { error } = await supabase.from("medicines").delete().eq("id", medId);
    if (error) { toast.error(t("company.failedDelete")); return; }
    setMedicines(prev => prev.filter(m => m.id !== medId));
    setConfirmDeleteMed(null);
    toast.success(t("company.deleted"));
  };

  const users = profiles.filter(p => p.role === "user");
  const companiesProfiles = profiles.filter(p => p.role === "company");

  const stats = [
    { icon: Users, value: users.length, label: t("admin.totalUsers"), color: "bg-primary/10 text-primary" },
    { icon: Building2, value: companiesProfiles.length, label: t("admin.companies"), color: "bg-accent/10 text-accent" },
    { icon: Pill, value: medicines.length, label: t("admin.medicines"), color: "bg-secondary text-secondary-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                    className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent">
                    <Shield className="w-7 h-7 text-accent-foreground" />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl font-bold font-display text-foreground">{t("admin.title")}</h1>
                    <p className="text-muted-foreground">{t("admin.subtitle")}</p>
                  </div>
                </div>
                {activeTab === "medicines" && (
                  <Button onClick={() => { setShowMedForm(!showMedForm); if (showMedForm) resetForm(); }} className="gap-2 rounded-xl">
                    {showMedForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showMedForm ? t("company.cancel") : t("company.addPrescription")}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display text-foreground"><AnimatedCounter value={stat.value} /></p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button onClick={() => setActiveTab("medicines")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "medicines" ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                <Pill className="w-4 h-4 inline-block mr-2" />{t("admin.medicines")}
              </button>
              <button onClick={() => setActiveTab("users")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "users" ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                <Users className="w-4 h-4 inline-block mr-2" />{t("admin.users")} & {t("admin.companies")}
              </button>
            </div>

            {/* Medicine CRUD Form */}
            <AnimatePresence>
              {showMedForm && activeTab === "medicines" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                  <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
                    <h2 className="text-xl font-semibold font-display text-foreground mb-5">
                      {editingMedId ? t("company.editPrescription") : t("company.addNew")}
                    </h2>
                    <form onSubmit={handleMedSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("company.medicineName")}</Label>
                          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Amoxicillin" required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("company.genericName")}</Label>
                          <Input value={form.generic_name} onChange={e => setForm(f => ({ ...f, generic_name: e.target.value }))}
                            placeholder="e.g. Amoxicillin Trihydrate" required className="rounded-xl" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>{t("company.category")}</Label>
                          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t("company.dosage")}</Label>
                          <Input value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
                            placeholder="e.g. 500mg" required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("company.price")}</Label>
                          <Input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                            placeholder="e.g. $9.99" required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("medicineDetail.manufacturer")}</Label>
                          <Input value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))}
                            placeholder="e.g. Pharma Corp" required className="rounded-xl" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("company.activeIngredient")}</Label>
                          <Input value={form.active_ingredient} onChange={e => setForm(f => ({ ...f, active_ingredient: e.target.value }))}
                            className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("company.form")}</Label>
                          <Input value={form.form} onChange={e => setForm(f => ({ ...f, form: e.target.value }))}
                            className="rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("company.sideEffects")}</Label>
                        <Input value={form.side_effects} onChange={e => setForm(f => ({ ...f, side_effects: e.target.value }))}
                          placeholder="e.g. Nausea, Headache" className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("company.description")}</Label>
                        <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                          required className="rounded-xl min-h-[100px]" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" className="rounded-xl gap-2">
                          <Plus className="w-4 h-4" /> {editingMedId ? t("common.update") : t("common.add")}
                        </Button>
                        <Button type="button" variant="outline" className="rounded-xl" onClick={resetForm}>
                          {t("company.cancel")}
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Medicines Tab */}
            {activeTab === "medicines" && (
              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Pill className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold font-display text-foreground">{t("admin.medicines")}</h2>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{medicines.length}</span>
                </div>
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  <AnimatePresence>
                    {medicines.map((m, i) => (
                      <motion.div key={m.id} layout exit={{ opacity: 0, x: -20 }}
                        className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm">💊</div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{m.generic_name} • {m.category} • {m.price} • {m.manufacturer}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => handleEditMed(m)} className="text-primary">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant={confirmDeleteMed === m.id ? "destructive" : "ghost"} size="sm"
                              onClick={() => handleDeleteMed(m.id)} onBlur={() => setConfirmDeleteMed(null)}
                              className={confirmDeleteMed !== m.id ? "text-destructive hover:text-destructive hover:bg-destructive/10" : ""}>
                              {confirmDeleteMed === m.id ? (
                                <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {t("admin.confirm")}</span>
                              ) : <Trash2 className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold font-display text-foreground">{t("admin.users")}</h2>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{users.length}</span>
                  </div>
                  <div className="divide-y divide-border">
                    <AnimatePresence>
                      {users.length > 0 ? users.map(u => (
                        <motion.div key={u.user_id} layout exit={{ opacity: 0, x: -20 }}
                          className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">{u.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                          <Button variant={confirmDelete === u.user_id ? "destructive" : "ghost"} size="sm"
                            onClick={() => handleRemoveUser(u.user_id)} onBlur={() => setConfirmDelete(null)}
                            className={confirmDelete !== u.user_id ? "text-destructive hover:text-destructive hover:bg-destructive/10" : ""}>
                            {confirmDelete === u.user_id ? (
                              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {t("admin.confirm")}</span>
                            ) : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </motion.div>
                      )) : <div className="p-8 text-center text-sm text-muted-foreground">{t("admin.noUsers")}</div>}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-accent" />
                      <h2 className="text-lg font-semibold font-display text-foreground">{t("admin.companies")}</h2>
                    </div>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">{companiesProfiles.length}</span>
                  </div>
                  <div className="divide-y divide-border">
                    <AnimatePresence>
                      {companiesProfiles.length > 0 ? companiesProfiles.map(c => (
                        <motion.div key={c.user_id} layout exit={{ opacity: 0, x: -20 }}
                          className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                              <Building2 className="w-3.5 h-3.5 text-accent" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.company_name}</p>
                            </div>
                          </div>
                          <Button variant={confirmDelete === c.user_id ? "destructive" : "ghost"} size="sm"
                            onClick={() => handleRemoveUser(c.user_id)} onBlur={() => setConfirmDelete(null)}
                            className={confirmDelete !== c.user_id ? "text-destructive hover:text-destructive hover:bg-destructive/10" : ""}>
                            {confirmDelete === c.user_id ? (
                              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {t("admin.confirm")}</span>
                            ) : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </motion.div>
                      )) : <div className="p-8 text-center text-sm text-muted-foreground">{t("admin.noCompanies")}</div>}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;