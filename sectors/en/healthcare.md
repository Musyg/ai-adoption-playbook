# Healthcare extension

> Verified orientation snapshot: **19 August 2026**. This operational overlay is not medical, legal, regulatory, or conformity-assessment advice.

Healthcare changes the meaning of a “good result.” Speed matters only after clinical safety, intended purpose, population coverage, professional accountability, and continuity of care are protected.

## Start by naming the role

| Role | Example | Default boundary |
|---|---|---|
| Administrative support | Summarize a non-clinical policy or prepare an appointment draft | A0–A1; no clinical inference |
| Clinical support | Retrieve evidence or draft a note for a qualified professional | A1; professional verifies source, patient, and conclusion |
| Patient-facing support | Explain approved information or route a request | A1–A2 only with escalation and accessible non-AI channels |
| Clinical decision or triage | Diagnose, prioritize, recommend treatment, or alter care | Treat as R3; formal clinical, legal, and product qualification before any pilot |
| Medical-device function | Software with an intended medical purpose | Determine applicable medical-device status before architecture or procurement |

Calling a system a “copilot” does not remove a medical intended purpose. Qualification follows what the system is intended and actually used to do.

## Healthcare gates

### H0 — Intended purpose and authority

- state the clinical or administrative purpose, users, patients, setting, and exclusions;
- identify who is professionally accountable for every downstream decision;
- determine whether the system or software may be a medical device or part of one;
- identify applicable Swiss, EU, cantonal, professional, research, and institutional rules;
- preserve a safe non-AI path.

**Stop:** the purpose is ambiguous, the accountable professional is absent, or experimental use is being presented as routine care.

### H1 — Population, data, and harm model

- map source systems, consent or other authority, secrecy, retention, transfers, and secondary use;
- define the intended population and clinically meaningful subgroups;
- model delayed care, false reassurance, missed escalation, over-triage, bias, disclosure, and automation bias;
- separate evidence generated for research, product validation, and local deployment.

### H2 — Product and supplier evidence

- document product qualification, classification, version, claims, and change policy;
- require evidence for data provenance, clinical evaluation, cybersecurity, human factors, and post-market monitoring where applicable;
- verify who performs regulatory, quality, vigilance, and incident duties;
- prohibit silent model or knowledge-base changes in the evaluated configuration.

### H3 — Clinical evaluation

- preregister endpoints, reference standard, sample, sites, subgroups, missing-data treatment, and severe-error limits;
- compare against current care, not an idealized clinician;
- test workflow fit, alert burden, abstention, uncertainty communication, and override behavior;
- obtain independent clinical and methodological review for material use.

An aggregate accuracy score cannot release a system that misses a critical subgroup or creates an unacceptable patient-safety event.

### H4 — Shadow and supervised pilot

- begin with retrospective or prospective shadow use that does not alter care;
- freeze the evaluated system and record every recommendation, correction, escalation, and downstream effect;
- train users on limitations, uncertainty, escalation, and reporting;
- move to supervised influence only after H0–H3 pass.

### H5 — Controlled operation

- monitor clinical outcomes, near misses, subgroup drift, overrides, latency, and unavailable-system behavior;
- connect AI incidents to clinical safety, data-protection, cybersecurity, vigilance, and continuity procedures;
- rehearse withdrawal and restoration of the safe clinical process;
- reassess after any material change of model, data, intended purpose, interface, population, or integration.

## Minimum evidence pack

1. intended-purpose and product-qualification record;
2. clinical owner, escalation map, and safe-care fallback;
3. data lineage and patient/population impact assessment;
4. locked evaluation protocol and results by subgroup;
5. human-factors, cybersecurity, and workflow tests;
6. signed release decision, monitoring thresholds, and incident routes.

## Transfer boundary

Evidence does not automatically transfer across hospitals, specialties, languages, prevalence, equipment, workflows, or patient populations. Revalidate every material difference and distinguish product evidence from proof that the local care pathway is safe.

See the dated [primary-source register](../../references/sources.md), the [accessibility assessment](../../templates/accessibility-assessment.md), and the [fundamental-rights impact assessment](../../templates/fundamental-rights-impact-assessment.md).
