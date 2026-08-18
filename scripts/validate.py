#!/usr/bin/env python3
"""Dependency-free integrity checks for the playbook repository."""

from __future__ import annotations

import csv
import re
import sys
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


def check_required_files(errors: list[str]) -> None:
    for relative in REQUIRED_FILES:
        if not (ROOT / relative).is_file():
            errors.append(f"missing required file: {relative}")


def check_markdown(errors: list[str]) -> None:
    for path in sorted(ROOT.rglob("*.md")):
        if ".git" in path.parts:
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


def main() -> int:
    errors: list[str] = []
    check_required_files(errors)
    check_markdown(errors)
    check_register(errors)
    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    markdown_count = sum(1 for _ in ROOT.rglob("*.md"))
    print(f"Validation passed: {markdown_count} Markdown files and register contract OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
