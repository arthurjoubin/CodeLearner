import React from 'react';

/**
 * Variation 1: Target with Wobbly Arrow
 * Cute target with an arrow sticking in the bullseye that gently wobbles.
 * Placement: Hero section, next to the main title.
 */
export function TargetArrowWobble({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes taw-wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(4deg); }
          75% { transform: rotate(-4deg); }
        }
        .taw-arrow { animation: taw-wobble 2.5s ease-in-out infinite; transform-origin: 105px 105px; }
      `}</style>

      {/* Target - concentric filled circles */}
      <circle cx="110" cy="110" r="95" fill="#000"/>
      <circle cx="110" cy="110" r="82" fill="#fff"/>
      <circle cx="110" cy="110" r="69" fill="#000"/>
      <circle cx="110" cy="110" r="56" fill="#fff"/>
      <circle cx="110" cy="110" r="43" fill="#000"/>
      <circle cx="110" cy="110" r="28" fill="#22c55e"/>

      {/* Arrow with wobble animation */}
      <g className="taw-arrow">
        {/* Shaft */}
        <line x1="28" y1="28" x2="98" y2="98" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round"/>
        {/* Arrowhead */}
        <polygon points="105,105 88,96 96,88" fill="#1a1a1a"/>
        {/* Fletching - green accent */}
        <line x1="28" y1="28" x2="18" y2="36" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="28" y1="28" x2="36" y2="18" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round"/>
        {/* Inner fletching - darker green */}
        <line x1="36" y1="36" x2="28" y2="43" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="36" y1="36" x2="43" y2="28" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

/**
 * Variation 2: Mini Pulsing Target
 * Small target with a gently pulsing green center.
 * Placement: Inline next to section titles as a decorative accent.
 */
export function TargetPulse({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes tp-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.75; }
        }
        .tp-center { animation: tp-pulse 2s ease-in-out infinite; transform-origin: 50px 50px; }
      `}</style>

      <circle cx="50" cy="50" r="45" fill="#000"/>
      <circle cx="50" cy="50" r="38" fill="#fff"/>
      <circle cx="50" cy="50" r="30" fill="#000"/>
      <circle cx="50" cy="50" r="22" fill="#fff"/>
      <circle cx="50" cy="50" r="14" fill="#22c55e" className="tp-center"/>
    </svg>
  );
}

/**
 * Variation 3: Arrow Scatter / Cluster
 * Multiple arrows and small targets scattered decoratively with floating animation.
 * Placement: Background decoration behind the features section.
 */
export function ArrowScatter({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes as-float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(3px, -5px); }
        }
        @keyframes as-float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-4px, 3px); }
        }
        @keyframes as-float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5px, 4px); }
        }
        .as-g1 { animation: as-float1 4s ease-in-out infinite; }
        .as-g2 { animation: as-float2 5s ease-in-out infinite; }
        .as-g3 { animation: as-float3 3.5s ease-in-out infinite; }
      `}</style>

      {/* Small target 1 */}
      <g className="as-g1">
        <circle cx="80" cy="70" r="25" fill="#000"/>
        <circle cx="80" cy="70" r="20" fill="#fff"/>
        <circle cx="80" cy="70" r="14" fill="#000"/>
        <circle cx="80" cy="70" r="8" fill="#22c55e"/>
      </g>

      {/* Arrow 1 - hitting target 1 from upper-left */}
      <g className="as-g1">
        <line x1="40" y1="35" x2="73" y2="63" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="76,66 64,61 69,56" fill="#000"/>
        <line x1="40" y1="35" x2="33" y2="40" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="40" y1="35" x2="45" y2="28" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
      </g>

      {/* Arrow 2 - standalone, floating right */}
      <g className="as-g2" opacity="0.7">
        <line x1="160" y1="130" x2="210" y2="110" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="214,108 204,104 206,114" fill="#000"/>
        <line x1="160" y1="130" x2="155" y2="137" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
        <line x1="160" y1="130" x2="153" y2="124" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      </g>

      {/* Small target 2 */}
      <g className="as-g3">
        <circle cx="250" cy="55" r="18" fill="#000"/>
        <circle cx="250" cy="55" r="14" fill="#fff"/>
        <circle cx="250" cy="55" r="9" fill="#000"/>
        <circle cx="250" cy="55" r="5" fill="#22c55e"/>
      </g>

      {/* Arrow 3 - heading up toward target 2 */}
      <g className="as-g3" opacity="0.6">
        <line x1="215" y1="100" x2="244" y2="62" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
        <polygon points="246,58 237,58 240,67" fill="#000"/>
        <line x1="215" y1="100" x2="208" y2="102" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
        <line x1="215" y1="100" x2="217" y2="108" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      </g>

      {/* Arrow 4 - small, distant, decorative */}
      <g className="as-g2" opacity="0.4">
        <line x1="140" y1="35" x2="168" y2="48" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="172,50 162,44 161,53" fill="#000"/>
        <line x1="140" y1="35" x2="136" y2="41" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="140" y1="35" x2="146" y2="29" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
      </g>

      {/* Tiny target 3 - very small, bottom left */}
      <g className="as-g2" opacity="0.35">
        <circle cx="30" cy="155" r="10" fill="#000"/>
        <circle cx="30" cy="155" r="7" fill="#fff"/>
        <circle cx="30" cy="155" r="4" fill="#22c55e"/>
      </g>
    </svg>
  );
}

/**
 * Variation 4: Animated Arrow Strike
 * Arrow flies in from the left and hits the target, with an impact ring effect.
 * Loops every 3.5 seconds.
 * Placement: Between features and learning paths as a divider/accent.
 */
export function ArrowStrike({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ast-fly {
          0%, 40% { transform: translateX(-100px); opacity: 0; }
          75% { transform: translateX(0); opacity: 1; }
          80% { transform: translateX(3px); }
          85% { transform: translateX(-1px); }
          90%, 100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes ast-impact {
          0%, 75% { transform: scale(0); opacity: 0; }
          80% { transform: scale(0.6); opacity: 0.7; }
          90% { transform: scale(1.4); opacity: 0.2; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes ast-impact2 {
          0%, 78% { transform: scale(0); opacity: 0; }
          83% { transform: scale(0.4); opacity: 0.5; }
          93% { transform: scale(1.2); opacity: 0.15; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .ast-arrow { animation: ast-fly 3.5s ease-out infinite; }
        .ast-ring1 { animation: ast-impact 3.5s ease-out infinite; transform-origin: 155px 75px; }
        .ast-ring2 { animation: ast-impact2 3.5s ease-out infinite; transform-origin: 155px 75px; }
      `}</style>

      {/* Target on the right */}
      <circle cx="155" cy="75" r="62" fill="#000"/>
      <circle cx="155" cy="75" r="53" fill="#fff"/>
      <circle cx="155" cy="75" r="43" fill="#000"/>
      <circle cx="155" cy="75" r="34" fill="#fff"/>
      <circle cx="155" cy="75" r="25" fill="#000"/>
      <circle cx="155" cy="75" r="14" fill="#22c55e"/>

      {/* Impact rings */}
      <circle cx="155" cy="75" r="18" stroke="#22c55e" strokeWidth="2.5" fill="none" className="ast-ring1"/>
      <circle cx="155" cy="75" r="12" stroke="#4ade80" strokeWidth="2" fill="none" className="ast-ring2"/>

      {/* Arrow flying in from left */}
      <g className="ast-arrow">
        {/* Shaft */}
        <line x1="65" y1="75" x2="146" y2="75" stroke="#000" strokeWidth="4.5" strokeLinecap="round"/>
        {/* Arrowhead */}
        <polygon points="152,75 139,67 139,83" fill="#000"/>
        {/* Fletching */}
        <line x1="65" y1="75" x2="56" y2="67" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
        <line x1="65" y1="75" x2="56" y2="83" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
        <line x1="72" y1="75" x2="64" y2="68" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
        <line x1="72" y1="75" x2="64" y2="82" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

/**
 * Variation 5: Neo-Brutalist Target Badge
 * Bold, graphic target with thick outlines and an offset shadow.
 * Features a jaunty arrow and brutal aesthetic with sparkle details.
 * Placement: Decorative accent near learning paths section.
 */
export function TargetBrutal({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes tb-sparkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .tb-spark1 { animation: tb-sparkle 1.5s ease-in-out infinite; }
        .tb-spark2 { animation: tb-sparkle 1.5s ease-in-out 0.5s infinite; }
        .tb-spark3 { animation: tb-sparkle 1.5s ease-in-out 1s infinite; }
      `}</style>

      {/* Offset shadow (brutal style) */}
      <circle cx="106" cy="106" r="75" fill="#000"/>

      {/* Main target body */}
      <circle cx="100" cy="100" r="75" fill="#fff" stroke="#000" strokeWidth="4"/>
      <circle cx="100" cy="100" r="60" fill="#000"/>
      <circle cx="100" cy="100" r="48" fill="#fff"/>
      <circle cx="100" cy="100" r="36" fill="#000"/>
      <circle cx="100" cy="100" r="24" fill="#fff"/>
      <circle cx="100" cy="100" r="13" fill="#22c55e" stroke="#000" strokeWidth="2.5"/>

      {/* Bold arrow at 45° */}
      <line x1="30" y1="30" x2="90" y2="90" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
      <polygon points="96,96 78,87 87,78" fill="#000"/>

      {/* Fletching - green + yellow (brutal palette) */}
      <line x1="30" y1="30" x2="17" y2="37" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="30" y1="30" x2="37" y2="17" stroke="#facc15" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="38" y1="38" x2="28" y2="46" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
      <line x1="38" y1="38" x2="46" y2="28" stroke="#eab308" strokeWidth="3" strokeLinecap="round"/>

      {/* Sparkles / impact dots */}
      <circle cx="108" cy="85" r="3" fill="#22c55e" className="tb-spark1"/>
      <circle cx="85" cy="112" r="2.5" fill="#facc15" className="tb-spark2"/>
      <circle cx="115" cy="108" r="2" fill="#22c55e" className="tb-spark3"/>
      <circle cx="78" cy="90" r="1.5" fill="#facc15" className="tb-spark1"/>

      {/* Small star sparkle top-right */}
      <g className="tb-spark2">
        <line x1="158" y1="35" x2="158" y2="47" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="152" y1="41" x2="164" y2="41" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <g className="tb-spark3">
        <line x1="170" y1="55" x2="170" y2="63" stroke="#facc15" strokeWidth="2" strokeLinecap="round"/>
        <line x1="166" y1="59" x2="174" y2="59" stroke="#facc15" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
