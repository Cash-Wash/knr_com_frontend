"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const subjects = [
    "Demande générale",
    "Publicité & sponsoring",
    "Réservation Studio Podcast",
    "Partenariat Média",
    "Autre",
];

const socialIcons = [
    {
        label: "Facebook",
        path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
        label: "Twitter",
        path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    },
    {
        label: "Instagram",
        path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    {
        label: "YouTube",
        path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    },
];

export default function ContactPage() {
    const [form, setForm] = useState({
        nom: "",
        email: "",
        sujet: "Demande générale",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <Navbar />
            <main className="w-full overflow-x-hidden bg-stone-50">

                {/* ── HERO ── */}
                <section className="relative w-full h-80 sm:h-96 bg-neutral-800 overflow-hidden flex items-end justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="relative z-10 flex flex-col items-center gap-4 text-center px-5 pb-14"
                    >
                        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Inter']">
                            Contactez-nous
                        </h1>
                        <p className="text-orange-50 text-lg sm:text-2xl md:text-3xl font-normal font-['Inter'] max-w-[700px]">
                            Une question ? Un projet ? Notre équipe est à votre écoute.
                        </p>
                    </motion.div>
                </section>

                {/* ── FORM + COORDS ── */}
                <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 py-16">
                    <motion.div
                        {...fadeUp()}
                        className="flex flex-col lg:flex-row rounded-[30px] overflow-hidden shadow-xl"
                    >
                        {/* LEFT — Form */}
                        <div className="flex-1 bg-white p-8 md:p-10 flex flex-col gap-6">
                            <h2 className="text-zinc-950 text-2xl font-bold font-['Inter']">
                                Envoyez-nous un message
                            </h2>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                                >
                                    <div className="w-16 h-16 bg-sky-400 rounded-full flex items-center justify-center">
                                        <Send className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-gray-900 text-xl font-bold font-['Inter']">
                                        Message envoyé !
                                    </h3>
                                    <p className="text-gray-500 font-['Inter']">
                                        Nous vous répondrons dans les meilleurs délais.
                                    </p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ nom: "", email: "", sujet: "Demande générale", message: "" }); }}
                                        className="px-6 py-2 bg-sky-400 text-white rounded-md text-sm font-medium font-['Inter'] hover:bg-sky-500 transition-colors cursor-pointer"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    {/* Nom + Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-neutral-900 text-base font-medium font-['Inter']">
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                name="nom"
                                                value={form.nom}
                                                onChange={handleChange}
                                                placeholder="Votre nom"
                                                required
                                                className="h-12 px-4 py-3 bg-white rounded-lg border border-neutral-300 text-gray-900 text-base font-normal font-['Inter'] placeholder:text-stone-300 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-neutral-900 text-base font-medium font-['Inter']">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="votre@email.com"
                                                required
                                                className="h-12 px-4 py-3 bg-white rounded-lg border border-neutral-300 text-gray-900 text-base font-normal font-['Inter'] placeholder:text-stone-300 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Sujet */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-neutral-900 text-base font-medium font-['Inter']">
                                            Sujet
                                        </label>
                                        <select
                                            name="sujet"
                                            value={form.sujet}
                                            onChange={handleChange}
                                            className="h-11 px-4 py-3 bg-white rounded-lg border border-neutral-300 text-gray-900 text-base font-normal font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all cursor-pointer appearance-none"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23374151' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "right 16px center",
                                            }}
                                        >
                                            {subjects.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-neutral-900 text-base font-medium font-['Inter']">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Comment pouvons-nous vous aider ?"
                                            rows={6}
                                            required
                                            className="w-full px-4 py-3 bg-white rounded-lg border border-neutral-300 text-gray-900 text-base font-normal font-['Inter'] placeholder:text-stone-300 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all resize-none"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 h-12 px-7 bg-sky-400 rounded-md text-white text-sm font-medium font-['Inter'] shadow-md hover:bg-sky-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                                        >
                                            Envoyer le message
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* RIGHT — Coordonnées */}
                        <div className="w-full lg:w-[510px] flex-shrink-0 bg-zinc-950 p-8 md:p-10 flex flex-col gap-8">
                            <h3 className="text-sky-400 text-xl font-bold font-['Inter']">
                                Nos Coordonnées
                            </h3>

                            {/* Adresse */}
                            <motion.div {...fadeUp(0.05)} className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-sky-400" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-white text-base font-bold font-['Inter']">Adresse</p>
                                    <p className="text-orange-50 text-base font-normal font-['Inter'] leading-5">Cotonou, Zogbo</p>
                                    <p className="text-orange-50 text-base font-normal font-['Inter'] leading-5">Bénin</p>
                                </div>
                            </motion.div>

                            {/* Téléphone */}
                            <motion.div {...fadeUp(0.1)} className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-sky-400" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-white text-base font-bold font-['Inter']">Téléphone</p>
                                    <p className="text-orange-50 text-base font-normal font-['Inter']">+229 01 00 00 00 00</p>
                                </div>
                            </motion.div>

                            {/* Email */}
                            <motion.div {...fadeUp(0.15)} className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-sky-400" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-white text-base font-bold font-['Inter']">Email</p>
                                    <p className="text-orange-50 text-base font-normal font-['Inter']">contact@knrcom.bj</p>
                                </div>
                            </motion.div>

                            {/* Réseaux sociaux */}
                            <motion.div {...fadeUp(0.2)} className="flex flex-col gap-4 mt-auto pt-6 border-t border-white/10">
                                <p className="text-gray-400 text-xs font-bold font-['Inter'] uppercase tracking-wide">
                                    Suivez-nous
                                </p>
                                <div className="flex items-center gap-3">
                                    {socialIcons.map(({ label, path }) => (
                                        <a
                                            key={label}
                                            href="#"
                                            aria-label={label}
                                            className="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center hover:bg-sky-500 hover:scale-110 transition-all"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                                                <path d={path} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
