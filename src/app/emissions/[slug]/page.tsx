"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { getApiBase, resolveMediaUrl, formatRelativeDate } from "@/lib/api";

type Emission = {
  slug: string;
  categorie: string;
  titre: string;
  sousTitre: string;
  description: string;
  episodes: number;
  duree: string;
  thumbnail: string;
  youtubeUrl: string;
  animateur: string;
  tags: string[];
};

type Episode = {
  id: string;
  emissionId: string;
  titre: string | null;
  youtubeUrl: string;
  createdAt: string;
};

type MotionDivProps = import("framer-motion").MotionProps & { className?: string; style?: React.CSSProperties };
const fadeUp = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

export default function EmissionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [emission, setEmission] = useState<Emission | null>(null);
  const [autresEmissions, setAutresEmissions] = useState<Emission[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const base = getApiBase();
        const [detailRes, listRes, episodesRes] = await Promise.all([
          fetch(`${base}/api/public/emissions/${slug}`),
          fetch(`${base}/api/public/emissions`),
          fetch(`${base}/api/public/emissions/${slug}/episodes`),
        ]);
        setEmission(detailRes.ok ? await detailRes.json() : null);
        if (listRes.ok) {
          const list = await listRes.json();
          if (Array.isArray(list)) setAutresEmissions(list.filter((e: Emission) => e.slug !== slug).slice(0, 3));
        }
        if (episodesRes.ok) {
          const list = await episodesRes.json();
          if (Array.isArray(list)) {
            setEpisodes(list);
            setSelectedEpisodeId(list[0]?.id ?? null);
          }
        }
      } catch {
        setEmission(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const selectedEpisode = episodes.find((e) => e.id === selectedEpisodeId) ?? episodes[0] ?? null;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-xl font-['Poppins']">Chargement...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!emission) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-500 text-xl font-['Poppins'] mb-4">Émission introuvable.</p>
            <Link href="/emissions" className="text-sky-400 underline font-['Poppins']">Retour aux émissions</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden bg-gray-50">

        {/* HERO */}
        <section className="relative w-full min-h-[280px] overflow-hidden">
          <Image src={resolveMediaUrl(emission.thumbnail) || "/images/webtv1.png"} alt={emission.titre} fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" />
          <div className="relative z-10 w-full max-w-[1560px] mx-auto px-5 sm:px-8 pt-36 pb-14">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Link href="/emissions" className="flex items-center gap-2 text-white text-base font-medium font-['Poppins'] underline hover:text-sky-400 transition-colors w-fit mb-6">
                <ArrowLeft className="w-5 h-5" /> Retour aux émissions
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-3 max-w-[700px]">
              <span className="inline-flex px-4 py-1.5 bg-sky-400 rounded-full text-white text-sm font-bold font-['Inter'] w-fit">
                {emission.categorie}
              </span>
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Poppins']">{emission.titre}</h1>
              <p className="text-gray-300 text-lg font-normal font-['Poppins']">{emission.sousTitre}</p>
            </motion.div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="w-full max-w-[1560px] mx-auto px-5 sm:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* LEFT — Player + description */}
            <div className="flex-1 flex flex-col gap-8 min-w-0">

              {/* Video player */}
              <motion.div {...fadeUp()}>
                <VideoPlayer src={selectedEpisode?.youtubeUrl ?? emission.youtubeUrl} poster={resolveMediaUrl(emission.thumbnail)} title={selectedEpisode?.titre || emission.titre} />
              </motion.div>

              {/* Meta */}
              <motion.div {...fadeUp(0.1)} className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span className="text-gray-600 text-sm font-['Poppins']">{emission.duree} / épisode</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-400" />
                  <span className="text-gray-600 text-sm font-['Poppins']">{emission.animateur}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sky-400" />
                  <div className="flex flex-wrap gap-2">
                    {emission.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-sky-50 text-sky-600 text-xs font-bold font-['Inter'] rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div {...fadeUp(0.15)} className="flex flex-col gap-4">
                <h2 className="text-gray-900 text-2xl font-bold font-['Poppins']">À propos de cette émission</h2>
                <p className="text-gray-600 text-base md:text-lg font-normal font-['Poppins'] leading-7">{emission.description}</p>
              </motion.div>

              {/* Episodes précédents */}
              {episodes.length > 0 && (
                <motion.div {...fadeUp(0.2)} className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-sky-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold font-['Sora']">{emission.episodes}</span>
                    </div>
                    <div>
                      <p className="text-gray-900 text-base font-bold font-['Poppins']">épisodes disponibles</p>
                      <p className="text-gray-500 text-sm font-['Poppins']">Nouveaux épisodes chaque semaine</p>
                    </div>
                  </div>

                  {episodes.length > 1 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-gray-900 text-lg font-bold font-['Poppins']">Épisodes précédents</h3>
                      <div className="flex flex-col gap-2">
                        {episodes.map((ep, i) => (
                          <button
                            key={ep.id}
                            type="button"
                            onClick={() => setSelectedEpisodeId(ep.id)}
                            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition cursor-pointer ${
                              ep.id === selectedEpisode?.id
                                ? "border-sky-400 bg-sky-50"
                                : "border-gray-100 bg-white hover:border-sky-200 hover:bg-sky-50/40"
                            }`}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-400/10 text-sky-500 text-sm font-bold font-['Sora']">
                              {episodes.length - i}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold font-['Poppins'] text-gray-900">
                                {ep.titre || `Épisode ${episodes.length - i}`}
                              </p>
                              <p className="text-xs text-gray-500 font-['Poppins']">{formatRelativeDate(ep.createdAt)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* RIGHT — Autres émissions */}
            <motion.div {...fadeUp(0.1)} className="w-full lg:w-[340px] lg:sticky lg:top-32 flex-shrink-0 flex flex-col gap-5">
              <h3 className="text-gray-900 text-xl font-bold font-['Poppins']">Autres émissions</h3>
              <div className="flex flex-col gap-4">
                {autresEmissions.map((e, i) => (
                  <motion.div key={e.slug} {...fadeUp(i * 0.08)}>
                    <Link href={`/emissions/${e.slug}`}
                      className="flex gap-4 p-3 bg-white rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all group">
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={resolveMediaUrl(e.thumbnail) || "/images/webtv1.png"} alt={e.titre} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-3 h-3 fill-white text-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <p className="text-gray-900 text-sm font-bold font-['Poppins'] truncate">{e.titre}</p>
                        <p className="text-gray-500 text-xs font-['Poppins'] truncate">{e.sousTitre}</p>
                        <p className="text-sky-400 text-xs font-medium font-['Poppins']">{e.episodes} épisodes</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
