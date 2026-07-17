// Conversion between ITM (Israeli Transverse Mercator, EPSG:2039) and WGS84.
// Hand-rolled to avoid a proj4 dependency; accuracy ~1m, plenty for map pins.
// Pure module (no "use client") — usable anywhere and easy to unit-test.

// GRS80 ellipsoid
const A = 6378137.0;
const E2 = 0.00669438002290;

// ITM projection constants (EPSG:2039)
const K0 = 1.0000067;
const LON0 = (35.2045169444444 * Math.PI) / 180; // central meridian 35°12'16.261"
const LAT0 = (31.7343936111111 * Math.PI) / 180; // latitude of origin 31°44'03.817"
const FALSE_E = 219529.584;
const FALSE_N = 626907.39;

// WGS84 ellipsoid
const A_WGS = 6378137.0;
const E2_WGS = 0.00669437999014;

// GRS80(ITM datum)→WGS84 datum shift (meters)
const DX = -24.0024;
const DY = -17.1032;
const DZ = -17.8444;

function meridionalArc(lat: number, a: number, e2: number): number {
  const e4 = e2 * e2;
  const e6 = e4 * e2;
  return (
    a *
    ((1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * lat -
      ((3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * lat) +
      ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * lat) -
      ((35 * e6) / 3072) * Math.sin(6 * lat))
  );
}

/** Transverse Mercator forward: geodetic (rad) → grid, on given ellipsoid. */
function tmForward(lat: number, lon: number, a: number, e2: number): { x: number; y: number } {
  const slat = Math.sin(lat);
  const clat = Math.cos(lat);
  const nu = a / Math.sqrt(1 - e2 * slat * slat);
  const t = Math.tan(lat);
  const t2 = t * t;
  const ep2 = e2 / (1 - e2);
  const c = ep2 * clat * clat;
  const dlon = lon - LON0;
  const A1 = dlon * clat;
  const A2 = A1 * A1;
  const M = meridionalArc(lat, a, e2);
  const M0 = meridionalArc(LAT0, a, e2);

  const x =
    K0 * nu * (A1 + ((1 - t2 + c) * A2 * A1) / 6 + ((5 - 18 * t2 + t2 * t2 + 72 * c - 58 * ep2) * A2 * A2 * A1) / 120) +
    FALSE_E;
  const y =
    K0 *
      (M - M0 +
        nu * t * (A2 / 2 + ((5 - t2 + 9 * c + 4 * c * c) * A2 * A2) / 24 + ((61 - 58 * t2 + t2 * t2 + 600 * c - 330 * ep2) * A2 * A2 * A2) / 720)) +
    FALSE_N;
  return { x, y };
}

/** Transverse Mercator inverse: grid → geodetic (rad), on given ellipsoid. */
function tmInverse(x: number, y: number, a: number, e2: number): { lat: number; lon: number } {
  const M0 = meridionalArc(LAT0, a, e2);
  const M = M0 + (y - FALSE_N) / K0;
  const mu = M / (a * (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256));
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));

  const phi1 =
    mu +
    ((3 * e1) / 2 - (27 * e1 * e1 * e1) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32) * Math.sin(4 * mu) +
    ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * mu) +
    ((1097 * e1 * e1 * e1 * e1) / 512) * Math.sin(8 * mu);

  const s1 = Math.sin(phi1);
  const c1 = Math.cos(phi1);
  const t1 = Math.tan(phi1);
  const ep2 = e2 / (1 - e2);
  const c = ep2 * c1 * c1;
  const t2 = t1 * t1;
  const n1 = a / Math.sqrt(1 - e2 * s1 * s1);
  const r1 = (a * (1 - e2)) / Math.pow(1 - e2 * s1 * s1, 1.5);
  const d = (x - FALSE_E) / (n1 * K0);
  const d2 = d * d;

  const lat =
    phi1 -
    ((n1 * t1) / r1) *
      (d2 / 2 -
        ((5 + 3 * t2 + 10 * c - 4 * c * c - 9 * ep2) * d2 * d2) / 24 +
        ((61 + 90 * t2 + 298 * c + 45 * t2 * t2 - 252 * ep2 - 3 * c * c) * d2 * d2 * d2) / 720);
  const lon =
    LON0 +
    (d - ((1 + 2 * t2 + c) * d2 * d) / 6 + ((5 - 2 * c + 28 * t2 - 3 * c * c + 8 * ep2 + 24 * t2 * t2) * d2 * d2 * d) / 120) / c1;
  return { lat, lon };
}

function geodeticToXYZ(lat: number, lon: number, a: number, e2: number): [number, number, number] {
  const slat = Math.sin(lat);
  const clat = Math.cos(lat);
  const nu = a / Math.sqrt(1 - e2 * slat * slat);
  return [nu * clat * Math.cos(lon), nu * clat * Math.sin(lon), nu * (1 - e2) * slat];
}

function xyzToGeodetic(X: number, Y: number, Z: number, a: number, e2: number): { lat: number; lon: number } {
  const lon = Math.atan2(Y, X);
  const p = Math.sqrt(X * X + Y * Y);
  let lat = Math.atan2(Z, p * (1 - e2));
  for (let i = 0; i < 5; i++) {
    const slat = Math.sin(lat);
    const nu = a / Math.sqrt(1 - e2 * slat * slat);
    lat = Math.atan2(Z + e2 * nu * slat, p);
  }
  return { lat, lon };
}

/** ITM grid (EPSG:2039) → WGS84 lat/lng. */
export function itmToWgs84(x: number, y: number): { lat: number; lng: number } {
  const grs = tmInverse(x, y, A, E2);
  const [X, Y, Z] = geodeticToXYZ(grs.lat, grs.lon, A, E2);
  const w = xyzToGeodetic(X + DX, Y + DY, Z + DZ, A_WGS, E2_WGS);
  return { lat: (w.lat * 180) / Math.PI, lng: (w.lon * 180) / Math.PI };
}

/** WGS84 lat/lng → ITM grid (EPSG:2039). */
export function wgs84ToItm(lat: number, lng: number): { x: number; y: number } {
  const latR = (lat * Math.PI) / 180;
  const lngR = (lng * Math.PI) / 180;
  const [X, Y, Z] = geodeticToXYZ(latR, lngR, A_WGS, E2_WGS);
  const g = xyzToGeodetic(X - DX, Y - DY, Z - DZ, A, E2);
  return tmForward(g.lat, g.lon, A, E2);
}

/** Euclidean distance in meters between two ITM points (ITM is a metric grid). */
export function itmDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.round(Math.hypot(x2 - x1, y2 - y1));
}

/**
 * Web Mercator (EPSG:3857) → WGS84. The GovMap search-service returns
 * suggestion shapes as "POINT(x y)" in Web Mercator, not ITM.
 */
export function mercatorToWgs84(x: number, y: number): { lat: number; lng: number } {
  const R = 6378137;
  const lng = (x / R) * (180 / Math.PI);
  const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
  return { lat, lng };
}

/** WGS84 → Web Mercator (EPSG:3857) — the CRS entitiesByPoint expects. */
export function wgs84ToMercator(lat: number, lng: number): { x: number; y: number } {
  const R = 6378137;
  const x = (lng * Math.PI) / 180 * R;
  const y = R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return { x, y };
}
