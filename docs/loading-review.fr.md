# Suivi de publication et revue du chargement

[English](loading-review.md)

Date : 12 septembre 2026. Référence : `main` publié au commit `9736e1f`.
Branche de travail : `maintenance/publication-performance`. La publication
nécessite une fusion distincte et un déploiement Pages réussi ; pousser cette
branche ne signifie pas que le site est mis à jour.

## Changements

- Le handoff, le changelog et les rapports de clarté distinguent maintenant la
  publication vérifiée de la PR #55 des anciens états locaux. Aucun nouveau tag
  de version n’est annoncé.
- Les 12 articles conservent leur HTML prérendu, leurs styles, liens, ancres,
  choix de langue et données JSON-LD. Ils ne téléchargent ni ne préchargent
  plus le JavaScript du guide interactif. Les deux accueils restent interactifs.
- Le guide statique sépare React, les preuves et l’espace projet en fichiers
  dont le nom dépend du contenu. Une modification éditoriale ne change pas
  forcément ces fichiers. Ils restent chargés dès que le guide en a besoin :
  ce n’est pas du chargement différé ni une division par deux du téléchargement
  initial du guide.
- Un nouveau test a révélé un désaccord au chargement français : le serveur
  affichait `100'000`, Chrome `100 000`. Le formatage utilise désormais les
  mêmes séparateurs, sans changer les valeurs, arrondis ou signes. Dans les
  vérifications ciblées, React ne reconstruit plus la page à cause de cet écart.

## Mesures de l’export statique

Mesures locales des fichiers de production. La compression utilise `gzipSync`
de Node avec les mêmes paramètres par défaut ; celle de l’hébergeur peut varier.

| JavaScript | Version publiée | Correction locale |
| --- | ---: | ---: |
| Téléchargé par un article | 862 672 octets | 0 octet |
| Plus gros fichier du guide interactif | 862 672 octets | 423 072 octets |
| Tous les fichiers du guide, non compressés | 862 672 octets | 855 429 octets |
| Tous les fichiers du guide, somme gzip | 251 307 octets | 250 688 octets |

Les autres fichiers du guide font 190 190 octets pour React, 132 691 pour les
preuves et 109 476 pour l’espace projet. Leurs noms sont restés identiques quand
la correction de formatage a modifié le fichier principal. Le CSS reste
inchangé à 196 981 octets. Les articles téléchargent toujours leur HTML et
leurs styles : aucun JavaScript ne signifie pas une page sans poids.

L’export statique n’émet plus l’avertissement de fichier dépassant 500 ko,
sans relèvement du seuil. Le build client Vinext distinct conserve son ancien
avertissement ; ses fichiers JavaScript ne sont pas ceux déployés sur GitHub
Pages. Cette intervention ciblée ne prétend ni optimiser tout le build serveur,
ni améliorer les Core Web Vitals, ni mesurer un gain sur les appareils des lecteurs.

## Tests de non-régression

Les contrôles vérifient le budget par fichier, l’absence de JavaScript dans les
articles avec maintien du CSS et du JSON-LD, leurs 12 chemins hébergés, la
navigation native sans JavaScript, les deux accueils interactifs sans erreur
de chargement React et le formatage stable des nombres. Les tests existants
couvrent les 12 articles avec suivi des requêtes de scripts, les calculs,
dossiers sauvegardés, changements de langue, accessibilité, affichage mobile,
thèmes et survols.

Validation locale finale réussie : TypeScript, lint, builds serveur et statique,
64 tests Node, 153 contrôles Chrome (6,7 minutes, sans relance), 127 fichiers
Markdown et contrats du dépôt, ainsi que le test de découverte des sources.
Les trois contrôles d’export hébergé passent. Un essai Chrome confirme aussi
les deux accueils et le lien de langue d’un article sous le chemin d’hébergement,
sans erreur navigateur ni échec de chargement des fichiers. Il s’agit d’une
vérification locale, pas d’une nouvelle publication.

Références du mécanisme de compilation :
[builds de production Vite](https://vite.dev/guide/build) et
[options de build Vite](https://vite.dev/config/build-options.html).
