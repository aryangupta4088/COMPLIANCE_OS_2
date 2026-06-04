import React from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import { Button } from "./Common";

/**
 * @param {{ name: string, specialization?: string, skills?: string[], rating?: number, projectsCompleted?: string, startingPrice?: string|number, verified?: boolean, onConnect?: Function }} props
 */
export default function FreelancerCard({
  name,
  specialization,
  skills = [],
  rating = 0,
  projectsCompleted,
  startingPrice,
  verified = false,
  onConnect,
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
      className="bg-white border border-cs-100 rounded-2xl p-5 flex flex-col"
    >
      {/* Avatar + rating */}
      <div className="flex items-start justify-between">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-cs-200 flex items-center justify-center font-bold text-cs-800 text-sm">
            {initials}
            {verified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cs-800 flex items-center justify-center">
                <CheckCircle2 size={11} className="text-cs-50" />
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-cs-500 justify-end">
            <Star size={12} />
            <span className="text-xs font-semibold">{rating}</span>
          </div>
          {projectsCompleted && (
            <p className="text-cs-400 text-xs mt-0.5">{projectsCompleted}</p>
          )}
        </div>
      </div>

      {/* Name + specialization */}
      <div className="mt-3">
        <p className="font-bold text-cs-900 text-base">{name}</p>
        {specialization && (
          <p className="text-cs-500 text-xs mt-0.5">{specialization}</p>
        )}
      </div>

      {/* Skill tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.map((s) => (
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

      {/* Price + connect */}
      <div className="flex items-end justify-between mt-auto">
        {startingPrice && (
          <div>
            <p className="text-cs-400 text-xs font-medium uppercase tracking-wider">
              Starting from
            </p>
            <p className="font-bold text-cs-800 text-lg">
              ₹{startingPrice}
            </p>
          </div>
        )}
        <Button variant="primary" size="md" onClick={onConnect}>
          Connect
        </Button>
      </div>
    </motion.div>
  );
}
