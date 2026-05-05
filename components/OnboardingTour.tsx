"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

type Level = "beginner" | "intermediate" | "advanced";

const SESSION_KEY = "ieltsboost_writing_session";

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

async function markComplete() {
  await fetch("/api/onboarding/complete", { method: "POST" });
}

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [pickerDone, setPickerDone] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = async () => {
    setPickerDone(true);
    await markComplete();
  };

  const handleLevelSelect = (level: Level) => {
    setPickerDone(true);

    const { topic, prompt, essay } = PROMPTS[level];
    let completed = false;

    const driverObj = driver({
      showProgress: true,
      nextBtnText: t("onboarding_tour_next"),
      prevBtnText: t("onboarding_tour_back"),
      doneBtnText: t("onboarding_tour_done"),
      onNextClick: () => {
        if (driverObj.isLastStep()) {
          completed = true;
        }
        driverObj.moveNext();
      },
      onDestroyed: async () => {
        await markComplete();
        if (completed) {
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
          router.push("/writing?onboarding=1");
        }
      },
      steps: [
        {
          popover: {
            title: t("onboarding_tour_intro_title"),
            description: t("onboarding_tour_intro_body"),
          },
        },
        {
          element: "#nav-dashboard",
          popover: {
            title: t("onboarding_dashboard_title"),
            description: t("onboarding_dashboard_body"),
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#score-writing",
          popover: {
            title: t("onboarding_writing_title"),
            description: t("onboarding_writing_body"),
            side: "top",
            align: "start",
          },
        },
        {
          element: "#score-speaking",
          popover: {
            title: t("onboarding_speaking_title"),
            description: t("onboarding_speaking_body"),
            side: "top",
            align: "start",
          },
        },
        {
          element: "#nav-practice",
          popover: {
            title: t("onboarding_tour_practice_title"),
            description: t("onboarding_tour_practice_body"),
            side: "bottom",
            align: "start",
          },
        },
      ],
    });

    driverObj.drive();
  };

  if (pickerDone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 pt-10 pb-8 text-white text-center">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="text-2xl font-bold leading-tight">{t("onboarding_welcome_title")}</h2>
          <p className="mt-2 text-blue-100 text-sm">{t("onboarding_welcome_subtitle")}</p>
        </div>

        {/* Level picker */}
        <div className="px-8 py-6">
          <p className="text-sm font-semibold text-gray-700 text-center mb-4">
            {t("onboarding_pick_level")}
          </p>
          <div className="space-y-3">
            {(
              [
                {
                  level: "beginner" as Level,
                  labelKey: "onboarding_level_beginner",
                  bandKey: "onboarding_level_beginner_band",
                  color: "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
                  dot: "bg-emerald-500",
                },
                {
                  level: "intermediate" as Level,
                  labelKey: "onboarding_level_intermediate",
                  bandKey: "onboarding_level_intermediate_band",
                  color: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
                  dot: "bg-blue-500",
                },
                {
                  level: "advanced" as Level,
                  labelKey: "onboarding_level_advanced",
                  bandKey: "onboarding_level_advanced_band",
                  color: "border-purple-200 hover:border-purple-400 hover:bg-purple-50",
                  dot: "bg-purple-500",
                },
              ] as const
            ).map(({ level, labelKey, bandKey, color, dot }) => (
              <button
                key={level}
                onClick={() => handleLevelSelect(level)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${color}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                  <span className="font-semibold text-gray-800">{t(labelKey)}</span>
                </div>
                <span className="text-sm text-gray-500">{t(bandKey)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Skip */}
        <div className="px-8 pb-6 text-center">
          <button
            onClick={handleSkip}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("onboarding_skip")}
          </button>
        </div>
      </div>
    </div>
  );
}
