"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarClock, Clock3, KeyRound, Loader2, User } from "lucide-react";
import { getApiBase } from "@/lib/api";
import JitsiMeetEmbed from "@/components/JitsiMeetEmbed";

function extractDisplayName(joinUrl: string | null): string | undefined {
  if (!joinUrl) return undefined;
  const match = joinUrl.match(/userInfo\.displayName=([^&]+)/);
  if (!match) return undefined;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return undefined;
  }
}

type PublicReunion = {
  titre: string;
  scheduledAt: string;
  status: string;
  host: string;
  roomSlug: string;
  assigned: boolean;
  started: boolean;
  joinUrl: string | null;
};

function formatDateTime(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function PublicReunionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [reunion, setReunion] = useState<PublicReunion | null>(null);
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${getApiBase()}/api/public/reunions/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (cancelled) return;
        if (!response.ok) {
          setNotFound(true);
          return;
        }
        const data: PublicReunion = await response.json();
        setReunion(data);
        if (data.joinUrl) setJoinUrl(data.joinUrl);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 8000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [slug]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const response = await fetch(`${getApiBase()}/api/public/reunions/${slug}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), name: name.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error || "Code d'accès invalide.");
        return;
      }
      setJoinUrl(data.joinUrl);
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-white/60">Chargement...</p>
      </main>
    );
  }

  if (notFound || !reunion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-center">
        <p className="text-white/70">Réunion introuvable ou lien invalide.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-neutral-950 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-xl font-bold sm:text-2xl">{reunion.titre}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="h-4 w-4" />
              {formatDateTime(reunion.scheduledAt)}
            </span>
            {reunion.host ? (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {reunion.host}
              </span>
            ) : null}
          </div>
        </div>

        {joinUrl ? (
          <div className="relative flex-1 overflow-hidden rounded-3xl bg-black" style={{ height: "70vh" }}>
            <JitsiMeetEmbed roomSlug={reunion.roomSlug} displayName={extractDisplayName(joinUrl)} />
          </div>
        ) : reunion.status === "ended" ? (
          <div className="flex flex-1 items-center justify-center" style={{ minHeight: "70vh" }}>
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-lg font-bold text-white">Cette réunion est terminée.</p>
            </div>
          </div>
        ) : reunion.assigned ? (
          <div className="flex flex-1 items-center justify-center" style={{ minHeight: "70vh" }}>
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col items-center gap-4 text-center">
              <Clock3 className="h-8 w-8 text-sky-400" />
              <div>
                <h2 className="text-lg font-bold text-white">En attente du démarrage</h2>
                <p className="mt-1 text-sm text-white/60">
                  Vous êtes autorisé à rejoindre cette réunion. Elle s&apos;ouvrira automatiquement dès que l&apos;hôte l&apos;aura démarrée.
                </p>
              </div>
              <Loader2 className="h-5 w-5 animate-spin text-white/40" />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center" style={{ minHeight: "70vh" }}>
            <form
              onSubmit={handleVerify}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Accès sur invitation</h2>
                <p className="mt-1 text-sm text-white/60">
                  Connectez-vous à votre compte si vous avez été assigné à cette réunion, ou saisissez le code d&apos;accès
                  communiqué pour y participer. Seul le code est vérifié — votre nom sert uniquement à vous identifier
                  pendant l&apos;appel.
                </p>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom (optionnel)"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white outline-none placeholder:text-white/30 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: A1B2C3"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg font-mono tracking-widest text-white outline-none placeholder:text-white/30 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={verifying}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
              >
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {verifying ? "Vérification…" : "Rejoindre la réunion"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
