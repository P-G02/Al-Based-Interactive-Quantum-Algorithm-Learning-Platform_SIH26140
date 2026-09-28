import type { QuantumCircuitData } from '../types';

export interface CircuitOptimizationFinding {
  type: 'redundancy' | 'missing_measurement' | 'entanglement_opportunity' | 'depth_reduction' | 'info';
  severity: 'low' | 'medium' | 'high';
  title: string;
  observation: string;
  optimization: string;
  explanation: string;
}

export interface CircuitAnalysisReport {
  findings: CircuitOptimizationFinding[];
  isOptimized: boolean;
  score: number; // 0 to 100
  summary: string;
}

export class CircuitAnalyzer {

  /**
   * Analyzes a quantum circuit for logic errors, redundancy, and optimization opportunities
   */
  public static analyze(circuit: QuantumCircuitData): CircuitAnalysisReport {
    const findings: CircuitOptimizationFinding[] = [];
    const gates = circuit.gates;

    if (gates.length === 0) {
      return {
        findings: [{
          type: 'info',
          severity: 'low',
          title: 'Empty Circuit',
          observation: 'Circuit has 0 gates placed.',
          optimization: 'Add gates like Hadamard (H) or Pauli-X to begin.',
          explanation: 'All qubits remain in default computational basis state |0⟩.'
        }],
        isOptimized: true,
        score: 100,
        summary: 'Circuit is empty.'
      };
    }

    // 1. Check for consecutive identical self-inverse gates (H-H, X-X, Y-Y, Z-Z)
    const gatesByQubit: Record<number, typeof gates> = {};
    for (const g of gates) {
      if (!gatesByQubit[g.qubit]) gatesByQubit[g.qubit] = [];
      gatesByQubit[g.qubit].push(g);
    }

    for (const qStr in gatesByQubit) {
      const q = parseInt(qStr, 10);
      const qGates = gatesByQubit[q].sort((a, b) => a.step - b.step);

      for (let i = 0; i < qGates.length - 1; i++) {
        const current = qGates[i];
        const next = qGates[i + 1];

        if (
          ['H', 'X', 'Y', 'Z'].includes(current.type) &&
          current.type === next.type &&
          next.step === current.step + 1
        ) {
          findings.push({
            type: 'redundancy',
            severity: 'high',
            title: `Redundant ${current.type} Gate Cancellation`,
            observation: `Two consecutive ${current.type} gates placed on qubit q${q} at steps ${current.step} and ${next.step}.`,
            optimization: `${current.type} → ${current.type} can be simplified to Identity (I).`,
            explanation: `The ${current.type} gate is self-inverse (${current.type}² = I). Applying it twice restores the qubit to its previous state, wasting circuit depth.`
          });
        }
      }
    }

    // 2. Check for multi-qubit superposition without CNOT
    const hasMultipleHadamards = Object.keys(gatesByQubit).length >= 2 && 
      Object.values(gatesByQubit).some(list => list.some(g => g.type === 'H'));
    const hasCNOT = gates.some(g => g.type === 'CNOT');

    if (hasMultipleHadamards && !hasCNOT && circuit.numQubits >= 2) {
      findings.push({
        type: 'entanglement_opportunity',
        severity: 'medium',
        title: 'Unentangled Parallel Superposition',
        observation: `Multiple qubits have superposition applied, but no entangling gates (CNOT) exist between them.`,
        optimization: `Add a CNOT gate with control q0 and target q1 to generate Bell state entanglement.`,
        explanation: `Without CNOT or controlled gates, multi-qubit states are strictly separable (|ψ₁⟩ ⊗ |ψ₂⟩) and cannot achieve quantum entanglement speedup.`
      });
    }

    // 3. Check for missing measurement gates
    const hasMeasurement = gates.some(g => g.type === 'M');
    if (!hasMeasurement) {
      findings.push({
        type: 'missing_measurement',
        severity: 'low',
        title: 'Wavefunction Statevector Mode (No Explicit Measurement)',
        observation: `Circuit runs in exact statevector simulation mode without explicit Measurement (M) gates.`,
        optimization: `Optionally add Measurement (M) gates if preparing for hardware deployment.`,
        explanation: `In quantum algorithms, explicit measurement operations collapse the statevector to output classical bits.`
      });
    }

    const highSeverityCount = findings.filter(f => f.severity === 'high').length;
    const score = Math.max(100 - highSeverityCount * 30 - findings.length * 10, 20);

    return {
      findings,
      isOptimized: findings.length === 0 || (findings.length === 1 && findings[0].type === 'missing_measurement'),
      score,
      summary: findings.length === 0 
        ? '⚡ Circuit is fully optimized with clean gate efficiency.'
        : `Identified ${findings.length} observation(s) for optimization.`
    };
  }
}
