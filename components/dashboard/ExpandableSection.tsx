"use client";

import { useRef, useEffect, useState } from "react";

interface ExpandableSectionProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

export default function ExpandableSection({ isExpanded, children }: ExpandableSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: isExpanded ? height : 0, opacity: isExpanded ? 1 : 0 }}
    >
      <div ref={contentRef} className="pt-4">
        {children}
      </div>
    </div>
  );
}
