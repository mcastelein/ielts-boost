"use client";

interface ComingSoonDetailProps {
  sectionName: string;
  description: string;
}

export default function ComingSoonDetail({ sectionName, description }: ComingSoonDetailProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-600">{sectionName}</h3>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}
