export type WorkerCategory =
  "Drivers" | "Keke Riders" | "Office Assistants" | "Professional Cleaners";

export type Worker = {
  id: string;
  name: string;
  category: WorkerCategory;
  location: string;
  experience: string;
  availability: string;
  rating: number;
  verified: boolean;
  skills: string[];
  licences: string[];
  certificates: string[];
  trainingHistory: string[];
  assignmentsCompleted: number;
  phone: string;
  summary: string;
};

export type WorkforceAssignment = {
  id: string;
  title: string;
  employer: string;
  location: string;
  shift: string;
  duration: string;
  pay: string;
  status: "Current" | "Available" | "Completed";
};

export const WORKFORCE_CATEGORIES: Array<{
  name: WorkerCategory;
  description: string;
  activeWorkers: number;
  openAssignments: number;
}> = [
  {
    name: "Drivers",
    description: "Licensed vehicle drivers for logistics, staff transport and executive trips.",
    activeWorkers: 84,
    openAssignments: 12,
  },
  {
    name: "Keke Riders",
    description: "Verified keke riders for local delivery, errands and commuter support.",
    activeWorkers: 126,
    openAssignments: 18,
  },
  {
    name: "Office Assistants",
    description: "Administrative support, reception, records and front-office coordination.",
    activeWorkers: 59,
    openAssignments: 9,
  },
  {
    name: "Professional Cleaners",
    description: "Trained cleaners for offices, guest houses, retail branches and events.",
    activeWorkers: 73,
    openAssignments: 14,
  },
];

export const WORKERS: Worker[] = [
  {
    id: "sorie-kamara",
    name: "Sorie Kamara",
    category: "Drivers",
    location: "Freetown",
    experience: "7 years",
    availability: "Available weekdays",
    rating: 4.9,
    verified: true,
    skills: ["Defensive driving", "Route planning", "Vehicle checks", "Client service"],
    licences: ["Class B Driving Licence", "Commercial Driver Permit"],
    certificates: ["Defensive Driving", "First Aid Basics"],
    trainingHistory: ["NexaRise Road Safety", "Customer Care for Drivers"],
    assignmentsCompleted: 42,
    phone: "+232 76 410 221",
    summary: "Reliable Freetown driver with NGO, airport transfer and staff transport experience.",
  },
  {
    id: "abubakarr-conteh",
    name: "Abubakarr Conteh",
    category: "Keke Riders",
    location: "Bo",
    experience: "5 years",
    availability: "Available mornings and evenings",
    rating: 4.8,
    verified: true,
    skills: ["Parcel delivery", "Local routes", "Mobile money", "Customer service"],
    licences: ["Motor Tricycle Permit"],
    certificates: ["Safe Keke Operations"],
    trainingHistory: ["Road Safety Orientation", "Digital Payments Basics"],
    assignmentsCompleted: 65,
    phone: "+232 77 551 890",
    summary: "Trusted Bo-based keke rider for delivery, errands and commuter support.",
  },
  {
    id: "mabinty-sesay",
    name: "Mabinty Sesay",
    category: "Office Assistants",
    location: "Freetown",
    experience: "4 years",
    availability: "Available full-time",
    rating: 4.7,
    verified: true,
    skills: ["Reception", "Filing", "Scheduling", "Microsoft Office"],
    licences: ["National ID verified"],
    certificates: ["Office Administration", "Customer Service Essentials"],
    trainingHistory: ["NexaRise Workplace Readiness", "Records Management"],
    assignmentsCompleted: 28,
    phone: "+232 78 219 004",
    summary: "Front-office assistant with strong records, reception and calendar support skills.",
  },
  {
    id: "fatmata-bundu",
    name: "Fatmata Bundu",
    category: "Professional Cleaners",
    location: "Kenema",
    experience: "6 years",
    availability: "Available on contract",
    rating: 4.9,
    verified: true,
    skills: ["Office cleaning", "Sanitation", "Inventory control", "Event cleanup"],
    licences: ["National ID verified"],
    certificates: ["Professional Cleaning Standards", "Health & Safety Basics"],
    trainingHistory: ["Workplace Hygiene", "Chemical Handling"],
    assignmentsCompleted: 51,
    phone: "+232 79 442 771",
    summary: "Experienced cleaner for offices, training venues and partner facilities.",
  },
  {
    id: "ibrahim-bah",
    name: "Ibrahim Bah",
    category: "Drivers",
    location: "Makeni",
    experience: "3 years",
    availability: "Available weekends",
    rating: 4.6,
    verified: true,
    skills: ["Intercity driving", "Vehicle logs", "GPS navigation"],
    licences: ["Class B Driving Licence"],
    certificates: ["Road Safety Orientation"],
    trainingHistory: ["Client Transport Standards"],
    assignmentsCompleted: 19,
    phone: "+232 75 903 118",
    summary: "Makeni-based driver available for intercity and weekend assignments.",
  },
  {
    id: "zainab-jalloh",
    name: "Zainab Jalloh",
    category: "Office Assistants",
    location: "Bo",
    experience: "2 years",
    availability: "Available part-time",
    rating: 4.5,
    verified: true,
    skills: ["Data entry", "Reception", "Document scanning"],
    licences: ["National ID verified"],
    certificates: ["Digital Office Skills"],
    trainingHistory: ["NexaRise Workplace Readiness"],
    assignmentsCompleted: 14,
    phone: "+232 77 830 546",
    summary: "Detail-oriented assistant for short-term office coverage and records work.",
  },
];

export const ASSIGNMENTS: WorkforceAssignment[] = [
  {
    id: "orange-staff-transport",
    title: "Staff transport support",
    employer: "Orange Sierra Leone",
    location: "Freetown",
    shift: "7:00 AM - 5:00 PM",
    duration: "3 months",
    pay: "NLe 4,500 / mo",
    status: "Current",
  },
  {
    id: "rokel-office-support",
    title: "Branch office assistant",
    employer: "Rokel Commercial Bank",
    location: "Bo",
    shift: "8:30 AM - 4:30 PM",
    duration: "6 weeks",
    pay: "NLe 2,200 / mo",
    status: "Available",
  },
  {
    id: "undp-training-cleaning",
    title: "Training venue cleaning team",
    employer: "UNDP Sierra Leone",
    location: "Kenema",
    shift: "Morning",
    duration: "10 days",
    pay: "NLe 180 / day",
    status: "Available",
  },
];

export function findWorker(id: string) {
  return WORKERS.find((worker) => worker.id === id);
}

export function recommendedWorkers(category: WorkerCategory | "All" = "All") {
  return WORKERS.filter((worker) => category === "All" || worker.category === category)
    .filter((worker) => worker.verified)
    .sort((a, b) => b.rating - a.rating);
}
