import React, { useEffect, useRef } from 'react';
import type { NavigationPage } from '../types';
import { 
  ArrowRight, 
  Atom, 
  Cpu, 
  Sparkles, 
  Trophy, 
  Users, 
  Zap, 
  Play
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
    const colors = ['#22d3ee', '#c084fc', '#38bdf8', '#a855f7'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.18 - dist / 600})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const workflowSteps = [
    { title: 'Learn', desc: 'Master superposition, Bloch spheres & quantum gates through visual interactive cards.' },
    { title: 'Build', desc: 'Construct quantum circuits with drag-and-drop Hadamard, Pauli, and CNOT gates.' },
    { title: 'Simulate', desc: 'Execute real-time 2ⁿ statevector calculations and measurement probability distributions.' },
    { title: 'Explain', desc: 'Get circuit-aware AI mentor explanations and Dirac notation breakdowns.' },
    { title: 'Challenge', desc: 'Solve adaptive quantum problems to test state preparation and Bell entanglement.' },
    { title: 'Master', desc: 'Track skill growth with misconception detection and instructor insights.' },
  ];

  const capabilities = [
    { icon: Sparkles, title: 'AI Quantum Mentor', desc: 'Circuit-aware AI tutor that detects misconceptions and simplifies complex bra-ket math.' },
    { icon: Cpu, title: 'Quantum Circuit Studio', desc: 'Interactive N-qubit circuit editor with single-step execution and custom gate presets.' },
    { icon: Atom, title: '3D Bloch Sphere Visualizer', desc: 'Real-time 3D vector state rotation showing angles (θ, φ) and probability amplitudes.' },
    { icon: Zap, title: 'Learning Insight Engine', desc: 'Identifies recurring conceptual fallacies like state collapse confusion or H² cancellation.' },
    { icon: Trophy, title: 'Adaptive Challenges', desc: 'Gamified problem set with automated statevector verification, hints, and XP leveling.' },
    { icon: Users, title: 'Instructor Dashboard', desc: 'Aggregated analytics showing class progress, common misconceptions, and at-risk learners.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070a12] text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/10">
        
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-70 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/20 mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Smart India Hackathon 2024 — Problem Statement 26140</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-sans leading-tight max-w-4xl">
            Understand Quantum Computing.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Don’t Just Read About It.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            An AI-powered interactive laboratory that helps students learn, build, simulate, and master quantum algorithms.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('lab')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              <span>Enter Quantum Lab</span>
            </button>

            <button
              onClick={() => onNavigate('learn')}
              className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-6 py-3.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
            >
              <span>Explore Learning Path</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Live Preview Teaser Card */}
          <div className="mt-14 w-full max-w-4xl rounded-2xl border border-cyan-500/30 bg-[#0b1120]/90 p-4 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">QNova Studio — Bell State Entanglement</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">P(00) = 50% | P(11) = 50%</span>
            </div>

            <div className="py-6 flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-400 font-bold">q₀ |0⟩ ───</span>
                <span className="rounded-lg bg-cyan-500 text-slate-950 px-3 py-2 font-bold shadow-md">H</span>
                <span className="text-slate-400 font-bold">───●───</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-400 font-bold">q₁ |0⟩ ─────────</span>
                <span className="rounded-lg bg-emerald-500 text-slate-950 px-3 py-2 font-bold shadow-md">⊕</span>
                <span className="text-slate-400 font-bold">───</span>
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-3 text-left">
                <p className="text-[10px] text-cyan-400 uppercase font-bold">Wavefunction</p>
                <p className="text-xs font-mono font-bold text-white">|Ψ⁺⟩ = (|00⟩ + |11⟩)/√2</p>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Learning Workflow Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The QNova Learning Workflow
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              A structured loop designed to convert complex quantum theory into practical intuition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0b1120]/70 p-6 hover:border-cyan-500/40 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/30 text-xs font-bold text-cyan-400">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-500">Step {idx + 1} of 6</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Capabilities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950/40">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Key Platform Capabilities
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Combining quantum simulation, AI mentorship, and adaptive analytics into one unified laboratory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-[#0b1120]/90 p-6 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{cap.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="mx-auto max-w-4xl text-center rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 p-10 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Ready to Build Your First Quantum Circuit?
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto">
            Experience the interactive quantum studio, Bloch sphere visualizer, and AI quantum mentor.
          </p>
          <button
            onClick={() => onNavigate('lab')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-8 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20"
          >
            <Play className="h-4 w-4 fill-slate-950" />
            <span>Launch Quantum Lab Now</span>
          </button>
        </div>
      </section>

    </div>
  );
};
