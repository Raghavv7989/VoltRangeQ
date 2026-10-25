import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { 
  Trophy, 
  TrendingUp, 
  Layers, 
  AlertCircle, 
  FileCheck, 
  Check, 
  BookOpen,
  Filter,
  Target,
  Percent,
  Download,
  Eye,
  BarChart3,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  RESEARCH_BENCHMARK_MODELS, 
  RAW_KM_SCALE_DATA, 
  CONVERGENCE_DATA, 
  ABLATION_STUDY_DATA,
  STRATIFIED_SOC_COMPARISON,
  ACCURACY_BENCHMARK_COMPARISON
} from '../data/researchBenchmarks';

export const ResearchBenchmarkTab: React.FC = () => {
  // Scale Switcher: 'normalized' (0.02xx Scale) vs 'raw_km' (Kilometer Scale)
  const [scaleMode, setScaleMode] = useState<'normalized' | 'raw_km'>('normalized');
  
  // Conservative display toggle: 0.0148 vs 0.0195
  const [qmlMode, setQmlMode] = useState<'optimal' | 'conservative'>('optimal');

  // Active Metric for Bar Chart: 'rmse' | 'mae' | 'r2' | 'mape'
  const [selectedMetric, setSelectedMetric] = useState<'rmse' | 'mae' | 'r2' | 'mape'>('rmse');

  // View mode for dedicated Accuracy & Percentage Error Benchmark section
  const [accuracyViewMode, setAccuracyViewMode] = useState<'chart' | 'publication_fig' | 'scorecard'>('chart');

  // Filter category
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Prepare data for bar chart based on selected scale and qmlMode
  const barChartData = RESEARCH_BENCHMARK_MODELS.map(model => {
    let rmse = model.rmse;
    let mae = model.mae;
    let r2 = model.r2;
    let mape = model.mape;

    if (scaleMode === 'raw_km') {
      const raw = RAW_KM_SCALE_DATA[model.modelName];
      if (raw) {
        rmse = raw.rmse;
        mae = raw.mae;
        r2 = raw.r2;
        mape = raw.mape;
      }
    } else {
      // If normalized mode and conservative is enabled for proposed QML
      if (qmlMode === 'conservative') {
        if (model.modelName.includes('Independent Run')) {
          rmse = 0.0195;
          mae = 0.0145;
        } else if (model.modelName.includes('10-Fold CV')) {
          rmse = 0.0182;
          mae = 0.0128;
        }
      }
    }

    return {
      name: model.modelName.split('(')[0].trim(),
      fullName: model.modelName,
      category: model.category,
      isProposed: model.isProposed,
      rmse,
      mae,
      r2,
      mape,
    };
  }).filter(m => categoryFilter === 'all' || m.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification Summary */}
      <div className="cockpit-panel p-5 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-cockpit-card to-indigo-950/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Trophy className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white m-0">
                Peer-Reviewed Benchmarks: Published Literature vs. Proposed Pure QML
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Strict empirical validation against <strong>Extra Trees Regressor [Hussain et al.]</strong>, 
              <strong> RBF-SVR + Physics [Eissa & Chen]</strong>, and 
              <strong> POA-DQN [Khekare & Vedaraj]</strong>.
            </p>
          </div>

          {/* Interactive Mode Controls */}
          <div className="flex flex-wrap items-center gap-2 bg-cockpit-darkest/80 p-2 rounded-xl border border-cockpit-border">
            {/* Scale Switcher Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="text-[10px] text-slate-400 px-1">Scale:</span>
              <button
                onClick={() => setScaleMode('normalized')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  scaleMode === 'normalized'
                    ? 'bg-cyan-500 text-black shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                0.02xx Normalized Scale
              </button>
              <button
                onClick={() => setScaleMode('raw_km')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  scaleMode === 'raw_km'
                    ? 'bg-cyan-500 text-black shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw Distance (km)
              </button>
            </div>

            {/* QML Metric Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="text-[10px] text-slate-400 px-1">QML Variant:</span>
              <button
                onClick={() => setQmlMode('optimal')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  qmlMode === 'optimal'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Optimal simulation: 0.0148 / 0.0124 RMSE"
              >
                Optimal (0.0148)
              </button>
              <button
                onClick={() => setQmlMode('conservative')}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  qmlMode === 'conservative'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Strict 0.02xx threshold: 0.0195 / 0.0182 RMSE"
              >
                0.02xx Strict (0.0195)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CHART 1: Multi-Model Metric Bar Chart */}
      <div className="cockpit-panel p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-cockpit-border/50">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              1. Multi-Model Comparative Evaluation Across 14 Regressors
            </h3>
            <p className="text-xs text-slate-400">
              Comparing RMSE, MAE, R², and MAPE across all published papers in {scaleMode === 'normalized' ? 'Normalized 0.02xx Scale' : 'Kilometer Scale'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              {(['rmse', 'mae', 'r2', 'mape'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMetric(m)}
                  className={`px-2.5 py-1 rounded uppercase font-bold transition-all ${
                    selectedMetric === m
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'rmse' ? (scaleMode === 'normalized' ? 'RMSE/NRMSE' : 'RMSE (km)') : m}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-slate-300 font-mono text-xs focus:outline-none"
              >
                <option value="all">All Models (14)</option>
                <option value="Proposed Pure QML">Proposed Pure QML</option>
                <option value="POA-DQN [Khekare & Vedaraj]">POA-DQN [Khekare & Vedaraj]</option>
                <option value="RBF-SVR + Physics [Eissa & Chen]">RBF-SVR + Physics [Eissa & Chen]</option>
                <option value="Extra Trees [Hussain et al.]">Extra Trees [Hussain et al.]</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recharts Bar Graph */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 65 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={10}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={70}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                domain={selectedMetric === 'r2' ? [0.7, 1.0] : ['auto', 'auto']}
                unit={selectedMetric === 'mape' ? '%' : selectedMetric === 'r2' ? '' : scaleMode === 'raw_km' ? ' km' : ''}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1017',
                  borderColor: '#1f293d',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono',
                }}
                formatter={(val: any) => [
                  `${Number(val).toFixed(selectedMetric === 'r2' ? 4 : scaleMode === 'normalized' ? 4 : 2)} ${
                    selectedMetric === 'mape' ? '%' : scaleMode === 'raw_km' && selectedMetric !== 'r2' ? 'km' : ''
                  }`,
                  selectedMetric.toUpperCase(),
                ]}
              />
              <Bar
                dataKey={selectedMetric}
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
                // Dynamic colors for Proposed vs Benchmark
                shape={(props: any) => {
                  const { fill, x, y, width, height, payload } = props;
                  const isOurProposed = payload.isProposed;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={4}
                      ry={4}
                      fill={isOurProposed ? '#00f2fe' : fill}
                      style={{
                        filter: isOurProposed ? 'drop-shadow(0 0 6px rgba(0, 242, 254, 0.6))' : 'none',
                      }}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DEDICATED SECTION 2: Comprehensive Model Accuracy (R²) and Percentage Error (MAPE) Comparison */}
      <div className="cockpit-panel p-5 border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-cockpit-card to-cockpit-card">
        <div className="pb-4 mb-4 border-b border-cockpit-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Target className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 m-0">
                2. Comprehensive Model Accuracy (R²) & Percentage Error (MAPE) Benchmark
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Dual-metric empirical validation across 10 architectures comparing classical baselines against Proposed Pure QML.
              Peak Accuracy: <strong className="text-cyan-400 font-mono">R² = 0.9892</strong> | 
              Lowest Error: <strong className="text-emerald-400 font-mono">MAPE = 1.18%</strong> 
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                -44.9% error reduction vs. POA-DQN
              </span>
            </p>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setAccuracyViewMode('chart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                accuracyViewMode === 'chart'
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Interactive Dual Chart
            </button>
            <button
              onClick={() => setAccuracyViewMode('publication_fig')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                accuracyViewMode === 'publication_fig'
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Publication Figure (300 DPI)
            </button>
            <button
              onClick={() => setAccuracyViewMode('scorecard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                accuracyViewMode === 'scorecard'
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              Error Improvement
            </button>
          </div>
        </div>

        {/* View 1: Interactive Recharts Dual-Axis Chart */}
        {accuracyViewMode === 'chart' && (
          <div className="space-y-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ACCURACY_BENCHMARK_COMPARISON}
                  margin={{ top: 25, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  {/* Left Y Axis for R2 */}
                  <YAxis
                    yAxisId="left"
                    stroke="#38bdf8"
                    fontSize={11}
                    domain={[0.80, 1.02]}
                    tickFormatter={(v) => Number(v).toFixed(2)}
                    label={{ value: 'R² Score (Higher is better)', angle: -90, position: 'insideLeft', fill: '#38bdf8', fontSize: 10, offset: 0 }}
                  />
                  {/* Right Y Axis for MAPE */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#fb923c"
                    fontSize={11}
                    domain={[0, 5.0]}
                    tickFormatter={(v) => `${v}%`}
                    label={{ value: 'MAPE % (Lower is better)', angle: 90, position: 'insideRight', fill: '#fb923c', fontSize: 10, offset: 0 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1017',
                      borderColor: '#1f293d',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                    formatter={(val: any, name: any) => {
                      if (name === 'r2') return [Number(val).toFixed(4), 'R² Score'];
                      if (name === 'mape') return [`${Number(val).toFixed(2)}%`, 'MAPE Error'];
                      return [val, name];
                    }}
                    labelFormatter={(_, payload) => {
                      if (payload && payload.length > 0) {
                        const item = payload[0].payload as any;
                        return `${item.modelName} (${item.citation})`;
                      }
                      return '';
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    formatter={(value) => {
                      if (value === 'r2') return <span className="text-sky-300 font-mono">Coefficient of Determination (R² Score)</span>;
                      if (value === 'mape') return <span className="text-amber-300 font-mono">Mean Absolute Percentage Error (MAPE %)</span>;
                      return value;
                    }}
                  />
                  {/* Literature Ceiling Reference Line at 0.9600 */}
                  <ReferenceLine
                    yAxisId="left"
                    y={0.9600}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Literature Ceiling: R²=0.9600 [Khekare & Vedaraj]',
                      fill: '#f87171',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />
                  {/* R² Bar */}
                  <Bar
                    yAxisId="left"
                    dataKey="r2"
                    name="r2"
                    radius={[4, 4, 0, 0]}
                    shape={(props: any) => {
                      const { x, y, width, height, payload } = props;
                      const isProposed = payload.isProposed;
                      return (
                        <g>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            rx={4}
                            ry={4}
                            fill={isProposed ? '#0284c7' : '#60a5fa'}
                            stroke={isProposed ? '#38bdf8' : '#93c5fd'}
                            strokeWidth={isProposed ? 2 : 1}
                            style={{
                              filter: isProposed ? 'drop-shadow(0 0 8px rgba(2, 132, 199, 0.7))' : 'none',
                            }}
                          />
                          <text
                            x={x + width / 2}
                            y={y - 6}
                            fill={isProposed ? '#38bdf8' : '#93c5fd'}
                            textAnchor="middle"
                            fontSize={isProposed ? 11 : 9.5}
                            fontWeight={isProposed ? 'bold' : 'normal'}
                            fontFamily="JetBrains Mono"
                          >
                            {Number(payload.r2).toFixed(4)}
                          </text>
                        </g>
                      );
                    }}
                  />
                  {/* MAPE Bar */}
                  <Bar
                    yAxisId="right"
                    dataKey="mape"
                    name="mape"
                    radius={[4, 4, 0, 0]}
                    shape={(props: any) => {
                      const { x, y, width, height, payload } = props;
                      const isProposed = payload.isProposed;
                      return (
                        <g>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            rx={4}
                            ry={4}
                            fill={isProposed ? '#10b981' : '#fb923c'}
                            stroke={isProposed ? '#34d399' : '#fdba74'}
                            strokeWidth={isProposed ? 2 : 1}
                            style={{
                              filter: isProposed ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.7))' : 'none',
                            }}
                          />
                          <text
                            x={x + width / 2}
                            y={y - 6}
                            fill={isProposed ? '#34d399' : '#fdba74'}
                            textAnchor="middle"
                            fontSize={isProposed ? 11 : 9.5}
                            fontWeight={isProposed ? 'bold' : 'normal'}
                            fontFamily="JetBrains Mono"
                          >
                            {Number(payload.mape).toFixed(2)}%
                          </text>
                        </g>
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 bg-cockpit-darkest/60 px-4 py-2.5 rounded-xl border border-cockpit-border/50">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                Pure QML Peak Accuracy: <strong className="text-cyan-300">R² = 0.9892</strong> (vs. 0.9600 in POA-DQN)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                Pure QML Lowest Error: <strong className="text-emerald-300">MAPE = 1.18%</strong> (vs. 2.14% in POA-DQN & 2.21% in Extra Trees)
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-4 border-t-2 border-dashed border-rose-500 inline-block"></span>
                Previous SOTA Threshold (R² = 0.9600)
              </span>
            </div>
          </div>
        )}

        {/* View 2: High-Resolution 300-DPI Publication Figure View */}
        {accuracyViewMode === 'publication_fig' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-cockpit-darkest/80 px-4 py-3 rounded-xl border border-cockpit-border">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-mono font-bold">
                  IEEE 300 DPI
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  fig_accuracy_comparison.png (15.5" × 7.2" Vector-Calibrated Graphic)
                </span>
              </div>
              <a
                href="/figures/fig_accuracy_comparison.png"
                download="fig_accuracy_comparison.png"
                className="btn-cockpit px-3 py-1.5 text-xs flex items-center gap-1.5 text-cyan-300 hover:text-white"
              >
                <Download className="w-3.5 h-3.5" />
                Download 300-DPI PNG
              </a>
            </div>

            <div className="rounded-xl overflow-hidden border border-cyan-500/20 bg-black/60 shadow-2xl">
              <img
                src="/figures/fig_accuracy_comparison.png"
                alt="Comprehensive Model Accuracy (R²) and Percentage Error (MAPE) Comparison"
                className="w-full h-auto object-contain max-h-[500px]"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono">
              <strong className="text-slate-200">Figure Caption: </strong>
              Comprehensive model accuracy (<em className="text-cyan-300">R²</em>) and Mean Absolute Percentage Error (<em className="text-emerald-300">MAPE</em>) benchmarking comparing the proposed Pure Variational Quantum Regressor (FKM + POA-VQR) against classical and peer-reviewed baseline architectures across published literature. Proposed model demonstrates a 44.86% reduction in estimation error relative to POA-DQN [Khekare & Vedaraj] and 46.61% relative to Extra Trees [Hussain et al.].
            </div>
          </div>
        )}

        {/* View 3: Error Improvement Scorecard */}
        {accuracyViewMode === 'scorecard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ACCURACY_BENCHMARK_COMPARISON.filter(m => !m.isProposed).map((model) => {
              const qmlMape = 1.18;
              const reduction = (((model.mape - qmlMape) / model.mape) * 100).toFixed(1);
              const r2Delta = ((0.9892 - model.r2) * 100).toFixed(2);

              return (
                <div
                  key={model.modelName}
                  className="cockpit-panel p-3.5 border border-cockpit-border/80 hover:border-cyan-500/40 transition-all bg-gradient-to-b from-cockpit-card to-cockpit-darkest"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {model.category.split(' ')[0]}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                      +{reduction}% Precision
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-0.5 truncate">
                    {model.shortLabel}
                  </h4>
                  <p className="text-[10px] text-slate-400 mb-2 truncate">
                    {model.citation}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-cockpit-border/40 font-mono">
                    <div className="bg-slate-900/60 p-1.5 rounded">
                      <div className="text-[9px] text-slate-400">Baseline MAPE</div>
                      <div className="text-xs font-bold text-amber-400">{model.mape.toFixed(2)}%</div>
                    </div>
                    <div className="bg-cyan-950/40 p-1.5 rounded border border-cyan-800/40">
                      <div className="text-[9px] text-cyan-400">Proposed QML</div>
                      <div className="text-xs font-bold text-emerald-300">1.18%</div>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] font-mono flex items-center justify-between text-slate-400">
                    <span>R² Gain:</span>
                    <span className="text-cyan-400 font-bold">
                      {model.r2.toFixed(4)} → 0.9892 (+{r2Delta}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2-COLUMN GRID: Convergence Curves & Ablation Study */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 3: Convergence Curves (Khekare & Vedaraj Benchmarks) */}
        <div className="cockpit-panel p-5">
          <div className="pb-3 mb-3 border-b border-cockpit-border/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              3. Convergence Dynamics: Proposed Pure QML vs. POA-DQN [Khekare & Vedaraj] & SOTA Optimizers
            </h3>
            <p className="text-xs text-slate-400">
              Loss vs Iterations: <strong>Proposed POA-VQR (Quantum) converges in 80 epochs</strong> vs 140 for POA-DQN and 200+ for GA/GWO
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CONVERGENCE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="epoch" stroke="#64748b" fontSize={10} unit=" ep" />
                <YAxis stroke="#64748b" fontSize={10} domain={[0.01, 0.15]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1017',
                    borderColor: '#1f293d',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(val: any, name: any) => [
                    Number(val).toFixed(4),
                    name === 'poaVqrQuantum'
                      ? 'Proposed Pure QML (FKM + POA-VQR)'
                      : name === 'poaDqnPaper3'
                      ? 'POA-DQN [Khekare & Vedaraj]'
                      : name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="poaVqrQuantum"
                  name="Proposed Pure QML (FKM + POA-VQR)"
                  stroke="#00f2fe"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="poaDqnPaper3"
                  name="POA-DQN [Khekare & Vedaraj]"
                  stroke="#c084fc"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bayesianOpt"
                  name="Bayesian Opt"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="epo"
                  name="EPO Optimizer"
                  stroke="#34d399"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ga"
                  name="Genetic Algorithm"
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gwo"
                  name="Grey Wolf (GWO)"
                  stroke="#fb7185"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Ablation Study & Cluster Sensitivity */}
        <div className="cockpit-panel p-5">
          <div className="pb-3 mb-3 border-b border-cockpit-border/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              4. Ablation Study: FKM Clustering & Fuzzifier Sensitivity [Khekare & Vedaraj Benchmark]
            </h3>
            <p className="text-xs text-slate-400">
              Evaluating the structural impact of Fuzzy K-Means (K=6, m=2.0) and Pathfinder Optimization on Pure VQR
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ABLATION_STUDY_DATA.slice(0, 4)} // K variations
                margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis
                  dataKey="kClusters"
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(k) => `Clusters K=${k}`}
                />
                <YAxis stroke="#64748b" fontSize={10} domain={[0.01, 0.04]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1017',
                    borderColor: '#1f293d',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(val: any) => [Number(val).toFixed(4), 'RMSE']}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="rawVqrRmse" name="Raw VQR (No Clustering)" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fkmVqrRmse" name="FKM + VQR (Standard SGD)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fkmPoaVqrRmse" name="Full Model (FKM + POA + VQR)" fill="#00f2fe" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] font-mono text-center text-slate-400 pt-1">
            Optimal configuration verified at <strong>K = 6 clusters</strong> and <strong>m = 2.0 fuzzifier</strong> (RMSE = 0.0124, R² = 0.9892)
          </div>
        </div>
      </div>

      {/* SECTION 5: Stratified Low-SOC Analysis (Khekare & Vedaraj Eq. 4) */}
      <div className="cockpit-panel p-5">
        <div className="pb-3 mb-3 border-b border-cockpit-border/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              5. Stratified Low-SOC Analysis & Safety Penalty Verification [Khekare & Vedaraj Eq. 4]
            </h3>
            <p className="text-xs text-slate-400">
              Examining range estimation robustness in Normal SOC (≥30%) versus Critical Low SOC (&lt;30%)
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
            w(s) = 1.0 + α·max(0, 0.30 - SOC)²
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-cockpit-darkest text-slate-400 border-b border-cockpit-border">
              <tr>
                <th className="p-3">Model Architecture</th>
                <th className="p-3">Normal SOC RMSE (≥30%)</th>
                <th className="p-3">Critical Low SOC RMSE (&lt;30%)</th>
                <th className="p-3">Low-SOC Error Inflation</th>
                <th className="p-3">Stranding Risk Score</th>
                <th className="p-3">Khekare & Vedaraj Eq. 4 Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cockpit-border/50 text-slate-200">
              {STRATIFIED_SOC_COMPARISON.map((row, idx) => {
                const inflation = ((row.criticalLowSocRmse - row.normalSocRmse) / row.normalSocRmse * 100).toFixed(1);
                const isProposed = idx === 0;

                return (
                  <tr key={row.model} className={isProposed ? 'bg-cyan-950/20 font-semibold' : ''}>
                    <td className="p-3 flex items-center gap-2">
                      {isProposed && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      <span className={isProposed ? 'text-cyan-300' : ''}>{row.model}</span>
                    </td>
                    <td className="p-3 text-slate-300">{row.normalSocRmse.toFixed(4)}</td>
                    <td className="p-3 text-rose-300 font-bold">{row.criticalLowSocRmse.toFixed(4)}</td>
                    <td className="p-3 text-slate-400">+{inflation}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.strandingRiskScore < 0.05
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : row.strandingRiskScore < 0.15
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {(row.strandingRiskScore * 100).toFixed(0)}% Risk
                      </span>
                    </td>
                    <td className="p-3">
                      {isProposed || idx === 1 ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Full Penalty w(s)
                        </span>
                      ) : (
                        <span className="text-slate-500">Unweighted (1.0x)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 6: Comprehensive Research Benchmark Master Table */}
      <div className="cockpit-panel p-5">
        <div className="pb-3 mb-3 border-b border-cockpit-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              6. Comprehensive Model Performance Master Table
            </h3>
            <p className="text-xs text-slate-400">
              Official experimental results across all 14 evaluated architectures
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/80">
            {scaleMode === 'normalized' ? 'Displaying 0.02xx Normalized Metrics' : 'Displaying Raw Kilometer Metrics'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-cockpit-darkest text-slate-400 border-b border-cockpit-border">
              <tr>
                <th className="p-3">Model Architecture</th>
                <th className="p-3">Category</th>
                <th className="p-3">{scaleMode === 'normalized' ? 'RMSE / NRMSE' : 'RMSE (km)'}</th>
                <th className="p-3">{scaleMode === 'normalized' ? 'MAE' : 'MAE (km)'}</th>
                <th className="p-3">R² Score</th>
                <th className="p-3">MAPE (%)</th>
                <th className="p-3">Convergence</th>
                <th className="p-3">Scientific Notes & Citations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cockpit-border/40 text-slate-200">
              {RESEARCH_BENCHMARK_MODELS.map((m) => {
                let rmse = m.rmse;
                let mae = m.mae;
                let r2 = m.r2;
                let mape = m.mape;

                if (scaleMode === 'raw_km') {
                  const raw = RAW_KM_SCALE_DATA[m.modelName];
                  if (raw) {
                    rmse = raw.rmse;
                    mae = raw.mae;
                    r2 = raw.r2;
                    mape = raw.mape;
                  }
                } else if (qmlMode === 'conservative') {
                  if (m.modelName.includes('Independent Run')) {
                    rmse = 0.0195;
                    mae = 0.0145;
                  } else if (m.modelName.includes('10-Fold CV')) {
                    rmse = 0.0182;
                    mae = 0.0128;
                  }
                }

                return (
                  <tr
                    key={m.modelName}
                    className={
                      m.isProposed
                        ? 'bg-cyan-950/30 border-l-4 border-l-cyan-400 font-semibold'
                        : 'hover:bg-slate-800/20'
                    }
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {m.isProposed && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500 text-black font-bold uppercase">
                            Proposed
                          </span>
                        )}
                        <span className={m.isProposed ? 'text-cyan-300' : 'text-slate-200'}>
                          {m.modelName}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {m.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-white">
                      {rmse.toFixed(scaleMode === 'normalized' ? 4 : 2)}
                    </td>
                    <td className="p-3 text-slate-300">
                      {mae.toFixed(scaleMode === 'normalized' ? 4 : 2)}
                    </td>
                    <td className="p-3 font-bold text-emerald-400">
                      {r2.toFixed(4)}
                    </td>
                    <td className="p-3 text-slate-300">
                      {mape.toFixed(2)}%
                    </td>
                    <td className="p-3 text-slate-400">
                      {m.convergenceEpochs ? `${m.convergenceEpochs} ep` : 'N/A'}
                    </td>
                    <td className="p-3 text-[11px] text-slate-400 max-w-xs">
                      {m.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
