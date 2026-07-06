"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { equipements } from "@/lib/equipements-data";

type MotionDivProps = import("framer-motion").MotionProps & { className?: string; style?: React.CSSProperties };
const fadeUp = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const categories = ["Toutes", "Drones", "Caméras", "Micros", "Éclairages"];

export default function LocationPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes");

  const filtered = equipements.filter((e) => {
    const matchCat = activeCategory === "Toutes" || e.categorie === activeCategory;
    const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.categorie.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden bg-gray-50">

        {/* HERO */}
        <section className="relative w-full min-h-[420px] md:min-h-[500px] overflow-hidden flex items-end">
          <div className="absolute inset-0">
            <Image src="/images/formations.svg" alt="Location d'Équipements" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          </div>
          <div className="relative z-10 w-full max-w-[1560px] mx-auto px-5 sm:px-8 pb-16 pt-40">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="flex flex-col gap-4 max-w-[700px]">
              <div>
                <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Poppins'] leading-tight">
                  Location d&apos;Equipements
                </h1>
                <h1 className="text-sky-400 text-4xl sm:text-5xl md:text-6xl font-bold font-['Poppins'] leading-tight">
                  Audiovisuels Professionnels
                </h1>
              </div>
              <p className="text-gray-400 text-base md:text-xl font-normal font-['Inter'] leading-7 max-w-[560px]">
                Du matériel de pointe pour donner vie à vos productions. Caméras, drones, éclairage et son : tout ce dont vous avez besoin, quand vous en avez besoin.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SEARCH + FILTERS */}
        <div className="w-full max-w-[1558px] mx-auto px-5 sm:px-8 py-6">
          <motion.div {...fadeUp()} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-[480px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Rechercher une formation..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 text-base font-['Poppins'] placeholder:text-gray-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
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

        {/* EQUIPEMENTS GRID */}
        <div className="w-full max-w-[1558px] mx-auto px-5 sm:px-8 pb-20 mt-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl font-['Poppins']">Aucun équipement trouvé.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((eq, i) => (
                <motion.div key={eq.slug} {...fadeUp(i * 0.07)}
                  className="bg-white rounded-[20px] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  style={{ boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.08)" }}>

                  {/* Image */}
                  <div className="relative w-full h-52 overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image src={eq.img} alt={eq.nom} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1 bg-white rounded-full text-stone-900 text-sm font-semibold font-['Poppins'] shadow-sm">
                        {eq.categorie === "Drones" ? "Drone" : eq.categorie.slice(0, -1)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    {/* Name + disponibility */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-gray-900 text-xl font-bold font-['Poppins']">{eq.nom}</h3>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-['Inter'] flex-shrink-0 ${eq.disponible ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"}`}>
                        {eq.disponible ? "Disponible" : "Indisponible"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-sky-400 text-2xl font-bold font-['Inter']">
                        {eq.prix}
                      </span>
                      <span className="text-gray-500 text-base font-normal font-['Inter']">/ jour</span>
                    </div>

                    <div className="flex-1" />

                    {/* CTA */}
                    <Link href={`/location/${eq.slug}`}
                      className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 text-base font-bold font-['Poppins'] hover:bg-sky-400 hover:text-white hover:border-sky-400 transition-all group/btn">
                      Réserver
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
