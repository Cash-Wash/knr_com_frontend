"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/webtv", label: "Web TV" },
  { href: "/formations", label: "Formations" },
  { href: "/emissions", label: "Emissions" },
  { href: "/location", label: "Location" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Desktop / main navbar ── */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed mt-8 top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-40px)] max-w-[1558px] h-20 bg-black rounded-[110px] flex items-center justify-between px-6 md:px-10"
        style={{
          boxShadow:
            "0 0 18px 3px rgba(76,194,236,0.35), 0 0 40px 6px rgba(76,194,236,0.12)",
          border: "1px solid rgba(76,194,236,0.25)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/images/logo.svg"
            alt="KNR COM & Digital"
            width={106}
            height={54}
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = mounted && pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-white text-base font-normal font-['Inter'] leading-7 hover:text-sky-400 transition-colors group"
              >
                {link.label}
                {/* Active neon underline */}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-all duration-300 ${active
                      ? "opacity-100 bg-sky-400"
                      : "opacity-0 bg-sky-400 group-hover:opacity-50"
                    }`}
                  style={
                    active
                      ? {
                        boxShadow:
                          "0 0 4px 1px rgba(56,189,248,0.45), 0 0 8px 2px rgba(56,189,248,0.2)",
                      }
                      : {}
                  }
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <button className="hidden md:flex h-14 px-7 bg-sky-400 rounded-[99px] outline outline-2 outline-white text-white text-base font-medium font-['Inter'] leading-6 hover:bg-sky-500 transition-all hover:scale-105 active:scale-95 cursor-pointer items-center">
          Collaborer avec nous
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex items-center justify-center w-10 h-10 text-white"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col pt-32 px-6 pb-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.97) 0%, rgba(3,20,35,0.97) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Links */}
            <div className="flex flex-col gap-2 flex-1">
              {navLinks.map((link, i) => {
                const active = mounted && pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 py-4 text-2xl font-semibold font-['Poppins'] border-b border-white/10 transition-colors ${active ? "text-sky-400" : "text-white hover:text-sky-400"
                        }`}
                    >
                      {active && (
                        <span
                          className="w-1.5 h-6 rounded-full bg-sky-400 flex-shrink-0"
                          style={{
                            boxShadow: "0 0 5px 1px rgba(56,189,248,0.35)",
                          }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              className="w-full py-4 bg-sky-400 rounded-2xl text-white text-lg font-semibold font-['Poppins'] hover:bg-sky-500 transition-colors"
            >
              Collaborer avec nous
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
