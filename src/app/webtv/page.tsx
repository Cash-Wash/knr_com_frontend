"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  Video,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { getYoutubeEmbedUrl } from "@/lib/admin-demo-data";

type Live = {
  id: string;
  titre: string;
  youtubeUrl: string;
  youtubeId?: string;
  status: string;
  viewers: number;
  startedAt?: string;
  endedAt?: string;
  programme?: string;
};

type Programme = {
  id: string;
  heure: string;
  titre: string;
  description: string;
  statut: string;
};

type Emission = {
  id: string;
  titre: string;
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
  youtubeUrl?: string;
  thumbnail?: string;
  views?: string;
  author?: string;
};

type WebTvPayload = {
  live: Live | null;
  programme: Programme[];
  emissions: Emission[];
};

function LiveBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative z-10" />
      </div>
      <span className="text-white text-xs font-bold font-['Inter'] uppercase tracking-wider">
        En direct
      </span>
    </div>
  );
}

export default function WebTVPage() {
  const [payload, setPayload] = useState<WebTvPayload>({
    live: null,
    programme: [],
    emissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedEmission, setSelectedEmission] = useState<Emission | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${base}/api/webtv/current`);

        if (!response.ok) {
          throw new Error("Impossible de charger la WebTV.");
        }

        const data = (await response.json()) as WebTvPayload;
        setPayload({
          live: data.live ?? null,
          programme: Array.isArray(data.programme) ? data.programme : [],
          emissions: Array.isArray(data.emissions) ? data.emissions : [],
        });
      } catch {
        setPayload({ live: null, programme: [], emissions: [] });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const liveEmbedUrl = useMemo(() => {
    if (!payload.live) return null;
    return getYoutubeEmbedUrl(payload.live.youtubeUrl, payload.live.youtubeId);
  }, [payload.live]);

  const selectedEmbedUrl = useMemo(() => {
    if (!selectedEmission?.youtubeUrl) return null;
    return getYoutubeEmbedUrl(selectedEmission.youtubeUrl);
  }, [selectedEmission]);

  const sortedProgramme = [...payload.programme].sort((left, right) =>
    left.heure.localeCompare(right.heure)
  );

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden bg-neutral-950">
        {/* ── HERO ── */}
        <section className="relative w-full pt-28 sm:pt-32 pb-10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-400/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-[1560px] mx-auto px-5 sm:px-8 mt-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-4 text-center mb-10"
            >
              <div className="flex items-center gap-3 px-5 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
                <LiveBadge />
                <span className="text-red-400 text-sm font-medium font-['Inter']">
                  {payload.live ? "KNR Web TV diffuse maintenant" : "KNR Web TV"}
                </span>
              </div>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] leading-tight max-w-[700px]">
                KNR Web TV <span className="text-sky-400">en ligne</span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg font-normal font-['Poppins'] max-w-[500px]">
                Suivez nos émissions en direct et ne ratez plus aucun contenu.
              </p>
            </motion.div>

            {/* ── PLAYER + PROGRAMME ── */}
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 flex flex-col gap-4 min-w-0"
              >
                {selectedEmission ? (
                  <>
                    {selectedEmbedUrl ? (
                      <VideoPlayer src={selectedEmbedUrl} title={selectedEmission.titre} />
                    ) : (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center text-gray-500">
                        Vidéo indisponible
                      </div>
                    )}
                    <div className="bg-neutral-900 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
                      <h2 className="text-white text-lg sm:text-xl font-bold font-['Poppins']">
                        {selectedEmission.titre}
                      </h2>
                      <p className="text-gray-400 text-sm font-['Inter']">
                        {(selectedEmission.views ?? "0")} vues
                        {selectedEmission.author ? ` · ${selectedEmission.author}` : ""}
                      </p>
                      <button
                        onClick={() => setSelectedEmission(null)}
                        className="flex items-center gap-2 text-sky-400 text-sm font-medium font-['Inter'] hover:text-sky-300 transition-colors w-fit cursor-pointer"
                      >
                        ← Retour au direct
                      </button>
                    </div>
                  </>
                ) : payload.live && liveEmbedUrl ? (
                  <>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-sky-400 z-10" />
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-lg">
                        <LiveBadge />
                      </div>
                      <div className="absolute top-4 right-4 z-20 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-bold text-white font-['Inter']">
                        {payload.live.viewers.toLocaleString("fr-FR")} spectateurs
                      </div>
                      <iframe
                        title={payload.live.titre}
                        src={liveEmbedUrl}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <div className="bg-neutral-900 rounded-2xl p-4 sm:p-5">
                      <h2 className="text-white text-lg sm:text-xl font-bold font-['Poppins'] mb-1">
                        {payload.live.titre}
                      </h2>
                      <p className="text-gray-400 text-sm font-['Inter']">
                        {payload.live.programme || "Diffusion en direct"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* TikTok live fallback card */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-sky-400 z-10" />
                      <div className="flex flex-col items-center gap-5 text-center px-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-pink-500 via-red-400 to-yellow-400 flex items-center justify-center">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-white" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white text-lg sm:text-xl font-bold font-['Poppins'] mb-1">
                            {loading ? "Chargement..." : "Aucun live YouTube en cours"}
                          </p>
                          <p className="text-gray-400 text-sm font-['Inter']">
                            En attendant, rejoignez-nous en direct sur TikTok
                          </p>
                        </div>
                        <a
                          href="https://www.tiktok.com/@knrcom/live"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-white text-sm font-bold font-['Poppins'] hover:scale-105 transition-transform"
                        >
                          Rejoindre le live
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Info bar */}
                    <div className="bg-neutral-900 rounded-2xl p-4 sm:p-5">
                      <h2 className="text-white text-lg sm:text-xl font-bold font-['Poppins'] mb-1">
                        KNR COM Live
                      </h2>
                      <p className="text-gray-400 text-sm font-['Inter']">
                        Émissions exclusives · Interviews · Contenus inédits
                      </p>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Programme sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full xl:w-72 flex-shrink-0"
              >
                <div className="bg-neutral-900 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <h3 className="text-white text-base font-bold font-['Poppins']">
                      Programme du jour
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {sortedProgramme.length > 0 ? (
                      sortedProgramme.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            item.statut === "en-cours"
                              ? "bg-sky-400/15 border border-sky-400/30"
                              : item.statut.startsWith("pass")
                                ? "opacity-40"
                                : "hover:bg-white/5"
                          }`}
                        >
                          <Clock
                            className={`w-3.5 h-3.5 flex-shrink-0 ${
                              item.statut === "en-cours" ? "text-sky-400" : "text-gray-500"
                            }`}
                          />
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span
                              className={`text-xs font-bold font-['Inter'] ${
                                item.statut === "en-cours" ? "text-sky-400" : "text-gray-400"
                              }`}
                            >
                              {item.heure}
                            </span>
                            <span
                              className={`text-sm font-['Poppins'] truncate ${
                                item.statut === "en-cours" ? "text-white font-bold" : "text-gray-300"
                              }`}
                            >
                              {item.titre}
                            </span>
                            {item.description ? (
                              <span className="text-xs text-gray-500 font-['Inter'] truncate">
                                {item.description}
                              </span>
                            ) : null}
                          </div>
                          {item.statut === "en-cours" && (
                            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse flex-shrink-0" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-gray-500 font-['Inter']">
                        Aucun programme publié pour le moment.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── ÉMISSIONS RÉCENTES ── */}
        <section className="w-full py-12 sm:py-16">
          <div className="max-w-[1560px] mx-auto px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-8"
            >
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-['Poppins']">
                Émissions récentes
              </h2>
              <a
                href="/emissions"
                className="flex items-center gap-1.5 text-sky-400 text-sm font-medium font-['Poppins'] hover:gap-2.5 transition-all"
              >
                Tout voir
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {payload.emissions.length > 0 ? (
                payload.emissions.map((emission, i) => (
                  <div
                    key={emission.id}
                    className="group cursor-pointer"
                    style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both` }}
                    onClick={() => setSelectedEmission(emission)}
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-video mb-3 bg-neutral-900">
                      {emission.thumbnail ? (
                        <Image
                          src={emission.thumbnail}
                          alt={emission.titre}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-gray-600">
                          <Video className="h-8 w-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sky-400/90 flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-white text-xs font-bold font-['Inter']">
                        Replay
                      </div>
                    </div>
                    <h3 className="text-white text-sm font-bold font-['Poppins'] group-hover:text-sky-400 transition-colors line-clamp-2 mb-1">
                      {emission.titre}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-['Inter']">
                      <Eye className="w-3 h-3" />
                      <span>{emission.views ?? "0"}</span>
                      {emission.author ? (
                        <>
                          <span>·</span>
                          <span>{emission.author}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-gray-500 font-['Inter'] sm:col-span-2 lg:col-span-4">
                  Aucune émission disponible pour le moment.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full px-5 sm:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-[1560px] mx-auto bg-gradient-to-r from-sky-400/20 to-sky-400/5 border border-sky-400/20 rounded-3xl p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-['Poppins']">
                Ne ratez aucune émission
              </h3>
              <p className="text-gray-400 text-sm sm:text-base font-['Inter']">
                Suivez-nous sur nos réseaux pour être alerté à chaque diffusion.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.tiktok.com/@knrcom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-white text-sm font-bold font-['Poppins'] hover:scale-105 transition-transform"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
                </svg>
                TikTok
              </a>
              <a
                href="https://www.youtube.com/@knrcom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 rounded-full text-white text-sm font-bold font-['Poppins'] hover:scale-105 transition-transform"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                YouTube
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}