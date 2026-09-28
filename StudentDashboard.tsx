import React from 'react';
import type { NavigationPage, UserProgress } from '../types';
import { MisconceptionBanner } from '../components/MisconceptionBanner';
import { 
  Sparkles, 
  BookOpen, 
  Trophy, 
  FlaskConical, 
  Flame, 
  Zap, 
  CheckCircle2
} from 'lucide-react';

interface StudentDashboardProps {
  progress: UserProgress;
  onNavigate: (page: NavigationPage) => void;
  onDismissMisconception: (id: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  progress,
  onNavigate,
  onDismissMisconception
}) => {

  const moduleProgress = [
    { title: 'Quantum Foundations', percent: 90, color: 'bg-cyan-400' },
    { title: 'Quantum Gates & Superposition', percent: 75, color: 'bg-purple-400' },
    { title: 'Measurement & Wavefunctions', percent: 60, color: 'bg-amber-400' },
    { title: 'Quantum Entanglement', percent: 45, color: 'bg-emerald-400' },
    { title: 'Quantum Algorithms', percent: 25, color: 'bg-rose-400' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl w-full space-y-8">
        
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Welcome back, <span className="text-cyan-400">Demo Student</span> 👋
              </h1>
              <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/30">
                Level {progress.level} Scholar
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your quantum learning laboratory dashboard and daily study recommendation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('lab')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 shadow-md shadow-cyan-500/20"
            >
              <FlaskConical className="h-4 w-4" />
              <span>Resume Quantum Lab</span>
            </button>
          </div>
        </div>

        {/* Misconception Banner if active */}
        <MisconceptionBanner
          misconceptions={progress.activeMisconceptions}
          onDismiss={onDismissMisconception}
          onNavigate={onNavigate}
        />

        {/* Dynamic AI Recommendation Card */}
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-purple-950/70 p-6 shadow-xl shadow-cyan-950/30 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>AI Learning Mentor Recommendation</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white max-w-3xl">
            "You are comfortable with Hadamard superposition, but need more practice with wavefunction measurement probabilities. Try the Measurement Challenge next!"
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onNavigate('challenges')}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-all shadow-sm"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Start Measurement Challenge</span>
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Review Module 4</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/80 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total XP</span>
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{progress.xp}</span>
              <span className="text-xs text-purple-400 font-semibold">+150 this week</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-400" style={{ width: '70%' }} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/80 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Study Streak</span>
              <Flame className="h-5 w-5 text-amber-500 fill-amber-500/20" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{progress.streak} Days</span>
              <span className="text-xs text-amber-400 font-semibold">Active 🔥</span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">3 consecutive days to next streak bonus.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/80 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Concepts Mastered</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{progress.conceptsMastered.length} / 10</span>
              <span className="text-xs text-emerald-400 font-semibold">60% Mastered</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: '60%' }} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/80 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Challenges Solved</span>
              <Trophy className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{progress.completedChallenges.length}</span>
              <span className="text-xs text-cyan-400 font-semibold">2 pending</span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">Bell State Challenge available.</p>
          </div>

        </div>

        {/* Modules Progress & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Module Mastery Breakdown */}
          <div className="lg:col-span-7 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0b1120]/90 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Module Mastery Progress</h3>
              <button onClick={() => onNavigate('learn')} className="text-xs font-semibold text-cyan-400 hover:underline">
                View All Modules
              </button>
            </div>

            <div className="space-y-4 py-2">
              {moduleProgress.map((mod, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{mod.title}</span>
                    <span className="text-slate-400">{mod.percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${mod.color} transition-all duration-500`} style={{ width: `${mod.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges & Recent Activity */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Badges Unlocked */}
            <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/90 p-6 shadow-xl">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 mb-4">
                Badges Unlocked
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {progress.badges.map((b) => (
                  <div
                    key={b.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${
                      b.unlocked
                        ? 'border-cyan-500/30 bg-cyan-950/20 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-base">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{b.name}</h4>
                      <p className="text-[10px] text-slate-400">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
