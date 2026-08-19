import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeoArticlePage } from "../../GeoArticlePage";
import { geoArticlePath, geoArticles, getAlternateArticle, getGeoArticle } from "../../geo-content";

const canonicalBase = "https://musyg.github.io/ai-adoption-playbook";

export function generateStaticParams() {
  return geoArticles.filter((article) => article.locale === "fr").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getGeoArticle("fr", slug);
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
        en: alternate ? `${canonicalBase}${geoArticlePath(alternate)}` : `${canonicalBase}/`,
        fr: canonical,
        "x-default": alternate ? `${canonicalBase}${geoArticlePath(alternate)}` : `${canonicalBase}/`,
      },
    },
    openGraph: { title: article.title, description: article.description, url: canonical, type: "article", locale: "fr_FR", alternateLocale: "en_US", images: [] },
    twitter: { card: "summary", title: article.title, description: article.description, images: [] },
  };
}

export default async function FrenchGeoArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getGeoArticle("fr", slug);
  if (!article) notFound();
  return <GeoArticlePage article={article} />;
}
