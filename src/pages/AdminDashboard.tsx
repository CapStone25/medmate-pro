import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { medicines } from "@/data/medicines";
import { User } from "@/types";
import { Users, Building2, Pill, Trash2, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mockUsers, setMockUsers] = useState<User[]>([
    { id: "2", email: "user@rxvault.com", name: "John Doe", role: "user" },
    { id: "3", email: "company@rxvault.com", name: "PharmaCorp", role: "company", companyName: "PharmaCorp Industries" },
    { id: "4", email: "jane@example.com", name: "Jane Smith", role: "user" },
    { id: "5", email: "medtech@example.com", name: "MedTech Labs", role: "company", companyName: "MedTech Laboratories" },
  ]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  const handleRemoveUser = (userId: string) => {
    setMockUsers(prev => prev.filter(u => u.id !== userId));
    toast.success("User removed successfully");
  };

  const users = mockUsers.filter(u => u.role === "user");
  const companies = mockUsers.filter(u => u.role === "company");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent">
                  <Shield className="w-7 h-7 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-display text-foreground">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Manage users, companies, and medicines</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{users.length}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{companies.length}</p>
                    <p className="text-xs text-muted-foreground">Companies</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Pill className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{medicines.length}</p>
                    <p className="text-xs text-muted-foreground">Medicines</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users Table */}
              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold font-display text-foreground">Users</h2>
                </div>
                <div className="divide-y divide-border">
                  {users.length > 0 ? users.map(u => (
                    <div key={u.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(u.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">No users found</div>
                  )}
                </div>
              </div>

              {/* Companies Table */}
              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold font-display text-foreground">Companies</h2>
                </div>
                <div className="divide-y divide-border">
                  {companies.length > 0 ? companies.map(c => (
                    <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.companyName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(c.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">No companies found</div>
                  )}
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

export default AdminDashboard;
