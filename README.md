# 🗺️ MapMyCareer (Delhi NCR)
### *Delhi NCR Geo-Spatial Tech Job Radar*

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://streamlit.io/)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**MapMyCareer** is a production-grade, interactive spatial intelligence application designed to map, explore, and analyze live tech and corporate job openings across the **Delhi National Capital Region (NCR)** — covering major innovation corridors in **Gurugram**, **Noida**, and **Delhi**.

---

## 🌟 Key Features

1. **Spatial Hubs & Corridors:**
   - **Gurugram (~40%):** DLF Cyber City, CyberHub, Horizon Center (Golf Course Road), Golf Course Extension, Udyog Vihar (Phases 1–5), Sector 44, Candor TechSpace (Sector 21 & Sector 48), Unitech Cyber Park (Sector 39), IMT Manesar.
   - **Noida (~35%):** Sector 62 (Logix & Stellar IT Parks), Sector 125–127 Corridor, Sector 135 (Candor TechSpace / Expressway), Sector 16/16A (Film City), Sector 142 (Advant Navis), Sector 144 (Oxygen SEZ), Sector 59.
   - **Delhi (~25%):** Worldmark Aerocity, Okhla Industrial Area Phase III, Saket District Centre, Connaught Place (Barakhamba / KG Marg), Jasola District Centre, Netaji Subhash Place (Pitampura).

2. **Advanced Geo-Spatial Visualizations (`Folium` & `Leaflet`):**
   - **CartoDB Positron Tile Styling:** Ultra-clean base map with Street and Dark Mode layers via `LayerControl`.
   - **Coordinate Jittering ($\pm 0.0020$ lat/lon):** Avoids pin collisions when multiple tech firms reside within the same office tower or tech park.
   - **Interactive Marker Clustering:** Seamless zooming with `spiderfyOnMaxZoom=True` to inspect individual tech openings.
   - **Hiring Density HeatMap:** Color-gradient thermal density map (light blue to red) identifying real-time hiring hotspots.
   - **Custom Rich HTML Popups:** Displays employment type, workplace model (Hybrid / On-site / Remote), experience level & YoE, compensation range, skill tags, and direct **"Apply Now"** action buttons.

3. **Robust Geocoding & Local Caching (`SQLite` + `Geopy`):**
   - Persistent local database (`locations.db`) caches geocoded coordinates, eliminating redundant calls and preventing Nominatim rate limits.
   - Built-in fallback coordinate dictionary ensuring 100% offline availability.

4. **Corridor Analytics & Instant Data Export:**
   - Real-time KPI metric cards (Active Opportunities, Top Tech Corridor, Leading Tech City, Top In-Demand Skill).
   - Breakdown charts for tech hubs, employment types, experience levels, and sub-city distributions.
   - Filterable data table with instant one-click CSV export (`mapmycareer_delhi_ncr_jobs.csv`).

---

## 🏛️ System Architecture

```
mapmycareer-ncr/
├── app.py                     # Streamlit frontend layout, sidebar filters & state manager
├── requirements.txt           # Production dependencies
├── .gitignore                 # Standard Python & OS ignore rules
├── README.md                  # Project documentation & setup instructions
├── data/
│   └── sample_jobs.json       # Seed dataset of 52+ realistic tech job openings across NCR
└── utils/
    ├── __init__.py            # Utility package exports
    ├── geocoder.py            # SQLite-cached geocoder with coordinate jittering
    └── map_renderer.py        # Folium map builder, layers, popups & styles
```

---

## 🚀 Local Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/<username>/mapmycareer-ncr.git
cd mapmycareer-ncr
```

### 2. Create and Activate a Virtual Environment
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

### 4. Run the Streamlit Application
```bash
streamlit run app.py
```

Open your browser and navigate to: **`http://localhost:8501`**

---

## ☁️ Streamlit Cloud Deployment Instructions

Deploying **MapMyCareer** to Streamlit Community Cloud takes less than 2 minutes:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initialize MapMyCareer Delhi NCR Job Radar"
   git branch -M main
   git remote add origin https://github.com/<your-username>/mapmycareer-ncr.git
   git push -u origin main
   ```

2. **Deploy on Streamlit Cloud:**
   - Go to [share.streamlit.io](https://share.streamlit.io/) and log in with your GitHub account.
   - Click **"New app"**.
   - Select your repository: `<your-username>/mapmycareer-ncr`.
   - Set the Branch to `main`.
   - Set the Main file path to `app.py`.
   - Click **"Deploy!"**.

---

## ⚙️ Sidebar Filters & Options

| Control | Description |
| :--- | :--- |
| **🔍 Keyword Search** | Filter roles by title, company, or tech stack (e.g. `QA`, `React`, `Python`, `Zomato`). |
| **🏙️ Region / Sub-City** | Multi-select among Gurugram, Noida, and Delhi. |
| **📍 Tech Corridor / Hub** | Dynamically filtered tech hubs based on selected cities. |
| **💼 Employment Type** | Full-time, Contract, Internship, Part-time. |
| **🏢 Workplace Model** | Filter by Hybrid, On-site, or Remote. |
| **🎯 Experience Level** | Entry (0-2 yrs), Mid (3-5 yrs), Senior (5-8 yrs), Lead (8+ yrs). |
| **🗺️ Visualization Mode** | Toggle Pin Clusters, Hiring Density HeatMap, or Combined. |
| **⚙️ Advanced Settings** | Adjust coordinate jitter spread or center map on specific tech hubs. |
| **📥 Export CSV** | Download filtered dataset directly for offline spreadsheet analysis. |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
