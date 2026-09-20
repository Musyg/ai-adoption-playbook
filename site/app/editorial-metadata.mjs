// Editorial dates, not build timestamps. Update after a substantive revision.
export const homeModified = { en: "2026-09-12", fr: "2026-09-12" };

/** @param {string} locale */
export function authorFor(locale) {
  return {
    "@type": "Person",
    "@id": "https://musyg.com/#person",
    name: "Gilles Musy",
    alternateName: "Musyg",
    url: locale === "fr" ? "https://musyg.com/fr/a-propos/" : "https://musyg.com/about/",
    sameAs: ["https://github.com/Musyg"],
  };
}

/** @param {string} value @param {string} locale */
export function formatEditorialDate(value, locale) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)
    || !Number.isFinite(Date.parse(`${value}T00:00:00Z`))
    || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid editorial date: ${value}`);
  }
  // Explicit month names keep server and browser output identical across ICU versions.
  const months = locale === "fr"
    ? ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [year, month, day] = value.split("-");
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}
