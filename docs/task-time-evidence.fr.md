# Preuves de temps de tâche et transfert

Ce guide explique comment estimer le temps humain sans transformer une étude,
un cas fournisseur ou une organisation en taux universel de productivité.

L’unité de comparaison est une tâche ou un processus borné, avec un résultat
comptable et un seuil d’acceptation explicite. Le type d’organisation ajoute un
contexte juridique, de gouvernance, de données, d’achat, d’échelle et de
contrôle. Il ne définit pas la catégorie de référence.

## Séparer les modes opératoires

| Mode | Ce que fait le système | Autonomie typique |
|---|---|---:|
| Copilote | Prépare, recherche, analyse ou suggère pendant qu’une personne opère chaque cycle | A0 à A1 |
| Automatisation bornée | Termine un processus éligible avec des outils autorisés et escalade les exceptions | A1 à A3 |
| Automatisation forte | Coordonne un travail long entre plusieurs agents ou outils sous des contrôles renforcés | A3 à A4 |

Plusieurs agents ou une grande échelle ne suffisent pas à classer un système A4.
L’autonomie dépend des effets que le système peut produire sans personne, pas
de la réputation ou de la taille de l’organisation qui l’utilise.

## Compter séparément temps humain, temps machine et temps écoulé

Pour un cas éligible :

```text
temps humain avec IA = préparation + supervision + vérification
                       + corrections + travail attendu sur les exceptions
                       + mise en place amortie

temps humain gagné = temps humain initial - temps humain avec IA

temps humain annuel gagné = temps gagné par cas
                             * cas éligibles par mois * 12
```

Le travail attendu sur les exceptions est le taux d’exception multiplié par les
minutes humaines nécessaires pour chacune. La mise en place amortie répartit les
heures humaines initiales sur le nombre choisi de mois et de cas éligibles.

Le résultat peut être négatif. Un ralentissement est une preuve et ne doit pas
être ramené à zéro. Le temps machine ne compte jamais comme temps humain gagné.
Un délai qui passe de trois jours à un jour est une variation du temps écoulé si
les minutes humaines n’ont pas aussi été mesurées.

Qualité, débit accepté, traitement sans intervention, incidents et résultat en
aval restent des mesures distinctes.

## Niveaux de preuve

| Niveau | Base de mesure | Usage quantitatif par défaut |
|---|---|---|
| A | Observation contrôlée ou appariée du temps de tâche | Transfert seulement avec un contrat de tâche comparable |
| B | Télémétrie terrain ou mesure opérationnelle objective | Transfert seulement si le temps humain dispose d’un dénominateur |
| C | Temps déclaré ou estimation issue d’une enquête | Contexte pour concevoir le pilote |
| D | Cas interne ou fournisseur sans validation indépendante complète | Mécanisme et contexte d’implémentation |
| E | Valeur estimée par modèle, synthétique ou réservée à la planification | Hypothèse nommée seulement |

Le niveau décrit la façon de mesurer, pas le caractère favorable du résultat.
Le registre bloque en plus l’usage quantitatif automatique si le temps humain
actif n’a pas été mesuré et si la source n’est pas explicitement admise au
transfert.

## États du transfert

Le calculateur vérifie quatre seuils minimaux :

1. le profil de la tâche cible ;
2. le mode opératoire ;
3. l’état exigé du résultat ;
4. l’expérience de l’opérateur.

Il renvoie l’un des quatre états suivants :

| État | Signification |
|---|---|
| Comparable | La source peut encadrer une plage basse, centrale et haute à tester |
| Hypothèse seulement | La tâche correspond, mais un élément de contexte diffère et doit être ajusté localement |
| Contexte seulement | La source informe la conception sans fournir de ratio transférable de temps humain |
| Non transférable | La tâche ou le mode opératoire diffère |

Ces seuils minimaux ne prouvent pas l’équivalence. Avant d’utiliser une source,
comparez aussi complexité des entrées, unité de résultat, accès au modèle et aux
outils, vérifiabilité, seuil de qualité, taux d’exception, compétence de
l’opérateur et conséquence d’une erreur.

## Ce que montrent les enregistrements actuels

| Enregistrement | Tâche | Niveau | Mesure publiée | Usage quantitatif |
|---|---|---:|---|---|
| Noy et Zhang | Rédaction professionnelle | A | 40 % de temps en moins et 18 % de qualité évaluée en plus | Tâches de rédaction comparables seulement |
| Frontière irrégulière de BCG | Analyse de connaissances dans la frontière testée | A | 22,5 % à 27,6 % de temps en moins selon les deux traitements IA | Analyse relue comparable seulement |
| Expérience GitHub Copilot | Serveur HTTP neuf et borné | A | 55,8 % de temps moyen en moins, avec un intervalle très large | Implémentation bornée comparable seulement |
| Étude METR du début 2025 | Vrais tickets dans des dépôts matures et connus | A | 19 % de temps en plus, avec un intervalle de ralentissement publié | Travail comparable dans un dépôt mature seulement |
| Essai bureautique britannique | Journée mixte d’agents publics | C | 26 minutes déclarées gagnées par jour | Contexte seulement |
| Essai britannique d’assistants de code | Journée mixte de développement | C | 56 minutes déclarées par jour et 15,8 % de lignes acceptées | Contexte seulement |
| Déploiement de support client | Demandes résolues par heure-agent | B | Débit supérieur de 14 % | Contexte de capacité, pas transfert de temps |
| Analyse de conversations par Anthropic | Tâches larges définies par les conversations | E | Gains estimés par modèle, concentrés sur des valeurs élevées | Contexte seulement |
| Projet OpenAI conçu pour les agents | Produit logiciel conduit par des agents | D | Estimation interne d’environ un dixième du temps de code manuel | Transférer le mécanisme, pas le pourcentage |

Le registre conserve la source exacte, la base de mesure, le contrat de tâche,
les préconditions et les limites. Les exemples des entreprises de pointe restent
visibles, car leurs mécanismes peuvent être utiles. Leurs chiffres internes ou
estimés par modèle n’alimentent pas automatiquement le calculateur.

## Utiliser le calculateur interactif

1. Choisissez la tâche comptable la plus proche, pas votre type d’organisation.
2. Indiquez l’état exigé du résultat et l’expérience de l’opérateur.
3. Lisez la fiche de preuve et son état de transfert.
4. Saisissez le temps manuel initial, le volume mensuel et la part éligible.
5. Ouvrez la décomposition du temps humain et saisissez préparation,
   supervision, vérification, corrections, exceptions et mise en place.
6. Lisez séparément la plage de la source et votre décompte du temps humain.
7. Remplacez chaque paramètre de planification par une observation du pilote
   avant toute décision.

N’ajoutez pas le pourcentage de la source au calcul local. La plage externe
répond à la question de ce qui s’est produit sur une tâche comparable et
mesurée. Le décompte humain montre ce qu’impliquent vos propres hypothèses quand
chaque composant humain est visible.

## Classement des 11 cas d’école

Chaque résultat de cas reste une hypothèse de planification de niveau E. Un
repère externe peut expliquer un mécanisme ou encadrer une plage séparée, mais
il ne rehausse jamais le niveau du résultat synthétique.

| Cas d’école | Profil de tâche | Mode | Usage du repère externe |
|---|---|---|---|
| Demandes clients d’une TPE | Support client | Copilote A1 | Contexte de débit seulement |
| Devis B2B d’une PME | Analyse de connaissances | Agent A2 | Contexte de mécanisme copilote seulement |
| Dossiers de subvention | Synthèse d’information | Agent A2 | Contexte d’analyse seulement |
| Dossiers publics d’urbanisme | Synthèse d’information | Agent A2 | Contexte d’analyse seulement |
| Suivi client d’un indépendant | Rédaction professionnelle | Copilote A1 | Plage comparable à tester séparément |
| Agent de suivi pour indépendant | Support client | Agent A2 | Contexte de débit seulement |
| Diagnostic orchestré | Projet fortement automatisé | Agence A3 | Mécanisme de contrôle seulement |
| RAG de procédures en lecture seule | Synthèse d’information | Copilote A1 | Aucun repère de temps admis |
| Prévision de la demande | Aide à la décision prédictive | Copilote A0 | Aucun ratio de temps humain transféré |
| Chatbot client externe | Support client | Copilote A1 | Contexte de support au personnel seulement |
| Revue multimodale de catalogue | Revue multimodale | Copilote A1 | Aucun repère de temps admis |

Le registre conserve le raisonnement complet et les fichiers d’exemple
correspondants. Ce classement repose sur le contrat de tâche, pas sur
l’étiquette de l’organisation.

## Contrats lisibles par machine

- [Registre des temps de tâche](../site/public/data/task-time-evidence.v1.json)
- [Schéma JSON des temps de tâche](../site/public/data/task-time-evidence.schema.json)
- [Protocole de pilote terrain](field-pilot-protocol.fr.md)
- [Revue des preuves publiques](../references/field-evidence-review-2026.fr.md)

Les études externes améliorent la planification, mais ne remplissent pas
`field-notes/index.json`. La règle d’admission séparée de la version 0.3 exige
toujours au moins trois rapports réels, revus indépendamment et assainis,
produits à l’aide de ce playbook.
