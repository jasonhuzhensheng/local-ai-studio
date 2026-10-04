"""Real offline Metal acceptance: generated red square, packed vs separate readouts."""
import json
import math
from pathlib import Path
import subprocess
import sys

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
fixture = ROOT / ".local/qevi-smoke.png"
image = Image.new("RGB", (384, 384), "white")
ImageDraw.Draw(image).rectangle((85, 85, 300, 300), fill="red")
image.save(fixture)
statements = ["There is a red square in this image.",
              "There is a person in this image.",
              "There is a blue circle in this image."]
command = [sys.executable, str(ROOT / "src/qevi_classify.py"), str(fixture), "--verify-separate"]
for statement in statements:
    command.extend(["--statement", statement])
completed = subprocess.run(command, capture_output=True, text=True, timeout=300)
print(completed.stderr, file=sys.stderr)
if completed.returncode:
    raise SystemExit(completed.returncode)
result = json.loads(completed.stdout)
for row, expected in zip(result["results"], ["Yes", "No", "No"]):
    probabilities = row["probabilities"]
    assert all(math.isfinite(p) and 0 <= p <= 1 for p in probabilities.values())
    assert abs(sum(probabilities.values())-1) < 1e-6
    assert max(probabilities, key=probabilities.get) == expected, row
assert len(result["results"]) == 3
assert result["device"] == "mps"
assert result["verification"]["predictions_match"]
assert result["verification"]["max_probability_difference"] < 0.02
(ROOT / ".local/qevi-acceptance.json").write_text(json.dumps(result, indent=2)+"\n")
print(json.dumps(result, indent=2))
