import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Clock, Search, Trash2, ExternalLink, Pill } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useEffect } from "react";

const UserDashboard = () => {
  const { user, isAuthenticated, searchHistory, clearSearchHistory } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Welcome */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                  <Pill className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-display text-foreground">Welcome, {user.name}</h1>
                  <p className="text-muted-foreground">Your personal medicine dashboard</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{searchHistory.length}</p>
                    <p className="text-xs text-muted-foreground">Total Searches</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">
                      {searchHistory.filter(h => h.medicineId).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Medicines Viewed</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <Link to="/medicines">
                  <Button variant="outline" className="w-full h-full min-h-[76px] rounded-xl">
                    <Search className="w-5 h-5 mr-2" /> Search Medicines
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search History */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold font-display text-foreground">Search History</h2>
                </div>
                {searchHistory.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearSearchHistory} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                  </Button>
                )}
              </div>

              {searchHistory.length > 0 ? (
                <div className="divide-y divide-border">
                  {searchHistory.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.medicineName || item.query}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                        </div>
                      </div>
                      {item.medicineId && (
                        <Link to={`/medicine/${item.medicineId}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 text-2xl">
                    🔍
                  </div>
                  <h3 className="text-lg font-semibold font-display text-foreground mb-2">No search history yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start searching for medicines to build your history</p>
                  <Link to="/medicines"><Button>Browse Medicines</Button></Link>
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

export default UserDashboard;
