# Synthetic non-agentic case: Weekly demand forecast for spare parts

> **Fictional example.** The company, products, history, backtest, and decision
> are synthetic. The numbers illustrate a protocol, not a forecast of business
> value or model performance.

> **Dominant pattern: prediction. Level: A0.** The model produces a weekly
> forecast and uncertainty interval. A planner remains solely responsible for
> purchase quantities and supplier orders. The model cannot call a tool or act.

## 1. Starting point

**Léman Pièces SA** is a fictional 18-person distributor serving repair shops in
Switzerland and neighbouring EU regions. A planner forecasts weekly demand for
320 spare-part references. Promotions, seasonality, product substitutions, and
long supplier lead times make the current spreadsheet baseline uneven.

The planning snapshot covers a synthetic 52-week holdout period:

| Measure | Current planning baseline |
|---|---:|
| Weighted absolute percentage error | 31% |
| Mean signed bias | +8%, over-forecast |
| Lines unavailable when requested | 8.2% |
| Inventory older than 180 days | CHF 184,000 |

The target is not automatic purchasing. It is: **provide a reproducible weekly
forecast with uncertainty and clear abstention for a human planner**.

## 2. System profile and data boundary

| Dimension | Pilot decision |
|---|---|
| Interaction | Weekly batch report |
| Knowledge | Approved sales, stock, lead-time, and promotion history |
| Output | Forecast, interval, data-quality flag, and segment label |
| Model | Conventional forecasting model, not a language model |
| Risk and autonomy | R1, A0 |
| External effect | None; exports cannot create orders |
| Jurisdiction route | CH and EU data-location review; no personal data intended |

Customer identity, employee performance, free-text notes, and protected
attributes are excluded. Product references are segmented before evaluation:
stable, seasonal, intermittent, new, and substitution-sensitive.

The report cannot recommend suppliers, change safety stock, write to the ERP,
or hide a low-confidence forecast. New products with insufficient history must
use the documented manual rule.

## 3. Temporal evaluation

Random train-test splitting is prohibited because it would leak future patterns.
The team uses rolling-origin backtests and freezes the last 26 weeks as the gate
period. Metrics are reported overall and for every product segment.

| Metric | Acceptance | Stop |
|---|---:|---:|
| Overall WAPE | at most 25% | above 29% |
| Signed bias | between -5% and +5% | outside -10% to +10% |
| 80% interval empirical coverage | 75% to 90% | below 65% |
| Segment worse than baseline by more than 10% | 0 | at least 1 critical segment |
| Missing-data case shown without warning | 0 | at least 1 |

### Synthetic backtest result

| Segment | Baseline WAPE | Model WAPE | Decision |
|---|---:|---:|---|
| Stable | 24% | 18% | pass |
| Seasonal | 36% | 24% | pass |
| Intermittent | 43% | 39% | improvement, still weak |
| New products | 48% | 52% | fail; manual rule required |
| All eligible references | 31% | 23.8% | pass |

Overall signed bias is +3.1% and interval coverage is 82%. The model is not
accepted for new products, and the apparent overall improvement cannot erase
that segment failure.

## 4. Shadow pilot

For eight weeks, the planner receives the report only after freezing the normal
spreadsheet forecast. The comparison records both forecasts, uncertainty,
manual override reason, order actually chosen by the planner, later demand,
stockout, excess inventory, and any data-quality incident.

No purchase order is generated. The business gate is evaluated only after the
demand outcome becomes observable. A lower backtest error alone does not prove
better availability, cash flow, or service.

## 5. Decision

**Decision: authorize shadow evaluation for eligible established products.**

New products stay on the manual rule. Promotion, substitution, stock, lead-time,
or product-master changes trigger data-quality review. Material drift, interval
undercoverage, a critical segment regression, or an unexplained data gap pauses
the report.

## 6. Transfer limits and source anchors

The figures are synthetic. They do not predict another product mix, demand
regime, horizon, or supply chain. The case intentionally uses a conventional
predictive model to show that AI adoption is not limited to generative systems.

The evaluation profile follows the
[OECD AI system classification](https://www.oecd.org/en/publications/oecd-framework-for-the-classification-of-ai-systems_cb6d9eca-en.html),
the predictive-system attack and failure taxonomy in
[NIST AI 100-2e2025](https://csrc.nist.gov/pubs/ai/100/2/e2025/final), and the
[AI use-pattern guide](../../docs/ai-use-patterns.md).

## 7. Evidence pack

Retain the data dictionary, temporal split, feature versions, excluded products,
segment prevalence, frozen forecasts, intervals, overrides, outcome ledger,
drift report, manual fallback, and signed scope decision.
