# Douyin Post Ideas — Full Text Expansion

**Author:** Agent 2 (full-text writer)
**Source:** `outlines.md` (Agent 1's 105 outlines, T1–T7)
**Output:** Per-post 6-slide JSON ready for image-generation pipeline
**Format reference:** `drafts/01-speaking-part2-fluency/content.json`
**Markup:** `{P}…{/P}` purple, `{H}…{/H}` highlight, `{Y}…{/Y}` yellow underline. No em-dashes.

CTA slide is structurally identical across all posts (per Agent 1 note): only the `headline` question line varies by topic.

---

## Post 1 — conclusion-kills-tr — T1

**Topic:** Task 2 conclusion paragraph mistakes that drag TR score
**Save trigger:** 3-sentence conclusion formula you can copy.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Task 2 conclusion mistakes",
    "slug": "conclusion-kills-tr"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}结尾段{/P}写错\n{H}TR 直接掉 0.5{/H}！",
      "sublabel": "⚠ 这 3 个结尾错误正在拖垮你的 Task Response"
    },
    "slide2_error1": {
      "headline": "只是{H}重复 intro{/H}",
      "problem_desc": "把开头段原话复制一遍",
      "card_body": "{Y}In conclusion, as I mentioned in the introduction{/Y}, technology has both advantages and disadvantages.",
      "speech_bubble": "考官看过了！"
    },
    "slide3_error2": {
      "headline": "结尾{H}引入新观点{/H}",
      "problem_desc": "突然冒出一个没论证的论点",
      "card_body": "...overall, technology helps society. {Y}Besides, governments should also ban smartphones for kids.{/Y}",
      "speech_bubble": "这哪冒出来的！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "结尾{H}只剩一句{/H}",
      "card_body": "{Y}In conclusion, I agree with this view.{/Y} (然后就没了)",
      "speech_bubble": "再来 2 句！"
    },
    "slide5_fix": {
      "headline": "立刻{H}结尾过关{/H}！",
      "icon1_label": "重申",
      "icon2_label": "综合",
      "icon3_label": "展望",
      "card_body": "Restate stance with new wording + synthesize key reasons + add one {Y}forward-looking{/Y} thought = 3 sentences.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想知道你的结尾\n{H}能拿几分？{/H}"
    }
  }
}
```

---

## Post 2 — sneaky-spelling-errors — T1

**Topic:** Spelling mistakes Chinese candidates don't notice
**Save trigger:** Top 3 most-misspelled words + a memory trick.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Sneaky spelling errors Chinese candidates miss",
    "slug": "sneaky-spelling-errors"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}3 个单词{/P}偷偷\n扣你{H}0.5 分{/H}！",
      "sublabel": "⚠ 90% 中国考生都拼错过这几个"
    },
    "slide2_error1": {
      "headline": "{H}environment{/H}",
      "problem_desc": "漏中间的 n",
      "card_body": "We must protect the {Y}enviroment{/Y} from pollution.",
      "speech_bubble": "envir-on-ment！"
    },
    "slide3_error2": {
      "headline": "{H}government{/H}",
      "problem_desc": "漏 -rn-",
      "card_body": "The {Y}goverment{/Y} should invest in education.",
      "speech_bubble": "govern + ment！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}accommodation{/H}",
      "card_body": "I am looking for affordable {Y}accomodation{/Y} near campus.",
      "speech_bubble": "双 c 双 m！"
    },
    "slide5_fix": {
      "headline": "立刻{H}拼写过关{/H}！",
      "icon1_label": "拆音",
      "icon2_label": "口诀",
      "icon3_label": "复查",
      "card_body": "Split into syllables: {Y}en-vi-ron-ment / gov-ern-ment / ac-com-mo-da-tion{/Y}. Re-read backwards in last 2 min.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想知道你写作里\n{H}拼错了几个词？{/H}"
    }
  }
}
```

---

## Post 3 — listening-capital-letters — T1

**Topic:** Listening capital letter rules that cost a band
**Save trigger:** One-line rule for proper nouns.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Listening capital letter rules",
    "slug": "listening-capital-letters"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}听对了{/P}也{H}算错{/H}！",
      "sublabel": "⚠ Listening 大小写错就是 0 分"
    },
    "slide2_error1": {
      "headline": "{H}地名{/H}小写",
      "problem_desc": "City / street names 必须大写",
      "card_body": "Address: {Y}23 oxford street, london{/Y}.",
      "speech_bubble": "首字母大写！"
    },
    "slide3_error2": {
      "headline": "{H}人名{/H}小写",
      "problem_desc": "Surname / first name 必须大写",
      "card_body": "Name: {Y}sarah smith{/Y}.",
      "speech_bubble": "人名大写！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}月份/星期{/H}小写",
      "card_body": "Date: {Y}monday, 5 march{/Y}.",
      "speech_bubble": "月份星期都大写！"
    },
    "slide5_fix": {
      "headline": "立刻{H}大小写无错{/H}！",
      "icon1_label": "人/地",
      "icon2_label": "月/日",
      "icon3_label": "机构",
      "card_body": "Rule: {Y}proper nouns{/Y} — names, places, months, days, organizations — always Capital First Letter.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想做{H}免费 Listening{/H}\n大小写检测？"
    }
  }
}
```

---

## Post 4 — punctuation-low-band — T1

**Topic:** Punctuation mistakes that scream "low band"
**Save trigger:** 3 punctuation pitfalls and the 5-second fix.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Punctuation mistakes Chinese candidates make",
    "slug": "punctuation-low-band"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}标点{/P}一错\n考官给你{H}减 0.5{/H}！",
      "sublabel": "⚠ 这 3 个标点雷中文考生最常踩"
    },
    "slide2_error1": {
      "headline": "用了{H}中文逗号{/H}",
      "problem_desc": "顿号、出现在英语句子里",
      "card_body": "I like apples{Y}、{/Y}bananas{Y}、{/Y}and oranges.",
      "speech_bubble": "英文没顿号！"
    },
    "slide3_error2": {
      "headline": "{H}逗号粘连{/H}",
      "problem_desc": "两个完整句用逗号连",
      "card_body": "I love English{Y}, {/Y}I study every day.",
      "speech_bubble": "句号或 and！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "句尾{H}没句号{/H}",
      "card_body": "Technology changes our life{Y} {/Y}It affects everyone",
      "speech_bubble": "句号加上！"
    },
    "slide5_fix": {
      "headline": "立刻{H}标点过关{/H}！",
      "icon1_label": "逗号",
      "icon2_label": "句号",
      "icon3_label": "分号",
      "card_body": "Use {Y}, and{/Y} to join, full stop to separate, {Y};{/Y} for related independent clauses.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 标出\n你写作里的{H}标点错误？{/H}"
    }
  }
}
```

---

## Post 5 — typing-vs-handwriting-traps — T1

**Topic:** Hidden computer-based IELTS mistakes
**Save trigger:** Pre-submit checklist for CB writing.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Computer-based IELTS hidden traps",
    "slug": "typing-vs-handwriting-traps"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}机考{/P}更容易？\n{H}3 个隐形扣分点{/H}！",
      "sublabel": "⚠ 这些机考习惯让你掉 0.5 分"
    },
    "slide2_error1": {
      "headline": "{H}字数{/H}估错",
      "problem_desc": "凭感觉写, 没看字数器",
      "card_body": "User submits 232 words. {Y}Penalty: under 250.{/Y}",
      "speech_bubble": "盯字数器！"
    },
    "slide3_error2": {
      "headline": "段落{H}没空行{/H}",
      "problem_desc": "整篇没分段, 像一堵墙",
      "card_body": "Body 1...Body 2...Body 3...all in one block. {Y}CC drops.{/Y}",
      "speech_bubble": "按两下回车！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "粘贴{H}格式残留{/H}",
      "card_body": "Pasted notes leave {Y}weird spacing{/Y} and {Y}bullet symbols • • •{/Y}.",
      "speech_bubble": "粘贴后清干净！"
    },
    "slide5_fix": {
      "headline": "立刻{H}机考过关{/H}！",
      "icon1_label": "字数",
      "icon2_label": "分段",
      "icon3_label": "清格式",
      "card_body": "Glance at counter at {Y}250 / 270{/Y}, double-Enter between paragraphs, clean paste with no symbols.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想用 IELTSBoost\n{H}模拟机考界面？{/H}"
    }
  }
}
```

---

## Post 6 — part3-silence — T1

**Topic:** Part 3 silence kills your Speaking score
**Save trigger:** 5 stalling phrases that buy you thinking time.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Speaking Part 3 silence traps",
    "slug": "part3-silence"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Part 3{/P}沉默 5 秒\n考官{H}立刻扣分{/H}！",
      "sublabel": "⚠ 这 3 个反应正在害你"
    },
    "slide2_error1": {
      "headline": "{H}完全{/H}沉默",
      "problem_desc": "5 秒以上不说话",
      "card_body": "Examiner: \"Why do you think...?\" Candidate: {Y}(silence, 6 seconds){/Y}.",
      "speech_bubble": "先开口！"
    },
    "slide3_error2": {
      "headline": "{H}um um um{/H} 重复",
      "problem_desc": "全是无意义的拖延音",
      "card_body": "{Y}Um... um... um... well... um... I think...{/Y}",
      "speech_bubble": "换说法！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}I don't know{/H} 收场",
      "card_body": "Examiner: \"What's the impact of...?\" Candidate: {Y}I don't know.{/Y}",
      "speech_bubble": "硬聊也要聊！"
    },
    "slide5_fix": {
      "headline": "立刻{H}有话可说{/H}！",
      "icon1_label": "缓冲句",
      "icon2_label": "重述题",
      "icon3_label": "举例子",
      "card_body": "Buy time with {Y}That's a thought-provoking question{/Y} or {Y}Let me think about that for a second{/Y}, then restate + example.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想练{H}Part 3 即兴反应？{/H}"
    }
  }
}
```

---

## Post 7 — repetition-lr-enemy — T1

**Topic:** Vocabulary repetition is your biggest LR enemy
**Save trigger:** Pronoun + synonym + restructure swap kit.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Vocabulary repetition tanks Lexical Resource",
    "slug": "repetition-lr-enemy"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}同一个词{/P}写 8 次\n{H}LR 上不去{/H}！",
      "sublabel": "⚠ 你的 Lexical Resource 正在被重复毁掉"
    },
    "slide2_error1": {
      "headline": "{H}think{/H} 写 6 次",
      "problem_desc": "整篇 essay 都是 I think",
      "card_body": "I {Y}think{/Y} A is true. I also {Y}think{/Y} B helps. People {Y}think{/Y} that... I {Y}think{/Y} we should...",
      "speech_bubble": "再换说法！"
    },
    "slide3_error2": {
      "headline": "{H}important{/H} 每段都来",
      "problem_desc": "全文 5 段 5 个 important",
      "card_body": "Education is {Y}important{/Y}. Family is {Y}important{/Y}. Health is {Y}important{/Y}.",
      "speech_bubble": "考官看吐了！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}people{/H} 通篇可见",
      "card_body": "{Y}People{/Y} like phones. {Y}People{/Y} need rest. {Y}People{/Y} have stress.",
      "speech_bubble": "换称呼！"
    },
    "slide5_fix": {
      "headline": "立刻{H}词汇多样{/H}！",
      "icon1_label": "代词",
      "icon2_label": "同义词",
      "icon3_label": "改结构",
      "card_body": "Swap to {Y}individuals / citizens / they{/Y}, {Y}argue / believe / hold the view{/Y}, {Y}vital / crucial / essential{/Y}.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 标出你\n{H}高频重复词？{/H}"
    }
  }
}
```

---

## Post 8 — listening-s1-spelling — T1

**Topic:** Listening Section 1 spelling traps
**Save trigger:** Prediction-before-listening routine.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Listening Section 1 spelling traps",
    "slug": "listening-s1-spelling"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Section 1{/P}\n90% 丢分都在{H}拼写{/H}！",
      "sublabel": "⚠ 听对了, 拼错了, 一样 0 分"
    },
    "slide2_error1": {
      "headline": "{H}双字母{/H}漏一个",
      "problem_desc": "ss / dd / mm 听到了写错",
      "card_body": "Heard: \"success at the address\". Wrote: {Y}sucess{/Y} at the {Y}adress{/Y}.",
      "speech_bubble": "双写检查！"
    },
    "slide3_error2": {
      "headline": "{H}silent letter{/H} 漏掉",
      "problem_desc": "听不到 = 不写",
      "card_body": "Heard: \"knee, honest\". Wrote: {Y}nee, onest{/Y}.",
      "speech_bubble": "默字母也要写！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}常见姓{/H}拼错",
      "card_body": "Heard: \"Smith, Brown\". Wrote: {Y}Smiht, Braun{/Y}.",
      "speech_bubble": "常见姓背熟！"
    },
    "slide5_fix": {
      "headline": "立刻{H}S1 满分{/H}！",
      "icon1_label": "预测",
      "icon2_label": "双写",
      "icon3_label": "默音",
      "card_body": "Before audio: predict word type ({Y}name / number / address{/Y}). After: double-check {Y}double letters + silent letters{/Y}.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想做{H}免费 Listening{/H}\n拼写训练？"
    }
  }
}
```

---

## Post 9 — reading-time-wasters — T1

**Topic:** Reading habits that waste your 60 minutes
**Save trigger:** 60-minute Reading order formula.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Reading habits that waste time",
    "slug": "reading-time-wasters"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}60 分钟{/P}做不完？\n{H}3 个坏习惯{/H}！",
      "sublabel": "⚠ Reading 时间不够全因为这些"
    },
    "slide2_error1": {
      "headline": "{H}逐字读{/H}",
      "problem_desc": "一字不漏地读全文",
      "card_body": "Candidate reads {Y}every word{/Y}, top to bottom. Time spent: 18 min on Passage 1.",
      "speech_bubble": "扫读！"
    },
    "slide3_error2": {
      "headline": "{H}查生词{/H}",
      "problem_desc": "停下来想每个不认识的词",
      "card_body": "Stops on \"{Y}phenomenon{/Y}\" for 30 sec. 60 sec on \"{Y}prerequisite{/Y}\". 100 sec on \"{Y}superfluous{/Y}\".",
      "speech_bubble": "跳过去！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "按{H}题号顺序{/H}做",
      "card_body": "Q1 (T/F/NG) → Q2 (T/F/NG) → Q3 (Matching). Stuck on Q2 for {Y}5 minutes{/Y}.",
      "speech_bubble": "题型重排！"
    },
    "slide5_fix": {
      "headline": "立刻{H}做完 60 分钟{/H}！",
      "icon1_label": "扫读",
      "icon2_label": "定位",
      "icon3_label": "题型",
      "card_body": "Skim 1 min, do {Y}location-based Qs first{/Y}, save {Y}T/F/NG{/Y} for last.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想做 Reading\n{H}计时模考？{/H}"
    }
  }
}
```

---

## Post 10 — memorized-speaking-tells — T1

**Topic:** Memorized phrases examiners spot instantly
**Save trigger:** 3 dead-giveaway opener phrases to ditch.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Memorized Speaking phrases examiners catch",
    "slug": "memorized-speaking-tells"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}背的答案{/P}\n考官{H}3 秒识破{/H}！",
      "sublabel": "⚠ 这 3 句话一开口就暴露你"
    },
    "slide2_error1": {
      "headline": "{H}Well, that's a really\ngood question{/H}",
      "problem_desc": "考官 100% 听过的开头",
      "card_body": "Examiner: \"What's your favourite color?\" Candidate: {Y}Well, that's a really good question.{/Y}",
      "speech_bubble": "别拍马屁！"
    },
    "slide3_error2": {
      "headline": "{H}To be honest{/H} 每题",
      "problem_desc": "每个回答都用同一过渡",
      "card_body": "Q1: {Y}To be honest{/Y}... Q2: {Y}To be honest{/Y}... Q3: {Y}To be honest{/Y}...",
      "speech_bubble": "换说法！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}专业术语{/H}堆砌",
      "card_body": "Hometown Q: \"{Y}It's a metropolis with paramount infrastructural significance.{/Y}\"",
      "speech_bubble": "说人话！"
    },
    "slide5_fix": {
      "headline": "立刻{H}听起来自然{/H}！",
      "icon1_label": "自然开头",
      "icon2_label": "个人细节",
      "icon3_label": "节奏",
      "card_body": "Open with {Y}Oh, let me think...{/Y} or jump straight in. Add one tiny personal detail. Keep 30-sec rhythm.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评测\n{H}你的 Speaking 真实度？{/H}"
    }
  }
}
```

---

## Post 11 — part2-finished-too-fast — T1

**Topic:** Part 2 finished in 45 seconds
**Save trigger:** 4-bullet × 30-second pacing formula.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Speaking Part 2 finished too quickly",
    "slug": "part2-finished-too-fast"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Part 2{/P}\n45 秒讲完{H}=扣分{/H}！",
      "sublabel": "⚠ 不到 2 分钟说明你没展开"
    },
    "slide2_error1": {
      "headline": "{H}只回答 bullet{/H}",
      "problem_desc": "题卡上 4 点机械回答完",
      "card_body": "Who? {Y}My friend.{/Y} What? {Y}A trip.{/Y} When? {Y}Last year.{/Y} Why? {Y}It was fun.{/Y}",
      "speech_bubble": "展开！"
    },
    "slide3_error2": {
      "headline": "{H}没感受{/H}没细节",
      "problem_desc": "纯陈述, 零情绪",
      "card_body": "We went to Tokyo. We saw temples. We ate sushi. {Y}It was good.{/Y}",
      "speech_bubble": "感受呢？"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}讲完就停{/H}",
      "card_body": "Candidate stops at 47 seconds. Examiner waits. {Y}Awkward silence.{/Y}",
      "speech_bubble": "继续聊！"
    },
    "slide5_fix": {
      "headline": "立刻{H}撑满 2 分钟{/H}！",
      "icon1_label": "30 秒/段",
      "icon2_label": "五感",
      "icon3_label": "反思",
      "card_body": "{Y}30 sec × 4 bullets = 2 min{/Y}. Add {Y}sensory + feeling + reflection{/Y} to each bullet.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想做 Part 2\n{H}计时练习？{/H}"
    }
  }
}
```

---

## Post 12 — task2-word-count — T1

**Topic:** Task 2 word count traps
**Save trigger:** 250–290 sweet-spot rule.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Task 2 word count traps",
    "slug": "task2-word-count"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}字数错了{/P}\n内容再好{H}也扣分{/H}！",
      "sublabel": "⚠ Task 2 字数 3 个雷区"
    },
    "slide2_error1": {
      "headline": "{H}不到 250{/H}",
      "problem_desc": "240 词以下自动扣 1 分",
      "card_body": "Final count: {Y}232 words{/Y}. TR ceiling: band 5.",
      "speech_bubble": "再加 20！"
    },
    "slide3_error2": {
      "headline": "{H}硬堆 400{/H}",
      "problem_desc": "啰嗦重复, CC 反而扣分",
      "card_body": "Essay padded with {Y}As mentioned above, as we all know, in today's society{/Y}... = 410 words.",
      "speech_bubble": "别灌水！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}数错{/H}以为够",
      "card_body": "Candidate's estimate: \"about 260\". Actual: {Y}238 words{/Y}.",
      "speech_bubble": "数行数！"
    },
    "slide5_fix": {
      "headline": "立刻{H}字数最佳{/H}！",
      "icon1_label": "目标 270",
      "icon2_label": "行数法",
      "icon3_label": "质量",
      "card_body": "Aim {Y}270 (sweet spot){/Y}. Rough check: ~10 words per line × 27 lines.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评估\n{H}你的字数和质量？{/H}"
    }
  }
}
```

---

## Post 13 — misreading-instructions — T1

**Topic:** Misreading the Task 2 prompt = band 5 ceiling
**Save trigger:** 1-minute question analysis routine.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Misreading Task 2 instructions",
    "slug": "misreading-instructions"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}看错题{/P}\n写得再好{H}也 5 分{/H}！",
      "sublabel": "⚠ 这 3 种题型最容易答错"
    },
    "slide2_error1": {
      "headline": "{H}Discuss both views{/H}\n只写一边",
      "problem_desc": "只写自己的观点, 没讨论对立面",
      "card_body": "Prompt: \"Discuss both views.\" Essay covers {Y}only the 'agree' side{/Y}.",
      "speech_bubble": "两边都要！"
    },
    "slide3_error2": {
      "headline": "{H}Agree/Disagree{/H}\n没表态",
      "problem_desc": "通篇骑墙, 不说立场",
      "card_body": "Conclusion: \"{Y}It depends on the situation.{/Y}\"",
      "speech_bubble": "选个边！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}Two-part question{/H}\n只回答一问",
      "card_body": "Prompt: \"What are the causes? What can be done?\" Essay {Y}only answers causes{/Y}.",
      "speech_bubble": "两问都答！"
    },
    "slide5_fix": {
      "headline": "立刻{H}审题精准{/H}！",
      "icon1_label": "圈关键词",
      "icon2_label": "识题型",
      "icon3_label": "1 分钟",
      "card_body": "Circle {Y}discuss / agree / cause / solution{/Y} verbs, identify type, plan in 1 minute.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检查\n{H}你的审题准确度？{/H}"
    }
  }
}
```

---

## Post 14 — body-language-voice — T1

**Topic:** Body language and voice tone in Speaking
**Save trigger:** 3 vocal cues that signal confidence.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Speaking body language and voice mistakes",
    "slug": "body-language-voice"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}内容 7 分{/P}\n声音{H}只 5.5{/H}！",
      "sublabel": "⚠ 这 3 个小动作让考官给低分"
    },
    "slide2_error1": {
      "headline": "声音{H}越说越小{/H}",
      "problem_desc": "句尾完全听不清",
      "card_body": "Start: \"I really enjoy reading...\" End: \"...{Y}*mumble*{/Y}\"",
      "speech_bubble": "提音量！"
    },
    "slide3_error2": {
      "headline": "全程{H}低头{/H}看桌",
      "problem_desc": "0 眼神接触",
      "card_body": "Examiner looks up. Candidate {Y}stares at the desk for 11 minutes{/Y}.",
      "speech_bubble": "抬头！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}平淡{/H}单调",
      "card_body": "Every sentence ends with the same flat tone — {Y}monotone, 0 intonation{/Y}.",
      "speech_bubble": "有起伏！"
    },
    "slide5_fix": {
      "headline": "立刻{H}有自信{/H}！",
      "icon1_label": "音量",
      "icon2_label": "眼神",
      "icon3_label": "起伏",
      "card_body": "Project {Y}30% louder{/Y}, brief eye contact at sentence starts, {Y}rise on questions, fall on statements{/Y}.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想用 AI 检测\n{H}你录音的声音问题？{/H}"
    }
  }
}
```

---

## Post 15 — task2-bad-examples — T1

**Topic:** Task 2 examples that backfire
**Save trigger:** 3 safe example types + 3 banned ones.

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Task 2 example mistakes",
    "slug": "task2-bad-examples"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}你的例子{/P}不是加分\n是{H}扣分项{/H}！",
      "sublabel": "⚠ 这 3 类例子考官最反感"
    },
    "slide2_error1": {
      "headline": "{H}个人轶事{/H}",
      "problem_desc": "用朋友 / 亲戚的故事当证据",
      "card_body": "{Y}My friend Tom said his job is boring, so technology must be bad.{/Y}",
      "speech_bubble": "太小！"
    },
    "slide3_error2": {
      "headline": "{H}编数据{/H}",
      "problem_desc": "瞎编百分比和报告",
      "card_body": "{Y}According to a 2022 Harvard study, 87.6% of teenagers...{/Y} (made up)",
      "speech_bubble": "考官不信！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}老掉牙{/H}例子",
      "card_body": "{Y}Steve Jobs / Jack Ma / Edison{/Y} again. Examiner has read this 200 times.",
      "speech_bubble": "换新人！"
    },
    "slide5_fix": {
      "headline": "立刻{H}例子有力{/H}！",
      "icon1_label": "假设",
      "icon2_label": "趋势",
      "icon3_label": "通用",
      "card_body": "Use {Y}hypothetical scenarios{/Y}, {Y}general societal trends{/Y}, or named studies you actually remember.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评估\n{H}你的例子说服力？{/H}"
    }
  }
}
```

---

## Post 16 — band6-vs-band8-phrasing — T2

**Topic:** Same idea, band 6 vs band 8 phrasing
**Save trigger:** 5 before/after sentence upgrades.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 phrasing",
    "slug": "band6-vs-band8-phrasing"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}同一个想法{/P}\n6 分 vs {H}8 分{/H}",
      "sublabel": "⚠ 改 4 个词就能跳 2 个 band"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "原句",
      "card_body": "{Y}Pollution is a big problem in cities.{/Y}",
      "speech_bubble": "太基础！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "动词太基础 (is)",
      "reason2": "形容词太空 (big)",
      "reason3": "没有具体说哪种污染"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "升级",
      "card_body": "{Y}Air pollution constitutes one of the most pressing challenges of our era.{/Y}",
      "speech_bubble": "高级感来了！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "名词化 (constitutes)",
      "reason2": "精确形容词 (pressing)",
      "reason3": "指明 air pollution"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你的\n{H}每一句打 band 分？{/H}"
    }
  }
}
```

---

## Post 17 — band6-vs-band8-intro — T2

**Topic:** Band 6 vs Band 8 Task 2 introduction
**Save trigger:** Paraphrase + Position + Preview 3-part formula.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 Task 2 introduction",
    "slug": "band6-vs-band8-intro"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}同一题目{/P}\n开头段{H}6 vs 8{/H}",
      "sublabel": "⚠ 看 intro 就知道你几分"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "原 intro",
      "card_body": "{Y}Nowadays many people think technology is good. Others think it is bad. This essay will discuss both sides.{/Y}",
      "speech_bubble": "套话！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "Nowadays 是模板开头",
      "reason2": "没有立场",
      "reason3": "没有预告论点"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "升级 intro",
      "card_body": "{Y}While digital technology has transformed communication, its impact on mental wellbeing remains contested. This essay will argue that the drawbacks outweigh the benefits, focusing on attention loss and social isolation.{/Y}",
      "speech_bubble": "立场鲜明！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "改写题目 (paraphrase)",
      "reason2": "明确立场 (position)",
      "reason3": "预告 2 个论点 (preview)"
    },
    "slide6_cta": {
      "headline": "想让 AI 改写\n{H}你的开头段？{/H}"
    }
  }
}
```

---

## Post 18 — band6-vs-band8-part1 — T2

**Topic:** Same Speaking Part 1 question, band 6 vs band 8 answer
**Save trigger:** 25-second Part 1 4-element formula.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 Part 1 answer",
    "slug": "band6-vs-band8-part1"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}\"Do you like reading?\"{/P}\n6 分 vs {H}8 分{/H}",
      "sublabel": "⚠ 听这个差距"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "短答",
      "card_body": "{Y}Yes, I do. Reading is fun. I read sometimes.{/Y}",
      "speech_bubble": "太短了！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "3 个 simple sentence",
      "reason2": "没有具体细节",
      "reason3": "vocab 太基础 (fun, sometimes)"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "完整答",
      "card_body": "{Y}Absolutely. I am something of a bookworm, and I usually carry a paperback in my bag, especially historical fiction. There is nothing like getting lost in another era during my commute.{/Y}",
      "speech_bubble": "细节满满！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Direct answer + personality",
      "reason2": "具体习惯 + 偏好",
      "reason3": "Mild reflection 收尾"
    },
    "slide6_cta": {
      "headline": "想让 AI 评测\n{H}你的 Part 1 答案？{/H}"
    }
  }
}
```

---

## Post 19 — band6-vs-band8-conclusion — T2

**Topic:** Conclusion paragraph band 6 vs band 8
**Save trigger:** 5 band-8 conclusion openers.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 conclusion",
    "slug": "band6-vs-band8-conclusion"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}In conclusion{/P}\n就是{H}6 分结尾{/H}",
      "sublabel": "⚠ 看 8 分怎么写结尾"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "原结尾",
      "card_body": "{Y}In conclusion, I think technology has both good and bad sides. People should use it carefully.{/Y}",
      "speech_bubble": "敷衍！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "重复 intro 用语",
      "reason2": "没新视角",
      "reason3": "I think 太弱"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "升级",
      "card_body": "{Y}Weighing the arguments, the costs of unregulated tech use clearly outweigh its conveniences. A balanced framework, combining personal discipline with public guidelines, will likely prove the most sustainable path forward.{/Y}",
      "speech_bubble": "高级感！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Weighing language",
      "reason2": "综合双方 + 立场",
      "reason3": "Forward-looking statement"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你的\n{H}结尾打分？{/H}"
    }
  }
}
```

---

## Post 20 — band6-vs-band8-overview — T2

**Topic:** Task 1 overview sentence band 6 vs band 8
**Save trigger:** 2-sentence Big trend + Standout overview formula.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 Task 1 overview",
    "slug": "band6-vs-band8-overview"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Task 1 overview{/P}\n决定{H}你的上限{/H}",
      "sublabel": "⚠ 这一句 6 vs 8 差距最大"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "原 overview",
      "card_body": "{Y}The chart shows changes in sales from 2010 to 2020.{/Y}",
      "speech_bubble": "无内容！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "只重复题目",
      "reason2": "没有趋势词",
      "reason3": "没有 standout feature"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "升级",
      "card_body": "{Y}Overall, online sales rose sharply throughout the decade, while in-store sales declined steadily, with the two figures crossing in 2016.{/Y}",
      "speech_bubble": "趋势清楚！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Big trend (rose / declined)",
      "reason2": "Standout feature (crossing in 2016)",
      "reason3": "No specific numbers (留 body)"
    },
    "slide6_cta": {
      "headline": "想让 AI 重写\n{H}你的 overview？{/H}"
    }
  }
}
```

---

## Post 21 — band6-vs-band8-cohesion — T2

**Topic:** Cohesion devices band 6 vs band 8
**Save trigger:** 12 cohesion devices ranked by band.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 cohesion",
    "slug": "band6-vs-band8-cohesion"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Firstly Secondly{/P}\n就是{H}6 分连接{/H}",
      "sublabel": "⚠ 看 8 分怎么衔接"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "原段",
      "card_body": "{Y}Firstly, exercise is good. Secondly, exercise helps mood. Thirdly, exercise extends life.{/Y}",
      "speech_bubble": "数数字！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "Firstly/Secondly 太模板",
      "reason2": "句子结构相同",
      "reason3": "没有词汇衔接"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "升级",
      "card_body": "{Y}Regular exercise offers clear physical benefits. Beyond the body, however, it lifts mood and sharpens focus. More importantly, those who exercise consistently tend to live longer, healthier lives.{/Y}",
      "speech_bubble": "自然连贯！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Substitution (it)",
      "reason2": "Beyond / however / more importantly",
      "reason3": "Lexical chain (exercise → body → mood)"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的衔接质量？{/H}"
    }
  }
}
```

---

## Post 22 — band6-vs-band8-fluency — T2

**Topic:** Speaking fluency band 6 vs band 8
**Save trigger:** 5 hedge phrases that replace um.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 Speaking fluency",
    "slug": "band6-vs-band8-fluency"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}同一段话{/P}\n6 分 12 个 um, {H}8 分只有 2 个{/H}",
      "sublabel": "⚠ Filler 数量决定 band"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "Filler 多",
      "card_body": "{Y}So, um, I think, um, my hometown is, um, like, kind of, you know, a small city, um...{/Y}",
      "speech_bubble": "数 um！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "高频 um / like / you know",
      "reason2": "信息密度低",
      "reason3": "节奏被打断"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "Hedges 替换",
      "card_body": "{Y}Let me see, my hometown is a relatively small place, that being said, it has a surprisingly vibrant cafe scene.{/Y}",
      "speech_bubble": "节奏好！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Strategic pause + hedge",
      "reason2": "Let me see / that being said",
      "reason3": "Filler 减少 80%"
    },
    "slide6_cta": {
      "headline": "想让 AI 数\n{H}你录音里的 filler？{/H}"
    }
  }
}
```

---

## Post 23 — band6-vs-band8-grammar — T2

**Topic:** Grammatical range band 6 vs band 8
**Save trigger:** 4 high-impact grammar structures.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 grammatical range",
    "slug": "band6-vs-band8-grammar"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}8 分语法{/P}\n不是难, 是{H}多样{/H}",
      "sublabel": "⚠ 6 分全是 simple sentence"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "全 simple",
      "card_body": "{Y}Cities are crowded. Cars cause pollution. People are unhealthy. Government should help.{/Y}",
      "speech_bubble": "句型单一！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "全是主谓宾",
      "reason2": "没条件句 / 倒装",
      "reason3": "GRA 上限 6"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "结构多样",
      "card_body": "{Y}If cities continue to expand without proper planning, pollution will inevitably rise. Not only does this threaten public health, but it also strains infrastructure, which is what governments must now address.{/Y}",
      "speech_bubble": "多样化！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Conditional (If...)",
      "reason2": "Inversion (Not only...)",
      "reason3": "Relative clause (which is...)"
    },
    "slide6_cta": {
      "headline": "想让 AI 分析\n{H}你的句型多样性？{/H}"
    }
  }
}
```

---

## Post 24 — band6-vs-band8-examples — T2

**Topic:** Task 2 examples band 6 vs band 8
**Save trigger:** 4 marks of a band-8 example.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 examples",
    "slug": "band6-vs-band8-examples"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}一个例子{/P}\n能让你 {H}6 → 8{/H}",
      "sublabel": "⚠ 例子也分 band"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "弱例子",
      "card_body": "{Y}For example, my friend Tom uses his phone all day and he is unhappy.{/Y}",
      "speech_bubble": "太小！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "个人小事",
      "reason2": "没研究支撑",
      "reason3": "For example 模板"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "强例子",
      "card_body": "{Y}A 2019 OECD study found that adolescents who exceed 4 hours of daily screen time report 25% higher rates of anxiety, illustrating the toll of unmediated tech use.{/Y}",
      "speech_bubble": "权威！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "具体数字 + 来源",
      "reason2": "Research-flavored",
      "reason3": "整合到论证 (illustrating...)"
    },
    "slide6_cta": {
      "headline": "想让 AI 评估\n{H}你的例子层次？{/H}"
    }
  }
}
```

---

## Post 25 — band6-vs-band8-paraphrase — T2

**Topic:** Paraphrasing the prompt band 6 vs band 8
**Save trigger:** Replace + restructure + compress 3-step.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 paraphrasing",
    "slug": "band6-vs-band8-paraphrase"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}改写题目{/P}\n{H}6 vs 8 差距{/H}",
      "sublabel": "⚠ 单词替换不是改写"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "单词替换",
      "card_body": "Prompt: \"Many people think...\" Paraphrase: \"{Y}Lots of individuals believe...{/Y}\"",
      "speech_bubble": "换汤不换药！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "只换 1-2 个单词",
      "reason2": "句子结构没变",
      "reason3": "考官秒识破"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "重构",
      "card_body": "Prompt: \"Many people think university education is too expensive.\" Paraphrase: \"{Y}The rising cost of higher education has become a widespread concern.{/Y}\"",
      "speech_bubble": "重组！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Synonyms (cost / concern)",
      "reason2": "Nominalization (rising cost)",
      "reason3": "Compressed structure"
    },
    "slide6_cta": {
      "headline": "想让 AI 帮你\n{H}改写题目句？{/H}"
    }
  }
}
```

---

## Post 26 — band6-vs-band8-disagree — T2

**Topic:** Expressing disagreement band 6 vs band 8
**Save trigger:** Acknowledge + pivot + counter 3-step.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 disagreement",
    "slug": "band6-vs-band8-disagree"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}\"I don't agree\"{/P}\n就是{H}5 分反驳{/H}",
      "sublabel": "⚠ 8 分这样说不"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "直接否定",
      "card_body": "{Y}I don't agree with this view. I think it is wrong because it is not good.{/Y}",
      "speech_bubble": "没说服力！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "I don't agree 重复",
      "reason2": "没承认对方观点",
      "reason3": "原因模糊"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "缓和反驳",
      "card_body": "{Y}While this view has merit, it overlooks the fact that long-term costs often exceed short-term gains, particularly in healthcare spending.{/Y}",
      "speech_bubble": "有层次！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Acknowledge (While...merit)",
      "reason2": "Pivot (overlooks)",
      "reason3": "Counter-evidence specifies"
    },
    "slide6_cta": {
      "headline": "想让 AI 测\n{H}你的反驳深度？{/H}"
    }
  }
}
```

---

## Post 27 — band6-vs-band8-trends — T2

**Topic:** Task 1 trend verbs band 6 vs band 8
**Save trigger:** Trend verb grid by chart shape.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 trend description",
    "slug": "band6-vs-band8-trends"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}\"Go up\"{/P} 是 6 分\n{H}\"Surge\" 不一定是 8 分{/H}",
      "sublabel": "⚠ 精准 > 华丽"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "全用 go up",
      "card_body": "Sales {Y}go up{/Y}. Prices {Y}go up{/Y}. Demand also {Y}goes up{/Y}.",
      "speech_bubble": "动词重复！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "Go up 重复",
      "reason2": "没区分趋势速度",
      "reason3": "没修饰词"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "精准动词",
      "card_body": "Sales {Y}climbed steadily{/Y}, while prices {Y}surged abruptly{/Y} before {Y}plateauing{/Y} in Q3.",
      "speech_bubble": "动词配图形！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "动词配合图形",
      "reason2": "Adverb 修饰精准度",
      "reason3": "趋势变化清晰"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的趋势词准确度？{/H}"
    }
  }
}
```

---

## Post 28 — band6-vs-band8-intonation — T2

**Topic:** Stress and intonation band 6 vs band 8
**Save trigger:** 3 intonation patterns.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 intonation",
    "slug": "band6-vs-band8-intonation"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}同样的句子{/P}\n6 分像机器, {H}8 分像 native{/H}",
      "sublabel": "⚠ 语调决定隐形 0.5 分"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "平淡",
      "card_body": "Same flat tone on every word: {Y}I-like-read-ing-be-cause-it-helps-me-re-lax{/Y}.",
      "speech_bubble": "没起伏！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "全句单调",
      "reason2": "没区分 content 词",
      "reason3": "Question 不上扬"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "起伏",
      "card_body": "Stress on content words: {Y}I LIKE reading because it helps me RELAX{/Y}. Pitch rises on question, falls on statement.",
      "speech_bubble": "有节奏！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Stress on content words",
      "reason2": "Falling intonation 陈述",
      "reason3": "Rising intonation 问句"
    },
    "slide6_cta": {
      "headline": "想用 AI 分析\n{H}你的语调节奏？{/H}"
    }
  }
}
```

---

## Post 29 — band6-vs-band8-essay-rewrite — T2

**Topic:** Full Task 2 paragraph band 6 → band 8 rewrite
**Save trigger:** Same skeleton, upgraded layers.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 full paragraph rewrite",
    "slug": "band6-vs-band8-essay-rewrite"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}不改观点{/P}\n只改写法 {H}6 → 8{/H}",
      "sublabel": "⚠ 整段升级实战"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "原段",
      "card_body": "{Y}I think technology is good. It helps people work fast. For example, my friend uses email. He works very fast. So technology is good.{/Y}",
      "speech_bubble": "全部 simple！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "Simple sentences only",
      "reason2": "重复 good / fast",
      "reason3": "弱例子"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "升级",
      "card_body": "{Y}Technology has dramatically accelerated workplace productivity. Tools such as email and project software allow knowledge workers to coordinate across continents in seconds, a feat unimaginable two decades ago. This efficiency, however, comes at the cost of always-on availability.{/Y}",
      "speech_bubble": "层次分明！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Vocab 升级 (dramatically)",
      "reason2": "Complex sentence + relative",
      "reason3": "Nuanced reflection 收束"
    },
    "slide6_cta": {
      "headline": "想让 AI 完整\n{H}重写你的 essay？{/H}"
    }
  }
}
```

---

## Post 30 — band6-vs-band8-part3 — T2

**Topic:** Part 3 abstract questions band 6 vs band 8
**Save trigger:** PREP framework — Point Reason Example Personal.

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Band 6 vs Band 8 Part 3 abstract answers",
    "slug": "band6-vs-band8-part3"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}\"What's the role of art?\"{/P}\n6 vs {H}8 差距长这样{/H}",
      "sublabel": "⚠ Part 3 = 8 分门槛"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "笼统",
      "card_body": "{Y}Art is good. People like it. It makes us happy.{/Y}",
      "speech_bubble": "空洞！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "全是泛泛而谈",
      "reason2": "没例子",
      "reason3": "没个人立场"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "PREP 框架",
      "card_body": "{Y}Art serves as a vehicle for cultural transmission. By preserving traditions visually and emotionally, societies pass values to the next generation. The Lascaux cave paintings, for instance, still speak to our shared humanity. Personally, I see art as society's collective memory.{/Y}",
      "speech_bubble": "结构清晰！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Point 明确 (vehicle)",
      "reason2": "Reason + Example",
      "reason3": "Personal stance 收尾"
    },
    "slide6_cta": {
      "headline": "想做 Part 3\n{H}抽象题 AI 练习？{/H}"
    }
  }
}
```

---

## Post 31 — swap-very — T3

**Topic:** Say this instead of "very"
**Save trigger:** 3 precise adjective swaps for "very + weak word".

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of very",
    "slug": "swap-very"
  },
  "slides": {
    "slide1_hook": {
      "headline": "别再说 {P}very{/P}\n{H}7+ 不会用{/H}！",
      "sublabel": "⚠ 用 1 个精准词替换"
    },
    "slide2_upgrade1": {
      "headline": "{H}very important{/H}",
      "bad": "very important",
      "better": "important",
      "best": "crucial / vital",
      "context_note": "for needs and priorities",
      "speech_bubble": "用 crucial！"
    },
    "slide3_upgrade2": {
      "headline": "{H}very big{/H}",
      "bad": "very big",
      "better": "large",
      "best": "substantial / enormous",
      "context_note": "for numbers and amounts",
      "speech_bubble": "用 substantial！"
    },
    "slide4_upgrade3": {
      "headline": "{H}very dangerous{/H}",
      "bad": "very dangerous",
      "better": "dangerous",
      "best": "hazardous / perilous",
      "context_note": "for risks and threats",
      "speech_bubble": "用 hazardous！"
    },
    "slide5_summary": {
      "headline": "{H}1 精准 = 2 个 very{/H}",
      "tip1": "needs → crucial / vital",
      "tip2": "sizes → substantial / immense",
      "tip3": "risks → hazardous / dire",
      "card_body": "Replace {Y}very + weak adjective{/Y} with one strong word.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 标出\n{H}你写的所有 very？{/H}"
    }
  }
}
```

---

## Post 32 — swap-nowadays — T3

**Topic:** Stop opening essays with "Nowadays"
**Save trigger:** 3 sharper openers with time context.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of nowadays",
    "slug": "swap-nowadays"
  },
  "slides": {
    "slide1_hook": {
      "headline": "别再 {P}Nowadays{/P} 开头\n{H}考官看吐了{/H}！",
      "sublabel": "⚠ 3 个升级开头模板"
    },
    "slide2_upgrade1": {
      "headline": "{H}近几十年{/H}",
      "bad": "Nowadays...",
      "better": "These days...",
      "best": "In recent decades...",
      "context_note": "for long-term changes",
      "speech_bubble": "更精准！"
    },
    "slide3_upgrade2": {
      "headline": "{H}现代社会{/H}",
      "bad": "Nowadays...",
      "better": "In modern times...",
      "best": "In contemporary society...",
      "context_note": "for societal trends",
      "speech_bubble": "更学术！"
    },
    "slide4_upgrade3": {
      "headline": "{H}过去 20 年{/H}",
      "bad": "Nowadays...",
      "better": "Over the years...",
      "best": "Over the past two decades...",
      "context_note": "for measurable shifts",
      "speech_bubble": "精确时间！"
    },
    "slide5_summary": {
      "headline": "{H}永远不写 Nowadays{/H}",
      "tip1": "长期变化 → In recent decades",
      "tip2": "社会趋势 → In contemporary society",
      "tip3": "可量化 → Over the past 20 years",
      "card_body": "Be specific about the time frame + add the context word.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你的开头套话度？{/H}"
    }
  }
}
```

---

## Post 33 — swap-people — T3

**Topic:** Stop repeating "people"
**Save trigger:** 3 context-matched replacements.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of people",
    "slug": "swap-people"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}People{/P} 写 20 次\n{H}LR 永远 6{/H}！",
      "sublabel": "⚠ 按 context 换词"
    },
    "slide2_upgrade1": {
      "headline": "{H}政治 / 法律语境{/H}",
      "bad": "people",
      "better": "citizens",
      "best": "the public",
      "context_note": "for government essays",
      "speech_bubble": "citizens！"
    },
    "slide3_upgrade2": {
      "headline": "{H}个人 / 心理语境{/H}",
      "bad": "people",
      "better": "individuals",
      "best": "individuals",
      "context_note": "for behavior or psychology",
      "speech_bubble": "individuals！"
    },
    "slide4_upgrade3": {
      "headline": "{H}社区 / 社会语境{/H}",
      "bad": "people",
      "better": "communities",
      "best": "society / residents",
      "context_note": "for collective topics",
      "speech_bubble": "communities！"
    },
    "slide5_summary": {
      "headline": "{H}按 context 选词{/H}",
      "tip1": "Civic 话题 → citizens",
      "tip2": "Behavior → individuals",
      "tip3": "Collective → communities",
      "card_body": "Never use {Y}people{/Y} 3 times in one paragraph.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 标出\n{H}你的 people 重复？{/H}"
    }
  }
}
```

---

## Post 34 — swap-many — T3

**Topic:** Stop using "many"
**Save trigger:** 3 quantity-precise replacements.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of many",
    "slug": "swap-many"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Many{/P} 是 5 分量词\n{H}7+ 这样写{/H}！",
      "sublabel": "⚠ 量词也分 band"
    },
    "slide2_upgrade1": {
      "headline": "{H}学术语境{/H}",
      "bad": "many people",
      "better": "lots of people",
      "best": "numerous individuals",
      "context_note": "for formal essays",
      "speech_bubble": "numerous！"
    },
    "slide3_upgrade2": {
      "headline": "{H}强调数量{/H}",
      "bad": "many",
      "better": "a lot of",
      "best": "a substantial number of",
      "context_note": "for statistical force",
      "speech_bubble": "substantial！"
    },
    "slide4_upgrade3": {
      "headline": "{H}夸张语境{/H}",
      "bad": "many",
      "better": "so many",
      "best": "countless",
      "context_note": "for emotional emphasis",
      "speech_bubble": "countless！"
    },
    "slide5_summary": {
      "headline": "{H}3 个 many → 3 个不同{/H}",
      "tip1": "Academic → numerous",
      "tip2": "Statistical → a substantial number of",
      "tip3": "Emphatic → countless",
      "card_body": "Use {Y}widespread{/Y} for issues, {Y}numerous{/Y} for count, {Y}countless{/Y} for hyperbole.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 测\n{H}你的量词单一度？{/H}"
    }
  }
}
```

---

## Post 35 — swap-show — T3

**Topic:** Task 1 — stop using "shows"
**Save trigger:** 3 chart-specific verb replacements.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of show in Task 1",
    "slug": "swap-show"
  },
  "slides": {
    "slide1_hook": {
      "headline": "Task 1 {P}shows{/P} 5 次\n{H}上限就是 6 分{/H}！",
      "sublabel": "⚠ Task 1 动词轮换表"
    },
    "slide2_upgrade1": {
      "headline": "{H}图表呈现{/H}",
      "bad": "The chart shows",
      "better": "The chart presents",
      "best": "The chart illustrates / depicts",
      "context_note": "for opening sentence",
      "speech_bubble": "illustrates！"
    },
    "slide3_upgrade2": {
      "headline": "{H}数据揭示{/H}",
      "bad": "It shows",
      "better": "It reveals",
      "best": "It indicates / demonstrates",
      "context_note": "for analytical lines",
      "speech_bubble": "indicates！"
    },
    "slide4_upgrade3": {
      "headline": "{H}列举概括{/H}",
      "bad": "It shows",
      "better": "It displays",
      "best": "It outlines / sets out",
      "context_note": "for listing categories",
      "speech_bubble": "outlines！"
    },
    "slide5_summary": {
      "headline": "{H}动词轮换 8 个{/H}",
      "tip1": "Opener → illustrates / depicts",
      "tip2": "Analysis → indicates / reveals",
      "tip3": "List → outlines / displays",
      "card_body": "Use a different verb in each paragraph: {Y}illustrates → indicates → outlines → presents{/Y}.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检\n{H}你的 Task 1 动词重复？{/H}"
    }
  }
}
```

---

## Post 36 — swap-interesting — T3

**Topic:** Stop saying "interesting" in Speaking
**Save trigger:** 3 strength-matched replacements.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of interesting",
    "slug": "swap-interesting"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Interesting{/P} 5 次\n{H}Speaking 5.5{/H}！",
      "sublabel": "⚠ 3 个升级形容词"
    },
    "slide2_upgrade1": {
      "headline": "{H}思想层面{/H}",
      "bad": "interesting",
      "better": "fascinating",
      "best": "thought-provoking",
      "context_note": "for ideas, debates",
      "speech_bubble": "thought-provoking！"
    },
    "slide3_upgrade2": {
      "headline": "{H}故事吸引{/H}",
      "bad": "interesting",
      "better": "engaging",
      "best": "gripping / captivating",
      "context_note": "for films, novels",
      "speech_bubble": "gripping！"
    },
    "slide4_upgrade3": {
      "headline": "{H}论证有力{/H}",
      "bad": "interesting",
      "better": "intriguing",
      "best": "compelling",
      "context_note": "for arguments, evidence",
      "speech_bubble": "compelling！"
    },
    "slide5_summary": {
      "headline": "{H}强度配语境{/H}",
      "tip1": "Ideas → thought-provoking",
      "tip2": "Stories → gripping",
      "tip3": "Arguments → compelling",
      "card_body": "Match {Y}strength{/Y} of the word to the {Y}feeling{/Y} you mean.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你 Speaking 词汇多样性？{/H}"
    }
  }
}
```

---

## Post 37 — swap-good — T3

**Topic:** "Good" is useless in IELTS writing
**Save trigger:** 3 context-specific replacements.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of good",
    "slug": "swap-good"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Good{/P} 通篇出现\n{H}LR = 5{/H}！",
      "sublabel": "⚠ 按 context 换 good"
    },
    "slide2_upgrade1": {
      "headline": "{H}good idea{/H}",
      "bad": "a good idea",
      "better": "a smart idea",
      "best": "a sound idea",
      "context_note": "for plans, suggestions",
      "speech_bubble": "sound！"
    },
    "slide3_upgrade2": {
      "headline": "{H}good policy{/H}",
      "bad": "a good policy",
      "better": "a useful policy",
      "best": "an effective policy",
      "context_note": "for government / law",
      "speech_bubble": "effective！"
    },
    "slide4_upgrade3": {
      "headline": "{H}good person{/H}",
      "bad": "a good person",
      "better": "a nice person",
      "best": "a kind-hearted person",
      "context_note": "for character / Speaking",
      "speech_bubble": "kind-hearted！"
    },
    "slide5_summary": {
      "headline": "{H}Context 决定换什么{/H}",
      "tip1": "Idea → sound",
      "tip2": "Policy → effective",
      "tip3": "Person → kind-hearted",
      "card_body": "Never blanket-replace. Match the {Y}good{/Y} to its noun.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给\n{H}你 good 的替换建议？{/H}"
    }
  }
}
```

---

## Post 38 — swap-in-conclusion — T3

**Topic:** Stop opening conclusions with "In conclusion"
**Save trigger:** 3 band-8 conclusion openers.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of In conclusion",
    "slug": "swap-in-conclusion"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}In conclusion{/P}\n就是 {H}6 分结尾开头{/H}",
      "sublabel": "⚠ 3 个 8 分替换"
    },
    "slide2_upgrade1": {
      "headline": "{H}总结综合{/H}",
      "bad": "In conclusion",
      "better": "To sum up",
      "best": "On balance",
      "context_note": "for weighing both sides",
      "speech_bubble": "On balance！"
    },
    "slide3_upgrade2": {
      "headline": "{H}权衡论证{/H}",
      "bad": "In conclusion",
      "better": "To draw matters to a close",
      "best": "Weighing the arguments",
      "context_note": "for argument essays",
      "speech_bubble": "Weighing！"
    },
    "slide4_upgrade3": {
      "headline": "{H}考虑全局{/H}",
      "bad": "In conclusion",
      "better": "All things considered",
      "best": "In light of the above",
      "context_note": "for synthesizing essays",
      "speech_bubble": "In light of！"
    },
    "slide5_summary": {
      "headline": "{H}1 篇 1 个, 别重复{/H}",
      "tip1": "Both sides → On balance",
      "tip2": "Argument → Weighing the arguments",
      "tip3": "Synthesis → In light of the above",
      "card_body": "Each mock test use a {Y}different{/Y} opener.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的结尾词高级度？{/H}"
    }
  }
}
```

---

## Post 39 — swap-i-think — T3

**Topic:** Stop opening every sentence with "I think"
**Save trigger:** 3 opinion phrases for variety.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of I think",
    "slug": "swap-i-think"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}I think{/P} 每句\n{H}像 4 年级{/H}！",
      "sublabel": "⚠ 3 个观点表达升级"
    },
    "slide2_upgrade1": {
      "headline": "{H}个人立场{/H}",
      "bad": "I think",
      "better": "In my opinion",
      "best": "From my perspective",
      "context_note": "for personal stance",
      "speech_bubble": "From my perspective！"
    },
    "slide3_upgrade2": {
      "headline": "{H}论证语气{/H}",
      "bad": "I think",
      "better": "I believe",
      "best": "I would argue that",
      "context_note": "for argument essays",
      "speech_bubble": "I would argue！"
    },
    "slide4_upgrade3": {
      "headline": "{H}观察判断{/H}",
      "bad": "I think",
      "better": "It seems to me",
      "best": "It strikes me as",
      "context_note": "for nuanced views",
      "speech_bubble": "It strikes me！"
    },
    "slide5_summary": {
      "headline": "{H}1 篇 1-2 个就够{/H}",
      "tip1": "Stance → From my perspective",
      "tip2": "Argument → I would argue",
      "tip3": "Nuance → It strikes me as",
      "card_body": "Vary {Y}1-2 opinion phrases{/Y} per essay, not 6 \"I think\"s.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 测\n{H}你 I think 出现频率？{/H}"
    }
  }
}
```

---

## Post 40 — swap-advantages-disadvantages — T3

**Topic:** Stop repeating "advantages and disadvantages"
**Save trigger:** 3 paired pro/con upgrades.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of advantages/disadvantages",
    "slug": "swap-advantages-disadvantages"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Advantages / disadvantages{/P}\n出现 4 次 {H}扣分{/H}！",
      "sublabel": "⚠ 3 组替换搭配"
    },
    "slide2_upgrade1": {
      "headline": "{H}收益类{/H}",
      "bad": "advantages",
      "better": "good points",
      "best": "benefits / merits",
      "context_note": "for outcome-focused essays",
      "speech_bubble": "benefits！"
    },
    "slide3_upgrade2": {
      "headline": "{H}成本类{/H}",
      "bad": "disadvantages",
      "better": "bad points",
      "best": "drawbacks / pitfalls",
      "context_note": "for risk-focused essays",
      "speech_bubble": "drawbacks！"
    },
    "slide4_upgrade3": {
      "headline": "{H}平衡评估{/H}",
      "bad": "advantages and disadvantages",
      "better": "pros and cons",
      "best": "upsides and downsides / gains and costs",
      "context_note": "for balanced essays",
      "speech_bubble": "gains and costs！"
    },
    "slide5_summary": {
      "headline": "{H}每段换 1 组{/H}",
      "tip1": "Outcome → benefits / drawbacks",
      "tip2": "Argument → merits / pitfalls",
      "tip3": "Cost-benefit → gains / costs",
      "card_body": "Rotate so {Y}advantages{/Y} never appears twice in the same essay.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的同义替换熟练度？{/H}"
    }
  }
}
```

---

## Post 41 — swap-coin-two-sides — T3

**Topic:** Stop using "every coin has two sides" clichés
**Save trigger:** 3 sophisticated replacements.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of every coin has two sides",
    "slug": "swap-coin-two-sides"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Every coin has two sides{/P}\n考官 {H}秒扣 0.5{/H}！",
      "sublabel": "⚠ 3 个中式比喻禁用"
    },
    "slide2_upgrade1": {
      "headline": "{H}两面性{/H}",
      "bad": "Every coin has two sides",
      "better": "There are two sides to every story",
      "best": "This issue is multifaceted",
      "context_note": "for opening duality",
      "speech_bubble": "multifaceted！"
    },
    "slide3_upgrade2": {
      "headline": "{H}对立面{/H}",
      "bad": "Every rose has its thorn",
      "better": "Every benefit has a cost",
      "best": "There are competing considerations",
      "context_note": "for cost-benefit framing",
      "speech_bubble": "competing！"
    },
    "slide4_upgrade3": {
      "headline": "{H}耐心 / 时间{/H}",
      "bad": "Rome was not built in a day",
      "better": "Change takes time",
      "best": "Progress is incremental",
      "context_note": "for long-term arguments",
      "speech_bubble": "incremental！"
    },
    "slide5_summary": {
      "headline": "{H}不用比喻, 用概念词{/H}",
      "tip1": "Duality → multifaceted",
      "tip2": "Trade-offs → competing considerations",
      "tip3": "Time → incremental",
      "card_body": "Replace {Y}translated Chinese idioms{/Y} with abstract English concepts.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 标出\n{H}你写的中式比喻？{/H}"
    }
  }
}
```

---

## Post 42 — swap-things — T3

**Topic:** Stop saying "things"
**Save trigger:** 3 abstract noun replacements.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of things",
    "slug": "swap-things"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Things{/P} 出现\n{H}立刻不专业{/H}！",
      "sublabel": "⚠ 抽象名词替换"
    },
    "slide2_upgrade1": {
      "headline": "{H}原因 / 推手{/H}",
      "bad": "many things",
      "better": "many causes",
      "best": "numerous factors",
      "context_note": "for causal essays",
      "speech_bubble": "factors！"
    },
    "slide3_upgrade2": {
      "headline": "{H}构成 / 组件{/H}",
      "bad": "different things",
      "better": "different parts",
      "best": "different elements",
      "context_note": "for structural analysis",
      "speech_bubble": "elements！"
    },
    "slide4_upgrade3": {
      "headline": "{H}方面 / 维度{/H}",
      "bad": "good things",
      "better": "good parts",
      "best": "positive aspects",
      "context_note": "for evaluation",
      "speech_bubble": "aspects！"
    },
    "slide5_summary": {
      "headline": "{H}凡 things, 改概念词{/H}",
      "tip1": "Causes → factors",
      "tip2": "Parts → elements",
      "tip3": "Sides → aspects",
      "card_body": "Never write {Y}things / stuff{/Y} in Task 2.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 标出\n{H}你写的空洞词？{/H}"
    }
  }
}
```

---

## Post 43 — swap-kids — T3

**Topic:** Stop using "kids" in writing
**Save trigger:** 3 register-formal age nouns.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of kids",
    "slug": "swap-kids"
  },
  "slides": {
    "slide1_hook": {
      "headline": "写 {P}kids{/P} = {H}5 分{/H}！",
      "sublabel": "⚠ Kids 是口语词"
    },
    "slide2_upgrade1": {
      "headline": "{H}广义儿童{/H}",
      "bad": "kids",
      "better": "boys and girls",
      "best": "children",
      "context_note": "for general essays",
      "speech_bubble": "children！"
    },
    "slide3_upgrade2": {
      "headline": "{H}年轻一代{/H}",
      "bad": "kids these days",
      "better": "young people",
      "best": "the younger generation",
      "context_note": "for social trend topics",
      "speech_bubble": "younger generation！"
    },
    "slide4_upgrade3": {
      "headline": "{H}法律语境{/H}",
      "bad": "kids",
      "better": "young people",
      "best": "minors",
      "context_note": "for legal / policy topics",
      "speech_bubble": "minors！"
    },
    "slide5_summary": {
      "headline": "{H}写作 = 正式语域{/H}",
      "tip1": "General → children",
      "tip2": "Generational → the younger generation",
      "tip3": "Legal → minors",
      "card_body": "{Y}Kids{/Y} only in speaking. Never in Task 2.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检\n{H}你的语域错配？{/H}"
    }
  }
}
```

---

## Post 44 — swap-and — T3

**Topic:** Stop using only "and" to connect
**Save trigger:** 3 connector alternatives.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of and",
    "slug": "swap-and"
  },
  "slides": {
    "slide1_hook": {
      "headline": "一段 {P}5 个 and{/P}\n{H}LR = 5{/H}！",
      "sublabel": "⚠ And 替换方式"
    },
    "slide2_upgrade1": {
      "headline": "{H}添加 / 累加{/H}",
      "bad": "A and B",
      "better": "A, as well as B",
      "best": "A, in addition to B",
      "context_note": "for additive lists",
      "speech_bubble": "in addition to！"
    },
    "slide3_upgrade2": {
      "headline": "{H}伴随 / 并行{/H}",
      "bad": "A and B",
      "better": "A together with B",
      "best": "A coupled with B / alongside B",
      "context_note": "for parallel relationships",
      "speech_bubble": "coupled with！"
    },
    "slide4_upgrade3": {
      "headline": "{H}从句替换{/H}",
      "bad": "He worked and he studied",
      "better": "He worked while studying",
      "best": "He worked while pursuing his degree",
      "context_note": "for action chains",
      "speech_bubble": "用从句！"
    },
    "slide5_summary": {
      "headline": "{H}And 太多 = 改结构{/H}",
      "tip1": "List → as well as / in addition to",
      "tip2": "Parallel → coupled with / alongside",
      "tip3": "Sequence → while / by + -ing",
      "card_body": "Mix {Y}subordinate clauses{/Y} and {Y}semicolons{/Y} in too.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 标\n{H}你段落的 and 重复？{/H}"
    }
  }
}
```

---

## Post 45 — swap-it-is-x-to-do — T3

**Topic:** Stop with "It is important to..."
**Save trigger:** 3 ways to restructure modal sentences.

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of It is X to Y",
    "slug": "swap-it-is-x-to-do"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}It is important to...{/P}\n{H}模板英语{/H}！",
      "sublabel": "⚠ 3 种重构方式"
    },
    "slide2_upgrade1": {
      "headline": "{H}名词化{/H}",
      "bad": "It is important to study English.",
      "better": "Studying English is important.",
      "best": "Studying English is essential.",
      "context_note": "for tighter sentences",
      "speech_bubble": "前置 -ing！"
    },
    "slide3_upgrade2": {
      "headline": "{H}主语强化{/H}",
      "bad": "It is necessary to learn skills.",
      "better": "Learning skills is necessary.",
      "best": "Skill acquisition plays a vital role.",
      "context_note": "for academic tone",
      "speech_bubble": "Nominalize！"
    },
    "slide4_upgrade3": {
      "headline": "{H}更精准动词{/H}",
      "bad": "It is good to exercise.",
      "better": "Exercise is good.",
      "best": "There is a pressing need to exercise daily.",
      "context_note": "for urgent claims",
      "speech_bubble": "Pressing need！"
    },
    "slide5_summary": {
      "headline": "{H}3 种破模板{/H}",
      "tip1": "Nominalize → Studying X is essential",
      "tip2": "Strong subject → X plays a vital role",
      "tip3": "Urgent frame → There is a pressing need to",
      "card_body": "Break {Y}It is X to Y{/Y} with nominalization, real subject, or urgency.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的句型多样性？{/H}"
    }
  }
}
```

---

