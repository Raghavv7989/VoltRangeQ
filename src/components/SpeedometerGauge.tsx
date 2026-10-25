import React from 'react';
import { Zap, Gauge as GaugeIcon, Activity, BatteryCharging } from 'lucide-react';

interface SpeedometerGaugeProps {
  speedKmh: number;
  powerKw: number;
  maxMotorPowerKw: number;
  motorRpm: number;
  currentA: number;
  terminalVoltageV: number;
  whPerKm: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  speedKmh,
  powerKw,
  maxMotorPowerKw,
  motorRpm,
  currentA,
  terminalVoltageV,
  whPerKm,
}) => {
  // Speedometer circular gauge math (240 degree sweep: from 150 deg to 390 deg)
  const maxSpeed = 200;
  const clampedSpeed = Math.min(maxSpeed, Math.max(0, speedKmh));
  const speedAngle = 150 + (clampedSpeed / maxSpeed) * 240; // 150 to 390 deg

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const backgroundArc = describeArc(150, 150, 115, 150, 390);
  const activeArc = describeArc(150, 150, 115, 150, Math.max(151, speedAngle));

  // Power bar percentage: -30kW to maxMotorPowerKw (or 120kW)
  const isRegen = powerKw < 0;
  const regenPercent = isRegen ? Math.min(100, (Math.abs(powerKw) / 35) * 100) : 0;
  const powerPercent = !isRegen ? Math.min(100, (powerKw / Math.max(100, maxMotorPowerKw)) * 100) : 0;

  return (
    <div className="cockpit-panel p-4 flex flex-col justify-between relative overflow-hidden h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cockpit-border/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <GaugeIcon className="w-4 h-4 text-cyan-400" />
          <span>POWERTRAIN DYNAMICS</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>10 Hz TELEMETRY</span>
        </div>
      </div>

      {/* Main Circular Speed Dial */}
      <div className="relative flex items-center justify-center py-2">
        <svg viewBox="0 0 300 300" className="w-56 h-56 transform drop-shadow-lg">
          <defs>
            <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="needleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="#1a2333"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Speed Ticks */}
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map((val) => {
            const angle = 150 + (val / maxSpeed) * 240;
            const pt1 = polarToCartesian(150, 150, 128, angle);
            const pt2 = polarToCartesian(150, 150, 120, angle);
            const textPt = polarToCartesian(150, 150, 96, angle);
            return (
              <g key={val}>
                <line
                  x1={pt1.x}
                  y1={pt1.y}
                  x2={pt2.x}
                  y2={pt2.y}
                  stroke="#334155"
                  strokeWidth={val % 40 === 0 ? '2' : '1'}
                />
                {val % 40 === 0 && (
                  <text
                    x={textPt.x}
                    y={textPt.y + 3}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    {val}
                  </text>
                )}
              </g>
            );
          })}

          {/* Glowing Speed Arc */}
          <path
            d={activeArc}
            fill="none"
            stroke="url(#speedGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.6))',
              transition: 'all 0.15s ease-out',
            }}
          />

          {/* Center Hub */}
          <circle cx="150" cy="150" r="42" fill="#0c1017" stroke="#1f293d" strokeWidth="2" />
        </svg>

        {/* Speed Digital Readout in Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-black font-mono tracking-tighter text-white drop-shadow">
            {Math.round(clampedSpeed)}
          </span>
          <span className="text-[11px] font-mono tracking-widest text-cyan-400 font-semibold uppercase">
            KM / H
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {motorRpm.toLocaleString()} RPM
          </span>
        </div>
      </div>

      {/* Instantaneous Power & Regen Bar */}
      <div className="space-y-1.5 px-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400 flex items-center gap-1">
            {isRegen ? (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            )}
            {isRegen ? 'REGEN HARVEST' : 'POWER DRAW'}
          </span>
          <span
            className={`font-mono font-bold ${
              isRegen ? 'text-emerald-400' : powerKw > 70 ? 'text-rose-400' : 'text-cyan-300'
            }`}
          >
            {powerKw >= 0 ? `+${powerKw.toFixed(1)}` : powerKw.toFixed(1)} kW
          </span>
        </div>

        {/* Dual Split Power/Regen Meter */}
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-cockpit-border p-0.5">
          {/* Regen Side (Left) */}
          <div className="w-1/3 flex justify-end items-center pr-0.5 border-r border-slate-700">
            <div
              className="h-full bg-gradient-to-l from-emerald-400 to-teal-500 rounded-sm transition-all duration-150"
              style={{ width: `${regenPercent}%` }}
            />
          </div>
          {/* Traction Power Side (Right) */}
          <div className="w-2/3 flex items-center pl-0.5">
            <div
              className={`h-full rounded-sm transition-all duration-150 ${
                powerPercent > 70
                  ? 'bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${powerPercent}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-slate-500">
          <span>-35 kW (Regen)</span>
          <span>0 kW</span>
          <span>+{Math.round(maxMotorPowerKw)} kW</span>
        </div>
      </div>

      {/* High-frequency Electrical Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-cockpit-border/50 text-center">
        <div className="bg-cockpit-darkest/60 p-2 rounded-lg border border-cockpit-border/40">
          <div className="text-[10px] text-slate-400 font-mono">VOLTAGE</div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">
            {terminalVoltageV.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">V</span>
          </div>
        </div>

        <div className="bg-cockpit-darkest/60 p-2 rounded-lg border border-cockpit-border/40">
          <div className="text-[10px] text-slate-400 font-mono">CURRENT</div>
          <div className={`text-sm font-mono font-bold mt-0.5 ${currentA < 0 ? 'text-emerald-400' : 'text-white'}`}>
            {currentA.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">A</span>
          </div>
        </div>

        <div className="bg-cockpit-darkest/60 p-2 rounded-lg border border-cockpit-border/40">
          <div className="text-[10px] text-slate-400 font-mono">EFFICIENCY</div>
          <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
            {Math.round(whPerKm)} <span className="text-[10px] font-normal text-slate-400">Wh/km</span>
          </div>
        </div>
      </div>
    </div>
  );
};
