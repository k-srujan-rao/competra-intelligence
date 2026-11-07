import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Competitor, IndustryType } from '../../types';
import { sendChatMessage } from '../../services/geminiService';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Brain,
  ShieldCheck,
  ExternalLink,
  Bot,
  User,
  RotateCcw,
} from 'lucide-react';

interface AiChatModuleProps {
  competitors: Competitor[];
  activeIndustry: IndustryType;
}

const QUICK_PROMPTS = [
  'Compare my selected competitors',
  'What changed this month across my watchlist?',
  'Which competitor reduced prices or offered discounts?',
  'Identify emerging strategic trends in my industry',
  'Synthesize longitudinal Hindsight memory patterns',
  'Generate an executive SWOT report for my primary competitor',
];

export const AiChatModule: React.FC<AiChatModuleProps> = ({
  competitors,
  activeIndustry,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      content: `### Welcome to COMPETRA AI Intelligence Chat
I am grounded directly on your **${competitors.length} watchlist competitors** across **${activeIndustry}** and your **Hindsight long-term memory banks**.

Ask me to compare rival strategies, analyze historical pricing changes, or synthesize future moves.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundedCompetitors: competitors.slice(0, 3).map((c) => c.name),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(text);
      setMessages((prev) => [...prev, response]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'An error occurred while connecting to the intelligence server. Please retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        content: `Conversation reset. Context initialized with ${competitors.length} competitors in ${activeIndustry}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] rounded-2xl border border-[#23211a] bg-[#07080a] shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-[#23211a] bg-[#0b0c10] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/35">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Context-Aware Strategic Assistant</h3>
              <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/35">
                Grounded on {competitors.length} Peers
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Active Scope: <strong className="text-amber-300">{activeIndustry}</strong> • Powered by Hindsight Memory
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="rounded-lg border border-[#23211a] bg-[#12141c] px-2.5 py-1 text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs space-y-2 leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'bg-[#0e1017] text-stone-200 border border-[#23211a]'
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Grounded Metadata Pill */}
                {msg.groundedCompetitors && msg.groundedCompetitors.length > 0 && (
                  <div className="pt-2 border-t border-[#23211a] flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-400" /> Grounded:
                    </span>
                    {msg.groundedCompetitors.map((c) => (
                      <span key={c} className="rounded bg-slate-800 px-1.5 py-0.5 text-amber-300">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-2 text-[10px]">
                    {msg.citations.map((cite, idx) => (
                      <a
                        key={idx}
                        href={cite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        Evidence Link <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] ${isUser ? 'text-black/70' : 'text-slate-500'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 text-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Synthesizing competitive intelligence from Hindsight memory...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 border-t border-[#23211a] bg-[#090a0f] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-semibold text-amber-200/60 uppercase tracking-wider shrink-0 flex items-center gap-1 font-mono">
          <Sparkles className="h-3 w-3 text-amber-400" /> Prompts:
        </span>
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => handleSendMessage(p)}
            className="rounded-lg border border-[#2b281f] bg-[#141622] px-2.5 py-1 text-[11px] text-stone-300 hover:border-amber-500/40 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-[#23211a] bg-[#0b0c10] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask about ${competitors.slice(0, 3).map((c) => c.name).join(', ')} or historical pricing patterns...`}
          className="flex-1 rounded-xl border border-[#23211a] bg-[#060709] px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition-all cursor-pointer disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
