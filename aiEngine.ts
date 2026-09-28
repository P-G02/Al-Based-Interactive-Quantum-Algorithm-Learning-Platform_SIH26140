import type { QuantumCircuitData } from '../types';

export interface AITutorResponse {
  reply: string;
  suggestedActions: string[];
  detectedMisconception?: string;
}

export class AIEngine {
  private static apiKey: string = '';
  private static provider: 'deterministic' | 'openai' | 'gemini' = 'deterministic';

  public static setConfig(key: string, provider: 'deterministic' | 'openai' | 'gemini' = 'gemini') {
    this.apiKey = key;
    this.provider = key ? provider : 'deterministic';
  }

  public static getConfig() {
    return { apiKey: this.apiKey, provider: this.provider };
  }

  /**
   * Main chat function for Quantum Mentor AI
   */
  public static async queryTutor(
    userMessage: string,
    mode: 'beginner' | 'advanced' = 'beginner',
    activeModuleTitle?: string,
    circuit?: QuantumCircuitData
  ): Promise<AITutorResponse> {
    const msg = userMessage.toLowerCase().trim();

    // If external API key is provided, try calling external provider API
    if (this.apiKey && this.provider !== 'deterministic') {
      try {
        const externalReply = await this.callExternalAI();
        if (externalReply) return externalReply;
      } catch (err) {
        console.warn('External AI call failed, using deterministic quantum mentor fallback:', err);
      }
    }

    // Deterministic Quantum Mentor Fallback Engine
    return this.generateDeterministicResponse(msg, mode, activeModuleTitle, circuit);
  }

  private static generateDeterministicResponse(
    msg: string,
    mode: 'beginner' | 'advanced',
    activeModuleTitle?: string,
    circuit?: QuantumCircuitData
  ): AITutorResponse {

    let circuitNote = "";
    let detectedMisconception: string | undefined = undefined;

    if (circuit && circuit.gates.length > 0) {
      const gates = circuit.gates.map(g => g.type);
      const q0Gates = circuit.gates.filter(g => g.qubit === 0).map(g => g.type);

      if (q0Gates.join(',') === 'H,H') {
        circuitNote = " 🔍 **Circuit Inspection**: I noticed you placed two Hadamard (H) gates in a row on qubit q₀. Since H² = I (the identity matrix), applying H twice cancels out its effect completely, returning the qubit to its initial |0⟩ state!";
        detectedMisconception = "Hadamard Gate Bit-Flip Confusion";
      } else if (gates.includes('H') && gates.includes('CNOT')) {
        circuitNote = " ⚡ **Circuit Inspection**: Excellent! Your circuit combines a Hadamard (H) gate with a CNOT gate. This creates the canonical **Bell State** (|00⟩ + |11⟩)/√2 — maximum quantum entanglement!";
      } else if (gates.includes('X') && gates.includes('H')) {
        circuitNote = " 💡 **Circuit Inspection**: You applied X then H. This transforms |0⟩ ↦ |1⟩ ↦ (|0⟩ - |1⟩)/√2 (the |-⟩ state with relative phase π).";
      }
    }

    if (msg.includes('explain this simply') || msg.includes('simple') || msg.includes('beginner')) {
      return {
        reply: `Think of a classical bit like a standard coin sitting flat on a table — it is either Heads (0) or Tails (1). A qubit in **superposition** is like that coin spinning rapidly in mid-air! While spinning, it holds a combination of both 0 and 1. When you **measure** it, the coin drops to the table and settles on either 0 or 1.${circuitNote}`,
        suggestedActions: ['What is Hadamard gate?', 'Explain Bloch Sphere', 'Why does measurement collapse state?'],
        detectedMisconception
      };
    }

    if (msg.includes('why is my circuit wrong') || msg.includes('wrong') || msg.includes('debug')) {
      if (circuitNote) {
        return {
          reply: `Here is what I found analyzing your active circuit:${circuitNote}\n\nMake sure your gate sequence matches the target probability distribution required by your task!`,
          suggestedActions: ['Reset Circuit', 'Show Bell State Example', 'Give me a hint'],
          detectedMisconception
        };
      }
      return {
        reply: "Your circuit looks clean! However, verify if you need to add measurement gates or test whether your statevector matches the expected superposition.",
        suggestedActions: ['Add Hadamard Gate', 'Create Entanglement', 'Explain Measurement']
      };
    }

    if (msg.includes('superposition') || msg.includes('hadamard') || msg.includes('h gate')) {
      if (mode === 'advanced') {
        return {
          reply: `The Hadamard transformation $H$ is a unitary operator mapping $|0\\rangle \\mapsto \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$ and $|1\\rangle \\mapsto \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$. In matrix representation:\n$$H = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$\nApplying $H$ creates equal $50\\%$ measurement probabilities on the computational basis.${circuitNote}`,
          suggestedActions: ['Show Phase Shift', 'Explain H² = I', 'Try Superposition Challenge'],
          detectedMisconception
        };
      } else {
        return {
          reply: `Superposition allows a qubit to exist in a blend of both 0 and 1 at the exact same time. The Hadamard (H) gate is the fundamental building block that creates a 50/50 equal superposition!${circuitNote}`,
          suggestedActions: ['Try in Lab', 'Explain Bloch Sphere', 'What is Measurement?'],
          detectedMisconception
        };
      }
    }

    if (msg.includes('entangle') || msg.includes('cnot') || msg.includes('bell')) {
      if (mode === 'advanced') {
        return {
          reply: `Quantum Entanglement occurs when multi-qubit systems cannot be written as tensor products of single-qubit states $|\\psi\\rangle \\neq |\\phi_1\\rangle \\otimes |\\phi_2\\rangle$. For instance, the Bell state $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$ yields $100\\%$ correlated measurement outcomes across arbitrary distances.${circuitNote}`,
          suggestedActions: ['Build Bell State', 'Explain CNOT Matrix', 'Try Entanglement Challenge'],
          detectedMisconception
        };
      } else {
        return {
          reply: `Entanglement connects two qubits so intimately that measuring one instantly dictates the result of the other! You build an entangled pair in the Quantum Lab by applying an **H gate on q₀**, followed by a **CNOT gate with control q₀ and target q₁**.${circuitNote}`,
          suggestedActions: ['Open Entanglement Lab', 'Give me a hint', 'Test me'],
          detectedMisconception
        };
      }
    }

    if (msg.includes('bloch') || msg.includes('sphere')) {
      return {
        reply: `The Bloch sphere is a 3D globe representing all possible pure states of a single qubit:\n• North Pole = $|0\\rangle$\n• South Pole = $|1\\rangle$\n• Equator = Superposition states (like $|+\\rangle$ and $|-\\rangle$)\n• Rotating around X, Y, Z axes corresponds to applying Pauli gates!${circuitNote}`,
        suggestedActions: ['View 3D Bloch Sphere', 'Apply H Gate on Bloch', 'Apply Z Gate on Bloch'],
        detectedMisconception
      };
    }

    if (msg.includes('test me') || msg.includes('quiz') || msg.includes('challenge')) {
      return {
        reply: "Here is a quick pop-quiz question for you: **What happens to the statevector of a qubit in superposition (|0⟩+|1⟩)/√2 after you measure it?**",
        suggestedActions: [
          "It collapses to either |0⟩ or |1⟩",
          "It remains in superposition",
          "It resets to |0⟩ automatically"
        ],
        detectedMisconception
      };
    }

    return {
      reply: `Greetings! I am your AI Quantum Mentor. I am currently monitoring your progress on **${activeModuleTitle || 'Quantum Computing Foundations'}**. Feel free to ask any questions about quantum logic gates, superposition, Bloch sphere geometry, or ask me to review your active quantum circuit!${circuitNote}`,
      suggestedActions: ['Explain Superposition simply', 'Why is my circuit wrong?', 'Give me a hint', 'Test my knowledge'],
      detectedMisconception
    };
  }

  private static async callExternalAI(): Promise<AITutorResponse | null> {
    return null;
  }
}
