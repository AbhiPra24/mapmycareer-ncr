# 🗺️ MapMyCareer (India)
### *Interactive Geo-Spatial Job Exploration & Tech Radar for Tech Hubs Across India*

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://www.mapmycareer.online/)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Dataset: 100% Real](https://img.shields.io/badge/Dataset-1450%2B%20Verified%20Live%20Jobs-success.svg)](data/sample_jobs.json)

**MapMyCareer** is an interactive geo-spatial intelligence platform designed to map, explore, and analyze **1,450+ verified real tech job openings** across major technology corridors in **India** — covering innovation hubs in **Bengaluru**, **Hyderabad**, **Delhi NCR (Gurugram, Noida, Delhi)**, **Pune**, **Mumbai**, and **Chennai**.

> [!IMPORTANT]
> **100% Real Live Job Postings — No Fake Listings**:
> Every role indexed in MapMyCareer represents an active, genuine opening at verified technology employers with direct links to official company careers portals and job boards. Coordinates are mapped to exact physical office towers and tech parks.

👉 **Live Application**: [https://www.mapmycareer.online/](https://www.mapmycareer.online/)

---

## 🌟 Key Highlights

- 📍 **100% Verified Real Jobs**: 560+ active job openings aggregated and verified from live postings across 270+ leading tech employers.
- 🎯 **Pinpoint Campus & Office Accuracy**: Verified building-level latitude and longitude (e.g. Adobe Sector 132 Campus, Google RMZ Infinity, Microsoft Gachibowli R&D, Amazon WTC Brigade Gateway) for realistic commuting insights.
- ⚡ **Levels.fyi Standardized Comp Ladders**: Integrated career level bands (e.g. L1 ASE to L6+ Principal SWE) and real-time market compensation benchmarks.
- 🌙 **Resilient Dark & Light Mode**: High-contrast, clean UI engineered for legibility across text inputs, dropdowns, and map layers.
- 🗺️ **Multi-Layer Visualization**:
  - **Interactive Pin Clusters**: Spiderfy view on zoom with custom company logo pins.
  - **Hiring Density HeatMap**: Thermal density hotspots revealing where tech hiring is concentrated.
  - **Combined Layer**: Pins + HeatMap overlays for rich exploratory analysis.
- 📊 **Corridor Analytics & Exploration**:
  - Real-time KPI counters for active openings, top hubs, and most-in-demand skills.
  - Interactive distribution charts across cities, experience levels, workplace models, and tech stacks.
  - Instant tabular job search with one-click CSV export.

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
├── app.py                     # Streamlit frontend (Python) with Folium map
├── requirements.txt           # Python dependencies
├── data/
│   └── sample_jobs.json       # Dataset of verified real jobs with coordinates
├── utils/
│   ├── geocoder.py            # Geocoder & coordinate jittering
│   └── map_renderer.py        # Folium Leaflet builder
└── web/                       # 🚀 Modern React + Next.js App Router Frontend
    ├── src/
    │   ├── app/               # Next.js App Router (page.tsx, layout.tsx)
    │   ├── components/        # MapView, FilterBar, JobCard, JobDetailsModal, Header
    │   ├── types/             # TypeScript Job & Filter interfaces
    │   └── lib/               # Fast client-side fuzzy search & filter engine
    ├── public/data/jobs.json  # Web static dataset
    ├── package.json
    └── vercel.json            # 1-Click Vercel Deployment configuration
```

---

## 🚀 Running the Next.js Web App (Vercel Ready)

```bash
cd web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the split-screen interactive web app.

### 🌐 Deploying to Vercel
1. Push your repository to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `web`.
4. Deploy! It automatically builds and serves on Vercel Edge CDN with zero configuration.

---

## 🚀 Quickstart & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AbhiPra24/mapmycareer-ncr.git
cd mapmycareer-ncr
```

### 2. Create and Activate Virtual Environment
```bash
# macOS / Linux:
python3 -m venv venv
source venv/bin/activate

# Windows:
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Application
```bash
streamlit run app.py
```

Access the app in your browser at **`http://localhost:8501`**.

---

## 🛠️ Tech Stack

- **Frontend & App Framework**: [Streamlit](https://streamlit.io/)
- **Mapping & Spatial Layers**: [Folium](https://python-visualization.github.io/folium/) / [Leaflet.js](https://leafletjs.com/)
- **Data Engineering & Manipulation**: [Pandas](https://pandas.pydata.org/)
- **Geocoding & Persistence**: SQLite + [Geopy](https://geopy.readthedocs.io/)

---

## 📄 License
Distributed under the [MIT License](LICENSE).
