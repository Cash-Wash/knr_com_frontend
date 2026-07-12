"use client";

import { useState } from "react";
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

  const handleSaveProfile = () => {
    setMessage("Profil mis a jour avec succes.");
    window.setTimeout(() => setMessage(""), 3000);
  };

  const handleChangePassword = () => {
    if (!password.current || !password.next || !password.confirm) {
      setMessage("Veuillez remplir tous les champs du mot de passe.");
      return;
    }
    if (password.next !== password.confirm) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setMessage("Mot de passe mis a jour.");
    setPassword({ current: "", next: "", confirm: "" });
    window.setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
          <UserCircle2 className="h-4 w-4" />
          Mon profil administrateur
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Configurez votre compte, votre bio et votre mot de passe.
        </h1>

        {message ? (
          <div className="mt-5 rounded-3xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
            {message}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            Nom complet
            <input
              value={profile.name}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Email
            <input
              value={profile.email}
              disabled
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400 outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Telephone
            <input
              value={profile.phone}
              onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Bio
            <textarea
              value={profile.bio}
              onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
              rows={4}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </label>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            Role courant: <span className="font-semibold text-white">{profile.role}</span>
          </div>

          <button
            onClick={handleSaveProfile}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950"
          >
            <Save className="h-4 w-4" />
            Enregistrer le profil
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Mot de passe</h2>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-300">
              Mot de passe actuel
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.current}
                  onChange={(event) => setPassword((current) => ({ ...current, current: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Nouveau mot de passe
              <input
                type={showPassword ? "text" : "password"}
                value={password.next}
                onChange={(event) => setPassword((current) => ({ ...current, next: event.target.value }))}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Confirmer le mot de passe
              <input
                type={showPassword ? "text" : "password"}
                value={password.confirm}
                onChange={(event) => setPassword((current) => ({ ...current, confirm: event.target.value }))}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
            </label>
            <button
              onClick={handleChangePassword}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white"
            >
              Mettre a jour le mot de passe
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 font-semibold text-red-100"
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </button>
      </section>
    </div>
  );
}
