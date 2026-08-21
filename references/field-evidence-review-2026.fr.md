# Revue des preuves publiques de terrain sur l’adoption de l’IA

Dernière vérification : **19 août 2026**.

Cette revue répond à une question précise : que permettent réellement
d’affirmer les observations publiées lorsqu’un copilote, un agent métier borné
ou une agence orchestrée est introduit dans un travail réel ?

Elle ne remplit pas `field-notes/index.json`. Des études publiques produites par
des tiers ne deviennent pas des retours terrain de première main. Elles servent
à borner les hypothèses, les modes d’échec et les limites de transfert d’un
pilote.

## La conclusion en une page

1. Des gains élevés existent sur certaines tâches étroites. Ils ne constituent
   pas une propriété universelle de l’adoption de l’IA.
2. Les meilleures preuves sur les copilotes mesurent généralement une tâche, un
   travailleur ou un groupe d’utilisateurs sélectionné. Elles prouvent rarement
   un résultat à l’échelle de toute l’organisation.
3. La meilleure expérience directe sur un agent métier trouvée dans cette revue
   montre pourquoi le dénominateur est décisif. L’agent réduit de 16,8 % la
   durée des conversations éligibles, mais seulement 5,8 % des conversations
   sont éligibles. Sur l’ensemble du flux, la réduction tombe à 3,2 % et la note
   client des conversations éligibles baisse de 0,412 point.
4. L’activité et la livraison divergent. Les agents de code autonomes sont
   associés à 180 % de commits supplémentaires, mais à seulement 30 % de
   versions livrées supplémentaires et à aucun gain détectable d’usage total.
5. Aucune étude de terrain causale et indépendante trouvée ici ne justifie un
   facteur générique de 5 à 12 sur les résultats métier acceptés d’une agence
   multi-agents. Ces facteurs peuvent servir de scénarios de stress, pas de
   fourchettes probantes.
6. Le niveau initial, l’adéquation du workflow, les garde-fous, l’éligibilité,
   l’adoption, la supervision et le goulot aval expliquent une grande partie de
   la dispersion observée.

## Force des preuves utilisée ici

| Classe | Signification | Ce qu’elle peut soutenir |
|---|---|---|
| **A** | Étude randomisée ou quasi expérimentale robuste dans un workflow réel avec résultats objectifs | Une affirmation causale ou quasi causale dans le contexte mesuré |
| **B** | Télémétrie opérationnelle avec comparaison, résultat administratif ou étude d’événement appariée | Une association bornée ou une interprétation causale sous hypothèses explicites |
| **C** | Tâche contrôlée réaliste, benchmark externe ou déploiement avant-après | Un signal de capacité ou de processus, pas un résultat global d’organisation |
| **D** | Évaluation officielle, dépôt réglementaire ou cas client avec méthode décrite mais sans contrôle causal | Une déclaration de déploiement documentée avec ses limites d’attribution |
| **E** | Cas fournisseur, témoignage ou description d’architecture | Une hypothèse et un motif d’implémentation seulement |

La taille ne corrige pas un mauvais indicateur. Une enquête auprès de 20 000
utilisateurs mesure toujours une perception si le temps gagné est déclaré. Un
benchmark mesure toujours un benchmark même si son interface ressemble à un
bureau.

## Matrice des preuves

| Contexte et source | Niveau | Classe | Résultat mesuré | Limite de transfert |
|---|---|---:|---|---|
| [Support client, 5 172 agents](https://academic.oup.com/qje/article/140/2/889/7990658) | Copilote | A | 15 % de problèmes résolus en plus par heure en moyenne. Les moins expérimentés gagnent le plus. Les meilleurs subissent de petites baisses de qualité. | Un support mature, un assistant entraîné et un humain responsable de chaque conversation. |
| [66 entreprises, 7 137 travailleurs intellectuels](https://www.nber.org/papers/w33795) | Copilote | A | Les utilisateurs actifs traités passent environ deux heures de moins par semaine dans les emails et réduisent le travail hors horaires. Aucun changement agrégé détectable dans la quantité ou la composition des tâches. | Assistant bureautique intégré et attribution individuelle. Cela ne démontre pas la réalisation autonome d’un workflow. |
| [Innovation produit chez P&G, 776 professionnels](https://www.nber.org/papers/w33641) | Copilote et soutien d’équipe | A | Une personne avec IA atteint la performance d’une équipe de deux sans IA sur le défi mesuré. L’IA réduit aussi les silos fonctionnels. | Exercice d’innovation borné, sans responsabilité de déploiement, action externe ni succès produit longitudinal. |
| [Entrepreneurs kenyans, 640 petites entreprises](https://www.hbs.edu/ris/download.aspx?name=24-042.pdf) | Conseiller ouvert | A | L’effet moyen sur revenus et profits ne se distingue pas statistiquement de zéro. Les meilleurs au départ gagnent environ 15 %, les plus faibles perdent environ 8 %. | Conseil par WhatsApp, pas agent connecté. Résultat très pertinent pour un indépendant qui doit juger et appliquer lui-même un conseil générique. |
| [Assistant de service Alibaba, 5 940 nouveaux agents](https://arxiv.org/abs/2603.29888) | Copilote | A, prépublication | À usage complet, le temps d’identification baisse de 32,3 %, la durée de 4,2 %, l’insatisfaction de 15,4 % et la note augmente de 5,3 %. L’usage réel moyen est de 28,7 %, donc les effets en intention de traiter sont bien plus faibles. Les meilleurs peuvent perdre en qualité. | L’humain accepte, modifie ou rejette. Les estimations à usage complet ne sont pas des effets populationnels. |
| [Service agentique Alibaba, 647 travailleurs et 680 676 conversations](https://arxiv.org/abs/2605.14830) | Agent métier borné | A, prépublication | La durée baisse de 16,8 % sur les conversations éligibles, mais la note client baisse de 0,412 point. Les conversations éligibles représentent 5,8 % du volume. Sur tout le flux, la durée baisse de 3,2 % et la qualité ne change pas matériellement. Seulement 35 % des conversations éligibles traitées par l’agent ne nécessitent aucune escalade. | Expérience de 17 jours, problèmes standardisés et superviseur humain affecté à chaque conversation éligible. C’est la meilleure preuve directe trouvée, pas un taux générique. |
| [Équipes publicitaires humaines et IA, 2 234 participants](https://arxiv.org/abs/2503.18238) | Agent collaboratif | A/C, prépublication | Les équipes humain-IA produisent 50 % de publicités en plus par personne et améliorent le texte, mais l’image et la diversité baissent. Sur 4,9 millions d’impressions, clics et coûts globaux sont similaires aux équipes humaines. | Pas de condition humain seul. L’IA collabore et crée, mais ne soumet pas les campagnes de façon autonome. |
| [Sept expériences en commerce en ligne](https://arxiv.org/abs/2510.12049) | Du copilote au workflow agentique | A, prépublication | Les effets sur les ventes vont de l’absence d’effet détectable à 16,3 %, selon l’amélioration marginale sur le processus existant. Les petits vendeurs et les nouveaux gagnent souvent davantage. | Grande plateforme, randomisation côté consommateurs, prix fixes et infrastructure à grande échelle. Ce n’est pas une estimation directe pour une TPE indépendante. |
| [Développeurs open source expérimentés, 246 tâches réelles](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) | Copilote et agent de code | A | Les outils de début 2025 ralentissent de 19 % les 16 développeurs expérimentés. Ils anticipent 24 % d’accélération et croient encore avoir gagné 20 % après l’expérience. | Dépôts matures très bien connus, outils de début 2025 et petit échantillon. Les [données de fin 2025](https://metr.org/blog/2026-02-24-uplift-update/) suggèrent une amélioration, mais la sélection empêche d’en estimer correctement l’ampleur. |
| [Plus de 100 000 développeurs GitHub](https://www.nber.org/papers/w35275) | De l’autocomplétion à l’agent autonome | B | Effets cumulés de 40 % sur les commits pour l’autocomplétion, 140 % avec agents interactifs et 180 % avec agents autonomes. Le dernier chiffre tombe à 50 % sur les projets et 30 % sur les versions. Quatre places d’applications ne montrent aucune hausse d’usage total. | Étude d’événement appariée, pas attribution randomisée. Elle mesure la production logicielle et révèle les goulots humains aval. |
| [Tutor CoPilot en tutorat scolaire réel](https://edworkingpapers.com/sites/default/files/ai24-1054.pdf) | Copilote expert | A, document de travail | Les élèves ont 4 points de pourcentage de probabilité supplémentaire de maîtriser les sujets. Ceux des tuteurs les moins bien notés gagnent 9 points. | Deux mois, tuteurs novices, un fournisseur et responsabilité humaine conservée. |
| [Mathématiques au lycée, près de 1 000 élèves](https://doi.org/10.1073/pnas.2422633122) | Copilote apprenant | A | Pendant l’exercice assisté, GPT standard améliore les notes de 48 % et le tutorat protégé de 127 %. Sans IA, le groupe GPT standard obtient 17 % de moins que le contrôle. Le tutorat protégé supprime le dommage sans effet positif autonome. | Résultat pédagogique. Il prouve que performance assistée et compétence conservée sont deux mesures différentes. |
| [Soins primaires kenyans, 9 691 patients](https://www.nature.com/articles/s41591-026-04503-6) | Aide à la décision clinique | A | La qualité documentaire s’améliore, mais le critère principal d’échec de traitement ne diffère pas significativement. Un éventuel bénéfice patient est probablement modeste. | Seize établissements, autorité clinique conservée et aide à la décision, pas agent clinique autonome. |
| [Médecine générale néerlandaise, 535 consultations](https://www.nature.com/articles/s41746-026-02454-3) | Scribe ambiant | C | Le temps documentaire baisse de 42,7 secondes par consultation. La durée totale et le débit ne changent pas. Chaque synthèse nécessite une revue du médecin. | Avant-après avec 12 cliniciens et fenêtres courtes. Certaines notes sont inexactes ou moins complètes. |
| [Système hospitalier, 1 547 cliniciens actifs](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2849634) | Scribe ambiant | B | Le temps médian de note passe de 7,1 à 6,1 minutes par rendez-vous. Aucune association avec le nombre de rendez-vous par jour. Les effets sont modestes et l’adoption volontaire. | Série temporelle interrompue, un système, un outil et environ 8 % d’adoption active. |
| [Expérience interadministrations britannique, 20 000 licences](https://www.gov.uk/government/publications/microsoft-365-copilot-experiment-cross-government-findings-report) | Copilote | D | Les utilisateurs déclarent 26 minutes gagnées par jour et environ 80 % sont actifs. Le rapport ne détermine pas l’usage du temps libéré et exige une supervision humaine. | Temps déclaré, pas de contrôle formel et tâches de bureau. Les agents introduits pendant l’expérience sont hors analyse. |
| [Essai DWP britannique, 3 549 licences](https://www.gov.uk/government/publications/an-evaluation-of-dwps-microsoft-copilot-365-trial/an-evaluation-of-dwps-microsoft-365-copilot-trial) | Copilote | D/B | Une régression avec groupe non utilisateur estime 19 minutes gagnées par jour. 73 % déclarent de meilleurs résultats. Attribution non randomisée, pas de baseline et mesures déclarées. | Personnel administratif, pas opérations de première ligne. L’étude avertit elle-même des biais de sélection et de déclaration. |
| [Benchmark multi-tâches CORPGEN](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/) | Agence orchestrée | C | Avec 46 tâches concurrentes, CORPGEN termine 15,2 % contre 4,3 % pour les baselines, soit un facteur relatif de 3,5. Le taux absolu reste 15,2 %. | Environnement d’entreprise simulé pendant six heures. Ce n’est ni une production réelle ni un résultat métier. |
| [Remote Labor Index](https://scale.com/blog/rli) | Agent autonome généraliste | C | Le meilleur agent termine 2,5 % de 240 projets freelance réels au niveau professionnel attendu. | Benchmark externe de travaux larges et inconnus. Il n’estime pas un workflow spécialiste profondément intégré. |
| [AuditGPT, IBM, Klarna et Salesforce](agentic-integration-levels.md) | Agents spécialistes | D/E | Les cas publiés annoncent des réductions ou taux de confinement très élevés sur des processus sélectionnés. | Preuves surtout produites par l’organisation, le fournisseur ou un dépôt réglementaire sans contrôle causal. Scénarios hauts, pas bornes universelles. |

## La marge basse et la marge haute, sans faux chiffre

Il n’existe pas un pourcentage empirique unique, bas et haut, pour
« l’implémentation IA ». Les publications soutiennent des plages différentes
selon la question :

| Question | Preuves publiques défendables | Ce qu’il ne faut pas en déduire |
|---|---|---|
| L’assistance accélère-t-elle une tâche ? | Du ralentissement mesuré de 19 % à de très grands gains sur des tâches assistées étroites. Les études matures en entreprise se concentrent souvent entre aucun changement agrégé et environ 40 % d’amélioration d’une tâche ou d’un travailleur. | Ne pas multiplier ce chiffre par toute la masse salariale ou toutes les heures travaillées. |
| Un conseil IA ouvert améliore-t-il l’activité d’un indépendant ? | Effet moyen proche de zéro dans le meilleur essai direct en petite entreprise, avec environ moins 8 % pour les plus faibles au départ et plus 15 % pour les meilleurs. | L’accès au conseil n’implique pas une bonne sélection ni une bonne exécution. |
| Un agent borné termine-t-il un workflow ? | La preuve directe montre une vitesse significative sur une petite part éligible, avec un compromis de qualité. | Ne pas confondre vitesse, confinement ou absence d’escalade avec valeur métier acceptée de bout en bout. |
| Une agence orchestrée produit-elle un facteur de 5 à 12 ? | Les benchmarks d’architecture et les cas d’entreprise en font un scénario de stress plausible sur certains workflows numériques. Aucune preuve causale indépendante trouvée ici n’en fait une plage générique de résultats acceptés. | Ne pas attribuer ce multiplicateur à Talos, Hermes ou une architecture sans benchmark gelé propre. |

## Le modèle du dénominateur

Utiliser les dossiers bruts, pas un multiplicateur :

```text
heures humaines de la baseline
- heures humaines évitées sur les cas éligibles acceptés
- heures évitées sur les cas acceptés sans intervention
+ supervision, corrections, exceptions, incidents et fallback
= heures humaines nettes après IA
```

Puis publier :

```text
réduction sur toute la charge =
(heures de baseline - heures nettes après IA) / heures de baseline
```

Conserver quatre résultats supplémentaires séparés :

1. l’éligibilité sur chaque demande entrante ;
2. la qualité acceptée et le taux de correction majeure ;
3. le résultat aval livré, par exemple problème résolu, devis payé, version
   livrée, revenu, apprentissage conservé ou résultat patient ;
4. les dommages critiques, effets non autorisés et la complétude des traces.

## Conséquences pour une agence indépendante comme Talos ou Hermes

Un indépendant peut connaître un levier personnel supérieur à une moyenne de
grande entreprise parce qu’une même personne gère l’entrée, la recherche, la
production, le contrôle et la livraison. Moins de passages organisationnels peut
réduire l’atténuation observée dans les grandes structures. Cette concentration
transforme aussi le jugement, la capacité de revue, la demande commerciale et
la confiance client en goulots très durs.

Le scénario haut correct est donc conditionnel :

- service stable et numérisé ;
- règle d’éligibilité étroite ;
- sources et outils reproductibles ;
- agents spécialistes avec permissions isolées ;
- registre déterministe des acceptations et effets ;
- demande suffisante pour réutiliser la capacité libérée ;
- temps de supervision et d’exception mesuré ;
- humain capable de détecter la sortie de compétence du système.

Sans ces conditions, l’orchestration multi-agents peut seulement produire plus
de travail intermédiaire, de files de revue et d’erreurs plausibles.

## Les preuves terrain qui manquent encore

La littérature publique ne peut pas terminer l’item de roadmap sur le retour
terrain anonymisé. Il faut encore un vrai pilote autorisé qui :

1. compare manuel, copilote, agent unique et agence orchestrée sur le même
   workflow gelé lorsque c’est possible ;
2. garde dans le dénominateur les cas non éligibles, abstentions, échecs,
   escalades et données manquantes ;
3. mesure temps humain actif, qualité acceptée, réalisation sans intervention,
   supervision, corrections, incidents, coût et résultat aval ;
4. fait revoir indépendamment anonymisation, calculs, langage causal et limites
   de transfert ;
5. respecte la règle d’admission de `field-notes/README.fr.md`.

Jusque-là, le statut honnête est : preuves externes profondément revues, preuve
terrain de première main toujours ouverte.
