# Extension santé

> Photographie d’orientation vérifiée le **19 août 2026**. Cette extension opérationnelle ne constitue ni un avis médical ou juridique, ni une qualification réglementaire, ni une évaluation de conformité.

En santé, un « bon résultat » ne se réduit pas à la vitesse. Le gain n’existe qu’après protection de la sécurité clinique, de la finalité prévue, des populations, de la responsabilité professionnelle et de la continuité des soins.

## Commencer par nommer le rôle

| Rôle | Exemple | Limite par défaut |
|---|---|---|
| Soutien administratif | Résumer une politique non clinique ou préparer un brouillon de rendez-vous | A0–A1 ; aucune inférence clinique |
| Soutien clinique | Rechercher des preuves ou préparer une note pour un professionnel qualifié | A1 ; le professionnel vérifie source, patient et conclusion |
| Soutien au patient | Expliquer une information approuvée ou orienter une demande | A1–A2 uniquement avec escalade et canaux accessibles sans IA |
| Décision clinique ou triage | Diagnostiquer, prioriser, recommander un traitement ou modifier les soins | Traiter comme R3 ; qualification clinique, juridique et produit avant tout pilote |
| Fonction de dispositif médical | Logiciel ayant une finalité médicale prévue | Déterminer le statut de dispositif médical avant l’architecture ou l’achat |

Appeler un système « copilote » ne supprime pas une finalité médicale. La qualification dépend de ce qu’il est destiné à faire et de son usage réel.

## Gates santé

### H0 — Finalité prévue et autorité

- préciser finalité clinique ou administrative, utilisateurs, patients, contexte et exclusions ;
- nommer le professionnel responsable de chaque décision en aval ;
- déterminer si le système ou logiciel peut être un dispositif médical ou une partie de celui-ci ;
- identifier les règles suisses, européennes, cantonales, professionnelles, de recherche et institutionnelles applicables ;
- conserver une voie sûre sans IA.

**Arrêt :** finalité ambiguë, professionnel responsable absent ou usage expérimental présenté comme soin courant.

### H1 — Population, données et dommages

- cartographier systèmes sources, consentement ou autre autorité, secret, rétention, transferts et réutilisation ;
- définir la population prévue et les sous-groupes cliniquement pertinents ;
- modéliser retard de soin, fausse assurance, escalade manquée, sur-triage, biais, divulgation et biais d’automatisation ;
- séparer les preuves de recherche, de validation produit et de déploiement local.

### H2 — Preuves produit et fournisseur

- documenter qualification, classification, version, allégations et politique de changement ;
- exiger les preuves applicables sur provenance des données, évaluation clinique, cybersécurité, facteurs humains et surveillance après mise sur le marché ;
- vérifier qui assume qualité, vigilance, réglementation et incidents ;
- interdire tout changement silencieux du modèle ou de la base de connaissances évaluée.

### H3 — Évaluation clinique

- préenregistrer critères de jugement, référence, échantillon, sites, sous-groupes, données manquantes et limites d’erreur grave ;
- comparer aux soins actuels, pas à un clinicien idéalisé ;
- tester intégration au workflow, charge d’alerte, abstention, communication de l’incertitude et comportement d’override ;
- obtenir une revue clinique et méthodologique indépendante pour tout usage matériel.

Une exactitude moyenne ne libère pas un système qui échoue sur un sous-groupe critique ou provoque un événement de sécurité patient inacceptable.

### H4 — Shadow et pilote supervisé

- commencer rétrospectivement ou prospectivement en shadow, sans modifier les soins ;
- figer le système évalué et consigner recommandation, correction, escalade et effet en aval ;
- former les utilisateurs aux limites, à l’incertitude, à l’escalade et au signalement ;
- n’autoriser une influence supervisée qu’après réussite de H0–H3.

### H5 — Exploitation contrôlée

- surveiller résultats cliniques, quasi-incidents, dérive par sous-groupe, overrides, latence et indisponibilité ;
- relier les incidents IA aux procédures de sécurité clinique, protection des données, cybersécurité, vigilance et continuité ;
- exercer le retrait et le retour au processus clinique sûr ;
- réévaluer tout changement matériel de modèle, données, finalité, interface, population ou intégration.

## Dossier de preuves minimal

1. finalité prévue et qualification produit ;
2. responsable clinique, escalades et fallback de soin sûr ;
3. traçabilité des données et impact sur patients/populations ;
4. protocole figé et résultats par sous-groupe ;
5. tests facteurs humains, cybersécurité et workflow ;
6. décision signée, seuils de surveillance et voies d’incident.

## Limite de transfert

Les preuves ne se transfèrent pas automatiquement entre hôpitaux, spécialités, langues, prévalences, équipements, workflows ou populations. Revalider chaque différence matérielle et distinguer preuve produit et preuve de sécurité du parcours de soin local.

Voir le [registre daté des sources primaires](../../references/sources.md), l’[évaluation d’accessibilité](../../templates/accessibility-assessment.fr.md) et l’[analyse d’impact sur les droits fondamentaux](../../templates/fundamental-rights-impact-assessment.fr.md).
