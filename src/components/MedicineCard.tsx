import { Link } from "react-router-dom";
import { Medicine } from "@/types";
import { getCategoryColor, getCategoryIcon } from "@/data/medicines";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";

interface MedicineCardProps {
  medicine: Medicine;
  index?: number;
}

const MedicineCard = ({ medicine, index = 0 }: MedicineCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/medicine/${medicine.id}`}>
        <div className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1">
          {/* Category color stripe */}
          <div className={`h-2 w-full bg-gradient-to-r ${getCategoryColor(medicine.category)}`} />

          <div className="p-5">
            {/* Header with icon and category */}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(medicine.category)} flex items-center justify-center text-xl shadow-md`}>
                {getCategoryIcon(medicine.category)}
              </div>
              <Badge variant={medicine.requiresPrescription ? "default" : "secondary"} className="text-xs">
                {medicine.requiresPrescription ? "Rx Required" : "OTC"}
              </Badge>
            </div>

            {/* Name and generic */}
            <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors mb-1">
              {medicine.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{medicine.genericName}</p>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {medicine.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{medicine.category}</span>
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
