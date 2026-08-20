# Cas synthétique non agentique : assistant RAG en lecture seule pour les procédures terrain

> **Exemple fictif.** L’organisation, le corpus, les volumes, les résultats et
> les décisions sont synthétiques. Ils illustrent un contrat d’évaluation et ne
> prouvent pas la performance d’un produit.

> **Mode dominant : recherche augmentée. Mode secondaire : génération. Niveau : A1.**
> Le système recherche dans un corpus autorisé et prépare une réponse citée.
> Aucun outil ne lui permet d’écrire, envoyer, planifier, approuver ou modifier
> un système opérationnel.

## 1. Point de départ

**Helvetia Facilities Sàrl** est une entreprise fictive de maintenance de 42
personnes, active en Suisse romande et alémanique. Les techniciens cherchent des
contrôles de sécurité, des procédures d’équipement, des limites de garantie et
des contacts d’escalade. Le corpus contrôlé contient 680 procédures, manuels et
notes de service approuvés.

Une revue de 60 questions historiques synthétiques fixe la baseline :

| Mesure | Baseline |
|---|---:|
| Temps actif médian de recherche | 12 min |
| Bonne source actuelle retrouvée | 46/60, soit 76,7 % |
| Question escaladée faute de source claire | 9/60 |
| Réponse reprise d’un document périmé | 5/60 |

L’objectif est borné : **retrouver les passages actuels et autorisés, puis
préparer une réponse citée à faire relire**. Le système n’interprète pas la
réglementation, ne diagnostique pas une panne et n’autorise aucun travail.

## 2. Profil et limites du système

| Dimension | Décision du pilote |
|---|---|
| Interaction | Interface interne de recherche |
| Connaissance | Corpus RAG versionné uniquement |
| Déploiement | API fournisseur et index contrôlé par l’entreprise |
| Sortie | Brouillon, citations, raison de confiance et abstention |
| Risque et autonomie | R1, A1 |
| Route juridique | Suisse ; ajouter la route UE si personnel ou données UE entrent dans le périmètre |

Le responsable du corpus approuve chaque document, date d’effet, groupe d’accès
et version remplacée. Le filtrage selon le rôle de la personne connectée a lieu
avant qu’un passage soit transmis au modèle. La mémoire de conversation est
désactivée.

Sont interdits : accès à la messagerie ou aux tickets, création d’un ordre de
travail, commande d’un équipement, ingestion automatique de sources, réponse
sans citation vérifiable et document hors du groupe d’accès.

## 3. Évaluation figée

Après configuration, l’équipe fige 80 questions. Elles comprennent 20 tests de
frontière d’accès, 16 procédures remplacées, 10 questions sans réponse fondée et
12 documents contenant des instructions destinées à détourner le modèle.

| Mesure | Acceptation | Arrêt |
|---|---:|---:|
| Bonne source dans les cinq premiers résultats | au moins 95 % | moins de 90 % |
| Réponse entièrement fondée sur les passages cités | au moins 95 % | moins de 90 % |
| Version actuelle choisie en cas de conflit | 100 % | moins de 100 % |
| Refus correct d’une question non couverte | au moins 90 % | moins de 80 % |
| Divulgation entre rôles | 0 | au moins 1 |
| Instruction critique dangereuse présentée comme procédure | 0 | au moins 1 |

### Résultat synthétique du jeu figé

| Mesure | Résultat | Gate |
|---|---:|---|
| Bonne source dans les cinq premiers résultats | 78/80, soit 97,5 % | passe |
| Réponse entièrement fondée | 76/80, soit 95 % | passe au seuil |
| Version actuelle en cas de conflit | 16/16 | passe |
| Refus correct | 9/10 | passe au seuil |
| Divulgation entre rôles | 0/20 | passe |
| Instruction critique dangereuse | 0/12 | passe |

Quatre réponses citent le bon document mais exagèrent ce que le passage autorise.
Elles restent des échecs de réponse même si la recherche a réussi. La qualité de
recherche ne se confond donc pas avec la qualité de génération.

## 4. Conception du pilote

Les deux premières semaines restent en shadow mode. Le technicien rédige sa
réponse selon la procédure habituelle avant que l’évaluateur révèle la proposition.
Une étape A1 ultérieure peut afficher le brouillon, mais chaque passage cité doit
être ouvert et la personne doit accepter, corriger, escalader ou rejeter.

Le registre conserve le dénominateur complet, le groupe d’accès, la photographie
du corpus, les identifiants récupérés, les passages cités, le brouillon,
l’abstention, la correction, le temps de revue et le résultat humain final.

## 5. Décision

**Décision : autoriser 30 cas en shadow mode, pas la production.**

Le jeu figé autorise une observation bornée, pas une affirmation de gain ni un
usage sûr sur les procédures rares. Toute fuite d’accès, procédure critique
périmée, instruction de sécurité non fondée ou citation introuvable arrête le
pilote. Une modification du modèle, prompt, index, corpus, permission ou
découpage rouvre les tests concernés.

## 6. Limites de transfert et sources

Aucun gain métier mesuré n’est affirmé. Ces résultats synthétiques ne se
transfèrent pas à un autre corpus, une autre langue, un fournisseur, une matrice
d’accès ou un domaine de sécurité différent.

Les contrôles s’appuient sur le profil de recherche du
[guide des modes d’usage](../../docs/ai-use-patterns.fr.md), les risques
d’injection indirecte et de frontière de données de
[l’OWASP GenAI](https://genai.owasp.org/llm-top-10/) et la structure du
[NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework).

## 7. Dossier de preuves

Conserver le manifeste et les hash du corpus, les règles de remplacement, la
matrice des rôles, les questions figées, les sources attendues, les documents
adversariaux, les versions, les résultats, les corrections, les arrêts et la
décision signée.
