#!/usr/bin/env python3
"""
Production Job Liveness Validator for MapMyCareer
- In-memory memoization of ATS boards (eliminates duplicate calls & 429s)
- URL normalization (strips tracking query params)
- Soft-tombstoning (requires 3 consecutive failures before pruning)
- Atomic file writes to prevent JSON corruption
"""

import json
import os
import argparse
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from collections import defaultdict
from typing import Dict, Any, List, Set, Optional

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/json,application/xhtml+xml",
}

def clean_url(url: str) -> str:
    """Strips query parameters and fragments for robust matching."""
    if not url:
        return ""
    p = urllib.parse.urlparse(url)
    return urllib.parse.urlunparse((p.scheme, p.netloc, p.path.rstrip('/'), '', '', ''))

def fetch_json(url: str, timeout: int = 10) -> Optional[Any]:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status == 200:
                return json.loads(resp.read().decode('utf-8'))
    except Exception:
        return None
    return None

class ATSBoardCache:
    """Caches board responses so each company board is fetched at most once."""
    def __init__(self):
        self.greenhouse_active_urls: Dict[str, Set[str]] = {}
        self.lever_active_urls: Dict[str, Set[str]] = {}
        self.ashby_active_urls: Dict[str, Set[str]] = {}

    def is_greenhouse_active(self, company: str, clean_apply_url: str) -> Optional[bool]:
        if company not in self.greenhouse_active_urls:
            data = fetch_json(f"https://boards-api.greenhouse.io/v1/boards/{company}/jobs")
            if not data or "jobs" not in data:
                return None  # Inconclusive / API error
            self.greenhouse_active_urls[company] = {clean_url(j.get("absolute_url", "")) for j in data["jobs"]}
        return clean_apply_url in self.greenhouse_active_urls[company]

    def is_lever_active(self, company: str, clean_apply_url: str) -> Optional[bool]:
        if company not in self.lever_active_urls:
            data = fetch_json(f"https://api.lever.co/v0/postings/{company}?mode=json")
            if not isinstance(data, list):
                return None
            self.lever_active_urls[company] = {clean_url(j.get("hostedUrl", "")) for j in data}
        return clean_apply_url in self.lever_active_urls[company]

    def is_ashby_active(self, company: str, clean_apply_url: str) -> Optional[bool]:
        if company not in self.ashby_active_urls:
            data = fetch_json(f"https://api.ashbyhq.com/posting-api/job-board/{company}")
            if not data or "jobs" not in data:
                return None
            self.ashby_active_urls[company] = {clean_url(j.get("jobUrl", "")) for j in data["jobs"]}
        return clean_apply_url in self.ashby_active_urls[company]

def check_http_status(url: str) -> Optional[bool]:
    """Fallback web check with bot-blocking awareness."""
    try:
        req = urllib.request.Request(url, headers=HEADERS, method="HEAD")
        with urllib.request.urlopen(req, timeout=8) as resp:
            return resp.status in [200, 301, 302]
    except urllib.error.HTTPError as e:
        if e.code in [404, 410]:
            return False
        if e.code in [403, 429]:
            return None  # Inconclusive (bot block / rate limit)
        return False
    except Exception:
        return None

def extract_slug(url: str, domain_pattern: str) -> str:
    parsed = urllib.parse.urlparse(url)
    parts = [p for p in parsed.path.split('/') if p]
    if "greenhouse.io" in domain_pattern:
        return parts[1] if (len(parts) > 1 and parts[0] == "embed") else (parts[0] if parts else "")
    if "lever.co" in domain_pattern or "ashbyhq.com" in domain_pattern:
        return parts[0] if parts else ""
    return ""

def validate_job(job: Dict[str, Any], cache: ATSBoardCache) -> bool:
    raw_url = job.get("apply_url", "")
    url = clean_url(raw_url)
    source = (job.get("source") or "").lower()

    result = None
    if "greenhouse" in source or "greenhouse.io" in url:
        slug = extract_slug(url, "greenhouse.io")
        if slug:
            result = cache.is_greenhouse_active(slug, url)
    elif "lever" in source or "lever.co" in url:
        slug = extract_slug(url, "lever.co")
        if slug:
            result = cache.is_lever_active(slug, url)
    elif "ashby" in source or "ashbyhq.com" in url:
        slug = extract_slug(url, "ashbyhq.com")
        if slug:
            result = cache.is_ashby_active(slug, url)

    # Fall back to HTTP check if ATS validation was inconclusive or not applicable
    if result is None:
        result = check_http_status(raw_url)

    # Default to active if still inconclusive to prevent accidental pruning
    return True if result is None else result

def atomic_save(data: Any, path: str):
    tmp_path = f"{path}.tmp"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp_path, path)

def main():
    parser = argparse.ArgumentParser(description="MapMyCareer Job Liveness Validator")
    parser.add_argument("--prune-closed", action="store_true", help="Prune jobs exceeding failure threshold")
    parser.add_argument("--max-misses", type=int, default=3, help="Failures before pruning (default: 3)")
    args = parser.parse_args()

    data_file = "data/sample_jobs.json"
    web_file = "web/public/data/jobs.json"

    if not os.path.exists(data_file):
        print(f"Data file not found: {data_file}")
        return

    with open(data_file, "r", encoding="utf-8") as f:
        jobs = json.load(f)

    print(f"Loaded {len(jobs)} jobs for liveness validation.")
    cache = ATSBoardCache()
    now_iso = datetime.now(timezone.utc).isoformat()

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(lambda j: (j, validate_job(j, cache)), jobs))

    active_count = 0
    closed_count = 0
    updated_jobs = []

    for job, is_alive in results:
        if is_alive:
            active_count += 1
            job["consecutive_misses"] = 0
            job["last_verified_at"] = now_iso
            updated_jobs.append(job)
        else:
            closed_count += 1
            job["consecutive_misses"] = job.get("consecutive_misses", 0) + 1
            if not args.prune_closed or job["consecutive_misses"] < args.max_misses:
                updated_jobs.append(job)

    print(f"Verification Results -> Active: {active_count} | Closed/Unreachable: {closed_count}")
    if args.prune_closed:
        pruned_count = len(jobs) - len(updated_jobs)
        print(f"Pruned {pruned_count} jobs exceeding {args.max_misses} misses.")

    atomic_save(updated_jobs, data_file)
    atomic_save(updated_jobs, web_file)
    print("Files successfully updated.")

if __name__ == "__main__":
    main()
