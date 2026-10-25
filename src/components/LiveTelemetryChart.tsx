import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Activity } from 'lucide-react';

export interface TelemetryHistoryPoint {
  timeSec: number;
  actualRange: number;
  qmlRange: number;
  dqnRange: number;
  svrRange: number;
  speed: number;
}

interface LiveTelemetryChartProps {
  history: TelemetryHistoryPoint[];
}

export const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({ history }) => {
  return (
    <div className="cockpit-panel p-4 mt-4">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-cockpit-border/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Live Dynamic Tracking: Proposed Pure QML vs. POA-DQN [Khekare & Vedaraj] vs. RBF-SVR + Physics [Eissa & Chen]
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Tracking last {history.length} simulation steps
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
            <XAxis
              dataKey="timeSec"
              stroke="#64748b"
              fontSize={10}
              tickFormatter={(val) => `${val}s`}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              domain={['auto', 'auto']}
              unit=" km"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0c1017',
                borderColor: '#1f293d',
                borderRadius: '0.75rem',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
              }}
              formatter={(value: any, name: any) => [
                `${Number(value).toFixed(1)} km`,
                name === 'qmlRange'
                  ? 'Proposed Pure QML (FKM + POA-VQR)'
                  : name === 'dqnRange'
                  ? 'POA-DQN [Khekare & Vedaraj]'
                  : name === 'svrRange'
                  ? 'RBF-SVR + Physics [Eissa & Chen]'
                  : 'Physics Ground Truth',
              ]}
              labelFormatter={(label) => `Time: ${label}s`}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              formatter={(value) => {
                if (value === 'qmlRange') return <span className="text-cyan-400 font-semibold">Proposed Pure QML (FKM + POA-VQR)</span>;
                if (value === 'dqnRange') return <span className="text-purple-400 font-medium">POA-DQN [Khekare & Vedaraj]</span>;
                if (value === 'svrRange') return <span className="text-emerald-400 font-medium">RBF-SVR + Physics [Eissa & Chen]</span>;
                return <span className="text-slate-300">Physics Ground Truth</span>;
              }}
            />
            <Line
              type="monotone"
              dataKey="actualRange"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="qmlRange"
              stroke="#00f2fe"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="dqnRange"
              stroke="#c084fc"
              strokeWidth={1.8}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="svrRange"
              stroke="#34d399"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
