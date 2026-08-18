import type { Metadata } from "next";
import { Playbook } from "../Playbook";

export const metadata: Metadata = {
  title: "Playbook d’adoption de l’IA — de l’idée à la production maîtrisée",
  description:
    "Un parcours visuel, progressif et gouverné par la preuve pour introduire l’IA dans toute structure.",
};

export default function FrenchHome() {
  return <Playbook locale="fr" />;
}
