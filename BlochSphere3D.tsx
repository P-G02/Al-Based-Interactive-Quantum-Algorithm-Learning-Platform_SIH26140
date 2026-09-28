import React, { useState, useEffect } from 'react';
import { QuantumSimulator } from '../services/quantumSimulator';
import type { BlochCoords, GateType } from '../types';
import { RotateCcw, Sparkles } from 'lucide-react';

interface BlochSphere3DProps {
  initialGateSequence?: GateType[];
  onStateChange?: (bloch: BlochCoords, p0: number, p1: number) => void;
}

export const BlochSphere3D: React.FC<BlochSphere3DProps> = ({
  initialGateSequence = [],
  onStateChange
}) => {
  const [state, setState] = useState<{ r0: number; i0: number; r1: number; i1: number }>({
    r0: 1.0, i0: 0.0,
    r1: 0.0, i1: 0.0
  });

  const [appliedGates, setAppliedGates] = useState<GateType[]>(initialGateSequence);

  const bloch = QuantumSimulator.computeBlochCoords(state.r0, state.i0, state.r1, state.i1);
  const p0 = Math.round((state.r0 * state.r0 + state.i0 * state.i0) * 100);
  const p1 = Math.round((state.r1 * state.r1 + state.i1 * state.i1) * 100);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(bloch, p0 / 100, p1 / 100);
    }
  }, [state]);

  const applyGate = (gate: GateType) => {
    const { r0, i0, r1, i1 } = state;
    let nr0 = r0, ni0 = i0, nr1 = r1, ni1 = i1;
    const SQRT2_INV = 1 / Math.sqrt(2);

    switch (gate) {
      case 'H':
        nr0 = SQRT2_INV * (r0 + r1);
        ni0 = SQRT2_INV * (i0 + i1);
        nr1 = SQRT2_INV * (r0 - r1);
        ni1 = SQRT2_INV * (i0 - i1);
        break;
      case 'X':
        nr0 = r1; ni0 = i1;
        nr1 = r0; ni1 = i0;
        break;
      case 'Y':
        nr0 = -i1; ni0 = r1;
        nr1 = i0; ni1 = -r0;
        break;
      case 'Z':
        nr1 = -r1; ni1 = -i1;
        break;
      case 'S':
        nr1 = -i1; ni1 = r1;
        break;
      case 'T':
        nr1 = r1 * SQRT2_INV - i1 * SQRT2_INV;
        ni1 = r1 * SQRT2_INV + i1 * SQRT2_INV;
        break;
    }

    setState({ r0: nr0, i0: ni0, r1: nr1, i1: ni1 });
    setAppliedGates(prev => [...prev, gate]);
  };

  const resetState = () => {
    setState({ r0: 1.0, i0: 0.0, r1: 0.0, i1: 0.0 });
    setAppliedGates([]);
  };

  const R = 110;
  const centerX = 160;
  const centerY = 150;

  const projX = (x: number, y: number) => {
    return centerX + R * (y * 0.85 - x * 0.4);
  };
  const projY = (x: number, y: number, z: number) => {
    return centerY - R * (z * 0.95 - x * 0.25 - y * 0.1);
  };

  const tipX = projX(bloch.x, bloch.y);
  const tipY = projY(bloch.x, bloch.y, bloch.z);

  return (
    <div className="flex flex-col rounded-2xl border border-cyan-500/20 bg-[#0b1120]/90 p-5 backdrop-blur-xl shadow-xl shadow-cyan-950/20">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white font-sans">
            3D Bloch Sphere State Visualizer
          </h3>
        </div>
        <button
          onClick={resetState}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset |0⟩</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-4">
        
        {/* SVG 3D Bloch Render */}
        <div className="lg:col-span-7 flex justify-center relative select-none">
          <svg width="320" height="300" className="overflow-visible">
            
            <circle
              cx={centerX}
              cy={centerY}
              r={R}
              className="fill-cyan-950/20 stroke-cyan-500/30"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            <ellipse
              cx={centerX}
              cy={centerY}
              rx={R * 0.9}
              ry={R * 0.3}
              className="fill-none stroke-cyan-500/40"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            <line
              x1={projX(0, 0)}
              y1={projY(0, 0, 1.2)}
              x2={projX(0, 0)}
              y2={projY(0, 0, -1.2)}
              className="stroke-purple-400/60"
              strokeWidth="1.5"
            />

            <line
              x1={projX(1.2, 0)}
              y1={projY(1.2, 0, 0)}
              x2={projX(-1.2, 0)}
              y2={projY(-1.2, 0, 0)}
              className="stroke-cyan-400/60"
              strokeWidth="1.5"
            />

            <line
              x1={projX(0, 1.2)}
              y1={projY(0, 1.2, 0)}
              x2={projX(0, -1.2)}
              y2={projY(0, -1.2, 0)}
              className="stroke-emerald-400/60"
              strokeWidth="1.5"
            />

            <text x={projX(0, 0)} y={projY(0, 0, 1.35)} fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
              |0⟩ (+Z)
            </text>
            <text x={projX(0, 0)} y={projY(0, 0, -1.35)} fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle">
              |1⟩ (-Z)
            </text>
            <text x={projX(1.35, 0)} y={projY(1.35, 0, 0)} fill="#22d3ee" fontSize="11" textAnchor="middle">
              |+⟩ (+X)
            </text>
            <text x={projX(0, 1.35)} y={projY(0, 1.35, 0)} fill="#34d399" fontSize="11" textAnchor="middle">
              |+i⟩ (+Y)
            </text>

            <circle cx={centerX} cy={centerY} r="3" fill="#64748b" />

            <line
              x1={centerX}
              y1={centerY}
              x2={tipX}
              y2={tipY}
              className="stroke-cyan-300"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            <circle
              cx={tipX}
              cy={tipY}
              r="6"
              className="fill-cyan-400 stroke-white"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* State Equation & Probability Readout */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              Quantum State Vector
            </p>
            <p className="text-lg font-mono font-bold text-white">
              |ψ⟩ = ({state.r0.toFixed(2)})|0⟩ + ({state.r1.toFixed(2)})|1⟩
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-xs text-slate-400">P(0) Outcome</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-cyan-400">{p0}%</span>
                <span className="text-xs text-slate-500">|0⟩</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${p0}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-xs text-slate-400">P(1) Outcome</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-purple-400">{p1}%</span>
                <span className="text-xs text-slate-500">|1⟩</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-400 transition-all duration-300" style={{ width: `${p1}%` }} />
              </div>
            </div>
          </div>

          <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-400 font-mono">
            <span>x: {bloch.x}</span>
            <span>y: {bloch.y}</span>
            <span>z: {bloch.z}</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300">Apply Gate Transformation:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(['H', 'X', 'Y', 'Z', 'S', 'T'] as GateType[]).map((gate) => (
                <button
                  key={gate}
                  onClick={() => applyGate(gate)}
                  className="flex-1 min-w-[45px] rounded-lg border border-cyan-500/40 bg-gradient-to-b from-cyan-950/60 to-slate-900 py-2 text-sm font-bold text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 transition-all active:scale-95 shadow-md shadow-cyan-950/50"
                >
                  {gate}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {appliedGates.length > 0 && (
        <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Sequence:</span>
          <div className="flex items-center gap-1 overflow-x-auto">
            {appliedGates.map((g, idx) => (
              <span key={idx} className="rounded bg-slate-800 px-2 py-0.5 font-mono text-cyan-300 font-bold">
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
