#!/usr/bin/env python3
import json, os, re, urllib.request, urllib.parse, random
from typing import List, Dict, Any, Optional

CITY_HUBS = {
    "Bengaluru": {"default_hub": "Outer Ring Road / Whitefield, Bengaluru", "lat": 12.9288, "lon": 77.6833},
    "Hyderabad": {"default_hub": "HITEC City / Gachibowli, Hyderabad", "lat": 17.4435, "lon": 78.3489},
    "Gurugram": {"default_hub": "DLF Cyber City, Gurugram", "lat": 28.4942, "lon": 77.0898},
    "Noida": {"default_hub": "Sector 62 / Sector 125, Noida", "lat": 28.6234, "lon": 77.3689},
    "Delhi": {"default_hub": "Aerocity Worldmark, New Delhi", "lat": 28.5502, "lon": 77.1215},
    "Pune": {"default_hub": "Hinjawadi Infotech Park, Pune", "lat": 18.5912, "lon": 73.7389},
    "Mumbai": {"default_hub": "BKC / Powai, Mumbai", "lat": 19.1558, "lon": 72.8552},
    "Chennai": {"default_hub": "OMR Tech Corridor, Chennai", "lat": 12.9648, "lon": 80.2458},
    "Kolkata": {"default_hub": "Salt Lake Sector V, Kolkata", "lat": 22.5726, "lon": 88.3639},
    "Ahmedabad": {"default_hub": "GIFT City, Ahmedabad", "lat": 23.0225, "lon": 72.5714},
    "Kochi": {"default_hub": "Infopark, Kochi", "lat": 10.0150, "lon": 76.3620},
    "Thiruvananthapuram": {"default_hub": "Technopark, Thiruvananthapuram", "lat": 8.5241, "lon": 76.9366},
    "Coimbatore": {"default_hub": "Tidel Park, Coimbatore", "lat": 11.0168, "lon": 76.9558},
    "Chandigarh": {"default_hub": "IT Park, Chandigarh", "lat": 30.7333, "lon": 76.7794}
}

COMPANY_CANONICAL_NAMES = {
    "openai": "OpenAI",
    "mongodb": "MongoDB",
    "gitlab": "GitLab",
    "fivetran": "Fivetran",
    "hashicorp": "HashiCorp",
    "thoughtspot": "ThoughtSpot",
    "postman": "Postman",
    "atlassian": "Atlassian",
    "cloudflare": "Cloudflare",
    "databricks": "Databricks",
    "snowflake": "Snowflake",
    "zscaler": "Zscaler",
    "supabase": "Supabase",
    "perplexity": "Perplexity AI",
    "hotstar": "Disney+ Hotstar",
    "mux": "Mux",
    "gemini": "Google Gemini",
}

def get_canonical_company_name(slug: str) -> str:
    return COMPANY_CANONICAL_NAMES.get(slug.lower(), slug.title())

GREENHOUSE_COMPANIES = [{"slug": c, "name": get_canonical_company_name(c), "domain": f"{c}.com"} for c in [
    "databricks", "rubrik", "mongodb", "zscaler", "inmobi", "postman", "slice", "groww", "affirm", "gusto", 
    "cloudflare", "elastic", "gitlab", "stripe", "twilio", "pinterest", "instacart", "reddit", "okta", "druva", 
    "thoughtspot", "hashicorp", "confluent", "snowflake", "airbnb", "doordash", "uber", "lyft", "fivetran"
]]

LEVER_COMPANIES = [{"slug": c, "name": get_canonical_company_name(c), "domain": f"{c}.com"} for c in [
    "hotstar", "atlassian", "mux", "palantir", "spotify", "coursera", "udemy", "netflix", "canva", "figma"
]]

ASHBY_COMPANIES = [{"slug": c, "name": get_canonical_company_name(c), "domain": f"{c}.com"} for c in [
    "notion", "docker", "linear", "ramp", "cursor", "vanta", "replit", "perplexity", "cohere", "openai", "supabase", "resend", "brex", "gemini"
]]

def fetch_json(url: str) -> Optional[Any]:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception:
        return None

def detect_experience(title: str) -> tuple[str, str, str]:
    t = title.lower()
    if any(k in t for k in ["lead", "principal", "staff", "architect", "director", "head"]): return "8+ yrs", "Lead", "L4"
    if any(k in t for k in ["senior", "sr"]): return "5-8 yrs", "Senior", "L3"
    if any(k in t for k in ["intern", "junior", "entry"]): return "0-2 yrs", "Entry", "L1"
    return "2-5 yrs", "Mid", "L2"

def get_salary_by_level(exp: str) -> tuple[str, int, int]:
    if exp == "Entry":
        return "₹8 - 16 LPA", 8, 16
    elif exp == "Mid":
        return "₹16 - 32 LPA", 16, 32
    elif exp == "Senior":
        return "₹30 - 60 LPA", 30, 60
    elif exp == "Lead":
        return "₹50 - 90 LPA", 50, 90
    return "₹18 - 36 LPA", 18, 36

def detect_skills(text: str) -> List[str]:
    t = (text or "").lower()
    if any(k in t for k in ["sdet", "qa", "quality", "test", "automation"]):
        return ["Selenium", "Playwright", "Cypress", "Python", "Test Automation", "Postman", "CI/CD"]
    if any(k in t for k in ["product manager", "product owner", "tpm", "program manager", "scrum master"]):
        return ["Product Strategy", "PRD Writing", "Agile/Scrum", "Jira", "A/B Testing", "Mixpanel", "SQL"]
    if any(k in t for k in ["designer", "ui/ux", "product design", "ux", "visual design"]):
        return ["Figma", "UI/UX", "User Research", "Wireframing", "Design Systems", "Prototyping"]
    if any(k in t for k in ["security", "cyber", "infosec", "soc", "penetration"]):
        return ["Cybersecurity", "SIEM", "Splunk", "OWASP", "Penetration Testing", "SOC", "Cloud Security"]
    if any(k in t for k in ["account executive", "sales", "bdr", "sdr", "business development"]):
        return ["Salesforce", "Enterprise Sales", "B2B Sales", "MEDDPICC", "Lead Generation", "Pipeline Management"]
    if any(k in t for k in ["customer success", "client success", "account manager", "csm"]):
        return ["Customer Success", "Salesforce", "Retention", "QBRs", "Zendesk", "Client Onboarding"]
    if any(k in t for k in ["marketing", "growth", "seo", "content", "brand"]):
        return ["Growth Marketing", "Google Analytics", "SEO", "PPC/SEM", "HubSpot", "A/B Testing"]
    if any(k in t for k in ["operations", "chief of staff", "bizops", "strategy"]):
        return ["Business Operations", "KPI Dashboards", "Process Optimization", "OKRs", "Financial Modeling"]
    if any(k in t for k in ["finance", "financial", "accounting", "fp&a", "audit", "tax"]):
        return ["Financial Modeling", "FP&A", "Variance Analysis", "Excel/VBA", "GAAP/IFRS", "NetSuite"]
    if any(k in t for k in ["recruiter", "talent", "human resources", "hr ", "people ops"]):
        return ["Technical Recruiting", "Candidate Sourcing", "Greenhouse", "ATS", "People Operations", "HRIS"]
    if any(k in t for k in ["data", "ml", "ai", "machine learning", "analytics"]):
        return ["Python", "Machine Learning", "PyTorch", "SQL", "Spark", "Databricks", "Snowflake"]
    if any(k in t for k in ["devops", "sre", "cloud", "infrastructure", "platform"]):
        return ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux", "Prometheus"]
    if any(k in t for k in ["frontend", "front end", "react", "ui "]):
        return ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript", "HTML/CSS"]
    if any(k in t for k in ["mobile", "android", "ios", "flutter"]):
        return ["React Native", "Flutter", "Swift", "Kotlin", "Mobile App Development"]
    return ["Python", "JavaScript", "React", "AWS", "SQL", "Microservices"]

FOREIGN_TITLE_PATTERNS = [
    r'\(m/w/d\)', r'\(all genders\)', r'\(m/f/d\)', r'werkstudent', r'gmbh',
    r'entwickler', r'berater', r'spezialist', r'techniker', r'leiter', r'praktikant'
]

def is_valid_title(title: str) -> bool:
    if not title:
        return False
    for pat in FOREIGN_TITLE_PATTERNS:
        if re.search(pat, title, re.IGNORECASE):
            return False
    return True

def build_job(c: Dict, title: str, url: str, loc: str, remote: bool, src: str) -> Optional[Dict[str, Any]]:
    if not is_valid_title(title):
        return None
    yoe, exp, std = detect_experience(title)
    sal_range, sal_min, sal_max = get_salary_by_level(exp)
    city_list = list(CITY_HUBS.keys())
    matched_city = "Bengaluru"
    for ct in city_list:
        if ct.lower() in (loc or "").lower():
            matched_city = ct
            break
    if remote and "Bengaluru" == matched_city:
        matched_city = random.choice(city_list)
        
    hub = CITY_HUBS[matched_city]
    company_name = c.get("name", "Tech Startup")
    return {
        "title": title, "company": company_name, "company_domain": c["domain"],
        "experience_yoe": yoe, "experience_level": exp, "job_type": "Full-time",
        "city": matched_city, "hub": hub["default_hub"],
        "lat": hub["lat"] + (random.random()-0.5)*0.01,
        "lon": hub["lon"] + (random.random()-0.5)*0.01,
        "skills": detect_skills(title), "salary_range": sal_range,
        "salary_min_lpa": sal_min, "salary_max_lpa": sal_max,
        "workplace_model": "Remote" if remote else "Hybrid", "apply_url": url,
        "source": src, "standard_level": std, "level_name": f"{exp} Engineer",
        "level_code": std, "level_tier": exp, "level_yoe_range": yoe,
        "levels_fyi_benchmark": sal_range, "levels_fyi_url": "https://www.levels.fyi"
    }

def main():
    jobs = []
    
    # 1. Greenhouse ATS
    for c in GREENHOUSE_COMPANIES:
        data = fetch_json(f"https://boards-api.greenhouse.io/v1/boards/{c['slug']}/jobs")
        if data and "jobs" in data:
            for j in data["jobs"]:
                built = build_job(c, j.get("title", ""), j.get("absolute_url", ""), j.get("location",{}).get("name",""), True, "greenhouse")
                if built:
                    jobs.append(built)
                
    # 2. Lever ATS
    for c in LEVER_COMPANIES:
        data = fetch_json(f"https://api.lever.co/v0/postings/{c['slug']}?mode=json")
        if data and isinstance(data, list):
            for j in data:
                built = build_job(c, j.get("text", ""), j.get("hostedUrl", ""), j.get("categories",{}).get("location",""), True, "lever")
                if built:
                    jobs.append(built)

    # 3. Ashby ATS
    for c in ASHBY_COMPANIES:
        data = fetch_json(f"https://api.ashbyhq.com/posting-api/job-board/{c['slug']}")
        if data and "jobs" in data:
            for j in data["jobs"]:
                built = build_job(c, j.get("title", ""), j.get("jobUrl", ""), j.get("location",""), True, "ashby")
                if built:
                    jobs.append(built)

    # 4. Global Remote verified APIs (English tech & business postings)
    data = fetch_json("https://remotive.com/api/remote-jobs")
    if data and "jobs" in data:
        for j in data["jobs"][:300]:
            built = build_job({"name": j.get("company_name", "Startup"), "domain": "remotive.com"}, j.get("title", ""), j.get("url", ""), "Remote", True, "remotive")
            if built:
                jobs.append(built)

    data = fetch_json("https://jobicy.com/api/v2/remote-jobs")
    if data and "jobs" in data:
        for j in data["jobs"][:300]:
            built = build_job({"name": j.get("companyName", "Startup"), "domain": "jobicy.com"}, j.get("jobTitle", ""), j.get("url", ""), "Remote", True, "jobicy")
            if built:
                jobs.append(built)
            
    # Load and clean existing
    existing = []
    if os.path.exists("data/sample_jobs.json"):
        raw_existing = json.load(open("data/sample_jobs.json"))
        for j in raw_existing:
            # Filter out german / arbeitnow records
            src = j.get("source", "")
            url = j.get("apply_url", "")
            title = j.get("title", "")
            if "arbeitnow" in src or "arbeitnow" in url or not is_valid_title(title):
                continue
            # Canonicalize company name if matching
            comp = j.get("company", "")
            if comp.lower() in COMPANY_CANONICAL_NAMES:
                j["company"] = COMPANY_CANONICAL_NAMES[comp.lower()]
            elif comp == comp.lower():
                j["company"] = comp.title()
            # If salary was the static placeholder, calibrate by seniority
            if j.get("salary_range") == "₹20 - 50 LPA" and j.get("experience_level"):
                sal_range, sal_min, sal_max = get_salary_by_level(j["experience_level"])
                j["salary_range"] = sal_range
                j["salary_min_lpa"] = sal_min
                j["salary_max_lpa"] = sal_max
                j["levels_fyi_benchmark"] = sal_range
            existing.append(j)
        
    urls = {x.get("apply_url") for x in existing if x.get("apply_url")}
    max_id = max([x.get("id", 0) for x in existing], default=0)
    for j in jobs:
        if j["apply_url"] not in urls:
            max_id += 1
            j["id"] = max_id
            j["company_logo"] = f"https://www.google.com/s2/favicons?domain={j['company_domain']}&sz=128"
            existing.append(j)
            urls.add(j["apply_url"])
            
    print(f"Total curated jobs: {len(existing)}")
    json.dump(existing, open("data/sample_jobs.json", "w"), indent=2)
    json.dump(existing, open("web/public/data/jobs.json", "w"), indent=2)

if __name__ == "__main__":
    main()
