export type MentorIndustry =
  "Technology" | "Finance" | "Operations" | "Entrepreneurship" | "Public Sector";

export type Mentor = {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: MentorIndustry;
  location: string;
  experience: string;
  availability: string;
  rating: number;
  reviews: number;
  biography: string;
  skills: string[];
  certifications: string[];
  highlights: string[];
};

export type Mentee = {
  id: string;
  name: string;
  focus: string;
  status: "Active" | "Pending";
  nextStep: string;
};

export type MentorshipSession = {
  id: string;
  mentor: string;
  mentee: string;
  topic: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed";
  notes: string;
};

export type Conversation = {
  id: string;
  participant: string;
  role: string;
  lastMessage: string;
  read: boolean;
  attachments: number;
  messages: Array<{
    from: "mentor" | "mentee";
    body: string;
    time: string;
    read: boolean;
  }>;
};

export type MentorshipNotification = {
  id: string;
  type:
    | "New mentorship request"
    | "Accepted request"
    | "Session reminder"
    | "New message"
    | "Application updates";
  message: string;
  time: string;
  unread: boolean;
};

export const MENTORS: Mentor[] = [
  {
    id: "mariama-koroma",
    name: "Mariama Koroma",
    title: "Senior Product Manager",
    company: "Orange Sierra Leone",
    industry: "Technology",
    location: "Freetown",
    experience: "10 years",
    availability: "Tuesdays and Thursdays",
    rating: 4.9,
    reviews: 38,
    biography:
      "Product leader helping early-career professionals build roadmaps, stakeholder confidence and practical execution habits.",
    skills: ["Product strategy", "Career planning", "Stakeholder management", "Agile delivery"],
    certifications: ["Certified Scrum Product Owner", "Digital Transformation Leadership"],
    highlights: [
      "Built youth digital products",
      "Mentored 45 job seekers",
      "Speaker at Freetown Tech Week",
    ],
  },
  {
    id: "ibrahim-sankoh",
    name: "Ibrahim Sankoh",
    title: "Finance Controller",
    company: "Rokel Commercial Bank",
    industry: "Finance",
    location: "Bo",
    experience: "12 years",
    availability: "Saturday mornings",
    rating: 4.8,
    reviews: 29,
    biography:
      "Finance mentor focused on interview preparation, accounting growth paths and workplace professionalism.",
    skills: ["Financial reporting", "Interview coaching", "Excel", "Audit readiness"],
    certifications: ["ACCA Advanced Diploma", "Risk Management Essentials"],
    highlights: [
      "Banking leadership coach",
      "Supports graduate trainees",
      "Community finance trainer",
    ],
  },
  {
    id: "fatmata-swaray",
    name: "Fatmata Swaray",
    title: "Founder and Operations Lead",
    company: "Salone Fresh Logistics",
    industry: "Entrepreneurship",
    location: "Kenema",
    experience: "8 years",
    availability: "Weekday evenings",
    rating: 4.7,
    reviews: 21,
    biography:
      "Entrepreneur mentoring founders and operations talent on customer discovery, basic finance and resilient execution.",
    skills: ["Business planning", "Operations", "Customer discovery", "Pitch preparation"],
    certifications: ["SME Growth Programme", "Operations Management"],
    highlights: ["Built regional supply network", "Mentors women founders", "Grant pitch reviewer"],
  },
  {
    id: "joseph-bangura",
    name: "Joseph Bangura",
    title: "HR and Talent Advisor",
    company: "NexaRise Partner Network",
    industry: "Operations",
    location: "Makeni",
    experience: "9 years",
    availability: "Mondays",
    rating: 4.6,
    reviews: 18,
    biography:
      "Talent advisor helping mentees improve CVs, prepare for competency interviews and build strong work habits.",
    skills: ["CV review", "Interview practice", "Workplace readiness", "People operations"],
    certifications: ["Human Resource Management", "Coaching Skills for Managers"],
    highlights: ["Reviewed 600+ CVs", "Runs mock interviews", "Employer readiness specialist"],
  },
  {
    id: "amina-turay",
    name: "Amina Turay",
    title: "Public Policy Analyst",
    company: "Freetown City Council",
    industry: "Public Sector",
    location: "Freetown",
    experience: "7 years",
    availability: "Friday afternoons",
    rating: 4.8,
    reviews: 24,
    biography:
      "Policy mentor supporting graduates interested in public service, research, civic technology and programme delivery.",
    skills: ["Policy research", "Grant writing", "Programme design", "Public speaking"],
    certifications: ["Monitoring and Evaluation", "Public Sector Leadership"],
    highlights: ["Youth policy facilitator", "M&E trainer", "Supports civic fellows"],
  },
];

export const MENTEES: Mentee[] = [
  {
    id: "ibrahim-kamara",
    name: "Ibrahim Kamara",
    focus: "Product management transition",
    status: "Active",
    nextStep: "Review portfolio goals",
  },
  {
    id: "zainab-jalloh",
    name: "Zainab Jalloh",
    focus: "Office administration growth",
    status: "Active",
    nextStep: "Mock interview",
  },
  {
    id: "mohamed-conteh",
    name: "Mohamed Conteh",
    focus: "Finance internship readiness",
    status: "Pending",
    nextStep: "Accept request",
  },
];

export const SESSIONS: MentorshipSession[] = [
  {
    id: "session-product-roadmap",
    mentor: "Mariama Koroma",
    mentee: "Ibrahim Kamara",
    topic: "Product roadmap review",
    date: "18 Jul 2026",
    time: "10:00 AM",
    status: "Upcoming",
    notes: "Bring product case study draft and top three career questions.",
  },
  {
    id: "session-cv-review",
    mentor: "Joseph Bangura",
    mentee: "Zainab Jalloh",
    topic: "CV and interview practice",
    date: "21 Jul 2026",
    time: "4:30 PM",
    status: "Upcoming",
    notes: "Focus on office assistant achievements and STAR answers.",
  },
  {
    id: "session-finance-goals",
    mentor: "Ibrahim Sankoh",
    mentee: "Mohamed Conteh",
    topic: "Finance career planning",
    date: "9 Jul 2026",
    time: "11:00 AM",
    status: "Completed",
    notes: "Mentee will complete Excel practice and update LinkedIn summary.",
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "mariama-ibrahim",
    participant: "Ibrahim Kamara",
    role: "Product mentee",
    lastMessage: "I attached the case study outline for review.",
    read: false,
    attachments: 1,
    messages: [
      {
        from: "mentee",
        body: "I attached the case study outline for review.",
        time: "9:12 AM",
        read: false,
      },
      {
        from: "mentor",
        body: "Thanks, I will mark the strongest sections before our session.",
        time: "9:20 AM",
        read: true,
      },
    ],
  },
  {
    id: "mariama-zainab",
    participant: "Zainab Jalloh",
    role: "Office administration mentee",
    lastMessage: "Thank you for the interview checklist.",
    read: true,
    attachments: 0,
    messages: [
      {
        from: "mentor",
        body: "Use the checklist to prepare three examples from your last assignment.",
        time: "Yesterday",
        read: true,
      },
      {
        from: "mentee",
        body: "Thank you for the interview checklist.",
        time: "Yesterday",
        read: true,
      },
    ],
  },
];

export const NOTIFICATIONS: MentorshipNotification[] = [
  {
    id: "request-new",
    type: "New mentorship request",
    message: "Mohamed Conteh requested finance career guidance.",
    time: "12 min ago",
    unread: true,
  },
  {
    id: "request-accepted",
    type: "Accepted request",
    message: "Mariama accepted Ibrahim's product mentorship request.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: "session-reminder",
    type: "Session reminder",
    message: "Product roadmap review starts on 18 Jul 2026 at 10:00 AM.",
    time: "Today",
    unread: false,
  },
  {
    id: "new-message",
    type: "New message",
    message: "Ibrahim sent a new attachment in mentorship chat.",
    time: "Today",
    unread: true,
  },
  {
    id: "application-update",
    type: "Application updates",
    message: "Your mentee Zainab moved to interview stage for Office Assistant.",
    time: "Yesterday",
    unread: false,
  },
];

export const MENTOR_INDUSTRIES: Array<MentorIndustry | "All industries"> = [
  "All industries",
  "Technology",
  "Finance",
  "Operations",
  "Entrepreneurship",
  "Public Sector",
];

export function findMentor(id: string) {
  return MENTORS.find((mentor) => mentor.id === id);
}

export function findSession(id: string) {
  return SESSIONS.find((session) => session.id === id);
}

export function findConversation(id: string) {
  return CONVERSATIONS.find((conversation) => conversation.id === id);
}
