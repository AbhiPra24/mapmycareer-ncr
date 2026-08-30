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
# Cached Map Builder — keyed on serialised filter state
# ---------------------------------------------------------
@st.cache_data(show_spinner=False)
def get_cached_map_html(filtered_records_json: str, visualization_mode: str) -> str:
    """
    Builds the Folium map and returns its rendered HTML string.
    Cached so identical filter combinations skip a full map rebuild.
    Using HTML string (vs Map object) avoids pickle issues with folium.
    """
    import json as _json
    records = _json.loads(filtered_records_json)
    m = build_delhi_ncr_map(
        jobs=records,
        visualization_mode=visualization_mode,
        center_lat=28.5355,
        center_lon=77.2500,
        zoom_start=10,
        enable_jitter=True,
        jitter_amount=0.0020,
    )
    return m._repr_html_()

# ---------------------------------------------------------
# Page Config — wide, no sidebar
# ---------------------------------------------------------
st.set_page_config(
    page_title="MapMyCareer · India Tech Radar",
    page_icon="🗺️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ---------------------------------------------------------
# Global CSS — minimal, clean & Dark Mode Resilient
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
    letter-spacing: -0.4px;
}
.nav-logo span { color: #2563EB; }
.nav-badge {
    font-size: 11px;
    background: rgba(37, 99, 235, 0.08);
    color: #2563EB;
    border: 1px solid rgba(191, 219, 254, 0.6);
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
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(229, 231, 235, 0.8);
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
}
@media (prefers-color-scheme: dark) {
    .stat-pill {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(71, 85, 105, 0.5);
        color: #E2E8F0;
    }
    .stat-pill b {
        color: #F8FAFC !important;
    }
}

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

/* Fix text color & placeholder contrast across Light & Dark modes */
div[data-testid="stTextInput"] input {
    font-size: 13px !important;
    border-radius: 8px !important;
    color: inherit !important;
}
div[data-testid="stTextInput"] input::placeholder {
    color: #9CA3AF !important;
    opacity: 1 !important;
}
div[data-testid="stMultiSelect"] > div {
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
    <div class="nav-logo">🗺️ Map<span>My</span>Career <span style="color:#6B7280;font-weight:400;font-size:13px;">· India Tech Radar</span></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <span class="nav-badge">🏢 {total_companies} Companies</span>
        <span class="nav-badge">📍 {total_hubs} Tech Hubs</span>
        <span class="nav-badge">💼 {len(df_all)} Verified Live Openings</span>
    </div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Inline Filter Bar (no sidebar)
# ---------------------------------------------------------
f_col1, f_col2, f_col3, f_col4, f_col5, f_col6 = st.columns([2, 1.4, 1.2, 1.2, 1.2, 1.2])

with f_col1:
    st.caption("🔍 Search")
    search_query = st.text_input(
        "🔍 Search",
        placeholder="Role, company, skill, city…",
        label_visibility="collapsed"
    )

with f_col2:
    st.caption("🏙️ City")
    city_opts = sorted(df_all["city"].unique().tolist()) if not df_all.empty else ["Gurugram", "Noida", "Delhi"]
    selected_cities = st.multiselect(
        "City",
        options=city_opts,
        default=city_opts,
        placeholder="All cities",
        label_visibility="collapsed"
    )

with f_col3:
    st.caption("🎯 Level")
    exp_opts = ["Entry", "Mid", "Senior", "Lead"]
    selected_exp = st.multiselect(
        "Level",
        options=exp_opts,
        default=exp_opts,
        placeholder="All levels",
        label_visibility="collapsed"
    )

with f_col4:
    st.caption("💼 Type")
    jtype_opts = sorted(df_all["job_type"].unique().tolist()) if not df_all.empty else ["Full-time", "Contract", "Internship", "Part-time"]
    selected_jtypes = st.multiselect(
        "Type",
        options=jtype_opts,
        default=jtype_opts,
        placeholder="All types",
        label_visibility="collapsed"
    )

with f_col5:
    st.caption("🏢 Workplace")
    wp_opts = sorted(df_all["workplace_model"].unique().tolist()) if not df_all.empty else ["Hybrid", "On-site", "Remote"]
    selected_wp = st.multiselect(
        "Workplace",
        options=wp_opts,
        default=wp_opts,
        placeholder="All models",
        label_visibility="collapsed"
    )

with f_col6:
    st.caption("🗺️ Map Layer")
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
    <div class="stat-pill" title="{top_hub}">🏢 Hottest hub: <b>{top_hub[:38]}{'…' if len(top_hub) > 38 else ''}</b></div>
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
        # Build map via cached HTML — instant on repeated filter combos
        with st.spinner("Building map…"):
            map_html = get_cached_map_html(
                filtered_records_json=json.dumps(filtered_records, sort_keys=True),
                visualization_mode=vis_mode,
            )
        st.components.v1.html(map_html, height=620, scrolling=False)

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
        st.info("⚠️ No data available for the current filter selection. Try widening your city, level, or type filters.")


with tab_table:
    st.markdown("##### 📋 All Openings")
    if not filtered_df.empty:
        # Determine available columns
        candidate_cols = [
            ("company", "Company"),
            ("title", "Role"),
            ("standard_level", "Std Level"),
            ("level_code", "Company Level"),
            ("city", "City"),
            ("hub", "Office / Tech Park"),
            ("experience_level", "Tier"),
            ("experience_yoe", "YoE"),
            ("job_type", "Type"),
            ("workplace_model", "Workplace"),
            ("salary_range", "Listed Salary"),
            ("levels_fyi_benchmark", "Levels.fyi Median")
        ]
        active_cols = [c for c, _ in candidate_cols if c in filtered_df.columns]
        rename_dict = {c: label for c, label in candidate_cols if c in filtered_df.columns}

        display_df = filtered_df[active_cols].rename(columns=rename_dict)
        st.dataframe(display_df, hide_index=True, use_container_width=True)

        csv = filtered_df.to_csv(index=False).encode("utf-8")
        st.download_button(
            "📥 Export CSV",
            data=csv,
            file_name="mapmycareer_ncr_jobs.csv",
            mime="text/csv"
        )
    else:
        st.info("⚠️ No results for the current filters. Try widening your search or removing some filter selections.")

# ---------------------------------------------------------
# Footer
# ---------------------------------------------------------
st.markdown("""
<div style="text-align:center;font-size:11px;color:#6B7280;padding:16px 0 8px 0;border-top:1px solid #F3F4F6;margin-top:10px;">
    MapMyCareer · Delhi NCR · Built with Streamlit &amp; Folium
</div>
""", unsafe_allow_html=True)
