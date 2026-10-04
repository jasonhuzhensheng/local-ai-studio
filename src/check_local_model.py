"""Check LM Studio connectivity, generation, and native function calling."""

import argparse
import json
import time
import urllib.request


def request(base, path, payload=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        base.rstrip("/") + path,
        data=data,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=180) as response:
        return json.load(response)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:1234")
    parser.add_argument("--model", default="qwen3.8-27b-local")
    args = parser.parse_args()
    models = request(args.base_url, "/v1/models")
    ids = [item["id"] for item in models["data"]]
    if args.model not in ids:
        raise RuntimeError(f"Expected {args.model!r}; server lists {ids!r}")
    start = time.monotonic()
    common = {"model": args.model, "temperature": 0, "max_tokens": 256}
    chat = request(args.base_url, "/v1/chat/completions", {
        **common,
        "messages": [{"role": "user", "content": "Reply with exactly LOCAL_OK"}],
    })
    content = chat["choices"][0]["message"].get("content", "")
    if "LOCAL_OK" not in content:
        raise RuntimeError(f"Unexpected generation: {content!r}")
    tools = [{"type": "function", "function": {
        "name": "read_project_file",
        "description": "Read a project file by relative path.",
        "parameters": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
            "additionalProperties": False,
        },
    }}]
    result = request(args.base_url, "/v1/chat/completions", {
        **common,
        "messages": [{"role": "user", "content":
            "Use read_project_file to read src/calculator.py. Do not guess its contents."}],
        "tools": tools,
        "tool_choice": "auto",
    })
    calls = result["choices"][0]["message"].get("tool_calls", [])
    if len(calls) != 1:
        raise RuntimeError(f"Expected one native tool call, received: {result!r}")
    function = calls[0]["function"]
    if function["name"] != "read_project_file":
        raise RuntimeError(f"Unexpected function: {function!r}")
    if json.loads(function["arguments"]) != {"path": "src/calculator.py"}:
        raise RuntimeError(f"Unexpected tool arguments: {function!r}")
    print(json.dumps({
        "model": args.model, "chat": "passed", "native_tool_selection": "passed",
        "seconds": round(time.monotonic() - start, 2),
        "note": "Only checks API tool selection; Cline file editing and command execution require a separate test.",
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
