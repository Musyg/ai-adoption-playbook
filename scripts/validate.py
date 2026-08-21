#!/usr/bin/env python3
"""Dependency-free integrity checks for the playbook repository."""

from __future__ import annotations

import csv
import json
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
MARKDOWN_LINK = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
PUBLIC_PRESENTATION_FILES = (
    "README.md",
    "README.fr.md",
    "HANDOFF.md",
    "ROADMAP.md",
    "CHANGELOG.md",
    "site/README.md",
)
PUBLIC_LANGUAGE_MARKETING = re.compile(
    r"\b(?:bilingual|bilingue)\b|English and French|French and English|"
    r"anglais et français|français et anglais|paired GEO intents",
    re.IGNORECASE,
)
REQUIRED_FILES = (
    "README.md",
    "README.fr.md",
    "CODE_OF_CONDUCT.md",
    "CODE_OF_CONDUCT.fr.md",
    "CONTRIBUTING.md",
    "CONTRIBUTING.fr.md",
    "LICENSE",
    "docs/evaluations-and-gates.md",
    "docs/ai-use-patterns.md",
    "docs/ai-use-patterns.fr.md",
    "docs/field-pilot-protocol.md",
    "docs/field-pilot-protocol.fr.md",
    "docs/field-pilot-cohort.md",
    "docs/field-pilot-cohort.fr.md",
    "docs/legal-switzerland-eu.md",
    "docs/maturity-model.md",
    "docs/risk-autonomy.md",
    "docs/security.md",
    "docs/task-time-evidence.md",
    "docs/task-time-evidence.fr.md",
    "docs/universal-process.md",
    "docs/universal-process.fr.md",
    "sectors/en/README.md",
    "sectors/en/healthcare.md",
    "sectors/en/education.md",
    "sectors/en/finance.md",
    "sectors/en/critical-infrastructure.md",
    "sectors/fr/README.md",
    "sectors/fr/healthcare.md",
    "sectors/fr/education.md",
    "sectors/fr/finance.md",
    "sectors/fr/critical-infrastructure.md",
    "tracks/en/README.md",
    "tracks/en/independent.md",
    "tracks/en/tpe.md",
    "tracks/en/pme.md",
    "tracks/en/nonprofit-foundation.md",
    "tracks/en/public-sector.md",
    "tracks/fr/independent.md",
    "tracks/fr/tpe.md",
    "tracks/fr/pme.md",
    "tracks/fr/nonprofit-foundation.md",
    "tracks/fr/public-sector.md",
    "templates/mandate.fr.md",
    "templates/mandate.md",
    "templates/use-case-card.fr.md",
    "templates/use-case-card.md",
    "templates/evaluation-plan.fr.md",
    "templates/evaluation-plan.md",
    "templates/incident-runbook.fr.md",
    "templates/incident-runbook.md",
    "templates/pilot-decision.md",
    "templates/risk-assessment.md",
    "templates/training-plan.md",
    "templates/vendor-assessment.md",
    "templates/accessibility-assessment.md",
    "templates/accessibility-assessment.fr.md",
    "templates/fundamental-rights-impact-assessment.md",
    "templates/fundamental-rights-impact-assessment.fr.md",
    "templates/field-feedback-report.md",
    "templates/field-feedback-report.fr.md",
    "field-notes/README.md",
    "field-notes/README.fr.md",
    "field-notes/index.json",
    "references/sources.md",
    "references/field-evidence-review-2026.md",
    "references/field-evidence-review-2026.fr.md",
    "controls/README.md",
    "site/public/data/control-crosswalk.schema.json",
    "site/public/data/control-crosswalk.v1.json",
    "site/public/data/project-dossier.schema.json",
    "site/public/data/task-time-evidence.schema.json",
    "site/public/data/task-time-evidence.v1.json",
    ".github/ISSUE_TEMPLATE/correction.yml",
    ".github/ISSUE_TEMPLATE/correction-fr.yml",
    ".github/ISSUE_TEMPLATE/field-pilot-en.yml",
    ".github/ISSUE_TEMPLATE/field-pilot-fr.yml",
    ".github/ISSUE_TEMPLATE/config.yml",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/PULL_REQUEST_TEMPLATE/field-report.md",
    ".github/PULL_REQUEST_TEMPLATE/field-report.fr.md",
    ".github/workflows/validate.yml",
    ".github/dependabot.yml",
)
TRANSLATION_PAIRS = (
    ("CODE_OF_CONDUCT.md", "CODE_OF_CONDUCT.fr.md"),
    ("CONTRIBUTING.md", "CONTRIBUTING.fr.md"),
    ("docs/evaluations-and-gates.md", "docs/evaluations-and-gates.fr.md"),
    ("docs/ai-use-patterns.md", "docs/ai-use-patterns.fr.md"),
    ("docs/field-pilot-protocol.md", "docs/field-pilot-protocol.fr.md"),
    ("docs/project-dossier.md", "docs/project-dossier.fr.md"),
    ("docs/field-pilot-cohort.md", "docs/field-pilot-cohort.fr.md"),
    ("docs/legal-switzerland-eu.md", "docs/legal-switzerland-eu.fr.md"),
    ("docs/maturity-model.md", "docs/maturity-model.fr.md"),
    ("docs/risk-autonomy.md", "docs/risk-autonomy.fr.md"),
    ("docs/security.md", "docs/security.fr.md"),
    ("docs/task-time-evidence.md", "docs/task-time-evidence.fr.md"),
    ("docs/universal-process.md", "docs/universal-process.fr.md"),
    ("templates/evaluation-plan.md", "templates/evaluation-plan.fr.md"),
    ("templates/incident-runbook.md", "templates/incident-runbook.fr.md"),
    ("templates/mandate.md", "templates/mandate.fr.md"),
    ("templates/pilot-decision.md", "templates/pilot-decision.fr.md"),
    ("templates/risk-assessment.md", "templates/risk-assessment.fr.md"),
    ("templates/training-plan.md", "templates/training-plan.fr.md"),
    ("templates/use-case-card.md", "templates/use-case-card.fr.md"),
    ("templates/vendor-assessment.md", "templates/vendor-assessment.fr.md"),
    ("tracks/en/README.md", "tracks/fr/README.md"),
    ("tracks/en/independent.md", "tracks/fr/independent.md"),
    ("tracks/en/tpe.md", "tracks/fr/tpe.md"),
    ("tracks/en/pme.md", "tracks/fr/pme.md"),
    ("tracks/en/nonprofit-foundation.md", "tracks/fr/nonprofit-foundation.md"),
    ("tracks/en/public-sector.md", "tracks/fr/public-sector.md"),
    ("sectors/en/README.md", "sectors/fr/README.md"),
    ("sectors/en/healthcare.md", "sectors/fr/healthcare.md"),
    ("sectors/en/education.md", "sectors/fr/education.md"),
    ("sectors/en/finance.md", "sectors/fr/finance.md"),
    ("sectors/en/critical-infrastructure.md", "sectors/fr/critical-infrastructure.md"),
    ("templates/accessibility-assessment.md", "templates/accessibility-assessment.fr.md"),
    ("templates/fundamental-rights-impact-assessment.md", "templates/fundamental-rights-impact-assessment.fr.md"),
    ("templates/field-feedback-report.md", "templates/field-feedback-report.fr.md"),
    ("field-notes/README.md", "field-notes/README.fr.md"),
    ("references/field-evidence-review-2026.md", "references/field-evidence-review-2026.fr.md"),
    ("examples/en/independent-client-follow-up.md", "examples/fr/independant-suivi-client.md"),
    ("examples/en/independent-business-agent-follow-up.md", "examples/fr/independant-agent-metier-suivi.md"),
    ("examples/en/independent-orchestrated-agency-diagnostic.md", "examples/fr/independant-agence-orchestree-diagnostic.md"),
    ("examples/en/nonprofit-grant-dossier-business-agent.md", "examples/fr/association-agent-dossiers-subventions.md"),
    ("examples/en/public-sector-planning-dossier-business-agent.md", "examples/fr/service-public-agent-dossiers-urbanisme.md"),
    ("examples/en/sme-b2b-quote-business-agent.md", "examples/fr/pme-agent-metier-devis-b2b.md"),
    ("examples/en/tpe-customer-requests.md", "examples/fr/tpe-demandes-clients.md"),
    ("examples/en/rag-policy-assistant.md", "examples/fr/assistant-rag-procedures.md"),
    ("examples/en/predictive-demand-forecast.md", "examples/fr/prevision-demande-pieces.md"),
    ("examples/en/external-customer-chatbot.md", "examples/fr/chatbot-client-externe.md"),
    ("examples/en/multimodal-catalog-accessibility.md", "examples/fr/catalogue-multimodal-accessibilite.md"),
)
NON_AGENTIC_CASES = (
    ("retrieval", "A1", "examples/en/rag-policy-assistant.md", "examples/fr/assistant-rag-procedures.md"),
    ("prediction", "A0", "examples/en/predictive-demand-forecast.md", "examples/fr/prevision-demande-pieces.md"),
    ("conversation", "A1", "examples/en/external-customer-chatbot.md", "examples/fr/chatbot-client-externe.md"),
    ("multimodal", "A1", "examples/en/multimodal-catalog-accessibility.md", "examples/fr/catalogue-multimodal-accessibilite.md"),
)
EXPECTED_REGISTER_COLUMNS = (
    "system_id",
    "name",
    "status",
    "owner",
    "business_process",
    "purpose",
    "use_patterns",
    "interaction_pattern",
    "knowledge_source",
    "output_modality",
    "deployment_mode",
    "operating_mode",
    "model_customization",
    "user_facing",
    "external_effect",
    "provider",
    "model_or_version",
    "data_classes",
    "affected_people",
    "risk_level",
    "autonomy_level",
    "human_approval",
    "jurisdictions",
    "last_review",
    "next_review",
    "decision_link",
)
IGNORED_PARTS = {
    ".git",
    ".next",
    ".vinext",
    "dist",
    "node_modules",
    "static-dist",
    "work",
}
FORBIDDEN_HOSTING_SUFFIXES = (
    ".".join(("chatgpt", "site")),
)
GITHUB_PAGES_SUFFIX = ".".join(("github", "io"))
APPROVED_PAGES_ORIGIN = "https://" + ".".join(("musyg", "github", "io")) + "/ai-adoption-playbook"
APPROVED_HOST_REFERENCE_FILES = {
    "HANDOFF.md",
    "README.fr.md",
    "README.md",
    "site/tests/hosted-export.check.mjs",
}
CONTROL_ID = re.compile(r"^AAP-[A-Z]{3}-[0-9]{3}$")
EVIDENCE_ID = re.compile(r"^EV-[A-Z0-9-]+$")
ORGANIZATION_TYPES = {"independent", "tpe", "pme", "nonprofit", "public"}
RISK_LEVELS = {"R0", "R1", "R2", "R3"}
AUTONOMY_LEVELS = {"A0", "A1", "A2", "A3", "A4"}
USE_PATTERNS = {"generation", "retrieval", "classification", "prediction", "conversation", "multimodal", "agentic"}
JURISDICTIONS = {"CH", "EU"}
GATES = {"G1", "G2", "G3", "G4", "G5", "P0", "P1", "P2", "P3", "P4", "P5"}
PRIORITIES = {"baseline", "strengthened", "critical"}
INTEGRATION_MODES = {"copilot", "agent", "agency"}
QUALITY_GATES = {"draft", "reviewed", "production"}
EXPERTISE_LEVELS = {"developing", "mixed", "experienced"}
EVIDENCE_GRADES = {"A", "B", "C", "D", "E"}
TASK_TIME_ID = re.compile(r"^TT-[0-9]{4}-[A-Z0-9-]+$")
EXPECTED_CASE_APPLICATION_FILES = {
    ("examples/en/tpe-customer-requests.md", "examples/fr/tpe-demandes-clients.md"),
    ("examples/en/sme-b2b-quote-business-agent.md", "examples/fr/pme-agent-metier-devis-b2b.md"),
    ("examples/en/nonprofit-grant-dossier-business-agent.md", "examples/fr/association-agent-dossiers-subventions.md"),
    ("examples/en/public-sector-planning-dossier-business-agent.md", "examples/fr/service-public-agent-dossiers-urbanisme.md"),
    ("examples/en/independent-client-follow-up.md", "examples/fr/independant-suivi-client.md"),
    ("examples/en/independent-business-agent-follow-up.md", "examples/fr/independant-agent-metier-suivi.md"),
    ("examples/en/independent-orchestrated-agency-diagnostic.md", "examples/fr/independant-agence-orchestree-diagnostic.md"),
    ("examples/en/rag-policy-assistant.md", "examples/fr/assistant-rag-procedures.md"),
    ("examples/en/predictive-demand-forecast.md", "examples/fr/prevision-demande-pieces.md"),
    ("examples/en/external-customer-chatbot.md", "examples/fr/chatbot-client-externe.md"),
    ("examples/en/multimodal-catalog-accessibility.md", "examples/fr/catalogue-multimodal-accessibilite.md"),
}


def is_ignored_repo_path(path: Path) -> bool:
    """Return whether a path is inside an ignored repository directory."""
    relative_path = path.relative_to(ROOT)
    return any(part in IGNORED_PARTS for part in relative_path.parts)


def check_required_files(errors: list[str]) -> None:
    for relative in REQUIRED_FILES:
        if not (ROOT / relative).is_file():
            errors.append(f"missing required file: {relative}")


def check_translation_parity(errors: list[str]) -> None:
    for english_relative, french_relative in TRANSLATION_PAIRS:
        english_path = ROOT / english_relative
        french_path = ROOT / french_relative
        if not english_path.is_file() or not french_path.is_file():
            errors.append(
                f"incomplete translation pair: {english_relative} <-> {french_relative}"
            )
            continue
        english_text = english_path.read_text(encoding="utf-8")
        french_text = french_path.read_text(encoding="utf-8")
        if not english_text.startswith("# ") or not french_text.startswith("# "):
            errors.append(
                f"translation pair must start with an H1: {english_relative} <-> {french_relative}"
            )
        if ".fr.md" in english_text:
            errors.append(f"English file links to a French Markdown file: {english_relative}")


def check_non_agentic_cases(errors: list[str]) -> None:
    for pattern, level, english_relative, french_relative in NON_AGENTIC_CASES:
        english_text = (ROOT / english_relative).read_text(encoding="utf-8")
        french_text = (ROOT / french_relative).read_text(encoding="utf-8")
        context = f"non-agentic {pattern} case"
        if "Fictional example" not in english_text or "Exemple fictif" not in french_text:
            errors.append(f"{context}: synthetic-evidence boundary is missing")
        if f"Level: {level}" not in english_text or f"Niveau : {level}" not in french_text:
            errors.append(f"{context}: expected autonomy level {level} is missing")
        if "## 5. Decision" not in english_text or "## 5. Décision" not in french_text:
            errors.append(f"{context}: explicit gate decision is missing")
        if "## 7. Evidence pack" not in english_text or "## 7. Dossier de preuves" not in french_text:
            errors.append(f"{context}: evidence pack is missing")


def check_markdown(errors: list[str]) -> None:
    markdown_paths = [
        path for path in sorted(ROOT.rglob("*.md")) if not is_ignored_repo_path(path)
    ]
    if not markdown_paths:
        errors.append("no Markdown files discovered outside ignored paths")
        return
    for path in markdown_paths:
        text = path.read_text(encoding="utf-8")
        if not text.endswith("\n"):
            errors.append(f"missing final newline: {path.relative_to(ROOT)}")
        for line_number, line in enumerate(text.splitlines(), start=1):
            if line.endswith(" ") and not line.endswith("  "):
                errors.append(
                    f"trailing whitespace: {path.relative_to(ROOT)}:{line_number}"
                )
            for raw_target in MARKDOWN_LINK.findall(line):
                target = raw_target.strip().split(maxsplit=1)[0].strip("<>")
                if not target or target.startswith(("http://", "https://", "mailto:", "#")):
                    continue
                file_part = unquote(target.split("#", 1)[0])
                resolved = (path.parent / file_part).resolve()
                try:
                    resolved.relative_to(ROOT)
                except ValueError:
                    errors.append(
                        f"link escapes repository: {path.relative_to(ROOT)}:{line_number} -> {target}"
                    )
                    continue
                if not resolved.exists():
                    errors.append(
                        f"broken local link: {path.relative_to(ROOT)}:{line_number} -> {target}"
                    )


def check_hosting_contract(errors: list[str]) -> None:
    pages_workflow = ROOT / ".github" / "workflows" / "pages.yml"
    if not pages_workflow.is_file():
        errors.append("missing owner-approved GitHub Pages workflow")
    else:
        workflow = pages_workflow.read_text(encoding="utf-8")
        required_workflow_contract = (
            'workflows: ["Validate playbook"]',
            "github.event.workflow_run.event == 'push'",
            "github.event.workflow_run.conclusion == 'success'",
            "actions/configure-pages@v6",
            "actions/upload-pages-artifact@v5",
            "actions/deploy-pages@v5",
            "pages: read",
            "pages: write",
            "id-token: write",
            "PUBLIC_SITE_URL: ${{ steps.pages.outputs.base_url }}",
            "STATIC_BASE_PATH: ${{ steps.pages.outputs.base_path }}",
            "run: npm run build:static",
            "npm run test:hosted",
        )
        for marker in required_workflow_contract:
            if marker not in workflow:
                errors.append(f"GitHub Pages workflow contract missing: {marker}")

    text_suffixes = {
        ".html",
        ".js",
        ".json",
        ".jsx",
        ".md",
        ".mjs",
        ".ts",
        ".tsx",
        ".yml",
        ".yaml",
    }
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in text_suffixes:
            continue
        if is_ignored_repo_path(path):
            continue
        text = path.read_text(encoding="utf-8")
        relative = path.relative_to(ROOT).as_posix()
        for suffix in FORBIDDEN_HOSTING_SUFFIXES:
            if suffix in text:
                errors.append(f"provider-specific hosting origin: {path.relative_to(ROOT)}")
        if GITHUB_PAGES_SUFFIX in text:
            unapproved = text.replace(APPROVED_PAGES_ORIGIN, "")
            if relative not in APPROVED_HOST_REFERENCE_FILES or GITHUB_PAGES_SUFFIX in unapproved:
                errors.append(f"unapproved GitHub Pages origin: {path.relative_to(ROOT)}")


def check_register(errors: list[str]) -> None:
    register = ROOT / "templates" / "ai-system-register.csv"
    if not register.is_file():
        errors.append("missing AI system register")
        return
    with register.open(encoding="utf-8", newline="") as handle:
        rows = csv.reader(handle)
        header = tuple(next(rows, ()))
    if header != EXPECTED_REGISTER_COLUMNS:
        errors.append("AI system register columns do not match the contract")


def check_field_notes(errors: list[str]) -> None:
    relative = "field-notes/index.json"
    registry = load_json(relative, errors)
    if not isinstance(registry, dict):
        return
    if registry.get("schema_version") != "1.0.0":
        errors.append("field-feedback schema_version must be 1.0.0")
    expect_date(registry, "published_on", "field-feedback registry", errors)
    expect_localized(registry, "limitations", "field-feedback registry", errors)
    cohort = registry.get("cohort")
    if not isinstance(cohort, dict):
        errors.append("field-feedback cohort must be an object")
    else:
        if cohort.get("target_admitted_reports") != 3:
            errors.append("field-feedback cohort target must be 3 admitted reports")
        raw_reports = registry.get("reports")
        reviewed_count = (
            len(
                [
                    report
                    for report in raw_reports
                    if isinstance(report, dict) and report.get("status") == "reviewed"
                ]
            )
            if isinstance(raw_reports, list)
            else 0
        )
        if cohort.get("admitted_reports") != reviewed_count:
            errors.append("field-feedback cohort admitted count must match reviewed reports")
        if cohort.get("recruiting_regions") != ["CH", "EU"]:
            errors.append("field-feedback cohort must recruit in CH and EU")
        if cohort.get("orchestrated_agency_required") is not False:
            errors.append("field-feedback cohort must not require orchestrated-agency evidence")
    reports = registry.get("reports")
    if not isinstance(reports, list):
        errors.append("field-feedback reports must be an array")
        return
    report_ids: set[str] = set()
    for index, report in enumerate(reports):
        context = f"field-feedback reports[{index}]"
        if not isinstance(report, dict):
            errors.append(f"{context} must be an object")
            continue
        report_id = report.get("report_id")
        if not isinstance(report_id, str) or not re.fullmatch(r"FIELD-[0-9]{4}-[0-9]{3}", report_id):
            errors.append(f"{context}: invalid report_id")
        elif report_id in report_ids:
            errors.append(f"duplicate field-feedback report_id: {report_id}")
        else:
            report_ids.add(report_id)
        if report.get("status") not in {"reviewed", "withdrawn"}:
            errors.append(f"{context}: status must be reviewed or withdrawn")
        for field in ("source_type", "evidence_boundary", "transfer_limits", "report_path"):
            expect_string(report, field, context, errors)
        if report.get("contains_personal_data") is not False:
            errors.append(f"{context}: contains_personal_data must be false")
        report_path = report.get("report_path")
        if isinstance(report_path, str) and not (ROOT / report_path).is_file():
            errors.append(f"{context}: missing report_path: {report_path}")


def check_task_time_registry(errors: list[str]) -> None:
    relative = "site/public/data/task-time-evidence.v1.json"
    registry = load_json(relative, errors)
    if not isinstance(registry, dict):
        return
    if registry.get("schema_version") != "1.0.0":
        errors.append("task-time registry schema_version must be 1.0.0")
    expect_date(registry, "published_on", "task-time registry", errors)
    expect_localized(registry, "boundary", "task-time registry", errors)

    grades = registry.get("evidence_grades")
    if not isinstance(grades, dict) or set(grades) != EVIDENCE_GRADES:
        errors.append("task-time registry must define evidence grades A to E")
    else:
        for grade in sorted(EVIDENCE_GRADES):
            expect_localized(grades, grade, "task-time evidence grades", errors)

    profiles = registry.get("task_profiles")
    if not isinstance(profiles, list) or not profiles:
        errors.append("task-time registry task_profiles must be a non-empty array")
        profiles = []
    profile_ids: set[str] = set()
    for index, profile in enumerate(profiles):
        context = f"task-time task_profiles[{index}]"
        if not isinstance(profile, dict):
            errors.append(f"{context} must be an object")
            continue
        profile_id = profile.get("profile_id")
        if not isinstance(profile_id, str) or not re.fullmatch(r"[a-z][a-z0-9_]+", profile_id):
            errors.append(f"{context}: invalid profile_id")
        elif profile_id in profile_ids:
            errors.append(f"duplicate task-time profile_id: {profile_id}")
        else:
            profile_ids.add(profile_id)
        for field in ("label", "description", "output_unit"):
            expect_localized(profile, field, context, errors)
        patterns = profile.get("use_patterns")
        if not isinstance(patterns, list) or not patterns or not set(patterns) <= USE_PATTERNS or len(patterns) != len(set(patterns)):
            errors.append(f"{context}: invalid use_patterns")
        quality_gates = profile.get("quality_gates")
        if not isinstance(quality_gates, list) or not quality_gates or not set(quality_gates) <= QUALITY_GATES or len(quality_gates) != len(set(quality_gates)):
            errors.append(f"{context}: invalid quality_gates")

    records = registry.get("records")
    if not isinstance(records, list) or not records:
        errors.append("task-time registry records must be a non-empty array")
        records = []
    evidence_ids: set[str] = set()
    has_negative_measurement = False
    has_context_only_frontier_case = False
    for index, record in enumerate(records):
        context = f"task-time records[{index}]"
        if not isinstance(record, dict):
            errors.append(f"{context} must be an object")
            continue
        evidence_id = record.get("evidence_id")
        if not isinstance(evidence_id, str) or not TASK_TIME_ID.fullmatch(evidence_id):
            errors.append(f"{context}: invalid evidence_id")
        elif evidence_id in evidence_ids:
            errors.append(f"duplicate task-time evidence_id: {evidence_id}")
        else:
            evidence_ids.add(evidence_id)
        expect_localized(record, "title", context, errors)

        task_contract = record.get("task_contract")
        if not isinstance(task_contract, dict):
            errors.append(f"{context}: task_contract must be an object")
        else:
            if task_contract.get("profile_id") not in profile_ids:
                errors.append(f"{context}: task_contract references a missing profile")
            if task_contract.get("integration_mode") not in INTEGRATION_MODES:
                errors.append(f"{context}: invalid task_contract integration_mode")
            if task_contract.get("quality_gate") not in QUALITY_GATES:
                errors.append(f"{context}: invalid task_contract quality_gate")
            if task_contract.get("operator_expertise") not in EXPERTISE_LEVELS:
                errors.append(f"{context}: invalid task_contract operator_expertise")
            for field in ("description", "output_unit"):
                expect_localized(task_contract, field, context, errors)

        measurement = record.get("measurement")
        if not isinstance(measurement, dict):
            errors.append(f"{context}: measurement must be an object")
            measurement = {}
        grade = measurement.get("evidence_grade")
        if grade not in EVIDENCE_GRADES:
            errors.append(f"{context}: invalid evidence_grade")
        time_range = measurement.get("human_time_reduction_fraction")
        if time_range is not None:
            if not isinstance(time_range, dict) or set(time_range) != {"low", "central", "high"}:
                errors.append(f"{context}: invalid human_time_reduction_fraction")
            else:
                values = [time_range.get(key) for key in ("low", "central", "high")]
                if not all(isinstance(value, (int, float)) and -5 <= value <= 0.99 for value in values):
                    errors.append(f"{context}: task-time range values are out of bounds")
                elif values != sorted(values):
                    errors.append(f"{context}: task-time range must be ordered low to high")
                elif values[0] < 0:
                    has_negative_measurement = True

        transfer = record.get("transfer")
        if not isinstance(transfer, dict):
            errors.append(f"{context}: transfer must be an object")
            transfer = {}
        quantitative_use = transfer.get("quantitative_use")
        if quantitative_use not in {"usable", "context_only"}:
            errors.append(f"{context}: invalid quantitative_use")
        if "organization_types" in transfer:
            errors.append(f"{context}: organization_types must not define task-time compatibility")
        allowed_profiles = transfer.get("allowed_profiles")
        if not isinstance(allowed_profiles, list) or not allowed_profiles or not set(allowed_profiles) <= profile_ids:
            errors.append(f"{context}: invalid transfer allowed_profiles")
        if quantitative_use == "usable":
            if grade not in {"A", "B"} or measurement.get("human_active_time_measured") is not True or time_range is None:
                errors.append(f"{context}: usable transfer requires measured grade A or B human time")
        organization_context = record.get("organization_context")
        if quantitative_use == "context_only" and isinstance(organization_context, dict) and organization_context.get("kind") == "frontier_ai_company":
            has_context_only_frontier_case = True
        for field in ("preconditions", "limits"):
            expect_localized(transfer, field, context, errors)

        sources = record.get("sources")
        if not isinstance(sources, list) or not sources:
            errors.append(f"{context}: sources must be a non-empty array")
        else:
            for source_index, source in enumerate(sources):
                source_context = f"{context}.sources[{source_index}]"
                if not isinstance(source, dict):
                    errors.append(f"{source_context} must be an object")
                    continue
                for field in ("title", "published", "source_type"):
                    expect_string(source, field, source_context, errors)
                source_url = source.get("url")
                if not isinstance(source_url, str) or not source_url.startswith("https://"):
                    errors.append(f"{source_context}: url must use https")
                expect_date(source, "accessed_on", source_context, errors)

    if not has_negative_measurement:
        errors.append("task-time registry must preserve at least one measured slowdown")
    if not has_context_only_frontier_case:
        errors.append("task-time registry must keep frontier-company estimates contextual")

    case_applications = registry.get("case_applications")
    if not isinstance(case_applications, list) or len(case_applications) != 11:
        errors.append("task-time registry must map exactly eleven worked cases")
        case_applications = []
    case_ids: set[str] = set()
    mapped_files: set[tuple[str, str]] = set()
    allowed_autonomy = {
        "copilot": {"A0", "A1"},
        "agent": {"A2", "A3"},
        "agency": {"A3", "A4"},
    }
    for index, application in enumerate(case_applications):
        context = f"task-time case_applications[{index}]"
        if not isinstance(application, dict):
            errors.append(f"{context} must be an object")
            continue
        case_id = application.get("case_id")
        if not isinstance(case_id, str) or not re.fullmatch(r"[a-z][a-z0-9-]+", case_id):
            errors.append(f"{context}: invalid case_id")
        elif case_id in case_ids:
            errors.append(f"duplicate task-time case_id: {case_id}")
        else:
            case_ids.add(case_id)
        expect_localized(application, "title", context, errors)
        expect_localized(application, "rationale", context, errors)
        if application.get("profile_id") not in profile_ids:
            errors.append(f"{context}: missing task profile")
        integration_mode = application.get("integration_mode")
        autonomy_level = application.get("autonomy_level")
        if integration_mode not in INTEGRATION_MODES:
            errors.append(f"{context}: invalid integration_mode")
        elif autonomy_level not in allowed_autonomy[integration_mode]:
            errors.append(f"{context}: autonomy_level does not match integration_mode")
        if application.get("evidence_grade") != "E" or application.get("quantitative_use") != "planning_only":
            errors.append(f"{context}: worked-case numbers must remain grade E planning hypotheses")
        anchor_ids = application.get("external_anchor_ids")
        if not isinstance(anchor_ids, list) or len(anchor_ids) != len(set(anchor_ids)) or not set(anchor_ids) <= evidence_ids:
            errors.append(f"{context}: invalid external_anchor_ids")
        example_files = application.get("example_files")
        if not isinstance(example_files, dict) or set(example_files) != {"en", "fr"}:
            errors.append(f"{context}: example_files must define en and fr")
            continue
        pair = (example_files.get("en"), example_files.get("fr"))
        if not all(isinstance(relative, str) and (ROOT / relative).is_file() for relative in pair):
            errors.append(f"{context}: missing example file")
        elif pair in mapped_files:
            errors.append(f"{context}: duplicate example file pair")
        else:
            mapped_files.add(pair)
    if mapped_files != EXPECTED_CASE_APPLICATION_FILES:
        errors.append("task-time registry must cover every worked-case file pair exactly once")


def load_json(relative: str, errors: list[str]) -> object | None:
    path = ROOT / relative
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"invalid JSON: {relative}: {exc}")
        return None


def expect_string(record: dict, field: str, context: str, errors: list[str]) -> None:
    value = record.get(field)
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{context}: {field} must be a non-empty string")


def expect_localized(record: dict, field: str, context: str, errors: list[str]) -> None:
    value = record.get(field)
    if not isinstance(value, dict):
        errors.append(f"{context}: {field} must contain en and fr")
        return
    for locale in ("en", "fr"):
        if not isinstance(value.get(locale), str) or not value[locale].strip():
            errors.append(f"{context}: {field}.{locale} must be a non-empty string")


def expect_date(record: dict, field: str, context: str, errors: list[str]) -> None:
    value = record.get(field)
    try:
        date.fromisoformat(value)
    except (TypeError, ValueError):
        errors.append(f"{context}: {field} must use YYYY-MM-DD")


def check_crosswalk(errors: list[str]) -> None:
    schema_relative = "site/public/data/control-crosswalk.schema.json"
    catalog_relative = "site/public/data/control-crosswalk.v1.json"
    schema = load_json(schema_relative, errors)
    catalog = load_json(catalog_relative, errors)
    if not isinstance(schema, dict) or not isinstance(catalog, dict):
        return

    if schema.get("$schema") != "https://json-schema.org/draft/2020-12/schema":
        errors.append("control crosswalk schema must use JSON Schema 2020-12")
    if catalog.get("schema_version") != "1.1.0":
        errors.append("control crosswalk schema_version must be 1.1.0")
    if not re.fullmatch(r"[0-9]{4}\.[0-9]{2}", str(catalog.get("catalog_version", ""))):
        errors.append("control crosswalk catalog_version must use YYYY.MM")
    expect_date(catalog, "published_on", "control crosswalk", errors)
    expect_localized(catalog, "scope", "control crosswalk", errors)
    expect_localized(catalog, "limitations", "control crosswalk", errors)

    axes = catalog.get("axes")
    if not isinstance(axes, dict):
        errors.append("control crosswalk axes must be an object")
    else:
        expected_axes = {
            "organization_types": ORGANIZATION_TYPES,
            "risk_levels": RISK_LEVELS,
            "autonomy_levels": AUTONOMY_LEVELS,
            "use_patterns": USE_PATTERNS,
            "jurisdictions": JURISDICTIONS,
            "gates": GATES,
            "lifecycle_phases": set(range(12)),
        }
        for field, expected in expected_axes.items():
            value = axes.get(field)
            if not isinstance(value, list) or set(value) != expected or len(value) != len(expected):
                errors.append(f"control crosswalk axes.{field} does not match the contract")

    profiles = catalog.get("use_pattern_profiles")
    if not isinstance(profiles, list) or not profiles:
        errors.append("control crosswalk use_pattern_profiles must be a non-empty array")
        profiles = []
    profile_ids: set[str] = set()
    for index, profile in enumerate(profiles):
        context = f"control crosswalk use_pattern_profiles[{index}]"
        if not isinstance(profile, dict):
            errors.append(f"{context} must be an object")
            continue
        profile_id = profile.get("use_pattern_id")
        if profile_id not in USE_PATTERNS:
            errors.append(f"{context}: invalid use_pattern_id")
        elif profile_id in profile_ids:
            errors.append(f"duplicate use_pattern_id: {profile_id}")
        else:
            profile_ids.add(profile_id)
        expect_localized(profile, "name", context, errors)
        expect_localized(profile, "task", context, errors)
        for field in ("evaluation_focus", "threat_focus"):
            values = profile.get(field)
            if not isinstance(values, list) or not values or not all(isinstance(item, str) and item for item in values) or len(values) != len(set(values)):
                errors.append(f"{context}: {field} must be a unique non-empty string array")
    if profile_ids != USE_PATTERNS:
        errors.append("control crosswalk does not define every AI use pattern")

    sources = catalog.get("sources")
    if not isinstance(sources, list) or not sources:
        errors.append("control crosswalk sources must be a non-empty array")
        sources = []
    source_ids: set[str] = set()
    for index, source in enumerate(sources):
        context = f"control crosswalk sources[{index}]"
        if not isinstance(source, dict):
            errors.append(f"{context} must be an object")
            continue
        source_id = source.get("source_id")
        if not isinstance(source_id, str) or not re.fullmatch(r"[A-Z0-9][A-Z0-9-]+", source_id):
            errors.append(f"{context}: invalid source_id")
        elif source_id in source_ids:
            errors.append(f"duplicate source_id: {source_id}")
        else:
            source_ids.add(source_id)
        for field in ("title", "publisher", "version", "status", "url"):
            expect_string(source, field, context, errors)
        if isinstance(source.get("url"), str) and not source["url"].startswith("https://"):
            errors.append(f"{context}: url must use https")
        expect_date(source, "checked_on", context, errors)
        expect_localized(source, "use_boundary", context, errors)

    evidence_types = catalog.get("evidence_types")
    if not isinstance(evidence_types, list) or not evidence_types:
        errors.append("control crosswalk evidence_types must be a non-empty array")
        evidence_types = []
    evidence_ids: set[str] = set()
    for index, evidence in enumerate(evidence_types):
        context = f"control crosswalk evidence_types[{index}]"
        if not isinstance(evidence, dict):
            errors.append(f"{context} must be an object")
            continue
        evidence_id = evidence.get("evidence_id")
        if not isinstance(evidence_id, str) or not EVIDENCE_ID.fullmatch(evidence_id):
            errors.append(f"{context}: invalid evidence_id")
        elif evidence_id in evidence_ids:
            errors.append(f"duplicate evidence_id: {evidence_id}")
        else:
            evidence_ids.add(evidence_id)
        expect_localized(evidence, "name", context, errors)
        minimum_record = evidence.get("minimum_record")
        if not isinstance(minimum_record, list) or not minimum_record or not all(isinstance(item, str) and item for item in minimum_record):
            errors.append(f"{context}: minimum_record must be a non-empty string array")
        template = evidence.get("template")
        if template is not None:
            if not isinstance(template, str) or not (ROOT / template).is_file():
                errors.append(f"{context}: missing template: {template}")

    controls = catalog.get("controls")
    if not isinstance(controls, list) or not controls:
        errors.append("control crosswalk controls must be a non-empty array")
        controls = []
    control_ids: set[str] = set()
    covered_organizations: set[str] = set()
    for index, control in enumerate(controls):
        context = f"control crosswalk controls[{index}]"
        if not isinstance(control, dict):
            errors.append(f"{context} must be an object")
            continue
        control_id = control.get("control_id")
        if not isinstance(control_id, str) or not CONTROL_ID.fullmatch(control_id):
            errors.append(f"{context}: invalid control_id")
        elif control_id in control_ids:
            errors.append(f"duplicate control_id: {control_id}")
        else:
            control_ids.add(control_id)
        expect_localized(control, "title", context, errors)
        expect_localized(control, "objective", context, errors)
        if control.get("priority") not in PRIORITIES:
            errors.append(f"{context}: invalid priority")

        applicability = control.get("applicability")
        if not isinstance(applicability, dict):
            errors.append(f"{context}: applicability must be an object")
        else:
            for field, allowed in (
                ("organization_types", ORGANIZATION_TYPES),
                ("risk_levels", RISK_LEVELS),
                ("autonomy_levels", AUTONOMY_LEVELS),
            ):
                values = applicability.get(field)
                if not isinstance(values, list) or not values or not set(values) <= allowed or len(values) != len(set(values)):
                    errors.append(f"{context}: invalid applicability.{field}")
                elif field == "organization_types":
                    covered_organizations.update(values)
            for field, allowed in (("use_patterns", USE_PATTERNS), ("jurisdictions", JURISDICTIONS)):
                values = applicability.get(field)
                if values is not None and (not isinstance(values, list) or not values or not set(values) <= allowed or len(values) != len(set(values))):
                    errors.append(f"{context}: invalid applicability.{field}")
            conditions = applicability.get("conditions")
            if not isinstance(conditions, list) or not conditions or not all(isinstance(item, str) and item for item in conditions):
                errors.append(f"{context}: applicability.conditions must be a non-empty string array")

        phases = control.get("lifecycle_phases")
        if not isinstance(phases, list) or not phases or not set(phases) <= set(range(12)) or len(phases) != len(set(phases)):
            errors.append(f"{context}: invalid lifecycle_phases")
        gates = control.get("gates")
        if not isinstance(gates, list) or not gates or not set(gates) <= GATES or len(gates) != len(set(gates)):
            errors.append(f"{context}: invalid gates")
        mapped_evidence = control.get("evidence_ids")
        if not isinstance(mapped_evidence, list) or not mapped_evidence or not set(mapped_evidence) <= evidence_ids or len(mapped_evidence) != len(set(mapped_evidence)):
            errors.append(f"{context}: evidence_ids contain missing or duplicate references")
        source_refs = control.get("source_refs")
        if not isinstance(source_refs, list) or not source_refs:
            errors.append(f"{context}: source_refs must be a non-empty array")
        else:
            referenced_sources = [item.get("source_id") for item in source_refs if isinstance(item, dict)]
            if len(referenced_sources) != len(source_refs) or not set(referenced_sources) <= source_ids:
                errors.append(f"{context}: source_refs contain missing references")
            if len(referenced_sources) != len(set(referenced_sources)):
                errors.append(f"{context}: source_refs contain duplicates")
            if any(item.get("relation") not in {"direct", "supports", "contextual"} for item in source_refs if isinstance(item, dict)):
                errors.append(f"{context}: source_refs contain an invalid relation")
        implementation_refs = control.get("implementation_refs")
        if not isinstance(implementation_refs, list) or not implementation_refs:
            errors.append(f"{context}: implementation_refs must be a non-empty array")
        else:
            for relative in implementation_refs:
                if not isinstance(relative, str) or not (ROOT / relative).is_file():
                    errors.append(f"{context}: missing implementation_ref: {relative}")

    if covered_organizations != ORGANIZATION_TYPES:
        errors.append("control crosswalk does not cover every organization type")


def main() -> int:
    errors: list[str] = []
    check_required_files(errors)
    for relative in PUBLIC_PRESENTATION_FILES:
        text = (ROOT / relative).read_text(encoding="utf-8")
        if match := PUBLIC_LANGUAGE_MARKETING.search(text):
            errors.append(f"{relative}: remove promotional language label {match.group(0)!r}")
    check_translation_parity(errors)
    check_non_agentic_cases(errors)
    check_markdown(errors)
    check_hosting_contract(errors)
    check_register(errors)
    check_field_notes(errors)
    check_task_time_registry(errors)
    check_crosswalk(errors)
    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    markdown_count = sum(
        1
        for path in ROOT.rglob("*.md")
        if not is_ignored_repo_path(path)
    )
    print(
        f"Validation passed: {markdown_count} Markdown files, "
        f"{len(TRANSLATION_PAIRS)} paired documents, AI register, field-feedback, "
        "task-time, and control crosswalk contracts OK."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
