# Plan d’évaluation

## Décision visée

- Gate concerné :
- Système / version / configuration :
- Cas d’usage :
- Mode(s) de tâche IA :
- Mode de travail : copilote / automatisation bornée / automatisation forte
- Architecture : un modèle ou assistant / processus outillé / un agent métier / équipe d’agents orchestrée
- Limite d’action exacte : A0 / A1 / A2 / A3 / A4
- Profil interaction / connaissance / déploiement :
- Juridictions et déclencheurs juridiques :
- Décideur :
- Date limite :

## Jeu de tests

- Provenance et autorisation :
- Taille développement / décision :
- Segments critiques :
- Cas difficiles, adversariaux et d’abstention :
- Risque de contamination :

## Métriques préenregistrées

| Métrique | Baseline | Seuil d’acceptation | Seuil d’arrêt | Segments | Évaluateur |
|---|---:|---:|---:|---|---|
| Résultat métier | | | | | |
| Exactitude | | | | | |
| Erreur grave | | | | | |
| Correction humaine | | | | | |
| Latence | | | | | |
| Coût par résultat | | | | | |

## Profil propre au mode

Compléter chaque ligne correspondant à un mode présent. Utiliser `non
applicable` uniquement avec une justification écrite.

| Mode | Mesures et tests requis | Seuil / règle d’arrêt |
|---|---|---|
| Génération | qualité acceptée, fidélité factuelle ou aux sources, contenus interdits, limites de reproductibilité | |
| Recherche augmentée | couverture, droits d’accès, ancrage, citations, fraîcheur du corpus, empoisonnement | |
| Extraction / classification | matrice de confusion, classes critiques, abstention, prévalence, segments, dérive | |
| Prédiction / recommandation | calibration, utilité du seuil, coûts des faux positifs et négatifs, segments, boucles de rétroaction | |
| Conversation | information IA, réussite de la tâche, transfert humain, cohérence, conservation et suppression, abus | |
| Multimodal | consentement et droits, grille par média, provenance et marquage, robustesse aux transformations, accessibilité | |
| Action agentique | plan et outils, autorisation, relecture de l’effet, idempotence, rollback, arrêt, entrées hostiles dans mémoire ou outils | |

## Méthodes

- Tests déterministes :
- Jugement humain et grille :
- Évaluateur modèle et calibration :
- Tests d’outils, permissions et effets :
- Contrôles Suisse sur transparence, décision automatisée et AIPD :
- Contrôles UE sur article 50, rôle, pratiques interdites et haut risque :
- Traitement des incidents techniques :

## Décision

- Résultat par segment :
- Écarts et incertitudes :
- Accepté / accepté sous conditions / rejeté :
- Reproductibilité et artefacts :

## Régularité et suivi après modification

- Cas de démonstration ou observations réelles :
- Cas distincts / essais par cas / budget maximal :
- Réussites par essai / cas réussis à tous les essais :
- Échecs et reprises inclus dans le temps et le coût :
- Échantillon noté par un humain et par l’évaluateur automatique / désaccords :
- Jeu de référence à rejouer après changement de modèle, consigne, outil ou données :
- Responsable / fréquence du suivi / seuil d’alerte / action et repli :

Une réussite sur cinq essais n’est pas cinq réussites sur cinq. Voir les [trois questions de validation](../docs/evaluations-and-gates.fr.md#trois-questions-pour-un-résultat-fiable).
