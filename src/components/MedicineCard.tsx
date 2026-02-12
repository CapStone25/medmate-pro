import { Link } from "react-router-dom";
import { Medicine } from "@/types";
import { getCategoryColor } from "@/utils/medicineImages";
import { getMedicineImage } from "@/utils/medicineImages";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Pill } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MedicineCardProps {
  medicine: Medicine;
  index?: number;
}

const MedicineCard = ({ medicine, index = 0 }: MedicineCardProps) => {
  const image = getMedicineImage(medicine.image_url);
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link to={`/medicine/${medicine.id}`}>
        <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
          <div className="relative h-36 sm:h-48 overflow-hidden bg-muted">
            {image ? (
              <img
                src={image}
                alt={medicine.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <Pill className="w-16 h-16 text-primary/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <Badge
              variant={medicine.requires_prescription ? "default" : "secondary"}
              className="absolute top-3 right-3 text-xs backdrop-blur-sm"
            >
              {medicine.requires_prescription ? t("medicineDetail.rxRequired") : t("medicineDetail.otc")}
            </Badge>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(medicine.category)}`} />
          </div>

          <div className="p-3 sm:p-4 flex flex-col flex-1">
            <h3 className="text-base sm:text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors duration-300 mb-0.5 line-clamp-1">
              {medicine.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2 line-clamp-1">{medicine.generic_name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed flex-1">
              {medicine.description}
            </p>
            <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">{medicine.price}</span>
                {medicine.form && (
                  <span className="text-xs text-muted-foreground">· {medicine.form}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                Details <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MedicineCard;
