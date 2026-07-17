"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: Record<string, unknown>) => JitsiMeetAPI;
  }
}

interface JitsiMeetAPI {
  dispose: () => void;
}

interface JitsiMeetEmbedProps {
  roomSlug: string;
  displayName?: string;
  className?: string;
}

const JITSI_DOMAIN = "meet.jit.si";
const SCRIPT_SRC = `https://${JITSI_DOMAIN}/external_api.js`;

function loadJitsiScript(): Promise<void> {
  if (window.JitsiMeetExternalAPI) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve()));
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Impossible de charger Jitsi Meet."));
    document.body.appendChild(script);
  });
}

// Renders absolutely-positioned to fill its parent exactly (inset: 0), so it
// never depends on percentage-height resolving correctly through a flexbox
// chain. The parent MUST be `position: relative` and have a real, concrete
// height (not just flex-1/min-h-screen) — otherwise the iframe Jitsi creates
// collapses to its content's intrinsic size and its UI renders squished into
// whatever tiny area remains, with the rest of the container staying black.
export default function JitsiMeetEmbed({ roomSlug, displayName, className }: JitsiMeetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let api: JitsiMeetAPI | null = null;
    let cancelled = false;

    loadJitsiScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI) return;
        api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
          roomName: roomSlug,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          userInfo: displayName ? { displayName } : undefined,
          configOverwrite: {
            prejoinPageEnabled: false,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              "microphone", "camera", "desktop", "fullscreen", "hangup",
              "chat", "raisehand", "tileview", "settings",
            ],
          },
        });
      })
      .catch(() => {
        // container stays empty; nothing more we can do if the script fails to load
      });

    return () => {
      cancelled = true;
      api?.dispose();
    };
  }, [roomSlug, displayName]);

  return <div ref={containerRef} className={`absolute inset-0 ${className ?? ""}`} />;
}
