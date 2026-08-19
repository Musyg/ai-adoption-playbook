# Registre des retours terrain

Ce dossier constitue la frontière de publication des retours terrain révisés et anonymisés. Il ne contient encore aucun rapport terrain. Un registre vide ne prouve pas que le playbook fonctionne en pratique.

## Règle d’admission

Un rapport apparaît dans [`index.json`](index.json) uniquement s’il :

1. utilise le [modèle de retour terrain](../templates/field-feedback-report.fr.md) ;
2. précise provenance, collecte, version du système, baseline, dénominateur et cas manquants ;
3. sépare observation, estimation, opinion et affirmation fournisseur ;
4. consigne incidents, échecs, corrections et retraits ;
5. retire données personnelles, identités, secrets, contenu privilégié et détail de sécurité exploitable ;
6. indique les populations, workflows, conditions et affirmations auxquels le résultat **ne se transfère pas** ;
7. possède une autorité de publication, un réviseur et une voie de retrait nommés.

## Ce que l’anonymisation ne prouve pas

Retirer un nom ne rend pas automatiquement un rapport anonyme. Rôle rare, date, volume, lieu, fournisseur, incident ou combinaison d’attributs peuvent réidentifier une organisation ou une personne. Réviser le rapport complet et son contexte, minimiser les détails, agréger lorsque justifié et renoncer à publier si un risque résiduel de réidentification ou de sécurité demeure.

## Statuts

- `reviewed` : admis dans l’index public avec sa frontière de preuves ;
- `withdrawn` : conservé comme trace avec une raison, jamais supprimé silencieusement ;
- les brouillons restent hors de l’index public.

Les cas synthétiques restent dans `examples/` et n’entrent jamais dans ce registre.
