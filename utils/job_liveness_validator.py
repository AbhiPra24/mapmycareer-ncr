#!/usr/bin/env python3
"""
Job Liveness Validator for MapMyCareer
Checks active status of existing jobs and prunes closed or stale ones.
"""

import json
import os
import argparse
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, Any, List

def fetch_json(url: str, timeout: int = 8) -> Dict[Any, Any]:
    headers = {"User-Agent": "MapMyCareer-Validator/1.0"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.status == 200:
                return json.loads(response.read().decode('utf-8'))
    except Exception:
        pass
    return {}

def check_greenhouse_liveness(apply_url: str) -> bool:
    # Example: https://boards.greenhouse.io/cloudflare/jobs/12345
    parts = apply_url.rstrip('/').split('/')
    if len(parts) >= 5 and "greenhouse.io" in apply_url:
        company_slug = parts[3]
        job_id = parts[5] if len(parts) > 5 else parts[4]
        if "jobs" in company_slug:
            company_slug = parts[4] if len(parts) > 4 else ""
        if company_slug:
            data = fetch_json(f"https://boards-api.greenhouse.io/v1/boards/{company_slug}/jobs")
            if data and "jobs" in data:
                return any(str(j.get("id")) == job_id or j.get("absolute_url") == apply_url for j in data["jobs"])
    return check_web_liveness(apply_url)

def check_lever_liveness(apply_url: str) -> bool:
    # Example: https://jobs.lever.co/hotstar/job-id-uuid
    parts = apply_url.rstrip('/').split('/')
    if len(parts) >= 4 and "lever.co" in apply_url:
        company_slug = parts[3]
        data = fetch_json(f"https://api.lever.co/v0/postings/{company_slug}?mode=json")
        if isinstance(data, list):
            return any(j.get("hostedUrl") == apply_url for j in data)
    return check_web_liveness(apply_url)

def check_ashby_liveness(apply_url: str) -> bool:
    # Example: https://jobs.ashbyhq.com/notion/uuid
    parts = apply_url.rstrip('/').split('/')
    if len(parts) >= 4 and "ashbyhq.com" in apply_url:
        company_slug = parts[3]
        data = fetch_json(f"https://api.ashbyhq.com/posting-api/job-board/{company_slug}")
        if data and "jobs" in data:
            return any(j.get("jobUrl") == apply_url for j in data["jobs"])
    return check_web_liveness(apply_url)

def check_web_liveness(apply_url: str) -> bool:
    if not apply_url or not apply_url.startswith("http"):
        return False
    headers = {"User-Agent": "MapMyCareer-Liveness/1.0"}
    try:
        req = urllib.request.Request(apply_url, headers=headers, method="HEAD")
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status in [200, 301, 302, 307, 308]
    except Exception:
        try:
            req = urllib.request.Request(apply_url, headers=headers)
            with urllib.request.urlopen(req, timeout=5) as response:
                return response.status == 200
        except Exception:
            return False

def check_job(job: Dict[str, Any]) -> bool:
    url = job.get("apply_url", "")
    source = job.get("source", "")
    if "greenhouse" in source or "greenhouse.io" in url:
        return check_greenhouse_liveness(url)
    elif "lever" in source or "lever.co" in url:
        return check_lever_liveness(url)
    elif "ashby" in source or "ashbyhq" in url:
        return check_ashby_liveness(url)
    else:
        return check_web_liveness(url)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-all", action="store_true", help="Check all jobs")
    parser.add_argument("--prune-closed", action="store_true", help="Remove closed jobs")
    parser.add_argument("--dry-run", action="store_true", help="Do not save changes")
    parser.add_argument("--stats", action="store_true", help="Show stats")
    args = parser.parse_args()

    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    primary_data_path = os.path.join(root_dir, 'data', 'sample_jobs.json')
    web_data_path = os.path.join(root_dir, 'web', 'public', 'data', 'jobs.json')
    
    if not os.path.exists(primary_data_path):
        root_dir = os.getcwd()
        primary_data_path = os.path.join(root_dir, 'data', 'sample_jobs.json')
        web_data_path = os.path.join(root_dir, 'web', 'public', 'data', 'jobs.json')

    if not os.path.exists(primary_data_path):
        print(f"Data file not found at {primary_data_path}")
        return

    with open(primary_data_path, 'r', encoding='utf-8') as f:
        jobs = json.load(f)

    if not args.check_all and not args.stats:
        print("Please provide --check-all or --stats")
        return

    print(f"Total jobs before validation: {len(jobs)}")
    
    active_jobs = []
    closed_jobs = []

    with ThreadPoolExecutor(max_workers=20) as executor:
        future_to_job = {executor.submit(check_job, job): job for job in jobs}
        for future in as_completed(future_to_job):
            job = future_to_job[future]
            try:
                is_active = future.result()
                if is_active:
                    active_jobs.append(job)
                else:
                    closed_jobs.append(job)
            except Exception as e:
                # Assume active if error occurs during check to avoid false pruning
                active_jobs.append(job)

    if args.stats:
        print(f"Stats:")
        print(f"  Active jobs: {len(active_jobs)}")
        print(f"  Closed jobs: {len(closed_jobs)}")

    if args.prune_closed and not args.dry_run:
        print(f"Pruning {len(closed_jobs)} closed jobs.")
        with open(primary_data_path, 'w', encoding='utf-8') as f:
            json.dump(active_jobs, f, indent=2, ensure_ascii=False)
        with open(web_data_path, 'w', encoding='utf-8') as f:
            json.dump(active_jobs, f, indent=2, ensure_ascii=False)
        print("Data files updated.")
    elif args.dry_run:
        print("Dry run mode. No changes saved.")

if __name__ == '__main__':
    main()
