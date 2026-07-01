"use client";

import { useRef, useState } from "react";

interface AreaChartProps {
  data: number[];
  color?: string;
  height?: number;
  showTooltip?: boolean;
  label?: string;
}

function smooth(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cp1x = x0 + (x1 - x0) * 0.5;
    const cp2x = x0 + (x1 - x0) * 0.5;
    d += ` C ${cp1x} ${y0}, ${cp2x} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

export function AreaChart({ data, color = "#7C3AED", height = 160, showTooltip = true }: AreaChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 100; // viewBox width (percent)
  const H = height;
  const PAD = 4;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points: [number, number][] = data.map((v, i) => [
    PAD + (i / (data.length - 1)) * (W - PAD * 2),
    PAD + (1 - (v - min) / range) * (H - PAD * 2),
  ]);

  const linePath = smooth(points);
  const areaPath = linePath
    + ` L ${points[points.length - 1][0]} ${H - PAD} L ${points[0][0]} ${H - PAD} Z`;

  const gradId = `ag-${color.replace("#", "")}`;

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * (W - PAD * 2);
    const idx = Math.round((x / (W - PAD * 2)) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  };

  const hoverPt = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        onMouseMove={showTooltip ? onMouseMove : undefined}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

        {/* Hover crosshair */}
        {hoverPt && (
          <>
            <line
              x1={hoverPt[0]} y1={PAD}
              x2={hoverPt[0]} y2={H - PAD}
              stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2"
            />
            <circle cx={hoverPt[0]} cy={hoverPt[1]} r="2.5" fill={color} stroke="#050505" strokeWidth="1.5" />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoverIdx !== null && hoverPt && (
        <div
          className="absolute pointer-events-none z-10 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white whitespace-nowrap -translate-x-1/2"
          style={{
            left: `${((hoverPt[0] - PAD) / (W - PAD * 2)) * 100}%`,
            top: `${Math.max(4, ((hoverPt[1] - PAD) / (H - PAD * 2)) * 100) - 14}%`,
            background: "#18181B",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {data[hoverIdx]}
        </div>
      )}
    </div>
  );
}

/* ── Spark: tiny inline chart for KPI cards ─── */
interface SparkProps {
  data: number[];
  color?: string;
  up?: boolean;
}

export function Spark({ data, color, up = true }: SparkProps) {
  const c = color ?? (up ? "#22C55E" : "#EF4444");
  const W = 60; const H = 24; const PAD = 2;
  const min = Math.min(...data); const max = Math.max(...data); const range = max - min || 1;
  const pts: [number, number][] = data.map((v, i) => [
    PAD + (i / (data.length - 1)) * (W - PAD * 2),
    PAD + (1 - (v - min) / range) * (H - PAD * 2),
  ]);
  const line = smooth(pts);
  const area = line + ` L ${pts[pts.length - 1][0]} ${H - PAD} L ${pts[0][0]} ${H - PAD} Z`;
  const gid = `sp-${c.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: 60, height: 24 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={c} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line}  fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
