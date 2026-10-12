"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Menu, X } from "lucide-react";
import { RESUME_FILENAME, RESUME_HASH, RESUME_URL, openResumeViewer } from "./resume";
import { scrollToTarget } from "./lenis";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollToTarget(href);
  };

  return (
    <>
      {/* Floating glass pill */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="fixed top-4 md:top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div
          className={`pointer-events-auto glass-panel w-full md:w-auto flex items-center justify-between md:justify-start gap-1 rounded-full pl-5 pr-2 py-2 transition-shadow duration-500 ${
            isScrolled ? "shadow-[0_10px_40px_-10px_var(--shadow-strong)]" : ""
          }`}
        >
          <a
            href="#"
            className="font-display font-semibold text-sm tracking-tight text-white md:mr-4 focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              scrollToTarget(0);
            }}
          >
            Shivam Pathak
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="px-3.5 py-2 rounded-full text-sm text-white/65 hover:text-white hover:bg-white/5 transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:ml-3">
            <ThemeToggle />
            <a
              href={RESUME_HASH}
              onClick={(e) => {
                e.preventDefault();
                openResumeViewer();
              }}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-background-cinematic hover:opacity-90 transition-opacity"
            >
              <FileText className="w-3.5 h-3.5" />
              Resume
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-white/80 hover:text-white transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background-cinematic/90 backdrop-blur-xl md:hidden flex flex-col justify-center px-8"
          >
            <div className="flex flex-col space-y-8 text-center">
              {navItems.map((item, idx) => (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="font-display text-3xl tracking-tight font-semibold text-white/75 hover:text-white transition-colors duration-300"
                >
                  {item.name}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <a
                  href={RESUME_HASH}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    openResumeViewer();
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold text-white glass-panel"
                >
                  <FileText className="w-4 h-4 text-accent-soft" />
                  <span>View resume</span>
                </a>
                <a
                  href={RESUME_URL}
                  download={RESUME_FILENAME}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold text-white glass-panel"
                >
                  <Download className="w-4 h-4 text-accent-soft" />
                  <span>Download resume</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
