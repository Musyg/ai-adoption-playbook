import type { Metadata } from "next";
import { Playbook } from "./Playbook";
import { siteUrlFor } from "./site-url";

const englishUrl = siteUrlFor("/");
const frenchUrl = siteUrlFor("/fr/");

export const metadata: Metadata = {
  title: { absolute: "AI Adoption Playbook: pilots, agents and governance" },
  description:
    "A practical playbook to choose the right AI integration, run a real pilot, measure gains, and govern business agents safely.",
  ...(englishUrl && frenchUrl ? { alternates: { canonical: englishUrl, languages: { en: englishUrl, fr: frenchUrl, "x-default": englishUrl } } } : {}),
  openGraph: {
    title: "AI Adoption Playbook: pilots, agents and governance",
    description: "Choose the right AI integration, test it on real work, measure the result, and govern the move to production.",
    ...(englishUrl ? { url: englishUrl } : {}),
    locale: "en_US",
    alternateLocale: "fr_FR",
  },
};

export default function Home() {
  return <Playbook locale="en" />;
}
