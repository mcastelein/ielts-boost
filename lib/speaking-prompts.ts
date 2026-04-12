export interface SpeakingPrompt {
  part: 1 | 2 | 3;
  topic: string;
  question: string;
  followUp?: string[];
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  // Part 1 - Simple questions
  {
    part: 1,
    topic: "Hometown",
    question: "Where is your hometown? What do you like about it?",
  },
  {
    part: 1,
    topic: "Work / Study",
    question: "Do you work or are you a student? What do you enjoy about it?",
  },
  {
    part: 1,
    topic: "Daily Routine",
    question: "What does a typical day look like for you?",
  },
  {
    part: 1,
    topic: "Hobbies",
    question: "What do you do in your free time?",
  },
  {
    part: 1,
    topic: "Weather",
    question: "What kind of weather do you like? Does it affect your mood?",
  },
  {
    part: 1,
    topic: "Food",
    question: "What is your favorite type of food? Do you enjoy cooking?",
  },
  {
    part: 1,
    topic: "Travel",
    question: "Do you like traveling? Where would you like to go next?",
  },
  {
    part: 1,
    topic: "Reading",
    question: "Do you enjoy reading? What kind of books do you like?",
  },

  // Part 2 - Long turn (cue card)
  {
    part: 2,
    topic: "A Place You Visited",
    question:
      "Describe a place you visited that you found interesting. You should say: where it was, when you went there, what you did there, and explain why you found it interesting.",
  },
  {
    part: 2,
    topic: "A Person You Admire",
    question:
      "Describe a person you admire. You should say: who this person is, how you know them, what they do, and explain why you admire them.",
  },
  {
    part: 2,
    topic: "A Skill You Learned",
    question:
      "Describe a skill you learned that you found useful. You should say: what the skill is, when you learned it, how you learned it, and explain why you found it useful.",
  },
  {
    part: 2,
    topic: "A Childhood Memory",
    question:
      "Describe a happy memory from your childhood. You should say: what happened, when it happened, who was with you, and explain why it is a happy memory.",
  },
  {
    part: 2,
    topic: "A Difficult Decision",
    question:
      "Describe a difficult decision you had to make. You should say: what the decision was, why it was difficult, what you decided, and explain how you felt about it afterwards.",
  },

  // Part 3 - Discussion
  {
    part: 3,
    topic: "Technology and Society",
    question:
      "How has technology changed the way people communicate? Do you think this is a positive change?",
  },
  {
    part: 3,
    topic: "Education",
    question:
      "Do you think the education system in your country prepares students well for the future? What changes would you suggest?",
  },
  {
    part: 3,
    topic: "Environment",
    question:
      "What are the biggest environmental challenges facing your country? What should individuals do to help?",
  },
  {
    part: 3,
    topic: "Work-Life Balance",
    question:
      "Do people in your country tend to work too much? How important is work-life balance?",
  },
  {
    part: 3,
    topic: "Globalization",
    question:
      "How has globalization affected local cultures? Is this something that concerns you?",
  },
];

const USED_SPEAKING_KEY = "ieltsboost_used_speaking";

function getUsedSpeakingTopics(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USED_SPEAKING_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function markSpeakingTopicUsed(topic: string) {
  if (typeof window === "undefined") return;
  const used = getUsedSpeakingTopics();
  if (!used.includes(topic)) {
    used.push(topic);
    localStorage.setItem(USED_SPEAKING_KEY, JSON.stringify(used));
  }
}

export function getRandomPrompt(part?: 1 | 2 | 3): SpeakingPrompt {
  const filtered = part
    ? SPEAKING_PROMPTS.filter((p) => p.part === part)
    : SPEAKING_PROMPTS;

  const usedTopics = getUsedSpeakingTopics();
  let available = filtered.filter((p) => !usedTopics.includes(p.topic));

  // If all prompts for this part have been used, reset history for this part
  if (available.length === 0) {
    const resetTopics = usedTopics.filter(
      (t) => !filtered.some((p) => p.topic === t)
    );
    localStorage.setItem(USED_SPEAKING_KEY, JSON.stringify(resetTopics));
    available = filtered;
  }

  const chosen = available[Math.floor(Math.random() * available.length)];
  markSpeakingTopicUsed(chosen.topic);
  return chosen;
}
