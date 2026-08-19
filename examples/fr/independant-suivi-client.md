# Cas synthétique indépendant — Du rendez-vous au suivi validé

> **Exemple fictif.** La personne, les clients, les volumes et les résultats
> sont synthétiques. Le scénario illustre une manière prudente de conduire un
> pilote ; il ne prouve pas la performance d’un outil ou d’un métier.

> **Niveau mesuré : copilote A1.** Le système rédige une étape sans outil
> connecté ni action autonome. Le gain observé ici ne doit pas être comparé à
> celui d’un agent métier ou d’une agence orchestrée.

## 1. Situation initiale

**Camille Rey** est consultante indépendante en organisation. Elle accompagne
six petites entreprises et réalise généralement 12 à 18 rendez-vous clients par
mois. Après chaque échange, elle relit ses notes, prépare un compte rendu, liste
les prochaines actions et rédige un courriel de suivi.

Le travail reste irrégulier : certaines réunions sont simples, d’autres
contiennent des hypothèses, des décisions non confirmées ou des informations
commerciales sensibles. Les prix, le périmètre contractuel et les recommandations
finales engagent directement la consultante.

### Baseline sur 22 suivis historiques autorisés

| Mesure | Valeur initiale | Source |
|---|---:|---|
| Temps médian entre notes et brouillon relu | 44 min | Chronométrage rétrospectif |
| Suivis prêts en moins de 24 heures | 64 % | Horodatages |
| Oubli d’au moins une action convenue | 14 % | Relecture des dossiers |
| Reprise majeure avant envoi | non mesurée | Nouvelle mesure du pilote |

Le problème choisi n’est pas « automatiser la relation client ». Il est :
**transformer des notes structurées en premier brouillon de compte rendu et de
courriel, sans décider, promettre ni envoyer à la place de la consultante**.

## 2. Mandat et limites

| Élément | Décision du pilote |
|---|---|
| Propriétaire et décideuse | Camille Rey |
| Durée | 14 jours |
| Budget | CHF 120 de logiciels et au plus 8 heures de préparation |
| Périmètre | 14 rendez-vous éligibles, un seul workflow |
| Autonomie | A1 — extraction et brouillon uniquement |
| Impact potentiel | R2 — données clients et communication externe future |

### Hors périmètre

- aucun enregistrement ou transcription automatique des réunions ;
- aucune donnée de santé, de ressources humaines, de litige ou de secret reçu
  d’un tiers ;
- aucun accès du modèle à la messagerie, au calendrier, au stockage ou à la
  facturation ;
- aucun prix, délai contractuel, engagement ou recommandation finale généré ;
- aucun destinataire choisi et aucun envoi effectué par le système ;
- aucune conservation ou utilisation pour l’entraînement sans conditions
  fournisseur vérifiées.

Camille utilise un formulaire local avec cinq champs : contexte autorisé,
faits confirmés, décisions, actions et points à clarifier. Elle retire les
informations inutiles avant de demander un brouillon.

## 3. Système suffisant le plus simple

Trois options sont comparées :

1. un modèle de compte rendu manuel avec cases obligatoires ;
2. ce même modèle, complété par un appel IA produisant une sortie structurée ;
3. un assistant connecté aux réunions, à la messagerie et au calendrier.

L’option 2 est retenue. Le formulaire impose la structure et le modèle produit
trois blocs : faits repris des notes, actions avec responsable et échéance, puis
brouillon de courriel. Les champs prix, engagement et destinataire n’existent
pas dans la sortie. La consultante compare toujours la proposition aux notes.

L’option connectée est écartée : elle ajoute des données, des permissions et
des effets externes sans être nécessaire au test.

## 4. Évaluation écrite avant le pilote

Vingt-quatre dossiers clos et autorisés sont minimisés. Douze servent à régler
le formulaire et les instructions ; douze restent gelés. Le jeu gelé contient
des dates ambiguës, une décision non confirmée, une action sans responsable et
quatre cas qui doivent être signalés plutôt que complétés.

| Métrique | Seuil d’acceptation | Seuil d’arrêt |
|---|---:|---:|
| Faits requis correctement repris | ≥ 98 % | < 95 % |
| Cas ambigus correctement signalés | 100 % | < 100 % |
| Prix, engagement ou fait critique inventé | 0 | ≥ 1 |
| Brouillons nécessitant une reprise majeure | ≤ 30 % | > 45 % |
| Temps médian jusqu’au brouillon relu | ≤ 35 min | ≥ 40 min |

### Résultats du jeu gelé

| Mesure | Résultat | Décision |
|---|---:|---|
| Faits correctement repris | 58/59 — 98,3 % | Accepté |
| Cas ambigus signalés | 4/4 — 100 % | Accepté |
| Prix, engagement ou fait critique inventé | 0 | Accepté |
| Reprise majeure | 3/12 — 25 % | Accepté |
| Temps médian simulé | 33 min | Accepté |

Une date secondaire est attribuée au mauvais jalon. L’erreur est conservée
dans le registre et un contrôle visuel des dates est ajouté à la checklist.

## 5. Pilote de 14 jours

### Jours 1–2 — Mesurer et borner

Camille confirme la baseline, choisit les catégories éligibles, documente la
procédure manuelle et vérifie les conditions de données du fournisseur.

### Jours 3–7 — Régler et tester

Elle utilise les 12 cas de réglage, gèle les instructions, exécute les 12 cas de
décision et consigne chaque correction. Un échec au seuil critique arrête le
pilote avant toute utilisation avec un nouveau dossier.

### Jours 8–10 — Shadow mode

Le système traite cinq rendez-vous, mais les brouillons ne sont consultés
qu’après la rédaction manuelle. Cette phase vérifie que le dispositif ne fait
pas disparaître des actions ou des nuances importantes.

### Jours 11–14 — Copilote

Neuf rendez-vous éligibles sont traités avec le formulaire. Camille relit les
notes, corrige le brouillon, ajoute elle-même les éléments commerciaux, choisit
le destinataire et envoie depuis sa messagerie habituelle.

## 6. Résultats observés

Les résultats couvrent les 14 rendez-vous des deux paliers. Ce faible volume
sert à décider d’une prolongation, pas à établir un rendement annuel.

| Mesure | Baseline | Pilote | Écart observé |
|---|---:|---:|---:|
| Temps médian jusqu’au brouillon relu | 44 min | 34 min | −23 % |
| Suivi prêt en moins de 24 heures | 64 % | 12/14 — 86 % | +22 points |
| Action convenue omise dans le brouillon final | 14 % | 1/14 — 7 % | −7 points |
| Reprise majeure du brouillon IA | non mesurée | 4/14 — 29 % | nouvelle mesure |
| Prix ou engagement inventé | non mesuré | 0 | seuil respecté |
| Incident grave | 0 observé | 0 observé | aucune conclusion de rareté |

Une date est mal rattachée pendant le pilote et corrigée avant l’envoi. Quatre
brouillons demandent une restructuration importante. Le gain médian de dix
minutes est utile, mais ne rembourse pas encore les huit heures maximales de
préparation et ne constitue pas une hausse démontrée du chiffre d’affaires.

## 7. Décision de gate

**Décision : prolonger 30 jours au niveau copilote, sans connexion.**

Les seuils préenregistrés passent et le suivi devient plus régulier. Le taux de
reprise reste toutefois assez élevé pour exclure l’envoi automatique et toute
extension aux propositions commerciales complètes.

Conditions de prolongation :

1. conserver le formulaire et la checklist de dates ;
2. mesurer séparément le temps de saisie, de relecture et de correction ;
3. revoir chaque semaine les cas ayant exigé une reprise majeure ;
4. répéter le jeu gelé après tout changement de modèle ou d’instructions ;
5. arrêter si un prix, un engagement ou une recommandation non fondée apparaît ;
6. décider après 30 jours si le temps réellement libéré justifie l’outil.

## 8. Pourquoi ces chiffres restent prudents

Le scénario s’appuie sur des études publiées sans copier leurs résultats :

- l’expérience BCG–Harvard montre des gains importants sur certaines tâches de
  conseil, mais une baisse de justesse sur une tâche située hors de la frontière
  de capacité de l’IA ;
- l’expérience de Noy et Zhang porte sur des tâches professionnelles d’écriture
  contrôlées, pas sur une relation client réelle et continue ;
- l’enquête OCDE indique que les entreprises d’une personne déclarent souvent
  une baisse de charge, mais il s’agit d’un ressenti agrégé, pas d’une mesure du
  cas présent ;
- l’expérience menée dans 66 organisations observe moins de temps dans la
  messagerie, sans transformation détectée de la quantité ou de la composition
  globale du travail.

Les liens, observations et limites de transfert sont consignés dans la
[note de preuves](../../references/independent-knowledge-work-cases.md).

## 9. Dossier de preuves

Le pilote conserve le mandat, la baseline, le formulaire vide, les règles de
données, les 12 cas gelés, les sorties versionnées, le registre d’erreurs, les
mesures de temps et la décision de gate. Une autre personne peut ainsi vérifier
ce qui a été observé, ce qui reste interdit et pourquoi le pilote continue.
