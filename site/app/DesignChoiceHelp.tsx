import type { ArchitectureId, IntegrationId } from "./integration-taxonomy";

type Props = { locale: "en" | "fr"; step: number; mode: IntegrationId; architecture: ArchitectureId; autonomy: number; confirmed: boolean };

const examples = {
  en: {
    mode: {
      copilot: "Customer reply: AI drafts the reply. You check it, copy it into your email tool, and send it yourself.",
      agent: "Customer reply: the system handles a defined part, such as finding order details and drafting a reply. A person handles the rest and exceptions.",
      agency: "Customer reply: the system handles most routine requests from start to finish. People define the rules, review performance, and handle exceptions. Strong automation does not automatically permit sending.",
    },
    architecture: {
      model: "Customer reply: one model drafts from the information you provide. No tool is connected.",
      workflow: "Customer reply: fixed steps retrieve the order, draft a reply, then request approval. The sequence is written in advance.",
      agent: "Customer reply: one agent chooses whether to look up the order, ask for missing information, or draft a reply. Its permissions are a separate choice.",
      agency: "Customer reply: a coordinator delegates order research, drafting, and checking to specialist agents. More agents do not mean more permission to act.",
    },
    autonomy: [
      "Customer reply: AI suggests how to respond. It cannot look up an order or send anything.",
      "Customer reply: AI reads permitted information or prepares a draft. A person performs any action that changes another system.",
      "Customer reply: the system may send this reply only after a person explicitly approves that action.",
      "Customer reply: the system may send replies that meet written rules without approval each time. It stops or asks a person for other cases.",
      "Customer reply: the system has broad authority across several systems. This exceptional scope requires the additional checks shown below. Choosing A4 here does not authorize deployment.",
    ],
    help: [
      "Ask who actually does the work. If you drive each step, choose Copilot. If the system completes a defined part, choose Bounded automation. If it carries most eligible work, choose Strong automation. You can test a provisional choice and change it later.",
      "Ask how the work is organized. One answer without connected tools: One model or assistant. A fixed sequence: Tool-assisted workflow. A system that chooses its next steps: One business agent. Several coordinated specialists: Orchestrated agent team. This is not a ranking of quality.",
      "Ask what may happen without a person doing it. Advice: A0. Reading or drafting: A1. Action after explicit approval: A2. Actions within written rules without approval each time: A3. Broad multi-system authority: A4, with an explicit exception. Choose the boundary you intend to test, not the highest number.",
    ],
  },
  fr: {
    mode: {
      copilot: "Réponse client : l’IA prépare le texte. Vous le vérifiez, le copiez dans votre messagerie et l’envoyez vous-même.",
      agent: "Réponse client : le système traite une partie définie, par exemple retrouver la commande et préparer la réponse. Une personne réalise le reste et traite les exceptions.",
      agency: "Réponse client : le système traite l’essentiel des demandes habituelles de bout en bout. Les personnes fixent les règles, suivent les résultats et traitent les exceptions. Automatisation forte ne signifie pas automatiquement droit d’envoyer.",
    },
    architecture: {
      model: "Réponse client : un modèle rédige à partir des informations que vous lui donnez. Aucun outil n’est connecté.",
      workflow: "Réponse client : des étapes fixes retrouvent la commande, rédigent la réponse, puis demandent une validation. Leur ordre est écrit à l’avance.",
      agent: "Réponse client : un agent choisit s’il doit consulter la commande, demander une information manquante ou rédiger. Ses permissions se choisissent séparément.",
      agency: "Réponse client : un coordinateur répartit la recherche de la commande, la rédaction et la vérification entre des agents spécialistes. Davantage d’agents ne donne pas davantage de droits.",
    },
    autonomy: [
      "Réponse client : l’IA suggère comment répondre. Elle ne peut ni consulter la commande ni envoyer quoi que ce soit.",
      "Réponse client : l’IA consulte les informations autorisées ou prépare un brouillon. Une personne réalise toute action qui modifie un autre système.",
      "Réponse client : le système peut envoyer cette réponse seulement après l’approbation explicite de cette action par une personne.",
      "Réponse client : le système peut envoyer seul les réponses qui respectent des règles écrites. Pour les autres cas, il s’arrête ou demande une aide humaine.",
      "Réponse client : le système dispose de droits larges dans plusieurs systèmes. Ce périmètre exceptionnel exige les contrôles supplémentaires ci-dessous. Choisir A4 ici n’autorise pas la mise en service.",
    ],
    help: [
      "Demandez-vous qui fait réellement le travail. Vous conduisez chaque étape : Copilote. Le système termine une partie définie : Automatisation bornée. Il porte l’essentiel du travail éligible : Automatisation forte. Vous pouvez explorer un choix provisoire et le modifier ensuite.",
      "Demandez-vous comment le travail est organisé. Une réponse sans outil connecté : Un modèle ou assistant. Des étapes fixes : Processus outillé. Un système qui choisit ses prochaines étapes : Un agent métier. Plusieurs spécialistes coordonnés : Équipe d’agents orchestrée. Ce n’est pas un classement de qualité.",
      "Demandez-vous ce qui peut se produire sans qu’une personne le fasse. Conseiller : A0. Lire ou préparer : A1. Agir après approbation explicite : A2. Agir seul dans des règles écrites : A3. Disposer de droits larges sur plusieurs systèmes : A4, avec une exception explicite. Choisissez la limite à tester, pas le chiffre le plus élevé.",
    ],
  },
};

export default function DesignChoiceHelp({ locale, step, mode, architecture, autonomy, confirmed }: Props) {
  const copy = examples[locale];
  const example = step === 0 ? copy.mode[mode] : step === 1 ? copy.architecture[architecture] : copy.autonomy[autonomy];
  return <aside className="reader-choice-help">
    <strong>{locale === "en" ? "ONE EXAMPLE THROUGHOUT: REPLYING TO A CUSTOMER" : "UN MÊME EXEMPLE : RÉPONDRE À UN CLIENT"}</strong>
    <p>{confirmed ? example : locale === "en" ? "Select an option to see what would change in this example. Your choice remains editable and does not authorize real actions." : "Choisissez une option pour voir ce qui changerait dans cet exemple. Votre choix reste modifiable et n’autorise aucune action réelle."}</p>
    <details><summary>{locale === "en" ? "Help me choose" : "Aidez-moi à choisir"}</summary><p>{copy.help[step]}</p></details>
  </aside>;
}
