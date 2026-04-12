export default function MLVenturesLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded square background */}
      <rect x="2" y="2" width="96" height="96" rx="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

      {/* Branch lines */}
      <line x1="30" y1="58" x2="50" y2="35" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="58" x2="50" y2="58" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="58" x2="50" y2="78" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="35" x2="72" y2="24" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="35" x2="72" y2="46" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />

      {/* Nodes */}
      <circle cx="30" cy="58" r="7" fill="#3b82f6" />
      <circle cx="50" cy="35" r="6" fill="#3b82f6" />
      <circle cx="50" cy="58" r="6" fill="#3b82f6" />
      <circle cx="50" cy="78" r="6" fill="#3b82f6" />
      <circle cx="72" cy="24" r="5.5" fill="#3b82f6" />
      <circle cx="72" cy="46" r="5.5" fill="#3b82f6" />
    </svg>
  );
}
