# Cas synthétique non agentique : assistant multimodal d’accessibilité du catalogue

> **Exemple fictif.** L’entreprise, le catalogue, les médias, les résultats et
> la décision sont synthétiques. Ils illustrent un workflow multimodal contrôlé
> et ne prouvent pas la performance d’un produit.

> **Mode dominant : multimodal. Modes secondaires : génération et classification.
> Niveau : A1.** Le système lit les images produit et le texte des emballages
> autorisés, puis prépare un texte alternatif et signale les incohérences. Il ne
> peut ni modifier le média source, publier une page ou écrire dans le catalogue.

## 1. Point de départ

**Asteria Home SA** est une PME suisse fictive de 2 400 produits vendus en Suisse
et dans l’Union européenne. Une nouvelle fiche arrive avec photos, emballages,
dimensions, matériaux et texte fournisseur. Un éditeur rédige les textes
alternatifs français et anglais, puis confronte les affirmations visibles aux
données structurées.

| Mesure | Baseline synthétique |
|---|---:|
| Jeux d’images nouveaux ou modifiés par mois | 180 |
| Revue active médiane par jeu | 8 min |
| Texte alternatif renvoyé pour correction majeure | 21 % |
| Incohérence entre image et champ structuré | 7 % |

L’objectif est : **préparer un texte alternatif factuel et signaler les
incohérences visibles à un éditeur**. Le système ne déduit ni qualité, sécurité,
origine, durabilité ou caractéristique protégée depuis une image.

## 2. Droits, provenance et limites

| Dimension | Décision du pilote |
|---|---|
| Entrées | Photos produit, crops d’emballage et champs approuvés |
| Sorties | Texte alternatif, attributs visibles et signal d’incohérence |
| Risque et autonomie | R1, A1 |
| Juridictions | Suisse et Union européenne |
| Effet externe | Aucun ; la publication reste une action humaine séparée |

Chaque média possède un propriétaire, une licence ou autorité fournisseur, un
identifiant source, un hash, une date lorsque disponible et une règle d’usage.
Visages, logements, adresses, plaques, médias clients et personnes en arrière-plan
sont exclus.

Le média source reste immuable. Le système ne peut générer une image de
remplacement, retirer un filigrane, supprimer la provenance ou modifier
silencieusement un emballage. Si une future version génère ou manipule un média
public, l’analyse fournisseur/déployeur de l’article 50 et le test de marquage
lisible par machine doivent être rouverts.

## 3. Évaluation multimodale

Le jeu figé comprend 140 lots : 20 images basse résolution, 20 emballages riches
en texte, 20 couleurs très proches, 16 incohérences provoquées, 12 affirmations
de durabilité non fondées et des transformations de crop, taille, compression et
métadonnées.

| Mesure | Acceptation | Arrêt |
|---|---:|---:|
| Attributs visibles correctement extraits | au moins 97 % | moins de 94 % |
| Texte alternatif accepté après revue définie | au moins 90 % | moins de 80 % |
| Matériau, dimension, certification ou sécurité inventé | 0 | au moins 1 |
| Incohérence provoquée correctement signalée | 100 % | moins de 100 % |
| Média sans autorité d’usage traité | 0 | au moins 1 |
| Omission critique d’accessibilité | 0 | au moins 1 |

### Résultat synthétique du jeu figé

| Mesure | Résultat | Gate |
|---|---:|---|
| Attributs visibles corrects | 538/552, soit 97,5 % | passe |
| Texte alternatif accepté | 128/140, soit 91,4 % | passe |
| Affirmation interdite inventée | 0 | passe |
| Incohérence provoquée signalée | 16/16 | passe |
| Média sans droits vérifiés traité | 0 | passe |
| Omission critique d’accessibilité | 0 | passe |

Les corrections concernent surtout les nuances de couleur et les descriptions
trop longues. Deux petits avertissements sont manqués après une compression
forte. La limite de compression entre donc dans le contrat d’entrée au lieu de
disparaître dans la moyenne.

## 4. Workflow en shadow mode

Pendant quatre semaines, les éditeurs terminent le travail normal avant de voir
la proposition. Ils consignent acceptation, correction, information visible
manquée, invention, exception de droits, décision d’incohérence, temps de revue
et texte final. Le catalogue ne reçoit que le contenu approuvé par l’éditeur.

Un défaut de droits, une certification ou sécurité inventée, une omission
critique, une incohérence provoquée non signalée ou une perte de provenance
arrête le workflow. Nouvelle modalité, image générée, visage ou média client
exigent une nouvelle gate juridique et de risque.

## 5. Décision

**Décision : autoriser 60 lots en shadow mode dans le périmètre produit défini.**

Le jeu figé permet une observation, jamais la publication automatique. Toute
variation de temps doit être accompagnée du taux de correction et de la qualité
d’accessibilité. Un brouillon plus rapide qui déplace le travail vers la correction
ne passe pas la gate métier.

## 6. Limites de transfert et sources

Les chiffres synthétiques ne se généralisent pas aux personnes, images médicales,
preuves d’assurance, biométrie, vidéo ou voix. Ces usages exigent d’autres droits,
scénarios de dommage et contrats d’évaluation.

La provenance et la transparence suivent
[NIST AI 100-4](https://airc.nist.gov/technical-reports/),
[C2PA 2.2](https://spec.c2pa.org/specifications/specifications/2.2/index.html),
la déclaration des autorités sur les
[images générées par IA](https://www.edoeb.admin.ch/en/joint-statement-on-ai-generated-images)
et le [guide des modes d’usage](../../docs/ai-use-patterns.fr.md).

## 7. Dossier de preuves

Conserver l’autorité d’usage, les hash, transformations, jeu figé, attributs
attendus, grille de texte alternatif, revue d’accessibilité, tests de provenance,
corrections, exclusions, incidents et décision signée.
