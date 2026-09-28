export type GateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'SWAP' | 'M';

export interface CircuitGate {
  id: string;
  type: GateType;
  qubit: number;
  targetQubit?: number; // for multi-qubit gates like CNOT
  step: number;
  label?: string;
}

export interface QuantumCircuitData {
  numQubits: number;
  gates: CircuitGate[];
}

export interface ComplexNumber {
  real: number;
  imag: number;
}

export interface StateVectorElement {
  state: string;
  real: number;
  imag: number;
  prob: number;
  phase: number; // in radians or degrees
}

export interface BlochCoords {
  theta: number; // angle from Z axis [0, pi]
  phi: number;   // angle around Z axis in XY plane [0, 2pi]
  x: number;
  y: number;
  z: number;
}

export interface QuantumStateResult {
  numQubits: number;
  circuitDepth: number;
  gateCount: number;
  probabilities: Record<string, number>;
  statevector: StateVectorElement[];
  singleQubitBloch?: BlochCoords;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionId?: string;
}

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  iconName: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  description: string;
  keyTakeaways: string[];
  mathNotation?: string;
  interactiveType: 'bloch' | 'circuit' | 'quiz' | 'entanglement';
  defaultCircuit?: QuantumCircuitData;
  quizQuestions: QuizQuestion[];
}

export interface Misconception {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  concept: string;
  remediationModuleId: string;
  recommendedChallengeId: string;
  aiExplanation: string;
}

export interface AdaptiveChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  description: string;
  hint: string;
  targetStateDescription: string;
  targetProbabilities: Record<string, number>; // e.g. { "00": 0.5, "11": 0.5 }
  minGates?: number;
  maxGates?: number;
  requiredGates?: GateType[];
  initialCircuit: QuantumCircuitData;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  conceptsMastered: string[];
  completedChallenges: string[];
  quizScores: Record<string, number>;
  activeMisconceptions: Misconception[];
  badges: Badge[];
}

export interface InstructorStudentOverview {
  id: string;
  name: string;
  progress: number;
  level: number;
  riskStatus: 'on-track' | 'needs-help' | 'at-risk';
  weakConcept: string;
  activeMisconception?: string;
}

export type NavigationPage = 
  | 'landing' 
  | 'dashboard' 
  | 'learn' 
  | 'lab' 
  | 'tutor' 
  | 'challenges' 
  | 'analytics' 
  | 'instructor';
