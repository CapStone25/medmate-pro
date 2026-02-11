// Medicine image URLs - using placeholder service for demo
// In production, these would be actual image URLs from your CDN or database

export const getMedicineImage = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  // Return the URL if it's already a full URL (from Supabase or external source)
  if (imageUrl.startsWith("http")) return imageUrl;
  // Otherwise return null to use placeholder
  return null;
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
