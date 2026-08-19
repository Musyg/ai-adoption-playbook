import type { Metadata } from "next";
import { Playbook } from "./Playbook";

export const metadata: Metadata = {
  title: { absolute: "AI Adoption Playbook: pilots, agents and governance" },
  description:
    "A practical playbook to choose the right AI integration, run a real pilot, measure gains, and govern business agents safely.",
  alternates: {
    canonical: "https://musyg.github.io/ai-adoption-playbook/",
    languages: {
      en: "https://musyg.github.io/ai-adoption-playbook/",
      fr: "https://musyg.github.io/ai-adoption-playbook/fr/",
      "x-default": "https://musyg.github.io/ai-adoption-playbook/",
    },
  },
  openGraph: {
    title: "AI Adoption Playbook: pilots, agents and governance",
    description: "Choose the right AI integration, test it on real work, measure the result, and govern the move to production.",
    url: "https://musyg.github.io/ai-adoption-playbook/",
    locale: "en_US",
    alternateLocale: "fr_FR",
  },
};

export default function Home() {
  return <Playbook locale="en" />;
}
