import React from "react";

interface RoboticBrainLogoProps {
  size?: number;
  className?: string;
  showOuterHud?: boolean;
}

export default function RoboticBrainLogo({
  size = 96,
  className = "",
  showOuterHud = true,
}: RoboticBrainLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. Ambient Radiant Aura / Neon Backdrop Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/35 via-cyan-400/30 to-indigo-600/35 blur-xl animate-pulse pointer-events-none" />

      {/* 2. Main High-Tech Robotic SVG Container */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_10px_25px_rgba(37,99,235,0.4)] overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial Gradient for Emblem Background */}
          <radialGradient id="emblemBg" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="60%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>

          {/* Cyber Cavity Gradient inside Brain */}
          <radialGradient id="cyberCavity" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#0f214d" />
            <stop offset="70%" stopColor="#091430" />
            <stop offset="100%" stopColor="#040a1c" />
          </radialGradient>

          {/* Electric Neon Circuit Gradient */}
          <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Radar Sweep Gradient */}
          <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Gear 1 Vector (8 teeth, Outer 16, Inner 12) */}
          <g id="gear8">
            <path
              d="M 12 0 L 15.5 1.8 L 14.6 5.4 L 10.7 5.5 L 9.1 7.8 L 8.5 8.5 L 9.6 12.2 L 6.5 14.1 L 3.7 11.4 L 0.9 12 L 0 12 L -1.8 15.5 L -5.4 14.6 L -5.5 10.7 L -7.8 9.1 L -8.5 8.5 L -12.2 9.6 L -14.1 6.5 L -11.4 3.7 L -12 0.9 L -12 0 L -15.5 -1.8 L -14.6 -5.4 L -10.7 -5.5 L -9.1 -7.8 L -8.5 -8.5 L -9.6 -12.2 L -6.5 -14.1 L -3.7 -11.4 L -0.9 -12 L 0 -12 L 1.8 -15.5 L 5.4 -14.6 L 5.5 -10.7 L 7.8 -9.1 L 8.5 -8.5 L 12.2 -9.6 L 14.1 -6.5 L 11.4 -3.7 L 12 -0.9 Z"
              fill="#38bdf8"
              fillOpacity="0.22"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Center Axle & Spokes */}
            <circle cx="0" cy="0" r="4" fill="#091430" stroke="#38bdf8" strokeWidth="1" />
            <line x1="-10" y1="0" x2="10" y2="0" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* Gear 2 Vector (6 teeth, Outer 13, Inner 9.5) */}
          <g id="gear6">
            <path
              d="M 9.5 0 L 12.5 2 L 11.3 5.8 L 7.7 5.6 L 5.6 7.7 L 4.8 8.2 L 4.5 11.8 L 0.7 12.6 L -1 9.4 L -3.9 8.7 L -4.8 8.2 L -8 9.8 L -10.6 6.9 L -8.7 3.9 L -9.4 1 L -9.5 0 L -12.5 -2 L -11.3 -5.8 L -7.7 -5.6 L -5.6 -7.7 L -4.8 -8.2 L -4.5 -11.8 L -0.7 -12.6 L 1 -9.4 L 3.9 -8.7 L 4.8 -8.2 L 8 -9.8 L 10.6 -6.9 L 8.7 -3.9 L 9.4 -1 Z"
              fill="#60a5fa"
              fillOpacity="0.24"
              stroke="#60a5fa"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Center Axle & Spokes */}
            <circle cx="0" cy="0" r="3.2" fill="#091430" stroke="#60a5fa" strokeWidth="0.9" />
            <line x1="-8" y1="-4.6" x2="8" y2="4.6" stroke="#60a5fa" strokeWidth="0.7" opacity="0.7" />
            <line x1="-8" y1="4.6" x2="8" y2="-4.6" stroke="#60a5fa" strokeWidth="0.7" opacity="0.7" />
            <line x1="0" y1="-9" x2="0" y2="9" stroke="#60a5fa" strokeWidth="0.7" opacity="0.7" />
            <circle cx="0" cy="0" r="1.2" fill="#38bdf8" />
          </g>
        </defs>

        {/* 3. Outer Glowing Circular Badge */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="url(#emblemBg)"
          stroke="#93c5fd"
          strokeWidth="2.5"
          className="transition-all"
        />

        {/* 4. Rotating Outer HUD Ring (Robotic Diagnostics Bezel) */}
        {showOuterHud && (
          <>
            {/* Orbiting dashed tech ring */}
            <circle
              cx="100"
              cy="100"
              r="96"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="4 8 16 8"
              opacity="0.65"
              className="origin-center animate-[spin_24s_linear_infinite]"
            />
            {/* Counter-rotating satellite dots */}
            <g className="origin-center animate-[spin_12s_linear_infinite_reverse]">
              <circle cx="100" cy="3.5" r="2" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />
              <circle cx="100" cy="196.5" r="2" fill="#60a5fa" className="drop-shadow-[0_0_6px_#60a5fa]" />
            </g>
          </>
        )}

        {/* 5. Human Head Silhouette (Crisp White Profile) */}
        <path
          d="M 80 185 
             C 80 162, 70 148, 54 139 
             C 47 133, 49 124, 53 121 
             C 57 119, 56 113, 50 110 
             C 44 106, 42 101, 39 97 
             C 42 94, 53 88, 53 80 
             C 53 66, 62 48, 82 39 
             C 98 31, 128 31, 148 41 
             C 168 51, 178 78, 175 106 
             C 172 127, 160 145, 146 155 
             C 140 165, 138 175, 138 185 
             Z"
          fill="#ffffff"
          className="drop-shadow-sm"
        />

        {/* 6. Robotic Brain Cavity (Dark High-Tech Recess) */}
        <path
          d="M 84 52 
             C 98 42, 130 42, 148 52 
             C 161 63, 166 85, 163 108 
             C 159 126, 148 139, 135 143 
             C 120 147, 105 139, 98 126 
             C 87 121, 79 105, 79 90 
             C 79 74, 79 60, 84 52 
             Z"
          fill="url(#cyberCavity)"
          stroke="#1e3a8a"
          strokeWidth="1.5"
        />

        {/* 7. Holographic Radar Sweep Line (Active Scanning Beam) */}
        <g className="origin-[125px_96px] animate-[spin_4s_linear_infinite]">
          <line
            x1="125"
            y1="96"
            x2="160"
            y2="70"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          {/* Radar Faint Cone */}
          <polygon
            points="125,96 160,70 163,88"
            fill="url(#radarSweep)"
            opacity="0.4"
          />
        </g>

        {/* 8. MECHANICAL ROBOTIC GEARS (The Living Machine Core) */}
        {/* Gear 1: Upper Cerebral Gear (Clockwise) */}
        <g className="origin-[114px_74px] animate-[spin_6s_linear_infinite]">
          <use href="#gear8" x="114" y="74" />
        </g>

        {/* Gear 2: Mid-Brain Meshing Gear (Counter-Clockwise - Meshes with Gear 1!) */}
        <g className="origin-[142px_96px] animate-[spin_4.5s_linear_infinite_reverse]">
          <use href="#gear6" x="142" y="96" />
        </g>

        {/* Gear 3: Lower Cerebellum Drive Gear (Clockwise - Meshes with Gear 2!) */}
        <g className="origin-[118px_118px] animate-[spin_5s_linear_infinite]">
          <use href="#gear6" x="118" y="118" />
        </g>

        {/* 9. Central AI Microchip Processor Core */}
        <g className="origin-[126px_95px] animate-pulse">
          <rect
            x="121"
            y="90"
            width="10"
            height="10"
            rx="2"
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="1"
            transform="rotate(45 126 95)"
            className="drop-shadow-[0_0_6px_#38bdf8]"
          />
          <circle cx="126" cy="95" r="2" fill="#ffffff" />
        </g>

        {/* 10. Electric Circuit Traces (Static Base Tracks) */}
        <g stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.65">
          {/* Frontal circuits */}
          <path d="M 104 68 L 88 62 L 78 75" />
          <path d="M 78 75 L 72 92 L 78 108" />
          {/* Temporal & Motor circuits */}
          <path d="M 108 120 L 95 128 L 88 142" />
          {/* Occipital circuits */}
          <path d="M 124 64 L 145 58 L 158 72" />
          <path d="M 152 102 L 160 115 L 148 132" />
          {/* Spinal / Brainstem Cord Circuit */}
          <path d="M 118 128 L 118 148 L 115 168 L 115 185" />
        </g>

        {/* 11. Pulsing Electric Current Pulses (Flowing Light Beams) */}
        <g
          stroke="url(#neonCyan)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="5 12"
          className="animate-circuit-pulse"
        >
          <path d="M 104 68 L 88 62 L 78 75" />
          <path d="M 78 75 L 72 92 L 78 108" />
          <path d="M 108 120 L 95 128 L 88 142" />
          <path d="M 124 64 L 145 58 L 158 72" />
          <path d="M 152 102 L 160 115 L 148 132" />
          <path d="M 118 128 L 118 148 L 115 168 L 115 185" />
        </g>

        {/* 12. Glowing Synaptic Robot Nodes (Blinking LED Indicators) */}
        {/* Node 1: Frontal Apex */}
        <g className="animate-pulse">
          <circle cx="88" cy="62" r="4.5" fill="#38bdf8" fillOpacity="0.4" />
          <circle cx="88" cy="62" r="2.8" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
        </g>

        {/* Node 2: Anterior Frontal */}
        <g className="animate-pulse [animation-delay:400ms]">
          <circle cx="78" cy="75" r="4" fill="#38bdf8" fillOpacity="0.4" />
          <circle cx="78" cy="75" r="2.5" fill="#38bdf8" />
        </g>

        {/* Node 3: Prefrontal */}
        <g className="animate-pulse [animation-delay:800ms]">
          <circle cx="72" cy="92" r="4.5" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="72" cy="92" r="2.6" fill="#ffffff" stroke="#60a5fa" strokeWidth="1" />
        </g>

        {/* Node 4: Broca Area */}
        <g className="animate-pulse [animation-delay:1200ms]">
          <circle cx="78" cy="108" r="4" fill="#38bdf8" fillOpacity="0.4" />
          <circle cx="78" cy="108" r="2.4" fill="#38bdf8" />
        </g>

        {/* Node 5: Parietal Node */}
        <g className="animate-pulse [animation-delay:600ms]">
          <circle cx="158" cy="72" r="4.5" fill="#38bdf8" fillOpacity="0.4" />
          <circle cx="158" cy="72" r="2.8" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
        </g>

        {/* Node 6: Occipital Node */}
        <g className="animate-pulse [animation-delay:1000ms]">
          <circle cx="160" cy="115" r="4.5" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="160" cy="115" r="2.6" fill="#60a5fa" />
        </g>

        {/* Node 7: Cerebellar Node */}
        <g className="animate-pulse [animation-delay:1400ms]">
          <circle cx="148" cy="132" r="4" fill="#38bdf8" fillOpacity="0.4" />
          <circle cx="148" cy="132" r="2.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
        </g>

        {/* Node 8: Temporal Lower */}
        <g className="animate-pulse [animation-delay:500ms]">
          <circle cx="88" cy="142" r="4.5" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="88" cy="142" r="2.6" fill="#60a5fa" />
        </g>

        {/* Node 9: Spinal Brainstem Node 1 */}
        <g className="animate-pulse [animation-delay:700ms]">
          <circle cx="115" cy="168" r="4" fill="#38bdf8" fillOpacity="0.4" />
          <circle cx="115" cy="168" r="2.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
        </g>

        {/* Node 10: Spinal Cord Base Node 2 */}
        <g className="animate-pulse [animation-delay:1100ms]">
          <circle cx="115" cy="185" r="3.5" fill="#38bdf8" fillOpacity="0.4" />
          <circle cx="115" cy="185" r="2.2" fill="#38bdf8" />
        </g>
      </svg>
    </div>
  );
}
