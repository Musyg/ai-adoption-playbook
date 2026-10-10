"""Regression coverage for repository discovery and system register integrity."""
import csv
import io
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import validate


class RepositoryDiscoveryTests(unittest.TestCase):
    def test_keeps_source_files_and_prunes_generated_trees(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            files = [
                "README.md", "docs/nested/example.md", "data/record.json",
                "site/node_modules/package/README.md", ".git/README.md",
                "site/test-results/failure/error-context.md",
                "site/playwright-report/report.md", "site/static-dist/page.md",
            ]
            for relative in files:
                path = root / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("fixture\n", encoding="utf-8")
            with patch.object(validate, "ROOT", root):
                self.assertCountEqual(
                    [path.relative_to(root).as_posix() for path in validate.repo_files("*.md")],
                    ["README.md", "docs/nested/example.md"],
                )
                self.assertEqual(len(validate.repo_files()), 3)
                self.assertTrue(validate.is_ignored_repo_path(root / "site/test-results/result.json"))


class SystemRegisterTests(unittest.TestCase):
    def setUp(self):
        self.example = dict(zip(validate.EXPECTED_REGISTER_COLUMNS, (
            "AI-001", "Example assistant", "proposed", "Process owner",
            "Customer support", "Draft replies", "generation", "copilot",
            "base_model", "text", "supplier_saas", "real_time", "copilot",
            "model", "none", "yes", "draft_only", "Example provider",
            "Example model", "Public data", "Customers", "R1", "A1",
            "required", "CH;EU", "2026-08-20", "2026-11-20", "docs/example-decision",
        )))

    def csv_text(self, records, header=None):
        output = io.StringIO(newline="")
        writer = csv.writer(output)
        writer.writerow(header if header is not None else validate.EXPECTED_REGISTER_COLUMNS)
        for record in records:
            writer.writerow([record[field] for field in validate.EXPECTED_REGISTER_COLUMNS])
        return output.getvalue()

    def check_text(self, text):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            register = root / "templates" / "ai-system-register.csv"
            register.parent.mkdir()
            register.write_text(text, encoding="utf-8", newline="")
            errors = []
            with patch.object(validate, "ROOT", root):
                validate.check_register(errors)
            return errors

    def test_repository_example_matches_every_column(self):
        register = validate.ROOT / "templates" / "ai-system-register.csv"
        with register.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.reader(handle))
        self.assertEqual(tuple(rows[0]), validate.EXPECTED_REGISTER_COLUMNS)
        self.assertEqual(len(rows[1]), len(rows[0]))
        self.assertEqual(dict(zip(rows[0], rows[1])), self.example)
        errors = []
        validate.check_register(errors)
        self.assertEqual(errors, [])

    def test_accepts_valid_rows_and_quoted_multiline_values(self):
        example = {**self.example, "name": "Assistant, internal",
                   "purpose": "Draft replies\nfor review", "use_patterns": "generation;retrieval"}
        second = {**self.example, "system_id": "AI-002"}
        self.assertEqual(self.check_text(self.csv_text([example, second])), [])

    def test_accepts_bom_blank_lines_and_values_not_known_yet(self):
        example = {**self.example, **dict.fromkeys(("work_mode", "architecture",
            "risk_level", "autonomy_level", "last_review", "next_review"), "")}
        self.assertEqual(self.check_text("\ufeff" + self.csv_text([example]) + "\n"), [])

    def test_rejects_original_26_value_row(self):
        output = io.StringIO(newline="")
        writer = csv.writer(output)
        writer.writerow(validate.EXPECTED_REGISTER_COLUMNS)
        writer.writerow([value for field, value in self.example.items()
                         if field not in {"work_mode", "architecture"}])
        self.assertIn("expected 28 fields, found 26", "\n".join(self.check_text(output.getvalue())))

    def test_rejects_extra_column_and_reports_later_rows(self):
        text = self.csv_text([self.example]).rstrip("\r\n") + ",extra\n"
        second = {**self.example, "system_id": "AI-002", "risk_level": "required"}
        text += self.csv_text([second]).split("\r\n", 1)[1]
        errors = "\n".join(self.check_text(text))
        self.assertIn("expected 28 fields, found 29", errors)
        self.assertIn("invalid risk_level", errors)

    def test_rejects_invalid_header(self):
        errors = self.check_text(self.csv_text([self.example], list(reversed(validate.EXPECTED_REGISTER_COLUMNS))))
        self.assertEqual(errors, ["AI system register columns do not match the contract"])

    def test_rejects_unknown_single_values(self):
        for field, invalid in (("work_mode", "none"), ("architecture", "yes"),
                ("risk_level", "R4"), ("autonomy_level", "A5"), ("user_facing", "maybe")):
            with self.subTest(field=field):
                errors = self.check_text(self.csv_text([{**self.example, field: invalid}]))
                self.assertIn(f"invalid {field}", "\n".join(errors))

    def test_rejects_invalid_multiple_values(self):
        for field, invalid in (("use_patterns", "generation;unknown"),
                ("use_patterns", "generation;generation"), ("use_patterns", "generation;"),
                ("jurisdictions", "CH;UK"), ("jurisdictions", "CH;CH")):
            with self.subTest(field=field, value=invalid):
                errors = self.check_text(self.csv_text([{**self.example, field: invalid}]))
                self.assertIn(f"invalid {field}", "\n".join(errors))

    def test_rejects_invalid_review_dates(self):
        for field in ("last_review", "next_review"):
            for invalid in ("2026-02-30", "20260820", "20/08/2026", "CH;EU"):
                with self.subTest(field=field, value=invalid):
                    errors = self.check_text(self.csv_text([{**self.example, field: invalid}]))
                    self.assertIn(f"{field} must use a valid YYYY-MM-DD date", "\n".join(errors))

    def test_rejects_reversed_review_dates(self):
        errors = self.check_text(self.csv_text([{**self.example, "next_review": "2026-08-19"}]))
        self.assertIn("next_review must not precede last_review", "\n".join(errors))

    def test_rejects_duplicate_and_empty_identifiers(self):
        errors = self.check_text(self.csv_text([self.example, self.example,
            {**self.example, "system_id": ""}]))
        self.assertIn("duplicate system_id AI-001", "\n".join(errors))
        self.assertIn("system_id must be non-empty", "\n".join(errors))

    def test_rejects_unterminated_quoted_value_without_crashing(self):
        text = self.csv_text([]) + 'AI-001,"unterminated\n'
        self.assertIn("cannot be read as UTF-8 CSV", "\n".join(self.check_text(text)))


if __name__ == "__main__":
    unittest.main()
