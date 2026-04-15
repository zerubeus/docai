"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, SendHorizontal, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Source {
  title: string;
  snippet: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const EXAMPLE_PROMPTS = [
  "Douleurs thoraciques chez un patient de 55 ans",
  "Interactions medicamenteuses amiodarone",
  "Diagnostic differentiel cephalees chroniques",
];

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 max-w-2xl">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Brain size={16} strokeWidth={1.5} className="text-primary" />
      </div>
      <div className="bg-white border border-border rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

function SourcesSection({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-dark transition-colors duration-150"
      >
        {open ? (
          <ChevronUp size={14} strokeWidth={1.5} />
        ) : (
          <ChevronDown size={14} strokeWidth={1.5} />
        )}
        {sources.length} source{sources.length > 1 ? "s" : ""} consultee{sources.length > 1 ? "s" : ""}
      </button>
      {open && (
        <ul className="mt-2 space-y-2">
          {sources.map((source, i) => (
            <li key={i} className="rounded-lg bg-surface border border-border p-3">
              <p className="text-xs font-semibold text-text-dark mb-1">{source.title}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{source.snippet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  return (
    <div className="flex items-start gap-3 max-w-2xl">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Brain size={16} strokeWidth={1.5} className="text-primary" />
      </div>
      <div className="bg-white border border-border rounded-xl px-4 py-3 shadow-sm flex-1 min-w-0">
        <p className="text-sm text-text-dark leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {message.sources && <SourcesSection sources={message.sources} />}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-xl bg-accent rounded-xl px-4 py-3 shadow-sm">
        <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(587.33, ctx.currentTime);
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch {}
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function adjustTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversationHistory: history }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playNotificationSound();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Une erreur est survenue. Veuillez reessayer.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function clearConversation() {
    setMessages([]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Brain size={20} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-base font-semibold text-text-dark">Assistant DocAI</h1>
        </div>
        <button
          onClick={clearConversation}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface hover:text-text-dark transition-colors duration-150"
        >
          <Trash2 size={15} strokeWidth={1.5} />
          Nouvelle conversation
        </button>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 pb-8">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Brain size={28} strokeWidth={1.5} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-dark">Posez votre question clinique</h2>
              <p className="text-sm text-text-secondary max-w-sm">
                Je consulte votre base documentaire pour vous fournir des reponses etayees sur les evidences.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="px-4 py-2 text-sm text-text-secondary bg-white border border-border rounded-full hover:border-accent hover:text-accent transition-colors duration-150"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) =>
              msg.role === "user" ? (
                <UserMessage key={msg.id} message={msg} />
              ) : (
                <AssistantMessage key={msg.id} message={msg} />
              )
            )}
            {loading && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 bg-white border-t border-border">
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextarea();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Posez une question clinique..."
              disabled={loading}
              rows={1}
              className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 transition-colors duration-150 leading-relaxed"
              style={{ maxHeight: "160px", overflowY: "auto" }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
          >
            <SendHorizontal size={18} strokeWidth={1.5} />
          </button>
        </div>
        <p className="text-center text-xs text-text-muted mt-2 max-w-3xl mx-auto">
          Appuyez sur Entree pour envoyer, Maj+Entree pour une nouvelle ligne
        </p>
      </div>
    </div>
  );
}
