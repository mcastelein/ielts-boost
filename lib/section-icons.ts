export const sectionIcons = {
  listening: "🎧",
  reading: "📖",
  writing: "✍️",
  speaking: "🎤",
} as const;

export type SectionKey = keyof typeof sectionIcons;
