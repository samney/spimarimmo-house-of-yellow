/* Route-safe encoding for directory identities (ADM-088/089).

   Organization keys and contact e-mails go into path segments, and both can
   legitimately contain dots — "sara@example.test", "Groupe S.A.". The i18n
   proxy's matcher deliberately skips any path containing a dot (that is how
   assets bypass the locale rewrite), so a raw identity in the path silently
   misses the middleware and 404s under `[locale]`.

   base64url is the narrowest fix: its alphabet is [A-Za-z0-9_-], so the
   segment can never look like an asset, and the identity round-trips exactly.
   The alternative — widening the proxy matcher — would touch every public
   route for the sake of two console screens. */

export function encodeRouteKey(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

/** Answers null for a malformed segment rather than throwing into a 500. */
export function decodeRouteKey(segment: string): string | null {
  try {
    const decoded = Buffer.from(segment, "base64url").toString("utf8");
    // Round-trip check: rejects segments that merely decode by coincidence.
    return encodeRouteKey(decoded) === segment ? decoded : null;
  } catch {
    return null;
  }
}
