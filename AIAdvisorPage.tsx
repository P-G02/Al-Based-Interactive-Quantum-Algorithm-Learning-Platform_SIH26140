import React from 'react';
import { AITutorChat } from '../components/AITutorChat';
import { Bot, Sparkles, BookOpen, Trophy } from 'lucide-react';
import type { NavigationPage } from '../types';

interface AIAdvisorPageProps {
  onNavigate: (page: NavigationPage) => void;
  onMisconceptionDetected?: (title: string) => void;
}

export const AIAdvisorPage: React.FC<AIAdvisorPageProps> = ({ onNavigate, onMisconceptionDetected }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Dedicated AI Quantum Mentor Workspace
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your 24/7 intelligent quantum computing tutor. Get simple explanations, bra-ket math proofs, or debug misconceptions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Chat Interface */}
          <div className="lg:col-span-8">
            <AITutorChat
              activeModuleTitle="Quantum Foundations & Gates"
              onMisconceptionDetected={onMisconceptionDetected}
            />
          </div>

          {/* Quick Learning Shortcuts & Tips */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            <div className="rounded-2xl border border-cyan-500/20 bg-[#0b1120]/90 p-5 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-3">
                <Sparkles className="h-4 w-4" />
                <span>Mentor Capabilities</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Simple Analogy Mode:</strong> Explains quantum concepts using spinning coins, light polarizers, and wave interference.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Advanced Math Mode:</strong> Computes Dirac bra-ket notations, unitary matrices, and tensor products.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span><strong>Circuit Debugger:</strong> Detects gate cancellations like H² = I or missing CNOT entanglement.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/90 p-5 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-white">Recommended Actions</h4>
              <button
                onClick={() => onNavigate('lab')}
                className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
              >
                <span>Build Circuit in Lab</span>
                <BookOpen className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('challenges')}
                className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
              >
                <span>Take Adaptive Challenge</span>
                <Trophy className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
