# Note de preuves — Devis B2B en PME

Dernière vérification : **19 août 2026**.

Cette note borne le cas synthétique
[Agent métier A2 pour les devis B2B](../examples/fr/pme-agent-metier-devis-b2b.md).
Elle ne transforme pas des études de cas fournisseur ou des résultats de grande
entreprise en promesse pour une PME.

## Ce que les sources permettent de dire

| Source | Observation utile | Force et limite |
|---|---|---|
| [OCDE — *Generative AI and the SME Workforce*](https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-4.html) | Dans l'enquête 2024, 31 % des PME déclarent un usage de l'IA générative, mais 29 % seulement l'utilisent dans leurs activités cœur. 65,1 % des utilisatrices déclarent une amélioration de performance ; l'enquête ne mesure pas son ampleur. L'OCDE rappelle que les économies observées à l'échelle de toutes les heures de travail sont bien plus diluées que les gains sur une tâche. | Enquête multi-pays pertinente pour les PME ; auto-déclaration et pas de mesure causale du workflow de devis. |
| [QJE — *Generative AI at Work*](https://academic.oup.com/qje/article/140/2/889/7990658) | Sur 5 172 agents de support, l'assistance IA augmente en moyenne de 15 % les conversations résolues par heure, avec des effets très hétérogènes. | Étude empirique solide, mais sur un copilote de support dans une entreprise, pas sur un agent de devis A2. |
| [Microsoft/Ingram Micro — InstaQuote](https://www.microsoft.com/en/customers/story/1332782617804604736-ingram-micro-partner-professional-services-microsoft-power-platform) | Le système lit les demandes de devis par courriel, extrait références et pièces, valide les produits contre une base, interroge des API de prix et prépare un devis remis au commercial. | Bon analogue fonctionnel ; grande entreprise, récit client/fournisseur et pas de résultat comparatif complet publié. |
| [AWS/Grupo Elfa — automatisation des cotations](https://aws.amazon.com/pt/blogs/aws-brasil/grupo-elfa-como-genai-automatizou-cotacoes-e-apoiou-a-empresa-a-incrementar-r-240m-em-receitas-em-12-meses/) | Le récit annonce 5 à 1 minute sur les demandes simples et jusqu'à 60 à 3 minutes sur les demandes complexes, après montée en charge depuis 10 % du trafic. | Repère haut directement lié au traitement de devis ; chiffres déclarés par le fournisseur et le client, grande échelle, sans groupe de contrôle public. |
| [Microsoft/Lexmark — CRM + CPQ](https://www.microsoft.com/en/customers/story/1622766284672128134-experlogix-lexmark-customer-success-story-united-states-sales-operations) | L'intégration CRM/CPQ est associée à 43 % de révisions de devis en moins et à moins de copies entre systèmes. | Montre la valeur de l'intégration et des règles, pas l'effet isolé d'un agent génératif ; récit fournisseur, grande entreprise. |
| [AWS/US Foods — Automated Order Guide](https://aws.amazon.com/solutions/case-studies/us-foods-case-study/) | Le récit annonce 3–4 heures ramenées à 20 minutes par proposition, 32 000 heures libérées en six mois et un ROI ×10 après déploiement auprès de 3 300 commerciaux. | Repère haut sur la préparation de propositions ; déclaration client/fournisseur à grande échelle, non transférable directement à une PME. |
| [METR — étude développeurs expérimentés](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) | Dans un essai randomisé sur 16 développeurs et 246 tâches, les outils IA du début 2025 allongent le temps de 19 %. | Contre-preuve importante : une tâche complexe, familière et mal adaptée peut devenir plus lente. Ce n'est pas un workflow de devis. |
| [Microsoft Research — CORPGEN](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/) | Sous charge, le taux d'achèvement de baselines agentiques chute de 16,7 % à 8,7 %. Une architecture hiérarchique améliore le résultat relatif jusqu'à ×3,5, mais le niveau absolu reste faible. | Benchmark simulé de tâches longues ; utile pour refuser d'extrapoler un gain de workflow borné à une agence généraliste. |

## Lecture correcte des marges

Les sources décrivent des objets différents :

1. **copilote de tâche** — le travailleur reste dans la boucle à chaque étape ;
2. **workflow intégré** — données, règles et systèmes sont reliés, souvent avec
   un approbateur ;
3. **agent métier A2/A3** — le dossier conserve un état, utilise des outils,
   vérifie les effets et escalade les exceptions ;
4. **agence orchestrée** — plusieurs rôles spécialisés coordonnent des travaux
   longs et éventuellement parallèles.

Une baisse de 80 % sur le temps de traitement d'une demande éligible ne devient
pas une baisse de 80 % du travail de l'entreprise. Il faut multiplier au minimum
par la part éligible, puis retrancher approbations, exceptions, erreurs,
surveillance, maintenance et nouveaux goulots.

Le cas Noroît utilise donc trois scénarios de planification : **50–75 %** de
réduction sur **60–85 %** de demandes éligibles. Cette enveloppe est cohérente
avec les repères publiés, mais elle reste une hypothèse à remplacer par un jeu
gelé et un pilote local.

## Limites de transfert vers une PME

- Les cas Ingram Micro, Grupo Elfa, Lexmark et US Foods sont des récits de
  clients ou fournisseurs à grande échelle, pas des essais indépendants en PME.
- Les coûts d'intégration pèsent proportionnellement plus lourd dans une petite
  organisation et peuvent rendre le pilote net négatif.
- Le devis catalogue est plus automatisable qu'un devis sur plan, réglementé,
  contractuel ou dépendant d'un jugement d'ingénierie.
- Une base client, un catalogue ou une matrice de prix incohérents déplacent le
  travail vers la correction des données au lieu de le supprimer.
- Un gain de capacité n'est ni une économie comptable ni une hausse de chiffre
  d'affaires sans preuve aval distincte.
- La réussite d'un agent A2 ne prouve ni l'autonomie A3 ni la valeur d'une agence
  multi-agents. Chaque niveau exige sa propre comparaison et sa propre gate.

## Données minimales à publier pour un vrai cas

Publier le volume total et éligible, la définition d'éligibilité, la baseline,
le temps humain actif, le temps de cycle, le taux prêt sans correction, les
corrections majeures, les escalades, les erreurs critiques, les effets non
autorisés, les doublons, le coût complet de mise en place, le coût récurrent, la
capacité réellement réallouée et le résultat aval. Conserver les demandes
exclues dans le dénominateur global.
