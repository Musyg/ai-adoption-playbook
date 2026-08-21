# Local project dossier

The implementation workbench saves a working project dossier in the current
browser. It can also export and import the same dossier as JSON. No server is
needed and the playbook does not transmit the answers.

## What the dossier contains

- the selected organization, use pattern, jurisdiction, integration level,
  autonomy, and risk orientation;
- the current lifecycle phase and the answers recorded across phases 0 to 11;
- the conditioned security controls and the controls matched by the crosswalk;
- the phases whose minimum fields are complete;
- an editable AI system register, risk and impact assessment, evaluation plan,
  and implementation checklist;
- an optional change review with its reference snapshot, changed decisions,
  response, owner, due date, note, and evidence reference;
- timestamps, the playbook version, and the dossier schema version.

## Connected records

Linked fields follow the corresponding lifecycle answer until they are edited
inside a record. An edited field becomes a project decision and no longer
changes silently. It can be reset to its linked value at any time.

The implementation checklist combines three groups without displaying them all
at once: lifecycle gates, conditioned security controls, and controls matched
by the crosswalk. Each row can record a status, owner, due date, and stable
evidence reference.

## Version comparison and reassessment

Use an earlier export with the same dossier ID as the reference version. The
comparison does not replace the current project. It compares decision-relevant
context, lifecycle answers, connected records, security controls, matched
controls, and checklist work inside the browser.

Each difference is shown separately and receives one suggested response:
review the record, reassess affected evidence, or reopen an affected gate. The
suggestion is not an automatic release or legal decision. A person records the
project response, owner, due date, note, and evidence reference. If the current
value changes again, the previous response is reset to pending because it no
longer applies to the same before-and-after pair.

The exported dossier includes the reference snapshot and review decisions so
another authorized person can reconstruct the comparison. This also duplicates
the reference working values inside the JSON file, so the same no-secrets and
no-raw-evidence boundary applies to both versions.

## Safe use

Treat the file as a working draft. Do not enter raw client evidence, secrets,
credentials, or identifying personal data. Browser storage is convenient, but
it is not an authorized evidence repository. Keep controlled evidence in an
approved private system and reference it by a stable identifier or hash.

On a shared device, export the dossier to an approved location and use **Start
a new dossier** to remove the browser copy.

## Compatibility and validation

The current experimental schema is `0.3.0`. Valid `0.1.0` dossiers are migrated
locally by adding empty connected records and an empty change review. Valid
`0.2.0` dossiers keep their connected records and receive an empty change
review. The migration is additive, records the source schema when a migrated
file becomes a comparison reference, and never overwrites the imported file.

Newer or unknown schema versions are rejected rather than guessed. Other
imports are accepted only when the playbook version, context values, phases,
safety boundary, connected records, and change-review contract match the
current implementation. An incompatible file leaves the current work
unchanged.

The machine-readable contract is available in
[`site/public/data/project-dossier.schema.json`](../site/public/data/project-dossier.schema.json).
The supported experimental migration routes are now explicit, but the format
is not frozen as a stable 1.0 contract. Field usability testing and the final
compatibility freeze remain future work.
