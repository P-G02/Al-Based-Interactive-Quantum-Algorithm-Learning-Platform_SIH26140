import type { QuantumCircuitData, QuantumStateResult, StateVectorElement, BlochCoords } from '../types';

/**
 * High-performance Browser-side Quantum Simulator Engine
 * Computes exact statevectors, amplitudes, phases, measurement probabilities, and Bloch coordinates.
 */
export class QuantumSimulator {

  /**
   * Simulates a quantum circuit for 1 to 4 qubits
   */
  public static simulate(circuit: QuantumCircuitData): QuantumStateResult {
    const numQubits = Math.min(Math.max(circuit.numQubits, 1), 4);
    const dim = 1 << numQubits; // 2^N

    // Initialize state vector |00...0>
    // Represented as arrays of real and imaginary parts
    let real = new Float64Array(dim);
    let imag = new Float64Array(dim);
    real[0] = 1.0;

    // Sort gates chronologically by step
    const sortedGates = [...circuit.gates].sort((a, b) => a.step - b.step);

    const SQRT2_INV = 1.0 / Math.sqrt(2);

    for (const gate of sortedGates) {
      const q = gate.qubit;
      if (q >= numQubits) continue;

      const type = gate.type.toUpperCase();

      if (type === 'H') {
        const nextReal = new Float64Array(dim);
        const nextImag = new Float64Array(dim);
        for (let i = 0; i < dim; i++) {
          const bit = (i >> q) & 1;
          const pair = i ^ (1 << q);
          if (bit === 0) {
            nextReal[i] = SQRT2_INV * (real[i] + real[pair]);
            nextImag[i] = SQRT2_INV * (imag[i] + imag[pair]);
          } else {
            nextReal[i] = SQRT2_INV * (real[pair] - real[i]);
            nextImag[i] = SQRT2_INV * (imag[pair] - imag[i]);
          }
        }
        real = nextReal;
        imag = nextImag;
      } 
      else if (type === 'X') {
        const nextReal = new Float64Array(dim);
        const nextImag = new Float64Array(dim);
        for (let i = 0; i < dim; i++) {
          const pair = i ^ (1 << q);
          nextReal[pair] = real[i];
          nextImag[pair] = imag[i];
        }
        real = nextReal;
        imag = nextImag;
      }
      else if (type === 'Y') {
        // Y = [[0, -i], [i, 0]]
        const nextReal = new Float64Array(dim);
        const nextImag = new Float64Array(dim);
        for (let i = 0; i < dim; i++) {
          const bit = (i >> q) & 1;
          const pair = i ^ (1 << q);
          if (bit === 0) {
            nextReal[pair] = -imag[i];
            nextImag[pair] = real[i];
          } else {
            nextReal[pair] = imag[i];
            nextImag[pair] = -real[i];
          }
        }
        real = nextReal;
        imag = nextImag;
      }
      else if (type === 'Z') {
        for (let i = 0; i < dim; i++) {
          if (((i >> q) & 1) === 1) {
            real[i] = -real[i];
            imag[i] = -imag[i];
          }
        }
      }
      else if (type === 'S') {
        for (let i = 0; i < dim; i++) {
          if (((i >> q) & 1) === 1) {
            const oldR = real[i];
            const oldI = imag[i];
            real[i] = -oldI;
            imag[i] = oldR;
          }
        }
      }
      else if (type === 'T') {
        for (let i = 0; i < dim; i++) {
          if (((i >> q) & 1) === 1) {
            const oldR = real[i];
            const oldI = imag[i];
            real[i] = oldR * SQRT2_INV - oldI * SQRT2_INV;
            imag[i] = oldR * SQRT2_INV + oldI * SQRT2_INV;
          }
        }
      }
      else if (type === 'CNOT' && gate.targetQubit !== undefined && gate.targetQubit < numQubits) {
        const control = gate.qubit;
        const target = gate.targetQubit;
        const nextReal = new Float64Array(real);
        const nextImag = new Float64Array(imag);
        for (let i = 0; i < dim; i++) {
          if (((i >> control) & 1) === 1) {
            const pair = i ^ (1 << target);
            nextReal[pair] = real[i];
            nextImag[pair] = imag[i];
          }
        }
        real = nextReal;
        imag = nextImag;
      }
      else if (type === 'SWAP' && gate.targetQubit !== undefined && gate.targetQubit < numQubits) {
        const q1 = gate.qubit;
        const q2 = gate.targetQubit;
        const nextReal = new Float64Array(dim);
        const nextImag = new Float64Array(dim);
        for (let i = 0; i < dim; i++) {
          const b1 = (i >> q1) & 1;
          const b2 = (i >> q2) & 1;
          if (b1 !== b2) {
            const swappedIdx = i ^ (1 << q1) ^ (1 << q2);
            nextReal[swappedIdx] = real[i];
            nextImag[swappedIdx] = imag[i];
          } else {
            nextReal[i] = real[i];
            nextImag[i] = imag[i];
          }
        }
        real = nextReal;
        imag = nextImag;
      }
    }

    // Build State Vector & Measurement Probabilities
    const probabilities: Record<string, number> = {};
    const statevector: StateVectorElement[] = [];

    for (let i = 0; i < dim; i++) {
      const bitStr = i.toString(2).padStart(numQubits, '0');
      const r = real[i];
      const im = imag[i];
      const prob = r * r + im * im;
      const phase = Math.atan2(im, r);

      probabilities[bitStr] = parseFloat(prob.toFixed(4));
      statevector.push({
        state: `|${bitStr}⟩`,
        real: parseFloat(r.toFixed(4)),
        imag: parseFloat(im.toFixed(4)),
        prob: parseFloat(prob.toFixed(4)),
        phase: parseFloat(phase.toFixed(4))
      });
    }

    const maxStep = sortedGates.length > 0 ? Math.max(...sortedGates.map(g => g.step)) + 1 : 0;

    let singleQubitBloch: BlochCoords | undefined = undefined;
    if (numQubits === 1) {
      singleQubitBloch = this.computeBlochCoords(real[0], imag[0], real[1], imag[1]);
    }

    return {
      numQubits,
      circuitDepth: maxStep,
      gateCount: sortedGates.length,
      probabilities,
      statevector,
      singleQubitBloch
    };
  }

  /**
   * Computes 3D Bloch sphere coordinates (x, y, z) and angles (theta, phi)
   */
  public static computeBlochCoords(r0: number, i0: number, r1: number, i1: number): BlochCoords {
    const mag0 = Math.sqrt(r0 * r0 + i0 * i0);
    const alphaAbs = Math.min(Math.max(mag0, 0), 1);
    const theta = 2 * Math.acos(alphaAbs);

    const phase0 = Math.atan2(i0, r0);
    const phase1 = Math.atan2(i1, r1);
    let phi = phase1 - phase0;
    if (phi < 0) phi += 2 * Math.PI;

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    return {
      theta,
      phi,
      x: parseFloat(x.toFixed(4)),
      y: parseFloat(y.toFixed(4)),
      z: parseFloat(z.toFixed(4))
    };
  }
}
