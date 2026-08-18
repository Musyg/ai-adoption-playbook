# Modèle de maturité

La maturité ne correspond ni au nombre de modèles utilisés ni au degré d’autonomie.

| Niveau | État | Preuve attendue |
|---|---|---|
| M0 — Informel | Usages individuels non inventoriés | Aucun contrôle fiable |
| M1 — Visible | Règles d’usage, registre et propriétaires | Inventaire, formation de base, données interdites |
| M2 — Mesuré | Cas priorisés et évaluations reproductibles | Baselines, seuils, rapports de pilote |
| M3 — Gouverné | Portefeuille, architecture commune et gestion des risques | Gates, responsabilités, fournisseurs, incidents |
| M4 — Adaptatif | Surveillance, réévaluation et retrait maîtrisés | Tendances, exercices, audits et décisions de cycle de vie |

## Règle de progression

Une structure ne progresse que lorsque les preuves du niveau précédent existent pour le périmètre concerné. Elle peut être M3 sur un service et M0 sur un autre ; la note globale ne doit pas masquer ces écarts.

## Prochaine action par niveau

- **M0 → M1** : recenser les usages réels et publier des règles simples de données.
- **M1 → M2** : sélectionner un cas mesurable et construire les évaluations avant le prototype.
- **M2 → M3** : créer les gates, le registre fournisseur et un socle de sécurité commun.
- **M3 → M4** : automatiser les contrôles, tester les incidents et instituer le retrait.
