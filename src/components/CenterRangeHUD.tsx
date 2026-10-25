import React from 'react';
import { 
  Cpu, 
  Battery, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { EVVehicle } from '../types';

interface CenterRangeHUDProps {
  vehicle: EVVehicle;
  socPercent: number;
  sohPercent: number;
  batteryTempC: number;
  rdrQmlKm: number;
  rdrConfidenceKm: number;
  rdrPhysicsKm: number;
  rdrAraiKm: number;
  lowSocPenaltyWeight: number;
  speedKmh: number;
  whPerKm: number;
}

export const CenterRangeHUD: React.FC<CenterRangeHUDProps> = ({
  vehicle,
  socPercent,
  sohPercent,
  batteryTempC,
  rdrQmlKm,
  rdrConfidenceKm,
  rdrPhysicsKm,
  rdrAraiKm,
  lowSocPenaltyWeight,
  speedKmh,
  whPerKm,
}) => {
  // Delta calculation: QML vs Physics vs ARAI
  const deltaPhysicsKm = Number((rdrQmlKm - rdrPhysicsKm).toFixed(1));
  const deltaAraiKm = Number((rdrQmlKm - rdrAraiKm).toFixed(1));

  // Time to empty estimation
  let timeToEmptyHours = 0;
  if (speedKmh > 5 && rdrQmlKm > 0) {
    timeToEmptyHours = rdrQmlKm / speedKmh;
  } else if (rdrQmlKm > 0) {
    // idle calculation
    timeToEmptyHours = (vehicle.batteryKwh * (socPercent / 100)) / 1.5;
  }
  const hours = Math.floor(timeToEmptyHours);
  const minutes = Math.floor((timeToEmptyHours - hours) * 60);

  // SOC color coding
  const isCriticalLowSoc = socPercent < 20;
  const isModerateLowSoc = socPercent >= 20 && socPercent < 45;

  let socColorClass = 'text-emerald-400';
  let socBgClass = 'bg-emerald-500';
  if (isCriticalLowSoc) {
    socColorClass = 'text-rose-500';
    socBgClass = 'bg-rose-500';
  } else if (isModerateLowSoc) {
    socColorClass = 'text-amber-400';
    socBgClass = 'bg-amber-400';
  }

  // Segment count for segmented battery bar (20 segments = 5% each)
  const totalSegments = 20;
  const activeSegments = Math.round((socPercent / 100) * totalSegments);

  return (
    <div className={`cockpit-panel-glow p-5 flex flex-col justify-between relative overflow-hidden h-full ${
      isCriticalLowSoc ? 'border-rose-500/70 critical-soc-pulse' : ''
    }`}>
      {/* Top Bar: Vehicle Architecture & State of Health */}
      <div className="flex items-center justify-between pb-2 border-b border-cockpit-border/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-semibold text-white tracking-wide">
            {vehicle.name}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {vehicle.architecture}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">SOH:</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {sohPercent}%
          </span>
        </div>
      </div>

      {/* Main Center Display: Giant Quantum Range vs Physics Range */}
      <div className="my-auto py-3 text-center">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 text-xs font-mono mb-2 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>FKM + POA-VQR PURE QUANTUM ESTIMATOR</span>
        </div>

        {/* Giant Digital Range */}
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-6xl lg:text-7xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-300 drop-shadow-lg">
            {rdrQmlKm.toFixed(0)}
          </span>
          <div className="text-left">
            <span className="text-xl font-mono font-bold text-cyan-400">KM</span>
            <div className="text-xs font-mono text-cyan-400/90 font-medium whitespace-nowrap">
              ± {rdrConfidenceKm.toFixed(1)} km (95% CI)
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 mt-1">
          REMAINING DRIVING RANGE (QUANTUM EXPECTATION)
        </div>

        {/* Comparative Range Triad (Physics vs ARAI vs QML Delta) */}
        <div className="grid grid-cols-3 gap-2 mt-4 px-2">
          {/* Physics Simulator Range */}
          <div className="bg-cockpit-darkest/70 p-2.5 rounded-xl border border-cockpit-border/60">
            <div className="text-[10px] text-slate-400 font-mono">PHYSICS RDR (EQ. 12)</div>
            <div className="text-lg font-mono font-bold text-sky-300 mt-0.5">
              {rdrPhysicsKm.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Delta: <span className={deltaPhysicsKm >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                {deltaPhysicsKm >= 0 ? `+${deltaPhysicsKm}` : deltaPhysicsKm} km
              </span>
            </div>
          </div>

          {/* ARAI Rated Theoretical Range */}
          <div className="bg-cockpit-darkest/70 p-2.5 rounded-xl border border-cockpit-border/60">
            <div className="text-[10px] text-slate-400 font-mono">ARAI PRO-RATA</div>
            <div className="text-lg font-mono font-bold text-slate-300 mt-0.5">
              {rdrAraiKm.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Delta: <span className="text-rose-400">{deltaAraiKm} km</span>
            </div>
          </div>

          {/* Battery Usable Energy */}
          <div className="bg-cockpit-darkest/70 p-2.5 rounded-xl border border-cockpit-border/60">
            <div className="text-[10px] text-slate-400 font-mono">USABLE ENERGY</div>
            <div className="text-lg font-mono font-bold text-amber-300 mt-0.5">
              {((vehicle.batteryKwh * (socPercent / 100))).toFixed(1)} <span className="text-xs font-normal text-slate-400">kWh</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Pack: {vehicle.batteryKwh} kWh
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Battery State of Charge Bar */}
      <div className="space-y-2 pt-2 border-t border-cockpit-border/40">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Battery className={`w-4 h-4 ${socColorClass}`} />
            <span className="text-slate-300 font-semibold">BATTERY SOC</span>
          </div>
          <span className={`text-base font-black ${socColorClass}`}>
            {socPercent.toFixed(1)}%
          </span>
        </div>

        {/* 20 Segments Visualizer */}
        <div className="grid grid-cols-20 gap-1 h-3.5 bg-slate-950 p-1 rounded-lg border border-cockpit-border">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isActive = idx < activeSegments;
            let segmentColor = 'bg-emerald-400';
            if (idx < 4) segmentColor = 'bg-rose-500';
            else if (idx < 9) segmentColor = 'bg-amber-400';

            return (
              <div
                key={idx}
                className={`h-full rounded-xs transition-all duration-300 ${
                  isActive ? `${segmentColor} shadow-sm` : 'bg-slate-800/60'
                }`}
              />
            );
          })}
        </div>

        {/* Context-Weighted Low-SOC Penalty Notification (Khekare & Vedaraj Eq. 4) */}
        {socPercent < 30 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
            <div className="font-mono text-[11px] leading-tight">
              <strong>Khekare & Vedaraj Eq. 4 Penalty Active:</strong> w(s) = {lowSocPenaltyWeight.toFixed(2)}x
              <span className="text-slate-300 ml-1">
                Conservative range scaling triggered to prevent highway stranding.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Auxiliary Telemetry (Pack Temp, Battery Chem, Time to Empty) */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-cockpit-border/50 text-center text-xs font-mono">
        <div className="bg-cockpit-darkest/50 p-2 rounded-lg border border-cockpit-border/30">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            PACK TEMP
          </div>
          <div className={`text-sm font-bold mt-0.5 ${
            batteryTempC > 40 ? 'text-rose-400' : batteryTempC < 15 ? 'text-sky-300' : 'text-emerald-300'
          }`}>
            {batteryTempC.toFixed(1)}°C
          </div>
        </div>

        <div className="bg-cockpit-darkest/50 p-2 rounded-lg border border-cockpit-border/30">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-sky-400" />
            TIME TO EMPTY
          </div>
          <div className="text-sm font-bold text-white mt-0.5">
            {hours}h {minutes.toString().padStart(2, '0')}m
          </div>
        </div>

        <div className="bg-cockpit-darkest/50 p-2 rounded-lg border border-cockpit-border/30">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            CHEMISTRY
          </div>
          <div className="text-xs font-bold text-slate-200 mt-0.5 truncate" title={vehicle.batteryChemistry}>
            {vehicle.batteryChemistry.split(' ')[0]}
          </div>
        </div>
      </div>
    </div>
  );
};
