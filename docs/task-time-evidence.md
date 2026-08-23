# Task-time evidence and transfer

This guide explains how to estimate human time without turning one study, one
vendor case, or one organization into a universal productivity rate.

The unit of comparison is a bounded task or workflow with a countable output and
an explicit acceptance threshold. Organization type is a context overlay for
law, governance, data, procurement, scale, and controls. It is not the benchmark
category.

## Keep work mode, architecture, and authority separate

| Work mode | What moves | Human role |
|---|---|---|
| Copilot | One assisted step | Operates every cycle and performs the external actions |
| Bounded automation | A defined share of an eligible process | Approves specified effects and handles exceptions |
| Strong automation | Most eligible work from start to finish | Sets goals and limits, reviews results, and handles exceptions |

Multiple agents or large scale do not automatically make a system A4. Autonomy
is determined by the effects the system may produce without a person, not by
the reputation or size of the organization using it.

The registry uses `work_mode` for the work-sharing choice above. A model,
fixed workflow, single agent, or orchestrated team is recorded separately, as
is the exact A0 to A4 authority level. A study remains transferable when its
task, accepted output, human role, and operating conditions are close enough;
organization type alone neither permits nor prevents transfer.

## Count human time, machine time, and elapsed time separately

For one eligible case:

```text
local human-work floor = preparation + supervision + verification
                         + corrections + expected exception work

net human time with AI = max(source-implied residual human time,
                             local human-work floor)
                         + amortized setup

net human time saved = baseline human time - net human time with AI

annual net human time saved = net human time saved per case
                              * eligible cases per month * 12
```

Expected exception work is the exception rate multiplied by human minutes per
exception. Amortized setup divides one-off human setup hours across the selected
number of months and eligible cases.

The source-implied residual is the human time that remains after applying one
measured low, central, or high reduction to the local baseline. Taking the
greater value prevents the calculator from hiding declared review work. It also
avoids adding the source residual and local work together, which would count
human time twice. Setup remains additive because the published task reductions
do not include the user’s local one-off implementation.

When the eligible share is zero, the net range is unavailable. There is no
eligible case over which to allocate setup, so the calculator reports `n/a`
instead of silently dropping the fixed cost. The copied pilot brief records the
task profile, operating mode, output state, operator experience, human-work
components, exception assumption, setup hours, amortization horizon, evidence
identifier, and net method needed to reproduce the estimate.

The result may be negative. A slowdown is evidence and must not be replaced by
zero. Machine runtime never counts as human time saved. A turnaround moving from
three days to one day is an elapsed-time change unless human active minutes were
also measured.

Quality, accepted throughput, straight-through completion, incidents, and the
downstream outcome remain separate measures.

## Evidence grades

| Grade | Measurement basis | Default quantitative use |
|---|---|---|
| A | Controlled or paired task-time observation | Transfer only with a comparable task contract |
| B | Field telemetry or objective operational measure | Transfer only when it measures human time with a denominator |
| C | Self-reported time or survey estimate | Context for pilot design |
| D | Internal or supplier case without complete independent validation | Mechanism and implementation context |
| E | Model-estimated, synthetic, or planning-only value | Named hypothesis only |

The grade describes how the value was measured, not whether it is favorable.
The machine-readable registry additionally blocks automatic quantitative use
unless human active time was measured and the record is explicitly admitted for
transfer.

## Transfer states

The calculator compares six parts of the task contract:

1. the target task profile;
2. the work mode;
3. the architecture;
4. the exact A0 to A4 action boundary;
5. the required output state;
6. operator experience.

It returns one of four states:

| State | Meaning |
|---|---|
| Comparable | The source may frame a low, central, and high test range |
| Use with caution | The task matches, but one or more conditions differ. The range remains usable as a starting point and the differences stay visible. |
| Context only | The source informs design but has no transferable human-time ratio |
| Not transferable | The underlying task is too different for a quantitative transfer |

These are minimum gates, not proof of equivalence. Before using a source, also
compare input complexity, output unit, model and tool access, verifiability,
quality threshold, exception rate, operator skill, and consequence of error.

## What the current records demonstrate

| Record | Task | Grade | Published measure | Quantitative use |
|---|---|---:|---|---|
| Noy and Zhang | Professional writing | A | 40% less task time and 18% higher evaluated quality | Comparable writing tasks only |
| BCG jagged frontier | Knowledge analysis inside the tested frontier | A | 22.5% to 27.6% less time across the two AI treatments | Comparable reviewed analysis only |
| GitHub Copilot experiment | Bounded greenfield HTTP server | A | 55.8% less mean completion time, with a wide confidence interval | Comparable bounded implementation only |
| METR early-2025 study | Real issues in mature known repositories | A | 19% longer, with a reported slowdown interval | Comparable mature-repository work only |
| UK office trial | Mixed civil-service workday | C | 26 self-reported minutes saved per day | Context only |
| UK coding-assistant trial | Mixed developer workday | C | 56 self-reported minutes saved per day and 15.8% line acceptance | Context only |
| Customer-support deployment | Issues resolved per agent-hour | B | 14% higher output rate | Capacity context, not task-time transfer |
| Anthropic conversation analysis | Broad conversation-defined tasks | E | Model-estimated task savings concentrated at high values | Context only |
| OpenAI harness project | Agent-first software product | D | Internal estimate of roughly one tenth of manual coding time | Transfer the mechanism, not the percentage |

The registry records the exact source, measurement basis, task contract,
preconditions, and transfer limits. Current frontier-company examples remain
visible because their mechanisms may be useful. Their internal or model-based
figures do not enter the calculator automatically.

## How to use the interactive calculator

1. Choose the closest countable task, not your organization type.
2. Set the output state and operator experience.
3. Read the evidence card and its transfer state.
4. Enter the manual baseline, monthly volume, and eligible share.
5. Open the human-time breakdown and enter preparation, supervision,
   verification, correction, exception, and setup time.
6. Read the unadjusted source range and the resulting net low, central, and high
   range.
7. Replace every planning input with pilot observations before a decision.

Do not add the source percentage or its residual minutes to the local work. The
engine uses the source residual or the local human-work floor, whichever is
greater, then adds amortized setup. The source still asks what happened in a
comparable measured task. The net range shows what remains after the local
controls and implementation effort are made explicit.

## How the 11 worked cases are classified

Every worked-case result remains a grade E planning hypothesis. An external
anchor can explain a mechanism or frame a separate range, but it never upgrades
the synthetic case result.

| Worked case | Task profile | Work mode | Architecture | A | External anchor use |
|---|---|---|---|---:|---|
| Micro-business customer requests | Customer support | Copilot | Tool-assisted workflow | A1 | Output-rate context only |
| SME B2B quotes | Knowledge analysis | Bounded automation | Business agent | A2 | Copilot mechanism context only |
| Nonprofit grant dossiers | Information synthesis | Bounded automation | Business agent | A2 | Analysis context only |
| Public planning dossiers | Information synthesis | Bounded automation | Business agent | A2 | Analysis context only |
| Independent client follow-up | Professional writing | Copilot | One model | A1 | Comparable range may be tested separately |
| Independent follow-up agent | Customer support | Bounded automation | Business agent | A2 | Output-rate context only |
| Orchestrated diagnostic | Strong-automation project | Strong automation | Orchestrated team | A3 | Harness mechanism only |
| Read-only procedure RAG | Information synthesis | Copilot | Tool-assisted workflow | A1 | No admitted time anchor |
| Predictive demand forecast | Predictive decision support | Copilot | One model | A0 | No human-time ratio transferred |
| External customer chatbot | Customer support | Copilot | Tool-assisted workflow | A1 | Staff-support outcome context only |
| Multimodal catalogue review | Multimodal review | Copilot | One model | A1 | No admitted time anchor |

The registry stores the complete rationale and the corresponding example files.
This mapping is based on the task contract, not the organization label.

## Machine-readable contracts

- [Task-time registry](../site/public/data/task-time-evidence.v1.json)
- [Task-time JSON Schema](../site/public/data/task-time-evidence.schema.json)
- [Field-pilot protocol](field-pilot-protocol.md)
- [Public field-evidence review](../references/field-evidence-review-2026.md)

These ranges feed the hypothesis layer of 0.3. A field draft freezes the range,
records the observed whole-workload result, and explains their gap. External
studies do not populate `field-notes/index.json`; only genuine, independently
reviewed and sanitized observations can satisfy its admission rule.
