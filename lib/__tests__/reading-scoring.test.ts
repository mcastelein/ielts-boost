import { describe, it, expect } from "vitest";
import {
  normalizeAnswer,
  rawToBand,
  checkAnswerDeterministic,
} from "../reading-scoring";
import type { ReadingQuestion } from "../reading-passages";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mcq(answer: "A" | "B" | "C" | "D" | "E" | "F"): ReadingQuestion {
  return { id: "q1", type: "mcq", text: "Q", options: ["A", "B", "C", "D"], answer };
}

function tfng(answer: string): ReadingQuestion {
  return { id: "q1", type: "tfng", text: "Q", answer };
}

function ynng(answer: string): ReadingQuestion {
  return { id: "q1", type: "ynng", text: "Q", answer };
}

function matchingHeadings(answer: string): ReadingQuestion {
  return { id: "q1", type: "matching_headings", paragraphLabel: "A", answer };
}

function matchingInfo(answer: string): ReadingQuestion {
  return { id: "q1", type: "matching_info", text: "Q", answer };
}

function sentenceCompletion(answer: string): ReadingQuestion {
  return { id: "q1", type: "sentence_completion", text: "Q", wordLimit: 2, answer };
}

function summaryCompletion(answer: string): ReadingQuestion {
  return { id: "q1", type: "summary_completion", text: "Q", wordLimit: 2, answer };
}

// ─── normalizeAnswer ──────────────────────────────────────────────────────────

describe("normalizeAnswer", () => {
  it("trims leading and trailing whitespace", () => {
    expect(normalizeAnswer("  hello  ")).toBe("hello");
  });

  it("lowercases the input", () => {
    expect(normalizeAnswer("TRUE")).toBe("true");
    expect(normalizeAnswer("Not Given")).toBe("not given");
  });

  it("collapses multiple spaces to one", () => {
    expect(normalizeAnswer("not  given")).toBe("not given");
  });

  it("strips a single trailing punctuation character", () => {
    expect(normalizeAnswer("true.")).toBe("true");
    expect(normalizeAnswer("false,")).toBe("false");
    expect(normalizeAnswer("yes!")).toBe("yes");
  });

  it("does not strip multiple trailing punctuation characters", () => {
    // Documents the current known limit — input with two trailing chars is not cleaned
    expect(normalizeAnswer("true..")).toBe("true.");
  });

  it("leaves internal punctuation intact", () => {
    expect(normalizeAnswer("well-known")).toBe("well-known");
  });
});

// ─── rawToBand ────────────────────────────────────────────────────────────────

describe("rawToBand", () => {
  it("maps known thresholds correctly", () => {
    expect(rawToBand(39)).toBe(9.0);
    expect(rawToBand(37)).toBe(8.5);
    expect(rawToBand(35)).toBe(8.0);
    expect(rawToBand(33)).toBe(7.5);
    expect(rawToBand(30)).toBe(7.0);
    expect(rawToBand(27)).toBe(6.5);
    expect(rawToBand(23)).toBe(6.0);
    expect(rawToBand(19)).toBe(5.5);
    expect(rawToBand(15)).toBe(5.0);
    expect(rawToBand(13)).toBe(4.5);
    expect(rawToBand(10)).toBe(4.0);
    expect(rawToBand(8)).toBe(3.5);
    expect(rawToBand(6)).toBe(3.0);
    expect(rawToBand(4)).toBe(2.5);
  });

  it("scores between thresholds get the lower band", () => {
    expect(rawToBand(38)).toBe(8.5); // 38 is below 39 but >= 37
    expect(rawToBand(31)).toBe(7.0); // between 30 and 33
  });

  it("perfect score of 40 maps to 9.0", () => {
    expect(rawToBand(40)).toBe(9.0);
  });

  it("scores below the lowest threshold return 2.0", () => {
    expect(rawToBand(0)).toBe(2.0);
    expect(rawToBand(3)).toBe(2.0);
  });

  it("scales non-40-question tests before lookup", () => {
    // 10/13 → Math.round((10/13)*40) = Math.round(30.77) = 31 → 7.0
    expect(rawToBand(10, 13)).toBe(7.0);
    // 13/13 → 40 → 9.0
    expect(rawToBand(13, 13)).toBe(9.0);
    // 0/13 → 0 → 2.0
    expect(rawToBand(0, 13)).toBe(2.0);
  });
});

// ─── checkAnswerDeterministic — MCQ ──────────────────────────────────────────

describe("checkAnswerDeterministic / mcq", () => {
  it("returns true for the correct lowercase letter", () => {
    expect(checkAnswerDeterministic(mcq("B"), "b")).toBe(true);
  });

  it("returns true for the correct uppercase letter", () => {
    expect(checkAnswerDeterministic(mcq("B"), "B")).toBe(true);
  });

  it("returns false for a wrong letter", () => {
    expect(checkAnswerDeterministic(mcq("B"), "C")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(checkAnswerDeterministic(mcq("A"), "")).toBe(false);
  });
});

// ─── checkAnswerDeterministic — TFNG ─────────────────────────────────────────

describe("checkAnswerDeterministic / tfng", () => {
  it("accepts 'true' and 't' for TRUE", () => {
    expect(checkAnswerDeterministic(tfng("TRUE"), "true")).toBe(true);
    expect(checkAnswerDeterministic(tfng("TRUE"), "t")).toBe(true);
    expect(checkAnswerDeterministic(tfng("TRUE"), "True")).toBe(true);
    expect(checkAnswerDeterministic(tfng("TRUE"), "T")).toBe(true);
  });

  it("accepts 'false' and 'f' for FALSE", () => {
    expect(checkAnswerDeterministic(tfng("FALSE"), "false")).toBe(true);
    expect(checkAnswerDeterministic(tfng("FALSE"), "f")).toBe(true);
    expect(checkAnswerDeterministic(tfng("FALSE"), "False")).toBe(true);
    expect(checkAnswerDeterministic(tfng("FALSE"), "F")).toBe(true);
  });

  it("accepts 'not given' and 'ng' for NOT GIVEN", () => {
    expect(checkAnswerDeterministic(tfng("NOT GIVEN"), "not given")).toBe(true);
    expect(checkAnswerDeterministic(tfng("NOT GIVEN"), "ng")).toBe(true);
    expect(checkAnswerDeterministic(tfng("NOT GIVEN"), "Not Given")).toBe(true);
    expect(checkAnswerDeterministic(tfng("NOT GIVEN"), "NG")).toBe(true);
  });

  it("returns false for wrong answers", () => {
    expect(checkAnswerDeterministic(tfng("TRUE"), "false")).toBe(false);
    expect(checkAnswerDeterministic(tfng("FALSE"), "not given")).toBe(false);
    expect(checkAnswerDeterministic(tfng("NOT GIVEN"), "true")).toBe(false);
  });

  it("returns false for unrecognised input", () => {
    expect(checkAnswerDeterministic(tfng("TRUE"), "yes")).toBe(false);
    expect(checkAnswerDeterministic(tfng("TRUE"), "")).toBe(false);
  });
});

// ─── checkAnswerDeterministic — YNNG ─────────────────────────────────────────

describe("checkAnswerDeterministic / ynng", () => {
  it("accepts 'yes' and 'y' for YES", () => {
    expect(checkAnswerDeterministic(ynng("YES"), "yes")).toBe(true);
    expect(checkAnswerDeterministic(ynng("YES"), "y")).toBe(true);
    expect(checkAnswerDeterministic(ynng("YES"), "Yes")).toBe(true);
    expect(checkAnswerDeterministic(ynng("YES"), "Y")).toBe(true);
  });

  it("accepts 'no' and 'n' for NO", () => {
    expect(checkAnswerDeterministic(ynng("NO"), "no")).toBe(true);
    expect(checkAnswerDeterministic(ynng("NO"), "n")).toBe(true);
    expect(checkAnswerDeterministic(ynng("NO"), "No")).toBe(true);
    expect(checkAnswerDeterministic(ynng("NO"), "N")).toBe(true);
  });

  it("returns false for wrong answers", () => {
    expect(checkAnswerDeterministic(ynng("YES"), "no")).toBe(false);
    expect(checkAnswerDeterministic(ynng("NO"), "yes")).toBe(false);
  });
});

// ─── checkAnswerDeterministic — matching_headings ────────────────────────────

describe("checkAnswerDeterministic / matching_headings", () => {
  it("matches roman numerals exactly", () => {
    expect(checkAnswerDeterministic(matchingHeadings("iii"), "iii")).toBe(true);
    expect(checkAnswerDeterministic(matchingHeadings("vii"), "vii")).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(checkAnswerDeterministic(matchingHeadings("iii"), "III")).toBe(true);
    expect(checkAnswerDeterministic(matchingHeadings("VII"), "vii")).toBe(true);
  });

  it("returns false for wrong numeral", () => {
    expect(checkAnswerDeterministic(matchingHeadings("iii"), "iv")).toBe(false);
  });
});

// ─── checkAnswerDeterministic — matching_info ────────────────────────────────

describe("checkAnswerDeterministic / matching_info", () => {
  it("matches paragraph letters exactly", () => {
    expect(checkAnswerDeterministic(matchingInfo("B"), "B")).toBe(true);
    expect(checkAnswerDeterministic(matchingInfo("B"), "b")).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(checkAnswerDeterministic(matchingInfo("E"), "e")).toBe(true);
    expect(checkAnswerDeterministic(matchingInfo("e"), "E")).toBe(true);
  });

  it("returns false for wrong letter", () => {
    expect(checkAnswerDeterministic(matchingInfo("B"), "C")).toBe(false);
  });
});

// ─── checkAnswerDeterministic — completion types ─────────────────────────────

describe("checkAnswerDeterministic / completion types", () => {
  it("returns null for sentence_completion (deferred to Claude)", () => {
    expect(checkAnswerDeterministic(sentenceCompletion("carbon"), "carbon")).toBeNull();
  });

  it("returns null for summary_completion (deferred to Claude)", () => {
    expect(checkAnswerDeterministic(summaryCompletion("solar energy"), "solar energy")).toBeNull();
  });
});
