# Critical-infrastructure extension

> Verified orientation snapshot: **19 August 2026**. Apply the operator’s sector, safety, cybersecurity, resilience, and reporting duties in addition to this overlay.

For an essential service, the primary outcome is safe continuity. A system that optimizes normal operations but creates an untested command path, shared failure mode, or unrecoverable dependency is not a successful adoption.

## Place the system relative to control

| Zone | Example | Default boundary |
|---|---|---|
| Knowledge support | Search procedures or summarize maintenance records | A0–A1 on controlled sources |
| Operational advisory | Detect anomalies or recommend a response | A1; operator verifies live state and authority |
| Workflow action | Open a ticket, notify, or prepare a change | A2 with destination validation and approval |
| Control action | Change plant, traffic, water, energy, or safety state | Treat as R3/A3; formal safety and engineering authorization |
| Self-extending control | Acquire permissions, rewrite policy, or coordinate unrestricted actions | A4 disabled by default |

## Critical-infrastructure gates

### C0 — Essential-service boundary

- identify the essential service, critical functions, maximum tolerable disruption, and dependent sectors;
- name operational, safety, cyber, incident, and executive authorities;
- map whether the AI is outside, adjacent to, or inside an operational-technology or safety boundary;
- record every physical, digital, and human effect it can initiate.

**Stop:** the command path, safety authority, or service-restoration priority is ambiguous.

### C1 — Hazard and dependency case

- model unsafe command, missed alarm, false alarm, stale state, loss of view, common-mode failure, cascade, and malicious instruction;
- map dependencies on cloud, telecoms, identity, time, geolocation, models, data feeds, suppliers, and other essential services;
- define fail-safe and fail-operational behavior for each loss;
- ensure the AI cannot silently weaken an existing interlock or protection layer.

### C2 — Segregated architecture

- keep advisory, business IT, operational technology, and safety systems in explicit trust zones;
- use read-only paths and one-way transfer wherever the task permits;
- enforce allowlisted commands, parameters, destinations, rate, duration, and maintenance windows;
- require independent deterministic validation and authenticated human approval before a control effect;
- prevent model output from becoming executable control syntax without a constrained intermediary.

### C3 — Simulation and independent testing

- validate in a representative simulator, digital twin, test bench, or isolated environment;
- test corrupted telemetry, conflicting sensors, network partition, time drift, unavailable supplier, compromised account, injection, and operator overload;
- measure detection, containment, safe-state transition, restoration, reconciliation, and evidence preservation;
- obtain independent safety/security review for any path that can affect essential-service state.

### C4 — Shadow and advisory operation

- start with replay, shadow, or advisory use without command authority;
- compare against real operator decisions across normal, degraded, emergency, and rare conditions;
- monitor alert burden, automation bias, handover quality, and time to safe action;
- grant no power beyond the exact scenarios and parameters tested.

### C5 — Bounded production and recovery

- use staged release, two-person control where appropriate, kill paths independent of the AI, and tested manual operation;
- monitor model/data drift, unauthorized commands, suppressed alarms, latency, dependency health, and operator overrides;
- rehearse supplier loss, network isolation, rollback, black start or equivalent restoration, and evidence recovery;
- connect incidents to all applicable sector and cyber-reporting routes. In Switzerland, covered operators must account for the NCSC cyberattack-reporting process and its 24-hour discovery window.

## Minimum evidence pack

1. essential-service and authority map;
2. hazard, dependency, and trust-boundary model;
3. command allowlist and deterministic interlocks;
4. simulator/test-bench results for normal and degraded states;
5. independent safety/security review and bounded release record;
6. manual-operation proof, recovery exercise, and reporting routes.

## Transfer boundary

Evidence from a lab, another site, a different controller, network, load profile, season, supplier, or operator team is not production evidence. Revalidate the complete sociotechnical configuration and its cross-sector dependencies.

See the dated [primary-source register](../../references/sources.md), the [security guide](../../docs/security.md), and the [incident runbook](../../templates/incident-runbook.md).
