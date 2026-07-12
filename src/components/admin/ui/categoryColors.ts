const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Technologie: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  Entrepreneuriat: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  Business: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  Culture: { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe" },
  Société: { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
  Sport: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  Marketing: { bg: "#fdf2f8", text: "#a21caf", border: "#fbcfe8" },
  Audiovisuel: { bg: "#eef2ff", text: "#4338ca", border: "#c7d2fe" },
  Média: { bg: "#f0fdfa", text: "#0f766e", border: "#99f6e4" },
  Drones: { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" },
  Caméras: { bg: "#fff1f2", text: "#be123c", border: "#fecdd3" },
  Micros: { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  Éclairages: { bg: "#fefce8", text: "#ca8a04", border: "#fef08a" },
};

export function catStyle(name?: string | null) {
  return CAT_COLORS[name ?? ""] ?? { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" };
}
