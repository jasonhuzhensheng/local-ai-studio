"""Local Qevi-2B packed image classification; run with .local/viggle-env/bin/python."""
import argparse
import json
import os
from pathlib import Path
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / ".local/qevi-model"
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", type=Path)
    parser.add_argument("--statement", action="append", required=True,
                        help="English statement to evaluate; repeat for multiple questions")
    parser.add_argument("--device", choices=["mps", "cpu"], default="mps")
    parser.add_argument("--max-pixels", type=int, default=262144)
    parser.add_argument("--verify-separate", action="store_true",
                        help="Compare packed probabilities with independent forward passes")
    args = parser.parse_args()
    if not 1 <= len(args.statement) <= 30:
        parser.error("Use 1–30 statements")
    if any(not s.strip() or len(s) > 1000 for s in args.statement):
        parser.error("Each statement must contain 1–1000 characters")
    if not 65536 <= args.max_pixels <= 1048576:
        parser.error("max-pixels must be between 65536 and 1048576")
    import torch
    from PIL import Image, ImageOps
    from transformers import AutoProcessor, Qwen3VLForConditionalGeneration

    if args.device == "mps" and not torch.backends.mps.is_available():
        parser.error("Metal unavailable in this process; run in a normal macOS terminal or use --device cpu")
    sys.path.insert(0, str(MODEL))
    from qevi import build_readouts, forward_logits, noul_question, softmax

    with Image.open(args.image) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
    started = time.perf_counter()
    print("Loading local Qevi-2B…", file=sys.stderr, flush=True)
    model = Qwen3VLForConditionalGeneration.from_pretrained(
        MODEL, dtype=torch.bfloat16 if args.device == "mps" else torch.float32,
        attn_implementation="sdpa", local_files_only=True,
    ).to(args.device).eval()
    model.config.use_cache = False
    processor = AutoProcessor.from_pretrained(MODEL, local_files_only=True)
    processor.image_processor.size = {"shortest_edge": 65536, "longest_edge": args.max_pixels}
    readouts = build_readouts(processor.tokenizer,
                              [(noul_question(s), ["Yes", "No"]) for s in args.statement])

    def sync():
        if args.device == "mps":
            torch.mps.synchronize()

    sync()
    load_seconds = time.perf_counter() - started
    print("Classifying image…", file=sys.stderr, flush=True)
    started = time.perf_counter()
    logits = forward_logits(model, processor, image, readouts)
    sync()
    elapsed = time.perf_counter() - started
    probabilities = [softmax(row) for row in logits]
    result = {
        "model": "MeerDevelopment/Qevi-2B",
        "revision": "9a0f5ec8654598ed0c5a819daf6b4ecce749a190",
        "device": args.device, "max_pixels": args.max_pixels,
        "load_seconds": round(load_seconds, 3),
        "packed_seconds": round(elapsed, 3),
        "results": [{"statement": s, "probabilities": dict(zip(["Yes", "No"], p))}
                    for s, p in zip(args.statement, probabilities)],
    }
    if args.verify_separate:
        started = time.perf_counter()
        separate = [softmax(forward_logits(model, processor, image, [r])[0]) for r in readouts]
        sync()
        delta = max(abs(a-b) for packed, single in zip(probabilities, separate)
                    for a, b in zip(packed, single))
        result["verification"] = {"separate_seconds": round(time.perf_counter()-started, 3),
                                  "max_probability_difference": delta,
                                  "predictions_match": all((p[0] >= p[1]) == (s[0] >= s[1])
                                                           for p, s in zip(probabilities, separate))}
    print(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
