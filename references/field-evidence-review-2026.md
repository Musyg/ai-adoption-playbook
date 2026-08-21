# Public field-evidence review for AI adoption

Last verified: **19 August 2026**.

This review answers a narrow question: what do published observations actually
support when a copilot, a bounded business agent, or an orchestrated agency is
introduced into real work?

It does not populate `field-notes/index.json`. Public third-party studies do not
become first-party field feedback. They provide external anchors for pilot
design, expected failure modes, and transfer limits.

## The conclusion in one page

1. Large gains are real on some narrow tasks. They are not a universal property
   of AI adoption.
2. The strongest copilot evidence usually reports effects on a task, a worker,
   or a selected user group. It rarely proves an organization-wide outcome.
3. The best direct business-agent experiment found in this review shows why the
   denominator matters. Agentic AI reduced duration by 16.8% on eligible chats,
   but only 5.8% of all chats were eligible. The aggregate duration reduction was
   3.2%, and customer ratings on eligible chats fell by 0.412 point.
4. Activity and delivery diverge. Autonomous coding agents were associated with
   180% more commits, but only 30% more releases and no detectable increase in
   total app usage.
5. No independent causal field study found here supports a generic 5x to 12x
   increase in accepted business outcomes for an orchestrated multi-agent
   agency. Such figures can be stress-test hypotheses, not evidence bands.
6. Baseline skill, workflow fit, guardrails, eligibility, adoption, supervision,
   and the downstream bottleneck explain much of the observed spread.

## Evidence strength used here

| Class | Meaning | What it can support |
|---|---|---|
| **A** | Randomized or strong quasi-experimental study in a live workflow with objective outcomes | A causal or near-causal claim for that measured setting |
| **B** | Operational telemetry with a comparison design, administrative outcome, or matched event study | A bounded association or causal interpretation with stated assumptions |
| **C** | Realistic controlled task, external benchmark, or before-after deployment | A capability or process signal, not a whole-organization result |
| **D** | Official evaluation, regulatory filing, or customer case with disclosed method but no causal control | A documented deployment claim with attribution limits |
| **E** | Supplier case, testimonial, or architecture description | A hypothesis and implementation pattern only |

Study size does not repair the wrong outcome. A survey of 20,000 users still
measures perception if time saved is self-reported. A benchmark still measures a
benchmark if its interface resembles office work.

## Evidence matrix

| Setting and source | Level | Class | Measured result | Transfer limit |
|---|---|---:|---|---|
| [Customer support, 5,172 agents](https://academic.oup.com/qje/article/140/2/889/7990658) | Copilot | A | 15% more issues resolved per hour on average. Less-experienced workers gained most. The highest-skilled workers had small quality declines. | One mature support environment, a trained assistant, and humans responsible for every conversation. |
| [66 firms, 7,137 knowledge workers](https://www.nber.org/papers/w33795) | Copilot | A | Active treated users spent about two fewer hours per week on email and less time outside regular hours. No detectable aggregate change appeared in task quantity or composition. | Integrated office assistant, selected firms, and individual-level provision. It does not demonstrate autonomous workflow completion. |
| [P&G product innovation, 776 professionals](https://www.nber.org/papers/w33641) | Copilot/team support | A | An individual with AI matched a two-person team without AI on the measured innovation challenge. AI also reduced functional silos. | A bounded innovation exercise, not deployment ownership, external action, or longitudinal product success. |
| [Kenyan entrepreneurs, 640 small businesses](https://www.hbs.edu/ris/download.aspx?name=24-042.pdf) | Open-ended adviser | A | The average effect on revenue and profit was not statistically distinguishable from zero. High baseline performers gained about 15%; low performers lost about 8%. | Advice over WhatsApp, not a connected agent. The result is especially relevant to independents who must judge and implement generic advice themselves. |
| [Alibaba service assistant, 5,940 new agents](https://arxiv.org/abs/2603.29888) | Copilot | A, preprint | At full use, issue-identification time fell 32.3%, chat duration 4.2%, dissatisfaction 15.4%, and ratings rose 5.3%. Actual use averaged 28.7%, so intent-to-treat effects were much smaller. Top performers could lose quality. | Human agents could accept, edit, or reject suggestions. Full-use estimates must not be reported as population effects. |
| [Alibaba agentic service, 647 workers and 680,676 chats](https://arxiv.org/abs/2605.14830) | Bounded business agent | A, preprint | Eligible-chat duration fell 16.8%, but customer rating fell 0.412 point. Eligible chats were 5.8% of volume. Across all chats, duration fell 3.2% and quality did not materially change. Only 35% of agent-handled eligible chats had no escalation. | Seventeen-day experiment, standardized service issues, human supervisor assigned to every eligible chat. This is the strongest direct agent evidence found, not a generic rate. |
| [Human and AI advertising teams, 2,234 participants](https://arxiv.org/abs/2503.18238) | Collaborative agent | A/C, preprint | Human-AI teams made 50% more ads per worker and improved text quality, but image quality and diversity fell. Across 4.9 million impressions, overall click and cost outcomes were similar to human-human teams. | No human-alone arm. The AI could collaborate and create, but it could not submit campaigns autonomously. |
| [Seven online retail experiments](https://arxiv.org/abs/2510.12049) | Copilot to agentic workflow | A, preprint | Sales effects ranged from no detectable effect to 16.3%, depending on the marginal improvement over the existing process. Smaller and newer sellers often gained more. | Large platform, consumer randomization, fixed prices, and platform-scale infrastructure. This is not a direct estimate for a standalone small business. |
| [Experienced open-source developers, 246 real tasks](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) | Coding copilot/agent | A | Early-2025 tools made 16 experienced developers 19% slower. They expected a 24% speedup and still perceived a 20% speedup afterward. | Mature repositories known deeply by the participants, early-2025 tools, and a small developer sample. [Late-2025 follow-up data](https://metr.org/blog/2026-02-24-uplift-update/) suggest improvement but are too selected for a reliable magnitude. |
| [More than 100,000 GitHub developers](https://www.nber.org/papers/w35275) | Autocomplete to autonomous coding agent | B | Cumulative effects reached 40% more commits for autocomplete, 140% with interactive agents, and 180% with autonomous agents. The last figure attenuated to 50% more projects and 30% more releases. Four app marketplaces showed no increase in total usage. | Matched event study, not random assignment. It measures software production and exposes downstream human bottlenecks. |
| [Tutor CoPilot, live K-12 tutoring](https://edworkingpapers.com/sites/default/files/ai24-1054.pdf) | Expert copilot | A, working paper | Students were 4 percentage points more likely to master topics; students of lower-rated tutors gained 9 points. | Two months, novice tutors, one tutoring provider, and human tutors remained responsible. |
| [High-school mathematics, nearly 1,000 students](https://doi.org/10.1073/pnas.2422633122) | Learner copilot | A | During assisted practice, standard GPT improved grades 48% and guarded GPT Tutor 127%. Without AI, the standard-GPT group scored 17% below control; the guarded tutor removed the harm but produced no positive unassisted effect. | Education outcome. It proves that assisted performance and retained capability are different measures. |
| [Kenyan primary care, 9,691 patients](https://www.nature.com/articles/s41591-026-04503-6) | Clinical decision support | A | Documentation quality improved, but the primary treatment-failure outcome did not differ significantly. Any patient-outcome benefit was probably modest. | Sixteen facilities, clinicians retained authority, and the system was decision support rather than an autonomous clinical agent. |
| [Dutch general practice, 535 consultations](https://www.nature.com/articles/s41746-026-02454-3) | Ambient scribe | C | Documentation time fell by 42.7 seconds per consultation, while total consultation time and throughput did not change. Every summary required GP review. | Before-after design with 12 clinicians and short observation windows. Some notes were inaccurate or less complete. |
| [Hospital system, 1,547 active clinicians](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2849634) | Ambient scribe | B | Median note time moved from 7.1 to 6.1 minutes per appointment. No association appeared with appointments per day; effects were modest and uptake was voluntary. | Interrupted time series, one system, one tool, and about 8% active adoption. |
| [UK cross-government experiment, 20,000 licences](https://www.gov.uk/government/publications/microsoft-365-copilot-experiment-cross-government-findings-report) | Copilot | D | Users reported 26 minutes saved per day; about 80% were active. The report could not determine how saved time was used and required human oversight. | Self-reported time, no formal control, and central-office tasks. Agents introduced during the experiment were outside the analysis. |
| [UK DWP trial, 3,549 licences](https://www.gov.uk/government/publications/an-evaluation-of-dwps-microsoft-copilot-365-trial/an-evaluation-of-dwps-microsoft-365-copilot-trial) | Copilot | D/B | Regression with a non-user comparison estimated 19 minutes saved per day; 73% reported better output. Allocation was not random, there was no baseline, and outcomes were self-reported. | Corporate staff, not frontline operations. The study itself warns about selection and reporting bias. |
| [CORPGEN multi-task benchmark](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/) | Orchestrated agency | C | At 46 concurrent tasks, CORPGEN completed 15.2% versus 4.3% for baselines, a 3.5x relative gain. Absolute completion remained 15.2%. | Simulated corporate environment over a six-hour benchmark. It is not a production deployment or a business outcome. |
| [Remote Labor Index](https://scale.com/blog/rli) | General autonomous agent | C | The best evaluated agent completed 2.5% of 240 real freelance projects to the expected professional standard. | External benchmark using broad, unfamiliar work. It does not estimate a deeply integrated specialist workflow. |
| [AuditGPT, IBM, Klarna and Salesforce](agentic-integration-levels.md) | Specialist agents | D/E | Published cases report very large reductions or containment rates on selected processes. | Mostly organization-authored, supplier-authored, or filing-based evidence without a causal control. Useful as high scenarios, not universal bounds. |

## The low and high margin, stated honestly

There is no single empirical low and high percentage for "AI implementation".
The literature supports different ranges for different outcomes:

| Question | Defensible public evidence found | What not to infer |
|---|---|---|
| Can assistance make one task faster or better? | From a measured slowdown of 19% to very large gains on narrow, assisted tasks. Mature workplace studies often cluster between no aggregate change and about 40% task or worker improvement. | Do not multiply this by the whole payroll or all working hours. |
| Can open-ended AI advice improve an independent business? | Average effect near zero in the strongest direct small-business RCT, with roughly minus 8% for low baseline performers and plus 15% for high performers. | Do not assume access to advice equals implementation quality. |
| Can a bounded agent complete a workflow? | Direct agentic field evidence shows meaningful speed on a narrow eligible subset, but low eligibility and a quality trade-off. | Do not equate eligible-case speed, containment, or no-escalation with accepted end-to-end business value. |
| Can an orchestrated agency produce a 5x to 12x result? | Architecture benchmarks and corporate cases make this a plausible stress scenario for selected digital workflows. No independent causal field evidence found here establishes it as a generic accepted-outcome range. | Do not present the multiplier as demonstrated for Talos, Hermes, or any architecture without its own frozen benchmark. |

## The denominator model

Use raw case records, not a headline multiplier:

```text
baseline human hours
- observed human hours on accepted eligible cases
- avoided human hours on accepted straight-through cases
+ supervision, correction, exception, incident, and fallback hours
= net human hours after AI
```

Then report:

```text
whole-workload reduction =
(baseline human hours - net human hours after AI) / baseline human hours
```

Keep four additional outcomes separate:

1. eligibility across every incoming case;
2. accepted quality and major correction rate;
3. downstream shipped result, such as resolved issue, paid quote, release, revenue,
   learning retained, or patient outcome;
4. critical harm, unauthorized effect, and trace completeness.

## Implications for an independent agency such as Talos or Hermes

An independent operator can plausibly see larger personal leverage than a broad
enterprise average because one person may own intake, research, production,
quality control, and delivery. Fewer organizational handoffs can reduce the
attenuation seen in large firms. The same concentration also makes judgment,
review capacity, sales demand, and client trust hard bottlenecks.

The correct high case is therefore conditional:

- a stable and digitized service;
- a narrow eligibility rule;
- repeatable source material and tools;
- specialist agents with isolated permissions;
- a deterministic acceptance and effect ledger;
- enough demand to reuse the released capacity;
- measured supervision and exception time;
- a human who can detect when the system leaves its competence boundary.

Without these conditions, multi-agent orchestration may only generate more
intermediate work, review queues, and plausible errors.

## What field evidence is still missing

The public literature cannot complete the roadmap item for anonymized field
feedback. Completion still requires an authorized real pilot that:

1. compares manual, copilot, single-agent, and orchestrated conditions on the
   same frozen workflow where feasible;
2. retains ineligible, abstained, failed, escalated, and missing cases in the
   denominator;
3. records human active time, accepted quality, straight-through completion,
   supervision, corrections, incidents, cost, and downstream outcome;
4. is reviewed independently for redaction, arithmetic, causal wording, and
   transfer limits;
5. meets the admission rule in `field-notes/README.md`.

Until then, the honest status is: external evidence deeply reviewed, first-party
field evidence still open.
