import { JourneyMilestone } from '../types/portfolio';

/**
 * Education and Software Engineering Journey Timeline.
 * Strictly client-focused and factual—no invented graduation dates or filler credentials.
 */
export const educationTimeline: JourneyMilestone[] = [
  {
    id: 'bsit-unor-current',
    phaseCode: 'PHASE 01 // ACADEMIC FOUNDATION',
    period: 'Current — Third-Year College Student',
    title: 'Bachelor of Science in Information Technology (BSIT)',
    organization: 'University of Negros Occidental – Recoletos (UNO-R)',
    location: 'Bacolod City, Negros Occidental, Philippines',
    type: 'academic',
    isCurrent: true,
    description:
      'Pursuing a Bachelor of Science in Information Technology as a third-year student, focusing on software engineering, web application architecture, database systems, cybersecurity, and problem-oriented system design.',
    highlights: [
      'Academic Level: Third-Year BSIT Student at University of Negros Occidental – Recoletos',
      'Core Focus: Full-stack web applications, 3D WebGL/Three.js, artificial intelligence, cybersecurity, and relational databases',
      'Guided by the philosophy: "I always love creating solutions to problems."',
    ],
  },
  {
    id: 'live-community-web-systems',
    phaseCode: 'PHASE 02 // PRODUCTION WEB & ALGORITHMIC SYSTEMS',
    period: 'Applied Software Engineering',
    title: "Mol's Tyangge, SBAT & Campus Event Scheduler & Navigator",
    organization: 'Live Cloud Deployments & Java Algorithmic Systems',
    location: 'Bacolod City / Negros Island Region, Philippines',
    type: 'project',
    description:
      "Designed and deployed practical web applications addressing real local business workflows alongside algorithmic software: Mol's Tyangge for transparent store inventory and utang bookkeeping, South Bacolod Auto Trading (SBAT) for digital vehicle inventory, and Campus Event Scheduler & Navigator in Java.",
    highlights: [
      "Built Mol's Tyangge with a public Customer Transparency View and auth-gated Store Owner Administration",
      'Developed the South Bacolod Auto Trading (SBAT) digital showroom with multi-attribute vehicle filtering and comparison views',
      "Engineered Campus Event Scheduler & Navigator in Java using HashMap, LinkedList, PriorityQueue, and Dijkstra's shortest-path algorithm",
    ],
  },
  {
    id: 'ibm-bob-hackathon-milestone',
    phaseCode: 'PHASE 03 // INTERNATIONAL AI HACKATHON',
    period: 'September 25–27, 2026',
    title: 'IBM Bob 2.0 Hackathon — Solution Delivery',
    organization: 'lablab.ai / NativelyAI',
    location: 'Global Online Hackathon',
    type: 'competition',
    description:
      'Completed and submitted an AI-powered software solution built with Codex and Antigravity during the IBM Bob 2.0 Hackathon, earning an official Certificate of Completion.',
    highlights: [
      'Awarded Certificate of Completion (ID: CMULAQW2Y0213S6010KYL0U19) under handle "Deku Tzy"',
      'Recognized for outstanding performance, attendance, and solution submission based on Codex and Antigravity',
    ],
  },
  {
    id: 'patintero-rush-regional-milestone',
    phaseCode: 'PHASE 04 // REGIONAL DISTINCTION',
    period: 'Regional Competition Milestone',
    title: 'Patintero Rush — Top 2 Regional Level',
    organization: 'Negros Island Region Competition',
    location: 'Negros Island Region, Philippines',
    type: 'competition',
    description:
      'Co-developed Patintero Rush, translating traditional Filipino street-game mechanics into a competitive digital game experience that ranked Top 2 at the Regional Level in the Negros Island Region.',
    highlights: [
      'Achieved Top 2 Regional Level placement in the Negros Island Region, Philippines',
      'Demonstrated collaborative software engineering and rapid interactive gameplay iteration',
    ],
  },
  {
    id: 'nasa-space-apps-2026-milestone',
    phaseCode: 'PHASE 05 // 3D GEOSPATIAL & SPACE TELEMETRY',
    period: 'November 14–15, 2026',
    title: 'NASA Space Apps Challenge 2026 — Galactic Problem Solver',
    organization: 'NASA Space Apps Challenge',
    location: 'Global / Philippines',
    type: 'competition',
    description:
      'Co-engineered the NASA CLPS Lunar Mission Browser & Landing Site Navigator using React, TypeScript, Three.js, astronomy-engine, and FastAPI, earning the Galactic Problem Solver distinction.',
    highlights: [
      'Built an interactive 3D LRO lunar globe with 7 CLPS mission markers and 29.5-day synodic illumination profiles',
      'Earned the official NASA Space Apps Challenge 2026 Galactic Problem Solver certificate',
    ],
  },
  {
    id: 'phishnot-capstone-milestone',
    phaseCode: 'PHASE 06 // ACTIVE BSIT CAPSTONE',
    period: 'Ongoing — Third-Year BSIT Capstone Project',
    title: 'PhishNot — AI-Powered Phishing Detection & Decision Support',
    organization: 'University of Negros Occidental – Recoletos',
    location: 'Philippines',
    type: 'capstone',
    isCurrent: true,
    description:
      'Currently architecting and developing PhishNot, an AI-assisted cybersecurity decision-support web application designed to help everyday digital consumers evaluate suspicious links, messages, and screenshots.',
    highlights: [
      'Integrating multi-modal input processing (OCR text extraction, NLP intent analysis, and URL/domain mismatch checks)',
      'Designed with transparent, multilingual explanations to empower user decision-making',
    ],
  },
];
