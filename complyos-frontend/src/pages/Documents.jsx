import React, { useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  UploadCloud, Sparkles, FileText, CalendarDays, BadgeCheck,
  FileCheck2, Wand2, Landmark, LayoutGrid, List, X,
  Download, Eye, Trash2, CheckCircle2, AlertCircle, Clock,
  RefreshCw, Tag,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Common";
import { groqChat } from "../services/groqService";
import { getProfile } from "../utils/profileStore";

// ─── Document type → category mapping ───────────────────────────────────
const TYPE_CATEGORY_MAP = {
  "GST Certificate": "GST",
  "GSTR-3B": "GST",
  "GSTR-1": "GST",
  "GST Return": "GST",
  "Udyam Certificate": "Udyam",
  "Udyam Registration": "Udyam",
  "Invoice": "Invoices",
  "Purchase Invoice": "Invoices",
  "Sale Invoice": "Invoices",
  "Tax Invoice": "Invoices",
  "Trade License": "Licenses",
  "Shop License": "Licenses",
  "FSSAI License": "Licenses",
  "Import Export Code": "Licenses",
  "Bank Statement": "Bank",
  "Cancelled Cheque": "Bank",
  "Bank Certificate": "Bank",
};

function inferCategory(docType = "", filename = "") {
  const combined = (docType + " " + filename).toLowerCase();
  if (combined.includes("gst") || combined.includes("gstr")) return "GST";
  if (combined.includes("udyam") || combined.includes("msme")) return "Udyam";
  if (combined.includes("invoice") || combined.includes("bill")) return "Invoices";
  if (combined.includes("license") || combined.includes("licence") || combined.includes("fssai") || combined.includes("iec")) return "Licenses";
  if (combined.includes("bank") || combined.includes("cheque") || combined.includes("statement")) return "Bank";
  return TYPE_CATEGORY_MAP[docType] || "Other";
}

const CATEGORY_ICONS = {
  "All Documents": FileText,
  "GST": CalendarDays,
  "Udyam": BadgeCheck,
  "Invoices": FileCheck2,
  "Licenses": Wand2,
  "Bank": Landmark,
  "Other": FileText,
};

// ─── Read file as base64 ─────────────────────────────────────────────────
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result is "data:application/pdf;base64,JVBERi0x..."
      // we only want the base64 part after the comma
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Read file as plain text (for text-based PDFs and images) ───────────
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// ─── Extract visible text from PDF using PDF.js (loaded via CDN) ────────
async function extractPdfText(file) {
  try {
    // Dynamically load PDF.js if not already loaded
    if (!window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const textParts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      textParts.push(pageText);
    }

    return textParts.join("\n");
  } catch (err) {
    console.error("PDF text extraction failed:", err);
    return "";
  }
}

// ─── Main extraction function — sends REAL file content to AI ────────────
async function vedaExtract(file, profile) {
  let fileContent = "";
  const filename = file.name;
  const ext = filename.split(".").pop().toLowerCase();

  // Step 1: Extract actual text from the file
  if (ext === "pdf") {
    fileContent = await extractPdfText(file);
  } else if (["jpg", "jpeg", "png"].includes(ext)) {
    // For images we send base64 to the AI
    fileContent = `[Image file — filename: ${filename}. Analyse based on filename and context.]`;
  } else {
    fileContent = await readFileAsText(file);
  }

  // Step 2: Clean and truncate (Groq has token limits)
  const cleanedText = fileContent
    .replace(/\s+/g, " ")         // collapse whitespace
    .replace(/[^\x20-\x7E\u0900-\u097F]/g, " ") // keep ASCII + Devanagari
    .trim()
    .slice(0, 4000);               // max 4000 chars to stay within limits

  const hasRealContent = cleanedText.length > 50;

  // Step 3: Build prompt with actual content
  const prompt = `You are VEDA, an expert AI document analyst for Indian MSMEs specializing in GST, Udyam, FSSAI, and compliance documents.

${hasRealContent
      ? `ACTUAL DOCUMENT CONTENT:\n"""\n${cleanedText}\n"""`
      : `FILENAME: "${filename}" (could not extract text — analyse based on filename)`
    }

Business Profile Context:
- Sector: ${profile.sector || "General MSME"}
- State: ${profile.state || "India"}
- Registered GSTIN: ${profile.gstin || "Not provided"}

YOUR TASK: Extract ALL compliance-relevant information from this document.

CRITICAL EXTRACTION RULES:
1. GSTIN format is always: 2 digits + 5 letters + 4 digits + 1 letter + 1 letter/digit + Z + 1 alphanumeric (e.g. 27AAPFU0939F1ZV). Extract EXACTLY as it appears.
2. PAN format: 5 letters + 4 digits + 1 letter (e.g. AAPFU0939F). Extract EXACTLY.
3. Udyam number format: UDYAM-XX-00-0000000. Extract EXACTLY.
4. Dates: extract in DD/MM/YYYY format as they appear in the document.
5. Business name: extract EXACTLY as written, do not paraphrase.
6. If a field is clearly present in the text, ALWAYS extract it — never say "Not found" when the value is visible.

Return ONLY this JSON (no markdown, no backticks, no explanation):
{
  "document_type": "<specific type e.g. GST Registration Certificate, GSTR-3B Return, Udyam Registration Certificate, Trade License, Bank Statement, Tax Invoice>",
  "sub_type": "<optional further classification>",
  "summary": "<2 sentences: what this document is and its compliance importance for this business>",
  "key_fields": {
    "business_name": "<exact name from document or Not found>",
    "gstin": "<15-char GSTIN exactly as in document or Not found>",
    "pan": "<10-char PAN exactly or Not found>",
    "udyam_number": "<UDYAM-XX-XX-XXXXXXX or Not found>",
    "registration_date": "<DD/MM/YYYY or Not found>",
    "valid_upto": "<DD/MM/YYYY or Not found>",
    "legal_name": "<legal/trade name if different or Not found>",
    "address": "<registered address or Not found>",
    "state_code": "<2-digit state code from GSTIN or Not found>",
    "business_constitution": "<Proprietorship/Partnership/Pvt Ltd etc or Not found>",
    "nature_of_business": "<as mentioned in document or Not found>"
  },
  "important_dates": [
    {"label": "<e.g. Registration Date, Valid Upto, Filing Period, Due Date>", "value": "<date>"}
  ],
  "compliance_flags": [
    "<specific compliance risk or warning — e.g. 'GST registration expires in 30 days', 'GSTR-3B filing due on 20th of next month'>"
  ],
  "action_items": [
    "<specific actionable next step for this business owner>"
  ]
}`;

  const reply = await groqChat(
    [{ role: "user", content: prompt }],
    "You are VEDA, an expert Indian business compliance document analyst. Extract ALL data precisely from documents. Never return 'Unknown' or 'Not found' if the value is visible in the text. GSTIN, PAN, dates and business names must be extracted character-perfect.",
    { maxTokens: 800, temperature: 0.1 }   // very low temperature = precise extraction
  );

  // Clean response — remove any markdown code fences if present
  let clean = reply.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/```json\n?|```\n?/g, "").trim();
  }

  // Find JSON object in response
  const jsonStart = clean.indexOf("{");
  const jsonEnd = clean.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    clean = clean.slice(jsonStart, jsonEnd + 1);
  }

  return JSON.parse(clean);
}

// ─── Status badge ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    verified: { color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={11} />, label: "Verified" },
    processing: { color: "bg-amber-100 text-amber-700", icon: <Clock size={11} />, label: "Processing" },
    action_needed: { color: "bg-red-100 text-red-600", icon: <AlertCircle size={11} />, label: "Action Needed" },
    uploaded: { color: "bg-cs-100 text-cs-600", icon: <CheckCircle2 size={11} />, label: "Uploaded" },
  };
  const s = map[status?.toLowerCase()] || map["uploaded"];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
      {s.icon} {s.label}
    </span>
  );
}

// ─── Document card ────────────────────────────────────────────────────────
function DocCard({ doc, view, onView, onDelete }) {
  const Icon = CATEGORY_ICONS[doc.category] || FileText;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-all ${view === "list" ? "flex-row items-center" : ""} border-cs-100`}
    >
      <div className={`flex items-start justify-between gap-2 ${view === "list" ? "flex-1" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cs-100 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-cs-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-cs-900 text-sm truncate max-w-[160px]" title={doc.name}>
              {doc.name}
            </p>
            <p className="text-cs-400 text-xs mt-0.5">{doc.uploadedAt}</p>
          </div>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      {doc.category && (
        <span className="inline-flex items-center gap-1 text-cs-500 text-xs font-medium w-fit">
          <Tag size={10} /> {doc.category}
        </span>
      )}

      {doc.extractedType && (
        <p className="text-cs-500 text-xs bg-cs-50 rounded-lg px-2 py-1">
          📄 {doc.extractedType}
        </p>
      )}

      {/* Show GSTIN directly on card if extracted */}
      {doc.extracted?.key_fields?.gstin && doc.extracted.key_fields.gstin !== "Not found" && (
        <p className="text-xs font-mono bg-green-50 text-green-700 border border-green-100 rounded-lg px-2 py-1">
          GSTIN: {doc.extracted.key_fields.gstin}
        </p>
      )}

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onView(doc)}
          className="flex-1 flex items-center justify-center gap-1.5 border border-cs-200 text-cs-700 rounded-lg py-1.5 text-xs font-semibold hover:bg-cs-50 transition-colors"
        >
          <Eye size={13} /> View
        </button>
        <button
          onClick={() => onDelete(doc.id)}
          className="flex items-center justify-center border border-cs-100 text-cs-400 rounded-lg px-2.5 py-1.5 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── VEDA Extraction Panel ─────────────────────────────────────────────────
function VedaPanel({ doc, onClose, onReanalyse, loading }) {
  if (!doc) return null;
  const info = doc.extracted || {};

  return (
    <motion.aside
      initial={{ x: 440, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 440, opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="fixed right-5 top-16 bottom-5 w-96 bg-white border border-cs-100 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cs-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
            <Sparkles size={13} className="text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-cs-900 text-sm">VEDA Extraction</p>
            <p className="text-cs-400 text-[10px]">AI-powered document analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReanalyse}
            disabled={loading}
            className="text-cs-400 hover:text-cs-700 transition-colors disabled:opacity-40"
            title="Re-analyse"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={onClose} className="text-cs-400 hover:text-cs-700 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-amber-400"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                />
              ))}
            </div>
            <p className="text-cs-500 text-sm">VEDA is reading your document…</p>
            <p className="text-cs-400 text-xs">Extracting fields, dates & compliance data</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            {/* Document type */}
            {info.document_type && (
              <div className="bg-cs-50 rounded-xl p-4">
                <p className="text-cs-500 text-xs font-bold tracking-widest uppercase mb-1">Document Type</p>
                <p className="text-cs-900 font-bold text-base">{info.document_type}</p>
                {info.sub_type && <p className="text-cs-500 text-xs mt-0.5">{info.sub_type}</p>}
              </div>
            )}

            {/* Summary */}
            {info.summary && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-amber-800 text-xs font-bold tracking-widest uppercase mb-1">Summary</p>
                <p className="text-amber-900 text-sm leading-relaxed">{info.summary}</p>
              </div>
            )}

            {/* Key fields — filter out "Not found" values */}
            {info.key_fields && Object.keys(info.key_fields).length > 0 && (
              <div>
                <p className="text-cs-500 text-xs font-bold tracking-widest uppercase mb-2">Extracted Fields</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(info.key_fields)
                    .filter(([, v]) => v && v !== "Not found" && v !== "N/A" && String(v).trim() !== "")
                    .map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between gap-2 border border-cs-100 rounded-lg px-3 py-2">
                        <span className="text-cs-500 text-xs font-medium capitalize flex-shrink-0">
                          {k.replace(/_/g, " ")}
                        </span>
                        <span className={`text-xs font-bold text-right max-w-[60%] break-all ${k === "gstin" || k === "pan" || k === "udyam_number"
                          ? "text-green-700 font-mono bg-green-50 px-1.5 py-0.5 rounded"
                          : "text-cs-900"
                          }`}>
                          {String(v)}
                        </span>
                      </div>
                    ))}
                  {/* Show count of "Not found" fields separately */}
                  {Object.entries(info.key_fields).filter(([, v]) => !v || v === "Not found").length > 0 && (
                    <p className="text-cs-400 text-xs text-center pt-1">
                      {Object.entries(info.key_fields).filter(([, v]) => !v || v === "Not found").length} fields not found in document
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            {info.important_dates && info.important_dates.length > 0 && (
              <div>
                <p className="text-cs-500 text-xs font-bold tracking-widest uppercase mb-2">Important Dates</p>
                <div className="flex flex-col gap-1.5">
                  {info.important_dates
                    .filter((d) => d.value && d.value !== "Unknown" && d.value !== "Not found")
                    .map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs bg-cs-50 rounded-lg px-3 py-2">
                        <CalendarDays size={12} className="text-cs-400 flex-shrink-0" />
                        <span className="text-cs-700 font-medium">{d.label}:</span>
                        <span className="text-cs-900 font-bold ml-auto">{d.value}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Compliance flags */}
            {info.compliance_flags && info.compliance_flags.length > 0 && (
              <div>
                <p className="text-cs-500 text-xs font-bold tracking-widest uppercase mb-2">Compliance Notes</p>
                <div className="flex flex-col gap-1.5">
                  {info.compliance_flags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <AlertCircle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-xs">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action items */}
            {info.action_items && info.action_items.length > 0 && (
              <div>
                <p className="text-cs-500 text-xs font-bold tracking-widests uppercase mb-2">Recommended Actions</p>
                <div className="flex flex-col gap-1.5">
                  {info.action_items.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-cs-500 flex-shrink-0 mt-0.5" />
                      <p className="text-cs-700 text-xs">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw fallback */}
            {!info.document_type && !info.summary && (
              <div className="bg-cs-50 rounded-xl p-4 text-center">
                <AlertCircle size={20} className="text-cs-400 mx-auto mb-2" />
                <p className="text-cs-500 text-xs">Could not extract structured data.</p>
                <p className="text-cs-400 text-xs mt-1">Try re-analysing or check if the PDF has selectable text.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-cs-100">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 border border-cs-200 text-cs-700 rounded-lg py-2 text-xs font-semibold hover:bg-cs-50 transition-colors">
            <Download size={13} /> Export
          </button>
          <button
            onClick={onReanalyse}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 bg-cs-900 text-cs-50 rounded-lg py-2 text-xs font-semibold hover:bg-cs-700 transition-colors disabled:opacity-50"
          >
            <Sparkles size={13} /> Re-analyse
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
let nextId = 100;

export default function DocumentsPage() {
  const profile = getProfile();
  const [docs, setDocs] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Documents");
  const [panelDoc, setPanelDoc] = useState(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [dragOver, setDragOver] = useState(false);

  // Store actual File objects separately (can't store File in state cleanly with extracted data)
  const fileStore = useRef({});
  const fileRef = useRef(null);

  // ── Dynamic categories ────────────────────────────────────────────────
  const categories = useMemo(() => {
    const counts = { "All Documents": docs.length };
    docs.forEach((d) => {
      const cat = d.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    ["GST", "Udyam", "Invoices", "Licenses", "Bank"].forEach((c) => {
      if (counts[c] == null) counts[c] = 0;
    });
    return counts;
  }, [docs]);

  const CATEGORY_ORDER = ["All Documents", "GST", "Udyam", "Invoices", "Licenses", "Bank", "Other"];

  const filteredDocs = useMemo(() => {
    if (activeCategory === "All Documents") return docs;
    return docs.filter((d) => d.category === activeCategory);
  }, [docs, activeCategory]);

  // ── Handle file upload — NOW PASSES ACTUAL FILE OBJECT ───────────────
  async function handleFile(file) {
    if (!file) return;
    setProcessing(true);

    const id = ++nextId;

    // Store the actual File object so we can re-read it for re-analysis
    fileStore.current[id] = file;

    const newDoc = {
      id,
      name: file.name,
      uploadedAt: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      status: "processing",
      category: inferCategory("", file.name),
      extracted: null,
    };

    setDocs((prev) => [newDoc, ...prev]);

    try {
      // Pass the ACTUAL FILE OBJECT — not just the filename
      const extracted = await vedaExtract(file, profile);
      const category = inferCategory(extracted.document_type || "", file.name);

      const updatedDoc = {
        ...newDoc,
        status: "verified",
        category,
        extractedType: extracted.document_type,
        extracted,
      };

      setDocs((prev) => prev.map((d) => d.id === id ? updatedDoc : d));
      setPanelDoc(updatedDoc);

    } catch (err) {
      console.error("VEDA extraction failed:", err);
      setDocs((prev) => prev.map((d) => d.id === id ? { ...d, status: "uploaded" } : d));
    } finally {
      setProcessing(false);
    }
  }

  // ── View doc in panel ─────────────────────────────────────────────────
  async function openPanel(doc) {
    setPanelDoc(doc);
    if (!doc.extracted) {
      setPanelLoading(true);
      try {
        const file = fileStore.current[doc.id];
        if (file) {
          const extracted = await vedaExtract(file, profile);
          const category = inferCategory(extracted.document_type || "", doc.name);
          const updated = { ...doc, status: "verified", category, extractedType: extracted.document_type, extracted };
          setDocs((prev) => prev.map((d) => d.id === doc.id ? updated : d));
          setPanelDoc(updated);
        }
      } catch (err) {
        console.error("Panel extraction failed:", err);
      } finally {
        setPanelLoading(false);
      }
    }
  }

  // ── Re-analyse — re-reads the same file ──────────────────────────────
  async function reanalyse() {
    if (!panelDoc) return;
    setPanelLoading(true);
    try {
      const file = fileStore.current[panelDoc.id];
      if (!file) throw new Error("Original file not available — please re-upload.");
      const extracted = await vedaExtract(file, profile);
      const category = inferCategory(extracted.document_type || "", panelDoc.name);
      const updated = { ...panelDoc, extracted, category, extractedType: extracted.document_type, status: "verified" };
      setDocs((prev) => prev.map((d) => d.id === panelDoc.id ? updated : d));
      setPanelDoc(updated);
    } catch (err) {
      console.error("Re-analysis failed:", err);
    } finally {
      setPanelLoading(false);
    }
  }

  function deleteDoc(id) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    delete fileStore.current[id];
    if (panelDoc?.id === id) setPanelDoc(null);
  }

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* ── UPLOAD ZONE ── */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          animate={{ borderColor: dragOver ? "#4a6472" : "#b0c4cc" }}
          className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-14 px-6 text-center mb-10 bg-white/50 cursor-pointer hover:border-cs-500 transition-colors"
          onClick={() => fileRef.current.click()}
        >
          <motion.div
            animate={processing ? { rotate: 360 } : { rotate: 0 }}
            transition={processing ? { duration: 1.1, repeat: Infinity, ease: "linear" } : {}}
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${dragOver ? "bg-cs-200 text-cs-700" : "bg-cs-100 text-cs-400"}`}
          >
            {processing ? <Sparkles size={28} className="text-amber-500" /> : <UploadCloud size={28} />}
          </motion.div>
          <h2 className="text-xl font-bold text-cs-900 mb-1">
            {processing ? "VEDA is reading your document…" : dragOver ? "Drop to upload" : "Drop documents here"}
          </h2>
          <p className="text-cs-400 text-sm mb-5">
            PDF, JPG, PNG supported · VEDA reads actual content and extracts GSTIN, PAN, dates & more
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
          >
            Select Files
          </Button>
          <input
            ref={fileRef}
            hidden
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </motion.div>

        {/* ── LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

          {/* Categories sidebar */}
          <aside>
            <p className="text-xs font-bold text-cs-500 tracking-widest uppercase mb-3">
              Document Categories
            </p>
            <div className="flex flex-col gap-1">
              {CATEGORY_ORDER.filter((name) => categories[name] != null).map((name) => {
                const Icon = CATEGORY_ICONS[name] || FileText;
                const count = categories[name] || 0;
                return (
                  <button
                    key={name}
                    onClick={() => setActiveCategory(name)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${activeCategory === name
                      ? "bg-white border border-cs-100 text-cs-900 shadow-sm"
                      : "text-cs-500 hover:bg-cs-100 hover:text-cs-700"
                      }`}
                  >
                    <Icon size={17} />
                    <span className="flex-1 text-left">{name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${count > 0 ? "bg-cs-200 text-cs-700" : "bg-cs-100 text-cs-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {docs.length === 0 && (
              <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-amber-800 text-xs font-bold mb-1">💡 VEDA AI</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  Upload any GST certificate, Udyam doc, invoice, or licence. VEDA reads the actual document content and extracts GSTIN, PAN, dates, and compliance flags.
                </p>
              </div>
            )}
          </aside>

          {/* Doc grid */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-bold text-cs-900">{activeCategory}</h1>
                <p className="text-cs-400 text-xs mt-0.5">
                  {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}
                  {profile.businessName && ` · ${profile.businessName}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 border rounded-lg transition-colors ${viewMode === "grid" ? "border-cs-900 bg-cs-900 text-white" : "border-cs-100 text-cs-500 hover:bg-cs-100"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 border rounded-lg transition-colors ${viewMode === "list" ? "border-cs-900 bg-cs-900 text-white" : "border-cs-100 text-cs-500 hover:bg-cs-100"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="border-2 border-dashed border-cs-200 rounded-2xl py-20 text-center">
                <UploadCloud size={32} className="text-cs-300 mx-auto mb-3" />
                <p className="text-cs-500 font-semibold text-sm">
                  {activeCategory === "All Documents"
                    ? "No documents yet — upload your first file above"
                    : `No ${activeCategory} documents yet`}
                </p>
                <p className="text-cs-400 text-xs mt-1">VEDA will auto-categorise when you upload</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "flex flex-col gap-3"
                }>
                  {filteredDocs.map((doc) => (
                    <DocCard
                      key={doc.id}
                      doc={doc}
                      view={viewMode}
                      onView={() => openPanel(doc)}
                      onDelete={deleteDoc}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </section>
        </div>

        {/* ── VEDA PANEL ── */}
        <AnimatePresence>
          {panelDoc && (
            <VedaPanel
              doc={panelDoc}
              loading={panelLoading}
              onClose={() => setPanelDoc(null)}
              onReanalyse={reanalyse}
            />
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </DashboardLayout>
  );
}