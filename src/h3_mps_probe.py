"""Small MPS kernel check; deliberately does not load full weights."""
import json, time, platform
import torch

result = {"torch": torch.__version__, "macOS": platform.mac_ver()[0],
          "mps_available": torch.backends.mps.is_available(), "checks": {}}
assert result["mps_available"], "MPS unavailable"
for dtype in (torch.float32, torch.float16, torch.bfloat16):
    start = time.perf_counter()
    try:
        a = torch.randn(64, 64, device="mps", dtype=dtype)
        b = a @ a.T
        torch.mps.synchronize()
        assert torch.isfinite(b).all().item()
        result["checks"][str(dtype)] = {"passed": True, "seconds": time.perf_counter()-start}
    except Exception as exc:
        result["checks"][str(dtype)] = {"passed": False, "error": str(exc)}
result["allocated_bytes"] = torch.mps.current_allocated_memory()
result["driver_bytes"] = torch.mps.driver_allocated_memory()
print(json.dumps(result, indent=2))
