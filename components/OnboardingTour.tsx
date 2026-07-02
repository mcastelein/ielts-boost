"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";
import type { IconType } from "react-icons";
import { SiWechat, SiXiaohongshu, SiTiktok, SiBilibili, SiGoogle } from "react-icons/si";
import { FiUsers, FiMoreHorizontal } from "react-icons/fi";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

type Level = "beginner" | "intermediate" | "advanced";
type Focus = "listening" | "reading" | "writing" | "speaking";
type Referral =
  | "wechat"
  | "xiaohongshu"
  | "douyin"
  | "bilibili"
  | "friend"
  | "search"
  | "other";

const SESSION_KEY = "ieltsboost_writing_session";

// Total number of survey question steps (level, target, exam, focus, referral).
const SURVEY_STEPS = 5;

// Level-appropriate practice essays, pre-loaded into the first writing session so the
// user reaches their first AI-graded feedback immediately. (Moved from the old tour.)
const PROMPTS: Record<Level, { topic: string; prompt: string; essay: string }> = {
  beginner: {
    topic: "City vs Countryside",
    prompt:
      "Some people prefer to live in cities, while others prefer to live in the countryside. Discuss the advantages and disadvantages of both. Give reasons for your answer and include examples from your own experience.",
    essay:
      "Many people in the world like to live in city, but some people prefer countryside. In my opinion, city life is better but both have advantages.\n\nCity life have many advantages. There are many jobs in city and people can earn more money. There are also good hospitals and schools. Transport is easier too. However, city has problems like pollution and traffic. Life is more expensive in city.\n\nCountryside life is more quiet and peaceful. Air is fresh and food is natural. But there are not many jobs and facilities. Young people have to travel to city for work and study.\n\nI think that both city and countryside are good places to live. It depends on what you need. Young people should live in city because of jobs and opportunities. Old people can enjoy countryside. In conclusion, people choose different places based on their personal situation and preference.",
  },
  intermediate: {
    topic: "Universities and Practical Skills",
    prompt:
      "Some people think that universities should focus on academic subjects only. Others believe they should also prepare students for the workplace. Discuss both views and give your own opinion.",
    essay:
      "The question of whether universities should focus purely on academic study or also provide practical skills training has been widely debated in recent years. While both perspectives have merit, I believe a balanced approach is the most beneficial for students and society.\n\nThose who support academic-only education argue that universities have always been centres of intellectual inquiry. Studying theory develops critical thinking, analytical skills and a deep understanding of a subject. These transferable skills, they argue, are more valuable than specific technical training, which can be learned on the job.\n\nHowever, there is a strong case for including practical elements in university programmes. Many graduates find themselves poorly prepared for the demands of the workplace. When universities incorporate internships, projects and industry placements, students gain firsthand experience that makes them significantly more employable.\n\nI would argue that the solution lies in combining rigorous academic study with targeted practical preparation. A student studying medicine, for example, must have both the theoretical knowledge and the clinical skills to practise effectively.\n\nIn conclusion, while academic study forms the essential foundation of a university education, institutions should also ensure their graduates are equipped with the practical skills they need to succeed in their careers.",
  },
  advanced: {
    topic: "AI and Employment",
    prompt:
      "Advances in artificial intelligence mean that machines can now perform many jobs previously done by humans. To what extent is this a positive or negative development for society? Give reasons for your answer and include relevant examples.",
    essay:
      "The proliferation of artificial intelligence has fundamentally disrupted traditional models of employment, raising urgent questions about whether this represents a net gain or loss for human society. While the economic and efficiency benefits are undeniable, the social and human costs deserve serious examination.\n\nProponents of AI advancement argue persuasively that technological disruption has historically generated more employment than it eliminates. The industrial revolution, for instance, ultimately created vastly more jobs than it destroyed, albeit after a period of significant disruption. Similarly, AI may catalyse entirely new industries and roles centred on human-machine collaboration, creativity and complex problem-solving — areas where human cognition retains a meaningful advantage.\n\nHowever, this optimistic view overlooks critical differences between past and present automation. Unlike mechanisation, which primarily displaced manual labour, AI threatens to automate cognitive and professional tasks including medical diagnosis, legal analysis and financial planning. The speed and breadth of this displacement may outstrip society's capacity to retrain affected workers, particularly those who are older or lack access to quality education.\n\nOn balance, the outcome will depend less on the technology itself than on the policy frameworks societies construct around it. Universal basic income, investment in lifelong learning and progressive taxation of automation profits represent promising mechanisms to ensure that AI-driven productivity gains are broadly distributed rather than captured by a privileged minority.\n\nIn conclusion, AI represents neither an unambiguous blessing nor a catastrophe, but a profound challenge that demands thoughtful and proactive governance.",
  },
};

const LEVELS: { value: Level; labelKey: TranslationKey; bandKey: TranslationKey; dot: string; ring: string }[] = [
  { value: "beginner", labelKey: "onboarding_level_beginner", bandKey: "onboarding_level_beginner_band", dot: "bg-emerald-500", ring: "border-emerald-500 bg-emerald-50" },
  { value: "intermediate", labelKey: "onboarding_level_intermediate", bandKey: "onboarding_level_intermediate_band", dot: "bg-blue-500", ring: "border-blue-500 bg-blue-50" },
  { value: "advanced", labelKey: "onboarding_level_advanced", bandKey: "onboarding_level_advanced_band", dot: "bg-purple-500", ring: "border-purple-500 bg-purple-50" },
];

const TARGET_BANDS = [6, 6.5, 7, 7.5] as const;
const bandLabel = (b: number) => (b >= 7.5 ? "7.5+" : b.toFixed(1));

// IELTS test order: Listening, Reading, Writing, Speaking.
const FOCUSES: { value: Focus; labelKey: TranslationKey; icon: string }[] = [
  { value: "listening", labelKey: "onboarding_focus_listening", icon: "🎧" },
  { value: "reading", labelKey: "onboarding_focus_reading", icon: "📖" },
  { value: "writing", labelKey: "onboarding_focus_writing", icon: "✍️" },
  { value: "speaking", labelKey: "onboarding_focus_speaking", icon: "🗣️" },
];

// Brand glyphs via react-icons (Simple Icons set); FiUsers/FiMoreHorizontal are neutral
// fallbacks for the non-brand options. Douyin uses the TikTok glyph (no separate Douyin icon).
const REFERRALS: { value: Referral; labelKey: TranslationKey; icon: IconType; color: string }[] = [
  { value: "wechat", labelKey: "onboarding_ref_wechat", icon: SiWechat, color: "#07C160" },
  { value: "xiaohongshu", labelKey: "onboarding_ref_xiaohongshu", icon: SiXiaohongshu, color: "#FF2442" },
  { value: "douyin", labelKey: "onboarding_ref_douyin", icon: SiTiktok, color: "#000000" },
  { value: "bilibili", labelKey: "onboarding_ref_bilibili", icon: SiBilibili, color: "#00A1D6" },
  { value: "friend", labelKey: "onboarding_ref_friend", icon: FiUsers, color: "#6b7280" },
  { value: "search", labelKey: "onboarding_ref_search", icon: SiGoogle, color: "#4285F4" },
  { value: "other", labelKey: "onboarding_ref_other", icon: FiMoreHorizontal, color: "#6b7280" },
];

interface SurveyPayload {
  self_level: Level | null;
  target_band: number | null;
  exam_date: string | null;
  focus: string | null; // comma-separated list of selected skills
  referral_source: Referral | null;
  referral_other: string | null;
}

async function saveOnboarding(payload: Partial<SurveyPayload>) {
  try {
    await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Best-effort: onboarding completion should never block the user.
  }
}

export default function OnboardingTour() {
  const { t } = useLanguage();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [step, setStep] = useState(0); // 0 welcome, 1..5 survey, 6 offer-tour

  const [level, setLevel] = useState<Level | null>(null);
  const [targetBand, setTargetBand] = useState<number | null>(null);
  const [examDate, setExamDate] = useState<string>("");
  const [examUnknown, setExamUnknown] = useState(false);
  const [focus, setFocus] = useState<Focus[]>([]);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [referralOther, setReferralOther] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(timer);
  }, []);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const toggleFocus = (value: Focus) =>
    setFocus((prev) => (prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]));

  const buildPayload = (): SurveyPayload => ({
    self_level: level,
    target_band: targetBand,
    exam_date: examUnknown || !examDate ? null : examDate,
    focus: focus.length ? focus.join(",") : null,
    referral_source: referral,
    referral_other: referral === "other" ? referralOther.trim() || null : null,
  });

  // Persist the survey answers and pre-load a level-matched practice essay.
  const persist = async () => {
    const chosenLevel: Level = level ?? "intermediate";
    const { topic, prompt, essay } = PROMPTS[chosenLevel];
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        taskType: "task2",
        prompt: { taskType: "task2", topic, prompt },
        essay,
        endTime: 0,
        useOwnTopic: false,
        timerEnabled: false,
      })
    );
    await saveOnboarding(buildPayload());
  };

  // Optional guided tour of the dashboard; ends by sending the user into their first essay.
  const runDashboardTour = () => {
    let completed = false;
    const driverObj = driver({
      showProgress: true,
      nextBtnText: t("onboarding_tour_next"),
      prevBtnText: t("onboarding_tour_back"),
      doneBtnText: t("onboarding_tour_done"),
      onNextClick: () => {
        if (driverObj.isLastStep()) completed = true;
        driverObj.moveNext();
      },
      onDestroyed: () => {
        if (completed) router.push("/writing?onboarding=1");
      },
      steps: [
        { popover: { title: t("onboarding_tour_intro_title"), description: t("onboarding_tour_intro_body") } },
        { element: "#nav-dashboard", popover: { title: t("onboarding_dashboard_title"), description: t("onboarding_dashboard_body"), side: "bottom", align: "start" } },
        { element: "#score-writing", popover: { title: t("onboarding_writing_title"), description: t("onboarding_writing_body"), side: "top", align: "start" } },
        { element: "#score-speaking", popover: { title: t("onboarding_speaking_title"), description: t("onboarding_speaking_body"), side: "top", align: "start" } },
        { element: "#nav-practice", popover: { title: t("onboarding_tour_practice_title"), description: t("onboarding_tour_practice_body"), side: "bottom", align: "start" } },
      ],
    });
    driverObj.drive();
  };

  // "Show me around" — hide the modal, persist, then run the dashboard tour.
  const takeTour = async () => {
    setClosed(true);
    await persist();
    runDashboardTour();
  };

  const skip = async () => {
    setClosed(true);
    await saveOnboarding(buildPayload());
  };

  if (closed) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* ---- Welcome ---- */}
        {step === 0 && (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 pt-10 pb-8 text-white text-center">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-2xl font-bold leading-tight">{t("onboarding_welcome_title")}</h2>
              <p className="mt-2 text-blue-100 text-sm">{t("onboarding_intro_value")}</p>
            </div>
            <div className="px-8 py-6 space-y-3">
              <button
                type="button"
                onClick={next}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                {t("onboarding_welcome_cta")}
              </button>
              <button
                type="button"
                onClick={skip}
                className="w-full text-xs text-gray-400 transition-colors hover:text-gray-600"
              >
                {t("onboarding_skip_setup")}
              </button>
            </div>
          </>
        )}

        {/* ---- Survey steps share a header (back / progress / skip) ---- */}
        {step >= 1 && step <= SURVEY_STEPS && (
          <>
            <div className="flex items-center justify-between px-5 pt-4">
              <button
                type="button"
                onClick={back}
                className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-700"
              >
                ← {t("onboarding_back")}
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: SURVEY_STEPS }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i + 1 === step ? "w-5 bg-blue-600" : i + 1 < step ? "w-1.5 bg-blue-300" : "w-1.5 bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={skip}
                className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-700"
              >
                {t("onboarding_skip_setup")}
              </button>
            </div>

            <div className="flex min-h-[20rem] flex-col justify-center px-8 pb-9 pt-5">
              {/* Step 1: current level */}
              {step === 1 && (
                <Question title={t("onboarding_pick_level")}>
                  <div className="space-y-3">
                    {LEVELS.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => {
                          setLevel(l.value);
                          next();
                        }}
                        className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${
                          level === l.value ? l.ring : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
                          <span className="font-semibold text-gray-800">{t(l.labelKey)}</span>
                        </div>
                        <span className="text-sm text-gray-500">{t(l.bandKey)}</span>
                      </button>
                    ))}
                  </div>
                </Question>
              )}

              {/* Step 2: target band */}
              {step === 2 && (
                <Question title={t("onboarding_q_target_title")} subtitle={t("onboarding_q_target_sub")}>
                  <div className="grid grid-cols-2 gap-3">
                    {TARGET_BANDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setTargetBand(b);
                          next();
                        }}
                        className={`rounded-xl border-2 px-4 py-4 text-lg font-bold transition-all ${
                          targetBand === b
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-800 hover:border-blue-300 hover:bg-blue-50/40"
                        }`}
                      >
                        {bandLabel(b)}
                      </button>
                    ))}
                  </div>
                </Question>
              )}

              {/* Step 3: exam date */}
              {step === 3 && (
                <Question title={t("onboarding_q_examdate_title")} subtitle={t("onboarding_q_examdate_sub")}>
                  <input
                    type="date"
                    min={today}
                    value={examDate}
                    onChange={(e) => {
                      setExamDate(e.target.value);
                      setExamUnknown(false);
                    }}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-800 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setExamUnknown((v) => !v);
                      setExamDate("");
                    }}
                    className={`mt-3 w-full rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                      examUnknown
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    {t("onboarding_examdate_unknown")}
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={!examDate && !examUnknown}
                    className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("onboarding_continue")}
                  </button>
                </Question>
              )}

              {/* Step 4: focus */}
              {step === 4 && (
                <Question title={t("onboarding_q_focus_title")} subtitle={t("onboarding_q_focus_sub")}>
                  <div className="space-y-3">
                    {FOCUSES.map((f) => {
                      const selected = focus.includes(f.value);
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => toggleFocus(f.value)}
                          className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                            selected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs text-white transition-colors ${
                              selected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                            }`}
                          >
                            {selected && "✓"}
                          </span>
                          <span className="text-xl">{f.icon}</span>
                          <span className="font-semibold text-gray-800">{t(f.labelKey)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    disabled={focus.length === 0}
                    className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("onboarding_continue")}
                  </button>
                </Question>
              )}

              {/* Step 5: referral */}
              {step === 5 && (
                <Question title={t("onboarding_q_referral_title")} subtitle={t("onboarding_q_referral_sub")}>
                  <div className="space-y-2">
                    {REFERRALS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => {
                          setReferral(r.value);
                          if (r.value !== "other") next();
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-2.5 transition-all ${
                          referral === r.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"
                        }`}
                      >
                        <r.icon className="text-lg" style={{ color: r.color }} aria-hidden />
                        <span className="font-medium text-gray-800">{t(r.labelKey)}</span>
                      </button>
                    ))}
                  </div>
                  {referral === "other" && (
                    <div className="mt-4">
                      <input
                        type="text"
                        value={referralOther}
                        onChange={(e) => setReferralOther(e.target.value)}
                        placeholder={t("onboarding_ref_other_placeholder")}
                        spellCheck={false}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-800 focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={next}
                        className="mt-4 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                      >
                        {t("onboarding_continue")}
                      </button>
                    </div>
                  )}
                </Question>
              )}
            </div>
          </>
        )}

        {/* ---- Offer a feature tour ---- */}
        {step === SURVEY_STEPS + 1 && (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 pt-10 pb-8 text-white text-center">
              <div className="text-5xl mb-4">🧭</div>
              <h2 className="text-2xl font-bold leading-tight">{t("onboarding_offer_tour_title")}</h2>
              <p className="mt-2 text-blue-100 text-sm">{t("onboarding_offer_tour_body")}</p>
            </div>
            <div className="px-8 py-6 space-y-3">
              <button
                type="button"
                onClick={takeTour}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                {t("onboarding_offer_tour_yes")}
              </button>
              <button
                type="button"
                onClick={skip}
                className="w-full rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                {t("onboarding_offer_tour_no")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Question({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="mt-1.5 mb-5 text-sm text-gray-500">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}
      {children}
    </div>
  );
}
