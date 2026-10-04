/**
 * LaTeX and ATS Markdown Templates Engine
 * Ported from career-forge LaTeX templates (swe.tex, fullstack.tex, devops.tex, aiml.tex, sdet.tex, lead.tex, data.tex)
 * Single-column, 100% ATS-parseable, high-impact structure.
 */

export interface RoleTemplateDefinition {
  id: string;
  name: string;
  category: string;
  defaultTitle: string;
  defaultSummary: string;
  defaultSkills: { category: string; skills: string }[];
  defaultExperience: {
    role: string;
    company: string;
    dates: string;
    location: string;
    bullets: string[];
  }[];
  defaultEducation: {
    degree: string;
    school: string;
    dates: string;
    certifications?: string;
  };
}

export const ROLE_TEMPLATES: Record<string, RoleTemplateDefinition> = {
  swe: {
    id: 'swe',
    name: 'Software Engineer (General / Backend)',
    category: 'Engineering',
    defaultTitle: 'Senior Software & Distributed Systems Engineer',
    defaultSummary:
      'Senior Software Engineer with 5+ years of experience architecting resilient distributed systems, event-driven microservices, and high-throughput APIs. Proven track record of scaling platforms to 10M+ daily requests and driving sub-15ms P99 latency.',
    defaultSkills: [
      { category: 'Core Languages', skills: 'Go, Java, Python, TypeScript, SQL, Bash' },
      { category: 'Distributed Systems & Cloud', skills: 'Kubernetes, Docker, AWS (ECS, S3, RDS, Lambda), Kafka, Redis, gRPC' },
      { category: 'Databases & Storage', skills: 'PostgreSQL, DynamoDB, Elasticsearch, MySQL, ClickHouse' },
      { category: 'Engineering Practices', skills: 'CI/CD Pipelines, Microservices Architecture, TDD, High-Availability Systems' }
    ],
    defaultExperience: [
      {
        role: 'Senior Backend Engineer',
        company: 'CloudScale Platform Solutions',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Architected high-throughput distributed ingestion pipelines processing 25M+ events/day with 99.99% uptime.',
          'Migrated monolithic relational workload to PostgreSQL + Redis caching layer, curtailing P99 query latency by 45%.',
          'Spearheaded automated CI/CD deployment workflows via GitHub Actions, reducing release cycle time from 3 hours to 12 minutes.',
          'Mentored a cross-functional team of 6 engineers on zero-downtime database migrations and distributed tracing.'
        ]
      },
      {
        role: 'Software Engineer',
        company: 'Apex Digital Infrastructure',
        dates: '2020 -- 2022',
        location: 'Gurugram, India',
        bullets: [
          'Engineered 18+ microservices utilizing Go and gRPC, reducing memory footprint across container clusters by 35%.',
          'Constructed rate-limiting and authorization proxy handling 10,000+ RPS during peak traffic bursts.',
          'Automated regression suites achieving 92% code coverage and isolating 40+ critical defects prior to production releases.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'National Institute of Technology',
      dates: '2016 -- 2020',
      certifications: 'AWS Certified Solutions Architect -- Associate'
    }
  },

  fullstack: {
    id: 'fullstack',
    name: 'Full Stack Engineer',
    category: 'Engineering',
    defaultTitle: 'Senior Full Stack Platform Engineer',
    defaultSummary:
      'Full Stack Engineer with extensive experience building modern, accessible web applications and distributed backend microservices. Expert in React, Next.js, TypeScript, Node.js, and cloud architectures.',
    defaultSkills: [
      { category: 'Frontend Ecosystem', skills: 'React, Next.js, TypeScript, Tailwind CSS, Redux Toolkit, Webpack, Vite' },
      { category: 'Backend & APIs', skills: 'Node.js, Express, Go, REST APIs, GraphQL, tRPC, PostgreSQL, Redis' },
      { category: 'Cloud & DevOps', skills: 'AWS, Docker, Vercel, CI/CD, GitHub Actions, Cloudflare CDN' },
      { category: 'Testing & Tooling', skills: 'Jest, Playwright, React Testing Library, Cypress, Git, Postman' }
    ],
    defaultExperience: [
      {
        role: 'Senior Full Stack Engineer',
        company: 'FinPulse Technologies',
        dates: '2022 -- Present',
        location: 'Noida / Remote',
        bullets: [
          'Engineered customer-facing financial dashboard using Next.js 14, React Server Components, and Tailwind CSS serving 500k+ MAU.',
          'Optimized Core Web Vitals across web applications, accelerating LCP from 3.4s to 1.1s and boosting conversion by 22%.',
          'Architected RESTful and GraphQL backend endpoints in Node.js/PostgreSQL processing ₹100M+ in monthly transactional volume.',
          'Standardized design system component library across 4 internal product engineering squads.'
        ]
      },
      {
        role: 'Frontend / Full Stack Developer',
        company: 'Vanguard Software Labs',
        dates: '2020 -- 2022',
        location: 'Bengaluru, India',
        bullets: [
          'Developed responsive real-time analytics module with WebSocket live updates and interactive chart visualizations.',
          'Implemented end-to-end type safety using TypeScript, Prisma, and Zod across front-to-back application boundaries.',
          'Refactored legacy single-page application, trimming bundle payload size by 40% and cutting initial render times.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'Bachelor of Engineering in Information Technology',
      school: 'Delhi Technological University',
      dates: '2016 -- 2020',
      certifications: 'Meta Certified Front-End Developer'
    }
  },

  data: {
    id: 'data',
    name: 'Data & Distributed Systems Engineer',
    category: 'Data & AI',
    defaultTitle: 'Senior Data & Distributed Systems Engineer',
    defaultSummary:
      'Data Engineer with deep expertise in designing batch and real-time streaming pipelines, modern data warehouses, and distributed computing frameworks. Proven success in handling multi-terabyte analytical workloads.',
    defaultSkills: [
      { category: 'Big Data & Streaming', skills: 'Apache Spark, Apache Kafka, Apache Flink, PySpark, Airflow, dbt' },
      { category: 'Databases & Warehousing', skills: 'Snowflake, ClickHouse, BigQuery, PostgreSQL, AWS Redshift, Delta Lake' },
      { category: 'Languages & Tools', skills: 'Python, SQL, Scala, Bash, Docker, Terraform, Git' },
      { category: 'Cloud Platforms', skills: 'AWS (EMR, S3, Glue, Athena), GCP (Dataflow, BigQuery), Azure Synapse' }
    ],
    defaultExperience: [
      {
        role: 'Senior Data Engineer',
        company: 'DataStream Core Solutions',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Constructed real-time ETL streaming pipelines via Kafka and Spark Streaming, ingestion over 50M records daily with sub-second delay.',
          'Re-architected data warehouse in Snowflake and dbt, reducing query runtimes by 60% and trimming monthly cloud computing costs by ₹1.2M.',
          'Implemented automated data quality validation framework using Great Expectations, preventing pipeline outages across 12 downstream dashboards.',
          'Orchestrated 40+ mission-critical ETL workflows with Apache Airflow ensuring 99.9% pipeline SLA compliance.'
        ]
      },
      {
        role: 'Data Engineer',
        company: 'Insight Analytics Labs',
        dates: '2020 -- 2022',
        location: 'Hyderabad, India',
        bullets: [
          'Engineered automated customer segmentation data models feeding predictive recommendation engines.',
          'Optimized distributed SQL queries and partition strategies across multi-terabyte transactional tables.',
          'Standardized metadata management and schema evolution protocols across distributed cross-functional teams.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'IIIT Hyderabad',
      dates: '2016 -- 2020',
      certifications: 'Databricks Certified Data Engineer Professional'
    }
  },

  aiml: {
    id: 'aiml',
    name: 'Applied AI & ML Systems Engineer',
    category: 'Data & AI',
    defaultTitle: 'Senior Applied AI & LLM Systems Engineer',
    defaultSummary:
      'Machine Learning Systems Engineer specializing in productionizing LLM applications, RAG pipelines, fine-tuning open-weights models, and deploying low-latency model inference endpoints on distributed GPU clusters.',
    defaultSkills: [
      { category: 'ML & LLM Frameworks', skills: 'PyTorch, Hugging Face, LangChain, LlamaIndex, vLLM, TensorRT-LLM, ONNX' },
      { category: 'Vector DBs & Retrieval', skills: 'Qdrant, Pinecone, Milvus, ChromaDB, Hybrid BM25/Dense Search' },
      { category: 'MLOps & Deployment', skills: 'Docker, Kubernetes, Triton Inference Server, Ray, MLflow, AWS SageMaker' },
      { category: 'Languages & Core', skills: 'Python, C++, SQL, CUDA basics, FastAPIs, AsyncIO' }
    ],
    defaultExperience: [
      {
        role: 'Senior AI / MLOps Engineer',
        company: 'NeuralMatrix Labs',
        dates: '2022 -- Present',
        location: 'Gurugram / Remote',
        bullets: [
          'Engineered enterprise RAG platform with semantic hybrid search and reranking, elevating retrieval precision from 68% to 93%.',
          'Deployed optimized LLM inference pipelines with vLLM and TensorRT-LLM, slashing token generation latency by 3.2x and saving 40% in GPU hosting costs.',
          'Fine-tuned domain-specific 7B/14B parameter models with LoRA and QLoRA, outperforming base GPT-4o-mini on proprietary document extraction benchmarks.',
          'Instituted automated evaluation pipelines measuring hallucination rates, contextual relevance, and answer faithfulness.'
        ]
      },
      {
        role: 'Machine Learning Engineer',
        company: 'Cognitive Computing Corp',
        dates: '2020 -- 2022',
        location: 'Bengaluru, India',
        bullets: [
          'Trained NLP classification models achieving 94.5% F1 score across 1.5M multi-lingual customer support interactions.',
          'Built end-to-end real-time feature pipelines utilizing Redis and Feast feature store.',
          'Integrated continuous model monitoring tracking data drift and automated retraining triggers.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'M.Tech / B.Tech in Artificial Intelligence',
      school: 'Indian Institute of Technology',
      dates: '2016 -- 2020',
      certifications: 'DeepLearning.AI Generative AI with LLMs'
    }
  },

  devops: {
    id: 'devops',
    name: 'DevOps & Cloud Infrastructure Engineer',
    category: 'Infrastructure',
    defaultTitle: 'Staff DevOps & Cloud Infrastructure Engineer',
    defaultSummary:
      'DevOps and Site Reliability Engineer with 6+ years specializing in Kubernetes orchestration, Infrastructure as Code, zero-downtime CI/CD automation, and cloud security architecture across multi-region environments.',
    defaultSkills: [
      { category: 'Container & Orchestration', skills: 'Kubernetes (EKS/GKE), Docker, Helm, Istio Service Mesh, ArgoCD' },
      { category: 'Infrastructure as Code', skills: 'Terraform, Terragrunt, Ansible, CloudFormation, Pulumi' },
      { category: 'CI/CD & Observability', skills: 'GitHub Actions, GitLab CI, Prometheus, Grafana, Datadog, OpenTelemetry' },
      { category: 'Cloud & Security', skills: 'AWS, GCP, Vault, IAM Policies, Linux Hardening, TLS/mTLS, SOC2 Compliance' }
    ],
    defaultExperience: [
      {
        role: 'Staff DevOps Engineer',
        company: 'HyperCloud Networks',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Architected multi-region Kubernetes cluster deployment on AWS EKS serving 100M+ monthly requests with 99.995% uptime.',
          'Automated 100% of infrastructure provisioning via Terraform and GitOps with ArgoCD, cutting environment stand-up time from 4 days to 25 minutes.',
          'Implemented unified observability stack with OpenTelemetry, Prometheus, and Grafana, lowering MTTR on production incidents by 55%.',
          'Instituted cloud cost governance policies and autoscaling parameters, cutting AWS annual infrastructure spend by ₹4.5M.'
        ]
      },
      {
        role: 'Cloud Operations Engineer',
        company: 'ScaleOps Technologies',
        dates: '2019 -- 2022',
        location: 'Pune, India',
        bullets: [
          'Constructed automated zero-downtime blue/green deployment strategies for 30+ production microservices.',
          'Engineered disaster recovery and multi-region database failover mechanisms meeting 15-minute RTO and 0-minute RPO targets.',
          'Audited security architecture and implemented CIS benchmark standards across 200+ EC2 instances and container clusters.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'B.E. in Information Technology',
      school: 'Pune Institute of Computer Technology',
      dates: '2015 -- 2019',
      certifications: 'Certified Kubernetes Administrator (CKA) | AWS Certified DevOps Engineer Professional'
    }
  },

  lead: {
    id: 'lead',
    name: 'Lead / Principal Engineer',
    category: 'Leadership',
    defaultTitle: 'Principal Engineer & Technology Lead',
    defaultSummary:
      'Principal Engineer and Technology Leader with a history of driving technical strategy, scaling complex distributed platforms, and leading cross-functional engineering organizations of 25+ engineers.',
    defaultSkills: [
      { category: 'Architecture & Strategy', skills: 'Distributed Systems Design, Microservices, Domain-Driven Design (DDD), System Modernization' },
      { category: 'Engineering Leadership', skills: 'Technical Mentorship, Team Scaling, OKRs, Architecture Review Boards, Hiring' },
      { category: 'Core Tech Stack', skills: 'Go, Java, Python, TypeScript, Kafka, Kubernetes, AWS, PostgreSQL, Redis' },
      { category: 'Operational Excellence', skills: 'SRE Practices, Production Incident Management, Cost Optimization, Security Compliance' }
    ],
    defaultExperience: [
      {
        role: 'Principal Engineer / Tech Lead',
        company: 'Enterprise Core Technologies',
        dates: '2021 -- Present',
        location: 'Gurugram / Hybrid',
        bullets: [
          'Led architecture and technical strategy for enterprise platform processing ₹500M+ in transactions across 4 core business verticals.',
          'Spearheaded transition from legacy monolithic systems to event-driven microservices architecture, boosting development velocity by 3x.',
          'Mentored and aligned 4 engineering managers and 28 engineers across India and global delivery hubs.',
          'Established firm-wide Architecture Review Board and coding craftsmanship guidelines, reducing high-severity production defects by 65%.'
        ]
      },
      {
        role: 'Lead Architect',
        company: 'Global Software Ventures',
        dates: '2018 -- 2021',
        location: 'Bengaluru, India',
        bullets: [
          'Architected real-time analytics streaming engine handling 100,000+ operations/second with sub-20ms latency.',
          'Championed cloud migration initiative moving 120+ services to containerized Kubernetes infrastructure with zero customer downtime.',
          'Designed distributed caching and data replication strategies across multiple geographical regions.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'B.Tech in Computer Science',
      school: 'Indian Institute of Technology',
      dates: '2014 -- 2018',
      certifications: 'TOGAF 9 Certified Enterprise Architect'
    }
  },

  sdet: {
    id: 'sdet',
    name: 'SDET & QA Automation Architect',
    category: 'Engineering',
    defaultTitle: 'Lead SDET & QA Automation Architect',
    defaultSummary:
      'Lead Software Development Engineer in Test (SDET) specializing in building enterprise test automation frameworks, CI/CD quality gates, performance benchmarking, and API test suites for mission-critical applications.',
    defaultSkills: [
      { category: 'Automation Frameworks', skills: 'Selenium, Playwright, Cypress, Appium, pytest, TestNG, RestAssured' },
      { category: 'Languages & Scripting', skills: 'Python, Java, TypeScript, JavaScript, SQL, Bash' },
      { category: 'Performance & API Testing', skills: 'JMeter, k6, Postman, Charles Proxy, Gatling, Pact Contract Testing' },
      { category: 'CI/CD & Infrastructure', skills: 'Jenkins, GitHub Actions, Docker, AWS Device Farm, Allure Reporting' }
    ],
    defaultExperience: [
      {
        role: 'Lead SDET & Quality Architect',
        company: 'Reliability Engineering Labs',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Architected unified end-to-end test automation framework using Playwright and TypeScript, expanding regression coverage from 42% to 94%.',
          'Integrated automated test gates into CI/CD pipelines, isolating 150+ critical bugs prior to production and cutting testing cycle time by 70%.',
          'Conducted load and stress tests with k6 simulating 50,000 concurrent users, identifying memory leaks and API bottlenecks before major product launches.',
          'Mentored QA automation engineers across 3 squads and established automated visual regression testing standards.'
        ]
      },
      {
        role: 'Senior QA Automation Engineer',
        company: 'FinTech Software Solutions',
        dates: '2019 -- 2022',
        location: 'Gurugram, India',
        bullets: [
          'Built comprehensive REST API test framework in Python + pytest validating 200+ transactional endpoints.',
          'Automated cross-browser and mobile web verification across 15+ browser/OS matrix configurations.',
          'Reduced manual test verification backlog by 85% through continuous test automation.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'B.Tech in Information Technology',
      school: 'Delhi University',
      dates: '2015 -- 2019',
      certifications: 'ISTQB Certified Tester -- Advanced Level Test Automation Engineer'
    }
  },

  pm: {
    id: 'pm',
    name: 'Product Manager / Technical PM',
    category: 'Product & Design',
    defaultTitle: 'Senior Product Manager',
    defaultSummary:
      'Product Manager with 6+ years driving product strategy, roadmap execution, and customer-centric feature delivery for high-scale SaaS and consumer platforms. Proven record of driving 35% growth in MAU and aligning cross-functional engineering, design, and GTM teams.',
    defaultSkills: [
      { category: 'Product Strategy & Discovery', skills: 'Product Roadmapping, PRD Writing, Customer Interviews, Competitive Analysis, OKRs' },
      { category: 'Analytics & Experimentation', skills: 'A/B Testing, Mixpanel, Amplitude, Google Analytics, SQL, Conversion Rate Optimization' },
      { category: 'Agile & Execution', skills: 'Jira, Confluence, Scrum, User Stories, Backlog Grooming, Sprint Planning' },
      { category: 'Technical Acumen', skills: 'System Architecture Understanding, REST APIs, Microservices basics, Data Modeling basics' }
    ],
    defaultExperience: [
      {
        role: 'Senior Product Manager',
        company: 'Apex SaaS Platforms',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Led end-to-end product strategy for enterprise self-serve onboarding, boosting conversion by 28% and expanding pipeline by ₹15M ARR.',
          'Defined product roadmaps and authored comprehensive PRDs across 4 engineering squads comprising 25+ engineers.',
          'Orchestrated multi-variant A/B experiments on core funnel features, raising activation rates from 34% to 52%.',
          'Spearheaded bi-weekly sprint planning, roadmap reviews with C-suite executives, and customer discovery interviews.'
        ]
      },
      {
        role: 'Product Manager',
        company: 'VentureScale Technologies',
        dates: '2019 -- 2022',
        location: 'Gurugram, India',
        bullets: [
          'Launched mobile checkout experience reducing transaction abandonment by 18% and processing ₹50M+ GMV monthly.',
          'Instrumented user behavior tracking via Amplitude and Mixpanel, establishing actionable data-driven metrics.',
          'Partnered with UX research to conduct 60+ usability testing sessions and translated findings into feature enhancements.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'MBA / B.Tech',
      school: 'Top Tier Institute',
      dates: '2015 -- 2019',
      certifications: 'Reforge Product Management Certified / Pragmatic Institute Certified'
    }
  },

  design: {
    id: 'design',
    name: 'Product Designer / UI-UX Lead',
    category: 'Product & Design',
    defaultTitle: 'Senior Product / UI-UX Designer',
    defaultSummary:
      'Product Designer with 5+ years crafting accessible, scalable digital experiences and design systems for enterprise SaaS and consumer products. Expert in turning complex user workflows into intuitive interfaces through research-backed iterations.',
    defaultSkills: [
      { category: 'Design & Prototyping', skills: 'Figma, FigJam, Sketch, Adobe Creative Cloud, Framer, Principle' },
      { category: 'UX Research & Validation', skills: 'Usability Testing, User Journey Mapping, Information Architecture, Heuristic Audits' },
      { category: 'Design Systems', skills: 'Design Tokens, Component Libraries, Atomic Design, Accessibility (WCAG 2.1 AA)' },
      { category: 'Collaboration & Handoff', skills: 'Design-to-Code Handoff, Zeplin, Zeroheight, HTML/CSS Basics' }
    ],
    defaultExperience: [
      {
        role: 'Senior Product Designer',
        company: 'Elevate Cloud Suite',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Redesigned core enterprise analytics dashboard, resulting in a 40% reduction in time-to-first-insight for power users.',
          'Built and maintained multi-brand Figma design system utilized across 6 product teams, cutting UI engineering delivery cycle by 35%.',
          'Conducted 45+ customer interviews and usability sessions to validate high-fidelity prototypes prior to code freeze.',
          'Ensured 100% WCAG 2.1 AA accessibility compliance across all web and mobile product surfaces.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'Bachelor of Design (B.Des) / Human-Computer Interaction',
      school: 'National Institute of Design',
      dates: '2017 -- 2021',
      certifications: 'Nielsen Norman Group UX Master Certified'
    }
  },

  security: {
    id: 'security',
    name: 'Cybersecurity & InfoSec Engineer',
    category: 'Infrastructure',
    defaultTitle: 'Senior Cybersecurity & InfoSec Engineer',
    defaultSummary:
      'Information Security Engineer with 6+ years specializing in cloud security, vulnerability management, SIEM architecture, penetration testing, and regulatory compliance (SOC2, ISO 27001). Strong track record of hardening enterprise infrastructure.',
    defaultSkills: [
      { category: 'Security Operations & SIEM', skills: 'Splunk, Microsoft Sentinel, CrowdStrike, Incident Response, Threat Hunting' },
      { category: 'AppSec & Pen Testing', skills: 'OWASP Top 10, Burp Suite, Metasploit, Static/Dynamic Code Analysis (SAST/DAST)' },
      { category: 'Cloud & Network Security', skills: 'AWS Security Hub, GuardDuty, IAM Hardening, WAF, Firewalls, Zero Trust' },
      { category: 'Compliance & Governance', skills: 'SOC 2 Type II, ISO/IEC 27001, GDPR, NIST CSF, PCI-DSS' }
    ],
    defaultExperience: [
      {
        role: 'Senior Security Operations Engineer',
        company: 'SecureMatrix Defense',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Led enterprise SIEM implementation across 200+ microservices and cloud workloads, reducing mean time to detect (MTTD) by 65%.',
          'Conducted routine application vulnerability assessments and red team simulations, isolating critical vulnerabilities pre-exploit.',
          'Architected Zero Trust IAM governance on AWS, enforcing least-privilege policies across 500+ corporate identities.',
          'Successfully led technical security audits for annual SOC 2 Type II and ISO 27001 recertifications with zero major non-conformities.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'B.Tech in Computer Science / Cybersecurity',
      school: 'National Institute of Technology',
      dates: '2016 -- 2020',
      certifications: 'CISSP, CEH (Certified Ethical Hacker), AWS Certified Security -- Specialty'
    }
  },

  sales: {
    id: 'sales',
    name: 'Enterprise Account Executive / B2B Sales',
    category: 'Commercial & Non-Tech',
    defaultTitle: 'Enterprise Account Executive',
    defaultSummary:
      'High-performing Enterprise SaaS Account Executive with 6+ years exceeding multimillion-dollar revenue quotas. Specialized in complex B2B sales cycles, MEDDPICC qualification, executive stakeholder mapping, and strategic pipeline generation.',
    defaultSkills: [
      { category: 'Sales Methodology & Strategy', skills: 'MEDDPICC, Challenger Sale, Solution Selling, Value-Based Negotiation, Account Mapping' },
      { category: 'CRM & Sales Tech', skills: 'Salesforce, HubSpot CRM, LinkedIn Sales Navigator, Outreach.io, Gong, ZoomInfo' },
      { category: 'Commercial Acumen', skills: 'Contract Negotiation, RFP Responses, Pricing Strategy, Pipeline Forecasting, QBRs' },
      { category: 'Domain Expertise', skills: 'Enterprise B2B SaaS, Cloud Infrastructure, Data Platforms, Cyber Tech' }
    ],
    defaultExperience: [
      {
        role: 'Enterprise Account Executive',
        company: 'Global SaaS Enterprise',
        dates: '2022 -- Present',
        location: 'Gurugram / Hybrid',
        bullets: [
          'Achieved 145% of annual quota in FY24, closing ₹32M ARR in net-new enterprise software contracts.',
          'Orchestrated multi-threaded deal cycles involving C-level decision-makers (CTO, CISO, CFO) with average contract value of ₹4M+.',
          'Partnered with Solutions Architects and Sales Development to build a 4x qualified pipeline across Fortune 500 targets.',
          'Consistently maintained top 5% rep ranking across a global 60-person revenue organization.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'Bachelor of Business Administration / Engineering',
      school: 'Top University',
      dates: '2016 -- 2020',
      certifications: 'Force Management MEDDPICC Certified'
    }
  },

  cs: {
    id: 'cs',
    name: 'Customer Success Manager',
    category: 'Commercial & Non-Tech',
    defaultTitle: 'Senior Customer Success Manager',
    defaultSummary:
      'Customer Success Leader with 5+ years driving customer retention, adoption, and net revenue retention (NRR) across mid-market and enterprise SaaS portfolios. Proven ability to reduce gross churn and uncover high-margin expansion opportunities.',
    defaultSkills: [
      { category: 'Account Management & Retention', skills: 'Customer Journey Mapping, Health Scoring, QBRs, Churn Mitigation, Renewals, Upselling' },
      { category: 'Customer Success Tools', skills: 'Gainsight, Salesforce, Zendesk, ChurnZero, HubSpot, Mixpanel' },
      { category: 'Cross-functional Collaboration', skills: 'Voice of Customer (VoC), Product Advocacy, Executive Sponsor Engagement' },
      { category: 'Metrics & Operations', skills: 'Net Retention Rate (NRR), Gross Retention Rate (GRR), CSAT, NPS, Time-to-Value (TTV)' }
    ],
    defaultExperience: [
      {
        role: 'Senior Customer Success Manager',
        company: 'CloudFlow Technologies',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Managed a $4.5M ARR book of 35 tier-1 enterprise accounts, achieving a 118% Net Retention Rate (NRR).',
          'Instituted proactive health scoring models in Gainsight, reducing annual customer churn from 9.2% to 3.8%.',
          'Facilitated quarterly business reviews (QBRs) with client VP/Director stakeholders to showcase ROI and feature roadmaps.',
          'Identified and closed $650k in expansion and cross-sell opportunities in tight alignment with Account Executives.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'B.A. / B.Com / B.Tech',
      school: 'Delhi University',
      dates: '2017 -- 2021',
      certifications: 'SuccessHACKER Certified Customer Success Manager (CCSM)'
    }
  },

  marketing: {
    id: 'marketing',
    name: 'Growth & Performance Marketing Manager',
    category: 'Commercial & Non-Tech',
    defaultTitle: 'Senior Growth & Performance Marketing Manager',
    defaultSummary:
      'Growth Marketing Manager with 6+ years driving profitable customer acquisition, lifecycle engagement, and revenue scaling. Expertise in multi-channel paid acquisition, conversion rate optimization (CRO), SEO, and marketing automation.',
    defaultSkills: [
      { category: 'Performance Channels', skills: 'Google Ads (Search/Display), LinkedIn Ads, Meta Ads, YouTube Ads, Programmatic' },
      { category: 'Analytics & Attribution', skills: 'Google Analytics 4 (GA4), Mixpanel, Tableau, Multi-touch Attribution, SQL Basics' },
      { category: 'Organic & Lifecycle', skills: 'Technical SEO, Content Marketing, HubSpot, Marketo, Customer.io, Email Drip Campaigns' },
      { category: 'Experimentation & Strategy', skills: 'CRO, Landing Page Optimization, A/B Testing, CAC/LTV Optimization, Budget Allocation' }
    ],
    defaultExperience: [
      {
        role: 'Growth Marketing Lead',
        company: 'ScaleUp Ventures',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Managed ₹25M annual performance marketing budget, scaling inbound qualified leads by 75% while cutting CAC by 30%.',
          'Built multi-channel nurture funnels in HubSpot, increasing MQL-to-SQL conversion rate from 14% to 26%.',
          'Executed technical SEO overhaul that boosted organic traffic by 120,000 monthly unique visitors in 9 months.',
          'Partnered with product and design to run continuous landing page A/B tests yielding a 22% lift in demo requests.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'B.Sc / BBA in Marketing or Communications',
      school: 'Reputed University',
      dates: '2016 -- 2020',
      certifications: 'Google Ads Search & Measurement Certified, HubSpot Inbound Marketing'
    }
  },

  ops: {
    id: 'ops',
    name: 'Business Operations & Chief of Staff',
    category: 'Commercial & Non-Tech',
    defaultTitle: 'Business Operations Manager / Chief of Staff',
    defaultSummary:
      'Strategic Business Operations professional with 5+ years driving cross-functional execution, executive alignment, operating cadence, and corporate strategy for high-growth tech organizations.',
    defaultSkills: [
      { category: 'Strategy & Execution', skills: 'Operating Cadence, OKR Tracking, Executive Reporting, Process Optimization, Change Management' },
      { category: 'Analytics & Financials', skills: 'Financial Modeling, KPI Dashboards, Power BI, Excel Modeling, SQL Basics' },
      { category: 'Project & Program Management', skills: 'Asana, Jira, Notion, Stakeholder Management, Vendor Management' },
      { category: 'Governance', skills: 'Board Meeting Preparation, Cross-Functional Strategic Initiatives, Resource Allocation' }
    ],
    defaultExperience: [
      {
        role: 'Business Operations Manager',
        company: 'HyperScale Mobility',
        dates: '2022 -- Present',
        location: 'Gurugram / Hybrid',
        bullets: [
          'Partnered directly with CEO and Executive team to lead quarterly OKR planning and operating cadence across 300+ employees.',
          'Streamlined internal operational processes, cutting cross-departmental approval bottlenecks by 40%.',
          'Developed automated executive KPI dashboards tracking ARR, burn rate, head-count efficiency, and unit economics.',
          'Managed end-to-end vendor negotiation initiatives, capturing ₹8M in annual recurring operational savings.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'MBA / B.Tech / B.E.',
      school: 'Top Management Institute',
      dates: '2016 -- 2020',
      certifications: 'Project Management Professional (PMP) / Lean Six Sigma Green Belt'
    }
  },

  finance: {
    id: 'finance',
    name: 'Finance & FP&A Specialist',
    category: 'Commercial & Non-Tech',
    defaultTitle: 'Senior FP&A & Financial Analyst',
    defaultSummary:
      'Finance & FP&A professional with 5+ years building predictive financial models, budgeting frameworks, cash flow forecasts, and executive board reporting for enterprise and growth-stage tech firms.',
    defaultSkills: [
      { category: 'Financial Modeling & Planning', skills: 'Three-Statement Financial Modeling, DCF Valuation, Budgeting & Forecasting, Variance Analysis' },
      { category: 'Financial Systems & ERP', skills: 'NetSuite, SAP, QuickBooks, Hyperion, Workday Financials' },
      { category: 'Data & Analytics', skills: 'Advanced Excel, VBA, Power BI, SQL, Financial Reporting Standards (GAAP / IFRS)' },
      { category: 'Commercial Finance', skills: 'SaaS Metrics (ARR, CAC, LTV, Magic Number), Unit Economics, Cap Table Management' }
    ],
    defaultExperience: [
      {
        role: 'Senior Financial Analyst -- FP&A',
        company: 'Apex Financial Technologies',
        dates: '2022 -- Present',
        location: 'Mumbai / Hybrid',
        bullets: [
          'Built rolling 12-month corporate forecasting models improving annual expense predictability to within 3% variance.',
          'Partnered with departmental leaders to oversee ₹800M annual OPEX and CAPEX budget allocations.',
          'Constructed SaaS unit economics dashboards tracking Customer Lifetime Value (LTV), Payback Period, and Net Burn.',
          'Prepared investor board packages and quarterly financial commentary for Series B & C leadership reviews.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'Chartered Accountant (CA) / CFA / MBA in Finance',
      school: 'ICAI / Top Tier University',
      dates: '2016 -- 2020',
      certifications: 'CFA Level II / Certified Financial Modeler (FMVA)'
    }
  },

  hr: {
    id: 'hr',
    name: 'Talent Acquisition & People Partner',
    category: 'Commercial & Non-Tech',
    defaultTitle: 'Lead Talent Acquisition & People Partner',
    defaultSummary:
      'People and Talent Acquisition Lead with 6+ years managing full-cycle technical and executive recruitment, employer branding, talent analytics, and employee lifecycle operations in high-growth technology environments.',
    defaultSkills: [
      { category: 'Talent Sourcing & Recruiting', skills: 'Full-Cycle Recruiting, Executive Search, Technical Sourcing, Candidate Experience' },
      { category: 'Recruiting Systems (ATS & HRIS)', skills: 'Greenhouse, Lever, Workday, BambooHR, LinkedIn Recruiter, Gem' },
      { category: 'People Operations', skills: 'Onboarding, Performance Reviews, Compensation Benchmarking, Employee Relations' },
      { category: 'Metrics & Analytics', skills: 'Time-to-Hire, Cost-per-Hire, Offer Acceptance Rate, Diversity & Inclusion (D&I)' }
    ],
    defaultExperience: [
      {
        role: 'Lead Technical Recruiter',
        company: 'NextGen Systems',
        dates: '2022 -- Present',
        location: 'Bengaluru / Hybrid',
        bullets: [
          'Scaled engineering and product departments from 45 to 160+ members across India while maintaining an 89% offer acceptance rate.',
          'Reduced average time-to-hire from 58 days to 32 days through automated candidate nurturing and structured interview loops.',
          'Configured Greenhouse ATS workflows and analytics dashboards, providing weekly talent funnel insights to VP Engineering.',
          'Partnered with People Ops on compensation leveling frameworks, employer branding campaigns, and campus hiring drives.'
        ]
      }
    ],
    defaultEducation: {
      degree: 'Master of Human Resource Management / MBA HR',
      school: 'Top Business School',
      dates: '2016 -- 2020',
      certifications: 'SHRM-CP / AIRS Certified Internet Recruiter (CIR)'
    }
  }
};

export interface ResumeProject {
  name: string;
  technologies: string;
  url?: string;
  bullets: string[];
}

export interface ResumeAchievement {
  category?: string;
  bullets: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  linkedin: string;
  github?: string;
  website?: string;
  summary: string;
  skills: { category: string; skills: string }[];
  experience: {
    role: string;
    company: string;
    dates: string;
    location: string;
    bullets: string[];
  }[];
  projects?: ResumeProject[];
  education: {
    degree: string;
    school: string;
    dates: string;
    gpa?: string;
    certifications?: string;
    degrees?: {
      degree: string;
      school: string;
      dates: string;
      gpa?: string;
    }[];
  };
  achievements?: ResumeAchievement[];
}

export function escapeLatex(text: string): string {
  if (!text) return '';
  let s = text;

  // Neutralize dangerous LaTeX macros
  const dangerous = ['\\input', '\\write18', '\\openout', '\\include', '\\catcode', '\\csname', '\\def', '\\let', '\\immediate'];
  dangerous.forEach((dm) => {
    s = s.replaceAll(dm, ` [sanitized:${dm.replace('\\', '')}] `);
  });

  // Escape LaTeX control chars
  s = s.replace(/(?<!\\)&/g, '\\&');
  s = s.replace(/(?<!\\)%/g, '\\%');
  s = s.replace(/(?<!\\)\$/g, '\\$');
  s = s.replace(/(?<!\\)#/g, '\\#');
  s = s.replace(/(?<!\\)_/g, '\\_');
  s = s.replace(/(?<!\\)\^/g, '\\textasciicircum{}');
  s = s.replace(/(?<!\\)~/g, '\\textasciitilde{}');

  return s;
}

export function generateLatexSource(data: ResumeData): string {
  const contactParts: string[] = [
    escapeLatex(data.phone || ''),
    escapeLatex(data.location),
    escapeLatex(data.email),
    escapeLatex(data.linkedin),
  ];
  if (data.github) contactParts.push(escapeLatex(data.github));
  if (data.website) contactParts.push(escapeLatex(data.website));

  const headerContact = contactParts.filter(Boolean).join(' \\ \\textbar\\ \\ ');

  const skillsLatex = data.skills
    .map((s) => `\\textbf{${escapeLatex(s.category)}:} ${escapeLatex(s.skills)} \\\\`)
    .join('\n');

  const expLatex = data.experience
    .map((job) => {
      const locStr = job.location ? `\\hfill ${escapeLatex(job.location)}` : '';
      const bulletsStr = job.bullets.map((b) => `\\item ${escapeLatex(b)}`).join('\n');
      return `\\textbf{${escapeLatex(job.role)}} \\hfill ${escapeLatex(job.dates)} \\\\
\\textit{${escapeLatex(job.company)}} ${locStr}
\\begin{itemize}
${bulletsStr}
\\end{itemize}`;
    })
    .join('\n\n');

  const projectsLatex =
    data.projects && data.projects.length > 0
      ? `\n\\section*{\\large\\bfseries\\color{primary}\\uppercase{Key Projects}}
\\vspace{-4pt}\\rule{\\textwidth}{0.8pt}\\vspace{3pt}
\\small
` +
        data.projects
          .map((p) => {
            const urlStr = p.url ? `\\hfill \\url{${escapeLatex(p.url)}}` : '';
            const bulletsStr = p.bullets.map((b) => `\\item ${escapeLatex(b)}`).join('\n');
            return `\\textbf{${escapeLatex(p.name)}} \\textbar\\ \\textit{${escapeLatex(p.technologies)}} ${urlStr}
\\begin{itemize}
${bulletsStr}
\\end{itemize}`;
          })
          .join('\n\n')
      : '';

  const gpaStr = data.education.gpa ? ` \\textbar\\ \\textbf{GPA:} ${escapeLatex(data.education.gpa)}` : '';
  const eduCert = data.education.certifications
    ? `\n\\vspace{2pt}\n\\textbf{Certifications:} ${escapeLatex(data.education.certifications)}`
    : '';

  const eduLatex =
    data.education.degrees && data.education.degrees.length > 0
      ? data.education.degrees
          .map((deg) => {
            const g = deg.gpa ? ` \\textbar\\ \\textbf{GPA:} ${escapeLatex(deg.gpa)}` : '';
            return `\\textbf{${escapeLatex(deg.degree)}} \\hfill ${escapeLatex(deg.dates)} \\\\\n\\textit{${escapeLatex(deg.school)}}${g}`;
          })
          .join('\n\\vspace{4pt}\n') + eduCert
      : `\\textbf{${escapeLatex(data.education.degree)}} \\hfill ${escapeLatex(data.education.dates)} \\\\\n\\textit{${escapeLatex(data.education.school)}}${gpaStr}${eduCert}`;

  const achievementsLatex =
    data.achievements && data.achievements.length > 0
      ? `\n\\section*{\\large\\bfseries\\color{primary}\\uppercase{Key Achievements}}\n\\vspace{-4pt}\\rule{\\textwidth}{0.8pt}\\vspace{3pt}\n\\small\n` +
        data.achievements
          .map((ach) => {
            const catStr = ach.category ? `\\textbf{${escapeLatex(ach.category)}}\\\\\n` : '';
            const bullets = ach.bullets
              .map((b) => `  \\item ${escapeLatex(b)}`)
              .join('\n');
            return `${catStr}\\begin{itemize}[leftmargin=*,noitemsep,topsep=1pt]\n${bullets}\n\\end{itemize}`;
          })
          .join('\n\\vspace{4pt}\n')
      : '';

  return `\\documentclass[10pt,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.45in,top=0.38in,bottom=0.38in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}

\\definecolor{primary}{RGB}{0, 70, 140}
\\definecolor{darkgray}{RGB}{40, 40, 40}

\\hypersetup{
    colorlinks=true,
    urlcolor=primary,
    linkcolor=primary
}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\setlist[itemize]{leftmargin=1.1em, itemsep=1.2pt, topsep=1pt, parsep=0pt}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{\\color{darkgray} ${escapeLatex(data.name)}}} \\\\ \\vspace{2pt}
    {\\large \\textbf{${escapeLatex(data.title)}}} \\\\ \\vspace{2pt}
    \\small ${headerContact}
\\end{center}

\\vspace{-4pt}
\\section*{\\large\\bfseries\\color{primary}\\uppercase{Professional Summary}}
\\vspace{-4pt}\\rule{\\textwidth}{0.8pt}\\vspace{3pt}
${escapeLatex(data.summary)}

\\section*{\\large\\bfseries\\color{primary}\\uppercase{Technical Skills}}
\\vspace{-4pt}\\rule{\\textwidth}{0.8pt}\\vspace{3pt}
\\small
${skillsLatex}

\\section*{\\large\\bfseries\\color{primary}\\uppercase{Professional Experience}}
\\vspace{-4pt}\\rule{\\textwidth}{0.8pt}\\vspace{3pt}
\\small
${expLatex}
${projectsLatex}

\\section*{\\large\\bfseries\\color{primary}\\uppercase{Education \\& Certifications}}
\\vspace{-4pt}\\rule{\\textwidth}{0.8pt}\\vspace{3pt}
\\small
${eduLatex}
${achievementsLatex}

\\end{document}
`;
}

export function generateMarkdownSource(data: ResumeData): string {
  const contactParts = [data.phone, data.location, data.email, data.linkedin, data.github, data.website].filter(Boolean);
  const skillsMd = data.skills.map((s) => `- **${s.category}:** ${s.skills}`).join('\n');
  const expMd = data.experience
    .map((j) => {
      const bullets = j.bullets.map((b) => `  - ${b}`).join('\n');
      return `### ${j.role} | ${j.company}\n*${j.dates} | ${j.location}*\n\n${bullets}`;
    })
    .join('\n\n');

  const projMd =
    data.projects && data.projects.length > 0
      ? `\n---\n\n## Key Projects\n` +
        data.projects
          .map((p) => {
            const bullets = p.bullets.map((b) => `  - ${b}`).join('\n');
            const urlStr = p.url ? ` | [Link](${p.url})` : '';
            return `### ${p.name} (*${p.technologies}*)${urlStr}\n${bullets}`;
          })
          .join('\n\n')
      : '';

  const gpaMd = data.education.gpa ? ` (GPA: ${data.education.gpa})` : '';
  const certMd = data.education.certifications ? `\n- **Certifications:** ${data.education.certifications}` : '';

  const eduItemsMd =
    data.education.degrees && data.education.degrees.length > 0
      ? data.education.degrees
          .map((d) => {
            const schoolStr = d.school ? ` -- ${d.school}` : '';
            const datesStr = d.dates ? ` (*${d.dates}*)` : '';
            const dGpa = d.gpa ? ` (GPA: ${d.gpa})` : '';
            return `- **${d.degree}**${schoolStr}${datesStr}${dGpa}`;
          })
          .join('\n')
      : `- **${data.education.degree}**${data.education.school ? ` -- ${data.education.school}` : ''}${data.education.dates ? ` (*${data.education.dates}*)` : ''}${gpaMd}`;

  const nonInterests = (data.achievements || []).filter(
    (a) => !/^(?:interests?|hobbies|activities)$/i.test(a.category || '')
  );
  const interests = (data.achievements || []).filter(
    (a) => /^(?:interests?|hobbies|activities)$/i.test(a.category || '')
  );

  const achievementsMd =
    nonInterests.length > 0
      ? `\n\n---\n\n## Key Achievements\n` +
        nonInterests
          .filter((ach) => ach.bullets.length > 0)
          .map((ach) => {
            const isSelf = /^(?:key\s+|notable\s+|major\s+)?(?:achievements?|accomplishments?)$/i.test(ach.category || '');
            const catStr = ach.category && !isSelf ? `### ${ach.category}\n` : '';
            const bullets = ach.bullets.map((b) => `- ${b}`).join('\n');
            return `${catStr}${bullets}`;
          })
          .join('\n\n')
      : '';

  const interestsMd =
    interests.length > 0
      ? `\n\n---\n\n## Interests\n` +
        interests
          .flatMap((item) => item.bullets.map((b) => `- ${b}`))
          .join('\n')
      : '';

  return `# ${data.name}
**${data.title}**  
*${contactParts.join(' | ')}*

---

## Professional Summary
${data.summary}

---

## Technical Skills
${skillsMd}

---

## Professional Experience
${expMd}${projMd}

---

## Education & Certifications
${eduItemsMd}${certMd}${achievementsMd}${interestsMd}
`;
}

export function generatePlainText(data: ResumeData): string {
  const contactParts = [data.phone, data.location, data.email, data.linkedin, data.github, data.website].filter(Boolean);
  const skillsTxt = data.skills.map((s) => `${s.category}: ${s.skills}`).join('\n');
  const expTxt = data.experience
    .map((j) => {
      const bullets = j.bullets.map((b) => `  • ${b}`).join('\n');
      return `${j.role.toUpperCase()} -- ${j.company}\n${j.dates} | ${j.location}\n${bullets}`;
    })
    .join('\n\n');

  const projTxt =
    data.projects && data.projects.length > 0
      ? `\n==================================================\nKEY PROJECTS\n==================================================\n` +
        data.projects
          .map((p) => {
            const bullets = p.bullets.map((b) => `  • ${b}`).join('\n');
            const urlStr = p.url ? ` (${p.url})` : '';
            return `${p.name.toUpperCase()} [${p.technologies}]${urlStr}\n${bullets}`;
          })
          .join('\n\n')
      : '';

  const gpaTxt = data.education.gpa ? ` | GPA: ${data.education.gpa}` : '';
  const certTxt = data.education.certifications ? `\nCertifications: ${data.education.certifications}` : '';

  const eduSection =
    data.education.degrees && data.education.degrees.length > 0
      ? data.education.degrees
          .map((deg) => {
            const g = deg.gpa ? ` | GPA: ${deg.gpa}` : '';
            return `${deg.degree} -- ${deg.school} (${deg.dates})${g}`;
          })
          .join('\n') + certTxt
      : `${data.education.degree} -- ${data.education.school} (${data.education.dates})${gpaTxt}${certTxt}`;

  const achievementsTxt =
    data.achievements && data.achievements.length > 0
      ? `\n==================================================\nKEY ACHIEVEMENTS\n==================================================\n` +
        data.achievements
          .map((ach) => {
            const catStr = ach.category ? `${ach.category.toUpperCase()}\n` : '';
            const bullets = ach.bullets.map((b) => `  • ${b}`).join('\n');
            return `${catStr}${bullets}`;
          })
          .join('\n\n')
      : '';

  return `${data.name.toUpperCase()}
${data.title}
${contactParts.join(' | ')}

==================================================
PROFESSIONAL SUMMARY
==================================================
${data.summary}

==================================================
TECHNICAL SKILLS
==================================================
${skillsTxt}

==================================================
PROFESSIONAL EXPERIENCE
==================================================
${expTxt}${projTxt}

==================================================
EDUCATION & CERTIFICATIONS
==================================================
${eduSection}${achievementsTxt}
`;
}

