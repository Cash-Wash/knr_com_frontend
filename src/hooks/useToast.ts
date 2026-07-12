import { useCallback, useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error" | "loading";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: number) => {
    setToasts((p) => p.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
  }, []);

  const add = useCallback(
    (type: ToastType, message: string): number => {
      const id = Date.now();
      setToasts((p) => [...p, { id, type, message }]);
      if (type !== "loading") timers.current[id] = setTimeout(() => dismiss(id), 3500);
      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  return { toasts, add, dismiss };
}
