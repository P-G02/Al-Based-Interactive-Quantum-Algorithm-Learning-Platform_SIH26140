import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Play, Sparkles, Layers, Cpu } from 'lucide-react';

export type AlgorithmType = 'grover' | 'deutsch_jozsa' | 'qaoa' | 'vqe';

export interface PipelineStage {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  formula?: string;
  stateExplanation: string;
}

export const ALGORITHM_PIPELINES: Record<AlgorithmType, { title: string; subtitle: string; stages: PipelineStage[] }> = {
  grover: {
    title: "Grover's Quantum Search Algorithm",
    subtitle: 'Quadratic speedup for unstructured database lookup: O(√N)',
    stages: [
      {
        id: 'init',
        name: '1. Initialization',
        subtitle: 'Reset qubits to basis state',
        description: 'Start all n qubits in computational basis state |00...0⟩.',
        formula: '|\\psi_0\\rangle = |00\\dots 0\\rangle',
        stateExplanation: 'All qubits are deterministic zeros.'
      },
      {
        id: 'superposition',
        name: '2. Superposition',
        subtitle: 'Apply H gates across all wires',
        description: 'Apply Hadamard transformation H^{\\otimes n} to create an equal superposition of all 2ⁿ possible states.',
        formula: '|s\\rangle = \\frac{1}{\\sqrt{N}} \\sum_{x=0}^{N-1} |x\\rangle',
        stateExplanation: 'Equal 1/N probability magnitude across all search space entries.'
      },
      {
        id: 'oracle',
        name: '3. Quantum Oracle',
        subtitle: 'Phase Inversion of target state',
        description: 'The Oracle marks the target state ω by flipping its relative phase (multiplying by -1).',
        formula: 'U_{\\omega} |x\\rangle = (-1)^{f(x)} |x\\rangle',
        stateExplanation: 'Target state ω receives -1 phase flip while magnitude stays 1/√N.'
      },
      {
        id: 'diffuser',
        name: '4. Diffuser Operator',
        subtitle: 'Amplitude Amplification',
        description: 'The Diffuser reflects amplitudes about the mean, boosting target state amplitude and suppressing non-target states.',
        formula: 'U_s = 2|s\\rangle\\langle s| - I',
        stateExplanation: 'Target state probability probability increases towards ~100%.'
      },
      {
        id: 'measurement',
        name: '5. Measurement',
        subtitle: 'Read computational outcome',
        description: 'Measure the qubits on computational basis to collapse wavefunction onto target state ω with high probability.',
        formula: 'P(\\omega) \\approx 100\\%',
        stateExplanation: 'Target item omega successfully found in O(√N) iterations!'
      }
    ]
  },
  deutsch_jozsa: {
    title: 'Deutsch-Jozsa Algorithm',
    subtitle: 'Exponential speedup for constant vs balanced function evaluation in 1 query',
    stages: [
      {
        id: 'init',
        name: '1. Ancilla Prep',
        subtitle: 'Set input registers and ancilla qubit',
        description: 'Prepare input qubits in |0⟩ and ancilla qubit in |1⟩ using Pauli-X.',
        formula: '|\\psi_0\\rangle = |0\\rangle^{\\otimes n} |1\\rangle',
        stateExplanation: 'Ancilla qubit initialized to |1⟩ for phase kickback.'
      },
      {
        id: 'superposition',
        name: '2. Equal Superposition',
        subtitle: 'Apply H to all qubits',
        description: 'Apply Hadamard gates across all input qubits and the ancilla qubit.',
        formula: '|\\psi_1\\rangle = \\left( \\frac{1}{\\sqrt{2^n}} \\sum_{x=0}^{2^n-1} |x\\rangle \\right) \\otimes |-\\rangle',
        stateExplanation: 'Ancilla moves to |-⟩ state to enable phase kickback.'
      },
      {
        id: 'oracle',
        name: '3. Quantum Oracle U_f',
        subtitle: 'Phase Kickback Evaluation',
        description: 'Evaluate f(x) via quantum oracle. Phases flip based on f(x) outcomes.',
        formula: '|\\psi_2\\rangle = \\frac{1}{\\sqrt{2^n}} \\sum_{x=0}^{2^n-1} (-1)^{f(x)} |x\\rangle \\otimes |-\\rangle',
        stateExplanation: 'Phase kickback encodes f(x) directly into input register phases.'
      },
      {
        id: 'interference',
        name: '4. Interference',
        subtitle: 'Apply H gates on input wires',
        description: 'Apply Hadamard gates again to cause constructive or destructive interference.',
        formula: '|\\psi_3\\rangle = \\sum_{z} c_z |z\\rangle',
        stateExplanation: 'If f is constant, constructive interference yields |00...0⟩. If balanced, amplitude at |00...0⟩ cancels to zero.'
      },
      {
        id: 'result',
        name: '5. Single-Query Result',
        subtitle: 'Measure input register',
        description: 'If measurement is all zeros |00...0⟩, function f is CONSTANT. Otherwise, it is BALANCED.',
        formula: 'P(00\\dots 0) = 1 \\implies \\text{Constant}, \\quad P(00\\dots 0) = 0 \\implies \\text{Balanced}',
        stateExplanation: 'Solved deterministically in exactly 1 quantum evaluation!'
      }
    ]
  },
  qaoa: {
    title: 'QAOA (Quantum Approximate Optimization Algorithm)',
    subtitle: 'Variational quantum algorithm for Max-Cut and combinatorial optimization',
    stages: [
      {
        id: 'init',
        name: '1. Problem Graph Input',
        subtitle: 'Formulate Cost Hamiltonian H_C',
        description: 'Map graph nodes to qubits and edges to Ising interactions (Z_i Z_j).',
        formula: 'H_C = \\sum_{(i,j) \\in E} \\frac{1}{2}(I - Z_i Z_j)',
        stateExplanation: 'Problem objective function mapped to quantum Hamiltonian ground state.'
      },
      {
        id: 'superposition',
        name: '2. Uniform Superposition',
        subtitle: 'Equal initial state |+⟩',
        description: 'Apply H to all qubits to start with equal weight across all binary graph partitions.',
        formula: '|\\gamma, \\beta\\rangle_{init} = H^{\\otimes n} |0\\rangle',
        stateExplanation: 'All cut configurations evaluated in superposition.'
      },
      {
        id: 'cost_phase',
        name: '3. Problem Unitary U(H_C, γ)',
        subtitle: 'Evolve under Cost Hamiltonian',
        description: 'Apply e^{-i \\gamma H_C} rotation parameterized by variational angle γ.',
        formula: 'U(H_C, \\gamma) = e^{-i \\gamma H_C}',
        stateExplanation: 'Phase shifts applied proportional to cut value.'
      },
      {
        id: 'mixer_phase',
        name: '4. Mixer Unitary U(H_M, β)',
        subtitle: 'Evolve under Mixer Hamiltonian',
        description: 'Apply transverse field rotations e^{-i \\beta \\sum X_i} parameterized by angle β.',
        formula: 'U(H_M, \\beta) = \\prod_i e^{-i \\beta X_i}',
        stateExplanation: 'Enables quantum tunneling between candidate partition states.'
      },
      {
        id: 'classical_loop',
        name: '5. Hybrid Loop & Measurement',
        subtitle: 'Classical Optimization (COBYLA/SPSA)',
        description: 'Measure cost expectation ⟨H_C⟩ and iteratively update (γ, β) using classical optimizer.',
        formula: '\\max_{\\gamma, \\beta} \\langle \\psi(\\gamma, \\beta) | H_C | \\psi(\\gamma, \\beta) \\rangle',
        stateExplanation: 'Hybrid quantum-classical loop converges on optimal Max-Cut partition!'
      }
    ]
  },
  vqe: {
    title: 'VQE (Variational Quantum Eigensolver)',
    subtitle: 'Noisy Intermediate-Scale Quantum (NISQ) algorithm for molecular energy simulation',
    stages: [
      {
        id: 'hamiltonian',
        name: '1. Molecular Hamiltonian',
        subtitle: 'Fermionic to Qubit Mapping (Jordan-Wigner)',
        description: 'Map molecular electron orbitals to Pauli tensor strings (X, Y, Z).',
        formula: 'H = \\sum c_i P_i \\quad (P_i \\in \\{I,X,Y,Z\\}^{\\otimes n})',
        stateExplanation: 'Molecular energy operator converted to qubit observable.'
      },
      {
        id: 'ansatz',
        name: '2. Parameterized Ansatz',
        subtitle: 'Hardware-efficient trial state Preparation',
        description: 'Prepare trial wavefunction |Ψ(θ)⟩ using single-qubit rotations (RY, RZ) and CNOT entanglers.',
        formula: '|\\Psi(\\vec{\\theta})\\rangle = U(\\vec{\\theta}) |0\\rangle',
        stateExplanation: 'Trial state parameterized by adjustable angles θ.'
      },
      {
        id: 'measurement',
        name: '3. Expectation Measurement',
        subtitle: 'Evaluate ⟨H⟩ on Quantum Hardware',
        description: 'Measure expected energy value E(θ) = ⟨Ψ(θ)|H|Ψ(θ)⟩ on quantum simulator or backend.',
        formula: 'E(\\vec{\\theta}) = \\sum c_i \\langle \\Psi(\\vec{\\theta}) | P_i | \\Psi(\\vec{\\theta}) \\rangle',
        stateExplanation: 'Quantum processor evaluates energy expectation value.'
      },
      {
        id: 'optimizer',
        name: '4. Classical Optimizer',
        subtitle: 'Variational Energy Minimization',
        description: 'Classical optimizer (Adam, L-BFGS, Nelder-Mead) updates parameters θ to minimize energy.',
        formula: '\\vec{\\theta}_{new} = \\vec{\\theta} - \\eta \\nabla E(\\vec{\\theta})',
        stateExplanation: 'Variational principle guarantees E(θ) ≥ E_ground.'
      },
      {
        id: 'ground_state',
        name: '5. Ground State Energy',
        subtitle: 'Molecular Bonding Convergence',
        description: 'Converges on true molecular ground state energy and equilibrium bond distance.',
        formula: 'E_{ground} \\approx E(\\vec{\\theta}_{opt})',
        stateExplanation: 'Chemical accuracy achieved for quantum chemistry simulation!'
      }
    ]
  }
};

interface AlgorithmPipelineVisualizerProps {
  algorithm?: AlgorithmType;
  onSelectAlgorithm?: (algo: AlgorithmType) => void;
}

export const AlgorithmPipelineVisualizer: React.FC<AlgorithmPipelineVisualizerProps> = ({
  algorithm = 'grover',
  onSelectAlgorithm
}) => {
  const [currentAlgo, setCurrentAlgo] = useState<AlgorithmType>(algorithm);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);

  const data = ALGORITHM_PIPELINES[currentAlgo];
  const stage = data.stages[activeStageIdx];

  const handleAlgoSelect = (algo: AlgorithmType) => {
    setCurrentAlgo(algo);
    setActiveStageIdx(0);
    if (onSelectAlgorithm) onSelectAlgorithm(algo);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-cyan-500/30 bg-[#0b1120]/95 p-6 backdrop-blur-xl shadow-2xl">
      
      {/* Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-sans">
              Interactive Quantum Algorithm Pipeline Visualizer
            </h3>
            <p className="text-xs text-slate-400">{data.subtitle}</p>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
          {(['grover', 'deutsch_jozsa', 'qaoa', 'vqe'] as AlgorithmType[]).map((algo) => (
            <button
              key={algo}
              onClick={() => handleAlgoSelect(algo)}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all uppercase text-[11px] ${
                currentAlgo === algo
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {algo.replace('_', '-')}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Pipeline Stage Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 border-b border-slate-800 pb-4">
        {data.stages.map((stg, idx) => {
          const isActive = idx === activeStageIdx;
          const isPassed = idx < activeStageIdx;
          return (
            <button
              key={stg.id}
              onClick={() => setActiveStageIdx(idx)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                isActive
                  ? 'border-cyan-500 bg-cyan-950/60 text-white shadow-lg shadow-cyan-950/50 scale-[1.02]'
                  : isPassed
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                <span>STAGE {idx + 1}</span>
                {isPassed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
              <span className="text-xs font-bold line-clamp-1">{stg.name.split('. ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Inspector Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-xl border border-slate-800 bg-slate-950/70 p-5">
        
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
              Stage {activeStageIdx + 1} of {data.stages.length}
            </span>
            <span className="text-xs font-semibold text-slate-300">{stage.subtitle}</span>
          </div>

          <h4 className="text-lg font-bold text-white">{stage.name}</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{stage.description}</p>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Wavefunction State Shift:</strong> {stage.stateExplanation}</span>
          </div>
        </div>

        {/* Math Formula Display Box */}
        <div className="lg:col-span-5 flex flex-col justify-center rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 text-center">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2">
            Mathematical Transformation
          </span>
          <div className="font-mono text-sm sm:text-base font-extrabold text-white py-2 overflow-x-auto">
            {stage.formula}
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-purple-500/20 text-xs">
            <button
              onClick={() => setActiveStageIdx(Math.max(0, activeStageIdx - 1))}
              disabled={activeStageIdx === 0}
              className="text-slate-400 hover:text-white disabled:opacity-30 font-semibold"
            >
              ← Previous Stage
            </button>
            <button
              onClick={() => setActiveStageIdx(Math.min(data.stages.length - 1, activeStageIdx + 1))}
              disabled={activeStageIdx === data.stages.length - 1}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-30 font-bold"
            >
              <span>Next Stage</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
