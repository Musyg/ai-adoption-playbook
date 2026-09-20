import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeoArticlePage } from "../GeoArticlePage";
import { geoArticlePath, geoArticles, getAlternateArticle, getGeoArticle } from "../geo-content";
import { siteUrlFor } from "../site-url";
import { authorFor } from "../editorial-metadata.mjs";

export function generateStaticParams() {
  return geoArticles.filter((article) => article.locale === "en").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getGeoArticle("en", slug);
  if (!article) return {};
  const alternate = getAlternateArticle(article);
  const canonical = siteUrlFor(geoArticlePath(article));
  const image = siteUrlFor("/og.png");
  const author = authorFor(article.locale);
  const alternateUrl = alternate ? siteUrlFor(geoArticlePath(alternate)) : siteUrlFor("/fr/");

  return {
    title: { absolute: article.title },
    description: article.description,
    authors: [{ name: author.name, url: author.url }],
    ...(canonical && alternateUrl ? { alternates: { canonical, languages: { en: canonical, fr: alternateUrl, "x-default": canonical } } } : {}),
    openGraph: { title: article.title, description: article.description, ...(canonical ? { url: canonical } : {}), type: "article", locale: "en_US", alternateLocale: "fr_FR", modifiedTime: article.dateModified, images: image ? [image] : [] },
    twitter: { card: image ? "summary_large_image" : "summary", title: article.title, description: article.description, images: image ? [image] : [] },
  };
}

export default async function EnglishGeoArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getGeoArticle("en", slug);
  if (!article) notFound();
  return <GeoArticlePage article={article} />;
}
