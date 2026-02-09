import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, MicOff, Sparkles, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { addToSearchHistory, isAuthenticated } = useAuth();
  const recognitionRef = useRef<any>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    if (isAuthenticated) {
      addToSearchHistory(query.trim());
    }
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
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const features = [
    { icon: Sparkles, label: "12,000+ Medicines", desc: "Comprehensive database" },
    { icon: Shield, label: "Verified Info", desc: "Trusted sources" },
    { icon: Clock, label: "Instant Search", desc: "Real-time results" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Medical background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 gradient-hero opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Your Digital Prescription Companion
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6 text-primary-foreground"
          >
            Find Your Medicine,{" "}
            <span className="text-gradient-accent">Instantly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto"
          >
            Search our comprehensive database of medicines with detailed information,
            dosage guides, and side effects. Use voice or text to find what you need.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative flex items-center glass-strong rounded-2xl p-2 shadow-card-hover">
              <Search className="absolute left-5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search medicines, conditions, or categories..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoiceSearch}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isListening
                      ? "gradient-accent text-accent-foreground shadow-glow-accent animate-pulse-slow"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  title="Voice search"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <Button onClick={handleSearch} className="rounded-xl px-6">
                  Search
                </Button>
              </div>
            </div>
            {isListening && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-accent mt-3 font-medium"
              >
                🎙️ Listening... Speak now
              </motion.p>
            )}
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            {features.map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15"
              >
                <feat.icon className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-primary-foreground">{feat.label}</p>
                  <p className="text-xs text-primary-foreground/60">{feat.desc}</p>
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
