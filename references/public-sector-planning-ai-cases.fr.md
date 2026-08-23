# Note de preuves — IA dans l'administration publique et l'urbanisme

Dernière vérification : **19 août 2026**.

Cette note borne le cas synthétique
[Agent A2 pour les dossiers d'urbanisme](../examples/fr/service-public-agent-dossiers-urbanisme.md).
Elle sépare le contrôle administratif d'un dossier de l'exercice du pouvoir
public et du droit applicable à chaque autorité.

## Cas et repères officiels

| Source | Observation utile | Force et limite |
|---|---|---|
| [Local Government Association — Milton Keynes et Valon](https://www.local.gov.uk/case-studies/milton-keynes-city-council-and-valon-streamlining-planning-ai) | Pendant un pilote de trois mois, les collaborateurs déclarent valider les dossiers 60–80 % plus vite. Le délai réception-validation passe de 15,8 à 7,6 jours et le conseil estime 1 360 heures annuelles réallouables. Chaque décision reste celle d'un collaborateur. | Cas de terrain proche, avec feuilles de temps et registre public. Les mesures couvrent un pilote, un produit fournisseur et une période où d'autres facteurs peuvent influencer le pipeline ; 80 % reste une estimation de la tâche de validation, pas du service entier. |
| [Cambridge City Council — PlanAI](https://www.cambridge.gov.uk/news/2025/07/21/harnessing-the-power-of-ai-to-transform-planning-consultations) | Sur trois consultations et 320 contributions, la production de résumés et d'un rapport prend 16 minutes à l'outil ; les équipes avaient consacré plus de 60 heures à l'enregistrement et au résumé, dont 18,5 heures aux résumés. Les urbanistes continuent à lire chaque contribution pour répondre et décider. | Borne haute crédible sur une tâche textuelle très étroite. Elle ne mesure ni temps humain complet de vérification, ni instruction d'autorisation, ni décision publique. |
| [Local Government Association — Leeds et Xylo](https://www.local.gov.uk/case-studies/leeds-city-council-and-xylo-transforming-planning-ai) | Leeds traite plus de 6 000 demandes par an. Le produit a été co-conçu plus de six mois ; la gouvernance comprend analyses d'impact, exigences fournisseur, sources visibles, approbation par un urbaniste, audit trail et publication d'une fiche ATRS. | Analogue de gouvernance et d'intégration très pertinent, mais le récit ne publie pas une comparaison causale complète du temps ou des erreurs. |
| [MHCLG Digital — prototype de décision assistée](https://mhclgdigital.blog.gov.uk/2026/06/19/using-ai-to-support-planning-decisions-what-it-means-for-planners-and-residents/) | Le prototype anglais vise à réduire de huit à quatre semaines le traitement de demandes simples. Il repère règles et contraintes, tandis que chaque dossier reste évalué par un urbaniste. | Ambition publique en phase alpha, pas résultat observé. Le cadre juridique et les processus anglais ne se transfèrent pas tels quels en Suisse. |

## Gouvernance, droit et achat

| Source | Observation utile | Force et limite |
|---|---|---|
| [Chancellerie fédérale — intelligence artificielle](https://www.bk.admin.ch/en/artificial-intelligence) | La Suisse ne dispose pas encore d'une loi transversale propre à l'IA. Les règles existantes, notamment sécurité de l'information et protection des données, continuent de s'appliquer ; la responsabilité du contenu généré reste humaine. | Source fédérale actuelle. Une commune doit aussi qualifier son droit cantonal, sectoriel et procédural ; ce résumé n'est pas un avis juridique. |
| [PFPDT — IA et protection des données](https://www.edoeb.admin.ch/en/ai-and-data-protection) | La LPD est technologiquement neutre ; le PFPDT demande transparence sur finalité, fonctionnement et sources, contrôle des personnes et analyse d'impact lorsque le traitement présente un risque élevé. | Référence fédérale. Le régime de protection des données d'une autorité communale dépend notamment du droit public et cantonal applicable. |
| [Contrôle fédéral des finances — guide d'audit IA](https://www.efk.admin.ch/en/guide-to-the-audit-of-artificial-intelligence-in-the-federal-administration/) | L'audit doit couvrir fiabilité, rentabilité et compétences, ainsi que les dimensions techniques, organisationnelles, juridiques et éthiques sur tout le cycle de vie. | Cadre d'audit fédéral récent et directement utile, sans seuil de performance pour un service communal. |
| [Commission européenne — clauses types d'achat public d'IA](https://public-buyers-community.ec.europa.eu/communities/procurement-ai/resources/updated-eu-ai-model-contractual-clauses) | Les clauses proposent une version complète pour les systèmes à haut risque, une version légère et un commentaire d'adaptation. | Ressource d'orientation pour acheteurs publics. Elle doit être adaptée au marché, à la responsabilité, au droit des contrats et au droit suisse applicables. |
| [GOV.UK — Algorithmic Transparency Recording Standard](https://www.gov.uk/government/publications/guidance-for-organisations-using-the-algorithmic-transparency-recording-standard/algorithmic-transparency-recording-standard-guidance-for-public-sector-bodies) | L'ATRS structure une notice publique sur l'outil, son usage, ses responsables, ses données, ses risques et la supervision humaine. | Standard britannique, pas obligation suisse. Il fournit un analogue concret de transparence en deux niveaux, à adapter. |

## Ce que les chiffres ne prouvent pas

- Les 60–80 % de Milton Keynes concernent la validation des dossiers, pas le
  temps total jusqu'à la décision, et reposent en partie sur des déclarations de
  collaborateurs et une estimation haute.
- Le passage de 18,5 heures à 16 minutes de Cambridge concerne la génération de
  résumés. La lecture, la réponse, la délibération et la responsabilité restent
  humaines ; ce ratio ne peut pas être appliqué à un workflow administratif.
- Passer de 15,8 à 7,6 jours sur une période pilote ne démontre pas que l'IA est
  seule cause de toute l'amélioration du délai.
- Une décision humaine nominale ne suffit pas si la recommandation de l'outil
  ancre le jugement, si les sources ne sont pas accessibles ou si le
  collaborateur manque de temps et de pouvoir pour contredire.
- Une meilleure vitesse ne prouve ni égalité de traitement, ni qualité
  juridique, ni meilleur accès au service, ni réduction des recours.

## Pourquoi Mont-Rive adopte une frontière plus étroite

Les cas anglais montrent que repérer documents, règles et contexte peut libérer
une part importante du temps d'instruction. Le cas synthétique refuse toutefois
la recommandation de décision, la rédaction des motifs et la priorisation. Cette
frontière réduit l'ancrage du jugement et rend les erreurs plus détectables :
chaque fait et chaque règle doivent être vérifiés avant l'effet.

Le workflow conserve guichet, courrier et assistance. Les sorties, corrections,
arrêts, délais et plaintes sont ventilés par langue et canal. Les petits groupes
restent `non évaluables` plutôt que fusionnés dans une moyenne rassurante.

## Mesures minimales d'un vrai pilote public

Conserver volume total, part workflow, motif de sortie, langue, canal, type de
demande et complexité ; temps humain actif, temps de cycle, références fausses
ou périmées, reprises, escalades, effets, doublons, coûts complets, charge de
vérification, accessibilité, plaintes, accès au dossier, recours et décisions
renversées. Mesurer séparément le contrôle administratif, l'instruction, la
décision, sa notification et le résultat aval.

La publication d'une notice, les analyses d'impact, le contrat auditable, le
fallback, l'archivage et la date de retrait font partie de la performance du
système public ; ce ne sont pas des annexes au gain de temps.
