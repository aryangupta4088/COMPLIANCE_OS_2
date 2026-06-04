// Shared CA Directory — used by Dashboard.jsx and CAConnectPage.jsx
export const CA_DIRECTORY = [
    {
        id: 1,
        initials: "RK",
        name: "Rajesh Kumar, FCA",
        title: "GST & MSME Specialist",
        location: "Delhi NCR",
        state: "Delhi",
        experience: "14 Years",
        phone: "+91-98101-23456",
        whatsapp: "919810123456",
        email: "rajesh.kumar@complianceos.in",
        speciality: ["GST", "MSME", "Startup", "Udyam"],
        languages: ["Hindi", "English"],
        rating: 4.9,
        clients: 340,
        pricePerHour: 2500,
        pricePerConsultation: 1500,
        verified: true,
        isAssigned: false, // set dynamically
        bio: "Former GST Council advisor with 14 years helping MSMEs navigate registration, filing, and scheme eligibility across North India.",
    },
    {
        id: 2,
        initials: "PM",
        name: "Priya Mehta, ACA",
        title: "Women Entrepreneur Advisor",
        location: "Mumbai",
        state: "Maharashtra",
        experience: "9 Years",
        phone: "+91-98201-78901",
        whatsapp: "919820178901",
        email: "priya.mehta@complianceos.in",
        speciality: ["Women Schemes", "Labour", "Exports", "CGTMSE"],
        languages: ["Hindi", "Marathi", "English"],
        rating: 4.8,
        clients: 215,
        pricePerHour: 2000,
        pricePerConsultation: 1200,
        verified: true,
        isAssigned: false,
        bio: "Specialist in women-entrepreneur funding: Stand Up India, Mahila Udyam Nidhi, and export-linked schemes for Maharashtra MSMEs.",
    },
    {
        id: 3,
        initials: "SJ",
        name: "Suresh Joshi, FCA",
        title: "Compliance & Tax Expert",
        location: "Bangalore",
        state: "Karnataka",
        experience: "17 Years",
        phone: "+91-97300-45678",
        whatsapp: "919730045678",
        email: "suresh.joshi@complianceos.in",
        speciality: ["Income Tax", "Audit", "Compliance", "Transfer Pricing"],
        languages: ["Kannada", "English"],
        rating: 4.7,
        clients: 480,
        pricePerHour: 3500,
        pricePerConsultation: 2000,
        verified: true,
        isAssigned: false,
        bio: "Senior compliance partner with deep expertise in statutory audits, income tax assessments, and MSME regulatory compliance in South India.",
    },
    {
        id: 4,
        initials: "AN",
        name: "Anjali Nair, ACA",
        title: "Manufacturing & Export CA",
        location: "Chennai",
        state: "Tamil Nadu",
        experience: "11 Years",
        phone: "+91-94400-34567",
        whatsapp: "919440034567",
        email: "anjali.nair@complianceos.in",
        speciality: ["Manufacturing", "Export", "GST", "DGFT"],
        languages: ["Tamil", "Malayalam", "English"],
        rating: 4.8,
        clients: 290,
        pricePerHour: 2200,
        pricePerConsultation: 1400,
        verified: true,
        isAssigned: false,
        bio: "Export compliance specialist handling DGFT registrations, RODTEP, and manufacturing-linked MSME schemes for Tamil Nadu businesses.",
    },
    {
        id: 5,
        initials: "VG",
        name: "Vikram Gupta, FCA",
        title: "Startup & Funding Advisor",
        location: "Hyderabad",
        state: "Telangana",
        experience: "10 Years",
        phone: "+91-93000-12345",
        whatsapp: "919300012345",
        email: "vikram.gupta@complianceos.in",
        speciality: ["Startup India", "DPIIT", "Seed Fund", "Angel Tax"],
        languages: ["Hindi", "Telugu", "English"],
        rating: 4.6,
        clients: 178,
        pricePerHour: 2800,
        pricePerConsultation: 1800,
        verified: true,
        isAssigned: false,
        bio: "DPIIT-empanelled CA helping startups get recognition, angel tax exemptions, and seed fund access across Telangana and AP.",
    },
    {
        id: 6,
        initials: "KP",
        name: "Kavitha Pillai, ACA",
        title: "Labour Law & HR Compliance",
        location: "Pune",
        state: "Maharashtra",
        experience: "8 Years",
        phone: "+91-99000-67890",
        whatsapp: "919900067890",
        email: "kavitha.pillai@complianceos.in",
        speciality: ["Labour Law", "PF/ESI", "Shops Act", "Payroll"],
        languages: ["Marathi", "Hindi", "English"],
        rating: 4.7,
        clients: 160,
        pricePerHour: 1800,
        pricePerConsultation: 1000,
        verified: true,
        isAssigned: false,
        bio: "Labour compliance specialist covering PF, ESI, gratuity, shops & establishments act filings for MSMEs across Pune and Maharashtra.",
    },
];

// Pick the best-matched CA for a given profile
export function getAssignedCA(profile) {
    if (!profile) return CA_DIRECTORY[0];
    const state = profile.state?.toLowerCase() || "";
    const sector = profile.sector?.toLowerCase() || "";
    const isWomen = profile.isWomen;

    // Priority: women → women specialist; state match; sector match
    if (isWomen) {
        const w = CA_DIRECTORY.find((c) => c.speciality.some((s) => s.toLowerCase().includes("women")));
        if (w) return w;
    }
    const stateMatch = CA_DIRECTORY.find(
        (c) => c.state?.toLowerCase().includes(state) || state.includes(c.state?.toLowerCase())
    );
    if (stateMatch) return stateMatch;

    if (sector.includes("manufactur") || sector.includes("export")) {
        return CA_DIRECTORY.find((c) => c.speciality.includes("Manufacturing")) || CA_DIRECTORY[0];
    }
    return CA_DIRECTORY[0];
}