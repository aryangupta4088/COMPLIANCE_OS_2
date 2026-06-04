import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Loader, CheckCircle } from "lucide-react";
import { useVEDA } from "../../hooks/useVEDA";

export function VEDAUploader({ onComplete }) {
  const { uploading, result, error, processDocument } = useVEDA();
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await processDocument(file);
    if (data) onComplete?.(data);
  };

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          uploading ? "border-cs-300 bg-cs-50" : "border-cs-200 hover:border-cs-400 bg-white"
        }`}
      >
        <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader size={28} className="text-cs-500 animate-spin" />
            <p className="text-cs-600 font-semibold text-sm">VEDA is analyzing your document...</p>
            <p className="text-cs-400 text-xs">Extracting deadlines, numbers, and key data</p>
          </div>
        ) : result ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle size={28} className="text-green-500" />
            <p className="text-cs-900 font-bold text-sm">Analysis Complete!</p>
            <p className="text-cs-500 text-xs">{result.deadlines_found} deadlines found and added to calendar</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={28} className="text-cs-400" />
            <p className="text-cs-700 font-semibold text-sm">Upload GST cert, PAN card, invoice, or any compliance doc</p>
            <p className="text-cs-400 text-xs">PDF, JPG, PNG supported • VEDA reads even handwritten documents</p>
          </div>
        )}
      </motion.div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VEDAUploader;
