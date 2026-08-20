# Synthetic non-agentic case: Multimodal product-catalogue accessibility assistant

> **Fictional example.** The company, catalogue, assets, evaluation results, and
> decision are synthetic. They illustrate a controlled multimodal workflow and
> are not evidence of product performance.

> **Dominant pattern: multimodal. Secondary patterns: generation and
> classification. Level: A1.** The system reads authorized product images and
> packaging text, then drafts alt text and flags inconsistencies. It cannot edit
> the source asset, publish a page, or write to the catalogue.

## 1. Starting point

**Asteria Home SA** is a fictional Swiss home-goods SME with 2,400 products sold
in Switzerland and the European Union. New catalogue entries arrive with product
photos, packaging images, dimensions, material fields, and supplier text. An
editor drafts French and English alt text and checks visible claims against the
product record.

| Measure | Synthetic baseline |
|---|---:|
| New or changed image sets per month | 180 |
| Median active review per image set | 8 min |
| Alt text returned for major rework | 21% |
| Image and structured-field mismatch | 7% |

The target is: **draft factual alt text and flag visible inconsistencies for an
editor**. The system does not infer quality, safety, origin, sustainability, or
protected characteristics from an image.

## 2. Rights, provenance, and system boundary

| Dimension | Pilot decision |
|---|---|
| Inputs | Authorized product photos, packaging crops, and approved product fields |
| Outputs | Alt-text draft, visible-attribute extraction, and mismatch flag |
| Risk and autonomy | R1, A1 |
| Jurisdictions | Switzerland and European Union |
| External effect | None; publishing remains a separate human action |

Every asset has an owner, licence or supplier authority, source identifier,
hash, capture date when available, and permitted-use record. Faces, homes,
addresses, vehicle plates, customer uploads, and unrelated background people
are excluded from the pilot.

The source asset is immutable. The system may not generate a replacement image,
remove a watermark, strip provenance, or silently alter packaging text. If a
future version generates or manipulates public media, the provider/deployer
Article 50 analysis and machine-readable marking test reopen before use.

## 3. Multimodal evaluation

The frozen set contains 140 image sets: 20 low-resolution images, 20 text-heavy
packages, 20 near-duplicate colours, 16 deliberate image-record mismatches, 12
unsupported sustainability claims, and transformation tests for crop, resize,
compression, and metadata loss.

| Metric | Acceptance | Stop |
|---|---:|---:|
| Visible attributes extracted correctly | at least 97% | below 94% |
| Alt text accepted after defined editorial review | at least 90% | below 80% |
| Invented material, dimension, certification, or safety claim | 0 | at least 1 |
| Deliberate mismatch correctly flagged | 100% | below 100% |
| Asset without verified use authority processed | 0 | at least 1 |
| Critical accessibility omission | 0 | at least 1 |

### Synthetic frozen-set result

| Measure | Result | Gate |
|---|---:|---|
| Visible attributes correct | 538/552, or 97.5% | pass |
| Alt text accepted | 128/140, or 91.4% | pass |
| Invented prohibited claim | 0 | pass |
| Deliberate mismatch flagged | 16/16 | pass |
| Unverified-rights asset processed | 0 | pass |
| Critical accessibility omission | 0 | pass |

Most corrections concern colour nuance and overly long descriptions. Two small
packaging warnings are missed after aggressive compression. Compression limits
are therefore part of the input contract rather than hidden in average quality.

## 4. Shadow workflow

For four weeks, editors complete their normal work before viewing the proposal.
They record acceptance, correction type, missed visible information, invented
information, rights exception, mismatch decision, active review time, and final
published alt text. The public catalogue receives only the editor-approved text.

The workflow stops on a rights failure, invented certification or safety claim,
critical accessibility omission, unflagged deliberate mismatch, or provenance
loss. New modalities, generated images, faces, or customer uploads require a new
risk and legal gate.

## 5. Decision

**Decision: authorize a 60-set shadow pilot for the defined product-photo scope.**

The frozen set supports observation, not automatic publication. Any measured
time change must be reported with correction rate and accessibility quality. A
faster draft that shifts work to later correction does not pass the business
gate.

## 6. Transfer limits and source anchors

The figures are synthetic and cannot be generalized to people, medical images,
insurance evidence, biometric systems, video, or voice. Those uses have
different rights, harms, and evaluation contracts.

The provenance and transparency prompts use
[NIST AI 100-4](https://airc.nist.gov/technical-reports/),
[C2PA 2.2](https://spec.c2pa.org/specifications/specifications/2.2/index.html),
the Swiss authorities' statement on
[AI-generated images](https://www.edoeb.admin.ch/en/joint-statement-on-ai-generated-images),
and the [AI use-pattern guide](../../docs/ai-use-patterns.md).

## 7. Evidence pack

Retain asset authority, source hashes, transformations, the frozen set, expected
visible attributes, alt-text rubric, accessibility review, provenance tests,
correction ledger, exclusions, incidents, and signed gate decision.
