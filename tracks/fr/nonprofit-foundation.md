# Parcours association ou fondation — 60 jours

## Particularités

La valeur ne se réduit pas à un gain financier. Les bénéficiaires, donateurs, bénévoles, partenaires et populations vulnérables peuvent subir des effets différents. La mission, la confiance et l’équité font partie de la baseline.

Le [cas synthétique Fondation Lien Local](../../examples/fr/association-agent-dossiers-subventions.md)
montre comment borner un agent métier A2 à l’administration de dossiers de
subvention : les canaux hors ligne restent ouverts, les preuves sont segmentées
par langue et canal, et 100 % des décisions de financement restent humaines.

## Ce que les preuves publiées permettent (vérifié le 18 novembre 2026)

L’usage est répandu mais peu encadré, et aucun gain de temps mesuré n’existe pour une tâche associative typique.

- Associations britanniques : 79 % explorent au moins l’IA, mais seules 38 % l’utilisent de façon active ou stratégique, et 18 % ont une politique formelle ([Charity Digital Skills Report 2026](https://charitydigitalskills.co.uk/report/detailed-findings/artificial-intelligence/), 807 répondants auto-sélectionnés).
- Associations américaines : 53 % signalent un usage par le personnel hors des canaux approuvés. Parmi les rares organisations qui ont signalé un incident, le type le plus fréquent est la saisie de données sensibles contre la politique interne ([NTEN et Bridgespan, septembre 2026](https://content.nten.org/wp-content/uploads/2026/09/2026-State-of-Nonprofit-AI.pdf), 917 répondants).
- Donateurs : 68 % jugent très importante la protection des données sensibles, alors que 36 % des organisations disent l’assurer ([Blackbaud Institute, juin 2026](https://institute.blackbaud.com/wp-content/uploads/2026/06/Bridging-the-AI-Effectiveness-Gap_Blackbaud-Institute.pdf)).
- France : sans référent IA interne, 72 % des organisations n’ont aucun cadre ([France générosités, octobre 2026](https://www.francegenerosites.org/ressources/lusage-de-lia-au-sein-des-osbl-volet-2-ethique-etude-france-generosites-oct-2026/)).

Ce sont toutes des enquêtes déclaratives (grade C). La seule étude contrôlée avec temps chronométré dans la philanthropie, sur le tri des candidatures de MIT Solve, plafonnait chaque décision à 2,5 minutes : elle ne peut donc pas montrer de gain de temps. Mesurez votre propre baseline avec la fiche de mesure ci-dessous.

## Rôles à nommer dès le jour 1

- **Conseil** : approuve la politique IA et revoit les incidents au moins chaque trimestre. Il reste responsable ; aucune décision n’est déléguée à l’IA seule.
- **Référent IA ou petite task force** : tient l’inventaire des usages, y compris non officiels, la liste des outils approuvés et les fiches de mesure.
- **Responsable protection des données** : classe les données, mène les analyses d’impact requises (LPD ou RGPD), vérifie les contrats.
- **Responsable métier et relecteur désigné** pour chaque cas d’usage.
- **Représentants du personnel**, là où la loi impose une consultation (par exemple le CSE en France).
- **Pour les fondations, le comité d’attribution** : garde chaque décision de financement.

## Jours 1–15 — Mandat aligné sur la mission

- nommer un responsable métier et un garant de la mission ;
- consulter les personnes proches des bénéficiaires ;
- recenser données sensibles, secrets, consentements et restrictions des financeurs ;
- définir résultats attendus et dommages à éviter ;
- exclure toute décision automatisée non autorisée sur l’accès à l’aide.

## Jours 16–30 — Prioriser et protéger

Commencer par un cas de soutien : recherche documentaire, synthèse interne, traduction contrôlée, préparation de campagne ou tri administratif avec validation.

- classifier les populations et segments pouvant être défavorisés ;
- vérifier accessibilité, langues, contexte culturel et canaux hors ligne ;
- évaluer fournisseur, réutilisation des données et dépendance ;
- préparer un mécanisme de plainte ou d’escalade humaine.

## Jours 31–45 — Évaluer

- utiliser des cas réels autorisés et représentatifs ;
- mesurer la qualité par langue et groupe pertinent ;
- tester l’invention de faits, la stigmatisation et la divulgation ;
- comparer le temps économisé à la charge de vérification ;
- documenter qui juge et avec quelle compétence.

## Jours 46–60 — Pilote et redevabilité

- shadow mode, puis copilote si les seuils sont atteints ;
- informer les utilisateurs lorsque nécessaire ;
- surveiller corrections, plaintes, accès et incidents ;
- rendre la décision compréhensible au conseil ou organe de surveillance ;
- publier, lorsque approprié, une description proportionnée de l’usage et des garanties.

## Gate spécifique mission

Même si la productivité augmente, le pilote s’arrête si la mission, la dignité, l’accès équitable, la confidentialité ou la confiance se dégradent.

## Gates supplémentaires par usage

| Usage | Passage seulement si | Pourquoi |
| --- | --- | --- |
| Tout usage | Classes de données définies ; outils approuvés listés, sans entraînement sur vos données ; personnel équipé d’un outil conforme plutôt que soumis à une interdiction générale | Les données sensibles dans des outils publics sont le type d’incident le plus signalé |
| Contenus pour les donateurs | Une personne relit chaque texte externe ; la divulgation est proportionnée au risque de tromper le donateur ; aucune image synthétique de bénéficiaires sans examen de dignité | Lignes directrices du Fundraising Regulator (décembre 2025) ; article 50 de l’AI Act applicable depuis le 2 août 2026 ; des expériences montrent qu’une IA divulguée peut faire baisser les dons, selon la formulation |
| Services aux bénéficiaires | Aucun canal de crise, de santé ou d’éligibilité confié à l’IA seule ; chaque note rédigée par IA est relue ; escalade humaine testée | Un chatbot de ligne d’écoute a été retiré en 2023 après des conseils nocifs ; des transcriptions par IA dans le travail social britannique ont introduit de fausses affirmations |
| Tri des demandes de subvention | L’IA résume ou classe mais ne décide jamais ; chaque exclusion est relue par une personne ; un test rétrospectif sur des dossiers passés vient d’abord ; les requérants sont informés | Dans un test randomisé, les conseils d’une IA ont fait baisser le taux de passage de 9 points ; chez la Caixa, les relecteurs ont repêché 30 dossiers sur 216 et 35 sur 98 signalés |

Le Fonds national suisse donne des règles réutilisables par une fondation : les requérants restent seuls auteurs, et les évaluateurs forment d’abord leur propre jugement, utilisent des réglages qui empêchent stockage et entraînement, déclarent leur usage et ne laissent aucun rôle à l’IA dans la décision de financement ([requérants](https://snf.ch/en/Gz1VrJlkLyay4H7z/news/the-snsfs-approach-to-the-use-of-artificial-intelligence-in-funding-applications), [évaluateurs](https://www.snf.ch/en/iOg3Y6tvhQO5yksA/news/ai-guidelines-for-reviewers)).

## Fiche de mesure par cas d’usage

Consigner, avant et après activation :

- la tâche et son unité (une demande, un rapport, un dossier trié) ;
- le temps sans IA sur un lot de tâches comparables, et le temps avec IA **y compris vérification et correction** ;
- la qualité jugée par un relecteur qui ignore quelle version a utilisé l’IA ;
- le taux de reprise, les erreurs par gravité, les plaintes et incidents ;
- pour le tri : part des dossiers exclus qu’une personne réintègre, évolution du taux de passage, accord avec les évaluateurs humains ;
- le statut de divulgation et le coût.

Une estimation déclarative reste du contexte, même convertie en francs. Deux essais scolaires menés par une fondation caritative britannique, avec carnets de temps et qualité jugée en aveugle, sont un bon modèle de protocole, pas un chiffre à reprendre.

Études sur le tri et la collecte : [note de preuves sur l’instruction des subventions](../../references/nonprofit-grantmaking-ai-cases.fr.md).

