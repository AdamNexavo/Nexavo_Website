/**
 * Attio-style background: dashed vertical grid + exponential growth curve.
 * viewBox 1440×800 — content occupies ~top 42%, grid+curve fill lower ~58%.
 */
export const BenefitsBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    viewBox="0 0 1440 800"
    preserveAspectRatio="none"
    aria-hidden
  >
    <defs>
      <clipPath id="benefits-grid-clip">
        <rect x="0" y="360" width="1440" height="440" />
      </clipPath>
    </defs>

    {/* Gestippelde verticale lijnen — alleen onderste zone */}
    <g
      clipPath="url(#benefits-grid-clip)"
      stroke="#DCDCE0"
      strokeWidth="1"
      strokeDasharray="1 8"
    >
      {[0, 240, 480, 720, 960, 1200, 1440].map((x) => (
        <line key={x} x1={x} y1="360" x2={x} y2="800" />
      ))}
    </g>

    {/* Exponentiële groeicurve — paars met oranje accent bovenaan */}
    <path
      d="M -10 798
         L 100 797
         C 200 795, 300 788, 400 775
         C 500 758, 600 730, 700 688
         C 800 638, 900 572, 1000 488
         C 1100 398, 1200 290, 1300 168
         C 1360 100, 1400 48, 1450 12"
      fill="none"
      stroke="#6a50ff"
      strokeWidth="1.5"
    />
    <circle cx="1450" cy="12" r="4" fill="#ff8c00" opacity="0.9" />
  </svg>
);
