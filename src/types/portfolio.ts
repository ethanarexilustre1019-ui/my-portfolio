export type SectionId =
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'education'
  | 'contact';

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  handle: string;
}

export interface OwnerProfile {
  fullName: string;
  initials: string;
  heroCodename: string;
  age: number;
  degree: string;
  academicLevel: string;
  university: string;
  location: string;
  email: string;
  resumePath: string;
  profileImagePath: string;
  professionalIdentities: string[];
  personalPhilosophy: string;
  mainTagline: string;
  alternativeHeroStatement: string;
  coreMessage: string;
  expandedAbout: string[];
  interests: string[];
  socials: SocialLink[];
}

export interface SkillItem {
  name: string;
  context: string;
  verifiedIn?: string;
}

export interface SkillCategory {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  accentColor: 'emerald' | 'blue';
  skills: SkillItem[];
}

export type ProjectStatus =
  | 'LIVE DEPLOYMENT'
  | 'VERIFIED REPOSITORY'
  | 'DEVELOPMENT IN PROGRESS'
  | 'REGIONAL TOP 2 AWARD';

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectItem {
  id: string;
  indexCode: string;
  name: string;
  shortName: string;
  category: string;
  status: ProjectStatus;
  statusNote?: string;
  isAwardWinner?: boolean;
  awardTitle?: string;
  has3DPreview?: boolean;
  description: string;
  problemStatement: string;
  proposedSolution: string;
  keyFeatures: string[];
  technologies: string[];
  architectureHighlights: string[];
  disclaimer?: string;
  githubUrl?: string;
  githubNote?: string;
  liveUrl?: string;
  screenshots: ProjectScreenshot[];
}

export interface CertificateItem {
  id: string;
  indexCode: string;
  title: string;
  award: string;
  issuer: string;
  recipientDisplay: string;
  recipientNote?: string;
  date: string;
  recognition: string;
  certificateId?: string;
  signatory?: string;
  imagePath?: string;
  badgeType: 'nasa' | 'hackathon' | 'regional-award';
  relatedProjectId?: string;
  verifiedTags: string[];
}

export interface JourneyMilestone {
  id: string;
  phaseCode: string;
  period: string;
  title: string;
  organization: string;
  location: string;
  type: 'academic' | 'competition' | 'project' | 'capstone';
  description: string;
  highlights: string[];
  isCurrent?: boolean;
}
