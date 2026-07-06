"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/lib/articles-data";

type MotionDivProps = import("framer-motion").MotionProps & {
  className?: string; style?: React.CSSProperties;
};
const fadeUp = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut", delay },
});

const socialShareIcons = [
  {
    label: "Facebook",
    bg: "bg-blue-600",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Twitter",
    bg: "bg-sky-500",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    bg: "bg-blue-800",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);
  const similaires = articles.filter((a) => a.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-gray-500 text-xl font-['Inter'] mb-4">Article introuvable.</p>
            <Link href="/blog" className="text-sky-400 underline font-['Inter']">Retour au blog</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden bg-white">

        {/* ── HERO ── */}
        <section className="relative w-full min-h-[400px] md:min-h-[480px] overflow-hidden">
          <div className="absolute inset-0">
            <Image src={article.img} alt={article.titre} fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-500/60 to-black/60" />
          </div>

          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 pt-36 pb-14 flex flex-col gap-8">
            {/* Back */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <Link
                href="/blog"
                className="flex items-center gap-2 text-white/80 text-sm font-medium font-['Inter'] hover:text-white transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au blog
              </Link>
            </motion.div>

            {/* Category badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <span className="inline-flex px-4 py-1 bg-white rounded-sm text-sky-400 text-xs font-bold font-['Inter'] uppercase tracking-wide">
                {article.categorie}
              </span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-white text-3xl sm:text-4xl font-bold font-['Inter'] leading-tight max-w-[900px]">
                {article.titre}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-white/90" />
                  <span className="text-white/90 text-sm font-normal font-['Inter']">{article.auteur}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/90" />
                  <span className="text-white/90 text-sm font-normal font-['Inter']">{article.dateISO}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/90" />
                  <span className="text-white/90 text-sm font-normal font-['Inter']">{article.tempsLecture}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CONTENT AREA ── */}
        <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-14">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ── LEFT: Article content ── */}
            <motion.div {...fadeUp()} className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Intro */}
              <p className="text-gray-900 text-base font-medium font-['Inter'] leading-7">
                {article.contenu.intro}
              </p>

              {/* Sections */}
              {article.contenu.sections.map((section, i) => (
                <motion.div key={i} {...fadeUp(i * 0.08)} className="flex flex-col gap-3">
                  {section.sousTitre && (
                    <h2 className="text-gray-900 text-sm font-bold font-['Inter'] leading-6">
                      {section.sousTitre}
                    </h2>
                  )}
                  <p className="text-gray-900 text-sm font-normal font-['Inter'] leading-6">
                    {section.paragraphe}
                  </p>
                </motion.div>
              ))}

              {/* Citation */}
              {article.contenu.citation && (
                <motion.blockquote
                  {...fadeUp(0.15)}
                  className="border-l-4 border-sky-400 bg-cyan-50 rounded-tr-lg rounded-br-lg px-5 py-4"
                >
                  <p className="text-zinc-950 text-sm font-normal font-['Inter'] leading-6">
                    {article.contenu.citation}
                  </p>
                </motion.blockquote>
              )}

              {/* Conclusion */}
              {article.contenu.conclusion && (
                <motion.p {...fadeUp(0.2)} className="text-gray-900 text-sm font-normal font-['Inter'] leading-6">
                  {article.contenu.conclusion}
                </motion.p>
              )}

              {/* Share */}
              <motion.div {...fadeUp(0.25)} className="flex flex-col gap-4 pt-4 border-t border-orange-100">
                <p className="text-gray-900 text-base font-bold font-['Inter']">Partager cet article</p>
                <div className="flex items-center gap-3">
                  {socialShareIcons.map(({ label, bg, path }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className={`w-9 h-9 ${bg} rounded-full flex items-center justify-center hover:scale-110 transition-transform`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" color="white">
                        <path d={path} fill="white" />
                      </svg>
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Similar articles ── */}
            <motion.div
              {...fadeUp(0.1)}
              className="w-full lg:w-96 lg:sticky lg:top-32 flex-shrink-0 flex flex-col gap-4"
            >
              {/* Articles similaires */}
              <div className="bg-stone-50 rounded-xl p-6 flex flex-col gap-5">
                <h3 className="text-gray-900 text-base font-bold font-['Inter']">
                  Articles Similaires
                </h3>
                <div className="flex flex-col gap-6">
                  {similaires.map((sim, i) => (
                    <motion.div key={sim.slug} {...fadeUp(i * 0.08)}>
                      <Link
                        href={`/blog/${sim.slug}`}
                        className="flex gap-4 group"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={sim.img}
                            alt={sim.titre}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <p className="text-zinc-950 text-xs font-bold font-['Inter'] leading-4 line-clamp-2 group-hover:text-sky-400 transition-colors">
                            {sim.titre}
                          </p>
                          <p className="text-zinc-600 text-[10px] font-normal font-['Inter'] mt-1">
                            {sim.dateISO}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Voir plus */}
              <Link
                href="/blog"
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-sky-400 rounded-sm text-white text-sm font-bold font-['Inter'] hover:bg-sky-500 hover:scale-[1.02] transition-all"
              >
                Voir plus
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
