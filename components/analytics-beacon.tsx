"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendAnalytics } from "@/lib/analytics-client";

// Fires one pageview per route change. Renders nothing.
export default function AnalyticsBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    sendAnalytics({ eventType: "pageview", path: pathname });
  }, [pathname]);
  return null;
}
