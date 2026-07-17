"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock, BarChart2, MapPin, ArrowLeft,
  CheckCircle2, Calendar, AlertTriangle,
  AlertCircle, ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getApiBase, resolveMediaUrl } from "@/lib/api";

type Formation = {
  id: string;
  slug: string;
  titre: string;
  categorie: string;
  sousTitre: string;
  description: string;
  prix: string;
  duree: string;
  niveau: string;
  lieu: string;
  debut: string;
  fin: string;
  placesRestantes: number;
  joursClotureInscription: number;
  img: string;
  competences: string[];
  modules: { numero: number; label: string; titre: string; desc: string }[];
  formateur: { nom: string; titre: string; bio: string; photo: string };
};

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

export default function FormationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${getApiBase()}/api/public/formations/${slug}`);
        setFormation(response.ok ? await response.json() : null);
      } catch {
        setFormation(null);
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

  if (!formation) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-500 text-xl font-['Poppins'] mb-4">Formation introuvable.</p>
            <Link href="/formations" className="text-sky-400 underline font-['Poppins']">
              Retour aux formations
            </Link>
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

        {/* ── HERO ── */}
        <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden flex items-end">
          <div className="absolute inset-0">
            <Image
              src={resolveMediaUrl(formation.img) || "/images/formations.svg"}
              alt={formation.titre}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/20" />
          </div>

          <div className="relative z-10 w-full max-w-[1560px] mx-auto px-5 sm:px-8 pb-14 pt-36 flex flex-col gap-8">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/formations"
                className="flex items-center gap-2 text-white text-base font-medium font-['Poppins'] underline hover:text-sky-400 transition-colors w-fit"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour à la page précédente
              </Link>
            </motion.div>

            {/* Hero content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="flex flex-col gap-6 max-w-[850px]"
            >
              {/* Badge */}
              <div className="inline-flex">
                <span className="px-5 py-2 bg-sky-400 rounded-[20px] text-white text-base font-bold font-['Inter']">
                  Formation Certifiante
                </span>
              </div>

              {/* Title */}
              <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-bold font-['Poppins'] leading-tight">
                {formation.sousTitre}
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-lg sm:text-2xl font-normal font-['Poppins'] leading-9">
                {formation.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span className="text-white/80 text-sm font-medium font-['Poppins']">
                    {formation.duree}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-sky-400" />
                  <span className="text-white/80 text-sm font-medium font-['Poppins']">
                    {formation.niveau}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span className="text-white/80 text-sm font-medium font-['Poppins']">
                    {formation.lieu}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <div className="w-full max-w-[1560px] mx-auto px-5 sm:px-8 py-14">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* LEFT COLUMN */}
            <div className="flex-1 flex flex-col gap-12 min-w-0">

              {/* Compétences acquises */}
              <motion.div {...fadeUp()} className="flex flex-col gap-6">
                <h2 className="text-gray-900 text-3xl font-bold font-['Poppins']">
                  Compétences acquises
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formation.competences.map((c, i) => (
                    <motion.div
                      key={i}
                      {...fadeUp(i * 0.06)}
                      className="flex items-start gap-4 px-5 py-5 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                      <CheckCircle2 className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-base font-normal font-['Poppins'] leading-6">
                        {c}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Programme détaillé */}
              <motion.div {...fadeUp(0.1)} className="flex flex-col gap-6">
                <h2 className="text-gray-900 text-3xl font-bold font-['Poppins']">
                  Programme détaillé
                </h2>
                <div className="flex flex-col gap-4">
                  {formation.modules.map((mod, i) => (
                    <motion.div
                      key={i}
                      {...fadeUp(i * 0.08)}
                      className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-5 hover:shadow-md hover:border-sky-200 transition-all duration-300"
                    >
                      {/* Number box */}
                      <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-400 text-xl font-bold font-['Sora']">
                          {mod.numero}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-sky-400 text-sm font-bold font-['Inter']">
                          {mod.label}
                        </span>
                        <h3 className="text-gray-900 text-xl md:text-2xl font-bold font-['Poppins']">
                          {mod.titre}
                        </h3>
                        <p className="text-gray-600 text-base font-normal font-['Poppins'] leading-6">
                          {mod.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Votre formateur */}
              <motion.div {...fadeUp(0.1)} className="flex flex-col gap-5">
                <h2 className="text-gray-900 text-2xl font-bold font-['Sora']">
                  Votre formateur
                </h2>
                <div className="bg-neutral-950 rounded-3xl p-8 flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative w-24 h-32 flex-shrink-0">
                    <Image
                      src={resolveMediaUrl(formation.formateur.photo) || "/images/equipe1.png"}
                      alt={formation.formateur.nom}
                      fill
                      className="object-cover rounded-full border-4 border-white/10"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <h3 className="text-white text-xl font-bold font-['Inter']">
                      {formation.formateur.nom},{" "}
                      <span className="font-normal">{formation.formateur.titre}</span>
                    </h3>
                    <p className="text-gray-400 text-base font-normal font-['Inter'] leading-6">
                      {formation.formateur.bio}
                    </p>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sky-400 text-base font-medium font-['Inter'] hover:gap-3 transition-all w-fit mt-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Voir son interview
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN — Sticky card */}
            <motion.div
              {...fadeUp(0.15)}
              className="w-full lg:w-[508px] lg:sticky lg:top-32 flex-shrink-0"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col gap-8">

                  {/* Price */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="text-gray-500 text-lg font-medium font-['Poppins']">
                      Tarif de la formation
                    </span>
                    <span className="text-gray-900 text-4xl font-bold font-['Poppins']">
                      {formation.prix.replace("XOF", "FCFA")}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-3">
                    {/* Debut */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-5 h-5 text-sky-400" />
                        <span className="text-gray-600 text-base font-normal font-['Poppins']">
                          Début
                        </span>
                      </div>
                      <span className="text-gray-900 text-base font-medium font-['Poppins']">
                        {formation.debut}
                      </span>
                    </div>
                    {/* Fin */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-5 h-5 text-sky-400" />
                        <span className="text-gray-600 text-base font-normal font-['Poppins']">
                          Fin
                        </span>
                      </div>
                      <span className="text-gray-900 text-base font-medium font-['Poppins']">
                        {formation.fin}
                      </span>
                    </div>
                    {/* Places */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-gray-600 text-base font-normal font-['Poppins']">
                          Places restantes
                        </span>
                      </div>
                      <span className="text-amber-500 text-base font-bold font-['Inter']">
                        {formation.placesRestantes}
                      </span>
                    </div>

                    {/* Clôture alert */}
                    <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="text-red-600 text-sm font-medium font-['Poppins']">
                        Clôture des inscriptions dans{" "}
                        {formation.joursClotureInscription} jours
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/contact?context=formation&contextId=${formation.id}&nom=${encodeURIComponent(formation.titre)}`}
                    className="flex w-full items-center justify-center h-14 bg-sky-400 rounded-xl text-white text-lg font-bold font-['Inter'] shadow-[0px_10px_15px_-3px_rgba(41,182,232,0.30)] hover:bg-sky-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Je m&apos;inscris
                  </Link>

                  <p className="text-center text-gray-500 text-xs font-normal font-['Inter']">
                    Paiement sécurisé. Possibilité de payer en plusieurs fois.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
