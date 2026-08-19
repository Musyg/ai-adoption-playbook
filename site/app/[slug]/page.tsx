import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeoArticlePage } from "../GeoArticlePage";
import { geoArticlePath, geoArticles, getAlternateArticle, getGeoArticle } from "../geo-content";

const canonicalBase = "https://musyg.github.io/ai-adoption-playbook";

export function generateStaticParams() {
  return geoArticles.filter((article) => article.locale === "en").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getGeoArticle("en", slug);
  if (!article) return {};
  const alternate = getAlternateArticle(article);
  const canonical = `${canonicalBase}${geoArticlePath(article)}`;

  return {
    title: { absolute: article.title },
    description: article.description,
    authors: [{ name: "Musyg", url: "https://github.com/Musyg" }],
    alternates: {
      canonical,
      languages: {
        en: canonical,
        fr: alternate ? `${canonicalBase}${geoArticlePath(alternate)}` : `${canonicalBase}/fr/`,
        "x-default": canonical,
      },
    },
    openGraph: { title: article.title, description: article.description, url: canonical, type: "article", locale: "en_US", alternateLocale: "fr_FR", images: [] },
    twitter: { card: "summary", title: article.title, description: article.description, images: [] },
  };
}

export default async function EnglishGeoArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getGeoArticle("en", slug);
  if (!article) notFound();
  return <GeoArticlePage article={article} />;
}
