"use client";

import React from "react";

export default function AdminNavbar() {
    return (
        <header className="w-full bg-neutral-900 rounded-2xl p-3 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="text-sky-400 font-bold">KNR</div>
                <div className="text-gray-300">Panneau d'administration</div>
            </div>
            <div className="flex items-center gap-3">
                <button className="text-sm px-3 py-1 rounded bg-white/5">Compte</button>
            </div>
        </header>
    );
}
