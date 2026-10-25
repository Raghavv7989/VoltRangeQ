import React from 'react';
import { HvacLevel } from '../types';
import { 
  Gauge, 
  Battery, 
  Mountain, 
  Thermometer, 
  AirVent, 
  Users, 
  CircleDot,
  RotateCcw
} from 'lucide-react';

interface PhysicsControlDeckProps {
  speedKmh: number;
  onChangeSpeed: (val: number) => void;
  socPercent: number;
  onChangeSoc: (val: number) => void;
  roadGradientPercent: number;
  onChangeGradient: (val: number) => void;
  ambientTempC: number;
  onChangeTemp: (val: number) => void;
  hvacLevel: HvacLevel;
  onChangeHvac: (val: HvacLevel) => void;
  payloadKg: number;
  onChangePayload: (val: number) => void;
  tirePressurePsi: number;
  onChangeTirePressure: (val: number) => void;
  onResetControls: () => void;
}

export const PhysicsControlDeck: React.FC<PhysicsControlDeckProps> = ({
  speedKmh,
  onChangeSpeed,
  socPercent,
  onChangeSoc,
  roadGradientPercent,
  onChangeGradient,
  ambientTempC,
  onChangeTemp,
  hvacLevel,
  onChangeHvac,
  payloadKg,
  onChangePayload,
  tirePressurePsi,
  onChangeTirePressure,
  onResetControls,
}) => {
  return (
    <div className="cockpit-panel p-4">
      {/* Deck Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cockpit-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Physics Simulator & Environmental Stressors
          </span>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            Directly alters instantaneous resistive forces & thermal derating
          </span>
        </div>
        <button
          onClick={onResetControls}
          className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        {/* 1. Vehicle Speed Slider */}
        <div className="bg-cockpit-darkest/60 p-3 rounded-xl border border-cockpit-border/40">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              Speed (v)
            </span>
            <span className="font-bold text-white text-sm">
              {Math.round(speedKmh)} <span className="text-[10px] font-normal text-slate-400">km/h</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="160"
            step="1"
            value={speedKmh}
            onChange={(e) => onChangeSpeed(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span>0 km/h</span>
            <span>80 km/h</span>
            <span>160 km/h</span>
          </div>
        </div>

        {/* 2. Battery SOC Slider */}
        <div className="bg-cockpit-darkest/60 p-3 rounded-xl border border-cockpit-border/40">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              Battery SOC
            </span>
            <span className={`font-bold text-sm ${
              socPercent < 20 ? 'text-rose-400' : socPercent < 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {socPercent.toFixed(0)} <span className="text-[10px] font-normal text-slate-400">%</span>
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="1"
            value={socPercent}
            onChange={(e) => onChangeSoc(Number(e.target.value))}
            className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span className="text-rose-400">5% Critical</span>
            <span>50%</span>
            <span className="text-emerald-400">100%</span>
          </div>
        </div>

        {/* 3. Road Gradient Slider */}
        <div className="bg-cockpit-darkest/60 p-3 rounded-xl border border-cockpit-border/40">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Mountain className="w-3.5 h-3.5 text-purple-400" />
              Road Gradient (θ)
            </span>
            <span className={`font-bold text-sm ${
              roadGradientPercent > 0 ? 'text-purple-300' : roadGradientPercent < 0 ? 'text-cyan-300' : 'text-slate-300'
            }`}>
              {roadGradientPercent > 0 ? `+${roadGradientPercent}` : roadGradientPercent} <span className="text-[10px] font-normal text-slate-400">%</span>
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="0.5"
            value={roadGradientPercent}
            onChange={(e) => onChangeGradient(Number(e.target.value))}
            className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span>-15% (Downhill)</span>
            <span>0%</span>
            <span>+15% (Ghat Incline)</span>
          </div>
        </div>

        {/* 4. Ambient Temperature Slider */}
        <div className="bg-cockpit-darkest/60 p-3 rounded-xl border border-cockpit-border/40">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Ambient Temp (T_amb)
            </span>
            <span className={`font-bold text-sm ${
              ambientTempC > 38 ? 'text-rose-400' : ambientTempC < 15 ? 'text-sky-300' : 'text-emerald-300'
            }`}>
              {ambientTempC} <span className="text-[10px] font-normal text-slate-400">°C</span>
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="48"
            step="1"
            value={ambientTempC}
            onChange={(e) => onChangeTemp(Number(e.target.value))}
            className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span className="text-sky-400">5°C Winter</span>
            <span className="text-emerald-400">27°C Peak</span>
            <span className="text-rose-400">48°C Heatwave</span>
          </div>
        </div>

        {/* 5. AC/HVAC Level */}
        <div className="bg-cockpit-darkest/60 p-3 rounded-xl border border-cockpit-border/40">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-slate-400">
              <AirVent className="w-3.5 h-3.5 text-sky-400" />
              HVAC Climate
            </span>
            <span className="text-[10px] font-semibold text-sky-300 uppercase">
              {hvacLevel.replace('_', ' ')}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(['off', 'eco', 'max_cool'] as HvacLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChangeHvac(lvl)}
                className={`py-1 rounded text-[10px] font-bold uppercase transition-all ${
                  hvacLevel === lvl
                    ? 'bg-sky-500 text-black shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'max_cool' ? 'Max' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Payload Slider */}
        <div className="bg-cockpit-darkest/60 p-3 rounded-xl border border-cockpit-border/40">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Payload (Passengers+Cargo)
            </span>
            <span className="font-bold text-white text-sm">
              {payloadKg} <span className="text-[10px] font-normal text-slate-400">kg</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="400"
            step="20"
            value={payloadKg}
            onChange={(e) => onChangePayload(Number(e.target.value))}
            className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span>0 kg (Solo)</span>
            <span>200 kg</span>
            <span>400 kg (Full)</span>
          </div>
        </div>

        {/* 7. Tire Pressure */}
        <div className="bg-cockpit-darkest/60 p-3 rounded-xl border border-cockpit-border/40">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CircleDot className="w-3.5 h-3.5 text-teal-400" />
              Tire Pressure
            </span>
            <span className={`font-bold text-sm ${tirePressurePsi < 30 ? 'text-amber-400' : 'text-teal-300'}`}>
              {tirePressurePsi} <span className="text-[10px] font-normal text-slate-400">PSI</span>
            </span>
          </div>
          <input
            type="range"
            min="25"
            max="40"
            step="1"
            value={tirePressurePsi}
            onChange={(e) => onChangeTirePressure(Number(e.target.value))}
            className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span className="text-amber-400">25 PSI (Low)</span>
            <span className="text-emerald-400">33 PSI</span>
            <span>40 PSI</span>
          </div>
        </div>

        {/* 8. Quick Stress Preset Buttons */}
        <div className="bg-cockpit-darkest/60 p-3 rounded-xl border border-cockpit-border/40 flex flex-col justify-between">
          <div className="text-[11px] text-slate-400 font-bold uppercase">
            Stress Test Presets
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <button
              onClick={() => {
                onChangeTemp(45);
                onChangeHvac('max_cool');
                onChangeSpeed(90);
                onChangeGradient(1);
              }}
              className="px-2 py-1 bg-rose-950/70 border border-rose-800/80 rounded text-[10px] text-rose-300 hover:bg-rose-900/80 font-semibold"
            >
              Summer Heat 45°C
            </button>
            <button
              onClick={() => {
                onChangeTemp(8);
                onChangeGradient(8);
                onChangeSpeed(42);
                onChangePayload(300);
              }}
              className="px-2 py-1 bg-purple-950/70 border border-purple-800/80 rounded text-[10px] text-purple-300 hover:bg-purple-900/80 font-semibold"
            >
              Himalaya Ghat +8%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
