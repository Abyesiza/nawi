'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  sender: 'CLIENT' | 'AGENT';
  body: string;
  createdAt: Date | string;
}

interface ChatViewProps {
  messages: Message[];
  counterpartyId: string;
  counterpartyName: string;     // persona name (for client) or alias (for agent)
  counterpartyInitial?: string;
  selfRole: 'CLIENT' | 'AGENT';
  sendAction: (formData: FormData) => Promise<{ ok?: boolean; error?: string } | void>;
  emptyHint?: string;
}

export function ChatView({
  messages,
  counterpartyId,
  counterpartyName,
  counterpartyInitial,
  selfRole,
  sendAction,
  emptyHint,
}: ChatViewProps) {
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const initial = (counterpartyInitial ?? counterpartyName).charAt(0).toUpperCase();

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Auto-refresh every 5s for new incoming messages
  useEffect(() => {
    const t = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(t);
  }, [router]);

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!body.trim() || isPending) return;
    const text = body;
    setBody('');
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('counterpartyId', counterpartyId);
      fd.set('body', text);
      const res = await sendAction(fd);
      if (res && 'error' in res && res.error) {
        setError(res.error);
        setBody(text);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-160px)] bg-white rounded-3xl overflow-hidden"
      style={{ border: '1px solid rgba(128,0,32,0.06)' }}>

      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(128,0,32,0.06)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{ background: 'rgba(128,0,32,0.12)', color: '#800020' }}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate" style={{ color: '#3A3A3A' }}>{counterpartyName}</p>
          <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: '#bbb' }}>
            {selfRole === 'CLIENT' ? 'Your Concierge' : 'Client'}
          </p>
        </div>
        <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-green-500" aria-label="Online" />
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-3"
        style={{ background: '#fafafa' }}>
        {messages.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="text-3xl mb-3">💬</div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#6B6B6B' }}>No messages yet</p>
            <p className="text-xs" style={{ color: '#9a9a9a' }}>{emptyHint ?? 'Send the first message to start the conversation.'}</p>
          </div>
        )}

        {messages.map((m) => {
          const fromSelf = m.sender === selfRole;
          const time = new Date(m.createdAt);
          return (
            <div key={m.id} className={`flex ${fromSelf ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm"
                style={fromSelf
                  ? { background: '#800020', color: 'white', borderBottomRightRadius: 4 }
                  : { background: 'white', color: '#3A3A3A', borderBottomLeftRadius: 4, border: '1px solid rgba(128,0,32,0.06)' }
                }>
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p className="text-[10px] mt-1 opacity-60">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="border-t px-3 sm:px-4 py-3 flex items-end gap-2"
        style={{ borderColor: 'rgba(128,0,32,0.06)', background: 'white' }}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
          placeholder="Type a message…"
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 rounded-2xl text-sm outline-none border max-h-32"
          style={{ borderColor: 'rgba(128,0,32,0.1)', background: '#fafafa' }}
        />
        <button
          type="submit"
          disabled={!body.trim() || isPending}
          className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all disabled:opacity-40"
          style={{ background: '#800020' }}
          aria-label="Send"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>

      {error && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">{error}</div>
      )}
    </div>
  );
}
