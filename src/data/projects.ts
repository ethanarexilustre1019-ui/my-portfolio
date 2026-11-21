import { ProjectItem } from '../types/portfolio';

export const featuredProjects: ProjectItem[] = [
  {
    id: 'nasa-clps-lunar-navigator',
    indexCode: 'PRJ-01 // 3D GEOSPATIAL',
    name: 'NASA CLPS Lunar Mission Browser & Landing Site Navigator',
    shortName: 'NASA CLPS Lunar Browser',
    category: '3D Geospatial Dashboard / Space Apps Challenge',
    status: 'VERIFIED REPOSITORY',
    statusNote: '2026 NASA Space Apps Challenge — Galactic Problem Solver',
    has3DPreview: true,
    description:
      "An interactive 3D geospatial dashboard for exploring NASA's Commercial Lunar Payload Services (CLPS) missions, lunar landing coordinates, lunar environments, and astronomical telemetry.",
    problemStatement:
      'Evaluating lunar landing sites requires correlating 3D lunar topography, terrain-masked solar illumination, Earth direct-to-Earth (DTE) line-of-sight communication windows, and multi-mission payload data across a 29.5-day synodic cycle—data that is typically fragmented across static tables and scientific ephemerides.',
    proposedSolution:
      'Built a client-first 3D geospatial web application powered by React, TypeScript, Three.js, and astronomy-engine (with an optional FastAPI and PostGIS backend) that renders an LRO-derived 3D lunar globe, plots 7 NASA CLPS missions, computes topocentric horizon occlusion, and enables side-by-side landing site comparison.',
    keyFeatures: [
      'Interactive LRO-derived 3D lunar globe (moon_lro.glb) with camera presets (Global, South Pole, Near Side, Far Side) and live orbital timeline scrubber',
      'Catalog of 7 NASA CLPS missions (Peregrine Mission 1, IM-1 Odysseus, IM-2 Athena, Blue Ghost Mission 1, Draper Series 2 / APEX 1.0, Griffin Mission 1, IM-3) with vendor, status, and region filters',
      'Client-side astronomical telemetry engine using astronomy-engine and IAU/IAG WGCCRE 2009 Moon rotation series with topocentric parallax',
      '29.5-day synodic solar illumination and Direct-to-Earth (DTE) elevation profiles with terrain-masked horizon forecasts',
      'Site Comparison Navigator supporting up to 4 concurrent sites with 3D SkyDome, 2D Polar Sky & Horizon Rose, battery night-survival modeling, and CSV/JSON export',
      'FastAPI REST backend (/api/missions, /api/astro/telemetry, /api/astro/subsolar, /api/astro/forecast) backed by a PostgreSQL/PostGIS spatial schema',
    ],
    technologies: [
      'React 19',
      'TypeScript',
      'Vite',
      'Three.js',
      'React Three Fiber',
      'astronomy-engine',
      'Zustand',
      'Recharts',
      'Tailwind CSS',
      'FastAPI (Python)',
      'NumPy',
      'PostgreSQL / PostGIS',
    ],
    architectureHighlights: [
      'Hybrid Ephemeris Execution: Runs zero-latency astronomical vector math directly in the browser by default while maintaining full REST parity with the FastAPI astro_engine service.',
      'LROC & LDEM Texture Pipeline: Uses NASA LRO color maps (lroc_color_2k/4k) paired with Lunar Orbiter Laser Altimeter displacement maps (ldem_2k) for realistic surface relief.',
    ],
    githubUrl: 'https://github.com/acguanzon/NASA-Challenge',
    screenshots: [
      {
        src: '/images/achievements/nasa-space-apps-2026.jpg',
        alt: 'NASA Space Apps Challenge 2026 Galactic Problem Solver Certificate for Ethan Arex Ilustre',
        caption: 'Awarded Galactic Problem Solver in the 2026 NASA Space Apps Challenge (Nov 14–15, 2026).',
      },
    ],
  },
  {
    id: 'phishnot',
    indexCode: 'PRJ-02 // AI CYBERSECURITY',
    name: 'PhishNot — AI-Powered Phishing Detection & Decision Support',
    shortName: 'PhishNot (Capstone)',
    category: 'Cybersecurity / Artificial Intelligence',
    status: 'DEVELOPMENT IN PROGRESS',
    statusNote: 'BSIT Capstone Project — Active Development',
    description:
      'PhishNot is an AI-powered phishing detection and prevention web application designed to help everyday digital consumers identify suspicious digital communications and potential phishing attempts. Its goal is to help users make more informed decisions before interacting with suspicious links, messages, or digital content.',
    problemStatement:
      'Everyday digital consumers frequently encounter deceptive SMS messages, emails, chat links, and screenshots engineered to mimic legitimate institutions. Traditional technical threat feeds rarely explain why a message is suspicious in accessible, multilingual terms.',
    proposedSolution:
      'Developing a multi-modal decision-support web platform that accepts text, URLs, and image screenshots, applies OCR text extraction and NLP intent analysis alongside domain/entity mismatch checks, and outputs clear risk classifications with human-readable explanations.',
    keyFeatures: [
      'Multi-modal input processing supporting raw message text, suspicious URLs, and uploaded screenshots (Planned / In Implementation)',
      'OCR-assisted text extraction for analyzing screenshots of SMS, messaging apps, and email notices (In Progress)',
      'NLP-based intent analysis detecting urgency manipulation, credential harvesting cues, and impersonation patterns (In Progress)',
      'Suspicious URL assessment and domain-to-entity mismatch verification (In Progress)',
      'Structured risk classification paired with user-friendly, non-jargon detection explanations (In Progress)',
      'Multilingual support tailored for local and everyday digital consumers (Planned / In Implementation)',
    ],
    technologies: [
      'Python',
      'NLP / Text Classification',
      'OCR Extraction Pipeline',
      'URL & Domain Heuristics',
      'Modern Web Frontend',
      'REST API Architecture',
    ],
    architectureHighlights: [
      'Decision-Support Boundary: Engineered explicitly as an advisory layer that empowers users with transparent risk indicators rather than claiming an absolute guarantee of security.',
      'Explainable Threat Breakdown: Prioritizes plain-language reasoning so non-technical users understand which specific URL, domain mismatch, or linguistic pattern triggered a warning.',
    ],
    disclaimer:
      'IMPORTANT NOTICE: PhishNot is currently under active development as a Third-Year BSIT Capstone Project. Features listed represent the capstone design architecture and ongoing implementation scope. The application provides decision support to help users evaluate suspicious content and is not an absolute guarantee of security.',
    githubUrl: 'https://github.com/ethanarexilustre1019-ui/PhishNot',
    githubNote: 'Capstone repository (currently private/restricted during active academic development)',
    screenshots: [],
  },
  {
    id: 'mols-tyangge',
    indexCode: 'PRJ-03 // FINTECH & RETAIL',
    name: "Mol's Tyangge — Modern Sari-Sari Store Management System",
    shortName: "Mol's Tyangge",
    category: 'Web Application / Store Management',
    status: 'LIVE DEPLOYMENT',
    statusNote: 'Live on Render — Public Transparency & Store Admin Views',
    description:
      'A modern sari-sari store management system designed to help store owners organize inventory, monitor customer balances, and manage borrowing and credit records with built-in customer transparency.',
    problemStatement:
      'Neighborhood sari-sari stores traditionally track inventory and customer credit ("utang") in paper notebooks, leading to misplaced records, balance disputes, and lack of real-time visibility into outstanding receivables vs. collected payments.',
    proposedSolution:
      "Created and deployed Mol's Tyangge, a dual-mode web application featuring a public Customer Transparency View (allowing customers to verify balances, borrowing logs, and live audit records) alongside an authentication-gated Store Owner Administration portal.",
    keyFeatures: [
      'Overview & Store Dashboard displaying KPI cards for Total Borrowed, Total Collected, Utang Outstanding, Active Borrowers, and Store Status Alerts',
      'Customer Transparency View with live public audit trail (Transparency Logs) enforcing clear and honest sari-sari bookkeeping',
      'Customers & Balances directory with quick status filters (All Customers, Has Balance, Fully Paid)',
      'Borrowing Ledger (Utang) tracking borrowed items, amounts, due dates, and settlement states (Unpaid, Partial, Overdue, Fully Paid)',
      'Payment History log with payment method filtering (All Methods, Cash Only, GCash Only)',
      'Product Catalog (Inventory) with category filtering and auth-gated Store Owner Login for Financial Reports and Store Settings',
    ],
    technologies: [
      'JavaScript (ES6+)',
      'HTML5',
      'CSS3 / Glassmorphic UI',
      'REST / JSON State Persistence',
      'Role-Based Admin Modal Auth',
      'Render Cloud Hosting',
    ],
    architectureHighlights: [
      'Transparency-First Architecture: Separates read-only customer audit views (/app.html#dashboard, #customers, #transactions, #payments, #items) from password-protected store owner mutations.',
      'Live Audit Telemetry: Records administrative actions (such as clean-slate resets and ledger updates) in a public Transparency Log.',
    ],
    liveUrl: 'https://mols-tyange-live.onrender.com/',
    githubUrl: 'https://github.com/ethanarexilustre1019-ui',
    screenshots: [
      {
        src: '/images/projects/mols-tyangge-hero.png',
        alt: "Mol's Tyangge Landing Page and Feature Navigation Cards",
        caption: "Mol's Tyangge storefront landing view with quick navigation to Dashboard, Products, Utang Ledger, and Store Management.",
      },
      {
        src: '/images/projects/mols-tyangge-dashboard.png',
        alt: "Mol's Tyangge Overview Dashboard and Customer Transparency View",
        caption: 'Live Customer Transparency View showing Store Overview KPIs, status alerts, and navigation sidebar.',
      },
      {
        src: '/images/projects/mols-tyangge-admin.png',
        alt: "Mol's Tyangge Store Owner Login Modal",
        caption: 'Authentication gate protecting Store Administration routes (Financial Reports and Store Settings).',
      },
    ],
  },
  {
    id: 'south-bacolod-auto-trading',
    indexCode: 'PRJ-04 // AUTOMOTIVE PLATFORM',
    name: 'South Bacolod Auto Trading (SBAT) — Digital Automotive Showroom',
    shortName: 'South Bacolod Auto Trading',
    category: 'Automotive / Web Development',
    status: 'LIVE DEPLOYMENT',
    statusNote: 'Live on Render — Bacolod City Automotive Showroom',
    description:
      'A web-based digital automotive showroom and inventory exploration platform developed for South Bacolod Auto Trading in Bacolod City.',
    problemStatement:
      'Local automotive dealerships often rely solely on scattered social media posts to showcase vehicle stock, making it difficult for prospective buyers to filter vehicles by transmission, fuel type, or availability status, or compare multiple vehicles side-by-side.',
    proposedSolution:
      'Designed and deployed a dedicated digital automotive showroom featuring multi-attribute inventory filtering, side-by-side vehicle comparison, client-side favorites bookmarking, direct Facebook Messenger inquiry integration, and an administrative login interface.',
    keyFeatures: [
      'Digital Automotive Showroom landing experience (#home) with quick inventory access and direct Messenger communication triggers',
      'Multi-facet Vehicle Search & Filter engine (#vehicles) filtering by Make, Transmission, Fuel, Body Type, and Status (All, Available, Reserved, Sold)',
      'Multi-criteria sorting system (Newest First, Oldest First, Price: Low to High, Price: High to Low, Year: Newest/Oldest)',
      'Side-by-Side Vehicle Comparison workspace (#compare) and persistent Saved Favorites view (#favorites)',
      'Dedicated About (#about) and Contact Us (#contact) views featuring an integrated inquiry form and Facebook Messenger connection',
      'Header Admin Login portal hook for managing showroom settings and vehicle listings',
    ],
    technologies: [
      'JavaScript (ES6+)',
      'HTML5',
      'Custom Dark/Crimson Grid CSS',
      'Hash-Routed SPA Architecture',
      'Render Cloud Hosting',
    ],
    architectureHighlights: [
      'Zero-Reload Hash Router: Smoothly transitions across #home, #vehicles, #compare, #favorites, #about, and #contact views within a responsive single-page shell.',
      'Direct Dealership Conversion Path: Couples structured inventory browsing with one-click Facebook Messenger handoff and inquiry form submission.',
    ],
    liveUrl: 'https://sbat-south-bacolod-auto-trading.onrender.com/',
    githubUrl: 'https://github.com/ethanarexilustre1019-ui/SBAT-website',
    screenshots: [
      {
        src: '/images/projects/sbat-showroom.png',
        alt: 'South Bacolod Auto Trading (SBAT) Live Digital Showroom Interface',
        caption: 'Live SBAT automotive platform deployed on Render showing the dark crimson grid aesthetic and navigation bar.',
      },
    ],
  },
  {
    id: 'patintero-rush',
    indexCode: 'PRJ-05 // REGIONAL TOP 2 AWARD',
    name: 'Patintero Rush — Competitive Regional Game Development Project',
    shortName: 'Patintero Rush',
    category: 'Game Development / Competition Project',
    status: 'REGIONAL TOP 2 AWARD',
    statusNote: 'TOP 2 — REGIONAL LEVEL (Negros Island Region, Philippines)',
    isAwardWinner: true,
    awardTitle: 'REGIONAL TOP 2 — NEGROS ISLAND REGION, PHILIPPINES',
    description:
      'A competitive game development project inspired by the traditional Filipino street game Patintero, recognized with a Top 2 Regional Level placement in the Negros Island Region, Philippines.',
    problemStatement:
      'Traditional Filipino heritage games like Patintero possess rich tactical movement, timing, and spatial tagging mechanics that are underrepresented in modern competitive interactive digital experiences.',
    proposedSolution:
      'Collaboratively engineered Patintero Rush as a fast-paced competitive game project translating classic grid-line interception and runner evasion mechanics into an engaging digital experience that earned Top 2 Regional recognition in the Negros Island Region.',
    keyFeatures: [
      'Award-winning regional competition build: Ranked Top 2 at the Regional Level in the Negros Island Region, Philippines',
      'Inspired by traditional Filipino Patintero grid-defense and runner evasion gameplay mechanics',
      'Collaborative team software engineering and rapid iterative game tuning under regional competition constraints',
      'Focused on responsive player movement, line-interception timing, and replayable competitive rounds',
    ],
    technologies: [
      'Game Development Architecture',
      'Real-Time Collision & Grid Logic',
      'Interactive State Management',
      'Collaborative Git Workflow',
    ],
    architectureHighlights: [
      'Regional Distinction: Achieved Top 2 Regional placement in the Negros Island Region, Philippines.',
      'Repository Access Note: The competition snapshot repository (PatinteroRush-2026-10-18_16-14-35) is hosted under collaborator account acguanzon and is currently set to private/restricted visibility.',
    ],
    githubUrl: 'https://github.com/acguanzon/PatinteroRush-2026-10-18_16-14-35',
    githubNote: 'Collaborative repository under acguanzon (currently private/restricted on GitHub)',
    screenshots: [],
  },
  {
    id: 'campus-event-scheduler-navigator',
    indexCode: 'PRJ-06 // DATA STRUCTURES & ALGORITHMS',
    name: 'Campus Event Scheduler & Navigator — Java Graph & Priority Scheduling System',
    shortName: 'Campus Event Scheduler',
    category: 'Software Development / Data Structures and Algorithms',
    status: 'VERIFIED REPOSITORY',
    statusNote: "Java Event Visualization, PriorityQueue & Dijkstra's Algorithm",
    description:
      "A Java-based campus event visualization, scheduling, and shortest-path navigation system built around core data structures (HashMap, LinkedList, PriorityQueue) and Dijkstra's graph routing algorithm.",
    problemStatement:
      'Managing student activities across a multi-building university campus requires both conflict-free chronological prioritization of events and optimal walking route computation between campus venues.',
    proposedSolution:
      "Engineered a Java application that indexes campus events in O(1) lookup tables via HashMap, maintains ordered event chains with LinkedList, schedules high-priority student activities via PriorityQueue, and computes shortest walking paths across campus nodes using Graph structures and Dijkstra's algorithm.",
    keyFeatures: [
      'Java-based event visualization and scheduling engine designed for organizing university student activities',
      'Fast key-value event indexing and conflict lookup implemented with Java HashMap and dynamic LinkedList chains',
      'Automated chronological and priority-weighted activity ordering powered by PriorityQueue',
      'Graph-based campus venue representation modeling buildings and walkways as weighted vertices and edges',
      "Shortest-path campus navigation powered by Dijkstra's algorithm to guide students between scheduled event locations",
    ],
    technologies: [
      'Java',
      "Dijkstra's Algorithm",
      'Graph Data Structures',
      'PriorityQueue',
      'HashMap & LinkedList',
      'Object-Oriented Design',
    ],
    architectureHighlights: [
      'Algorithmic Efficiency: Combines O(1) average-case HashMap event retrieval with O(log n) PriorityQueue scheduling and weighted graph traversal.',
      "Graph Navigation Engine: Models campus buildings and pathways as a weighted adjacency graph traversed via Dijkstra's shortest-path algorithm.",
    ],
    githubUrl: 'https://github.com/ethanarexilustre1019-ui',
    screenshots: [],
  },
];
