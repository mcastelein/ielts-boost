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
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding content tables...\n");
  await seedSpeakingPrompts();
  await seedWritingPrompts();
  // Phase 3+: add seedReadingPassages(), seedListeningTracks() here
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
