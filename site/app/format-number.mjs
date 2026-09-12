// ICU versions disagree on fr-CH grouping (apostrophe versus narrow space).
// Keep server HTML and browser hydration identical without changing rounding.
export function formatLocalizedNumber(value, locale, options = {}) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CH" : "en-GB", {
    ...options,
    numberingSystem: "latn",
  }).formatToParts(value).map((part) => {
    if (part.type === "group") return locale === "fr" ? "\u202f" : ",";
    if (part.type === "decimal") return locale === "fr" ? "," : ".";
    return part.value;
  }).join("");
}
