export function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  return { Authorization: `Bearer ${token}` };
}

export function resolveMediaUrl(value?: string | null): string {
  if (!value) return "";
  console.log("resolveMediaUrl", value, getApiBase());
  return value.startsWith("/uploads/") ? `${getApiBase()}${value}` : value;
}

export function formatRelativeDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
  if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
  if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  }
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date);
}
