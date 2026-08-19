# Finance extension

> Verified orientation snapshot: **19 August 2026**. The applicable duties depend on the entity, activity, product, customer, jurisdiction, and materiality. Obtain qualified regulatory advice.

In finance, AI risk is not limited to model accuracy. Governance, conduct, explainability, data quality, third-party concentration, operational resilience, and the ability to justify a customer outcome are part of the system.

## Classify materiality before the model

| Use | Example | Default boundary |
|---|---|---|
| Internal assistance | Summarize public research or draft internal text | A0–A1 with source verification and information barriers |
| Operations support | Extract documents, reconcile, route, or prepare a case | A1–A2 with approval and complete trace |
| Regulated control | AML, fraud, market surveillance, capital, or compliance support | Material-model review; authority and fallback remain explicit |
| Customer outcome | Credit, pricing, suitability, claims, or access to a service | R3; legal, conduct, fairness, and recourse review |
| Autonomous transaction | Trade, move funds, bind cover, or change an account | A3 only within formally approved limits; A4 disabled by default |

## Finance gates

### F0 — Materiality and regulated purpose

- identify the legal entity, regulated activity, customer type, product, and jurisdictions;
- record whether the system supports compliance, risk, accounting, advice, credit, insurance, trading, payments, or customer service;
- assess materiality using financial impact, affected people, critical functions, autonomy, complexity, and consequences of failure;
- state the final human or corporate authority.

**Stop:** the institution cannot inventory the use, explain its purpose, or assign accountable first- and second-line owners.

### F1 — Inventory, data, and conduct

- register internal and purchased AI, including embedded and conventional models with equivalent risk;
- map data quality, provenance, representativeness, secrecy, retention, and information barriers;
- identify conflicts, market-conduct, discrimination, manipulation, unsuitable-advice, and customer-communication risks;
- define notification, explanation, correction, complaint, and human-recourse paths.

### F2 — Model and third-party control

- document assumptions, limitations, benchmarks, explainability, version, and change policy;
- test supplier access, concentration, sub-outsourcing, location, exit, substitution, and failure modes;
- contract for audit evidence, incident cooperation, material-change notice, export, and deletion;
- keep a tested operating mode that does not depend on the AI or one provider.

### F3 — Independent validation

- preregister performance, stability, robustness, bias, stress, and severe-error thresholds;
- use out-of-sample, sensitivity, adversarial, and simpler-benchmark comparisons as appropriate;
- separate development ownership from qualified independent review for material applications;
- document how overrides and user corrections feed monitoring without silently changing the approved model.

### F4 — Bounded pilot and release

- run shadow mode with the frozen system and full denominator;
- limit customer, product, amount, market, channel, permissions, and duration;
- require dual control or explicit approval for material or irreversible effects;
- release only when value, model performance, conduct, security, and resilience pass separately.

### F5 — Monitoring and resilience

- monitor data and concept drift, outcomes, overrides, complaints, incidents, losses, latency, and supplier changes;
- connect AI controls to operational-risk, cyber, outsourcing, business-continuity, and regulatory-reporting processes;
- test degraded modes, provider loss, rollback, and reconciled recovery;
- trigger independent reassessment after a material change or unexplained outcome shift.

## Minimum evidence pack

1. inventory entry, materiality classification, and accountable owners;
2. data lineage, conduct, and customer-impact assessment;
3. model file, supplier due diligence, and exit plan;
4. independent validation and severe-error tests;
5. bounded pilot ledger with approvals and reconciled effects;
6. monitoring, complaint, resilience, and regulatory-reporting routes.

## Transfer boundary

Performance in one portfolio, market regime, language, customer group, legal entity, or distribution channel does not transfer automatically. Revalidate material changes and distinguish model performance from customer outcome, prudential effect, and operational resilience.

See the dated [primary-source register](../../references/sources.md) and the [fundamental-rights impact assessment](../../templates/fundamental-rights-impact-assessment.md).
