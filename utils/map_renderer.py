"""
MapMyCareer | Delhi NCR Geo-Spatial Job Radar
Folium Map Builder & Visualizer Module
Handles custom company logo pins, layer controls, marker clustering,
heatmap density layers, coordinate jittering, and rich styled HTML popup cards.
"""

import html
from functools import lru_cache
from typing import Dict, List, Optional
import folium
from folium.plugins import HeatMap, MarkerCluster

from .geocoder import apply_jitter

# Color palette mapping for Job Types
JOB_TYPE_COLORS: Dict[str, Dict[str, str]] = {
    "Full-time": {
        "bg": "#ECFDF5",
        "border": "#059669",
        "text": "#065F46",
        "badge_bg": "#10B981",
        "marker_color": "#10B981",
        "icon": "briefcase"
    },
    "Contract": {
        "bg": "#FFFBEB",
        "border": "#D97706",
        "text": "#92400E",
        "badge_bg": "#F59E0B",
        "marker_color": "#F59E0B",
        "icon": "handshake"
    },
    "Internship": {
        "bg": "#EEF2FF",
        "border": "#4F46E5",
        "text": "#3730A3",
        "badge_bg": "#6366F1",
        "marker_color": "#6366F1",
        "icon": "graduation-cap"
    },
    "Part-time": {
        "bg": "#ECFEFF",
        "border": "#0891B2",
        "text": "#155E75",
        "badge_bg": "#06B6D4",
        "marker_color": "#06B6D4",
        "icon": "clock"
    }
}

# Experience Level Badge Colors
EXP_LEVEL_COLORS: Dict[str, str] = {
    "Entry": "#3B82F6",
    "Mid": "#8B5CF6",
    "Senior": "#EC4899",
    "Lead": "#EF4444"
}

# Workplace Model Badge Colors
WORKPLACE_COLORS: Dict[str, str] = {
    "Hybrid": "#6366F1",
    "On-site": "#059669",
    "Remote": "#D97706"
}


@lru_cache(maxsize=4096)
def _create_job_popup_html_cached(
    job_id: str, title: str, company: str, job_type: str,
    exp_level: str, exp_yoe: str, workplace: str, hub: str,
    city: str, salary: str, apply_url: str, logo_url: str,
    skills: tuple,  # tuple of strings for hashability
    std_level: str = "", level_code: str = "", level_name: str = "",
    benchmark: str = "", levels_url: str = ""
) -> str:
    """
    LRU-cached inner implementation of popup HTML generation.
    Accepts only hashable primitives so functools.lru_cache can key on them.
    """
    jt_style = JOB_TYPE_COLORS.get(job_type, JOB_TYPE_COLORS["Full-time"])
    exp_color = EXP_LEVEL_COLORS.get(exp_level, "#6B7280")
    wp_color = WORKPLACE_COLORS.get(workplace, "#4B5563")

    exp_badge_text = f"{exp_level} ({exp_yoe})" if exp_yoe else f"{exp_level} Level"

    # Levels.fyi Badge Section
    level_tag_html = ""
    if level_code or std_level:
        badge_label = f"{std_level} · {level_code}" if level_code and std_level else (level_code or std_level)
        level_tag_html = f"""
        <span style="
            background-color: #EDE9FE;
            color: #6D28D9;
            border: 1px solid #C4B5FD;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 6px;
        " title="{html.escape(level_name)}">⚡ {html.escape(badge_label)}</span>
        """

    # Benchmark display if available
    benchmark_html = ""
    if benchmark:
        benchmark_html = f"""
        <div style="
            font-size: 10.5px;
            color: #6B7280;
            margin-top: 2px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <span>Levels.fyi Median: <b style="color:#111827;">{html.escape(benchmark)}</b></span>
            {f'<a href="{html.escape(levels_url)}" target="_blank" style="color:#2563EB;text-decoration:none;font-weight:600;font-size:10px;">Compare ↗</a>' if levels_url else ''}
        </div>
        """

    # Format skills tags
    skills_html = "".join([
        f'<span style="display:inline-block;background:#F3F4F6;color:#374151;font-size:10px;font-weight:500;'
        f'padding:2px 7px;border-radius:12px;margin:2px 2px 2px 0;border:1px solid #E5E7EB;">{html.escape(s)}</span>'
        for s in skills[:5]
    ])

    html_content = f"""
    <div style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        width: 310px;
        padding: 4px;
        color: #1F2937;
        line-height: 1.4;
    ">
        <!-- Header: Badges -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 4px;">
            <span style="
                background-color: {jt_style['badge_bg']};
                color: #FFFFFF;
                font-size: 11px;
                font-weight: 700;
                padding: 3px 8px;
                border-radius: 6px;
                letter-spacing: 0.3px;
                text-transform: uppercase;
            ">{job_type}</span>
            
            <div style="display: flex; gap: 4px; align-items: center;">
                {level_tag_html}
                <span style="
                    background-color: {wp_color}15;
                    color: {wp_color};
                    border: 1px solid {wp_color}40;
                    font-size: 10px;
                    font-weight: 600;
                    padding: 2px 6px;
                    border-radius: 6px;
                ">{workplace}</span>
                <span style="
                    background-color: {exp_color}15;
                    color: {exp_color};
                    border: 1px solid {exp_color}40;
                    font-size: 10px;
                    font-weight: 600;
                    padding: 2px 6px;
                    border-radius: 6px;
                ">{exp_badge_text}</span>
            </div>
        </div>

        <!-- Company with Logo & Job Title -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <img src="{logo_url}" alt="{company}" style="
                width: 34px;
                height: 34px;
                border-radius: 8px;
                object-fit: contain;
                background: #FFFFFF;
                border: 1px solid #E5E7EB;
                padding: 2px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            " onerror="this.src='https://img.icons8.com/color/48/domain--v1.png'"/>
            <div>
                <div style="font-size: 13px; font-weight: 700; color: #111827; line-height: 1.1;">{company}</div>
                <div style="font-size: 11px; color: #6B7280;">📍 {hub}, {city}</div>
            </div>
        </div>

        <!-- Job Title -->
        <h4 style="
            margin: 0 0 6px 0;
            font-size: 13.5px;
            font-weight: 700;
            color: #1F2937;
            line-height: 1.3;
        ">{title}</h4>

        <!-- Salary Highlight Box -->
        <div style="
            background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
            border: 1px solid #86EFAC;
            border-radius: 6px;
            padding: 6px 8px;
            margin-bottom: 8px;
        ">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 10px; color: #166534; font-weight: 600; text-transform: uppercase;">Compensation</span>
                <span style="font-size: 12px; color: #14532D; font-weight: 800;">{salary}</span>
            </div>
            {benchmark_html}
        </div>

        <!-- Skills list -->
        <div style="margin-bottom: 10px;">
            {skills_html}
        </div>

        <!-- Footer: Action Links -->
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 6px;
            border-top: 1px solid #F3F4F6;
        ">
            <span style="font-size: 10px; color: #9CA3AF;">Ref: #{job_id}</span>
            <a href="{apply_url}" target="_blank" rel="noopener noreferrer" style="
                background: #2563EB;
                color: #FFFFFF;
                text-decoration: none;
                font-size: 11px;
                font-weight: 700;
                padding: 5px 12px;
                border-radius: 6px;
                display: inline-block;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            ">Apply Now ↗</a>
        </div>
    </div>
    """
    return html_content


def create_job_popup_html(job: Dict[str, any]) -> str:
    """
    Generates a modern, high-contrast HTML popup card for a job pin with company logo.
    Delegates to the lru_cache-backed helper using flat hashable arguments.
    """
    skills = job.get("skills", [])
    return _create_job_popup_html_cached(
        job_id=html.escape(str(job.get("id", ""))),
        title=html.escape(str(job.get("title", "Software Engineer"))),
        company=html.escape(str(job.get("company", "Tech Enterprise"))),
        job_type=str(job.get("job_type", "Full-time")),
        exp_level=str(job.get("experience_level", "Mid")),
        exp_yoe=html.escape(str(job.get("experience_yoe", ""))),
        workplace=str(job.get("workplace_model", "Hybrid")),
        hub=html.escape(str(job.get("hub", "Delhi NCR Hub"))),
        city=html.escape(str(job.get("city", "Delhi NCR"))),
        salary=html.escape(str(job.get("salary_range", "Competitive"))),
        apply_url=html.escape(str(job.get("apply_url", "https://linkedin.com"))),
        logo_url=html.escape(str(job.get("company_logo", "https://img.icons8.com/color/48/domain--v1.png"))),
        skills=tuple(skills) if isinstance(skills, list) else (),
        std_level=str(job.get("standard_level", "")),
        level_code=str(job.get("level_code", "")),
        level_name=str(job.get("level_name", "")),
        benchmark=str(job.get("levels_fyi_benchmark", "")),
        levels_url=str(job.get("levels_fyi_url", "")),
    )



def create_company_marker_icon(logo_url: str, company: str, marker_color: str = "#2563EB") -> folium.DivIcon:
    """
    Creates a custom circular Map marker pin embedded with the company logo.
    """
    safe_logo = html.escape(logo_url)
    safe_company = html.escape(company)

    icon_html = f"""
    <div style="
        position: relative;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #FFFFFF;
        border: 2.5px solid {marker_color};
        box-shadow: 0 3px 6px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.15s ease;
    ">
        <img src="{safe_logo}" alt="{safe_company}" style="
            width: 22px;
            height: 22px;
            border-radius: 50%;
            object-fit: contain;
        " onerror="this.src='https://img.icons8.com/color/48/domain--v1.png'"/>
    </div>
    """
    return folium.DivIcon(
        html=icon_html,
        icon_size=(36, 36),
        icon_anchor=(18, 18),
        popup_anchor=(0, -18)
    )


def build_delhi_ncr_map(
    jobs: List[Dict[str, any]],
    visualization_mode: str = "Interactive Pin Clusters",
    center_lat: Optional[float] = None,
    center_lon: Optional[float] = None,
    zoom_start: Optional[int] = None,
    enable_jitter: bool = True,
    jitter_amount: float = 0.002
) -> folium.Map:
    """
    Builds and returns a configured Folium map with LayerControl, MarkerCluster,
    and/or HeatMap based on the requested visualization mode across Indian tech hubs.
    """
    valid_coords = [(j["lat"], j["lon"]) for j in jobs if j.get("lat") is not None and j.get("lon") is not None]

    if center_lat is None or center_lon is None:
        if valid_coords:
            # Check if jobs span multiple distant cities (e.g. NCR + Bengaluru/Hyderabad)
            lats = [c[0] for c in valid_coords]
            lons = [c[1] for c in valid_coords]
            min_lat, max_lat = min(lats), max(lats)
            min_lon, max_lon = min(lons), max(lons)
            center_lat = (min_lat + max_lat) / 2.0
            center_lon = (min_lon + max_lon) / 2.0
            zoom_start = zoom_start or (5 if (max_lat - min_lat > 3.0) else 10)
        else:
            center_lat = 20.5937
            center_lon = 78.9629
            zoom_start = zoom_start or 5

    zoom_start = zoom_start or 10

    # 1. Base Map with CartoDB Positron
    m = folium.Map(
        location=[center_lat, center_lon],
        zoom_start=zoom_start,
        tiles="CartoDB positron",
        control_scale=True,
        prefer_canvas=True
    )

    # 2. Additional Tile Layers
    folium.TileLayer(
        tiles="OpenStreetMap",
        name="Standard Street Map",
        overlay=False,
        control=True
    ).add_to(m)

    folium.TileLayer(
        tiles="CartoDB dark_matter",
        name="Dark Mode Night Map",
        overlay=False,
        control=True
    ).add_to(m)

    show_pins = "Pin" in visualization_mode or "Combined" in visualization_mode
    show_heatmap = "HeatMap" in visualization_mode or "Combined" in visualization_mode

    # 3. Add HeatMap Layer if enabled
    if show_heatmap and len(jobs) > 0:
        heat_data = []
        for job in jobs:
            lat = job.get("lat")
            lon = job.get("lon")
            if lat is not None and lon is not None:
                # Add slight weight based on experience / seniority
                weight = 1.0
                if job.get("experience_level") == "Lead":
                    weight = 1.4
                elif job.get("experience_level") == "Senior":
                    weight = 1.2
                heat_data.append([lat, lon, weight])

        if heat_data:
            HeatMap(
                heat_data,
                name="Hiring Density HeatMap",
                min_opacity=0.35,
                max_zoom=14,
                radius=25,
                blur=18,
                gradient={
                    0.2: "#38BDF8",  # Light sky blue
                    0.4: "#3B82F6",  # Blue
                    0.6: "#10B981",  # Emerald green
                    0.8: "#F59E0B",  # Amber
                    1.0: "#EF4444"   # Red intensity
                }
            ).add_to(m)

    # 4. Add Marker Cluster Layer if enabled
    if show_pins and len(jobs) > 0:
        marker_cluster = MarkerCluster(
            name="Job Openings (Company Logos)",
            spiderfyOnMaxZoom=True,
            showCoverageOnHover=False,
            zoomToBoundsOnClick=True,
            spiderfyDistanceMultiplier=1.4,
            maxClusterRadius=38
        ).add_to(m)

        for job in jobs:
            base_lat = job.get("lat")
            base_lon = job.get("lon")
            if base_lat is None or base_lon is None:
                continue

            # Apply coordinate jitter if enabled
            if enable_jitter:
                job_seed = str(job.get("id", "")) + str(job.get("title", "")) + str(job.get("company", ""))
                pin_lat, pin_lon = apply_jitter(base_lat, base_lon, max_jitter=jitter_amount, seed_str=job_seed)
            else:
                pin_lat, pin_lon = base_lat, base_lon

            job_type = job.get("job_type", "Full-time")
            jt_meta = JOB_TYPE_COLORS.get(job_type, JOB_TYPE_COLORS["Full-time"])

            popup_html = create_job_popup_html(job)
            popup = folium.Popup(popup_html, max_width=340)

            # Tooltip preview
            tooltip_text = f"<b>{html.escape(job.get('company', ''))}</b><br>{html.escape(job.get('title', ''))}<br><span style='color:#6B7280;'>{html.escape(job.get('hub', ''))}</span>"

            # Create custom company logo marker pin
            logo_url = job.get("company_logo", "https://img.icons8.com/color/48/domain--v1.png")
            company_name = job.get("company", "Company")
            custom_icon = create_company_marker_icon(
                logo_url=logo_url,
                company=company_name,
                marker_color=jt_meta["marker_color"]
            )

            folium.Marker(
                location=[pin_lat, pin_lon],
                popup=popup,
                tooltip=tooltip_text,
                icon=custom_icon
            ).add_to(marker_cluster)

    # 5. Add Layer Control for user switching
    folium.LayerControl(position="topright", collapsed=False).add_to(m)

    return m
