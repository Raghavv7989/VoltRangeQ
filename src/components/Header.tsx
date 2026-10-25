import React from 'react';
import { EVVehicle, DriveMode, RegenLevel, DrivingCycle } from '../types';
import { INDIAN_EV_FLEET } from '../data/evFleet';
import { INDIAN_DRIVING_CYCLES } from '../data/drivingCycles';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Gauge, 
  BarChart3, 
  FileText, 
  Compass,
  Layers
} from 'lucide-react';

interface HeaderProps {
  currentVehicle: EVVehicle;
  onSelectVehicle: (v: EVVehicle) => void;
  currentCycle: DrivingCycle;
  onSelectCycle: (c: DrivingCycle) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onResetSimulate: () => void;
  simSpeedMultiplier: number;
  onChangeSimSpeed: (speed: number) => void;
  driveMode: DriveMode;
  onChangeDriveMode: (mode: DriveMode) => void;
  regenLevel: RegenLevel;
  onChangeRegenLevel: (level: RegenLevel) => void;
  activeTab: 'cockpit' | 'benchmarks' | 'export';
  onChangeTab: (tab: 'cockpit' | 'benchmarks' | 'export') => void;
  onOpenCircuitModal: () => void;
  qubitCount: 8 | 12;
  onChangeQubitCount: (q: 8 | 12) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentVehicle,
  onSelectVehicle,
  currentCycle,
  onSelectCycle,
  isSimulating,
  onToggleSimulate,
  onResetSimulate,
  simSpeedMultiplier,
  onChangeSimSpeed,
  driveMode,
  onChangeDriveMode,
  regenLevel,
  onChangeRegenLevel,
  activeTab,
  onChangeTab,
  onOpenCircuitModal,
  qubitCount,
  onChangeQubitCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-cockpit-darkest/90 backdrop-blur-md border-b border-cockpit-border px-4 lg:px-6 py-3">
      {/* Top Title & System Badges */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-cockpit-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center shadow-glow-cyan">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0 flex items-center gap-2">
                Q-RangeEV
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                  FKM + POA-VQR Pure QML
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Pure Quantum Machine Learning & Physics-Based EV Driving Range Estimator • IEEE/Springer Research Workbench
            </p>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-cockpit-card/90 p-1 rounded-xl border border-cockpit-border w-full lg:w-auto overflow-x-auto">
          <button
            onClick={() => onChangeTab('cockpit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'cockpit'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Gauge className="w-4 h-4" />
            Digital Cockpit
          </button>

          <button
            onClick={() => onChangeTab('benchmarks')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'benchmarks'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Research Benchmarks
          </button>

          <button
            onClick={() => onChangeTab('export')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'export'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Conference Exporter
          </button>

          <button
            onClick={onOpenCircuitModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 transition-all ml-1"
            title="Inspect 8-Qubit / 12-Qubit Quantum Circuit Gates"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>VQC Gates</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Vehicle, Cycle, Simulation, Mode & Regen */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        {/* Left: Indian EV Fleet Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            EV Fleet:
          </span>
          <select
            value={currentVehicle.id}
            onChange={(e) => {
              const found = INDIAN_EV_FLEET.find(v => v.id === e.target.value);
              if (found) onSelectVehicle(found);
            }}
            className="bg-cockpit-card text-white border border-cockpit-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-cyan-400 focus:outline-none"
          >
            {INDIAN_EV_FLEET.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.batteryKwh} kWh • ARAI {v.araiRangeKm} km)
              </option>
            ))}
          </select>
        </div>

        {/* Center: Indian Driving Cycle Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            Drive Cycle:
          </span>
          <select
            value={currentCycle.id}
            onChange={(e) => {
              const found = INDIAN_DRIVING_CYCLES.find(c => c.id === e.target.value);
              if (found) onSelectCycle(found);
            }}
            className="bg-cockpit-card text-white border border-cockpit-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-sky-400 focus:outline-none"
          >
            {INDIAN_DRIVING_CYCLES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Simulation Controls & Drive Mode / Regen */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sim Speed */}
          <div className="flex items-center gap-1 bg-cockpit-card px-2 py-1 rounded-lg border border-cockpit-border">
            <span className="text-[10px] text-slate-400 font-mono">Speed:</span>
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSimSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  simSpeedMultiplier === s
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Auto Drive Simulation Play / Pause Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSimulate}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-all ${
                isSimulating
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-glow-emerald'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Sim</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto Drive</span>
                </>
              )}
            </button>

            <button
              onClick={onResetSimulate}
              className="p-1.5 rounded-lg bg-cockpit-card border border-cockpit-border text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset Simulation State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Drive Mode Selector */}
          <div className="flex items-center gap-1 bg-cockpit-card p-1 rounded-lg border border-cockpit-border">
            {(['eco', 'city', 'sport'] as DriveMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onChangeDriveMode(mode)}
                className={`px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  driveMode === mode
                    ? mode === 'eco'
                      ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                      : mode === 'sport'
                      ? 'bg-rose-500/30 text-rose-400 border border-rose-500/50'
                      : 'bg-sky-500/30 text-sky-400 border border-sky-500/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Regen Level Selector */}
          <div className="flex items-center gap-1 bg-cockpit-card p-1 rounded-lg border border-cockpit-border">
            {(['L1', 'L2', 'L3'] as RegenLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChangeRegenLevel(lvl)}
                className={`px-1.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  regenLevel === lvl
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Regenerative Braking Level ${lvl}`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Qubit count toggle */}
          <div className="flex items-center gap-1 bg-cockpit-card px-1.5 py-1 rounded-lg border border-cockpit-border">
            <span className="text-[10px] text-slate-400 font-mono">Qubits:</span>
            {([8, 12] as (8 | 12)[]).map((q) => (
              <button
                key={q}
                onClick={() => onChangeQubitCount(q)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  qubitCount === q
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {q}Q
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
