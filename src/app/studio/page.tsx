"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Monitor, Zap, Mic2, Tv, Coffee, Wind, Wifi, Shield, Armchair, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudioBookingModal from "@/components/StudioBookingModal";

const equipements = [
    { icon: <Camera className="w-7 h-7 text-sky-400" />, label: "Caméras 4K" },
    { icon: <Armchair className="w-7 h-7 text-sky-400" />, label: "Fond vert / Cyclo" },
    { icon: <Zap className="w-7 h-7 text-sky-400" />, label: "Eclairage pro" },
    { icon: <Mic2 className="w-7 h-7 text-sky-400" />, label: "Prise de son" },
    { icon: <Monitor className="w-7 h-7 text-sky-400" />, label: "Régie vidéo" },
    { icon: <Tv className="w-7 h-7 text-sky-400" />, label: "Espace détente" },
    { icon: <Wind className="w-7 h-7 text-sky-400" />, label: "Climatisation" },
    { icon: <Wifi className="w-7 h-7 text-sky-400" />, label: "Fibre optique" },
    { icon: <Coffee className="w-7 h-7 text-sky-400" />, label: "Machine à café" },
    { icon: <Shield className="w-7 h-7 text-sky-400" />, label: "Sécurité 24/7" },
];

const photos = [
    { src: "/images/studio/studio-1.jpg", cols: "lg:col-span-2", rows: "row-span-1" },
    { src: "/images/studio/studio-2.jpg", cols: "lg:col-span-1", rows: "row-span-1" },
    { src: "/images/studio/studio-3.jpg", cols: "lg:col-span-1", rows: "row-span-1" },
    { src: "/images/studio/studio-4.jpg", cols: "lg:col-span-1", rows: "row-span-1" },
    { src: "/images/studio/studio-5.jpg", cols: "lg:col-span-1", rows: "row-span-1" },
    { src: "/images/studio/studio-6.jpg", cols: "lg:col-span-2", rows: "row-span-1" },
    { src: "/images/studio/studio-7.jpg", cols: "lg:col-span-1", rows: "row-span-1" },
];

const forfaits = [
    {
        value: "demi",
        titre: "Demi-journée",
        duree: "4 heures",
        prix: "75 000 FCFA",
        desc: "Idéal pour les interviews courtes ou les podcasts.",
        recommended: false,
    },
    {
        value: "journee",
        titre: "Journée complète",
        duree: "8 heures",
        prix: "125 000 FCFA",
        desc: "Parfait pour les tournages, émissions et productions complètes.",
        recommended: true,
    },
    {
        value: "weekend",
        titre: "Forfait week-end",
        duree: "16 heures sur 2 jours",
        prix: "200 000 FCFA",
        desc: "Pour les projets ambitieux nécessitant plus de temps de production.",
        recommended: false,
    },
];

export default function StudioPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [forfaitSelectionne, setForfaitSelectionne] = useState("demi");
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    const visiblePhotos = showAllPhotos ? photos : photos.slice(0, 6);

    const openModal = (forfait: string) => {
        setForfaitSelectionne(forfait);
        setModalOpen(true);
    };

    return (
        <>
            <Navbar />
            <main className="w-full overflow-x-hidden bg-white">

                {/* ── HERO ── */}
                <section className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/hero-cover.png"
                            alt="Studio KNR"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="relative z-10 flex flex-col items-center gap-6 text-center px-5 pt-32 pb-16"
                    >
                        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Poppins'] leading-tight max-w-[800px]">
                            Votre espace de création professionnel
                        </h1>
                        <p className="text-white text-xl sm:text-2xl md:text-3xl font-normal font-['Poppins'] max-w-[600px]">
                            Conçu pour répondre aux exigences des productions modernes.
                        </p>
                        <button
                            onClick={() => openModal("journee")}
                            className="px-10 py-4 bg-sky-400 rounded-full text-white text-base font-semibold font-['Poppins'] shadow-[0px_0px_20px_0px_rgba(41,182,232,0.40)] hover:bg-sky-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                            Réserver maintenant
                        </button>
                        {/* Scroll indicator */}
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="mt-8 w-8 h-12 rounded-full border-2 border-white flex items-start justify-center pt-2"
                        >
                            <div className="w-1 h-3 bg-white rounded-full" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* ── ÉQUIPEMENTS ── */}
                <section className="relative w-full py-20 bg-white overflow-hidden">
                    <div className="max-w-[1560px] mx-auto px-5 sm:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center gap-5 mb-14 text-center"
                        >
                            <h2 className="text-gray-900 text-4xl sm:text-5xl font-bold font-['Poppins']">Équipements inclus</h2>
                            <p className="text-gray-600 text-xl font-normal font-['Poppins']">Tout ce dont vous avez besoin est déjà sur place.</p>
                        </motion.div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                            {equipements.map((eq, i) => (
                                <div
                                    key={eq.label}
                                    className="bg-white rounded-2xl shadow-[0px_1px_17px_0px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex flex-col items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.06}s both` }}
                                >
                                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                        {eq.icon}
                                    </div>
                                    <span className="text-gray-900 text-lg font-medium font-['Poppins'] text-center">{eq.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── GALERIE PHOTOS ── */}
                <section className="relative w-full py-20 bg-neutral-950 overflow-hidden">
                    {/* Cross pattern overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                            backgroundImage: `url("/images/vector-white.svg")`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />

                    <div className="relative z-10 max-w-[1640px] mx-auto px-5 sm:px-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-white text-4xl sm:text-5xl font-bold font-['Poppins'] text-center mb-12"
                        >
                            Quelques images de notre studio
                        </motion.h2>

                        {/* Masonry-style grid */}
                        <div className="flex flex-col gap-4">
                            {/* Ligne 1 : grande gauche + petite droite */}
                            <div className="flex gap-4 h-[300px] sm:h-[360px] lg:h-[485px]">
                                <div className="relative rounded-[10px] overflow-hidden group cursor-pointer flex-[3]">
                                    <Image src="/images/galerie1.png" alt="Studio KNR 1" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                                <div className="relative rounded-[10px] overflow-hidden group cursor-pointer flex-[2]">
                                    <Image src="/images/galerie2.png" alt="Studio KNR 2" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                            </div>

                            {/* Ligne 2 : petite gauche + petite centre + très petite droite */}
                            <div className="flex gap-4 h-[300px] sm:h-[360px] lg:h-[485px]">
                                <div className="relative rounded-[10px] overflow-hidden group cursor-pointer flex-[3]">
                                    <Image src="/images/galerie3.png" alt="Studio KNR 3" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                                <div className="relative rounded-[10px] overflow-hidden group cursor-pointer flex-[3]">
                                    <Image src="/images/galerie4.png" alt="Studio KNR 4" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                                <div className="relative rounded-[10px] overflow-hidden group cursor-pointer flex-[2]">
                                    <Image src="/images/galerie5.png" alt="Studio KNR 5" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                            </div>

                            {/* Ligne 3 : petite gauche + grande droite (inversé) */}
                            <div className="flex gap-4 h-[300px] sm:h-[360px] lg:h-[485px]">
                                <div className="relative rounded-[10px] overflow-hidden group cursor-pointer flex-[2]">
                                    <Image src="/images/galerie6.png" alt="Studio KNR 6" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                                <div className="relative rounded-[10px] overflow-hidden group cursor-pointer flex-[3]">
                                    <Image src="/images/galerie7.png" alt="Studio KNR 7" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                            </div>
                        </div>

                        {/* Voir plus button */}
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={() => setShowAllPhotos(!showAllPhotos)}
                                className="flex items-center gap-3 px-10 py-4 rounded-full border-2 border-white text-white text-base font-semibold font-['Poppins'] hover:bg-white/10 hover:scale-105 transition-all cursor-pointer shadow-[0px_0px_20px_0px_rgba(41,182,232,0.40)]"
                            >
                                {showAllPhotos ? "Voir moins" : "Voir plus"}
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="2" y1="10" x2="18" y2="10" />
                                    <polyline points="12,4 18,10 12,16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── TARIFS ── */}
                <section className="relative w-full py-24 bg-white overflow-hidden">
                    <div className="max-w-[1481px] mx-auto px-5 sm:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center gap-5 mb-16 text-center"
                        >
                            <h2 className="text-gray-900 text-4xl sm:text-5xl font-bold font-['Poppins']">Tarifs de location</h2>
                            <p className="text-gray-600 text-xl font-normal font-['Poppins']">Des forfaits adaptés à la durée de votre projet.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {forfaits.map((f, i) => (
                                <motion.div
                                    key={f.value}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className={`relative rounded-[20px] p-8 flex flex-col gap-10 ${f.recommended
                                        ? "bg-white shadow-[0px_13px_28px_0px_rgba(0,0,0,0.10),0px_51px_51px_0px_rgba(0,0,0,0.09)] outline outline-[0.80px] outline-sky-400 hover:shadow-2xl"
                                        : "bg-white shadow-[0px_1px_10px_0px_rgba(0,0,0,0.11)] outline outline-[0.80px] outline-gray-200 hover:shadow-lg"
                                        } transition-all duration-300 hover:-translate-y-1`}
                                >
                                    {f.recommended && (
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-sky-400 rounded-[20px] text-white text-base font-medium font-['Poppins']">
                                            Recommandé
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-10">
                                        <div className="flex flex-col gap-5">
                                            <div className="flex flex-col gap-1.5">
                                                <h3 className="text-gray-900 text-3xl font-bold font-['Poppins']">{f.titre}</h3>
                                                <p className="text-gray-500 text-base font-normal font-['Poppins']">{f.duree}</p>
                                            </div>
                                            <p className="text-sky-400 text-4xl font-bold font-['Poppins']">{f.prix}</p>
                                        </div>
                                        <p className="text-gray-600 text-base font-normal font-['Inter'] leading-6">{f.desc}</p>
                                    </div>

                                    <button
                                        onClick={() => openModal(f.value)}
                                        className={`w-full py-4 rounded-xl text-xl font-bold font-['Poppins'] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${f.recommended
                                            ? "bg-neutral-800 text-white hover:bg-neutral-700"
                                            : "bg-gray-50 text-gray-900 outline outline-[0.80px] outline-gray-200 hover:bg-gray-100"
                                            }`}
                                    >
                                        Réserver
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA BAND ── */}
                <section className="relative w-full py-10 px-5 sm:px-8 bg-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-[1554px] mx-auto bg-neutral-950 rounded-3xl overflow-hidden py-16 px-6 flex flex-col items-center gap-9 text-center relative"
                    >
                        {/* Glow blob top right */}
                        <div
                            className="absolute pointer-events-none"
                            style={{
                                width: 384, height: 384,
                                right: -96, top: -96,
                                background: "rgba(56,189,248,0.2)",
                                borderRadius: "50%",
                                filter: "blur(32px)",
                            }}
                        />
                        <h2 className="relative z-10 text-white text-3xl sm:text-4xl font-bold font-['Poppins'] max-w-[560px]">
                            Prêt à donner vie à votre projet ?
                        </h2>
                        <button
                            onClick={() => openModal("journee")}
                            className="relative z-10 px-10 py-4 bg-sky-400 rounded-full text-white text-base font-semibold font-['Poppins'] shadow-[0px_0px_20px_0px_rgba(41,182,232,0.40)] hover:bg-sky-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                            Réserver le studio maintenant
                        </button>
                    </motion.div>
                </section>
            </main>

            <Footer />

            {/* Booking Modal */}
            <StudioBookingModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                forfaitInitial={forfaitSelectionne}
            />
        </>
    );
}
