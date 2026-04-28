export interface SpeakingPrompt {
  part: 1 | 2 | 3;
  topic: string;
  question: string;
  followUp?: string[];
}
