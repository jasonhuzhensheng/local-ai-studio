#!/usr/bin/env python3
"""Download and verify the pinned Viggle Turbo v0.2.1 adapter only."""
import hashlib
import json
import os
from pathlib import Path

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
from huggingface_hub import hf_hub_download

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "src/viggle_turbo_v021_model.json").read_text())
DEST = ROOT / ".local/image-models/viggle-qwen-turbo-v021"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    files = [
        MANIFEST["file"],
        "scheduler/scheduler_config.json",
        "LICENSE",
        "NOTICE",
        "README.md",
    ]
    for name in files:
        path = hf_hub_download(
            repo_id=MANIFEST["repository"],
            filename=name,
            revision=MANIFEST["revision"],
            local_dir=DEST,
        )
        print(f"Downloaded {name}: {path}", flush=True)

    adapter = DEST / MANIFEST["file"]
    if adapter.stat().st_size != MANIFEST["bytes"]:
        raise RuntimeError(f"Adapter size mismatch: {adapter.stat().st_size}")
    actual_hash = sha256(adapter)
    if actual_hash != MANIFEST["sha256"]:
        raise RuntimeError(f"Adapter SHA-256 mismatch: {actual_hash}")

    scheduler_path = DEST / "scheduler/scheduler_config.json"
    scheduler = json.loads(scheduler_path.read_text())
    if scheduler.get("shift_terminal", "missing") is not None:
        raise RuntimeError("Scheduler shift_terminal must be null for Viggle Turbo v0.2.1")
    marker = {
        "repository": MANIFEST["repository"],
        "revision": MANIFEST["revision"],
        "file": MANIFEST["file"],
        "bytes": adapter.stat().st_size,
        "sha256": actual_hash,
        "scheduler_shift_terminal": None,
    }
    marker_path = DEST / "verified.json"
    marker_tmp = marker_path.with_suffix(".json.tmp")
    marker_tmp.write_text(json.dumps(marker, indent=2) + "\n")
    marker_tmp.replace(marker_path)
    print(f"Verified {MANIFEST['name']} SHA-256={actual_hash}", flush=True)


if __name__ == "__main__":
    main()
