# Evidence note: B2B quoting in an SME

Last checked: **19 August 2026**. [Version française](pme-b2b-quote-cases.fr.md).

This note bounds the synthetic
[A2 business-agent quoting case](../examples/en/sme-b2b-quote-business-agent.md).
It does not turn large-enterprise or supplier case studies into a promise for
an SME.

## What can transfer

- The [OECD SME report](https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-4.html)
  provides SME adoption context, but self-reported improvement is not a measured
  saving for a quoting workflow.
- The [Alibaba field trial](https://arxiv.org/abs/2605.14830) is direct evidence
  that a bounded agent can reduce eligible-case time. Eligibility was only 5.8%,
  so the whole-flow result was much smaller.
- [Ingram Micro InstaQuote](https://www.microsoft.com/en/customers/story/1332782617804604736-ingram-micro-partner-professional-services-microsoft-power-platform)
  is a close functional analogue: email intake, product and attachment
  extraction, database checks, pricing APIs, and a quote prepared for a seller.
  It is a supplier case at large-enterprise scale, without a full public control.
- [Grupo Elfa](https://aws.amazon.com/pt/blogs/aws-brasil/grupo-elfa-como-genai-automatizou-cotacoes-e-apoiou-a-empresa-a-incrementar-r-240m-em-receitas-em-12-meses/),
  [Lexmark](https://www.microsoft.com/en/customers/story/1622766284672128134-experlogix-lexmark-customer-success-story-united-states-sales-operations),
  and [US Foods](https://aws.amazon.com/solutions/case-studies/us-foods-case-study/)
  show high implementation scenarios. They are not independent SME benchmarks.
- [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
  measured a 19% slowdown on familiar, complex software tasks, a useful warning
  that poor task fit can make AI slower.

An 80% reduction on an eligible request is not an 80% reduction in company
work. Apply eligibility, then count approval, exceptions, corrections,
monitoring, maintenance, and new bottlenecks. The worked 50–75% range is an
explicitly ambitious demonstration hypothesis. It must be challenged on a
frozen set and replaced with pilot observations.
