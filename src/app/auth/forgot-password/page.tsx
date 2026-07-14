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
    <div className="min-h-screen px-4 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center">
        <div className="w-full rounded-[36px] border border-slate-200 bg-white p-4 shadow-[0_32px_100px_rgba(15,23,42,0.08)]">
          <div className="rounded-[30px] bg-slate-50 p-8 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <MailCheck className="h-4 w-4" />
              Recuperation de mot de passe
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Reinitialisez l&apos;acces a votre compte admin.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Nous affichons ici un flux simple de demonstration. Branchez-le plus tard a votre backend d&apos;authentification.
            </p>

            {sent ? (
              <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Un lien de reinitialisation a ete prepare pour {email || "votre adresse email"}.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@knr.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
                <button className="w-full rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600">
                  Envoyer le lien
                </button>
              </form>
            )}

            <div className="mt-6 text-sm text-slate-500">
              <Link href="/auth/login" className="transition hover:text-slate-900">
                Retour a la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
