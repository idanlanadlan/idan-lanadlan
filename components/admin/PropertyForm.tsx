"use client";

import { useRef } from "react";
import type { Property } from "@/lib/types";
import AddressAutocomplete from "@/components/admin/AddressAutocomplete";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream placeholder:text-gray focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

interface Props {
  action: (formData: FormData) => Promise<void>;
  property?: Property;
}

export default function PropertyForm({ action, property }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-6">
      {property && <input type="hidden" name="id" value={property.id} />}

      {/* Title */}
      <div>
        <label className={label}>כותרת הנכס *</label>
        <input
          className={field}
          name="title"
          required
          defaultValue={property?.title}
          placeholder="פנטהאוז יוקרה עם נוף לים — נמל תל אביב"
        />
      </div>

      {/* Price + Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>מחיר (₪) *</label>
          <input
            className={field}
            name="price"
            type="number"
            required
            min="0"
            defaultValue={property?.price}
            placeholder="4500000"
          />
        </div>
        <div>
          <label className={label}>סוג עסקה *</label>
          <select className={field} name="type" defaultValue={property?.type ?? "sale"}>
            <option value="sale">למכירה</option>
            <option value="rent">להשכרה</option>
            <option value="project">פרויקט</option>
          </select>
        </div>
      </div>

      {/* Rooms + Bathrooms + Toilets + sqm */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={label}>חדרים *</label>
          <input
            className={field}
            name="bedrooms"
            type="number"
            step="0.5"
            required
            min="0"
            defaultValue={property?.bedrooms}
            placeholder="4"
          />
        </div>
        <div>
          <label className={label}>מקלחות *</label>
          <input
            className={field}
            name="bathrooms"
            type="number"
            step="0.5"
            required
            min="0"
            defaultValue={property?.bathrooms}
            placeholder="2"
          />
        </div>
        <div>
          <label className={label}>שירותים</label>
          <input
            className={field}
            name="toilets"
            type="number"
            step="1"
            min="0"
            defaultValue={property?.toilets}
            placeholder="1"
          />
        </div>
        <div>
          <label className={label}>מ״ר נטו *</label>
          <input
            className={field}
            name="size_sqm"
            type="number"
            required
            min="0"
            defaultValue={property?.size_sqm}
            placeholder="120"
          />
        </div>
      </div>

      {/* Floor + Balcony + Parking */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className={label}>קומה</label>
          <input
            className={field}
            name="floor"
            type="number"
            min="0"
            defaultValue={property?.floor}
            placeholder="5"
          />
        </div>
        <div>
          <label className={label}>גודל מרפסת (מ״ר)</label>
          <input
            className={field}
            name="balcony_sqm"
            type="number"
            step="0.5"
            min="0"
            defaultValue={property?.balcony_sqm}
            placeholder="10"
          />
        </div>
        <div>
          <label className={label}>מקומות חניה</label>
          <input
            className={field}
            name="parking_spots"
            type="number"
            step="1"
            min="0"
            defaultValue={property?.parking_spots}
            placeholder="1"
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="grid grid-cols-3 gap-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="has_elevator"
            defaultChecked={property?.has_elevator ?? false}
            className="w-4 h-4 accent-gold"
          />
          <span className="text-sm text-cream">מעלית</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="has_mamad"
            defaultChecked={property?.has_mamad ?? false}
            className="w-4 h-4 accent-gold"
          />
          <span className="text-sm text-cream">ממ״ד</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="has_shelter"
            defaultChecked={property?.has_shelter ?? false}
            className="w-4 h-4 accent-gold"
          />
          <span className="text-sm text-cream">מקלט</span>
        </label>
      </div>

      {/* Address — GovMap autocomplete pins the property on the map */}
      <div>
        <label className={label}>כתובת *</label>
        <AddressAutocomplete
          defaultValue={property?.address}
          defaultLat={property?.lat}
          defaultLng={property?.lng}
        />
      </div>

      {/* Neighborhood + City */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>שכונה *</label>
          <input
            className={field}
            name="neighborhood"
            required
            defaultValue={property?.neighborhood}
            placeholder="נמל תל אביב"
          />
        </div>
        <div>
          <label className={label}>עיר *</label>
          <input
            className={field}
            name="city"
            required
            defaultValue={property?.city ?? "תל אביב"}
            placeholder="תל אביב"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={label}>תיאור הנכס</label>
        <textarea
          className={`${field} h-36 resize-none`}
          name="description"
          defaultValue={property?.description}
          placeholder="תאר את הנכס בפירוט — מה מיוחד, גימור, נוף, קרבה לתחבורה..."
        />
      </div>

      {/* Images */}
      <div>
        <label className={label}>קישורי תמונות (שורה לכל תמונה)</label>
        <textarea
          className={`${field} h-24 resize-none font-mono text-xs`}
          name="images"
          defaultValue={(property?.images ?? []).join("\n")}
          placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
        />
        <p className="text-[10px] text-gray mt-1">ניתן להשתמש בלינקים ממאגר תמונות כמו Cloudinary, Google Drive, Dropbox וכו׳</p>
      </div>

      {/* Status + Featured */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>סטטוס</label>
          <select className={field} name="status" defaultValue={property?.status ?? "available"}>
            <option value="available">זמין</option>
            <option value="sold">נמכר</option>
            <option value="rented">הושכר</option>
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={property?.featured ?? true}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-sm text-cream">הצג בעמוד הבית</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="btn-gold flex-1 py-3 rounded-lg text-sm font-semibold"
        >
          {property ? "שמור שינויים" : "פרסם נכס"}
        </button>
        <a
          href="/admin/properties"
          className="px-6 py-3 rounded-lg text-sm text-gray-light border border-gray-dark hover:border-gold/40 hover:text-gold transition-colors"
        >
          ביטול
        </a>
      </div>
    </form>
  );
}
