import type { LearningModule } from '../types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'Quantum Computing Basics',
    subtitle: 'From Classical Bits to Quantum Advantage',
    iconName: 'Cpu',
    duration: '10 mins',
    difficulty: 'Beginner',
    summary: 'Discover how quantum physics transforms computation beyond binary zeros and ones.',
    description: 'Classical computers store information in bit transistors that are strictly 0 or 1. Quantum computing harnesses quantum mechanical phenomena like superposition and interference to process complex multidimensional information exponentially faster for specific problems.',
    keyTakeaways: [
      'Classical bits are binary (0 or 1); Qubits exist in linear combinations of basis states.',
      'Quantum supremacy unlocks exponential parallelism for algorithms like factoring and search.',
      'Information is processed via reversible unitary matrix operations (quantum gates).'
    ],
    mathNotation: 'Classical: b \\in \\{0, 1\\} \\quad \\text{vs} \\quad Quantum: |\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle',
    interactiveType: 'bloch',
    quizQuestions: [
      {
        id: 'q1-1',
        question: 'What is the fundamental unit of quantum information?',
        options: ['Classical Bit', 'Qubit (Quantum Bit)', 'Byte', 'Logic Gate'],
        correctIndex: 1,
        explanation: 'The qubit (quantum bit) is the fundamental storage element in quantum computing.'
      },
      {
        id: 'q1-2',
        question: 'Which quantum mechanical principle allows qubits to exist in multiple states at once?',
        options: ['Quantum Tunneling', 'Superposition', 'Thermal Radiation', 'Electromagnetic Induction'],
        correctIndex: 1,
        explanation: 'Superposition enables a qubit to be a linear combination of |0⟩ and |1⟩ simultaneously.'
      }
    ]
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Qubits & State Representation',
    subtitle: 'Bra-Ket Notation and State Vectors',
    iconName: 'Atom',
    duration: '15 mins',
    difficulty: 'Beginner',
    summary: 'Master Dirac bra-ket notation and complex probability amplitudes.',
    description: 'A single qubit state |ψ⟩ is represented as a unit vector in a 2-dimensional complex Hilbert space. The state is defined by complex amplitudes α and β such that |α|² + |β|² = 1, where |α|² represents the probability of measuring 0 and |β|² represents measuring 1.',
    keyTakeaways: [
      'Dirac Bra-Ket notation uses |ψ⟩ (ket) for column statevectors.',
      'Probability amplitudes α and β can be complex numbers with phase information.',
      'Normalizing condition requires sum of squared magnitudes |α|² + |β|² = 1.'
    ],
    mathNotation: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle \\quad \\text{with} \\quad |\\alpha|^2 + |\\beta|^2 = 1',
    interactiveType: 'bloch',
    quizQuestions: [
      {
        id: 'q2-1',
        question: 'If a qubit has amplitude α = 1/√2 for state |0⟩, what is P(0)?',
        options: ['25%', '50%', '70.7%', '100%'],
        correctIndex: 1,
        explanation: 'P(0) = |α|² = |1/√2|² = 1/2 = 50%.'
      }
    ]
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Superposition & Hadamard Gate',
    subtitle: 'Creating Quantum Parallelism with the H Gate',
    iconName: 'Layers',
    duration: '15 mins',
    difficulty: 'Beginner',
    summary: 'Learn how the Hadamard gate transforms classical bits into equal superpositions.',
    description: 'The Hadamard (H) gate is the cornerstone gate of quantum algorithms. It maps computational basis states |0⟩ and |1⟩ into symmetric equal superposition states |+⟩ and |-⟩. Applying H to |0⟩ creates an equal 50% chance of measuring 0 or 1 upon observation.',
    keyTakeaways: [
      'H|0⟩ = (|0⟩ + |1⟩)/√2 (denoted as state |+⟩).',
      'H|1⟩ = (|0⟩ - |1⟩)/√2 (denoted as state |-⟩).',
      'Applying H twice cancels out: H² = I (Identity matrix).'
    ],
    mathNotation: 'H = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}',
    interactiveType: 'circuit',
    defaultCircuit: {
      numQubits: 1,
      gates: [{ id: 'g1', type: 'H', qubit: 0, step: 0 }]
    },
    quizQuestions: [
      {
        id: 'q3-1',
        question: 'What is the outcome of applying two consecutive Hadamard gates (H · H) to state |0⟩?',
        options: ['|1⟩', '|0⟩', '50% 0, 50% 1', 'Undefined'],
        correctIndex: 1,
        explanation: 'Because H is self-inverse (H = H⁻¹), H² = I, returning the qubit to its starting state |0⟩.',
        misconceptionId: 'misc-hadamard-flip'
      }
    ]
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Quantum Measurement & State Collapse',
    subtitle: 'Wavefunction Collapse and Born Rule',
    iconName: 'Eye',
    duration: '12 mins',
    difficulty: 'Beginner',
    summary: 'Understand what happens when a quantum state meets classical observation.',
    description: 'Measuring a qubit destroys its superposition! According to the Born Rule, measurement projects the quantum statevector onto one of the basis vectors |0⟩ or |1⟩ with probability equal to the magnitude squared of its amplitude.',
    keyTakeaways: [
      'Measurement is non-reversible and collapses superposition.',
      'After measuring 0, the state permanently becomes |0⟩.',
      'Repeated measurements immediately following collapse yield the exact same outcome.'
    ],
    mathNotation: 'P(x) = |\\langle x | \\psi \\rangle|^2',
    interactiveType: 'circuit',
    quizQuestions: [
      {
        id: 'q4-1',
        question: 'What happens to a qubit in state (|0⟩+|1⟩)/√2 after it is measured and returns 1?',
        options: [
          'It stays in superposition',
          'It collapses permanently to |1⟩',
          'It collapses to |0⟩',
          'It dissipates completely'
        ],
        correctIndex: 1,
        explanation: 'Measurement causes irreversible wavefunction collapse to state |1⟩.',
        misconceptionId: 'misc-state-collapse'
      }
    ]
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Single-Qubit Gates (X, Y, Z, S, T)',
    subtitle: 'Pauli Rotations and Relative Phase',
    iconName: 'RotateCw',
    duration: '20 mins',
    difficulty: 'Intermediate',
    summary: 'Explore Pauli-X (NOT), Pauli-Y, Pauli-Z, S (Phase), and T gates.',
    description: 'Single-qubit gates rotate the state vector on the 3D Bloch sphere. The Pauli-X gate acts as a bit-flip (quantum NOT). Pauli-Z introduces a relative phase flip without altering measurement probabilities, while S and T gates perform smaller fractional phase rotations.',
    keyTakeaways: [
      'X gate: Quantum NOT (flips |0⟩ ↔ |1⟩).',
      'Z gate: Phase flip (maps |1⟩ ↦ -|1⟩).',
      'S gate: π/2 phase rotation; T gate: π/4 phase rotation.'
    ],
    mathNotation: 'X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\quad Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}',
    interactiveType: 'bloch',
    quizQuestions: [
      {
        id: 'q5-1',
        question: 'Which gate flips the phase of |1⟩ without changing measurement probabilities P(0) and P(1)?',
        options: ['X Gate', 'H Gate', 'Z Gate', 'CNOT Gate'],
        correctIndex: 2,
        explanation: 'Z gate maps α|0⟩ + β|1⟩ to α|0⟩ - β|1⟩, leaving probability magnitudes unchanged.'
      }
    ]
  },
  {
    id: 'mod-6',
    number: 6,
    title: 'Quantum Entanglement & CNOT Gate',
    subtitle: 'Creating Spooky Action with Bell States',
    iconName: 'Link',
    duration: '20 mins',
    difficulty: 'Intermediate',
    summary: 'Build Bell states and experience non-local quantum correlations.',
    description: 'Controlled gates like CNOT (Controlled-NOT) combine two qubits. When a Hadamard gate is applied to q0 and CNOT is controlled by q0 on q1, it generates the maximally entangled Bell state (|00⟩ + |11⟩)/√2. The state can no longer be decomposed into two separate single-qubit states.',
    keyTakeaways: [
      'CNOT flips target qubit if and only if control qubit is |1⟩.',
      'Bell State (|00⟩ + |11⟩)/√2 displays 100% measurement correlation.',
      'Entanglement is the core engine for quantum teleportation and cryptography.'
    ],
    mathNotation: '|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}',
    interactiveType: 'entanglement',
    defaultCircuit: {
      numQubits: 2,
      gates: [
        { id: 'g1', type: 'H', qubit: 0, step: 0 },
        { id: 'g2', type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 }
      ]
    },
    quizQuestions: [
      {
        id: 'q6-1',
        question: 'Which sequence of gates creates the Bell state (|00⟩ + |11⟩)/√2 starting from |00⟩?',
        options: [
          'H on q0, then H on q1',
          'H on q0, then CNOT(control=q0, target=q1)',
          'X on q0, then X on q1',
          'Z on q0, then CNOT(control=q0, target=q1)'
        ],
        correctIndex: 1,
        explanation: 'H on q0 creates superposition, and CNOT entangles q1 with q0.',
        misconceptionId: 'misc-entanglement-local'
      }
    ]
  },
  {
    id: 'mod-7',
    number: 7,
    title: 'Quantum Circuits & Multi-Qubit Systems',
    subtitle: 'Tensor Products and Matrix Composition',
    iconName: 'GitMerge',
    duration: '25 mins',
    difficulty: 'Intermediate',
    summary: 'Understand multi-qubit statevectors and circuit depth optimization.',
    description: 'An N-qubit quantum circuit operates in a 2ⁿ-dimensional complex vector space. Gates act as unitary matrices composed via Kronecker tensor products. Circuit depth measures the number of sequential gate steps required for execution.',
    keyTakeaways: [
      '2-qubit basis: |00⟩, |01⟩, |10⟩, |11⟩.',
      'Statevector size grows exponentially as 2ⁿ.',
      'Quantum parallelism evaluates 2ⁿ states in a single operation step.'
    ],
    mathNotation: '|\\psi_{total}\\rangle = |q_0\\rangle \\otimes |q_1\\rangle \\otimes \\dots \\otimes |q_{N-1}\\rangle',
    interactiveType: 'circuit',
    quizQuestions: [
      {
        id: 'q7-1',
        question: 'How many complex statevector entries are required to represent a 4-qubit quantum state?',
        options: ['4', '8', '16', '32'],
        correctIndex: 2,
        explanation: 'An N-qubit state requires 2ⁿ amplitudes. For N=4, 2⁴ = 16 entries.'
      }
    ]
  },
  {
    id: 'mod-8',
    number: 8,
    title: "Grover's Search Algorithm",
    subtitle: 'Quadratic Speedup for Unstructured Database Search',
    iconName: 'Search',
    duration: '30 mins',
    difficulty: 'Advanced',
    summary: 'Accelerate searching N items from O(N) to O(√N) using phase inversion and amplitude amplification.',
    description: "Grover's algorithm finds a marked item in an unsorted list of N items in O(√N) iterations. It uses a Quantum Oracle to flip the phase of the target state, followed by a Diffuser operator that amplifies the target state amplitude while suppressing unwanted states.",
    keyTakeaways: [
      'Quadratic speedup: O(N) classical vs O(√N) quantum.',
      'Oracle marks target state by flipping phase: |x⟩ ↦ -|x⟩.',
      'Diffuser amplifies probability amplitude of marked state.'
    ],
    mathNotation: 'U_{diff} = 2|s\\rangle\\langle s| - I \\quad \\text{where} \\quad |s\\rangle = H^{\\otimes n}|0\\rangle',
    interactiveType: 'circuit',
    quizQuestions: [
      {
        id: 'q8-1',
        question: "What is the classical vs quantum time complexity for searching an unsorted list of N items?",
        options: [
          'Classical O(N), Grover O(√N)',
          'Classical O(log N), Grover O(N)',
          'Classical O(N²), Grover O(N)',
          'Both are O(N)'
        ],
        correctIndex: 0,
        explanation: "Grover's algorithm provides a quadratic speedup of O(√N)."
      }
    ]
  },
  {
    id: 'mod-9',
    number: 9,
    title: 'Deutsch-Jozsa Algorithm',
    subtitle: 'Deterministic Quantum Speedup with 1 Query',
    iconName: 'Zap',
    duration: '25 mins',
    difficulty: 'Advanced',
    summary: 'Determine whether a function is constant or balanced in a single quantum evaluation.',
    description: 'The Deutsch-Jozsa algorithm determines if a black-box function f(x) is constant (returns 0 for all x or 1 for all x) or balanced (returns 0 for half the inputs and 1 for the other half). Classically this requires up to 2ⁿ⁻¹ + 1 evaluations; quantumly it requires exactly 1 query!',
    keyTakeaways: [
      'First algorithm demonstrating exponential quantum speedup over deterministic classical algorithms.',
      'Exploits destructive phase interference to cancel out non-constant function paths.',
      'Requires only 1 evaluation of the quantum oracle.'
    ],
    mathNotation: '|\\psi_f\\rangle = \\frac{1}{2^n} \\sum_{x} \\sum_{z} (-1)^{x \\cdot z + f(x)} |z\\rangle',
    interactiveType: 'circuit',
    quizQuestions: [
      {
        id: 'q9-1',
        question: 'How many function evaluations does the Deutsch-Jozsa algorithm require on a quantum computer?',
        options: ['1 query', '2ⁿ queries', '2ⁿ⁻¹ + 1 queries', 'N queries'],
        correctIndex: 0,
        explanation: 'Deutsch-Jozsa solves the problem deterministically in a single quantum query.'
      }
    ]
  },
  {
    id: 'mod-10',
    number: 10,
    title: 'Quantum Teleportation Protocol',
    subtitle: 'Transferring Quantum Information via Entanglement',
    iconName: 'Send',
    duration: '35 mins',
    difficulty: 'Advanced',
    summary: 'Transfer an unknown quantum state using Bell pairs and 2 classical bits.',
    description: 'Quantum Teleportation allows Alice to transmit an unknown qubit state |ψ⟩ to Bob using a pre-shared entangled Bell pair and 2 classical bits of communication. The original state at Alice is destroyed upon measurement in accordance with the No-Cloning Theorem.',
    keyTakeaways: [
      'Does NOT transmit faster than light (requires 2 classical bits).',
      'No-Cloning theorem: Original state |ψ⟩ is destroyed at Alice.',
      'Bob applies X and/or Z gates based on Alice’s 2 classical bit measurement.'
    ],
    mathNotation: '|\\psi\\rangle_A \\otimes |\\Phi^+\\rangle_{AB} \\xrightarrow{\\text{Bell Measurement}} \\text{Classical Bits } b_1 b_2 \\xrightarrow{\\text{Bob Gate }} X^{b_2} Z^{b_1} |\\psi\\rangle_B',
    interactiveType: 'circuit',
    quizQuestions: [
      {
        id: 'q10-1',
        question: 'Why does quantum teleportation NOT violate the speed of light limit?',
        options: [
          'It requires sending 2 classical bits through standard channels',
          'It only works inside a laboratory',
          'It uses faster-than-light particles',
          'It is purely theoretical'
        ],
        correctIndex: 0,
        explanation: 'Bob cannot reconstruct the teleported state until he receives Alice’s 2 classical bits.'
      }
    ]
  },
  {
    id: 'mod-11',
    number: 11,
    title: 'QAOA (Quantum Approximate Optimization Algorithm)',
    subtitle: 'Combinatorial Optimization & Max-Cut Solvers',
    iconName: 'Layers',
    duration: '30 mins',
    difficulty: 'Advanced',
    summary: 'Solve NP-hard combinatorial optimization problems using NISQ hybrid quantum-classical loops.',
    description: 'QAOA maps graph partitions (Max-Cut) into Problem and Mixer Hamiltonians. Parameterized unitary operations e^{-iγH_C} and e^{-iβH_M} are optimized iteratively using classical algorithms like COBYLA.',
    keyTakeaways: [
      'Hybrid quantum-classical algorithm designed for NISQ hardware.',
      'Alternates between Problem Cost Hamiltonian (γ) and Transverse Mixer (β).',
      'Scales to Max-Cut, Traveling Salesperson, and Portfolio Optimization.'
    ],
    mathNotation: '|\\gamma, \\beta\\rangle = e^{-i \\beta H_M} e^{-i \\gamma H_C} \\dots H^{\\otimes n}|0\\rangle',
    interactiveType: 'circuit',
    quizQuestions: [
      {
        id: 'q11-1',
        question: 'What is the role of the classical computer in QAOA?',
        options: [
          'Optimizing the variational parameters γ and β to minimize expected cost',
          'Generating the qubits',
          'Executing the quantum gate rotations',
          'Creating superposition'
        ],
        correctIndex: 0,
        explanation: 'QAOA uses classical optimization algorithms to update variational parameters.'
      }
    ]
  },
  {
    id: 'mod-12',
    number: 12,
    title: 'VQE (Variational Quantum Eigensolver)',
    subtitle: 'Quantum Chemistry & Molecular Ground State Simulation',
    iconName: 'Atom',
    duration: '35 mins',
    difficulty: 'Advanced',
    summary: 'Simulate molecular ground states and chemical bonding energies.',
    description: 'VQE applies the Rayleigh-Ritz variational principle: the energy expectation value ⟨Ψ(θ)|H|Ψ(θ)⟩ is bounded below by the true ground state energy. Quantum hardware evaluates energy while classical optimizers tune parameters θ.',
    keyTakeaways: [
      'Pioneering algorithm for quantum chemistry simulations on NISQ devices.',
      'Fermionic molecular Hamiltonians mapped to qubit Pauli strings via Jordan-Wigner.',
      'Guaranteed upper bound on ground state energy E₀.'
    ],
    mathNotation: '\\langle H \\rangle = \\frac{\\langle \\Psi(\\theta) | H | \\Psi(\\theta) \\rangle}{\\langle \\Psi(\\theta) | \\Psi(\\theta) \\rangle} \\ge E_0',
    interactiveType: 'circuit',
    quizQuestions: [
      {
        id: 'q12-1',
        question: 'According to the variational principle in VQE, any trial state energy E(θ) is always:',
        options: [
          'Greater than or equal to the true ground state energy E₀',
          'Less than the ground state energy E₀',
          'Exactly equal to 0',
          'Independent of θ'
        ],
        correctIndex: 0,
        explanation: 'The Rayleigh-Ritz principle states E(θ) ≥ E₀.'
      }
    ]
  }
];
