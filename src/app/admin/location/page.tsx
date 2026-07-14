"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Camera, MapPinned, PackageCheck, ShieldCheck } from "lucide-react";

type Equipment = {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  location: string;
  image: string;
};

const stats = [
  { label: "Equipements", value: "24", description: "Caméras, micros, accessoires" },
  { label: "Disponibles", value: "18", description: "Materiel libre pour reservation" },
  { label: "Reservations", value: "06", description: "Demandes en attente de validation" },
];

export default function AdminLocationPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
        const response = await fetch(`${apiBase}/api/equipment`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        setEquipment(Array.isArray(payload) ? payload : []);
      } catch {
        setEquipment([]);
      }
    };

    loadEquipment();
  }, []);

  return (
    <div className="space-y-6 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
          <Camera className="h-4 w-4" />
          Location d&apos;equipements
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Gere le stock de materiel et les reservations internes.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Cette page s&apos;appuie sur la base MySQL pour suivre le parc de production et les disponibilites.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-500">{item.label}</p>
            <div className="mt-2 text-4xl font-black text-slate-900">{item.value}</div>
            <p className="mt-3 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-sky-500" />
            <h2 className="text-xl font-bold text-slate-900">Etat des sorties</h2>
          </div>
          <div className="mt-5 space-y-3">
            {equipment.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900">{entry.name}</span>
                  <span className="rounded-full bg-sky-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                    {entry.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{entry.description}</p>
              </div>
            ))}
          </div>
          {equipment.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              Aucun equipement disponible pour le moment.
            </p>
          ) : null}
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
            <ShieldCheck className="h-4 w-4" />
            Pilotage rapide
          </div>
          <div className="mt-5 flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-slate-900">Actions rapides</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Rattachez ce module a une vraie reservation d&apos;equipe, de tournage ou de studio lorsque vous voulez industrialiser la location.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/admin/reunions" className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">
              Planifier une sortie
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/settings" className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">
              Regler le stock
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
