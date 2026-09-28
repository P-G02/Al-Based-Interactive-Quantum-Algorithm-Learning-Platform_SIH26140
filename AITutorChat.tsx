import React, { useState } from 'react';
import { AIEngine } from '../services/aiEngine';
import type { AITutorResponse } from '../services/aiEngine';
import type { QuantumCircuitData } from '../types';
import { Bot, Send, User, Eye, RefreshCw } from 'lucide-react';

interface AITutorChatProps {
  activeModuleTitle?: string;
  circuit?: QuantumCircuitData;
  onMisconceptionDetected?: (title: string) => void;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({
  activeModuleTitle,
  circuit,
  onMisconceptionDetected
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Greetings! I am your AI Quantum Mentor. I am analyzing your learning session. Ask me to explain concepts simply, inspect your active quantum circuit, or test your knowledge!"
    }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Explain this simply',
    'Why is my circuit wrong?',
    'Give me a hint',
    'Test my knowledge'
  ];

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || isLoading) return;

    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res: AITutorResponse = await AIEngine.queryTutor(queryText, mode, activeModuleTitle, circuit);
      setMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
      
      if (res.detectedMisconception && onMisconceptionDetected) {
        onMisconceptionDetected(res.detectedMisconception);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Quantum mentor engine offline. Running fallback response mode." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-cyan-500/20 bg-[#0b1120]/95 backdrop-blur-xl shadow-xl shadow-cyan-950/20">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-sans">AI Quantum Mentor</h3>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-400">Context: {activeModuleTitle || 'Quantum Lab'}</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 p-0.5 text-xs">
          <button
            onClick={() => setMode('beginner')}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all ${
              mode === 'beginner'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all ${
              mode === 'advanced'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Advanced Math
          </button>
        </div>
      </div>

      {/* Circuit Auto-Inspector Badge */}
      {circuit && circuit.gates.length > 0 && (
        <div className="flex items-center justify-between bg-cyan-950/40 border-b border-cyan-500/20 px-4 py-2 text-xs text-cyan-300">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            <span>Active Circuit: {circuit.gates.length} gate(s) detected</span>
          </div>
          <button
            onClick={() => handleSend('Why is my circuit wrong?')}
            className="text-[11px] font-semibold underline text-cyan-400 hover:text-cyan-200"
          >
            Analyze Circuit
          </button>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Quantum Mentor is computing answer...</span>
          </div>
        )}
      </div>

      {/* Quick Action Prompt Pills */}
      <div className="px-4 py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask your Quantum Mentor a question..."
          className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 disabled:opacity-30 hover:bg-cyan-400 transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
