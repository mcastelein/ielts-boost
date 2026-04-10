import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SCORING_PROMPT_EN = `You are an experienced IELTS examiner. Evaluate the following essay and return your assessment as valid JSON only — no markdown, no code fences, no extra text.

Return this exact JSON structure:
{
  "overall_band": <number 0-9, can use .5>,
  "task_score": <number>,
  "coherence_score": <number>,
  "lexical_score": <number>,
  "grammar_score": <number>,
  "feedback": {
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
    "sentence_corrections": [
      {
        "original": "<original sentence from essay>",
        "corrected": "<improved version>",
        "explanation": "<why this is better>"
      }
    ],
    "rewrite_example": "<one paragraph rewritten at a higher band level>",
    "top_3_improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
  }
}

Be clear, structured, and actionable. Do not claim this is an official IELTS score. Provide at least 2-3 sentence corrections. The rewrite should demonstrate band 7+ writing.`;

const SCORING_PROMPT_ZH = `你是一名经验丰富的雅思写作考官。请评估以下作文，并以有效的JSON格式返回你的评估——不要使用markdown格式，不要使用代码块，只返回JSON。

返回以下JSON结构：
{
  "overall_band": <0-9的数字，可以用.5>,
  "task_score": <数字>,
  "coherence_score": <数字>,
  "lexical_score": <数字>,
  "grammar_score": <数字>,
  "feedback": {
    "strengths": ["<优点1>", "<优点2>", "<优点3>"],
    "weaknesses": ["<缺点1>", "<缺点2>", "<缺点3>"],
    "sentence_corrections": [
      {
        "original": "<作文中的原句>",
        "corrected": "<改进后的版本>",
        "explanation": "<为什么这样更好>"
      }
    ],
    "rewrite_example": "<用更高分段水平改写的一个段落>",
    "top_3_improvements": ["<改进1>", "<改进2>", "<改进3>"]
  }
}

请用清晰、自然、适合学生理解的中文表达。不要声称这是官方雅思评分。请提供至少2-3个句子修改建议。改写示例应展示7分以上的写作水平。`;

export async function scoreEssay(
  essay: string,
  taskType: string,
  feedbackLanguage: string = "en"
) {
  const systemPrompt =
    feedbackLanguage === "zh" ? SCORING_PROMPT_ZH : SCORING_PROMPT_EN;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Task Type: IELTS Writing ${taskType === "task1" ? "Task 1" : "Task 2"}\n\nEssay:\n${essay}`,
      },
    ],
    system: systemPrompt,
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  const parsed = JSON.parse(textBlock.text);
  return { ...parsed, _usage: message.usage };
}
