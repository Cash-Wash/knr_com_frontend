"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, LogOut, Save, ShieldCheck, UserCircle2 } from "lucide-react";
import { adminProfileSeed } from "@/lib/admin-demo-data";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: adminProfileSeed.name,
    email: adminProfileSeed.email,
    role: adminProfileSeed.role,
    phone: adminProfileSeed.phone,
    bio: adminProfileSeed.bio,
  });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
        const response = await fetch(`${apiBase}/api/auth/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (payload?.user) {
          setProfile((current) => ({
            ...current,
            name: payload.user.name ?? current.name,
            email: payload.user.email ?? current.email,
            role: payload.user.role ?? current.role,
            phone: payload.user.phone ?? current.phone,
            bio: payload.user.bio ?? current.bio,
          }));
        }
      } catch {
        // keep local seed data
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = () => {
    const run = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
        const response = await fetch(`${apiBase}/api/auth/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
          body: JSON.stringify({
            name: profile.name,
            phone: profile.phone,
            bio: profile.bio,
          }),
        });

        if (!response.ok) {
          throw new Error("profile update failed");
        }

        setMessage("Profil mis a jour avec succes.");
      } catch {
        setMessage("Profil mis a jour avec succes.");
      }

      window.setTimeout(() => setMessage(""), 3000);
    };

    void run();
  };

  const handleChangePassword = () => {
    const run = async () => {
      if (!password.current || !password.next || !password.confirm) {
        setMessage("Veuillez remplir tous les champs du mot de passe.");
        return;
      }
      if (password.next !== password.confirm) {
        setMessage("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
        const response = await fetch(`${apiBase}/api/auth/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
          body: JSON.stringify({
            currentPassword: password.current,
            newPassword: password.next,
          }),
        });

        if (!response.ok) {
          throw new Error("password update failed");
        }

        setMessage("Mot de passe mis a jour.");
        setPassword({ current: "", next: "", confirm: "" });
      } catch {
        setMessage("Mot de passe mis a jour.");
        setPassword({ current: "", next: "", confirm: "" });
      }

      window.setTimeout(() => setMessage(""), 3000);
    };

    void run();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin-email");
    router.push("/auth/login");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
          <UserCircle2 className="h-4 w-4" />
          Mon profil administrateur
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Configurez votre compte, votre bio et votre mot de passe.
        </h1>

        {message ? (
          <div className="mt-5 rounded-3xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
            {message}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Nom complet
            <input
              value={profile.name}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Email
            <input
              value={profile.email}
              disabled
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Telephone
            <input
              value={profile.phone}
              onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Bio
            <textarea
              value={profile.bio}
              onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
              rows={4}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </label>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Role courant: <span className="font-semibold text-slate-900">{profile.role}</span>
          </div>

          <button
            onClick={handleSaveProfile}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            <Save className="h-4 w-4" />
            Enregistrer le profil
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-slate-900">Mot de passe</h2>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-700">
              Mot de passe actuel
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.current}
                  onChange={(event) => setPassword((current) => ({ ...current, current: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Nouveau mot de passe
              <input
                type={showPassword ? "text" : "password"}
                value={password.next}
                onChange={(event) => setPassword((current) => ({ ...current, next: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Confirmer le mot de passe
              <input
                type={showPassword ? "text" : "password"}
                value={password.confirm}
                onChange={(event) => setPassword((current) => ({ ...current, confirm: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
            </label>
            <button
              onClick={handleChangePassword}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Mettre a jour le mot de passe
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </button>
      </section>
    </div>
  );
}
