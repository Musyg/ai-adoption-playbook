# Classification risque × autonomie

Cette matrice sert au triage interne. Elle ne remplace ni une analyse juridique, ni une analyse de sécurité, ni une évaluation d’impact.

## Axe 1 — Impact du cas d’usage

| Niveau | Description | Exemples indicatifs |
|---|---|---|
| R0 | Interne, public, facilement vérifiable, sans conséquence sur une personne | Résumé d’un texte public, idéation |
| R1 | Assistance métier avec validation, erreurs récupérables | Brouillon, recherche documentaire, classement interne |
| R2 | Données personnelles, communication externe ou modification d’un système | Réponse client, mise à jour CRM, recommandation opérationnelle |
| R3 | Droits, santé, emploi, crédit, prestations, surveillance, autorité publique ou infrastructure critique | Éligibilité, diagnostic, allocation, contrôle, décision réglementée |

Un cas passe au niveau supérieur dès qu’une caractéristique supérieure est présente. La fréquence et l’échelle peuvent également augmenter le niveau.

## Axe 2 — Autonomie technique

| Niveau | Capacité |
|---|---|
| A0 | Information ou conseil uniquement |
| A1 | Recherche, extraction, classement ou brouillon |
| A2 | Action seulement après approbation humaine explicite et informée |
| A3 | Actions autonomes bornées par permissions, budget, durée et destinations |
| A4 | Autonomie large, multi-systèmes ou auto-extension — désactivée par défaut |

## Contrôle minimal par combinaison

| Combinaison | Contrôle minimal |
|---|---|
| R0–R1 / A0–A1 | Propriétaire, règles de données, tests métier, journal des changements |
| R1–R2 / A2 | Approbation qualifiée, validation des sorties, journal complet, rollback |
| R2 / A3 | Modèle de menace, moindre privilège, limites, surveillance, tests adversariaux |
| R3 / tout niveau | Qualification juridique, évaluation d’impact, gouvernance formelle, audit et recours humain |
| Tout risque / A4 | Exception de direction documentée, preuve qu’A3 est insuffisant, confinement renforcé et audit indépendant |

## Questions de triage

- Une erreur peut-elle affecter un droit, une prestation, un emploi, une santé ou une sécurité ?
- Le système traite-t-il des données personnelles, sensibles, confidentielles ou protégées par un secret ?
- Une personne sait-elle qu’elle interagit avec un système IA lorsque cela est requis ?
- Le système peut-il écrire, envoyer, acheter, publier, supprimer ou modifier ?
- L’action est-elle réversible ? Dans quel délai ?
- Une approbation humaine est-elle réelle, informée et possible dans le temps disponible ?
- Le système peut-il lire du contenu non fiable puis appeler des outils ?
- Les erreurs peuvent-elles se multiplier à grande échelle avant détection ?

Documenter la réponse et la preuve dans le [modèle d’évaluation du risque](../templates/risk-assessment.fr.md).
