# Référentiel de contrôles lisible par machine

Le fichier canonique
[`control-crosswalk.v1.json`](../site/public/data/control-crosswalk.v1.json)
relie les contrôles du playbook à cinq dimensions vérifiables :

1. un identifiant stable `AAP-<FAMILLE>-<NUMÉRO>` ;
2. l’applicabilité par type d’organisation, niveau de risque, autonomie et
   condition de déclenchement ;
3. les phases 0–11 et gates G1–G5 ou P0–P5 concernés ;
4. les types de preuves attendus, eux-mêmes identifiés par `EV-*` ;
5. des sources datées et versionnées avec la nature de leur relation.

Le [schéma JSON](../site/public/data/control-crosswalk.schema.json) fixe le
contrat de version `1.0.0`. La validation du dépôt bloque notamment les doublons,
les références inconnues, les chemins de mise en œuvre absents et les axes hors
contrat.

## Lecture correcte

La table est un **socle interne adaptable**, pas une liste de conformité. Une
relation `direct` signifie que le contrôle provient directement de la méthode du
playbook. `supports` signale une orientation publique cohérente. `contextual`
indique une proximité thématique qui doit être vérifiée dans la source complète.

Une référence à une norme ISO ne constitue jamais une correspondance article par
article : le dépôt ne reproduit pas le texte propriétaire. De même, une
orientation juridique doit être requalifiée selon la juridiction, le secteur, le
rôle et le cas d’usage réels.

## Exemple de requête PowerShell

```powershell
$catalog = Get-Content site/public/data/control-crosswalk.v1.json -Raw |
  ConvertFrom-Json

$catalog.controls |
  Where-Object {
    $_.applicability.organization_types -contains "public" -and
    $_.applicability.risk_levels -contains "R3" -and
    $_.applicability.autonomy_levels -contains "A2"
  } |
  Select-Object control_id, family, priority, gates, evidence_ids
```

Les conditions comme `external_provider` ou `material_human_impact` doivent
ensuite être qualifiées par le responsable du cas. Un filtre technique ne prend
pas la décision à sa place.

## Règle de changement

- un libellé peut être clarifié sans changer l’identifiant si l’objectif reste
  identique ;
- un changement de sens crée un nouvel identifiant et conserve l’ancien dans
  l’historique Git ;
- toute modification de structure incrémente `schema_version` selon SemVer ;
- toute publication du catalogue incrémente `catalog_version` et met à jour les
  dates des sources effectivement revérifiées.
