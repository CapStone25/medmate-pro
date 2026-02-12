import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Medicine } from "@/types";
import { getMedicineImage, getCategoryColor, getCategoryIcon } from "@/utils/medicineImages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Pill, Building2, DollarSign, Info, Stethoscope, FlaskConical, Package, Volume2, VolumeX, Loader2, Video, VideoOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import MedicineCard from "@/components/MedicineCard";
import { useTranslation } from "react-i18next";

const MedicineDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { ttsAutoRead } = useSettings();
  const { speak, stop, isSpeaking, isLoading, ttsEnabled } = useTextToSpeech();
  const { t } = useTranslation();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [relatedMedicines, setRelatedMedicines] = useState<Medicine[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const hasTracked = useRef(false);

  usePageTitle(medicine?.name || "Medicine");

  useEffect(() => {
    hasTracked.current = false;
    const fetchMedicine = async () => {
      setPageLoading(true);
      const { data } = await supabase.from("medicines").select("*").eq("id", id).maybeSingle();
      if (data) {
        const med = data as unknown as Medicine;
        setMedicine(med);
        // Fetch related
        const { data: related } = await supabase
          .from("medicines").select("*")
          .eq("category", med.category).neq("id", med.id).limit(3);
        if (related) setRelatedMedicines(related as unknown as Medicine[]);
      }
      setPageLoading(false);
    };
    fetchMedicine();
  }, [id]);

  // Track search history
  useEffect(() => {
    if (medicine && isAuthenticated && user && !hasTracked.current) {
      hasTracked.current = true;
      supabase.from("search_history").insert({
        user_id: user.id,
        query: medicine.name,
        medicine_id: medicine.id,
        medicine_name: medicine.name,
      } as any);
    }
  }, [medicine, isAuthenticated, user]);

  // Auto-read on page load
  useEffect(() => {
    if (medicine && ttsAutoRead && ttsEnabled) {
      const text = t("medicineDetail.readAloudText", {
        name: medicine.name, generic: medicine.generic_name, description: medicine.description,
        dosage: medicine.dosage, price: medicine.price, sideEffects: medicine.side_effects.join(", "),
      });
      speak(text);
    }
    return () => stop();
  }, [medicine, ttsAutoRead, ttsEnabled]);

  const handleReadAloud = () => {
    if (isSpeaking) {
      stop();
    } else if (medicine) {
      const text = t("medicineDetail.readAloudText", {
        name: medicine.name, generic: medicine.generic_name, description: medicine.description,
        dosage: medicine.dosage, price: medicine.price, sideEffects: medicine.side_effects.join(", "),
      });
      speak(text);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6 text-4xl">💊</div>
            <h1 className="text-2xl font-bold font-display mb-2 text-foreground">{t("medicineDetail.notFound")}</h1>
            <p className="text-muted-foreground mb-6">{t("medicineDetail.notFoundDesc")}</p>
            <Link to="/medicines"><Button className="rounded-xl">{t("medicineDetail.browseMedicines")}</Button></Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const image = getMedicineImage(medicine.image_url);
  const infoCards = [
    { icon: Pill, label: t("medicineDetail.dosage"), value: medicine.dosage, color: "bg-primary/10 text-primary" },
    { icon: Building2, label: t("medicineDetail.manufacturer"), value: medicine.manufacturer, color: "bg-accent/10 text-accent" },
    { icon: DollarSign, label: t("medicineDetail.price"), value: medicine.price, color: "bg-secondary text-secondary-foreground" },
    ...(medicine.active_ingredient ? [{ icon: FlaskConical, label: t("medicineDetail.activeIngredient"), value: medicine.active_ingredient, color: "bg-primary/10 text-primary" }] : []),
    ...(medicine.form ? [{ icon: Package, label: t("medicineDetail.form"), value: medicine.form, color: "bg-accent/10 text-accent" }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/medicines" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> {t("medicineDetail.backToMedicines")}
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto md:min-h-[360px] bg-muted overflow-hidden">
                {image ? (
                  <img src={image} alt={medicine.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <Pill className="w-24 h-24 text-primary/20" />
                  </div>
                )}
                <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${getCategoryColor(medicine.category)}`} />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-3xl">{getCategoryIcon(medicine.category)}</span>
                  <Badge variant="outline" className="text-xs">{medicine.category}</Badge>
                  <Badge variant={medicine.requires_prescription ? "default" : "secondary"}>
                    {medicine.requires_prescription ? t("medicineDetail.prescriptionRequired") : t("medicineDetail.overTheCounter")}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold font-display text-foreground mt-2 mb-1">{medicine.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{medicine.generic_name}</p>
                <p className="text-2xl font-bold text-primary mb-4">{medicine.price}</p>

                {/* TTS & Video Controls */}
                <div className="flex items-center gap-3">
                  {ttsEnabled && (
                    <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handleReadAloud} disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      {isLoading ? t("medicineDetail.loadingAudio") : isSpeaking ? t("medicineDetail.stopReading") : t("medicineDetail.readAloud")}
                    </Button>
                  )}
                  {medicine.sign_language_video_url && (
                    <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={() => setShowVideo(!showVideo)}>
                      {showVideo ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      {showVideo ? t("medicineDetail.hideSignLanguage") : t("medicineDetail.showSignLanguage")}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-t border-border">
              {/* Sign Language Video */}
              {medicine.sign_language_video_url && showVideo && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold font-display text-foreground">{t("medicineDetail.signLanguageExplanation")}</h2>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden border border-border">
                    <iframe
                      src={medicine.sign_language_video_url}
                      title={`${medicine.name} Sign Language`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {infoCards.map((info, i) => (
                  <motion.div key={info.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="bg-muted/50 rounded-xl p-4 hover:shadow-card transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center`}>
                        <info.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{info.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{info.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold font-display text-foreground">{t("medicineDetail.description")}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{medicine.description}</p>
              </motion.div>

              {/* Side Effects */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="bg-destructive/5 rounded-xl p-5 border border-destructive/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h2 className="text-xl font-semibold font-display text-foreground">{t("medicineDetail.sideEffects")}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicine.side_effects.map((effect, i) => (
                    <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.05 }}
                      className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                      {effect}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Related Medicines */}
          {relatedMedicines.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <Stethoscope className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold font-display text-foreground">{t("medicineDetail.relatedMedicines")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedMedicines.map((med, i) => (
                  <MedicineCard key={med.id} medicine={med} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicineDetail;
