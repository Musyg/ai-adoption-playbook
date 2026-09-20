import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documents, alternateDocument, libraryPath } from "./document-manifest.mjs";
import { loadDocument, documentBody, libraryBody } from "../scripts/document-reader.mjs";
import { siteUrlFor } from "./site-url";
import { authorFor } from "./editorial-metadata.mjs";

export async function documentMetadata(locale: "en" | "fr", slug?: string): Promise<Metadata> {
  const doc = slug ? documents.find((item) => item.locale === locale && item.id === slug) : undefined;
  if (slug && !doc) return {};
  const loaded = doc ? await loadDocument(doc) : undefined;
  const title = loaded?.title ?? (locale === "fr" ? "Bibliothèque du guide" : "Guide library");
  const description = loaded?.description ?? (locale === "fr" ? "Tous les parcours, méthodes, exemples et modèles du guide d’adoption de l’IA." : "All AI adoption playbook tracks, methods, examples and templates.");
  const canonical = siteUrlFor(doc?.path ?? libraryPath(locale));
  const alternate = doc ? alternateDocument(doc) : { locale: locale === "fr" ? "en" : "fr", path: libraryPath(locale === "fr" ? "en" : "fr") };
  const image = siteUrlFor("/og.png");
  return {
    title: { absolute: title }, description, authors: [{ name: "Gilles Musy", url: authorFor(locale).url }],
    ...(canonical ? { alternates: { canonical, ...(alternate ? { languages: { [locale]: canonical, [alternate.locale]: siteUrlFor(alternate.path)!, "x-default": locale === "en" ? canonical : siteUrlFor(alternate.path)! } } : {}) } } : {}),
    openGraph: { title, description, type: "article", ...(canonical ? { url: canonical } : {}), images: image ? [image] : [] },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : [] },
  };
}

export async function DocumentPage({ locale, slug }: { locale: "en" | "fr"; slug?: string }) {
  if (!slug) return <div dangerouslySetInnerHTML={{ __html: await libraryBody(locale) }} />;
  const doc = documents.find((item) => item.locale === locale && item.id === slug);
  if (!doc) notFound();
  return <div dangerouslySetInnerHTML={{ __html: documentBody(await loadDocument(doc)) }} />;
}
