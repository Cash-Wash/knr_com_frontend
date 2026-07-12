"use client";

import { Settings2, ShieldAlert, Tv2 } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
          <Settings2 className="h-4 w-4" />
          Parametres globaux
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Ajustez l&apos;identite, la diffusion et les regles de l&apos;espace admin.
        </h1>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <Tv2 className="h-5 w-5 text-sky-400" />
          <h2 className="mt-4 text-xl font-bold text-white">Identite du site</h2>
          <p className="mt-2 text-sm text-slate-300">Logo, couleurs, banneres et reglages de marque.</p>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <ShieldAlert className="h-5 w-5 text-sky-400" />
          <h2 className="mt-4 text-xl font-bold text-white">Securite</h2>
          <p className="mt-2 text-sm text-slate-300">Roles, acces admin et compte principal de connexion.</p>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <Settings2 className="h-5 w-5 text-sky-400" />
          <h2 className="mt-4 text-xl font-bold text-white">Diffusion</h2>
          <p className="mt-2 text-sm text-slate-300">Parametres YouTube, auto-live et calendrier editorial.</p>
        </div>
      </section>
    </div>
  );
}
