import React, { useState, useEffect, useRef } from 'react';
import { EVVehicle, DriveMode, RegenLevel, HvacLevel, DrivingCycle } from './types';
import { INDIAN_EV_FLEET } from './data/evFleet';
import { INDIAN_DRIVING_CYCLES } from './data/drivingCycles';
import { calculatePhysicsStep, PhysicsInput } from './physics/engine';
import { evaluateQuantumVqr } from './quantum/vqrEngine';
import { Header } from './components/Header';
import { DigitalCockpitTab } from './components/DigitalCockpitTab';
import { ResearchBenchmarkTab } from './components/ResearchBenchmarkTab';
import { PaperExportTab } from './components/PaperExportTab';
import { QuantumCircuitModal } from './components/QuantumCircuitModal';
import { TelemetryHistoryPoint } from './components/LiveTelemetryChart';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'cockpit' | 'benchmarks' | 'export'>('cockpit');
  const [isCircuitModalOpen, setIsCircuitModalOpen] = useState<boolean>(false);

  // Active Vehicle & Driving Cycle
  const [currentVehicle, setCurrentVehicle] = useState<EVVehicle>(INDIAN_EV_FLEET[0]);
  const [currentCycle, setCurrentCycle] = useState<DrivingCycle>(INDIAN_DRIVING_CYCLES[0]);

  // Simulation Controls
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(1);
  const [simTimeSec, setSimTimeSec] = useState<number>(0);

  // Driving & Physics Controls
  const [speedKmh, setSpeedKmh] = useState<number>(45);
  const [socPercent, setSocPercent] = useState<number>(85);
  const [sohPercent] = useState<number>(98.5);
  const [roadGradientPercent, setRoadGradientPercent] = useState<number>(0);
  const [ambientTempC, setAmbientTempC] = useState<number>(32);
  const [batteryTempC, setBatteryTempC] = useState<number>(31.5);
  const [payloadKg, setPayloadKg] = useState<number>(150);
  const [tirePressurePsi, setTirePressurePsi] = useState<number>(33);
  const [hvacLevel, setHvacLevel] = useState<HvacLevel>('eco');
  const [driveMode, setDriveMode] = useState<DriveMode>('city');
  const [regenLevel, setRegenLevel] = useState<RegenLevel>('L2');
  const [qubitCount, setQubitCount] = useState<8 | 12>(8);

  // History for live telemetry tracking chart
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryHistoryPoint[]>([]);

  // Simulation step reference for cycle interpolation
  const cycleIndexRef = useRef<number>(0);

  // Reset controls to vehicle defaults
  const handleResetControls = () => {
    setSpeedKmh(45);
    setSocPercent(85);
    setRoadGradientPercent(0);
    setAmbientTempC(32);
    setBatteryTempC(31.5);
    setPayloadKg(150);
    setTirePressurePsi(33);
    setHvacLevel('eco');
    setDriveMode('city');
    setRegenLevel('L2');
    setSimTimeSec(0);
  };

  // Perform one physics calculation step
  const physicsOutput = calculatePhysicsStep({
    vehicle: currentVehicle,
    speedKmh,
    accelerationMps2: 0,
    roadGradientPercent,
    ambientTempC,
    socPercent,
    payloadKg,
    tirePressurePsi,
    hvacLevel,
    driveMode,
    regenLevel,
    batteryTempC,
  });

  // Evaluate Pure Quantum Machine Learning
  const qmlOutput = evaluateQuantumVqr(
    currentVehicle,
    socPercent,
    speedKmh,
    physicsOutput.currentA,
    physicsOutput.terminalVoltageV,
    ambientTempC,
    roadGradientPercent,
    physicsOutput.rdrPhysicsKm,
    qubitCount
  );

  // 10 Hz Simulation Engine Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimTimeSec((prevTime) => {
        const nextTime = prevTime + 0.1 * simSpeedMultiplier;

        // Interpolate along current Driving Cycle
        const cyclePoints = currentCycle.points;
        const totalDuration = currentCycle.totalDurationSec;
        const normalizedCycleTime = nextTime % totalDuration;

        // Find nearest cycle segment
        let targetSpeed = 45;
        let targetGrad = 0;
        for (let i = 0; i < cyclePoints.length - 1; i++) {
          if (
            normalizedCycleTime >= cyclePoints[i].timeSec &&
            normalizedCycleTime <= cyclePoints[i + 1].timeSec
          ) {
            const p1 = cyclePoints[i];
            const p2 = cyclePoints[i + 1];
            const ratio = (normalizedCycleTime - p1.timeSec) / (p2.timeSec - p1.timeSec);
            targetSpeed = p1.speedKmh + (p2.speedKmh - p1.speedKmh) * ratio;
            targetGrad = p1.gradientPercent + (p2.gradientPercent - p1.gradientPercent) * ratio;
            break;
          }
        }

        // Smoothly approach target speed and gradient
        setSpeedKmh((prevSpeed) => {
          const delta = (targetSpeed - prevSpeed) * 0.15;
          return Math.max(0, Math.min(160, prevSpeed + delta));
        });

        setRoadGradientPercent((prevGrad) => {
          const delta = (targetGrad - prevGrad) * 0.15;
          return Number((prevGrad + delta).toFixed(1));
        });

        // Deplete SOC smoothly based on instantaneous power demand
        setSocPercent((prevSoc) => {
          // energy in kWh = (power in kW * time in hr)
          const energyUsedKwh = (physicsOutput.powerTotalKw * (0.1 * simSpeedMultiplier / 3600));
          const socDeltaPercent = (energyUsedKwh / currentVehicle.batteryKwh) * 100;
          const nextSoc = Math.max(5, Math.min(100, prevSoc - socDeltaPercent));
          return Number(nextSoc.toFixed(2));
        });

        // Battery temperature dynamics: warms under high discharge, cools toward ambient
        setBatteryTempC((prevTemp) => {
          const heating = Math.abs(physicsOutput.currentA) * 0.0003;
          const cooling = (ambientTempC - prevTemp) * 0.0008;
          return Number((prevTemp + heating + cooling).toFixed(2));
        });

        return nextTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeedMultiplier, currentCycle, physicsOutput.powerTotalKw, physicsOutput.currentA, currentVehicle, ambientTempC]);

  // Periodic Telemetry History recording (every 1 second)
  useEffect(() => {
    const historyInterval = setInterval(() => {
      setTelemetryHistory((prev) => {
        const newPoint: TelemetryHistoryPoint = {
          timeSec: Math.round(simTimeSec),
          actualRange: physicsOutput.rdrPhysicsKm,
          qmlRange: qmlOutput.rdrQmlKm,
          dqnRange: qmlOutput.rdrDqnKm,
          svrRange: qmlOutput.rdrSvrKm,
          speed: Math.round(speedKmh),
        };

        const updated = [...prev, newPoint];
        if (updated.length > 40) updated.shift();
        return updated;
      });
    }, 1000);

    return () => clearInterval(historyInterval);
  }, [simTimeSec, physicsOutput.rdrPhysicsKm, qmlOutput.rdrQmlKm, qmlOutput.rdrDqnKm, qmlOutput.rdrSvrKm, speedKmh]);

  return (
    <div className="min-h-screen bg-cockpit-darkest text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header & Simulation Controls */}
      <Header
        currentVehicle={currentVehicle}
        onSelectVehicle={(v) => {
          setCurrentVehicle(v);
          setSocPercent(85);
        }}
        currentCycle={currentCycle}
        onSelectCycle={(c) => {
          setCurrentCycle(c);
          setSimTimeSec(0);
        }}
        isSimulating={isSimulating}
        onToggleSimulate={() => setIsSimulating(!isSimulating)}
        onResetSimulate={handleResetControls}
        simSpeedMultiplier={simSpeedMultiplier}
        onChangeSimSpeed={setSimSpeedMultiplier}
        driveMode={driveMode}
        onChangeDriveMode={setDriveMode}
        regenLevel={regenLevel}
        onChangeRegenLevel={setRegenLevel}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenCircuitModal={() => setIsCircuitModalOpen(true)}
        qubitCount={qubitCount}
        onChangeQubitCount={setQubitCount}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-5">
        {activeTab === 'cockpit' && (
          <DigitalCockpitTab
            vehicle={currentVehicle}
            speedKmh={speedKmh}
            onChangeSpeed={setSpeedKmh}
            socPercent={socPercent}
            onChangeSoc={setSocPercent}
            roadGradientPercent={roadGradientPercent}
            onChangeGradient={setRoadGradientPercent}
            ambientTempC={ambientTempC}
            onChangeTemp={setAmbientTempC}
            hvacLevel={hvacLevel}
            onChangeHvac={setHvacLevel}
            payloadKg={payloadKg}
            onChangePayload={setPayloadKg}
            tirePressurePsi={tirePressurePsi}
            onChangeTirePressure={setTirePressurePsi}
            driveMode={driveMode}
            regenLevel={regenLevel}
            onResetControls={handleResetControls}
            powerTotalKw={physicsOutput.powerTotalKw}
            motorRpm={physicsOutput.motorRpm}
            currentA={physicsOutput.currentA}
            terminalVoltageV={physicsOutput.terminalVoltageV}
            whPerKm={physicsOutput.whPerKm}
            sohPercent={sohPercent}
            batteryTempC={batteryTempC}
            rdrQmlKm={qmlOutput.rdrQmlKm}
            rdrConfidenceKm={qmlOutput.confidenceIntervalKm}
            rdrPhysicsKm={physicsOutput.rdrPhysicsKm}
            rdrAraiKm={physicsOutput.rdrAraiKm}
            lowSocPenaltyWeight={qmlOutput.lowSocPenaltyWeight}
            qubitAngles={qmlOutput.qubitAngles}
            qubitCount={qubitCount}
            expectationZ={qmlOutput.expectationZ}
            dispersion={qmlOutput.dispersion}
            activeClusterId={qmlOutput.activeCluster.id}
            clusterMemberships={qmlOutput.memberships}
            onOpenCircuitModal={() => setIsCircuitModalOpen(true)}
            history={telemetryHistory}
          />
        )}

        {activeTab === 'benchmarks' && <ResearchBenchmarkTab />}

        {activeTab === 'export' && <PaperExportTab />}
      </main>

      {/* Footer & Scientific Attributions */}
      <footer className="mt-auto border-t border-cockpit-border/60 bg-cockpit-darkest py-4 px-4 lg:px-6 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <span className="text-white font-bold">Q-RangeEV Research Workbench:</span>{' '}
            Pure Quantum Machine Learning (VQR) with Fuzzy K-Means & Pathfinder Optimization
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500">
            <span>[1] Hussain et al. (Sci Rep 2025)</span>
            <span>•</span>
            <span>[2] Eissa & Chen (IFAC 2023)</span>
            <span>•</span>
            <span>[3] Khekare & Vedaraj (Frontiers Big Data 2025)</span>
          </div>
        </div>
      </footer>

      {/* Quantum Circuit Inspector Modal */}
      <QuantumCircuitModal
        isOpen={isCircuitModalOpen}
        onClose={() => setIsCircuitModalOpen(false)}
        qubitAngles={qmlOutput.qubitAngles}
        qubitCount={qubitCount}
        expectationZ={qmlOutput.expectationZ}
        dispersion={qmlOutput.dispersion}
      />
    </div>
  );
};

export default App;
