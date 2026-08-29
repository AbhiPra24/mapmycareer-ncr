# 🗺️ MapMyCareer (Delhi NCR)
### *Interactive Geo-Spatial Job Exploration & Tech Radar for Delhi NCR*

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://mapmycareer.streamlit.app/)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Dataset: 100% Real](https://img.shields.io/badge/Dataset-520%2B%20Verified%20Live%20Jobs-success.svg)](data/sample_jobs.json)

**MapMyCareer** is a modern geo-spatial intelligence application designed to map, explore, and analyze **520+ verified real tech job openings** across the **Delhi National Capital Region (NCR)** — covering major innovation hubs in **Gurugram**, **Noida**, and **Delhi**.

👉 **Live Application**: [https://mapmycareer.streamlit.app/](https://mapmycareer.streamlit.app/)

---

## 🌟 Key Highlights

- 📍 **100% Verified Real Jobs**: 524 active job openings gathered from live postings across 260+ top tech employers.
- 🎯 **Precise Geo-Coordinates**: Company-specific building/campus-level latitude and longitude for accurate commuting insights.
- ⚡ **Minimalist, Map-First Interface**: Clean full-width UI with zero sidebar clutter and inline filter controls.
- 🗺️ **Multi-Layer Visualization**:
  - **Interactive Pin Clusters**: Spiderfy view on zoom with custom company logo pins.
  - **Hiring Density HeatMap**: Thermal density hotspots revealing where tech hiring is concentrated.
  - **Combined Layer**: Pins + HeatMap overlays for rich exploratory analysis.
- 📊 **Corridor Analytics & Exploration**:
  - Real-time KPI counters for active openings, top hubs, and most-in-demand skills.
  - Interactive distribution charts across cities, experience levels, workplace models, and tech stacks.
  - Instant tabular job search with one-click CSV export.

---

## 🏢 Geographic Coverage

| Region | Active Listings | Key Corridors & Tech Parks |
| :--- | :---: | :--- |
| **Gurugram** | ~62% | DLF Cyber City, CyberHub, Golf Course Road (Horizon Center), Sector 44, Udyog Vihar, Candor TechSpace, IMT Manesar |
| **Noida** | ~28% | Sector 62 (Logix & Stellar IT Parks), Sector 125–127 Corridor, Sector 132, Sector 135 (Candor), Sector 142/144 Expressway |
| **Delhi** | ~10% | Worldmark Aerocity, Okhla Industrial Area Phase III, Connaught Place, Jasola, Saket District Centre |

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
