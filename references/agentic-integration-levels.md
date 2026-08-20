# Note de preuves : copilote, agent métier et agence orchestrée

Dernière vérification : **19 août 2026**.

Cette note empêche une erreur fréquente : comparer le gain d’un assistant de
rédaction avec celui d’un système qui prend en charge un workflow métier. Ces
systèmes n’exécutent pas la même quantité de travail et leurs indicateurs ne sont
donc pas interchangeables.

Le cas synthétique
[Du copilote à l’agent métier A2](../examples/fr/independant-agent-metier-suivi.md)
applique cette distinction au même indépendant, au même workflow et à la même
baseline afin de rendre la comparaison falsifiable.

Le cas
[Agence orchestrée A3 pour un diagnostic standard](../examples/fr/independant-agence-orchestree-diagnostic.md)
étend la méthode à un benchmark manuel/A1/A2/A3, garde les demandes non éligibles
dans le dénominateur global et sépare la ressemblance d’architecture avec
Talos/Hermes de toute revendication de performance.

## Trois niveaux d’intégration

| Niveau | Travail réellement déplacé | Rôle humain dominant | Ancrage public trouvé |
|---|---|---|---|
| **Copilote A0/A1** | Une étape : recherche, extraction, synthèse ou brouillon. L’humain apporte le contexte et effectue les actions externes. | Opérateur à chaque cycle | Les publications vont d’un ralentissement mesuré à de forts gains sur une tâche étroite. Elles ne définissent pas de plage universelle. |
| **Agent métier A2/A3** | Un dossier borné de bout en bout, avec outils, mémoire, règles, contrôles et escalade des exceptions. | Validateur et responsable des exceptions | Le meilleur essai direct trouvé mesure 16,8 % de durée en moins sur les cas éligibles, 3,2 % sur tout le flux et une baisse de la note client sur les cas éligibles. |
| **Agence orchestrée A3/A4** | Plusieurs agents spécialisés coordonnés pour rechercher, décider dans leurs limites, agir, vérifier et mettre à jour plusieurs systèmes. | Gouverne objectifs, permissions et exceptions | Aucun essai terrain indépendant trouvé ne soutient un multiplicateur générique de 5 à 12 sur les résultats métier acceptés. CORPGEN atteint 15,2 % de réalisation dans un benchmark, pas en production. |

Les anciennes plages 20–40 %, 50–75 % et 80–92 %, ainsi que le facteur 5 à 12,
ne doivent donc pas être présentés comme des bornes empiriques générales. Ils
peuvent seulement servir d’hypothèses de stress modifiables avant un pilote.
La [revue de 20 sources](field-evidence-review-2026.fr.md) classe chaque
observation par force de preuve, résultat mesuré et limite de transfert.

## La preuve directe la plus proche d’un agent métier

L’[essai randomisé Alibaba](https://arxiv.org/abs/2605.14830) porte sur 647
travailleurs, 680 676 conversations et 17 jours de traitement. L’IA agentique
réduit de 16,8 % la durée des conversations éligibles. Mais ces conversations
ne représentent que 5,8 % du volume. Le gain sur tout le flux tombe à 3,2 % et
la note client des conversations éligibles baisse de 0,412 point.

Parmi les conversations éligibles confiées à l’agent, 35 % se terminent sans
escalade, 44,1 % nécessitent une escalade technique, 8,6 % une escalade
émotionnelle et 12,3 % une reprise humaine anticipée. Un superviseur humain
reste responsable de chaque conversation. Cette expérience prouve qu’un agent
métier peut créer un gain important sur un sous-flux, tout en montrant pourquoi
éligibilité, escalade, qualité et effet global doivent rester séparés.

## Observations publiées qui bornent la fourchette

- L’article [*The Agent-Centric Enterprise*](https://hdsr.mitpress.mit.edu/pub/0mrfxamu/release/3)
  décrit AuditGPT chez Linde : environ 24 heures de préparation ramenées à deux
  heures, soit une réduction de 92 % et un rapport théorique de ×12. Il décrit
  aussi 10 à 20 fois plus de scénarios de négociation chez Stora Enso. Ces cas
  sont déclarés par des praticiens et n’ont pas la force d’une expérience
  contrôlée indépendante.
- [IBM AskHR](https://www.ibm.com/case-studies/ibm-askhr) annonce 94 % de
  traitement autonome des demandes courantes, 75 % de tickets en moins et 40 %
  de coûts opérationnels RH en moins sur plusieurs années. Le périmètre comporte
  plus de 80 tâches et des intégrations aux systèmes RH ; IBM précise que les
  résultats varient selon les configurations.
- Dans son [dépôt SEC 2025](https://www.sec.gov/Archives/edgar/data/2003292/000162828025012824/klarnagroupplcf-1.htm),
  Klarna attribue à son assistant 62 % des conversations de service client, une
  charge équivalente à plus de 800 personnes et environ 39 millions de dollars
  d’économies en 2024. Ce sont des mesures produites par l’entreprise.
- Salesforce rapporte environ 85 % de résolution pour les conversations
  éligibles de son centre d’aide, avec transfert humain prévu. Le déploiement
  ne couvre pas indistinctement toutes les visites ni toutes les demandes.
  [Retour d’expérience Salesforce](https://www.salesforce.com/news/stories/ai-agent-customer-service-salesforce-learnings/)

## Contre-preuves : un agent généraliste n’est pas une agence métier

Le [Remote Labor Index](https://scale.com/blog/rli) porte sur 240 projets
freelance réels couvrant 23 domaines. Le meilleur agent évalué n’en termine que
2,5 % de bout en bout au niveau professionnel attendu. Ce résultat n’annule pas
les gains élevés des systèmes spécialisés : il montre que l’intégration aux
données, aux outils, aux règles métier et aux contrôles est déterminante.

Microsoft observe la même tension sous charge dans
[CORPGEN](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/) :
l’architecture hiérarchique avec sous-agents, mémoire isolée et apprentissage
atteint 15,2 % de réalisation avec 46 tâches concurrentes, contre 4,3 % pour les
baselines. Le facteur relatif est 3,5, mais le taux absolu reste 15,2 % dans un
environnement simulé de six heures.

Enfin, davantage d’activité intermédiaire ne signifie pas autant de résultats
livrés. L’étude NBER
[*Writing Code vs. Shipping Code*](https://www.nber.org/papers/w35275) observe
que l’effet associé aux agents autonomes est beaucoup plus grand sur les commits
que sur les projets et versions effectivement livrés. Les goulots humains et
organisationnels demeurent.

## Cinq mesures à conserver séparément

1. **Temps de cycle** : délai écoulé entre la demande et le résultat.
2. **Temps humain actif** : minutes réellement consacrées par une personne.
3. **Débit accepté** : résultats acceptés par heure du responsable.
4. **Taux de bout en bout** : part des cas éligibles terminés sans intervention.
5. **Résultat livré** : effet aval réel, et non volume de texte, d’appels ou de
   commits produits par le système.

Une réduction de 75 % du temps humain correspond mathématiquement à un débit 4,
et une réduction de 92 % à un débit 12,5, uniquement si aucun nouveau goulot
n’apparaît. Ce calcul est une identité conditionnelle, pas une observation. Il
faut donc mesurer simultanément corrections, exceptions, erreurs critiques,
coût par résultat accepté et résultat aval.

## Protocole minimal pour une agence de type Talos/Hermes

Comparer, sur 20 à 30 cas gelés par workflow, quatre conditions : manuel,
copilote, agent unique et agence orchestrée. Publier pour chacune les médianes et
les percentiles bas/haut du temps humain, le taux de sortie acceptée, le taux de
bout en bout, les corrections, les escalades, le coût par résultat accepté et
les erreurs critiques. Les workflows non éligibles doivent rester visibles dans
le dénominateur métier global.

L’architecture publique de [Talos](https://github.com/Musyg/talos) documente
orchestration, agents spécialisés, mémoire, exécution et observabilité. Elle ne
publie pas encore une mesure de productivité permettant d’attribuer un facteur
5 ou 10 au système lui-même. Tant qu’un benchmark reproductible n’existe pas,
ces facteurs restent des scénarios à éprouver, pas une performance Talos
démontrée.
