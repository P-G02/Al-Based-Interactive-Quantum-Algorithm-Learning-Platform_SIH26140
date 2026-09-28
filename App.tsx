import { useState } from 'react';
import type { NavigationPage, QuantumCircuitData, UserProgress } from './types';
import { Navbar } from './components/Navbar';
import { APIKeyModal } from './components/APIKeyModal';

import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { LearnPage } from './pages/LearnPage';
import { LabPage } from './pages/LabPage';
import { AIAdvisorPage } from './pages/AIAdvisorPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { InstructorDashboard } from './pages/InstructorDashboard';

import { KNOWN_MISCONCEPTIONS } from './services/misconceptionEngine';

export function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('landing');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isAPIModalOpen, setIsAPIModalOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<'student' | 'instructor'>('student');

  // Initial Seeded User Progress (Demo Mode)
  const [progress, setProgress] = useState<UserProgress>({
    xp: 850,
    level: 4,
    streak: 5,
    conceptsMastered: ['qubit_basics', 'superposition', 'h_gate', 'pauli_x', 'z_phase', 'cnot_gate'],
    completedChallenges: ['ch-1', 'ch-2'],
    quizScores: { 'mod-1': 100, 'mod-2': 90, 'mod-3': 80, 'mod-4': 60 },
    activeMisconceptions: [KNOWN_MISCONCEPTIONS['misc-state-collapse']],
    badges: [
      { id: 'b1', name: 'First Circuit', desc: 'Built first quantum circuit', icon: '⚡', unlocked: true },
      { id: 'b2', name: 'Superposition Master', desc: 'Mastered Hadamard gate', icon: '⚛️', unlocked: true },
      { id: 'b3', name: 'Gate Explorer', desc: 'Used all single-qubit gates', icon: '🧩', unlocked: true },
      { id: 'b4', name: 'Entanglement Initiate', desc: 'Created first Bell State', icon: '🔗', unlocked: true },
      { id: 'b5', name: 'Algorithm Apprentice', desc: 'Completed Grover challenge', icon: '🏆', unlocked: false },
    ]
  });

  // Current Quantum Circuit in Studio
  const [currentCircuit, setCurrentCircuit] = useState<QuantumCircuitData>({
    numQubits: 2,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, step: 0 },
      { id: 'g2', type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 }
    ]
  });

  const handleToggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  const handleToggleRole = () => {
    const nextRole = currentRole === 'student' ? 'instructor' : 'student';
    setCurrentRole(nextRole);
    if (nextRole === 'instructor') {
      setCurrentPage('instructor');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleDismissMisconception = (id: string) => {
    setProgress(prev => ({
      ...prev,
      activeMisconceptions: prev.activeMisconceptions.filter(m => m.id !== id)
    }));
  };

  const handleMisconceptionDetected = (title: string) => {
    if (progress.activeMisconceptions.some(m => m.title === title)) return;
    
    const matched = Object.values(KNOWN_MISCONCEPTIONS).find(m => m.title === title);
    if (matched) {
      setProgress(prev => ({
        ...prev,
        activeMisconceptions: [...prev.activeMisconceptions, matched]
      }));
    }
  };

  const handleCompleteChallenge = (challengeId: string, points: number) => {
    if (progress.completedChallenges.includes(challengeId)) return;

    const newXP = progress.xp + points;
    const newLevel = Math.floor(newXP / 250) + 1;

    setProgress(prev => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      completedChallenges: [...prev.completedChallenges, challengeId]
    }));
  };

  return (
    <div className="min-h-screen bg-[#070a12] font-sans antialiased text-white selection:bg-cyan-500 selection:text-slate-950">
      
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        progress={progress}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenAPIModal={() => setIsAPIModalOpen(true)}
        currentRole={currentRole}
        onToggleRole={handleToggleRole}
      />

      <main className="w-full">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'dashboard' && (
          <StudentDashboard
            progress={progress}
            onNavigate={setCurrentPage}
            onDismissMisconception={handleDismissMisconception}
          />
        )}

        {currentPage === 'learn' && (
          <LearnPage
            onNavigate={setCurrentPage}
            onSelectCircuitPreset={(circuit) => setCurrentCircuit(circuit)}
            onMisconceptionDetected={handleMisconceptionDetected}
          />
        )}

        {currentPage === 'lab' && (
          <LabPage
            currentCircuit={currentCircuit}
            onCircuitChange={setCurrentCircuit}
            onMisconceptionDetected={handleMisconceptionDetected}
          />
        )}

        {currentPage === 'tutor' && (
          <AIAdvisorPage
            onNavigate={setCurrentPage}
            onMisconceptionDetected={handleMisconceptionDetected}
          />
        )}

        {currentPage === 'challenges' && (
          <ChallengesPage
            progress={progress}
            onNavigate={setCurrentPage}
            onCompleteChallenge={handleCompleteChallenge}
          />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage progress={progress} />
        )}

        {currentPage === 'instructor' && (
          <InstructorDashboard />
        )}
      </main>

      <APIKeyModal
        isOpen={isAPIModalOpen}
        onClose={() => setIsAPIModalOpen(false)}
      />

    </div>
  );
}

export default App;
