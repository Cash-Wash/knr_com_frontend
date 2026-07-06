"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const footerLinks = {
    activites: [
        { label: "Web TV", href: "/webtv" },
        { label: "À propos", href: "/about" },
        { label: "Formations", href: "/formations" },
        { label: "Studio Podcast", href: "/studio" },
    ],
    services: [
        { label: "Publicité & Sponsoring", href: "/publicite" },
        { label: "Location Studio Podcast", href: "/location" },
        { label: "Production Vidéo", href: "/production" },
        { label: "Devenir Partenaire", href: "/partenaire" },
    ],
};

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

export default function Footer() {
    const [email, setEmail] = useState("");

    return (
        <footer className="relative w-full bg-neutral-950 overflow-hidden">
            {/* Decorative rotated diamond — bottom right */}
            <div
                className="absolute pointer-events-none opacity-50"
                style={{
                    width: "630px",
                    height: "610px",
                    right: "-80px",
                    top: "-38px",
                    transformOrigin: "top left",
                    backgroundImage: `url("/images/vector-white.svg")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                }}
            />

            {/* Main footer content */}
            <div className="relative z-10 max-w-[1549px] mx-auto px-5 sm:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Col 1 — Logo + desc + socials */}
                    <div className="flex flex-col gap-8 lg:col-span-1">
                        <div className="flex flex-col gap-6">
                            <Image
                                src="/images/logo.svg"
                                alt="KNR COM & Digital"
                                width={180}
                                height={90}
                                className="w-40"
                            />
                            <p className="text-zinc-400 text-base font-normal font-['Inter'] leading-7">
                                Le média digital qui connecte les talents, valorise les entrepreneurs et inspire la jeunesse africaine.
                            </p>
                        </div>
                        <div className="flex items-center gap-5">
                            {socialIcons.map(({ label, path }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    className="text-zinc-400 hover:text-white hover:scale-110 transition-all"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d={path} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 — Activités */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-white text-lg font-bold font-['Sora'] leading-6">Activités</h4>
                        <div className="flex flex-col gap-5">
                            {footerLinks.activites.map((l) => (
                                <Link
                                    key={l.label}
                                    href={l.href}
                                    className="text-zinc-400 text-base font-normal font-['Inter'] leading-5 hover:text-sky-400 transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 3 — Services */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-white text-lg font-bold font-['Inter'] leading-6">Services</h4>
                        <div className="flex flex-col gap-5">
                            {footerLinks.services.map((l) => (
                                <Link
                                    key={l.label}
                                    href={l.href}
                                    className="text-zinc-400 text-base font-normal font-['Inter'] leading-5 hover:text-sky-400 transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 4 — Newsletter */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <h4 className="text-white text-lg font-bold font-['Inter'] leading-6">Newsletter</h4>
                            <p className="text-zinc-400 text-base font-normal font-['Inter'] leading-7">
                                Recevez nos dernières actualités et invitations exclusives.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-stone-300 text-sm font-bold font-['Inter']">Votre email</label>
                            <input
                                type="email"
                                placeholder="addressemail@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-10 px-3 py-2 bg-white rounded-md text-stone-400 text-sm font-normal font-['Inter'] outline-none focus:ring-2 focus:ring-sky-400 transition-all"
                            />
                            <button
                                onClick={() => setEmail("")}
                                className="w-full h-10 bg-sky-400 rounded-md text-white text-sm font-medium font-['Inter'] hover:bg-sky-500 transition-colors cursor-pointer"
                            >
                                S&apos;abonner
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm font-normal font-['Inter']">
                        © 2026 KNR COM &amp; Digital. Tous droits réservés.
                    </p>
                    <p className="text-gray-500 text-sm font-normal font-['Inter']">
                        © Design by{" "}
                        <span className="underline cursor-pointer hover:text-gray-300 transition-colors">
                            Médard GASSOU
                        </span>
                    </p>
                    <div className="flex items-center gap-8">
                        {["Mentions Légales", "Politique de Confidentialité", "CGU"].map((t) => (
                            <a key={t} href="#" className="text-gray-500 text-sm font-normal font-['Inter'] hover:text-gray-300 transition-colors">
                                {t}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
