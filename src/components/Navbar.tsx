import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Pill, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/medicines", label: "Medicines" },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow"
          >
            <Pill className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <span className="text-xl font-bold font-display text-gradient">RxVault</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(link.to)
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to={getDashboardLink()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(getDashboardLink())
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to={getDashboardLink()}>
                <Button variant="ghost" size="sm" className="gap-2 rounded-lg">
                  <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm max-w-[120px] truncate">{user?.name}</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 rounded-lg">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-lg">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-lg">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to) ? "text-primary bg-primary/8" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    isActive(getDashboardLink()) ? "text-primary bg-primary/8" : "text-foreground"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
              <div className="border-t border-border pt-3 mt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-muted-foreground px-3">Signed in as {user?.name}</span>
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
