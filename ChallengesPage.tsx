import React, { useState } from 'react';
import { ADAPTIVE_CHALLENGES } from '../data/challenges';
import type { CodeChallenge } from '../data/challenges';
import type { NavigationPage, QuantumCircuitData, UserProgress } from '../types';
import { QuantumSimulationEngine } from '../services/simulationEngine';
import { CircuitBuilder } from '../components/CircuitBuilder';
import { SimulationResults } from '../components/SimulationResults';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, ArrowLeft, Code, Layers } from 'lucide-react';

interface ChallengesPageProps {
  progress: UserProgress;
  onNavigate: (page: NavigationPage) => void;
  onCompleteChallenge: (challengeId: string, points: number) => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({
  progress,
  onCompleteChallenge
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeChallenge, setActiveChallenge] = useState<CodeChallenge | null>(null);
  const [testCircuit, setTestCircuit] = useState<QuantumCircuitData | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [verificationMessage, setVerificationMessage] = useState<{ success: boolean; text: string } | null>(null);

  const filteredChallenges = ADAPTIVE_CHALLENGES.filter((c) => {
    if (selectedDifficulty === 'All') return true;
    return c.difficulty === selectedDifficulty;
  });

  const startChallenge = (challenge: CodeChallenge) => {
    setActiveChallenge(challenge);
    setTestCircuit({ ...challenge.initialCircuit });
    setUserCode(challenge.initialCode || '');
    setVerificationMessage(null);
  };

  const verifySolution = async () => {
    if (!activeChallenge) return;

    let targetCircuit = testCircuit;
    if (activeChallenge.type === 'code') {
      targetCircuit = QuantumSimulationEngine.parseQiskitCode(userCode);
      setTestCircuit(targetCircuit);
    }

    if (!targetCircuit) return;

    const res = await QuantumSimulationEngine.execute(targetCircuit, { backend: 'local', shots: 1024 });
    const targetProbs = activeChallenge.targetProbabilities;

    let isMatched = true;
    for (const [state, targetP] of Object.entries(targetProbs)) {
      const actualP = res.probabilities[state] || 0;
      if (Math.abs(actualP - targetP) > 0.08) {
        isMatched = false;
        break;
      }
    }

    if (isMatched) {
      setVerificationMessage({
        success: true,
        text: `🎉 Challenge Solved! You earned +${activeChallenge.points} XP and mastered "${activeChallenge.title}".`
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onCompleteChallenge(activeChallenge.id, activeChallenge.points);
    } else {
      setVerificationMessage({
        success: false,
        text: `❌ Solution incomplete. Expected probabilities: ${activeChallenge.targetStateDescription}. Review your gate sequence/code!`
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Adaptive Quantum Assessments & Coding Challenges
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Solve graphical circuit building problems and write Qiskit Python code to earn XP points.
            </p>
          </div>

          {!activeChallenge && (
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Challenge Interactive Solver View */}
        {activeChallenge ? (
          <div className="flex flex-col gap-6 rounded-2xl border border-amber-500/30 bg-[#0b1120]/95 p-6 backdrop-blur-xl shadow-2xl">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <button
                onClick={() => setActiveChallenge(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to All Challenges</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/40">
                  +{activeChallenge.points} XP Reward
                </span>
              </div>
            </div>

            {/* Challenge Info Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400">
                  {activeChallenge.type === 'code' ? 'QISKIT CODING CHALLENGE' : 'GRAPHICAL CIRCUIT CHALLENGE'}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{activeChallenge.title}</h2>
              <p className="text-xs text-slate-300 mt-1">{activeChallenge.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-slate-800 px-2.5 py-1 text-amber-300 font-mono">
                  Target: {activeChallenge.targetStateDescription}
                </span>
                <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-400">
                  Hint: {activeChallenge.hint}
                </span>
              </div>
            </div>

            {/* Verification Result Alert */}
            {verificationMessage && (
              <div className={`rounded-xl p-4 text-xs font-semibold flex items-center justify-between ${
                verificationMessage.success
                  ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/70 border border-rose-500/50 text-rose-300'
              }`}>
                <span>{verificationMessage.text}</span>
                {verificationMessage.success && (
                  <button
                    onClick={() => setActiveChallenge(null)}
                    className="rounded-lg bg-emerald-400 px-3 py-1 text-slate-950 font-bold hover:bg-emerald-300"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {/* If Code Challenge, render Qiskit Editor */}
            {activeChallenge.type === 'code' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-purple-400 font-bold">
                  <Code className="h-4 w-4" />
                  <span>Write your Qiskit Python Code solution:</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-4 font-mono text-xs text-cyan-300 leading-relaxed focus:border-cyan-500/50 focus:outline-none"
                  spellCheck={false}
                />
              </div>
            ) : (
              /* Graphical Circuit Builder */
              testCircuit && (
                <CircuitBuilder
                  circuit={testCircuit}
                  onChange={(c) => setTestCircuit(c)}
                  onRunSimulation={() => {}}
                />
              )
            )}

            {/* Verify Solution Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={verifySolution}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-xs font-extrabold text-slate-950 hover:from-amber-400 shadow-lg shadow-amber-500/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit & Verify Solution</span>
              </button>
            </div>

          </div>
        ) : (
          /* Challenges List Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((c) => {
              const isCompleted = progress.completedChallenges.includes(c.id);
              return (
                <div
                  key={c.id}
                  className={`flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                    isCompleted
                      ? 'border-emerald-500/30 bg-emerald-950/20 shadow-lg'
                      : 'border-slate-800 bg-[#0b1120]/80 hover:border-amber-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {c.category}
                      </span>
                      <span className="rounded-full bg-amber-950 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                        +{c.points} XP
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5">{c.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-2">
                    {isCompleted ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">Target: {c.targetStateDescription}</span>
                    )}

                    <button
                      onClick={() => startChallenge(c)}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        isCompleted
                          ? 'border border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                      }`}
                    >
                      <span>{isCompleted ? 'Re-Solve' : 'Solve Challenge'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
