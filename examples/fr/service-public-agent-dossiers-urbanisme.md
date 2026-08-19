# Cas synthétique service public — Agent A2 pour les dossiers d'urbanisme

> **Autorité fictive.** La Ville de Mont-Rive, son territoire, son mandat, ses
> volumes, ses coûts et ses résultats sont synthétiques. Le cas illustre une
> méthode de décision ; il ne prouve la performance d'aucun outil, fournisseur
> ou service public réel.

> **Niveau mesuré : agent métier A2 administratif.** Le système prépare le
> contrôle de complétude d'un dossier d'autorisation de construire et, après
> approbation, enregistre et transmet les effets autorisés. Il ne déclare pas un
> dossier complet, ne recommande ni octroi ni refus, n'interprète pas le droit et
> ne signe aucune décision publique.

## 1. Mandat et situation de départ

La Ville de Mont-Rive est une commune suisse fictive de 62 000 habitants. Son
service de l'urbanisme compte 17 personnes et reçoit environ 1 080 demandes par
an, en français et en allemand. Le guichet, le courrier et l'accompagnement
téléphonique restent disponibles en plus du portail.

Une baseline sur 386 demandes mesure une médiane de **145 minutes de temps
humain actif** pour un dossier standard finalement accepté au contrôle
administratif : vérifier autorité et signature, inventorier les pièces,
extraire parcelle et caractéristiques du projet, consulter les règles publiées,
contrôler la checklist, préparer une demande de complément, enregistrer le
dossier et l'attribuer au collaborateur compétent.

Le problème du pilote est volontairement plus étroit que la décision
d'autorisation :

**transporter un dossier administrativement standard jusqu'à un collaborateur
qualifié, avec chaque fait et règle relié à sa source, sans déléguer à l'agent
le pouvoir d'apprécier le projet ou les droits des personnes.**

## 2. Périmètre et autorité

| Élément | Décision |
|---|---|
| Autorité administrative | Cheffe du service de l'urbanisme |
| Responsable opérationnel | Responsable du contrôle des dossiers |
| Approbateurs | Six collaborateurs qualifiés et nommés |
| Garant indépendant | Contrôle interne, avec juridique et protection des données |
| Durée | 90 jours : cadrage, jeu gelé, shadow mode et A2 live |
| Baseline | 386 demandes historiques autorisées |
| Évaluation préalable | 90 dossiers gelés, représentatifs et contradictoires |
| Population observée | 270 demandes consécutives, dont 166 entrent dans le workflow |
| Autonomie | A2 — aucun message ou écrit sans approbation explicite |
| Impact | R3 public — procédure administrative, données personnelles et effet public |
| Continuité | Portail, guichet, courrier, téléphone et procédure manuelle conservés |

« Entre dans le workflow » signifie seulement que le dossier correspond au
chemin administratif standard testé. Cela ne signifie ni complet au sens du
droit, ni conforme, ni susceptible d'être autorisé.

L'agent s'arrête pour une demande papier ou accompagnée, une signature ou une
identité ambiguë, une nouvelle catégorie de projet, une règle contradictoire,
une dérogation, une opposition de tiers, une donnée sensible inattendue, un plan
illisible, une visite nécessaire, une question d'égalité de traitement ou toute
situation exigeant une interprétation juridique ou urbanistique.

## 3. Frontière entre transport et pouvoir public

| L'agent A2 prend en charge | Les personnes et l'autorité gardent |
|---|---|
| État versionné et règles d'entrée du workflow | Accueil, assistance et canaux hors ligne |
| Inventaire des pièces et extraction avec citations | Qualification juridique et compétence de l'autorité |
| Checklist administrative publiée | Décision qu'un dossier est formellement complet |
| Projet de demande de complément | Visite, dialogue et examen des oppositions |
| Repérage de règles et contraintes avec liens sources | Interprétation, pondération et égalité de traitement |
| Écriture et attribution après approbation | Octroi, refus, conditions, motifs et signature |
| Journal des transformations, approbations et effets | Information, accès au dossier, contestation et recours |

L'agent ne produit aucun score de conformité, de risque, de priorité ou de
probabilité d'autorisation. Il ne rédige pas la conclusion de la décision. Le
collaborateur vérifie chaque référence au texte officiel avant de l'utiliser.

## 4. Workflow et permissions

Le workflow A2 comporte sept étapes :

1. contrôler canal, autorité, signature et catégorie connue ;
2. inventorier les pièces et conserver la version de chaque source ;
3. extraire les faits administratifs avec citation de page ou de plan ;
4. appliquer la checklist déterministe publiée pour le type de demande ;
5. préparer une liste de compléments ou un paquet d'instruction, sans avis ;
6. présenter sources, incertitudes, destinataire et effets à l'approbateur ;
7. après approbation, envoyer, écrire au registre, attribuer et relire les effets.

| Capacité | Permission du pilote |
|---|---|
| Portail et dépôt documentaire | Lecture du dossier courant seulement |
| Cadastre et plans publiés | Lecture et lien vers la version consultée |
| Base réglementaire | Recherche contrôlée ; aucune interprétation autonome |
| Registre des dossiers | Création et attribution après approbation ; aucun statut final |
| Messagerie | Brouillon ; envoi après approbation au destinataire affiché |
| Priorité, décision, condition, sanction | Interdites |

Chaque connecteur utilise une identité distincte au moindre privilège. Les
écritures portent une clé d'idempotence ; après un timeout, une lecture de
contrôle précède toute relance. Un coupe-circuit bloque messages et écritures
sans retirer la procédure manuelle.

## 5. Fourchette de planification

La fourchette porte uniquement sur le contrôle administratif standard :

`heures libérées / mois = 90 demandes × part workflow × 145 min × réduction / 60`

| Scénario | Part workflow | Réduction sur ce travail | Capacité brute / mois | Valeur brute à 78 CHF/h |
|---|---:|---:|---:|---:|
| Bas | 45 % | 40 % | 39,2 h | 3 054 CHF |
| Central | 60 % | 55 % | 71,8 h | 5 600 CHF |
| Haut | 72 % | 68 % | 106,5 h | 8 306 CHF |

La mise en place complète — achat, intégration, analyses d'impact, sécurité,
tests, formation et sortie fournisseur — est estimée à 48 000 CHF, puis
3 200 CHF par mois. Le cas bas ne couvre même pas le coût récurrent sur la seule
valeur de capacité : **il échoue au gate économique**. Le retour simple est de
20,0 mois au central et 9,4 mois au haut.

Le service ne décide pas sur le seul retour financier. Délai, qualité, accès,
égalité de traitement, traçabilité, charge des collaborateurs, coût de recours
et continuité du service restent des résultats distincts.

## 6. Gates publics P0 à P5

| Gate | Preuve exigée avant de passer |
|---|---|
| P0 — Opportunité | Mandat, population, baseline, options non-IA et autorité de décision |
| P1 — Légalité et impacts | Bases applicables, analyse d'impact, droits, langues, accessibilité et recours |
| P2 — Achat et architecture | Audit, sous-traitants, rétention, changements, export, suppression et sortie contractuels |
| P3 — Évaluation indépendante | Jeu représentatif, résultats segmentés, sécurité, abus, indisponibilité et contre-examen |
| P4 — Pilote contrôlé | Shadow mode, population bornée, approbateurs formés, plainte et arrêt immédiat |
| P5 — Production | Décision signée, notice publique, archivage, surveillance, fallback et date de retrait |

Les clauses européennes types pour l'achat public d'IA sont utilisées comme
checklist d'orientation, pas comme contrat suisse prêt à signer. Le marché exige
notamment les journaux nécessaires à l'audit, la notification des changements,
l'interdiction d'entraîner sur les dossiers, l'export complet et une sortie
testée. Le secret fournisseur ne peut empêcher le contrôle légal de l'autorité.

## 7. Évaluation préalable et conditions d'arrêt

Les 90 dossiers gelés couvrent deux langues, portail et scan, plans multi-pages,
patrimoine, zone de danger, servitude, pièce absente, signature contradictoire,
donnée de santé inattendue, opposition d'un voisin, règle modifiée, instruction
injectée dans un PDF, source indisponible, timeout après écriture et répétition
du même dossier.

| Mesure | Seuil | Résultat gelé |
|---|---:|---:|
| Faits et règles critiques reliés à la bonne version source | 100 % | 412/412 |
| Situations d'arrêt obligatoires escaladées | 100 % | 28/28 |
| Avis, score, priorité ou décision généré | 0 | 0 |
| Message ou écrit externe avant approbation | 0 | 0 |
| Information de recours ou canal omis | 0 | 0 |
| Doublon après timeout ou relance | 0 | 0/20 |
| Écart de reprise majeure entre langues | ≤ 5 points | 3,8 points |
| Repli complet vers la procédure humaine | 100 % | 16/16 |

Une référence juridique critique fausse ou introuvable, un effet non autorisé,
une discrimination grave, une perte de traçabilité, un recours inaccessible, un
changement fournisseur non évalué ou un dépassement de compétence arrête le
pilote indépendamment du gain de temps.

## 8. Pilote de 90 jours

- **Jours 1–15 — Mandat et baseline.** Confirmer compétence, finalité, options
  non-IA, population, responsables, métriques et conditions d'arrêt.
- **Jours 16–30 — Contrat et jeu gelé.** Fermer permissions, données,
  sous-traitants, versions, rétention, sortie et 90 cas de contradiction.
- **Jours 31–60 — Shadow mode.** Le collaborateur termine son contrôle avant de
  voir le paquet proposé. Aucun usager ni registre ne reçoit d'effet de l'agent.
- **Jours 61–90 — A2 live.** Un collaborateur qualifié approuve le message,
  l'écriture et l'attribution ; le pouvoir de décision reste entièrement humain.

Les 270 demandes consécutives servent de dénominateur commun. Les mesures de
temps comparent le travail accepté en shadow et en live ; la capacité mensuelle
est normalisée à partir de la part réellement acceptée, pas additionnée comme
une économie encaissée pendant le shadow mode.

## 9. Résultats synthétiques

Sur 270 demandes reçues :

- 166 entrent dans le workflow administratif standard ;
- 104 restent dans la procédure humaine, sans être refusées ni dépriorisées ;
- 121 paquets sont prêts pour approbation sans correction ;
- 37 demandent une correction mineure puis sont acceptés ;
- 8 s'arrêtent proprement avant effet ;
- 19 demandes papier ou accompagnées atteignent le même collaborateur public ;
- aucune recommandation d'octroi, de refus ou de condition n'est générée.

| Mesure | Manuel | Copilote A1 | Agent administratif A2 |
|---|---:|---:|---:|
| Temps humain actif médian, paquet accepté | 145 min | 104 min | 58 min |
| Réduction sur le travail standard accepté | référence | −28 % | **−60 %** |
| Débit théorique par heure humaine | 0,41 | 0,58 | 1,03 |
| Rapport de débit vs manuel | ×1 | ×1,39 | **×2,50** |
| Réception jusqu'au contrôle prêt | 6,8 jours | non mesuré | 3,2 jours |
| Décision publique humaine | 100 % | 100 % | **100 %** |

Les 158 paquets acceptés représentent 58,5 % des 270 demandes. En appliquant la
réduction de 60 % à ce dénominateur complet, le **plafond pondéré est d'environ
35 %** de temps administratif en moins sur toutes les demandes, pas 60 % du
service d'urbanisme.

Normalisées à 90 demandes par mois, les observations indiquent 76,4 heures de
capacité mensuelle. À 78 CHF/h et après 3 200 CHF de coût récurrent, la valeur
nette de capacité est d'environ 2 757 CHF par mois, avec un retour simple proche
de 17,4 mois. Ce calcul ne valorise ni décision plus rapide, ni projet autorisé,
ni effet économique pour la ville.

## 10. Décision publique et limites

**Décision : autoriser A2 pendant six mois pour le contrôle administratif
standard ; interdire toute recommandation ou décision urbanistique automatisée.**

P5 exige une décision signée, une notice publique intelligible, le périmètre et
la version du système, les responsables, le contrat et les analyses d'impact,
les résultats par langue et canal, un registre d'incidents, la continuité sans
IA et une revue à trois mois. Une extension vers l'analyse de conformité, la
rédaction des motifs ou la priorisation constitue un nouveau système et repasse
par P0.

La note
[IA dans l'administration publique : cas, preuves et limites](../../references/public-sector-planning-ai-cases.md)
sépare résultats de terrain, borne de tâche, ambition publique, gouvernance,
protection des données, audit et achat. Les sources rendent le cas plausible ;
elles ne valident ni les chiffres ni le droit applicable à Mont-Rive.

## 11. Dossier de preuves à transmettre

Le handoff contient : mandat et délégation, options non-IA, baseline et
dénominateurs, carte de la procédure, bases légales vérifiées, analyses d'impact,
consultation des personnes concernées, exigences d'accessibilité, registre des
données et sous-traitants, clauses d'achat et de sortie, permissions, modèle de
menace, jeu gelé, résultats segmentés, journal des 270 demandes, sources et
versions citées, approbations, effets relus, corrections, arrêts, plaintes,
recours, coûts, décision P5, notice publique, fallback et date de retrait.
