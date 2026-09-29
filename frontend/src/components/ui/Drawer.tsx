"use client";

import { type ReactNode, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Drawer({ open, onClose, title, children, width = "w-full max-w-lg" }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => closeRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={[
          "relative ml-auto h-full bg-surface border-l border-border",
          "flex flex-col overflow-hidden",
          width,
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-20 font-semibold text-ink">{title}</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close drawer"
            className="inline-flex items-center justify-center p-1.5 rounded-sm text-muted hover:text-ink hover:bg-paper transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
