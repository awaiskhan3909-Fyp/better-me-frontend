import { Link } from "react-router";
import faviconLogo from "../../imports/Favicon_Better_me.png";

interface AuthLogoProps {
  subtitle?: string;
  showSubtitle?: boolean;
}

export default function AuthLogo({ subtitle, showSubtitle = false }: AuthLogoProps) {
  return (
    <Link
      to="/"
      className="group flex flex-col items-center justify-center mb-6 relative select-none"
      title="Better Me - AI CBT Clinical Therapy"
    >
      {/* 1. Ambient Radiant Glow Aura (Stationary backdrop halo) */}
      <div className="absolute w-28 h-28 -top-1 bg-gradient-to-tr from-blue-600/30 via-sky-400/25 to-indigo-600/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-glow pointer-events-none" />

      {/* 2. 3D Rotating & Levitating Emblem Container */}
      <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center">
        {/* Soft Ambient Inner Glow */}
        <div className="absolute inset-1 rounded-full bg-blue-500/15 blur-md pointer-events-none" />

        {/* 3D Spinning Coin Emblem (Matches Reference Video) */}
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-600 shadow-xl shadow-blue-500/35 border-2 border-white/80 animate-coin-spin flex items-center justify-center transition-transform duration-300 group-hover:scale-105 cursor-pointer">
          <img
            src={faviconLogo}
            alt="Better Me"
            className="w-full h-full object-cover rounded-full select-none pointer-events-none drop-shadow-sm"
            draggable={false}
          />
        </div>
      </div>

      {/* 3. Optional Subtitle Pill (Only when showSubtitle is true) */}
      {showSubtitle && subtitle && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/5 backdrop-blur-sm border border-slate-200/60 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600 group-hover:text-primary transition-colors duration-300">
            {subtitle}
          </span>
        </div>
      )}
    </Link>
  );
}

