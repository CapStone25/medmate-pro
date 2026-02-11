import { useAuth } from "@/contexts/AuthContext";
import { useSettings, ColorBlindMode } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Volume2, VolumeX, Eye, Accessibility } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import usePageTitle from "@/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const colorBlindOptions: { mode: ColorBlindMode; label: string; description: string }[] = [
  { mode: "none", label: "Normal Vision", description: "No color adjustments" },
  { mode: "protanopia", label: "Protanopia", description: "Red-blind (difficulty seeing reds)" },
  { mode: "deuteranopia", label: "Deuteranopia", description: "Green-blind (difficulty seeing greens)" },
  { mode: "tritanopia", label: "Tritanopia", description: "Blue-blind (difficulty seeing blues)" },
  { mode: "achromatopsia", label: "Achromatopsia", description: "Total color blindness (grayscale)" },
];

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const { theme, ttsEnabled, ttsAutoRead, colorBlindMode, setTheme, setTtsEnabled, setTtsAutoRead, setColorBlindMode } = useSettings();
  const navigate = useNavigate();

  usePageTitle("Settings");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold font-display text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground mb-8">Customize your experience</p>

            {/* Theme */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
              <div className="flex items-center gap-3 mb-4">
                {theme === "dark" ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                <h2 className="text-lg font-semibold font-display text-foreground">Appearance</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setTheme("light")}
                  className={`p-4 rounded-xl border text-center transition-all ${theme === "light" ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-muted/50 hover:border-primary/30"}`}>
                  <Sun className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <p className="text-sm font-medium text-foreground">Light Mode</p>
                </button>
                <button onClick={() => setTheme("dark")}
                  className={`p-4 rounded-xl border text-center transition-all ${theme === "dark" ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-muted/50 hover:border-primary/30"}`}>
                  <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                  <p className="text-sm font-medium text-foreground">Dark Mode</p>
                </button>
              </div>
            </div>

            {/* Text-to-Speech */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold font-display text-foreground">Text-to-Speech</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">Enable TTS</p>
                    <p className="text-xs text-muted-foreground">Show read aloud buttons on prescriptions</p>
                  </div>
                  <button onClick={() => setTtsEnabled(!ttsEnabled)}
                    className={`w-12 h-7 rounded-full transition-all duration-300 ${ttsEnabled ? "bg-primary" : "bg-muted-foreground/30"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${ttsEnabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-Read Prescriptions</p>
                    <p className="text-xs text-muted-foreground">Automatically read prescriptions when opened</p>
                  </div>
                  <button onClick={() => setTtsAutoRead(!ttsAutoRead)} disabled={!ttsEnabled}
                    className={`w-12 h-7 rounded-full transition-all duration-300 ${ttsAutoRead && ttsEnabled ? "bg-primary" : "bg-muted-foreground/30"} ${!ttsEnabled ? "opacity-50" : ""}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${ttsAutoRead && ttsEnabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Color Blindness */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Accessibility className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold font-display text-foreground">Color Blindness Mode</h2>
              </div>
              <div className="space-y-2">
                {colorBlindOptions.map(opt => (
                  <button key={opt.mode} onClick={() => setColorBlindMode(opt.mode)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${colorBlindMode === opt.mode ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/30"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.description}</p>
                      </div>
                      {colorBlindMode === opt.mode && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
