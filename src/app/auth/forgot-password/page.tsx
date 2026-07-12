"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="admin-light min-h-screen px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center">
        <div className="w-full rounded-[36px] border border-white/10 bg-white/5 p-4 shadow-[0_32px_100px_rgba(0,0,0,0.3)]">
          <div className="rounded-[30px] bg-slate-950 p-8 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
              <MailCheck className="h-4 w-4" />
              Recuperation de mot de passe
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Reinitialisez l&apos;acces a votre compte admin.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Nous affichons ici un flux simple de demonstration. Branchez-le plus tard a votre backend d&apos;authentification.
            </p>

            {sent ? (
              <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                Un lien de reinitialisation a ete prepare pour {email || "votre adresse email"}.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@knr.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                />
                <button className="w-full rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950">
                  Envoyer le lien
                </button>
              </form>
            )}

            <div className="mt-6 text-sm text-slate-400">
              <Link href="/auth/login" className="transition hover:text-white">
                Retour a la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
