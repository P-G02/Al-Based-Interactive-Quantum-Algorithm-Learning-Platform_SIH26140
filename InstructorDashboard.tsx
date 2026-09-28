import React from 'react';
import type { InstructorStudentOverview } from '../types';
import { Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const InstructorDashboard: React.FC = () => {

  const students: InstructorStudentOverview[] = [
    { id: '1', name: 'Aarav Sharma', progress: 85, level: 5, riskStatus: 'on-track', weakConcept: 'Quantum Algorithms' },
    { id: '2', name: 'Ananya Patel', progress: 42, level: 2, riskStatus: 'at-risk', weakConcept: 'Quantum Measurement', activeMisconception: 'State Collapse Misunderstanding' },
    { id: '3', name: 'Rohan Mehta', progress: 68, level: 3, riskStatus: 'needs-help', weakConcept: 'Entanglement & CNOT', activeMisconception: 'Local Superposition vs Entanglement' },
    { id: '4', name: 'Priya Iyer', progress: 92, level: 6, riskStatus: 'on-track', weakConcept: 'Grover Oracle' },
    { id: '5', name: 'Vikram Singh', progress: 38, level: 2, riskStatus: 'at-risk', weakConcept: 'Hadamard Phase', activeMisconception: 'Hadamard Gate Bit-Flip Confusion' },
  ];

  const misconceptionFrequency = [
    { title: 'Measurement Collapse', count: 18, color: '#f43f5e' },
    { title: 'H² Cancellation', count: 14, color: '#fbbf24' },
    { title: 'Local vs Entangled', count: 11, color: '#c084fc' },
    { title: 'Phase Neglect', count: 7, color: '#38bdf8' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Instructor & Cohort Analytics Dashboard
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Class progress metrics, identified misconceptions across students, and targeted intervention strategies.
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/80 p-5 shadow-lg">
            <span className="text-xs text-slate-400 font-semibold">Enrolled Students</span>
            <div className="mt-2 text-2xl font-extrabold text-white">48 Students</div>
            <p className="text-[11px] text-emerald-400 mt-1">92% active this week</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/80 p-5 shadow-lg">
            <span className="text-xs text-slate-400 font-semibold">Average Mastery</span>
            <div className="mt-2 text-2xl font-extrabold text-cyan-400">65% Overall</div>
            <p className="text-[11px] text-slate-400 mt-1">Highest in Qubit Basics</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/80 p-5 shadow-lg">
            <span className="text-xs text-slate-400 font-semibold">Active Misconceptions</span>
            <div className="mt-2 text-2xl font-extrabold text-amber-400">22 Flagged</div>
            <p className="text-[11px] text-amber-400 mt-1">Requires review on Module 4</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b1120]/80 p-5 shadow-lg">
            <span className="text-xs text-slate-400 font-semibold">At-Risk Learners</span>
            <div className="mt-2 text-2xl font-extrabold text-rose-400">5 Students</div>
            <p className="text-[11px] text-rose-400 mt-1">Automated remediation sent</p>
          </div>
        </div>

        {/* Charts & Misconceptions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Common Misconceptions Frequency */}
          <div className="lg:col-span-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#0b1120]/90 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Most Frequent Conceptual Misconceptions
            </h3>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={misconceptionFrequency} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="title" stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {misconceptionFrequency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="lg:col-span-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#0b1120]/90 p-6 shadow-xl overflow-hidden">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Cohort Performance & Risk Roster
            </h3>

            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2">Student</th>
                    <th className="py-2">Progress</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Weak Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/40">
                      <td className="py-2.5 font-bold text-white">{s.name}</td>
                      <td className="py-2.5 font-mono text-cyan-400">{s.progress}%</td>
                      <td className="py-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          s.riskStatus === 'on-track' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                          s.riskStatus === 'needs-help' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                          'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}>
                          {s.riskStatus}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300">{s.weakConcept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
