"use client";

import { Settings2, ShieldAlert, Tv2 } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
          <Settings2 className="h-4 w-4" />
          Parametres globaux
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Ajustez l&apos;identite, la diffusion et les regles de l&apos;espace admin.
        </h1>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <Tv2 className="h-5 w-5 text-sky-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">Identite du site</h2>
          <p className="mt-2 text-sm text-slate-600">Logo, couleurs, bannieres et reglages de marque.</p>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <ShieldAlert className="h-5 w-5 text-sky-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">Securite</h2>
          <p className="mt-2 text-sm text-slate-600">Roles, acces admin et compte principal de connexion.</p>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <Settings2 className="h-5 w-5 text-sky-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">Diffusion</h2>
          <p className="mt-2 text-sm text-slate-600">Parametres YouTube, auto-live et calendrier editorial.</p>
        </div>
      </section>
    </div>
  );
}
