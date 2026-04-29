import type { ReadingPassage, QuestionGroup } from "./reading-passages";

interface ReadingPassageRow {
  slug: string;
  title: string;
  exam_type: string;
  difficulty: 1 | 2 | 3;
  topic_tags: string[];
  passage_text: string;
  question_groups: QuestionGroup[];
}

export function dbRowToPassage(row: ReadingPassageRow): ReadingPassage {
  return {
    id: row.slug,
    title: row.title,
    examType: row.exam_type as "academic",
    difficulty: row.difficulty,
    topicTags: row.topic_tags,
    passageText: row.passage_text,
    questionGroups: row.question_groups,
  };
}
