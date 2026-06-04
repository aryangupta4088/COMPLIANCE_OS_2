import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Image, File, MoreVertical, Eye, Trash2 } from "lucide-react";

const typeIcons = {
  pdf:   FileText,
  image: Image,
  png:   Image,
  jpg:   Image,
  jpeg:  Image,
};

const statusConfig = {
  verified:   { label: "VERIFIED",   classes: "bg-cs-100 text-cs-700" },
  processing: { label: "PROCESSING", classes: "bg-cs-200 text-cs-700" },
  pending:    { label: "PENDING",    classes: "bg-cs-100 text-cs-400" },
};

/**
 * @param {{ filename: string, documentType?: string, status: 'pending'|'processing'|'verified', uploadedAt?: string, onView?: Function, onDelete?: Function }} props
 */
export default function DocumentCard({
  filename,
  documentType,
  status = "pending",
  uploadedAt,
  onView,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ext = filename?.split(".").pop()?.toLowerCase();
  const Icon = typeIcons[ext] ?? File;
  const st = statusConfig[status] ?? statusConfig.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-cs-100 rounded-xl p-4 flex items-center gap-3 relative"
    >
      {/* File icon */}
      <div className="w-10 h-10 rounded-full bg-cs-100 flex items-center justify-center text-cs-500 flex-shrink-0">
        <Icon size={18} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-cs-900 text-sm truncate">{filename}</p>
        {documentType && (
          <p className="text-cs-500 text-xs mt-0.5">{documentType}</p>
        )}
        {uploadedAt && (
          <p className="text-cs-400 text-xs mt-0.5">{uploadedAt}</p>
        )}
      </div>

      {/* Status badge */}
      <span
        className={`text-xs font-bold px-2.5 py-1 rounded-full tracking-wide flex-shrink-0 ${st.classes} ${
          status === "processing" ? "animate-pulse" : ""
        }`}
      >
        {st.label}
      </span>

      {/* 3-dot menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="p-1 rounded-lg hover:bg-cs-100 text-cs-400 transition-colors"
        >
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-0 top-8 bg-white border border-cs-100 rounded-xl shadow-lg z-20 py-1 min-w-[120px]"
          >
            <button
              onClick={() => { setMenuOpen(false); onView?.(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-cs-700 text-sm hover:bg-cs-50 transition-colors"
            >
              <Eye size={14} /> View
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDelete?.(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-cs-900 text-sm hover:bg-cs-100 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
