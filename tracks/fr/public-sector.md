# Parcours service public — gates formels

## Principe

Un gain d’efficacité ne suffit pas à légitimer un système public. Le mandat légal, la proportionnalité, les droits fondamentaux, la transparence, l’accessibilité, le recours et l’archivage font partie du résultat.

Le [cas synthétique Ville de Mont-Rive](../../examples/fr/service-public-agent-dossiers-urbanisme.md)
applique ces gates à un agent A2 de contrôle administratif des dossiers
d’urbanisme. Il conserve le guichet et le courrier, rend le cas bas économiquement
non viable, et maintient 100 % des décisions publiques chez des collaborateurs
qualifiés.

## Rôles à nommer avant P0

Nommez chaque rôle par écrit, avec un suppléant. Dans une petite autorité, une personne peut cumuler plusieurs rôles, mais l’autorité de décision reste distincte de l’évaluateur.

| Rôle | Responsabilité |
| --- | --- |
| Autorité de décision | Responsable de service ou organe compétent qui accepte le risque résiduel à P5 |
| Responsable du processus | Porte le service, la baseline et l’usage quotidien |
| Conseiller à la protection des données | Examine finalité, données, analyse d’impact et rétention |
| Service juridique | Confirme mandat, base légale, règles d’achat et recours |
| Responsable sécurité | Examine accès, journalisation, fournisseur et gestion des incidents |
| Archives et gestion documentaire | Définit ce qui est conservé, combien de temps et sous quelle forme |
| Évaluateur indépendant | Examine le jeu de tests, les seuils et les résultats, sans intérêt dans l’issue |
| Représentants du personnel et des usagers | Parlent pour ceux qui travaillent avec le système et ceux qu’il touche |

## Synthèse des gates

Une gate n’est franchie que si ses preuves de sortie existent par écrit. Les durées sont des **hypothèses de travail à remplacer par votre propre calendrier**, pas des repères publiés. L’achat (P2) et le pilote (P4) fixent généralement le rythme.

| Gate | Entrée quand | Preuves de sortie | Durée indicative |
| --- | --- | --- | --- |
| P0 | Un problème nommé et un propriétaire existent | Mandat, baseline, options non-IA, autorité de décision | 1 à 2 mois |
| P1 | P0 est signée | Analyses d’impact, conception du recours, services consultés | 2 à 3 mois |
| P2 | P1 est signée | Contrat avec clauses d’audit, de journaux, de sortie et de notification des changements | 3 à 6 mois |
| P3 | Un système candidat et un jeu de tests existent | Rapport d’évaluation indépendant avec résultats par segment et limites | 2 à 3 mois |
| P4 | P3 est acceptée et le personnel formé | Résultats en shadow mode face à la baseline, registre des plaintes | 3 à 6 mois |
| P5 | P4 donne des résultats acceptables | Décision formelle, registre, plan de surveillance et de retrait | 1 à 2 mois |

Un premier système peut raisonnablement demander environ 12 à 22 mois au total. Réutiliser un fournisseur ou un schéma déjà évalué peut raccourcir P1 à P3, jamais P4 ni P5.

## Ce que les preuves publiées permettent

Les gains de temps annoncés dans le secteur public viennent surtout d’enquêtes, pas de tâches chronométrées. L’évaluation du Department for Work and Pensions britannique avait un groupe de comparaison, mais son estimation passe d’environ 19 à environ 10 minutes par jour sans contrôles statistiques. Servez-vous de ces chiffres pour choisir quoi mesurer à P0, et mesurez votre propre baseline. Voir le [registre des preuves de temps de tâche](../../docs/task-time-evidence.fr.md). Pour trouver les règles qui s’appliquent à votre autorité, utilisez la [comparaison de l’encadrement de l’IA par les administrations](../../references/public-sector-ai-governance-2026.fr.md) et, pour la Suisse et l’UE, la [page juridique](../../docs/legal-switzerland-eu.fr.md).

## Gate P0 — Opportunité publique

Exiger :

- problème de service public et population concernée ;
- mandat et compétence de l’autorité ;
- options non-IA examinées ;
- baseline de qualité, délai, coût, accès et erreurs ;
- propriétaire administratif et autorité de décision.

## Gate P1 — Légalité et impacts

- qualifier finalité, données, décisions et personnes affectées ;
- déterminer les analyses d’impact nécessaires ;
- examiner non-discrimination, accessibilité, langue et exclusion numérique ;
- définir information, explication, contestation et recours humain ;
- associer protection des données, juridique, sécurité, archives et métier.

## Gate P2 — Achat et architecture

- exigences auditables dans le marché et le contrat ;
- accès aux journaux, documentation et preuves ;
- sous-traitants, régions, transferts, rétention et entraînement ;
- notification des changements de modèle et incidents ;
- propriété, export, suppression, continuité et sortie ;
- interdiction qu’un secret fournisseur empêche le contrôle légal ;
- tests d’accessibilité et d’interopérabilité.

Les clauses contractuelles types européennes pour l’achat public de systèmes IA sont une ressource d’orientation, à adapter au droit applicable.

## Gate P3 — Évaluation indépendante

- jeu de tests représentatif de la population et des cas rares ;
- résultats par segment et gravité ;
- tests de sécurité, abus, dérive et indisponibilité ;
- examen indépendant des seuils et preuves ;
- documentation des limites et incertitudes ;
- aucun pouvoir d’action supérieur à ce qui a été testé.

## Gate P4 — Pilote contrôlé

- shadow mode avant toute influence ;
- population, durée, données et agents habilités délimités ;
- supervision humaine dotée du temps et de l’autorité nécessaires ;
- canal de plainte et arrêt immédiat ;
- comparaison publique/interne avec la baseline selon les obligations.

## Gate P5 — Production et redevabilité

- décision formelle et risques résiduels acceptés par l’autorité compétente ;
- registre du système et information appropriée ;
- journalisation, archivage, surveillance et audits ;
- recours humain opérationnel ;
- continuité du service sans IA ;
- réévaluation après changement significatif ;
- date et conditions de retrait.

## Conditions d’arrêt

Arrêter ou revenir au processus sûr en cas d’effet juridique non autorisé, discrimination grave, atteinte aux données, perte de traçabilité, impossibilité de recours, changement fournisseur non évalué ou dépassement des pouvoirs accordés.
