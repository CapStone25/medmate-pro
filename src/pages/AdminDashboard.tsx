import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { medicines } from "@/data/medicines";
import { User } from "@/types";
import { Users, Building2, Pill, Trash2, Shield, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import usePageTitle from "@/hooks/usePageTitle";
import AnimatedCounter from "@/components/AnimatedCounter";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mockUsers, setMockUsers] = useState<User[]>([
    { id: "2", email: "user@rxvault.com", name: "John Doe", role: "user" },
    { id: "3", email: "company@rxvault.com", name: "PharmaCorp", role: "company", companyName: "PharmaCorp Industries" },
    { id: "4", email: "jane@example.com", name: "Jane Smith", role: "user" },
    { id: "5", email: "medtech@example.com", name: "MedTech Labs", role: "company", companyName: "MedTech Laboratories" },
  ]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  usePageTitle("Admin Dashboard");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  const handleRemoveUser = (userId: string) => {
    if (confirmDelete !== userId) {
      setConfirmDelete(userId);
      return;
    }
    setMockUsers(prev => prev.filter(u => u.id !== userId));
    setConfirmDelete(null);
    toast.success("User removed successfully");
  };

  const users = mockUsers.filter(u => u.role === "user");
  const companies = mockUsers.filter(u => u.role === "company");

  const stats = [
    { icon: Users, value: users.length, label: "Total Users", color: "bg-primary/10 text-primary" },
    { icon: Building2, value: companies.length, label: "Companies", color: "bg-accent/10 text-accent" },
    { icon: Pill, value: medicines.length, label: "Medicines", color: "bg-secondary text-secondary-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card mb-8">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent"
                >
                  <Shield className="w-7 h-7 text-accent-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold font-display text-foreground">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Manage users, companies, and medicines</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display text-foreground">
                        <AnimatedCounter value={stat.value} />
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
              >
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold font-display text-foreground">Users</h2>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {users.length}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {users.length > 0 ? users.map(u => (
                      <motion.div
                        key={u.id}
                        layout
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{u.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <Button
                          variant={confirmDelete === u.id ? "destructive" : "ghost"}
                          size="sm"
                          onClick={() => handleRemoveUser(u.id)}
                          onBlur={() => setConfirmDelete(null)}
                          className={confirmDelete !== u.id ? "text-destructive hover:text-destructive hover:bg-destructive/10" : ""}
                        >
                          {confirmDelete === u.id ? (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Confirm
                            </span>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </motion.div>
                    )) : (
                      <div className="p-8 text-center text-sm text-muted-foreground">No users found</div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Companies Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
              >
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-semibold font-display text-foreground">Companies</h2>
                  </div>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                    {companies.length}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {companies.length > 0 ? companies.map(c => (
                      <motion.div
                        key={c.id}
                        layout
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <Building2 className="w-3.5 h-3.5 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.companyName}</p>
                          </div>
                        </div>
                        <Button
                          variant={confirmDelete === c.id ? "destructive" : "ghost"}
                          size="sm"
                          onClick={() => handleRemoveUser(c.id)}
                          onBlur={() => setConfirmDelete(null)}
                          className={confirmDelete !== c.id ? "text-destructive hover:text-destructive hover:bg-destructive/10" : ""}
                        >
                          {confirmDelete === c.id ? (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Confirm
                            </span>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </motion.div>
                    )) : (
                      <div className="p-8 text-center text-sm text-muted-foreground">No companies found</div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
