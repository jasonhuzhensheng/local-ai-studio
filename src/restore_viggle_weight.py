"""Resume the existing 12-part weight repair via HTTP/1.1; verify before activation."""
import hashlib
import json
import os
import ssl
import sys
from pathlib import Path
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.request import Request, urlopen


def restore(manifest):
    # The system Python certificate location is unset on this Mac. Use the
    # existing Homebrew CA bundle, keeping certificate/hostname checks enabled.
    ca_bundle = Path('/opt/homebrew/etc/openssl@3/cert.pem')
    tls = ssl.create_default_context(cafile=str(ca_bundle) if ca_bundle.exists() else None)
    item = manifest["pending"][-1]
    target = Path(manifest["destination"]) / item["path"]
    size = item["size"]
    part_size = (size + 11) // 12
    parts = Path(str(target) + ".parts")
    parts.mkdir(exist_ok=True)
    repository = manifest.get("repository", "Qwen/Qwen-Image-2.1")
    url = ("https://huggingface.co/" + repository + "/resolve/"
           + item["revision"] + "/" + item["path"])

    def fetch(index):
        part = parts / str(index)
        begin, end = index * part_size, min(size, (index + 1) * part_size) - 1
        expected = end - begin + 1
        for attempt in range(8):
            have = part.stat().st_size if part.exists() else 0
            if have == expected:
                return index
            if have > expected:
                raise ValueError(f"oversized part {index}")
            start = begin + have
            try:
                request = Request(url, headers={"Range": f"bytes={start}-{end}"})
                with urlopen(request, timeout=45, context=tls) as response:
                    if response.status != 206 or response.headers.get("Content-Range") != f"bytes {start}-{end}/{size}":
                        raise ValueError(f"unexpected range response for part {index}")
                    with part.open("ab") as output:
                        remaining = expected - have
                        while remaining:
                            data = response.read(min(1024 * 1024, remaining))
                            if not data:
                                raise OSError("incomplete response")
                            output.write(data)
                            output.flush()
                            remaining -= len(data)
                return index
            except (OSError, ValueError) as error:
                print(f"PART_RETRY {index} attempt={attempt + 1} {type(error).__name__}", flush=True)
                if attempt == 7:
                    raise
                time.sleep(min(2 ** attempt, 15))

    with ThreadPoolExecutor(max_workers=4) as pool:
        for future in as_completed([pool.submit(fetch, i) for i in range(12)]):
            print("PART_COMPLETE", future.result(), flush=True)
    digest = hashlib.sha256()
    temporary = Path(str(target) + ".partial")
    with temporary.open("wb") as output:
        for index in range(12):
            with (parts / str(index)).open("rb") as source:
                for block in iter(lambda: source.read(8 * 1024 * 1024), b""):
                    digest.update(block)
                    output.write(block)
    if temporary.stat().st_size != size or digest.hexdigest() != item["hash"]:
        raise ValueError("restored weight failed size/SHA256 verification; not activated")
    os.replace(temporary, target)
    # Keep verified parts until rollout succeeds; they permit recovery without re-download.
    print("WEIGHT_SHA256_VERIFIED", digest.hexdigest(), flush=True)


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    manifest = Path(sys.argv[1]) if len(sys.argv) > 1 else root / ".local/viggle-storage-restore.json"
    restore(json.loads(manifest.read_text()))
