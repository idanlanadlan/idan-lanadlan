export type PropertyType = "sale" | "rent" | "project";
export type PropertyStatus = "available" | "sold" | "rented";

export interface Property {
  id: string;
  title: string;
  price: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  toilets?: number;
  size_sqm: number;
  balcony_sqm?: number;
  floor?: number;
  parking_spots?: number;
  has_mamad?: boolean;
  has_shelter?: boolean;
  has_elevator?: boolean;
  address: string;
  neighborhood: string;
  city: string;
  description: string;
  title_en?: string;
  title_fr?: string;
  description_en?: string;
  description_fr?: string;
  neighborhood_en?: string;
  neighborhood_fr?: string;
  city_en?: string;
  city_fr?: string;
  images: string[];
  status: PropertyStatus;
  featured: boolean;
  created_at: string;
  lat?: number | null;
  lng?: number | null;
  crm_id?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  keywords: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: "google" | "direct";
  featured: boolean;
  created_at: string;
}
