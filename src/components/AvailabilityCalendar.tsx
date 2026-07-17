"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MAX_MONTHS_AHEAD = 2;

function toIsoDate(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

interface AvailabilityCalendarProps {
  reservedDates: string[];
  title?: string;
  className?: string;
  onToggleDate?: (dateIso: string) => void;
}

export default function AvailabilityCalendar({ reservedDates, title, className, onToggleDate }: AvailabilityCalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = base.getFullYear();
  const month = base.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const reservedSet = new Set(reservedDates);
  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(base);

  return (
    <div className={className ?? "bg-white rounded-3xl shadow-sm border border-gray-200 p-6"}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          <span className="text-gray-900 text-lg font-bold font-['Sora']">{title ?? "Disponibilités"}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMonthOffset((v) => Math.max(0, v - 1))}
            disabled={monthOffset === 0}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 transition"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonthOffset((v) => Math.min(MAX_MONTHS_AHEAD, v + 1))}
            disabled={monthOffset === MAX_MONTHS_AHEAD}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 transition"
            aria-label="Mois suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm font-['Inter'] capitalize mb-3">{monthLabel}</p>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-gray-400 text-xs font-bold font-['Inter']">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const iso = toIsoDate(year, month, day);
          const reserved = reservedSet.has(iso);
          const cellClass = `w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium font-['Inter'] transition ${
            reserved ? "bg-red-50 text-red-400" : "bg-green-50 text-green-700"
          } ${onToggleDate ? "cursor-pointer hover:ring-2 hover:ring-sky-300" : ""}`;
          if (onToggleDate) {
            return (
              <button key={i} type="button" onClick={() => onToggleDate(iso)} className={cellClass} title={reserved ? "Libérer ce jour" : "Réserver ce jour"}>
                {day}
              </button>
            );
          }
          return <div key={i} className={cellClass}>{day}</div>;
        })}
      </div>

      <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200" />
          <span className="text-gray-900 text-sm font-['Inter']">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-50 border border-red-200" />
          <span className="text-gray-900 text-sm font-['Inter']">Réservé</span>
        </div>
      </div>
      {onToggleDate ? (
        <p className="mt-4 text-xs text-gray-400 font-['Inter']">Cliquez sur un jour pour le réserver ou le libérer.</p>
      ) : null}
    </div>
  );
}
