"""Fetch pinned public Qevi files and verify weights before enabling them."""
from concurrent.futures import ThreadPoolExecutor
import hashlib
from pathlib import Path
import time

REPO = "MeerDevelopment/Qevi-2B"
REVISION = "9a0f5ec8654598ed0c5a819daf6b4ecce749a190"
SIZE = 4255140312
SHA = "b1984bf9c7df57d317759e046d23399b8300ab4365c52aacc4aeb5bbadc20232"
DEST = Path(__file__).resolve().parents[1] / ".local/qevi-model"


def digest(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(8 * 1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def main():
    import httpx
    from huggingface_hub import snapshot_download
    DEST.mkdir(parents=True, exist_ok=True)
    snapshot_download(REPO, revision=REVISION, local_dir=DEST,
                      ignore_patterns=["model.safetensors"])
    target = DEST / "model.safetensors"
    if target.exists():
        if target.stat().st_size != SIZE or digest(target) != SHA:
            raise RuntimeError("Existing model failed verification")
        print("Verified existing weights", flush=True)
        return
    partial = DEST / "model.safetensors.part"
    prefix = partial.stat().st_size if partial.exists() else 0
    if prefix > SIZE:
        raise RuntimeError("Partial download exceeds expected size")
    # Resume one contiguous prefix, fetch its remainder in independent ranges.
    ranges = [(prefix + (SIZE-prefix)*i//8, prefix + (SIZE-prefix)*(i+1)//8 - 1)
              for i in range(8)]

    def fetch(item):
        start, end = item
        path = DEST / f"range-{start}-{end}.part"
        if end < start:
            return path
        for attempt in range(5):
            offset = path.stat().st_size if path.exists() else 0
            if offset == end-start+1:
                return path
            if offset > end-start+1:
                raise RuntimeError("Oversized range")
            try:
                with httpx.stream("GET", f"https://huggingface.co/{REPO}/resolve/{REVISION}/model.safetensors?part={start}",
                                  headers={"Range": f"bytes={start+offset}-{end}"},
                                  follow_redirects=True, timeout=90) as response:
                    response.raise_for_status()
                    expected = f"bytes {start+offset}-{end}/{SIZE}"
                    if response.headers.get("content-range") != expected:
                        raise RuntimeError("Server did not honor byte range")
                    with path.open("ab") as output:
                        for block in response.iter_bytes(1024 * 1024):
                            output.write(block)
                if path.stat().st_size != end-start+1:
                    raise RuntimeError("Incomplete range")
                print(f"Completed range {start}–{end}", flush=True)
                return path
            except Exception:
                if attempt == 4:
                    raise
                time.sleep(2 ** attempt)

    with ThreadPoolExecutor(max_workers=8) as pool:
        parts = list(pool.map(fetch, ranges))
    # Leave resumable source files intact until the full assembled file verifies.
    combined = DEST / "model.safetensors.assembled"
    with combined.open("wb") as output:
        for path in ([partial] if prefix else []) + [p for p in parts if p.exists()]:
            with path.open("rb") as source:
                for block in iter(lambda: source.read(8 * 1024 * 1024), b""):
                    output.write(block)
    if combined.stat().st_size != SIZE or digest(combined) != SHA:
        raise RuntimeError("Model checksum mismatch; not enabled")
    combined.replace(target)
    for path in [partial] + parts:
        path.unlink(missing_ok=True)
    print(f"VERIFIED {SIZE} bytes SHA256 {SHA}", flush=True)


if __name__ == "__main__":
    main()
