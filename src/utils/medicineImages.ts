import amoxicillinImg from "@/assets/medicines/amoxicillin.jpg";
import ibuprofenImg from "@/assets/medicines/ibuprofen.jpg";
import metforminImg from "@/assets/medicines/metformin.jpg";
import lisinoprilImg from "@/assets/medicines/lisinopril.jpg";
import omeprazoleImg from "@/assets/medicines/omeprazole.jpg";
import cetirizineImg from "@/assets/medicines/cetirizine.jpg";
import atorvastatinImg from "@/assets/medicines/atorvastatin.jpg";
import paracetamolImg from "@/assets/medicines/paracetamol.jpg";
import azithromycinImg from "@/assets/medicines/azithromycin.jpg";
import salbutamolImg from "@/assets/medicines/salbutamol.jpg";
import losartanImg from "@/assets/medicines/losartan.jpg";
import ciprofloxacinImg from "@/assets/medicines/ciprofloxacin.jpg";
import milgaImg from "@/assets/medicines/milga.png";

const imageMap: Record<string, string> = {
  amoxicillin: amoxicillinImg,
  ibuprofen: ibuprofenImg,
  metformin: metforminImg,
  lisinopril: lisinoprilImg,
  omeprazole: omeprazoleImg,
  cetirizine: cetirizineImg,
  atorvastatin: atorvastatinImg,
  paracetamol: paracetamolImg,
  azithromycin: azithromycinImg,
  salbutamol: salbutamolImg,
  losartan: losartanImg,
  ciprofloxacin: ciprofloxacinImg,
  milga: milgaImg,
};

export const getMedicineImage = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  return imageMap[imageUrl] || imageUrl;
};

export const categories = [
  "All",
  "Antibiotic",
  "Pain Relief",
  "Diabetes",
  "Blood Pressure",
  "Digestive",
  "Allergy",
  "Cholesterol",
  "Respiratory",
  "Nerve Tonic",
  "Blood Thinner",
  "Thyroid",
  "Anti-inflammatory",
  "Nerve Pain",
  "Mental Health",
  "Antifungal",
];

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Antibiotic: "from-blue-500 to-blue-600",
    "Pain Relief": "from-orange-400 to-orange-500",
    Diabetes: "from-violet-500 to-violet-600",
    "Blood Pressure": "from-red-400 to-red-500",
    Digestive: "from-emerald-400 to-emerald-500",
    Allergy: "from-amber-400 to-amber-500",
    Cholesterol: "from-pink-400 to-pink-500",
    Respiratory: "from-cyan-400 to-cyan-500",
    "Nerve Tonic": "from-rose-400 to-rose-500",
    "Blood Thinner": "from-red-500 to-red-600",
    Thyroid: "from-purple-400 to-purple-500",
    "Anti-inflammatory": "from-teal-400 to-teal-500",
    "Nerve Pain": "from-indigo-400 to-indigo-500",
    "Mental Health": "from-sky-400 to-sky-500",
    Antifungal: "from-lime-500 to-lime-600",
  };
  return colors[category] || "from-gray-400 to-gray-500";
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Antibiotic: "💊",
    "Pain Relief": "🩹",
    Diabetes: "🩸",
    "Blood Pressure": "❤️",
    Digestive: "🫁",
    Allergy: "🤧",
    Cholesterol: "🧬",
    Respiratory: "🌬️",
    "Nerve Tonic": "🧠",
    "Blood Thinner": "🩸",
    Thyroid: "⚡",
    "Anti-inflammatory": "🔥",
    "Nerve Pain": "⚡",
    "Mental Health": "🧠",
    Antifungal: "🛡️",
  };
  return icons[category] || "💊";
};
