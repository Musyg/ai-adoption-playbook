# Cas synthétique TPE — De la boîte mail au copilote validé

> **Exemple fictif.** L’entreprise, les personnes, les volumes et les résultats
> sont entièrement synthétiques. Ils illustrent la méthode ; ils ne constituent
> ni une étude de marché, ni une preuve de performance, ni un avis juridique.

## 1. Situation initiale

**Atelier Horizon** est une TPE fictive de huit personnes qui installe et
entretient des équipements pour des clients professionnels. Une boîte mail
partagée reçoit environ 360 demandes par mois : devis, rendez-vous, pannes,
questions de facturation et réclamations.

Deux personnes lisent les messages, cherchent les informations dans les
documents internes, choisissent le bon responsable et rédigent une réponse.
Les demandes ambiguës ou incomplètes circulent parfois entre plusieurs membres
de l’équipe.

### Baseline mesurée sur quatre semaines

| Mesure | Valeur initiale | Source |
|---|---:|---|
| Demandes reçues | 360 par mois | Boîte mail partagée |
| Temps médian de traitement actif | 11 min par demande | Échantillon chronométré |
| Première réponse le jour même | 68 % | Horodatages de messagerie |
| Reprise après réponse incomplète | 18 % | Relecture de 80 dossiers |
| Mauvaise attribution initiale | 9 % | Historique des transferts |

Le problème retenu n’est pas « automatiser le service client ». Il est plus
étroit : **préparer une attribution et un brouillon utiles, sans envoyer ni
modifier un système sans validation humaine**.

## 2. Mandat et limites

| Élément | Décision du pilote |
|---|---|
| Propriétaire métier | Responsable du service client |
| Responsable de la décision | Direction de la TPE |
| Durée | 30 jours |
| Budget maximal | CHF 7 500, configuration, accompagnement et temps interne compris |
| Population | Une boîte mail, trois utilisateurs formés |
| Autonomie | A1 — recherche et brouillon uniquement |
| Impact potentiel | R2 — données clients et future communication externe |

### Interdictions écrites avant le choix de l’outil

- aucun envoi automatique ;
- aucune promesse de prix, délai, garantie ou indemnisation ;
- aucune modification du CRM ou du planning ;
- aucune utilisation de données bancaires, médicales ou étrangères au cas ;
- aucune réponse lorsque l’identité, le destinataire ou la demande restent
  ambigus ;
- aucun apprentissage fournisseur sur les données de l’entreprise sans accord
  vérifié.

La procédure manuelle reste disponible pendant tout le pilote. Un utilisateur
peut retirer le copilote du flux sans interrompre la boîte mail.

## 3. Architecture suffisante la plus simple

L’équipe compare trois options :

1. ajouter des règles de messagerie et des modèles de réponse ;
2. combiner un routage déterministe avec un modèle qui extrait les informations
   et prépare un brouillon à partir de contenus approuvés ;
3. utiliser un agent connecté à la messagerie, au CRM et au planning.

L’option 2 est retenue. Les règles classiques traitent les expéditeurs connus,
les numéros de contrat et les catégories stables. Le modèle reçoit un message
minimisé, propose une catégorie, liste les informations manquantes et prépare un
brouillon. La personne voit le message original, les sources utilisées et la
proposition dans le même écran.

L’option agentique est rejetée : elle ajoute des permissions et des effets sans
être nécessaire au résultat recherché.

## 4. Évaluation préenregistrée

L’équipe constitue 80 demandes historiques autorisées et minimisées. Quarante
servent à régler le système ; quarante sont gelées pour la décision. Le jeu de
décision contient des demandes courantes, des informations manquantes, des
réclamations, des données à protéger, un mauvais destinataire et des instructions
malveillantes placées dans le corps du message.

| Métrique | Seuil d’acceptation | Seuil d’arrêt |
|---|---:|---:|
| Attribution correcte | ≥ 95 % | < 90 % |
| Champs obligatoires correctement extraits | ≥ 95 % | < 90 % |
| Escalade des cas sensibles ou ambigus | 100 % | < 100 % |
| Affirmation critique non étayée | 0 | ≥ 1 |
| Brouillons nécessitant une correction importante | ≤ 35 % | > 50 % |
| Temps médian de traitement | ≤ 9 min | ≥ 10 min |

### Résultats sur le jeu gelé

| Mesure | Résultat | Décision |
|---|---:|---|
| Attribution correcte | 39/40 — 97,5 % | Accepté |
| Extraction complète | 38/40 — 95 % | Accepté au seuil |
| Escalade des huit cas critiques | 8/8 — 100 % | Accepté |
| Affirmation critique non étayée | 0 | Accepté |
| Correction importante | 14/40 — 35 % | Accepté au seuil |
| Temps médian simulé | 8 min 25 s | Accepté |

Deux brouillons contiennent une formulation trop affirmative, mais aucune
promesse de prix, de délai ou de garantie. Ils sont conservés dans le registre
d’erreurs et ajoutés aux tests de non-régression.

## 5. Pilote en deux paliers

### Jours 15 à 21 — Shadow mode

Le copilote traite les nouveaux messages sans montrer ses propositions aux
personnes qui répondent. Une évaluatrice compare ensuite la catégorie, les
informations extraites et le brouillon au traitement réel. Un changement de
configuration est autorisé pendant cette phase ; chaque version est notée.

### Jours 22 à 30 — Copilote

Trois utilisateurs formés voient la proposition. Ils doivent accepter,
corriger ou rejeter l’attribution et le brouillon. Le bouton d’envoi reste celui
de la messagerie et exige toujours une action humaine. Les réclamations, les
demandes financières et les messages ambigus sont systématiquement escaladés.

## 6. Résultats observés

Le palier copilote porte sur 90 demandes consécutives. Les résultats sont
comparés à la baseline, sans extrapolation annuelle.

| Mesure | Baseline | Pilote | Écart observé |
|---|---:|---:|---:|
| Temps médian de traitement actif | 11 min | 8 min 35 s | −22 % |
| Première réponse le jour même | 68 % | 80 % | +12 points |
| Reprise après réponse incomplète | 18 % | 15 % | −3 points |
| Mauvaise attribution initiale | 9 % | 5 % | −4 points |
| Correction importante du brouillon | non mesurée | 31 % | nouvelle mesure |
| Incident grave | 0 observé | 0 observé | aucune conclusion de rareté |

Les demandes incomplètes et les références produit inhabituelles concentrent
les corrections. Le gain observé reste compatible avec l’ordre de grandeur des
études de terrain disponibles, sans être présenté comme une réplication.
L’absence d’incident grave sur 90 demandes ne démontre ni que le risque est nul,
ni que son taux est faible.

## 7. Décision de gate

**Décision : continuer sous conditions au niveau copilote.**

La valeur métier et les seuils de fiabilité sont atteints sur le périmètre
observé. L’équipe n’autorise toutefois ni envoi automatique, ni écriture dans le
CRM, ni modification du planning.

Conditions pour les 60 jours suivants :

1. ajouter 20 cas sur les références inhabituelles et les informations
   manquantes ;
2. maintenir une revue hebdomadaire des erreurs et quasi-incidents ;
3. répéter le jeu gelé après chaque changement de modèle ou d’instructions ;
4. surveiller séparément temps, qualité, corrections et escalades ;
5. revoir le fournisseur, les coûts et la possibilité de sortie après 60 jours.

Une automatisation bornée ne sera examinée que si un sous-ensemble stable,
réversible et vérifiable dépasse les seuils sur une période plus longue.

## 8. Ancrage dans des cas publiés

Le scénario reprend des mécanismes observés, mais aucun chiffre d’une autre
organisation n’est réutilisé comme résultat du pilote fictif :

- le cas de la PME croate RIS décrit la classification des courriels, la
  recherche dans une base interne et les brouillons relus par les agents ; les
  gains annoncés sont des estimations de cas de succès, pas un benchmark
  indépendant ;
- une étude publiée dans le *Quarterly Journal of Economics* sur 5 172 agents de
  support mesure un gain moyen de productivité de 15 %, très variable selon
  l’expérience et les problèmes traités ;
- un cas industriel maritime montre que les brouillons peuvent accélérer le
  travail tout en exigeant souvent des modifications importantes ; les experts
  doivent garder la décision finale ;
- une expérience menée dans 66 organisations observe moins de temps passé dans
  la messagerie chez les utilisateurs actifs, sans transformation détectable de
  la structure globale du travail ;
- des cas publiés par l’OCDE et Microsoft montrent l’importance des échanges par
  courriel, de la rapidité de réponse et de la qualité linguistique, mais ne
  permettent pas d’inférer les performances d’une TPE suisse.

Les liens, chiffres publiés et limites de transfert sont consignés dans la
[note de preuves des cas](../../references/tpe-customer-support-cases.md).

## 9. Dossier de preuves

Le pilote conserve :

- le [mandat](../../templates/mandate.fr.md) et la baseline ;
- la [fiche de cas d’usage](../../templates/use-case-card.fr.md) ;
- l’[évaluation du fournisseur](../../templates/vendor-assessment.fr.md) ;
- le [plan d’évaluation](../../templates/evaluation-plan.fr.md) et le jeu gelé ;
- les versions de configuration et le registre d’erreurs ;
- la [décision de pilote](../../templates/pilot-decision.fr.md) ;
- le [runbook d’incident](../../templates/incident-runbook.fr.md) et la procédure
  manuelle testée.

Ce dossier permet à une autre personne de comprendre pourquoi le pilote a été
autorisé, ce qui a réellement été observé et quelles actions restent interdites.
