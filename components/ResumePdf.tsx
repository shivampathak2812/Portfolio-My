"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2 } from "lucide-react";
import { RESUME_FILENAME, RESUME_URL } from "./resume";

// Must be set in the same module that renders <Document>/<Page> (react-pdf requirement)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_PAGE_WIDTH = 880;

interface ResumePdfProps {
  zoom: number;
}

// Renders every page of the resume sized to the available width. Loaded lazily
// (ssr: false) by ResumeViewer so pdf.js only ships when someone opens it.
export default function ResumePdf({ zoom }: ResumePdfProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pageWidth = Math.min(containerWidth, MAX_PAGE_WIDTH) * zoom;

  const loading = (
    <div className="flex flex-col items-center justify-center py-24 text-white/50 space-y-3">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-xs tracking-wider">Loading resume…</span>
    </div>
  );

  const error = (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 px-6">
      <p className="text-sm text-white/70">The resume preview couldn&apos;t be loaded in this browser.</p>
      <div className="flex items-center space-x-3">
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wider text-white border border-white/15 hover:bg-white/5 transition-colors"
        >
          OPEN PDF
        </a>
        <a
          href={RESUME_URL}
          download={RESUME_FILENAME}
          className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wider text-[#030712] bg-white hover:bg-white/90 transition-colors"
        >
          DOWNLOAD
        </a>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full">
      {containerWidth > 0 && (
        <Document
          file={RESUME_URL}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={loading}
          error={error}
          externalLinkTarget="_blank"
          externalLinkRel="noopener noreferrer"
          // w-max + min-w-full keeps zoomed pages scrollable instead of clipped on the left
          className="flex flex-col items-center gap-4 w-max min-w-full"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={pageWidth}
              loading={loading}
              className="shadow-2xl rounded-sm overflow-hidden bg-white"
            />
          ))}
        </Document>
      )}
    </div>
  );
}
