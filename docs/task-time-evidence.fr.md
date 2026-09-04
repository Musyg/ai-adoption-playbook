# Preuves de temps de tâche et transfert

Ce guide explique comment estimer le temps humain sans transformer une étude,
un cas fournisseur ou une organisation en taux universel de productivité.

L’unité de comparaison est une tâche ou un processus borné, avec un résultat
comptable et un seuil d’acceptation explicite. Le type d’organisation ajoute un
contexte juridique, de gouvernance, de données, d’achat, d’échelle et de
contrôle. Il ne définit pas la catégorie de référence.

## Séparer mode de travail, architecture et autorité

| Mode de travail | Travail déplacé | Rôle humain |
|---|---|---|
| Copilote | Une étape assistée | Opère à chaque cycle et réalise les actions externes |
| Automatisation bornée | Une part définie d’un processus éligible | Valide certains effets et traite les exceptions |
| Automatisation forte | L’essentiel du travail éligible de bout en bout | Fixe objectifs et limites, relit les résultats et traite les exceptions |

Plusieurs agents ou une grande échelle ne suffisent pas à classer un système A4.
L’autonomie dépend des effets que le système peut produire sans personne, pas
de la réputation ou de la taille de l’organisation qui l’utilise.

Le registre utilise `work_mode` pour le partage du travail présenté ci-dessus. L’architecture
technique, qu’il s’agisse d’un modèle, d’un processus fixe, d’un agent ou d’une équipe, est
enregistrée séparément, tout comme le niveau d’autorité précis A0 à A4. Une
étude reste transférable lorsque la tâche, le résultat accepté, le rôle humain
et les conditions d’usage sont assez proches. Le type d’organisation ne suffit
ni à autoriser ni à interdire ce transfert.

## Compter séparément temps humain, temps machine et temps écoulé

Pour un cas éligible :

```text
plancher de travail humain = préparation + supervision + vérification
                             + corrections + travail attendu sur les exceptions

temps humain net avec IA = max(résiduel de la source - installation déjà incluse,
                               plancher de travail humain)
                           + travail supplémentaire absent des deux
                           + mise en place locale amortie

temps humain net gagné = temps humain initial - temps humain net avec IA

temps humain net annuel gagné = temps net gagné par cas
                                 * cas éligibles par mois * 12
```

Le travail attendu sur les exceptions est le taux d’exception multiplié par les
minutes humaines nécessaires pour chacune. La mise en place amortie répartit les
heures humaines initiales sur le nombre choisi de mois et de cas éligibles.

Le temps résiduel déduit de la source est le temps humain qui subsiste après
application de sa réduction basse, centrale ou haute au temps initial local. Le
plus grand des deux temps est conservé pour ne pas masquer le travail de revue
déclaré. Cette règle évite aussi d’additionner le résiduel de la source au
travail local quand leurs périmètres se recouvrent. Ajoutez séparément le travail
absent des deux. Si le résiduel de la source inclut l’installation, retirez cette
part avant d’ajouter la mise en place locale, sans dépasser le résiduel.
Sans source admise, ou si vous choisissez vos propres hypothèses, le calcul
utilise uniquement la décomposition locale.

Lorsque la part éligible vaut zéro, la fourchette nette est indisponible. Aucun
cas éligible ne permet de répartir la mise en place. Le calculateur affiche donc
`n/a` au lieu de faire disparaître silencieusement le coût fixe. La fiche de
pilote copiée conserve le profil de tâche, le mode opératoire, l’état du
résultat, l’expérience de l’opérateur, les composantes du travail humain,
l’hypothèse d’exception, les heures de mise en place, l’horizon d’amortissement,
l’identifiant de preuve et la méthode nette nécessaires pour reproduire
l’estimation.

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
| D | Cas publié ou test de capacité sans comparaison du temps humain validée indépendamment | Mécanisme et contexte d’implémentation |
| E | Valeur estimée par modèle, synthétique ou réservée à la planification | Hypothèse nommée seulement |

Le niveau décrit la façon de mesurer, pas le caractère favorable du résultat.
Le registre bloque en plus l’usage quantitatif automatique si le temps humain
actif n’a pas été mesuré et si la source n’est pas explicitement admise au
transfert.

## États du transfert

Le calculateur compare six parties du contrat de tâche :

1. le profil de la tâche cible ;
2. le mode de travail ;
3. l’architecture ;
4. la limite d’action exacte A0 à A4 ;
5. l’état exigé du résultat ;
6. l’expérience de l’opérateur.

Il renvoie l’un des quatre états suivants :

| État | Signification |
|---|---|
| Comparable | La source peut encadrer une plage basse, centrale et haute à tester |
| À utiliser avec prudence | La tâche correspond, mais une ou plusieurs conditions diffèrent. La fourchette reste utilisable comme point de départ et les différences restent visibles. |
| Contexte seulement | La source informe la conception sans fournir de ratio transférable de temps humain |
| Non transférable | La tâche de fond est trop différente pour un transfert quantitatif |

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
| Déploiement de support client | Demandes résolues par heure-agent | B | Débit supérieur de 15 % (publication 2025) | Contexte de capacité, pas transfert de temps |
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
6. Lisez la plage brute de la source et la fourchette nette basse, centrale et
   haute qui en résulte.
7. Remplacez chaque paramètre de planification par une observation du pilote
   avant toute décision.

N’ajoutez ni le pourcentage ni le temps résiduel de la source au travail local.
Le moteur conserve le plus grand temps entre le résiduel ajusté de la source et le
plancher de travail humain, puis ajoute le travail absent des deux et la mise en place locale amortie. La source
indique toujours ce qui s’est produit sur une tâche comparable et mesurée. La
fourchette nette montre ce qui reste après explicitation des contrôles locaux et
de l’effort d’implémentation.

## Classement des 11 cas d’école

Chaque résultat de cas reste une hypothèse de planification de niveau E. Un
repère externe peut expliquer un mécanisme ou encadrer une plage séparée, mais
il ne rehausse jamais le niveau du résultat synthétique.

| Cas d’école | Profil de tâche | Mode de travail | Architecture | A | Usage du repère externe |
|---|---|---|---|---:|---|
| Demandes clients d’une TPE | Support client | Copilote | Processus outillé | A1 | Contexte de débit seulement |
| Devis B2B d’une PME | Analyse de connaissances | Automatisation bornée | Agent métier | A2 | Contexte de mécanisme copilote seulement |
| Dossiers de subvention | Synthèse d’information | Automatisation bornée | Agent métier | A2 | Contexte d’analyse seulement |
| Dossiers publics d’urbanisme | Synthèse d’information | Automatisation bornée | Agent métier | A2 | Contexte d’analyse seulement |
| Suivi client d’un indépendant | Rédaction professionnelle | Copilote | Un modèle | A1 | Plage comparable à tester séparément |
| Agent de suivi pour indépendant | Support client | Automatisation bornée | Agent métier | A2 | Contexte de débit seulement |
| Diagnostic orchestré | Projet fortement automatisé | Automatisation forte | Équipe orchestrée | A3 | Mécanisme de contrôle seulement |
| RAG de procédures en lecture seule | Synthèse d’information | Copilote | Processus outillé | A1 | Aucun repère de temps admis |
| Prévision de la demande | Aide à la décision prédictive | Copilote | Un modèle | A0 | Aucun ratio de temps humain transféré |
| Chatbot client externe | Support client | Copilote | Processus outillé | A1 | Contexte de support au personnel seulement |
| Revue multimodale de catalogue | Revue multimodale | Copilote | Un modèle | A1 | Aucun repère de temps admis |

Le registre conserve le raisonnement complet et les fichiers d’exemple
correspondants. Ce classement repose sur le contrat de tâche, pas sur
l’étiquette de l’organisation.

## Contrats lisibles par machine

- [Registre des temps de tâche](../site/public/data/task-time-evidence.v1.json)
- [Schéma JSON des temps de tâche](../site/public/data/task-time-evidence.schema.json)
- [Protocole de pilote terrain](field-pilot-protocol.fr.md)
- [Revue des preuves publiques](../references/field-evidence-review-2026.fr.md)

Ces fourchettes alimentent la couche d’hypothèse de la 0.3. Le brouillon terrain
fige la plage, consigne le résultat observé sur toute la charge et explique leur
écart. Les études externes ne remplissent pas `field-notes/index.json` ; seules
des observations réelles, revues indépendamment et assainies peuvent satisfaire
sa règle d’admission.

## Cas récents disponibles

Le registre propose désormais 19 sources, dont 4 avec un ratio de temps humain admis. Les nouveaux cas couvrent aussi la vérification documentaire, le multimodal, l’optimisation prédictive et les équipes d’agents. Les autres résultats restent utiles pour construire des hypothèses.

[Lire les mécanismes et les limites de chaque cas](../references/recent-implementation-cases.fr.md).

## Explorer trois scénarios sans inventer de preuve

Ouvrez « Explorer les scénarios prudent, central et favorable ». Les champs
principaux décrivent le cas central. Les marges facultatives ajoutent de la
revue, des exceptions et de l’installation au cas prudent, et en retirent au
cas favorable. Ce sont des exemples modifiables, pas une incertitude mesurée.
Le travail humain ne descend pas sous zéro et les exceptions restent entre
0 % et 100 %. Les résultats peuvent rester identiques si les marges sont nulles
ou si le travail restant dans l’étude est supérieur dans les trois cas.

Choisissez « Mes propres hypothèses de démonstration » pour explorer une autre
implémentation sans appliquer le pourcentage de l’étude. Celle-ci reste visible
à titre informatif. Vous pouvez ainsi tester un mécanisme d’automatisation forte
sans présenter une estimation fournisseur comme une mesure. Aucun plafond
général de gain n’est imposé. Un résultat négatif reste visible si le travail
demande davantage de temps.

Exemple de recouvrement : l’étude suggère 30 minutes restantes et votre
décomposition comprend 20 minutes du même travail. Retenez 30, pas 50.
Si 5 minutes supplémentaires sont absentes des deux, ajoutez-les séparément :
35 minutes avant l’installation locale. Si les 30 minutes comprennent déjà
3 minutes d’installation, retirez-les d’abord :
max(30 - 3, 20) + 5 = 32 minutes, puis ajoutez l’installation locale amortie.

Les détails de la source distinguent une moyenne, des écarts entre groupes,
un intervalle statistique et une estimation interne ou produite par un modèle.
Ils précisent aussi l’époque, le modèle, les outils et ce que le temps comprend.
Aucune de ces plages ne devient automatiquement une prévision locale fiable.

Les marges, le choix étude/hypothèses et les ajustements de périmètre sont
conservés avec l’hypothèse figée et ses exports lisibles. Les anciennes sessions
sans ces réglages facultatifs gardent leur calcul antérieur.
