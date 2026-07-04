"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Shield } from "lucide-react";
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

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

function MiniCalendar({ joursReserves }: { joursReserves: number[] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Adjust: Monday = 0
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className="text-gray-900 text-lg font-bold font-['Sora']">Disponibilités (30 jours)</span>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-gray-400 text-xs font-bold font-['Inter']">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const reserved = joursReserves.includes(day);
          return (
            <div key={i}
              className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium font-['Inter'] ${reserved ? "bg-red-50 text-red-400" : "bg-green-50 text-green-700"}`}>
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200" />
          <span className="text-gray-900 text-sm font-['Inter']">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-50 border border-red-200" />
          <span className="text-gray-900 text-sm font-['Inter']">Réservé</span>
        </div>
      </div>
    </div>
  );
}

export default function EquipementDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const eq = equipements.find((e) => e.slug === slug);
  const [selectedImg, setSelectedImg] = useState(0);

  if (!eq) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-500 text-xl font-['Poppins'] mb-4">Équipement introuvable.</p>
            <Link href="/location" className="text-sky-400 underline font-['Poppins']">Retour à la location</Link>
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

        {/* BREADCRUMB */}
        <div className="w-full bg-white border-b border-gray-100 pt-28 pb-4">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
            <div className="flex items-center gap-2 text-sm font-['Inter']">
              <Link href="/" className="text-gray-500 hover:text-sky-400 transition-colors">Accueil</Link>
              <span className="text-gray-400">&gt;</span>
              <Link href="/location" className="text-gray-500 hover:text-sky-400 transition-colors">Location</Link>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-900 font-medium">{eq.nom}</span>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 py-10">

          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-6">
            <Link href="/location" className="flex items-center gap-2 text-gray-600 text-sm font-medium font-['Poppins'] hover:text-sky-400 transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" /> Retour à la location
            </Link>
          </motion.div>

          {/* Product card */}
          <motion.div {...fadeUp()} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10">
            <div className="flex flex-col lg:flex-row gap-10">

              {/* LEFT — Images */}
              <div className="w-full lg:w-[480px] flex-shrink-0 flex flex-col gap-4">
                {/* Main image */}
                <div className="relative w-full h-72 sm:h-80 bg-gray-100 rounded-2xl overflow-hidden">
                  <Image src={eq.images[selectedImg] || eq.img} alt={eq.nom} fill className="object-cover" />
                </div>
                {/* Thumbnails */}
                <div className="flex gap-3">
                  {eq.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(i)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${selectedImg === i ? "border-sky-400 opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}>
                      <Image src={img} alt={`${eq.nom} ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT — Details */}
              <div className="flex flex-col gap-5 flex-1 min-w-0">
                {/* Category badge */}
                <span className="inline-flex px-4 py-1 bg-gray-100 rounded-full text-gray-600 text-sm font-bold font-['Inter'] w-fit">
                  {eq.categorie}
                </span>

                {/* Name */}
                <h1 className="text-gray-900 text-3xl sm:text-4xl font-bold font-['Sora']">{eq.nom}</h1>

                {/* Price + disponibility */}
                <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sky-400 text-4xl font-bold font-['Inter']">{eq.prix}</span>
                    <span className="text-gray-500 text-lg font-normal font-['Inter']">/ jour</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-bold font-['Inter'] ${eq.disponible ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500"}`}>
                    {eq.disponible ? "Disponible" : "Indisponible"}
                  </span>
                </div>

                {/* Specs grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  {eq.specs.map((spec) => (
                    <div key={spec.label} className="flex flex-col gap-1">
                      <span className="text-gray-500 text-xs font-bold font-['Inter'] uppercase tracking-wide">{spec.label}</span>
                      <span className="text-gray-900 text-base font-medium font-['Inter']">{spec.valeur}</span>
                    </div>
                  ))}
                </div>

                {/* Caution box */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <Shield className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 text-sm font-bold font-['Inter']">Caution requise</p>
                    <p className="text-gray-600 text-sm font-normal font-['Inter']">
                      Une caution de {eq.caution} est demandée pour cet équipement (non encaissée).
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full h-14 bg-sky-400 rounded-xl text-white text-lg font-bold font-['Inter'] shadow-[0px_10px_15px_-3px_rgba(41,182,232,0.30)] hover:bg-sky-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                  Réserver maintenant
                </button>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM — Description + Conditions + Calendar */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left — Description + Conditions */}
            <div className="flex-1 flex flex-col gap-8 min-w-0">

              {/* Description */}
              <motion.div {...fadeUp()} className="flex flex-col gap-4">
                <h2 className="text-gray-900 text-2xl font-bold font-['Sora']">Description</h2>
                {eq.description.split("\n\n").map((p, i) => (
                  <p key={i} className="text-gray-600 text-base font-normal font-['Inter'] leading-6">{p}</p>
                ))}
              </motion.div>

              {/* Conditions */}
              <motion.div {...fadeUp(0.1)} className="flex flex-col gap-4">
                <h2 className="text-gray-900 text-2xl font-bold font-['Sora']">Conditions de location</h2>
                <div className="flex flex-col gap-3">
                  {eq.conditions.map((cond, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl border border-gray-100">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-gray-700 text-base font-normal font-['Inter']">{cond}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Calendar */}
            <motion.div {...fadeUp(0.1)} className="w-full lg:w-96 lg:sticky lg:top-32 flex-shrink-0">
              <MiniCalendar joursReserves={eq.joursReserves} />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
