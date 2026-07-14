"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type User = { id: string; name: string; email: string; role: string };

interface StartReunionModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    onStart: (title: string, selectedUsers: string[]) => void;
}

export default function StartReunionModal({ isOpen, onClose, users, onStart }: StartReunionModalProps) {
    const [title, setTitle] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterRole, setFilterRole] = useState<string>("");

    const roles = Array.from(new Set(users.map((u) => u.role)));
    const filteredUsers = filterRole ? users.filter((u) => u.role === filterRole) : users;

    const toggleUser = (id: string) => {
        setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleStart = async () => {
        if (!title.trim() || selectedUsers.length === 0) return;
        setLoading(true);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            await fetch(`${base}/api/reunions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ titre: title, heure: new Date().toISOString(), participants: selectedUsers })
            });
            onStart(title, selectedUsers);
            setTitle("");
            setSelectedUsers([]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white font-['Poppins']">Démarrer une réunion</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Titre de la réunion"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-800 text-white rounded-lg mb-4 font-['Inter'] focus:outline-none"
                />

                <div className="mb-4">
                    <label className="text-sm text-gray-400 mb-2 block">Filtrer par rôle</label>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 text-white rounded-lg font-['Inter'] focus:outline-none"
                    >
                        <option value="">Tous les rôles</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-sm text-gray-400 mb-2 block">Sélectionner les participants</label>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                        {filteredUsers.map((u) => (
                            <div key={u.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(u.id)}
                                    onChange={() => toggleUser(u.id)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-white">{u.name}</span>
                                <span className="text-xs text-gray-400">{u.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-3 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleStart}
                        disabled={loading || !title.trim() || selectedUsers.length === 0}
                        className="flex-1 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition disabled:opacity-50"
                    >
                        {loading ? "..." : "Lancer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
