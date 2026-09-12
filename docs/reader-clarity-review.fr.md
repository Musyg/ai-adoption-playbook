# Corrections de clarté du guide

[English](reader-clarity-review.md)

Date de revue : 12 septembre 2026. Base : `main` à `7623b15`.
Branche de travail : `improvement/reader-clarity`.

## Périmètre et suivi des corrections

Ce travail fait suite à la comparaison avec les pratiques d’explication de
MDN, Anthropic, OpenAI, Cloudflare, Google PAIR et GOV.UK. Il corrige la
rédaction et les interactions. Il ne constitue ni une nouvelle revue
scientifique ni une preuve que chaque lecteur comprend désormais le guide.

| Constat | Correction réalisée | Surface principale |
| --- | --- | --- |
| Mode de travail confondu avec architecture | Menu aligné sur les trois modes ; comportement agentique séparé des contrôles ; analogie du système d’exploitation retirée | Guide, taxonomie, articles intégration et gouvernance |
| Choix abstraits | Tâches concrètes avant leurs noms techniques ; descriptions des structures et contrôle de situation initiale clarifiés | Départ guidé, usages, crosswalk |
| Trois décisions simultanées | Une question visible à la fois, trois sous-étapes revisitées librement, exemple commun de réponse client et aide facultative au choix | Écran de fonctionnement |
| Trop de nombres difficiles à comparer | Heures économisées et restantes sur toute la charge en premier ; cas de temps ajouté et résultat indisponible ; détails par cas repliables | Calculateur |
| Valeurs initiales présentées comme saisies | Formulation neutre sur les hypothèses actuelles, démonstration explicite, accès direct aux scénarios modifiables | Calculateur |
| Bornes identiques répétées | Une seule valeur lorsque les résultats arrondis sont identiques ; précision des calculs conservée | Calculateur et résultats |
| Plan de test trop technique | Réussite et échec en mots simples, mêmes cas pour comparer, exemple de version et explication visible des minimums de planification | Plan de test, cycle et documents projet |
| Exploitation abstraite | Responsables nommés, reprise manuelle, vérification des changements déjà effectués ; cumul de rôles possible quand il est réalisable | Exploitation |
| Balisage d’alerte détecté par le nouveau test d’accessibilité | Conteneurs d’alerte adaptés, avec messages et contrôles de conception conservés | Fonctionnement guidé, calculateur et plan de test |
| Contribution perçue comme obligatoire | Caractère facultatif dans le menu, le titre et l’explication ; compteur de contributions séparé de l’avancement personnel | Retour d’expérience |
| Repères de navigation concurrents | Quatre questions puis résultat ; trois sous-choix ; méthode et espace pilote distingués ; libellé CH + UE | Navigation |
| Questions pratiques surtout agentiques | Liens directs vers recherche documentaire, prévision, conversation et multimodal | Questions pratiques |
| Dates et cohérence éditoriale | Six paires d’articles corrigées, date de ces modifications indiquée et édition du guide actualisée | Articles et accueil |

Aucun coefficient temporel, critère d’admission des sources, seuil de décision,
identifiant de schéma, permission ou classement juridique n’a été changé.
Une démonstration ne devient pas une observation. Le manque connu de données
terrain propres reste inchangé et n’est pas un nouveau blocage de ce travail.

## Vérification

Vérifications locales réussies le 12 septembre 2026 :

- Lint, TypeScript et compilations de production et statique, avec les 14 routes.
- 62 tests Node et 144 contrôles Chrome, sans relance automatique dans la série
  finale, sur ordinateur clair, ordinateur sombre et mobile clair. Durée de la
  série navigateur : 6,1 minutes.
- Validation du dépôt : 125 fichiers Markdown et contrats de contenu déclarés ;
  test de découverte des sources également réussi.
- Validation JSON Schema 2020-12 du registre temporel et du crosswalk.
- Inspection des captures françaises des choix de fonctionnement et de la
  synthèse mensuelle dans les trois profils, avec survol lisible sur ordinateur.
- `git diff --check` ; moteur de calcul, registre des preuves, moteur de
  décision, format du dossier et verrouillage des dépendances inchangés.

Les nouveaux tests couvrent l’avancement et le retour dans les sous-étapes, les
gains et pertes mensuels, l’éligibilité nulle, les détails facultatifs, l’accès
aux scénarios, les bornes identiques, la contribution facultative et les liens
vers les tâches non agentiques. Les contrôles existants des combinaisons
incompatibles, exceptions A4, exports et observations figées restent actifs.
La compilation conservait son avertissement préexistant sur la taille du fichier
JavaScript pendant cette revue ; cette passe n’était pas un audit de performance.
Les corrections locales ont ensuite été enregistrées et publiées par la
[PR #55](https://github.com/Musyg/ai-adoption-playbook/pull/55), fusionnée au
commit `9736e1f` le 12 septembre. La CI de main a validé 62 tests Node et
144 contrôles Chrome ; le
[déploiement Pages](https://github.com/Musyg/ai-adoption-playbook/actions/runs/34685452972)
a réussi. Les 14 routes publiques et la nouvelle synthèse sur les deux accueils
ont été vérifiées après publication. Le travail de performance ultérieur est
suivi séparément.

Les séances avec des lecteurs seront organisées ensuite par l’utilisateur.
Les tests navigateur et d’accessibilité ne remplacent pas ces séances.

## Références de comparaison

- [MDN : préparer un premier site](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/What_will_your_website_look_like)
- [Anthropic : construire des agents efficaces](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI : guide pratique de création d’agents IA](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
- [Cloudflare : comprendre les agents](https://developers.cloudflare.com/agents/concepts/what-are-agents/)
- [Google PAIR : explication et confiance](https://pair.withgoogle.com/chapter/explainability-trust/)
- [GOV.UK : pages de questions](https://design-system.service.gov.uk/patterns/question-pages/)
