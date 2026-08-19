# Cas synthétique indépendant — Du copilote à l’agent métier A2

> **Exemple fictif.** Camille Rey, ses clients, les volumes et les résultats
> sont synthétiques. Le cas illustre une méthode de mesure ; il ne prouve pas la
> performance d’un produit, de Talos, d’Hermes ou d’un métier.

> **Niveau mesuré : agent métier A2.** Le système transporte un dossier borné
> de bout en bout et exécute des actions externes après une approbation humaine
> explicite. Il ne s’agit ni d’un simple copilote A1, ni d’une autonomie A3.

## 1. Continuité avec le pilote copilote

Camille Rey a d’abord testé un copilote de rédaction pendant 14 jours. La
médiane du travail humain est passée de 44 à 34 minutes, mais la consultante
devait encore apporter le contexte, relire les notes, transférer les actions,
mettre à jour le CRM, créer les tâches, choisir le destinataire et envoyer.

Le nouveau problème n’est donc plus « mieux rédiger ». Il est :

**transporter un suivi client éligible depuis les notes structurées jusqu’aux
systèmes mis à jour, avec contrôles, approbation unique, exécution traçable et
escalade des exceptions.**

## 2. Mandat et population éligible

| Élément | Décision |
|---|---|
| Propriétaire et approbatrice | Camille Rey |
| Durée | 30 jours |
| Population live | 20 suivis clients éligibles |
| Évaluation préalable | 40 dossiers historiques gelés et autorisés |
| Autonomie | A2 — actions après approbation explicite |
| Impact | R2 — données clients et communication externe |
| Retour manuel | Checklist, modèles et systèmes habituels conservés |

Un dossier est éligible uniquement si le client, la finalité, les destinataires
possibles et la catégorie de suivi sont déjà connus. Sont exclus : prix nouveau,
modification contractuelle, recommandation juridique, litige, santé, ressources
humaines, donnée reçue sans autorisation, destinataire inconnu, décision non
confirmée et conflit entre les notes et le CRM.

## 3. Workflow et permissions

L’agent exécute six étapes dans un état de dossier versionné :

1. contrôler l’éligibilité et minimiser les notes ;
2. lire le contexte client et les règles applicables dans le CRM ;
3. préparer compte rendu, actions, échéances et courriel ;
4. vérifier faits, dates, responsables, engagements interdits et conflits ;
5. présenter un dossier de preuves unique à Camille ;
6. après approbation, envoyer, écrire dans le CRM, créer les tâches et conserver
   les identifiants des effets.

| Capacité | Permission du pilote |
|---|---|
| Notes structurées | Lecture du dossier courant seulement |
| CRM | Lecture des clients autorisés ; écriture après approbation |
| Messagerie | Brouillon libre ; envoi après approbation, aux destinataires affichés |
| Gestion des tâches | Création après approbation ; aucun effacement |
| Calendrier | Lecture des disponibilités ; aucune réservation automatique |
| Prix et contrat | Aucune écriture ni décision |

Chaque système utilise une identité technique distincte. Les écritures portent
une clé d’idempotence afin qu’une relance ne crée pas deux tâches ou deux
courriels. Un coupe-circuit bloque les effets externes sans arrêter la lecture et
le diagnostic. Les jetons, instructions, sorties, validations, appels d’outils,
réponses et identifiants d’effets sont journalisés.

## 4. Évaluation écrite avant le live

Les 40 cas gelés couvrent dossiers simples, dates ambiguës, action sans
responsable, conflit CRM/notes, demande de prix, destinataire absent, contenu
injecté dans une note, expiration de session, CRM indisponible, timeout après
écriture et relance du même dossier.

| Mesure | Seuil | Résultat gelé |
|---|---:|---:|
| Faits critiques correctement repris | 100 % | 117/117 |
| Exceptions obligatoires escaladées | 100 % | 14/14 |
| Engagement, prix ou destinataire inventé | 0 | 0 |
| Action externe avant approbation | 0 | 0 |
| Écriture dupliquée après relance | 0 | 0 |
| Reprise majeure sur cas éligible | ≤ 10 % | 3/40 — 7,5 % |
| Repli sûr lors d’une panne simulée | 100 % | 8/8 |

Trois dossiers passent techniquement mais exigent une restructuration majeure.
Ils restent dans le jeu de régression. Aucun seuil critique raté n’est masqué par
une moyenne globale.

## 5. Pilote de 30 jours

### Jours 1–5 — Connecter sans ouvrir

Identités séparées, moindre privilège, CRM en lecture seule, écritures simulées,
clés d’idempotence, coupe-circuit et procédure manuelle sont vérifiés.

### Jours 6–12 — Rejouer et attaquer

Les 40 dossiers gelés sont rejoués. Toute modification d’instruction, de modèle,
de connecteur ou de politique impose une nouvelle exécution complète.

### Jours 13–20 — Shadow mode complet

L’agent prépare le workflow jusqu’aux effets externes simulés. Camille réalise
le vrai suivi manuellement avant de voir la proposition. Les écarts de contenu,
d’ordre des actions et de permissions sont consignés.

### Jours 21–30 — A2 avec approbation

Pour chaque dossier éligible, Camille reçoit les sources utilisées, le message,
les écritures prévues et les contrôles passés. Elle approuve, corrige ou refuse.
Une approbation autorise uniquement les effets affichés pour ce dossier et
expire après leur exécution.

## 6. Résultats synthétiques

| Mesure | Manuel initial | Copilote A1 | Agent métier A2 |
|---|---:|---:|---:|
| Temps humain actif médian | 44 min | 34 min | 14 min |
| Débit théorique accepté par heure humaine | 1,36 | 1,76 | 4,29 |
| Rapport de débit vs manuel | ×1 | ×1,29 | **×3,15** |
| Workflow transporté par le système | 0/6 étape | 1/6 étape | 6/6 étapes |
| Action externe autorisée | aucune | aucune | après approbation |

Sur les 20 dossiers live :

- 13 sont prêts à approuver sans correction ;
- 4 demandent une correction mineure avant approbation ;
- 3 sont correctement escaladés : deux demandes de prix/périmètre et une date
  contradictoire ;
- aucun prix, engagement ou destinataire n’est inventé ;
- aucune action externe ne part sans approbation ;
- aucune écriture ni aucun courriel n’est dupliqué.

Le **taux de bout en bout sans intervention reste 0 %**, car A2 impose une
approbation sur chaque dossier. Le taux de 13/20 signifie « prêt à approuver sans
correction », pas « autonome ». Cette distinction empêche de transformer un bon
résultat A2 en revendication A3.

Le rapport ×3,15 porte uniquement sur les suivis acceptés par heure humaine
active. Il ne prouve ni un triplement du chiffre d’affaires, ni une rentabilité
annuelle, ni la disparition d’autres goulots de travail.

## 7. Décision de gate

**Décision : conserver A2 pendant 60 jours ; ne pas activer A3.**

Le système transporte désormais le workflow et le gain devient nettement plus
fort que celui du copilote. La population reste toutefois petite et tous les
effets externes exigent encore une approbation.

Une candidature A3 limitée aux suivis récurrents à faible risque ne pourra être
examinée qu’après :

1. 50 cas éligibles supplémentaires ;
2. zéro erreur critique ou action hors autorisation ;
3. au moins 80 % de dossiers prêts sans correction ;
4. au plus 10 % de reprises majeures ;
5. des catégories d’exception stables ;
6. une restauration et une révocation des permissions testées ;
7. une nouvelle décision documentée, distincte du succès A2.

## 8. Pourquoi le gain dépasse celui du copilote

Le modèle n’est pas supposé être trois fois plus intelligent. Le gain vient du
déplacement de tâches que le copilote laissait à Camille : recherche de contexte,
transport entre systèmes, contrôles, préparation des écritures, exécution et
journalisation. Comparer uniquement la vitesse de rédaction masquerait cette
différence d’architecture.

Les ordres de grandeur externes, leurs limites et les contre-preuves sont
consignés dans la note
[Copilote, agent métier et agence orchestrée](../../references/agentic-integration-levels.md).

## 9. Dossier de preuves

Le pilote conserve mandat, population éligible, matrice de permissions, modèle
de menace, 40 cas gelés, sorties et traces versionnées, preuves d’approbation,
identifiants d’effets, tests d’idempotence, incidents, temps actifs, corrections,
escalades, décision de gate et procédure de retour manuel.
