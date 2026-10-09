import { Link } from "react-router";
import logo from "../../imports/Better_me_Logo.png";
import { Sparkles } from "lucide-react";

interface AuthLogoProps {
  subtitle?: string;
}

export default function AuthLogo({ subtitle = "AI Clinical CBT Platform" }: AuthLogoProps) {
  return (
    <Link to="/" className="group flex flex-col items-center justify-center mb-7 relative select-none">
      {/* 1. Pulsing Ambient Aura / Radial Glow */}
      <div className="absolute -inset-6 bg-gradient-to-r from-primary/30 via-secondary/25 to-primary/30 rounded-full blur-2xl opacity-60 group-hover:opacity-95 transition-opacity duration-700 animate-pulse-glow pointer-events-none" />

      {/* 2. Floating Frosted Capsule with Dynamic Shadow */}
      <div className="relative px-6 py-3.5 rounded-2xl bg-white/85 backdrop-blur-md shadow-xl shadow-primary/10 border border-white/90 group-hover:shadow-primary/25 group-hover:border-primary/40 transition-all duration-500 animate-float flex items-center justify-center">
        {/* Soft sheen line inside */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 via-transparent to-white/40 pointer-events-none" />

        {/* Logo Image */}
        <img
          src={logo}
          alt="Better Me"
          className="h-11 sm:h-12 object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
        />

        {/* Live Active Pulse Dot Indicator */}
        <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
        </div>
      </div>

      {/* 3. Subtle Animated Subtitle / Capsule Pill */}
      <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/5 backdrop-blur-sm border border-slate-200/60 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600 group-hover:text-primary transition-colors duration-300">
          {subtitle}
        </span>
      </div>
    </Link>
  );
}
