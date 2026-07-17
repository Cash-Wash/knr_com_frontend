"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getApiBase, resolveMediaUrl } from "@/lib/api";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

type Equipement = {
  id: string;
  slug: string;
  categorie: string;
  nom: string;
  prix: string;
  disponible: boolean;
  caution: string;
  img: string;
  images: string[];
  specs: { label: string; valeur: string }[];
  description: string;
  conditions: string[];
  reservedDates: string[];
};

function mapEquipment(item: {
  id: string;
  slug?: string;
  category?: string;
  name: string;
  tarifJour?: number;
  status?: string;
  caution?: string;
  image?: string;
  images?: string[];
  specs?: { label: string; valeur: string }[];
  description?: string;
  conditions?: string[];
  reservedDates?: string[];
}): Equipement {
  return {
    id: item.id,
    slug: item.slug ?? "",
    categorie: item.category ?? "",
    nom: item.name,
    prix: item.tarifJour ? `${item.tarifJour.toLocaleString("fr-FR")} FCFA` : "Sur devis",
    disponible: item.status === "AVAILABLE",
    caution: item.caution ?? "",
    img: resolveMediaUrl(item.image) || "",
    images:
      Array.isArray(item.images) && item.images.length > 0
        ? item.images.map((src) => resolveMediaUrl(src) || src)
        : [resolveMediaUrl(item.image) || "/images/equipement.jpg"],
    specs: Array.isArray(item.specs) ? item.specs : [],
    description: item.description ?? "",
    conditions: Array.isArray(item.conditions) ? item.conditions : [],
    reservedDates: Array.isArray(item.reservedDates) ? item.reservedDates : [],
  };
}

type MotionDivProps = import("framer-motion").MotionProps & { className?: string; style?: React.CSSProperties };
const fadeUp = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

export default function EquipementDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [eq, setEq] = useState<Equipement | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${getApiBase()}/api/public/equipment/${slug}`);
        setEq(response.ok ? mapEquipment(await response.json()) : null);
      } catch {
        setEq(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

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
                  <Image src={resolveMediaUrl(eq.images[selectedImg]) || resolveMediaUrl(eq.img) || "/images/equipement.jpg"} alt={eq.nom} fill className="object-cover" />
                </div>
                {/* Thumbnails */}
                <div className="flex gap-3">
                  {eq.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(i)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${selectedImg === i ? "border-sky-400 opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}>
                      <Image src={resolveMediaUrl(img)} alt={`${eq.nom} ${i + 1}`} fill className="object-cover" />
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
                <Link
                  href={`/contact?context=location&contextId=${eq.id}&nom=${encodeURIComponent(eq.nom)}`}
                  className="flex w-full items-center justify-center h-14 bg-sky-400 rounded-xl text-white text-lg font-bold font-['Inter'] shadow-[0px_10px_15px_-3px_rgba(41,182,232,0.30)] hover:bg-sky-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Réserver maintenant
                </Link>
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
              <AvailabilityCalendar reservedDates={eq.reservedDates} title="Disponibilités" />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
