"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, X, ZoomIn, ZoomOut } from "lucide-react";
import { RESUME_FILENAME, RESUME_HASH, RESUME_URL, onResumeViewerOpen } from "./resume";

// pdf.js is heavy and browser-only — load it on first open
const ResumePdf = dynamic(() => import("./ResumePdf"), { ssr: false });

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

export default function ResumeViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setZoom(MIN_ZOOM);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Drop the shareable #resume hash so a refresh doesn't reopen the viewer
    if (window.location.hash === RESUME_HASH) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    lastFocusedRef.current?.focus();
  }, []);

  // Open via openResumeViewer() events and via shareable /#resume links
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === RESUME_HASH) open();
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    const unsubscribe = onResumeViewerOpen(open);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      unsubscribe();
    };
  }, [open]);

  // Lock page scroll, close on Escape, focus the close button while open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  const iconButton =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/70 border border-white/10 hover:text-white hover:bg-white/5 hover:border-white/20 transition-colors duration-200 disabled:opacity-30 disabled:pointer-events-none";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="resume-viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-lenis-prevent
          className="fixed inset-0 z-[100000] flex items-center justify-center md:p-6 bg-black/70 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-viewer-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-full h-full md:max-w-5xl md:h-[92vh] md:rounded-2xl overflow-hidden bg-[#0B0F19] border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 md:px-5 py-3 border-b border-white/10">
              <h2
                id="resume-viewer-title"
                className="font-display font-semibold text-sm md:text-base tracking-wide text-white truncate"
              >
                Shivam Pathak <span className="text-white/40 font-normal">— Resume</span>
              </h2>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out"
                  className={iconButton}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in"
                  className={iconButton}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open resume in a new tab"
                  title="Open in new tab"
                  className={iconButton}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={RESUME_URL}
                  download={RESUME_FILENAME}
                  className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-bold tracking-[0.12em] text-[#030712] bg-white hover:bg-white/90 transition-colors duration-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD</span>
                </a>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  aria-label="Close resume viewer"
                  className={iconButton}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document */}
            <div className="flex-1 overflow-auto overscroll-contain px-3 py-4 md:px-8 md:py-6 bg-[#030712]/60">
              <ResumePdf zoom={zoom} />
            </div>

            {/* Mobile: download pinned to the bottom for easy reach */}
            <div className="sm:hidden px-4 py-3 border-t border-white/10">
              <a
                href={RESUME_URL}
                download={RESUME_FILENAME}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-xs font-bold tracking-[0.15em] text-[#030712] bg-white"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD RESUME</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
