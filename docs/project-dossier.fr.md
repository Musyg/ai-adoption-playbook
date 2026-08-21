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
- un registre du système IA, une évaluation des risques et impacts, un plan
  d’évaluation et une liste de mise en œuvre modifiables ;
- une revue des changements facultative avec sa photographie de référence, les
  décisions modifiées, la réponse, le responsable, l’échéance, la note et la
  référence de preuve ;
- les horodatages, la version du playbook et la version du schéma du dossier.

## Documents reliés

Les champs reliés suivent la réponse de la phase correspondante tant qu’ils ne
sont pas modifiés dans le document. Un champ modifié devient une décision du
projet et ne change plus silencieusement. Il peut à tout moment reprendre sa
valeur reliée.

La liste de mise en œuvre rassemble trois groupes sans tout afficher à la fois :
les décisions du cycle, les contrôles de sécurité conditionnels et les contrôles
associés par la matrice. Chaque ligne peut recevoir un état, un responsable, une
échéance et une référence de preuve stable.

## Comparaison des versions et réévaluation

Utilisez un ancien export portant le même identifiant de dossier comme version
de référence. La comparaison ne remplace pas le projet actuel. Elle compare
dans le navigateur le contexte influençant les décisions, les réponses du cycle
de vie, les documents reliés, les contrôles de sécurité, les contrôles associés
et le travail de la liste de mise en œuvre.

Chaque différence est présentée séparément et reçoit une réponse suggérée :
examiner l’enregistrement, réévaluer les preuves concernées ou rouvrir une
décision. La suggestion ne constitue ni une autorisation de mise en service ni
une décision juridique automatique. Une personne consigne la réponse du projet,
le responsable, l’échéance, la note et la référence de preuve. Si la valeur
actuelle change encore, la réponse précédente repasse à l’état indécis, car elle
ne correspond plus au même couple avant-après.

Le dossier exporté inclut la photographie de référence et les décisions de revue
afin qu’une autre personne autorisée puisse reconstruire la comparaison. Les
valeurs de travail de référence sont donc dupliquées dans le fichier JSON. Les
mêmes limites interdisant secrets et preuves brutes s’appliquent aux deux
versions.

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

Le schéma expérimental actuel est `0.3.0`. Les dossiers `0.1.0` valides sont
migrés localement par l’ajout de documents reliés vides et d’une revue des
changements vide. Les dossiers `0.2.0` valides conservent leurs documents reliés
et reçoivent une revue vide. La migration est additive, conserve la version du
schéma source lorsqu’un fichier migré devient une référence de comparaison et
ne modifie jamais le fichier importé.

Les versions de schéma plus récentes ou inconnues sont refusées au lieu d’être
interprétées. Les autres imports sont acceptés uniquement si la version du
playbook, les valeurs de contexte, les phases, les limites de sécurité, les
documents reliés et le contrat de revue correspondent à l’implémentation
actuelle. Un fichier incompatible ne modifie pas le travail en cours.

Le contrat lisible par machine se trouve dans
[`site/public/data/project-dossier.schema.json`](../site/public/data/project-dossier.schema.json).
Les migrations expérimentales prises en charge sont maintenant explicites,
mais le format n’est pas encore figé comme contrat stable de la 1.0. Les tests
d’utilisation terrain et le gel final de compatibilité restent à réaliser.
