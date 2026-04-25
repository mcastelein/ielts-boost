"use client";

import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";

type Cell = TranslationKey | "yes" | "no" | "partial";

const columns: TranslationKey[] = [
  "landing_compare_col_us",
  "landing_compare_col_tutor",
  "landing_compare_col_books",
  "landing_compare_col_chatgpt",
  "landing_compare_col_zh_platforms",
];

const rows: { labelKey: TranslationKey; cells: Cell[] }[] = [
  {
    labelKey: "landing_compare_row_cost",
    cells: [
      "landing_compare_cost_us",
      "landing_compare_cost_tutor",
      "landing_compare_cost_books",
      "landing_compare_cost_chatgpt",
      "landing_compare_cost_zh_platforms",
    ],
  },
  {
    labelKey: "landing_compare_row_speed",
    cells: [
      "landing_compare_speed_us",
      "landing_compare_speed_tutor",
      "landing_compare_speed_books",
      "landing_compare_speed_chatgpt",
      "landing_compare_speed_zh_platforms",
    ],
  },
  { labelKey: "landing_compare_row_criteria", cells: ["yes", "yes", "partial", "no", "partial"] },
  { labelKey: "landing_compare_row_chinese", cells: ["yes", "yes", "no", "partial", "yes"] },
  { labelKey: "landing_compare_row_tracks", cells: ["yes", "partial", "no", "no", "partial"] },
  { labelKey: "landing_compare_row_24_7", cells: ["yes", "no", "yes", "yes", "yes"] },
];

export default function ComparisonTable() {
  const { t } = useLanguage();

  function renderCell(c: Cell, isUs: boolean) {
    if (c === "yes") {
      return <span className={isUs ? "font-semibold text-green-700" : "text-green-600"}>{t("landing_compare_yes")}</span>;
    }
    if (c === "no") return <span className="text-gray-400">{t("landing_compare_no")}</span>;
    if (c === "partial") return <span className="text-gray-500">{t("landing_compare_partial")}</span>;
    return <span className={isUs ? "font-semibold text-gray-900" : "text-gray-600"}>{t(c)}</span>;
  }

  return (
    <section id="comparison" className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("landing_compare_title")}
        </h2>
        <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium text-gray-500"></th>
                {columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`px-4 py-3 font-semibold ${i === 0 ? "text-blue-700" : "text-gray-700"}`}
                  >
                    {t(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.labelKey} className="border-b border-gray-100 last:border-b-0">
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    {t(r.labelKey)}
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={i} className={`px-4 py-3 ${i === 0 ? "bg-blue-50/50" : ""}`}>
                      {renderCell(c, i === 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
