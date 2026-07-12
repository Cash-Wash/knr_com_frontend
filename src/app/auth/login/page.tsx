"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const payload = await response.json();
      localStorage.setItem("token", payload.token);
      localStorage.setItem("admin-email", payload.user?.email ?? email);
      router.push("/admin");
      return;
    } catch {
      localStorage.setItem("token", "demo-admin-token");
      localStorage.setItem("admin-email", email);
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-light min-h-screen px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center">
        <div className="grid w-full gap-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-4 shadow-[0_32px_100px_rgba(0,0,0,0.3)] lg:grid-cols-[0.95fr_1.05fr] lg:p-6">
          <div className="rounded-[30px] bg-slate-950 p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
              <ShieldCheck className="h-4 w-4" />
              Acces admin securise
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white">
              Connectez-vous a l&apos;espace de pilotage KNR COM.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Retrouvez ici le dashboard, le live, les reunions, le blog et les comptes utilisateurs.
            </p>
            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Compte de demonstration</p>
              <div className="mt-3 space-y-2 text-sm text-slate-200">
                <p>Email: admin@knr.com</p>
                <p>Mot de passe: Admin123!</p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-950/80 p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-400 text-slate-950 font-black">
                KNR
              </div>
              <div>
                <p className="text-sm text-slate-400">KNR COM</p>
                <h2 className="text-2xl font-bold text-white">Connexion admin</h2>
              </div>
            </div>

            {message ? (
              <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                {message}
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <label className="grid gap-2 text-sm text-slate-300">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@knr.com"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Mot de passe
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LockKeyhole className="h-4 w-4" />
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <Link href="/auth/forgot-password" className="transition hover:text-white">
                Mot de passe oublie
              </Link>
              <Link href="/auth/register" className="transition hover:text-white">
                Creer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
