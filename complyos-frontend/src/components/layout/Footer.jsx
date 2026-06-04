import React from "react";

export function Footer({ dark = false }) {
  return (
    <footer
      className={`w-full py-10 px-8 mt-16 ${
        dark ? "bg-cs-900 text-cs-400" : "bg-cs-100 text-cs-600"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="max-w-xs">
          <h3 className={`font-bold text-lg mb-2 ${dark ? "text-cs-50" : "text-cs-900"}`}>
            ComplianceOS
          </h3>
          <p className="text-sm leading-relaxed">
            Empowering enterprise teams with precision regulatory oversight and
            expert-led financial advisory services.
          </p>
          <p className="text-xs mt-3">© 2024 ComplianceOS. Regulatory Mastery.</p>
        </div>

        <div className="flex flex-wrap gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <p className={`font-semibold mb-1 ${dark ? "text-cs-200" : "text-cs-800"}`}>Legal</p>
            <a className="hover:underline cursor-pointer">Privacy Policy</a>
            <a className="hover:underline cursor-pointer">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-2">
            <p className={`font-semibold mb-1 ${dark ? "text-cs-200" : "text-cs-800"}`}>Resources</p>
            <a className="hover:underline cursor-pointer">Security Standards</a>
            <a className="hover:underline cursor-pointer">API Reference</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
