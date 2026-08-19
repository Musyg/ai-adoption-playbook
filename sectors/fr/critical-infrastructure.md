# Extension infrastructure critique

> Photographie d’orientation vérifiée le **19 août 2026**. Appliquer, en plus de cette extension, les obligations sectorielles, de sûreté, cybersécurité, résilience et annonce propres à l’exploitant.

Pour un service essentiel, le résultat premier est la continuité sûre. Un système qui optimise le fonctionnement normal mais crée une commande non testée, un mode commun de défaillance ou une dépendance irrécupérable n’est pas une adoption réussie.

## Situer le système par rapport au contrôle

| Zone | Exemple | Limite par défaut |
|---|---|---|
| Soutien documentaire | Rechercher une procédure ou résumer la maintenance | A0–A1 sur sources contrôlées |
| Conseil opérationnel | Détecter une anomalie ou recommander une réponse | A1 ; l’opérateur vérifie état réel et autorité |
| Action de workflow | Ouvrir un ticket, notifier ou préparer un changement | A2 avec validation de destination et approbation |
| Action de contrôle | Modifier l’état d’une installation, du trafic, de l’eau, de l’énergie ou de la sûreté | Traiter comme R3/A3 ; autorisation formelle de sûreté et d’ingénierie |
| Contrôle auto-extensible | Acquérir des permissions, réécrire une règle ou coordonner des actions non bornées | A4 désactivé par défaut |

## Gates infrastructure critique

### C0 — Frontière du service essentiel

- identifier service essentiel, fonctions critiques, interruption maximale tolérable et secteurs dépendants ;
- nommer autorités opérationnelle, sûreté, cyber, incident et direction ;
- situer l’IA hors, à proximité ou à l’intérieur d’une frontière OT ou de sûreté ;
- consigner chaque effet physique, numérique et humain qu’elle peut déclencher.

**Arrêt :** chemin de commande, autorité de sûreté ou priorité de restauration ambiguë.

### C1 — Dossier de dangers et dépendances

- modéliser commande dangereuse, alarme manquée ou fausse, état périmé, perte de visibilité, défaillance commune, cascade et instruction malveillante ;
- cartographier dépendances cloud, télécoms, identité, temps, géolocalisation, modèles, flux, fournisseurs et autres services essentiels ;
- définir comportement sûr ou maintien dégradé pour chaque perte ;
- garantir que l’IA ne peut affaiblir silencieusement un interlock ou une couche de protection existante.

### C2 — Architecture ségrégée

- séparer explicitement conseil, IT métier, technologie opérationnelle et sûreté en zones de confiance ;
- utiliser lecture seule et transfert unidirectionnel lorsque la tâche le permet ;
- autoriser explicitement commandes, paramètres, destinations, fréquence, durée et fenêtres de maintenance ;
- exiger validation déterministe indépendante et approbation humaine authentifiée avant tout effet de contrôle ;
- empêcher qu’une sortie de modèle devienne une commande exécutable sans intermédiaire contraint.

### C3 — Simulation et tests indépendants

- valider dans simulateur représentatif, jumeau numérique, banc de test ou environnement isolé ;
- tester télémétrie corrompue, capteurs contradictoires, partition réseau, dérive temporelle, perte fournisseur, compte compromis, injection et surcharge opérateur ;
- mesurer détection, confinement, passage à l’état sûr, restauration, réconciliation et conservation des preuves ;
- obtenir une revue indépendante sûreté/sécurité pour tout chemin affectant l’état du service essentiel.

### C4 — Shadow et conseil opérationnel

- commencer par rejeu, shadow ou conseil sans autorité de commande ;
- comparer aux décisions réelles en situation normale, dégradée, d’urgence et rare ;
- suivre charge d’alerte, biais d’automatisation, qualité de relève et délai vers l’action sûre ;
- ne donner aucun pouvoir au-delà des scénarios et paramètres exactement testés.

### C5 — Production bornée et reprise

- déployer par paliers, utiliser le double contrôle lorsque pertinent, conserver un arrêt indépendant de l’IA et tester l’exploitation manuelle ;
- surveiller dérive, commandes non autorisées, alarmes supprimées, latence, santé des dépendances et overrides ;
- exercer perte fournisseur, isolement réseau, rollback, redémarrage complet ou restauration équivalente, et récupération des preuves ;
- relier les incidents à toutes les voies d’annonce cyber et sectorielles. En Suisse, les exploitants assujettis doivent intégrer le processus d’annonce à l’OFCS et son délai de 24 heures après découverte.

## Dossier de preuves minimal

1. carte du service essentiel et des autorités ;
2. modèle de dangers, dépendances et frontières de confiance ;
3. liste de commandes autorisées et interlocks déterministes ;
4. résultats simulateur/banc en états normal et dégradé ;
5. revue indépendante sûreté/sécurité et décision bornée ;
6. preuve d’exploitation manuelle, exercice de reprise et voies d’annonce.

## Limite de transfert

Une preuve de laboratoire, d’un autre site, contrôleur, réseau, profil de charge, saison, fournisseur ou équipe n’est pas une preuve de production. Revalider la configuration sociotechnique complète et ses dépendances intersectorielles.

Voir le [registre daté des sources primaires](../../references/sources.md), le [guide sécurité](../../docs/security.fr.md) et le [runbook d’incident](../../templates/incident-runbook.fr.md).
