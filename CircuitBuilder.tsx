import React, { useState } from 'react';
import type { CircuitGate, GateType, QuantumCircuitData } from '../types';
import { QuantumSimulationEngine } from '../services/simulationEngine';
import type { BackendType } from '../services/simulationEngine';
import { BACKENDS } from '../services/simulationEngine';
import { CircuitAnalyzer } from '../services/circuitAnalyzer';
import type { CircuitAnalysisReport } from '../services/circuitAnalyzer';
import { 
  Play, 
  Plus, 
  Minus, 
  Trash2, 
  Cpu, 
  Code, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Save,
  FolderOpen
} from 'lucide-react';

interface CircuitBuilderProps {
  circuit: QuantumCircuitData;
  onChange: (circuit: QuantumCircuitData) => void;
  onRunSimulation: (backend: BackendType, shots: number) => void;
  onAskAIAboutCode?: (codeText: string) => void;
}

export const CircuitBuilder: React.FC<CircuitBuilderProps> = ({
  circuit,
  onChange,
  onRunSimulation,
  onAskAIAboutCode
}) => {
  const [activeTab, setActiveTab] = useState<'graphical' | 'code'>('graphical');
  const [selectedGateType, setSelectedGateType] = useState<GateType | null>('H');
  const [cnotControlQubit, setCnotControlQubit] = useState<number | null>(null);

  // Simulation settings
  const [selectedBackend, setSelectedBackend] = useState<BackendType>('local');
  const [shots, setShots] = useState<number>(1024);

  // Qiskit Python Code State
  const [qiskitCode, setQiskitCode] = useState<string>(`from qiskit import QuantumCircuit

# Create 2-qubit quantum circuit
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()`);

  // AI Circuit Analysis State
  const [analysisReport, setAnalysisReport] = useState<CircuitAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Saved Circuits Workspace
  const [savedCircuits, setSavedCircuits] = useState<Array<{ name: string; circuit: QuantumCircuitData }>>(() => {
    try {
      const saved = localStorage.getItem('qnova_saved_circuits');
      return saved ? JSON.parse(saved) : [
        {
          name: 'Bell State (|Φ⁺⟩)',
          circuit: {
            numQubits: 2,
            gates: [
              { id: 'b1', type: 'H', qubit: 0, step: 0 },
              { id: 'b2', type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 }
            ]
          }
        }
      ];
    } catch {
      return [];
    }
  });
  const [circuitName, setCircuitName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const MAX_STEPS = 8;
  const gateColors: Record<GateType, string> = {
    H: 'bg-cyan-500 text-slate-950 border-cyan-400',
    X: 'bg-purple-500 text-slate-950 border-purple-400',
    Y: 'bg-indigo-500 text-white border-indigo-400',
    Z: 'bg-pink-500 text-slate-950 border-pink-400',
    S: 'bg-amber-500 text-slate-950 border-amber-400',
    T: 'bg-orange-500 text-slate-950 border-orange-400',
    CNOT: 'bg-emerald-500 text-slate-950 border-emerald-400',
    SWAP: 'bg-blue-500 text-white border-blue-400',
    M: 'bg-rose-600 text-white border-rose-400'
  };

  const handleCellClick = (qubit: number, step: number) => {
    const existingIndex = circuit.gates.findIndex(g => g.qubit === qubit && g.step === step);
    if (existingIndex >= 0) {
      const updatedGates = circuit.gates.filter((_, idx) => idx !== existingIndex);
      onChange({ ...circuit, gates: updatedGates });
      setAnalysisReport(null);
      return;
    }

    if (!selectedGateType) return;

    if (selectedGateType === 'CNOT') {
      if (cnotControlQubit === null) {
        setCnotControlQubit(qubit);
      } else if (cnotControlQubit !== qubit) {
        const newGate: CircuitGate = {
          id: `cnot-${Date.now()}`,
          type: 'CNOT',
          qubit: cnotControlQubit,
          targetQubit: qubit,
          step
        };
        onChange({ ...circuit, gates: [...circuit.gates, newGate] });
        setCnotControlQubit(null);
        setAnalysisReport(null);
      }
      return;
    }

    const newGate: CircuitGate = {
      id: `${selectedGateType.toLowerCase()}-${Date.now()}`,
      type: selectedGateType,
      qubit,
      step
    };
    onChange({ ...circuit, gates: [...circuit.gates, newGate] });
    setAnalysisReport(null);
  };

  const addQubit = () => {
    if (circuit.numQubits < 4) {
      onChange({ ...circuit, numQubits: circuit.numQubits + 1 });
    }
  };

  const removeQubit = () => {
    if (circuit.numQubits > 1) {
      const newNum = circuit.numQubits - 1;
      const filteredGates = circuit.gates.filter(g => g.qubit < newNum && (g.targetQubit === undefined || g.targetQubit < newNum));
      onChange({ numQubits: newNum, gates: filteredGates });
    }
  };

  const clearCircuit = () => {
    onChange({ ...circuit, gates: [] });
    setCnotControlQubit(null);
    setAnalysisReport(null);
  };

  const loadPreset = (presetName: 'superposition' | 'bell' | 'grover') => {
    setAnalysisReport(null);
    if (presetName === 'superposition') {
      onChange({
        numQubits: 1,
        gates: [{ id: 'p1', type: 'H', qubit: 0, step: 0 }]
      });
    } else if (presetName === 'bell') {
      onChange({
        numQubits: 2,
        gates: [
          { id: 'p1', type: 'H', qubit: 0, step: 0 },
          { id: 'p2', type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 }
        ]
      });
    } else if (presetName === 'grover') {
      onChange({
        numQubits: 2,
        gates: [
          { id: 'g1', type: 'H', qubit: 0, step: 0 },
          { id: 'g2', type: 'H', qubit: 1, step: 0 },
          { id: 'g3', type: 'Z', qubit: 0, step: 1 },
          { id: 'g4', type: 'CNOT', qubit: 0, targetQubit: 1, step: 2 },
          { id: 'g5', type: 'H', qubit: 0, step: 3 }
        ]
      });
    }
  };

  const handleGenerateCircuitFromCode = () => {
    const parsed = QuantumSimulationEngine.parseQiskitCode(qiskitCode);
    onChange(parsed);
    setActiveTab('graphical');
    setAnalysisReport(null);
  };

  const handleRunAICircuitAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const report = CircuitAnalyzer.analyze(circuit);
      setAnalysisReport(report);
      setIsAnalyzing(false);
    }, 300);
  };

  const handleSaveCircuitWorkspace = () => {
    if (!circuitName.trim()) return;
    const newSaved = [...savedCircuits, { name: circuitName, circuit }];
    setSavedCircuits(newSaved);
    localStorage.setItem('qnova_saved_circuits', JSON.stringify(newSaved));
    setCircuitName('');
    setShowSaveModal(false);
  };

  const backendMeta = BACKENDS[selectedBackend];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-cyan-500/20 bg-[#0b1120]/95 p-5 backdrop-blur-xl shadow-xl shadow-cyan-950/20">
      
      {/* Mode Navigation Tabs (Graphical vs Code Editor) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
            <button
              onClick={() => setActiveTab('graphical')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition-all ${
                activeTab === 'graphical'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Graphical Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition-all ${
                activeTab === 'code'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>Code Editor (Qiskit Python)</span>
            </button>
          </div>
        </div>

        {/* Framework Backend & Shots Selector */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs">
            <span className="text-slate-400 font-semibold">Backend:</span>
            <select
              value={selectedBackend}
              onChange={(e: any) => setSelectedBackend(e.target.value)}
              className="bg-transparent font-bold text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="local" className="bg-slate-950 text-white">Local Simulator</option>
              <option value="qiskit_aer" className="bg-slate-950 text-white">Qiskit Aer Backend</option>
              <option value="pennylane" className="bg-slate-950 text-white">PennyLane (Xanadu)</option>
              <option value="cirq" className="bg-slate-950 text-white">Google Cirq</option>
              <option value="qbraid" className="bg-slate-950 text-white">qBraid SDK</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs">
            <span className="text-slate-400 font-semibold">Shots:</span>
            <select
              value={shots}
              onChange={(e: any) => setShots(parseInt(e.target.value, 10))}
              className="bg-transparent font-bold text-purple-300 focus:outline-none cursor-pointer"
            >
              <option value={100} className="bg-slate-950 text-white">100</option>
              <option value={512} className="bg-slate-950 text-white">512</option>
              <option value={1024} className="bg-slate-950 text-white">1024</option>
              <option value={2048} className="bg-slate-950 text-white">2048</option>
            </select>
          </div>

          <button
            onClick={() => onRunSimulation(selectedBackend, shots)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-slate-950 hover:from-cyan-400 shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Play className="h-4 w-4 fill-slate-950" />
            <span>Run Simulation</span>
          </button>

        </div>

      </div>

      {/* Backend Status Indicator Bar */}
      <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${
        backendMeta.isAvailable 
          ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
          : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${backendMeta.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span><strong>Framework:</strong> {backendMeta.name} ({backendMeta.provider})</span>
        </div>
        <span>{backendMeta.statusMessage}</span>
      </div>

      {/* GRAPHICAL STUDIO TAB */}
      {activeTab === 'graphical' && (
        <div className="space-y-4">
          
          {/* Gate Selector Palette & Workspace Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs font-semibold text-slate-400 mr-1">Gate Palette:</span>
              {(['H', 'X', 'Y', 'Z', 'S', 'T', 'CNOT', 'SWAP', 'M'] as GateType[]).map((gate) => {
                const isSelected = selectedGateType === gate;
                return (
                  <button
                    key={gate}
                    onClick={() => {
                      setSelectedGateType(gate);
                      setCnotControlQubit(null);
                    }}
                    className={`flex h-8 min-w-[36px] items-center justify-center rounded-lg px-2.5 text-xs font-mono font-bold transition-all ${
                      isSelected
                        ? `${gateColors[gate]} ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-105 shadow-md`
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {gate}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs">
                <span className="text-slate-400">Qubits:</span>
                <button onClick={removeQubit} disabled={circuit.numQubits <= 1} className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-bold text-cyan-400 px-1">{circuit.numQubits}</span>
                <button onClick={addQubit} disabled={circuit.numQubits >= 4} className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30">
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <button
                onClick={clearCircuit}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400"
                title="Clear Circuit"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
            </div>

          </div>

          {cnotControlQubit !== null && (
            <div className="rounded-lg bg-emerald-950/60 border border-emerald-500/40 p-2 text-xs text-emerald-300 animate-pulse">
              🎯 CNOT Control qubit selected: q{cnotControlQubit}. Now click on the target qubit wire to place CNOT!
            </div>
          )}

          {/* Grid Circuit Matrix */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#070a12] p-4">
            <div className="flex flex-col gap-6 min-w-[550px]">
              
              {Array.from({ length: circuit.numQubits }).map((_, qIdx) => (
                <div key={qIdx} className="relative flex items-center gap-3">
                  
                  <div className="flex h-8 w-12 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/60 text-xs font-mono font-bold text-cyan-300 shadow-sm">
                    q{qIdx} |0⟩
                  </div>

                  <div className="absolute left-14 right-4 top-1/2 h-0.5 bg-gradient-to-r from-cyan-500/50 via-slate-700 to-slate-800" />

                  <div className="relative z-10 flex flex-1 items-center justify-between px-2">
                    {Array.from({ length: MAX_STEPS }).map((_, stepIdx) => {
                      
                      const gate = circuit.gates.find(g => g.qubit === qIdx && g.step === stepIdx);
                      const isCnotTarget = circuit.gates.some(g => g.type === 'CNOT' && g.targetQubit === qIdx && g.step === stepIdx);

                      return (
                        <button
                          key={stepIdx}
                          onClick={() => handleCellClick(qIdx, stepIdx)}
                          className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                            gate
                              ? `${gateColors[gate.type]} shadow-lg font-mono font-bold text-sm border hover:scale-110`
                              : isCnotTarget
                              ? 'bg-emerald-600 text-slate-950 font-bold border border-emerald-400 shadow-lg'
                              : 'bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800'
                          }`}
                        >
                          {gate ? (
                            <span>{gate.type === 'CNOT' ? '●' : gate.type}</span>
                          ) : isCnotTarget ? (
                            <span>⊕</span>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-mono">{stepIdx}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* AI Circuit Analysis & Optimization Panel */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Circuit Analysis & Optimization Engine
                </h4>
              </div>

              <button
                onClick={handleRunAICircuitAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/60 px-3 py-1 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-all"
              >
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Circuit'}</span>
              </button>
            </div>

            {analysisReport && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">{analysisReport.summary}</span>
                  <span className="font-mono font-bold text-cyan-400">Optimization Score: {analysisReport.score}/100</span>
                </div>

                {analysisReport.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-3 text-xs border space-y-1 ${
                      finding.severity === 'high'
                        ? 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                        : 'border-cyan-500/30 bg-cyan-950/20 text-cyan-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>⚠️ {finding.title}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950/60">
                        {finding.severity} severity
                      </span>
                    </div>
                    <p><strong>Observation:</strong> {finding.observation}</p>
                    <p className="text-emerald-300 font-semibold"><strong>Optimization:</strong> {finding.optimization}</p>
                    <p className="text-slate-400 text-[11px]">{finding.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* CODE EDITOR TAB (QISKIT PYTHON) */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Qiskit Python Code Editor</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateCircuitFromCode}
                className="flex items-center gap-1.5 rounded-lg bg-purple-500 px-3 py-1 text-xs font-bold text-white hover:bg-purple-400 shadow-sm"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Parse to Graphical Studio</span>
              </button>
            </div>
          </div>

          <textarea
            value={qiskitCode}
            onChange={(e) => setQiskitCode(e.target.value)}
            rows={9}
            className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-4 font-mono text-xs text-cyan-300 leading-relaxed focus:border-cyan-500/50 focus:outline-none"
            spellCheck={false}
          />

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onAskAIAboutCode && onAskAIAboutCode(qiskitCode)}
              className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              <span>Ask AI Mentor to Explain Code</span>
            </button>

            <button
              onClick={() => onRunSimulation(selectedBackend, shots)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-slate-950 hover:from-cyan-400 shadow-md shadow-cyan-500/20"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" />
              <span>Execute Code Circuit</span>
            </button>
          </div>
        </div>
      )}

      {/* Save Workspace Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border border-cyan-500/30 bg-[#0b1120] p-5 space-y-4">
            <h4 className="text-sm font-bold text-white">Save Circuit to Workspace</h4>
            <input
              type="text"
              value={circuitName}
              onChange={(e) => setCircuitName(e.target.value)}
              placeholder="e.g., Grover Oracle Step..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500/50"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSaveModal(false)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
              <button onClick={handleSaveCircuitWorkspace} className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
