# 🗺️ MapMyCareer (India)
### *Interactive Geo-Spatial Tech Job Discovery & CareerForge Utility Engines*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Dataset: 100% Real](https://img.shields.io/badge/Dataset-1450%2B%20Verified%20Live%20Jobs-success.svg)](data/sample_jobs.json)

**MapMyCareer** is a modern Next.js geo-spatial intelligence and career utility platform designed to map, explore, and analyze **1,450+ verified real tech job openings** across major technology corridors in India — covering innovation hubs in **Bengaluru**, **Hyderabad**, **Delhi NCR (Gurugram, Noida, Delhi)**, **Pune**, **Mumbai**, and **Chennai**.

> [!IMPORTANT]
> **100% Real Live Job Postings — No Fake Listings**:
> Every role indexed in MapMyCareer represents an active opening at verified technology employers with direct links to official company careers portals. Coordinates are mapped to exact physical office towers and tech parks.

👉 **Live Application**: [https://www.mapmycareer.online/](https://www.mapmycareer.online/)

---

## 🌟 Key Highlights

- 📍 **100% Verified Real Jobs**: 1,450+ active job openings aggregated and verified from live postings across 270+ leading tech employers.
- 🎯 **Pinpoint Campus & Office Accuracy**: Verified building-level latitude and longitude (e.g. Adobe Sector 132 Campus, Google RMZ Infinity, Microsoft Gachibowli R&D, Amazon WTC Brigade Gateway).
- ⚡ **CareerForge Non-AI Utility Engines**:
  - **100-Point ATS Heuristic Auditor**: Action verb analysis, Google XYZ metric quantification, section structure audit, and word density check with direct drag-and-drop (`.pdf`, `.docx`, `.txt`, `.md`) file parsing.
  - **Role-Tailored ATS Resume Architect**: Interactive visual form editor with split live preview, rule-based bullet quality badges, `localStorage` persistence, and 1-click export to LaTeX (`.tex`), Markdown (`.md`), and Plain Text (`.txt`).
  - **Recruiter Radar**: RFC 5322 syntax validation, unmonitored generic alias detection (`recruiting@`, `careers@`), and DNS/MX deliverability verification with personalized 3-tier outreach templates.
- 🗺️ **Interactive Geo-Spatial Map Explorer**: Powered by Leaflet with dynamic experience level clustering, company logo pins, and corridor drilldown.
- 🌙 **Modern Dark/Light Themes**: High-contrast, clean UI built with Tailwind CSS.

---

## 🏢 Geographic Coverage Across India

| Region / City | Key Corridors & Tech Parks Mapped |
| :--- | :--- |
| **Bengaluru** | Outer Ring Road (Bellandur, Devarabisanahalli, Kadubeesanahalli), Koramangala, Indiranagar, Whitefield, Manyata Tech Park, Hebbal |
| **Hyderabad** | HITEC City, Madhapur, Gachibowli Financial District, Knowledge City, Raidurgam |
| **Gurugram** | DLF Cyber City, CyberHub, Golf Course Road (Horizon Center), Sector 44, Udyog Vihar, Candor TechSpace, Sector 74A |
| **Noida** | Sector 62 (Logix & Stellar IT Parks), Sector 125–127 Corridor, Sector 132 (Adobe Campus), Sector 135 (Candor), Sector 142/144 Expressway |
| **Delhi** | Worldmark Aerocity, Okhla Industrial Area Phase III, Connaught Place, Jasola, Saket District Centre |
| **Pune** | Hinjawadi Phase 1-3, Kharadi (Eon Free Zone & Gera Commerzone), Viman Nagar, Magarpatta |
| **Mumbai** | BKC (Bandra Kurla Complex), Nirlon Knowledge Park (Goregaon), Mindspace (Malad), Navi Mumbai (RCP) |
| **Chennai** | OMR Tech Corridor (Perungudi, Sholinganallur, Kandanchavadi), Global Infocity, World Trade Center |

---

## 🏛️ Project Architecture

```
mapmycareer-ncr/
├── data/
│   └── sample_jobs.json       # Master dataset of verified real tech jobs
├── locations.db               # SQLite geocoding cache
├── utils/
│   ├── geocoder.py            # Coordinate resolution and normalization
│   └── job_ingestion_engine.py# Automated ingestion pipeline
└── web/                       # 🚀 Modern React + Next.js App Router Frontend
    ├── src/
    │   ├── app/               # Next.js App Router & /api/verify-email route
    │   ├── components/        # MapView, AtsAuditModal, ResumeBuilderModal, RecruiterValidatorModal, Header
    │   ├── lib/               # atsAuditor.ts, emailValidator.ts, latexTemplates.ts, resumeParser.ts
    │   └── types/             # TypeScript Job & Resume interfaces
    ├── public/data/jobs.json  # Static web dataset
    ├── package.json
    └── next.config.ts
```

---

## 🚀 Quickstart: Running the Next.js App

### 1. Clone the Repository
```bash
git clone https://github.com/AbhiPra24/mapmycareer-ncr.git
cd mapmycareer-ncr/web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `web`.
4. Deploy! Next.js automatically builds and runs serverless with zero external AI dependencies.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps & GIS**: [React-Leaflet](https://react-leaflet.js.org/) / [Leaflet.js](https://leafletjs.com/)
- **Career Utility Engines**: TypeScript ports of CareerForge ATS Auditor, LaTeX Generator & Recruiter Radar
- **Document Parsers**: `pdfjs-dist` (PDF text extraction), `mammoth` (DOCX extraction)
- **Email Verification**: Node.js DNS/MX Promises API

---

## 📄 License
Distributed under the [MIT License](LICENSE).
