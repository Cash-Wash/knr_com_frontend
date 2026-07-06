"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronDown } from "lucide-react";

interface StudioBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  forfaitInitial?: string;
}

const forfaits = [
  { label: "Demi-journée (4h)", value: "demi", prix: 75000, duree: "4h" },
  { label: "Journée complète (8h)", value: "journee", prix: 125000, duree: "8h" },
  { label: "Forfait week-end (16h)", value: "weekend", prix: 200000, duree: "16h" },
];

const typesProjet = [
  "Podcast", "Interview", "Clip musical", "Film d'entreprise",
  "Émission TV", "Formation en ligne", "Séance photo", "Autre",
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function StudioBookingModal({ isOpen, onClose, forfaitInitial }: StudioBookingModalProps) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkAnimDone, setCheckAnimDone] = useState(false);

  const [form, setForm] = useState({
    date: "",
    heure: "09:00",
    forfait: forfaitInitial || "demi",
    typeProjet: "Podcast",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    entreprise: "",
    description: "",
    modePaiement: "",
    reference: "",
  });

  const forfaitActuel = forfaits.find((f) => f.value === form.forfait) || forfaits[0];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDir(1);
      setCheckAnimDone(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const goNext = () => {
    if (step === 3) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDir(1);
        setStep(4);
        setTimeout(() => setCheckAnimDone(true), 600);
      }, 2000);
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const canContinue = () => {
    if (step === 1) return form.date !== "" && form.heure !== "" && form.typeProjet !== "";
    if (step === 2) return form.prenom !== "" && form.nom !== "" && form.email !== "" && form.telephone !== "";
    if (step === 3) return form.modePaiement !== "";
    return true;
  };

  const steps = [
    { num: 1, label: "Créneau" },
    { num: 2, label: "Infos" },
    { num: 3, label: "Paiement" },
    { num: 4, label: "Succès" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6">
              <div>
                {step < 4 && (
                  <button onClick={onClose} className="flex items-center gap-2 text-gray-500 text-sm font-['Inter'] hover:text-gray-700 transition-colors mb-2 cursor-pointer">
                    ← Retour au studio
                  </button>
                )}
                <h2 className="text-gray-900 text-3xl font-bold font-['Poppins']">Réservation du Studio</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Stepper */}
            <div className="px-8 pb-6">
              <div className="flex items-center">
                {steps.map((s, i) => (
                  <React.Fragment key={s.num}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-['Inter'] transition-all duration-300 ${
                        step > s.num ? "bg-sky-400 text-white" :
                        step === s.num ? "bg-sky-400 text-white ring-4 ring-sky-400/20" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                      </div>
                      <span className={`text-xs font-['Inter'] ${step === s.num ? "text-sky-400 font-bold" : "text-gray-400"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all duration-500 ${step > s.num ? "bg-sky-400" : "bg-gray-200"}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* ── STEP 1: Créneau ── */}
                  {step === 1 && (
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1 bg-gray-50 rounded-2xl p-6 flex flex-col gap-5">
                        <h3 className="text-gray-900 text-xl font-bold font-['Poppins']">Date et durée</h3>

                        <div className="flex flex-col gap-2">
                          <label className="text-gray-700 text-sm font-medium font-['Inter']">Date souhaitée</label>
                          <input type="date" value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-medium font-['Inter']">Heure de début</label>
                            <input type="time" value={form.heure}
                              onChange={(e) => setForm({ ...form, heure: e.target.value })}
                              className="h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-medium font-['Inter']">Forfait / Durée</label>
                            <div className="relative">
                              <select value={form.forfait}
                                onChange={(e) => setForm({ ...form, forfait: e.target.value })}
                                className="w-full h-12 px-4 pr-10 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 appearance-none cursor-pointer">
                                {forfaits.map((f) => (
                                  <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-gray-700 text-sm font-medium font-['Inter']">Type de projet</label>
                          <div className="relative">
                            <select value={form.typeProjet}
                              onChange={(e) => setForm({ ...form, typeProjet: e.target.value })}
                              className="w-full h-12 px-4 pr-10 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 appearance-none cursor-pointer">
                              {typesProjet.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="flex justify-end mt-2">
                          <button onClick={goNext} disabled={!canContinue()}
                            className={`px-8 py-3 rounded-xl text-white text-sm font-bold font-['Inter'] transition-all cursor-pointer ${canContinue() ? "bg-sky-400 hover:bg-sky-500 hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                            Continuer
                          </button>
                        </div>
                      </div>

                      {/* Récap */}
                      <Recap form={form} forfaitActuel={forfaitActuel} />
                    </div>
                  )}

                  {/* ── STEP 2: Infos ── */}
                  {step === 2 && (
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1 bg-gray-50 rounded-2xl p-6 flex flex-col gap-5">
                        <h3 className="text-gray-900 text-xl font-bold font-['Poppins']">Vos informations</h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-medium font-['Inter']">Prénom</label>
                            <input type="text" placeholder="Votre prénom" value={form.prenom}
                              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                              className="h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-medium font-['Inter']">Nom</label>
                            <input type="text" placeholder="Votre nom" value={form.nom}
                              onChange={(e) => setForm({ ...form, nom: e.target.value })}
                              className="h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-medium font-['Inter']">Email</label>
                            <input type="email" placeholder="votre@email.com" value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-medium font-['Inter']">Téléphone</label>
                            <input type="tel" placeholder="+229 01 00 00 00" value={form.telephone}
                              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                              className="h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-gray-700 text-sm font-medium font-['Inter']">Entreprise (Optionnel)</label>
                          <input type="text" placeholder="Nom de votre entreprise" value={form.entreprise}
                            onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                            className="h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-gray-700 text-sm font-medium font-['Inter']">Description rapide du projet</label>
                          <textarea placeholder="Décrivez brièvement votre projet..." value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all resize-none" />
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <button onClick={goPrev} className="px-6 py-3 rounded-xl text-gray-600 text-sm font-bold font-['Inter'] hover:bg-gray-100 transition-all cursor-pointer">
                            Retour
                          </button>
                          <button onClick={goNext} disabled={!canContinue()}
                            className={`px-8 py-3 rounded-xl text-white text-sm font-bold font-['Inter'] transition-all cursor-pointer ${canContinue() ? "bg-neutral-900 hover:bg-neutral-800 hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                            Continuer
                          </button>
                        </div>
                      </div>

                      <Recap form={form} forfaitActuel={forfaitActuel} />
                    </div>
                  )}

                  {/* ── STEP 3: Paiement ── */}
                  {step === 3 && (
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1 bg-gray-50 rounded-2xl p-6 flex flex-col gap-5">
                        <h3 className="text-gray-900 text-xl font-bold font-['Poppins']">Mode de paiement</h3>
                        <p className="text-gray-500 text-sm font-['Inter']">Un acompte de 30% est requis pour confirmer la réservation.</p>

                        <div className="flex flex-col gap-3">
                          {[
                            { value: "mtn", label: "MTN Mobile Money", icon: "📱", desc: "Paiement instantané via MTN MoMo" },
                            { value: "moov", label: "Moov Money", icon: "📱", desc: "Paiement instantané via Moov" },
                            { value: "virement", label: "Virement bancaire", icon: "🏦", desc: "Virement sur notre compte bancaire" },
                            { value: "especes", label: "Espèces sur place", icon: "💵", desc: "Paiement à l'accueil (montant < 500 000 FCFA)" },
                          ].map((mode) => (
                            <label key={mode.value}
                              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.modePaiement === mode.value ? "border-sky-400 bg-sky-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                              <input type="radio" name="paiement" value={mode.value}
                                checked={form.modePaiement === mode.value}
                                onChange={(e) => setForm({ ...form, modePaiement: e.target.value })}
                                className="hidden" />
                              <span className="text-2xl">{mode.icon}</span>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-gray-900 text-sm font-bold font-['Inter']">{mode.label}</span>
                                <span className="text-gray-500 text-xs font-['Inter']">{mode.desc}</span>
                              </div>
                              {form.modePaiement === mode.value && (
                                <div className="ml-auto w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </label>
                          ))}
                        </div>

                        {(form.modePaiement === "mtn" || form.modePaiement === "moov") && (
                          <div className="flex flex-col gap-2">
                            <label className="text-gray-700 text-sm font-medium font-['Inter']">Numéro de téléphone Mobile Money</label>
                            <input type="tel" placeholder="+229 01 00 00 00"
                              className="h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm font-['Inter'] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all" />
                          </div>
                        )}

                        {form.modePaiement === "virement" && (
                          <div className="p-4 bg-blue-50 rounded-xl border border-sky-200">
                            <p className="text-sky-700 text-sm font-bold font-['Inter'] mb-1">Coordonnées bancaires</p>
                            <p className="text-sky-600 text-xs font-['Inter']">IBAN : BJ66 BJ0010002 0000000000000<br />BIC : AFRIBJBJ<br />Référence : KNR-STUDIO-{Math.floor(Math.random() * 99999)}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <button onClick={goPrev} className="px-6 py-3 rounded-xl text-gray-600 text-sm font-bold font-['Inter'] hover:bg-gray-100 transition-all cursor-pointer">
                            Retour
                          </button>
                          <button onClick={goNext} disabled={!canContinue() || loading}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-white text-sm font-bold font-['Inter'] transition-all cursor-pointer ${canContinue() && !loading ? "bg-sky-400 hover:bg-sky-500 hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                            {loading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Traitement...
                              </>
                            ) : (
                              "Confirmer la réservation"
                            )}
                          </button>
                        </div>
                      </div>

                      <Recap form={form} forfaitActuel={forfaitActuel} />
                    </div>
                  )}

                  {/* ── STEP 4: Succès ── */}
                  {step === 4 && (
                    <div className="flex flex-col items-center justify-center py-12 gap-8 text-center">
                      {/* Animated check */}
                      <div className="relative">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                          className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.4, type: "spring", bounce: 0.5 }}
                            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <motion.svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-10 h-10"
                            >
                              <motion.path
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                              />
                            </motion.svg>
                          </motion.div>
                        </motion.div>
                        {/* Sparkles */}
                        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                            transition={{ delay: 0.7 + i * 0.05, duration: 0.5 }}
                            className="absolute w-2 h-2 bg-green-400 rounded-full"
                            style={{
                              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 55}px - 4px)`,
                              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 55}px - 4px)`,
                            }}
                          />
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col gap-3"
                      >
                        <h3 className="text-gray-900 text-3xl font-bold font-['Poppins']">Réservation confirmée !</h3>
                        <p className="text-gray-600 text-base font-['Inter'] max-w-md">
                          Votre studio est réservé. Un email de confirmation a été envoyé à <span className="text-sky-400 font-bold">{form.email}</span>.
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="bg-gray-50 rounded-2xl p-6 w-full max-w-sm text-left"
                      >
                        <p className="text-gray-900 text-sm font-bold font-['Inter'] mb-3">Récapitulatif</p>
                        <div className="flex flex-col gap-2">
                          {[
                            { label: "Date", value: form.date },
                            { label: "Heure", value: form.heure },
                            { label: "Forfait", value: forfaitActuel.duree },
                            { label: "Projet", value: form.typeProjet },
                            { label: "Nom", value: `${form.prenom} ${form.nom}` },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between">
                              <span className="text-gray-400 text-xs font-['Inter']">{label}</span>
                              <span className="text-gray-900 text-xs font-bold font-['Inter']">{value}</span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                            <span className="text-gray-900 text-sm font-bold font-['Inter']">Total</span>
                            <span className="text-sky-400 text-sm font-bold font-['Inter']">{forfaitActuel.prix.toLocaleString("fr-FR")} FCFA</span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.4 }}
                        onClick={onClose}
                        className="px-10 py-3.5 bg-sky-400 rounded-full text-white text-base font-bold font-['Poppins'] hover:bg-sky-500 hover:scale-105 transition-all cursor-pointer"
                      >
                        Fermer
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Recap({ form, forfaitActuel }: { form: any; forfaitActuel: any }) {
  return (
    <div className="w-full lg:w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 h-fit">
      <h4 className="text-gray-900 text-base font-bold font-['Inter']">Récapitulatif</h4>
      <div className="flex flex-col gap-3">
        {[
          { label: "Date", value: form.date || "-" },
          { label: "Heure", value: form.heure || "-" },
          { label: "Forfait", value: forfaitActuel.duree },
          { label: "Projet", value: form.typeProjet },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-gray-400 text-sm font-['Inter']">{label}</span>
            <span className="text-gray-900 text-sm font-bold font-['Inter']">{value}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-900 text-base font-bold font-['Inter']">Total</span>
          <span className="text-sky-400 text-2xl font-bold font-['Inter']">
            {forfaitActuel.prix.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>
    </div>
  );
}
