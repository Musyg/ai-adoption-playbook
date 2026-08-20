# AI use patterns

An integration level does not describe an AI system completely. A copilot, a
retrieval assistant, a classifier, and a public chatbot may all operate at A1,
while requiring different data, evaluations, security tests, transparency, and
human controls.

Classify every use case on the axes below before selecting a product or quoting
an expected gain. A system can combine several patterns. Evaluate each component
and the complete workflow.

## Axis 1: task performed by AI

| Pattern | What the AI does | Minimum evaluation focus | Typical additional risks |
|---|---|---|---|
| Generation | Produces text, code, images, audio, or another new output | accepted quality, factual and source fidelity, severe content errors, human correction | confabulation, intellectual-property or privacy leakage, unsafe output handling |
| Retrieval | Finds and synthesizes information from an authorized corpus | retrieval coverage, source validity, groundedness, citation accuracy, freshness | poisoned documents, cross-user or cross-tenant leakage, stale indexes, indirect injection |
| Extraction / classification | Extracts fields, labels, routes, or detects a known category | per-class precision and recall, critical false positives and negatives, abstention, subgroup results | hidden class imbalance, label drift, invalid downstream assumptions |
| Prediction / recommendation | Estimates a future outcome, score, rank, or recommended action | calibration, decision threshold, utility, subgroup performance, drift | automation bias, proxy discrimination, self-reinforcing feedback loops |
| Conversation | Maintains a multi-turn interaction with an internal or external user | task completion, disclosure, handoff, memory consistency, retention, unsafe-advice rate | impersonation, overreliance, concealed data reuse, manipulation over several turns |
| Multimodal | Interprets or generates image, audio, video, speech, or sensor content | modality-specific quality, consent, provenance, robustness, accessibility | deepfakes, voice or identity misuse, hidden multimodal instructions, metadata loss |
| Agentic action | Plans steps, calls tools, changes systems, or coordinates agents | plan and tool correctness, authorization, effect read-back, idempotency, rollback, stopping | goal hijack, privilege abuse, code execution, memory poisoning, cascading failure |

Code generation is a generation pattern until code is executed or changes a
repository, build, service, or dependency. It then also becomes an agentic
action and must be tested as a software supply-chain change.

## Axis 2: interaction pattern

- **Embedded feature:** AI is hidden inside an existing product or decision
  flow. Inventory it even when the user does not open a separate AI tool.
- **Batch or offline processing:** cases are processed in groups. Test scale,
  duplicate handling, partial failure, reconciliation, and delayed detection.
- **Copilot:** a person starts and completes every cycle.
- **User-facing conversation:** an external or internal user interacts directly
  with the system. Test disclosure, accessibility, handoff, and retention.
- **Background agent:** the system advances work between human checkpoints.

## Axis 3: knowledge and state

Record whether the system relies on the base model only, authorized retrieval,
live external tools, session or persistent memory, or fine-tuning and adapters.
Version prompts, models, retrieval corpora, indexes, tools, memory policy,
thresholds, and fine-tuning data separately. A change to any of them can reopen
the evaluation gate.

## Axis 4: deployment

Distinguish supplier SaaS, direct API, self-hosted or open-weight deployment,
and on-device or edge use. The choice changes data location, operational
responsibility, patching, model access, incident handling, and exit options. It
does not by itself reduce risk.

## Axis 5: effect and autonomy

State whether the system informs, recommends, decides, or acts. Then apply the
[risk and autonomy classification](risk-autonomy.md). Task type and autonomy
must remain separate: a high-impact recommender can be A1, while a low-impact
file-renaming agent can be A3.

## Evaluation profile by pattern

Use the common outcome, severe-error, latency, cost, and human-correction
measures in the [evaluation plan](../templates/evaluation-plan.md), then add the
pattern-specific measures below.

| Pattern | Add before the pilot |
|---|---|
| Generation | accepted-output rubric, factual or source checks, prohibited-content tests, reproducibility limits |
| Retrieval | retrieval coverage, source access controls, groundedness, citation validity, corpus freshness, poisoning cases |
| Extraction / classification | confusion matrix, critical class thresholds, abstention, class prevalence, subgroup results, drift |
| Prediction / recommendation | calibration, threshold utility, false-positive and false-negative costs, subgroup performance, feedback-loop analysis |
| Conversation | disclosure comprehension, end-to-end task success, human handoff, multi-turn consistency, retention and deletion, abuse tests |
| Multimodal | consent and rights, modality rubric, provenance and labelling, transformation robustness, accessible alternative |
| Agentic action | step-level plan and tool tests, permissions, effect read-back, idempotency, rollback, limits, hostile tool and memory inputs |

## Switzerland and European Union routing

This is operational orientation, not legal advice. Record the exact role,
jurisdiction, sector, affected people, and applicable text in the case file.

### Switzerland

- The Federal Act on Data Protection applies to AI-supported processing of
  personal data. Document purpose, functionality, data sources, reuse,
  recipients, processing locations, retention, and the means to exercise rights.
- Where an automated individual decision has legal effects or significantly
  affects a person, verify the duty to inform, the opportunity to state a point
  of view, and the right to request review by a natural person under Article 21
  FADP, including the exact exceptions.
- For language models that communicate directly with users, document how users
  learn that they are corresponding with a machine and whether their inputs are
  reused for improvement or other purposes.
- Clearly identify synthetic or manipulated content involving identifiable
  faces, images, or voices, and assess privacy, personality, criminal, and
  intellectual-property law as applicable.
- Perform a data-protection impact assessment when the planned processing is
  likely to create a high risk.

Switzerland has no overarching AI Act in force as of 20 August 2026. The federal
bill planned for consultation by the end of 2026 is future work, not current law.

### European Union

- Article 50 of the AI Act applies from 2 August 2026. Providers of systems that
  interact directly with people must design them so that people are informed of
  the AI interaction, subject to the text's scope and exceptions.
- Providers of systems generating or manipulating synthetic content must assess
  the machine-readable marking obligation. Deployers must separately assess
  visible disclosure for deepfakes and certain public-interest text, and notice
  for emotion-recognition or biometric-categorisation systems.
- Separately qualify prohibited practices, high-risk use, general-purpose-model
  duties, data protection, employment, consumer, copyright, and sector rules.
- Record whether the organization is a provider, deployer, importer,
  distributor, product manufacturer, or another actor. The same technical
  system can create different duties for each role.

When both jurisdictions are in scope, apply both analyses. Do not assume that
meeting one jurisdiction's transparency rule satisfies the other.

## Selection rule

1. Name every task pattern in the workflow.
2. Record interaction, knowledge, deployment, and effect.
3. Apply R0-R3 impact and A0-A4 autonomy separately.
4. Activate the Switzerland, EU, and sector gates that actually apply.
5. Build the evaluation and threat model from the combined profile.
6. Choose the least complex system that passes the complete gate.
