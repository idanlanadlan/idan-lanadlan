export type PropertyType = "sale" | "rent" | "project";
export type PropertyStatus = "available" | "sold" | "rented";
/** How much of the address the public site reveals for a property.
 *  full = street + house number (default), street = street name only,
 *  neighborhood = neighborhood + city only, no street. */
export type AddressVisibility = "full" | "street" | "neighborhood";

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
  yard_sqm?: number;
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
  address_visibility?: AddressVisibility;
}

/** A co-operating broker on a collaboration listing. Admin-only — broker
 *  details are never sent to the public site (see lib/db.ts). */
export interface Broker {
  id: string;
  name: string;
  phone: string;
  agency: string;
  notes: string;
  created_at: string;
}

export type ListingSource = "self" | "collab";

/** Per-property record of who is marketing it. Absent = "self" (mine).
 *  Admin-only — lives in its own table, never joined into public queries. */
export interface PropertyBrokerLink {
  property_id: string;
  listing_source: ListingSource;
  broker_id: string | null;
  updated_at: string;
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

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

/** An email-newsletter subscriber. Admin-only table (service-role RLS).
 *  consent_at + confirmed_at are the Amendment-40 consent record. */
export interface Subscriber {
  id: string;
  email: string;
  name: string;
  status: SubscriberStatus;
  confirm_token: string;
  unsubscribe_token: string;
  wants_new_listings: boolean;
  wants_weekly_digest: boolean;
  consent_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
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
