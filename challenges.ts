import type { AdaptiveChallenge } from '../types';

export interface CodeChallenge extends AdaptiveChallenge {
  type: 'graphical' | 'code';
  initialCode?: string;
  expectedQiskitPattern?: string;
}

export const ADAPTIVE_CHALLENGES: CodeChallenge[] = [
  {
    id: 'ch-1',
    type: 'graphical',
    title: 'Equal Superposition Creation',
    category: 'Superposition & Gates',
    difficulty: 'Beginner',
    points: 100,
    description: 'Construct a circuit that puts a single qubit starting in state |0⟩ into an equal 50/50 superposition state (|0⟩ + |1⟩)/√2.',
    hint: 'Think about which single-qubit gate creates an equal probability amplitude between 0 and 1.',
    targetStateDescription: 'P(0) = 50%, P(1) = 50%',
    targetProbabilities: { '0': 0.5, '1': 0.5 },
    minGates: 1,
    maxGates: 1,
    requiredGates: ['H'],
    initialCircuit: {
      numQubits: 1,
      gates: []
    }
  },
  {
    id: 'ch-code-1',
    type: 'code',
    title: 'Qiskit Bell State Coding Challenge',
    category: 'Quantum Coding',
    difficulty: 'Intermediate',
    points: 200,
    description: 'Write Qiskit Python code to construct a 2-qubit Bell state (|00⟩ + |11⟩)/√2 using Hadamard and CNOT gates.',
    hint: 'Use qc.h(0) on qubit 0, followed by qc.cx(0, 1) to entangle qubit 1.',
    targetStateDescription: 'P(00) = 50%, P(11) = 50%',
    targetProbabilities: { '00': 0.5, '11': 0.5 },
    initialCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
# Write your Qiskit gates below:
# qc.h(...)
# qc.cx(...)
qc.measure_all()`,
    initialCircuit: {
      numQubits: 2,
      gates: []
    }
  },
  {
    id: 'ch-2',
    type: 'graphical',
    title: 'Superposition Cancellation',
    category: 'Quantum Interference',
    difficulty: 'Beginner',
    points: 150,
    description: 'Build a circuit starting at |0⟩ that puts the qubit into superposition and then cancels it out, returning 100% measurement probability for |0⟩.',
    hint: 'Recall that the Hadamard gate is self-inverse: H² = I.',
    targetStateDescription: 'P(0) = 100%, P(1) = 0%',
    targetProbabilities: { '0': 1.0, '1': 0.0 },
    minGates: 2,
    maxGates: 2,
    requiredGates: ['H'],
    initialCircuit: {
      numQubits: 1,
      gates: [{ id: 'init-1', type: 'H', qubit: 0, step: 0 }]
    }
  },
  {
    id: 'ch-3',
    type: 'graphical',
    title: 'Entangled Bell State |Φ⁺⟩',
    category: 'Quantum Entanglement',
    difficulty: 'Intermediate',
    points: 250,
    description: 'Create the canonical Bell State (|00⟩ + |11⟩)/√2 using 2 qubits. The output probabilities must be exactly 50% for |00⟩ and 50% for |11⟩.',
    hint: 'First apply Hadamard H to qubit q0, then add a CNOT gate with control=q0 and target=q1.',
    targetStateDescription: 'P(00) = 50%, P(11) = 50%',
    targetProbabilities: { '00': 0.5, '11': 0.5 },
    minGates: 2,
    requiredGates: ['H', 'CNOT'],
    initialCircuit: {
      numQubits: 2,
      gates: []
    }
  },
  {
    id: 'ch-4',
    type: 'graphical',
    title: 'Antisymmetric Bell State |Ψ⁻⟩',
    category: 'Phase & Entanglement',
    difficulty: 'Intermediate',
    points: 300,
    description: 'Construct the Bell State (|01⟩ - |10⟩)/√2. The probabilities must be 50% for |01⟩ and 50% for |10⟩ with phase interference.',
    hint: 'Use X on q1 to flip it to |1⟩, then apply H on q0 and CNOT from q0 to q1.',
    targetStateDescription: 'P(01) = 50%, P(10) = 50%',
    targetProbabilities: { '01': 0.5, '10': 0.5 },
    minGates: 3,
    requiredGates: ['X', 'H', 'CNOT'],
    initialCircuit: {
      numQubits: 2,
      gates: []
    }
  },
  {
    id: 'ch-5',
    type: 'graphical',
    title: "Grover Oracle Phase Flip",
    category: 'Quantum Algorithms',
    difficulty: 'Advanced',
    points: 400,
    description: "Construct a 2-qubit circuit that marks the target state |11⟩ by flipping its relative phase while keeping equal magnitude across states.",
    hint: "Prepare equal superposition on both qubits using H gates, then apply CZ or Z/CNOT sequence to invert phase of |11⟩.",
    targetStateDescription: 'Equal probabilities 25% each, with phase -1 on |11⟩',
    targetProbabilities: { '00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25 },
    minGates: 3,
    requiredGates: ['H'],
    initialCircuit: {
      numQubits: 2,
      gates: [
        { id: 'g1', type: 'H', qubit: 0, step: 0 },
        { id: 'g2', type: 'H', qubit: 1, step: 0 }
      ]
    }
  }
];
