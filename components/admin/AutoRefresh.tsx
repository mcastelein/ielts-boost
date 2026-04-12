"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface AutoRefreshProps {
  onRefresh: () => void;
  intervalMs?: number;
}

export default function AutoRefresh({ onRefresh, intervalMs = 30000 }: AutoRefreshProps) {
  const [enabled, setEnabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doRefresh = useCallback(() => {
    onRefresh();
    setLastUpdated(new Date());
  }, [onRefresh]);

  useEffect(() => {
    if (enabled) {
      intervalRef.current = setInterval(doRefresh, intervalMs);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, doRefresh, intervalMs]);

  const timeAgo = () => {
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        onClick={() => setEnabled((e) => !e)}
        className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
          enabled
            ? "border-green-300 bg-green-50 text-green-700"
            : "border-gray-300 text-gray-500 hover:bg-gray-50"
        }`}
      >
        {enabled ? "Auto-refresh ON" : "Auto-refresh"}
      </button>
      <span className="text-xs text-gray-400">Updated {timeAgo()}</span>
      <button
        onClick={doRefresh}
        className="text-xs text-blue-600 hover:text-blue-800"
      >
        Refresh now
      </button>
    </div>
  );
}
