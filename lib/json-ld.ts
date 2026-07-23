/**
 * Serializes a JSON-LD object for embedding inside a `<script
 * type="application/ld+json">` tag. `JSON.stringify` alone does not escape
 * "<", so a value containing the literal substring "</script>" (e.g. a
 * property description copied verbatim from an external CRM feed) would
 * prematurely close the script tag and inject raw, unescaped HTML into the
 * page for every visitor. Escaping "<" to its unicode form is safe inside
 * a JSON string and defuses this without affecting the parsed JSON value.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
