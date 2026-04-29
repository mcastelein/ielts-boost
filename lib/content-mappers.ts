import type { ReadingPassage, QuestionGroup } from "./reading-passages";
import type { ListeningTrack } from "./listening-tracks";

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

interface ListeningTrackRow {
  slug: string;
  title: string;
  section: 1 | 2 | 3 | 4;
  difficulty: 1 | 2 | 3;
  topic_tags: string[];
  context: string;
  transcript: string;
  question_groups: QuestionGroup[];
  audio_url: string | null;
}

export function dbRowToTrack(row: ListeningTrackRow): ListeningTrack {
  return {
    id: row.slug,
    title: row.title,
    section: row.section,
    difficulty: row.difficulty,
    topicTags: row.topic_tags,
    context: row.context,
    transcript: row.transcript,
    questionGroups: row.question_groups,
    audioUrl: row.audio_url ?? undefined,
  };
}
