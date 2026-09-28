import React from 'react';
import type { ExtendedSimulationResult } from '../services/simulationEngine';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, BarChart2, Cpu, Clock, Layers } from 'lucide-react';

interface SimulationResultsProps {
  result: ExtendedSimulationResult | null;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#0b1120]/60 p-8 text-center text-slate-400">
        <Activity className="h-10 w-10 text-slate-600 mb-2 animate-pulse" />
        <p className="text-sm font-semibold">No Circuit Simulation Run Yet</p>
        <p className="text-xs text-slate-500 mt-1">Place quantum gates or write Qiskit code and click "Run Simulation".</p>
      </div>
    );
  }

  const chartData = Object.entries(result.probabilities).map(([state, prob]) => ({
    state: `|${state}⟩`,
    probability: Math.round(prob * 100),
    count: Math.round(prob * (result.shots || 1024)),
    probDecimal: prob
  }));

  const colors = ['#22d3ee', '#c084fc', '#34d399', '#f43f5e', '#fbbf24', '#a855f7', '#38bdf8', '#e879f9'];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-cyan-500/20 bg-[#0b1120]/95 p-5 backdrop-blur-xl shadow-xl shadow-cyan-950/20">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white font-sans">
            Simulation Results & Wavefunction Measurement Histogram
          </h3>
        </div>

        {/* Framework & Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-cyan-950 border border-cyan-500/30 px-2.5 py-1 text-cyan-300 font-bold">
            Backend: {result.backendName || 'Local Simulator'}
          </span>
          <span className="rounded-full bg-purple-950 border border-purple-500/30 px-2.5 py-1 text-purple-300 font-bold">
            Shots: {result.shots || 1024}
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-slate-300 font-mono">
            Time: {result.executionTimeMs || 2}ms
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Probability & Shots Histogram */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
            <span>Measurement Outcome Distribution P(State):</span>
            <span className="text-slate-400 text-[11px]">Sampling on {result.shots || 1024} shots</span>
          </div>
          <div className="h-56 w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="state" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.count} shots)`, 'Probability']}
                />
                <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Vector Amplitudes Table */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-semibold text-slate-300">Exact Quantum State Vector:</span>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80 p-2">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-1.5 px-2">Basis</th>
                  <th className="py-1.5 px-2">Real</th>
                  <th className="py-1.5 px-2">Imag</th>
                  <th className="py-1.5 px-2">P(x)</th>
                </tr>
              </thead>
              <tbody>
                {result.statevector.map((sv, idx) => (
                  <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900/40">
                    <td className="py-1.5 px-2 font-bold text-cyan-400">{sv.state}</td>
                    <td className="py-1.5 px-2 text-slate-300">{sv.real}</td>
                    <td className="py-1.5 px-2 text-slate-300">{sv.imag}i</td>
                    <td className="py-1.5 px-2 font-bold text-purple-400">{(sv.prob * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
