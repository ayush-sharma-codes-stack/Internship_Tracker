export const initialApplications = [
  {
    id: "1",
    company: "Google",
    role: "Software Engineering Intern",
    location: "Mountain View, CA",
    dateApplied: "2026-01-15",
    status: "Interview",
    stipend: "$9,000/mo",
    link: "https://careers.google.com",
    notes: "Completed first technical round.",
    source: "LinkedIn",
    duration: "12 weeks",
    skills: ["C++", "Python", "Data Structures"]
  },
  {
    id: "2",
    company: "Stripe",
    role: "Backend Engineer Intern",
    location: "Remote",
    dateApplied: "2026-02-01",
    status: "OA",
    stipend: "$9,500/mo",
    link: "https://stripe.com/jobs",
    notes: "HackerRank assessment received.",
    source: "Wellfound",
    duration: "14 weeks",
    skills: ["Ruby", "Go", "API Design"]
  }
];

export const statusColors = {
  "Saved": "bg-gray-500/20 text-gray-300 border-gray-500/50",
  "Applied": "bg-blue-500/20 text-blue-400 border-blue-500/50",
  "OA": "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
  "Interview": "bg-purple-500/20 text-purple-400 border-purple-500/50",
  "Offer": "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  "Rejected": "bg-rose-500/20 text-rose-400 border-rose-500/50"
};

export const sourceColors = {
  "LinkedIn": "bg-blue-600 text-white",
  "Internshala": "bg-green-600 text-white",
  "Unstop": "bg-purple-600 text-white",
  "Naukri": "bg-teal-600 text-white",
  "Indeed": "bg-blue-800 text-white",
  "Wellfound": "bg-gray-800 text-white border border-gray-600",
  "Default": "bg-gray-700 text-gray-200"
};

export const statuses = ["Saved", "Applied", "OA", "Interview", "Offer", "Rejected"];
