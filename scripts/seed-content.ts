/**
 * Seed script: migrates hard-coded content from lib/*.ts into Supabase.
 *
 * Run with:
 *   npx tsx scripts/seed-content.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// Speaking prompts data
// ---------------------------------------------------------------------------

const SPEAKING_PROMPTS = [
  // Part 1 - Simple questions
  { part: 1, topic: "Hometown", question: "Where is your hometown? What do you like about it?" },
  { part: 1, topic: "Work / Study", question: "Do you work or are you a student? What do you enjoy about it?" },
  { part: 1, topic: "Daily Routine", question: "What does a typical day look like for you?" },
  { part: 1, topic: "Hobbies", question: "What do you do in your free time?" },
  { part: 1, topic: "Weather", question: "What kind of weather do you like? Does it affect your mood?" },
  { part: 1, topic: "Food", question: "What is your favorite type of food? Do you enjoy cooking?" },
  { part: 1, topic: "Travel", question: "Do you like traveling? Where would you like to go next?" },
  { part: 1, topic: "Reading", question: "Do you enjoy reading? What kind of books do you like?" },

  // Part 2 - Long turn (cue card)
  {
    part: 2,
    topic: "A Place You Visited",
    question: "Describe a place you visited that you found interesting. You should say: where it was, when you went there, what you did there, and explain why you found it interesting.",
  },
  {
    part: 2,
    topic: "A Person You Admire",
    question: "Describe a person you admire. You should say: who this person is, how you know them, what they do, and explain why you admire them.",
  },
  {
    part: 2,
    topic: "A Skill You Learned",
    question: "Describe a skill you learned that you found useful. You should say: what the skill is, when you learned it, how you learned it, and explain why you found it useful.",
  },
  {
    part: 2,
    topic: "A Childhood Memory",
    question: "Describe a happy memory from your childhood. You should say: what happened, when it happened, who was with you, and explain why it is a happy memory.",
  },
  {
    part: 2,
    topic: "A Difficult Decision",
    question: "Describe a difficult decision you had to make. You should say: what the decision was, why it was difficult, what you decided, and explain how you felt about it afterwards.",
  },

  // Part 3 - Discussion
  {
    part: 3,
    topic: "Technology and Society",
    question: "How has technology changed the way people communicate? Do you think this is a positive change?",
  },
  {
    part: 3,
    topic: "Education",
    question: "Do you think the education system in your country prepares students well for the future? What changes would you suggest?",
  },
  {
    part: 3,
    topic: "Environment",
    question: "What are the biggest environmental challenges facing your country? What should individuals do to help?",
  },
  {
    part: 3,
    topic: "Work-Life Balance",
    question: "Do people in your country tend to work too much? How important is work-life balance?",
  },
  {
    part: 3,
    topic: "Globalization",
    question: "How has globalization affected local cultures? Is this something that concerns you?",
  },
] as const;

// ---------------------------------------------------------------------------
// Speaking prompts
// ---------------------------------------------------------------------------

async function seedSpeakingPrompts() {
  const supabase = getSupabase();

  const rows = SPEAKING_PROMPTS.map((p, i) => ({
    slug: `part${p.part}-${slugify(p.topic)}`,
    part: p.part,
    topic: p.topic,
    question: p.question,
    follow_up: null,
    is_active: true,
    display_order: i,
  }));

  const { error, count } = await supabase
    .from("speaking_prompts")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) {
    console.error("❌ speaking_prompts seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ speaking_prompts: upserted ${count ?? rows.length} rows`);
}

// ---------------------------------------------------------------------------
// Writing prompts data
// ---------------------------------------------------------------------------

const WRITING_PROMPTS = [
  // ── Task 1 ──────────────────────────────────────────
  {
    taskType: "task1", topic: "Line Graph — Internet Usage",
    prompt: "The line graph below shows the percentage of households with internet access in three countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "line", title: "Household Internet Access (%), 2000–2020", categories: ["2000","2005","2010","2015","2020"], series: [{ name: "USA", data: [42,62,74,83,90] },{ name: "Germany", data: [30,58,78,88,92] },{ name: "Brazil", data: [5,13,33,55,71] }], xLabel: "Year", yLabel: "% of households" },
  },
  {
    taskType: "task1", topic: "Bar Chart — Water Consumption",
    prompt: "The bar chart below shows the average daily water consumption per person in five different cities in 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "bar", title: "Average Daily Water Consumption per Person (litres), 2022", categories: ["Dubai","Los Angeles","London","Tokyo","Mumbai"], series: [{ name: "Litres/day", data: [500,340,155,220,95] }], xLabel: "City", yLabel: "Litres per person per day" },
  },
  {
    taskType: "task1", topic: "Pie Chart — Household Spending",
    prompt: "The pie charts below show the main categories of household expenditure in a European country in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "pie", title: "Household Expenditure by Category", pieData: [{ label: "2000", slices: [{ name: "Housing", value: 30 },{ name: "Food", value: 25 },{ name: "Transport", value: 18 },{ name: "Entertainment", value: 10 },{ name: "Clothing", value: 9 },{ name: "Other", value: 8 }] },{ label: "2020", slices: [{ name: "Housing", value: 38 },{ name: "Food", value: 15 },{ name: "Transport", value: 14 },{ name: "Entertainment", value: 18 },{ name: "Clothing", value: 5 },{ name: "Other", value: 10 }] }] },
  },
  {
    taskType: "task1", topic: "Table — University Enrollment",
    prompt: "The table below shows the number of students (in thousands) enrolled at four universities in 2010 and 2020, broken down by gender. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "table", title: "University Enrollment (thousands)", headers: ["University","2010 Male","2010 Female","2020 Male","2020 Female"], rows: [["Northern Univ",12.0,10.5,11.8,14.2],["Capital Univ",18.5,16.0,17.0,21.5],["Coastal Univ",8.0,9.2,9.5,12.8],["Midland Univ",14.0,11.0,13.5,15.0]] },
  },
  {
    taskType: "task1", topic: "Process — Recycling Plastic",
    prompt: "The diagram below shows the process of recycling plastic bottles. Summarise the information by selecting and reporting the main features. Write at least 150 words.",
    chart: { type: "process", title: "Plastic Bottle Recycling Process", description: "1. Collection — plastic bottles collected from households and recycling bins\n2. Sorting — bottles sorted by plastic type (PET, HDPE) and colour using machines and manual labour\n3. Cleaning — bottles washed to remove labels, adhesive, and residue\n4. Shredding — clean bottles shredded into small plastic flakes\n5. Melting & Pelletising — flakes heated to melting point, then formed into small uniform pellets\n6. Quality Testing — pellets tested for consistency and purity\n7. Manufacturing — pellets sold to manufacturers who mould them into new products (bottles, clothing fibre, packaging)" },
  },
  {
    taskType: "task1", topic: "Map — Town Development",
    prompt: "The two maps below show the town of Bridgeford before and after the construction of a new airport. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "map", title: "Bridgeford — 1990 vs 2020", description: "BEFORE (1990):\nThe town centre is in the middle with a high street running east–west. To the north: residential housing and a primary school. To the south: farmland stretching to the river. To the east: a small industrial zone with a railway line running north–south. To the west: woodland and a country road leading to the motorway (15 km away).\n\nAFTER (2020):\nThe town centre remains but the high street has been pedestrianised. To the north: residential housing expanded with a new housing estate; primary school remains. To the south: farmland replaced by the airport with a two-lane access road connecting to the town centre. A hotel and car park built next to the airport. To the east: industrial zone expanded; railway line still present with a new station. To the west: half the woodland cleared for a retail park; a new dual carriageway connects to the motorway." },
  },
  {
    taskType: "task1", topic: "Bar Chart — Energy Sources",
    prompt: "The bar chart below shows the proportion of electricity generated from different energy sources in three countries in 2019. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "bar", title: "Electricity Generation by Source (%), 2019", categories: ["Nuclear","Coal","Natural Gas","Hydropower","Wind/Solar","Other"], series: [{ name: "France", data: [71,1,7,11,8,2] },{ name: "Australia", data: [0,56,21,6,14,3] },{ name: "Norway", data: [0,0,1,95,4,0] }], xLabel: "Energy Source", yLabel: "% of total electricity" },
  },
  {
    taskType: "task1", topic: "Line Graph — CO2 Emissions",
    prompt: "The line graph below shows CO2 emissions per capita (in metric tonnes) in four countries from 1990 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "line", title: "CO₂ Emissions per Capita (metric tonnes), 1990–2020", categories: ["1990","2000","2010","2015","2020"], series: [{ name: "USA", data: [19.3,20.2,17.6,16.3,14.2] },{ name: "UK", data: [10.0,9.2,7.9,6.2,5.2] },{ name: "China", data: [2.1,2.7,6.6,7.5,7.4] },{ name: "India", data: [0.8,1.0,1.4,1.7,1.8] }], xLabel: "Year", yLabel: "Metric tonnes per capita" },
  },
  {
    taskType: "task1", topic: "Table — Transport Usage",
    prompt: "The table below shows the percentage of people using different modes of transport to travel to work in four cities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "table", title: "Mode of Transport to Work (%)", headers: ["Mode","Amsterdam","Los Angeles","Tokyo","Lagos"], rows: [["Car",22,73,16,35],["Public transit",18,11,58,40],["Bicycle",38,1,14,3],["Walking",17,4,10,18],["Other",5,11,2,4]] },
  },
  {
    taskType: "task1", topic: "Line Graph — Tourism Revenue",
    prompt: "The line graph below shows the number of international tourists (in millions) and the total tourism revenue (in billions of USD) for Thailand between 2005 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "line", title: "Thailand: International Tourists & Revenue, 2005–2020", categories: ["2005","2008","2011","2014","2017","2019","2020"], series: [{ name: "Tourists (millions)", data: [11.5,14.6,19.1,24.8,35.4,39.8,6.7] },{ name: "Revenue ($ billions)", data: [9.6,16.0,23.8,34.9,52.5,60.5,10.1] }], xLabel: "Year", yLabel: "Value" },
  },
  {
    taskType: "task1", topic: "Pie Chart — Diet Composition",
    prompt: "The pie charts below show the average diet composition in terms of protein, carbohydrates, and fat for people in two different countries. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "pie", title: "Average Diet Composition by Country", pieData: [{ label: "Japan", slices: [{ name: "Carbohydrates", value: 58 },{ name: "Fat", value: 22 },{ name: "Protein", value: 15 },{ name: "Other", value: 5 }] },{ label: "USA", slices: [{ name: "Carbohydrates", value: 42 },{ name: "Fat", value: 38 },{ name: "Protein", value: 16 },{ name: "Other", value: 4 }] }] },
  },
  {
    taskType: "task1", topic: "Process — Water Treatment",
    prompt: "The diagram below illustrates the stages involved in treating wastewater before it is returned to the environment. Summarise the information by selecting and reporting the main features. Write at least 150 words.",
    chart: { type: "process", title: "Wastewater Treatment Process", description: "1. Screening — wastewater passes through large metal screens that remove solid debris (plastic, rags, sticks)\n2. Primary Settlement — water flows into large tanks where heavy solids sink as sludge; oils and grease float to the surface and are skimmed off\n3. Aeration — water pumped into aeration tanks where air is blown through, encouraging bacteria to break down organic matter\n4. Secondary Settlement — water enters another set of tanks where fine particles settle; biological sludge is partially recycled back to aeration\n5. Chemical Treatment — chlorine or UV light kills harmful bacteria and pathogens\n6. Discharge — treated water released into a river or the sea\n7. Sludge Processing — collected sludge separately treated (dried, composted, or used for energy generation)" },
  },
  {
    taskType: "task1", topic: "Bar Chart — Smartphone Ownership",
    prompt: "The bar chart below shows the percentage of people who own a smartphone in six different age groups in 2015 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "bar", title: "Smartphone Ownership by Age Group (%), 2015 vs 2023", categories: ["18–24","25–34","35–44","45–54","55–64","65+"], series: [{ name: "2015", data: [86,81,68,54,38,18] },{ name: "2023", data: [98,97,95,88,78,55] }], xLabel: "Age Group", yLabel: "% ownership" },
  },
  {
    taskType: "task1", topic: "Line Graph — Birth Rates",
    prompt: "The line graph below shows the birth rate per 1,000 people in three Asian countries from 1970 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "line", title: "Birth Rate per 1,000 People, 1970–2020", categories: ["1970","1980","1990","2000","2010","2020"], series: [{ name: "Japan", data: [18.8,13.6,10.0,9.5,8.5,6.8] },{ name: "China", data: [33.4,18.2,21.1,14.0,11.9,8.5] },{ name: "India", data: [36.9,33.7,30.2,25.0,21.8,17.4] }], xLabel: "Year", yLabel: "Births per 1,000" },
  },
  {
    taskType: "task1", topic: "Map — Shopping Centre",
    prompt: "The two maps below show the Greenfield Shopping Centre in 2005 and its planned redesign for 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    chart: { type: "map", title: "Greenfield Shopping Centre — 2005 vs 2025", description: "2005:\nSingle-storey rectangular building. Main entrance on the south side facing a large car park (200 spaces). Inside: central corridor with 28 small retail shops on either side, a supermarket at the north end, and a small food court (4 outlets) near the entrance. East side: a bus stop and a row of trees along the road.\n\n2025 REDESIGN:\nExpanded to two storeys. Main entrance remains on the south side, now a glass-fronted atrium. Car park reduced to 120 surface spaces; new multi-storey car park (400 spaces) to the west. Ground floor: supermarket stays at north end, shops reduced to 18 larger units, medical clinic added on east side. First floor: cinema (6 screens), gym, 10 restaurant units, children's play area. Outside: bus stop upgraded to bus interchange with covered waiting; bicycle parking (50 spaces) near main entrance; trees extended around south and west perimeter." },
  },
  // ── Task 2 ──────────────────────────────────────────
  { taskType: "task2", topic: "Education — University Purpose", prompt: "Some people believe that universities should focus on providing academic skills, while others think they should prepare students for employment. Discuss both views and give your opinion. Write at least 250 words." },
  { taskType: "task2", topic: "Technology — Social Media", prompt: "Some people think that social media has a mostly negative effect on young people. Others believe it can be a positive influence. Discuss both views and give your opinion. Write at least 250 words." },
  { taskType: "task2", topic: "Environment — Individual vs Government", prompt: "Some people believe that individuals can do nothing to improve the environment and that only governments and large companies can make a real difference. To what extent do you agree or disagree? Write at least 250 words." },
  { taskType: "task2", topic: "Crime — Prison vs Rehabilitation", prompt: "Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better alternative ways of reducing crime. Discuss both views and give your opinion. Write at least 250 words." },
  { taskType: "task2", topic: "Health — Government Role", prompt: "Some people say that governments should focus on reducing environmental pollution and housing problems to help prevent illness and disease. To what extent do you agree or disagree? Write at least 250 words." },
  { taskType: "task2", topic: "Work — Remote Working", prompt: "In many countries, people are increasingly working from home rather than in an office. Do the advantages of working from home outweigh the disadvantages? Write at least 250 words." },
  { taskType: "task2", topic: "Culture — Globalisation", prompt: "As countries become more globalised, many people worry that local cultures and traditions will be lost. Do you think the advantages of globalisation outweigh the disadvantages? Write at least 250 words." },
  { taskType: "task2", topic: "Education — Children and Technology", prompt: "Some people think that children should not be allowed to use smartphones until they are teenagers. Others believe children can benefit from using them at a younger age. Discuss both views and give your opinion. Write at least 250 words." },
  { taskType: "task2", topic: "Society — Aging Population", prompt: "In many countries, the proportion of older people is steadily increasing. What problems will this cause for individuals and society? Suggest some solutions. Write at least 250 words." },
  { taskType: "task2", topic: "Transport — Public vs Private", prompt: "The best way to solve traffic and transportation problems is to encourage people to use public transport instead of private cars. To what extent do you agree or disagree? Write at least 250 words." },
  { taskType: "task2", topic: "Media — News Influence", prompt: "News media has an enormous influence on people's opinions and ideas. Do you think this is a positive or negative development? Write at least 250 words." },
  { taskType: "task2", topic: "Tourism — Benefits and Problems", prompt: "International tourism has brought enormous benefits to many places. At the same time, there is concern about its impact on local inhabitants and the environment. Do the disadvantages of international tourism outweigh the advantages? Write at least 250 words." },
  { taskType: "task2", topic: "Science — Space Exploration", prompt: "Some people think that governments should spend money on space exploration, while others believe there are more pressing issues on Earth. Discuss both views and give your opinion. Write at least 250 words." },
  { taskType: "task2", topic: "Language — English Dominance", prompt: "English is becoming the most widely spoken language in the world. Some people see this as a positive trend while others feel it threatens cultural diversity. Discuss both views and give your opinion. Write at least 250 words." },
  { taskType: "task2", topic: "Food — Fast Food and Health", prompt: "In many countries, fast food is becoming cheaper and more widely available. Do you think the advantages of cheap fast food outweigh the disadvantages? Write at least 250 words." },
];

// ---------------------------------------------------------------------------
// Writing prompts
// ---------------------------------------------------------------------------

async function seedWritingPrompts() {
  const supabase = getSupabase();

  const rows = WRITING_PROMPTS.map((p, i) => ({
    slug: `${p.taskType}-${slugify(p.topic)}`,
    task_type: p.taskType,
    topic: p.topic,
    prompt: p.prompt,
    chart_data: "chart" in p ? p.chart : null,
    is_active: true,
    display_order: i,
  }));

  const { error, count } = await supabase
    .from("writing_prompts")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) {
    console.error("❌ writing_prompts seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ writing_prompts: upserted ${count ?? rows.length} rows`);
}

// ---------------------------------------------------------------------------
// Reading passages data
// ---------------------------------------------------------------------------

const READING_PASSAGES = [
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
        instruction: "Choose the correct letter, A, B, C or D.",
        questions: [
          { id: "cr-q1", type: "mcq", text: "What percentage of the ocean floor do coral reefs cover?", options: ["A  Less than one percent","B  About five percent","C  About ten percent","D  About twenty-five percent"], answer: "A" },
          { id: "cr-q2", type: "mcq", text: "According to the passage, coral losses in some parts of the Caribbean have exceeded:", options: ["A  50%","B  60%","C  70%","D  80%"], answer: "D" },
          { id: "cr-q3", type: "mcq", text: "What is the primary role of zooxanthellae in coral reefs?", options: ["A  They protect the coral from predators","B  They supply most of the coral's energy through photosynthesis","C  They help the coral absorb minerals from the water","D  They build the three-dimensional reef structure"], answer: "B" },
          { id: "cr-q4", type: "mcq", text: "Why is ocean acidification particularly damaging to reef-building corals?", options: ["A  It kills the zooxanthellae algae directly","B  It causes sudden increases in water temperature","C  It reduces the ability of corals to build and maintain their skeletons","D  It promotes algal blooms on reef surfaces"], answer: "C" },
          { id: "cr-q5", type: "mcq", text: "What do critics say about current conservation measures for coral reefs?", options: ["A  They are too costly to sustain long-term","B  They are focused on the wrong geographical areas","C  They address effects rather than the underlying cause","D  They have not shown any positive results in practice"], answer: "C" },
        ],
      },
      {
        instruction: "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
        questions: [
          { id: "cr-q6", type: "tfng", text: "Coral reefs support more marine species than tropical rainforests.", answer: "Not Given" },
          { id: "cr-q7", type: "tfng", text: "Bleached corals are permanently unable to recover.", answer: "False" },
          { id: "cr-q8", type: "tfng", text: "The first recorded global coral bleaching event took place in 1998.", answer: "True" },
          { id: "cr-q9", type: "tfng", text: "The 2014–2017 bleaching event was triggered by an El Niño weather system.", answer: "Not Given" },
          { id: "cr-q10", type: "tfng", text: "By mid-century, bleaching-level heat events could occur every five to ten years in most regions.", answer: "True" },
          { id: "cr-q11", type: "tfng", text: "Coral restoration projects involving nursery-grown fragments have so far failed to show any benefit.", answer: "False" },
        ],
      },
    ],
  },
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
        instruction: "The reading passage has paragraphs A–F. Choose the correct heading for each paragraph from the list of headings below.",
        sharedOptions: ["i    The first known writing system and its long development","ii   How ancient scripts were decoded by modern researchers","iii  Why writing transformed human cognition and society","iv   A script that preserved its pictorial origins across centuries","v    The origins and distinctive features of a major East Asian script","vi   Competing explanations for how writing spread across the world","vii  How a simplified writing system expanded access to literacy","viii The role of commerce in the origins of early written records"],
        questions: [
          { id: "ow-q1", type: "matching_headings", paragraphLabel: "A", answer: "iii" },
          { id: "ow-q2", type: "matching_headings", paragraphLabel: "B", answer: "i" },
          { id: "ow-q3", type: "matching_headings", paragraphLabel: "C", answer: "iv" },
          { id: "ow-q4", type: "matching_headings", paragraphLabel: "D", answer: "v" },
          { id: "ow-q5", type: "matching_headings", paragraphLabel: "E", answer: "vi" },
          { id: "ow-q6", type: "matching_headings", paragraphLabel: "F", answer: "vii" },
        ],
      },
      {
        instruction: "The reading passage has paragraphs A–F. Which paragraph contains the following information? You may use any letter more than once.",
        questions: [
          { id: "ow-q7", type: "matching_info", text: "A reference to writing systems that arose without any possible contact with existing traditions", answer: "E" },
          { id: "ow-q8", type: "matching_info", text: "A description of how a writing system evolved from pictures into abstract marks", answer: "B" },
          { id: "ow-q9", type: "matching_info", text: "An example of a script that helped unite a linguistically diverse population", answer: "D" },
          { id: "ow-q10", type: "matching_info", text: "A mention of writing being used for everyday correspondence on a plant-based material", answer: "C" },
          { id: "ow-q11", type: "matching_info", text: "An explanation of why earlier writing systems were harder to learn than the alphabet", answer: "F" },
        ],
      },
    ],
  },
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
        instruction: "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
        questions: [
          { id: "ua-q1", type: "tfng", text: "Urban agriculture was previously considered a serious rival to conventional rural farming.", answer: "False" },
          { id: "ua-q2", type: "tfng", text: "Community gardens in food deserts can provide both nutritional and social benefits.", answer: "True" },
          { id: "ua-q3", type: "tfng", text: "The 2021 analysis found that all forms of urban farming use more energy than conventional farming.", answer: "False" },
          { id: "ua-q4", type: "tfng", text: "Hydroponic and aeroponic systems can reduce water use by up to 90 percent compared to field agriculture.", answer: "True" },
          { id: "ua-q5", type: "tfng", text: "Urban farms in Europe and North America generally sell their produce at similar prices to rural farms.", answer: "False" },
        ],
      },
      {
        instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        questions: [
          { id: "ua-q6", type: "sentence_completion", text: "Hydroponic systems grow plants in nutrient-rich ________ without using soil.", wordLimit: 2, answer: "water", answerVariants: ["water"] },
          { id: "ua-q7", type: "sentence_completion", text: "In hydroponic systems, water is ________ rather than being absorbed into the ground or lost through evaporation.", wordLimit: 2, answer: "recirculated", answerVariants: ["recirculated"] },
          { id: "ua-q8", type: "sentence_completion", text: "Urban farms that have achieved commercial success tend to focus on ________ markets.", wordLimit: 2, answer: "premium", answerVariants: ["premium markets"] },
          { id: "ua-q9", type: "sentence_completion", text: "Singapore has set a national goal to produce ________ of its nutritional needs locally by 2030.", wordLimit: 2, answer: "30 percent", answerVariants: ["30 percent", "30%"] },
          { id: "ua-q10", type: "sentence_completion", text: "Cities such as Paris and Amsterdam have incorporated urban food production targets into their ________ plans.", wordLimit: 2, answer: "climate action", answerVariants: ["climate action"] },
        ],
      },
    ],
  },
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
        instruction: "Choose the correct letter, A, B, C or D.",
        questions: [
          { id: "pc-q1", type: "mcq", text: "What does the passage say about beliefs regarding colour and emotion?", options: ["A  Most have been proved incorrect by modern research","B  Some have been confirmed while others are culturally specific or unfounded","C  They have been mostly confirmed but are only relevant in Western cultures","D  They were purely speculative until the twenty-first century"], answer: "B" },
          { id: "pc-q2", type: "mcq", text: "What explanation does the passage offer for the psychological effects of red?", options: ["A  Red is associated with luxury and high status in most cultures","B  Red has been used in art and architecture for thousands of years","C  Red is connected to evolutionary cues related to danger and physical states","D  Red stimulates the brain's reward system more than other colours"], answer: "C" },
          { id: "pc-q3", type: "mcq", text: "What did the research by Mehta and Zhu find about colour and task performance?", options: ["A  Blue always leads to better performance than red","B  Red is better for creative tasks while blue is better for accuracy tasks","C  Blue is better for creative tasks while red is better for accuracy tasks","D  Colour has no significant effect on performance for most task types"], answer: "C" },
          { id: "pc-q4", type: "mcq", text: "What does the passage say about marketing claims linking red and yellow to fast-food choices?", options: ["A  They are well-supported by experimental research","B  They are widely believed but hard to confirm through research","C  They have been proved incorrect by recent studies","D  They are no longer used by fast-food companies"], answer: "B" },
          { id: "pc-q5", type: "mcq", text: "According to the final paragraph, why do researchers warn against broad prescriptions for colour use?", options: ["A  They are too expensive to implement in most settings","B  Individual responses to colour vary too much for universal rules to apply","C  They have not been tested adequately in real-world settings","D  They are based primarily on cultural preferences rather than science"], answer: "B" },
        ],
      },
      {
        instruction: "Complete the summary below. Choose ONE word from the box for each answer.",
        sharedOptions: ["A  arousal","B  calmness","C  cultural","D  genetic","E  quality","F  stress","G  historical","H  universal"],
        questions: [
          { id: "pc-q6", type: "summary_completion", text: "Red has been linked to increased ________ (Q6) states such as higher heart rate and blood pressure, and athletes wearing red have achieved better results in some competitive sports.", wordLimit: 1, answer: "A", wordBox: ["A","B","C","D","E","F","G","H"] },
          { id: "pc-q7", type: "summary_completion", text: "Blue, by contrast, is associated with ________ (Q7) and improved concentration, although its benefits depend on the type of task being performed.", wordLimit: 1, answer: "B", wordBox: ["A","B","C","D","E","F","G","H"] },
          { id: "pc-q8", type: "summary_completion", text: "The study of colour psychology is complicated by ________ (Q8) differences, since the same colour can carry completely different meanings in different societies.", wordLimit: 1, answer: "C", wordBox: ["A","B","C","D","E","F","G","H"] },
          { id: "pc-q9", type: "summary_completion", text: "In marketing, research shows that colour affects the perceived ________ (Q9) of products, even when their physical or chemical properties are identical.", wordLimit: 1, answer: "E", wordBox: ["A","B","C","D","E","F","G","H"] },
          { id: "pc-q10", type: "summary_completion", text: "Researchers advise caution because individual reactions to colour are shaped by personal experience, cultural background, and even ________ (Q10) factors affecting colour perception.", wordLimit: 1, answer: "D", wordBox: ["A","B","C","D","E","F","G","H"] },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Reading passages
// ---------------------------------------------------------------------------

async function seedReadingPassages() {
  const supabase = getSupabase();

  const rows = READING_PASSAGES.map((p, i) => ({
    slug: p.id,
    title: p.title,
    exam_type: p.examType,
    difficulty: p.difficulty,
    topic_tags: p.topicTags,
    passage_text: p.passageText,
    question_groups: p.questionGroups,
    is_active: true,
    display_order: i,
  }));

  const { error, count } = await supabase
    .from("reading_passages")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) {
    console.error("❌ reading_passages seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ reading_passages: upserted ${count ?? rows.length} rows`);
}

// ---------------------------------------------------------------------------
// Listening tracks data
// ---------------------------------------------------------------------------

const LISTENING_TRACKS = [
  {
    id: "library-services",
    title: "Community Library Membership",
    section: 1,
    difficulty: 1,
    topicTags: ["everyday", "services", "form completion"],
    context: "You will hear a telephone conversation between a woman calling a community library and a staff member. The caller wants to register as a new member.",
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
        instruction: "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        questions: [
          { id: "ls-q1", type: "sentence_completion", text: "Member's surname: ______", wordLimit: 1, answer: "Carter" },
          { id: "ls-q2", type: "sentence_completion", text: "Phone number: 07823 456 ______", wordLimit: 3, answer: "190" },
          { id: "ls-q3", type: "sentence_completion", text: "Postcode: ______ 9BT", wordLimit: 1, answer: "SW12" },
          { id: "ls-q4", type: "sentence_completion", text: "Membership type: ______", wordLimit: 1, answer: "premium" },
          { id: "ls-q5", type: "sentence_completion", text: "Membership start date: 1st ______", wordLimit: 1, answer: "May" },
        ],
      },
      {
        instruction: "Choose the correct letter, A, B or C.",
        questions: [
          { id: "ls-q6", type: "mcq", text: "Why does the caller choose premium membership?", options: ["A  It is cheaper than standard membership.", "B  It includes digital borrowing.", "C  It allows borrowing more physical items."], answer: "B" },
          { id: "ls-q7", type: "mcq", text: "When does the book club meet?", options: ["A  Tuesday evenings at seven", "B  Wednesday mornings at ten", "C  Wednesday evenings at seven"], answer: "C" },
          { id: "ls-q8", type: "mcq", text: "The children's storytelling hour is aimed at children aged:", options: ["A  Two to six", "B  Four to eight", "C  Six to ten"], answer: "B" },
          { id: "ls-q9", type: "mcq", text: "The café closes at:", options: ["A  Five o'clock", "B  Five thirty", "C  Six o'clock"], answer: "B" },
          { id: "ls-q10", type: "mcq", text: "How long after registration will the membership card arrive?", options: ["A  Within two working days", "B  Within five working days", "C  Within seven working days"], answer: "B" },
        ],
      },
    ],
  },
  {
    id: "urban-farming",
    title: "Urban Farming: Cities and Food",
    section: 4,
    difficulty: 2,
    topicTags: ["academic", "environment", "science"],
    context: "You will hear a university lecture about urban farming, its benefits, and the challenges it faces in modern cities.",
    transcript: `Good morning. Today I want to talk about urban farming — the practice of cultivating food within or around cities — and why it is attracting growing interest from urban planners, environmentalists, and governments worldwide.

The idea is not as modern as it might seem. Throughout history, cities incorporated food production into their design. However, the twentieth century brought rapid industrialisation, and cities became almost entirely dependent on distant rural farmland for their food supply.

Now, several pressures are forcing a rethink. Chief among these is food security. With global populations expected to reach ten billion by mid-century, and climate change making traditional farming zones increasingly unreliable, there is growing urgency around how cities will feed themselves.

One of the most exciting responses has been the rise of vertical farming. These are purpose-built indoor facilities, often located in unused warehouse space, that use stacked growing layers, LED lighting, and hydroponic systems — that is, growing without soil — to produce crops year-round. The productivity gains are remarkable: compared to conventional agriculture, vertical farms use up to ninety-five percent less water and can yield three hundred times more produce per square metre.

The main drawback, however, is energy. Artificial lighting is expensive, and without renewable energy sources, the carbon footprint of vertical farms can actually exceed that of conventional farms. This is why the most successful urban farming operations tend to be in regions with affordable clean electricity.

There are also significant social benefits. Community gardens — smaller-scale projects inviting residents to grow food in shared spaces — have been linked to lower rates of food insecurity, improved mental health outcomes, and stronger community bonds. Research conducted in the Dutch city of Rotterdam found that residents living near community gardens reported higher levels of social interaction and a greater sense of belonging.

Critics, however, raise practical barriers. Urban land is expensive, and regulatory systems in many countries still treat commercial food growing within city limits as unnecessarily bureaucratic. Despite this, cities including Singapore, Tokyo, and New York have all begun incorporating urban agriculture into their official development strategies. The shift, it seems, is well underway.`,
    questionGroups: [
      {
        instruction: "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        questions: [
          { id: "uf-q1", type: "sentence_completion", text: "Global population expected to reach ______ billion by mid-century.", wordLimit: 2, answer: "10", answerVariants: ["ten"] },
          { id: "uf-q2", type: "sentence_completion", text: "Vertical farms use up to ______% less water than conventional farms.", wordLimit: 2, answer: "95", answerVariants: ["ninety-five"] },
          { id: "uf-q3", type: "sentence_completion", text: "Vertical farms can yield ______ times more produce per square metre.", wordLimit: 2, answer: "300", answerVariants: ["three hundred"] },
          { id: "uf-q4", type: "sentence_completion", text: "The main drawback of vertical farming is ______.", wordLimit: 1, answer: "energy" },
          { id: "uf-q5", type: "sentence_completion", text: "Research in ______ found community gardens improve social interaction.", wordLimit: 1, answer: "Rotterdam" },
          { id: "uf-q6", type: "sentence_completion", text: "Three cities incorporating urban farming into planning: Singapore, ______, and New York.", wordLimit: 1, answer: "Tokyo" },
        ],
      },
      {
        instruction: "Choose the correct letter, A, B or C.",
        questions: [
          { id: "uf-q7", type: "mcq", text: "Why did cities become dependent on distant farmland for food?", options: ["A  Soil in cities became polluted.", "B  Rapid industrialisation in the twentieth century separated urban and rural life.", "C  Rural populations declined sharply."], answer: "B" },
          { id: "uf-q8", type: "mcq", text: "What makes vertical farming most successful in certain regions?", options: ["A  Lower labour costs", "B  Government subsidies", "C  Affordable renewable energy"], answer: "C" },
          { id: "uf-q9", type: "mcq", text: "Which of the following is NOT mentioned as a benefit of community gardens?", options: ["A  Reduced food insecurity", "B  Improved mental health", "C  Reduced crime rates"], answer: "C" },
          { id: "uf-q10", type: "mcq", text: "What challenge do critics highlight regarding urban farming in cities?", options: ["A  Lack of skilled agricultural workers", "B  High land costs and complex regulations", "C  Low consumer demand for locally grown food"], answer: "B" },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Listening tracks
// ---------------------------------------------------------------------------

async function seedListeningTracks() {
  const supabase = getSupabase();

  const rows = LISTENING_TRACKS.map((t, i) => ({
    slug: t.id,
    title: t.title,
    section: t.section,
    difficulty: t.difficulty,
    topic_tags: t.topicTags,
    context: t.context,
    transcript: t.transcript,
    question_groups: t.questionGroups,
    is_active: true,
    display_order: i,
  }));

  const { error, count } = await supabase
    .from("listening_tracks")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) {
    console.error("❌ listening_tracks seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ listening_tracks: upserted ${count ?? rows.length} rows`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding content tables...\n");
  await seedSpeakingPrompts();
  await seedWritingPrompts();
  await seedReadingPassages();
  await seedListeningTracks();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
