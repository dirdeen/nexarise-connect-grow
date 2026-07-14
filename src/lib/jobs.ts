export type Job = {
  id: string;
  title: string;
  company: string;
  companyShort: string;
  logoColor: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  category: string;
  salary: string;
  salaryMin: number;
  experience: string;
  postedDays: number;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  about: string;
};

export const JOBS: Job[] = [
  {
    id: "orange-network-eng",
    title: "Senior Network Engineer",
    company: "Orange Sierra Leone",
    companyShort: "OSL",
    logoColor: "#FF7900",
    location: "Freetown",
    type: "Full-time",
    category: "Engineering",
    salary: "NLe 18,000 – 24,000 / mo",
    salaryMin: 18000,
    experience: "5+ years",
    postedDays: 2,
    deadline: "August 20, 2026",
    description:
      "Orange Sierra Leone is expanding its 4G/5G footprint across the Western Area and provincial capitals. We are hiring a Senior Network Engineer to design, deploy and optimise our core and access networks.",
    responsibilities: [
      "Design and maintain RAN and transport network architecture",
      "Lead 4G/5G rollout across Freetown, Bo and Kenema",
      "Coordinate with vendors and regional NOC teams",
      "Own capacity planning and performance KPIs",
    ],
    requirements: [
      "BSc in Telecoms, Electrical or Computer Engineering",
      "5+ years operating carrier-grade mobile networks",
      "Hands-on with Huawei / Ericsson RAN",
      "CCNP or equivalent certification preferred",
    ],
    benefits: [
      "Medical cover for family",
      "Performance bonus",
      "Learning budget",
      "Company transport",
    ],
    about:
      "Orange Sierra Leone is the country's leading telecom operator, serving over 3 million subscribers with mobile, fibre and Orange Money services.",
  },
  {
    id: "africell-brand-mgr",
    title: "Brand Marketing Manager",
    company: "Africell",
    companyShort: "AF",
    logoColor: "#7A1FA2",
    location: "Freetown",
    type: "Full-time",
    category: "Marketing",
    salary: "NLe 14,000 – 19,000 / mo",
    salaryMin: 14000,
    experience: "4+ years",
    postedDays: 4,
    deadline: "August 15, 2026",
    description:
      "Drive Africell's brand strategy across Sierra Leone, leading integrated campaigns for data, Afrimoney and lifestyle products.",
    responsibilities: [
      "Own the annual brand and ATL/BTL calendar",
      "Manage creative and media agency partners",
      "Lead sponsorship activations (music, sports, tech)",
      "Track brand health and campaign ROI",
    ],
    requirements: [
      "Degree in Marketing, Communications or Business",
      "4+ years brand management, ideally FMCG or telecom",
      "Strong storytelling and agency briefing skills",
    ],
    benefits: ["Airtime & data package", "Health insurance", "Annual bonus", "Hybrid schedule"],
    about:
      "Africell is a pan-African mobile operator known for youth culture, affordable data and Afrimoney financial services.",
  },
  {
    id: "rokel-credit-analyst",
    title: "Credit Risk Analyst",
    company: "Rokel Commercial Bank",
    companyShort: "RCB",
    logoColor: "#0D5EAF",
    location: "Freetown",
    type: "Full-time",
    category: "Finance",
    salary: "NLe 12,000 – 16,000 / mo",
    salaryMin: 12000,
    experience: "3+ years",
    postedDays: 1,
    deadline: "August 5, 2026",
    description:
      "Support Rokel's SME and corporate lending desk by assessing credit applications and monitoring the performance of the loan book.",
    responsibilities: [
      "Analyse financial statements and collateral",
      "Prepare credit memos for the risk committee",
      "Monitor covenants and early-warning indicators",
    ],
    requirements: [
      "BSc in Finance, Accounting or Economics",
      "3+ years commercial banking experience",
      "ACCA / CFA Level I is a plus",
    ],
    benefits: ["Staff loan facility", "Pension top-up", "Medical cover"],
    about:
      "Rokel Commercial Bank is one of Sierra Leone's oldest commercial banks, with 27 branches nationwide.",
  },
  {
    id: "np-station-mgr",
    title: "Station Operations Manager",
    company: "NP Sierra Leone",
    companyShort: "NP",
    logoColor: "#0A7B3E",
    location: "Bo",
    type: "Full-time",
    category: "Operations",
    salary: "NLe 10,000 – 13,000 / mo",
    salaryMin: 10000,
    experience: "3+ years",
    postedDays: 6,
    deadline: "August 12, 2026",
    description:
      "Lead day-to-day operations of NP's flagship service station in Bo, managing fuel stock, staff and customer experience.",
    responsibilities: [
      "Supervise pump attendants, cashiers and shop staff",
      "Reconcile daily fuel dips and cash lodgements",
      "Enforce HSE standards across the forecourt",
    ],
    requirements: [
      "Degree or HND in Business, Operations or related",
      "3+ years retail or fuel-station management",
      "Strong leadership and integrity",
    ],
    benefits: ["Housing allowance", "Fuel allowance", "Medical cover"],
    about: "NP Sierra Leone is the country's largest indigenous downstream petroleum company.",
  },
  {
    id: "sl-mining-geologist",
    title: "Exploration Geologist",
    company: "SL Mining",
    companyShort: "SLM",
    logoColor: "#5A4A2E",
    location: "Lunsar",
    type: "Contract",
    category: "Engineering",
    salary: "NLe 22,000 – 28,000 / mo",
    salaryMin: 22000,
    experience: "5+ years",
    postedDays: 8,
    deadline: "August 30, 2026",
    description:
      "Join the exploration team at Marampa iron ore mine to expand resource definition and support the next phase of production.",
    responsibilities: [
      "Design and supervise diamond and RC drilling programmes",
      "Log core and prepare resource models",
      "Report to the Chief Geologist on weekly progress",
    ],
    requirements: [
      "MSc in Geology or Mining Engineering",
      "5+ years in iron ore or base metals",
      "Proficiency in Leapfrog / Surpac",
    ],
    benefits: ["Site accommodation", "Rotation flights", "Life insurance"],
    about:
      "SL Mining operates the Marampa iron ore mine, one of Sierra Leone's largest export operations.",
  },
  {
    id: "uba-relationship-officer",
    title: "Relationship Officer, SME",
    company: "United Bank for Africa",
    companyShort: "UBA",
    logoColor: "#D71E28",
    location: "Freetown",
    type: "Full-time",
    category: "Finance",
    salary: "NLe 9,000 – 12,000 / mo",
    salaryMin: 9000,
    experience: "2+ years",
    postedDays: 3,
    deadline: "August 18, 2026",
    description:
      "Grow UBA's SME portfolio in the Western Area by acquiring new business customers and deepening existing relationships.",
    responsibilities: [
      "Prospect and onboard SME clients",
      "Cross-sell trade, FX and digital products",
      "Manage portfolio quality and PAR",
    ],
    requirements: [
      "Degree in Business, Finance or related",
      "2+ years SME banking or sales experience",
    ],
    benefits: ["Sales commission", "Health insurance", "Career mobility across Africa"],
    about:
      "UBA is a pan-African bank present in 20 African countries, with a strong SME focus in Sierra Leone.",
  },
  {
    id: "statsl-data-analyst",
    title: "Data Analyst, National Surveys",
    company: "Statistics Sierra Leone",
    companyShort: "SSL",
    logoColor: "#1E5AA8",
    location: "Freetown",
    type: "Contract",
    category: "Data & Analytics",
    salary: "NLe 8,500 – 11,000 / mo",
    salaryMin: 8500,
    experience: "2+ years",
    postedDays: 5,
    deadline: "August 22, 2026",
    description:
      "Support the analysis and dissemination of national household surveys, including the SLIHS and DHS programmes.",
    responsibilities: [
      "Clean and analyse survey microdata in Stata / R",
      "Produce statistical tables and briefs",
      "Support publication of the national statistical yearbook",
    ],
    requirements: [
      "BSc in Statistics, Economics or Data Science",
      "Proficiency in Stata, R or Python",
    ],
    benefits: ["Training in international methodologies", "Travel per diems"],
    about:
      "Statistics Sierra Leone is the national statistical office, producing official data used by Government and partners.",
  },
  {
    id: "mol-policy-officer",
    title: "Labour Policy Officer",
    company: "Ministry of Labour",
    companyShort: "MoL",
    logoColor: "#0B6E4F",
    location: "Freetown",
    type: "Full-time",
    category: "Public Sector",
    salary: "NLe 7,500 – 9,500 / mo",
    salaryMin: 7500,
    experience: "3+ years",
    postedDays: 10,
    deadline: "August 28, 2026",
    description:
      "Contribute to the development and monitoring of national employment and labour market policies.",
    responsibilities: [
      "Draft policy briefs and cabinet memos",
      "Coordinate with ILO and development partners",
      "Support labour inspections and reporting",
    ],
    requirements: [
      "Degree in Public Policy, Law or Economics",
      "3+ years in policy or public sector research",
    ],
    benefits: ["Government pension", "Training abroad", "Job security"],
    about:
      "The Ministry of Labour and Social Security is responsible for employment policy, labour standards and workforce development.",
  },
  {
    id: "undp-programme-associate",
    title: "Programme Associate, Youth Employment",
    company: "UNDP Sierra Leone",
    companyShort: "UN",
    logoColor: "#009EDB",
    location: "Freetown",
    type: "Contract",
    category: "Development",
    salary: "USD 1,800 – 2,300 / mo",
    salaryMin: 20000,
    experience: "4+ years",
    postedDays: 7,
    deadline: "August 25, 2026",
    description:
      "Support UNDP's Youth Employment and Entrepreneurship programme, coordinating grants, partners and reporting.",
    responsibilities: [
      "Manage sub-grants to youth-serving organisations",
      "Track results against the programme results framework",
      "Draft donor reports and communications",
    ],
    requirements: [
      "Master's in Development, Economics or related",
      "4+ years with UN, NGO or bilateral donor",
      "Fluent English; French an asset",
    ],
    benefits: ["UN medical plan", "Pension", "Learning stipend"],
    about:
      "UNDP Sierra Leone supports the Government to accelerate the SDGs, including decent work and youth empowerment.",
  },
  {
    id: "orange-money-product",
    title: "Product Manager, Orange Money",
    company: "Orange Sierra Leone",
    companyShort: "OSL",
    logoColor: "#FF7900",
    location: "Freetown",
    type: "Full-time",
    category: "Product",
    salary: "NLe 20,000 – 26,000 / mo",
    salaryMin: 20000,
    experience: "4+ years",
    postedDays: 3,
    deadline: "August 24, 2026",
    description:
      "Own the Orange Money merchant proposition, from onboarding to acceptance across Sierra Leone.",
    responsibilities: [
      "Define the merchant product roadmap",
      "Partner with engineering, ops and compliance",
      "Track GMV, active merchants and revenue",
    ],
    requirements: [
      "4+ years product management, ideally in fintech",
      "Experience with mobile money or payments",
    ],
    benefits: ["Stock in innovation projects", "Hybrid work", "Family health cover"],
    about: "Orange Money is the largest mobile money service in Sierra Leone.",
  },
  {
    id: "africell-retail-lead",
    title: "Retail Experience Lead",
    company: "Africell",
    companyShort: "AF",
    logoColor: "#7A1FA2",
    location: "Makeni",
    type: "Full-time",
    category: "Retail",
    salary: "NLe 8,000 – 10,500 / mo",
    salaryMin: 8000,
    experience: "3+ years",
    postedDays: 9,
    deadline: "August 19, 2026",
    description: "Own the customer experience across Africell's Northern Region retail stores.",
    responsibilities: [
      "Coach store managers on service standards",
      "Roll out visual merchandising updates",
      "Report NPS and mystery shopper results",
    ],
    requirements: ["Degree preferred", "3+ years multi-store retail leadership"],
    benefits: ["Store bonus", "Travel allowance", "Medical cover"],
    about: "Africell operates the largest retail footprint of any operator in Sierra Leone.",
  },
  {
    id: "sl-mining-safety",
    title: "Health & Safety Officer",
    company: "SL Mining",
    companyShort: "SLM",
    logoColor: "#5A4A2E",
    location: "Lunsar",
    type: "Full-time",
    category: "Health & Safety",
    salary: "NLe 11,000 – 14,000 / mo",
    salaryMin: 11000,
    experience: "3+ years",
    postedDays: 11,
    deadline: "August 27, 2026",
    description: "Lead HSE compliance across the Marampa mine site and haul road.",
    responsibilities: [
      "Deliver toolbox talks and safety inductions",
      "Investigate incidents and drive corrective actions",
      "Maintain ISO 45001 documentation",
    ],
    requirements: ["NEBOSH IGC or equivalent", "3+ years in mining or heavy industry"],
    benefits: ["Rotation schedule", "Site accommodation", "Life insurance"],
    about: "SL Mining is committed to zero-harm operations at the Marampa mine.",
  },
];

export function findJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}
