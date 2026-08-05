export type EmotionType =
  | "Cemas"
  | "Sedih"
  | "Kesepian"
  | "Lelah"
  | "Marah"
  | "Bingung"
  | "Mati rasa"
  | "Lumayan baik";

export interface EmotionOption {
  id: EmotionType;
  label: string;
  iconName: string;
  colorHex: string;
  bgHex: string;
  description: string;
}

export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export type NeedType =
  | "Cerita sebentar"
  | "Tenangkan diri"
  | "Pahami penyebabnya"
  | "Cari bantuan"
  | "Aku belum tahu";

export interface MoodCheckinResult {
  isCrisis: boolean;
  reflection: string;
  suggestedQuestion?: string;
  summary: {
    mainTopic: string;
    emotions: string[];
    possibleTriggers?: string;
    userNeed: string;
    nextStep: string;
  };
  recommendedSteps: string[];
}

export interface HelplineItem {
  id: "healing-119" | "psc-119" | "emergency-112";
  name: string;
  category: "Darurat";
  phone: "119" | "112";
  ext?: "8";
  website?: string;
  operatingHours: string;
  cost: "Gratis";
  format: "Telepon" | "Telepon & Web";
  city: "Nasional" | "Wilayah Cakupan 112";
  verifiedDate: string;
  description: string;
  isCrisisTarget?: boolean;
}

export interface SelfHelpResource {
  id: string;
  title: string;
  category:
    | "Cemas dan Overthinking"
    | "Kesepian"
    | "Stres Sekolah atau Kuliah"
    | "Keluarga"
    | "Pertemanan"
    | "Hubungan"
    | "Tidur dan Kelelahan"
    | "Percaya Diri"
    | "Meminta Bantuan";
  duration: string;
  format: "Latihan Praktis" | "Artikel Panduan" | "Template Pesan" | "Audio Breathing";
  reviewer: string;
  summary: string;
  contentMarkdown?: string;
  steps?: string[];
  isInteractiveExercise?: boolean;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  reviewer: string;
  updatedAt: string;
  excerpt: string;
  fullBody: string[];
}

export interface TestimonialItem {
  id: string;
  pseudonym: string;
  age: number;
  role: string;
  city: string;
  story: string;
  featureUsed: string;
  subjectiveOutcome: string;
  avatarSeed: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Umum" | "Keamanan & Privasi" | "AI & Fitur" | "Krisis & Bantuan";
}

export interface PartnershipProgram {
  title: string;
  target: string;
  description: string;
  features: string[];
}
