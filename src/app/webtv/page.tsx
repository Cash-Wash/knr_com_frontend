"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, CircleAlert, Clock3, Eye, Radio, Tv2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  adminSeedLives,
  adminSeedProgramme,
  adminSeedEmissions,
  getYoutubeEmbedUrl,
} from "@/lib/admin-demo-data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

export default function WebTVPage() {
  const live = adminSeedLives.find((item) => item.status === "live") ?? null;
  const embedUrl = live ? getYoutubeEmbedUrl(live.youtubeUrl, live.youtubeId) : null;
  const programme = adminSeedProgramme.slice().sort((left, right) => left.heure.localeCompare(right.heure));
  const recentEmissions = adminSeedEmissions;

  return (
    <>
      <Navbar />
      <main className="bg-slate-950">
        <section className="relative overflow-hidden pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(15,23,42,0.98))]" />
          <div className="relative mx-auto max-w-[1560px] px-5 pb-16 sm:px-8">
            <motion.div {...fadeUp()} className="flex flex-col gap-4 text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100">
                <Tv2 className="h-4 w-4 text-sky-400" />
                WebTV KNR COM
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                La diffusion YouTube automatique du site.
              </h1>
              <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Quand un live est actif, la page affiche directement le flux. Sinon, elle indique clairement qu&apos;aucun live n&apos;est en cours
                et met en avant le programme du jour.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <motion.div {...fadeUp(0.08)} className="rounded-[32px] border border-white/10 bg-black/30 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
                {live && embedUrl ? (
                  <>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-red-100">
                        <Radio className="h-4 w-4" />
                        En direct maintenant
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <Eye className="h-4 w-4 text-red-200" />
                        {live.viewers.toLocaleString("fr-FR")} spectateurs
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
                      <iframe
                        title={live.titre}
                        src={embedUrl}
                        className="aspect-video w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-4 rounded-[28px] border border-white/10 bg-white/5 p-5">
                      <h2 className="text-xl font-bold text-white">{live.titre}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{live.programme}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/5 px-6 py-12 text-center">
                    <CircleAlert className="h-12 w-12 text-amber-300" />
                    <h2 className="mt-4 text-2xl font-bold text-white">Aucun live en cours</h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                      La diffusion apparaitra automatiquement ici des qu&apos;un administrateur passera un live en etat &quot;live&quot; depuis
                      l&apos;espace admin.
                    </p>
                    <Link
                      href="/admin/lives"
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950"
                    >
                      Gerer le live
                    </Link>
                  </div>
                )}
              </motion.div>

              <motion.aside {...fadeUp(0.14)} className="space-y-6">
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-sky-400" />
                    <h2 className="text-xl font-bold text-white">Programme du jour</h2>
                  </div>
                  <div className="mt-5 space-y-3">
                    {programme.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-2xl border px-4 py-3 ${
                          item.statut === "en-cours"
                            ? "border-sky-400/30 bg-sky-400/10"
                            : "border-white/10 bg-black/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-sky-400" />
                            <p className="text-sm font-semibold text-white">{item.heure}</p>
                          </div>
                          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            {item.statut}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-200">{item.titre}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-bold text-white">Episodes recents</h2>
                  <div className="mt-5 space-y-3">
                    {recentEmissions.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                          <Image src={item.thumbnail} alt={item.titre} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{item.titre}</p>
                          <p className="text-xs text-slate-400">
                            {item.views} vues - {item.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
