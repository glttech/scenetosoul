/**
 * Local-timezone date helpers.
 *
 * `<input type="date">` and the calendar work with local calendar days, but
 * `Date.toISOString()` converts to UTC — which shifts the day for users in
 * positive offsets (e.g. IST, UTC+5:30). These helpers keep everything in the
 * user's local day so a story scheduled for the 24th shows up on the 24th.
 */

/** Returns a local-timezone YYYY-MM-DD string. */
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Today as a local YYYY-MM-DD string. */
export function todayISO(): string {
  return toLocalISODate(new Date());
}

/** Parse a YYYY-MM-DD string into a local Date (no UTC shift). */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Friendly date label, e.g. "Wed, 24 Jun". */
export function formatDay(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
