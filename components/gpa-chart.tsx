"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

interface ChartDataPoint {
  name: string;
  "Semester GPA": number;
  CGPA: number;
}

interface GPAChartProps {
  data: ChartDataPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm">
      <p className="text-xs text-muted mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-mono font-bold" style={{ color: p.color }}>
          {p.name}: {parseFloat(String(p.value)).toFixed(2)}
        </p>
      ))}
    </div>
  );
}

export function GPAChart({ data }: GPAChartProps) {
  if (data.length < 2) {
    return (
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">
              GPA Progression
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Semester GPA vs Cumulative GPA
            </p>
          </div>
        </div>
        <div className="p-10 text-center text-muted text-sm">
          <div className="text-4xl mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 mx-auto text-muted"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          Add at least two semesters to see your GPA trend
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">
            GPA Progression
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Semester GPA vs Cumulative GPA
          </p>
        </div>
      </div>
      <div className="p-5">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0057FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0057FF" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C4B4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C4B4" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#0E3080" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#5B7BAE", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 4]}
                tick={{ fill: "#5B7BAE", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#8AAAD4" }} />
              <ReferenceLine
                y={3.6}
                stroke="rgba(0,196,180,0.3)"
                strokeDasharray="4 4"
                label={{ value: "1st Class", fill: "#00C4B4", fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="Semester GPA"
                stroke="#0057FF"
                strokeWidth={2.5}
                fill="url(#gradBlue)"
                dot={{ r: 4, fill: "#0057FF", strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="CGPA"
                stroke="#00C4B4"
                strokeWidth={2.5}
                fill="url(#gradTeal)"
                dot={{ r: 4, fill: "#00C4B4", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
