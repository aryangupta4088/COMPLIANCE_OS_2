import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Shield, CheckCircle2, Sparkles, RefreshCw, ExternalLink, X } from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Footer } from "../components/layout/Footer";
import SchemeCard from "../components/ui/SchemeCard";
import { Button, Modal } from "../components/ui/Common";
import { groqChat } from "../services/groqService";
import { getProfile } from "../utils/profileStore";

const FILTERS = ["All", "Central", "State", "Women", "Loans", "Grants"];

// ─── Real Government Schemes with official portal links ──────────────────
const REAL_GOVT_SCHEMES = [
  {
    scheme_name: "Udyam Registration",
    scheme_type: "Central",
    max_benefit: "₹1 Cr+ subsidised credit",
    eligibility_match_score: 95,
    why_eligible: "Mandatory MSME recognition unlocking all central schemes, subsidies, and priority lending.",
    portal_url: "https://udyamregistration.gov.in",
    ministry: "Ministry of MSME",
    target: "all",
  },
  {
    scheme_name: "PM SVANidhi – Street Vendor Loan",
    scheme_type: "Loans",
    max_benefit: "₹50,000 collateral-free",
    eligibility_match_score: 72,
    why_eligible: "Micro-enterprise collateral-free working capital loan at subsidised interest.",
    portal_url: "https://pmsvanidhi.mohua.gov.in",
    ministry: "Ministry of Housing & Urban Affairs",
    target: "micro",
  },
  {
    scheme_name: "CGTMSE – Credit Guarantee",
    scheme_type: "Loans",
    max_benefit: "₹2 Cr without collateral",
    eligibility_match_score: 85,
    why_eligible: "Collateral-free term loans up to ₹2 Cr for MSMEs via partner banks.",
    portal_url: "https://www.cgtmse.in",
    ministry: "SIDBI & Ministry of MSME",
    target: "all",
  },
  {
    scheme_name: "Mahila Udyam Nidhi",
    scheme_type: "Women",
    max_benefit: "₹10 Lakh soft loan",
    eligibility_match_score: 90,
    why_eligible: "Soft loan at concessional interest for women-owned small enterprises.",
    portal_url: "https://www.sidbi.in/en/products-and-services/mahila-udyam-nidhi",
    ministry: "SIDBI",
    target: "women",
  },
  {
    scheme_name: "PMEGP – Employment Generation",
    scheme_type: "Grants",
    max_benefit: "35% subsidy on project cost",
    eligibility_match_score: 78,
    why_eligible: "Up to 35% government subsidy on new enterprise setup under ₹25 Lakh manufacturing projects.",
    portal_url: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    ministry: "Ministry of MSME / KVIC",
    target: "all",
  },
  {
    scheme_name: "Stand Up India",
    scheme_type: "Loans",
    max_benefit: "₹10 Lakh – ₹1 Cr",
    eligibility_match_score: 82,
    why_eligible: "Bank loans between ₹10L–₹1Cr for SC/ST and women entrepreneurs setting up greenfield enterprises.",
    portal_url: "https://www.standupmitra.in",
    ministry: "Ministry of Finance",
    target: "women",
  },
  {
    scheme_name: "MSME Sampark – Skill & Placement",
    scheme_type: "Central",
    max_benefit: "Free skilled workforce access",
    eligibility_match_score: 68,
    why_eligible: "Access to trained manpower from government skill programs at zero cost.",
    portal_url: "https://msmesampark.in",
    ministry: "Ministry of MSME",
    target: "all",
  },
  {
    scheme_name: "ZED Certification",
    scheme_type: "Grants",
    max_benefit: "₹5 Lakh reimbursement",
    eligibility_match_score: 74,
    why_eligible: "Zero Defect Zero Effect certification with up to ₹5L subsidy for quality-compliant MSMEs.",
    portal_url: "https://zed.msme.gov.in",
    ministry: "Ministry of MSME",
    target: "all",
  },
  {
    scheme_name: "CLCS-TUS – Technology Upgradation",
    scheme_type: "Central",
    max_benefit: "15% capital subsidy",
    eligibility_match_score: 77,
    why_eligible: "15% capital subsidy on purchase of plant & machinery for technology upgradation.",
    portal_url: "https://msme.gov.in/schemes/credit-linked-capital-subsidy-and-technology-upgradation-scheme",
    ministry: "Ministry of MSME",
    target: "manufacturing",
  },
  {
    scheme_name: "Pradhan Mantri Mudra Yojana",
    scheme_type: "Loans",
    max_benefit: "₹10 Lakh (Tarun category)",
    eligibility_match_score: 88,
    why_eligible: "Collateral-free business loans in Shishu/Kishore/Tarun tiers for non-corporate small businesses.",
    portal_url: "https://www.mudra.org.in",
    ministry: "Ministry of Finance",
    target: "all",
  },
  {
    scheme_name: "Weavers MUDRA Scheme",
    scheme_type: "Loans",
    max_benefit: "₹10 Lakh at 6% interest",
    eligibility_match_score: 62,
    why_eligible: "Subsidised credit for handloom weavers and textile micro-enterprises.",
    portal_url: "https://handlooms.nic.in",
    ministry: "Ministry of Textiles",
    target: "textile",
  },
  {
    scheme_name: "Startup India Seed Fund",
    scheme_type: "Grants",
    max_benefit: "₹20 Lakh grant",
    eligibility_match_score: 65,
    why_eligible: "Early-stage funding for DPIIT-recognised startups for PoC, prototype, and market entry.",
    portal_url: "https://seedfund.startupindia.gov.in",
    ministry: "DPIIT",
    target: "startup",
  },
];

// ─── ARIA Scheme System Prompt ────────────────────────────────────────────
const SCHEME_SYSTEM = `You are SCOUT, a government scheme matching AI for Indian MSMEs.
Given a business profile, return ONLY a valid JSON array of up to 8 relevant schemes FROM this master list:
${JSON.stringify(REAL_GOVT_SCHEMES.map(s => s.scheme_name))}

For each matched scheme return:
{ "scheme_name": "<exact name from list>", "eligibility_match_score": <60-99>, "why_eligible": "<one sentence specific to their profile, mention their sector/state/turnover>" }

Return ONLY the raw JSON array. No markdown, no backticks.`;

export default function SchemesPage() {
  const profile = getProfile();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalScheme, setModalScheme] = useState(null);
  const [aiLoaded, setAiLoaded] = useState(false);
  const [applyScheme, setApplyScheme] = useState(null);

  // Merge AI scores + why_eligible into REAL_GOVT_SCHEMES
  function mergeWithRealData(aiResults) {
    const aiMap = {};
    aiResults.forEach((r) => { aiMap[r.scheme_name] = r; });

    return REAL_GOVT_SCHEMES
      .map((scheme) => {
        const ai = aiMap[scheme.scheme_name];
        if (!ai) return null;
        return {
          ...scheme,
          eligibility_match_score: ai.eligibility_match_score || scheme.eligibility_match_score,
          why_eligible: ai.why_eligible || scheme.why_eligible,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.eligibility_match_score - a.eligibility_match_score);
  }

  // Fallback: pick relevant schemes from static list based on profile
  function buildFallbackSchemes() {
    return REAL_GOVT_SCHEMES.filter((s) => {
      if (s.target === "women" && !profile.isWomen) return false;
      if (s.target === "manufacturing" && !profile.sector?.toLowerCase().includes("manufactur")) return false;
      if (s.target === "textile" && !profile.sector?.toLowerCase().includes("textil")) return false;
      if (s.target === "startup" && !(profile.registrations || []).includes("DPIIT")) return false;
      return true;
    }).slice(0, 8);
  }

  async function fetchAISchemes() {
    setLoading(true);
    try {
      const prompt = `Business profile: ${JSON.stringify(profile)}.
Match the best schemes for this business. Consider: sector=${profile.sector}, state=${profile.state}, women=${profile.isWomen}, turnover=${profile.turnover}, registrations=${JSON.stringify(profile.registrations)}.
Return JSON array of matched scheme names with scores and personalised why_eligible.`;

      const reply = await groqChat(
        [{ role: "user", content: prompt }],
        SCHEME_SYSTEM,
        { maxTokens: 1200, temperature: 0.3 }
      );

      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setSchemes(mergeWithRealData(parsed));
        setAiLoaded(true);
      } else {
        setSchemes(buildFallbackSchemes());
      }
    } catch {
      setSchemes(buildFallbackSchemes());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAISchemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = activeFilter === "All"
    ? schemes
    : schemes.filter((s) => s.scheme_type === activeFilter);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">

        {/* ── AI BANNER ── */}
        {profile.businessName && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-violet-900 to-violet-700 rounded-2xl px-5 py-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-violet-200 text-xs font-bold tracking-widest uppercase">SCOUT AI · Official Govt Portals</p>
              <p className="text-white text-sm mt-0.5">
                {aiLoaded
                  ? `${schemes.length} schemes matched to ${profile.businessName} · ${profile.state} — all linking to official govt portals`
                  : loading
                    ? "Matching schemes to your profile…"
                    : `${schemes.length} government schemes for ${profile.businessName || "your business"}`}
              </p>
            </div>
            <button
              onClick={fetchAISchemes}
              disabled={loading}
              className="text-violet-300 hover:text-white disabled:opacity-40"
              title="Re-match schemes"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </motion.div>
        )}

        {/* ── FILTER BAR ── */}
        <div className="bg-white border border-cs-100 rounded-2xl px-5 py-4 flex items-center gap-3 mb-8 flex-wrap">
          {FILTERS.map((f) => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeFilter === f
                  ? "bg-cs-900 text-cs-50"
                  : "bg-cs-100 text-cs-600 hover:bg-cs-200"
                }`}
            >
              {f}
            </motion.button>
          ))}
          <span className="ml-auto text-cs-400 text-xs">
            {filtered.length} scheme{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

          {/* Status board */}
          <div className="self-start">
            <div className="bg-white border border-cs-100 rounded-2xl p-5">
              <h2 className="font-bold text-cs-900 text-xl mb-4">Status Board</h2>
              {[
                ["ENROLLED", `${(profile.registrations || []).length}`, CheckCircle2],
                ["APPLIED", "05", Shield],
                ["ELIGIBLE", `${String(schemes.length).padStart(2, "0")}`, Shield],
              ].map(([label, value, Icon]) => (
                <div key={label} className="border border-cs-100 rounded-xl p-4 mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-cs-500 tracking-widest">{label}</p>
                    <p className="text-3xl font-bold text-cs-900 mt-1">{value}</p>
                  </div>
                  <Icon size={20} className="text-cs-400" />
                </div>
              ))}

              {profile.isWomen && (
                <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 mt-2 mb-3">
                  <p className="text-pink-700 text-xs font-bold tracking-widest">🌸 WOMEN BENEFITS</p>
                  <p className="text-pink-900 text-sm font-semibold mt-1">
                    {schemes.filter(s => s.scheme_type === "Women").length} women-specific schemes
                  </p>
                  <p className="text-pink-600 text-xs mt-0.5">Mahila Udyam Nidhi & Stand Up India</p>
                </div>
              )}

              <div className="bg-cs-900 rounded-xl p-4 mt-2">
                <p className="text-cs-400 text-xs font-bold tracking-widest">Top Matched Scheme</p>
                <p className="text-cs-50 font-bold text-sm mt-1 leading-tight">
                  {schemes[0]?.scheme_name || "Loading…"}
                </p>
                {schemes[0]?.portal_url && (
                  <a
                    href={schemes[0].portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full flex items-center justify-center gap-1.5 bg-white/10 text-cs-50 hover:bg-white/20 rounded-lg py-2 text-xs font-semibold transition-colors"
                  >
                    Apply on Govt Portal <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Scheme grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-cs-100 rounded-2xl p-5 animate-pulse">
                  <div className="h-4 bg-cs-100 rounded mb-3 w-3/4" />
                  <div className="h-3 bg-cs-100 rounded mb-2 w-1/2" />
                  <div className="h-3 bg-cs-100 rounded mb-4 w-full" />
                  <div className="h-8 bg-cs-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence>
                {filtered.map((scheme, idx) => (
                  <motion.div
                    key={scheme.scheme_name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-cs-100 rounded-2xl p-5 hover:border-cs-300 hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-cs-900 text-sm leading-tight flex-1">
                        {scheme.scheme_name}
                      </h3>
                      <span className="flex-shrink-0 bg-cs-100 text-cs-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {scheme.scheme_type}
                      </span>
                    </div>

                    {/* Ministry */}
                    <p className="text-cs-400 text-xs mb-2">{scheme.ministry}</p>

                    {/* Match score */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-1.5 bg-cs-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cs-700 rounded-full"
                          style={{ width: `${scheme.eligibility_match_score}%` }}
                        />
                      </div>
                      <span className="text-cs-700 text-xs font-bold">{scheme.eligibility_match_score}% match</span>
                    </div>

                    {/* Benefit */}
                    <div className="bg-cs-50 rounded-lg px-3 py-2 mb-3">
                      <p className="text-cs-500 text-xs">Max Benefit</p>
                      <p className="text-cs-900 font-bold text-sm">{scheme.max_benefit}</p>
                    </div>

                    {/* Why eligible */}
                    <p className="text-cs-500 text-xs leading-relaxed mb-4 flex-1">
                      {scheme.why_eligible}
                    </p>

                    {/* Women badge */}
                    {(scheme.scheme_name?.toLowerCase().includes("women") ||
                      scheme.scheme_name?.toLowerCase().includes("mahila") ||
                      scheme.scheme_type === "Women") && (
                        <span className="inline-flex items-center gap-1 text-pink-600 text-xs font-semibold bg-pink-50 border border-pink-100 rounded-full px-2 py-0.5 mb-3 w-fit">
                          🌸 Women Specific
                        </span>
                      )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <a
                        href={scheme.portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-cs-900 text-cs-50 rounded-lg py-2 text-xs font-semibold hover:bg-cs-700 transition-colors"
                      >
                        Apply Now <ExternalLink size={11} />
                      </a>
                      <button
                        onClick={() => setApplyScheme(scheme)}
                        className="flex-shrink-0 border border-cs-200 text-cs-700 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-cs-50 transition-colors"
                      >
                        Pre-fill
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Pre-fill Application Modal ── */}
      <Modal
        isOpen={!!applyScheme}
        onClose={() => setApplyScheme(null)}
        title="Pre-filled Application"
      >
        <p className="text-cs-500 text-sm mb-1 font-semibold">{applyScheme?.scheme_name}</p>
        <p className="text-cs-400 text-xs mb-4">{applyScheme?.ministry}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            ["Business Name", profile.businessName || ""],
            ["GSTIN", profile.gstin || ""],
            ["State", profile.state || ""],
            ["Sector", profile.sector || ""],
            ["Turnover", profile.turnover || ""],
            ["Requested Benefit", applyScheme?.max_benefit ?? ""],
          ].map(([lbl, val]) => (
            <label key={lbl} className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-cs-600">{lbl}</span>
              <input
                defaultValue={val}
                className="border border-cs-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-cs-500"
              />
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-cs-50 rounded-lg p-3 mb-4 text-cs-700 text-sm font-medium">
          <CheckCircle2 size={16} className="text-cs-500" />
          CA verification recommended before final submission.
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() => setApplyScheme(null)}
          >
            Send to CA for Verification
          </Button>
          {applyScheme?.portal_url && (
            <a
              href={applyScheme.portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-cs-200 text-cs-700 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-cs-50 transition-colors"
            >
              Official Portal <ExternalLink size={13} />
            </a>
          )}
        </div>
      </Modal>

      <Footer dark />
    </DashboardLayout>
  );
}