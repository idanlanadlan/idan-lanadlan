export function isValidPhone(raw: string): boolean {
  const cleaned = raw.replace(/[\s\-().]/g, "");
  if (!cleaned) return false;
  if (/^05\d{8}$/.test(cleaned)) return true;
  if (/^07\d{8}$/.test(cleaned)) return true;
  if (/^0[23489]\d{7}$/.test(cleaned)) return true;
  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) return true;
  return false;
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}
