# Synthetic non-agentic case: Read-only RAG assistant for field procedures

> **Fictional example.** The organization, corpus, volumes, test results, and
> decisions are synthetic. They demonstrate an evaluation contract and are not
> evidence of product performance.

> **Dominant pattern: retrieval. Secondary pattern: generation. Level: A1.**
> The system searches an authorized corpus and drafts a cited answer. It has no
> tool that can write, send, schedule, approve, or change an operational system.

## 1. Starting point

**Helvetia Facilities Sàrl** is a fictional 42-person maintenance company with
teams in French- and German-speaking Switzerland. Technicians ask about safety
checks, equipment procedures, warranty limits, and escalation contacts. The
controlled corpus contains 680 approved procedures, manuals, and service notes.

A review of 60 synthetic historical questions establishes the planning baseline:

| Measure | Baseline |
|---|---:|
| Median active search time | 12 min |
| Correct current source found | 46/60, or 76.7% |
| Question escalated because the source was unclear | 9/60 |
| Answer copied from an obsolete document | 5/60 |

The target is narrow: **retrieve current authorized passages and prepare a cited
answer for review**. The system does not interpret regulation, diagnose a fault,
or authorize work.

## 2. System profile and boundaries

| Dimension | Pilot decision |
|---|---|
| Interaction | Internal search interface |
| Knowledge | Versioned retrieval corpus only |
| Deployment | Supplier API with a company-controlled index |
| Output | Answer draft, citations, confidence reason, and abstention |
| Risk and autonomy | R1, A1 |
| Jurisdiction route | Switzerland; EU route added if EU staff or data enter scope |

The corpus owner approves every document, effective date, access group, and
superseded version. Search is filtered by the signed-in user's role before any
passage reaches the model. Conversation memory is disabled.

Prohibited capabilities include email or ticket access, work-order creation,
equipment control, automatic source ingestion, answers without resolvable
citations, and use of documents outside the user's access group.

## 3. Frozen evaluation

The team creates 80 frozen questions after configuration. They include 20
access-boundary cases, 16 superseded procedures, 10 questions with no supported
answer, and 12 documents containing instructions that attempt to redirect the
model.

| Metric | Acceptance | Stop |
|---|---:|---:|
| Correct source present in top five results | at least 95% | below 90% |
| Answer fully supported by cited passages | at least 95% | below 90% |
| Current version selected when versions conflict | 100% | below 100% |
| Unsupported question correctly refused | at least 90% | below 80% |
| Cross-role document disclosure | 0 | at least 1 |
| Critical unsafe instruction presented as procedure | 0 | at least 1 |

### Synthetic frozen-set result

| Measure | Result | Gate |
|---|---:|---|
| Top-five source retrieval | 78/80, or 97.5% | pass |
| Fully supported answer | 76/80, or 95% | pass at threshold |
| Current version in conflict cases | 16/16 | pass |
| Correct refusal | 9/10 | pass at threshold |
| Cross-role disclosure | 0/20 | pass |
| Critical unsafe instruction | 0/12 | pass |

Four answers cite the right document but overstate what the passage permits.
They remain failures in the answer metric even though retrieval succeeded. This
keeps retrieval quality separate from generation quality.

## 4. Pilot design

The first two weeks are shadow-only. A technician writes the real answer using
the normal process before an evaluator reveals the system proposal. A later A1
stage may show the proposal, but the technician must open every cited passage
and explicitly accept, correct, escalate, or reject the draft.

The pilot records the full question denominator, access group, corpus snapshot,
retrieved document identifiers, cited passages, answer, abstention, correction,
review time, and final human outcome. Raw personal data is not copied into the
public evidence pack.

## 5. Decision

**Decision: authorize a 30-case shadow pilot, not production.**

The frozen set supports a bounded observation, but it does not establish time
savings or safe use on rare procedures. Any access leak, obsolete critical
procedure, unsupported safety instruction, or unresolved citation stops the
pilot. A model, prompt, index, corpus, permission, or chunking change reopens the
affected tests.

## 6. Transfer limits and source anchors

No measured business gain is claimed. Results are synthetic and cannot be
transferred to another corpus, language, supplier, role model, or safety domain.

The control design follows the retrieval profile in the
[AI use-pattern guide](../../docs/ai-use-patterns.md), the indirect-injection and
data-boundary risks in [OWASP GenAI guidance](https://genai.owasp.org/llm-top-10/),
and the evaluation and governance structure of the
[NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework).

## 7. Evidence pack

Retain the corpus manifest and hashes, supersession rules, role matrix, frozen
questions, expected sources, adversarial documents, configuration versions,
result ledger, corrections, stop events, and signed gate decision.
