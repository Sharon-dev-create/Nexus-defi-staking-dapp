import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";

type ChartCardProps = {
  title: string;
  value: string;
  series: number[];
  accent?: "blue" | "emerald" | "gold";
};

const accentTextClasses = {
  blue: "text-primary-electric",
  emerald: "text-emerald-bright",
  gold: "text-gold",
};

export function ChartCard({ title, value, series, accent = "blue" }: ChartCardProps) {
  const gradientId = `${title.toLowerCase().replace(/\s+/g, "-")}-line`;
  const points = series
    .map((point, index) => {
      const x = (index / (series.length - 1)) * 100;
      const y = 100 - point;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <GlassCard className="min-h-72">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <p className={`mt-2 font-mono text-2xl font-semibold ${accentTextClasses[accent]}`}>
            {value}
          </p>
        </div>
        <span className="rounded-full border border-border-subtle px-3 py-1 font-mono text-xs text-text-muted">
          12M
        </span>
      </div>
      <div className="mt-8 h-40 rounded-xl border border-border-subtle bg-surface-100/70 p-4">
        <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop stopColor={accent === "emerald" ? "#00A572" : accent === "gold" ? "#FFB95F" : "#4D8EFF"} />
              <stop offset="1" stopColor={accent === "emerald" ? "#4EDEA3" : "#ADC6FF"} />
            </linearGradient>
          </defs>
          {[20, 40, 60, 80].map((line) => (
            <line
              key={line}
              x1="0"
              x2="100"
              y1={line}
              y2={line}
              stroke="#30363D"
              strokeDasharray="2 4"
              strokeWidth="0.4"
            />
          ))}
          <motion.polyline
            points={points}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
      </div>
    </GlassCard>
  );
}
