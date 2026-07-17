"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle, CalendarClock, Copy, KeyRound, Link2, MessageCircle,
  PencilLine, Plus, PlayCircle, Trash2, UserCheck, Users, Video, X,
} from "lucide-react";
import { AdminReunion, AdminUser, adminSeedReunions, formatDateTime } from "@/lib/admin-demo-data";
import { getApiBase, authHeaders } from "@/lib/api";
import JitsiMeetEmbed from "@/components/JitsiMeetEmbed";

const emptyReunion = {
  titre: "",
  description: "",
  scheduledAt: "",
  assignedUserIds: [] as string[],
};

export default function AdminReunionsPage() {
  const [reunions, setReunions] = useState<AdminReunion[]>(adminSeedReunions);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyReunion);
  const [joiningReunion, setJoiningReunion] = useState<AdminReunion | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const userName = (id: string) => users.find((u) => u.id === id)?.name ?? id;

  const copyInviteLink = async (reunion: AdminReunion) => {
    if (!reunion.roomSlug) return;
    const url = `${window.location.origin}/reunion/${reunion.roomSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(reunion.id);
      setTimeout(() => setCopiedId((current) => (current === reunion.id ? null : current)), 2500);
    } catch {
      // clipboard unavailable, silently ignore
    }
  };

  const copyAccessCode = async (reunion: AdminReunion) => {
    if (!reunion.accessCode) return;
    try {
      await navigator.clipboard.writeText(reunion.accessCode);
      setCopiedCodeId(reunion.id);
      setTimeout(() => setCopiedCodeId((current) => (current === reunion.id ? null : current)), 2500);
    } catch {
      // clipboard unavailable, silently ignore
    }
  };

  useEffect(() => {
    const loadReunions = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/reunions`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        if (Array.isArray(payload)) setReunions(payload);
      } catch {
        // keep local seed data
      }
    };
    const loadUsers = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/users`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        if (Array.isArray(payload)) setUsers(payload);
      } catch {
        // keep empty, multi-select will just be empty
      }
    };

    loadReunions();
    loadUsers();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyReunion);
    setActionError(null);
    setShowForm(true);
  };

  const openEdit = (reunion: AdminReunion) => {
    setEditingId(reunion.id);
    setForm({
      titre: reunion.titre,
      description: reunion.description,
      scheduledAt: reunion.scheduledAt.slice(0, 16),
      assignedUserIds: reunion.assignedUserIds ?? [],
    });
    setActionError(null);
    setShowForm(true);
  };

  const toggleAssignedUser = (userId: string) => {
    setForm((current) => ({
      ...current,
      assignedUserIds: current.assignedUserIds.includes(userId)
        ? current.assignedUserIds.filter((id) => id !== userId)
        : [...current.assignedUserIds, userId],
    }));
  };

  const saveReunion = async () => {
    setActionError(null);
    try {
      const response = await fetch(`${getApiBase()}/api/reunions${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          titre: form.titre,
          description: form.description,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          assignedUserIds: form.assignedUserIds,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setActionError(payload?.error || "Échec de l'enregistrement.");
        return;
      }

      const saved = await response.json();
      setReunions((current) =>
        editingId ? current.map((item) => (item.id === editingId ? saved : item)) : [saved, ...current]
      );
      setShowForm(false);
    } catch {
      setActionError("Impossible de contacter le serveur.");
    }
  };

  const setStatus = async (id: string, status: AdminReunion["status"]) => {
    setActionError(null);
    try {
      const response = await fetch(`${getApiBase()}/api/reunions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        setActionError("Échec de la mise à jour du statut.");
        return;
      }
      const updated = await response.json();
      setReunions((current) => current.map((item) => (item.id === id ? updated : item)));
    } catch {
      setActionError("Impossible de contacter le serveur.");
    }
  };

  const removeReunion = async (id: string) => {
    try {
      const response = await fetch(`${getApiBase()}/api/reunions/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) {
        setActionError("Échec de la suppression.");
        return;
      }
      setReunions((current) => current.filter((item) => item.id !== id));
    } catch {
      setActionError("Impossible de contacter le serveur.");
    }
  };

  const totalAssigned = reunions.reduce((count, item) => count + (item.assignedUserIds?.length ?? 0), 0);

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <MessageCircle className="h-4 w-4" />
              Reunions admin, pas sur la page publique
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Ordonnez les reunions de production et les points editoriaux.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Seuls les utilisateurs assignés peuvent voir et rejoindre une réunion depuis leur compte. Les autres ont besoin
              du lien et du code d&apos;accès.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            Nouvelle reunion
          </button>
        </div>
      </section>

      {actionError ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Reunions totales</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{reunions.length}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">En cours</p>
          <div className="mt-2 text-4xl font-black text-slate-900">
            {reunions.filter((item) => item.status === "in-progress").length}
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Utilisateurs assignés (total)</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{totalAssigned}</div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Planning</p>
            <h2 className="text-2xl font-bold text-slate-900">Reunions programmees</h2>
          </div>
          <CalendarClock className="h-5 w-5 text-sky-500" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {reunions.map((reunion) => (
            <div key={reunion.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{reunion.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        reunion.status === "in-progress"
                          ? "bg-sky-50 text-sky-700"
                          : reunion.status === "ended"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {reunion.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{reunion.description}</p>
                  <p className="mt-2 text-xs text-slate-500">Debut: {formatDateTime(reunion.scheduledAt)}</p>
                  <p className="mt-1 text-xs text-slate-500">Responsable: {reunion.host}</p>
                </div>
                <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
                  {reunion.assignedUserIds?.length ?? 0} assigné{(reunion.assignedUserIds?.length ?? 0) !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                {reunion.assignedUserIds && reunion.assignedUserIds.length > 0 ? (
                  <span>{reunion.assignedUserIds.map((id) => userName(id)).join(", ")}</span>
                ) : (
                  <span className="italic text-slate-400">Aucun utilisateur assigné — accès uniquement par code.</span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => setJoiningReunion(reunion)}
                  disabled={!reunion.joinUrl}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Video className="h-4 w-4" />
                  Rejoindre l&apos;appel
                </button>
                <button
                  onClick={() => copyInviteLink(reunion)}
                  disabled={!reunion.roomSlug}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copiedId === reunion.id ? <Link2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  {copiedId === reunion.id ? "Lien copié !" : "Copier le lien d'invitation"}
                </button>
                {reunion.accessCode ? (
                  <button
                    onClick={() => copyAccessCode(reunion)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                  >
                    <KeyRound className="h-4 w-4" />
                    {copiedCodeId === reunion.id ? "Code copié !" : `Code : ${reunion.accessCode}`}
                  </button>
                ) : null}
                {reunion.status !== "in-progress" && (
                  <button
                    onClick={() => setStatus(reunion.id, "in-progress")}
                    disabled={reunion.status === "ended"}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Demarrer
                  </button>
                )}
                {reunion.status !== "ended" && (
                  <button
                    onClick={() => setStatus(reunion.id, "ended")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    Terminer
                  </button>
                )}
                <button
                  onClick={() => openEdit(reunion)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <PencilLine className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => removeReunion(reunion.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Preparation</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Modifier la reunion" : "Nouvelle reunion"}
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
              >
                Fermer
              </button>
            </div>

            {actionError ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {actionError}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4">
              <input
                value={form.titre}
                onChange={(event) => setForm((current) => ({ ...current, titre: event.target.value }))}
                placeholder="Titre"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <p className="text-xs text-slate-500">
                Vous serez automatiquement le responsable de cette réunion.
              </p>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Utilisateurs assignés (accès direct depuis leur compte)
                </p>

                {form.assignedUserIds.length === 0 ? (
                  <p className="mt-2 text-sm italic text-slate-400">Aucun utilisateur assigné pour l&apos;instant.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.assignedUserIds.map((id) => (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-semibold text-sky-700"
                      >
                        {userName(id)}
                        <button
                          type="button"
                          onClick={() => toggleAssignedUser(id)}
                          title="Retirer"
                          className="rounded-full text-sky-400 hover:text-sky-700 transition cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ajouter un utilisateur
                </p>
                {users.length === 0 ? (
                  <p className="mt-2 text-sm italic text-slate-400">
                    Aucun utilisateur trouvé — vérifiez qu&apos;il existe des comptes dans Utilisateurs, et que le serveur a
                    bien redémarré après une mise à jour.
                  </p>
                ) : users.every((u) => form.assignedUserIds.includes(u.id)) ? (
                  <p className="mt-2 text-sm italic text-slate-400">Tous les utilisateurs sont déjà assignés.</p>
                ) : (
                  <div className="mt-2 flex max-h-40 flex-col gap-1 overflow-y-auto">
                    {users
                      .filter((user) => !form.assignedUserIds.includes(user.id))
                      .map((user) => (
                        <button
                          type="button"
                          key={user.id}
                          onClick={() => toggleAssignedUser(user.id)}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                        >
                          <span className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-slate-400">{user.email}</span>
                          </span>
                          <UserCheck className="h-4 w-4 text-slate-300" />
                        </button>
                      ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  Les personnes non assignées pourront tout de même rejoindre avec le lien et le code d&apos;accès.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={saveReunion} className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white">
                Enregistrer
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {joiningReunion ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 p-4">
          <div className="flex items-center justify-between gap-4 pb-3">
            <div className="min-w-0 text-white">
              <p className="text-sm text-white/60">Appel en cours</p>
              <h3 className="truncate text-xl font-bold">{joiningReunion.titre}</h3>
            </div>
            <button
              onClick={() => setJoiningReunion(null)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
              Fermer
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-[24px] bg-black" style={{ height: "70vh" }}>
            {joiningReunion.roomSlug ? (
              <JitsiMeetEmbed roomSlug={joiningReunion.roomSlug} />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
