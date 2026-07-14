"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Connexion impossible");
      }

      const payload = await response.json();
      localStorage.setItem("token", payload.token);
      localStorage.setItem("admin-email", payload.user?.email ?? email);
      router.push("/admin");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Connexion au serveur impossible. Demarre XAMPP et le backend MySQL."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] px-4 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center">
        <div className="grid w-full gap-0 overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.1)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden bg-slate-950 p-8 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_34%)]" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <Image src="/images/logo.svg" alt="KNR COM & Digital" width={170} height={72} className="h-12 w-auto" />
                <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-100">
                  Acces admin
                </div>
              </div>

              <div className="mt-10 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
                  <Sparkles className="h-4 w-4" />
                  Panneau de controle KNR COM
                </div>
                <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                  Un seul espace pour gerer le live, le blog et la Web TV.
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                  Connectez-vous pour piloter les emissions, les reunions Teams, les programmes du jour et
                  les contenus publies.
                </p>
              </div>

              
            </div>
          </div>

          <div className="bg-slate-50 p-8 sm:p-10">
            <div className="mx-auto max-w-xl">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-500 font-black text-white">
                  KNR
                </div>
                <div>
                  <p className="text-sm text-slate-500">KNR COM</p>
                  <h2 className="text-2xl font-bold text-slate-900">Connexion admin</h2>
                </div>
              </div>

              {message ? (
                <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {message}
                </div>
              ) : null}

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <label className="grid gap-2 text-sm text-slate-700">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@knr.com"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-700">
                  Mot de passe
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="********"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <LockKeyhole className="h-4 w-4" />
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <Link href="/auth/forgot-password" className="transition hover:text-slate-900">
                  Mot de passe oublie
                </Link>
                
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
