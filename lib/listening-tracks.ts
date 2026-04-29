import type { QuestionGroup } from "./reading-passages";

export interface ListeningTrack {
  id: string;
  title: string;
  section: 1 | 2 | 3 | 4;
  difficulty: 1 | 2 | 3;
  topicTags: string[];
  context: string;
  transcript: string;
  questionGroups: QuestionGroup[];
  audioUrl?: string; // pre-generated Storage URL; undefined until generate-audio.ts runs
}

export function getTotalListeningQuestions(track: ListeningTrack): number {
  return track.questionGroups.reduce((sum, g) => sum + g.questions.length, 0);
}

const LISTENING_BAND_TABLE: [number, number][] = [
  [39, 9.0], [37, 8.5], [35, 8.0], [32, 7.5], [30, 7.0],
  [26, 6.5], [23, 6.0], [18, 5.5], [16, 5.0], [13, 4.5],
  [11, 4.0], [8, 3.5],  [6, 3.0],  [4, 2.5],
];

export function rawToListeningBand(rawScore: number): number {
  for (const [threshold, band] of LISTENING_BAND_TABLE) {
    if (rawScore >= threshold) return band;
  }
  return 2.0;
}
