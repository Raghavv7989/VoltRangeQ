import React, { useState } from 'react';
import { X, Layers, Cpu, Sparkles, Disc, Activity } from 'lucide-react';

interface QuantumCircuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  qubitAngles: number[];
  qubitCount: 8 | 12;
  expectationZ: number;
  dispersion: number;
}

export const QuantumCircuitModal: React.FC<QuantumCircuitModalProps> = ({
  isOpen,
  onClose,
  qubitAngles,
  qubitCount,
  expectationZ,
  dispersion,
}) => {
  const [selectedQubit, setSelectedQubit] = useState<number>(0);

  if (!isOpen) return null;

  // Selected Qubit angle
  const angle = qubitAngles[selectedQubit] || 0;
  // Bloch sphere coordinates:
  // |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩
  // x = sin(θ)cos(φ), y = sin(θ)sin(φ), z = cos(θ)
  const theta = angle;
  const phi = (angle * 1.5) % (2 * Math.PI);
  const blochX = Math.sin(theta) * Math.cos(phi);
  const blochY = Math.sin(theta) * Math.sin(phi);
  const blochZ = Math.cos(theta);

  // 2D projection on SVG canvas (center 100, 100, radius 70)
  const cx = 100;
  const cy = 100;
  const r = 70;
  // Isometric slant
  const projX = cx + r * (blochX * 0.85 - blochY * 0.4);
  const projY = cy - r * (blochZ * 0.85 + blochY * 0.3);

  const probZero = Math.pow(Math.cos(theta / 2), 2);
  const probOne = Math.pow(Math.sin(theta / 2), 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-cockpit-card border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-cockpit-border/60 bg-cockpit-darkest/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-300">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Pure Variational Quantum Circuit (VQC) Inspector
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {qubitCount}-Qubit • L=4 Layers
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pathfinder-Optimized Single-Qubit Rotations U3(θ, φ, λ) & Circular CNOT Entanglement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Top Triad: Bloch Sphere, State Readout, Entanglement Map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Bloch Sphere Visualizer */}
            <div className="bg-cockpit-darkest p-4 rounded-xl border border-cockpit-border flex flex-col items-center justify-center">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                <Disc className="w-4 h-4 text-cyan-400" />
                <span>BLOCH SPHERE: q[{selectedQubit}]</span>
              </div>

              <svg viewBox="0 0 200 200" className="w-44 h-44">
                <defs>
                  <radialGradient id="sphereGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                  </radialGradient>
                </defs>

                {/* Sphere outline & fill */}
                <circle cx={cx} cy={cy} r={r} fill="url(#sphereGrad)" stroke="#334155" strokeWidth="1.5" />
                
                {/* Equator ellipse */}
                <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.35} fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Meridian ellipse */}
                <ellipse cx={cx} cy={cy} rx={r * 0.35} ry={r} fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

                {/* Axes */}
                <line x1={cx} y1={cy - r - 8} x2={cx} y2={cy + r + 8} stroke="#64748b" strokeWidth="1" />
                <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="#64748b" strokeWidth="1" />

                {/* Poles labels */}
                <text x={cx} y={cy - r - 10} fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">|0⟩</text>
                <text x={cx} y={cy + r + 18} fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">|1⟩</text>

                {/* State Vector Arrow */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={projX}
                  y2={projY}
                  stroke="#00f2fe"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx={projX} cy={projY} r="4.5" fill="#ffffff" stroke="#00f2fe" strokeWidth="2" />
              </svg>

              <div className="text-[11px] font-mono text-slate-300 mt-2 text-center">
                θ = {(theta / Math.PI).toFixed(3)}π rad | φ = {(phi / Math.PI).toFixed(3)}π rad
              </div>
            </div>

            {/* 2. Quantum Probability Projection */}
            <div className="bg-cockpit-darkest p-4 rounded-xl border border-cockpit-border flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>COMPUTATIONAL BASIS STATE</span>
                </div>

                <div className="space-y-3 mt-3">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-cyan-400">P(|0⟩) Ground</span>
                      <span className="font-bold text-white">{(probZero * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all duration-200" style={{ width: `${probZero * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-rose-400">P(|1⟩) Excited</span>
                      <span className="font-bold text-white">{(probOne * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 transition-all duration-200" style={{ width: `${probOne * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>⟨Z⟩ Expectation:</span>
                  <span className="text-cyan-300 font-bold">{expectationZ.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dispersion ΔZ:</span>
                  <span className="text-purple-300 font-bold">±{dispersion.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* 3. Qubit Selection Buttons */}
            <div className="bg-cockpit-darkest p-4 rounded-xl border border-cockpit-border flex flex-col justify-between">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>SELECT ACTIVE QUBIT</span>
              </div>

              <div className="grid grid-cols-4 gap-2 my-2">
                {Array.from({ length: qubitCount }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedQubit(idx)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedQubit === idx
                        ? 'bg-cyan-500 text-black shadow-glow-cyan'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    q[{idx}]
                  </button>
                ))}
              </div>

              <div className="text-[10px] font-mono text-slate-400 text-center">
                Click any qubit to inspect live angle embeddings and Bloch vector
              </div>
            </div>
          </div>

          {/* Full Multi-Layer Quantum Gate Circuit Diagram */}
          <div className="bg-cockpit-darkest p-4 rounded-xl border border-cockpit-border">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-cockpit-border/40">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Full Quantum Gate Circuit Schematic (Layer 1 of 4)
              </span>
              <span className="text-[10px] font-mono text-purple-400">
                Strongly Entangling Topology: CNOT Ring + U3
              </span>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[650px] space-y-2 font-mono text-xs">
                {Array.from({ length: qubitCount }).map((_, i) => {
                  const qAngle = qubitAngles[i] || 0;
                  const nextQubit = (i + 1) % qubitCount;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-slate-400 w-10 shrink-0 font-bold">q[{i}]</span>
                      
                      {/* Wire start */}
                      <div className="h-0.5 w-6 bg-slate-700" />

                      {/* State prep |0> */}
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                        |0⟩
                      </span>

                      <div className="h-0.5 w-4 bg-slate-700" />

                      {/* R_Y Gate */}
                      <span className="px-2 py-1 rounded bg-cyan-950 border border-cyan-700 text-[10px] text-cyan-300 font-semibold shadow-sm">
                        R_Y({(qAngle / Math.PI).toFixed(2)}π)
                      </span>

                      <div className="h-0.5 w-4 bg-slate-700" />

                      {/* R_Z Gate */}
                      <span className="px-2 py-1 rounded bg-sky-950 border border-sky-700 text-[10px] text-sky-300 font-semibold shadow-sm">
                        R_Z({((qAngle * 1.2) / Math.PI).toFixed(2)}π)
                      </span>

                      <div className="h-0.5 w-4 bg-slate-700" />

                      {/* CNOT Entangler Gate */}
                      <span className="px-2 py-1 rounded bg-purple-950 border border-purple-700 text-[10px] text-purple-300 font-semibold flex items-center gap-1">
                        ●──⊕ q[{nextQubit}]
                      </span>

                      <div className="h-0.5 w-4 bg-slate-700" />

                      {/* Parameterized U3 Gate */}
                      <span className="px-2 py-1 rounded bg-indigo-950 border border-indigo-700 text-[10px] text-indigo-300 font-semibold">
                        U3(θ, φ, λ)
                      </span>

                      <div className="h-0.5 flex-1 bg-slate-700" />

                      {/* Measurement Gate */}
                      <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-700 text-[10px] text-emerald-300 font-bold">
                        ⟨Z⟩ Readout
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
