"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, PencilLine, Shield, Trash2, UserPlus, Users } from "lucide-react";
import { AdminUser, adminSeedUsers } from "@/lib/admin-demo-data";

const emptyUser = {
  name: "",
  email: "",
  password: "",
  role: "user" as AdminUser["role"],
  active: true,
  phone: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminSeedUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyUser);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
        const response = await fetch(`${apiBase}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (Array.isArray(payload) && payload.length > 0) {
          setUsers(payload);
        }
      } catch {
        // keep local seed data
      }
    };

    loadUsers();
  }, []);

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
      password: "",
      role: user.role,
      active: user.active,
      phone: user.phone ?? "",
    });
    setShowForm(true);
  };

  const saveUser = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        role: form.role,
        active: form.active,
        phone: form.phone,
      };

      const response = await fetch(`${apiBase}/api/users${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      const saved = await response.json();
      setUsers((current) =>
        editingId ? current.map((user) => (user.id === editingId ? saved : user)) : [saved, ...current]
      );
      setShowForm(false);
    } catch {
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
    }
  };

  const removeUser = async (id: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      await fetch(`${apiBase}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
      });
    } catch {
      // fallback local removal below
    }

    setUsers((current) => current.filter((user) => user.id !== id));
  };

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <Users className="h-4 w-4" />
              Gestion des comptes admin et editeurs
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Creez, modifiez et desactivez des utilisateurs.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Les comptes sont prepares pour un workflow role-based avec redacteurs, presentateurs et administrateurs.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white"
          >
            <UserPlus className="h-4 w-4" />
            Ajouter un utilisateur
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Comptes</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{users.length}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Comptes actifs</p>
          <div className="mt-2 text-4xl font-black text-slate-900">
            {users.filter((user) => user.active).length}
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Administrateurs</p>
          <div className="mt-2 text-4xl font-black text-slate-900">
            {users.filter((user) => user.role === "admin").length}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Registre</p>
            <h2 className="text-2xl font-bold text-slate-900">Comptes et permissions</h2>
          </div>
          <Shield className="h-5 w-5 text-sky-500" />
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4">Nom</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="bg-white">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.phone ?? "Aucun numero"}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-sky-50 px-2 py-1 text-xs uppercase tracking-[0.2em] text-sky-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-2 text-sm ${user.active ? "text-emerald-700" : "text-slate-500"}`}>
                      <BadgeCheck className="h-4 w-4" />
                      {user.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                      >
                        <PencilLine className="h-4 w-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => removeUser(user.id)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-red-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Compte</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nom complet"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="Email"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="Telephone"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              {!editingId ? (
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Mot de passe initial"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
              ) : null}
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as AdminUser["role"] }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              >
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="presenter">presenter</option>
                <option value="user">user</option>
              </select>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
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
              <button onClick={saveUser} className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white">
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
    </div>
  );
}
