# Evidence note: copilot, bounded automation, and strong automation

Last checked: **19 August 2026**. [Version française](agentic-integration-levels.fr.md).

This note prevents a common comparison error. A writing assistant and a system
that handles a business workflow do not perform the same amount of work, so
their reported gains are not interchangeable.

## Three separate questions

1. **Work mode:** does AI assist one step, handle a bounded case, or perform
   most eligible work?
2. **Architecture:** is it one model, a fixed workflow, one agent, or a team of
   specialist agents?
3. **Action boundary:** may it only advise (A0), prepare work (A1), act after
   approval (A2), act alone inside limits (A3), or hold broad authority (A4)?

These answers may differ. A multi-agent architecture can still require approval
at A2. A single agent can be allowed bounded A3 actions.

## What the evidence supports

| Work mode | What moves from the human | Best use of published results |
|---|---|---|
| **Copilot** | One step such as search, extraction, synthesis, or drafting. | Transfer results only to a closely comparable task and review standard. Published studies range from a measured slowdown to strong gains on narrow tasks. |
| **Bounded automation** | A defined case moves through connected data, tools, rules, checks, and exception handling. | The closest randomized field trial found 16.8% shorter handling time on eligible cases, but only 3.2% across the whole flow and lower customer ratings on eligible cases. |
| **Strong automation** | One or more agents perform most eligible work under stronger controls. | Organization-authored cases can inform high scenarios. No independent field trial found here supports a universal 5× to 12× gain in accepted business outcomes. |

The closest direct field study is the
[Alibaba randomized trial](https://arxiv.org/abs/2605.14830): 647 workers,
680,676 conversations, and 17 days of treatment. Eligible conversations were
handled 16.8% faster, but they were only 5.8% of volume. The overall gain was
3.2%, and every conversation still had a human supervisor.

High scenarios can still be useful when clearly labelled. Examples include
[Linde AuditGPT](https://hdsr.mitpress.mit.edu/pub/0mrfxamu/release/3),
[IBM AskHR](https://www.ibm.com/case-studies/ibm-askhr),
[Klarna's 2025 filing](https://www.sec.gov/Archives/edgar/data/2003292/000162828025012824/klarnagroupplcf-1.htm),
and [Salesforce's support deployment](https://www.salesforce.com/news/stories/ai-agent-customer-service-salesforce-learnings/?bc=OTH).
They are useful implementation analogues, not universal causal benchmarks.

Counter-evidence matters too. The [Remote Labor Index](https://scale.com/blog/rli)
reports a 2.5% end-to-end completion rate for the best tested general agent on
professional freelance projects. [CORPGEN](https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/)
reaches 15.2% completion under heavy simulated workload. These results do not
cancel strong specialist systems. They show why data, tools, rules, controls,
and task fit determine transferability.

Always keep five measures separate: elapsed cycle time, active human time,
accepted throughput, eligible-case end-to-end rate, and the final delivered
outcome. A demonstration range is allowed, but it must be called a scenario and
replaced by local observations after a pilot.
