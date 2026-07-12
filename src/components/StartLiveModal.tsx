"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface StartLiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (title: string) => void;
}

export default function StartLiveModal({ isOpen, onClose, onStart }: StartLiveModalProps) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            await fetch(`${base}/api/start-live`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emissionId: `e${Date.now()}` })
            });
            onStart(title);
            setTitle("");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white font-['Poppins']">Démarrer un live</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Titre du live"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-800 text-white rounded-lg mb-4 font-['Inter'] focus:outline-none focus:border-sky-400"
                />

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-3 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleStart}
                        disabled={loading}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                    >
                        {loading ? "..." : "Démarrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
