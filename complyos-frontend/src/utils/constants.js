export const dashboardSummary = {
  metrics: [
    { label: "Pending Deadlines", value: "3", badge: "Action needed", danger: true },
    { label: "Active Schemes", value: "7", badge: "View all", danger: false },
    { label: "Alerts", value: "2", badge: "Unread", danger: true },
    { label: "Compliance Score", value: "87%", badge: "Good standing", danger: false },
  ],
  chart: [
    { month: "Jan", value: 4 }, { month: "Feb", value: 6 },
    { month: "Mar", value: 3 }, { month: "Apr", value: 8 },
    { month: "May", value: 5 }, { month: "Jun", value: 7 },
  ],
};

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir"
];

export const BUSINESS_TYPES = [
  { value: "shop", label: "Retail Shop" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "service", label: "Service Provider" },
  { value: "food", label: "Food Business" },
  { value: "trader", label: "Trader/Wholesaler" },
  { value: "artisan", label: "Artisan/Craftsperson" },
  { value: "other", label: "Other" },
];

export const COMPLIANCE_TYPES = ["GST", "Income Tax", "Labour", "FSSAI", "Shop License", "PF/ESI", "Other"];

export const TIER_FEATURES = {
  free: ["ARIA Onboarding", "3 Scheme Recommendations", "Basic Calendar", "Document Upload (3)"],
  growth: ["Everything in Free", "VEDA Document Intelligence", "Full SCOUT", "Alert Notifications", "1 CA Consultation/month"],
  pro: ["Everything in Growth", "Multi-business Management", "CA Dashboard Access", "Priority Scheduling", "Unlimited Documents"],
};

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

export const deadlines = [
  { id: "1", title: "GST Return Filing (GSTR-1)", deadline_date: "2026-06-15", compliance_type: "GST", status: "pending", urgency: "high" },
  { id: "2", title: "Quarterly TDS Payment", deadline_date: "2026-06-30", compliance_type: "Income Tax", status: "pending", urgency: "medium" },
  { id: "3", title: "ESIC Monthly Contribution", deadline_date: "2026-07-15", compliance_type: "Labour", status: "pending", urgency: "low" },
  { id: "4", title: "Shop License Renewal", deadline_date: "2026-08-01", compliance_type: "Shop License", status: "pending", urgency: "medium" },
  { id: "5", title: "Annual Audit Report Filing", deadline_date: "2026-09-30", compliance_type: "Accounting", status: "pending", urgency: "high" },
];
