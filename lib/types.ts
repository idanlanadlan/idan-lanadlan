export type PropertyType = "sale" | "rent" | "project";
export type PropertyStatus = "available" | "sold" | "rented";

export function isPropertyType(value: string | undefined): value is PropertyType {
  return value === "sale" || value === "rent" || value === "project";
}

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
  address_en?: string;
  address_fr?: string;
  address_es?: string;
  neighborhood: string;
  city: string;
  description: string;
  title_en?: string;
  title_fr?: string;
  title_es?: string;
  description_en?: string;
  description_fr?: string;
  description_es?: string;
  neighborhood_en?: string;
  neighborhood_fr?: string;
  neighborhood_es?: string;
  city_en?: string;
  city_fr?: string;
  city_es?: string;
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
  featured?: boolean;
  created_at: string;
  updated_at: string;
  title_en?: string;
  title_fr?: string;
  title_es?: string;
  excerpt_en?: string;
  excerpt_fr?: string;
  excerpt_es?: string;
  content_en?: string;
  content_fr?: string;
  content_es?: string;
  keywords_en?: string[];
  keywords_fr?: string[];
  keywords_es?: string[];
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
