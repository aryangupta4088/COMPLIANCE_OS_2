import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";

/* ─── Button ─────────────────────────────────────────────────── */

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cs-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

const buttonVariants = {
  primary:   "bg-cs-800 text-cs-50 hover:bg-cs-900",
  secondary: "bg-cs-100 text-cs-800 hover:bg-cs-200",
  outline:   "border border-cs-200 text-cs-700 hover:bg-cs-100 bg-white",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

/**
 * @param {{ variant?: 'primary'|'secondary'|'outline', size?: 'sm'|'md'|'lg', loading?: boolean, disabled?: boolean, onClick?: Function, children: React.ReactNode, className?: string }} props
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
  ...rest
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </motion.button>
  );
}

/* ─── Badge ──────────────────────────────────────────────────── */

const badgeColors = {
  green: "bg-cs-100 text-cs-700",
  amber: "bg-cs-200 text-cs-800",
  red:   "bg-cs-900 text-cs-50",
  blue:  "bg-cs-200 text-cs-800",
  gray:  "bg-cs-100 text-cs-500",
  dark:  "bg-cs-800 text-cs-50",
};

/**
 * @param {{ label: string, color?: 'green'|'amber'|'red'|'blue'|'gray'|'dark' }} props
 */
export function Badge({ label, color = "gray" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badgeColors[color]}`}
    >
      {label}
    </span>
  );
}

/* ─── Spinner ────────────────────────────────────────────────── */

/**
 * @param {{ size?: number, className?: string }} props
 */
export function Spinner({ size = 20, className = "" }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-cs-500 ${className}`}
    />
  );
}

/* ─── EmptyState ─────────────────────────────────────────────── */

/**
 * @param {{ icon: React.ReactNode, title: string, subtitle?: string, action?: React.ReactNode }} props
 */
export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-cs-100 flex items-center justify-center text-cs-400">
        {icon}
      </div>
      <div>
        <p className="text-cs-900 font-semibold text-base">{title}</p>
        {subtitle && <p className="text-cs-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────── */

/**
 * @param {{ label?: string }} props
 */
export function Divider({ label }) {
  if (!label) {
    return <hr className="border-cs-100 my-4" />;
  }
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="flex-1 h-px bg-cs-100" />
      <span className="text-cs-400 text-xs font-semibold tracking-widest uppercase">
        {label}
      </span>
      <span className="flex-1 h-px bg-cs-100" />
    </div>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */

const avatarSizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
};

/**
 * @param {{ name: string, size?: 'sm'|'md'|'lg', image?: string, className?: string }} props
 */
export function Avatar({ name = "", size = "md", image, className = "" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`rounded-full bg-cs-200 text-cs-800 font-bold flex items-center justify-center flex-shrink-0 overflow-hidden ${avatarSizes[size]} ${className}`}
    >
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

/* ─── Tooltip ────────────────────────────────────────────────── */

/**
 * @param {{ children: React.ReactNode, text: string }} props
 */
export function Tooltip({ children, text }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-cs-900 text-cs-50 text-xs whitespace-nowrap z-50 pointer-events-none"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ─── Modal ──────────────────────────────────────────────────── */

/**
 * @param {{ isOpen: boolean, onClose: Function, title?: string, children: React.ReactNode }} props
 */
export function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-cs-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 z-10"
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center justify-between mb-5">
              {title && (
                <h2 className="text-cs-900 font-bold text-lg">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg hover:bg-cs-100 text-cs-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
