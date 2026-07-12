"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    localStorage.setItem("token", "demo-admin-token");
    localStorage.setItem("admin-email", form.email);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_36%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center">
        <div className="grid w-full gap-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-4 shadow-[0_32px_100px_rgba(0,0,0,0.3)] lg:grid-cols-[0.95fr_1.05fr] lg:p-6">
          <div className="rounded-[30px] bg-slate-950 p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
              <UserPlus className="h-4 w-4" />
              Creation de compte admin
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white">
              Ouvrez un nouveau compte pour l&apos;equipe KNR.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Creez un profil d&apos;administration pour la redaction, la technique ou la coordination.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-950/80 p-8">
            <h2 className="text-2xl font-bold text-white">Inscription</h2>
            {message ? (
              <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                {message}
              </div>
            ) : null}

            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <label className="grid gap-2 text-sm text-slate-300">
                Nom complet
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Votre nom"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="admin@knr.com"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                Mot de passe
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500"
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
                Confirmer le mot de passe
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  placeholder="••••••••"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950"
              >
                Creer le compte
              </button>
            </form>

            <div className="mt-6 text-sm text-slate-400">
              Deja un compte ?{" "}
              <Link href="/auth/login" className="transition hover:text-white">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
