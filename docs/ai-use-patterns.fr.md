# Modes d’usage de l’IA

Un niveau d’intégration ne décrit pas complètement un système IA. Un copilote,
un assistant documentaire, un classifieur et un chatbot public peuvent tous
fonctionner au niveau A1, tout en exigeant des données, évaluations, tests de
sécurité, règles de transparence et contrôles humains différents.

Classer chaque cas d’usage sur les axes ci-dessous avant de choisir un produit
ou d’annoncer un gain attendu. Un système peut combiner plusieurs modes. Évaluer
chaque composant et le workflow complet.

## Axe 1 : tâche réalisée par l’IA

| Mode | Ce que fait l’IA | Évaluation minimale | Risques supplémentaires typiques |
|---|---|---|---|
| Génération | Produit du texte, du code, une image, du son ou une autre sortie nouvelle | qualité acceptée, fidélité factuelle et aux sources, erreurs graves, correction humaine | invention, fuite de propriété intellectuelle ou de données, traitement dangereux de la sortie |
| Recherche augmentée | Recherche et synthétise dans un corpus autorisé | couverture de recherche, validité des sources, ancrage, citations, fraîcheur | documents empoisonnés, fuite entre utilisateurs ou locataires, index obsolète, injection indirecte |
| Extraction / classification | Extrait des champs, attribue une catégorie, route ou détecte une classe connue | précision et rappel par classe, faux positifs et négatifs critiques, abstention, résultats par segment | déséquilibre caché, dérive des catégories, hypothèses aval invalides |
| Prédiction / recommandation | Estime un résultat futur, un score, un rang ou une action recommandée | calibration, seuil de décision, utilité, segments, dérive | biais d’automatisation, discrimination par variable proxy, boucles auto-renforcées |
| Conversation | Maintient une interaction en plusieurs tours avec une personne interne ou externe | réussite de la tâche, information, transfert humain, cohérence de mémoire, conservation, conseil dangereux | usurpation, dépendance excessive, réutilisation cachée, manipulation sur plusieurs tours |
| Multimodal | Interprète ou génère image, audio, vidéo, parole ou données de capteur | qualité propre au média, consentement, provenance, robustesse, accessibilité | deepfake, usage abusif de la voix ou de l’identité, instructions multimodales cachées, perte de métadonnées |
| Action agentique | Planifie, appelle des outils, modifie des systèmes ou coordonne des agents | plan et outils, autorisation, relecture de l’effet, idempotence, rollback, arrêt | détournement d’objectif, abus de privilège, exécution de code, mémoire empoisonnée, panne en cascade |

La génération de code reste un mode de génération tant que le code n’est pas
exécuté et ne modifie ni dépôt, build, service ni dépendance. Ensuite, elle
devient aussi une action agentique et doit être testée comme un changement de
chaîne logicielle.

## Axe 2 : mode d’interaction

- **Fonctionnalité embarquée :** l’IA est intégrée dans un produit ou un flux de
  décision existant. L’inventorier même si personne n’ouvre un outil IA séparé.
- **Traitement batch ou hors ligne :** les cas sont traités par lots. Tester
  l’échelle, les doublons, les échecs partiels, la réconciliation et la détection
  tardive.
- **Copilote :** une personne démarre et termine chaque cycle.
- **Conversation exposée :** une personne interne ou externe dialogue directement
  avec le système. Tester information, accessibilité, transfert et conservation.
- **Agent en arrière-plan :** le système avance le travail entre des points de
  contrôle humains.

## Axe 3 : connaissance et état

Documenter si le système dépend du modèle de base seulement, d’une recherche
autorisée, d’outils externes en temps réel, d’une mémoire de session ou
persistante, ou d’un fine-tuning et d’adaptateurs. Versionner séparément prompts,
modèles, corpus, index, outils, politique de mémoire, seuils et données de
fine-tuning. Un changement de l’un de ces éléments peut rouvrir le gate
d’évaluation.

## Axe 4 : déploiement

Distinguer SaaS fournisseur, API directe, déploiement auto-hébergé ou à poids
ouverts, et usage embarqué ou edge. Le choix modifie la localisation des données,
la responsabilité opérationnelle, les mises à jour, l’accès au modèle, la
réponse aux incidents et la sortie fournisseur. Il ne réduit pas le risque à lui
seul.

## Axe 5 : effet et autonomie

Indiquer si le système informe, recommande, décide ou agit. Appliquer ensuite la
[classification risque et autonomie](risk-autonomy.fr.md). Le type de tâche et
l’autonomie restent séparés : un système de recommandation à fort impact peut
être A1, alors qu’un agent de renommage de fichiers à faible impact peut être A3.

## Profil d’évaluation par mode

Utiliser les mesures communes de résultat, erreur grave, latence, coût et
correction humaine du [plan d’évaluation](../templates/evaluation-plan.fr.md),
puis ajouter les mesures propres au mode.

| Mode | À ajouter avant le pilote |
|---|---|
| Génération | grille d’acceptation, contrôles factuels ou de sources, contenus interdits, limites de reproductibilité |
| Recherche augmentée | couverture de recherche, droits d’accès aux sources, ancrage, validité des citations, fraîcheur du corpus, cas d’empoisonnement |
| Extraction / classification | matrice de confusion, seuils des classes critiques, abstention, prévalence, segments, dérive |
| Prédiction / recommandation | calibration, utilité du seuil, coûts des faux positifs et négatifs, segments, boucles de rétroaction |
| Conversation | compréhension de l’information IA, réussite de bout en bout, transfert humain, cohérence, conservation et suppression, abus |
| Multimodal | consentement et droits, grille par média, provenance et marquage, robustesse aux transformations, alternative accessible |
| Action agentique | tests du plan et des outils, permissions, relecture de l’effet, idempotence, rollback, limites, entrées hostiles dans outils et mémoire |

## Routage Suisse et Union européenne

Cette section est une orientation opérationnelle, pas un avis juridique.
Documenter dans le dossier le rôle exact, la juridiction, le secteur, les
personnes affectées et le texte applicable.

### Suisse

- La loi fédérale sur la protection des données s’applique aux traitements de
  données personnelles assistés par IA. Documenter finalité, fonctionnement,
  sources, réutilisation, destinataires, lieux de traitement, conservation et
  moyens d’exercer les droits.
- Lorsqu’une décision individuelle automatisée produit un effet juridique ou
  affecte significativement une personne, vérifier l’information, la possibilité
  d’exprimer son point de vue et le droit de demander une revue par une personne
  physique selon l’article 21 LPD, ainsi que les exceptions exactes.
- Pour les modèles de langage qui communiquent directement avec les personnes,
  documenter comment elles apprennent qu’elles correspondent avec une machine et
  si leurs entrées sont réutilisées pour l’amélioration ou une autre finalité.
- Identifier clairement les contenus synthétiques ou manipulés impliquant visage,
  image ou voix identifiables, puis examiner les droits de la personnalité, la
  protection des données, le droit pénal et la propriété intellectuelle.
- Réaliser une analyse d’impact relative à la protection des données lorsque le
  traitement projeté est susceptible d’engendrer un risque élevé.

Au 20 août 2026, la Suisse ne possède pas de loi générale sur l’IA en vigueur.
Le projet fédéral annoncé pour consultation d’ici fin 2026 reste un travail
futur, pas du droit actuel.

### Union européenne

- L’article 50 de l’AI Act s’applique depuis le 2 août 2026. Les fournisseurs de
  systèmes qui interagissent directement avec des personnes doivent les concevoir
  pour informer de l’interaction IA, dans le champ et selon les exceptions du
  texte.
- Les fournisseurs de systèmes générant ou manipulant du contenu synthétique
  doivent examiner l’obligation de marquage lisible par machine. Les déployeurs
  doivent examiner séparément l’information visible pour les deepfakes et
  certains textes d’intérêt public, ainsi que l’information liée à la
  reconnaissance des émotions ou à la catégorisation biométrique.
- Qualifier séparément pratiques interdites, haut risque, modèles à usage général,
  protection des données, emploi, consommation, droit d’auteur et règles
  sectorielles.
- Documenter si l’organisation agit comme fournisseur, déployeur, importateur,
  distributeur, fabricant de produit ou autre acteur. Le même système technique
  peut créer des obligations différentes selon le rôle.

Lorsque les deux juridictions sont concernées, appliquer les deux analyses. Ne
pas supposer que respecter la règle de transparence de l’une satisfait l’autre.

## Règle de sélection

1. Nommer chaque mode de tâche présent dans le workflow.
2. Documenter interaction, connaissance, déploiement et effet.
3. Appliquer séparément impact R0-R3 et autonomie A0-A4.
4. Activer les gates Suisse, UE et sectoriels réellement applicables.
5. Construire évaluation et modèle de menace à partir du profil cumulé.
6. Choisir le système le plus simple qui passe le gate complet.
