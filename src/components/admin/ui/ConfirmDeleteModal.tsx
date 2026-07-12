"use client";

import { useEffect } from "react";
import { Loader2, Trash2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  message: React.ReactNode;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  message,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex w-full max-w-sm max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="text-base font-bold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          <p className="text-sm text-stone-600">{message}</p>
          <div className="flex flex-wrap gap-2 justify-end mt-5">
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition cursor-pointer"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
