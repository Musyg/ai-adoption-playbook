# Registre des retours terrain

Ce dossier constitue la frontière de publication des retours terrain révisés et anonymisés. Il ne contient encore aucun rapport terrain. Un registre vide ne prouve pas que le playbook fonctionne en pratique.

Commencez par la [présentation de la première cohorte](../docs/field-pilot-cohort.fr.md)
et le [protocole de pilote terrain](../docs/field-pilot-protocol.fr.md). La
cohorte vise trois rapports admis portant sur des modes d’usage et des contextes
distincts. Son assistant web crée uniquement un brouillon local ; les preuves brutes ne
doivent jamais être transmises dans une issue publique.

Le brouillon conserve la fourchette transférée préenregistrée à côté du résultat
observé. Cette comparaison appartient au cycle d’apprentissage 0.3. La
fourchette extrapolée ne compte jamais comme observation terrain admise et ne
doit pas être réécrite après la lecture du résultat.

Utilisez l’[entrée publique du pilote](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=field-pilot-fr.yml)
uniquement pour coordonner un pilote non identifiant. Après la revue privée des
preuves, un rapport nettoyé peut utiliser le
[modèle de pull request terrain](../.github/PULL_REQUEST_TEMPLATE/field-report.fr.md).
GitHub ne reçoit jamais prompts bruts, logs, captures, contenu client, données
personnelles, secrets ou autres preuves brutes.

## Règle d’admission

Un rapport apparaît dans [`index.json`](index.json) uniquement s’il :

1. utilise le [modèle de retour terrain](../templates/field-feedback-report.fr.md) ;
2. précise provenance, collecte, version du système, baseline, dénominateur et cas manquants ;
3. conserve l’hypothèse préenregistrée et sépare extrapolation, observation,
   recalibrage, opinion et affirmation fournisseur ;
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
