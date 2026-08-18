# Cas synthétique PME — Agent métier A2 pour les devis B2B

> **Entreprise fictive.** Noroît Mécanique SA, ses clients, ses volumes, ses
> coûts et ses résultats sont synthétiques. Le cas rend une décision calculable ;
> il ne prouve pas la performance d'un produit, d'un fournisseur ou d'une PME
> réelle.

> **Niveau mesuré : agent métier A2.** Le système transporte un devis éligible
> de la demande entrante jusqu'aux systèmes mis à jour, mais tout prix et tout
> effet externe exigent une approbation humaine explicite. « Prêt à approuver »
> ne signifie donc pas « autonome ».

## 1. Situation de départ

Noroît Mécanique SA est une PME industrielle suisse fictive de 42 personnes.
Elle fabrique des sous-ensembles inox configurables pour des lignes de production
alimentaire. Trois personnes traitent environ 160 demandes de devis par mois,
reçues par courriel avec des tableaux, PDF et références parfois incomplètes.

Une baseline de huit semaines porte sur 318 demandes reçues. Un devis standard
accepté mobilise une médiane de **76 minutes de temps humain actif** : qualifier
la demande, retrouver le client et ses conditions, contrôler les références,
consulter prix et délai, produire le document, relire, créer le devis ERP,
mettre à jour le CRM et préparer le suivi.

Un copilote de brouillon A1 ramène cette médiane à 58 minutes sur le sous-ensemble
testé. Il aide à lire et rédiger, mais l'équipe transporte encore le dossier
entre tous les systèmes. Le problème retenu pour le pilote A2 n'est donc pas
« écrire plus vite », mais :

**transporter de bout en bout un devis catalogue éligible, avec règles de prix,
preuves, approbation, effets vérifiés et escalade sûre des exceptions.**

## 2. Mandat, population et limites

| Élément | Décision |
|---|---|
| Responsable métier | Directrice commerciale |
| Approbateurs | Deux chargés d'affaires nommés et leur suppléant |
| Durée | 90 jours : intégration, jeu gelé, shadow mode, puis 60 jours live |
| Baseline | 318 demandes sur huit semaines |
| Évaluation préalable | 80 dossiers historiques gelés et autorisés |
| Population live | 316 demandes reçues, dont 238 admises comme éligibles |
| Autonomie | A2 — aucun prix ni effet externe sans approbation explicite |
| Impact | R2 — données clients, conditions commerciales et communication externe |
| Retour manuel | Boîte mail, checklist, modèles, ERP et CRM habituels conservés |

Un dossier est éligible seulement si le client est connu, les produits figurent
au catalogue, les quantités et unités sont explicites, les remises restent dans
la matrice approuvée, le délai provient de l'ERP et les conditions contractuelles
ne changent pas.

Sont exclus ou escaladés : nouvelle pièce sur plan, référence inconnue, remise
hors matrice, marge sous le plancher, clause contractuelle nouvelle, identité ou
destinataire contradictoire, donnée reçue sans autorisation, délai indisponible,
conflit entre CRM et ERP, contenu tentant de modifier les instructions du
système et toute demande exigeant un jugement d'ingénierie.

## 3. Ce que fait réellement l'agent

L'agent conserve un état versionné du dossier et exécute sept étapes :

1. ouvrir la demande et contrôler son éligibilité ;
2. extraire références, quantités, unités, destinataire et date demandée ;
3. lire uniquement le compte client, le catalogue, la matrice de remise et les
   données de disponibilité autorisés ;
4. calculer le devis avec des règles déterministes et préparer le courriel ;
5. vérifier les faits critiques, la marge, le délai, les conflits et les
   engagements interdits ;
6. présenter à l'approbateur les sources, écarts, prix, délai et effets prévus ;
7. après approbation, créer le devis ERP, écrire le journal CRM, envoyer au
   destinataire affiché et relire les identifiants des effets.

| Capacité | Permission du pilote |
|---|---|
| Boîte de devis | Lecture des messages et pièces du dossier courant |
| CRM | Lecture du compte autorisé ; écriture après approbation |
| ERP / catalogue | Lecture ; création du devis après approbation |
| Prix | Calcul selon matrice versionnée ; aucune dérogation |
| Messagerie | Brouillon libre ; envoi après approbation au destinataire affiché |
| Contrat, nouveau produit, crédit | Aucune décision ni écriture |

Chaque connecteur utilise une identité distincte au moindre privilège. Les
écritures portent une clé d'idempotence. Un timeout après écriture déclenche une
lecture de contrôle avant toute relance. Un coupe-circuit bloque les effets
externes sans empêcher le diagnostic en lecture seule.

## 4. Fourchette basse, centrale et haute

La fourchette est écrite avant le live. Elle ne porte que sur le **temps humain
actif des devis éligibles** et combine deux hypothèses visibles : part éligible
et réduction de temps sur ce sous-ensemble.

`heures libérées / mois = 160 demandes × part éligible × 76 min × réduction / 60`

| Scénario | Part éligible | Réduction sur l'éligible | Capacité brute / mois | Valeur brute à 68 CHF/h |
|---|---:|---:|---:|---:|
| Bas | 60 % | 50 % | 60,8 h | 4 134 CHF |
| Central | 75 % | 64 % | 97,3 h | 6 615 CHF |
| Haut | 85 % | 75 % | 129,2 h | 8 786 CHF |

La borne haute n'est pas un objectif commercial. Elle suppose des demandes
propres, un catalogue fiable et aucun nouveau goulot. La valeur en francs est
une **capacité théorique**, pas une économie comptable ni du chiffre d'affaires.
Elle ne devient utile que si l'entreprise absorbe plus de demandes, réduit des
délais, évite un recrutement ou réalloue effectivement ce temps.

Avec 16 000 CHF de mise en place et 1 600 CHF de coûts récurrents mensuels, le
retour simple théorique va de **2,2 à 6,3 mois après mise en service** ; le
scénario central donne 3,2 mois. Salaires libérés, marge, qualité, incidents et
coût du changement doivent rester séparés.

## 5. Gates écrites avant le live

Les 80 cas gelés couvrent demandes simples, tableaux multi-lignes, pièces
scannées, références proches, unités ambiguës, remise hors matrice, marge basse,
client homonyme, changement de coordonnées, instruction injectée dans un PDF,
ERP indisponible, timeout après écriture et répétition du même événement.

| Mesure | Seuil | Résultat gelé |
|---|---:|---:|
| Référence, quantité, unité, prix et délai critiques corrects | 100 % | 312/312 |
| Exceptions obligatoires escaladées | 100 % | 24/24 |
| Prix, remise, délai ou destinataire inventé | 0 | 0 |
| Effet externe avant approbation | 0 | 0 |
| Doublon après timeout ou relance | 0 | 0/20 |
| Reprise majeure sur cas éligible | ≤ 12 % | 8/80 — 10 % |
| Repli sûr lors d'une panne simulée | 100 % | 12/12 |

Une erreur de prix, de destinataire, d'autorisation ou un effet non retraçable
arrête le pilote, même si la moyenne de temps est bonne.

## 6. Déroulement sur 90 jours

- **Jours 1–10 — Intégrer sans ouvrir.** Inventaire des règles, identités
  séparées, lectures seules, écritures simulées, journal d'effets et fallback.
- **Jours 11–20 — Rejouer et attaquer.** Les 80 cas gelés passent après chaque
  modification de modèle, instruction, règle, source ou connecteur.
- **Jours 21–30 — Shadow complet.** L'équipe termine le véritable devis avant de
  voir la proposition ; aucun système réel ne reçoit d'effet.
- **Jours 31–90 — A2 live.** Un approbateur voit le dossier de preuves et
  autorise seulement le prix, le destinataire et les écritures affichés.

## 7. Résultats synthétiques du pilote

Sur 316 demandes reçues :

- 238 passent le filtre initial d'éligibilité ;
- 78 sont exclues à l'admission et restent dans le dénominateur global ;
- 163 sont prêtes à approuver sans correction ;
- 57 demandent une correction mineure puis sont acceptées ;
- 18 sont arrêtées et escaladées avant effet à cause d'un conflit découvert ;
- aucune action ne part sans approbation, aucun prix n'est inventé et aucun
  effet n'est dupliqué.

| Mesure | Manuel | Copilote A1 | Agent métier A2 |
|---|---:|---:|---:|
| Temps humain actif médian, devis standard accepté | 76 min | 58 min | 27 min |
| Réduction sur le travail éligible accepté | référence | −24 % | **−64 %** |
| Débit théorique par heure humaine | 0,79 | 1,03 | 2,22 |
| Rapport de débit vs manuel | ×1 | ×1,31 | **×2,81** |
| Workflow transporté | 0/7 étape | 1–2/7 étapes | 7/7 étapes |
| Effet externe | humain | humain | après approbation |

Les 220 devis acceptés représentent 69,6 % des 316 demandes. En supposant le
même temps de référence sur tout le portefeuille, `69,6 % × 64,5 %` donne un
**plafond pondéré d'environ 45 %** de temps actif en moins à l'échelle de toutes
les demandes, et non 64 %. Le journal réel doit remplacer ce raccourci dès que
les demandes exclues ont des durées différentes.

Le pilote libère environ 179,7 heures sur 60 jours, soit 89,8 heures par mois.
À 68 CHF/h et après 1 600 CHF de récurrents, cela représente environ 4 500 CHF
de capacité nette mensuelle et un retour simple observé proche de 3,5 mois.
Ce calcul n'attribue aucun revenu supplémentaire à l'agent.

Le taux autonome reste **0 %** : chaque devis accepté exige une approbation.
Le 163/238 mesure « prêt à approuver sans correction », pas « traité de bout en
bout sans humain ».

## 8. Décision de gate

**Décision : maintenir A2 pendant 90 jours et ne pas ouvrir A3.**

Le gain sur le workflow éligible entre dans la fourchette prévue, les seuils
critiques passent et le coût central reste plausible. L'entreprise conserve
toutefois l'approbation de chaque prix et de chaque destinataire. Les demandes
sur plan, remises exceptionnelles et modifications contractuelles restent
humaines.

Une candidature A3 limitée aux commandes récurrentes, sans changement de prix
ni de destinataire, exige un nouveau mandat, au moins 300 cas éligibles
supplémentaires, zéro erreur critique, une dérive mesurée par segment, un test de
révocation des accès, un rollback prouvé et une décision indépendante du succès
A2.

## 9. Ce qui rend le cas réaliste — et non transférable tel quel

La note de preuves
[Devis B2B en PME : repères externes et limites](../../references/pme-b2b-quote-cases.md)
sépare enquête PME, études de cas publiées par des fournisseurs et benchmarks
d'agents. Les observations externes rendent les ordres de grandeur plausibles ;
elles ne valident ni Noroît Mécanique SA, ni ses coûts, ni son résultat.

La performance dépend surtout de la part réellement éligible, de la qualité du
catalogue, des règles de prix, de l'intégration ERP/CRM, de la stabilité des
exceptions et du contrôle des effets. Une PME dont les devis exigent surtout du
jugement d'ingénierie peut raisonnablement obtenir un gain faible, nul ou négatif.

## 10. Dossier de preuves à transmettre

Le handoff conserve : mandat signé, baseline et dénominateurs, règles tarifaires
versionnées, matrice de permissions, modèle de menace, identifiant du jeu gelé,
résultats par segment, journal des 316 demandes, approbations, corrections,
escalades, appels d'outils, identifiants et lectures de contrôle des effets,
incidents, coûts, décision de gate, procédure manuelle et prochaine date de revue.
