"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, type MotionProps } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getApiBase, resolveMediaUrl } from "@/lib/api";

type MotionDivProps = MotionProps & { className?: string; style?: React.CSSProperties };
const fadeUp = (delay = 0): MotionDivProps => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: "easeOut", delay },
});

type TeamMember = {
  id: string;
  name: string;
  poste: string;
  bio?: string;
  photo?: string;
};

export default function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/public/team`);
        if (!response.ok) return;
        const payload = await response.json();
        if (Array.isArray(payload)) setMembers(payload);
      } catch {
        // keep empty, section renders nothing below
      }
    };
    load();
  }, []);

  if (members.length === 0) return null;

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
            Des experts de l&apos;audiovisuel, du marketing et de la formation réunis pour donner vie à vos projets les plus ambitieux.
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => (
            <motion.div key={member.id} {...fadeUp(i * 0.1)}
              className="relative overflow-hidden group cursor-pointer"
              style={{ height: "360px" }}
            >
              {/* Photo */}
              <Image
                src={resolveMediaUrl(member.photo) || "/images/equipe1.png"}
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
                  <ArrowUpRight className="w-5 h-5 text-white/50 ml-2 flex-shrink-0" />
                </div>
                <p className="text-white font-bold text-sm font-['Poppins'] mb-1">{member.poste}</p>
                {member.bio ? (
                  <p className="text-white/70 text-xs font-normal font-['Poppins'] leading-4">{member.bio}</p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
