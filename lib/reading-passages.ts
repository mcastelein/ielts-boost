export type ReadingQuestion =
  | { id: string; type: "mcq"; text: string; options: string[]; answer: string }
  | { id: string; type: "tfng" | "ynng"; text: string; answer: string }
  | { id: string; type: "matching_headings"; paragraphLabel: string; answer: string }
  | { id: string; type: "matching_info"; text: string; answer: string }
  | {
      id: string;
      type: "sentence_completion" | "summary_completion";
      text: string;
      wordLimit: number;
      answer: string;
      answerVariants?: string[];
      wordBox?: string[];
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
