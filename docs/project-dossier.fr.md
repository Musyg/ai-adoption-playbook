# Dossier projet local

L’atelier de mise en œuvre enregistre un dossier projet de travail dans le
navigateur utilisé. Il peut aussi exporter et importer ce même dossier au
format JSON. Aucun serveur n’est nécessaire et le playbook ne transmet pas les
réponses.

## Contenu du dossier

- la structure, le mode d’usage, le territoire, le niveau d’intégration,
  l’autonomie et l’orientation du risque sélectionnés ;
- la phase actuelle et les réponses consignées dans les phases 0 à 11 ;
- les contrôles de sécurité conditionnels et les contrôles associés par la
  matrice ;
- les phases dont les champs minimaux sont complets ;
- les horodatages, la version du playbook et la version du schéma du dossier.

## Utilisation sûre

Traitez le fichier comme un brouillon de travail. Ne saisissez aucune preuve
client brute, aucun secret, aucun identifiant d’accès ni aucune donnée
personnelle identifiante. Le stockage du navigateur est pratique, mais ce n’est
pas un dépôt de preuves autorisé. Conservez les preuves contrôlées dans un
système privé approuvé et référencez-les par un identifiant stable ou une
empreinte.

Sur un appareil partagé, exportez le dossier vers un emplacement approuvé puis
utilisez **Créer un nouveau dossier** pour supprimer la copie du navigateur.

## Compatibilité et validation

Le schéma expérimental actuel est `0.1.0`. Un import est accepté uniquement si
la version du schéma, la version du playbook, les valeurs de contexte, les
phases et les limites de sécurité correspondent à l’implémentation actuelle. Un
fichier incompatible ne modifie pas le travail en cours.

Le contrat lisible par machine se trouve dans
[`site/public/data/project-dossier.schema.json`](../site/public/data/project-dossier.schema.json).
Les règles de migration et de comparaison restent un travail ultérieur de la
0.5. Le format n’est pas encore figé comme contrat stable de la 1.0.
