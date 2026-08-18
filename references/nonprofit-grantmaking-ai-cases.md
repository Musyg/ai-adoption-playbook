# Note de preuves — IA et instruction des subventions

Dernière vérification : **19 août 2026**.

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
