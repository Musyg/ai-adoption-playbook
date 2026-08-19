import type { Metadata } from "next";
import { Playbook } from "../Playbook";

export const metadata: Metadata = {
  title: { absolute: "Playbook d’adoption de l’IA : pilotes, agents et gouvernance" },
  description:
    "Un guide pratique pour choisir le bon niveau d’intégration IA, mener un vrai pilote, mesurer les gains et encadrer des agents métier.",
  alternates: {
    canonical: "https://musyg.github.io/ai-adoption-playbook/fr/",
    languages: {
      en: "https://musyg.github.io/ai-adoption-playbook/",
      fr: "https://musyg.github.io/ai-adoption-playbook/fr/",
      "x-default": "https://musyg.github.io/ai-adoption-playbook/",
    },
  },
  openGraph: {
    title: "Playbook d’adoption de l’IA : pilotes, agents et gouvernance",
    description: "Choisir la bonne intégration IA, la tester sur un vrai workflow, mesurer le résultat et encadrer le passage en production.",
    url: "https://musyg.github.io/ai-adoption-playbook/fr/",
    locale: "fr_FR",
    alternateLocale: "en_US",
  },
};

export default function FrenchHome() {
  return <Playbook locale="fr" />;
}
