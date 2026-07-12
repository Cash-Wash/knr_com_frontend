"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  FileText,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Users,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import {
  adminSeedArticles,
  adminSeedLives,
  adminSeedProgramme,
  adminSeedReunions,
  adminSeedUsers,
} from "@/lib/admin-demo-data";

const statCards = [
  {
    label: "Utilisateurs actifs",
    value: adminSeedUsers.filter((user) => user.active).length,
    hint: "Comptes admin et redaction",
    icon: Users,
  },
  {
    label: "Lives pilotes",
    value: adminSeedLives.length,
    hint: "Diffusion YouTube et direct",
    icon: PlayCircle,
  },
  {
    label: "Articles publies",
    value: adminSeedArticles.filter((article) => article.status === "published").length,
    hint: "Blog et contenus d&apos;edition",
    icon: FileText,
  },
  {
    label: "Reunions du jour",
    value: adminSeedReunions.length,
    hint: "Production et coordination",
    icon: MessageCircle,
  },
];

const quickLinks = [
  { href: "/admin/lives", label: "Gerer le live", description: "Demarrer, arreter, planifier", icon: PlayCircle },
  { href: "/admin/reunions", label: "Lancer une reunion", description: "Equipe, ordre du jour, participants", icon: MessageCircle },
  { href: "/admin/blog", label: "Publier un article", description: "Brouillon, edition et mise en ligne", icon: FileText },
  { href: "/admin/programme", label: "Programme du jour", description: "Adapter la grille en temps reel", icon: CalendarDays },
];

export default function AdminDashboard() {
  const activeLive = adminSeedLives.find((live) => live.status === "live") ?? adminSeedLives[0];
  const todayProgramme = adminSeedProgramme.filter((item) => item.date === "2026-07-12");
  const activeProgramme = adminSeedProgramme.find((item) => item.statut === "en-cours");

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
            <ShieldCheck className="h-4 w-4" />
            Espace admin personnalise pour KNR COM
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Pilotez les lives, la redaction et la diffusion avec une interface claire.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Cette version donne a l&apos;equipe admin un centre de controle unique pour la Web TV,
            les reunions, les utilisateurs, le blog et le programme du jour.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/lives"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Ouvrir le live
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/profile"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Modifier le profil
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Etat actuel</p>
              <h2 className="mt-1 text-xl font-bold text-white">Live et programme</h2>
            </div>
            <TrendingUp className="h-5 w-5 text-sky-400" />
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-red-200">Live en cours</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{activeLive.titre}</h3>
              <p className="mt-1 text-sm text-slate-300">{activeLive.programme}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-200">
                <Eye className="h-4 w-4 text-red-300" />
                {activeLive.viewers.toLocaleString("fr-FR")} spectateurs
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Programme en cours</p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {activeProgramme?.titre ?? "Aucun element actif"}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                {activeProgramme?.description ?? "Planifiez ou modifiez le programme depuis l&apos;espace admin."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <div className="mt-2 text-4xl font-black text-white">{card.value}</div>
                </div>
                <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">{card.hint}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Vue rapide</p>
              <h2 className="text-2xl font-bold text-white">Actions prioritaires</h2>
            </div>
            <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs text-sky-100">
              Edition rapide
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[26px] border border-white/10 bg-slate-950/50 p-5 transition hover:-translate-y-1 hover:border-sky-400/30 hover:bg-slate-900/70"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-sky-400" />
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Contenu recemment prepare</p>
              <h2 className="text-2xl font-bold text-white">Programme du jour</h2>
            </div>
            <CalendarDays className="h-5 w-5 text-sky-400" />
          </div>

          <div className="mt-6 space-y-3">
            {todayProgramme.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="min-w-[64px] rounded-2xl bg-sky-400/10 px-3 py-2 text-center text-sm font-bold text-sky-100">
                  {item.heure}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{item.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        item.statut === "en-cours"
                          ? "bg-sky-400/15 text-sky-200"
                          : item.statut === "passé"
                          ? "bg-white/8 text-slate-400"
                          : "bg-emerald-400/15 text-emerald-200"
                      }`}
                    >
                      {item.statut}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
