import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, ChevronDown, RotateCcw, Scale } from "lucide-react";

// ─── Groq config ──────────────────────────────────────────────────────────────
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `You are CABot — a senior Chartered Accountant and business compliance expert for Indian SMEs. You speak with authority, warmth, and precision, like a trusted CA who knows the business owner personally.

Your expertise covers:
• GST — registration, filing, ITC, notices, e-invoicing, annual returns
• Income Tax — ITR filing, TDS/TCS, advance tax, presumptive taxation, Section 44AD/44ADA
• Company Law / ROC — incorporation, annual filings, MCA compliance, director KYC
• MSME / Udyam — registration benefits, priority lending, delayed payment rules
• Labour laws — PF, ESI, Professional Tax, gratuity, Shops & Establishments Act
• Startup India — DPIIT recognition, tax holidays under 80-IAC, angel tax exemption
• Import / Export — IEC, customs duty, DGFT, MEIS/RoDTEP schemes
• Banking & Finance — working capital, CGTMSE, MUDRA loans, credit scores
• Women entrepreneur schemes — Stand-Up India, Mahila Udyam Nidhi, WE-Hub
• Government schemes — PM Vishwakarma, PLI, PMEGP, CLCSS

Tone rules:
— Lead with a direct, confident answer (no fluff).
— Use ₹ for rupees. Use Indian number formatting (Lakh, Crore).
— Cite section numbers, scheme names, and deadlines where relevant.
— Where action is needed, give numbered steps.
— End with a short, practical tip or heads-up if appropriate.
— Keep responses concise but complete — no unnecessary padding.
— Never say "I'm just an AI" — you ARE a CA advisor.`;

const QUICK_PROMPTS = [
    "What is the GST composition scheme limit?",
    "How to register on Udyam portal?",
    "TDS rates for FY 2024-25",
    "Penalties for late GST filing",
    "Benefits for women entrepreneurs",
    "What is CGTMSE guarantee scheme?",
];

// ─── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isLast }) {
    const isUser = msg.role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar */}
            {!isUser && (
                <div className="w-7 h-7 rounded-full bg-cs-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Scale size={13} className="text-amber-400" />
                </div>
            )}

            {/* Bubble */}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                    ? "bg-cs-900 text-white rounded-tr-sm"
                    : "bg-cs-50 border border-cs-100 text-cs-800 rounded-tl-sm"
                    }`}
            >
                {msg.role === "assistant" ? (
                    <FormattedMessage text={msg.content} />
                ) : (
                    msg.content
                )}
                {msg.loading && (
                    <span className="inline-flex gap-1 ml-1 align-middle">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="w-1 h-1 rounded-full bg-cs-400 inline-block animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

// Render bold/bullet markdown lightly
function FormattedMessage({ text }) {
    if (!text) return null;
    const lines = text.split("\n");
    return (
        <div className="flex flex-col gap-1">
            {lines.map((line, i) => {
                // Bold: **text**
                const parts = line.split(/\*\*(.*?)\*\*/g);
                const rendered = parts.map((p, j) =>
                    j % 2 === 1 ? <strong key={j} className="font-semibold text-cs-900">{p}</strong> : p
                );
                if (line.startsWith("• ") || line.startsWith("— ")) {
                    return (
                        <div key={i} className="flex gap-2">
                            <span className="text-amber-500 mt-0.5">›</span>
                            <span>{rendered}</span>
                        </div>
                    );
                }
                if (/^\d+\./.test(line)) {
                    return <div key={i} className="flex gap-2"><span>{rendered}</span></div>;
                }
                return <p key={i}>{rendered}</p>;
            })}
        </div>
    );
}

// ─── Main Chatbot ──────────────────────────────────────────────────────────────
export function ComplianceChatbot({ open, onClose }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Namaste! I'm **CABot** — your AI Chartered Accountant. Ask me anything about GST, Income Tax, MSME schemes, company compliance, or business finance.\n\nWhat can I help you with today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function sendMessage(text) {
        const userMsg = text || input.trim();
        if (!userMsg || loading) return;
        setInput("");

        const newMessages = [...messages, { role: "user", content: userMsg }];
        setMessages([...newMessages, { role: "assistant", content: "", loading: true }]);
        setLoading(true);

        try {
            const res = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    max_tokens: 800,
                    temperature: 0.4,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        ...newMessages.map((m) => ({ role: m.role, content: m.content })),
                    ],
                }),
            });

            const data = await res.json();
            const reply =
                data.choices?.[0]?.message?.content ||
                "I'm unable to fetch a response right now. Please try again.";

            setMessages([...newMessages, { role: "assistant", content: reply }]);
        } catch (err) {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content:
                        "Network error — please check your connection and try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setMessages([
            {
                role: "assistant",
                content:
                    "Namaste! I'm **CABot** — your AI Chartered Accountant. Ask me anything about GST, Income Tax, MSME schemes, company compliance, or business finance.\n\nWhat can I help you with today?",
            },
        ]);
        setInput("");
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 40, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="fixed right-4 top-16 bottom-4 w-[400px] z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-cs-100 bg-white"
                        style={{ maxHeight: "calc(100vh - 80px)" }}
                    >
                        {/* Header */}
                        <div className="bg-cs-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                                    <Scale size={17} className="text-amber-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm tracking-tight">CABot</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <p className="text-cs-400 text-xs">AI Chartered Accountant</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={reset}
                                    title="New conversation"
                                    className="p-1.5 rounded-lg text-cs-400 hover:text-white hover:bg-cs-800 transition-colors"
                                >
                                    <RotateCcw size={15} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-cs-400 hover:text-white hover:bg-cs-800 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Expertise pills */}
                        <div className="bg-cs-50 border-b border-cs-100 px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
                            {["GST", "Income Tax", "MSME", "Startups", "Labour Law", "Schemes"].map((tag) => (
                                <span
                                    key={tag}
                                    className="flex-shrink-0 text-xs font-semibold bg-white border border-cs-200 text-cs-600 px-2.5 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                            {messages.map((msg, i) => (
                                <MessageBubble key={i} msg={msg} isLast={i === messages.length - 1} />
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Quick prompts — show only if 1 message (intro) */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-3 flex flex-col gap-2 flex-shrink-0">
                                <p className="text-xs font-semibold text-cs-400 uppercase tracking-wider">Quick questions</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {QUICK_PROMPTS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => sendMessage(q)}
                                            className="text-left text-xs bg-cs-50 border border-cs-100 text-cs-700 rounded-xl px-3 py-2 hover:border-cs-300 hover:bg-cs-100 transition-all leading-snug font-medium"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="border-t border-cs-100 px-4 py-3 flex items-end gap-3 flex-shrink-0">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                placeholder="Ask about GST, tax, schemes…"
                                rows={1}
                                className="flex-1 resize-none outline-none text-sm text-cs-800 placeholder:text-cs-300 bg-transparent leading-relaxed pt-0.5"
                                style={{ maxHeight: 80 }}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${input.trim() && !loading
                                    ? "bg-cs-900 text-white hover:bg-cs-700 shadow-md"
                                    : "bg-cs-100 text-cs-300 cursor-not-allowed"
                                    }`}
                            >
                                <Send size={15} />
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="px-4 pb-3 flex-shrink-0">
                            <p className="text-center text-cs-300 text-[10px]">
                                CABot provides general guidance only · Not a substitute for professional advice
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}