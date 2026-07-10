// Minimal typings for the GovMap browser API (govmap.api.js).
// The library is loaded at runtime by lib/govmap/loader.ts.

export interface GovMapGeocodeResponse {
  data?: {
    X?: number;
    Y?: number;
    ResultCode?: number;
    ResultLable?: string;
    AddressInfo?: unknown;
  };
  X?: number;
  Y?: number;
  ResultCode?: number;
  // The exact envelope is verified on the discovery page; keep both shapes.
  [key: string]: unknown;
}

export interface GovMapSearchAndLocateResult {
  ObjectId?: number;
  Values?: (string | number)[];
  settlementCode?: number;
  streetCode?: number;
  [key: string]: unknown;
}

export interface GovMapAPI {
  createMap: (divId: string, options: Record<string, unknown>) => unknown;
  geocode: (params: { keyword: string; type: number }) => PromiseLike<GovMapGeocodeResponse>;
  searchAndLocate: (params: {
    type: number;
    address?: string;
    lot?: number;
    parcel?: number;
  }) => PromiseLike<{ data?: GovMapSearchAndLocateResult[] } | GovMapSearchAndLocateResult[]>;
  identifyByXYandLayer?: (params: Record<string, unknown>) => PromiseLike<unknown>;
  getLayerData?: (params: Record<string, unknown>) => PromiseLike<unknown>;
  intersectFeatures?: (params: Record<string, unknown>) => PromiseLike<unknown>;
  setVisibleLayers?: (layersOn: string[], layersOff: string[]) => void;
  geocodeType: { FullResult: number; AccuracyOnly: number };
  locateType: { lotParcelToAddress: number; addressToLotParcel: number };
  [key: string]: unknown;
}

declare global {
  interface Window {
    govmap?: GovMapAPI;
    jQuery?: unknown;
    $?: unknown;
  }
}
