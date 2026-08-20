# Cas synthétique non agentique : prévision hebdomadaire de la demande de pièces

> **Exemple fictif.** L’entreprise, les produits, l’historique, le backtest et
> la décision sont synthétiques. Les chiffres illustrent un protocole, pas une
> prévision de valeur ou de performance.

> **Mode dominant : prédiction. Niveau : A0.** Le modèle produit une prévision
> hebdomadaire et un intervalle d’incertitude. Le planificateur reste seul
> responsable des quantités et commandes. Le modèle ne peut ni appeler un outil
> ni agir.

## 1. Point de départ

**Léman Pièces SA** est un distributeur fictif de 18 personnes qui dessert des
garages en Suisse et dans les régions UE voisines. Un planificateur prévoit la
demande hebdomadaire de 320 références. Promotions, saisonnalité, substitutions
et délais fournisseurs rendent la baseline sur tableur inégale.

La photographie de planification utilise une période de contrôle synthétique de
52 semaines :

| Mesure | Baseline actuelle |
|---|---:|
| Erreur absolue pondérée en pourcentage | 31 % |
| Biais signé moyen | +8 %, sur-prévision |
| Lignes indisponibles lors de la demande | 8,2 % |
| Stock âgé de plus de 180 jours | CHF 184 000 |

L’objectif n’est pas l’achat automatique. Il consiste à **fournir une prévision
hebdomadaire reproductible, son incertitude et une abstention visible**.

## 2. Profil et frontière de données

| Dimension | Décision du pilote |
|---|---|
| Interaction | Rapport batch hebdomadaire |
| Données | Ventes, stocks, délais et promotions autorisés |
| Sortie | Prévision, intervalle, alerte de qualité et segment |
| Modèle | Modèle prévisionnel classique, sans modèle de langage |
| Risque et autonomie | R1, A0 |
| Effet externe | Aucun ; l’export ne peut créer de commande |
| Route juridique | Revue des localisations CH et UE ; aucune donnée personnelle prévue |

Identité client, performance du personnel, texte libre et attributs protégés
sont exclus. Les références sont évaluées par segment : stables, saisonnières,
intermittentes, nouvelles et sensibles aux substitutions.

Le rapport ne peut recommander un fournisseur, modifier le stock de sécurité,
écrire dans l’ERP ou masquer une faible confiance. Les nouveaux produits sans
historique suffisant restent soumis à la règle manuelle.

## 3. Évaluation temporelle

Une séparation aléatoire est interdite car elle ferait fuiter le futur. L’équipe
utilise des backtests à origine glissante et fige les 26 dernières semaines pour
la gate. Les métriques sont publiées globalement et par segment.

| Mesure | Acceptation | Arrêt |
|---|---:|---:|
| WAPE globale | au plus 25 % | plus de 29 % |
| Biais signé | entre -5 % et +5 % | hors de -10 % à +10 % |
| Couverture empirique de l’intervalle à 80 % | 75 % à 90 % | moins de 65 % |
| Segment dégradé de plus de 10 % face à la baseline | 0 | au moins 1 segment critique |
| Donnée manquante affichée sans alerte | 0 | au moins 1 |

### Résultat synthétique du backtest

| Segment | WAPE baseline | WAPE modèle | Décision |
|---|---:|---:|---|
| Stable | 24 % | 18 % | passe |
| Saisonnier | 36 % | 24 % | passe |
| Intermittent | 43 % | 39 % | amélioration encore faible |
| Nouveau produit | 48 % | 52 % | échec ; règle manuelle |
| Ensemble des références éligibles | 31 % | 23,8 % | passe |

Le biais global atteint +3,1 % et la couverture 82 %. Le modèle n’est pas accepté
pour les nouveaux produits. L’amélioration globale ne fait pas disparaître
l’échec de ce segment.

## 4. Pilote en shadow mode

Pendant huit semaines, le planificateur ne reçoit le rapport qu’après avoir figé
sa prévision habituelle. Le registre conserve les deux prévisions, l’incertitude,
le motif de correction, la commande choisie par la personne, la demande ultérieure,
la rupture, l’excès de stock et chaque incident de données.

Aucune commande fournisseur n’est générée. La gate métier ne peut être jugée
qu’une fois la demande observable. Une erreur de backtest plus faible ne prouve
pas à elle seule une meilleure disponibilité, trésorerie ou qualité de service.

## 5. Décision

**Décision : autoriser l’évaluation en shadow pour les produits établis et
éligibles.**

Les nouveaux produits restent sur la règle manuelle. Toute modification majeure
de promotion, substitution, stock, délai ou référentiel déclenche une revue des
données. Dérive matérielle, sous-couverture, régression d’un segment critique ou
trou de données inexpliqué suspendent le rapport.

## 6. Limites de transfert et sources

Les chiffres sont synthétiques. Ils ne prédisent pas un autre assortiment,
régime de demande, horizon ou réseau logistique. Ce cas utilise volontairement
un modèle prédictif classique pour rappeler que l’adoption IA ne se réduit pas
aux systèmes génératifs.

Le profil suit la
[classification des systèmes de l’OCDE](https://www.oecd.org/en/publications/oecd-framework-for-the-classification-of-ai-systems_cb6d9eca-en.html),
la taxonomie de l’IA prédictive de
[NIST AI 100-2e2025](https://csrc.nist.gov/pubs/ai/100/2/e2025/final) et le
[guide des modes d’usage](../../docs/ai-use-patterns.fr.md).

## 7. Dossier de preuves

Conserver le dictionnaire de données, la séparation temporelle, les versions des
variables, les produits exclus, la prévalence des segments, les prévisions et
intervalles figés, les corrections, les résultats ultérieurs, la dérive, le
fallback manuel et la décision signée.
