export interface CorridorConfig {
  slug: string;
  citySlug: string;
  cityDisplayName: string;
  displayName: string;
  shortName: string;
  hubKeywords: string[];
  lat: number;
  lon: number;
  metroLines: string[];
  primaryTowers: string[];
  avgSalaryRange: string;
  description: string;
  faqSnippet: {
    question: string;
    answer: string;
  };
}

export const TECH_CORRIDORS: Record<string, CorridorConfig> = {
  'dlf-cyber-city': {
    slug: 'dlf-cyber-city',
    citySlug: 'gurugram',
    cityDisplayName: 'Gurugram',
    displayName: 'DLF Cyber City & Cyber Hub',
    shortName: 'Cyber City',
    hubKeywords: ['cyber city', 'cyber hub', 'dlf phase 2', 'dlf phase 3', 'tower 8c', 'building 14', 'infinity towers'],
    lat: 28.494389,
    lon: 77.090163,
    metroLines: ['Rapid Metro (Cyber City & Moulsari Ave Stations)', 'Delhi Metro Yellow Line (Sikanderpur Interchange)'],
    primaryTowers: ['Building 8A/8B/8C', 'Building 10A/10B/10C', 'Building 14', 'Infinity Towers', 'Cyber Hub SEZ'],
    avgSalaryRange: '₹14L - ₹48L',
    description: 'Premier Northern India tech corridor hosting multinational technology centers, enterprise SaaS headquarters, and fintech engineering hubs in Gurugram.',
    faqSnippet: {
      question: 'How to get a software engineering job in DLF Cyber City?',
      answer: '1. Target major campus employers (Microsoft IDC, American Express, Accenture, Zomato, Blinkit).\n2. Plan commute via Delhi Metro Yellow Line to Sikanderpur Rapid Metro interchange.\n3. Calibrate salary expectations to Gurugram benchmarks (SDE-1: ₹10-18L, SDE-2: ₹22-42L, Staff/Lead: ₹45-85L).\n4. Apply directly to active ATS career portals to bypass recruiter latency.',
    },
  },
  'outer-ring-road': {
    slug: 'outer-ring-road',
    citySlug: 'bengaluru',
    cityDisplayName: 'Bengaluru',
    displayName: 'Outer Ring Road (ORR) Tech Corridor',
    shortName: 'ORR Bangalore',
    hubKeywords: ['outer ring road', 'prestige tech park', 'cessna', 'bellandur', 'ecospace', 'marathahalli'],
    lat: 12.9352,
    lon: 77.6946,
    metroLines: ['Upcoming Namma Metro Blue Line (ORR-Airport corridor)', 'Direct BMTC Vajra AC feeder buses'],
    primaryTowers: ['Prestige Tech Park', 'Ecospace Business Park', 'Cessna Business Park', 'Embassy TechVillage', 'Bagmane Constellation'],
    avgSalaryRange: '₹18L - ₹65L',
    description: 'The highest concentration of tier-1 software companies, global capability centers (GCCs), and deep-tech unicorns in India.',
    faqSnippet: {
      question: 'What is the average tech salary along Bangalore Outer Ring Road (ORR)?',
      answer: 'Entry-level engineers average ₹12–20 LPA, SDE-2 roles range from ₹26–48 LPA, while Senior/Staff engineers at tier-1 GCCs command ₹55–95 LPA plus US equity/RSUs.',
    },
  },
  'whitefield': {
    slug: 'whitefield',
    citySlug: 'bengaluru',
    cityDisplayName: 'Bengaluru',
    displayName: 'Whitefield IT Park Corridor',
    shortName: 'Whitefield',
    hubKeywords: ['whitefield', 'itpb', 'international tech park', 'hoodi', 'kadugodi'],
    lat: 12.9850,
    lon: 77.7315,
    metroLines: ['Namma Metro Purple Line (Whitefield Kadugodi & Hopefarm Channasandra)'],
    primaryTowers: ['International Tech Park Bangalore (ITPB)', 'Sigma Tech Park', 'Brigade Tech Park', 'EPIP Zone'],
    avgSalaryRange: '₹15L - ₹52L',
    description: 'Heritage IT corridor with world-class tech parks and seamless Purple Line metro connectivity to central Bengaluru.',
    faqSnippet: {
      question: 'How accessible is Whitefield for daily tech commutes?',
      answer: 'With the fully operational Namma Metro Purple Line connecting Majestic and Indiranagar to Whitefield (Kadugodi) in under 45 minutes, Whitefield commute times have been halved compared to road traffic.',
    },
  },
  'hitec-city': {
    slug: 'hitec-city',
    citySlug: 'hyderabad',
    cityDisplayName: 'Hyderabad',
    displayName: 'HITEC City & Gachibowli Tech Corridor',
    shortName: 'HITEC City',
    hubKeywords: ['hitec city', 'gachibowli', 'financial district', 'mindspace', 'knowledge city', 'madhapur', 'rayadurgam'],
    lat: 17.4435,
    lon: 78.3772,
    metroLines: ['Hyderabad Metro Blue Line (Raidurg & Hitec City Stations)'],
    primaryTowers: ['Mindspace IT Park', 'Knowledge City (Salarpuria Sattva)', 'Cyber Towers', 'Financial District Nanakramguda', 'Amazon Campus'],
    avgSalaryRange: '₹14L - ₹50L',
    description: 'The epicenter of Hyderabad tech growth, housing major hyperscalers, US product GCCs, and enterprise software giants.',
    faqSnippet: {
      question: 'Why are tech companies moving to Hyderabad HITEC City and Financial District?',
      answer: 'World-class arterial flyovers, metro terminus access at Raidurg, lower residential rentals compared to Bengaluru/Mumbai, and state-of-the-art SEZ tech infrastructure.',
    },
  },
  'sector-62': {
    slug: 'sector-62',
    citySlug: 'noida',
    cityDisplayName: 'Noida',
    displayName: 'Sector 62 & Greater Noida Expressway',
    shortName: 'Noida Sec 62 / Exp',
    hubKeywords: ['sector 62', 'sector 125', 'sector 135', 'candor', 'stellar it park', 'expressway'],
    lat: 28.6280,
    lon: 77.3649,
    metroLines: ['Delhi Metro Blue Line (Noida Electronic City & Sector 62 Stations)', 'Aqua Line Metro'],
    primaryTowers: ['Stellar IT Park', 'Candor Techspace (Sec 135)', 'Logix Cyber Park', 'Advant Navis Business Park'],
    avgSalaryRange: '₹11L - ₹38L',
    description: 'North India major software services and enterprise consulting hub with direct metro connectivity into central Delhi.',
    faqSnippet: {
      question: 'What tech roles dominate Noida Sector 62?',
      answer: 'Full-stack engineering (Java, .NET, React, Python), cloud operations, enterprise ERP consulting (SAP, Salesforce), and system integration delivery.',
    },
  },
  'hinjawadi': {
    slug: 'hinjawadi',
    citySlug: 'pune',
    cityDisplayName: 'Pune',
    displayName: 'Hinjawadi Rajiv Gandhi Infotech Park',
    shortName: 'Hinjawadi',
    hubKeywords: ['hinjawadi', 'infotech park', 'phase 1', 'phase 2', 'phase 3', 'kharadi'],
    lat: 18.5913,
    lon: 73.7389,
    metroLines: ['Upcoming Pune Metro Line 3 (Hinjawadi to Shivajinagar)'],
    primaryTowers: ['Rajiv Gandhi Infotech Park Phase 1-3', 'Quadron Business Park', 'Embassy TechZone'],
    avgSalaryRange: '₹12L - ₹42L',
    description: 'Pune primary automotive tech, fintech engineering, and software R&D hub spread across scenic rolling hills.',
    faqSnippet: {
      question: 'What is the living cost vs tech salary trade-off in Pune Hinjawadi?',
      answer: 'Hinjawadi offers 30-40% lower rent and living expenses compared to Mumbai and central Bengaluru, allowing junior to mid-level engineers to save a significantly higher percentage of net take-home salary.',
    },
  },
  'bkc': {
    slug: 'bkc',
    citySlug: 'mumbai',
    cityDisplayName: 'Mumbai',
    displayName: 'Bandra Kurla Complex (BKC) & Powai',
    shortName: 'BKC / Powai',
    hubKeywords: ['bkc', 'bandra kurla', 'powai', 'nirlon', 'hiranandani'],
    lat: 19.0664,
    lon: 72.8687,
    metroLines: ['Mumbai Metro Line 3 (Aqua Line - BKC Station)', 'Western & Central Suburban Railway'],
    primaryTowers: ['Maker Maxity', 'The Capital BKC', 'Hiranandani Business Park Powai', 'Nirlon Knowledge Park Goregaon'],
    avgSalaryRange: '₹18L - ₹60L',
    description: 'India premier financial tech capital, hosting investment banking engineering desks, quant hedge funds, and top-tier fintech unicorns.',
    faqSnippet: {
      question: 'Which tech sectors pay the highest compensation in Mumbai BKC?',
      answer: 'Quantitative algorithmic trading, fintech infrastructure, enterprise banking platforms (Morgan Stanley, Barclays, Citi), and high-growth fintech unicorns.',
    },
  },
  'aerocity': {
    slug: 'aerocity',
    citySlug: 'delhi',
    cityDisplayName: 'Delhi',
    displayName: 'Aerocity Worldmark & South Delhi Tech',
    shortName: 'Aerocity / Okhla',
    hubKeywords: ['aerocity', 'worldmark', 'okhla', 'connaught place'],
    lat: 28.5510,
    lon: 77.1215,
    metroLines: ['Delhi Metro Airport Express Line (Delhi Aerocity Station)', 'Magenta Line Interchange'],
    primaryTowers: ['Worldmark 1, 2 & 3 Aerocity', 'Okhla NSIC Phase 3 Tech Hub', 'Barakhamba Corporate Towers'],
    avgSalaryRange: '₹16L - ₹55L',
    description: 'High-end corporate software headquarters, global strategy tech centers, and analytics consulting offices adjoining IGI Airport.',
    faqSnippet: {
      question: 'Why do multinational tech leaders choose Aerocity Worldmark?',
      answer: 'Unmatched 5-minute access to Terminal 3 international airport, 15-minute Airport Express transit to Connaught Place, and premium LEED Platinum commercial campuses.',
    },
  },
};

export function getAllCorridorSlugs(): { city: string; corridor: string }[] {
  return Object.values(TECH_CORRIDORS).map((c) => ({
    city: c.citySlug,
    corridor: c.slug,
  }));
}

export function getCorridorConfig(citySlug: string, corridorSlug: string): CorridorConfig | null {
  const config = TECH_CORRIDORS[corridorSlug];
  if (!config) return null;
  if (config.citySlug.toLowerCase() !== citySlug.toLowerCase()) return null;
  return config;
}
