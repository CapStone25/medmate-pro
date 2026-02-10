import { Link } from "react-router-dom";
import { Medicine } from "@/types";
import { getCategoryColor } from "@/data/medicines";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface MedicineCardProps {
  medicine: Medicine;
  index?: number;
}

const MedicineCard = ({ medicine, index = 0 }: MedicineCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link to={`/medicine/${medicine.id}`}>
        <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1">
          {/* Medicine Image */}
          <div className="relative h-48 overflow-hidden bg-muted">
            <img
              src={medicine.image}
              alt={medicine.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <Badge
              variant={medicine.requiresPrescription ? "default" : "secondary"}
              className="absolute top-3 right-3 text-xs backdrop-blur-sm"
            >
              {medicine.requiresPrescription ? "Rx Required" : "OTC"}
            </Badge>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(medicine.category)}`} />
          </div>

          <div className="p-4">
            {/* Name and generic */}
            <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors duration-300 mb-0.5 line-clamp-1">
              {medicine.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{medicine.genericName}</p>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {medicine.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
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
