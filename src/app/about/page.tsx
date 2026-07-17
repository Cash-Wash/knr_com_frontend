"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, Lightbulb, Star, Palette, Zap, Globe,
  Tv2, Megaphone, GraduationCap, Video, Camera, Mic,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";

type MotionDivProps = import("framer-motion").MotionProps & {
  className?: string;
  style?: React.CSSProperties;
};

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
  transition: { duration: 0.8, ease: "easeOut", delay },
});

const valeurs = [
  { icon: <Shield className="w-6 h-6 text-sky-400" />, title: "Professionnalisme", desc: "Une exigence de qualité dans chaque production." },
  { icon: <Lightbulb className="w-6 h-6 text-sky-400" />, title: "Innovation", desc: "Des formats modernes et des idées novatrices." },
  { icon: <Star className="w-6 h-6 text-sky-400" />, title: "Excellence", desc: "Le dépassement de soi comme standard." },
  { icon: <Palette className="w-6 h-6 text-sky-400" />, title: "Créativité", desc: "L'art de raconter des histoires captivantes." },
  { icon: <Zap className="w-6 h-6 text-sky-400" />, title: "Dynamisme", desc: "Une énergie au service de vos projets." },
  { icon: <Globe className="w-6 h-6 text-sky-400" />, title: "Leadership africain", desc: "Fiers de porter la voix du continent." },
];

const activites = [
  { icon: <Tv2 className="w-7 h-7 text-sky-400" />, title: "Web TV", desc: "Émissions, talk-shows, interviews et magazines pour valoriser l'Afrique qui avance.", href: "/webtv" },
  { icon: <Megaphone className="w-7 h-7 text-sky-400" />, title: "Agence Com & Marketing", desc: "Stratégie, branding, social media et campagnes pour faire grandir votre marque.", href: "/contact" },
  { icon: <GraduationCap className="w-7 h-7 text-sky-400" />, title: "Centre de Formations", desc: "Formations pratiques en audiovisuel, communication, marketing digital et plus.", href: "/formations" },
  { icon: <Video className="w-7 h-7 text-sky-400" />, title: "Production Audiovisuelle", desc: "Films d'entreprise, clips, documentaires, captations événementielles.", href: "/emissions" },
  { icon: <Camera className="w-7 h-7 text-sky-400" />, title: "Location d'Équipements", desc: "Caméras, éclairage, son, fond vert — du matériel pro à votre disposition.", href: "/location" },
  { icon: <Mic className="w-7 h-7 text-sky-400" />, title: "Studio Podcast", desc: "Un studio professionnel pour produire et diffuser des podcasts de qualité.", href: "/studio" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden bg-white">

        {/* ── HERO ── */}
        <section className="relative w-full min-h-[480px] md:min-h-[560px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <Image src="/images/hero-cover.png" alt="À propos de KNR COM & Digital" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-6 text-center px-5 pt-32 pb-16 max-w-[900px]"
          >
            <span className="px-5 py-2 bg-sky-400 rounded-[20px] text-white text-sm font-bold font-['Inter']">
              À propos
            </span>
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Poppins'] leading-tight">
              L&apos;écosystème média qui fait rayonner l&apos;Afrique
            </h1>
            <p className="text-gray-200 text-lg sm:text-xl font-normal font-['Poppins'] leading-8 max-w-[700px]">
              Web TV, studio podcast, agence de communication et centre de formation réunis pour valoriser les talents et les initiatives qui font avancer le continent.
            </p>
          </motion.div>
        </section>

        {/* ── NOTRE AMBITION ── */}
        <section className="relative w-full bg-neutral-950 py-20 overflow-hidden">
          <div
            className="absolute pointer-events-none"
            style={{ width: 600, height: 600, left: "5%", top: "10%", background: "rgba(56,189,248,0.08)", borderRadius: "50%", filter: "blur(100px)" }}
          />
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div {...fadeIn(0.1)} className="flex-shrink-0 flex flex-col items-center justify-center w-full lg:w-[420px]">
                <Image src="/images/logo.svg" alt="KNR COM & Digital" width={320} height={160} className="w-full max-w-[300px] md:max-w-[380px]" />
              </motion.div>

              <motion.div {...fadeUp(0.15)} className="flex flex-col gap-8 flex-1">
                <div className="flex flex-col gap-4">
                  <span className="text-sky-400 text-base font-bold font-['Poppins'] tracking-wide">Notre Ambition</span>
                  <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold font-['Poppins'] leading-tight">
                    Devenir la référence africaine des médias et de la communication.
                  </h2>
                </div>

                <div className="flex flex-col gap-5">
                  <p className="text-gray-400 text-base md:text-xl font-normal font-['Poppins'] leading-7">
                    KNR COM est née d&apos;une vision forte : celle de valoriser les talents, les entrepreneurs, les entreprises et les initiatives qui font bouger l&apos;Afrique.
                  </p>
                  <p className="text-gray-400 text-base md:text-xl font-normal font-['Poppins'] leading-7">
                    À travers nos émissions, nos podcasts, nos formations et nos services d&apos;agence, nous accompagnons les acteurs du continent dans le développement de leur visibilité et de leurs compétences, avec une exigence constante de qualité.
                  </p>
                </div>

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

        {/* ── CE QUE NOUS FAISONS ── */}
        <section className="relative w-full bg-gray-50 py-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
            <motion.div {...fadeUp()} className="flex flex-col items-center gap-4 text-center mb-14">
              <span className="text-sky-400 text-base font-bold font-['Poppins'] tracking-wide">Ce que nous faisons</span>
              <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold font-['Poppins'] leading-tight max-w-[800px]">
                Un écosystème complet pour vos projets média
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activites.map((a, i) => (
                <motion.div key={a.title} {...fadeUp(i * 0.08)}>
                  <Link
                    href={a.href}
                    className="group flex flex-col gap-4 h-full p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-sky-400/15 transition-colors">
                      {a.icon}
                    </div>
                    <h3 className="text-gray-900 text-xl font-bold font-['Poppins']">{a.title}</h3>
                    <p className="text-gray-600 text-base font-normal font-['Poppins'] leading-6 flex-1">{a.desc}</p>
                    <span className="flex items-center gap-1.5 text-sky-500 text-sm font-semibold font-['Poppins'] group-hover:gap-2.5 transition-all">
                      Découvrir <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NOS VALEURS FONDAMENTALES ── */}
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
                <motion.div key={v.title} {...fadeUp(i * 0.07)} className="flex items-start gap-4 group">
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

        {/* ── NOTRE ÉQUIPE ── */}
        <TeamSection />

        {/* ── CTA ── */}
        <section className="w-full bg-white py-20">
          <motion.div
            {...fadeUp()}
            className="max-w-[1400px] mx-auto px-5 sm:px-8 bg-sky-400 rounded-[30px] overflow-hidden py-16 flex flex-col items-center gap-8 text-center"
          >
            <div className="flex flex-col items-center gap-5 max-w-[700px] px-6">
              <h2 className="text-white text-4xl sm:text-5xl font-bold font-['Poppins'] leading-tight">
                Envie de collaborer avec nous ?
              </h2>
              <p className="text-white text-lg md:text-xl font-normal font-['Poppins'] leading-9">
                Parlons de votre projet média, de votre formation ou de votre besoin de communication.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-7 py-3.5 bg-white rounded-2xl text-black text-lg font-medium font-['Poppins'] shadow-xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Nous contacter
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
