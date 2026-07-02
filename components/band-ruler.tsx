// Blueprint-style measurement ruler for band scores (0–9).
// Tick marks every 0.5 band, taller ticks on whole bands.
export default function BandRuler({
  score,
  className = "",
}: {
  score: number | null;
  className?: string;
}) {
  const pct = score !== null ? Math.min(Math.max(score / 9, 0), 1) * 100 : 0;

  return (
    <div className={className} aria-hidden="true">
      <div className="relative h-1.5 rounded-sm border border-gray-200 bg-gray-100">
        {score !== null && (
          <div
            className="absolute inset-y-0 left-0 rounded-l-sm bg-gradient-to-r from-cyan-600 to-blue-600"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <div className="mt-1 flex justify-between">
        {Array.from({ length: 19 }, (_, i) => (
          <span
            key={i}
            className={`w-px ${i % 2 === 0 ? "h-1.5 bg-gray-400" : "h-1 bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
