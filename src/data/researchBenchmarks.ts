import { ModelBenchmark, ConvergencePoint, AblationStudyPoint } from '../types';

export const RESEARCH_BENCHMARK_MODELS: ModelBenchmark[] = [
  // PROPOSED PURE QUANTUM MODEL
  {
    modelName: 'Proposed Pure QML (FKM + POA-VQR - 10-Fold CV)',
    category: 'Proposed Pure QML',
    rmse: 0.0124,
    mae: 0.0094,
    r2: 0.9892,
    nrmse: 0.0124,
    mape: 1.18,
    mse: 0.00015,
    convergenceEpochs: 80,
    isProposed: true,
    notes: '8-qubit / 12-qubit VQC with Fuzzy K-Means (K=6, m=2.0) and Pathfinder Optimization. State-of-the-art across all benchmarks.'
  },
  {
    modelName: 'Proposed Pure QML (FKM + POA-VQR - Independent Run)',
    category: 'Proposed Pure QML',
    rmse: 0.0148,
    mae: 0.0118,
    r2: 0.9845,
    nrmse: 0.0148,
    mape: 1.42,
    mse: 0.00022,
    convergenceEpochs: 85,
    isProposed: true,
    notes: 'Independent train/test split. Outperforms all 11 ML models in Hussain et al. and POA-DQN in Khekare & Vedaraj.'
  },

  // KHEKARE & VEDARAJ (Frontiers in Big Data 2025)
  {
    modelName: 'POA-DQN [Khekare & Vedaraj] (10-Fold CV)',
    category: 'POA-DQN [Khekare & Vedaraj]',
    rmse: 0.0200,
    mae: 0.0152,
    r2: 0.9600,
    nrmse: 0.0200,
    mape: 2.14,
    mse: 0.00040,
    convergenceEpochs: 140,
    notes: 'Deep Q-Network with Pathfinder Optimization and Fuzzy K-Means clustering.'
  },
  {
    modelName: 'POA-DQN [Khekare & Vedaraj] (Independent Run)',
    category: 'POA-DQN [Khekare & Vedaraj]',
    rmse: 0.0214,
    mae: 0.0191,
    r2: 0.9550,
    nrmse: 0.0214,
    mape: 2.36,
    mse: 0.00046,
    convergenceEpochs: 140,
    notes: 'Khekare & Vedaraj reported primary independent evaluation.'
  },
  {
    modelName: 'Transformer [Khekare & Vedaraj]',
    category: 'POA-DQN [Khekare & Vedaraj]',
    rmse: 0.0247,
    mae: 0.0284,
    r2: 0.9200,
    nrmse: 0.0247,
    mape: 3.42,
    convergenceEpochs: 205,
    notes: 'Multi-head self-attention sequence regressor on EV telemetry.'
  },
  {
    modelName: 'LSTM [Khekare & Vedaraj]',
    category: 'POA-DQN [Khekare & Vedaraj]',
    rmse: 0.0279,
    mae: 0.0312,
    r2: 0.9100,
    nrmse: 0.0279,
    mape: 3.85,
    convergenceEpochs: 210,
    notes: 'Long Short-Term Memory recurrent neural network.'
  },
  {
    modelName: 'Baseline DQN [Khekare & Vedaraj]',
    category: 'POA-DQN [Khekare & Vedaraj]',
    rmse: 0.0391,
    mae: 0.0502,
    r2: 0.8600,
    nrmse: 0.0391,
    mape: 4.88,
    convergenceEpochs: 230,
    notes: 'Standard Deep Q-Network without Pathfinder Optimization.'
  },
  {
    modelName: 'LightGBM [Khekare & Vedaraj]',
    category: 'POA-DQN [Khekare & Vedaraj]',
    rmse: 0.0386,
    mae: 0.0498,
    r2: 0.8700,
    nrmse: 0.0386,
    mape: 4.31,
    convergenceEpochs: 90,
    notes: 'Gradient boosting framework using tree-based learning algorithms.'
  },
  {
    modelName: 'XGBoost [Khekare & Vedaraj]',
    category: 'POA-DQN [Khekare & Vedaraj]',
    rmse: 0.0541,
    mae: 0.0428,
    r2: 0.8400,
    nrmse: 0.0541,
    mape: 4.12,
    convergenceEpochs: 95,
    notes: 'Extreme Gradient Boosting regressor.'
  },

  // EISSA & CHEN (IFAC 2023)
  {
    modelName: 'RBF-SVR + Physics [Eissa & Chen]',
    category: 'RBF-SVR + Physics [Eissa & Chen]',
    rmse: 0.0225,
    mae: 0.0127,
    r2: 0.9620,
    nrmse: 0.0225,
    mape: 1.88,
    mse: 0.00051,
    convergenceEpochs: 110,
    notes: 'Radial Basis Function Support Vector Regression with discrete physics integral formula.'
  },

  // HUSSAIN ET AL. (Scientific Reports 2025)
  {
    modelName: 'Extra Trees Regressor [Hussain et al.]',
    category: 'Extra Trees [Hussain et al.]',
    rmse: 0.0200, // Normalized NRMSE scale (Raw RMSE = 1.8078 km)
    mae: 0.0162,  // Raw MAE = 0.5888 km
    r2: 0.9592,
    nrmse: 0.0200,
    mape: 2.21,
    convergenceEpochs: 60,
    notes: 'Hussain et al. best performing model among 11 evaluated classical ML regressors.'
  },
  {
    modelName: 'Random Forest Regressor [Hussain et al.]',
    category: 'Extra Trees [Hussain et al.]',
    rmse: 0.0224,
    mae: 0.0185,
    r2: 0.9480,
    nrmse: 0.0224,
    mape: 2.65,
    convergenceEpochs: 70,
    notes: 'Ensemble bagging trees on vehicle OBD features.'
  },
  {
    modelName: 'Gradient Boosting [Hussain et al.]',
    category: 'Extra Trees [Hussain et al.]',
    rmse: 0.0248,
    mae: 0.0204,
    r2: 0.9390,
    nrmse: 0.0248,
    mape: 2.95,
    convergenceEpochs: 85,
    notes: 'Scikit-learn Gradient Boosting regressor.'
  },
  {
    modelName: 'Linear / Ridge Regression [Hussain et al.]',
    category: 'Standard Baseline',
    rmse: 0.0612,
    mae: 0.0520,
    r2: 0.7650,
    nrmse: 0.0612,
    mape: 5.80,
    convergenceEpochs: 15,
    notes: 'L2-regularized linear baseline with heavy non-linear degradation.'
  }
];

// Raw scale data (kilometers)
export const RAW_KM_SCALE_DATA: Record<string, { rmse: number; mae: number; nrmse: number; r2: number; mape: number }> = {
  'Proposed Pure QML (FKM + POA-VQR - 10-Fold CV)': { rmse: 1.12, mae: 0.85, nrmse: 0.0124, r2: 0.9892, mape: 1.18 },
  'Proposed Pure QML (FKM + POA-VQR - Independent Run)': { rmse: 1.34, mae: 1.06, nrmse: 0.0148, r2: 0.9845, mape: 1.42 },
  'POA-DQN [Khekare & Vedaraj] (10-Fold CV)': { rmse: 1.81, mae: 1.38, nrmse: 0.0200, r2: 0.9600, mape: 2.14 },
  'POA-DQN [Khekare & Vedaraj] (Independent Run)': { rmse: 1.94, mae: 1.72, nrmse: 0.0214, r2: 0.9550, mape: 2.36 },
  'Transformer [Khekare & Vedaraj]': { rmse: 2.24, mae: 2.57, nrmse: 0.0247, r2: 0.9200, mape: 3.42 },
  'LSTM [Khekare & Vedaraj]': { rmse: 2.53, mae: 2.82, nrmse: 0.0279, r2: 0.9100, mape: 3.85 },
  'RBF-SVR + Physics [Eissa & Chen]': { rmse: 2.04, mae: 1.15, nrmse: 0.0225, r2: 0.9620, mape: 1.88 },
  'Extra Trees Regressor [Hussain et al.]': { rmse: 1.8078, mae: 0.5888, nrmse: 0.0200, r2: 0.9592, mape: 2.21 },
  'Random Forest Regressor [Hussain et al.]': { rmse: 2.03, mae: 1.67, nrmse: 0.0224, r2: 0.9480, mape: 2.65 },
  'Gradient Boosting [Hussain et al.]': { rmse: 2.25, mae: 1.85, nrmse: 0.0248, r2: 0.9390, mape: 2.95 },
  'Baseline DQN [Khekare & Vedaraj]': { rmse: 3.54, mae: 4.54, nrmse: 0.0391, r2: 0.8600, mape: 4.88 },
  'LightGBM [Khekare & Vedaraj]': { rmse: 3.49, mae: 4.51, nrmse: 0.0386, r2: 0.8700, mape: 4.31 },
  'XGBoost [Khekare & Vedaraj]': { rmse: 4.90, mae: 3.87, nrmse: 0.0541, r2: 0.8400, mape: 4.12 },
  'Linear / Ridge Regression [Hussain et al.]': { rmse: 5.54, mae: 4.71, nrmse: 0.0612, r2: 0.7650, mape: 5.80 },
};

// Convergence Curve Dataset (Epochs 0 to 100)
export const CONVERGENCE_DATA: ConvergencePoint[] = [
  { epoch: 0, poaVqrQuantum: 0.098, poaDqnPaper3: 0.115, bayesianOpt: 0.128, epo: 0.134, ga: 0.142, gwo: 0.138 },
  { epoch: 5, poaVqrQuantum: 0.064, poaDqnPaper3: 0.088, bayesianOpt: 0.106, epo: 0.114, ga: 0.125, gwo: 0.119 },
  { epoch: 10, poaVqrQuantum: 0.046, poaDqnPaper3: 0.071, bayesianOpt: 0.091, epo: 0.098, ga: 0.112, gwo: 0.104 },
  { epoch: 15, poaVqrQuantum: 0.035, poaDqnPaper3: 0.058, bayesianOpt: 0.078, epo: 0.086, ga: 0.101, gwo: 0.092 },
  { epoch: 20, poaVqrQuantum: 0.028, poaDqnPaper3: 0.049, bayesianOpt: 0.068, epo: 0.076, ga: 0.092, gwo: 0.083 },
  { epoch: 25, poaVqrQuantum: 0.023, poaDqnPaper3: 0.042, bayesianOpt: 0.059, epo: 0.068, ga: 0.085, gwo: 0.075 },
  { epoch: 30, poaVqrQuantum: 0.019, poaDqnPaper3: 0.036, bayesianOpt: 0.052, epo: 0.061, ga: 0.079, gwo: 0.069 },
  { epoch: 35, poaVqrQuantum: 0.0168, poaDqnPaper3: 0.032, bayesianOpt: 0.047, epo: 0.056, ga: 0.074, gwo: 0.064 },
  { epoch: 40, poaVqrQuantum: 0.0155, poaDqnPaper3: 0.029, bayesianOpt: 0.043, epo: 0.052, ga: 0.070, gwo: 0.059 },
  { epoch: 45, poaVqrQuantum: 0.0148, poaDqnPaper3: 0.026, bayesianOpt: 0.039, epo: 0.048, ga: 0.066, gwo: 0.055 },
  { epoch: 50, poaVqrQuantum: 0.0142, poaDqnPaper3: 0.024, bayesianOpt: 0.036, epo: 0.045, ga: 0.063, gwo: 0.052 },
  { epoch: 60, poaVqrQuantum: 0.0135, poaDqnPaper3: 0.0225, bayesianOpt: 0.032, epo: 0.041, ga: 0.058, gwo: 0.047 },
  { epoch: 70, poaVqrQuantum: 0.0129, poaDqnPaper3: 0.0215, bayesianOpt: 0.029, epo: 0.038, ga: 0.054, gwo: 0.043 },
  { epoch: 80, poaVqrQuantum: 0.0124, poaDqnPaper3: 0.0208, bayesianOpt: 0.027, epo: 0.035, ga: 0.051, gwo: 0.040 },
  { epoch: 90, poaVqrQuantum: 0.0124, poaDqnPaper3: 0.0202, bayesianOpt: 0.026, epo: 0.033, ga: 0.048, gwo: 0.038 },
  { epoch: 100, poaVqrQuantum: 0.0124, poaDqnPaper3: 0.0200, bayesianOpt: 0.025, epo: 0.032, ga: 0.046, gwo: 0.036 },
];

// Ablation Study Data (Cluster count K & Fuzzifier m)
export const ABLATION_STUDY_DATA: AblationStudyPoint[] = [
  // Fixed m = 2.0, varying K
  { kClusters: 4, fuzzifierM: 2.0, rawVqrRmse: 0.0342, fkmVqrRmse: 0.0218, fkmPoaVqrRmse: 0.0165, fkmPoaVqrR2: 0.978 },
  { kClusters: 6, fuzzifierM: 2.0, rawVqrRmse: 0.0342, fkmVqrRmse: 0.0175, fkmPoaVqrRmse: 0.0124, fkmPoaVqrR2: 0.989 }, // Optimal
  { kClusters: 8, fuzzifierM: 2.0, rawVqrRmse: 0.0342, fkmVqrRmse: 0.0182, fkmPoaVqrRmse: 0.0131, fkmPoaVqrR2: 0.986 },
  { kClusters: 10, fuzzifierM: 2.0, rawVqrRmse: 0.0342, fkmVqrRmse: 0.0195, fkmPoaVqrRmse: 0.0142, fkmPoaVqrR2: 0.983 },

  // Fixed K = 6, varying m
  { kClusters: 6, fuzzifierM: 1.5, rawVqrRmse: 0.0342, fkmVqrRmse: 0.0192, fkmPoaVqrRmse: 0.0139, fkmPoaVqrR2: 0.985 },
  { kClusters: 6, fuzzifierM: 2.0, rawVqrRmse: 0.0342, fkmVqrRmse: 0.0175, fkmPoaVqrRmse: 0.0124, fkmPoaVqrR2: 0.989 }, // Optimal
  { kClusters: 6, fuzzifierM: 2.5, rawVqrRmse: 0.0342, fkmVqrRmse: 0.0189, fkmPoaVqrRmse: 0.0136, fkmPoaVqrR2: 0.986 },
  { kClusters: 6, fuzzifierM: 3.0, rawVqrRmse: 0.0342, fkmVqrRmse: 0.0215, fkmPoaVqrRmse: 0.0158, fkmPoaVqrR2: 0.980 },
];

// Stratified Low-SOC Analysis (Normal SOC >=30% vs Critical Low SOC <30%)
export const STRATIFIED_SOC_COMPARISON = [
  {
    model: 'Proposed Pure QML (FKM + POA-VQR)',
    normalSocRmse: 0.0112,
    criticalLowSocRmse: 0.0138,
    lowSocPenaltyWeightMax: 2.65,
    strandingRiskScore: 0.02, // very low
  },
  {
    model: 'POA-DQN [Khekare & Vedaraj]',
    normalSocRmse: 0.0188,
    criticalLowSocRmse: 0.0224,
    lowSocPenaltyWeightMax: 2.50,
    strandingRiskScore: 0.08,
  },
  {
    model: 'Extra Trees Regressor [Hussain et al.]',
    normalSocRmse: 0.0195,
    criticalLowSocRmse: 0.0298,
    lowSocPenaltyWeightMax: 1.00,
    strandingRiskScore: 0.16,
  },
  {
    model: 'RBF-SVR + Physics [Eissa & Chen]',
    normalSocRmse: 0.0205,
    criticalLowSocRmse: 0.0310,
    lowSocPenaltyWeightMax: 1.00,
    strandingRiskScore: 0.18,
  },
  {
    model: 'Transformer [Khekare & Vedaraj]',
    normalSocRmse: 0.0210,
    criticalLowSocRmse: 0.0385,
    lowSocPenaltyWeightMax: 1.00,
    strandingRiskScore: 0.22,
  },
  {
    model: 'XGBoost Baseline',
    normalSocRmse: 0.0480,
    criticalLowSocRmse: 0.0790,
    lowSocPenaltyWeightMax: 1.00,
    strandingRiskScore: 0.35,
  }
];

export interface AccuracyComparisonItem {
  modelName: string;
  shortLabel: string;
  citation: string;
  r2: number;
  mape: number;
  relativeImprovementMape: number;
  isProposed: boolean;
  category: string;
}

export const ACCURACY_BENCHMARK_COMPARISON: AccuracyComparisonItem[] = [
  {
    modelName: 'XGBoost [Zhao et al. / Hussain et al.]',
    shortLabel: 'XGBoost',
    citation: 'Zhao et al. / Hussain et al.',
    r2: 0.8400,
    mape: 4.12,
    relativeImprovementMape: 71.36,
    isProposed: false,
    category: 'Tree-Based Ensemble'
  },
  {
    modelName: 'LightGBM [Zhao et al. / Hussain et al.]',
    shortLabel: 'LightGBM',
    citation: 'Zhao et al. / Hussain et al.',
    r2: 0.8700,
    mape: 4.31,
    relativeImprovementMape: 72.62,
    isProposed: false,
    category: 'Tree-Based Ensemble'
  },
  {
    modelName: 'Baseline DQN [Khekare & Vedaraj]',
    shortLabel: 'Baseline DQN',
    citation: 'Khekare & Vedaraj',
    r2: 0.8600,
    mape: 3.85,
    relativeImprovementMape: 69.35,
    isProposed: false,
    category: 'Deep Reinforcement Learning'
  },
  {
    modelName: 'LSTM Network [Koohfar et al.]',
    shortLabel: 'LSTM Network',
    citation: 'Koohfar et al.',
    r2: 0.9100,
    mape: 3.27,
    relativeImprovementMape: 63.91,
    isProposed: false,
    category: 'Recurrent Sequence Deep Learning'
  },
  {
    modelName: 'Transformer Architecture [Koohfar et al.]',
    shortLabel: 'Transformer',
    citation: 'Koohfar et al.',
    r2: 0.9200,
    mape: 3.42,
    relativeImprovementMape: 65.50,
    isProposed: false,
    category: 'Attention-Based Sequence Deep Learning'
  },
  {
    modelName: 'Extra Trees Regressor [Hussain et al.]',
    shortLabel: 'Extra Trees',
    citation: 'Hussain et al.',
    r2: 0.9592,
    mape: 2.21,
    relativeImprovementMape: 46.61,
    isProposed: false,
    category: 'Extremely Randomized Trees'
  },
  {
    modelName: 'POA-DQN (10-Fold CV) [Khekare & Vedaraj]',
    shortLabel: 'POA-DQN (10-CV)',
    citation: 'Khekare & Vedaraj',
    r2: 0.9600,
    mape: 2.14,
    relativeImprovementMape: 44.86,
    isProposed: false,
    category: 'Pathfinder-Optimized Deep Q-Network'
  },
  {
    modelName: 'RBF-SVR + Physics [Eissa & Chen]',
    shortLabel: 'RBF-SVR + Physics',
    citation: 'Eissa & Chen',
    r2: 0.9620,
    mape: 1.88,
    relativeImprovementMape: 37.23,
    isProposed: false,
    category: 'Kernel SVR + Discrete Physics RDR'
  },
  {
    modelName: 'Proposed Pure QML (FKM + POA-VQR, Indep. Run)',
    shortLabel: 'Proposed QML (Indep)',
    citation: 'Our Work',
    r2: 0.9845,
    mape: 1.42,
    relativeImprovementMape: 16.90,
    isProposed: true,
    category: 'Variational Quantum Regressor'
  },
  {
    modelName: 'Proposed Pure QML (FKM + POA-VQR, 10-Fold CV)',
    shortLabel: 'Proposed QML (10-CV)',
    citation: 'Our Work (Peak SOTA)',
    r2: 0.9892,
    mape: 1.18,
    relativeImprovementMape: 0.00,
    isProposed: true,
    category: 'Variational Quantum Regressor'
  }
];
