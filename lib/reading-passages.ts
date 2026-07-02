export type MCQAnswer = "A" | "B" | "C" | "D" | "E" | "F";

// Where in the passage a question's answer is found, plus a bilingual
// explanation of the paraphrase (and why wrong options fail, for mcq/tfng).
export interface AnswerExplanation {
  paragraph: string; // paragraph label, e.g. "B" — derived from position in passage_text
  quote: string; // verbatim sentence from that paragraph
  en: string;
  zh: string;
}

export type ReadingQuestion =
  | { id: string; type: "mcq"; text: string; options: string[]; answer: MCQAnswer; explanation?: AnswerExplanation }
  | { id: string; type: "tfng" | "ynng"; text: string; answer: string; explanation?: AnswerExplanation }
  | { id: string; type: "matching_headings"; paragraphLabel: string; answer: string; explanation?: AnswerExplanation }
  | { id: string; type: "matching_info"; text: string; answer: string; explanation?: AnswerExplanation }
  | {
      id: string;
      type: "sentence_completion" | "summary_completion";
      text: string;
      wordLimit: number;
      answer: string;
      answerVariants?: string[];
      wordBox?: string[];
      explanation?: AnswerExplanation;
    };

export interface QuestionGroup {
  instruction: string;
  sharedOptions?: string[];
  questions: ReadingQuestion[];
}

export interface ReadingPassage {
  id: string;
  title: string;
  examType: "academic";
  difficulty: 1 | 2 | 3;
  topicTags: string[];
  passageText: string;
  questionGroups: QuestionGroup[];
}

export function getTotalQuestions(passage: ReadingPassage): number {
  return passage.questionGroups.reduce((sum, g) => sum + g.questions.length, 0);
}
