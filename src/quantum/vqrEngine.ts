import { FKMCluster, EVVehicle } from '../types';

export const FKM_CLUSTERS: FKMCluster[] = [
  {
    id: 0,
    name: 'Stop & Go Urban Gridlock',
    description: 'Low speed (<25 km/h), frequent deceleration, regenerative pulses, high HVAC idle ratio',
    color: '#f59e0b', // amber
    centroid: { speedKmh: 14, socPercent: 65, currentA: 18, voltageV: 350, tempC: 34, gradientPercent: 0 }
  },
  {
    id: 1,
    name: 'City Eco Cruise',
    description: 'Steady 35-50 km/h, flat road, optimal aerodynamic drag and motor efficiency',
    color: '#10b981', // emerald
    centroid: { speedKmh: 42, socPercent: 75, currentA: 26, voltageV: 360, tempC: 28, gradientPercent: 0.2 }
  },
  {
    id: 2,
    name: 'Highway Sprint',
    description: 'High speed (80-110 km/h), dominant aerodynamic drag, sustained high discharge current',
    color: '#38bdf8', // sky cyan
    centroid: { speedKmh: 95, socPercent: 55, currentA: 78, voltageV: 340, tempC: 32, gradientPercent: 0.5 }
  },
  {
    id: 3,
    name: 'Mountain Ghat Ascent',
    description: 'Steep road gradient (+5% to +12%), high mechanical torque demand, elevated motor heating',
    color: '#b829dd', // purple
    centroid: { speedKmh: 45, socPercent: 40, currentA: 95, voltageV: 330, tempC: 37, gradientPercent: 7.0 }
  },
  {
    id: 4,
    name: 'Downhill Regenerative Coast',
    description: 'Negative road gradient, negative current flow (charging battery), low auxiliary ratio',
    color: '#00f2fe', // neon cyan
    centroid: { speedKmh: 55, socPercent: 70, currentA: -32, voltageV: 370, tempC: 27, gradientPercent: -5.0 }
  },
  {
    id: 5,
    name: 'Thermal & Low-SOC Strain',
    description: 'Battery SOC < 25%, extreme ambient temp (>38°C or <15°C), high internal resistance',
    color: '#f43f5e', // rose red
    centroid: { speedKmh: 35, socPercent: 15, currentA: 55, voltageV: 310, tempC: 42, gradientPercent: 1.5 }
  }
];

export interface QmlStateVector {
  activeCluster: FKMCluster;
  memberships: number[]; // size 6, sums to 1.0
  qubitAngles: number[]; // 8 or 12 angles for RY/RZ
  expectationZ: number; // -1 to +1
  dispersion: number; // quantum uncertainty
  rdrQmlKm: number;
  confidenceIntervalKm: number;
  lowSocPenaltyWeight: number;
  rdrDqnKm: number;
  rdrSvrKm: number;
}

export function computeFuzzyKMeans(
  speedKmh: number,
  socPercent: number,
  currentA: number,
  voltageV: number,
  ambientTempC: number,
  gradientPercent: number,
  fuzzifierM: number = 2.0
): { memberships: number[]; activeCluster: FKMCluster } {
  // Normalize features to [0, 1] range for Euclidean distance in feature space
  const normSpeed = speedKmh / 160;
  const normSoc = socPercent / 100;
  const normCurrent = (currentA + 50) / 250;
  const normVoltage = voltageV / 700;
  const normTemp = ambientTempC / 50;
  const normGrad = (gradientPercent + 15) / 30;

  const distances: number[] = FKM_CLUSTERS.map(c => {
    const cNormSpeed = c.centroid.speedKmh / 160;
    const cNormSoc = c.centroid.socPercent / 100;
    const cNormCurrent = (c.centroid.currentA + 50) / 250;
    const cNormVoltage = c.centroid.voltageV / 700;
    const cNormTemp = c.centroid.tempC / 50;
    const cNormGrad = (c.centroid.gradientPercent + 15) / 30;

    const distSq =
      Math.pow(normSpeed - cNormSpeed, 2) * 1.5 +
      Math.pow(normSoc - cNormSoc, 2) * 2.0 +
      Math.pow(normCurrent - cNormCurrent, 2) * 1.2 +
      Math.pow(normVoltage - cNormVoltage, 2) * 1.0 +
      Math.pow(normTemp - cNormTemp, 2) * 1.3 +
      Math.pow(normGrad - cNormGrad, 2) * 1.8;

    return Math.max(0.0001, Math.sqrt(distSq));
  });

  // Compute fuzzy membership: u_ik = 1 / Σ (d_ik / d_jk)^(2 / (m - 1))
  const exponent = 2 / (fuzzifierM - 1);
  const rawMemberships = distances.map((d_i) => {
    let sumTerms = 0;
    for (const d_j of distances) {
      sumTerms += Math.pow(d_i / d_j, exponent);
    }
    return 1 / Math.max(0.0001, sumTerms);
  });

  // Normalize so memberships strictly sum to 1.0
  const sumM = rawMemberships.reduce((a, b) => a + b, 0);
  const memberships = rawMemberships.map(m => m / sumM);

  // Active cluster is highest membership
  let bestIdx = 0;
  let maxM = memberships[0];
  for (let i = 1; i < memberships.length; i++) {
    if (memberships[i] > maxM) {
      maxM = memberships[i];
      bestIdx = i;
    }
  }

  return { memberships, activeCluster: FKM_CLUSTERS[bestIdx] };
}

export function evaluateQuantumVqr(
  vehicle: EVVehicle,
  socPercent: number,
  speedKmh: number,
  currentA: number,
  voltageV: number,
  ambientTempC: number,
  gradientPercent: number,
  rdrPhysicsKm: number,
  qubitCount: 8 | 12 = 8
): QmlStateVector {
  // 1. Fuzzy K-Means clustering (K=6, m=2.0)
  const { memberships, activeCluster } = computeFuzzyKMeans(
    speedKmh,
    socPercent,
    currentA,
    voltageV,
    ambientTempC,
    gradientPercent,
    2.0
  );

  // 2. Pathfinder Optimization parameters simulation
  // Pathfinder Optimizer weights the feature embedding based on apex path vectors
  const poaWeights = [0.88, 0.94, 0.76, 0.98, 0.82, 0.91, 0.85, 0.89, 0.79, 0.93, 0.84, 0.87];

  // 3. Angle Embedding: compute rotation angles RY(π * x_i) & RZ
  const qubitAngles: number[] = [];
  const baseFeatures = [
    (socPercent / 100) * Math.PI,
    (speedKmh / 160) * Math.PI,
    ((currentA + 50) / 250) * Math.PI,
    (voltageV / 700) * Math.PI,
    (ambientTempC / 50) * Math.PI,
    ((gradientPercent + 15) / 30) * Math.PI,
    memberships[activeCluster.id] * Math.PI,
    (1 - socPercent / 100) * Math.PI,
    memberships[0] * Math.PI,
    memberships[2] * Math.PI,
    memberships[3] * Math.PI,
    memberships[5] * Math.PI,
  ];

  for (let i = 0; i < qubitCount; i++) {
    const rawAngle = (baseFeatures[i % baseFeatures.length] * poaWeights[i % poaWeights.length]) % (2 * Math.PI);
    qubitAngles.push(Number(rawAngle.toFixed(3)));
  }

  // 4. Strongly Entangling Layers Pauli-Z Expectation simulation
  // Under L=4 layers with CNOT entanglement and U3 rotations:
  // <Z> expectation value converges to an optimal non-linear correction factor
  let zSum = 0;
  for (let i = 0; i < qubitCount; i++) {
    // Quantum state projection <0|U^dagger Z U|0> = cos(theta_i) * cos(theta_(i+1)) + entanglement correlation
    const theta1 = qubitAngles[i];
    const theta2 = qubitAngles[(i + 1) % qubitCount];
    const entanglingPhase = Math.sin(theta1) * Math.sin(theta2) * 0.15;
    zSum += Math.cos(theta1) + entanglingPhase;
  }
  const expectationZ = Number((zSum / qubitCount).toFixed(4));

  // Quantum dispersion / uncertainty: ΔZ = sqrt(1 - <Z>²)
  const dispersion = Number(Math.sqrt(Math.max(0.01, 1 - Math.pow(Math.min(0.98, Math.abs(expectationZ)), 2))).toFixed(4));

  // 5. Paper 3 Eq. 4: Stratified Low-SOC Penalty Weight w(s)
  // w(s) = 1.0 + α * max(0, 0.30 - SOC/100)²
  const lowSocDeficit = Math.max(0, 0.30 - (socPercent / 100));
  const lowSocPenaltyWeight = Number((1.0 + 15.0 * Math.pow(lowSocDeficit, 2)).toFixed(3));

  // 6. Quantum Range Prediction: RDR_QML
  // Pure QML applies quantum interference correction to physics and driving dynamics
  // It accounts for non-linear cell polarization, regenerability and fuzzy driving states
  let quantumCorrection = (expectationZ * 0.08) - (dispersion * 0.03);
  if (activeCluster.id === 3) quantumCorrection -= 0.04; // steep uphill correction
  if (activeCluster.id === 4) quantumCorrection += 0.05; // high regen downhill bonus

  // Apply safety penalty at low SOC
  const rawQmlRange = rdrPhysicsKm * (1 + quantumCorrection) / (lowSocDeficit > 0 ? (1 + lowSocDeficit * 0.4) : 1);
  const rdrQmlKm = Math.max(0, Number(rawQmlRange.toFixed(1)));

  // Quantum Confidence Interval (± km)
  const confidenceIntervalKm = Math.max(1.2, Number((dispersion * (rdrQmlKm * 0.045) + (lowSocDeficit * 5.0)).toFixed(1)));

  // 7. Comparative benchmark simulations for live tracking chart
  // Paper 3 POA-DQN simulation (slightly higher variance in rapid transients)
  const dqnNoise = Math.sin(Date.now() / 3000) * 2.8;
  const rdrDqnKm = Math.max(0, Number((rdrPhysicsKm * 0.985 + dqnNoise).toFixed(1)));

  // Paper 2 RBF-SVR simulation (smooth but slightly slower response to rapid grade changes)
  const svrNoise = Math.cos(Date.now() / 4500) * 3.5;
  const rdrSvrKm = Math.max(0, Number((rdrPhysicsKm * 0.97 + svrNoise).toFixed(1)));

  return {
    activeCluster,
    memberships,
    qubitAngles,
    expectationZ,
    dispersion,
    rdrQmlKm,
    confidenceIntervalKm,
    lowSocPenaltyWeight,
    rdrDqnKm,
    rdrSvrKm,
  };
}
