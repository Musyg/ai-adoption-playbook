# Evidence note: AI in grant administration

Last checked: **19 August 2026**; screening and fundraising evidence added on **18 November 2026**. [Version française](nonprofit-grantmaking-ai-cases.fr.md).

This note bounds the synthetic
[A2 grant-dossier case](../examples/en/nonprofit-grant-dossier-business-agent.md).
It separates administrative handling from a decision that affects access to
funding.

## Useful anchors

- In Candid's [2025 survey](https://candid.org/blogs/will-foundations-soon-use-ai-to-screen-grant-applications/),
  1% of 529 responding foundations reported using generative AI to screen
  applications or assist decisions. Summaries and administrative tasks were
  described as more acceptable uses. This measures reported practice, not
  productivity.
- [Degrees of Change](https://learn.microsoft.com/power-platform/guidance/case-studies/nonprofit)
  uses a central system to handle more than 1,000 applications and support 150
  volunteer reviewers. Staff review extracted information and matching
  recommendations. The supplier case gives a useful workflow analogue, not a
  causal time estimate.
- The [National Zakat Foundation case](https://www.microsoft.com/en/customers/story/23068-national-zakat-foundation-microsoft-copilot-studio)
  reports an 80% reduction in disbursement delay after several data,
  automation, and agent changes. Treat it as a high scenario, not a forecast.
- Swiss [FDPIC guidance](https://www.edoeb.admin.ch/en/duty-to-provide-information)
  explains the information and human-review rights that can apply to fully
  automated individual decisions.

The worked case therefore lets the agent check a published checklist, prepare
a packet, and perform writes after approval. It does not score merit,
vulnerability, or success probability. A high productivity scenario can still
be explored for a standard digital sub-flow, while offline, ambiguous,
sensitive, and new-program cases stay visible in the whole-workload denominator.

For a real pilot, measure active human time, corrections, escalation, critical
errors, complaints, appeals, reversed decisions, access by channel and group,
and the downstream outcome. A nominal human review is not enough unless that
person has the evidence, time, competence, and authority to disagree.

## Screening and fundraising evidence (18 November 2026)

No study measures active human time for a typical nonprofit task (a grant application, an impact report, a donor appeal) with and without AI. What exists measures decisions, agreement or donations.

| Study | Design and sample | Finding | Use here |
| --- | --- | --- | --- |
| [Lane et al., MIT Solve screening](https://mackinstitute.wharton.upenn.edu/wp-content/uploads/2025/04/WTIC.2025_Lane-Jacqueline_The-Narrative-AI-Advantage.pdf) | Randomized, 48 solutions, 228 screeners, 3,002 decisions (2024) | AI advice lowered pass rates from 68% to 62% (score only) and 57% (with a written rationale). Decision time capped at 2.5 minutes, so no time result | Risk of anchoring on AI; no time saving |
| [la Caixa prescreening](https://www.cambridge.org/core/product/D17CC86C884D4F9E3A6DD9ABF3F4605E/core-reader) | Hidden parallel trial, then operational use, about 500 proposals per call | Reviewers rescued 30 of 216 (2022) and 35 of 98 (2023) flagged proposals; two funded projects would have been excluded | Every exclusion needs human review |
| [Thelwall et al., UKRI proposals](https://arxiv.org/pdf/2609.25327) | 2,267 past proposals scored by language models | Correlation with individual reviewers 0.186, below reviewer-to-reviewer agreement of 0.242 | Retrospective test before use |
| [Rospocher, controlled proposals](https://aclanthology.org/2026.aacl-short.44.pdf) | Synthetic proposals with identical content | Lower scores for weaker publication record and lower-tier institution | Test prestige bias |
| [Caffier et al., donation appeals](https://arxiv.org/pdf/2604.03202) | Online experiments, about 650 participants each, small real donations | Undisclosed AI appeals did as well or better than human ones | Context; disclosure changes the result in other studies |

Funder practice is split. [MacArthur](https://www.macfound.org/about/our-policies/artificial-intelligence) does not use AI to decide or assess grants. [Foundation Scotland](https://www.foundationscotland.org.uk/sites/default/files/2025-07/Artificial%20Intelligence%20%28AI%29%20Policy.pdf) uses AI to shortlist, as guidance only, with mandatory human review and public disclosure. In the UK, 13% of funders ask applicants to declare AI use ([Charity Digital Skills Report 2026](https://charitydigitalskills.co.uk/report/detailed-findings/grantmaking-trusts-and-foundations/), 123 grantmakers). A declaration field in the application form costs little and gives the funder its own data.
