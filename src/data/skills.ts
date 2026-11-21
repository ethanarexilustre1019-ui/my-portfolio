import { SkillCategory } from '../types/portfolio';

/**
 * Central Technical Arsenal configuration.
 * No fabricated proficiency percentages are assigned; every entry maps to
 * real coursework, hackathon builds, or deployed repositories.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    code: 'ARS-01',
    title: 'Programming Languages',
    subtitle: 'Core languages used across web applications, backend APIs, and academic coursework',
    accentColor: 'emerald',
    skills: [
      {
        name: 'Java',
        context: 'Object-oriented systems, custom data structures (HashMap, LinkedList, PriorityQueue), and Dijkstra graph navigation',
        verifiedIn: 'Campus Event Scheduler & Navigator & BSIT Curriculum',
      },
      {
        name: 'Python',
        context: 'REST API development, astronomical ephemeris processing, and AI/NLP/OCR pipelines',
        verifiedIn: 'NASA CLPS FastAPI Backend & PhishNot Capstone',
      },
      {
        name: 'JavaScript (ES6+)',
        context: 'Interactive DOM logic, hash-routed SPAs, and client-side state orchestration',
        verifiedIn: 'South Bacolod Auto Trading (SBAT) & Mol’s Tyangge',
      },
      {
        name: 'TypeScript',
        context: 'Strongly typed frontend architecture and 3D geospatial web applications',
        verifiedIn: 'NASA CLPS Lunar Mission Browser & 3D Portfolio',
      },
      {
        name: 'PHP',
        context: 'Server-side web application scripting, form processing, and relational database integration',
        verifiedIn: 'BSIT Web Development & XAMPP Stack Projects',
      },
      {
        name: 'SQL',
        context: 'Relational schema design, spatial queries, and transactional bookkeeping',
        verifiedIn: 'Microsoft SQL Server, PostgreSQL & PostGIS Schemas',
      },
    ],
  },
  {
    id: 'frontend',
    code: 'ARS-02',
    title: 'Frontend Development',
    subtitle: 'Modern reactive interfaces, 3D WebGL viewports, and responsive web systems',
    accentColor: 'emerald',
    skills: [
      {
        name: 'React.js',
        context: 'Component-driven single-page applications, custom hooks, and modular UI states',
        verifiedIn: 'NASA CLPS Lunar Mission Browser & Portfolio',
      },
      {
        name: 'Three.js & WebGL',
        context: 'Interactive 3D scenes, skeletal GLTF character rigging, custom GLSL shaders, and post-processing',
        verifiedIn: 'NASA 3D Lunar Globe & Deku 3D Hero Environment',
      },
      {
        name: 'Vite',
        context: 'Fast ES-module bundling, TypeScript builds, and optimized asset pipelines',
        verifiedIn: 'NASA CLPS Frontend & Portfolio Build System',
      },
      {
        name: 'Tailwind CSS',
        context: 'Utility-first styling combined with bespoke tactical HUD and glassmorphic themes',
        verifiedIn: 'NASA CLPS Dashboard & Portfolio UI',
      },
      {
        name: 'HTML5 & CSS3',
        context: 'Semantic document structure, responsive layouts, and accessible high-contrast typography',
        verifiedIn: 'Mol’s Tyangge, SBAT & Web Projects',
      },
      {
        name: 'GSAP & ScrollTrigger',
        context: 'Timeline-choreographed intro sequences, camera transitions, and scroll motion',
        verifiedIn: 'Portfolio Cinematic Intro & Section Choreography',
      },
    ],
  },
  {
    id: 'backend',
    code: 'ARS-03',
    title: 'Backend Development',
    subtitle: 'API design, server-side computation, and authentication-gated workflows',
    accentColor: 'blue',
    skills: [
      {
        name: 'FastAPI (Python)',
        context: 'REST endpoints for mission telemetry, subsolar coordinates, and horizon forecasts',
        verifiedIn: 'NASA CLPS Backend (main.py / astro_engine.py)',
      },
      {
        name: 'PHP Backend Scripting',
        context: 'Server-side business logic, session workflows, and relational database connectivity',
        verifiedIn: 'Academic Information Systems & XAMPP Environments',
      },
      {
        name: 'REST API Fundamentals',
        context: 'Structured JSON contracts, query filtering, and client-server synchronization',
        verifiedIn: 'NASA Challenge, Mol’s Tyangge & SBAT',
      },
      {
        name: 'Role-Scoped Access Patterns',
        context: 'Separating public read-only transparency views from admin-authenticated actions',
        verifiedIn: 'Mol’s Tyangge Store Owner Auth & SBAT Admin Portal',
      },
    ],
  },
  {
    id: 'database',
    code: 'ARS-04',
    title: 'Database Management',
    subtitle: 'Enterprise relational systems, geospatial extensions, and persistent store ledgers',
    accentColor: 'emerald',
    skills: [
      {
        name: 'Microsoft SQL Server',
        context: 'Relational database querying, stored procedures, constraints, and enterprise data modeling',
        verifiedIn: 'UNO-R BSIT Database Management Coursework',
      },
      {
        name: 'PostgreSQL & PostGIS',
        context: 'Spatial schema modeling for lunar landing site coordinates and mission payloads',
        verifiedIn: 'NASA Challenge (data/schema.sql)',
      },
      {
        name: 'Database Design & Management',
        context: 'Entity-relationship modeling, normalization, transactional utang ledgers, and audit trails',
        verifiedIn: 'Mol’s Tyangge & South Bacolod Auto Trading',
      },
    ],
  },
  {
    id: 'ai-ml',
    code: 'ARS-05',
    title: 'Artificial Intelligence & Cybersecurity',
    subtitle: 'Applied AI pipelines for cybersecurity decision support and hackathon solutions',
    accentColor: 'blue',
    skills: [
      {
        name: 'Natural Language Processing (NLP)',
        context: 'Analyzing suspicious message semantics and social-engineering urgency cues',
        verifiedIn: 'PhishNot (BSIT Capstone — In Development)',
      },
      {
        name: 'Optical Character Recognition (OCR)',
        context: 'Extracting text from uploaded screenshots of suspicious messages and emails',
        verifiedIn: 'PhishNot Multi-Modal Input Architecture',
      },
      {
        name: 'AI-Assisted Phishing Detection',
        context: 'Multi-modal suspicious link, domain mismatch, and fraudulent message decision support',
        verifiedIn: 'PhishNot Decision-Support Engine',
      },
      {
        name: 'Retrieval-Augmented Generation (RAG) & ML Concepts',
        context: 'Grounding language model outputs in retrieved context and supervised classification principles',
        verifiedIn: 'AI Solution Prototyping & Capstone Research',
      },
    ],
  },
  {
    id: 'tools',
    code: 'ARS-06',
    title: 'Development Tools',
    subtitle: 'Version control, local server stacks, AI-assisted IDEs, and cloud hosting',
    accentColor: 'emerald',
    skills: [
      {
        name: 'Git & GitHub',
        context: 'Source control, collaborative team repositories, and release tracking',
        verifiedIn: 'github.com/ethanarexilustre1019-ui',
      },
      {
        name: 'Visual Studio Code',
        context: 'Primary IDE for TypeScript, Python, Java, and full-stack web engineering',
        verifiedIn: 'Daily Software Development Workflow',
      },
      {
        name: 'Antigravity & Codex',
        context: 'Agent-governed software engineering workflows and rapid hackathon solution delivery',
        verifiedIn: 'IBM Bob 2.0 Hackathon (lablab.ai Certified)',
      },
      {
        name: 'XAMPP & Render Cloud',
        context: 'Local Apache/MySQL/PHP development stack and live cloud web application hosting',
        verifiedIn: 'Local PHP/SQL Systems, Mol’s Tyangge & SBAT Live Apps',
      },
    ],
  },
  {
    id: 'other',
    code: 'ARS-07',
    title: 'Data Structures & Domain Engineering',
    subtitle: 'Algorithmic problem solving, geospatial telemetry, and student leadership',
    accentColor: 'blue',
    skills: [
      {
        name: "Data Structures & Graph Algorithms (Dijkstra's Algorithm)",
        context: 'Implementing HashMap, LinkedList, PriorityQueue, and weighted shortest-path campus navigation',
        verifiedIn: 'Campus Event Scheduler & Navigator (Java)',
      },
      {
        name: '3D Geospatial & Astronomical Computing',
        context: 'Client-side ephemeris using astronomy-engine, Moon rotation series, and horizon occlusion',
        verifiedIn: '2026 NASA Space Apps Challenge (Galactic Problem Solver)',
      },
      {
        name: 'Competitive Game Mechanics & Team Leadership',
        context: 'Translating Filipino Patintero mechanics into digital gameplay & serving as UNORSSGO CIT Representative',
        verifiedIn: 'Patintero Rush (Regional Top 2) & UNO-R CIT Leadership',
      },
    ],
  },
];
