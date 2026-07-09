#!/usr/bin/env python3
"""Generate an image via OpenAI gpt-image-1.

Usage:
    python generate-openai.py --prompt "..." --output PATH [--size 1024x1536] [--quality medium]
"""

import argparse
import base64
import http.client
import json
import os
import ssl
import sys
import time
from pathlib import Path

API_HOST = "api.openai.com"
API_PATH = "/v1/images/generations"

VALID_SIZES = {"1024x1024", "1536x1024", "1024x1536", "auto"}
VALID_QUALITY = {"low", "medium", "high", "auto"}


def _post_with_chunked_read(body, api_key, timeout=300):
    """POST to OpenAI Images API and read full response in chunks.

    Avoids the IncompleteRead errors seen with urllib.urlopen().read() on
    large (multi-MB) base64 image responses on Python 3.14 / Windows.
    """
    ctx = ssl.create_default_context()
    conn = http.client.HTTPSConnection(API_HOST, timeout=timeout, context=ctx)
    try:
        conn.request(
            "POST",
            API_PATH,
            body=body,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
                "Accept": "application/json",
            },
        )
        resp = conn.getresponse()
        status = resp.status
        chunks = []
        while True:
            chunk = resp.read(65536)
            if not chunk:
                break
            chunks.append(chunk)
        return status, b"".join(chunks)
    finally:
        conn.close()


def generate(prompt, output_path, size, quality, api_key, model="gpt-image-2", max_retries=2):
    body = json.dumps({
        "model": model,
        "prompt": prompt,
        "size": size,
        "quality": quality,
        "n": 1,
    }).encode("utf-8")

    last_err = None
    for attempt in range(max_retries + 1):
        try:
            status, raw = _post_with_chunked_read(body, api_key)
            break
        except (http.client.IncompleteRead, http.client.RemoteDisconnected, ConnectionError, TimeoutError) as e:
            last_err = e
            if attempt < max_retries:
                wait = 2 ** attempt
                print(json.dumps({"retry": True, "attempt": attempt + 1, "wait": wait, "reason": str(e)}), file=sys.stderr)
                time.sleep(wait)
                continue
            print(json.dumps({"error": True, "message": f"network failure after {max_retries + 1} attempts: {e}"}))
            sys.exit(1)

    if status != 200:
        try:
            err_body = raw.decode("utf-8")
        except Exception:
            err_body = "<binary>"
        print(json.dumps({"error": True, "status": status, "message": err_body}))
        sys.exit(1)

    try:
        result = json.loads(raw.decode("utf-8"))
    except Exception as e:
        print(json.dumps({"error": True, "message": f"json parse failed: {e}", "preview": raw[:500].decode('utf-8', 'replace')}))
        sys.exit(1)

    data = result.get("data", [])
    if not data or "b64_json" not in data[0]:
        print(json.dumps({"error": True, "message": "no image returned", "raw": result}))
        sys.exit(1)

    img_bytes = base64.b64decode(data[0]["b64_json"])
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(img_bytes)

    usage = result.get("usage", {})
    print(json.dumps({
        "path": output_path,
        "size": size,
        "quality": quality,
        "usage": usage,
    }, indent=2))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--prompt", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--size", default="1024x1536", choices=VALID_SIZES)
    p.add_argument("--quality", default="medium", choices=VALID_QUALITY)
    p.add_argument("--model", default="gpt-image-2")
    p.add_argument("--api-key", default=None)
    args = p.parse_args()

    key = args.api_key or os.environ.get("OPENAI_API_KEY")
    if not key:
        print(json.dumps({"error": True, "message": "OPENAI_API_KEY not set"}))
        sys.exit(1)

    generate(args.prompt, args.output, args.size, args.quality, key, model=args.model)


if __name__ == "__main__":
    main()
