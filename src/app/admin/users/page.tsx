"use client";

import { useState } from "react";
import { BadgeCheck, PencilLine, Shield, Trash2, UserPlus, Users } from "lucide-react";
import { AdminUser, adminSeedUsers } from "@/lib/admin-demo-data";

const emptyUser = {
  name: "",
  email: "",
  role: "user" as AdminUser["role"],
  active: true,
  phone: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminSeedUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyUser);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyUser);
    setShowForm(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      phone: user.phone ?? "",
    });
    setShowForm(true);
  };

  const saveUser = () => {
    const next: AdminUser = {
      id: editingId ?? `usr_${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      active: form.active,
      phone: form.phone,
    };

    if (editingId) {
      setUsers((current) => current.map((user) => (user.id === editingId ? { ...user, ...next } : user)));
    } else {
      setUsers((current) => [next, ...current]);
    }

    setShowForm(false);
  };

  const removeUser = (id: string) => {
    setUsers((current) => current.filter((user) => user.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
              <Users className="h-4 w-4" />
              Gestion des comptes admin et editeurs
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Creez, modifiez et desactivez des utilisateurs.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Les comptes sont prepares pour un workflow role-based avec redacteurs, presentateurs et administrateurs.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950"
          >
            <UserPlus className="h-4 w-4" />
            Ajouter un utilisateur
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Comptes</p>
          <div className="mt-2 text-4xl font-black text-white">{users.length}</div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Comptes actifs</p>
          <div className="mt-2 text-4xl font-black text-white">
            {users.filter((user) => user.active).length}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Administrateurs</p>
          <div className="mt-2 text-4xl font-black text-white">
            {users.filter((user) => user.role === "admin").length}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Registre</p>
            <h2 className="text-2xl font-bold text-white">Comptes et permissions</h2>
          </div>
          <Shield className="h-5 w-5 text-sky-400" />
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-5 py-4">Nom</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.id} className="bg-white/3">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.phone ?? "Aucun numero"}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-sky-400/15 px-2 py-1 text-xs uppercase tracking-[0.2em] text-sky-100">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-2 text-sm ${user.active ? "text-emerald-200" : "text-slate-400"}`}>
                      <BadgeCheck className="h-4 w-4" />
                      {user.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                      >
                        <PencilLine className="h-4 w-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => removeUser(user.id)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Compte</p>
                <h3 className="text-2xl font-bold text-white">
                  {editingId ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nom complet"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="Email"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="Telephone"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as AdminUser["role"] }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              >
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="presenter">presenter</option>
                <option value="user">user</option>
              </select>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
                  className="h-4 w-4"
                />
                Compte actif
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={saveUser} className="rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950">
                Enregistrer
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
