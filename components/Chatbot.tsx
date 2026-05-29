"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Send, Mic, MicOff, X, 
  Sparkles, Download, ExternalLink, Bot, User, 
  Volume2, VolumeX, Keyboard, RefreshCw, ChevronRight,
  Maximize2, Minimize2
} from "lucide-react";
import { queryLocalRAG, ChatAction, KNOWLEDGE_BASE } from "./chatbotData";

// Detect mobile/touch once at module level to avoid re-evaluation
const IS_MOBILE = typeof window !== "undefined" && (window.innerWidth < 768 || navigator.maxTouchPoints > 0);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  actions?: ChatAction[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://your-backend-name.onrender.com";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi, I’m Avix — Shivam's AI Assistant.\nAsk me about projects, technologies, AI engineering, or experience.",
      actions: [
        { label: "Summarize Shivam in 30s ⏱️", type: "scroll", target: "trigger:summary" },
        { label: "Show AI Projects 🧭", type: "scroll", target: "#projects" },
        { label: "Explain Technical Skills ⚡", type: "scroll", target: "#skills" },
        { label: "Download Resume 📄", type: "download", target: "/resume/Resume_Shivam.pdf" }
      ]
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"online" | "connecting" | "offline">("connecting");

  // Chat window element references
  const chatEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Abort controller and typewriter references for stopping generation
  const abortControllerRef = useRef<AbortController | null>(null);
  const typewriterTimerRef = useRef<any>(null);

  const isGenerating = isAiTyping || messages.some((m) => m.isStreaming);

  const messagesCount = messages.length;

  // Auto-scroll logic optimized for smooth first-render and jitter-free streaming
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [messagesCount]);

  // Jitter-free stream-scroll during active typewriter updates
  useEffect(() => {
    if (isAiTyping || messages.some(m => m.isStreaming)) {
      if (chatEndRef.current) {
        const container = chatEndRef.current.parentElement;
        if (container) {
          const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
          if (isNearBottom) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "auto"
            });
          }
        }
      }
    }
  }, [messages, isAiTyping]);

  // Initial Speech Synthesis binder
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopVoiceSpeech();
    };
  }, []);

  // Ping backend /health — runs on load, when chatbot opens, and retries every 15s if offline
  const checkHealth = async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${BACKEND_URL}/health`, { signal: controller.signal });
      clearTimeout(id);
      if (response.ok) {
        setBackendStatus("online");
      } else {
        setBackendStatus("offline");
      }
    } catch (err) {
      setBackendStatus("offline");
    }
  };

  // Check on first load
  useEffect(() => {
    checkHealth();
  }, []);

  // Re-check every time chatbot is opened
  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  // Retry every 15s while offline
  useEffect(() => {
    if (backendStatus !== "online") {
      const retryInterval = setInterval(() => {
        checkHealth();
      }, 15000);
      return () => clearInterval(retryInterval);
    }
  }, [backendStatus]);

  // Web Speech STT Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = "en-US";

        recog.onstart = () => {
          setIsListening(true);
          stopVoiceSpeech();
        };

        recog.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          if (transcript.trim()) {
            handleSendMessage(transcript);
          }
        };

        recog.onerror = () => {
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        speechRecognitionRef.current = recog;
      }
    }
  }, []);

  // Text-To-Speech audio synthesizer
  const speakVoiceSpeech = (text: string) => {
    if (isMuted || !synthRef.current) return;
    stopVoiceSpeech();

    // Remove markdown symbols for clean text-to-speech reading
    const cleanText = text
      .replace(/[*#`_]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/⏱️|🧭|⚡|📄|💼|🎓|🐙|✉️/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Load available voices and prefer standard premium English voices
    const voices = synthRef.current.getVoices();
    const premiumVoice = voices.find(
      (v) => 
        (v.name.includes("Google") && v.lang.startsWith("en")) || 
        (v.name.includes("Apple") && v.lang.startsWith("en")) ||
        (v.name.includes("Natural") && v.lang.startsWith("en")) ||
        v.lang.startsWith("en-GB") || 
        v.lang.startsWith("en-US")
    );
    if (premiumVoice) utterance.voice = premiumVoice;

    utterance.onstart = () => setSpeechActive(true);
    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);

    synthRef.current.speak(utterance);
  };

  const stopVoiceSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setSpeechActive(false);
  };

  // Toggle standard listening mode
  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert("Speech Recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }
    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      speechRecognitionRef.current.start();
    }
  };

  // Scrolling + Highlighting core triggers
  const executeAction = (action: ChatAction) => {
    if (action.type === "download") {
      // Trigger PDF download shortcut
      const link = document.createElement("a");
      link.href = action.target;
      link.download = action.target.split("/").pop() || "Shivam_Pathak_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (action.type === "link") {
      // Open GitHub linkage in new tab
      window.open(action.target, "_blank", "noopener,noreferrer");
    } else if (action.type === "scroll") {
      // Special trigger: Summary scrolling triggers 30s summary logic
      if (action.target === "trigger:summary") {
        // Highlight about first
        highlightAndScrollSection("#about");
        return;
      }

      highlightAndScrollSection(action.target);
    }
  };

  const highlightAndScrollSection = (sectionSelector: string) => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    // 1. Smoothly scroll viewport utilizing built-in Lenis triggers
    section.scrollIntoView({ behavior: "smooth", block: "center" });

    // 2. Add dynamic cinematic spotlight glow & dim other sections
    const allSections = document.querySelectorAll("section");
    allSections.forEach((sec) => {
      sec.classList.add("section-spotlight");
      if (`#${sec.id}` === sectionSelector) {
        sec.classList.add("highlight-active");
        sec.classList.remove("dimmed-background");
      } else {
        sec.classList.add("dimmed-background");
        sec.classList.remove("highlight-active");
      }
    });

    // Dim the Hero background as well if it's there
    const heroSection = document.getElementById("hero-section") || document.querySelector("header");
    if (heroSection) {
      heroSection.classList.add("dimmed-background");
    }

    // 3. Clear spotlight class after 3.5 seconds to restore standard layouts
    setTimeout(() => {
      allSections.forEach((sec) => {
        sec.classList.remove("highlight-active", "dimmed-background");
      });
      if (heroSection) {
        heroSection.classList.remove("dimmed-background");
      }
    }, 3500);
  };

  // Cleanup timers and abort controllers on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
      }
    };
  }, []);

  const handleStopGeneration = () => {
    // 1. Abort the fetch controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 2. Clear typewriter interval
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }

    // 3. Reset typing / generating states
    setIsAiTyping(false);

    // 4. Finalize streaming status in messages
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isStreaming ? { ...msg, isStreaming: false } : msg
      )
    );
  };

  // Character Typewriter Stream Simulator
  const streamResponse = (messageId: string, fullAnswer: string, actions?: ChatAction[]) => {
    let index = 0;
    const interval = 12; // Speed in ms per character

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: "", isStreaming: true }
          : msg
      )
    );

    const timer = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const nextContent = fullAnswer.slice(0, index + 1);
            const isDone = index >= fullAnswer.length - 1;
            
            if (isDone) {
              clearInterval(timer);
              if (typewriterTimerRef.current === timer) {
                typewriterTimerRef.current = null;
              }
              // Activate TTS voice narration on streaming completion
              if (isVoiceMode && !isMuted) {
                speakVoiceSpeech(fullAnswer);
              }
            }

            return {
              ...msg,
              content: nextContent,
              isStreaming: !isDone,
              actions: isDone ? actions : undefined
            };
          }
          return msg;
        })
      );
      index++;
    }, interval);

    typewriterTimerRef.current = timer;
  };

  // Main Messaging Core Trigger
  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || inputMessage;
    if (!queryText.trim()) return;

    // Reset input box
    setInputMessage("");

    // Append User Message to conversation history
    const userMsgId = `user-${Date.now()}`;
    const newUserMsg: Message = {
      id: userMsgId,
      role: "user",
      content: queryText
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsAiTyping(true);
    stopVoiceSpeech();

    // Map conversational memory history array for context
    const recentHistory = messages.map((m) => ({
      role: m.role,
      content: m.content
    }));

    // Pre-create Assistant message shell for typewriter streaming
    const assistantMsgId = `assistant-${Date.now()}`;

    try {
      let finalResponse: { answer: string; actions?: ChatAction[] };

      // Initialize master abort controller for cancellation
      const masterController = new AbortController();
      abortControllerRef.current = masterController;

      // 1. First, attempt to contact Python FastAPI server with exponential backoff retries
      try {
        let response: Response | null = null;
        let lastError: any = null;
        const maxRetries = 3;
        const initialDelay = 1000;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            if (masterController.signal.aborted) {
              throw new DOMException("Aborted", "AbortError");
            }

            if (attempt > 0) {
              setBackendStatus("connecting");
              // Wait for exponential backoff delay (e.g. 1s, 2s, 4s) with abort capability
              const delay = initialDelay * Math.pow(2, attempt - 1);
              await new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => {
                  masterController.signal.removeEventListener("abort", onAbort);
                  resolve();
                }, delay);
                const onAbort = () => {
                  clearTimeout(timer);
                  reject(new DOMException("Aborted", "AbortError"));
                };
                masterController.signal.addEventListener("abort", onAbort);
              });
            }

            // Increase timeout on retries to give Render cold starts and LLM response time to finish
            const timeoutDuration = 15000 + attempt * 5000;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

            const onMasterAbort = () => {
              controller.abort();
            };
            masterController.signal.addEventListener("abort", onMasterAbort);

            try {
              response = await fetch(`${BACKEND_URL}/chat`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  message: queryText,
                  history: recentHistory
                }),
                signal: controller.signal
              });
            } finally {
              clearTimeout(timeoutId);
              masterController.signal.removeEventListener("abort", onMasterAbort);
            }

            if (response.ok) {
              setBackendStatus("online");
              break;
            } else {
              throw new Error(`Server returned ${response.status}`);
            }
          } catch (err: any) {
            lastError = err;
            if (err.name === "AbortError" && masterController.signal.aborted) {
              throw err;
            }
            // If it's the last attempt, don't retry further
            if (attempt === maxRetries - 1) {
              throw err;
            }
          }
        }

        if (response && response.ok) {
          const data = await response.json();
          finalResponse = {
            answer: data.answer,
            actions: data.actions || []
          };
        } else {
          throw lastError || new Error("Failed to fetch");
        }
      } catch (err: any) {
        if (err.name === "AbortError" && masterController.signal.aborted) {
          throw err;
        }
        // 2. FAILOVER ENGINE: Contact local client RAG system
        setBackendStatus("offline");
        finalResponse = queryLocalRAG(queryText, recentHistory);
      }

      if (masterController.signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      // Add assistant placeholder to state
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "" }
      ]);
      setIsAiTyping(false);

      // Trigger typewriter streaming
      streamResponse(assistantMsgId, finalResponse.answer, finalResponse.actions);

      // Auto-trigger scrolls if response has specific scroll actions
      if (finalResponse.actions && finalResponse.actions.length > 0) {
        const scrollAction = finalResponse.actions.find((a) => a.type === "scroll");
        if (scrollAction) {
          // Micro delay to let typewriter load and scroll nicely
          setTimeout(() => {
            if (!masterController.signal.aborted) {
              executeAction(scrollAction);
            }
          }, 800);
        }
      }

    } catch (e: any) {
      setIsAiTyping(false);
      if (e.name === "AbortError") {
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: "assistant",
          content: "I ran into a small connectivity hurdle. Feel free to ask again, or try scrolling through my credentials manually!"
        }
      ]);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isGenerating) {
      handleSendMessage();
    }
  };

  const startVoiceAssistantMode = () => {
    setIsVoiceMode(true);
    stopVoiceSpeech();
    // Prompt instant listening
    setTimeout(() => {
      if (speechRecognitionRef.current && !isListening) {
        speechRecognitionRef.current.start();
      }
    }, 400);
  };

  const stopVoiceAssistantMode = () => {
    setIsVoiceMode(false);
    setIsListening(false);
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    stopVoiceSpeech();
  };

  return (
    <>
      {/* 1. Cinematic Floating Pulse Button (Bottom-Right) */}
      <div className="fixed bottom-[clamp(1rem,3vh,2rem)] right-[clamp(1rem,3vw,2rem)] z-[9999] flex flex-col items-end space-y-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 50 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              className="relative group w-14 h-14 rounded-full bg-[#030712] text-white cursor-pointer shadow-lg border border-white/10 flex items-center justify-center"
              aria-label="Open AI Assistant"
            >
              {/* Outer Subtle Aura */}
              <div className="absolute inset-0 rounded-full bg-white/5 blur-sm opacity-60 group-hover:opacity-100 transition-all duration-300" />
              
              <img 
                src="/images/avix-logo.png" 
                alt="Avix Logo" 
                className="w-12 h-12 object-contain relative z-10"
              />
              
              {/* Floating Badge Helper (Positioned perfectly on the outer boundary edge) */}
              <span className="absolute top-0.5 right-0.5 flex h-3 w-3 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-[#030712]"></span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Glassmorphic Cinematic Chat Container Backdrop & Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-outside backdrop catch-layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                setIsMaximized(false);
                stopVoiceAssistantMode();
              }}
              className="fixed inset-0 z-[99998] bg-black/20 cursor-pointer"
            />

            {/* Chatbot Window Container */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className={`fixed z-[99999] flex flex-col overflow-hidden shadow-2xl overscroll-contain chatbot-panel transition-all duration-300 ease-in-out ${
                isMaximized
                  ? "inset-0 w-full h-full md:rounded-none rounded-none"
                  : "inset-0 md:inset-auto md:bottom-[clamp(1rem,3vh,2rem)] md:right-[clamp(1rem,3vw,2rem)] w-full h-[100dvh] md:w-[370px] md:h-[540px] md:max-h-[calc(100dvh-6rem)] md:rounded-[24px] rounded-none"
              }`}
            >
              {/* Ambient Background Light Leaks Inside Chat */}
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-white/[0.02] blur-[40px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white/[0.01] blur-[40px] pointer-events-none" />


            {/* A. Dynamic Chat Header */}
            <div className="relative z-10 px-4 pt-[calc(0.85rem+env(safe-area-inset-top,0px))] md:pt-3.5 pb-3.5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <img 
                    src="/images/avix-logo.png" 
                    alt="Avix Logo" 
                    className="w-7 h-7 object-contain"
                  />
                  <span className={`absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-[#030712] transition-colors duration-300 ${
                    backendStatus === "online" 
                      ? "bg-green-500" 
                      : backendStatus === "connecting"
                      ? "bg-orange-500 animate-pulse"
                      : "bg-red-500"
                  }`} />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm tracking-[0.08em] text-white flex items-center">
                    AVIX
                    <Sparkles className="w-3.5 h-3.5 text-white/40 ml-1.5" />
                  </h4>
                  <p className={`text-[10px] tracking-widest font-bold uppercase transition-colors duration-300 ${
                    backendStatus === "online" 
                      ? "text-green-400 font-extrabold" 
                      : backendStatus === "connecting"
                      ? "text-orange-400 font-extrabold animate-pulse"
                      : "text-white/30 font-bold"
                  }`}>
                    {backendStatus === "online" ? "ONLINE" : backendStatus === "connecting" ? "WAKING..." : "LOCAL"}
                  </p>
                </div>
              </div>

              {/* Header Action Shortcuts */}
              <div className="flex items-center space-x-2">
                {/* Voice mode toggle */}
                <button
                  onClick={isVoiceMode ? stopVoiceAssistantMode : startVoiceAssistantMode}
                  className={`p-2 rounded-lg border transition-all duration-300 ${
                    isVoiceMode 
                      ? "bg-accent-cinematic/25 text-white border-accent-cinematic/40" 
                      : "text-white/40 hover:text-white border-white/5 hover:border-white/10"
                  }`}
                  title="Toggle Voice Mode"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Mute Audio Voice toggle */}
                <button
                  onClick={() => {
                    const next = !isMuted;
                    setIsMuted(next);
                    if (next) stopVoiceSpeech();
                  }}
                  className={`p-2 rounded-lg border transition-all duration-300 text-white/40 hover:text-white border-white/5 hover:border-white/10 ${
                    isMuted ? "text-accent-orange/70" : ""
                  }`}
                  title={isMuted ? "Unmute Voice Reading" : "Mute Voice Reading"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Maximize / Restore toggle */}
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 rounded-lg border text-white/40 hover:text-white border-white/5 hover:border-white/10 transition-all duration-300"
                  title={isMaximized ? "Restore Chatbot" : "Maximize Chatbot"}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close panel */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMaximized(false);
                    stopVoiceAssistantMode();
                  }}
                  className="p-2 rounded-lg text-white/40 hover:text-white border border-white/5 hover:border-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* B. Message History Area */}
            <div 
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="relative z-10 flex-grow min-h-0 overflow-y-auto overscroll-contain px-4 py-3.5 space-y-3.5 scroll-smooth flex flex-col chatbot-messages-container"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 max-w-[88%] ${
                    msg.role === "user" ? "self-end flex-row-reverse space-x-reverse" : "self-start"
                  }`}
                >
                  {/* Icon Avatars */}
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-xl border shrink-0 bg-white/[0.02] border-white/10 overflow-hidden text-white/70"
                  >
                    {msg.role === "user" ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <img 
                        src="/images/avix-logo.png" 
                        alt="Avix" 
                        className="w-4 h-4 object-contain"
                      />
                    )}
                  </div>

                  {/* Speech Message Body */}
                  <div className="flex flex-col space-y-1.5">
                    <div
                      className={`px-4 py-3 rounded-[20px] text-[13px] leading-relaxed font-sans shadow-lg border ${
                        msg.role === "user"
                          ? "bg-white/[0.06] border-white/10 text-white rounded-tr-none"
                          : "bg-white/[0.02] border-white/5 text-white/90 rounded-tl-none"
                      }`}
                    >
                      {renderMarkdown(msg.content, msg.isStreaming)}
                    </div>

                    {/* Integrated Action Triggers inside Message */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => executeAction(act)}
                            className="inline-flex items-center space-x-1 px-3 py-1 rounded-md text-[9.5px] font-medium tracking-wider text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                          >
                            <span>{act.label}</span>
                            {act.type === "download" && <Download className="w-2 h-2 text-white/50" />}
                            {act.type === "link" && <ExternalLink className="w-2 h-2 text-white/50" />}
                            {act.type === "scroll" && <ChevronRight className="w-2 h-2 text-white/50" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Dynamic typing indicators */}
              {isAiTyping && (
                <div className="flex items-start space-x-2 self-start max-w-[88%]">
                  <div className="w-6 h-6 flex items-center justify-center rounded-xl border bg-accent-cinematic/10 border-accent-cinematic/20 shrink-0 overflow-hidden">
                    <img 
                      src="/images/avix-logo.png" 
                      alt="Avix" 
                      className={`w-4 h-4 object-contain ${backendStatus === "connecting" ? "animate-pulse" : ""}`}
                    />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-[16px] rounded-tl-none bg-white/[0.03] border border-white/5 flex flex-col space-y-1.5 min-w-[120px]">
                    <span className="text-[9px] tracking-wider font-bold uppercase transition-colors duration-300 select-none opacity-60">
                      {backendStatus === "online" 
                        ? "Analyzing Context..." 
                        : backendStatus === "connecting"
                        ? "Waking Cloud Brain..."
                        : "Querying Local Core..."}
                    </span>
                    <div className="flex items-center space-x-1 h-2">
                      <div className="w-1 h-1 rounded-full bg-accent-cinematic animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1 h-1 rounded-full bg-accent-cinematic animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1 h-1 rounded-full bg-accent-cinematic animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* C. Futuristic Embedded Voice mode UI Overlays */}
            {isVoiceMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-x-0 bottom-[68px] z-20 bg-black/85 backdrop-blur-sm md:backdrop-blur-md border-t border-white/10 px-5 py-6 flex flex-col items-center justify-center space-y-4"
              >
                {/* Visual Listening status text */}
                <div className="text-center">
                  <p className="text-[11px] tracking-[0.15em] font-bold text-accent-cinematic uppercase animate-pulse">
                    {isListening ? "Listening to your voice..." : speechActive ? "Narrating response..." : "Voice mode active"}
                  </p>
                  <p className="text-[9px] text-white/40 mt-1">Speak clearly (e.g. "Tell me about TravelArt")</p>
                </div>

                {/* glowing breathing rings */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {isListening && <div className="voice-pulse-ring" />}
                  <button
                    onClick={toggleListening}
                    className={`relative z-10 p-4 rounded-full text-white shadow-lg cursor-pointer border border-white/10 transition-all duration-300 ${
                      isListening 
                        ? "bg-accent-orange hover:bg-accent-orange/90" 
                        : "bg-accent-cinematic hover:bg-accent-cinematic/90"
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                </div>

                {/* Apple Siri-like Sound Wave visualizer bars (reduced on mobile for perf) */}
                <div className="flex items-center space-x-1.5 h-8">
                  {[...Array(IS_MOBILE ? 4 : 7)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={
                        isListening || speechActive
                          ? { height: [8, Math.random() * 24 + 10, 8] }
                          : { height: 6 }
                      }
                      transition={{
                        repeat: Infinity,
                        duration: 0.6 + i * 0.1,
                        ease: "easeInOut"
                      }}
                      className="w-1 rounded-full bg-white/40"
                    />
                  ))}
                </div>

                {/* Return to typing shortcut */}
                <button
                  onClick={stopVoiceAssistantMode}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white/60 hover:text-white border border-white/5 hover:border-white/10 transition-colors"
                >
                  <Keyboard className="w-3 h-3 text-accent-orange" />
                  <span>SWITCH TO KEYBOARD</span>
                </button>
              </motion.div>
            )}

            {/* D. Input Action Form Panel */}
            <div className="relative z-10 px-4 pt-3 pb-[calc(0.85rem+env(safe-area-inset-bottom,0px))] md:pb-3.5 border-t border-white/10 bg-black/45 backdrop-blur-md shrink-0">
              <div className="flex items-center space-x-2">
                {/* Standard keyboard input box */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    isVoiceMode 
                      ? "Voice mode enabled..." 
                      : isGenerating 
                      ? "Avix is writing..." 
                      : "Ask Shivam..."
                  }
                  disabled={isVoiceMode}
                  className="flex-grow bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-accent-cinematic/30 transition-colors disabled:opacity-50"
                />

                {/* Voice activate mic trigger */}
                {!isVoiceMode && (
                  <button
                    onClick={startVoiceAssistantMode}
                    className="p-2 rounded-xl border border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-accent-orange/30 transition-all active:scale-95 cursor-pointer"
                    title="Activate Voice AI Assistant"
                  >
                    <Mic className="w-4 h-4 text-accent-orange" />
                  </button>
                )}

                {/* Send or Stop action */}
                {isGenerating ? (
                  <button
                    onClick={handleStopGeneration}
                    className="p-2 w-8 h-8 rounded-full bg-white text-black hover:bg-white/90 transition-all active:scale-98 cursor-pointer shrink-0 flex items-center justify-center"
                    title="Stop generating"
                  >
                    <div className="w-2.5 h-2.5 bg-black rounded-[2px]" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isVoiceMode}
                    className="p-2 rounded-xl bg-white text-black disabled:opacity-30 disabled:pointer-events-none hover:bg-white/90 transition-all active:scale-98 cursor-pointer shrink-0"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </>
  );
}

// Custom Markdown-to-JSX Converter Utility
const renderMarkdown = (content: string, isStreaming?: boolean) => {
  if (!content) return null;

  // Split by line breaks to identify block-level structures
  const blocks = content.split("\n");

  return (
    <div className="space-y-3.5">
      {blocks.map((block, blockIndex) => {
        const text = block.trim();
        if (!text) return <div key={blockIndex} className="h-2" />;

        const isLastBlock = blockIndex === blocks.length - 1;

        // 1. Heading 3: ### Title
        if (text.startsWith("### ")) {
          const title = text.replace("### ", "");
          return (
            <h5 key={blockIndex} className="font-display font-semibold text-[13px] tracking-wider text-white/70 mt-4 mb-2 uppercase">
              {parseInlineMarkdown(title, isStreaming && isLastBlock)}
            </h5>
          );
        }

        // 2. Heading 2: ## Title
        if (text.startsWith("## ")) {
          const title = text.replace("## ", "");
          return (
            <h4 key={blockIndex} className="font-display font-black text-sm tracking-wider text-white mt-5 mb-3 uppercase">
              {parseInlineMarkdown(title, isStreaming && isLastBlock)}
            </h4>
          );
        }

        // 3. Custom Bullet lists: * Text or - Text
        if (text.startsWith("* ") || text.startsWith("- ")) {
          const body = text.slice(2);
          return (
            <div key={blockIndex} className="flex items-start space-x-2 pl-1 my-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0 mt-2" />
              <span className="text-[13px] text-white/85 leading-relaxed font-sans font-medium">
                {parseInlineMarkdown(body, isStreaming && isLastBlock)}
              </span>
            </div>
          );
        }

        // 4. Custom Numbered lists: 1. Text
        if (/^\d+\.\s/.test(text)) {
          const match = text.match(/^(\d+)\.\s(.*)/);
          if (match) {
            const num = match[1];
            const body = match[2];
            return (
              <div key={blockIndex} className="flex items-start space-x-2 pl-1 my-1.5">
                <span className="text-[11px] font-mono font-bold text-white/50 shrink-0 mt-0.5">{num}.</span>
                <span className="text-[13px] text-white/85 leading-relaxed font-sans font-medium">
                  {parseInlineMarkdown(body, isStreaming && isLastBlock)}
                </span>
              </div>
            );
          }
        }

        // 5. Default Paragraph block
        return (
          <p key={blockIndex} className="text-[13px] leading-relaxed text-white/85 font-medium font-sans">
            {parseInlineMarkdown(block, isStreaming && isLastBlock)}
          </p>
        );
      })}
    </div>
  );
};

// Inline-level elements parser (Bold, Links, Inline Code, Caret cursor)
const parseInlineMarkdown = (inlineText: string, showCaret?: boolean): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remainingText = inlineText;

  while (remainingText.length > 0) {
    const boldIndex = remainingText.indexOf("**");
    const codeIndex = remainingText.indexOf("`");
    const linkIndex = remainingText.indexOf("[");

    const indices = [
      { type: "bold", index: boldIndex },
      { type: "code", index: codeIndex },
      { type: "link", index: linkIndex }
    ].filter(item => item.index !== -1)
     .sort((a, b) => a.index - b.index);

    if (indices.length === 0) {
      parts.push(remainingText);
      break;
    }

    const nearest = indices[0];

    // Push standard text before match
    if (nearest.index > 0) {
      parts.push(remainingText.slice(0, nearest.index));
    }

    remainingText = remainingText.slice(nearest.index);

    if (nearest.type === "bold") {
      const closingIndex = remainingText.indexOf("**", 2);
      if (closingIndex !== -1) {
        const boldVal = remainingText.slice(2, closingIndex);
        parts.push(
          <strong key={parts.length} className="font-bold text-white">
            {boldVal}
          </strong>
        );
        remainingText = remainingText.slice(closingIndex + 2);
      } else {
        parts.push("**");
        remainingText = remainingText.slice(2);
      }
    } else if (nearest.type === "code") {
      const closingIndex = remainingText.indexOf("`", 1);
      if (closingIndex !== -1) {
        const codeVal = remainingText.slice(1, closingIndex);
        parts.push(
          <code key={parts.length} className="bg-white/[0.06] border border-white/10 px-1 py-0.5 rounded font-mono text-[10px] text-white/70 font-semibold mx-0.5">
            {codeVal}
          </code>
        );
        remainingText = remainingText.slice(closingIndex + 1);
      } else {
        parts.push("`");
        remainingText = remainingText.slice(1);
      }
    } else if (nearest.type === "link") {
      const closingBrace = remainingText.indexOf("]");
      const openingParen = remainingText.indexOf("(", closingBrace);
      const closingParen = remainingText.indexOf(")", openingParen);

      if (closingBrace !== -1 && openingParen === closingBrace + 1 && closingParen !== -1) {
        const label = remainingText.slice(1, closingBrace);
        const url = remainingText.slice(openingParen + 1, closingParen);
        parts.push(
          <a
            key={parts.length}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white font-bold underline transition-colors"
          >
            {label}
          </a>
        );
        remainingText = remainingText.slice(closingParen + 1);
      } else {
        parts.push("[");
        remainingText = remainingText.slice(1);
      }
    }
  }

  // Inject dynamic typewriter console caret right at the tail
  if (showCaret) {
    parts.push(<span key="caret" className="chatbot-caret" />);
  }

  return parts;
};
