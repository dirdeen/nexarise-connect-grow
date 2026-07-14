export type EmployerJobStatus = "Active" | "Draft" | "Archived";

export type EmployerJob = {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicants: number;
  views: number;
  posted: string;
  status: EmployerJobStatus;
};

export type Candidate = {
  id: string;
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  portfolio: string;
  cvFile: string;
  experience: string;
  education: string;
  skills: string[];
  certifications: string[];
  workHistory: string[];
  appliedFor: string;
  appliedDate: string;
  status: "New" | "Shortlisted" | "Interview" | "Rejected";
  summary: string;
};

export type EmployerJobFormValues = {
  title: string;
  company: string;
  category: string;
  location: string;
  type: EmployerJob["type"];
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
};

export const COMPANY_PROFILE = {
  name: "NexaRise Talent Partners",
  initials: "NR",
  location: "Freetown, Sierra Leone",
  industry: "Recruitment & Workforce Development",
  employees: "24 team members",
  verified: true,
};

export const EMPLOYER_JOBS: EmployerJob[] = [
  {
    id: "front-office-coordinator",
    title: "Front Office Coordinator",
    company: COMPANY_PROFILE.name,
    category: "Operations",
    location: "Freetown",
    type: "Full-time",
    salary: "NLe 6,000 – 8,000 / mo",
    description:
      "Coordinate reception, visitor support, scheduling and client communication for a growing workforce partner in Freetown.",
    requirements: [
      "2+ years office administration experience",
      "Strong written and spoken English",
      "Comfortable with spreadsheets and scheduling tools",
    ],
    benefits: ["Medical allowance", "Transport stipend", "Career development plan"],
    applicants: 28,
    views: 412,
    posted: "2d ago",
    status: "Active",
  },
  {
    id: "field-verification-officer",
    title: "Field Verification Officer",
    company: COMPANY_PROFILE.name,
    category: "Public Sector",
    location: "Bo",
    type: "Contract",
    salary: "NLe 5,500 – 7,200 / mo",
    description:
      "Verify workforce member identities, references and job readiness across partner communities.",
    requirements: [
      "Experience in field operations or community work",
      "Ability to travel within assigned district",
      "Excellent record keeping and integrity",
    ],
    benefits: ["Per diem", "Mobile data allowance", "Safety training"],
    applicants: 17,
    views: 265,
    posted: "5d ago",
    status: "Active",
  },
  {
    id: "employer-success-associate",
    title: "Employer Success Associate",
    company: COMPANY_PROFILE.name,
    category: "Marketing",
    location: "Freetown",
    type: "Full-time",
    salary: "NLe 8,000 – 10,000 / mo",
    description:
      "Support employers with job posts, candidate shortlists, interview scheduling and hiring outcomes.",
    requirements: [
      "3+ years customer success or recruitment experience",
      "Strong communication and follow-up habits",
      "Comfortable presenting hiring insights",
    ],
    benefits: ["Performance bonus", "Hybrid work", "Learning budget"],
    applicants: 34,
    views: 518,
    posted: "1w ago",
    status: "Draft",
  },
  {
    id: "training-program-coordinator",
    title: "Training Program Coordinator",
    company: COMPANY_PROFILE.name,
    category: "Development",
    location: "Kenema",
    type: "Contract",
    salary: "NLe 7,000 – 9,000 / mo",
    description:
      "Coordinate employability workshops, mentor sessions and training partner reporting in the Eastern Region.",
    requirements: [
      "Experience coordinating training or youth programs",
      "Strong reporting and partner management skills",
      "Willingness to travel for program monitoring",
    ],
    benefits: ["Project completion bonus", "Travel allowance", "Training certification"],
    applicants: 12,
    views: 188,
    posted: "3w ago",
    status: "Archived",
  },
];

export const CANDIDATES: Candidate[] = [
  {
    id: "aminata-kamara",
    name: "Aminata Kamara",
    role: "Front Office Coordinator",
    location: "Freetown",
    email: "aminata.kamara@example.com",
    phone: "+232 76 222 114",
    portfolio: "https://portfolio.example.com/aminata",
    cvFile: "aminata-kamara-cv.pdf",
    experience: "4 years office administration",
    education: "Diploma in Business Administration, Demo Business Institute",
    skills: ["Scheduling", "Client Service", "Microsoft Excel", "Records Management"],
    certifications: ["Customer Service Essentials", "Office Administration"],
    workHistory: [
      "Reception Assistant, Demo Business College",
      "Administrative Clerk, Demo Commercial Bank",
    ],
    appliedFor: "Front Office Coordinator",
    appliedDate: "Today",
    status: "New",
    summary:
      "Organized front-office professional with strong reception, scheduling and client communication experience.",
  },
  {
    id: "mohamed-bangura",
    name: "Mohamed Bangura",
    role: "Field Verification Officer",
    location: "Bo",
    email: "mohamed.bangura@example.com",
    phone: "+232 77 445 901",
    portfolio: "https://portfolio.example.com/mohamed-bangura",
    cvFile: "mohamed-bangura-cv.pdf",
    experience: "5 years field operations",
    education: "BSc Sociology, Demo University",
    skills: ["Field Visits", "Reference Checks", "Data Collection", "Community Engagement"],
    certifications: ["Safeguarding Training", "KoboToolbox Data Collection"],
    workHistory: [
      "Enumerator, Demo Statistics Agency",
      "Field Assistant, Demo Development Partner",
    ],
    appliedFor: "Field Verification Officer",
    appliedDate: "Yesterday",
    status: "Shortlisted",
    summary:
      "Reliable field operator with district-level verification, survey and stakeholder coordination experience.",
  },
  {
    id: "fatmata-sesay",
    name: "Fatmata Sesay",
    role: "Employer Success Associate",
    location: "Freetown",
    email: "fatmata.sesay@example.com",
    phone: "+232 78 010 345",
    portfolio: "https://fatmata.example.com",
    cvFile: "fatmata-sesay-cv.pdf",
    experience: "6 years recruitment and account support",
    education: "BA Human Resource Management, Demo University",
    skills: ["Recruitment", "Account Management", "Interview Coordination", "Reporting"],
    certifications: ["HR Analytics Fundamentals", "Interviewing Skills"],
    workHistory: ["Recruitment Officer, Demo Telecom SL", "HR Assistant, Demo Mobile SL"],
    appliedFor: "Employer Success Associate",
    appliedDate: "2d ago",
    status: "Interview",
    summary:
      "Recruitment-focused HR professional with strong employer communication and candidate pipeline management.",
  },
  {
    id: "ibrahim-koroma",
    name: "Ibrahim Koroma",
    role: "Training Program Coordinator",
    location: "Kenema",
    email: "ibrahim.koroma@example.com",
    phone: "+232 79 300 882",
    portfolio: "https://portfolio.example.com/ibrahim-koroma",
    cvFile: "ibrahim-koroma-cv.pdf",
    experience: "3 years training coordination",
    education: "BSc Development Studies, Eastern Technical University",
    skills: ["Training Logistics", "Partner Reporting", "Workshop Facilitation", "M&E"],
    certifications: ["Project Cycle Management", "Youth Facilitation"],
    workHistory: [
      "Program Assistant, Demo Training Council",
      "Training Intern, Demo Development Agency",
    ],
    appliedFor: "Training Program Coordinator",
    appliedDate: "4d ago",
    status: "New",
    summary:
      "Program coordinator with hands-on training logistics and partner reporting experience in Eastern Province.",
  },
];

export function findEmployerJob(id: string) {
  return EMPLOYER_JOBS.find((job) => job.id === id);
}

export function findCandidate(id: string) {
  return CANDIDATES.find((candidate) => candidate.id === id);
}

export function valuesFromJob(job?: EmployerJob): EmployerJobFormValues {
  if (!job) {
    return {
      title: "",
      company: "",
      category: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      requirements: "",
      benefits: "",
    };
  }

  return {
    title: job.title,
    company: job.company,
    category: job.category,
    location: job.location,
    type: job.type,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements.join("\n"),
    benefits: job.benefits.join("\n"),
  };
}
