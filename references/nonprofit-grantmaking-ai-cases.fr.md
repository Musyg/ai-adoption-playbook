# Note de preuves — IA et instruction des subventions

Dernière vérification : **19 août 2026** ; preuves sur le tri et la collecte ajoutées le **18 novembre 2026**.

Cette note borne le cas synthétique
[Agent A2 pour les dossiers de subvention](../examples/fr/association-agent-dossiers-subventions.md).
Elle distingue volontairement l'administration d'un dossier de la décision qui
affecte l'accès au financement.

## Repères externes

| Source | Observation utile | Force et limite |
|---|---|---|
| [Candid — *Will AI soon be reviewing your grant applications?*](https://candid.org/blogs/will-foundations-soon-use-ai-to-screen-grant-applications/) | Dans l'enquête 2025, 1 % des 529 fondations répondantes déclarent utiliser l'IA générative pour filtrer des candidatures ou aider à décider ; 97 % répondent non. Des répondants citent les résumés et tâches administratives comme usages plus acceptables. | Enquête sectorielle directement pertinente, mais américaine, déclarative et sans mesure de productivité. |
| [Microsoft Learn — Degrees of Change](https://learn.microsoft.com/power-platform/guidance/case-studies/nonprofit) | Une organisation de 20 salariés gère plus de 1 000 candidatures avec 150 évaluateurs bénévoles. Le système centralise les dossiers, aide l'extraction et présente des recommandations de matching au personnel pour revue. | Analogue fonctionnel proche et chiffres de volume utiles ; récit de mise en œuvre fournisseur, sans comparaison causale ni temps détaillé. |
| [Microsoft — National Zakat Foundation](https://www.microsoft.com/en/customers/story/23068-national-zakat-foundation-microsoft-copilot-studio) | Le récit annonce 80 % de réduction du délai de versement après intégration des données, automatisation et agents. Certaines actions déterminent l'éligibilité ou transmettent à une personne. | Repère haut sur un workflow d'aide réel ; grande organisation, chiffres client/fournisseur, plusieurs changements simultanés et frontière d'automatisation plus large que le cas synthétique. |
| [FDPIC — information et décision individuelle automatisée](https://www.edoeb.admin.ch/en/duty-to-provide-information) | L'article 21 de la LPD impose, dans les situations visées, d'informer la personne d'une décision individuelle entièrement automatisée, de lui permettre d'exprimer son point de vue et de demander une revue humaine. | Source officielle suisse. L'application exacte dépend du contexte juridique ; le playbook ne fournit pas d'avis juridique. |
| [GOV.UK — guide d'évaluation des interventions IA](https://www.gov.uk/government/publications/the-magenta-book/guidance-on-the-impact-evaluation-of-ai-interventions-html) | Le cas hypothétique de subvention recommande de suivre appels et appels admis pour détecter les faux positifs, et de maintenir un contrôle supplémentaire par les agents avant rejet. | Guide officiel d'évaluation, pas résultat de terrain ni cas de fondation. |
| [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) | Le cadre demande de documenter les rôles humain–IA, les limites, les impacts sur individus et communautés, les coûts non monétaires, la représentativité et la consultation des personnes affectées. | Cadre volontaire généraliste, utile pour structurer le contrôle mais sans seuil de performance sectoriel. |

## Ce que ces sources ne permettent pas d'affirmer

- Le 80 % publié pour NZF n'est pas une prévision pour une autre fondation : il
  porte sur le délai de versement après plusieurs changements techniques et
  organisationnels, pas seulement sur un modèle ou un temps humain actif.
- Le cas Degrees of Change ne publie pas de réduction causale du temps, du coût
  ou des erreurs attribuable à l'IA seule.
- Le faible taux d'usage déclaré par Candid ne prouve ni inefficacité ni danger ;
  il montre que l'automatisation de la décision reste rare et contestée.
- Une revue humaine nominale ne suffit pas. Elle doit disposer des sources, du
  temps, de la compétence et du pouvoir de contredire le système.
- Pseudonymiser un paquet ne supprime pas automatiquement les biais liés au
  langage, au budget, à la géographie, à la forme juridique ou au canal d'accès.

## Pourquoi le cas choisit une frontière administrative

La Fondation Lien Local autorise l'agent à contrôler une checklist publiée,
préparer un paquet et exécuter des écritures après approbation. Elle lui interdit
de produire un score de mérite, de vulnérabilité ou de probabilité de succès.
Cette frontière réduit la charge de transport entre systèmes sans ancrer le
jugement du comité sur une recommandation opaque.

Le haut de la fourchette de productivité reste plausible pour un workflow
numérique standard et bien intégré. Le portefeuille global conserve toutefois
les dossiers hors ligne, accompagnés, ambigus, sensibles ou propres à un nouveau
programme. Une amélioration sur le sous-ensemble standard ne doit pas financer
une réduction d'accès pour les autres demandeurs.

## Mesures minimales d'un vrai pilote

Conserver volume total, part workflow, motif de sortie, langue, canal, type et
taille d'organisation lorsque légalement et éthiquement justifiés ; temps humain
actif, temps de cycle, corrections, escalades, erreurs critiques, messages et
écritures, doublons, coût complet, plaintes, recours, décisions renversées et
résultat aval. Les groupes trop petits restent `non évaluables` plutôt que
fusionnés dans une moyenne rassurante.

La décision de financement, son explication et son éventuelle contestation sont
mesurées séparément de l'efficacité administrative.

## Preuves sur le tri et la collecte (18 novembre 2026)

Aucune étude ne mesure le temps humain actif d’une tâche associative typique (une demande de subvention, un rapport d’impact, un appel aux dons) avec et sans IA. Ce qui existe mesure des décisions, un accord ou des dons.

| Étude | Protocole et échantillon | Résultat | Usage ici |
| --- | --- | --- | --- |
| [Lane et al., tri MIT Solve](https://mackinstitute.wharton.upenn.edu/wp-content/uploads/2025/04/WTIC.2025_Lane-Jacqueline_The-Narrative-AI-Advantage.pdf) | Randomisé, 48 solutions, 228 évaluateurs, 3 002 décisions (2024) | Les conseils de l’IA font passer le taux de sélection de 68 % à 62 % (score seul) et 57 % (avec justification rédigée). Temps plafonné à 2,5 minutes, donc aucun résultat sur le temps | Risque d’ancrage sur l’IA ; aucun gain de temps |
| [Présélection la Caixa](https://www.cambridge.org/core/product/D17CC86C884D4F9E3A6DD9ABF3F4605E/core-reader) | Essai parallèle caché, puis usage opérationnel, environ 500 dossiers par appel | Les relecteurs ont repêché 30 dossiers sur 216 (2022) et 35 sur 98 (2023) ; deux projets financés auraient été écartés | Chaque exclusion doit être relue |
| [Thelwall et al., dossiers UKRI](https://arxiv.org/pdf/2609.25327) | 2 267 dossiers passés notés par des modèles de langage | Corrélation de 0,186 avec les évaluateurs individuels, sous l’accord entre évaluateurs (0,242) | Test rétrospectif avant usage |
| [Rospocher, dossiers contrôlés](https://aclanthology.org/2026.aacl-short.44.pdf) | Dossiers synthétiques au contenu identique | Notes plus basses pour un profil de publications plus faible et une institution moins cotée | Tester le biais de prestige |
| [Caffier et al., appels aux dons](https://arxiv.org/pdf/2604.03202) | Expériences en ligne, environ 650 participants chacune, petits dons réels | Les appels rédigés par IA non divulgués font aussi bien ou mieux que les appels humains | Contexte ; la divulgation change le résultat dans d’autres études |

Les pratiques des bailleurs divergent. [MacArthur](https://www.macfound.org/about/our-policies/artificial-intelligence) n’utilise pas l’IA pour décider ou évaluer des subventions. [Foundation Scotland](https://www.foundationscotland.org.uk/documents/237/AI_Policy.pdf) l’utilise pour présélectionner, à titre indicatif, avec relecture humaine obligatoire et information publique. Au Royaume-Uni, 13 % des bailleurs demandent aux requérants de déclarer leur usage de l’IA ([Charity Digital Skills Report 2026](https://charitydigitalskills.co.uk/report/detailed-findings/grantmaking-trusts-and-foundations/), 123 bailleurs). Un champ de déclaration dans le formulaire coûte peu et donne au bailleur ses propres données.
