"""
MapMyCareer | Delhi NCR Geo-Spatial Job Radar
Minimal, sidebar-free Streamlit App — Map + Inline Filters only.
"""

import json
import os
from typing import Dict, List
import pandas as pd
import streamlit as st

try:
    from streamlit_folium import st_folium
except ImportError:
    st_folium = None

from utils.geocoder import GeoCoder, apply_jitter
from utils.map_renderer import build_delhi_ncr_map

# ---------------------------------------------------------
# Page Config — wide, no sidebar
# ---------------------------------------------------------
st.set_page_config(
    page_title="MapMyCareer · Delhi NCR",
    page_icon="🗺️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ---------------------------------------------------------
# Global CSS — minimal, clean
# ---------------------------------------------------------
st.markdown("""
<style>
/* Hide Streamlit boilerplate */
#MainMenu, footer, header { visibility: hidden; }
[data-testid="collapsedControl"] { display: none; }
section[data-testid="stSidebar"] { display: none; }

/* Zero body padding */
.block-container { padding: 1rem 1.5rem 0.5rem !important; max-width: 100% !important; }

/* Navbar */
.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0 12px 0;
    border-bottom: 1px solid #E5E7EB;
    margin-bottom: 14px;
}
.nav-logo {
    font-size: 18px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.4px;
}
.nav-logo span { color: #2563EB; }
.nav-badge {
    font-size: 11px;
    background: #EFF6FF;
    color: #2563EB;
    border: 1px solid #BFDBFE;
    border-radius: 20px;
    padding: 3px 10px;
    font-weight: 600;
}

/* Filter row */
.filter-bar {
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

/* Stat pills */
.stat-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
}
.stat-pill {
    background: #FFFFFF;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
}
.stat-pill b { color: #111827; font-size: 15px; }

/* Legend */
.legend-row {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    font-size: 11.5px;
    color: #6B7280;
    flex-wrap: wrap;
}
.legend-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 4px;
}

/* Streamlit multiselect + text_input tweaks */
div[data-testid="stMultiSelect"] > div,
div[data-testid="stTextInput"] > div > div {
    border-radius: 8px !important;
    font-size: 13px !important;
}

/* Tab styling */
button[data-baseweb="tab"] {
    font-size: 13px !important;
    font-weight: 600 !important;
}
</style>
""", unsafe_allow_html=True)


# ---------------------------------------------------------
# Data Loading
# ---------------------------------------------------------
@st.cache_data(show_spinner=False)
def load_jobs() -> List[Dict]:
    data_path = os.path.join(os.path.dirname(__file__), "data", "sample_jobs.json")
    if not os.path.exists(data_path):
        return []
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


@st.cache_resource
def get_geocoder() -> GeoCoder:
    db_path = os.path.join(os.path.dirname(__file__), "locations.db")
    return GeoCoder(db_path=db_path)


raw_jobs = load_jobs()
df_all = pd.DataFrame(raw_jobs)
geocoder = get_geocoder()

# ---------------------------------------------------------
# Navbar
# ---------------------------------------------------------
total_companies = df_all["company"].nunique() if not df_all.empty else 0
total_hubs = df_all["hub"].nunique() if not df_all.empty else 0

st.markdown(f"""
<div class="nav-bar">
    <div class="nav-logo">🗺️ Map<span>My</span>Career <span style="color:#6B7280;font-weight:400;font-size:13px;">· Delhi NCR</span></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <span class="nav-badge">🏢 {total_companies} Companies</span>
        <span class="nav-badge">📍 {total_hubs} Tech Hubs</span>
        <span class="nav-badge">💼 {len(df_all)} Openings</span>
    </div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Inline Filter Bar (no sidebar)
# ---------------------------------------------------------
f_col1, f_col2, f_col3, f_col4, f_col5, f_col6 = st.columns([2, 1.4, 1.2, 1.2, 1.2, 1.2])

with f_col1:
    search_query = st.text_input(
        "🔍 Search",
        placeholder="Role, company, skill, city…",
        label_visibility="collapsed"
    )

with f_col2:
    city_opts = ["Gurugram", "Noida", "Delhi"]
    city_opts = [c for c in city_opts if c in df_all["city"].unique()] if not df_all.empty else city_opts
    selected_cities = st.multiselect(
        "City",
        options=city_opts,
        default=city_opts,
        placeholder="All cities",
        label_visibility="collapsed"
    )

with f_col3:
    exp_opts = ["Entry", "Mid", "Senior", "Lead"]
    selected_exp = st.multiselect(
        "Level",
        options=exp_opts,
        default=exp_opts,
        placeholder="All levels",
        label_visibility="collapsed"
    )

with f_col4:
    jtype_opts = sorted(df_all["job_type"].unique().tolist()) if not df_all.empty else ["Full-time", "Contract", "Internship", "Part-time"]
    selected_jtypes = st.multiselect(
        "Type",
        options=jtype_opts,
        default=jtype_opts,
        placeholder="All types",
        label_visibility="collapsed"
    )

with f_col5:
    wp_opts = sorted(df_all["workplace_model"].unique().tolist()) if not df_all.empty else ["Hybrid", "On-site", "Remote"]
    selected_wp = st.multiselect(
        "Workplace",
        options=wp_opts,
        default=wp_opts,
        placeholder="All models",
        label_visibility="collapsed"
    )

with f_col6:
    vis_mode = st.selectbox(
        "Map Layer",
        options=["Combined (Pins + HeatMap)", "Interactive Pin Clusters", "Hiring Density HeatMap"],
        index=0,
        label_visibility="collapsed"
    )


# ---------------------------------------------------------
# Filtering Logic
# ---------------------------------------------------------
filtered_df = df_all.copy()

if selected_cities:
    filtered_df = filtered_df[filtered_df["city"].isin(selected_cities)]
if selected_exp:
    filtered_df = filtered_df[filtered_df["experience_level"].isin(selected_exp)]
if selected_jtypes:
    filtered_df = filtered_df[filtered_df["job_type"].isin(selected_jtypes)]
if selected_wp and "workplace_model" in filtered_df.columns:
    filtered_df = filtered_df[filtered_df["workplace_model"].isin(selected_wp)]
if search_query and search_query.strip():
    q = search_query.strip().lower()
    def _matches(row):
        return (
            q in str(row.get("title", "")).lower() or
            q in str(row.get("company", "")).lower() or
            q in str(row.get("hub", "")).lower() or
            q in str(row.get("city", "")).lower() or
            q in " ".join([str(s).lower() for s in row.get("skills", [])])
        )
    filtered_df = filtered_df[filtered_df.apply(_matches, axis=1)]

filtered_records = filtered_df.to_dict(orient="records")
total_openings = len(filtered_records)

# ---------------------------------------------------------
# Quick Stats Row
# ---------------------------------------------------------
top_hub = filtered_df["hub"].mode()[0] if not filtered_df.empty else "—"
top_city = filtered_df["city"].mode()[0] if not filtered_df.empty else "—"
if not filtered_df.empty:
    all_skills_flat = [s for sl in filtered_df["skills"] if isinstance(sl, list) for s in sl]
    top_skill = pd.Series(all_skills_flat).mode()[0] if all_skills_flat else "—"
else:
    top_skill = "—"

st.markdown(f"""
<div class="stat-row">
    <div class="stat-pill">💼 <b>{total_openings}</b> openings <span style="color:#9CA3AF;font-weight:400;">of {len(df_all)}</span></div>
    <div class="stat-pill">🏙️ Top city: <b>{top_city}</b></div>
    <div class="stat-pill">🏢 Hottest hub: <b>{top_hub[:38]}{'…' if len(top_hub) > 38 else ''}</b></div>
    <div class="stat-pill">🔥 Top skill: <b>{top_skill}</b></div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Tabs: Map | Analytics | Table
# ---------------------------------------------------------
tab_map, tab_analytics, tab_table = st.tabs(["🗺️ Map", "📊 Analytics", "📋 Explorer"])

with tab_map:
    if total_openings == 0:
        st.info("⚠️ No jobs match the current filters. Try widening your search.")
    else:
        delhi_map = build_delhi_ncr_map(
            jobs=filtered_records,
            visualization_mode=vis_mode,
            center_lat=28.5355,
            center_lon=77.2500,
            zoom_start=10,
            enable_jitter=True,
            jitter_amount=0.0020,
        )

        if st_folium is not None:
            st_folium(delhi_map, width="100%", height=620, returned_objects=[])
        else:
            delhi_map.save("map_fallback.html")
            with open("map_fallback.html", "r", encoding="utf-8") as f:
                st.components.v1.html(f.read(), height=620)

        # Legend
        st.markdown("""
        <div class="legend-row">
            <div><span class="legend-dot" style="background:#10B981;"></span>Full-time</div>
            <div><span class="legend-dot" style="background:#F59E0B;"></span>Contract</div>
            <div><span class="legend-dot" style="background:#6366F1;"></span>Internship</div>
            <div><span class="legend-dot" style="background:#06B6D4;"></span>Part-time</div>
            <span style="color:#D1D5DB;">|</span>
            <span style="font-style:italic;">Click any pin to see role details and apply.</span>
        </div>
        """, unsafe_allow_html=True)


with tab_analytics:
    if total_openings > 0:
        c1, c2 = st.columns(2)
        with c1:
            st.markdown("##### 🏢 Top Companies Hiring")
            comp_counts = filtered_df["company"].value_counts().head(15).reset_index()
            comp_counts.columns = ["Company", "Openings"]
            st.bar_chart(comp_counts.set_index("Company"), color="#2563EB", height=340)

        with c2:
            st.markdown("##### 📍 Top Tech Corridors")
            hub_counts = filtered_df["hub"].value_counts().head(15).reset_index()
            hub_counts.columns = ["Hub", "Openings"]
            st.bar_chart(hub_counts.set_index("Hub"), color="#10B981", height=340)

        c3, c4, c5 = st.columns(3)
        with c3:
            st.markdown("##### 🎯 Experience Breakdown")
            exp_counts = filtered_df["experience_level"].value_counts().reset_index()
            exp_counts.columns = ["Level", "Count"]
            st.bar_chart(exp_counts.set_index("Level"), color="#8B5CF6", height=260)

        with c4:
            st.markdown("##### 🏙️ By City")
            city_counts = filtered_df["city"].value_counts().reset_index()
            city_counts.columns = ["City", "Count"]
            st.bar_chart(city_counts.set_index("City"), color="#EC4899", height=260)

        with c5:
            st.markdown("##### 🏢 Workplace Model")
            wp_counts = filtered_df["workplace_model"].value_counts().reset_index()
            wp_counts.columns = ["Model", "Count"]
            st.bar_chart(wp_counts.set_index("Model"), color="#F59E0B", height=260)

        # Skills bar chart
        if not filtered_df.empty:
            st.markdown("##### 🔥 Top 20 In-Demand Skills")
            skills_series = pd.Series([
                s for sl in filtered_df["skills"] if isinstance(sl, list) for s in sl
            ]).value_counts().head(20)
            st.bar_chart(skills_series, color="#0D9488", height=300)
    else:
        st.info("No data available for the current filter selection.")


with tab_table:
    st.markdown("##### 📋 All Openings")
    if not filtered_df.empty:
        display_cols = ["company", "title", "city", "hub", "experience_level", "experience_yoe", "job_type", "workplace_model", "salary_range"]
        display_df = filtered_df[display_cols].rename(columns={
            "company": "Company",
            "title": "Role",
            "city": "City",
            "hub": "Office / Tech Park",
            "experience_level": "Level",
            "experience_yoe": "YoE",
            "job_type": "Type",
            "workplace_model": "Workplace",
            "salary_range": "Salary"
        })
        st.dataframe(display_df, hide_index=True, use_container_width=True)

        csv = filtered_df.to_csv(index=False).encode("utf-8")
        st.download_button(
            "📥 Export CSV",
            data=csv,
            file_name="mapmycareer_ncr_jobs.csv",
            mime="text/csv"
        )
    else:
        st.info("No results for the current filters.")

# ---------------------------------------------------------
# Footer
# ---------------------------------------------------------
st.markdown("""
<div style="text-align:center;font-size:11px;color:#D1D5DB;padding:16px 0 8px 0;border-top:1px solid #F3F4F6;margin-top:10px;">
    MapMyCareer · Delhi NCR · Built with Streamlit &amp; Folium
</div>
""", unsafe_allow_html=True)
