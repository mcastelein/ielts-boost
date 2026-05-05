"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";

interface Props {
  onClose: () => void;
}

const FREE_FEATURES = {
  en: ["3 writing submissions / day", "2 speaking sessions / day", "Dashboard & progress tracking", "Bilingual feedback (EN & 中文)"],
  zh: ["每天 3 次写作提交", "每天 2 次口语练习", "仪表板与学习进度追踪", "双语反馈（中英文）"],
};

const PRO_FEATURES = {
  en: ["Unlimited writing submissions", "Unlimited speaking practice", "Model answer for every essay", "Priority feedback queue", "Full history & analytics"],
  zh: ["无限次写作提交", "无限次口语练习", "每篇作文附带满分范文", "优先反馈队列", "完整历史记录与数据分析"],
};

export default function OnboardingFreeProModal({ onClose }: Props) {
  const { t, locale } = useLanguage();
  const router = useRouter();

  const freeFeatures = FREE_FEATURES[locale] ?? FREE_FEATURES.en;
  const proFeatures = PRO_FEATURES[locale] ?? PRO_FEATURES.en;

  const handleFree = () => {
    onClose();
    router.push("/dashboard");
  };

  const handlePro = () => {
    onClose();
    router.push("/upgrade");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <h2 className="text-xl font-bold text-gray-900">{t("onboarding_plan_title")}</h2>
          <p className="mt-1 text-sm text-gray-500">{t("onboarding_plan_subtitle")}</p>
        </div>

        {/* Plans */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-4">
          {/* Free */}
          <div className="rounded-xl border-2 border-gray-200 p-5 flex flex-col">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t("onboarding_plan_free_label")}
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-900">¥0</div>
            <ul className="mt-4 space-y-2 flex-1">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-gray-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleFree}
              className="mt-5 w-full rounded-lg border-2 border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t("onboarding_plan_free_cta")}
            </button>
          </div>

          {/* Pro */}
          <div className="rounded-xl border-2 border-blue-500 p-5 flex flex-col relative bg-blue-50/30">
            <div className="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl" />
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                {t("onboarding_plan_pro_label")}
              </div>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {t("onboarding_plan_best_value")}
              </span>
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{t("onboarding_plan_pro_price")}</div>
            <ul className="mt-4 space-y-2 flex-1">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 text-blue-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handlePro}
              className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              {t("onboarding_plan_pro_cta")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
