export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-saffron font-mono text-[11px] uppercase tracking-[0.18em] mb-3">
      <span aria-hidden>✦</span>
      <span>{children}</span>
    </div>
  );
}

export function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4 text-saffron/60" aria-hidden>
      <span className="h-px w-12 bg-saffron-border" />
      <span className="text-sm">◆</span>
      <span className="h-px w-12 bg-saffron-border" />
    </div>
  );
}

export function ConstellationBg({
  className = "",
  color = "var(--saffron)",
}: {
  className?: string;
  color?: string;
}) {
  // Static dot constellation
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill={color} opacity="0.5">
        {[
          [60, 90], [140, 160], [220, 60], [320, 200], [420, 110], [520, 220],
          [620, 90], [720, 180], [80, 320], [200, 380], [340, 460], [460, 340],
          [580, 440], [690, 360], [110, 500], [260, 540], [400, 540], [560, 520],
          [680, 540], [380, 30],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2" />
        ))}
      </g>
      <g stroke={color} strokeOpacity="0.18" strokeWidth="1" fill="none">
        <path d="M60,90 L140,160 L220,60 L320,200 L420,110 L520,220 L620,90 L720,180" />
        <path d="M80,320 L200,380 L340,460 L460,340 L580,440 L690,360" />
      </g>
    </svg>
  );
}
