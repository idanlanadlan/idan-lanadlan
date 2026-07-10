// GovMap layer IDs used by the site. The official appendix ("נספח א'") wasn't
// machine-readable, so IDs are confirmed one by one on the discovery page
// (/admin/govmap-test) before a feature that depends on them ships.
// null = not yet verified; features must skip categories whose ID is null.

export const LAYERS = {
  /** גבולות חלקות (גוש/חלקה) */
  PARCELS: "PARCEL_ALL" as string | null,
  /** תוכניות בניין עיר */
  TABA: null as string | null,
  /** מוסדות חינוך */
  EDUCATION: null as string | null,
  /** תחנות מטרו / רכבת קלה */
  TRANSIT: null as string | null,
  /** מקלטים ציבוריים */
  SHELTERS: null as string | null,
  /** אנטנות סלולריות */
  ANTENNAS: null as string | null,
};
