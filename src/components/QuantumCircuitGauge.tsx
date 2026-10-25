import React from 'react';
import { Layers, Disc, Sparkles, Sliders } from 'lucide-react';
import { FKM_CLUSTERS } from '../quantum/vqrEngine';

interface QuantumCircuitGaugeProps {
  qubitAngles: number[];
  qubitCount: 8 | 12;
  expectationZ: number;
  dispersion: number;
  activeClusterId: number;
  clusterMemberships: number[];
  onOpenModal: () => void;
}

export const QuantumCircuitGauge: React.FC<QuantumCircuitGaugeProps> = ({
  qubitAngles,
  qubitCount,
  expectationZ,
  dispersion,
  activeClusterId,
  clusterMemberships,
  onOpenModal,
}) => {
  const activeCluster = FKM_CLUSTERS[activeClusterId] || FKM_CLUSTERS[0];

  return (
    <div className="cockpit-panel p-4 flex flex-col justify-between relative overflow-hidden h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cockpit-border/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>VQC ENGINE & CLUSTERING</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
          <span>{qubitCount}-QUBIT VQC (L=4)</span>
        </div>
      </div>

      {/* Active Driving Cluster Badge */}
      <div className="p-2.5 rounded-xl bg-cockpit-darkest/70 border border-cockpit-border/60 my-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            FUZZY K-MEANS REGIME (K=6, m=2.0)
          </span>
          <span className="text-[10px] font-mono font-bold text-cyan-400">
            {((clusterMemberships[activeClusterId] || 0) * 100).toFixed(1)}% Match
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <div
            className="w-3 h-3 rounded-full shrink-0 shadow-sm animate-pulse"
            style={{ backgroundColor: activeCluster.color }}
          />
          <div className="font-semibold text-white text-xs truncate">
            {activeCluster.name}
          </div>
        </div>
        <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
          {activeCluster.description}
        </div>

        {/* Mini Fuzzy Membership Distribution Stack */}
        <div className="grid grid-cols-6 gap-1 mt-2 h-2 rounded overflow-hidden bg-slate-900 border border-slate-800">
          {FKM_CLUSTERS.map((c, idx) => {
            const membership = clusterMemberships[idx] || 0;
            return (
              <div
                key={c.id}
                className="h-full transition-all duration-200"
                style={{
                  backgroundColor: c.color,
                  opacity: Math.max(0.15, membership * 1.3),
                }}
                title={`${c.name}: ${(membership * 100).toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Live Interactive Quantum Circuit Grid */}
      <div className="space-y-1 my-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Disc className="w-3.5 h-3.5 text-cyan-400" />
            VQC ROTATIONS R_Y(θ) & R_Z(φ)
          </span>
          <button
            onClick={onOpenModal}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-mono flex items-center gap-0.5"
          >
            <Sliders className="w-3 h-3" />
            Inspect Gates
          </button>
        </div>

        {/* Qubit State Visualization Rows */}
        <div className="bg-cockpit-darkest/90 p-2.5 rounded-xl border border-cockpit-border/60 space-y-1.5">
          {Array.from({ length: Math.min(6, qubitCount) }).map((_, idx) => {
            const angle = qubitAngles[idx] || 0;
            // Probability |1> = sin^2(angle / 2)
            const probOne = Math.pow(Math.sin(angle / 2), 2);
            const probPercent = Math.round(probOne * 100);

            return (
              <div key={idx} className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-400 w-6">q[{idx}]</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  R_Y({(angle / Math.PI).toFixed(2)}π)
                </span>
                {/* Entanglement Line Connector */}
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-1.5 flex-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-150"
                      style={{ width: `${probPercent}%` }}
                    />
                  </div>
                </div>
                <span className="text-slate-300 w-8 text-right font-mono">
                  {probPercent}%
                </span>
              </div>
            );
          })}

          {qubitCount > 6 && (
            <div className="text-[10px] font-mono text-center text-slate-500 pt-0.5">
              + {qubitCount - 6} more qubits entangled in ring topology
            </div>
          )}
        </div>
      </div>

      {/* Quantum Expectation and Uncertainty Telemetry */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-cockpit-border/40 text-center font-mono">
        <div className="bg-cockpit-darkest/60 p-2 rounded-lg border border-cockpit-border/40">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            EXPECTATION ⟨Z⟩
          </div>
          <div className="text-sm font-bold text-cyan-300 mt-0.5">
            {expectationZ >= 0 ? `+${expectationZ.toFixed(3)}` : expectationZ.toFixed(3)}
          </div>
        </div>

        <div className="bg-cockpit-darkest/60 p-2 rounded-lg border border-cockpit-border/40">
          <div className="text-[10px] text-slate-400">
            UNCERTAINTY ΔZ
          </div>
          <div className="text-sm font-bold text-purple-300 mt-0.5">
            ±{dispersion.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
};
