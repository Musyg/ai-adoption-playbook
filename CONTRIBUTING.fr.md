# Contribuer

Les contributions doivent rendre le playbook plus vérifiable, utile ou actuel. [Read in English](CONTRIBUTING.md).

## Trois parcours de contribution

### 1. Corriger une affirmation publique

Ouvrez une [correction sourcée](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=correction-fr.yml). Citez uniquement le passage nécessaire, fournissez une source primaire et distinguez obligation, recommandation et choix du projet.

### 2. Proposer un vrai pilote

Ouvrez l’[entrée publique du pilote](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=field-pilot-fr.yml) avec uniquement des métadonnées non identifiantes. Réalisez ensuite le pilote localement avec le [protocole de pilote terrain](docs/field-pilot-protocol.fr.md).

GitHub ne reçoit jamais les preuves brutes. Conservez noms de clients, données personnelles, secrets, contrats, prompts bruts, logs, captures, contenu privilégié et détail de sécurité exploitable dans un système privé autorisé.

Un rapport nettoyé ne peut utiliser le [modèle de pull request terrain](.github/PULL_REQUEST_TEMPLATE/field-report.fr.md) qu’après revue indépendante. Être prêt pour la revue ne vaut pas autorisation de publier, et un rapport accepté ne soutient que sa frontière de preuves explicite.

Chaque version ou modification quantitative significative exige aussi une revue indépendante en contexte neuf du SHA exact en tête de la pull request. Une revue antérieure devient caduque dès que ce SHA change. La fusion reste bloquée tant que la nouvelle tête comporte un constat P0, P1 ou P2 ouvert, et la personne chargée de la revue consigne les commandes et preuves utilisées.

### 3. Améliorer le playbook

Les bonnes contributions incluent des modèles réutilisables aux entrées et sorties claires, des traductions idiomatiques et des améliorations d’accessibilité, de sécurité ou de reproductibilité.

## Avant une pull request

1. Gardez un seul sujet par pull request.
2. Datez les affirmations juridiques, réglementaires et fournisseur susceptibles d’évoluer.
3. Ne copiez jamais de norme propriétaire ni de contenu organisationnel confidentiel.
4. Expliquez le changement, sa raison, ses bénéficiaires et sa validation.
5. Exécutez `python scripts/validate.py` ; les changements du site exigent aussi `npm run lint` et `npm test` depuis `site/`.
