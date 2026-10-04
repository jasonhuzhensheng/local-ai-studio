import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from local_model_files import require_resident_files, require_resident_tree


class ResidencyTests(unittest.TestCase):
    def test_local_file(self):
        with tempfile.TemporaryDirectory() as directory:
            (Path(directory) / "model.safetensors").write_bytes(b"test")
            require_resident_tree(directory)

    def test_placeholder(self):
        with patch.object(Path, "stat", return_value=SimpleNamespace(st_flags=0x40008060)):
            with self.assertRaisesRegex(RuntimeError, "LOCAL_MODEL_NOT_RESIDENT"):
                require_resident_files([Path("model.safetensors")])

    def test_missing_file(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(FileNotFoundError):
                require_resident_files([Path(directory) / "missing"])


if __name__ == "__main__":
    unittest.main()
