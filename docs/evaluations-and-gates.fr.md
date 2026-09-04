# Évaluations et gates

Une évaluation utile relie un comportement mesurable à une décision. Un score moyen isolé ne suffit pas.

## 1. Définir l’unité de réussite

Choisir l’unité réellement importante : dossier correctement traité, réponse acceptée, action valide, décision escaladée ou résultat métier. Mesurer séparément les sous-composants lorsque leur défaillance exige des corrections différentes.

## 2. Construire le jeu de tests

Inclure : cas fréquents, cas difficiles, cas limites, informations manquantes, ambiguïtés, exceptions, variations linguistiques, segments sensibles, entrées adversariales et cas d’abstention.

Chaque cas contient :

- un identifiant stable ;
- la provenance et l’autorisation ;
- l’entrée minimisée ;
- le résultat attendu ou la grille de jugement ;
- le segment ;
- la gravité d’une erreur ;
- le ou les évaluateurs autorisés.

Séparer le jeu de développement du jeu de décision. Éviter d’optimiser sur les mêmes cas que ceux utilisés pour autoriser la production.

## 3. Combiner les méthodes

- **Tests déterministes** : schéma, permissions, paramètres, citations, formats, destinations et invariants.
- **Évaluation humaine** : exactitude métier, utilité, ton, exceptions et impact.
- **Évaluateur modèle** : volume et cohérence, après calibration contre des jugements humains.
- **Résultat en situation** : temps, qualité, coût, reprise, satisfaction, incidents.

Un évaluateur modèle n’est pas une vérité de référence. Mesurer ses désaccords, ses biais de position et sa sensibilité à la formulation.

## 4. Mesurer les agents par étape

Pour un système avec outils, séparer : compréhension, plan, choix de l’outil, paramètres, autorisation, effet, lecture du résultat et arrêt. Un appel d’outil ne prouve ni l’effet externe ni sa persistance.

Tester les attaques qui croisent les frontières de confiance : contenu Web, courriel, document récupéré, mémoire, résultat d’outil et sortie rendue.

## 5. Préenregistrer les décisions

Le [plan d’évaluation](../templates/evaluation-plan.fr.md) fixe avant le pilote :

- métrique principale et segments critiques ;
- seuil d’acceptation ;
- seuil d’arrêt ;
- taille minimale de l’échantillon ;
- tolérance aux erreurs graves ;
- traitement des incidents techniques ;
- personne habilitée à conclure.

## Gates recommandés

| Gate | Autorise | Exige |
|---|---|---|
| G1 — Découverte | Prototype | Mandat, propriétaire, baseline, périmètre |
| G2 — Pilote | Shadow mode | Tests, seuils, sécurité, données autorisées |
| G3 — Copilote | Usage humain borné | Résultats G2, formation, supervision, fallback |
| G4 — Automatisation | Actions bornées | Fiabilité par segment, réversibilité, observabilité |
| G5 — Extension | Nouveaux utilisateurs ou pouvoirs | Réévaluation, capacité opérationnelle, acceptation du risque |

Une moyenne satisfaisante ne compense pas un échec sur un segment critique ou une erreur à gravité inacceptable.

## Trois questions pour un résultat fiable

1. **Réussit-il une fois ?** Essayez quelques cas représentatifs et vérifiez le résultat final, pas seulement la réponse affichée.
2. **Réussit-il régulièrement ?** Rejouez les mêmes cas plusieurs fois. Notez les réussites, les échecs et les nouvelles tentatives, même quand la dernière finit par réussir.
3. **Reste-t-il bon après une modification ?** Rejouez votre jeu de référence après un changement de modèle, de consigne, d’outil ou de données. Comparez avant et après, puis suivez quelques cas réels autorisés.

Par exemple, réussir une seule tentative sur cinq montre que le système peut résoudre ce cas. Cela ne signifie pas qu’il le résout de manière fiable. Fixez avant le test le nombre d’essais et le budget maximal. Comptez le temps humain de revue et toutes les tentatives, pas seulement le meilleur résultat.

Pour commencer, vous pouvez utiliser des cas de démonstration relus par une personne du métier. Indiquez qu’ils sont synthétiques. Adaptez ensuite leur diversité et le nombre d’essais aux conséquences possibles d’une erreur. Aucun nombre universel de tests ne garantit la fiabilité.

### Détails à garder dans le dossier

- Nombre de cas distincts, essais par cas, réussites par essai et cas réussis à tous les essais.
- Budget total, reprises, délai et temps humain, y compris les échecs.
- Version exacte du modèle, des consignes, des outils et du jeu de test.
- Quelques résultats notés séparément par une personne et par l’évaluateur automatique, avec résolution de leurs désaccords.
- Responsable du suivi, fréquence, seuil d’alerte et solution de repli. Une alerte doit conduire à une action.

La vérification ne s’arrête pas au lancement : ajoutez les incidents et cas difficiles rencontrés au jeu de test, sans exposer de données sensibles.

Références pratiques : [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), [LangChain](https://www.langchain.com/blog/agent-evaluation-readiness-checklist), [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices).
