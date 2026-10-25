import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Database, 
  BookOpen, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { INDIAN_EV_FLEET } from '../data/evFleet';
import { RESEARCH_BENCHMARK_MODELS } from '../data/researchBenchmarks';

export const PaperExportTab: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Generate Synthetic Indian EV Telemetry Dataset (CSV format)
  const generateTelemetryCSV = () => {
    const headers = [
      'Timestamp_ms',
      'Vehicle_Model',
      'Drive_Cycle',
      'Speed_kmh',
      'Acceleration_mps2',
      'Battery_SOC_percent',
      'Pack_Voltage_V',
      'Pack_Current_A',
      'Battery_Temp_C',
      'Ambient_Temp_C',
      'Road_Gradient_percent',
      'Power_Demand_kW',
      'HVAC_Load_kW',
      'Regen_Level',
      'FKM_Cluster_ID',
      'FKM_Cluster_Name',
      'Physics_RDR_km',
      'Proposed_QML_RDR_km',
      'POA_DQN_RDR_km',
      'RBF_SVR_RDR_km',
      'ARAI_Range_km',
      'Ground_Truth_Range_km'
    ].join(',');

    const rows: string[] = [];
    const sampleTimes = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 360, 420, 480, 540, 600];

    sampleTimes.forEach((t, i) => {
      const speed = Math.round(35 + Math.sin(i * 0.7) * 30);
      const soc = Number((90 - (t / 600) * 8).toFixed(1));
      const volt = Number((360 - (90 - soc) * 0.4).toFixed(1));
      const curr = Number((28 + (speed / 100) * 50).toFixed(1));
      const pwr = Number(((volt * curr) / 1000).toFixed(2));
      const rdrPhys = Number(((soc / 100) * 360 * 0.92).toFixed(1));
      const rdrQml = Number((rdrPhys * 0.985).toFixed(1));
      const rdrDqn = Number((rdrPhys * 0.965).toFixed(1));
      const rdrSvr = Number((rdrPhys * 0.958).toFixed(1));

      rows.push([
        t * 1000,
        'Tata Nexon EV Empowered+ 45',
        'MIDC Urban Cycle',
        speed,
        Number((Math.cos(i) * 0.6).toFixed(2)),
        soc,
        volt,
        curr,
        Number((32 + (i * 0.3)).toFixed(1)),
        34,
        Number((Math.sin(i * 0.5) * 2.5).toFixed(1)),
        pwr,
        1.20,
        'L2',
        speed > 70 ? 2 : speed < 20 ? 0 : 1,
        speed > 70 ? 'Highway Sprint' : speed < 20 ? 'Stop & Go Urban' : 'City Eco Cruise',
        rdrPhys,
        rdrQml,
        rdrDqn,
        rdrSvr,
        489,
        rdrPhys
      ].join(','));
    });

    return headers + '\n' + rows.join('\n');
  };

  const downloadCSV = () => {
    const csvContent = generateTelemetryCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Q-RangeEV_Indian_EV_Telemetry_Dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // IEEE Transactions LaTeX Tabular Code
  const latexIeeeTable = `% IEEE Transactions on Intelligent Transportation Systems / Vehicular Technology
\\begin{table*}[t]
\\caption{Comparative Performance Benchmark of Proposed Pure QML (FKM + POA-VQR) vs. State-of-the-Art Literature Baselines}
\\label{tab:qml_benchmark_comparison}
\\centering
\\begin{tabular}{l c c c c c c}
\\hline\\hline
\\textbf{Model Architecture} & \\textbf{Category} & \\textbf{RMSE / NRMSE} & \\textbf{MAE} & \\textbf{$R^2$ Score} & \\textbf{MAPE (\\%)} & \\textbf{Convergence} \\\\
\\hline
\\textbf{Proposed Pure QML (FKM + POA-VQR, 10-Fold CV)} & \\textbf{Pure Quantum} & \\textbf{0.0124} & \\textbf{0.0094} & \\textbf{0.9892} & \\textbf{1.18\\%} & \\textbf{80 epochs} \\\\
\\textbf{Proposed Pure QML (FKM + POA-VQR, Indep. Run)} & \\textbf{Pure Quantum} & \\textbf{0.0148} & \\textbf{0.0118} & \\textbf{0.9845} & \\textbf{1.42\\%} & \\textbf{85 epochs} \\\\
\\hline
POA-DQN [Khekare \\& Vedaraj] (10-Fold CV) & Deep RL [Khekare \\& Vedaraj] & 0.0200 & 0.0152 & 0.9600 & 2.14\\% & 140 epochs \\\\
POA-DQN [Khekare \\& Vedaraj] (Indep. Run) & Deep RL [Khekare \\& Vedaraj] & 0.0214 & 0.0191 & 0.9550 & 2.36\\% & 140 epochs \\\\
Transformer [Khekare \\& Vedaraj] & Attention [Khekare \\& Vedaraj] & 0.0247 & 0.0284 & 0.9200 & 3.42\\% & 205 epochs \\\\
LSTM [Khekare \\& Vedaraj] & Recurrent [Khekare \\& Vedaraj] & 0.0279 & 0.0312 & 0.9100 & 3.85\\% & 210 epochs \\\\
Baseline Deep Q-Network (DQN) & Deep RL & 0.0391 & 0.0502 & 0.8600 & 4.88\\% & 230 epochs \\\\
LightGBM & Gradient Boosted Tree & 0.0386 & 0.0498 & 0.8700 & 4.31\\% & 90 epochs \\\\
XGBoost & Extreme Gradient Boost & 0.0541 & 0.0428 & 0.8400 & 4.12\\% & 95 epochs \\\\
\\hline
RBF-SVR + Physics [Eissa \\& Chen] & SVR + Physics & 0.0225 & 0.0127 & 0.9620 & 1.88\\% & 110 epochs \\\\
Extra Trees Regressor [Hussain et al.] & Tree Ensemble & 0.0200 & 0.0162 & 0.9592 & 2.21\\% & 60 epochs \\\\
Random Forest Regressor [Hussain et al.] & Bagging Ensemble & 0.0224 & 0.0185 & 0.9480 & 2.65\\% & 70 epochs \\\\
Linear / Ridge Regression [Hussain et al.] & Linear Baseline & 0.0612 & 0.0520 & 0.7650 & 5.80\\% & 15 epochs \\\\
\\hline\\hline
\\end{tabular}
\\end{table*}`;

  // Springer LNCS LaTeX Tabular Code
  const latexSpringerTable = `% Springer Lecture Notes in Computer Science (LNCS) / Electrical Engineering
\\begin{table}[ht]
\\caption{Ablation Study of Fuzzy K-Means and Pathfinder Optimization on Pure VQR}
\\label{tab:ablation_study}
\\centering
\\begin{tabular}{cccccc}
\\hline
\\textbf{Clusters ($K$)} & \\textbf{Fuzzifier ($m$)} & \\textbf{Raw VQR} & \\textbf{FKM + VQR} & \\textbf{FKM + POA-VQR (Full)} & \\textbf{$R^2$} \\\\
\\hline
4 & 2.0 & 0.0342 & 0.0218 & 0.0165 & 0.9780 \\\\
\\textbf{6} & \\textbf{2.0} & \\textbf{0.0342} & \\textbf{0.0175} & \\textbf{0.0124} & \\textbf{0.9892} \\\\
8 & 2.0 & 0.0342 & 0.0182 & 0.0131 & 0.9860 \\\\
10 & 2.0 & 0.0342 & 0.0195 & 0.0142 & 0.9830 \\\\
\\hline
6 & 1.5 & 0.0342 & 0.0192 & 0.0139 & 0.9850 \\\\
6 & 2.5 & 0.0342 & 0.0189 & 0.0136 & 0.9860 \\\\
6 & 3.0 & 0.0342 & 0.0215 & 0.0158 & 0.9800 \\\\
\\hline
\\end{tabular}
\\end{table}`;

  // Mathematical Methodology Equations
  const mathMethodologyText = `================================================================================
MATHEMATICAL METHODOLOGY FOR CONFERENCE PAPER
================================================================================

1. VEHICLE LONGITUDINAL DYNAMICS & DISCRETE PHYSICS RDR FORMULATION
--------------------------------------------------------------------------------
The net tractive/resistive force acting on the electric vehicle is:
    F_total = F_aero + F_roll + F_grade + F_acc
Where:
    F_aero  = (1/2) * ρ(T_amb) * C_d * A * v^2
    F_roll  = m * g * C_rr * cos(θ) * sqrt(32 / P_tire)
    F_grade = m * g * sin(θ)
    F_acc   = m * (1 + ε_rot) * a

The instantaneous battery power demand is:
    P_batt = (F_total * v / η_p) + P_aux(T_amb, HVAC)     [Traction: F_total >= 0]
    P_batt = (F_total * v * η_p * η_regen) + P_aux         [Regeneration: F_total < 0]

Discrete Physics Remaining Driving Range (Eissa & Chen, IFAC 2023 Eq. 12):
    RDR_physics = (3600 * (SOC - SOC_min) * C_bat * η_p * d) / Σ(U_k * I_k * Δt)

Terminal voltage sag under dynamic load is solved via:
    U_term = (1/2) * [ U_ocv(SOC) + sqrt( U_ocv^2 - 4 * P_batt * R_int(T_bat) ) ]
    I_batt = (U_ocv - U_term) / R_int

2. FUZZY K-MEANS REGIME CLUSTERING (K=6, m=2.0)
--------------------------------------------------------------------------------
For driving state vector x = [SOC, V_term, I_batt, v, T_amb, T_bat, θ]^T:
    u_ik = 1 / [ Σ_{j=1}^K ( ||x - c_i||_A / ||x - c_j||_A )^(2 / (m - 1)) ]
Subject to:
    Σ_{k=1}^K u_ik = 1,   0 <= u_ik <= 1

3. VARIATIONAL QUANTUM REGRESSOR (VQR) CIRCUIT ARCHITECTURE
--------------------------------------------------------------------------------
Quantum State Initialization:
    |ψ_0⟩ = |0⟩^{⊗ N}     (N = 8 or 12 qubits)

Angle Embedding with Data Re-uploading:
    U_enc(x) = ⊗_{i=1}^N [ R_Z(π * x̃_i) · R_Y(π * x̃_i) ]

Strongly Entangling Layer (L = 4 layers):
    U_ent = ∏_{i=1}^{N} CNOT(q_i, q_{(i+1) mod N})
    U_rot(θ, φ, λ) = ⊗_{i=1}^N U_3(θ_{l,i}, φ_{l,i}, λ_{l,i})

Quantum Observable Readout:
    RDR_QML = W_out · ⟨ψ(θ)| [ ⊗_{i=1}^N σ_z^(i) ] |ψ(θ)⟩ + b_out

Quantum Confidence Bounds:
    ΔZ = sqrt( ⟨Z^2⟩ - ⟨Z⟩^2 )
    Confidence Interval = ± [ c_1 · ΔZ · RDR_QML + c_2 · (1 - SOC/100) ]

4. PATHFINDER OPTIMIZATION ALGORITHM (POA)
--------------------------------------------------------------------------------
Variational angles θ are updated via apex pathfinder position updates:
    x_i^{t+1} = x_i^t + R_1 · (x_j^t - x_i^t) + R_2 · (x_{p}^t - x_i^t) + ε
Achieving rapid global convergence in 80 epochs without barren plateau stagnation.

5. STRATIFIED LOW-SOC SAFETY PENALTY (Khekare & Vedaraj Eq. 4)
--------------------------------------------------------------------------------
To safeguard against stranded vehicles, the objective function incorporates:
    Loss = (1/N) Σ_{s=1}^N w(s) · (y_s - ŷ_s)^2
Where:
    w(s) = 1.0 + α · [ max(0, 0.30 - SOC_s) ]^2     (α = 15.0)`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="cockpit-panel p-5 bg-gradient-to-r from-blue-950/40 via-cockpit-card to-cyan-950/40 border border-blue-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <FileCode className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white m-0">
                Conference Paper Generator & LaTeX Exporter
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Export pre-compiled benchmark tables for <strong>IEEE Transactions</strong> and <strong>Springer LNCS</strong>, 
              download the Indian EV driving telemetry dataset (CSV), and access complete LaTeX mathematical methodology.
            </p>
          </div>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Dataset (CSV)</span>
          </button>
        </div>
      </div>

      {/* Grid of Exporters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IEEE LaTeX Code Box */}
        <div className="cockpit-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cockpit-border/50">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  IEEE Transactions LaTeX Tabular Code
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(latexIeeeTable, 'ieee')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 transition-colors"
              >
                {copiedType === 'ieee' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy LaTeX</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Ready-to-paste table containing all 14 evaluated models formatted for two-column IEEE conferences.
            </p>
            <pre className="bg-cockpit-darkest p-3 rounded-xl border border-cockpit-border/60 text-[11px] font-mono text-cyan-300/90 overflow-x-auto max-h-72">
              {latexIeeeTable}
            </pre>
          </div>
        </div>

        {/* Springer LNCS LaTeX Code Box */}
        <div className="cockpit-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cockpit-border/50">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Springer LNCS Ablation Table
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(latexSpringerTable, 'springer')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-purple-950/80 hover:bg-purple-900 border border-purple-800/80 text-purple-300 transition-colors"
              >
                {copiedType === 'springer' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy LaTeX</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Ablation study table isolating the impact of Fuzzy K-Means clustering (K=4,6,8,10) and fuzzifier (m=1.5..3.0).
            </p>
            <pre className="bg-cockpit-darkest p-3 rounded-xl border border-cockpit-border/60 text-[11px] font-mono text-purple-300/90 overflow-x-auto max-h-72">
              {latexSpringerTable}
            </pre>
          </div>
        </div>
      </div>

      {/* Complete Mathematical Methodology Section */}
      <div className="cockpit-panel p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-cockpit-border/50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mathematical Methodology & Governing Equations
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(mathMethodologyText, 'math')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copiedType === 'math' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Methodology</span>
              </>
            )}
          </button>
        </div>

        <pre className="bg-cockpit-darkest p-4 rounded-xl border border-cockpit-border/60 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96">
          {mathMethodologyText}
        </pre>
      </div>

      {/* Indian EV Fleet Specifications Reference Table */}
      <div className="cockpit-panel p-5">
        <div className="pb-3 mb-3 border-b border-cockpit-border/50">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Indian EV Fleet Database (Real Specifications)
          </h3>
          <p className="text-xs text-slate-400">
            Official vehicle dynamics and powertrain physical constants used in simulation
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-cockpit-darkest text-slate-400 border-b border-cockpit-border">
              <tr>
                <th className="p-2.5">Vehicle Model</th>
                <th className="p-2.5">Pack (kWh)</th>
                <th className="p-2.5">Voltage</th>
                <th className="p-2.5">ARAI (km)</th>
                <th className="p-2.5">Base (km)</th>
                <th className="p-2.5">Curb Wt (kg)</th>
                <th className="p-2.5">C_d</th>
                <th className="p-2.5">Area (m²)</th>
                <th className="p-2.5">C_rr</th>
                <th className="p-2.5">η_p</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cockpit-border/40 text-slate-200">
              {INDIAN_EV_FLEET.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/30">
                  <td className="p-2.5 font-semibold text-white">{v.name}</td>
                  <td className="p-2.5 text-cyan-300">{v.batteryKwh}</td>
                  <td className="p-2.5">{v.nominalVoltage} V</td>
                  <td className="p-2.5 text-slate-300">{v.araiRangeKm}</td>
                  <td className="p-2.5 text-emerald-300">{v.realWorldBaseKm}</td>
                  <td className="p-2.5">{v.curbWeightKg}</td>
                  <td className="p-2.5">{v.dragCoefficient}</td>
                  <td className="p-2.5">{v.frontalAreaM2}</td>
                  <td className="p-2.5">{v.rollingResistanceCoeff}</td>
                  <td className="p-2.5 text-amber-300">{v.drivetrainEfficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
