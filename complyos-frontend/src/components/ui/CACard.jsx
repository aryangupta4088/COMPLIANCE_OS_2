import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Clock } from "lucide-react";

export default function CACard({ ca, onBook }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(21,27,30,0.10)" }}
      className="bg-white border border-cs-100 rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-cs-200 flex items-center justify-center font-bold text-cs-800 text-xl flex-shrink-0">
          {ca.name?.split(" ").map(w => w[0]).join("").slice(0,2)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-cs-900">{ca.name}</h3>
          <p className="text-cs-500 text-xs">{ca.firm_name}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-cs-700 text-xs font-bold">{ca.rating}</span>
            <span className="text-cs-400 text-xs">({ca.reviews_count} reviews)</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(ca.specializations || []).slice(0,3).map(s => (
          <span key={s} className="bg-cs-50 border border-cs-100 text-cs-600 text-xs px-2 py-0.5 rounded-full font-medium">{s}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-cs-500">
        <span className="flex items-center gap-1"><MapPin size={11} /> {(ca.states_covered || [])[0]}</span>
        <span className="flex items-center gap-1"><Clock size={11} /> Response: 2h</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-cs-900 font-bold">₹{ca.consultation_fee}/hr</span>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onBook?.(ca)}
          className="bg-cs-800 text-cs-50 px-5 py-2 rounded-xl text-sm font-semibold"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
}
        </div>
      )}

      <hr className="border-cs-100 my-3" />

      {/* Price + availability */}
      <div className="flex items-center justify-between mb-3">
        {pricePerConsultation && (
          <p className="font-bold text-cs-700 text-sm">
            {pricePerConsultation}
            <span className="font-normal text-cs-400 text-xs">/hr</span>
          </p>
        )}
      </div>

      {/* Book button */}
      <Button variant="primary" size="md" onClick={onBook} className="w-full mt-auto">
        Book Now
      </Button>
    </motion.div>
  );
}
