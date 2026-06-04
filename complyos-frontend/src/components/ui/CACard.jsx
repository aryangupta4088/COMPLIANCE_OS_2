import React from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import { Avatar, Button } from "./Common";

/**
 * @param {{ name: string, specializations?: string[], rating?: number, clientCount?: string, pricePerConsultation?: string|number, verified?: boolean, isAssigned?: boolean, onBook?: Function }} props
 */
export default function CACard({
  name,
  specializations = [],
  rating = 0,
  clientCount,
  pricePerConsultation,
  verified = false,
  isAssigned = false,
  onBook,
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className={`bg-white border rounded-2xl flex flex-col ${
        isAssigned ? "border-cs-800 p-6" : "border-cs-100 p-5"
      }`}
    >
      {/* "Your CA" badge */}
      {isAssigned && (
        <span className="self-start mb-3 text-xs font-bold px-2.5 py-1 rounded-full bg-cs-800 text-cs-50 tracking-widest">
          YOUR CA
        </span>
      )}

      {/* Avatar + rating */}
      <div className="flex items-start justify-between">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-cs-200 flex items-center justify-center font-bold text-cs-800 text-sm">
            {initials}
          </div>
          {verified && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cs-800 flex items-center justify-center">
              <CheckCircle2 size={11} className="text-cs-50" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-cs-500">
          <Star size={13} />
          <span className="text-xs font-semibold text-cs-500">{rating}</span>
        </div>
      </div>

      {/* Name + client count */}
      <div className="mt-3">
        <p className="font-bold text-cs-900 text-base">{name}</p>
        {clientCount && (
          <p className="text-cs-500 text-xs mt-0.5">{clientCount}</p>
        )}
      </div>

      {/* Specialization tags */}
      {specializations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {specializations.map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-md bg-cs-100 text-cs-600 text-xs font-semibold tracking-wide"
            >
              {s}
            </span>
          ))}
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
