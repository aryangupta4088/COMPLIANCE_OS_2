import { useState } from "react";
import { apiFetch } from "../services/api";

export function useSCOUT() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/schemes/recommended");
      setSchemes(data.schemes || []);
    } catch (e) {
      setError("Could not load schemes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyForScheme = async (schemeName) => {
    try {
      await apiFetch(`/api/schemes/apply/${encodeURIComponent(schemeName)}`, { method: "POST" });
      return true;
    } catch {
      return false;
    }
  };

  return { schemes, loading, error, fetchSchemes, applyForScheme };
}
