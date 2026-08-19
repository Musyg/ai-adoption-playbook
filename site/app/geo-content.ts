import rawArticles from "./geo-pages.json";

export type GeoLocale = "en" | "fr";

export type GeoArticle = {
  id: string;
  locale: GeoLocale;
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  answer: string;
  updated: string;
  readingTime: string;
  takeaways: string[];
  comparison: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
  caseStudy: {
    title: string;
    text: string;
    metrics: string[];
  };
  sources: Array<{
    label: string;
    url: string;
    note: string;
  }>;
  relatedIds: string[];
};

export const geoArticles = rawArticles as GeoArticle[];

export function getGeoArticle(locale: GeoLocale, slug: string) {
  return geoArticles.find((article) => article.locale === locale && article.slug === slug);
}

export function getAlternateArticle(article: GeoArticle) {
  return geoArticles.find((candidate) => candidate.id === article.id && candidate.locale !== article.locale);
}

export function getRelatedArticles(article: GeoArticle) {
  return article.relatedIds
    .map((id) => geoArticles.find((candidate) => candidate.id === id && candidate.locale === article.locale))
    .filter((candidate): candidate is GeoArticle => Boolean(candidate));
}

export function geoArticlePath(article: GeoArticle) {
  return article.locale === "fr" ? `/fr/${article.slug}/` : `/${article.slug}/`;
}
