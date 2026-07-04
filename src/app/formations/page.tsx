"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, SlidersHorizontal, Clock, BarChart2,
  AlertTriangle, ArrowUpRight, Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formations } from "@/lib/formations-data";

type MotionDivProps = import("framer-motion").MotionProps & {
  className?: string;
  style?: React.CSSProperties;
};

const fadeUp = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const categories = ["Toutes", "Audiovisuel", "Marketing", "Média"];

export default function FormationsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes");

  const filtered = formations.filter((f) => {
    const matchCat =
      activeCategory === "Toutes" || f.categorie === activeCategory;
    const matchSearch =
      f.titre.toLowerCase().includes(search.toLowerCase()) ||
      f.categorie.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden bg-gray-50">

        {/* ── HERO ── */}
        <section className="relative w-full min-h-[420px] md:min-h-[500px] overflow-hidden flex items-end">
          <div className="absolute inset-0">
            <Image
              src="/images/formations.svg"
              alt="Centre de Formations"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          </div>
          <div className="relative z-10 w-full max-w-[1560px] mx-auto px-5 sm:px-8 pb-16 pt-40">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col gap-4 max-w-[700px]"
            >
              <div>
                <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Sora'] leading-tight">
                  Centre de Formations
                </h1>
                <h1 className="text-sky-400 text-4xl sm:text-5xl md:text-6xl font-bold font-['Sora'] leading-tight">
                  Professionnelles
                </h1>
              </div>
              <p className="text-gray-400 text-base md:text-xl font-normal font-['Inter'] leading-7 max-w-[580px]">
                Développez vos compétences avec nos experts. Des formations
                pratiques, certifiantes et adaptées aux réalités du marché
                africain.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── SEARCH BAR + FILTERS ── */}
        <div className="w-full max-w-[1558px] mx-auto px-5 sm:px-8 py-6">
          <motion.div
            {...fadeUp()}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            {/* Search input */}
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-[480px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 text-base font-['Poppins'] placeholder:text-gray-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
              />
            </div>

            {/* Category buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`h-11 px-5 rounded-xl text-sm font-medium font-['Poppins'] transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-neutral-950 text-white"
                      : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button className="h-11 px-4 flex items-center gap-2 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-600 text-sm font-normal font-['Poppins'] hover:border-gray-300 transition-all cursor-pointer">
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── FORMATIONS GRID ── */}
        <div className="w-full max-w-[1558px] mx-auto px-5 sm:px-8 pb-20 mt-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl font-['Poppins']">
              Aucune formation trouvée.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((f, i) => (
                <motion.div
                  key={f.slug}
                  {...fadeUp(i * 0.07)}
                  className="bg-white rounded-[20px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.11)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Card image */}
                  <div className="relative w-full h-52 overflow-hidden flex-shrink-0">
                    <Image
                      src={f.img}
                      alt={f.titre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1 bg-white rounded-full text-stone-900 text-sm font-semibold font-['Poppins'] shadow-sm">
                        {f.categorie}
                      </span>
                    </div>
                    {/* Price badge */}
                    <div className="absolute bottom-4 right-4">
                      <span className="px-5 py-1 bg-sky-400 rounded-lg text-white text-base font-semibold font-['Poppins']">
                        {f.prix}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex flex-col gap-3 p-6 flex-1">
                    <h3 className="text-gray-900 text-xl font-bold font-['Poppins'] leading-7">
                      {f.titre}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span className="text-gray-600 text-sm font-normal font-['Inter']">
                        {f.debut} - {f.fin}
                      </span>
                    </div>

                    {/* Level */}
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span className="text-gray-600 text-sm font-normal font-['Inter']">
                        {f.niveau}
                      </span>
                    </div>

                    {/* Places restantes */}
                    {f.placesRestantes <= 5 && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="text-amber-500 text-sm font-medium font-['Inter']">
                          Plus que {f.placesRestantes} places !
                        </span>
                      </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* CTA Button */}
                    <Link
                      href={`/formations/${f.slug}`}
                      className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 text-base font-bold font-['Poppins'] hover:bg-sky-400 hover:text-white hover:border-sky-400 transition-all group/btn"
                    >
                      Voir les détails
                      <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
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
