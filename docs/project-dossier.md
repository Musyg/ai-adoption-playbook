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
- timestamps, the playbook version, and the dossier schema version.

## Connected records

Linked fields follow the corresponding lifecycle answer until they are edited
inside a record. An edited field becomes a project decision and no longer
changes silently. It can be reset to its linked value at any time.

The implementation checklist combines three groups without displaying them all
at once: lifecycle gates, conditioned security controls, and controls matched
by the crosswalk. Each row can record a status, owner, due date, and stable
evidence reference.

## Safe use

Treat the file as a working draft. Do not enter raw client evidence, secrets,
credentials, or identifying personal data. Browser storage is convenient, but
it is not an authorized evidence repository. Keep controlled evidence in an
approved private system and reference it by a stable identifier or hash.

On a shared device, export the dossier to an approved location and use **Start
a new dossier** to remove the browser copy.

## Compatibility and validation

The current experimental schema is `0.2.0`. Valid `0.1.0` dossiers are migrated
locally by adding empty connected records, then the guide materializes their
linked values. Other imports are accepted only when the
schema version, playbook version, context values, phases, and safety boundary
match the current implementation. An incompatible file leaves the current
work unchanged.

The machine-readable contract is available in
[`site/public/data/project-dossier.schema.json`](../site/public/data/project-dossier.schema.json).
Version comparison, change-impact decisions, and stable migration policy remain
future 0.5 work. The format is not frozen as a stable 1.0 contract.
