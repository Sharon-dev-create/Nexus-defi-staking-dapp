/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0E11",
        surface: {
          100: "#111417",
          200: "#161B22",
          300: "#1D2023",
          400: "#272A2E",
        },
        primary: {
          electric: "#ADC6FF",
          interactive: "#4D8EFF",
        },
        emerald: {
          bright: "#4EDEA3",
          success: "#00A572",
        },
        gold: "#FFB95F",
        text: {
          primary: "#E1E2E7",
          secondary: "#C2C6D6",
          muted: "#8C909F",
        },
        border: {
          subtle: "#30363D",
          strong: "#424754",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 36px rgba(77, 142, 255, 0.18)",
        emerald: "0 0 32px rgba(78, 222, 163, 0.18)",
        gold: "0 0 28px rgba(255, 185, 95, 0.16)",
      },
      backgroundImage: {
        glass:
          "linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018))",
        "radial-blue":
          "radial-gradient(circle at 50% 50%, rgba(77,142,255,0.26), rgba(77,142,255,0) 62%)",
        "radial-emerald":
          "radial-gradient(circle at 50% 50%, rgba(78,222,163,0.18), rgba(78,222,163,0) 60%)",
      },
    },
  },
  plugins: [],
};
