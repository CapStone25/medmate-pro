export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  dosage: string;
  sideEffects: string[];
  price: string;
  manufacturer: string;
  requiresPrescription: boolean;
  image: string;
  activeIngredient?: string;
  form?: string;
}

export type UserRole = 'admin' | 'user' | 'company';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName?: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  medicineId?: string;
  medicineName?: string;
}
