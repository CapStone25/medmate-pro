import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Pill, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin": return "/admin";
      case "company": return "/company";
      default: return "/dashboard";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
            <Pill className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display text-gradient">RxVault</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/medicines" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Medicines
          </Link>
          {isAuthenticated && (
            <Link to={getDashboardLink()} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to={getDashboardLink()}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name}</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Home</Link>
              <Link to="/medicines" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium">Medicines</Link>
              {isAuthenticated && (
                <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
              <div className="border-t border-border pt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-muted-foreground">Signed in as {user?.name}</span>
                    <Button variant="outline" size="sm" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button size="sm" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
