# Contributing / Contribuer

Contributions should make the playbook more verifiable, usable, or current. Les contributions doivent rendre le playbook plus vérifiable, utile ou actuel.

## Three contribution paths / Trois parcours

### 1. Correct a public claim / Corriger une affirmation publique

Open a [source-backed correction](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=correction.yml). Quote only the shortest necessary excerpt, link a primary source, and distinguish binding requirements, guidance, and project recommendations.

Ouvrez une [correction sourcée](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=correction.yml). Citez uniquement le passage nécessaire, fournissez une source primaire et distinguez obligation, recommandation et choix du projet.

### 2. Propose a real pilot / Proposer un vrai pilote

Open the [public pilot intake](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=field-pilot.yml) with non-identifying coordination metadata only. Then run the pilot locally using the [English](docs/field-pilot-protocol.md) or [French](docs/field-pilot-protocol.fr.md) protocol.

Ouvrez l’[entrée publique du pilote](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=field-pilot.yml) avec uniquement des métadonnées non identifiantes. Réalisez ensuite le pilote localement avec le protocole [anglais](docs/field-pilot-protocol.md) ou [français](docs/field-pilot-protocol.fr.md).

GitHub never receives raw evidence. Keep client names, personal data, secrets, contracts, raw prompts, logs, screenshots, privileged material, and exploitable security detail in an authorized private system.

GitHub ne reçoit jamais les preuves brutes. Conservez noms de clients, données personnelles, secrets, contrats, prompts bruts, logs, captures, contenu privilégié et détail de sécurité exploitable dans un système privé autorisé.

Only after independent review may a sanitized report use the [field-report pull-request template](.github/PULL_REQUEST_TEMPLATE/field-report.md). Review readiness is not publication approval, and an accepted report supports only its explicit evidence boundary.

Un rapport nettoyé ne peut utiliser le [modèle de pull request terrain](.github/PULL_REQUEST_TEMPLATE/field-report.md) qu’après revue indépendante. Être prêt pour la revue ne vaut pas autorisation de publier, et un rapport accepté ne soutient que sa frontière de preuves explicite.

### 3. Improve the playbook / Améliorer le playbook

Good contributions include reusable templates with clear inputs and exit criteria, idiomatic translations, and accessibility, security, or reproducibility improvements.

Les bonnes contributions incluent des modèles réutilisables aux entrées et sorties claires, des traductions idiomatiques et des améliorations d’accessibilité, de sécurité ou de reproductibilité.

## Before opening a pull request / Avant une pull request

1. Keep one concern per pull request. / Gardez un seul sujet par pull request.
2. Date volatile legal, regulatory, and vendor claims. / Datez les affirmations juridiques, réglementaires et fournisseur susceptibles d’évoluer.
3. Never paste proprietary standards or confidential organizational material. / Ne copiez jamais de norme propriétaire ni de contenu organisationnel confidentiel.
4. Explain what changed, why, who benefits, and how it was checked. / Expliquez le changement, sa raison, ses bénéficiaires et sa validation.
5. Run `python scripts/validate.py`; site changes also require `npm run lint` and `npm test` from `site/`.
