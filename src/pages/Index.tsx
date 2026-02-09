import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import MedicineCard from "@/components/MedicineCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { medicines } from "@/data/medicines";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, Shield } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const featuredMedicines = medicines.slice(0, 8);

  const roles = [
    {
      icon: Users,
      title: "For Patients",
      desc: "Search medicines, track your history, and access detailed information about prescriptions.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Building2,
      title: "For Companies",
      desc: "Add and manage prescriptions in our database. Reach patients with accurate medicine information.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Shield,
      title: "For Admins",
      desc: "Full control over users, companies, and the medicine database. Monitor platform activity.",
      color: "bg-secondary text-secondary-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Featured Medicines */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Explore</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mt-2 mb-4">
              Featured Medicines
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Discover our most searched medicines with detailed information and dosage guidelines.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {featuredMedicines.map((medicine, i) => (
              <MedicineCard key={medicine.id} medicine={medicine} index={i} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/medicines">
              <Button variant="outline" size="lg" className="gap-2 rounded-xl">
                View All Medicines <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">For Everyone</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mt-2 mb-4">
              Built for Three Roles
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Whether you're a patient, a pharmaceutical company, or an administrator — RxVault has you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {roles.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center mb-4`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold font-display text-foreground mb-2">{role.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto gradient-hero rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary-foreground mb-4">
                Start Your Health Journey
              </h2>
              <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
                Join thousands of users who trust RxVault for accurate medicine information and prescription management.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register">
                  <Button variant="accent" size="lg" className="rounded-xl gap-2">
                    Create Free Account <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/medicines">
                  <Button variant="hero-outline" size="lg" className="rounded-xl">
                    Browse Medicines
                  </Button>
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
