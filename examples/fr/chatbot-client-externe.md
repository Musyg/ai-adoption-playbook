# Cas synthétique non agentique : chatbot externe d’information client

> **Exemple fictif.** Le commerce, les utilisateurs, les conversations, les
> résultats et la décision sont synthétiques. Ils illustrent les contrôles et ne
> prouvent pas qu’un chatbot améliore le service.

> **Mode dominant : conversation. Mode secondaire : recherche augmentée.
> Niveau : A1.** Le chatbot répond depuis des informations publiques approuvées
> et transfère vers une personne. Il ne peut ni authentifier un client, accéder
> à une commande, rembourser, envoyer un message ou modifier un système.

## 1. Point de départ

**Alpina Outdoor GmbH** est un commerce en ligne suisse fictif qui sert des
clients en Suisse et dans l’Union européenne. L’équipe reçoit environ 1 100
questions par mois. Près de 620 concernent horaires, zones de livraison, retours,
guides de taille et manuels publics. Comptes, paiements, réclamations et garanties
exigent une personne.

| Mesure | Baseline sur quatre semaines |
|---|---:|
| Première réponse médiane pendant les heures ouvrées | 3 h 40 |
| Questions d’information publique courantes | 620 par mois |
| Conversation transférée entre employés | 17 % |
| Parcours autonome accessible terminé | non mesuré |

L’objectif est : **répondre aux questions publiques bornées ou diriger la personne
vers un canal humain joignable**. La déflexion n’est pas la mesure principale.

## 2. Interaction et frontière juridique

| Dimension | Décision du pilote |
|---|---|
| Présentation | IA clairement identifiée avant le premier message |
| Connaissance | Pages publiques approuvées, datées et localisées |
| Langues | français, allemand, italien et anglais |
| Risque et autonomie | R2, A1 |
| Juridictions | Suisse et Union européenne |
| Conservation | Transcription minimisée et supprimée selon la durée approuvée |

L’interface explique l’interaction avec une IA, les données à ne pas saisir,
l’usage des messages et la manière de joindre une personne. Cette information
reste visible sur mobile et compréhensible avec un lecteur d’écran.

L’analyse des rôles de l’article 50, l’analyse suisse de transparence, la notice
de protection des données, la conservation, la réutilisation fournisseur, la
sous-traitance, les transferts et l’accessibilité sont datés séparément. La notice
d’une juridiction ne remplace pas l’autre.

Sont interdits : conseil médical ou de sécurité personnalisé, statut d’un compte,
paiement, remboursement, décision de garantie, réclamation, interprétation
juridique et promesse de prix ou délai. Ces sujets déclenchent un transfert humain.

## 3. Évaluation des conversations figées

Le jeu contient 160 conversations scriptées, dont 40 cas multi-tours, 24 transferts,
20 entrées adversariales ou abusives, 16 questions non couvertes ainsi que des
segments par langue et accessibilité.

| Mesure | Acceptation | Arrêt |
|---|---:|---:|
| Personnes comprenant qu’elles parlent à une IA | au moins 95 % | moins de 90 % |
| Réponse entièrement fondée dans le périmètre | au moins 95 % | moins de 90 % |
| Transfert humain requis proposé | 100 % | moins de 100 % |
| Canal humain effectivement atteint | au moins 98 % | moins de 95 % |
| Règle, prix, délai ou garantie inventé | 0 | au moins 1 |
| Blocage critique clavier ou lecteur d’écran | 0 | au moins 1 |

### Résultat synthétique du jeu figé

La première interface obtient 88 % de compréhension de la notice sur mobile et
échoue. Après réécriture et placement avant le premier champ, un nouvel
échantillon figé atteint 39/40, soit 97,5 %.

Sur le jeu complet, 132 réponses sur 136 sont entièrement fondées, soit 97,1 %.
Les 24 transferts obligatoires sont proposés, mais 23 seulement aboutissent. Aucun
prix, délai ou garantie n’est inventé. L’échec du transfert devient un incident
de service et bloque l’usage réel jusqu’à correction.

## 4. Conception du pilote

Après correction et nouveau test du transfert, le premier stade reste en shadow
mode. Le personnel répond normalement, puis compare la proposition. Un pilote A1
borné peut ensuite traiter uniquement les intentions publiques approuvées pendant
les heures où l’équipe est joignable.

Le registre conserve chaque demande, langue, décision d’éligibilité, version de
la notice, page citée, réponse, refus, transfert proposé, transfert abouti,
correction humaine, plainte et suppression. Il ne publie jamais uniquement les
questions que le chatbot a accepté de traiter.

## 5. Décision

**Décision : corriger et rejouer la gate de transfert avant tout pilote externe.**

La qualité des réponses et la notice ne compensent pas un recours cassé. L’usage
externe reste interdit tant que le parcours exact ne passe pas sur ordinateur,
mobile, navigation clavier et combinaison de lecteur d’écran prise en charge.

## 6. Limites de transfert et sources

L’exemple n’affirme aucun taux de déflexion, gain financier ou résultat client.
Les conversations et résultats sont synthétiques.

Les questions juridiques s’appuient sur les orientations du PFPDT sur
[l’IA et la protection des données](https://www.edoeb.admin.ch/en/ai-and-data-protection)
et les lignes directrices finales de la Commission européenne sur
[l’article 50](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems).
L’évaluation suit le [guide des modes d’usage](../../docs/ai-use-patterns.fr.md).

## 7. Dossier de preuves

Conserver les analyses de rôles et juridictions, les versions de notice, les
tests de compréhension, les pages approuvées, les conversations figées, les
résultats d’accessibilité, le suivi des transferts, les conditions fournisseur,
la preuve de suppression, la voie de plainte, les incidents et la gate.
