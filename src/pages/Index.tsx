import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import MedicineCard from "@/components/MedicineCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Medicine } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, Shield, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import usePageTitle from "@/hooks/usePageTitle";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  usePageTitle("");
  const { t } = useTranslation();
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchMedicines = async () => {
      const [{ data }, { count }] = await Promise.all([
        supabase.from("medicines").select("*").limit(8),
        supabase.from("medicines").select("*", { count: "exact", head: true }),
      ]);
      if (data) setFeaturedMedicines(data as unknown as Medicine[]);
      if (count) setTotalCount(count);
    };
    fetchMedicines();
  }, []);

  const roles = [
    { icon: Users, title: t("home.forPatients"), desc: t("home.forPatientsDesc"), color: "bg-primary/10 text-primary" },
    { icon: Building2, title: t("home.forCompanies"), desc: t("home.forCompaniesDesc"), color: "bg-accent/10 text-accent" },
    { icon: Shield, title: t("home.forAdmins"), desc: t("home.forAdminsDesc"), color: "bg-secondary text-secondary-foreground" },
  ];

  const stats = [
    { value: totalCount || 28, suffix: "+", label: t("home.stats.medicines"), icon: TrendingUp },
    { value: 5000, suffix: "+", label: t("home.stats.users"), icon: Users },
    { value: 150, suffix: "+", label: t("home.stats.companies"), icon: Building2 },
    { value: 4.9, suffix: "/5", label: t("home.stats.rating"), icon: Star, isDecimal: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section className="py-8 sm:py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground">
                    {stat.isDecimal ? stat.value : <AnimatedCounter value={stat.value as number} duration={1.5} />}
                  </span>
                  <span className="text-lg sm:text-xl font-bold font-display text-primary">{stat.suffix}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-xs sm:text-sm font-medium text-primary uppercase tracking-wider mb-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">{t("home.explore")}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground mt-3 mb-3 sm:mb-4">{t("home.featuredMedicines")}</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">{t("home.featuredDesc")}</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
            {featuredMedicines.map((medicine, i) => (
              <MedicineCard key={medicine.id} medicine={medicine} index={i} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
            <Link to="/medicines">
              <Button variant="outline" size="lg" className="gap-2 rounded-xl group">
                {t("home.viewAll")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-xs sm:text-sm font-medium text-primary uppercase tracking-wider mb-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">{t("home.forEveryone")}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground mt-3 mb-3 sm:mb-4">{t("home.builtForThree")}</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">{t("home.builtForThreeDesc")}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {roles.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
                className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-shadow duration-500">
                <motion.div whileHover={{ rotate: 5, scale: 1.1 }} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${r.color} flex items-center justify-center mb-3 sm:mb-4`}>
                  <r.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold font-display text-foreground mb-1.5 sm:mb-2">{r.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-3xl mx-auto gradient-hero rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-primary-foreground mb-3 sm:mb-4">{t("home.startJourney")}</h2>
              <p className="text-sm sm:text-base text-primary-foreground/70 mb-6 sm:mb-8 max-w-lg mx-auto">{t("home.startJourneyDesc")}</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                <Link to="/register">
                  <Button variant="accent" size="lg" className="rounded-xl gap-2 group w-full sm:w-auto">
                    {t("hero.createAccount")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/medicines">
                  <Button variant="hero-outline" size="lg" className="rounded-xl w-full sm:w-auto">{t("hero.browseMedicines")}</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
