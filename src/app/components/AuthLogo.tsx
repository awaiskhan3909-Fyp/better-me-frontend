import { Link } from "react-router";
import RoboticBrainLogo from "./RoboticBrainLogo";

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
      {/* Levitating Robotic Brain Badge with Interactive Hover */}
      <div className="relative transition-transform duration-500 group-hover:scale-105 animate-float">
        <RoboticBrainLogo size={94} showOuterHud={true} />
      </div>

      {/* Optional Subtitle Pill (Only when showSubtitle is explicitly true) */}
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


