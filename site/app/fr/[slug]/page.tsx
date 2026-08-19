import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeoArticlePage } from "../../GeoArticlePage";
import { geoArticlePath, geoArticles, getAlternateArticle, getGeoArticle } from "../../geo-content";
import { siteUrlFor } from "../../site-url";

export function generateStaticParams() {
  return geoArticles.filter((article) => article.locale === "fr").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getGeoArticle("fr", slug);
  if (!article) return {};
  const alternate = getAlternateArticle(article);
  const canonical = siteUrlFor(geoArticlePath(article));
  const alternateUrl = alternate ? siteUrlFor(geoArticlePath(alternate)) : siteUrlFor("/");

  return {
    title: { absolute: article.title },
    description: article.description,
    authors: [{ name: "Musyg", url: "https://github.com/Musyg" }],
    ...(canonical && alternateUrl ? { alternates: { canonical, languages: { en: alternateUrl, fr: canonical, "x-default": alternateUrl } } } : {}),
    openGraph: { title: article.title, description: article.description, ...(canonical ? { url: canonical } : {}), type: "article", locale: "fr_FR", alternateLocale: "en_US", images: [] },
    twitter: { card: "summary", title: article.title, description: article.description, images: [] },
  };
}

export default async function FrenchGeoArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getGeoArticle("fr", slug);
  if (!article) notFound();
  return <GeoArticlePage article={article} />;
}
