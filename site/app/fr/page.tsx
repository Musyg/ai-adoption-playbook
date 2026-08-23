import type { Metadata } from "next";
import { Playbook } from "../Playbook";
import { siteUrlFor } from "../site-url";

const englishUrl = siteUrlFor("/");
const frenchUrl = siteUrlFor("/fr/");

export const metadata: Metadata = {
  title: { absolute: "Playbook d’adoption de l’IA : pilotes, agents et gouvernance" },
  description:
    "Un guide pratique pour choisir le bon mode de travail, l’architecture et la limite d’action de l’IA, mener un vrai pilote et mesurer les gains.",
  ...(englishUrl && frenchUrl ? { alternates: { canonical: frenchUrl, languages: { en: englishUrl, fr: frenchUrl, "x-default": englishUrl } } } : {}),
  openGraph: {
    title: "Playbook d’adoption de l’IA : pilotes, agents et gouvernance",
    description: "Choisir la bonne intégration IA, la tester sur un vrai processus, mesurer le résultat et encadrer le passage en production.",
    ...(frenchUrl ? { url: frenchUrl } : {}),
    locale: "fr_FR",
    alternateLocale: "en_US",
  },
};

export default function FrenchHome() {
  return <Playbook locale="fr" />;
}
