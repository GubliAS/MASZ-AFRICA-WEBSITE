'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Phone,
  FileText,
  Layers,
  Copy,
  Pencil,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Mic,
  MicOff,
} from 'lucide-react';
import clsx from 'clsx';
import gsap from 'gsap';

const MAX_INPUT_LENGTH = 500;
const LONG_PRESS_MS = 500;

function getSpeechRecognitionClass(): (new () => {
  start(): void;
  stop(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => unknown;
    webkitSpeechRecognition?: new () => unknown;
  };
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as ReturnType<typeof getSpeechRecognitionClass>;
}

function getTranscriptFromResult(result: unknown): string {
  const r = result as { length?: number; item?(i: number): { transcript?: string }; 0?: { transcript?: string } };
  if (!r) return '';
  const alt = typeof r.item === 'function' ? r.item(0) : r[0];
  return (alt?.transcript ?? '').trim();
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

/** Wraps a message row and runs GSAP entrance animation (slide + fade + scale). */
function AnimatedMessageRow({
  messageId,
  isUser,
  children,
}: {
  messageId: string;
  isUser: boolean;
  children: React.ReactNode;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const fromX = isUser ? 48 : -48;
    const tl = gsap.timeline();
    tl.fromTo(
      el,
      {
        opacity: 0,
        x: fromX,
        scale: 0.92,
        filter: 'blur(4px)',
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.55,
        ease: 'back.out(1.2)',
        overwrite: 'auto',
      }
    );
    if (!isUser) {
      const actions = el.querySelector('[data-bot-actions]');
      if (actions) {
        const icons = actions.querySelectorAll('button');
        tl.fromTo(
          icons,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.05,
            ease: 'back.out(1.4)',
            overwrite: 'auto',
          },
          '-0.15'
        );
      }
    }
  }, [messageId, isUser]);

  return (
    <div ref={rowRef} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      {children}
    </div>
  );
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [greeting] = useState(() => getTimeBasedGreeting());
  const [userMessageActionsVisibleId, setUserMessageActionsVisibleId] = useState<string | null>(null);
  const [botFeedback, setBotFeedback] = useState<Record<string, 'up' | 'down' | null>>({});
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const recognitionRef = useRef<{
    start(): void;
    stop(): void;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((e: unknown) => void) | null;
    onend: (() => void) | null;
    onerror: ((e: { error: string }) => void) | null;
  } | null>(null);
  const speechResultsCountRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);

  // Mobile: lock body scroll when chat is open so only chat scrolls (WhatsApp-style)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isOpen) return;
    if (!isMobile()) return;

    scrollPositionRef.current = window.scrollY;
    const style = document.body.style;
    const prevOverflow = style.overflow;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevWidth = style.width;

    style.overflow = 'hidden';
    style.position = 'fixed';
    style.top = `-${scrollPositionRef.current}px`;
    style.width = '100%';

    return () => {
      style.overflow = prevOverflow;
      style.position = prevPosition;
      style.top = prevTop;
      style.width = prevWidth;
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [isOpen]);

  // Mobile: resize chat to visual viewport so keyboard “slides up” content (ChatGPT-style, no page behind keyboard)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    if (!isOpen) return;

    const el = chatWindowRef.current;
    const vv = window.visualViewport;

    const update = () => {
      if (!el || !isMobile()) return;
      el.style.height = `${vv.height}px`;
      el.style.top = `${vv.offsetTop}px`;
      el.style.left = `${vv.offsetLeft}px`;
      el.style.width = `${vv.width}px`;
      // Keep input above keyboard (WhatsApp/ChatGPT-style): scroll into view after layout
      requestAnimationFrame(() => {
        inputRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      });
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      }, 150);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);

    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      if (el && isMobile()) {
        el.style.height = '';
        el.style.top = '';
        el.style.left = '';
        el.style.width = '';
      }
    };
  }, [isOpen]);

  const handleNewChat = () => {
    setMessages([]);
    setUserMessageActionsVisibleId(null);
    setBotFeedback({});
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! Our team will get back to you soon.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleSamplePrompt = () => {
    setInputValue('Tell me more about your services');
  };

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleEditUserMessage = useCallback((text: string) => {
    setInputValue(text);
    setUserMessageActionsVisibleId(null);
    inputRef.current?.focus();
  }, []);

  const handleRegenerateBotMessage = useCallback((botMessageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === botMessageId
          ? { ...m, text: 'Here is a refreshed response. Our team will get back to you soon.' }
          : m
      )
    );
  }, []);

  const handleBotFeedback = useCallback((messageId: string, value: 'up' | 'down') => {
    setBotFeedback((f) => ({ ...f, [messageId]: f[messageId] === value ? null : value }));
  }, []);

  const handleUserMessageTouchStart = useCallback((messageId: string) => {
    longPressTimerRef.current = setTimeout(() => {
      setUserMessageActionsVisibleId(messageId);
      longPressTimerRef.current = null;
    }, LONG_PRESS_MS);
  }, []);

  const handleUserMessageTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const SpeechRecognitionClass = getSpeechRecognitionClass();
    setSpeechSupported(!!SpeechRecognitionClass);
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US';

    recognition.onresult = (e: unknown) => {
      const ev = e as { results: { length: number; item?(i: number): unknown; [i: number]: unknown } };
      const results = ev.results;
      if (!results || results.length === 0) return;
      for (let i = speechResultsCountRef.current; i < results.length; i++) {
        const result = (results as { item?(i: number): unknown }).item ? (results as { item(i: number): unknown }).item(i) : (results as unknown[])[i];
        const r = result as { isFinal?: boolean };
        if (!r) continue;
        const transcript = getTranscriptFromResult(result);
        if (r.isFinal && transcript) {
          speechResultsCountRef.current = i + 1;
          setInputValue((prev) => {
            const next = (prev ? prev + ' ' : '') + transcript;
            return next.slice(0, MAX_INPUT_LENGTH);
          });
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setSpeechError(null);
      speechResultsCountRef.current = 0;
    };

    recognition.onerror = (e: { error: string }) => {
      if (e.error === 'aborted') return;
      setIsListening(false);
      setSpeechError(e.error === 'not-allowed' ? 'Microphone access denied' : e.error);
      speechResultsCountRef.current = 0;
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, []);

  const toggleVoiceInput = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setSpeechError(null);
    if (isListening) {
      try {
        recognition.stop();
      } catch {
        setIsListening(false);
      }
    } else {
      speechResultsCountRef.current = 0;
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
        setSpeechError('Could not start microphone');
      }
    }
  }, [isListening]);

  return (
    <>
      {/* Chat Button – above navbar on mobile (z-[110]) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'fixed bottom-6 right-6 z-[110]',
          'w-14 h-14 rounded-full',
          'bg-[#016BF2] text-white',
          'shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]',
          'hover:scale-110 hover:bg-[#0150B6]',
          'focus:outline-none focus:ring-2 focus:ring-[#016BF2] focus:ring-offset-2'
        )}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window – full screen on mobile, above navbar; resizes with keyboard (visualViewport) */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className={clsx(
            'fixed z-[110] flex flex-col overflow-hidden bg-white shadow-2xl border border-[#D1D8E0]',
            'inset-0 w-full h-full min-h-dvh max-w-none rounded-none',
            'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
            'pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]',
            'md:pt-0 md:pb-0 md:pl-0 md:pr-0',
            'md:inset-auto md:bottom-24 md:right-6 md:left-auto md:top-auto md:min-h-0',
            'md:w-[90vw] md:max-w-md md:h-[600px] md:max-h-[80vh] md:rounded-2xl',
            'chatbot-window'
          )}
        >
          {/* Header: when chat has messages show Maszbot + New Chat; otherwise just close */}
          {messages.length > 0 ? (
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#D1D8E0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#016BF2]/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#016BF2]" />
                </div>
                <span className="text-[#0D0D0D] font-semibold text-base">Maszbot</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                    'text-sm text-[#016BF2] hover:bg-[#016BF2]/10',
                    'transition-colors duration-200'
                  )}
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  New Chat
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'w-8 h-8 rounded-full shrink-0',
                    'text-[#777] hover:bg-[#F2F2F2] flex items-center justify-center',
                    'transition-colors duration-200'
                  )}
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(false)}
              className={clsx(
                'absolute top-4 right-4 z-10',
                'w-8 h-8 rounded-full',
                'text-[#777] hover:bg-[#F2F2F2]',
                'flex items-center justify-center',
                'transition-colors duration-200'
              )}
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Scrollable content: min-h-0 so header + input stay visible when keyboard opens on mobile */}
          <div className={clsx('flex-1 min-h-0 overflow-y-auto flex flex-col', 'no-scrollbar')}>
            {messages.length === 0 ? (
              /* Welcome section: icon, greeting, tagline, buttons */
              <div className="shrink-0 px-6 pt-8 pb-4 text-center">
                <div className="relative inline-flex justify-center mb-4">
                  <div className="absolute inset-0 rounded-full bg-[#016BF2]/20 blur-xl scale-150" />
                  <div className="absolute rounded-full bg-[#016BF2]/10 blur-lg w-16 h-16 scale-125" />
                  <div className="relative w-14 h-14 rounded-full bg-[#016BF2] flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <h2 className="text-[#0D0D0D] text-lg font-semibold mb-1">
                  {greeting}! I'm <span className="text-[#016BF2]">Maszbot</span>
                </h2>
                <p className="text-sm text-[#777] mb-6 max-w-[280px] mx-auto">
                  Ask anything about Inovalink or let me help you complete tasks faster.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center flex-wrap">
                  <a
                    href="#contact"
                    className={clsx(
                      'inline-flex items-center justify-center gap-2',
                      'px-4 py-2.5 rounded-xl',
                      'bg-[#016BF2] text-white text-sm font-medium',
                      'hover:bg-[#0150B6] transition-colors'
                    )}
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    Talk to our Team of Experts
                  </a>
                  <a
                    href="#projects"
                    className={clsx(
                      'inline-flex items-center justify-center gap-2',
                      'px-4 py-2.5 rounded-xl',
                      'bg-[#F2F2F2] text-[#0D0D0D] text-sm font-medium border border-[#D1D8E0]',
                      'hover:bg-[#E8E8E8] transition-colors'
                    )}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    Start a project with us
                  </a>
                  <a
                    href="#services"
                    className={clsx(
                      'inline-flex items-center justify-center gap-2',
                      'px-4 py-2.5 rounded-xl',
                      'bg-[#F2F2F2] text-[#0D0D0D] text-sm font-medium border border-[#D1D8E0]',
                      'hover:bg-[#E8E8E8] transition-colors'
                    )}
                  >
                    <Layers className="w-4 h-4 shrink-0" />
                    Explore options
                  </a>
                </div>
              </div>
            ) : (
              /* Messages with bubble actions */
              <div className="flex-1 px-4 py-4 space-y-5 overflow-hidden">
                {messages.map((message) =>
                  message.sender === 'user' ? (
                    <AnimatedMessageRow key={message.id} messageId={message.id} isUser>
                      <div
                        className="max-w-[80%] group relative"
                        onMouseEnter={() => setUserMessageActionsVisibleId(message.id)}
                        onMouseLeave={() => setUserMessageActionsVisibleId(null)}
                        onTouchStart={() => handleUserMessageTouchStart(message.id)}
                        onTouchEnd={handleUserMessageTouchEnd}
                        onTouchCancel={handleUserMessageTouchEnd}
                      >
                        <div className="rounded-2xl px-4 py-2.5 bg-[#016BF2] text-white text-sm transition-transform duration-200 hover:scale-[1.02] will-change-transform">
                          <p>{message.text}</p>
                        </div>
                        <div
                          className={clsx(
                            'flex items-center justify-end gap-1 mt-1',
                            'transition-opacity duration-150',
                            userMessageActionsVisibleId === message.id
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => copyToClipboard(message.text)}
                            className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8] flex items-center justify-center transition-transform hover:scale-110"
                            aria-label="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditUserMessage(message.text)}
                            className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8] flex items-center justify-center transition-transform hover:scale-110"
                            aria-label="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </AnimatedMessageRow>
                  ) : (
                    <AnimatedMessageRow key={message.id} messageId={message.id} isUser={false}>
                      <div className="max-w-[80%]">
                        <div className="rounded-2xl px-4 py-2.5 bg-[#F2F2F2] text-[#0D0D0D] text-sm transition-transform duration-200 hover:scale-[1.02] will-change-transform">
                          <p>{message.text}</p>
                        </div>
                        <div data-bot-actions className="flex items-center gap-1 mt-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(message.text)}
                            className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8] flex items-center justify-center border border-[#E8E8E8] transition-transform hover:scale-110"
                            aria-label="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRegenerateBotMessage(message.id)}
                            className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8] flex items-center justify-center border border-[#E8E8E8] transition-transform hover:scale-110"
                            aria-label="Regenerate"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBotFeedback(message.id, 'up')}
                            className={clsx(
                              'w-8 h-8 rounded-full flex items-center justify-center border border-[#E8E8E8] transition-transform hover:scale-110',
                              botFeedback[message.id] === 'up'
                                ? 'bg-[#016BF2]/10 text-[#016BF2]'
                                : 'bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8]'
                            )}
                            aria-label="Thumbs up"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBotFeedback(message.id, 'down')}
                            className={clsx(
                              'w-8 h-8 rounded-full flex items-center justify-center border border-[#E8E8E8] transition-transform hover:scale-110',
                              botFeedback[message.id] === 'down'
                                ? 'bg-[#016BF2]/10 text-[#016BF2]'
                                : 'bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8]'
                            )}
                            aria-label="Thumbs down"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </AnimatedMessageRow>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className={clsx('shrink-0 border-t border-[#D1D8E0] p-4')}>
            <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
              <div
                className={clsx(
                  'flex items-center gap-2',
                  'rounded-xl border border-[#016BF2]/40 bg-white',
                  'px-3 py-2 focus-within:ring-2 focus-within:ring-[#016BF2]/30'
                )}
              >
                {/* Left: animated sound icon when recording, else sparkles */}
                <div className="shrink-0 w-6 h-6 flex items-center justify-center" aria-hidden>
                  {isListening ? (
                    <Mic className="w-5 h-5 text-red-500 chatbot-recording-icon" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#016BF2]" />
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                  onFocus={() => {
                    if (isMobile()) {
                      setTimeout(() => inputRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' }), 100);
                      setTimeout(() => inputRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' }), 400);
                    }
                  }}
                  placeholder={isListening ? '' : 'Ask Maszbot assistant...'}
                  maxLength={MAX_INPUT_LENGTH}
                  className={clsx(
                    'flex-1 min-w-0 bg-transparent text-[#0D0D0D]',
                    'text-base md:text-sm',
                    'focus:outline-none placeholder:text-[#777]',
                    isListening && 'text-center'
                  )}
                />
                <span className="text-xs text-[#777] shrink-0">
                  {inputValue.length}/{MAX_INPUT_LENGTH}
                </span>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={clsx(
                      'w-9 h-9 rounded-full shrink-0 flex items-center justify-center',
                      'transition-colors duration-200',
                      isListening
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-[#F2F2F2] text-[#016BF2] hover:bg-[#016BF2]/10'
                    )}
                    aria-label={isListening ? 'Stop listening' : 'Speak to type'}
                    title={isListening ? 'Stop listening' : 'Click to speak — speech to text'}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className={clsx(
                    'w-9 h-9 rounded-full shrink-0',
                    'bg-[#016BF2] text-white flex items-center justify-center',
                    'hover:bg-[#0150B6] disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors duration-200'
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {(speechError || speechSupported) && (
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {speechError && (
                    <span className="text-xs text-red-600" role="alert">
                      {speechError}
                    </span>
                  )}
                  {speechSupported && !speechError && (
                    <span className="text-xs text-[#777]">
                      {isListening ? 'Listening… speak now' : 'Or use the mic to speak'}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSamplePrompt}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
                    'text-xs text-[#777] bg-[#F2F2F2] border border-[#D1D8E0]',
                    'hover:bg-[#E8E8E8] transition-colors'
                  )}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Sample Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
