export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  description: string;
  dosage: string;
  side_effects: string[];
  price: string;
  manufacturer: string;
  requires_prescription: boolean;
  image_url: string | null;
  active_ingredient: string | null;
  form: string | null;
  sign_language_video_url: string | null;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export type AppRole = 'admin' | 'user' | 'company';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface SearchHistoryItem {
  id: string;
  user_id: string;
  query: string;
  medicine_id: string | null;
  medicine_name: string | null;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: string;
  tts_enabled: boolean;
  tts_auto_read: boolean;
  colorblind_mode: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}
