"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, FileText, Copy, Check, Terminal } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const emailAddress = "pathakshivam3738@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socialLinks = [
    {
      name: "LINKEDIN",
      icon: <Linkedin className="w-5 h-5 text-white/70" />,
      url: "https://linkedin.com/in/shivam-pathak-9a76ba246",
      label: "Connect professionally",
    },
    {
      name: "GITHUB",
      icon: <Github className="w-5 h-5 text-white/70" />,
      url: "https://github.com/shivampathak2812",
      label: "View open-source files",
    },
    {
      name: "RESUME",
      icon: <FileText className="w-5 h-5 text-white/70" />,
      url: "/resume/Resume_Shivam.pdf",
      download: "Shivam_Pathak_Resume.pdf",
      label: "Download offline PDF",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section
      id="contact"
      className="relative w-full py-28 md:py-36 bg-background-cinematic overflow-hidden px-6 md:px-12"
    >
      {/* Dynamic Background Light Rings */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent-cinematic/[0.005] blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-orange/[0.001] blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col text-center items-center justify-center"
        >
          {/* Section Indicator */}
          <motion.div
            variants={itemVariants}
            className="text-[10px] tracking-[0.3em] font-semibold text-white/40 mb-3 flex items-center space-x-2"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>04 / CONNECT</span>
          </motion.div>

          {/* Outro Typography */}
          <motion.h2
            variants={itemVariants}
            className="font-display font-bold text-4xl md:text-6xl leading-tight text-white uppercase tracking-wide mb-6"
          >
            Initiate <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">Sequence</span>.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm text-white/50 max-w-md mb-12 leading-relaxed font-light"
          >
            Let&apos;s collaborate to architect robust machine learning engines, modern developer portfolios, or low-latency APIs.
          </motion.p>

          {/* Core Copy-to-Clipboard Email Dashboard */}
          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-md p-2.5 rounded-3xl glass-panel border border-white/5 mb-16 shadow-xl shadow-black/40"
          >
            <div className="relative w-full h-full rounded-2xl bg-[#030712] p-4 flex items-center justify-between border border-white/5">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/70">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[8px] tracking-[0.2em] font-semibold text-white/40">DIRECT EMAIL</p>
                  <p className="text-xs font-bold text-white tracking-wide">{emailAddress}</p>
                </div>
              </div>

              {/* Action: Copy glass button */}
              <button
                onClick={handleCopyEmail}
                className="px-4 py-2.5 rounded-lg text-[10px] font-bold tracking-wider text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center space-x-2 active:scale-98 cursor-pointer focus:outline-none"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-accent-orange" />
                    <span className="text-accent-orange">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-white/60" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Social Tiles Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                download={link.download}
                target={link.download ? undefined : "_blank"}
                rel={link.download ? undefined : "noopener noreferrer"}
                whileHover={{ y: -2 }}
                className="relative rounded-2xl glass-panel border border-white/5 p-6 flex flex-col items-center justify-center hover:border-white/15 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group select-none cursor-pointer"
              >
                {/* Tile Icon with pulse anim on hover */}
                <div className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/[0.05] group-hover:bg-white/[0.04] group-hover:border-white/15 flex items-center justify-center mb-4 transition-all duration-300">
                  {link.icon}
                </div>

                <span className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-1">
                  {link.name}
                </span>
                <span className="text-[10px] text-white/40 font-light tracking-wide text-center">
                  {link.label}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Outro Footer Trademark */}
          <motion.div
            variants={itemVariants}
            className="pt-20 mt-12 border-t border-white/5 w-full flex flex-col sm:flex-row items-center justify-between text-white/30 text-[10px] tracking-widest font-light space-y-4 sm:space-y-0"
          >
            <span>© 2026 SHIVAM PATHAK. ALL RIGHTS RESERVED.</span>
            <span>BUILT WITH NEXT.JS 15, THREE.JS, & GSAP</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
