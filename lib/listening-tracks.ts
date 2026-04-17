import type { QuestionGroup } from "./reading-passages";

export interface ListeningTrack {
  id: string;
  title: string;
  section: 1 | 2 | 3 | 4;
  difficulty: 1 | 2 | 3;
  topicTags: string[];
  /** Shown to the user before they start — describes the scenario */
  context: string;
  /** Full transcript — hidden during practice, shown in results */
  transcript: string;
  questionGroups: QuestionGroup[];
}

export function getTotalListeningQuestions(track: ListeningTrack): number {
  return track.questionGroups.reduce((sum, g) => sum + g.questions.length, 0);
}

// ─── Band Score Conversion (Listening) ───────────────────────────────────────
const LISTENING_BAND_TABLE: [number, number][] = [
  [39, 9.0],
  [37, 8.5],
  [35, 8.0],
  [32, 7.5],
  [30, 7.0],
  [26, 6.5],
  [23, 6.0],
  [18, 5.5],
  [16, 5.0],
  [13, 4.5],
  [11, 4.0],
  [8, 3.5],
  [6, 3.0],
  [4, 2.5],
];

export function rawToListeningBand(rawScore: number): number {
  for (const [threshold, band] of LISTENING_BAND_TABLE) {
    if (rawScore >= threshold) return band;
  }
  return 2.0;
}

// ─── Track Data ───────────────────────────────────────────────────────────────

export const LISTENING_TRACKS: ListeningTrack[] = [
  // ── Track 1: Community Library Phone Call (Section 1 style) ───────────────
  {
    id: "library-services",
    title: "Community Library Membership",
    section: 1,
    difficulty: 1,
    topicTags: ["everyday", "services", "form completion"],
    context:
      "You will hear a telephone conversation between a woman calling a community library and a staff member. The caller wants to register as a new member.",

    transcript: `Good morning, Millbrook Community Library, how can I help you?

Hello, yes, I'd like to register as a new member please. My name is Helen Carter — that's H-E-L-E-N, Carter, C-A-R-T-E-R.

Of course. And your date of birth?

The fourteenth of March, nineteen eighty-nine.

And a contact phone number?

Sure, it's zero seven eight two three, four five six, one nine zero.

And your postcode?

SW twelve, nine BT.

Thank you. Now, we offer two types of membership. Standard membership is free and gives you borrowing rights for up to eight items at a time. Premium membership is twelve pounds per year and includes digital borrowing — ebooks and audiobooks — as well as priority booking for events.

Oh, the digital borrowing sounds very useful. I travel quite a lot for work, so I'd like the premium membership please.

Excellent. When would you like to start?

I'd like to start from the first of May if possible.

That's no problem at all. I should mention a few of our regular events. We have a book club that meets every Wednesday evening at seven. We also offer a children's storytelling hour on Saturday mornings at ten o'clock — that one is designed for children between four and eight years of age.

Oh, my daughter is six, so that might be perfect for her. One more thing — I noticed on your website you have a café. Is it open to everyone?

Yes, the café is open to non-members and members alike during library opening hours. It does close at five-thirty, which is half an hour before the library itself shuts at six.

Wonderful. Thank you so much for all the information.

You're very welcome. You'll receive a confirmation email within twenty-four hours, and your membership card will be posted to you within five working days.`,

    questionGroups: [
      {
        instruction:
          "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        questions: [
          {
            id: "ls-q1",
            type: "sentence_completion",
            text: "Member's surname: ______",
            wordLimit: 1,
            answer: "Carter",
          },
          {
            id: "ls-q2",
            type: "sentence_completion",
            text: "Phone number: 07823 456 ______",
            wordLimit: 3,
            answer: "190",
          },
          {
            id: "ls-q3",
            type: "sentence_completion",
            text: "Postcode: ______ 9BT",
            wordLimit: 1,
            answer: "SW12",
          },
          {
            id: "ls-q4",
            type: "sentence_completion",
            text: "Membership type: ______",
            wordLimit: 1,
            answer: "premium",
          },
          {
            id: "ls-q5",
            type: "sentence_completion",
            text: "Membership start date: 1st ______",
            wordLimit: 1,
            answer: "May",
          },
        ],
      },
      {
        instruction: "Choose the correct letter, A, B or C.",
        questions: [
          {
            id: "ls-q6",
            type: "mcq",
            text: "Why does the caller choose premium membership?",
            options: [
              "A  It is cheaper than standard membership.",
              "B  It includes digital borrowing.",
              "C  It allows borrowing more physical items.",
            ],
            answer: "B",
          },
          {
            id: "ls-q7",
            type: "mcq",
            text: "When does the book club meet?",
            options: [
              "A  Tuesday evenings at seven",
              "B  Wednesday mornings at ten",
              "C  Wednesday evenings at seven",
            ],
            answer: "C",
          },
          {
            id: "ls-q8",
            type: "mcq",
            text: "The children's storytelling hour is aimed at children aged:",
            options: ["A  Two to six", "B  Four to eight", "C  Six to ten"],
            answer: "B",
          },
          {
            id: "ls-q9",
            type: "mcq",
            text: "The café closes at:",
            options: [
              "A  Five o'clock",
              "B  Five thirty",
              "C  Six o'clock",
            ],
            answer: "B",
          },
          {
            id: "ls-q10",
            type: "mcq",
            text: "How long after registration will the membership card arrive?",
            options: [
              "A  Within two working days",
              "B  Within five working days",
              "C  Within seven working days",
            ],
            answer: "B",
          },
        ],
      },
    ],
  },

  // ── Track 2: Urban Farming Lecture (Section 4 style) ──────────────────────
  {
    id: "urban-farming",
    title: "Urban Farming: Cities and Food",
    section: 4,
    difficulty: 2,
    topicTags: ["academic", "environment", "science"],
    context:
      "You will hear a university lecture about urban farming, its benefits, and the challenges it faces in modern cities.",

    transcript: `Good morning. Today I want to talk about urban farming — the practice of cultivating food within or around cities — and why it is attracting growing interest from urban planners, environmentalists, and governments worldwide.

The idea is not as modern as it might seem. Throughout history, cities incorporated food production into their design. However, the twentieth century brought rapid industrialisation, and cities became almost entirely dependent on distant rural farmland for their food supply.

Now, several pressures are forcing a rethink. Chief among these is food security. With global populations expected to reach ten billion by mid-century, and climate change making traditional farming zones increasingly unreliable, there is growing urgency around how cities will feed themselves.

One of the most exciting responses has been the rise of vertical farming. These are purpose-built indoor facilities, often located in unused warehouse space, that use stacked growing layers, LED lighting, and hydroponic systems — that is, growing without soil — to produce crops year-round. The productivity gains are remarkable: compared to conventional agriculture, vertical farms use up to ninety-five percent less water and can yield three hundred times more produce per square metre.

The main drawback, however, is energy. Artificial lighting is expensive, and without renewable energy sources, the carbon footprint of vertical farms can actually exceed that of conventional farms. This is why the most successful urban farming operations tend to be in regions with affordable clean electricity.

There are also significant social benefits. Community gardens — smaller-scale projects inviting residents to grow food in shared spaces — have been linked to lower rates of food insecurity, improved mental health outcomes, and stronger community bonds. Research conducted in the Dutch city of Rotterdam found that residents living near community gardens reported higher levels of social interaction and a greater sense of belonging.

Critics, however, raise practical barriers. Urban land is expensive, and regulatory systems in many countries still treat commercial food growing within city limits as unnecessarily bureaucratic. Despite this, cities including Singapore, Tokyo, and New York have all begun incorporating urban agriculture into their official development strategies. The shift, it seems, is well underway.`,

    questionGroups: [
      {
        instruction:
          "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        sharedOptions: undefined,
        questions: [
          {
            id: "uf-q1",
            type: "sentence_completion",
            text: "Global population expected to reach ______ billion by mid-century.",
            wordLimit: 2,
            answer: "10",
            answerVariants: ["ten"],
          },
          {
            id: "uf-q2",
            type: "sentence_completion",
            text: "Vertical farms use up to ______% less water than conventional farms.",
            wordLimit: 2,
            answer: "95",
            answerVariants: ["ninety-five"],
          },
          {
            id: "uf-q3",
            type: "sentence_completion",
            text: "Vertical farms can yield ______ times more produce per square metre.",
            wordLimit: 2,
            answer: "300",
            answerVariants: ["three hundred"],
          },
          {
            id: "uf-q4",
            type: "sentence_completion",
            text: "The main drawback of vertical farming is ______.",
            wordLimit: 1,
            answer: "energy",
          },
          {
            id: "uf-q5",
            type: "sentence_completion",
            text: "Research in ______ found community gardens improve social interaction.",
            wordLimit: 1,
            answer: "Rotterdam",
          },
          {
            id: "uf-q6",
            type: "sentence_completion",
            text: "Three cities incorporating urban farming into planning: Singapore, ______, and New York.",
            wordLimit: 1,
            answer: "Tokyo",
          },
        ],
      },
      {
        instruction: "Choose the correct letter, A, B or C.",
        questions: [
          {
            id: "uf-q7",
            type: "mcq",
            text: "Why did cities become dependent on distant farmland for food?",
            options: [
              "A  Soil in cities became polluted.",
              "B  Rapid industrialisation in the twentieth century separated urban and rural life.",
              "C  Rural populations declined sharply.",
            ],
            answer: "B",
          },
          {
            id: "uf-q8",
            type: "mcq",
            text: "What makes vertical farming most successful in certain regions?",
            options: [
              "A  Lower labour costs",
              "B  Government subsidies",
              "C  Affordable renewable energy",
            ],
            answer: "C",
          },
          {
            id: "uf-q9",
            type: "mcq",
            text: "Which of the following is NOT mentioned as a benefit of community gardens?",
            options: [
              "A  Reduced food insecurity",
              "B  Improved mental health",
              "C  Reduced crime rates",
            ],
            answer: "C",
          },
          {
            id: "uf-q10",
            type: "mcq",
            text: "What challenge do critics highlight regarding urban farming in cities?",
            options: [
              "A  Lack of skilled agricultural workers",
              "B  High land costs and complex regulations",
              "C  Low consumer demand for locally grown food",
            ],
            answer: "B",
          },
        ],
      },
    ],
  },
];
