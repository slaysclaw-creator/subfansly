import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(240 10% 3.9%)",
        foreground: "hsl(0 0% 98%)",
        card: "hsl(240 10% 6%)",
        "card-foreground": "hsl(0 0% 98%)",
        popover: "hsl(240 10% 6%)",
        "popover-foreground": "hsl(0 0% 98%)",
        muted: "hsl(240 5% 15%)",
        "muted-foreground": "hsl(0 0% 64%)",
        accent: "hsl(330 90% 60%)", // Neon Pink
        "accent-foreground": "hsl(240 10% 3.9%)",
        destructive: "hsl(0 84% 60%)",
        "destructive-foreground": "hsl(0 0% 98%)",
        border: "hsl(240 5% 18%)",
        input: "hsl(240 5% 18%)",
        ring: "hsl(330 90% 60%)",
        sidebar: "hsl(240 10% 5%)",
        primary: {
          50: "#ffe6f5",
          100: "#ffccec",
          200: "#ff99d8",
          300: "#ff66c4",
          400: "#ff33b0",
          500: "#ee4da4", // Main pink
          600: "#e63490",
          700: "#d9007c",
          800: "#a50056",
          900: "#6b0033",
          DEFAULT: "#ee4da4",
          foreground: "hsl(240 10% 3.9%)",
        },
        secondary: {
          50: "#f0e6ff",
          100: "#e0ccff",
          200: "#c299ff",
          300: "#a366ff",
          400: "#8533ff",
          500: "#8860d6", // Main purple
          600: "#7a4fc4",
          700: "#6c3eb2",
          800: "#5e2d9a",
          900: "#501c82",
          DEFAULT: "#8860d6",
          foreground: "hsl(0 0% 98%)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #ee4da4, #8860d6)",
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(238, 77, 164, 0.4), 0 0 40px rgba(238, 77, 164, 0.2), 0 0 60px rgba(238, 77, 164, 0.1)",
        "glow-secondary": "0 0 20px rgba(136, 96, 214, 0.4), 0 0 40px rgba(136, 96, 214, 0.2)",
        "glow-lg": "0 0 30px rgba(238, 77, 164, 0.5), 0 0 50px rgba(136, 96, 214, 0.3)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};
export default config;
