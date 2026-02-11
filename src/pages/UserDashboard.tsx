import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SearchHistoryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Clock, Search, Trash2, ExternalLink, Pill, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import AnimatedCounter from "@/components/AnimatedCounter";

const UserDashboard = () => {
  const { user, profile, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  usePageTitle("Dashboard");

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (role && role !== "user") {
      navigate(role === "admin" ? "/admin" : "/company");
      return;
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setSearchHistory(data as unknown as SearchHistoryItem[]);
    };
    fetchHistory();
  }, [user]);

  const clearHistory = async () => {
    if (!user) return;
    await supabase.from("search_history").delete().eq("user_id", user.id);
    setSearchHistory([]);
  };

  if (!user) return null;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const medicinesViewed = searchHistory.filter(h => h.medicine_id).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card mb-8">
              <div className="flex items-center gap-4">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                  className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                  <Pill className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold font-display text-foreground">Welcome back, {profile?.name || "User"}</h1>
                  <p className="text-muted-foreground">Your personal medicine dashboard</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground"><AnimatedCounter value={searchHistory.length} /></p>
                    <p className="text-xs text-muted-foreground">Total Searches</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground"><AnimatedCounter value={medicinesViewed} /></p>
                    <p className="text-xs text-muted-foreground">Medicines Viewed</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Link to="/medicines">
                  <Button variant="outline" className="w-full h-full min-h-[76px] rounded-xl gap-2 hover:shadow-card transition-shadow">
                    <Search className="w-5 h-5" /> Search Medicines
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold font-display text-foreground">Search History</h2>
                </div>
                {searchHistory.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg">
                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                  </Button>
                )}
              </div>

              {searchHistory.length > 0 ? (
                <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                  <AnimatePresence>
                    {searchHistory.map((item, i) => (
                      <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Search className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.medicine_name || item.query}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                          </div>
                        </div>
                        {item.medicine_id && (
                          <Link to={`/medicine/${item.medicine_id}`}>
                            <Button variant="ghost" size="sm" className="rounded-lg"><ExternalLink className="w-4 h-4" /></Button>
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
                  <h3 className="text-lg font-semibold font-display text-foreground mb-2">No search history yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start searching for medicines to build your history</p>
                  <Link to="/medicines"><Button className="rounded-xl">Browse Medicines</Button></Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
