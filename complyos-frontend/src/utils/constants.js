export const dashboardSummary = {
  metrics: [
    { label: "TOTAL COMPLIANCES", value: "128", badge: "↗ 12%" },
    { label: "PENDING DEADLINES", value: "04", badge: "! Critical", danger: true },
    { label: "SCHEMES MATCHED", value: "31", badge: "⊙ New" },
    { label: "AMOUNT SAVED", value: "₹4.2M", badge: "^ Saved" },
  ],
  chart: [
    { month: "JAN", value: 54 },
    { month: "FEB", value: 76 },
    { month: "MAR", value: 40 },
    { month: "APR", value: 85 },
    { month: "MAY", value: 63 },
    { month: "JUN", value: 72 },
  ],
};

export const deadlines = [
  {
    id: "1",
    title: "GST Monthly Filing",
    deadline_date: "2024-11-10",
    compliance_type: "GST",
    urgency: "high",
    description: "Submission of GSTR-1 for the month of October.",
  },
  {
    id: "2",
    title: "ESOP Disclosure",
    deadline_date: "2024-11-10",
    compliance_type: "Scheme",
    urgency: "medium",
    description: "Internal audit report for the employee stock pool.",
  },
  {
    id: "3",
    title: "Provident Fund Deposit",
    deadline_date: "2024-11-10",
    compliance_type: "Labour",
    urgency: "medium",
    description: "Mandatory contribution for the regional workforce.",
  },
  {
    id: "4",
    title: "Professional Tax Payment",
    deadline_date: "2024-11-12",
    compliance_type: "Tax",
    urgency: "high",
    description: "Due in 2 days",
  },
  {
    id: "5",
    title: "ROC Annual Return",
    deadline_date: "2024-11-15",
    compliance_type: "MCA",
    urgency: "medium",
    description: "Due in 5 days",
  },
];

export const schemes = [
  {
    scheme_name: "Startup India Seed Fund",
    scheme_type: "grant",
    max_benefit: "₹20,00,000",
    eligibility_match_score: 91,
    why_eligible: "Financial assistance for early-stage MSMEs.",
  },
  {
    scheme_name: "MSME Credit Guarantee",
    scheme_type: "loan",
    max_benefit: "₹5,00,00,000",
    eligibility_match_score: 88,
    why_eligible: "Collateral-free credit support.",
  },
  {
    scheme_name: "Mahila Co-operative Grant",
    scheme_type: "grant",
    max_benefit: "₹5,00,000",
    eligibility_match_score: 75,
    why_eligible: "Support for women-led businesses.",
  },
  {
    scheme_name: "Green Energy Subsidy",
    scheme_type: "subsidy",
    max_benefit: "₹15,00,000",
    eligibility_match_score: 94,
    why_eligible: "Incentives for adopting clean energy.",
  },
  {
    scheme_name: "EdTech Innovation Grant",
    scheme_type: "grant",
    max_benefit: "₹10,00,000",
    eligibility_match_score: 62,
    why_eligible: "Research funding for digital training.",
  },
  {
    scheme_name: "Smart Factory Upgrade",
    scheme_type: "loan",
    max_benefit: "₹2,00,00,000",
    eligibility_match_score: 85,
    why_eligible: "Loan interest support for manufacturing upgrades.",
  },
];

export const notifications = [
  {
    id: "n1",
    title: "GST Filing Due in 3 Days",
    message: "Your GST return filing deadline is close.",
    urgency: "urgent",
    source: "system",
    action: "File Now",
  },
  {
    id: "n2",
    title: "Shop License Expiring Soon",
    message: "Renew your shop license within 7 days.",
    urgency: "medium",
    source: "VEDA",
    action: "Renew",
  },
  {
    id: "n3",
    title: "New PM SVANidhi Scheme Available",
    message: "You may be eligible for street vendor credit support.",
    urgency: "scheme",
    source: "SCOUT",
    action: "View",
  },
  {
    id: "n4",
    title: "GST Rate Change — Textiles",
    message: "SENTINEL found a regulatory update affecting textiles.",
    urgency: "regulatory",
    source: "SENTINEL",
    action: "Read Update",
  },
];

export const freelancers = [
  {
    name: "Rajesh Kumar",
    initials: "RK",
    role: "CA & Tax Expert",
    rating: "4.9",
    meta: "120+ AUDITS",
    tags: ["GST FILING", "ITR", "COMPLIANCE"],
    price: "₹999",
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    role: "Web Developer",
    rating: "5.0",
    meta: "45 PROJECTS",
    tags: ["WEBSITE", "E-COMMERCE", "UPI SETUP"],
    price: "₹1499",
  },
  {
    name: "Amit Verma",
    initials: "AV",
    role: "Legal Advisor",
    rating: "4.8",
    meta: "80+ CLIENTS",
    tags: ["MSME REGISTRATION", "CONTRACTS", "IP"],
    price: "₹1999",
  },
];

export const caList = [
  {
    id: "ca1",
    name: "Elena Sterling, ACA",
    initials: "ES",
    rating: "4.9",
    clients: "420+ Clients Managed",
    tags: ["TAXATION", "AUDIT"],
    price: "$240/hr",
    available: "Available",
  },
  {
    id: "ca2",
    name: "Marcus Kaine, CPA",
    initials: "MK",
    rating: "5.0",
    clients: "180+ Enterprise Partners",
    tags: ["FORENSICS", "RISK"],
    price: "$310/hr",
    available: "Available",
  },
  {
    id: "ca3",
    name: "Lara Croft, FCA",
    initials: "LC",
    rating: "4.8",
    clients: "310+ Global Clients",
    tags: ["M&A", "AUDIT"],
    price: "$275/hr",
    available: "Next wk",
  },
  {
    id: "ca4",
    name: "Julian Sands, CPA",
    initials: "JS",
    rating: "4.9",
    clients: "500+ Clients Managed",
    tags: ["TAXATION", "STRATEGY"],
    price: "$195/hr",
    available: "Available",
  },
];

export const loans = [
  {
    title: "MSME Business Growth Loan",
    amount: "₹50,00,000",
    rate: "Interest starting at 8.5% p.a.",
    score: "HIGH ELIGIBILITY",
  },
  {
    title: "Women Entrepreneur Credit Line",
    amount: "₹35,00,000",
    rate: "Interest starting at 7.9% p.a.",
    score: "HIGH ELIGIBILITY",
  },
  {
    title: "Startup Infrastructure Fund",
    amount: "₹1,20,00,000",
    rate: "Interest starting at 11.2% p.a.",
    score: "MEDIUM ELIGIBILITY",
  },
];

export const banks = [
  {
    name: "HDFC Business",
    account: "Current Account",
    benefit: "Zero-fee transfers & global payouts",
  },
  {
    name: "ICICI Corporate",
    account: "Smart Business Plus",
    benefit: "Priority lending for MSME exports",
  },
  {
    name: "SBI MSME",
    account: "Udyam Sarathi",
    benefit: "Government subsidy auto-sync",
  },
];

export const documents = [
  { name: "GST_Returns_Q3_...", date: "Uploaded Oct 12, 2023", status: "VERIFIED", type: "GST" },
  { name: "Trade_License_24...", date: "Uploaded Oct 15, 2023", status: "PROCESSING", type: "Licenses" },
  { name: "Bank_Stmt_Sept.pdf", date: "Uploaded Oct 18, 2023", status: "PENDING", type: "Bank" },
  { name: "Udyam_Registrati...", date: "Uploaded Oct 20, 2023", status: "VERIFIED", type: "Udyam" },
  { name: "Invoice_88291.png", date: "Uploaded Oct 21, 2023", status: "VERIFIED", type: "Invoices" },
  { name: "Safety_Cert_Annu...", date: "Uploaded Oct 22, 2023", status: "PENDING", type: "Licenses" },
];

export const registrations = [
  {
    name: "GST Registration",
    portal: "GSTN (Goods and Services Tax Network)",
    status: "Complete",
  },
  {
    name: "MSME Udyam",
    portal: "Ministry of MSME",
    status: "Pending",
  },
  {
    name: "Professional Tax",
    portal: "State Commercial Tax Dept.",
    status: "Not Started",
  },
  {
    name: "EPF Registration",
    portal: "Employees' Provident Fund Org.",
    status: "Complete",
  },
  {
    name: "ESI Registration",
    portal: "ESIC e-Pehchan",
    status: "Complete",
  },
  {
    name: "Import Export Code",
    portal: "DGFT Online Portal",
    status: "Pending",
  },
  {
    name: "Shop & Establishment",
    portal: "State Labour Dept.",
    status: "Complete",
  },
  {
    name: "PAN/TAN Application",
    portal: "NSDL/Protean e-Gov",
    status: "Not Started",
  },
];
