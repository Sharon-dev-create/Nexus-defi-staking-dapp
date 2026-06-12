import type { ReactNode } from "react";
import { type HTMLMotionProps, motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-interactive text-white shadow-glow hover:bg-primary-electric hover:text-background",
  secondary:
    "bg-emerald-success text-white shadow-emerald hover:bg-emerald-bright hover:text-background",
  ghost:
    "border border-border-subtle bg-white/5 text-text-secondary hover:border-primary-interactive hover:text-text-primary",
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-electric focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
