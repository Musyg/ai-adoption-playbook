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
REQUIRED_FILES = (
    "README.md",
    "README.fr.md",
    "LICENSE",
    "docs/universal-process.fr.md",
    "tracks/fr/independent.md",
    "tracks/fr/tpe.md",
    "tracks/fr/pme.md",
    "tracks/fr/nonprofit-foundation.md",
    "tracks/fr/public-sector.md",
    "templates/mandate.fr.md",
    "templates/use-case-card.fr.md",
    "templates/evaluation-plan.fr.md",
    "templates/incident-runbook.fr.md",
    "references/sources.md",
    "controls/README.md",
    "site/public/data/control-crosswalk.schema.json",
    "site/public/data/control-crosswalk.v1.json",
)
EXPECTED_REGISTER_COLUMNS = (
    "system_id",
    "name",
    "status",
    "owner",
    "business_process",
    "purpose",
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
    ".wrangler",
    "dist",
    "node_modules",
    "work",
}
CONTROL_ID = re.compile(r"^AAP-[A-Z]{3}-[0-9]{3}$")
EVIDENCE_ID = re.compile(r"^EV-[A-Z0-9-]+$")
ORGANIZATION_TYPES = {"independent", "tpe", "pme", "nonprofit", "public"}
RISK_LEVELS = {"R0", "R1", "R2", "R3"}
AUTONOMY_LEVELS = {"A0", "A1", "A2", "A3", "A4"}
GATES = {"G1", "G2", "G3", "G4", "G5", "P0", "P1", "P2", "P3", "P4", "P5"}
PRIORITIES = {"baseline", "strengthened", "critical"}


def check_required_files(errors: list[str]) -> None:
    for relative in REQUIRED_FILES:
        if not (ROOT / relative).is_file():
            errors.append(f"missing required file: {relative}")


def check_markdown(errors: list[str]) -> None:
    for path in sorted(ROOT.rglob("*.md")):
        if any(part in IGNORED_PARTS for part in path.parts):
            continue
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
    if catalog.get("schema_version") != "1.0.0":
        errors.append("control crosswalk schema_version must be 1.0.0")
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
            "gates": GATES,
            "lifecycle_phases": set(range(12)),
        }
        for field, expected in expected_axes.items():
            value = axes.get(field)
            if not isinstance(value, list) or set(value) != expected or len(value) != len(expected):
                errors.append(f"control crosswalk axes.{field} does not match the contract")

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
    check_markdown(errors)
    check_register(errors)
    check_crosswalk(errors)
    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    markdown_count = sum(
        1
        for path in ROOT.rglob("*.md")
        if not any(part in IGNORED_PARTS for part in path.parts)
    )
    print(
        f"Validation passed: {markdown_count} Markdown files, AI register, "
        "and control crosswalk contracts OK."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
