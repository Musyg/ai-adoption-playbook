# Cas synthétique association/fondation — Agent A2 pour les dossiers de subvention

> **Organisation fictive.** La Fondation Lien Local, ses programmes, ses
> demandeurs, ses volumes, ses coûts et ses résultats sont synthétiques. Le cas
> illustre une méthode de décision ; il ne prouve la performance d'aucun outil,
> fournisseur, secteur ou organisme réel.

> **Niveau mesuré : agent métier A2 administratif.** Le système transporte un
> dossier standard jusqu'à un paquet prêt pour les évaluateurs, avec effets
> externes après approbation. Il ne note pas le mérite, ne classe pas les besoins,
> ne recommande pas un montant et ne décide jamais d'une attribution ou d'un
> refus.

## 1. Mission et situation de départ

La Fondation Lien Local est une fondation suisse fictive de 14 personnes. Elle
soutient des projets communautaires par des micro-subventions de 5 000 à
25 000 CHF. Vingt-quatre évaluateurs bénévoles et un comité de sept personnes
examinent environ 720 demandes par an, en français, allemand et italien. Un canal
téléphonique et papier reste disponible.

Une baseline sur deux appels à projets couvre 241 demandes. Pour un dossier
standard finalement transmis aux évaluateurs, le secrétariat consacre une
médiane de **96 minutes de temps humain actif** : contrôler le consentement et
le programme, inventorier les pièces, extraire budget et calendrier, vérifier
la complétude administrative, pseudonymiser la copie d'évaluation, demander les
éléments manquants, enregistrer le dossier et l'attribuer à deux évaluateurs.

Le pilote ne cherche pas à accélérer la décision de financement. Son problème
est plus étroit :

**transporter un dossier administrativement standard depuis sa réception
jusqu'à deux évaluateurs autorisés, sans convertir l'IA en juge de la mission,
des personnes ou du financement.**

## 2. Mandat et population

| Élément | Décision |
|---|---|
| Responsable métier | Responsable des programmes |
| Garant de la mission | Membre du conseil indépendant du pilote |
| Approbateurs opérationnels | Deux gestionnaires de subventions nommés |
| Durée | 60 jours : intégration, jeu gelé, shadow mode et 30 jours live |
| Baseline | 241 demandes issues de deux appels précédents |
| Évaluation préalable | 60 dossiers historiques gelés et autorisés |
| Population live | 120 demandes reçues, dont 86 admises dans le workflow A2 |
| Autonomie | A2 — messages et écritures après approbation explicite |
| Impact | R3 interne — accès à un financement, données personnelles et mission |
| Retour manuel | Portail, téléphone, papier, checklist et système de subventions conservés |

« Admis dans le workflow » signifie seulement que le dossier peut suivre le
chemin administratif standard. Cela ne signifie ni admissible au financement,
ni recommandé, ni prioritaire.

Le workflow A2 accepte uniquement un programme connu, un consentement présent,
un demandeur identifié, des documents lisibles et des catégories de pièces
définies. Il s'arrête pour une candidature hors ligne, un besoin d'assistance,
un nouveau programme, une restriction de financeur ambiguë, une donnée très
sensible non prévue, une identité contradictoire, un document inaccessible, un
conflit d'intérêts ou toute situation exigeant une interprétation de la mission.

## 3. Frontière entre administration et décision

| L'agent prend en charge | Les personnes gardent |
|---|---|
| État versionné du dossier et contrôle des règles d'entrée | Accueil téléphonique, papier et assistance aux demandeurs |
| Inventaire, extraction et citations vers les pièces | Interprétation du contexte et de la mission |
| Contrôle de complétude selon une checklist publiée | Appréciation du mérite et des besoins |
| Projet de demande de pièce manquante | Toute décision d'attribution, refus ou montant |
| Copie pseudonymisée et paquet pour les évaluateurs | Déclaration et résolution des conflits d'intérêts |
| Attribution à deux évaluateurs après approbation | Explication de la décision et traitement d'une contestation |
| Écritures et preuves d'effets après approbation | Revue des écarts par langue, canal et type d'organisation |

L'agent ne produit aucun score de risque, de vulnérabilité, de « qualité » ou de
probabilité de financement. Les évaluateurs voient les pièces sources et
travaillent sans recommandation préremplie. La pseudonymisation réduit certaines
informations visibles ; elle ne prétend pas supprimer tous les signaux sociaux
ou culturels.

## 4. Workflow et permissions

L'agent exécute sept étapes :

1. vérifier consentement, programme, canal et règles d'entrée du workflow ;
2. inventorier les pièces sans copier de données inutiles ;
3. extraire faits administratifs avec citation de la page source ;
4. appliquer la checklist déterministe de complétude ;
5. préparer une demande de pièce ou un paquet pseudonymisé ;
6. présenter sources, transformations, destinataires et effets à l'approbateur ;
7. après approbation, envoyer, écrire dans le système, attribuer deux évaluateurs
   sans conflit connu et relire les identifiants des effets.

| Capacité | Permission du pilote |
|---|---|
| Portail et dépôt documentaire | Lecture du dossier courant seulement |
| Registre demandeur | Lecture minimale ; aucune fusion automatique d'identité |
| Système de subventions | Création et attribution après approbation ; aucun statut final |
| Messagerie | Brouillon ; envoi après approbation au contact affiché |
| Budget et règlement | Lecture des règles publiées ; aucun montant recommandé |
| Score, décision, paiement | Interdits |

Les pièces brutes restent dans le système autorisé. Le modèle reçoit seulement
les extraits nécessaires. Chaque connecteur utilise une identité distincte. Les
écritures portent une clé d'idempotence ; un timeout déclenche une lecture de
contrôle avant toute relance. Le coupe-circuit bloque messages et écritures sans
supprimer l'accès manuel.

## 5. Fourchette de planification

La fourchette s'applique au temps administratif des seuls dossiers pouvant
suivre le workflow standard :

`heures libérées / mois = 60 demandes × part workflow × 96 min × réduction / 60`

| Scénario | Part workflow | Réduction sur ce travail | Capacité brute / mois | Valeur brute à 62 CHF/h |
|---|---:|---:|---:|---:|
| Bas | 55 % | 45 % | 23,8 h | 1 473 CHF |
| Central | 70 % | 60 % | 40,3 h | 2 500 CHF |
| Haut | 80 % | 70 % | 53,8 h | 3 333 CHF |

Avec 12 000 CHF de mise en place et 750 CHF de coût récurrent mensuel, le
retour simple théorique varie de **4,6 à 16,6 mois** après mise en service ; le
scénario central donne 6,9 mois. La borne haute n'est pas un objectif de mission.

Ces montants représentent une capacité administrative théorique, pas un don
supplémentaire ni un impact social. Le temps libéré ne crée de valeur que s'il
est réellement réalloué à l'accompagnement, à la qualité des décisions ou à la
réduction du délai pour les demandeurs.

## 6. Gates avant le live

Les 60 cas gelés couvrent trois langues, petites et grandes organisations,
portail et scan, budget multi-feuilles, pièce absente, document illisible,
identité contradictoire, mineurs, données de santé non prévues, conflit
d'intérêts, instruction injectée dans une pièce, service indisponible, timeout
après écriture et répétition du même dossier.

| Mesure | Seuil | Résultat gelé |
|---|---:|---:|
| Faits administratifs critiques reliés à la bonne source | 100 % | 266/266 |
| Situations d'arrêt obligatoires escaladées | 100 % | 18/18 |
| Score, classement, recommandation ou décision généré | 0 | 0 |
| Message ou écrit externe avant approbation | 0 | 0 |
| Donnée interdite dans le paquet pseudonymisé | 0 | 0 |
| Doublon après timeout ou relance | 0 | 0/16 |
| Reprise majeure sur cas workflow | ≤ 12 % | 6/60 — 10 % |
| Écart de reprise majeure entre langues | ≤ 5 points | 3,2 points |
| Repli vers une personne ou le canal hors ligne | 100 % | 12/12 |

Une seule décision de financement suggérée, fuite de donnée, exclusion de canal,
action non autorisée ou impossibilité de retracer une transformation arrête le
pilote, indépendamment du gain de temps.

## 7. Pilote de 60 jours

- **Jours 1–10 — Cartographier et minimiser.** Règles, pièces, consentements,
  langues, canaux, rôles, rétention, pseudonymisation et fallback sont testés.
- **Jours 11–20 — Rejouer et contredire.** Les 60 cas gelés passent après chaque
  changement de modèle, instruction, règle, langue, source ou connecteur.
- **Jours 21–30 — Shadow mode.** Le secrétariat prépare le vrai dossier avant de
  voir le paquet proposé. Aucun demandeur ni évaluateur ne reçoit d'effet.
- **Jours 31–60 — A2 live.** Un gestionnaire approuve le message, le paquet et
  les deux destinataires ; les évaluateurs et le comité travaillent ensuite
  sans score ni recommandation de l'agent.

## 8. Résultats synthétiques

Sur 120 demandes reçues :

- 86 entrent dans le workflow administratif standard ;
- 34 restent hors workflow et reçoivent un traitement humain, sans être
  considérées comme refusées ou « mauvaises » ;
- 58 paquets sont prêts pour les évaluateurs sans correction ;
- 21 demandent une correction mineure puis sont acceptés ;
- 7 sont arrêtés et escaladés avant effet ;
- aucune décision, recommandation de montant ou priorité n'est générée ;
- aucun canal hors ligne n'est supprimé et aucune action ne part sans approbation.

| Mesure | Manuel | Copilote A1 | Agent administratif A2 |
|---|---:|---:|---:|
| Temps humain actif médian, paquet accepté | 96 min | 74 min | 39 min |
| Réduction sur le travail standard accepté | référence | −23 % | **−59 %** |
| Débit théorique par heure humaine | 0,63 | 0,81 | 1,54 |
| Rapport de débit vs manuel | ×1 | ×1,30 | **×2,46** |
| Délai médian jusqu'au paquet prêt | 5,5 jours | non mesuré | 2,1 jours |
| Décision de financement humaine | 100 % | 100 % | **100 %** |

Les 79 paquets acceptés représentent 65,8 % des 120 demandes. En supposant le
même temps de référence sur tout le portefeuille, `65,8 % × 59,4 %` donne un
**plafond pondéré d'environ 39 %** de temps administratif en moins sur toutes
les demandes, pas 59 % de toute l'activité de la fondation.

Le pilote libère environ 75 heures sur 60 jours, soit 37,5 heures par mois. À
62 CHF/h et après 750 CHF de coûts récurrents, la capacité nette mensuelle est
d'environ 1 575 CHF, pour un retour simple proche de 7,6 mois. Aucun impact
social ou financement supplémentaire n'est attribué automatiquement à l'agent.

## 9. Gate mission

Les résultats sont ventilés par langue, canal et taille d'organisation. Le
pilote ne montre pas d'écart supérieur au seuil préenregistré sur les reprises
majeures. Deux demandeurs utilisent le canal téléphonique ; leurs dossiers
restent hors agent et avancent au même gate humain. Aucune plainte liée au
traitement IA n'est enregistrée sur ce petit échantillon ; cela ne prouve pas
l'absence d'effet sur la confiance.

**Décision : conserver A2 pour l'administration standard pendant 90 jours ;
interdire toute décision ou recommandation de financement automatisée.**

Le système réduit une charge réelle sans franchir la frontière de mission. Une
extension exige un nouveau mandat, une consultation des personnes concernées,
un échantillon plus large par langue et canal, un mécanisme de contestation
testé et une décision distincte du succès administratif.

## 10. Repères externes et limites

La note
[IA et instruction des subventions : repères et limites](../../references/nonprofit-grantmaking-ai-cases.md)
sépare enquête sectorielle, analogues fonctionnels, récit fournisseur, droit
suisse et guide d'évaluation. Les sources rendent le workflow plausible ; elles
ne valident ni les chiffres ni la frontière choisie pour la Fondation Lien Local.

## 11. Dossier de preuves à transmettre

Le handoff contient : mandat, gardien de la mission, groupes consultés, baseline
et dénominateurs, règles d'entrée du workflow, inventaire des données et
consentements, matrice de permissions, registre des financeurs, modèle de
menace, jeu gelé, résultats par langue et canal, journal des 120 demandes,
transformations de pseudonymisation, approbations, corrections, escalades,
destinataires et effets relus, plaintes, coûts, décision de gate, fallback et
date de revue.
