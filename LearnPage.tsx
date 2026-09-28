import React, { useState } from 'react';
import { LEARNING_MODULES } from '../data/learningModules';
import type { LearningModule, NavigationPage, QuantumCircuitData } from '../types';
import { MisconceptionEngine } from '../services/misconceptionEngine';
import { 
  BookOpen, 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  HelpCircle
} from 'lucide-react';

interface LearnPageProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectCircuitPreset?: (circuit: QuantumCircuitData) => void;
  onMisconceptionDetected?: (title: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  onNavigate,
  onSelectCircuitPreset,
  onMisconceptionDetected
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeModule, setActiveModule] = useState<LearningModule | null>(LEARNING_MODULES[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});

  const filteredModules = LEARNING_MODULES.filter((m) => {
    if (selectedDifficulty === 'All') return true;
    return m.difficulty === selectedDifficulty;
  });

  const handleOptionSelect = (qId: string, optionIdx: number, module: LearningModule) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    const question = module.quizQuestions.find(q => q.id === qId);
    if (!question) return;

    const isCorrect = optionIdx === question.correctIndex;
    setQuizResults(prev => ({ ...prev, [qId]: isCorrect }));

    if (!isCorrect) {
      const detected = MisconceptionEngine.analyzeQuizSubmission(question, optionIdx);
      if (detected && onMisconceptionDetected) {
        onMisconceptionDetected(detected.title);
      }
    }
  };

  const handleTryInLab = (module: LearningModule) => {
    if (module.defaultCircuit && onSelectCircuitPreset) {
      onSelectCircuitPreset(module.defaultCircuit);
    }
    onNavigate('lab');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Quantum Learning Modules
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Structured curriculum from fundamental qubits to advanced algorithms like Grover and Teleportation.
            </p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Module Selection Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-3 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredModules.map((mod) => {
              const isActive = activeModule?.id === mod.id;
              return (
                <div
                  key={mod.id}
                  onClick={() => setActiveModule(mod)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isActive
                      ? 'border-cyan-500/50 bg-cyan-950/40 shadow-lg shadow-cyan-950/40'
                      : 'border-slate-800 bg-[#0b1120]/70 hover:border-slate-700 hover:bg-[#0b1120]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Module {mod.number}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      mod.difficulty === 'Beginner' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                      mod.difficulty === 'Intermediate' ? 'bg-purple-950 text-purple-300 border border-purple-500/30' :
                      'bg-rose-950 text-rose-300 border border-rose-500/30'
                    }`}>
                      {mod.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{mod.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{mod.summary}</p>
                </div>
              );
            })}
          </div>

          {/* Active Module Detail View */}
          {activeModule && (
            <div className="lg:col-span-8 flex flex-col gap-6 rounded-2xl border border-cyan-500/20 bg-[#0b1120]/95 p-6 backdrop-blur-xl shadow-xl">
              
              {/* Module Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
                      Module {activeModule.number}
                    </span>
                    <span className="text-xs text-slate-400">• {activeModule.duration}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">{activeModule.title}</h2>
                  <p className="text-xs text-slate-300">{activeModule.subtitle}</p>
                </div>

                <button
                  onClick={() => handleTryInLab(activeModule)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  <FlaskConical className="h-4 w-4" />
                  <span>Try in Quantum Lab</span>
                </button>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeModule.description}
              </div>

              {/* Dirac Math Notation Box */}
              {activeModule.mathNotation && (
                <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 font-mono text-xs sm:text-sm text-purple-300">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">
                    Mathematical Formulation
                  </span>
                  <div className="overflow-x-auto py-1 text-white font-bold">
                    {activeModule.mathNotation}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Key Takeaways</h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeModule.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Quiz Section */}
              <div className="border-t border-slate-800 pt-5 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">Module Comprehension Mini Quiz</h4>
                </div>

                {activeModule.quizQuestions.map((q) => {
                  const selected = selectedAnswers[q.id];
                  const isSubmitted = selected !== undefined;
                  const isCorrect = quizResults[q.id];

                  return (
                    <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                      <p className="text-xs font-semibold text-white">{q.question}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((option, optIdx) => {
                          const isOptionSelected = selected === optIdx;
                          let btnStyle = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700';

                          if (isSubmitted) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300 font-bold';
                            } else if (isOptionSelected && !isCorrect) {
                              btnStyle = 'border-rose-500/50 bg-rose-950/60 text-rose-300 font-bold';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleOptionSelect(q.id, optIdx, activeModule)}
                              className={`flex items-center justify-start rounded-lg border p-2.5 text-xs text-left transition-all ${btnStyle}`}
                            >
                              <span>{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div className={`rounded-lg p-3 text-xs flex items-start gap-2 ${
                          isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                        }`}>
                          {isCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                          <div>
                            <span className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect.'}</span> {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
