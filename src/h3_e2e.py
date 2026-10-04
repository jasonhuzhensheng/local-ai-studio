"""Guarded local H3 diagnostic; run only after installation and weight verification."""
import json, os, socket, subprocess, sys, time, urllib.request, urllib.error
from pathlib import Path

BASE = Path.home() / "Library/Application Support/LocalImageStudio/video-experimental"
COMFY = BASE / "ComfyUI"
PYTHON = BASE / "venv/bin/python"
PORT = 8191
URL = f"http://127.0.0.1:{PORT}"

def api(path, data=None):
    req = urllib.request.Request(URL + path,
        data=None if data is None else json.dumps(data).encode(),
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)

def main():
    import psutil
    report = {"started_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
              "status": "running", "test": "256x256, 22 frames, 4 steps; diagnostic only"}
    target = BASE / "e2e-report.json"
    def save():
        target.write_text(json.dumps(report, indent=2))
    save()
    subprocess.run([str(PYTHON), "-m", "pip", "check"], check=True)
    probe = subprocess.run([str(PYTHON), str(Path(__file__).with_name("h3_mps_probe.py"))],
                           text=True, capture_output=True, check=True)
    report["mps_probe"] = json.loads(probe.stdout)
    assert report["mps_probe"]["checks"]["torch.bfloat16"]["passed"]
    assert (BASE / "download-verified.json").is_file(), "Weight verification not complete"
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", PORT))
    assert psutil.virtual_memory().available >= 60 * 2**30, "Need 60 GiB available for first load"
    baseline_swap = psutil.swap_memory().used
    log = (BASE / "server.log").open("w")
    process = subprocess.Popen([str(PYTHON), "main.py", "--listen", "127.0.0.1", "--port", str(PORT),
        "--disable-api-nodes", "--reserve-vram", "20", "--preview-method", "none",
        "--use-pytorch-cross-attention", "--novram"], cwd=COMFY, stdout=log, stderr=subprocess.STDOUT)
    report["server_pid"] = process.pid
    started = time.monotonic()
    report["peak_rss_bytes"] = 0
    report["min_available_bytes"] = psutil.virtual_memory().available
    report["max_swap_growth_bytes"] = 0
    def sample():
        assert process.poll() is None, "ComfyUI exited; see server.log"
        rss = psutil.Process(process.pid).memory_info().rss
        available = psutil.virtual_memory().available
        swap_growth = max(0, psutil.swap_memory().used-baseline_swap)
        report["peak_rss_bytes"] = max(report["peak_rss_bytes"], rss)
        report["min_available_bytes"] = min(report["min_available_bytes"], available)
        report["max_swap_growth_bytes"] = max(report["max_swap_growth_bytes"], swap_growth)
        if available < 16 * 2**30 or swap_growth > 4 * 2**30:
            raise RuntimeError("Conservative memory guard triggered")
    try:
        for _ in range(180):
            sample()
            try:
                info = api("/object_info")
                break
            except (urllib.error.URLError, TimeoutError):
                time.sleep(2)
        else:
            raise RuntimeError("ComfyUI startup timed out")
        (BASE / "object-info.json").write_text(json.dumps(info))
        workflow = json.loads(Path(__file__).with_name("h3_smoke_api.json").read_text())
        for item in workflow.values():
            assert item["class_type"] in info, "Missing node: " + item["class_type"]
        report["system_stats_before"] = api("/system_stats")
        prompt = api("/prompt", {"prompt": workflow, "client_id": "h3-apple-diagnostic"})
        report["prompt_response"] = prompt
        assert not prompt.get("node_errors"), prompt
        prompt_id = prompt["prompt_id"]
        generation_started = time.monotonic()
        for _ in range(7200):
            sample()
            history = api("/history/" + prompt_id)
            if prompt_id in history:
                item = history[prompt_id]
                report["history"] = item
                assert item.get("status", {}).get("status_str") == "success", item.get("status")
                break
            save()
            time.sleep(2)
        else:
            raise RuntimeError("Generation timed out after 4 hours")
        report["generation_seconds"] = time.monotonic() - generation_started
        files = sorted((COMFY / "output/h3-apple").glob("smoke*.mp4"))
        assert files, "No output video"
        import av
        with av.open(str(files[-1])) as video:
            frames = list(video.decode(video=0))
            assert len(frames) > 1
            report["video"] = {"path": str(files[-1]), "frames": len(frames),
                "width": frames[0].width, "height": frames[0].height,
                "bytes": files[-1].stat().st_size}
        report["status"] = "passed"
    except Exception as exc:
        report["status"] = "failed"
        report["error"] = str(exc)
        raise
    finally:
        report["total_seconds"] = time.monotonic()-started
        save()
        process.terminate()
        try:
            process.wait(timeout=20)
        except subprocess.TimeoutExpired:
            process.kill()
        log.close()

if __name__ == "__main__":
    main()
