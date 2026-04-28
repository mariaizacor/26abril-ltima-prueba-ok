'use client';

import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Sparkles, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

type Message = {
  role: 'user' | 'model';
  parts: [{ text: string }];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, errorMsg]);

  // Initial greeting from Chef if chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'model',
          parts: [{ text: '¡Oído cocina, mi pequeño Chef! Soy el Chef Gastón Métrico. ¿Qué receta divertida vamos a preparar hoy: un pastel de sumas, una pizza de fracciones o unas galletas de multiplicaciones?' }]
        }
      ]);
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Interferencias en la red temporalmente...');
      }

      const data = await response.json();
      const modelMessage: Message = { role: 'model', parts: [{ text: data.text }] };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Interferencias en la red temporalmente...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] text-[#E4E3E0] font-sans overflow-hidden lg:border-8 border-[#2A2A2A] selection:bg-[#F27D26] selection:text-black">
      {/* SIDEBAR: The Kitchen Dashboard */}
      <aside className="w-80 border-r border-[#333] bg-[#1A1A1A] p-8 hidden lg:flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-[#F27D26] rounded-full flex items-center justify-center border-2 border-[#E4E3E0]">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tighter leading-none text-white">Chef Gastón</h1>
              <p className="text-[10px] text-[#F27D26] uppercase tracking-widest font-semibold mt-1">Magia • Diversión</p>
            </div>
          </div>

          <nav className="space-y-6">
            <div>
              <p className="text-[10px] uppercase opacity-40 mb-3 tracking-widest text-white">Estación de Trabajo</p>
              <div className="p-4 bg-[#252525] border-l-4 border-[#F27D26] rounded-r-lg">
                <p className="text-sm font-medium text-white">Interacción Activa</p>
                <p className="text-xs opacity-50 text-white mt-1">En cocción activa...</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] uppercase opacity-40 mb-1 tracking-widest text-white">Ingredientes Listos</p>
              <div className="flex justify-between text-xs border-b border-[#333] pb-2 text-white">
                <span>Interacciones</span>
                <span className="text-[#F27D26] font-bold">{Math.floor(messages.length / 2)}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#333] pb-2 text-white">
                <span>Estado</span>
                {isLoading ? <span className="opacity-70 animate-pulse text-[#F27D26]">Procesando</span> : <span className="text-[#F27D26]">✓</span>}
              </div>
            </div>
          </nav>
        </div>

        <div className="bg-[#252525] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-bold text-[#F27D26]">Temp. del Horno</span>
            <span className="text-xs font-mono text-white">{isLoading ? '220°C' : '180°C'}</span>
          </div>
          <div className="w-full bg-[#333] h-1 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${isLoading ? 'w-full bg-red-500' : 'w-3/4 bg-[#F27D26]'}`}></div>
          </div>
        </div>
      </aside>

      {/* MAIN: The Cooking Station */}
      <main className="flex-1 flex flex-col bg-[#161616] relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none z-0">
          <span className="text-[200px] md:text-[250px] font-bold italic font-serif">∑∫π</span>
        </div>

        {/* Chat Header */}
        <header className="h-20 border-b border-[#333] px-6 md:px-10 flex items-center justify-between bg-[#161616]/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex flex-col">
            <span className="text-xs text-[#F27D26] font-mono tracking-tighter">NIVEL: PINCHE DE COCINA</span>
            <h2 className="text-base md:text-lg font-serif italic text-white flex items-center gap-2 mt-1">
              Recetario Mágico
              <Sparkles size={14} className="text-[#F27D26]" />
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 hidden sm:block text-white">Cocina Abierta</span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 p-4 md:p-10 overflow-y-auto flex flex-col gap-6 z-10">
          {messages.map((message, index) => {
            const isModel = message.role === 'model';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 max-w-[95%] md:max-w-[80%] ${isModel ? '' : 'self-end'}`}
              >
                {isModel && (
                  <div className="w-8 h-8 rounded-full bg-[#F27D26] flex-shrink-0 mt-1 flex items-center justify-center text-xs">
                    <span className="translate-y-[1px]">👨‍🍳</span>
                  </div>
                )}
                <div 
                  className={`p-5 shadow-xl w-full ${
                    isModel 
                      ? 'bg-[#252525] rounded-2xl rounded-tl-none border border-[#333]' 
                      : 'bg-[#F27D26] text-black rounded-2xl rounded-tr-none font-medium'
                  }`}
                >
                  <div className={`prose max-w-none ${
                    isModel 
                      ? 'prose-invert font-serif text-base md:text-lg leading-relaxed prose-p:mb-4 prose-p:last:mb-0 prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-[#F27D26]/30 prose-pre:shadow-inner' 
                      : 'text-black prose-p:text-black prose-strong:text-black prose-headings:text-black prose-em:text-black prose-a:text-black prose-code:text-black prose-ul:text-black prose-ol:text-black prose-li:text-black prose-li:marker:text-black leading-relaxed'
                  }`}>
                    <Markdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {message.parts[0].text}
                    </Markdown>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Thinking Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-[#F27D26] opacity-80 pl-[3.25rem] mt-2 mb-4"
            >
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#F27D26] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#F27D26] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-[#F27D26] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Batiendo la mezcla...</span>
            </motion.div>
          )}

          {/* Error Indicator */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex w-full justify-center my-4"
            >
              <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl max-w-md text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                 <AlertCircle size={20} className="text-red-400 shrink-0" />
                 <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <footer className="p-4 md:p-10 md:pt-0 z-10 shrink-0 border-t border-[#333] lg:border-t-0 bg-[#161616] lg:bg-transparent pt-4">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Añade un ingrediente a la conversación..."
              className="w-full bg-[#252525] border-2 border-[#333] focus:border-[#F27D26] outline-none rounded-full py-4 px-6 md:py-5 md:px-10 text-base md:text-lg transition-all text-[#E4E3E0] placeholder-gray-500 disabled:opacity-60"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 md:right-3 bg-[#F27D26] text-black w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
            >
              {isLoading ? <RefreshCcw className="animate-spin text-black" size={20} /> : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              )}
            </button>
          </form>
          <div className="flex justify-center mt-4 gap-4 md:gap-6">
            <span className="text-[10px] text-[#F27D26] font-bold uppercase tracking-widest cursor-pointer hover:underline">[ Ayuda ]</span>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest cursor-pointer hover:underline">[ Recetario ]</span>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest cursor-pointer hover:underline">[ Glosario ]</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
