"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2, Calendar, Check, Clock, Loader2, Mail, Phone, Trash2, X,
} from "lucide-react";
import { getApiBase, authHeaders } from "@/lib/api";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";

type StudioBooking = {
  id: string;
  date: string;
  heure: string;
  forfait: string;
  typeProjet: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  entreprise: string;
  description: string;
  modePaiement: string;
  reference: string;
  status: BookingStatus;
  createdAt: string;
};

const forfaitLabels: Record<string, string> = {
  demi: "Demi-journée (4h)",
  journee: "Journée complète (8h)",
  weekend: "Forfait week-end (16h)",
};

const statusStyles: Record<BookingStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "En attente", bg: "bg-amber-50", text: "text-amber-700" },
  confirmed: { label: "Confirmée", bg: "bg-emerald-50", text: "text-emerald-700" },
  rejected: { label: "Refusée", bg: "bg-red-50", text: "text-red-700" },
  cancelled: { label: "Annulée", bg: "bg-slate-100", text: "text-slate-500" },
};

function formatDateTime(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function AdminStudioPage() {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [selected, setSelected] = useState<StudioBooking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<StudioBooking | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${getApiBase()}/api/studio-bookings`, { headers: authHeaders() });
        if (response.ok) setBookings(await response.json());
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const occupiedDates = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => { if (b.status === "confirmed") set.add(b.date); });
    return set;
  }, [bookings]);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const now = new Date();
  const confirmedThisMonth = bookings.filter((b) => {
    if (b.status !== "confirmed") return false;
    const d = new Date(b.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const updateStatus = async (booking: StudioBooking, status: BookingStatus) => {
    setUpdatingId(booking.id);
    try {
      const response = await fetch(`${getApiBase()}/api/studio-bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) return;
      const updated = await response.json();
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
      setSelected((cur) => (cur?.id === booking.id ? updated : cur));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`${getApiBase()}/api/studio-bookings/${toDelete.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== toDelete.id));
        setSelected((cur) => (cur?.id === toDelete.id ? null : cur));
      }
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
          <Building2 className="h-4 w-4" />
          Studio Podcast
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Suivez les demandes de réservation du studio.
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          Validez ou refusez les demandes envoyées depuis le site public, et consultez les jours déjà occupés.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Demandes totales</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{bookings.length}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">En attente de validation</p>
          <div className="mt-2 text-4xl font-black text-amber-500">{pendingCount}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Confirmées ce mois-ci</p>
          <div className="mt-2 text-4xl font-black text-emerald-500">{confirmedThisMonth}</div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">Demandes de réservation</h2>
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "confirmed", "rejected", "cancelled"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    filter === f ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "Toutes" : statusStyles[f].label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {loading ? (
              <div className="py-10 text-center text-slate-400"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <p className="py-10 text-center text-sm italic text-slate-400">Aucune demande pour le moment.</p>
            ) : filtered.map((booking) => {
              const style = statusStyles[booking.status];
              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-sky-200"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <button onClick={() => setSelected(booking)} className="min-w-0 text-left cursor-pointer">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{booking.prenom} {booking.nom}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {booking.date}</span>
                        {booking.heure && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {booking.heure}</span>}
                        <span>{forfaitLabels[booking.forfait] ?? booking.forfait}</span>
                      </p>
                    </button>
                    <div className="flex items-center gap-1.5">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(booking, "confirmed")}
                            disabled={updatingId === booking.id}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" /> Valider
                          </button>
                          <button
                            onClick={() => updateStatus(booking, "rejected")}
                            disabled={updatingId === booking.id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" /> Refuser
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setToDelete(booking)}
                        className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AvailabilityCalendar
          reservedDates={Array.from(occupiedDates)}
          title="Occupation du studio"
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
        />
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Demande de réservation</p>
                <h3 className="text-2xl font-bold text-slate-900">{selected.prenom} {selected.nom}</h3>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[selected.status].bg} ${statusStyles[selected.status].text}`}>
                  {statusStyles[selected.status].label}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Calendar className="h-4 w-4 text-sky-500" /> {selected.date} {selected.heure && `à ${selected.heure}`}</div>
              <div className="flex items-center gap-2 text-slate-600"><Building2 className="h-4 w-4 text-sky-500" /> {forfaitLabels[selected.forfait] ?? selected.forfait} — {selected.typeProjet || "Projet non précisé"}</div>
              <div className="flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4 text-sky-500" /> {selected.email}</div>
              <div className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4 text-sky-500" /> {selected.telephone}</div>
              {selected.entreprise && <div className="text-slate-600">Entreprise : {selected.entreprise}</div>}
              {selected.description && (
                <div className="rounded-2xl bg-slate-50 p-4 text-slate-600">{selected.description}</div>
              )}
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                {selected.modePaiement && <span>Paiement : {selected.modePaiement}</span>}
                <span>Référence : {selected.reference}</span>
                <span>Reçue le {formatDateTime(selected.createdAt)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {selected.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(selected, "confirmed")}
                    disabled={updatingId === selected.id}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" /> Valider la demande
                  </button>
                  <button
                    onClick={() => updateStatus(selected, "rejected")}
                    disabled={updatingId === selected.id}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" /> Refuser
                  </button>
                </>
              )}
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Supprimer cette demande ?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Supprimer définitivement la demande de <strong>{toDelete.prenom} {toDelete.nom}</strong> ? Cette action est irréversible.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Supprimer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
