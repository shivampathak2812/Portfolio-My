"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "ABOUT", href: "#about" },
    { name: "EDUCATION", href: "#education" },
    { name: "SKILLS", href: "#skills" },
    { name: "PROJECTS", href: "#projects" },
    { name: "CONTACT", href: "#contact" },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-4 bg-background-cinematic/70 backdrop-blur-md border-b border-white/5 shadow-lg"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo / Personal Mark */}
          <a
            href="#"
            className="group flex items-center space-x-3 text-white focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="font-display font-black tracking-[0.2em] text-lg md:text-xl transition-all duration-300 group-hover:text-glow-accent group-hover:text-accent-cinematic">
              SHIVAM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cinematic group-hover:bg-accent-orange transition-all duration-300" />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="relative text-xs tracking-[0.2em] font-medium text-white/60 hover:text-white transition-colors duration-300 py-2 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-accent-cinematic to-accent-orange transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA: Download Resume */}
          <div className="hidden md:block">
            <a
              href="/resume/Resume_Shivam.pdf"
              download="Shivam_Pathak_Resume.pdf"
              className="relative overflow-hidden group inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white border border-white/10 glass-panel hover:border-accent-cinematic/50 transition-all duration-300 active:scale-95"
            >
              {/* Button background anim */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-cinematic/20 to-accent-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <Download className="w-3.5 h-3.5 text-accent-cinematic group-hover:text-white transition-colors duration-300" />
              <span className="relative z-10">RESUME</span>
            </a>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
            className="fixed inset-0 z-40 bg-background-cinematic/95 backdrop-blur-2xl md:hidden flex flex-col justify-center px-8"
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
                  className="text-xl tracking-[0.25em] font-medium text-white/70 hover:text-white hover:text-glow-accent transition-all duration-300"
                >
                  {item.name}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="pt-8 flex justify-center"
              >
                <a
                  href="/resume/Resume_Shivam.pdf"
                  download="Shivam_Pathak_Resume.pdf"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wider text-white border border-white/10 glass-panel"
                >
                  <Download className="w-4 h-4 text-accent-cinematic" />
                  <span>DOWNLOAD RESUME</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
