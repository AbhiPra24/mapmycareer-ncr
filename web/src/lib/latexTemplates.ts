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
  }
};

export interface ResumeProject {
  name: string;
  technologies: string;
  url?: string;
  bullets: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
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
  };
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

  const eduLatex = `\\textbf{${escapeLatex(data.education.degree)}} \\hfill ${escapeLatex(data.education.dates)} \\\\
\\textit{${escapeLatex(data.education.school)}}${gpaStr}${eduCert}`;

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

\\end{document}
`;
}

export function generateMarkdownSource(data: ResumeData): string {
  const contactParts = [data.location, data.email, data.linkedin, data.github, data.website].filter(Boolean);
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
- **${data.education.degree}** -- ${data.education.school} (*${data.education.dates}*)${gpaMd}${certMd}
`;
}

export function generatePlainText(data: ResumeData): string {
  const contactParts = [data.location, data.email, data.linkedin, data.github, data.website].filter(Boolean);
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
${data.education.degree} -- ${data.education.school} (${data.education.dates})${gpaTxt}${certTxt}
`;
}

