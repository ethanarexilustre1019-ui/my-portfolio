import { CertificateItem } from '../types/portfolio';

/**
 * Verified Technical & Competition Certificate Registry.
 */
export const certificatesData: CertificateItem[] = [
  {
    id: 'nasa-space-apps-2026',
    indexCode: 'ACH-01 // GLOBAL SPACE APPS',
    title: 'NASA Space Apps Challenge 2026',
    award: 'GALACTIC PROBLEM SOLVER',
    issuer: 'NASA Space Apps Challenge',
    recipientDisplay: 'Ethan Arex Ilustre',
    date: 'November 14–15, 2026',
    recognition:
      'Outstanding participation and efforts to address challenges we face on Earth and in space.',
    signatory: 'Marc Kuchner — Program Scientist, NASA Space Apps Challenge',
    imagePath: '/images/achievements/nasa-space-apps-2026.jpg',
    badgeType: 'nasa',
    relatedProjectId: 'nasa-clps-lunar-navigator',
    verifiedTags: ['NASA Space Apps 2026', 'Galactic Problem Solver', '3D Lunar Geospatial'],
  },
  {
    id: 'ibm-bob-hackathon-2026',
    indexCode: 'ACH-02 // AI HACKATHON',
    title: 'IBM Bob 2.0 Hackathon',
    award: 'Certificate of Completion',
    issuer: 'lablab.ai (Part of NativelyAI) — IBM Bob 2.0 Hackathon',
    recipientDisplay: 'Deku Tzy',
    recipientNote:
      'Displayed on the official certificate under Ethan Arex V. Ilustre’s competition handle "Deku Tzy" (inspired by Izuku Midoriya / Deku). Verified Certificate ID: CMULAQW2Y0213S6010KYL0U19.',
    date: 'September 25–27, 2026',
    recognition:
      'For outstanding performance, attendance, successfully completing and submitting a solution based on Codex and Antigravity in the IBM Bob 2.0 Hackathon.',
    certificateId: 'CMULAQW2Y0213S6010KYL0U19',
    signatory: 'Pawel Czech — Founder, NativelyAI',
    imagePath: '/images/achievements/ibm-bob-hackathon-2026.jpg',
    badgeType: 'hackathon',
    verifiedTags: ['IBM Bob 2.0', 'Codex & Antigravity', 'lablab.ai / NativelyAI'],
  },
  {
    id: 'patintero-rush-regional-top2',
    indexCode: 'ACH-03 // REGIONAL COMPETITION',
    title: 'Patintero Rush — Regional Competition',
    award: 'TOP 2 — REGIONAL LEVEL',
    issuer: 'Regional Game Development Competition — Negros Island Region, Philippines',
    recipientDisplay: 'Ethan Arex V. Ilustre & Team',
    date: 'Regional Level Recognition',
    recognition:
      'Secured Top 2 at the Regional Level in the Negros Island Region, Philippines with the competitive game development project Patintero Rush.',
    badgeType: 'regional-award',
    relatedProjectId: 'patintero-rush',
    verifiedTags: ['Regional Top 2', 'Negros Island Region', 'Game Development'],
  },
];
