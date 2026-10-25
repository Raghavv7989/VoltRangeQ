import { EVVehicle, DriveMode, RegenLevel, HvacLevel } from '../types';

export interface PhysicsInput {
  vehicle: EVVehicle;
  speedKmh: number;
  accelerationMps2: number;
  roadGradientPercent: number;
  ambientTempC: number;
  socPercent: number;
  payloadKg: number;
  tirePressurePsi: number;
  hvacLevel: HvacLevel;
  driveMode: DriveMode;
  regenLevel: RegenLevel;
  batteryTempC: number;
}

export interface PhysicsOutput {
  fAeroN: number;
  fRollN: number;
  fGradeN: number;
  fAccN: number;
  fTotalN: number;
  powerWheelKw: number;
  powerMotorKw: number;
  powerAuxKw: number;
  powerTotalKw: number;
  ocvV: number;
  terminalVoltageV: number;
  currentA: number;
  whPerKm: number;
  motorRpm: number;
  thermalDeratingFactor: number;
  rdrPhysicsKm: number;
  rdrAraiKm: number;
}

export function calculatePhysicsStep(input: PhysicsInput): PhysicsOutput {
  const {
    vehicle,
    speedKmh,
    accelerationMps2,
    roadGradientPercent,
    ambientTempC,
    socPercent,
    payloadKg,
    tirePressurePsi,
    hvacLevel,
    driveMode,
    regenLevel,
    batteryTempC,
  } = input;

  // 1. Air density based on ambient temperature
  const rho = 1.225 * (293.15 / (273.15 + Math.max(-10, ambientTempC)));
  const vMps = speedKmh / 3.6;

  // 2. Aerodynamic Drag Force (F_aero = 0.5 * ρ * Cd * A * v²)
  const fAeroN = 0.5 * rho * vehicle.dragCoefficient * vehicle.frontalAreaM2 * Math.pow(vMps, 2);

  // 3. Rolling Resistance (F_roll = m * g * Crr * cos(θ))
  const thetaRad = Math.atan(roadGradientPercent / 100);
  const totalMassKg = vehicle.curbWeightKg + payloadKg;
  const tirePressureCorrection = Math.sqrt(32.0 / Math.max(20, Math.min(50, tirePressurePsi)));
  const fRollN = totalMassKg * 9.80665 * vehicle.rollingResistanceCoeff * Math.cos(thetaRad) * tirePressureCorrection;

  // 4. Grade Resistance (F_grade = m * g * sin(θ))
  const fGradeN = totalMassKg * 9.80665 * Math.sin(thetaRad);

  // 5. Acceleration Force (F_acc = m_eff * a)
  // 1.05x accounts for rotational inertia of powertrain/wheels
  const fAccN = totalMassKg * 1.05 * accelerationMps2;

  // Total force at wheels
  const fTotalN = fAeroN + fRollN + fGradeN + fAccN;

  // Mechanical Wheel Power
  const powerWheelKw = (fTotalN * vMps) / 1000;

  // Regen recovery coefficient based on Regen Level
  let regenFraction = 0.25;
  if (regenLevel === 'L1') regenFraction = 0.15;
  if (regenLevel === 'L2') regenFraction = 0.30;
  if (regenLevel === 'L3') regenFraction = 0.45;

  // Drive Mode throttle mapping multiplier
  let modeMultiplier = 1.0;
  if (driveMode === 'eco') modeMultiplier = 0.92;
  if (driveMode === 'sport') modeMultiplier = 1.15;

  let powerMotorKw = 0;
  if (powerWheelKw >= 0) {
    // Traction power required from battery via inverter & motor
    powerMotorKw = (powerWheelKw / vehicle.drivetrainEfficiency) * (driveMode === 'eco' ? 0.95 : 1.0);
  } else {
    // Regenerative braking feeding back into battery
    powerMotorKw = powerWheelKw * vehicle.drivetrainEfficiency * regenFraction;
    // Cap maximum regeneration at -45 kW to prevent cell overvoltage
    powerMotorKw = Math.max(-45.0, powerMotorKw);
  }

  // 6. Auxiliary Power (P_aux) based on HVAC and ambient temperature
  let baseAuxKw = 0.45; // Telemetry, DC-DC, screens, lights
  let hvacKw = 0.0;
  if (hvacLevel === 'eco') {
    hvacKw = 1.1 + Math.abs(ambientTempC - 24) * 0.04;
  } else if (hvacLevel === 'max_cool') {
    hvacKw = 2.8 + Math.max(0, ambientTempC - 28) * 0.07;
  }
  const powerAuxKw = baseAuxKw + hvacKw;

  // Total Electrical Power Demand
  const powerTotalKw = powerMotorKw + powerAuxKw;

  // 7. Battery Thermal Derating Factor (η_thermal)
  // Optimal around 25-28°C; degrades at extreme heat (>38°C) and cold (<15°C)
  let thermalDeratingFactor = 1.0;
  if (ambientTempC > 35) {
    thermalDeratingFactor = Math.max(0.78, 1.0 - 0.007 * (ambientTempC - 35));
  } else if (ambientTempC < 18) {
    thermalDeratingFactor = Math.max(0.75, 1.0 - 0.009 * (18 - ambientTempC));
  }

  // 8. Battery Electrical Model: OCV & Terminal Voltage Sag
  // Open circuit voltage as non-linear function of SOC
  const socNorm = Math.max(0.01, Math.min(1.0, socPercent / 100));
  const ocvV = vehicle.nominalVoltage * (0.89 + 0.22 * socNorm - 0.05 * Math.pow(1 - socNorm, 3));

  // Internal resistance scaling with temperature and depleted SOC
  let rInternal = 0.045 * (vehicle.nominalVoltage / 350); // normalize with voltage architecture
  rInternal *= (1 + 0.015 * Math.abs(batteryTempC - 27));
  if (socPercent < 20) {
    rInternal *= (1 + 0.6 * Math.pow((20 - socPercent) / 20, 2));
  }

  // Terminal voltage sag under load: P = V_term * I = V_term * (V_ocv - V_term) / R
  const powerTotalWatts = powerTotalKw * 1000;
  const discriminant = Math.pow(ocvV, 2) - 4 * powerTotalWatts * rInternal;
  let terminalVoltageV = ocvV;
  if (discriminant >= 0) {
    terminalVoltageV = (ocvV + Math.sqrt(discriminant)) / 2;
  } else {
    terminalVoltageV = ocvV * 0.88; // safe clamp during heavy transient load
  }
  const currentA = (ocvV - terminalVoltageV) / rInternal;

  // 9. Instantaneous Energy Consumption Rate (Wh/km)
  const safeSpeed = Math.max(12, speedKmh);
  const whPerKm = Math.max(40, (Math.max(0.5, powerTotalKw) / safeSpeed) * 1000);

  // Motor RPM calculation (assuming wheel diameter ~ 0.64m, gear ratio ~ 8.5:1)
  const wheelCircumferenceM = 2.05;
  const wheelRps = vMps / wheelCircumferenceM;
  const motorRpm = Math.round(wheelRps * 60 * 8.5);

  // 10. Discrete Physics RDR Estimation (Paper 2, Eissa & Chen IFAC 2023 Eq. 12)
  // RDR = (3600 * (SOC - SOC_min) * C * η_p * d) / Σ(U * I * ΔT)
  const usableKwh = Math.max(0, ((socPercent - 5) / 100)) * vehicle.batteryKwh * thermalDeratingFactor;
  // Blend instantaneous consumption with vehicle base efficiency to avoid division spikes
  const effectiveWhPerKm = (whPerKm * 0.7) + ((vehicle.batteryKwh * 1000 / vehicle.realWorldBaseKm) * 0.3);
  const rdrPhysicsKm = Math.max(0, Number(((usableKwh * 1000) / Math.max(50, effectiveWhPerKm)).toFixed(1)));

  // Pro-rata ARAI rated range for visual HUD comparison
  const rdrAraiKm = Math.max(0, Number((vehicle.araiRangeKm * (socPercent / 100)).toFixed(1)));

  return {
    fAeroN,
    fRollN,
    fGradeN,
    fAccN,
    fTotalN,
    powerWheelKw,
    powerMotorKw,
    powerAuxKw,
    powerTotalKw,
    ocvV,
    terminalVoltageV,
    currentA,
    whPerKm,
    motorRpm,
    thermalDeratingFactor,
    rdrPhysicsKm,
    rdrAraiKm,
  };
}
