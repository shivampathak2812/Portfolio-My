"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Send, Mic, MicOff, X, 
  Sparkles, Download, ExternalLink, Bot, User, 
  Volume2, VolumeX, Keyboard, RefreshCw, ChevronRight
} from "lucide-react";
import { queryLocalRAG, ChatAction, KNOWLEDGE_BASE } from "./chatbotData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  actions?: ChatAction[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi, I’m Shivam AI Assistant.\nAsk me about projects, technologies, AI engineering, or experience.",
      actions: [
        { label: "Summarize Shivam in 30s ⏱️", type: "scroll", target: "trigger:summary" },
        { label: "Show AI Projects 🧭", type: "scroll", target: "#projects" },
        { label: "Explain Technical Skills ⚡", type: "scroll", target: "#skills" },
        { label: "Download Resume 📄", type: "download", target: "/resume/Shivam-Resume.pdf" }
      ]
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);

  // Chat window element references
  const chatEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll to bottom of chat history when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

      // 1. First, attempt to contact local Python FastAPI server
      try {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: queryText,
            history: recentHistory
          }),
          // Snappy timeout to immediately trigger failover client-side RAG in production/Vercel
          signal: AbortSignal.timeout(1800)
        });

        if (response.ok) {
          const data = await response.json();
          finalResponse = {
            answer: data.answer,
            actions: data.actions || []
          };
        } else {
          throw new Error("FastAPI server error");
        }
      } catch (err) {
        // 2. FAILOVER ENGINE: Contact local client RAG system
        finalResponse = queryLocalRAG(queryText, recentHistory);
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
            executeAction(scrollAction);
          }, 800);
        }
      }

    } catch (e) {
      setIsAiTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: "assistant",
          content: "I ran into a small connectivity hurdle. Feel free to ask again, or try scrolling through my credentials manually!"
        }
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end space-y-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 50 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative group p-4 rounded-full bg-gradient-to-r from-accent-cinematic to-accent-orange text-white cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(124,58,237,0.45)] border border-white/10"
              aria-label="Open AI Assistant"
            >
              {/* Outer Breathing Glowing Aura */}
              <div className="absolute inset-0 rounded-full bg-accent-cinematic/30 blur-md group-hover:blur-lg transition-all duration-300 opacity-60 group-hover:opacity-100 animate-pulse" />
              
              <MessageSquare className="w-6 h-6 relative z-10 animate-pulse" />
              
              {/* Floating Badge Helper */}
              <span className="absolute -top-1 -left-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
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
                stopVoiceAssistantMode();
              }}
              className="fixed inset-0 z-[99998] bg-black/35 backdrop-blur-[2px] cursor-pointer"
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
              className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-[99999] w-full h-full md:w-[420px] md:h-[620px] md:rounded-[24px] rounded-none glass-panel border border-white/15 md:border flex flex-col overflow-hidden shadow-2xl shadow-black/80 overscroll-contain"
            >
              {/* Ambient Background Light Leaks Inside Chat */}
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-accent-cinematic/10 blur-[60px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent-orange/5 blur-[60px] pointer-events-none" />


            {/* A. Dynamic Chat Header */}
            <div className="relative z-10 px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/35 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="relative p-2 rounded-xl bg-accent-cinematic/10 border border-accent-cinematic/20">
                  <Bot className="w-5 h-5 text-accent-cinematic animate-pulse" />
                  <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500 border border-[#0B0F19]" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm tracking-[0.08em] text-white flex items-center">
                    SHIVAM AI
                    <Sparkles className="w-3.5 h-3.5 text-accent-orange ml-1.5 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-white/40 tracking-wider font-semibold uppercase">Portfolio Concierge</p>
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

                {/* Close panel */}
                <button
                  onClick={() => {
                    setIsOpen(false);
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
              className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4 scroll-smooth flex flex-col chatbot-messages-container"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 max-w-[85%] ${
                    msg.role === "user" ? "self-end flex-row-reverse space-x-reverse" : "self-start"
                  }`}
                >
                  {/* Icon Avatars */}
                  <div
                    className={`p-1.5 rounded-lg border shrink-0 ${
                      msg.role === "user" 
                        ? "bg-accent-orange/10 border-accent-orange/20 text-accent-orange" 
                        : "bg-accent-cinematic/10 border-accent-cinematic/20 text-accent-cinematic"
                    }`}
                  >
                    {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Speech Message Body */}
                  <div className="flex flex-col space-y-2">
                    <div
                      className={`px-4 py-3 rounded-[18px] text-xs leading-relaxed font-sans shadow-md border ${
                        msg.role === "user"
                          ? "bg-accent-orange/10 border-accent-orange/15 text-white rounded-tr-none"
                          : "bg-white/[0.03] border-white/5 text-white/90 rounded-tl-none"
                      }`}
                    >
                      {/* Formatted Message Parser (preserving line breaks) */}
                      <p className="whitespace-pre-line font-medium leading-relaxed font-sans">
                        {msg.content}
                        {msg.isStreaming && <span className="chatbot-caret" />}
                      </p>
                    </div>

                    {/* Integrated Action Triggers inside Message */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => executeAction(act)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white border border-white/10 glass-panel hover:border-accent-cinematic/40 transition-all duration-300"
                          >
                            <span>{act.label}</span>
                            {act.type === "download" && <Download className="w-2.5 h-2.5 text-accent-cinematic" />}
                            {act.type === "link" && <ExternalLink className="w-2.5 h-2.5 text-accent-orange" />}
                            {act.type === "scroll" && <ChevronRight className="w-2.5 h-2.5 text-accent-cinematic" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Dynamic typing indicators */}
              {isAiTyping && (
                <div className="flex items-start space-x-2.5 self-start max-w-[85%]">
                  <div className="p-1.5 rounded-lg border bg-accent-cinematic/10 border-accent-cinematic/20 text-accent-cinematic shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-4 py-3 rounded-[18px] rounded-tl-none bg-white/[0.03] border border-white/5 flex items-center space-x-1.5 h-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cinematic animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cinematic animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cinematic animate-bounce" style={{ animationDelay: "300ms" }} />
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
                className="absolute inset-x-0 bottom-[68px] z-20 bg-black/85 backdrop-blur-md border-t border-white/10 px-5 py-6 flex flex-col items-center justify-center space-y-4"
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

                {/* Apple Siri-like Sound Wave visualizer bars */}
                <div className="flex items-center space-x-1.5 h-8">
                  {[...Array(7)].map((_, i) => (
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
                      className={`w-1 rounded-full ${
                        i % 2 === 0 ? "bg-accent-cinematic" : "bg-accent-orange"
                      }`}
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
            <div className="relative z-10 px-5 py-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                {/* Standard keyboard input box */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isVoiceMode ? "Voice mode enabled..." : "Ask Shivam's AI Assistant..."}
                  disabled={isVoiceMode}
                  className="flex-grow bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-accent-cinematic/40 transition-colors disabled:opacity-50"
                />

                {/* Voice activate mic trigger */}
                {!isVoiceMode && (
                  <button
                    onClick={startVoiceAssistantMode}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-accent-orange/30 transition-all active:scale-95 cursor-pointer"
                    title="Activate Voice AI Assistant"
                  >
                    <Mic className="w-4 h-4 text-accent-orange" />
                  </button>
                )}

                {/* Send action */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isVoiceMode}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-accent-cinematic to-accent-orange text-white disabled:opacity-30 disabled:pointer-events-none hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </>
  );
}
