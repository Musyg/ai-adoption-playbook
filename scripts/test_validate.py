"""Regression coverage for source-only repository discovery."""
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


if __name__ == "__main__":
    unittest.main()
