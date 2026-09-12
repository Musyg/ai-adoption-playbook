# Reader-clarity corrections

[Français](reader-clarity-review.fr.md)

Review date: 12 September 2026. Base: `main` at `7623b15`.
Implementation branch: `improvement/reader-clarity`.

## Scope and correction map

This follows the comparison of the guide with MDN, Anthropic, OpenAI,
Cloudflare, Google PAIR and GOV.UK writing and interaction patterns.
It is an editorial and interaction correction, not a new scientific review
or a claim that every reader now understands the guide.

| Finding | Implemented correction | Main surface |
| --- | --- | --- |
| Work mode confused with architecture | Matched the menu to the three work modes; separated agent behavior from the presence of controls; removed the operating-system analogy | Guide, architecture taxonomy, integration and governance articles |
| Abstract choices | Put practical tasks before their technical names; clarified organization descriptions and the baseline control title | Guided start, use patterns, control crosswalk |
| Three decisions on one screen | One visible question at a time, three revisitable substeps, the same customer-reply example, and optional help choosing | Operating-design screen |
| Too many incomparable numbers | Whole-workload hours saved and remaining first, with added-work and unavailable states; per-case details expandable | Calibrator |
| Defaults described as user entries | Neutral wording about current assumptions, explicit demonstration status, direct access to editable scenarios | Calibrator |
| Repeated identical range endpoints | Shared display formatting collapses equal rounded values; no change to calculation precision | Calibrator and results screen |
| Technical test-planning language | Plain success/failure instructions, same-case comparison, concrete version example, visible explanation of planning minimums | Test plan, lifecycle and project records |
| Abstract operating instructions | Named responsibilities, manual recovery, concrete checks of already-completed changes; one person may hold several roles when feasible | Operations |
| Alert semantics found by the new accessibility check | Used valid alert containers while preserving the messages and all design checks | Guided design, calibrator and test plan |
| Public feedback looks mandatory | Optional contribution stated in menu, heading and explanation; cohort count distinguished from personal progress | Feedback |
| Conflicting navigation counts | Four questions then result; three design substeps; distinct method and workspace explanations; localized CH + EU label | Navigation |
| Practical questions mostly about agents | Direct task links to retrieval, prediction, conversation and multimodal explanations | Practical-question library |
| Editorial date and language consistency | Edited all six article pairs, dated these edits, refreshed the guide edition label | Articles and homepage |

No task-time coefficients, source admission rules, gates, schema identifiers,
permissions or legal classifications were changed. These edits do not turn a
demonstration into observed evidence. The known first-party field-data gap is
unchanged and is not a new implementation blocker.

## Verification

Local verification passed on 12 September 2026:

- Lint, TypeScript and production/static builds, including all 14 routes.
- 62 Node tests and 144 Chrome checks, without retries in the final run,
  across desktop light, desktop dark and mobile light. Browser run: 6.1 minutes.
- Repository validation: 125 Markdown files and the declared content contracts;
  the source-discovery regression also passed.
- JSON Schema 2020-12 validation of task-time evidence and the control crosswalk.
- Visual inspection of the French design-choice and monthly-summary captures
  in all three browser profiles, including readable hover states on desktop.
- `git diff --check`; unchanged calculation engine, evidence registry,
  decision engine, dossier format and dependency lockfile.

The new browser checks cover progressive and backward navigation, monthly
gains and losses, zero eligibility, optional detail, scenario access, collapsed
ranges, optional feedback and non-agent task links. Existing checks still
cover incompatible designs, A4 exceptions, exports and frozen observations.
The build retained its pre-existing bundle-size warning during this review;
this was not a performance audit. The local correction pass was subsequently
committed and published through
[PR #55](https://github.com/Musyg/ai-adoption-playbook/pull/55), merged at
`9736e1f` on September 12. Main CI passed 62 Node tests and 144 Chrome checks;
[Pages deployment](https://github.com/Musyg/ai-adoption-playbook/actions/runs/34685452972)
succeeded. The 14 public routes and the new summary on both home routes were
verified after deployment. Later performance work is tracked separately.

Human reader sessions will be arranged by the user after these corrections.
They are not represented by browser automation or accessibility checks.

## Comparison references

- [MDN: planning a first website](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/What_will_your_website_look_like)
- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI: a practical guide to building AI agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
- [Cloudflare: what are agents?](https://developers.cloudflare.com/agents/concepts/what-are-agents/)
- [Google PAIR: explainability and trust](https://pair.withgoogle.com/chapter/explainability-trust/)
- [GOV.UK: question pages](https://design-system.service.gov.uk/patterns/question-pages/)
