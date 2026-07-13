"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion, AnimatePresence, type MotionProps } from "framer-motion";

type MotionDivProps = MotionProps & { className?: string; style?: React.CSSProperties };
import {
  Tv2, Megaphone, GraduationCap, Video, Camera, Mic,
  ArrowUpRight, Play, MonitorPlay, ChevronRight, ChevronDown, Shield, Palette, Lightbulb, Zap, Star, Globe,
} from "lucide-react";

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: "easeOut", delay },
});

const fadeIn = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
});

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/hero-cover.png" alt="KNR Studio" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-[1560px] mx-auto px-5 sm:px-8 pt-40 md:pt-52 pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        {/* Left */}
        <motion.div {...fadeUp(0.1)} className="flex flex-col gap-7 w-full md:max-w-[680px]">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "/images/circle1.png",
                "/images/circle2.jpg",
                "/images/circle3.jpg",
                "/images/circle4.jpg",
              ].map((src, i) => (
                <Image key={i} src={src} alt="" width={56} height={56}
                  className="rounded-full border-[3px] border-white w-10 h-10 md:w-14 md:h-14 object-cover" />
              ))}
            </div>
            <span className="text-white text-sm md:text-base font-normal font-['Poppins']">+25 Entrepreneurs interviewés</span>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black font-['Poppins'] leading-[1.1]">
              La voix des talents <br className="hidden sm:block" />et entreprises Africaines
            </h1>
            <p className="text-neutral-200 text-base md:text-xl font-medium font-['Poppins'] leading-8 max-w-[620px]">
              KNR COM est un écosystème complet alliant Web TV, studio podcast, agence marketing et centre de formation pour propulser votre visibilité et vos compétences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="px-7 py-3.5 bg-sky-400 rounded-full border border-white text-white text-sm md:text-base font-semibold font-['Poppins'] hover:bg-sky-500 hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Collaborer avec nous
            </button>
            <button className="h-12 md:h-14 px-7 rounded-full border border-cyan-100 flex items-center gap-2 text-white text-sm md:text-base font-medium font-['Poppins'] hover:bg-white/10 transition-all cursor-pointer">
              Voir nos émissions <Play className="w-3.5 h-3.5 fill-white text-white" />
            </button>
          </div>
        </motion.div>

        {/* Right card */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col items-center gap-4 w-full md:w-auto md:min-w-[400px] md:max-w-[491px]">
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <MonitorPlay className="w-5 h-5 text-white" />
              <span className="text-white text-base md:text-xl font-medium font-['Poppins']">Notre émission à la une</span>
            </div>
            <div className="w-full rounded-2xl bg-white overflow-hidden"
              style={{ boxShadow: "0 4px 14px 0 rgba(41,182,232,0.53), 0 0 0 2px rgba(186,230,255,0.8)" }}>
              <div className="relative m-3 rounded-[10px] overflow-hidden">
                <Image src="/images/imglecteur.svg" alt="Émission" width={464} height={277} className="w-full object-cover" loading="eager" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-3xl border border-neutral-400 hover:scale-105 transition-transform cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
                    <Play className="w-4 h-4 fill-white text-white" />
                    <span className="text-white text-sm font-medium font-['Poppins']">Regarder</span>
                  </button>
                </div>
              </div>
              <div className="px-4 pb-4 pt-1 flex flex-wrap items-center gap-4">
                <a href="#" className="flex items-center gap-1 text-neutral-600 text-sm font-medium font-['Poppins'] underline hover:text-sky-500 transition-colors">
                  Réserver le studio <ArrowUpRight className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-1 text-neutral-600 text-sm font-medium font-['Poppins'] underline hover:text-sky-500 transition-colors">
                  Découvrir les formations <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
          {/* Social icons */}
          <div className="flex items-center gap-5">
            {[
              { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              { label: "TikTok", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" },
              { label: "WhatsApp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" },
              { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
            ].map(({ label, path }) => (
              <a key={label} href="#" className="text-white hover:text-sky-400 hover:scale-110 transition-all" aria-label={label}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── STATS BAND ──────────────────────────────────────────────────────────────
function StatsBand() {
  const stats = [
    { value: "10+", label: "Années d'expérience" },
    { value: "500+", label: "Productions réalisées" },
    { value: "2000+", label: "Apprenants formés" },
    { value: "150+", label: "Partenaires & Clients" },
  ];
  return (
    <div className="relative w-full py-14 bg-gradient-to-r from-neutral-950 to-neutral-500 border-t border-b border-white/10 overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 -top-36 w-[930px] h-96 bg-sky-400/20 rounded-full blur-[117px] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i * 0.1)} className="flex flex-col items-center text-center gap-2">
            <span className="text-white text-5xl md:text-7xl font-bold font-['Poppins'] leading-tight">{s.value}</span>
            <span className="text-gray-400 text-base md:text-lg font-medium font-['Poppins']">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── NOS ACTIVITÉS ───────────────────────────────────────────────────────────
const activities = [
  { icon: <Tv2 className="w-7 h-7 text-sky-400" />, title: "Web TV", desc: "Émissions, talk-shows, interviews et magazines pour valoriser l'Afrique qui avance." },
  { icon: <Megaphone className="w-7 h-7 text-sky-400" />, title: "Agence Com & Marketing", desc: "Stratégie, branding, social media et campagnes pour faire grandir votre marque." },
  { icon: <GraduationCap className="w-7 h-7 text-sky-400" />, title: "Centre de Formations", desc: "Formations pratiques en audiovisuel, communication, marketing digital et plus." },
  { icon: <Video className="w-7 h-7 text-sky-400" />, title: "Production Audiovisuelle", desc: "Films d'entreprise, clips, documentaires, captations événementielles." },
  { icon: <Camera className="w-7 h-7 text-sky-400" />, title: "Location d'Équipements", desc: "Caméras, éclairage, son, fond vert — du matériel pro à votre disposition." },
  { icon: <Mic className="w-7 h-7 text-sky-400" />, title: "Studio Podcast", desc: "Un studio professionnel pour produire et diffuser des podcasts de qualité." },
];

function ActivitiesSection() {
  return (
    <section className="relative w-full bg-gray-50 py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("/images/vector.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
      <div className="absolute pointer-events-none opacity-60" style={{ width: 900, height: 900, right: -200, top: -200, background: "rgba(56,189,248,0.06)", borderRadius: "50%", filter: "blur(80px)" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8">
        <motion.div {...fadeUp()} className="flex flex-col items-center gap-6 mb-14 text-center">
          <span className="text-sky-400 text-base md:text-lg font-semibold font-['Poppins'] tracking-wide">Nos Activités</span>
          <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold font-['Poppins'] leading-tight max-w-[774px]">
            Un écosystème complet pour votre communication
          </h2>
          <p className="text-gray-600 text-base md:text-xl font-normal font-['Poppins'] leading-7 max-w-[750px]">
            De la production de contenus à la formation, nous vous accompagnons avec des solutions sur mesure et professionnelles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a, i) => (
            <motion.article key={a.title} {...fadeUp(i * 0.08)}
              className="bg-white rounded-2xl p-6 md:p-8 flex flex-col gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              style={{ boxShadow: "0 12px 26px 0 rgba(0,0,0,0.08)", outline: "2px solid rgba(56,189,248,0.2)", outlineOffset: "-2px" }}>
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sky-400/10 transition-colors">
                {a.icon}
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-gray-900 text-xl font-bold font-['Poppins']">{a.title}</h3>
                <p className="text-gray-600 text-base md:text-lg font-normal font-['Poppins'] leading-6">{a.desc}</p>
                <a href="#" className="flex items-center gap-2 text-sky-400 text-base md:text-lg font-normal font-['Poppins'] hover:gap-3 transition-all w-fit mt-1">
                  En savoir plus <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── KNR WEB TV ──────────────────────────────────────────────────────────────
const tvShows = [
  { title: "Tech Talk", sub: "L'innovation au quotidien", episodes: "11 épisodes", img: "/images/webtv2.png" },
  { title: "Culture & Création", sub: "L'art sous toutes ses formes", episodes: "11 épisodes", img: "/images/webtv3.png" },
  { title: "Tech Talk", sub: "L'innovation au quotidien", episodes: "11 épisodes", img: "/images/webtv4.png" },
];

function WebTVSection() {
  return (
    <section className="relative w-full bg-neutral-950 py-16 overflow-hidden">
      <div className="max-w-[1558px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div {...fadeUp()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-4 max-w-[800px]">
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] leading-tight">
              KNR Web TV —{" "}
              <span className="text-sky-400">l'Afrique qui inspire.</span>
            </h2>
            <p className="text-gray-400 text-base md:text-xl font-normal font-['Poppins'] leading-7 max-w-[580px]">
              Découvrez nos émissions, documentaires et interviews exclusives mettant en lumière les talents et initiatives du continent.
            </p>
          </div>
          <button className="flex-shrink-0 h-12 md:h-14 px-6 md:px-8 rounded-full border border-cyan-100 text-white text-sm md:text-base font-medium font-['Poppins'] hover:bg-white/10 hover:scale-105 transition-all cursor-pointer">
            Voir tous les programmes
          </button>
        </motion.div>

        {/* Grid: big left + 3 small right */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Featured big */}
          <motion.div {...fadeUp(0.1)} className="relative w-full lg:w-[60%] rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[500px]">
            <Image src="/images/webtv1.png" alt="Business Africa" fill className="object-cover" />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
                <Play className="w-8 h-8 fill-white text-white ml-1" />
              </button>
            </div>
            {/* Labels */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-3">
              <span className="inline-flex px-4 py-1.5 bg-sky-400 rounded-md text-white text-sm font-bold font-['Poppins'] tracking-wide w-fit">
                À la une
              </span>
              <div>
                <p className="text-white text-2xl md:text-3xl font-bold font-['Poppins']">Business Africa</p>
                <p className="text-gray-300 text-base md:text-lg font-normal font-['Poppins']">Les leaders qui transforment le continent</p>
              </div>
            </div>
          </motion.div>

          {/* 3 small cards */}
          <div className="flex flex-col gap-4 w-full lg:w-[39%]">
            {tvShows.map((show, i) => (
              <motion.div key={show.title + i} {...fadeUp(0.1 + i * 0.1)}
                className="relative rounded-2xl overflow-hidden h-[148px] sm:h-[155px] lg:h-[155px] group cursor-pointer hover:scale-[1.02] transition-transform">
                <Image src={show.img} alt={show.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white text-lg font-bold font-['Poppins']">{show.title}</p>
                      <p className="text-gray-300 text-sm font-normal font-['Poppins']">{show.sub}</p>
                    </div>
                    <p className="text-sky-400 text-xs font-medium font-['Poppins'] flex-shrink-0 ml-3">{show.episodes}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── KNR SPOTLIGHT ───────────────────────────────────────────────────────────
const entrepreneurs = [
  { name: "Ibrahim Bah Zakkarih", role: "Fondateur & CEO, Entrepreneur", featured: false, img: "/images/entrepreneur1.jpg" },
  { name: "Entrepreneur 2", role: "CEO, Innovateur", featured: false, img: "/images/entrepreneur2.jpg" },
  { name: "Entrepreneur 3", role: "Fondateur, Créateur", featured: false, img: "/images/entrepreneur3.jpg" },
  { name: "Entrepreneur 4", role: "Directeur, Leader", featured: false, img: "/images/entrepreneur4.png" },
];

const socialIcons = [
  { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "TikTok", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" },
  { label: "WhatsApp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" },
  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
];

function SpotlightSection() {
  return (
    <section className="relative w-full bg-white py-20 overflow-hidden">
      <div className="max-w-[1580px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div {...fadeUp()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-4 max-w-[768px]">
            <span className="text-sky-400 text-base font-bold font-['Poppins'] tracking-wide">KNR Spotlight</span>
            <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] leading-tight">
              Les entrepreneurs qui font bouger l'Afrique
            </h2>
            <p className="text-gray-600 text-base md:text-xl font-normal font-['Poppins'] leading-7">
              Découvrez les parcours inspirants des leaders et créateurs qui transforment le continent à travers nos interviews exclusives.
            </p>
          </div>
          <button className="flex-shrink-0 h-12 px-6 rounded-full border-2 border-zinc-400 text-zinc-600 text-sm md:text-base font-medium font-['Inter'] hover:border-sky-400 hover:text-sky-400 transition-all cursor-pointer">
            Découvrir tous les entrepreneurs
          </button>
        </motion.div>

        {/* Desktop: flex cards with expand on hover */}
        <div className="hidden md:flex gap-4 h-[480px] lg:h-[520px]">
          {entrepreneurs.map((e, i) => (
            <motion.div
              key={e.name + i}
              {...fadeIn(i * 0.1)}
              className="relative rounded-[32px] overflow-hidden cursor-pointer flex-shrink-0 group"
              style={{ flex: e.featured ? "2 1 0" : "1 1 0", minWidth: 0 }}
              whileHover={{ flex: "2.5 1 0" } as any}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={e.img}
                alt={e.name} fill className="object-cover"
              />
              {/* Blue attenuted gradient from bottom — like design */}
              <div className="absolute inset-0 bg-gradient-to-t from-sky-500/50 via-sky-400/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

              {/* KNR watermark logo (white cross icon, centered bottom) — shown on all cards by default */}
              <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 ${e.featured ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}>
                <Image src="/images/vector.svg" alt="" width={40} height={40} className="w-10 h-10" />
              </div>

              {/* Info — always visible on featured, visible on hover for others */}
              <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 ${e.featured ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"}`}>
                <p className="text-white text-xl font-bold font-['Poppins'] text-center">{e.name}</p>
                <p className="text-gray-200 text-sm font-normal font-['Poppins'] text-center mb-3">{e.role}</p>
                <div className="flex items-center justify-center gap-3">
                  {socialIcons.map(({ label, path }) => (
                    <a key={label} href="#" aria-label={label}
                      className="text-white/70 hover:text-white hover:scale-110 transition-all">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical stack, all visible */}
        <div className="flex flex-col gap-4 md:hidden">
          {entrepreneurs.map((e, i) => (
            <motion.div key={e.name + "m" + i} {...fadeUp(i * 0.1)}
              className="relative rounded-[24px] overflow-hidden h-64 cursor-pointer">
              <Image src={e.img} alt={e.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-500/50 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white text-lg font-bold font-['Poppins'] text-center">{e.name}</p>
                <p className="text-gray-200 text-sm font-normal font-['Poppins'] text-center mb-2">{e.role}</p>
                <div className="flex items-center justify-center gap-3">
                  {socialIcons.map(({ label, path }) => (
                    <a key={label} href="#" aria-label={label} className="text-white/70 hover:text-white transition-all">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STUDIO PODCAST ──────────────────────────────────────────────────────────
const podcastEps = [
  { ep: "EP 01", title: "L'avenir du marketing digital en Afrique", guest: "Avec Sarah Diop", duration: "45:20" },
  { ep: "EP 02", title: "L'avenir du marketing digital en Afrique", guest: "Avec Sarah Diop", duration: "45:20" },
  { ep: "EP 03", title: "L'avenir du marketing digital en Afrique", guest: "Avec Sarah Diop", duration: "45:20" },
];

function PodcastSection() {
  return (
    <section className="relative w-full bg-zinc-950 py-20 overflow-hidden">
      {/* BG image (microphone) */}
      <div className="absolute inset-0">
        <Image src="/images/image.svg" alt="" fill className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-l from-stone-950 via-black/75 to-stone-950/0" />
      </div>
      {/* Wave SVG overlay */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]">
        <svg viewBox="0 0 1728 410" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path opacity="0.5" d="M0 111C172.6 259 345.2 259 517.8 111C690.4 -37 863 -37 1035.6 111C1208.2 259 1380.8 259 1553.4 111C1726 -37 1783.53 -37 1726 111V481H0V111Z" fill="rgba(41,182,232,0.2)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1558px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* Left text */}
          <motion.div {...fadeUp()} className="flex flex-col gap-8 w-full lg:max-w-[600px]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-[20px] w-fit">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
              <span className="text-black text-base font-medium font-['Poppins']">Studio Podcast</span>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] leading-tight">
                Des conversations qui{" "}
                <span className="text-sky-400">résonnent.</span>
              </h2>
              <p className="text-zinc-100 text-base md:text-xl font-normal font-['Poppins'] leading-7">
                Plongez dans des discussions profondes avec les acteurs du changement. Notre studio professionnel produit des podcasts captivants pour inspirer et informer.
              </p>
            </div>

            <Link
              href="/studio"
              className="flex items-center gap-2 px-8 py-4 bg-sky-400 rounded-full border border-white text-white text-base font-semibold font-['Poppins'] hover:bg-sky-500 hover:scale-105 active:scale-95 transition-all cursor-pointer w-fit">
              Réserver le studio
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right: episode list */}
          <div className="flex flex-col gap-4 w-full lg:flex-1">
            {podcastEps.map((ep, i) => (
              <motion.div key={ep.ep + i} {...fadeUp(0.15 + i * 0.1)}
                className="flex items-center gap-5 p-5 hover:bg-gray-800/30 transition-colors cursor-pointer group"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "40px",
                }}>
                {/* Play button */}
                <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center bg-white/10 group-hover:bg-sky-400/20 transition-colors">
                  <Play className="w-5 h-5 text-gray-400 fill-gray-400 group-hover:text-sky-400 group-hover:fill-sky-400 transition-colors ml-0.5" />
                </div>
                {/* Info */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-gray-500 text-sm font-bold font-['Poppins']">{ep.ep}</span>
                    <span className="text-white text-base md:text-xl font-bold font-['Poppins'] leading-tight truncate">{ep.title}</span>
                  </div>
                  <span className="text-gray-400 text-base font-normal font-['Poppins']">{ep.guest}</span>
                </div>
                {/* Duration */}
                <span className="text-gray-500 text-base font-medium font-['Poppins'] flex-shrink-0">{ep.duration}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CENTRE DE FORMATIONS ─────────────────────────────────────────────────────
const formations = [
  { title: "Résine époxy", duration: "3 Jours", level: "Débutant à Intermédiaire", desc: "Émissions, talk-shows, interviews et magazines pour valoriser l'Afrique qui avance." },
  { title: "Résine époxy", duration: "3 Jours", level: "Débutant à Intermédiaire", desc: "Émissions, talk-shows, interviews et magazines pour valoriser l'Afrique qui avance." },
  { title: "Résine époxy", duration: "3 Jours", level: "Débutant à Intermédiaire", desc: "Émissions, talk-shows, interviews et magazines pour valoriser l'Afrique qui avance." },
  { title: "Résine époxy", duration: "3 Jours", level: "Débutant à Intermédiaire", desc: "Émissions, talk-shows, interviews et magazines pour valoriser l'Afrique qui avance." },
  { title: "Résine époxy", duration: "3 Jours", level: "Débutant à Intermédiaire", desc: "Émissions, talk-shows, interviews et magazines pour valoriser l'Afrique qui avance." },
  { title: "Résine époxy", duration: "3 Jours", level: "Débutant à Intermédiaire", desc: "Émissions, talk-shows, interviews et magazines pour valoriser l'Afrique qui avance." },
];

function FormationsSection() {
  return (
    <section className="relative w-full bg-gray-50 py-20 overflow-hidden">
      {/* Cross pattern background — même que Nos Activités */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("/images/vector.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Decorative rotated diamond shapes (top-right, bottom-left) */}
      <div className="absolute top-10 right-10 w-64 h-64 pointer-events-none opacity-30"
        style={{ background: "rgba(56,189,248,0.08)", transform: "rotate(45deg)", borderRadius: "16px" }} />
      <div className="absolute bottom-10 left-10 w-48 h-48 pointer-events-none opacity-20"
        style={{ background: "rgba(56,189,248,0.08)", transform: "rotate(45deg)", borderRadius: "12px" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div {...fadeUp()} className="flex flex-col items-center gap-6 mb-14 text-center">
          <span className="text-sky-400 text-base md:text-lg font-bold font-['Poppins'] tracking-wide">
            Centre de Formations Professionnelles
          </span>
          <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold font-['Poppins'] leading-tight max-w-[700px]">
            Développez les compétences de demain
          </h2>
          <p className="text-gray-600 text-base md:text-xl font-normal font-['Inter'] leading-7 max-w-[700px]">
            Des formations pratiques, encadrées par des professionnels du secteur, pour vous préparer aux métiers de l'audiovisuel et de la communication.
          </p>
        </motion.div>

        {/* 3×2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((f, i) => (
            <motion.article key={f.title + i} {...fadeUp(i * 0.08)}
              className="bg-white rounded-2xl p-6 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              style={{
                boxShadow: "0 12px 26px 0 rgba(0,0,0,0.07)",
                outline: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              {/* Top row: title + duration badge */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-gray-900 text-xl font-bold font-['Poppins']">{f.title}</h3>
                <div className="flex-shrink-0 flex items-center gap-1.5 h-7 px-2.5 py-1 bg-white rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.18)]">
                  <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-gray-600 text-sm font-normal font-['Poppins']">{f.duration}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-base font-normal font-['Poppins'] leading-6 flex-1">{f.desc}</p>

              {/* Level */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="1" y="16" width="4" height="6" rx="1" />
                  <rect x="8" y="11" width="4" height="11" rx="1" />
                  <rect x="15" y="6" width="4" height="16" rx="1" />
                </svg>
                <span className="text-gray-600 text-sm font-normal font-['Poppins']">{f.level}</span>
              </div>

              {/* Button */}
              <button className="w-full mt-2 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-gray-900 text-sm font-normal font-['Poppins'] hover:bg-gray-50 hover:border-sky-300 hover:text-sky-500 transition-all cursor-pointer">
                Voir les détails
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NOTRE ÉQUIPE ────────────────────────────────────────────────────────────
const teamMembers = [
  {
    name: "Alisa Hester",
    role: "Founder & CEO",
    bio: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
    socials: ["twitter", "linkedin", "dribbble"],
    img: "/images/equipe1.png"
  },
  {
    name: "Rich Wilson",
    role: "Engineering Manager",
    bio: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
    socials: ["twitter", "linkedin", "dribbble"],
    img: "/images/equipe2.png"
  },
  {
    name: "Annie Stanley",
    role: "Product Manager",
    bio: "Former PM for Airtable, Medium, Ghost, and Lumi.",
    socials: ["twitter", "linkedin", "dribbble"],
    img: "/images/equipe3.png"
  },
  {
    name: "Johnny Bell",
    role: "Frontend Developer",
    bio: "Former frontend dev for Linear, Coinbase, and Postscript.",
    socials: ["twitter", "linkedin", "dribbble"],
    img: "/images/equipe4.png"
  },
];

const twitterPath = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const linkedinPath = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const dribbblePath = "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.015.248c0 2.272.87 4.35 2.28 5.932zm-2.i44-7.477c.46.008 4.783.074 9.016-1.192-1.616-2.868-3.352-5.277-3.6-5.607-2.515 1.187-4.352 3.483-5.276 6.8zM9.6 2.052c.282.38 2.145 2.914 3.748 5.657 3.571-1.336 5.08-3.365 5.26-3.61C16.85 2.57 14.507 1.5 12 1.5c-.814 0-1.6.109-2.4.308zm8.557 1.99c-.228.263-1.886 2.476-5.585 4.022.235.48.456.96.67 1.44.084.196.166.39.243.583 3.35-.422 6.674.322 7.02.403-.076-2.368-.93-4.54-2.35-6.448z";

function TeamSection() {
  const socialIconPaths: Record<string, string> = {
    twitter: twitterPath,
    linkedin: linkedinPath,
    dribbble: dribbblePath,
  };

  return (
    <section className="relative w-full bg-neutral-950 py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div {...fadeUp()} className="flex flex-col items-center gap-6 mb-14 text-center">
          <span className="text-sky-400 text-base font-bold font-['Poppins'] tracking-wide">Notre équipe</span>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] leading-tight">
            Une équipe passionnée à votre service
          </h2>
          <p className="text-white text-base md:text-xl font-normal font-['Poppins'] leading-7 max-w-[680px]">
            Des experts de l'audiovisuel, du marketing et de la formation réunis pour donner vie à vos projets les plus ambitieux.
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div key={member.name} {...fadeUp(i * 0.1)}
              className="relative overflow-hidden group cursor-pointer"
              style={{ height: "360px" }}
            >
              {/* Photo */}
              <Image
                src={member.img}
                alt={member.name} fill className="object-cover"
              />

              {/* Frosted glass overlay — bottom half */}
              <div className="absolute bottom-0 left-0 right-0"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                  padding: "16px 16px 16px 16px",
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-white text-lg font-bold font-['Poppins']">{member.name}</p>
                  <a href="#" className="text-white/80 hover:text-sky-400 transition-colors ml-2 flex-shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-white font-bold text-sm font-['Poppins'] mb-1">{member.role}</p>
                <p className="text-white/70 text-xs font-normal font-['Poppins'] mb-3 leading-4">{member.bio}</p>
                {/* Social icons */}
                <div className="flex items-center gap-3">
                  {member.socials.map((s) => (
                    <a key={s} href="#" aria-label={s}
                      className="text-white/60 hover:text-white hover:scale-110 transition-all">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d={socialIconPaths[s]} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NOTRE AMBITION ───────────────────────────────────────────────────────────
function AmbitionSection() {
  return (
    <section className="relative w-full bg-neutral-950 py-20 overflow-hidden">

      {/* Glow blob behind logo */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          left: "5%",
          top: "10%",
          background: "rgba(56,189,248,0.08)",
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: big KNR logo */}
          <motion.div {...fadeIn(0.1)} className="flex-shrink-0 flex flex-col items-center justify-center w-full lg:w-[420px]">
            <Image
              src="/images/logo.svg"
              alt="KNR COM & Digital"
              width={320}
              height={160}
              className="w-full max-w-[300px] md:max-w-[380px]"
            />
          </motion.div>

          {/* Right: texts */}
          <motion.div {...fadeUp(0.15)} className="flex flex-col gap-8 flex-1">
            <div className="flex flex-col gap-4">
              <span className="text-sky-400 text-base font-bold font-['Poppins'] tracking-wide">Notre Ambition</span>
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold font-['Poppins'] leading-tight">
                Devenir la référence africaine des médias et de la communication.
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              <p className="text-gray-400 text-base md:text-xl font-normal font-['Poppins'] leading-7">
                KNR COM est née d'une vision forte : celle de valoriser les talents, les entrepreneurs, les entreprises et les initiatives qui font bouger l'Afrique.
              </p>
              <p className="text-gray-400 text-base md:text-xl font-normal font-['Poppins'] leading-7">
                À travers nos émissions, nos podcasts, nos formations et nos services d'agence, nous accompagnons les acteurs du continent dans le développement de leur visibilité et de leurs compétences, avec une exigence constante de qualité.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-16 pt-4 border-t border-white/10">
              <div className="flex flex-col gap-1">
                <span className="text-white text-4xl font-bold font-['Poppins']">100%</span>
                <span className="text-sky-400 text-base font-medium font-['Poppins']">Engagement Africain</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white text-4xl font-bold font-['Poppins']">360°</span>
                <span className="text-sky-400 text-base font-medium font-['Poppins']">Approche Globale</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── NOS VALEURS FONDAMENTALES ───────────────────────────────────────────────
const valeurs = [
  {
    icon: <Shield className="w-6 h-6 text-sky-400" />,
    title: "Professionnalisme",
    desc: "Une exigence de qualité dans chaque production.",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-sky-400" />,
    title: "Innovation",
    desc: "Des formats modernes et des idées novatrices.",
  },
  {
    icon: <Star className="w-6 h-6 text-sky-400" />,
    title: "Excellence",
    desc: "Le dépassement de soi comme standard.",
  },
  {
    icon: <Palette className="w-6 h-6 text-sky-400" />,
    title: "Créativité",
    desc: "L'art de raconter des histoires captivantes.",
  },
  {
    icon: <Zap className="w-6 h-6 text-sky-400" />,
    title: "Dynamisme",
    desc: "Une énergie au service de vos projets.",
  },
  {
    icon: <Globe className="w-6 h-6 text-sky-400" />,
    title: "Leadership africain",
    desc: "Fiers de porter la voix du continent.",
  },
];

function ValeursSection() {
  return (
    <section className="relative w-full bg-white py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <motion.h2
          {...fadeUp()}
          className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold font-['Poppins'] text-center mb-14"
        >
          Nos valeurs fondamentales
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-10">
          {valeurs.map((v, i) => (
            <motion.div
              key={v.title}
              {...fadeUp(i * 0.07)}
              className="flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-400/15 transition-colors">
                {v.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-gray-900 text-lg font-bold font-['Poppins']">{v.title}</h3>
                <p className="text-gray-600 text-base font-normal font-['Poppins'] leading-6">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqCategories = [
  {
    id: "knrcom",
    label: "KNR COM",
    questions: [
      {
        q: "Qu'est-ce que KNR COM & Digital ?",
        a: "KNR COM & Digital est un écosystème média complet basé en Afrique, alliant Web TV, studio podcast, agence marketing et centre de formation. Notre mission : valoriser les talents, entrepreneurs et initiatives qui font avancer le continent africain.",
      },
      {
        q: "Qui peut collaborer avec KNR COM ?",
        a: "Toute entreprise, institution, ONG ou entrepreneur souhaitant accroître sa visibilité en Afrique peut collaborer avec nous. Nous travaillons aussi bien avec des startups qu'avec de grandes organisations.",
      },
      {
        q: "Quels types de contenus produit KNR COM ?",
        a: "Nous produisons des émissions TV, des podcasts, des documentaires, des clips d'entreprise, des captations événementielles, ainsi que des contenus pour les réseaux sociaux.",
      },
      {
        q: "KNR COM est-il présent en dehors du Bénin ?",
        a: "Oui, bien qu'ancré au Bénin, KNR COM rayonne sur toute l'Afrique francophone et collabore avec des partenaires dans plusieurs pays du continent.",
      },
      {
        q: "Comment contacter KNR COM pour un projet ?",
        a: "Vous pouvez nous contacter via le formulaire sur notre site, par email ou directement via notre page Instagram ou WhatsApp Business. Notre équipe vous répondra dans les 24h.",
      },
    ],
  },
  {
    id: "formations",
    label: "Formations",
    questions: [
      {
        q: "Quelles formations proposez-vous ?",
        a: "Nous proposons des formations en audiovisuel (prise de vue, montage, éclairage), communication digitale, marketing des réseaux sociaux, podcasting, création de contenu et gestion de marque personnelle.",
      },
      {
        q: "Les formations sont-elles accessibles aux débutants ?",
        a: "Absolument. Nos formations sont conçues pour tous les niveaux : débutant, intermédiaire et avancé. Chaque programme indique clairement le niveau requis.",
      },
      {
        q: "Obtient-on un certificat à la fin d'une formation ?",
        a: "Oui, chaque formation validée donne lieu à la délivrance d'un certificat KNR COM reconnu par les professionnels du secteur en Afrique.",
      },
      {
        q: "Les formations se font-elles en présentiel ou en ligne ?",
        a: "Nous proposons les deux formats. Les formations pratiques (caméra, studio) se font en présentiel dans nos locaux. Les formations théoriques sont disponibles en ligne sur notre plateforme.",
      },
      {
        q: "Comment s'inscrire à une formation ?",
        a: "L'inscription se fait directement sur notre site en cliquant sur 'Voir les détails' de la formation choisie, ou en nous contactant directement via WhatsApp.",
      },
      {
        q: "Proposez-vous des formations sur mesure pour les entreprises ?",
        a: "Oui, nous concevons des programmes de formation personnalisés pour les équipes communication et marketing des entreprises. Contactez-nous pour un devis.",
      },
    ],
  },
  {
    id: "studio",
    label: "Studio",
    questions: [
      {
        q: "Qu'est-ce qui est inclus dans la location du studio podcast ?",
        a: "La location comprend l'accès à notre studio insonorisé équipé, les microphones professionnels, la console de mixage, l'éclairage scénique, l'ingénieur du son sur place, et la livraison du fichier audio masterisé.",
      },
      {
        q: "Quelle est la durée minimale de réservation du studio ?",
        a: "La durée minimale est de 2 heures. Nous proposons des créneaux demi-journée (4h) et journée complète (8h) à des tarifs préférentiels.",
      },
      {
        q: "Peut-on filmer dans le studio podcast ?",
        a: "Oui, notre studio est équipé pour les enregistrements vidéo également. Nous proposons une option vidéo avec plusieurs angles de caméra pour un rendu professionnel.",
      },
      {
        q: "Faut-il venir avec ses propres équipements ?",
        a: "Non, tout le matériel nécessaire est fourni. Si vous souhaitez utiliser votre propre équipement, c'est également possible après validation technique.",
      },
      {
        q: "Comment réserver le studio ?",
        a: "Réservez en ligne via notre formulaire ou par WhatsApp. Un acompte de 30% est demandé pour confirmer la réservation.",
      },
    ],
  },
  {
    id: "location",
    label: "Location",
    questions: [
      {
        q: "Quels équipements peut-on louer chez KNR COM ?",
        a: "Nous proposons à la location : caméras professionnelles (Sony FX3, Canon R5C), drones DJI (Mavic 3 Pro, Mini 4 Pro), objectifs photo/vidéo, stabilisateurs Gimbal, éclairages LED professionnels, micros HF et boom, trépieds et sliders, fond vert et noir, ainsi que du matériel de captation événementielle.",
      },
      {
        q: "Faut-il avoir de l'expérience pour louer du matériel ?",
        a: "Pour certains équipements sensibles (drones, caméras haut de gamme), une vérification de compétences peut être requise. Nous proposons aussi des forfaits avec technicien inclus.",
      },
      {
        q: "Quelle est la durée minimale de location ?",
        a: "La durée minimale est d'une journée (8h). Des tarifs dégressifs s'appliquent pour les locations de plusieurs jours.",
      },
      {
        q: "Une caution est-elle demandée ?",
        a: "Oui, une caution est exigée pour tout équipement loué. Son montant varie selon la valeur du matériel. Elle est restituée dans son intégralité à la restitution du matériel en bon état.",
      },
      {
        q: "Livrez-vous le matériel sur place ?",
        a: "Oui, nous proposons la livraison et la récupération du matériel sur vos lieux de tournage à Cotonou et ses environs, avec des frais additionnels selon la distance.",
      },
      {
        q: "Que se passe-t-il en cas de dommage sur le matériel loué ?",
        a: "En cas de dommage, les frais de réparation ou de remplacement sont à la charge du locataire et prélevés sur la caution. Nous vous conseillons de souscrire une assurance événementielle.",
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    questions: [
      {
        q: "Quels services d'agence proposez-vous ?",
        a: "Notre agence propose : stratégie de communication, création de contenu, gestion des réseaux sociaux, publicité digitale, branding et identité visuelle, production de spots publicitaires et sponsoring d'émissions.",
      },
      {
        q: "Comment fonctionne le sponsoring d'émissions ?",
        a: "Les marques peuvent sponsoriser nos émissions et podcasts. Cela inclut la mention de la marque, des spots intégrés, des segments dédiés ou des partenariats éditoriaux selon le package choisi.",
      },
      {
        q: "Proposez-vous la gestion complète des réseaux sociaux ?",
        a: "Oui, nous offrons un service de community management complet : création de contenu, calendrier éditorial, animation de la communauté, reporting mensuel et optimisation de la stratégie.",
      },
      {
        q: "Peut-on commander une vidéo d'entreprise uniquement ?",
        a: "Absolument. Nous réalisons des films d'entreprise, reportages, présentations de produits, interviews corporate et captations événementielles sur commande.",
      },
    ],
  },
  {
    id: "paiement",
    label: "Paiement",
    questions: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons les paiements par Mobile Money (MTN, Moov), virement bancaire, paiement en espèces pour les montants inférieurs à 500 000 FCFA, ainsi que par carte bancaire via notre terminal de paiement.",
      },
      {
        q: "Un acompte est-il requis pour confirmer une commande ?",
        a: "Oui, un acompte de 30% à 50% selon la prestation est requis pour toute réservation. Le solde est dû à la livraison ou à la fin de la prestation.",
      },
      {
        q: "Proposez-vous des facilités de paiement ?",
        a: "Oui, pour les formations et certains services, nous proposons un paiement en plusieurs tranches sur entente préalable avec notre équipe commerciale.",
      },
      {
        q: "Les prix incluent-ils la TVA ?",
        a: "Nos tarifs affichés sont hors taxes. La TVA applicable (18% au Bénin) est ajoutée sur la facture finale. Nous fournissons des factures officielles pour toutes les transactions.",
      },
      {
        q: "Quelle est votre politique de remboursement ?",
        a: "En cas d'annulation plus de 48h avant la prestation, l'acompte est remboursé à 80%. En dessous de 48h, l'acompte est retenu. Les formations commencées ne sont pas remboursables.",
      },
    ],
  },
];

function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("knrcom");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const currentQuestions =
    faqCategories.find((c) => c.id === activeCategory)?.questions ?? [];

  return (
    <section className="relative w-full bg-white py-20 overflow-hidden">
      {/* Cross pattern background — same as Activités */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("/images/vector.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 max-w-[1024px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div {...fadeUp()} className="flex flex-col items-center gap-4 mb-10 text-center">
          <span className="text-sky-400 text-base font-bold font-['Poppins'] tracking-wide">FAQ</span>
          <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold font-['Poppins']">
            Questions fréquentes
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <motion.div {...fadeUp(0.1)} className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
              className={`h-11 px-5 rounded-full text-sm font-bold font-['Inter'] transition-all cursor-pointer ${activeCategory === cat.id
                ? "bg-neutral-950 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Questions accordion */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {currentQuestions.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="rounded-[32px] overflow-hidden"
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-8 py-5 text-left group cursor-pointer"
                  >
                    <span className="text-white text-base md:text-xl font-semibold font-['Inter'] pr-4">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: openIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 text-white/70 group-hover:text-white transition-colors"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-8 pb-6 text-gray-300 text-base font-normal font-['Poppins'] leading-7">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom link */}
        <motion.div {...fadeUp(0.2)} className="flex flex-col items-center gap-2 mt-12">
          <p className="text-gray-600 text-xl md:text-2xl font-normal font-['Poppins'] text-center">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sky-400 text-xl md:text-2xl font-bold font-['Poppins'] hover:gap-3 transition-all"
          >
            Poser votre question
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA — VOUS AVEZ UN PROJET MÉDIA ? ───────────────────────────────────────
function CTASection() {
  return (
    <section className="relative w-full bg-white py-10 px-5 sm:px-8">
      <motion.div
        {...fadeUp()}
        className="max-w-[1577px] mx-auto bg-sky-400 rounded-[30px] overflow-hidden py-16 px-6 flex flex-col items-center gap-8 text-center"
      >
        <div className="flex flex-col items-center gap-5 max-w-[700px]">
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Poppins'] leading-tight">
            Vous avez un projet média ?
          </h2>
          <p className="text-white text-lg md:text-2xl font-normal font-['Poppins'] leading-9">
            De la conception à la diffusion, nous vous accompagnons dans la réalisation de vos contenus audiovisuels.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/studio"
            className="px-7 py-3.5 bg-white rounded-2xl text-black text-lg font-medium font-['Poppins'] shadow-xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all cursor-pointer">
            Réserver notre studio
          </Link>
          <Link
            href="/contact"
            className="px-7 py-3.5 bg-transparent rounded-2xl border-2 border-white text-white text-lg font-semibold font-['Poppins'] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer">
            Nous contacter
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <main className="w-full overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <StatsBand />
        <ActivitiesSection />
        <WebTVSection />
        <SpotlightSection />
        <PodcastSection />
        <FormationsSection />
        <TeamSection />
        <AmbitionSection />
        <ValeursSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
