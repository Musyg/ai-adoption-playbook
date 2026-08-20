# Processus universel d’adoption de l’IA

Ce processus est conçu pour rester reconnaissable de l’indépendant au service public. Ce qui varie est le niveau de preuve, le nombre de responsables, la formalisation et l’autonomie autorisée.

## Vue d’ensemble

| Phase | Question décisive | Preuve de sortie |
|---|---|---|
| 0. Mandat | Pourquoi agir ? | Mandat signé et propriétaire nommé |
| 1. Baseline | Que se passe-t-il réellement aujourd’hui ? | Mesures initiales et échantillon de cas |
| 2. Cartographie | Où sont le travail, les données et les décisions ? | Carte de processus et registre des systèmes |
| 3. Cas d’usage | Quel problème précis voulons-nous résoudre ? | Fiches comparables et priorisées |
| 4. Risque et droit | Qu’est-ce qui peut affecter des personnes ou l’organisation ? | Classification et exigences applicables |
| 5. Architecture | Quelle est la solution suffisante la plus simple ? | Décision d’architecture et dossier fournisseur |
| 6. Évaluations | Comment saura-t-on si le système fonctionne ? | Jeu de tests et seuils préenregistrés |
| 7. Sécurité | Comment peut-il être trompé ou dépasser son mandat ? | Modèle de menace et tests |
| 8. Pilote | Produit-il de la valeur dans des conditions bornées ? | Rapport comparé à la baseline |
| 9. Production | Peut-on l’exploiter, l’arrêter et revenir en arrière ? | Décision de mise en production et runbooks |
| 10. Surveillance | Reste-t-il utile et maîtrisé ? | Tableau de bord, revues et incidents |
| 11. Retrait | Comment arrêter proprement ? | Export, suppression, révocation et continuité |

## Phase 0 — Mandat

### Objectif

Définir le problème et l’autorité du projet avant de choisir un outil.

### Actions

- nommer le propriétaire du processus et le responsable de la décision finale ;
- décrire le problème observable, les personnes concernées et la valeur attendue ;
- fixer budget, délai, périmètre et exclusions ;
- écrire les actions que l’IA ne doit jamais effectuer ;
- identifier les décisions qui exigent un spécialiste ou une autorité compétente.

### Gate 1

Le projet ne démarre que si le [mandat](../templates/mandate.fr.md) contient un propriétaire, un résultat mesurable, une baseline à établir et des limites explicites.

## Phase 1 — Baseline

### Objectif

Éviter de comparer le futur système à une impression ou à un scénario idéal.

### Mesures possibles

- minutes et coût par dossier ;
- délai de première réponse et délai total ;
- taux d’erreur, de reprise ou d’abandon ;
- variation entre opérateurs ;
- volume et saisonnalité ;
- revenu, économie ou valeur de service public ;
- satisfaction des utilisateurs et des personnes affectées.

Conserver un échantillon représentatif de cas réels, correctement autorisé et minimisé. Il deviendra la base des évaluations.

## Phase 2 — Cartographie réelle

Observer le travail sur le terrain, et pas seulement le processus théorique :

- étapes, décisions, files d’attente et exceptions ;
- site, messagerie, CRM, ERP, documents, API et automatisations ;
- données personnelles, sensibles, confidentielles ou couvertes par un secret ;
- outils IA déjà utilisés, y compris les usages informels ;
- fournisseurs, sous-traitants, régions de traitement et dépendances ;
- corrections, contournements et tâches invisibles.

Livrables minimaux : carte du processus actuel, [registre IA](../templates/ai-system-register.csv), inventaire des données et liste des problèmes avec volumes.

## Phase 3 — Cas d’usage et priorisation

Transformer chaque problème en une [fiche de cas d’usage](../templates/use-case-card.fr.md). Ne pas fusionner des décisions, utilisateurs ou niveaux de risque différents dans une seule fiche. Classer tâche IA, interaction, connaissance, déploiement et effet avec le [guide des modes d’usage](ai-use-patterns.fr.md). Ces dimensions ne remplacent ni le risque ni l’autonomie.

Conserver deux scores séparés :

- **valeur** : fréquence, impact, temps, qualité, revenu, économie ou valeur publique ;
- **difficulté/risque** : données, droits, sécurité, intégrations, autonomie, irréversibilité et dépendance fournisseur.

Le premier pilote est généralement un cas fréquent, mesurable, réversible, à forte valeur et à risque maîtrisable. Un cas spectaculaire mais impossible à évaluer est un mauvais premier pilote.

## Phase 4 — Risque, autonomie et droit

Classer séparément :

1. les modes de tâche et d’interaction ;
2. l’impact possible du cas d’usage ;
3. l’autonomie technique accordée ;
4. les données, sources de connaissance et modes de déploiement ;
5. le rôle de l’organisation comme fournisseur, intégrateur, déployeur, responsable, sous-traitant ou utilisateur ;
6. les juridictions et règles sectorielles applicables, avec des conclusions Suisse et UE séparées.

Utiliser le guide [risque × autonomie](risk-autonomy.fr.md) et l’[orientation Suisse/UE](legal-switzerland-eu.fr.md). Une classification interne ne remplace jamais une qualification juridique.

## Phase 5 — Système suffisant le plus simple

Évaluer les options dans cet ordre :

1. clarification ou suppression de l’étape ;
2. règle déterministe ;
3. automatisation classique ;
4. appel de modèle avec entrée et sortie structurées ;
5. extraction ou classification contrôlée ;
6. recherche dans un corpus autorisé ;
7. workflow IA avec outils ;
8. agent borné ;
9. multi-agent uniquement si les tests prouvent son utilité.

Choisir le modèle sur les cas réels, et non sur un classement général. Documenter latence, coût, région, rétention, entraînement avec les données client, sous-traitants, changements de version, export, suppression, réversibilité et responsabilité contractuelle dans le [dossier fournisseur](../templates/vendor-assessment.fr.md).

Un même niveau d’intégration peut contenir plusieurs modes IA. Un assistant
documentaire exige des preuves sur corpus et droits d’accès ; un classifieur sur
les erreurs par classe et la dérive ; un chatbot public sur l’information et le
transfert humain ; un système multimodal sur le consentement et la provenance.
Appliquer chaque profil pertinent du [guide des modes d’usage](ai-use-patterns.fr.md).

## Phase 6 — Évaluations avant le produit

Construire les évaluations avant d’optimiser le système. Le jeu comprend :

- cas fréquents et difficiles ;
- ambiguïtés et informations manquantes ;
- exceptions et cas où il faut escalader ;
- entrées adversariales ;
- cas où l’abstention ou le refus est la bonne réponse.

Mesurer l’exactitude métier, la complétude, la fidélité aux sources, les permissions, les appels d’outils, les refus, la latence, le coût, les disparités pertinentes, les corrections humaines et le résultat métier final. Ajouter les mesures propres à la recherche augmentée, la classification, la prédiction, la conversation, le multimodal et l’action agentique.

Préenregistrer les seuils dans le [plan d’évaluation](../templates/evaluation-plan.fr.md). Voir [Évaluations et gates](evaluations-and-gates.fr.md).

### Gate 2

Aucun pilote sans seuils d’acceptation, seuils d’arrêt, méthode de comparaison et responsable du jugement.

## Phase 7 — Sécurité et confinement

Traiter au minimum : injection directe et indirecte, fuite d’informations, chaînes d’approvisionnement, empoisonnement des données ou du contexte, sorties non validées, agence excessive, consommation non bornée et exfiltration par les outils. Étendre le modèle de menace aux droits d’accès et à l’empoisonnement du corpus, à l’évasion et à la dérive prédictives, aux instructions multimodales et à l’usurpation, à l’exécution logicielle, à la mémoire persistante et aux pannes en cascade entre agents lorsque ces modes sont présents.

Les contrôles de base sont : moindre privilège, lecture seule par défaut, identités distinctes, destinations autorisées, secrets hors contexte, validation déterministe, approbation humaine, budgets, journalisation, contrôle des sorties réseau, bouton d’arrêt et procédure manuelle.

Voir [Sécurité](security.fr.md).

## Phase 8 — Pilote en trois paliers

1. **Shadow mode** : le système produit un résultat sans influencer le processus réel.
2. **Copilote** : il propose ; une personne qualifiée accepte, corrige ou rejette.
3. **Automatisation bornée** : il exécute uniquement les actions dont la fiabilité et la réversibilité ont été démontrées.

Le pilote utilise une population limitée, des données délimitées, une version figée du modèle et des instructions, un journal complet et une procédure d’arrêt immédiat.

### Gate 3

La [décision de pilote](../templates/pilot-decision.fr.md) sépare trois questions :

- la valeur métier est-elle démontrée ?
- la fiabilité est-elle suffisante sur tous les segments critiques ?
- les risques résiduels sont-ils acceptés par les bonnes personnes ?

Un seul « non » bloque la production.

## Phase 9 — Production

Versionner les modèles, instructions, outils, données de référence et seuils. Prévoir :

- déploiement progressif et rollback ;
- limites de coût, volume et permissions ;
- surveillance des erreurs, dérives et appels d’outils ;
- canal de signalement ;
- [runbook d’incident](../templates/incident-runbook.fr.md) ;
- continuité sans IA ;
- date de réévaluation et propriétaire de chaque contrôle.

## Phase 10 — Surveillance et amélioration

Surveiller les résultats métier et pas seulement la disponibilité technique. Comparer aux seuils préenregistrés, aux segments critiques et à la baseline. Déclencher une réévaluation après :

- changement de modèle, de fournisseur, de prompt ou de corpus ;
- nouvelle intégration ou nouvelle permission ;
- incident ou dérive ;
- changement juridique ou organisationnel ;
- extension à une nouvelle population ou finalité.

## Phase 11 — Retrait

Un système doit pouvoir être arrêté aussi proprement qu’il a été lancé :

- désactiver les accès et révoquer les secrets ;
- exporter les éléments nécessaires à la continuité ;
- supprimer ou restituer les données selon les engagements ;
- conserver les preuves et décisions exigées ;
- informer les utilisateurs et personnes affectées lorsque nécessaire ;
- rétablir le processus manuel ou la solution de remplacement.

## Définition de « prêt pour la production »

Le dossier possède au minimum :

1. un mandat, une baseline et un propriétaire ;
2. une carte des données et des systèmes ;
3. une classification de risque et les exigences applicables ;
4. une décision d’architecture et un dossier fournisseur ;
5. une suite d’évaluations reproductible ;
6. un modèle de menace et des tests de sécurité ;
7. un pilote comparé à la baseline ;
8. un runbook d’incident, un rollback et une procédure manuelle ;
9. une surveillance, une date de revue et un plan de retrait.
