export interface EVVehicle {
  id: string;
  name: string;
  manufacturer: string;
  batteryKwh: number;
  nominalVoltage: number;
  araiRangeKm: number;
  realWorldBaseKm: number;
  curbWeightKg: number;
  dragCoefficient: number; // Cd
  frontalAreaM2: number; // A
  rollingResistanceCoeff: number; // Crr
  drivetrainEfficiency: number; // η_p
  maxMotorPowerKw: number;
  image?: string;
  batteryChemistry: string;
  architecture: string;
}

export type DriveMode = 'eco' | 'city' | 'sport';
export type RegenLevel = 'L1' | 'L2' | 'L3';
export type HvacLevel = 'off' | 'eco' | 'max_cool';

export interface DrivingTelemetry {
  timestamp: number; // ms
  speedKmh: number;
  accelerationMps2: number;
  socPercent: number;
  sohPercent: number;
  batteryTempC: number;
  ambientTempC: number;
  roadGradientPercent: number; // θ (%)
  payloadKg: number;
  tirePressurePsi: number;
  hvacLevel: HvacLevel;
  driveMode: DriveMode;
  regenLevel: RegenLevel;
  
  // Electrical Telemetry
  instantCurrentA: number;
  terminalVoltageV: number;
  ocvV: number;
  instantPowerKw: number;
  cumulativeEnergyKwh: number;
  cumulativeDistanceKm: number;
  whPerKm: number;
  motorRpm: number;

  // Range Predictions
  rdrPhysicsKm: number;
  rdrQmlKm: number;
  rdrQmlConfidenceKm: number;
  rdrDqnKm: number;
  rdrSvrKm: number;
  rdrAraiKm: number;
  
  // Quantum & Cluster State
  activeClusterId: number;
  activeClusterName: string;
  clusterMemberships: number[]; // size 6
  quantumQubitAngles: number[]; // size 8 or 12
  quantumExpectationZ: number;
  lowSocPenaltyWeight: number; // w(s)
}

export interface FKMCluster {
  id: number;
  name: string;
  description: string;
  color: string;
  centroid: {
    speedKmh: number;
    socPercent: number;
    currentA: number;
    voltageV: number;
    tempC: number;
    gradientPercent: number;
  };
}

export interface ModelBenchmark {
  modelName: string;
  category: string;
  rmse: number;
  mae: number;
  r2: number;
  nrmse: number;
  mape: number;
  mse?: number;
  convergenceEpochs?: number;
  isProposed?: boolean;
  notes?: string;
}

export interface DrivingCyclePoint {
  timeSec: number;
  speedKmh: number;
  gradientPercent: number;
  trafficDensity: 'low' | 'medium' | 'high' | 'severe';
  description: string;
}

export interface DrivingCycle {
  id: string;
  name: string;
  region: string;
  totalDurationSec: number;
  totalDistanceEstKm: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  points: DrivingCyclePoint[];
}

export interface ConvergencePoint {
  epoch: number;
  poaVqrQuantum: number;
  poaDqnPaper3: number;
  bayesianOpt: number;
  epo: number;
  ga: number;
  gwo: number;
}

export interface AblationStudyPoint {
  kClusters: number;
  fuzzifierM: number;
  rawVqrRmse: number;
  fkmVqrRmse: number;
  fkmPoaVqrRmse: number;
  fkmPoaVqrR2: number;
}
