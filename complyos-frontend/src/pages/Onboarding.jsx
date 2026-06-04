import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowUp, HelpCircle, Sparkles, CheckCircle2, User, X } from "lucide-react";
import ProgressBar from "../components/ui/ProgressBar";
import { setToken, setRole, setUserId } from "../utils/helpers";
import { setProfile } from "../utils/profileStore";
import { groqChat } from "../services/groqService";

// ─── System prompt ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are ARIA — a friendly, helpful compliance assistant for Indian small businesses on ComplianceOS. Think of yourself as a knowledgeable friend, not a form.

GOAL: Learn about the user's business through natural chat. You need these 8 things — collect them conversationally, one or two at a time:
• businessName, businessType (shop/factory/food/service/other), sector, state, district, turnover (below40L / 40L-1Cr / 1Cr-10Cr / above10Cr), registrations (GST/Udyam/PAN/FSSAI etc, or [] if none), isWomen (true/false)

TONE: Short, warm, human. Max 2 sentences per reply. Use their name or business name once you know it. No bullet points in casual replies. No corporate language.

NAME RULE — be very generous:
Accept ANY business name. Typos, short names, initials, informal names — all fine. "kumar textitles" → accept as "Kumar Textiles". Only skip if it's random keyboard spam (asdf, qwerty) or literally one character.

SMART EXTRACTION: If they give multiple details at once ("I have a textile shop in Surat, GST registered") — grab everything from that message and only ask what's still missing.

ASSUMPTIONS: If someone is vague (turnover "small" → below40L, registrations "not sure" → [], women-led not mentioned → false) — just assume and move on. Tell them what you assumed in one casual phrase.

COMPLIANCE QUESTIONS: If they ask about GST, Udyam, schemes, loans — answer briefly (1-2 sentences) then continue. Never ignore a question.

COMPLETION: Once you have all 8 fields confirmed, output this block and nothing else:
<PROFILE_DONE>
{"businessName":"...","businessType":"...","sector":"...","state":"...","district":"...","turnover":"...","registrations":[],"isWomen":false}
</PROFILE_DONE>`;

// ─── Chips per conversation stage ────────────────────────────────────────
const CHIPS_MAP = {
  name: ["I'll type my business name"],
  type: ["Shop / Retail", "Manufacturing factory", "Food business", "IT / Software service", "Service provider"],
  location: ["Maharashtra", "Delhi", "Karnataka", "Gujarat", "Tamil Nadu", "Uttar Pradesh"],
  registrations: ["GST registered", "Udyam registered", "PAN only", "GST + Udyam", "No registrations yet"],
  turnover: ["Below ₹40 lakhs", "₹40L to ₹1 Crore", "₹1 to ₹10 Crore", "Above ₹10 Crore"],
  women: ["Yes, women-led", "No"],
  default: ["I have a compliance question", "What is GST?", "How do I get Udyam?"],
};

const STEPS = ["Welcome", "Business Info", "Location", "Registrations", "Complete"];

// ─── Validation helpers ───────────────────────────────────────────────────
const GIBBERISH_PATTERNS = [
  /^[a-z]{1}$/i,
  /^(asdf|qwerty|zxcvbn|test)$/i,
  /^(.)\1{3,}$/,           // repeated chars 4+ times: "aaaa"
  /^[^a-zA-Z]*$/,          // only numbers/symbols with no letters at all
];
function looksLikeGibberish(str) {
  const s = str.trim();
  if (s.length < 2) return true;
  return GIBBERISH_PATTERNS.some((p) => p.test(s));
}

// ─── Partial profile sniffer ──────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu", "Ladakh", "Puducherry",
];

function sniffProfile(text, current = {}) {
  const p = { ...current };
  const t = text;

  // State
  INDIAN_STATES.forEach((s) => {
    if (t.toLowerCase().includes(s.toLowerCase())) p.state = s;
  });

  // Women
  if (/\b(women|woman|mahila|female|lady)\b/i.test(t)) p.isWomen = true;

  // Sector
  if (/\b(food|bakery|restaurant|tiffin|catering|fssai|canteen)\b/i.test(t)) p.sector = "food";
  else if (/\b(textile|fabric|garment|cloth|weav)\b/i.test(t)) p.sector = "textiles";
  else if (/\b(software|it |tech|app |web |digital|saas)\b/i.test(t)) p.sector = "IT";
  else if (/\b(manufactur|factory|plant|production)\b/i.test(t)) p.sector = "manufacturing";
  else if (/\b(retail|shop|store|trading)\b/i.test(t)) p.sector = "retail";
  else if (/\b(health|clinic|pharma|medical|hospital)\b/i.test(t)) p.sector = "healthcare";

  // Registrations
  const regs = new Set(p.registrations || []);
  if (/\bgst\b/i.test(t)) regs.add("GST");
  if (/\budyam\b/i.test(t)) regs.add("Udyam");
  if (/\bfssai\b/i.test(t)) regs.add("FSSAI");
  if (/\b(iec|import.?export)\b/i.test(t)) regs.add("ImportExport");
  if (/\btrademark\b/i.test(t)) regs.add("Trademark");
  if (/\bpan\b/i.test(t)) regs.add("PAN");
  if (regs.size > 0) p.registrations = [...regs];

  // Turnover
  if (/\b(below|under|less).{0,10}40\b/i.test(t) || /\b40\s*l?akhs?\b/i.test(t)) p.turnover = "below40L";
  else if (/\b(80|50|60|70)\s*l?akhs?\b/i.test(t) || /40l.{0,5}1\s*cr/i.test(t)) p.turnover = "40L-1Cr";
  else if (/\b1\s*cr.{0,5}10\s*cr/i.test(t) || /\b[2-9]\s*cr/i.test(t)) p.turnover = "1Cr-10Cr";
  else if (/\babove.{0,5}10\s*cr/i.test(t) || /\b[1-9]\d\s*cr/i.test(t)) p.turnover = "above10Cr";

  return p;
}

// ─── Pill component ───────────────────────────────────────────────────────
function Pill({ label, value, color = "stone" }) {
  const cls = { stone: "bg-stone-100 text-stone-700", pink: "bg-pink-50 text-pink-700 border border-pink-200", green: "bg-green-50 text-green-700 border border-green-200" }[color];
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label} {value}</span>;
}

// ─── Detect which chips to show based on conversation ────────────────────
function detectChipStage(messages) {
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")?.content?.toLowerCase() || "";
  if (/business name|what.*called|name.*business/i.test(lastAssistant)) return "name";
  if (/type.*business|kind.*business|shop|factory|service/i.test(lastAssistant)) return "type";
  if (/state|city|district|location|where/i.test(lastAssistant)) return "location";
  if (/regist|gst|udyam|pan|fssai/i.test(lastAssistant)) return "registrations";
  if (/turnover|revenue|annual|crore|lakh/i.test(lastAssistant)) return "turnover";
  if (/women|woman|female|mahila/i.test(lastAssistant)) return "women";
  return "default";
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [profilePreview, setProfilePreview] = useState({});
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { startConvo(); }, []); // eslint-disable-line
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function startConvo() {
    setLoading(true);
    try {
      const reply = await groqChat(
        [{ role: "user", content: "Hi, I want to set up my business on ComplianceOS." }],
        SYSTEM_PROMPT,
        { maxTokens: 160, temperature: 0.6 }
      );
      setMessages([{ role: "assistant", content: reply }]);
    } catch {
      setMessages([{ role: "assistant", content: "Hey! Welcome to ComplianceOS 👋 I'm ARIA, your compliance assistant. Let's get your business set up. What's the name of your business?" }]);
    } finally {
      setLoading(false);
    }
  }

  async function askAria(history) {
    setLoading(true);
    try {
      const reply = await groqChat(history, SYSTEM_PROMPT, { maxTokens: 280, temperature: 0.55 });

      // ── Check for completion signal ──
      const match = reply.match(/<PROFILE_DONE>([\s\S]*?)<\/PROFILE_DONE>/);
      if (match) {
        try {
          const profile = JSON.parse(match[1].trim());

          // Hard gate: reject only obvious keyboard spam
          if (!profile.businessName || looksLikeGibberish(profile.businessName)) {
            throw new Error("invalid businessName");
          }

          setProfile(profile);
          setToken("cos-business-token");
          setRole("business_owner");
          setUserId("user-" + Date.now());
          setStep(5);
          setDone(true);
          setProfilePreview(profile);

          const cleanReply = reply.replace(/<PROFILE_DONE>[\s\S]*?<\/PROFILE_DONE>/, "").trim()
            || `Your profile for ${profile.businessName} is all set! Taking you to your personalised compliance dashboard now 🎉`;

          setMessages((prev) => [...prev, { role: "assistant", content: cleanReply }]);
          setTimeout(() => navigate("/dashboard"), 2800);
          return;
        } catch {
          // Parsed but invalid — strip the tag and continue conversation
          const stripped = reply.replace(/<PROFILE_DONE>[\s\S]*?<\/PROFILE_DONE>/, "").trim()
            || "I need a few more details — what's your actual business name?";
          setMessages((prev) => [...prev, { role: "assistant", content: stripped }]);
          setLoading(false);
          return;
        }
      }

      // ── Sniff partial profile from full conversation ──
      const fullText = history.map((m) => m.content).join(" ") + " " + reply;
      setProfilePreview((prev) => sniffProfile(fullText, prev));

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      // ── Advance step heuristic ──
      const userCount = history.filter((m) => m.role === "user").length;
      if (userCount >= 1) setStep(2);
      if (userCount >= 3) setStep(3);
      if (userCount >= 5) setStep(4);

    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, had a hiccup! Could you tell me your business name and what kind of business you run?",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function send(text = input) {
    const clean = text.trim();
    if (!clean || loading || done) return;
    setInput("");
    inputRef.current?.focus();
    const updated = [...messages, { role: "user", content: clean }];
    setMessages(updated);
    askAria(updated);
  }

  const pct = Math.round(((step - 1) / (STEPS.length - 1)) * 100);
  const chipStage = detectChipStage(messages);
  const chips = CHIPS_MAP[chipStage] || CHIPS_MAP.default;

  const hasPreview = Object.keys(profilePreview).some((k) => {
    const v = profilePreview[k];
    return Array.isArray(v) ? v.length > 0 : !!v;
  });

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 md:px-10 flex-shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="font-extrabold text-stone-900 text-lg tracking-tight">ComplianceOS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-stone-500 text-sm font-semibold">{STEPS[step - 1]}</span>
          <div className="w-32 hidden sm:block"><ProgressBar value={pct} size="sm" animated /></div>
          <HelpCircle size={17} className="text-stone-400 cursor-pointer hover:text-stone-700" />
        </div>
      </header>

      {/* ── STEP PILLS ── */}
      <div className="flex items-center justify-center gap-1.5 py-3 px-4 bg-white border-b border-stone-100 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${i + 1 < step ? "bg-stone-800 text-white" :
              i + 1 === step ? "bg-amber-100 text-amber-800 border border-amber-300" :
                "bg-stone-100 text-stone-400"
              }`}
          >
            {i + 1 < step ? <CheckCircle2 size={11} /> : <span className="opacity-60">{i + 1}</span>}
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* ── CHAT ── */}
      <div className="flex-1 overflow-y-auto pb-56">
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

          {/* Live profile preview */}
          <AnimatePresence>
            {hasPreview && !done && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-sm"
              >
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                  Building your profile…
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profilePreview.state && <Pill label="📍" value={profilePreview.state} />}
                  {profilePreview.sector && <Pill label="🏭" value={profilePreview.sector} />}
                  {profilePreview.turnover && <Pill label="💰" value={profilePreview.turnover} />}
                  {profilePreview.isWomen && <Pill label="🌸" value="Women-led" color="pink" />}
                  {(profilePreview.registrations || []).map((r) => (
                    <Pill key={r} label="✓" value={r} color="green" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 shadow-sm ${msg.role === "assistant" ? "bg-stone-800 text-white" : "bg-stone-200 text-stone-600"
                  }`}>
                  {msg.role === "assistant" ? <Bot size={15} /> : <User size={15} />}
                </div>
                <div className={`max-w-sm md:max-w-md rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${msg.role === "assistant"
                  ? "bg-white border border-stone-100 text-stone-900 rounded-bl-sm"
                  : "bg-stone-900 text-white rounded-br-sm"
                  }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-5 py-4 flex gap-1.5 items-center shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-stone-300"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.75, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion banner */}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-green-900 text-sm">Profile Complete!</p>
                  <p className="text-green-700 text-xs mt-0.5">Redirecting to your personalised dashboard…</p>
                </div>
                <motion.div
                  className="ml-auto w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── INPUT BAR ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#f5f4f0]/96 backdrop-blur-sm border-t border-stone-200 px-4 pt-3 pb-5">
        {!done && (
          <div className="max-w-2xl mx-auto flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            {chips.map((chip) => (
              <motion.button
                key={chip}
                whileTap={{ scale: 0.96 }}
                onClick={() => send(chip)}
                disabled={loading}
                className="flex-shrink-0 bg-white border border-stone-200 text-stone-600 text-xs font-semibold px-3.5 py-1.5 rounded-full hover:border-stone-700 hover:text-stone-900 transition-all disabled:opacity-40"
              >
                {chip}
              </motion.button>
            ))}
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-2xl flex items-center gap-3 px-4 py-3 shadow-sm focus-within:border-stone-400 transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={done ? "Redirecting…" : "Type anything — ask a question or describe your business…"}
            disabled={loading || done}
            className="flex-1 bg-transparent outline-none text-stone-900 text-sm placeholder:text-stone-400 disabled:opacity-50"
          />
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => send()}
            disabled={loading || done || !input.trim()}
            className="w-9 h-9 bg-stone-900 text-white rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:bg-stone-700 transition-all"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>

        <p className="text-center text-stone-400 text-[10px] font-bold tracking-widest mt-2.5 uppercase">
          Powered by ARIA · ComplianceOS · Your data stays private
        </p>
      </footer>
    </div>
  );
}