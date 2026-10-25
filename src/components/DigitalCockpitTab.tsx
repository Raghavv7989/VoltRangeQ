import React from 'react';
import { EVVehicle, DriveMode, RegenLevel, HvacLevel } from '../types';
import { SpeedometerGauge } from './SpeedometerGauge';
import { CenterRangeHUD } from './CenterRangeHUD';
import { QuantumCircuitGauge } from './QuantumCircuitGauge';
import { PhysicsControlDeck } from './PhysicsControlDeck';
import { LiveTelemetryChart, TelemetryHistoryPoint } from './LiveTelemetryChart';

interface DigitalCockpitTabProps {
  vehicle: EVVehicle;
  speedKmh: number;
  onChangeSpeed: (v: number) => void;
  socPercent: number;
  onChangeSoc: (v: number) => void;
  roadGradientPercent: number;
  onChangeGradient: (v: number) => void;
  ambientTempC: number;
  onChangeTemp: (v: number) => void;
  hvacLevel: HvacLevel;
  onChangeHvac: (v: HvacLevel) => void;
  payloadKg: number;
  onChangePayload: (v: number) => void;
  tirePressurePsi: number;
  onChangeTirePressure: (v: number) => void;
  driveMode: DriveMode;
  regenLevel: RegenLevel;
  onResetControls: () => void;

  // Electrical & Physics Results
  powerTotalKw: number;
  motorRpm: number;
  currentA: number;
  terminalVoltageV: number;
  whPerKm: number;
  sohPercent: number;
  batteryTempC: number;

  // Predictions
  rdrQmlKm: number;
  rdrConfidenceKm: number;
  rdrPhysicsKm: number;
  rdrAraiKm: number;
  lowSocPenaltyWeight: number;

  // Quantum Circuit & Cluster State
  qubitAngles: number[];
  qubitCount: 8 | 12;
  expectationZ: number;
  dispersion: number;
  activeClusterId: number;
  clusterMemberships: number[];
  onOpenCircuitModal: () => void;

  // History Chart
  history: TelemetryHistoryPoint[];
}

export const DigitalCockpitTab: React.FC<DigitalCockpitTabProps> = ({
  vehicle,
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

  powerTotalKw,
  motorRpm,
  currentA,
  terminalVoltageV,
  whPerKm,
  sohPercent,
  batteryTempC,

  rdrQmlKm,
  rdrConfidenceKm,
  rdrPhysicsKm,
  rdrAraiKm,
  lowSocPenaltyWeight,

  qubitAngles,
  qubitCount,
  expectationZ,
  dispersion,
  activeClusterId,
  clusterMemberships,
  onOpenCircuitModal,

  history,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Odometer Cluster (3-Column Cockpit Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column (3.5 cols): Powertrain & Speedometer */}
        <div className="lg:col-span-4 min-h-[360px]">
          <SpeedometerGauge
            speedKmh={speedKmh}
            powerKw={powerTotalKw}
            maxMotorPowerKw={vehicle.maxMotorPowerKw}
            motorRpm={motorRpm}
            currentA={currentA}
            terminalVoltageV={terminalVoltageV}
            whPerKm={whPerKm}
          />
        </div>

        {/* Center HUD (4.5 cols): Quantum Range & Battery Core */}
        <div className="lg:col-span-4 min-h-[360px]">
          <CenterRangeHUD
            vehicle={vehicle}
            socPercent={socPercent}
            sohPercent={sohPercent}
            batteryTempC={batteryTempC}
            rdrQmlKm={rdrQmlKm}
            rdrConfidenceKm={rdrConfidenceKm}
            rdrPhysicsKm={rdrPhysicsKm}
            rdrAraiKm={rdrAraiKm}
            lowSocPenaltyWeight={lowSocPenaltyWeight}
            speedKmh={speedKmh}
            whPerKm={whPerKm}
          />
        </div>

        {/* Right Column (4 cols): Quantum Circuit & Fuzzy Cluster HUD */}
        <div className="lg:col-span-4 min-h-[360px]">
          <QuantumCircuitGauge
            qubitAngles={qubitAngles}
            qubitCount={qubitCount}
            expectationZ={expectationZ}
            dispersion={dispersion}
            activeClusterId={activeClusterId}
            clusterMemberships={clusterMemberships}
            onOpenModal={onOpenCircuitModal}
          />
        </div>
      </div>

      {/* Interactive Physics Control Deck */}
      <PhysicsControlDeck
        speedKmh={speedKmh}
        onChangeSpeed={onChangeSpeed}
        socPercent={socPercent}
        onChangeSoc={onChangeSoc}
        roadGradientPercent={roadGradientPercent}
        onChangeGradient={onChangeGradient}
        ambientTempC={ambientTempC}
        onChangeTemp={onChangeTemp}
        hvacLevel={hvacLevel}
        onChangeHvac={onChangeHvac}
        payloadKg={payloadKg}
        onChangePayload={onChangePayload}
        tirePressurePsi={tirePressurePsi}
        onChangeTirePressure={onChangeTirePressure}
        onResetControls={onResetControls}
      />

      {/* Live Scrolling Telemetry Chart */}
      <LiveTelemetryChart history={history} />
    </div>
  );
};
