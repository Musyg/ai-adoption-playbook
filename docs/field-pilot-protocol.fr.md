# Protocole de pilote terrain

Ce protocole transforme le playbook en exercice terrain borné sans convertir
une observation en affirmation universelle. Le site interactif prépare un
brouillon local ; il ne transmet aucune donnée et n’admet aucun rapport dans le
registre public.

## 1. Cadrer le pilote

Avant toute observation réelle, consignez :

- un alias de projet non identifiant et un workflow précis ;
- le type d’organisation, l’extension sectorielle, le niveau d’intégration et
  la version du système ;
- la baseline manuelle, le dénominateur de toutes les demandes, la règle
  d’éligibilité, les exclusions et les seuils préenregistrés ;
- les effets autorisés, validations requises, autorité d’arrêt, fallback et
  emplacement des preuves.

Ne démarrez pas si le responsable, la baseline, le jeu d’évaluation, le fallback
sûr ou une règle d’arrêt critique manque.

## 2. Observer le dénominateur complet

Exécutez d’abord le jeu d’évaluation figé, puis le shadow mode, puis uniquement
le niveau réel borné qui a franchi ses gates. Conservez chaque demande dans le
dénominateur, y compris les cas inéligibles, refusés, échoués, escaladés ou
retirés.

Consignez résultat accepté, temps humain actif, corrections, effets critiques,
éligibilité, validations, effets d’outils, relectures, incidents et traces
manquantes. L’activité du modèle n’est pas un résultat métier.

## 3. Préparer un brouillon privé

Utilisez le [modèle de retour terrain](../templates/field-feedback-report.fr.md).
Gardez les preuves brutes sous contrôle d’accès. Le brouillon doit distinguer
observation directe, mesure interne, estimation, opinion et affirmation
fournisseur.

Ne placez jamais données clients, identités, secrets, contenu privilégié,
prompts bruts ou détails de sécurité exploitables dans une issue ou un dépôt
public. Convenez d’un canal de revue privé avant tout transfert de rapport ou de
preuves.

## 4. Faire réviser indépendamment

Une personne qui n’a pas rédigé la conclusion contrôle provenance, versions du
système et du workflow, baseline, dénominateur, cas manquants, incidents,
anonymisation, risque résiduel de réidentification, limites de transfert,
autorité de publication et voie de retrait.

Réussir cette revue rend le brouillon éligible à une décision d’admission. Cela
ne rend pas le résultat représentatif d’une autre organisation ou d’un autre
workflow.

## 5. Admettre ou retenir

Seul un rapport révisé et anonymisé qui satisfait chaque
[règle d’admission](../field-notes/README.fr.md) peut rejoindre
`field-notes/index.json`. Sinon, gardez-le privé, demandez des corrections ou
renoncez à publier. Les cas synthétiques restent dans `examples/` et ne comptent
jamais comme preuves terrain.

## Première cohorte minimale

La [première cohorte](field-pilot-cohort.fr.md) vise au moins trois rapports
admis : un processus non agentique ou avec copilote, un agent métier A2 borné
et un contexte suisse ou européen distinct. Un candidat avec agence orchestrée
est bienvenu seulement si un véritable système peut être comparé à une
architecture plus simple ; il n’est pas exigé. L’effort de mise en œuvre et les
cas échoués ou exclus restent visibles. C’est un objectif d’apprentissage, pas
une affirmation de validation statistique.
