import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, MicOff, Sparkles, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const { t } = useTranslation();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/medicines?search=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleVoiceSearch = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Voice search is not supported in your browser. Please use Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setQuery(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const features = [
    { icon: Sparkles, label: "28+ Medicines", desc: "Real pharmaceutical data" },
    { icon: Shield, label: "Verified Info", desc: "Trusted sources" },
    { icon: Clock, label: "Instant Search", desc: "Real-time results" },
  ];

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Medical background" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 gradient-hero opacity-90 sm:opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>
      <div className="absolute top-20 left-10 w-40 sm:w-72 h-40 sm:h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-52 sm:w-96 h-52 sm:h-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-20 sm:pt-16 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-4 sm:mb-6 text-primary-foreground">
            {t("hero.title")}{" "}<span className="text-gradient-accent">{t("hero.titleHighlight")}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-primary-foreground/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center glass-strong rounded-2xl p-2 shadow-card-hover gap-2 sm:gap-0">
              <Search className="hidden sm:block absolute left-5 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder={t("medicines.searchPlaceholder")}
                value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent px-4 sm:pl-12 sm:pr-4 py-3 sm:py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none text-base rounded-xl sm:rounded-none" />
              <div className="flex items-center gap-2 justify-end">
                <button onClick={toggleVoiceSearch}
                  className={`p-2.5 sm:p-3 rounded-xl transition-all duration-300 ${isListening ? "gradient-accent text-accent-foreground shadow-glow-accent animate-pulse-slow" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                  title="Voice search">
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <Button onClick={handleSearch} className="rounded-xl px-5 sm:px-6">{t("common.search")}</Button>
              </div>
            </div>
            {isListening && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-accent mt-3 font-medium">
                🎙️ Listening... Speak now
              </motion.p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15">
                <feat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-semibold text-primary-foreground">{feat.label}</p>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/60">{feat.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
