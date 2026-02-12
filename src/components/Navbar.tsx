import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Pill, Menu, X, User, LogOut, LayoutDashboard, Settings, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n";
import { useSettings } from "@/contexts/SettingsContext";

const Navbar = () => {
  const { profile, role, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { language, setLanguage } = useSettings();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/medicines", label: t("nav.medicines") },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!role) return "/login";
    switch (role) {
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
            <>
              <Link
                to={getDashboardLink()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(getDashboardLink())
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {t("nav.dashboard")}
              </Link>
              <Link
                to="/settings"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive("/settings")
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Settings className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs">{languages.find(l => l.code === language)?.flag}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-card border border-border shadow-card-hover overflow-hidden z-50"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        language === lang.code
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to={getDashboardLink()}>
                <Button variant="ghost" size="sm" className="gap-2 rounded-lg">
                  <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm max-w-[120px] truncate">{profile?.name || "User"}</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 rounded-lg">
                <LogOut className="w-4 h-4" />
                {t("nav.logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-lg">{t("nav.signIn")}</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-lg">{t("nav.getStarted")}</Button>
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
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMobileOpen(false)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                      isActive(getDashboardLink()) ? "text-primary bg-primary/8" : "text-foreground"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" /> {t("nav.dashboard")}
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 px-3 rounded-lg text-sm font-medium flex items-center gap-2 text-foreground"
                  >
                    <Settings className="w-4 h-4" /> {t("nav.settings")}
                  </Link>
                </>
              )}
              {/* Mobile Language Switcher */}
              <div className="border-t border-border pt-3 mt-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">{t("settings.language")}</p>
                <div className="flex flex-wrap gap-1.5 px-3 mb-3">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        language === lang.code
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-muted-foreground px-3">{t("nav.signedInAs", { name: profile?.name })}</span>
                    <Button variant="outline" size="sm" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                      {t("nav.logout")}
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">{t("nav.signIn")}</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button size="sm" className="w-full">{t("nav.getStarted")}</Button>
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
