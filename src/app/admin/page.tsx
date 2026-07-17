"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";
import {
  adminSeedArticles,
  adminSeedLives,
  adminSeedProgramme,
  adminSeedReunions,
  adminSeedUsers,
} from "@/lib/admin-demo-data";

const quickLinks = [
  { href: "/admin/lives", label: "Gerer le live", description: "Demarrer, arreter, planifier", icon: PlayCircle },
  { href: "/admin/reunions", label: "Lancer une reunion", description: "Equipe, ordre du jour, participants", icon: MessageCircle },
  { href: "/admin/blog", label: "Publier un article", description: "Brouillon, edition et mise en ligne", icon: FileText },
  { href: "/admin/programme", label: "Programme du jour", description: "Adapter la grille en temps reel", icon: CalendarDays },
];

export default function AdminDashboard() {
  const fallbackSummary = {
    users: adminSeedUsers.filter((user) => user.active).length,
    lives: adminSeedLives.length,
    articles: adminSeedArticles.filter((article) => article.status === "published").length,
    reunions: adminSeedReunions.length,
    liveNow: adminSeedLives.find((live) => live.status === "live") ?? adminSeedLives[0],
  };

  const [summary, setSummary] = useState(fallbackSummary);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
        const response = await fetch(`${apiBase}/api/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        setSummary((current) => ({
          users: Number(payload.users ?? current.users),
          lives: Number(payload.lives ?? current.lives),
          articles: Number(payload.articles ?? current.articles),
          reunions: Number(payload.reunions ?? current.reunions),
          liveNow: payload.liveNow ?? current.liveNow,
        }));
      } catch {
        // fallback local
      }
    };

    loadSummary();
  }, []);

  const statCards = [
    {
      label: "Utilisateurs actifs",
      value: summary.users,
      hint: "Comptes admin et redaction",
      icon: Users,
    },
    {
      label: "Lives pilotes",
      value: summary.lives,
      hint: "Diffusion YouTube et direct",
      icon: PlayCircle,
    },
    {
      label: "Articles publies",
      value: summary.articles,
      hint: "Blog et contenus d&apos;edition",
      icon: FileText,
    },
    {
      label: "Reunions du jour",
      value: summary.reunions,
      hint: "Production et coordination",
      icon: MessageCircle,
    },
  ];

  const activeLive = summary.liveNow ?? adminSeedLives[0];
  const todayProgramme = adminSeedProgramme.filter((item) => item.date === "2026-07-12");
  const activeProgramme = adminSeedProgramme.find((item) => item.statut === "en-cours");

  return (
    <div className="space-y-8 text-slate-900">
     

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <div className="mt-2 text-4xl font-black text-slate-900">{card.value}</div>
                </div>
                <div className="rounded-2xl bg-sky-50 p-3 text-sky-500">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">{card.hint}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Vue rapide</p>
              <h2 className="text-2xl font-bold text-slate-900">Actions prioritaires</h2>
            </div>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-700">
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
                  className="group rounded-[26px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-sky-500" />
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Contenu recemment prepare</p>
              <h2 className="text-2xl font-bold text-slate-900">Programme du jour</h2>
            </div>
            <CalendarDays className="h-5 w-5 text-sky-500" />
          </div>

          <div className="mt-6 space-y-3">
            {todayProgramme.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="min-w-[64px] rounded-2xl bg-sky-50 px-3 py-2 text-center text-sm font-bold text-sky-700">
                  {item.heure}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{item.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        item.statut === "en-cours"
                          ? "bg-sky-50 text-sky-700"
                          : item.statut.startsWith("pass")
                            ? "bg-slate-100 text-slate-500"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {item.statut}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
