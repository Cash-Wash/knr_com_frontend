"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { emissions } from "@/lib/emissions-data";

type MotionDivProps = import("framer-motion").MotionProps & {
  className?: string; style?: React.CSSProperties;
};
const fadeUp = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const categories = ["Toutes", "Technologie", "Culture", "Business", "Société", "Sport"];

export default function EmissionsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes");

  const filtered = emissions.filter((e) => {
    const matchCat = activeCategory === "Toutes" || e.categorie === activeCategory;
    const matchSearch = e.titre.toLowerCase().includes(search.toLowerCase()) ||
      e.sousTitre.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden bg-gray-50">

        {/* HERO */}
        <section className="relative w-full min-h-[420px] md:min-h-[500px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <Image src="/images/formations.svg" alt="Nos Émissions" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-5 text-center px-5 pt-32 pb-16"
          >
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Poppins']">
              Nos Emissions
            </h1>
            <p className="text-white/80 text-base md:text-xl font-normal font-['Poppins'] max-w-[600px]">
              Retrouvez bientôt tous les épisodes de nos émissions en replay
            </p>
          </motion.div>
        </section>

        {/* SEARCH + FILTERS */}
        <div className="w-full max-w-[1558px] mx-auto px-5 sm:px-8 py-6">
          <motion.div {...fadeUp()} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-[480px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" placeholder="Rechercher une émission..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 text-base font-['Poppins'] placeholder:text-gray-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`h-11 px-4 rounded-xl text-sm font-medium font-['Poppins'] transition-all cursor-pointer ${activeCategory === cat ? "bg-neutral-950 text-white" : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-gray-300"}`}>
                  {cat}
                </button>
              ))}
              <button className="h-11 px-4 flex items-center gap-2 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-600 text-sm font-['Poppins'] hover:border-gray-300 transition-all cursor-pointer">
                <SlidersHorizontal className="w-4 h-4" /> Filtres
              </button>
            </div>
          </motion.div>
        </div>

        {/* GRID */}
        <div className="w-full max-w-[1558px] mx-auto px-5 sm:px-8 pb-20 mt-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl font-['Poppins']">Aucune émission trouvée.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((emission, i) => (
                <motion.div key={emission.slug} {...fadeUp(i * 0.07)}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-lg"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Link href={`/emissions/${emission.slug}`} className="block w-full h-full">
                    <Image src={emission.img} alt={emission.titre} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                        style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,255,255,0.4)" }}>
                        <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                      </div>
                    </div>

                    {/* KNR logo watermark */}
                    <div className="absolute top-4 right-4 opacity-60">
                      <Image src="/images/logo.svg" alt="KNR" width={32} height={32} className="w-8 h-8 object-contain" />
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-base md:text-lg font-bold font-['Poppins']">{emission.titre}</p>
                      <p className="text-gray-300 text-sm font-normal font-['Poppins']">{emission.sousTitre}</p>
                      <p className="text-sky-400 text-xs font-medium font-['Poppins'] mt-1">{emission.episodes} épisodes</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
