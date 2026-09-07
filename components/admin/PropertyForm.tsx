"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Broker, ListingSource, Property, PropertyBrokerLink, PropertyType } from "@/lib/types";
import AddressAutocomplete from "@/components/admin/AddressAutocomplete";
import ImageManager from "@/components/admin/ImageManager";

const field =
  "w-full bg-black border border-gray-dark rounded-lg px-4 py-2.5 text-sm text-cream focus:border-gold outline-none transition-colors";
const label = "block text-xs text-gold tracking-wider uppercase mb-1.5";

interface Props {
  action: (formData: FormData) => Promise<void>;
  property?: Partial<Property>;
  defaultType?: PropertyType;
  /** Saved collaboration brokers, for the "מקור הנכס" picker. */
  brokers?: Broker[];
  /** This property's existing marketing-source record (edit mode). */
  brokerLink?: PropertyBrokerLink | null;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-gold flex-1 py-3 rounded-lg text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending && <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />}
      {pending ? (isEdit ? "שומר שינויים..." : "מפרסם...") : isEdit ? "שמור שינויים" : "פרסם נכס"}
    </button>
  );
}

export default function PropertyForm({
  action,
  property,
  defaultType,
  brokers = [],
  brokerLink,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const neighborhoodRef = useRef<HTMLInputElement>(null);

  const [listingSource, setListingSource] = useState<ListingSource>(
    brokerLink?.listing_source ?? "self"
  );
  const [brokerChoice, setBrokerChoice] = useState<string>(
    brokerLink?.broker_id ?? (brokers.length ? "" : "__new__")
  );

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-6">
      {property?.id && <input type="hidden" name="id" value={property.id} />}
      {property?.crm_id && <input type="hidden" name="crm_id" value={property.crm_id} />}

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
          <select className={field} name="type" defaultValue={property?.type ?? defaultType ?? "sale"}>
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
            step="1"
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

      {/* Floor + Balcony + Yard + Parking */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={label}>קומה</label>
          <input
            className={field}
            name="floor"
            type="number"
            step="0.5"
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
          <label className={label}>גודל חצר (מ״ר)</label>
          <input
            className={field}
            name="yard_sqm"
            type="number"
            step="0.5"
            min="0"
            defaultValue={property?.yard_sqm}
            placeholder="50"
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

      {/* Address — GovMap autocomplete pins the property on the map + auto-detects the neighborhood below */}
      <div>
        <label className={label}>כתובת *</label>
        <AddressAutocomplete
          defaultValue={property?.address}
          defaultLat={property?.lat}
          defaultLng={property?.lng}
          onNeighborhoodDetected={(name) => {
            if (neighborhoodRef.current) neighborhoodRef.current.value = name;
          }}
        />
        <div className="mt-2">
          <label className="block text-[11px] text-gray-light mb-1">
            מה להציג באתר
          </label>
          <select
            className={field}
            name="address_visibility"
            defaultValue={property?.address_visibility ?? "full"}
          >
            <option value="full">כתובת מלאה (רחוב + מספר בית)</option>
            <option value="street">רחוב בלבד (בלי מספר בית)</option>
            <option value="neighborhood">שכונה בלבד (בלי הרחוב)</option>
          </select>
          <p className="text-[11px] text-gray-light/70 mt-1">
            המפה בעמוד הנכס נשארת מדויקת בכל מקרה — זה משפיע רק על טקסט הכתובת.
          </p>
        </div>
      </div>

      {/* Neighborhood + City */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>שכונה * <span className="text-gray-light normal-case tracking-normal">(מזוהה אוטומטית מהכתובת, ניתן לערוך)</span></label>
          <input
            ref={neighborhoodRef}
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
        <label className={label}>תמונות הנכס</label>
        <ImageManager name="images" defaultImages={property?.images ?? []} />
      </div>

      {/* Listing source — admin-only. Broker details never reach the public site. */}
      <div className="rounded-lg border border-gray-dark bg-black/30 p-4">
        <label className={label}>מקור הנכס</label>
        <p className="text-[11px] text-gray-light/70 -mt-1 mb-3">
          לשימוש פנימי בלבד — לא מוצג באתר. כל הנכסים מופיעים באתר עם הפרטים שלך.
        </p>
        <div className="flex flex-col gap-2 mb-3">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-cream">
            <input
              type="radio"
              name="listing_source"
              value="self"
              checked={listingSource === "self"}
              onChange={() => setListingSource("self")}
              className="w-4 h-4 accent-gold"
            />
            הנכס שלי
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-cream">
            <input
              type="radio"
              name="listing_source"
              value="collab"
              checked={listingSource === "collab"}
              onChange={() => setListingSource("collab")}
              className="w-4 h-4 accent-gold"
            />
            בשיתוף פעולה עם מתווך אחר
          </label>
        </div>

        {listingSource === "collab" && (
          <div className="flex flex-col gap-3 pt-1">
            {brokers.length > 0 && (
              <div>
                <label className="block text-[11px] text-gray-light mb-1">בחר מתווך</label>
                <select
                  className={field}
                  name="broker_id"
                  value={brokerChoice}
                  onChange={(e) => setBrokerChoice(e.target.value)}
                >
                  <option value="" disabled>
                    בחר מתווך שמור…
                  </option>
                  {brokers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                      {b.agency ? ` — ${b.agency}` : ""}
                      {b.phone ? ` · ${b.phone}` : ""}
                    </option>
                  ))}
                  <option value="__new__">➕ מתווך חדש…</option>
                </select>
              </div>
            )}
            {brokers.length > 0 && brokerChoice !== "__new__" ? null : (
              <div className="grid sm:grid-cols-2 gap-3">
                {brokers.length === 0 && <input type="hidden" name="broker_id" value="__new__" />}
                <div>
                  <label className="block text-[11px] text-gray-light mb-1">שם המתווך *</label>
                  <input className={field} name="broker_new_name" placeholder="ישראל ישראלי" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-light mb-1">טלפון</label>
                  <input className={field} name="broker_new_phone" dir="ltr" placeholder="054-000-0000" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-light mb-1">משרד / סוכנות</label>
                  <input className={field} name="broker_new_agency" placeholder="רי/מקס, אנגלו סכסון…" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-light mb-1">הערות</label>
                  <input className={field} name="broker_new_notes" placeholder="אחוז עמלה, איש קשר…" />
                </div>
              </div>
            )}
          </div>
        )}
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
        <SubmitButton isEdit={!!property?.id} />
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
