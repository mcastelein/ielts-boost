// ─── Types ───────────────────────────────────────────────────────────────────

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
  /** For matching_headings: the list of heading options (labelled i–viii etc.)
   *  For summary_completion with a word box: the word options (A–H etc.)
   *  Not used for other types. */
  sharedOptions?: string[];
  questions: ReadingQuestion[];
}

export interface ReadingPassage {
  id: string; // used as passageSlug in DB
  title: string;
  examType: "academic";
  difficulty: 1 | 2 | 3;
  topicTags: string[];
  /** Double-newline (\n\n) separates paragraphs. PassageViewer labels them A, B, C… */
  passageText: string;
  questionGroups: QuestionGroup[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getTotalQuestions(passage: ReadingPassage): number {
  return passage.questionGroups.reduce((sum, g) => sum + g.questions.length, 0);
}

// ─── Passage Data ─────────────────────────────────────────────────────────────

export const READING_PASSAGES: ReadingPassage[] = [
  // ── Passage 1: The Decline of Coral Reefs ──────────────────────────────────
  {
    id: "coral-reef-decline",
    title: "The Decline of Coral Reefs",
    examType: "academic",
    difficulty: 2,
    topicTags: ["science", "environment"],
    passageText: `Coral reefs cover less than one percent of the ocean floor yet support approximately 25 percent of all marine species. Often described as the rainforests of the sea, they provide critical ecosystem services, including coastal protection, food security for over one billion people worldwide, and materials used in developing medicines for conditions ranging from cancer to heart disease. Their complex three-dimensional structures, built over thousands of years by tiny marine animals called polyps, create habitats so rich in biodiversity that scientists estimate only a fraction of reef species have yet been identified.

Despite their importance, coral reefs are vanishing at an alarming rate. Research published by the Global Coral Reef Monitoring Network indicates that the world has lost approximately 50 percent of its coral reefs since the 1950s. In the Caribbean, losses have exceeded 80 percent in some areas. The Great Barrier Reef, the largest coral structure on Earth stretching over 2,300 kilometres along the Australian coast, lost more than half of its coral cover between 1986 and 2012. Scientists warn that without decisive intervention, functional coral reefs could largely disappear by 2050.

The principal driver of reef degradation is rising ocean temperatures caused by climate change. Coral polyps maintain a fragile symbiotic relationship with photosynthetic algae called zooxanthellae, which live within the coral tissue and supply up to 90 percent of the coral's energy needs through photosynthesis. When sea temperatures rise by as little as one or two degrees Celsius above the seasonal maximum for a sustained period, corals expel their algal partners in a stress response known as bleaching. Without the algae, the coral loses both its primary food source and its characteristic colour. Although bleached corals can recover if temperatures return to normal quickly enough, prolonged heat exposure leads to mass mortality.

A secondary but increasingly serious threat comes from ocean acidification. The ocean absorbs roughly 25 percent of the carbon dioxide released into the atmosphere each year. As CO₂ dissolves in seawater, it forms carbonic acid, lowering the ocean's pH. Since the Industrial Revolution, average ocean pH has dropped from approximately 8.2 to 8.1 — a seemingly small change that nonetheless represents a 26 percent increase in acidity on the logarithmic pH scale. Reef-building corals and other calcifying organisms depend on calcium carbonate to construct their skeletons and shells. More acidic conditions slow this calcification process, weaken existing structures, and make it harder for damaged reefs to regenerate.

Local human pressures compound the damage from climate change. Destructive fishing practices such as bottom trawling and blast fishing physically destroy reef structures, while overfishing disrupts the ecological balance that keeps reefs healthy. Excess nutrients from agricultural runoff trigger algal blooms that smother corals and block sunlight. Coastal development destroys the mangrove forests and seagrass beds that normally filter sediment and nutrients before they reach reefs. Even mass tourism, while generating income that can fund conservation, brings physical damage through boat anchoring, snorkelling contact, and pollution from sunscreen chemicals.

Bleaching events are becoming more frequent and more severe. Before the 1980s, mass bleaching events were virtually unrecorded. The first global bleaching event occurred in 1998 during an exceptionally strong El Niño and destroyed 16 percent of the world's coral reefs in a single year. Two further global bleaching events followed in 2010 and between 2014 and 2017, the latter being the longest and most damaging on record. Scientists predict that bleaching-level heat events, which currently occur on average every 25 to 30 years in most regions, will strike every five to ten years by mid-century under moderate emissions scenarios — too frequently for reef ecosystems to recover between events.

Despite the grim trajectory, some scientists and conservationists argue that targeted interventions may help reefs adapt. Selective breeding programmes are attempting to develop more heat-tolerant coral strains. Reef restoration projects, in which coral fragments are grown in underwater nurseries and transplanted onto degraded reefs, have shown promise in some locations. Marine protected areas, when properly enforced, reduce local stressors and give reefs a better chance of recovering from bleaching. Critics point out, however, that these measures address symptoms rather than causes, and that only rapid, deep reductions in global greenhouse gas emissions can prevent the conditions that make mass recovery impossible.`,
    questionGroups: [
      {
        instruction:
          "Choose the correct letter, A, B, C or D.",
        questions: [
          {
            id: "cr-q1",
            type: "mcq",
            text: "What percentage of the ocean floor do coral reefs cover?",
            options: [
              "A  Less than one percent",
              "B  About five percent",
              "C  About ten percent",
              "D  About twenty-five percent",
            ],
            answer: "A",
          },
          {
            id: "cr-q2",
            type: "mcq",
            text: "According to the passage, coral losses in some parts of the Caribbean have exceeded:",
            options: ["A  50%", "B  60%", "C  70%", "D  80%"],
            answer: "D",
          },
          {
            id: "cr-q3",
            type: "mcq",
            text: "What is the primary role of zooxanthellae in coral reefs?",
            options: [
              "A  They protect the coral from predators",
              "B  They supply most of the coral's energy through photosynthesis",
              "C  They help the coral absorb minerals from the water",
              "D  They build the three-dimensional reef structure",
            ],
            answer: "B",
          },
          {
            id: "cr-q4",
            type: "mcq",
            text: "Why is ocean acidification particularly damaging to reef-building corals?",
            options: [
              "A  It kills the zooxanthellae algae directly",
              "B  It causes sudden increases in water temperature",
              "C  It reduces the ability of corals to build and maintain their skeletons",
              "D  It promotes algal blooms on reef surfaces",
            ],
            answer: "C",
          },
          {
            id: "cr-q5",
            type: "mcq",
            text: "What do critics say about current conservation measures for coral reefs?",
            options: [
              "A  They are too costly to sustain long-term",
              "B  They are focused on the wrong geographical areas",
              "C  They address effects rather than the underlying cause",
              "D  They have not shown any positive results in practice",
            ],
            answer: "C",
          },
        ],
      },
      {
        instruction:
          "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
        questions: [
          {
            id: "cr-q6",
            type: "tfng",
            text: "Coral reefs support more marine species than tropical rainforests.",
            answer: "Not Given",
          },
          {
            id: "cr-q7",
            type: "tfng",
            text: "Bleached corals are permanently unable to recover.",
            answer: "False",
          },
          {
            id: "cr-q8",
            type: "tfng",
            text: "The first recorded global coral bleaching event took place in 1998.",
            answer: "True",
          },
          {
            id: "cr-q9",
            type: "tfng",
            text: "The 2014–2017 bleaching event was triggered by an El Niño weather system.",
            answer: "Not Given",
          },
          {
            id: "cr-q10",
            type: "tfng",
            text: "By mid-century, bleaching-level heat events could occur every five to ten years in most regions.",
            answer: "True",
          },
          {
            id: "cr-q11",
            type: "tfng",
            text: "Coral restoration projects involving nursery-grown fragments have so far failed to show any benefit.",
            answer: "False",
          },
        ],
      },
    ],
  },

  // ── Passage 2: The Origins of Writing ─────────────────────────────────────
  {
    id: "origins-of-writing",
    title: "The Origins of Writing",
    examType: "academic",
    difficulty: 2,
    topicTags: ["history", "language"],
    passageText: `Writing is widely regarded as one of humanity's most transformative inventions. Unlike spoken language, which leaves no physical trace, writing externalises thought, creates a permanent record, and enables communication across vast distances and time. The invention of writing represents a cognitive leap that fundamentally changed how societies organised themselves, stored knowledge, and transmitted culture. Some historians argue that it marks the boundary between prehistory and history itself, since by definition history is the study of the past through written records. Yet writing was not a single invention but a technology that emerged independently in multiple locations, each developing distinct systems suited to the needs of the societies that created them.

The oldest confirmed writing system is cuneiform, which originated in Mesopotamia — the region of present-day Iraq — around 3400 BCE. Originally developed by the Sumerians, cuneiform began as a system of pictographs used to record economic transactions: quantities of grain, livestock, and other goods held in temple storehouses. Over several centuries, the pictographs were simplified into abstract wedge-shaped marks made by pressing a reed stylus into clay tablets. The system expanded from purely administrative uses to record literature, law, and science, eventually being adopted and adapted by the Akkadians, Babylonians, Assyrians, and other Near Eastern civilisations. Cuneiform remained in active use for more than three thousand years before falling out of use in the early centuries of the Common Era.

Egyptian hieroglyphics, which appeared around 3200 BCE — close in time to the emergence of cuneiform — were long considered a direct derivative of Mesopotamian writing. However, modern scholars increasingly argue that hieroglyphics represent an independent invention, possibly inspired by awareness of the concept of writing from Mesopotamia but developed entirely within Egypt's own cultural and linguistic context. Unlike cuneiform, hieroglyphics retained their pictorial character throughout their long history and were primarily used on monumental inscriptions, funerary texts, and ritual objects. A simplified cursive script called hieratic developed for everyday administrative use on papyrus, and an even more abbreviated form, demotic, emerged later for ordinary correspondence.

The Chinese writing system, whose earliest confirmed examples date to the Shang dynasty around 1200 BCE, developed independently of both Mesopotamian and Egyptian traditions. The oracle bone inscriptions of this period — questions addressed to ancestors or deities, carved onto turtle shells and cattle bones — already display a sophisticated system with several hundred characters. Unlike cuneiform, which eventually became purely phonetic, Chinese writing retained a logographic character, with each character typically representing a syllable and carrying meaning as well as sound. This feature has allowed the written language to remain largely constant across thousands of years even as spoken dialects diverged dramatically, serving as a unifying force across China's linguistically diverse population.

Scholars debate whether the world's writing systems were invented independently or spread from a single origin. The theory of independent invention, known as polygenesis, is supported by evidence that cuneiform, hieroglyphics, and Chinese script each emerged in geographically isolated contexts and differ fundamentally in structure. The diffusionist view holds that the idea of writing — if not the specific symbols — spread outward from Mesopotamia. Most contemporary researchers favour a middle position: that a small number of independent inventions occurred, but that awareness of writing's existence sometimes stimulated invention elsewhere. The Mesoamerican writing systems of the Maya and Olmec, which developed with no possible contact with Old World traditions, provide the strongest evidence for genuine independent invention.

The most influential development in the history of writing was arguably the invention of the alphabet by Semitic peoples in the ancient Near East around 2000–1700 BCE. Earlier writing systems required learners to memorise hundreds or thousands of symbols. The alphabet reduced this to a small set of letters — typically twenty to thirty — each representing a single sound. This radical simplification made literacy far more accessible, helping spread reading and writing beyond elite scribal classes to wider populations. The Phoenician alphabet, which spread through maritime trade, became the ancestor of most writing systems used in the world today, including the Greek and Latin alphabets of the Western tradition, the Arabic and Hebrew scripts of the Middle East, and through further transmission, scripts across South and Southeast Asia.`,
    questionGroups: [
      {
        instruction:
          "The reading passage has paragraphs A–F. Choose the correct heading for each paragraph from the list of headings below.",
        sharedOptions: [
          "i    The first known writing system and its long development",
          "ii   How ancient scripts were decoded by modern researchers",
          "iii  Why writing transformed human cognition and society",
          "iv   A script that preserved its pictorial origins across centuries",
          "v    The origins and distinctive features of a major East Asian script",
          "vi   Competing explanations for how writing spread across the world",
          "vii  How a simplified writing system expanded access to literacy",
          "viii The role of commerce in the origins of early written records",
        ],
        questions: [
          {
            id: "ow-q1",
            type: "matching_headings",
            paragraphLabel: "A",
            answer: "iii",
          },
          {
            id: "ow-q2",
            type: "matching_headings",
            paragraphLabel: "B",
            answer: "i",
          },
          {
            id: "ow-q3",
            type: "matching_headings",
            paragraphLabel: "C",
            answer: "iv",
          },
          {
            id: "ow-q4",
            type: "matching_headings",
            paragraphLabel: "D",
            answer: "v",
          },
          {
            id: "ow-q5",
            type: "matching_headings",
            paragraphLabel: "E",
            answer: "vi",
          },
          {
            id: "ow-q6",
            type: "matching_headings",
            paragraphLabel: "F",
            answer: "vii",
          },
        ],
      },
      {
        instruction:
          "The reading passage has paragraphs A–F. Which paragraph contains the following information? You may use any letter more than once.",
        questions: [
          {
            id: "ow-q7",
            type: "matching_info",
            text: "A reference to writing systems that arose without any possible contact with existing traditions",
            answer: "E",
          },
          {
            id: "ow-q8",
            type: "matching_info",
            text: "A description of how a writing system evolved from pictures into abstract marks",
            answer: "B",
          },
          {
            id: "ow-q9",
            type: "matching_info",
            text: "An example of a script that helped unite a linguistically diverse population",
            answer: "D",
          },
          {
            id: "ow-q10",
            type: "matching_info",
            text: "A mention of writing being used for everyday correspondence on a plant-based material",
            answer: "C",
          },
          {
            id: "ow-q11",
            type: "matching_info",
            text: "An explanation of why earlier writing systems were harder to learn than the alphabet",
            answer: "F",
          },
        ],
      },
    ],
  },

  // ── Passage 3: Urban Agriculture ───────────────────────────────────────────
  {
    id: "urban-agriculture",
    title: "Urban Agriculture",
    examType: "academic",
    difficulty: 2,
    topicTags: ["environment", "technology", "society"],
    passageText: `Urban agriculture — the practice of growing food within city boundaries — has moved from a fringe activity to a mainstream policy consideration in cities across the globe. Once dismissed as a hobby or a minor supplement to food supplies, urban farming now encompasses rooftop gardens, vertical farms inside converted warehouses, community allotments, and sophisticated hydroponic installations producing salad vegetables year-round for supermarket chains. In cities facing rapid population growth, food insecurity, and the escalating costs of long-distance food transport, local food production is increasingly viewed as a practical component of sustainable urban planning.

Proponents of urban agriculture point to an array of environmental benefits beyond the obvious reduction in transport-related emissions. Urban green spaces — including food gardens — help moderate the urban heat island effect, whereby dense concentrations of concrete and asphalt absorb solar heat and raise city temperatures significantly above surrounding rural areas. Vegetation intercepts rainfall, reducing the volume and speed of surface water runoff that overwhelms drainage systems during heavy rain events. In cities where access to affordable fresh produce is limited in low-income neighbourhoods — zones sometimes called food deserts — community gardens can improve nutrition while simultaneously building social cohesion.

Critics, however, challenge the efficiency claims made on behalf of urban farming. A comprehensive analysis published in 2021 found that, when the full lifecycle of inputs is considered — including the embodied energy in construction materials, LED lighting for indoor farms, heating, and sophisticated hydroponic nutrient solutions — some forms of urban agriculture consume considerably more energy per kilogram of food produced than conventional rural farming. Rooftop gardens in temperate climates may produce food for only four to five months of the year, while heated indoor vertical farms operate year-round but at high energy cost. The analysis concluded that the environmental credentials of urban agriculture depend heavily on context, scale, and the specific farming method employed.

Water use presents another area of complexity. Hydroponic and aeroponic systems, which grow plants in nutrient-rich water or air-mist environments without soil, use substantially less water than conventional field agriculture — sometimes 70 to 90 percent less per kilogram of produce. This is because water is recirculated rather than absorbed into the ground or lost to evaporation from open fields. In water-scarce cities, this efficiency is a genuine advantage. However, in cities where water is abundant and inexpensive, the high capital cost of installing such systems can deter adoption. Furthermore, the recycled water in hydroponic systems requires careful chemical management to prevent the build-up of nutrient imbalances and pathogens.

The economics of urban agriculture remain challenging. Land in cities is expensive, and even rooftop space must be rented or purchased. Labour costs in urban settings are higher than in rural areas, where seasonal workers are more readily available. Studies of commercial urban farms in Europe and North America consistently find that these operations struggle to compete on price with produce from large-scale rural farms in regions with lower land and labour costs. The businesses that have achieved commercial viability tend to be those targeting premium markets — restaurants, organic food shops, and affluent consumers willing to pay for locally grown produce, which commands a price premium of between 30 and 100 percent above conventionally grown equivalents.

Despite these economic pressures, city governments are increasingly supporting urban agriculture through policy incentives. Tax breaks on agricultural use of rooftop space, streamlined planning permissions for urban farms, and subsidised access to vacant lots have all been used to encourage the sector. Singapore has set a national target of producing 30 percent of its nutritional needs locally by 2030. Several European cities, including Paris and Amsterdam, have integrated urban food production targets into their official climate action plans. Advocates argue that the social, environmental, and public health benefits of urban agriculture — many of which do not appear on commercial balance sheets — justify public investment even when direct financial returns are modest.`,
    questionGroups: [
      {
        instruction:
          "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
        questions: [
          {
            id: "ua-q1",
            type: "tfng",
            text: "Urban agriculture was previously considered a serious rival to conventional rural farming.",
            answer: "False",
          },
          {
            id: "ua-q2",
            type: "tfng",
            text: "Community gardens in food deserts can provide both nutritional and social benefits.",
            answer: "True",
          },
          {
            id: "ua-q3",
            type: "tfng",
            text: "The 2021 analysis found that all forms of urban farming use more energy than conventional farming.",
            answer: "False",
          },
          {
            id: "ua-q4",
            type: "tfng",
            text: "Hydroponic and aeroponic systems can reduce water use by up to 90 percent compared to field agriculture.",
            answer: "True",
          },
          {
            id: "ua-q5",
            type: "tfng",
            text: "Urban farms in Europe and North America generally sell their produce at similar prices to rural farms.",
            answer: "False",
          },
        ],
      },
      {
        instruction:
          "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        questions: [
          {
            id: "ua-q6",
            type: "sentence_completion",
            text: "Hydroponic systems grow plants in nutrient-rich ________ without using soil.",
            wordLimit: 2,
            answer: "water",
            answerVariants: ["water"],
          },
          {
            id: "ua-q7",
            type: "sentence_completion",
            text: "In hydroponic systems, water is ________ rather than being absorbed into the ground or lost through evaporation.",
            wordLimit: 2,
            answer: "recirculated",
            answerVariants: ["recirculated"],
          },
          {
            id: "ua-q8",
            type: "sentence_completion",
            text: "Urban farms that have achieved commercial success tend to focus on ________ markets.",
            wordLimit: 2,
            answer: "premium",
            answerVariants: ["premium markets"],
          },
          {
            id: "ua-q9",
            type: "sentence_completion",
            text: "Singapore has set a national goal to produce ________ of its nutritional needs locally by 2030.",
            wordLimit: 2,
            answer: "30 percent",
            answerVariants: ["30 percent", "30%"],
          },
          {
            id: "ua-q10",
            type: "sentence_completion",
            text: "Cities such as Paris and Amsterdam have incorporated urban food production targets into their ________ plans.",
            wordLimit: 2,
            answer: "climate action",
            answerVariants: ["climate action"],
          },
        ],
      },
    ],
  },

  // ── Passage 4: The Psychology of Colour ───────────────────────────────────
  {
    id: "psychology-of-colour",
    title: "The Psychology of Colour",
    examType: "academic",
    difficulty: 3,
    topicTags: ["psychology", "science", "arts"],
    passageText: `The study of how colour influences human psychology has grown from an area of philosophical speculation into a legitimate field of scientific inquiry. For centuries, artists, architects, and philosophers intuitively used colour to evoke particular emotional states, but it was not until the late twentieth century that experimental psychologists began to subject these intuitions to rigorous empirical testing. The results have been both confirmatory and surprising: some widely held beliefs about colour and emotion have been validated by research, while others have proved culturally specific, contextually dependent, or simply unfounded.

Among the most consistently supported findings is the association between the colour red and heightened arousal states. Studies involving physiological measurements have found that exposure to red environments can increase heart rate, blood pressure, and the speed of reaction times in laboratory settings. These effects appear to be connected to the colour's evolutionary significance: red signals danger and urgency in many natural contexts, from the warning colouration of poisonous animals to the physiological changes associated with anger and physical exertion. Research in competitive sports has added a further dimension to this work, with analyses of Olympic combat sports finding that athletes wearing red uniforms win a statistically significant proportion of bouts compared to those wearing blue.

Blue, by contrast, is consistently associated with calm, focus, and reduced physiological arousal. Studies of workplace environments have found that offices with blue colour schemes report lower rates of stress-related complaints among employees, and workers in blue environments perform better on tasks requiring sustained concentration. However, the relationship between blue and performance is not uniformly positive: research by Mehta and Zhu published in 2009 found that while blue environments enhanced performance on creative tasks requiring free association and novel thinking, red environments produced better results on detail-oriented accuracy tasks. This suggests that the psychological effects of colour are task-dependent rather than universally positive or negative.

The cultural dimension of colour psychology is frequently underestimated in Western-dominated research. The colour white, associated in Western cultures with purity and celebration, is the traditional colour of mourning in China, Japan, and parts of South Asia. Green, which carries strongly positive environmental connotations in contemporary Western contexts, has been associated with disease and illness in some historical European traditions. Yellow, generally coded as optimistic and cheerful in North American and European contexts, is linked to jealousy and betrayal in some French cultural traditions. These cultural variations complicate the search for universal psychological laws of colour and suggest that many reported colour-emotion associations are learned rather than innate.

Marketing and design practitioners have long applied colour psychology, sometimes based more on conventional wisdom than rigorous evidence. The idea that fast-food chains deliberately use red and yellow colour schemes because red stimulates appetite and yellow promotes cheerfulness is widely cited but difficult to verify empirically. What research does consistently support is that colour affects perceived product quality and brand personality. A study of pharmaceutical packaging found that yellow pills were rated by participants as more stimulating and effective for pain relief than white pills with identical chemical contents, while blue pills were perceived as better sedatives. These effects operated entirely through visual perception, as chemical analysis confirmed the pills were pharmacologically identical.

In architectural and therapeutic settings, colour selection has moved from aesthetic preference to evidence-informed practice. Hospitals that replaced conventional white or pale green interiors with warmer colour palettes reported reduced patient anxiety and lower requests for analgesic medication. Research on school environments has found that specific colour temperatures — measured in terms of the warmth or coolness of light and wall colours — affect children's ability to concentrate and their tendency toward disruptive behaviour. Despite these promising findings, researchers caution against over-interpretation. Individual responses to colour vary considerably based on personal experience, cultural background, and even genetic factors affecting colour perception, suggesting that broad prescriptions for colour use must be applied with care.`,
    questionGroups: [
      {
        instruction:
          "Choose the correct letter, A, B, C or D.",
        questions: [
          {
            id: "pc-q1",
            type: "mcq",
            text: "What does the passage say about beliefs regarding colour and emotion?",
            options: [
              "A  Most have been proved incorrect by modern research",
              "B  Some have been confirmed while others are culturally specific or unfounded",
              "C  They have been mostly confirmed but are only relevant in Western cultures",
              "D  They were purely speculative until the twenty-first century",
            ],
            answer: "B",
          },
          {
            id: "pc-q2",
            type: "mcq",
            text: "What explanation does the passage offer for the psychological effects of red?",
            options: [
              "A  Red is associated with luxury and high status in most cultures",
              "B  Red has been used in art and architecture for thousands of years",
              "C  Red is connected to evolutionary cues related to danger and physical states",
              "D  Red stimulates the brain's reward system more than other colours",
            ],
            answer: "C",
          },
          {
            id: "pc-q3",
            type: "mcq",
            text: "What did the research by Mehta and Zhu find about colour and task performance?",
            options: [
              "A  Blue always leads to better performance than red",
              "B  Red is better for creative tasks while blue is better for accuracy tasks",
              "C  Blue is better for creative tasks while red is better for accuracy tasks",
              "D  Colour has no significant effect on performance for most task types",
            ],
            answer: "C",
          },
          {
            id: "pc-q4",
            type: "mcq",
            text: "What does the passage say about marketing claims linking red and yellow to fast-food choices?",
            options: [
              "A  They are well-supported by experimental research",
              "B  They are widely believed but hard to confirm through research",
              "C  They have been proved incorrect by recent studies",
              "D  They are no longer used by fast-food companies",
            ],
            answer: "B",
          },
          {
            id: "pc-q5",
            type: "mcq",
            text: "According to the final paragraph, why do researchers warn against broad prescriptions for colour use?",
            options: [
              "A  They are too expensive to implement in most settings",
              "B  Individual responses to colour vary too much for universal rules to apply",
              "C  They have not been tested adequately in real-world settings",
              "D  They are based primarily on cultural preferences rather than science",
            ],
            answer: "B",
          },
        ],
      },
      {
        instruction:
          "Complete the summary below. Choose ONE word from the box for each answer.",
        sharedOptions: [
          "A  arousal",
          "B  calmness",
          "C  cultural",
          "D  genetic",
          "E  quality",
          "F  stress",
          "G  historical",
          "H  universal",
        ],
        questions: [
          {
            id: "pc-q6",
            type: "summary_completion",
            text: "Red has been linked to increased ________ (Q6) states such as higher heart rate and blood pressure, and athletes wearing red have achieved better results in some competitive sports.",
            wordLimit: 1,
            answer: "A",
            wordBox: ["A", "B", "C", "D", "E", "F", "G", "H"],
          },
          {
            id: "pc-q7",
            type: "summary_completion",
            text: "Blue, by contrast, is associated with ________ (Q7) and improved concentration, although its benefits depend on the type of task being performed.",
            wordLimit: 1,
            answer: "B",
            wordBox: ["A", "B", "C", "D", "E", "F", "G", "H"],
          },
          {
            id: "pc-q8",
            type: "summary_completion",
            text: "The study of colour psychology is complicated by ________ (Q8) differences, since the same colour can carry completely different meanings in different societies.",
            wordLimit: 1,
            answer: "C",
            wordBox: ["A", "B", "C", "D", "E", "F", "G", "H"],
          },
          {
            id: "pc-q9",
            type: "summary_completion",
            text: "In marketing, research shows that colour affects the perceived ________ (Q9) of products, even when their physical or chemical properties are identical.",
            wordLimit: 1,
            answer: "E",
            wordBox: ["A", "B", "C", "D", "E", "F", "G", "H"],
          },
          {
            id: "pc-q10",
            type: "summary_completion",
            text: "Researchers advise caution because individual reactions to colour are shaped by personal experience, cultural background, and even ________ (Q10) factors affecting colour perception.",
            wordLimit: 1,
            answer: "D",
            wordBox: ["A", "B", "C", "D", "E", "F", "G", "H"],
          },
        ],
      },
    ],
  },
];
