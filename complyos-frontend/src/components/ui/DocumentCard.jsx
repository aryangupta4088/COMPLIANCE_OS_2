import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { formatDate } from "../../utils/helpers";
import StatusBadge from "./StatusBadge";

export default function DocumentCard({ doc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white border border-cs-100 rounded-2xl p-5 flex items-start gap-4"
    >
      <div className="w-12 h-12 bg-cs-50 border border-cs-100 rounded-xl flex items-center justify-center text-cs-600 flex-shrink-0">
        <FileText size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-cs-900 text-sm truncate">{doc.filename}</h4>
        <p className="text-cs-400 text-xs mt-0.5 flex items-center gap-1">
          <Calendar size={10} /> {formatDate(doc.created_at)}
        </p>
        {doc.document_type && <StatusBadge status="eligible" label={doc.document_type} />}
      </div>
      <div className="flex gap-2">
        <button className="w-8 h-8 bg-cs-50 border border-cs-100 rounded-lg flex items-center justify-center text-cs-600 hover:text-cs-900">
          <Eye size={14} />
        </button>
        <button className="w-8 h-8 bg-cs-50 border border-cs-100 rounded-lg flex items-center justify-center text-cs-600 hover:text-cs-900">
          <Download size={14} />
        </button>
      </div>
    </motion.div>
  );
}
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
