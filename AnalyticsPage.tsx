import React from 'react';
import type { UserProgress } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3, Sparkles } from 'lucide-react';

interface AnalyticsPageProps {
  progress: UserProgress;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = () => {
  const radarData = [
    { subject: 'Qubit Basics', A: 95 },
    { subject: 'Superposition', A: 88 },
    { subject: 'Gates & Phase', A: 78 },
    { subject: 'Measurement', A: 62 },
    { subject: 'Entanglement', A: 45 },
    { subject: 'Algorithms', A: 30 },
  ];

  const weeklyActivityData = [
    { day: 'Mon', mins: 25, xp: 50 },
    { day: 'Tue', mins: 40, xp: 90 },
    { day: 'Wed', mins: 15, xp: 30 },
    { day: 'Thu', mins: 50, xp: 120 },
    { day: 'Fri', mins: 60, xp: 150 },
    { day: 'Sat', mins: 35, xp: 80 },
    { day: 'Sun', mins: 45, xp: 100 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl w-full space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Student Learning Analytics & Insights
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Visualizing concept mastery, accuracy, time spent, and AI learning trends.
            </p>
          </div>
        </div>

        {/* AI Learning Insights Synthesis Box */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>AI Learning Insight Synthesis</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-white max-w-3xl leading-relaxed">
            "Your performance indicates strong understanding of single-qubit quantum gates and Hadamard superposition, but difficulty applying measurement concepts in multi-step circuits. Revisiting Module 4 will boost your algorithm mastery score by ~25%."
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Concept Mastery Radar */}
          <div className="lg:col-span-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#0b1120]/90 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Concept Mastery Profile
            </h3>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Mastery %" dataKey="A" stroke="#c084fc" fill="#c084fc" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Activity Bar Chart */}
          <div className="lg:col-span-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#0b1120]/90 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Weekly Activity & Study Minutes
            </h3>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} unit="m" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(val: any) => [`${val} mins`, 'Study Time']}
                  />
                  <Bar dataKey="mins" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
