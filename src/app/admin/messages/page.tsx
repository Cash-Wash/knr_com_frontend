"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Inbox, MessageSquare, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { getApiBase, authHeaders } from "@/lib/api";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  assignedTo: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/messages`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        setMessages(Array.isArray(payload) ? payload : []);
      } catch {
        setMessages([]);
      }
    };
    loadMessages();
  }, []);

  const markTreated = async (id: string) => {
    try {
      const response = await fetch(`${getApiBase()}/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status: "TRAITE" }),
      });
      if (!response.ok) return;
      const updated = await response.json();
      setMessages((current) => current.map((m) => (m.id === id ? updated : m)));
    } catch {
      // ignore, list stays as-is
    }
  };

  const removeMessage = async (id: string) => {
    try {
      await fetch(`${getApiBase()}/api/messages/${id}`, { method: "DELETE", headers: authHeaders() });
    } catch {
      // fallback below
    }
    setMessages((current) => current.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
          <MessageSquare className="h-4 w-4" />
          Messages contact
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Centralisez les demandes entrantes et les retours terrain.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Les messages du site remontent ici depuis MySQL pour etre traites, classes et assignes a l&apos;equipe.
        </p>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-sky-500" />
            <h2 className="text-xl font-bold text-slate-900">Boite de reception</h2>
          </div>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            {messages.length} message(s)
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {messages.map((item) => (
            <article key={item.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.subject}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.name} - {item.email}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                    item.status === "TRAITE"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "IN_PROGRESS"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{item.message}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Assigne a: <span className="font-semibold text-slate-900">{item.assignedTo || "Non assigne"}</span>
                </p>
                <div className="flex items-center gap-2">
                  {item.status !== "TRAITE" ? (
                    <button
                      onClick={() => markTreated(item.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      Traiter
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  ) : null}
                  <button
                    onClick={() => removeMessage(item.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {messages.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            Aucun message disponible pour le moment.
          </p>
        ) : null}
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
          <ShieldCheck className="h-4 w-4" />
          Flux de traitement
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Simplifiez le suivi des messages entrants.</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Ajoutez plus tard les actions de reponse, assignation et archivage si vous souhaitez industrialiser le support.
        </p>
        <Link href="/admin/users" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-white">
          Assigner un contact
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
