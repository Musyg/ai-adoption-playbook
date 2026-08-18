# Cas synthétique indépendant — Agence orchestrée A3 pour un diagnostic standard

> **Exemple fictif.** Camille Rey, ses clients, le service, les volumes et tous
> les résultats sont synthétiques. Le cas illustre une méthode de comparaison ;
> il ne prouve pas la performance de Talos, d’Hermes, d’un modèle ou d’un métier.

> **Niveau mesuré : agence orchestrée A3.** Plusieurs agents spécialisés
> coopèrent sous une politique commune et peuvent exécuter seuls des effets
> catalogués à faible risque. A4 — autonomie large multi-systèmes — n’est pas
> testé ni revendiqué.

## 1. Le service borné

Camille vend à ses clients existants un diagnostic opérationnel standard. Après
un entretien conduit par la consultante, le travail interne comprend :

1. qualifier le dossier et les sources autorisées ;
2. extraire les preuves des notes et documents clients ;
3. noter le processus selon une grille publiée ;
4. produire un rapport, les limites et un plan d’action ;
5. vérifier faits, citations, cohérence, permissions et risques ;
6. livrer le rapport, mettre à jour le CRM, créer les tâches et proposer la
   revue prévue par l’offre existante.

La sortie acceptée reste identique dans les quatre conditions de comparaison :
un rapport au format convenu, ses preuves, son plan d’action, les mises à jour
système et un journal des effets.

### Baseline manuelle

| Mesure | Valeur |
|---|---:|
| Temps humain actif médian après entretien | 7 h 40 |
| Cycle interne médian | 18 h |
| Rapport accepté sans reprise majeure | 57/60 — 95 % |
| Effet externe autonome | 0 |

## 2. Pourquoi plusieurs agents

Le multi-agent n’est pas retenu pour « faire plus avancé ». Le service contient
des rôles qui utilisent des contextes, outils et critères d’arrêt différents :

| Rôle | Mandat | Interdiction principale |
|---|---|---|
| Admission | Identité, éligibilité, minimisation | Ne peut produire ni exécuter le diagnostic |
| Preuves | Sources autorisées et citations | Ne peut transformer une hypothèse en fait |
| Analyste | Score, diagnostic et incertitude | Ne peut modifier les critères ni agir |
| Livraison | Rapport et plan d’action | Ne peut inventer prix, portée ou engagement |
| Gardien | Contradictions, risque, politique, permissions | Ne peut lever son propre veto |
| Exécuteur | Rapport, CRM, tâches et planification cataloguée | Ne peut agir hors du paquet signé |

Un orchestrateur distribue les tâches, borne les budgets, attend les dépendances,
compare les désaccords, demande une reprise ou escalade. Il n’accepte pas le
« succès » déclaré par un agent : chaque effet externe doit être confirmé par
un identifiant et, lorsque possible, relu depuis le système cible.

## 3. Plan de contrôle partagé

Tous les spécialistes utilisent le même identifiant de dossier mais des
identités et permissions séparées. Le plan de contrôle fournit :

- état versionné et provenance de chaque champ ;
- mémoire limitée au client et au service autorisés ;
- politiques de données, coût, concurrence et expiration ;
- journal append-only des événements, validations, appels et effets ;
- clés d’idempotence et compensation des écritures partielles ;
- jeux d’évaluation gelés et seuils par segment ;
- veto indépendant du gardien ;
- coupe-circuit, révocation des permissions et procédure manuelle.

Le texte provenant d’un document client est toujours traité comme une donnée,
jamais comme une instruction adressée aux agents.

## 4. Population éligible

Le pilote reçoit 17 demandes live. Douze seulement satisfont avant exécution les
conditions A3 : client existant vérifié, offre standard déjà acceptée, sources
autorisées, grille applicable, recommandations dans le catalogue et effets
réversibles connus.

Cinq demandes sont exclues : deux exigent un nouveau prix, une modifie le
contrat, une contient des données RH et une présente une contradiction sur
l’identité du client. Elles restent dans le dénominateur métier global.

## 5. Benchmark gelé à travail identique

Soixante dossiers historiques autorisés sont exécutés dans quatre conditions.
L’ordre des dossiers est alterné ; les évaluateurs reçoivent les sorties sans
étiquette de condition. Le temps humain inclut préparation, surveillance,
correction, approbation et récupération, pas seulement la rédaction.

| Condition | Temps humain médian | Cycle interne médian | Accepté sans reprise majeure | Rapport de débit humain |
|---|---:|---:|---:|---:|
| Manuel | 7 h 40 | 18 h 00 | 57/60 | ×1,0 |
| Copilote A1 | 5 h 50 | 13 h 10 | 55/60 | ×1,3 |
| Agent unique A2 | 2 h 35 | 7 h 25 | 55/60 | ×3,0 |
| Agence orchestrée A3 | 58 min | 5 h 20 | 56/60 | **×7,9** |

Le rapport ×7,9 vient de `460 ÷ 58`. Il mesure des diagnostics acceptés par
heure humaine active sur ce service éligible. Il ne mesure ni revenu, ni marge,
ni entreprise entière. La qualité acceptée reste comparable ; elle n’est pas
supposée augmenter avec le nombre d’agents.

### Seuils critiques avant effet réel

| Mesure | Seuil | Résultat gelé A3 |
|---|---:|---:|
| Affirmation critique liée à une source autorisée | 100 % | 284/284 |
| Cas hors politique arrêté avant effet | 100 % | 22/22 |
| Source empoisonnée ignorée et signalée | 100 % | 10/10 |
| Effet externe hors paquet signé | 0 | 0 |
| Écriture dupliquée après rejeu | 0 | 0 |
| Panne partielle compensée ou escaladée | 100 % | 12/12 |
| Dépassement de coût ou concurrence | 0 | 0 |

Un échec d’outil, un désaccord analyste/gardien et une preuve manquante sont des
arrêts normaux, pas des échecs à masquer.

## 6. Pilote de 60 jours

### Jours 1–10 — Décomposer le service

Chaque rôle reçoit un contrat d’entrée, de sortie, de permissions et d’échec.
Les effets non nécessaires sont retirés. L’offre manuelle reste disponible.

### Jours 11–25 — Geler la comparaison

Les 60 dossiers passent par les quatre conditions. Temps humain, cycle, qualité,
coût, erreurs critiques et effets sont enregistrés séparément.

### Jours 26–40 — Shadow mode multi-agents

Les spécialistes travaillent en parallèle sans effet live. Le pilote injecte
mémoire périmée, contradiction, source empoisonnée, timeout après écriture,
événement dupliqué, gardien indisponible et dépassement de budget.

### Jours 41–60 — A3 borné

L’agence peut livrer et exécuter les effets catalogués pour les douze dossiers
éligibles. Tout veto, désaccord, source manquante ou action hors catalogue bloque
l’exécution et crée une escalade lisible pour Camille.

## 7. Résultats live synthétiques

Sur les douze dossiers admis :

- 9 rapports sont acceptés sans reprise majeure ;
- 8 dossiers terminent de bout en bout avec livraison et effets catalogués ;
- 4 sont arrêtés avant effet et escaladés ;
- 1 des quatre escalades contient un rapport acceptable, mais une recommandation
  sort du catalogue autonome ;
- le temps humain actif médian est de 58 minutes ;
- le cycle interne médian passe de 18 heures à 5 h 20 ;
- aucun engagement, écrit ou destinataire non autorisé n’est observé ;
- aucune duplication n’est observée après rejeu.

Le taux A3 sur la population éligible est `8/12 = 67 %`. Sur toutes les demandes
reçues, il est `8/17 = 47 %`. Afficher uniquement 67 % ferait disparaître les
cinq demandes rejetées par l’admission et surestimerait l’automatisation réelle
du cabinet.

## 8. Décision de gate

**Décision : A3 passe pour le diagnostic standard et ses effets catalogués. A4
reste non démontré.**

L’agence ne peut pas :

- inventer ou modifier une offre ;
- choisir un prix, un contrat ou un nouveau client ;
- augmenter ses permissions ou ouvrir une nouvelle classe de données ;
- ignorer le veto du gardien ;
- réutiliser la réussite de ce diagnostic pour revendiquer l’autonomie sur un
  autre workflow.

Une candidature A4 exigerait un mandat distinct, plusieurs workflows prouvés,
un audit indépendant de l’orchestration et des permissions, des tests de panne
croisée, un suivi économique complet et une décision explicite de direction.

## 9. Frontière Talos/Hermes

La structure du cas ressemble à une plateforme de type Talos/Hermes :
orchestrateur, spécialistes, état partagé, outils, gardien, observabilité et
contrôle des effets. Cette ressemblance d’architecture n’est pas une preuve de
performance.

Le dépôt public [Talos](https://github.com/Musyg/talos) documente son architecture
et son échelle, mais ne publie pas encore un benchmark reproductible comparant
temps humain, qualité acceptée, coût et résultat livré. Les chiffres ci-dessus
restent donc ceux d’un cas fictif calibré par des bornes externes, pas un résultat
Talos ou Hermes.

Les sources, bornes et contre-preuves sont détaillées dans
[Copilote, agent métier et agence orchestrée](../../references/agentic-integration-levels.md).

## 10. Dossier de preuves

Le pilote conserve mandat, définition du service, critères d’éligibilité,
contrats des agents, matrice de permissions, modèle de menace, 60 cas gelés,
sorties aveugles, évaluations, traces d’orchestration, budgets, vetos, effets et
read-backs, incidents, compensations, mesures de temps, coût par sortie acceptée,
résultats live, exclusions et décision de gate.
