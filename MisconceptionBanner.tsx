import React from 'react';
import type { Misconception, NavigationPage } from '../types';
import { AlertTriangle, BookOpen, Trophy, X } from 'lucide-react';

interface MisconceptionBannerProps {
  misconceptions: Misconception[];
  onDismiss?: (id: string) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const MisconceptionBanner: React.FC<MisconceptionBannerProps> = ({
  misconceptions,
  onDismiss,
  onNavigate
}) => {
  if (!misconceptions || misconceptions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 my-4">
      {misconceptions.map((m) => (
        <div
          key={m.id}
          className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 p-4 shadow-lg shadow-amber-950/30 backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase">
                  Learning Insight Engine
                </span>
                <span className="text-xs font-semibold text-amber-400">{m.concept}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">{m.title}</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">{m.aiExplanation}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('learn')}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/60 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Review Module</span>
            </button>

            <button
              onClick={() => onNavigate('challenges')}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:from-amber-400 transition-all"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Solve Challenge</span>
            </button>

            {onDismiss && (
              <button
                onClick={() => onDismiss(m.id)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
