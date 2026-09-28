import type { Misconception, QuantumCircuitData, QuizQuestion } from '../types';

export const KNOWN_MISCONCEPTIONS: Record<string, Misconception> = {
  'misc-state-collapse': {
    id: 'misc-state-collapse',
    title: 'Measurement Non-Destructiveness Fallacy',
    description: 'Belief that measuring a quantum state does not alter or collapse the statevector back into a classical basis state.',
    severity: 'high',
    concept: 'Quantum Measurement',
    remediationModuleId: 'mod-4',
    recommendedChallengeId: 'ch-3',
    aiExplanation: 'In quantum physics, measurement is irreversible! Reading a qubit in superposition immediately forces it to collapse into either |0⟩ or |1⟩. Subsequent measurements will always return the exact same result.'
  },
  'misc-hadamard-flip': {
    id: 'misc-hadamard-flip',
    title: 'Hadamard Gate Bit-Flip Confusion',
    description: 'Conflating the Hadamard (H) gate with a classical NOT gate or Pauli-X gate.',
    severity: 'medium',
    concept: 'Superposition & Gates',
    remediationModuleId: 'mod-3',
    recommendedChallengeId: 'ch-1',
    aiExplanation: 'The Hadamard gate does NOT flip |0⟩ to |1⟩ (that is the X gate). Instead, H creates an equal superposition (|0⟩+|1⟩)/√2. Applying H twice cancels itself out (H² = I).'
  },
  'misc-entanglement-local': {
    id: 'misc-entanglement-local',
    title: 'Local Superposition vs Entanglement',
    description: 'Assuming placing H gates on two separate qubits creates quantum entanglement.',
    severity: 'high',
    concept: 'Quantum Entanglement',
    remediationModuleId: 'mod-6',
    recommendedChallengeId: 'ch-4',
    aiExplanation: 'Applying H on q0 and H on q1 creates two independent superpositions (|0⟩+|1⟩)(|0⟩+|1⟩)/2 = (|00⟩+|01⟩+|10⟩+|11⟩)/2. To create entanglement (Bell State), you MUST use an entangling gate like CNOT between the qubits!'
  },
  'misc-phase-invisibility': {
    id: 'misc-phase-invisibility',
    title: 'Relative Phase Neglect',
    description: 'Ignoring the phase factor in quantum states, assuming |+⟩ and |-⟩ are identical states.',
    severity: 'medium',
    concept: 'Phase & Z Gates',
    remediationModuleId: 'mod-5',
    recommendedChallengeId: 'ch-2',
    aiExplanation: 'While |+⟩ = (|0⟩+|1⟩)/√2 and |-⟩ = (|0⟩-|1⟩)/√2 produce identical 50/50 measurement probabilities on the computational basis, their relative phase causes totally different interference when passed through subsequent gates (e.g. H|+⟩ = |0⟩, whereas H|-⟩ = |1⟩).'
  }
};

export class MisconceptionEngine {
  
  /**
   * Analyzes a circuit to detect potential student misconceptions
   */
  public static analyzeCircuit(circuit: QuantumCircuitData): Misconception[] {
    const detected: Misconception[] = [];
    const gates = circuit.gates;

    // Pattern 1: H -> H consecutive cancellation on same qubit
    const hGatesByQubit: Record<number, number[]> = {};
    for (const g of gates) {
      if (g.type === 'H') {
        if (!hGatesByQubit[g.qubit]) hGatesByQubit[g.qubit] = [];
        hGatesByQubit[g.qubit].push(g.step);
      }
    }

    for (const q in hGatesByQubit) {
      const steps = hGatesByQubit[q].sort((a, b) => a - b);
      for (let i = 0; i < steps.length - 1; i++) {
        if (steps[i + 1] === steps[i] + 1) {
          detected.push(KNOWN_MISCONCEPTIONS['misc-hadamard-flip']);
          break;
        }
      }
    }

    // Pattern 2: Multi-qubit circuit with H on both without CNOT trying to entangle
    const hasMultipleH = Object.keys(hGatesByQubit).length >= 2;
    const hasCNOT = gates.some(g => g.type === 'CNOT');
    if (hasMultipleH && !hasCNOT && circuit.numQubits >= 2) {
      detected.push(KNOWN_MISCONCEPTIONS['misc-entanglement-local']);
    }

    return Array.from(new Set(detected));
  }

  /**
   * Analyzes quiz performance to identify misconceptions
   */
  public static analyzeQuizSubmission(question: QuizQuestion, selectedIndex: number): Misconception | null {
    if (selectedIndex === question.correctIndex) return null;
    
    if (question.misconceptionId && KNOWN_MISCONCEPTIONS[question.misconceptionId]) {
      return KNOWN_MISCONCEPTIONS[question.misconceptionId];
    }

    const qLower = question.question.toLowerCase();
    if (qLower.includes('measure') || qLower.includes('collapse')) {
      return KNOWN_MISCONCEPTIONS['misc-state-collapse'];
    }
    if (qLower.includes('hadamard') || qLower.includes('superposition')) {
      return KNOWN_MISCONCEPTIONS['misc-hadamard-flip'];
    }
    if (qLower.includes('entangle') || qLower.includes('cnot')) {
      return KNOWN_MISCONCEPTIONS['misc-entanglement-local'];
    }

    return null;
  }
}
