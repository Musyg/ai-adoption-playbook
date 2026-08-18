# Parcours PME — 90 jours

## Cible

Organisation avec plusieurs services, systèmes métier, fournisseurs et niveaux de responsabilité.

## Résultat attendu

Un portefeuille priorisé, un socle commun et un premier pilote gouverné, plutôt qu’une collection d’outils isolés.

## Jours 1–30 — Gouverner et découvrir

### Gouvernance légère

- sponsor de direction ;
- propriétaire de portefeuille IA ;
- responsables métier, IT/sécurité, données et protection des données ;
- juridique, RH, achats ou conformité selon les cas ;
- gate mensuel avec décisions écrites.

### Travaux

- inventaire des usages officiels et shadow AI ;
- classification des données et règles d’usage ;
- cartographie des processus à fort volume ;
- baselines et portefeuille de cas ;
- filtre immédiat des cas à impact élevé ;
- architecture cible et critères fournisseurs communs.

## Jours 31–60 — Construire les preuves

- sélectionner un à trois pilotes mécanistiquement différents ;
- affecter un propriétaire et un budget à chacun ;
- créer jeux de tests, segments critiques et seuils ;
- réaliser analyse juridique, protection des données et menace ;
- mettre en place identités, secrets, journaux, limites et environnements ;
- exécuter shadow mode et tests adversariaux.

Éviter une plateforme générale avant de connaître les besoins communs prouvés. Mutualiser seulement ce qui réduit réellement le risque ou le coût.

## Jours 61–90 — Piloter et industrialiser

- lancer des copilotes bornés pour les cas ayant franchi G2 ;
- mesurer résultat métier, correction humaine et incidents ;
- tester rollback et continuité ;
- décider séparément valeur, fiabilité et risque ;
- versionner modèles, instructions, outils, corpus et évaluations ;
- établir la revue fournisseur et le calendrier de réévaluation.

## Architecture de portefeuille

| Couche | Capacité commune |
|---|---|
| Identité | SSO, rôles, comptes de service, révocation |
| Données | classification, provenance, minimisation, rétention |
| Modèles | catalogue autorisé, versions, coût, régions |
| Outils | passerelles, listes d’autorisation, validation |
| Évaluations | jeux versionnés, seuils, rapports par segment |
| Exploitation | journaux, alertes, incidents, rollback, retrait |

## Indicateurs direction

- valeur réalisée versus annoncée ;
- part des systèmes inscrits au registre ;
- taux de cas avec baseline et évaluations ;
- erreurs graves et temps de détection ;
- dépendance et concentration fournisseurs ;
- taux de correction humaine et contournements ;
- coût complet par résultat utile.
