"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

const WECHAT_ID = "mpcastelein";
const QR_SRC = "/images/brand/wechat-qr.png";

export default function WeChatConnect() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the ID is shown in full anyway
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* WeChat-green accent bar */}
      <div className="h-1 bg-[#07C160]" />

      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6">
        {/* QR */}
        {showQr && (
          <div className="mx-auto shrink-0 sm:mx-0">
            <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm ring-1 ring-[#07C160]/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QR_SRC}
                alt={t("wechat_connect_scan")}
                width={148}
                height={148}
                className="h-[148px] w-[148px] rounded-lg object-cover"
                onError={() => setShowQr(false)}
              />
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              {t("wechat_connect_scan")}
            </p>
          </div>
        )}

        {/* Text + ID */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <WeChatIcon className="h-5 w-5 text-[#07C160]" />
            <h2 className="text-base font-semibold text-gray-900">
              {t("wechat_connect_title")}
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {t("wechat_connect_subtitle")}
          </p>

          <div className="mt-4">
            <p className="mb-1.5 text-xs font-medium text-gray-500">
              {t("wechat_connect_id_label")}
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm font-semibold tracking-wide text-gray-900">
                {WECHAT_ID}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  copied
                    ? "bg-[#07C160] text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {copied ? t("wechat_connect_copied") : t("wechat_connect_copy")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeChatIcon({ className }: { className?: string }) {
  // Simplified WeChat glyph: two overlapping speech bubbles
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.1 3C4.9 3 1.5 5.9 1.5 9.4c0 2 1.1 3.8 2.9 5L3.6 16.8l2.8-1.4c.9.3 1.8.4 2.7.4h.5a5.7 5.7 0 0 1-.2-1.5c0-3.3 3.2-6 7.1-6h.4C16.3 5 13 3 9.1 3Zm-2.6 4.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5.2 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
      <path d="M22.5 14.3c0-2.9-2.8-5.2-6.3-5.2s-6.3 2.3-6.3 5.2 2.8 5.2 6.3 5.2c.7 0 1.4-.1 2.1-.3l2.2 1.1-.6-1.8c1.6-1 2.6-2.5 2.6-4.2Zm-8.2-1.1a.8.8 0 1 1 0 1.7.8.8 0 0 1 0-1.7Zm3.9 0a.8.8 0 1 1 0 1.7.8.8 0 0 1 0-1.7Z" />
    </svg>
  );
}
