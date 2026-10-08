"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ResultCard, type ResultData } from "@/components/ResultCard";
import { MOTOR_DATA, type BrandId } from "@/knowledge/motor-data";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
interface TanyaMessage {
  id: string;
  role: "assistant";
  kind: "tanya";
  pertanyaan: string;
  opsi: string[];
}

interface HasilMessage {
  id: string;
  role: "assistant";
  kind: "hasil";
  data: ResultData;
}

interface UserMessage {
  id: string;
  role: "user";
  kind: "text";
  content: string;
}

interface ErrorMessage {
  id: string;
  role: "assistant";
  kind: "error";
  content: string;
}

type ChatMessage = UserMessage | TanyaMessage | HasilMessage | ErrorMessage;

interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

const LS_MOTOR_KEY = "motor_diagnosa_motor";
const SS_HISTORY_KEY = "motor_diagnosa_history";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

// ──────────────────────────────────────────────────────────────────────────────
// SelectionScreen – Halaman Pemilihan Motor
// ──────────────────────────────────────────────────────────────────────────────
function SelectionScreen({ onSelect }: { onSelect: (motorName: string) => void }) {
  const [activeBrand, setActiveBrand] = useState<BrandId | null>(null);

  if (!activeBrand) {
    return (
      <div className="flex flex-col h-full bg-slate-50 p-6 items-center justify-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <span className="text-6xl mb-4 block drop-shadow-sm">🏍️</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Motor Diagnosa</h1>
            <p className="text-sm text-slate-500 leading-relaxed px-4">
              Pilih merk motor Anda untuk memulai diagnosa masalah atau cari inspirasi modifikasi.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(MOTOR_DATA) as BrandId[]).map((key) => {
              const brand = MOTOR_DATA[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveBrand(key)}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all group focus:outline-none focus:ring-4 focus:ring-slate-100"
                >
                  <div className={`w-14 h-14 rounded-full ${brand.color} flex items-center justify-center mb-3 text-white font-bold text-2xl shadow-inner group-hover:scale-110 transition-transform`}>
                    {brand.name[0]}
                  </div>
                  <span className="font-semibold text-slate-800">{brand.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const brand = MOTOR_DATA[activeBrand];

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 items-center pt-12 md:justify-center animate-in slide-in-from-right-4 duration-300">
      <div className="w-full max-w-md flex flex-col h-full">
        <button 
          onClick={() => setActiveBrand(null)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8 hover:text-slate-800 transition-colors w-fit"
        >
          <span className="text-lg leading-none">&larr;</span> Kembali
        </button>
        
        <div className="mb-6 flex items-center gap-4 px-2">
           <div className={`w-12 h-12 rounded-full ${brand.color} shadow-inner flex items-center justify-center text-white font-bold text-xl shrink-0`}>
              {brand.name[0]}
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-900 leading-tight">Pilih Tipe Motor</h2>
             <p className="text-sm text-slate-500 font-medium">{brand.name}</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-2.5">
          {brand.models.map((model) => (
            <button
              key={model.id}
              onClick={() => onSelect(`${brand.name} ${model.name}`)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:ring-2 hover:ring-blue-100 hover:bg-blue-50/50 transition-all text-left group focus:outline-none"
            >
              <span className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{model.name}</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-slate-500 uppercase tracking-wider rounded-md transition-colors">
                {model.type}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MotorBar – hanya tampil di mobile (header bar)
// ──────────────────────────────────────────────────────────────────────────────
function MotorBar({
  motor,
  onChangeMotor,
}: {
  motor: string;
  onChangeMotor: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Motor Aktif</span>
        <span className="text-sm font-extrabold text-slate-800 truncate">
          {motor}
        </span>
      </div>
      <button
        onClick={onChangeMotor}
        className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        Ganti
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MotorSidebar – hanya tampil di desktop (md+)
// ──────────────────────────────────────────────────────────────────────────────
function MotorSidebar({
  motor,
  onChangeMotor,
  onSend,
  disabled,
}: {
  motor: string;
  onChangeMotor: () => void;
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const examples = [
    "Susah hidup pagi hari",
    "Rem bunyi saat diinjak",
    "Tarikan terasa berat",
    "Mau ganti velg racing",
    "Lampu sein tidak menyala",
    "Suara dengung di mesin",
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-200 bg-white h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🔧</span>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            Motor Diagnosa
          </span>
        </Link>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Asisten AI cerdas untuk keluhan &amp; modifikasi motor.
        </p>
      </div>

      {/* Motor info */}
      <div className="px-5 py-4 border-b border-slate-100 bg-blue-50/30">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Motor Aktif
        </label>
        <div className="font-extrabold text-sm text-slate-800 mb-3">{motor}</div>
        <button
          onClick={onChangeMotor}
          disabled={disabled}
          className="w-full rounded-xl bg-white border border-slate-200 shadow-sm py-2 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          Ganti Motor
        </button>
      </div>

      {/* Contoh pertanyaan */}
      <div className="px-5 py-4 flex-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Coba Tanyakan
        </p>
        <div className="space-y-1.5">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => onSend(ex)}
              disabled={disabled}
              className="w-full text-left text-xs px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 disabled:opacity-40 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 leading-relaxed italic">
          Hasil adalah estimasi awal. Selalu konsultasikan ke mekanik profesional.
        </p>
        <Link
          href="/"
          className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Kembali ke beranda
        </Link>
      </div>
    </aside>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TypingIndicator
// ──────────────────────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-xs">
        🔧
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ChatBubble – satu pesan
// ──────────────────────────────────────────────────────────────────────────────
function ChatBubble({
  message,
  onQuickReply,
  isLastAI,
}: {
  message: ChatMessage;
  onQuickReply?: (text: string) => void;
  isLastAI: boolean;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-xs shadow-sm">
          🔧
        </div>
        <div className="max-w-[88%] w-full">
          {message.kind === "tanya" && (
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <p className="text-sm text-slate-800 leading-relaxed">
                {message.pertanyaan}
              </p>
            </div>
          )}
          {message.kind === "hasil" && (
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-4 shadow-sm w-full">
              <ResultCard data={message.data} />
            </div>
          )}
          {message.kind === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <p className="text-sm text-red-700 font-medium">{message.content}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tombol quick reply hanya untuk pesan tanya AI terakhir */}
      {message.kind === "tanya" && isLastAI && onQuickReply && (
        <div className="flex flex-wrap gap-2 pl-9">
          {message.opsi.map((opsi, i) => (
            <button
              key={i}
              onClick={() => onQuickReply(opsi)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 active:bg-blue-200 transition-all shadow-sm"
            >
              {opsi}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────────────────────────────────────
export function DiagnosaApp() {
  const [motor, setMotor] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [askCount, setAskCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore state saat halaman dimuat.
  // Kalau URL membawa ?motor=... (dari halaman detail motor),
  // motor itu langsung dipakai dan riwayat dibersihkan supaya tidak tercampur.
  useEffect(() => {
    const presetMotor = new URLSearchParams(window.location.search).get("motor");

    if (presetMotor) {
      setMotor(presetMotor);
      setMessages([]);
      setAskCount(0);
      localStorage.setItem(LS_MOTOR_KEY, presetMotor);
      sessionStorage.removeItem(SS_HISTORY_KEY);
      return;
    }

    const savedMotor = localStorage.getItem(LS_MOTOR_KEY);
    if (savedMotor) setMotor(savedMotor);

    const savedHistory = sessionStorage.getItem(SS_HISTORY_KEY);
    if (savedHistory) {
      try {
        const { messages: msgs, askCount: ac } = JSON.parse(savedHistory);
        setMessages(msgs);
        setAskCount(ac);
      } catch {
        // Abaikan error parse
      }
    }
  }, []);

  // Scroll otomatis ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-save riwayat chat ke sessionStorage
  useEffect(() => {
    if (motor) {
      sessionStorage.setItem(
        SS_HISTORY_KEY,
        JSON.stringify({ messages, askCount })
      );
    }
  }, [messages, askCount, motor]);

  const buildHistory = useCallback((msgs: ChatMessage[]): HistoryEntry[] => {
    const result: HistoryEntry[] = [];
    for (const m of msgs) {
      if (m.role === "user") {
        result.push({ role: "user", content: m.content });
      } else if (m.kind === "tanya") {
        result.push({ role: "assistant", content: m.pertanyaan });
      } else if (m.kind === "hasil") {
        result.push({ role: "assistant", content: "[Hasil analisa diberikan]" });
      }
    }
    return result.slice(-10); // hanya kirim 10 terakhir agar prompt tidak kebesaran
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading || !motor) return;

      const userMsg: UserMessage = {
        id: generateId(),
        role: "user",
        kind: "text",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const history = buildHistory(messages);
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motor, message: trimmed, history, askCount }),
        });

        const data = await response.json();

        if (!response.ok) {
          setMessages((prev) => [
            ...prev,
            { id: generateId(), role: "assistant", kind: "error", content: data.error || "Terjadi kesalahan." } as ErrorMessage,
          ]);
          return;
        }

        if (data.jenis === "tanya") {
          setAskCount((c) => c + 1);
          setMessages((prev) => [
            ...prev,
            { id: generateId(), role: "assistant", kind: "tanya", pertanyaan: data.pertanyaan, opsi: data.opsi } as TanyaMessage,
          ]);
        } else {
          setAskCount(0);
          setMessages((prev) => [
            ...prev,
            { id: generateId(), role: "assistant", kind: "hasil", data: data as ResultData } as HasilMessage,
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: generateId(), role: "assistant", kind: "error", content: "Koneksi gagal. Periksa jaringan Anda." } as ErrorMessage,
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, motor, messages, askCount, buildHistory]
  );

  const handleMotorSelect = (motorName: string) => {
    setMotor(motorName);
    localStorage.setItem(LS_MOTOR_KEY, motorName);
    // Kosongkan pesan jika motor baru dipilih
    setMessages([]);
    setAskCount(0);
  };

  const handleChangeMotor = () => {
    // Reset seluruh state
    setMotor("");
    setMessages([]);
    setAskCount(0);
    localStorage.removeItem(LS_MOTOR_KEY);
    sessionStorage.removeItem(SS_HISTORY_KEY);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // --- RENDERING LOGIC ---
  const motorSet = motor.length > 0;

  // 1. Tampilan Pemilihan Motor (Layar Utama)
  if (!motorSet) {
    return (
      <div className="flex h-[100dvh] bg-slate-100 md:items-center md:justify-center md:p-6">
        <div className="w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-2xl md:shadow-xl md:overflow-hidden bg-slate-50 md:border md:border-slate-200 relative">
           <SelectionScreen onSelect={handleMotorSelect} />
        </div>
      </div>
    );
  }

  // 2. Tampilan Chat Diagnosa
  const lastAIIndex = [...messages].reverse().findIndex((m) => m.role === "assistant");
  const lastAIMessage = lastAIIndex !== -1 ? messages[messages.length - 1 - lastAIIndex] : undefined;

  return (
    <div className="flex h-[100dvh] bg-slate-100 md:items-center md:justify-center md:p-6 animate-in fade-in duration-500">
      <div className="flex w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-2xl md:shadow-xl md:overflow-hidden md:border md:border-slate-200">

        {/* ── Sidebar (desktop only) ── */}
        <MotorSidebar
          motor={motor}
          onChangeMotor={handleChangeMotor}
          onSend={sendMessage}
          disabled={isLoading}
        />

        {/* ── Area chat ── */}
        <div className="flex flex-col flex-1 min-w-0 bg-slate-50 h-full relative">

          {/* Header mobile */}
          <header className="md:hidden shrink-0 bg-white border-b border-slate-100 shadow-sm z-10">
            <div className="flex items-center gap-3 px-4 py-3">
              <Link href="/" className="flex items-center gap-3">
                <span className="text-xl">🔧</span>
                <div>
                  <p className="text-base font-bold text-slate-900 leading-tight">
                    Motor Diagnosa
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Asisten keluhan &amp; modifikasi motor
                  </p>
                </div>
              </Link>
            </div>
            <MotorBar motor={motor} onChangeMotor={handleChangeMotor} />
          </header>

          {/* Subheader desktop – nama motor aktif */}
          <div className="hidden md:flex items-center gap-2 px-5 py-3 bg-white border-b border-slate-100 shrink-0 z-10 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mendiagnosa:</span>
            <span className="text-sm font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{motor}</span>
          </div>

          {/* Daftar pesan */}
          <main className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6 animate-in zoom-in-95 duration-500">
                <span className="text-6xl drop-shadow-sm">💬</span>
                <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
                  Halo! Ceritakan keluhan atau rencana modifikasi untuk <br/>
                  <span className="font-extrabold text-slate-900 text-base">{motor}</span> Anda.
                </p>
                {/* Contoh cepat – hanya mobile */}
                <div className="flex md:hidden flex-wrap justify-center gap-2 mt-4">
                  {["Susah hidup pagi hari", "Rem bunyi saat diinjak", "Mau ganti velg"].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => sendMessage(ex)}
                      className="px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onQuickReply={(text) => sendMessage(text)}
                isLastAI={msg.id === lastAIMessage?.id}
              />
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </main>

          {/* Input box */}
          <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                id="chat-input"
                rows={1}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Ketik keluhan Anda... (Enter untuk kirim)"
                className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all max-h-[120px] leading-relaxed shadow-inner"
                style={{ height: "auto" }}
              />
              <button
                id="send-button"
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                aria-label="Kirim pesan"
                className="shrink-0 w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:bg-blue-800 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
              Hasil adalah estimasi AI, bukan pengganti diagnosa mekanik resmi.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default DiagnosaApp;
