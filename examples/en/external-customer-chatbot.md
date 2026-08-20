# Synthetic non-agentic case: External customer-information chatbot

> **Fictional example.** The retailer, users, conversation set, results, and
> decision are synthetic. They illustrate control design and do not prove that a
> chatbot improves service.

> **Dominant pattern: conversation. Secondary pattern: retrieval. Level: A1.**
> The chatbot answers from approved public information and transfers to a human.
> It cannot authenticate a customer, access an order, issue a refund, send a
> message, or change any system.

## 1. Starting point

**Alpina Outdoor GmbH** is a fictional Swiss online retailer serving customers
in Switzerland and the European Union. Its team receives about 1,100 questions
per month. Roughly 620 concern store hours, delivery zones, returns, size guides,
and public product manuals. Account, payment, complaint, and warranty cases need
a person.

| Measure | Four-week baseline |
|---|---:|
| Median first response during business hours | 3 h 40 min |
| Routine public-information questions | 620 per month |
| Conversation transferred between employees | 17% |
| Accessible self-service completion | not measured |

The target is: **answer bounded public-information questions or route the person
to a reachable human channel**. Deflection is not the primary success metric.

## 2. Interaction and legal boundary

| Dimension | Pilot decision |
|---|---|
| User-facing status | Clearly identified as AI before the first message |
| Knowledge | Approved public pages with date and locale |
| Languages | French, German, Italian, and English |
| Risk and autonomy | R2, A1 |
| Jurisdictions | Switzerland and European Union |
| Retention | Session transcript minimized and deleted on the approved schedule |

The interface explains that the person is interacting with AI, what data should
not be entered, how messages are used, and how to reach a human. The disclosure
must remain visible on mobile and be understandable with a screen reader.

The Article 50 EU role analysis, Swiss transparency analysis, privacy notice,
retention, provider reuse, processor, transfer, and accessibility decisions are
dated separately. One jurisdiction's notice does not replace the other.

Prohibited topics include personalized medical or safety advice, account status,
payment, refunds, warranty decisions, complaints, legal interpretation, and any
promise about price or delivery. These topics trigger a human handoff.

## 3. Frozen conversation evaluation

The gate set contains 160 scripted conversations, including 40 multi-turn cases,
24 handoff cases, 20 adversarial or abusive cases, 16 unsupported questions, and
language and accessibility slices.

| Metric | Acceptance | Stop |
|---|---:|---:|
| Users recognizing they are interacting with AI | at least 95% | below 90% |
| Fully supported answer on in-scope questions | at least 95% | below 90% |
| Required human handoff offered | 100% | below 100% |
| Handoff channel successfully reached | at least 98% | below 95% |
| Invented policy, price, deadline, or warranty | 0 | at least 1 |
| Critical keyboard or screen-reader blocker | 0 | at least 1 |

### Synthetic frozen-set result

The first interface produces 88% disclosure recognition on a mobile comprehension
check and fails the gate. After the disclosure is rewritten and placed before
the first input, a new frozen usability sample reaches 39/40, or 97.5%.

On the full conversation set, supported answers reach 132/136, or 97.1%; all
24 mandatory handoffs are offered; 23 of 24 handoff links complete successfully;
and no invented price, deadline, or warranty appears. The failed handoff is
treated as a service incident and blocks live use until corrected.

## 4. Pilot design

After the handoff defect is fixed and retested, the first stage runs in shadow:
staff see the customer question, answer normally, and later compare the chatbot
proposal. A limited A1 pilot may then serve only approved public-information
intents during staffed hours.

The ledger preserves every request, locale, eligibility decision, disclosure
version, cited page, answer, refusal, handoff offer, handoff completion, human
correction, complaint, and deletion event. It never reports only the questions
the chatbot chose to answer.

## 5. Decision

**Decision: correct and rerun the handoff gate before any external pilot.**

The answer and disclosure metrics do not override a broken recourse channel.
External use remains prohibited until the exact handoff path passes on desktop,
mobile, keyboard-only navigation, and the supported screen-reader combination.

## 6. Transfer limits and source anchors

The example does not claim a deflection rate, cost saving, or customer outcome.
Its frozen conversations and results are synthetic.

The legal prompts are anchored in the Swiss FDPIC guidance on
[AI and data protection](https://www.edoeb.admin.ch/en/ai-and-data-protection)
and the European Commission's final
[Article 50 transparency guidelines](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems).
Evaluation follows the conversation profile in the
[AI use-pattern guide](../../docs/ai-use-patterns.md).

## 7. Evidence pack

Retain role and jurisdiction analyses, notice versions, comprehension tests,
approved pages, frozen conversations, accessibility results, handoff monitoring,
provider terms, retention proof, complaint route, incidents, and the gate record.
