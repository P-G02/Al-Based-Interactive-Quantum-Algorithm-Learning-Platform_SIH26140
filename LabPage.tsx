import React, { useState } from 'react';
import type { QuantumCircuitData } from '../types';
import { QuantumSimulationEngine } from '../services/simulationEngine';
import type { BackendType, ExtendedSimulationResult } from '../services/simulationEngine';
import { MisconceptionEngine } from '../services/misconceptionEngine';
import { CircuitBuilder } from '../components/CircuitBuilder';
import { BlochSphere3D } from '../components/BlochSphere3D';
import { SimulationResults } from '../components/SimulationResults';
import { AITutorChat } from '../components/AITutorChat';
import { AlgorithmPipelineVisualizer } from '../components/AlgorithmPipelineVisualizer';
import { FlaskConical, Bot, Sparkles, Layers } from 'lucide-react';

interface LabPageProps {
  currentCircuit: QuantumCircuitData;
  onCircuitChange: (circuit: QuantumCircuitData) => void;
  onMisconceptionDetected?: (title: string) => void;
}

export const LabPage: React.FC<LabPageProps> = ({
  currentCircuit,
  onCircuitChange,
  onMisconceptionDetected
}) => {
  const [simulationResult, setSimulationResult] = useState<ExtendedSimulationResult | null>(null);
  const [showTutor, setShowTutor] = useState(true);
  const [showPipelineVisualizer, setShowPipelineVisualizer] = useState(false);

  const handleRunSimulation = async (backend: BackendType = 'local', shots: number = 1024) => {
    try {
      const res = await QuantumSimulationEngine.execute(currentCircuit, { backend, shots });
      setSimulationResult(res);

      const detected = MisconceptionEngine.analyzeCircuit(currentCircuit);
      if (detected.length > 0 && onMisconceptionDetected) {
        onMisconceptionDetected(detected[0].title);
      }
    } catch (err: any) {
      alert(err.message || 'Simulation execution failed.');
    }
  };

  const handleCircuitChange = (newCircuit: QuantumCircuitData) => {
    onCircuitChange(newCircuit);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Quantum Simulation Laboratory
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Construct quantum circuits visually or in Qiskit Python code, execute across simulation backends, and view wavefunction state vectors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPipelineVisualizer(!showPipelineVisualizer)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                showPipelineVisualizer
                  ? 'border-purple-500/40 bg-purple-950/60 text-purple-300 shadow-md shadow-purple-500/20'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>{showPipelineVisualizer ? 'Hide Pipeline Inspector' : 'Algorithm Pipelines'}</span>
            </button>

            <button
              onClick={() => setShowTutor(!showTutor)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                showTutor
                  ? 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300 shadow-md shadow-cyan-500/20'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="h-4 w-4" />
              <span>{showTutor ? 'Hide AI Mentor' : 'Show AI Mentor'}</span>
            </button>
          </div>
        </div>

        {/* Algorithm Pipeline Inspector if toggled */}
        {showPipelineVisualizer && (
          <AlgorithmPipelineVisualizer algorithm="grover" />
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Studio Area (Circuit + Simulation) */}
          <div className={`${showTutor ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col gap-8`}>
            
            {/* Circuit Studio Editor */}
            <CircuitBuilder
              circuit={currentCircuit}
              onChange={handleCircuitChange}
              onRunSimulation={handleRunSimulation}
            />

            {/* 3D Bloch Sphere Visualizer (if N=1 or single qubit active) */}
            {currentCircuit.numQubits === 1 && (
              <BlochSphere3D />
            )}

            {/* Simulation Results & Wavefunction Histogram */}
            <SimulationResults result={simulationResult} />

          </div>

          {/* AI Tutor Drawer Column */}
          {showTutor && (
            <div className="lg:col-span-4 sticky top-20">
              <AITutorChat
                activeModuleTitle="Quantum Studio"
                circuit={currentCircuit}
                onMisconceptionDetected={onMisconceptionDetected}
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
