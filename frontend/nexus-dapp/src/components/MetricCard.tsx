import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";

type MetricCardProps = {
  label: string;
  value: string;
  delta?: string;
  footnote?: string;
  delay?: number;
};

export function MetricCard({ label, value, delta, footnote, delay = 0 }: MetricCardProps) {
  return (
    <GlassCard delay={delay} className="min-h-32">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-text-muted">{label}</p>
        {delta ? (
          <span className="rounded-full border border-emerald-bright/30 bg-emerald-bright/10 px-2.5 py-1 font-mono text-xs text-emerald-bright">
            {delta}
          </span>
        ) : null}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.12 }}
        className="mt-5 font-mono text-2xl font-semibold text-text-primary"
      >
        {value}
      </motion.p>
      {footnote ? <p className="mt-2 text-sm text-text-muted">{footnote}</p> : null}
    </GlassCard>
  );
}
