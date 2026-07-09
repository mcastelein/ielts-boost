# Douyin Post Ideas — Full Text Expansion

**Author:** Agent 2 (full-copy writer)
**Source:** `outlines.md` (Agent 1's 56 outlines, T1–T7)
**Output:** Per-post 6-slide JSON ready for image-generation pipeline
**Format reference:** `drafts/01-speaking-part2-fluency/content.json`
**Markup:**
- `{P}...{/P}` purple highlight (numbers, key terms)
- `{H}...{/H}` primary accent / large highlight
- `{Y}...{/Y}` yellow underline on English example words

**Rules followed:** No em-dashes inside JSON values (commas, colons, or periods used instead). Cat speech bubbles short and in character. English examples IELTS-realistic at the band level shown. CTA slide always funnels to IELTSBoost.AI.

---

## Post 1 — gt-letter-tone-mistakes — T1

**Topic:** GT Letter tone mistakes
**Save trigger:** Formal / semi-formal / informal 一眼区分清单

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "GT Letter tone mistakes",
    "slug": "gt-letter-tone-mistakes"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}信件语气{/P}写错\n考官直接给 {H}5 分{/H}！",
      "sublabel": "⚠ GT 写作 3 个最致命的语气错配"
    },
    "slide2_error1": {
      "headline": "朋友信用{H}过度正式{/H}",
      "problem_desc": "写给好朋友却用 Dear Sir/Madam",
      "card_body": "{Y}Dear Sir/Madam{/Y}, I am writing to {Y}inform you{/Y} that I will be visiting you next month.",
      "speech_bubble": "他是你哥们！"
    },
    "slide3_error2": {
      "headline": "投诉信用{H}撒娇语气{/H}",
      "problem_desc": "感叹号加表情化的语气",
      "card_body": "The food was {Y}sooo bad!!{/Y} I was {Y}really really{/Y} upset and want my money back ASAP!!",
      "speech_bubble": "这是投诉！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "申请信{H}用缩写{/H}",
      "card_body": "{Y}I'm{/Y} writing to apply for the position. {Y}I've{/Y} attached my CV and {Y}can't{/Y} wait to hear from you.",
      "speech_bubble": "正式不缩！"
    },
    "slide5_fix": {
      "headline": "立刻{H}语气过关{/H}！",
      "icon1_label": "看关系",
      "icon2_label": "选模板",
      "icon3_label": "缩写规则",
      "card_body": "Friend: {Y}Hi Mark, hope you're well{/Y}. Manager: {Y}Dear Mr Smith, I am writing regarding{/Y}. Stranger: {Y}Dear Sir/Madam, I am writing to{/Y}.",
      "speech_bubble": "对号入座！"
    },
    "slide6_cta": {
      "headline": "想让 AI 圈出\n{H}你信里的语气错配？{/H}"
    }
  }
}
```

---

## Post 2 — task1-map-killers — T1

**Topic:** Task 1 map description killers
**Save trigger:** 地图题方位 + 时态速查卡

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Task 1 map description killers",
    "slug": "task1-map-killers"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}地图题{/P}这 3 个错\n直接卡 {H}5.5{/H}！",
      "sublabel": "⚠ 方位、时态、对比一个都不能错"
    },
    "slide2_error1": {
      "headline": "方位介词{H}用反了{/H}",
      "problem_desc": "in / to / on the south of 完全不一样",
      "card_body": "The new station was built {Y}in the south of{/Y} the town, near the river. (应该是 to the south)",
      "speech_bubble": "in 是内部！"
    },
    "slide3_error2": {
      "headline": "时态{H}前后打架{/H}",
      "problem_desc": "1990 用现在时, 2020 用过去时",
      "card_body": "In 1990 the area {Y}has{/Y} a small park. By 2020, several houses {Y}were built{/Y} on the same plot.",
      "speech_bubble": "都过去时！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "只描述{H}不对比{/H}",
      "card_body": "In 1990, there is a forest. {Y}In 2020, there are houses.{/Y} (两段独立, 没对比)",
      "speech_bubble": "对比起来！"
    },
    "slide5_fix": {
      "headline": "立刻{H}地图题过关{/H}！",
      "icon1_label": "方位",
      "icon2_label": "时态",
      "icon3_label": "对比",
      "card_body": "Use {Y}to the north of / in the centre / along the river{/Y}, lock past tense for old map and {Y}has been replaced by{/Y} for the change.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 批改\n{H}你的地图题？{/H}"
    }
  }
}
```

---

## Post 3 — task1-process-mistakes — T1

**Topic:** Task 1 process diagram mistakes
**Save trigger:** 流程图衔接词分级表

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Task 1 process diagram mistakes",
    "slug": "task1-process-mistakes"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}流程图{/P}用 10 个 then\n考官给你 {H}6 分{/H}！",
      "sublabel": "⚠ 这 3 个错让你的 process 永远过不了 7"
    },
    "slide2_error1": {
      "headline": "全程{H}then 和 and{/H}",
      "problem_desc": "衔接词全是小学生水平",
      "card_body": "The beans are picked, {Y}then{/Y} they are washed, {Y}then{/Y} dried, {Y}and then{/Y} roasted.",
      "speech_bubble": "换个词！"
    },
    "slide3_error2": {
      "headline": "工业流程用{H}主动{/H}",
      "problem_desc": "process 默认无人称, 必须被动",
      "card_body": "First, the workers {Y}heat{/Y} the metal. Then they {Y}pour{/Y} it into a mould and {Y}let{/Y} it cool.",
      "speech_bubble": "被动起来！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "漏掉{H}overview{/H}",
      "card_body": "(直接进 step 1) {Y}Firstly, the raw material is collected...{/Y} (没有总览句, TR 直接扣)",
      "speech_bubble": "总览呢？"
    },
    "slide5_fix": {
      "headline": "立刻{H}流程图过关{/H}！",
      "icon1_label": "被动",
      "icon2_label": "分级衔接",
      "icon3_label": "总览",
      "card_body": "Use passive throughout, swap then with {Y}subsequently / following this / at this stage{/Y}, and open with {Y}The process consists of X main stages{/Y}.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你的\n{H}流程图打分？{/H}"
    }
  }
}
```

---

## Post 4 — task1-multi-chart-errors — T1

**Topic:** Multi-chart comparison errors
**Save trigger:** 多图 integration 2 句公式

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Multi-chart comparison errors",
    "slug": "task1-multi-chart-errors"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}两张图{/P}写成两段\n{H}直接扣分{/H}！",
      "sublabel": "⚠ 多图题这 3 个错最常见"
    },
    "slide2_error1": {
      "headline": "两图{H}分开写{/H}",
      "problem_desc": "段 1 写图 A, 段 2 写图 B, 完全不对比",
      "card_body": "The first chart shows {Y}employment by sector{/Y}. The second chart shows {Y}education levels{/Y}. (两个独立小作文)",
      "speech_bubble": "对比在哪？"
    },
    "slide3_error2": {
      "headline": "Overview{H}只覆盖一图{/H}",
      "problem_desc": "总览句只总结了一张图",
      "card_body": "Overall, employment {Y}rose steadily across the decade{/Y}. (另一张图的核心趋势完全没提)",
      "speech_bubble": "另一张呢？"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "{H}堆数字{/H}没抓重点",
      "card_body": "In 2010 it was {Y}15%{/Y}, in 2012 {Y}18%{/Y}, in 2014 {Y}19%{/Y}, in 2016 {Y}21%{/Y}. (data dump, 没 standout)",
      "speech_bubble": "抓重点！"
    },
    "slide5_fix": {
      "headline": "立刻{H}多图过关{/H}！",
      "icon1_label": "整合 overview",
      "icon2_label": "交叉比较",
      "icon3_label": "Standout 数据",
      "card_body": "Overview: {Y}1 trend + 1 contrast{/Y} across both charts. Body: {Y}cross-reference{/Y} the two, not describe them in turn.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的多图整合度？{/H}"
    }
  }
}
```

---

## Post 5 — listening-s2-map-labels — T1

**Topic:** Listening Section 2 map labelling traps
**Save trigger:** 地图题方位听力词汇 + 预读 30 秒法

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Listening Section 2 map labelling traps",
    "slug": "listening-s2-map-labels"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Section 2{/P} 地图题\n听一半就{H}迷路{/H}！",
      "sublabel": "⚠ 这 3 个习惯让你方向感全乱"
    },
    "slide2_error1": {
      "headline": "不预读{H}方位词{/H}",
      "problem_desc": "音频一响才开始找北",
      "card_body": "(直接开听) Where is the cafeteria? {Y}It's just opposite the library, behind the main entrance...{/Y} (你还没定位起点)",
      "speech_bubble": "先看图！"
    },
    "slide3_error2": {
      "headline": "跟着说话人{H}走丢{/H}",
      "problem_desc": "说话人转方向, 你跟着旋转",
      "card_body": "If you turn left, you'll see... {Y}then on your right is...{/Y} (你已经把地图脑内转了 90 度)",
      "speech_bubble": "地图别转！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "漏听{H}方位连接词{/H}",
      "card_body": "{Y}opposite / next to / across from / just past{/Y} 一个没听到, 整题报废。",
      "speech_bubble": "盯方位词！"
    },
    "slide5_fix": {
      "headline": "立刻{H}地图题过关{/H}！",
      "icon1_label": "北朝上",
      "icon2_label": "起点定位",
      "icon3_label": "方位雷达",
      "card_body": "Lock north at top, mark the {Y}starting point{/Y} (we're at the main gate), scan for {Y}left / right / next to / opposite / behind{/Y}.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 训练\n{H}你的地图题？{/H}"
    }
  }
}
```

---

## Post 6 — reading-matching-headings-panic — T1

**Topic:** Reading matching headings panic moves
**Save trigger:** Heading 题 3 步排除法

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Reading matching headings panic moves",
    "slug": "reading-matching-headings-panic"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}配标题{/P}做 20 分钟\n还是 {H}错一半{/H}？",
      "sublabel": "⚠ 这 3 个习惯坑了 80% 的考生"
    },
    "slide2_error1": {
      "headline": "先读{H}headings 再找{/H}",
      "problem_desc": "脑子被 8 个 headings 塞满, 段落都没看就慌",
      "card_body": "Reading headings: {Y}i. The role of...{/Y} {Y}ii. Why scientists...{/Y} (然后回到段落已经懵了)",
      "speech_bubble": "先看段落！"
    },
    "slide3_error2": {
      "headline": "按{H}选项顺序{/H}匹配",
      "problem_desc": "headings 顺序和段落顺序无关",
      "card_body": "Paragraph A becomes heading i, Paragraph B becomes heading ii... ({Y}wrong, headings are scrambled on purpose{/Y})",
      "speech_bubble": "顺序是陷阱！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "看到{H}关键词就选{/H}",
      "card_body": "Paragraph mentions {Y}'climate'{/Y} once, you pick the heading with {Y}'climate'{/Y}. (主题不是 climate, 只是举例)",
      "speech_bubble": "看主旨！"
    },
    "slide5_fix": {
      "headline": "立刻{H}heading 过关{/H}！",
      "icon1_label": "速读首末",
      "icon2_label": "自总结",
      "icon3_label": "排除法",
      "card_body": "Skim {Y}first and last sentence{/Y}, summarise in your own words, then pick the closest heading and {Y}cross it off{/Y}.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 训练\n{H}你的 heading 题？{/H}"
    }
  }
}
```

---

## Post 7 — th-sound-killer — T1

**Topic:** /θ/ /ð/ 中国学生通病
**Save trigger:** /θ/ /ð/ 发音口型 3 步

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "TH sound pronunciation killer",
    "slug": "th-sound-killer"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}think{/P} 说成 sink\n口语 {H}扣 0.5{/H}！",
      "sublabel": "⚠ 这 3 个 TH 错误考官一秒识破"
    },
    "slide2_error1": {
      "headline": "think 发成{H}sink{/H}",
      "problem_desc": "无声 TH 变成 s",
      "card_body": "I {Y}sink{/Y} we should talk about {Y}sree{/Y} important {Y}sings{/Y}.",
      "speech_bubble": "舌头出来！"
    },
    "slide3_error2": {
      "headline": "this 发成{H}dis{/H}",
      "problem_desc": "有声 TH 变成 d",
      "card_body": "{Y}Dis{/Y} is {Y}da{/Y} reason why {Y}dey{/Y} disagree with us.",
      "speech_bubble": "咬轻一点！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "month 发成{H}mons{/H}",
      "card_body": "Last {Y}mons{/Y}, my {Y}bro{/Y} and I went to a place wi{Y}s{/Y} a lot of museums.",
      "speech_bubble": "尾音咬舌！"
    },
    "slide5_fix": {
      "headline": "立刻{H}TH 过关{/H}！",
      "icon1_label": "舌尖咬牙",
      "icon2_label": "送气 vs 振动",
      "icon3_label": "镜子练",
      "card_body": "Tongue tip lightly between teeth. {Y}Think / three / through / thank{/Y} use breath only. {Y}This / that / they / there{/Y} use voice.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 测\n{H}你的单音问题？{/H}"
    }
  }
}
```

---

## Post 8 — speaking-too-formal — T1

**Topic:** Speaking 用书面语反而扣分
**Save trigger:** 口语 / 书面语对照表

```json
{
  "post_meta": {
    "template": "T1",
    "topic": "Speaking too formal register",
    "slug": "speaking-too-formal"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}口语{/P}用书面语\n反而 {H}扣分{/H}！",
      "sublabel": "⚠ Furthermore / Nevertheless 在 Speaking 是雷"
    },
    "slide2_error1": {
      "headline": "Speaking 用{H}Furthermore{/H}",
      "problem_desc": "学术连接词读出来像背稿",
      "card_body": "I really enjoy cooking. {Y}Furthermore{/Y}, it helps me relax after a long day.",
      "speech_bubble": "太书面！"
    },
    "slide3_error2": {
      "headline": "{H}It is widely{/H} believed that",
      "problem_desc": "口语里突然冒出 Task 2 套话",
      "card_body": "Do I like my hometown? {Y}It is widely believed that{/Y} living in a small city has many benefits.",
      "speech_bubble": "不是演讲！"
    },
    "slide4_error3": {
      "pill_label": "错误③",
      "headline": "用{H}Nevertheless{/H}",
      "card_body": "My job is stressful. {Y}Nevertheless{/Y}, I find it rewarding.",
      "speech_bubble": "说 but 就好！"
    },
    "slide5_fix": {
      "headline": "立刻{H}口语自然{/H}！",
      "icon1_label": "口语连接",
      "icon2_label": "口语开场",
      "icon3_label": "口语转折",
      "card_body": "Use {Y}plus / on top of that{/Y} for addition, {Y}actually / to be honest{/Y} for opinion, {Y}but here's the thing / that said{/Y} for contrast.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你的语体匹配？{/H}"
    }
  }
}
```

---

## Post 9 — band6-vs-8-task2-hook — T2

**Topic:** Task 2 hook sentence: 6 vs 8
**Save trigger:** 5 个 8 分级开头句式

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Task 2 hook sentence 6 vs 8",
    "slug": "band6-vs-8-task2-hook"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}第 1 句{/P}定生死\n6 vs {H}8 分{/H}差这里！",
      "sublabel": "⚠ 改开头 1 句, 印象分立刻拉满"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "原 hook",
      "card_body": "{Y}Nowadays, education is very important. Some people think it should be free.{/Y}",
      "speech_bubble": "套话！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "Nowadays 是万能模板",
      "reason2": "'important' 太空",
      "reason3": "没有 stakes 没有张力"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "升级 hook",
      "card_body": "{Y}Few areas of contemporary policy provoke as much debate as the structure of compulsory schooling, and the question of who should pay for it lies at the heart of that debate.{/Y}",
      "speech_bubble": "张力来了！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Stake: 政策利害",
      "reason2": "Specificity: compulsory schooling",
      "reason3": "Tension: debate 直接点出"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你的开头有没有 stakes？{/H}"
    }
  }
}
```

---

## Post 10 — band6-vs-8-reading-skim — T2

**Topic:** Reading skim quality: 6 vs 8
**Save trigger:** 90-秒 skim 路线图

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Reading skim 6 vs 8",
    "slug": "band6-vs-8-reading-skim"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}速读{/P}方式\n6 vs {H}8 分差这么大{/H}！",
      "sublabel": "⚠ 同一篇 Reading, 节奏完全不同"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "6 分做法",
      "card_body": "从第 1 个词开始 {Y}逐字读{/Y}, 遇到生词停下来想中文意思, {Y}5 分钟才读完一段{/Y}, 题还没看。",
      "speech_bubble": "太慢了！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "脑子装内容不装索引",
      "reason2": "生词导致节奏崩",
      "reason3": "时间分配失控"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "8 分做法",
      "card_body": "90 秒内: {Y}title, first paragraph, each topic sentence, conclusion{/Y}, 在脑里搭一个 {Y}骨架地图{/Y}, 再回去做题逐个 locate。",
      "speech_bubble": "先骨架！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Skeleton first, details later",
      "reason2": "结构在脑里, 定位秒回",
      "reason3": "生词不影响节奏"
    },
    "slide6_cta": {
      "headline": "想让 AI 训练\n{H}你的速读路径？{/H}"
    }
  }
}
```

---

## Post 11 — band6-vs-8-listening-notes — T2

**Topic:** Listening note-taking: 6 vs 8
**Save trigger:** 8 分笔记 5-symbol 系统

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Listening notes 6 vs 8",
    "slug": "band6-vs-8-listening-notes"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}笔记法{/P}决定\nListening {H}6 vs 8{/H}！",
      "sublabel": "⚠ 一题 5 个符号 vs 抄一整句"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "6 分笔记",
      "card_body": "{Y}The student says the deadline is on Friday{/Y} (抄完整英文加中文翻译, 下一题已经过了)",
      "speech_bubble": "抄不动！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "脑子在抄写不在听",
      "reason2": "翻译耗光带宽",
      "reason3": "错过下一题关键词"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "8 分笔记",
      "card_body": "{Y}DDL → Fri{/Y} (5 个字符, 耳朵已经开始听下一题)",
      "speech_bubble": "极简！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Keyword + arrow + symbol",
      "reason2": "5 个符号一题封顶",
      "reason3": "耳朵永远在前线"
    },
    "slide6_cta": {
      "headline": "想让 AI 教\n{H}你的笔记系统？{/H}"
    }
  }
}
```

---

## Post 12 — band6-vs-8-cue-card-structure — T2

**Topic:** Speaking Part 2 cue card structure: 6 vs 8
**Save trigger:** 8 分讲故事 4 元素

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Part 2 cue card structure 6 vs 8",
    "slug": "band6-vs-8-cue-card-structure"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Cue card{/P}\n6 分按 bullet, {H}8 分讲故事{/H}！",
      "sublabel": "⚠ Bullets 是脚手架不是答案"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "6 分答法",
      "card_body": "{Y}I want to talk about a trip. It was last year. I went with my friend. We went to Beijing. It was good because I liked the food.{/Y}",
      "speech_bubble": "在打勾！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "机械按 bullet 顺序",
      "reason2": "没有场景没有人物",
      "reason3": "没有反思没有张力"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "8 分答法",
      "card_body": "{Y}So this trip I'm thinking of was last September, just after I'd finished my finals, and honestly I needed to disappear for a bit. My friend Lin showed up with two train tickets to Beijing, no plan, and that's how the whole thing started...{/Y}",
      "speech_bubble": "故事感来了！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Scene-setting: 时间加心境",
      "reason2": "Character: 朋友 Lin 出现",
      "reason3": "Tension 加 reflection"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的 Part 2 故事感？{/H}"
    }
  }
}
```

---

## Post 13 — band6-vs-8-letter-opening — T2

**Topic:** GT Letter opening: 6 vs 8
**Save trigger:** 3 类信件开头公式

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "GT letter opening 6 vs 8",
    "slug": "band6-vs-8-letter-opening"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}I am writing to...{/P}\n是 {H}6 分开头{/H}！",
      "sublabel": "⚠ 看 8 分怎么打开一封信"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "6 分开头",
      "card_body": "{Y}I am writing to inform you about a problem. I bought something from your shop and it is broken.{/Y}",
      "speech_bubble": "太空！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "目的太笼统",
      "reason2": "没有具体引用",
      "reason3": "语气没拿稳"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "8 分开头",
      "card_body": "{Y}I am writing to express my serious concern regarding a faulty laptop (order #A2841) that I purchased from your Brighton branch on 12 May, which stopped working within 48 hours.{/Y}",
      "speech_bubble": "信息密度！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Purpose 具体到 concern",
      "reason2": "Reference: 订单号加日期",
      "reason3": "Tone setter: serious"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你的信件 register？{/H}"
    }
  }
}
```

---

## Post 14 — band6-vs-8-work-study — T2

**Topic:** Speaking Part 1 work/study: 6 vs 8
**Save trigger:** 25-秒 work/study 高分模板

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Part 1 work or study 6 vs 8",
    "slug": "band6-vs-8-work-study"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}第 1 题{/P} work or study\n就分 {H}6 和 8{/H}！",
      "sublabel": "⚠ 每场必考, 你答得最敷衍"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "6 分答法",
      "card_body": "{Y}I am a student. I study English at university. I like it.{/Y} (8 秒答完, 考官没东西可问)",
      "speech_bubble": "太短了！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "没有专业加学校细节",
      "reason2": "没有当下状态",
      "reason3": "没有引导后续话题"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "8 分答法",
      "card_body": "{Y}I'm in my final year of econ at a uni in Chengdu, and most of my time these days actually goes into writing my dissertation, which is on green finance, so it's been pretty full-on.{/Y}",
      "speech_bubble": "细节炸裂！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Direct answer 加 specifics",
      "reason2": "Current state hook (dissertation)",
      "reason3": "Topic 自然延伸 (green finance)"
    },
    "slide6_cta": {
      "headline": "想让 AI 改写\n{H}你的 Part 1 答案？{/H}"
    }
  }
}
```

---

## Post 15 — band6-vs-8-v-w-sound — T2

**Topic:** Pronunciation /v/ vs /w/: 6 vs 8
**Save trigger:** /v/ /w/ minimal pairs 训练表

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Pronunciation v vs w 6 vs 8",
    "slug": "band6-vs-8-v-w-sound"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}very{/P} 说成 wery\n考官打 {H}6 分{/H}！",
      "sublabel": "⚠ /v/ /w/ 不分是中国考生标志"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "6 分发音",
      "card_body": "I would {Y}wery{/Y} much like to {Y}wisit{/Y} my friend in the {Y}willage{/Y} next week.",
      "speech_bubble": "嘴型错！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "上下唇没咬合",
      "reason2": "声带没振动",
      "reason3": "high-freq 词 (very, visit) 全错"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "8 分发音",
      "card_body": "I would {Y}very{/Y} much like to {Y}visit{/Y} my friend in the {Y}village{/Y} next week. (上齿咬下唇加振动)",
      "speech_bubble": "清楚了！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "/v/ 上齿轻咬下唇加振动",
      "reason2": "/w/ 嘴唇圆起不咬",
      "reason3": "Minimal pair 区分清晰"
    },
    "slide6_cta": {
      "headline": "想让 AI 测\n{H}你的 /v/ /w/ 对比？{/H}"
    }
  }
}
```

---

## Post 16 — band6-vs-8-paragraph-match — T2

**Topic:** Reading paragraph matching: 6 vs 8 method
**Save trigger:** Paraphrase 雷达扫描表

```json
{
  "post_meta": {
    "template": "T2",
    "topic": "Reading paragraph matching 6 vs 8",
    "slug": "band6-vs-8-paragraph-match"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}信息段落配对{/P}\n6 凭关键词, {H}8 抓 paraphrase{/H}！",
      "sublabel": "⚠ 最难题型, 思路差 1 个 band"
    },
    "slide2_band6": {
      "pill_label": "Band 6",
      "headline": "6 分思路",
      "card_body": "Question 提到 {Y}education{/Y}, 找段落里出现 {Y}'education'{/Y} 的那一段, 直接选。 (问的是 'literacy programmes' 不是 education)",
      "speech_bubble": "字面陷阱！"
    },
    "slide3_why_weak": {
      "headline": "{H}为什么弱{/H}",
      "reason1": "字面匹配关键词",
      "reason2": "没识别同义改写",
      "reason3": "考官就靠这个区分分数"
    },
    "slide4_band8": {
      "pill_label": "Band 8",
      "headline": "8 分思路",
      "card_body": "Question 提到 education, 扫描 {Y}schooling / instruction / pedagogy / literacy programmes / classroom-based learning{/Y} 等同义改写, 找概念匹配的段落。",
      "speech_bubble": "概念匹配！"
    },
    "slide5_why_strong": {
      "headline": "{H}为什么强{/H}",
      "reason1": "Paraphrase ear 训练",
      "reason2": "同义词组归类",
      "reason3": "概念 > 字面"
    },
    "slide6_cta": {
      "headline": "想让 AI 训练\n{H}你的 paraphrase 雷达？{/H}"
    }
  }
}
```

---

## Post 17 — swap-society — T3

**Topic:** Say this instead of "society"
**Save trigger:** 6 个 society 精确替换

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of society",
    "slug": "swap-society"
  },
  "slides": {
    "slide1_hook": {
      "headline": "别再写 {P}society{/P}\n{H}LR 卡在 6{/H}！",
      "sublabel": "⚠ 整篇 society, 考官懒得读"
    },
    "slide2_upgrade1": {
      "headline": "{H}society{/H} 谈治理时",
      "bad": "Society needs better laws.",
      "better": "The public needs better laws.",
      "best": "Civic life depends on robust legal frameworks.",
      "context_note": "for governance and institutions",
      "speech_bubble": "用 civic life！"
    },
    "slide3_upgrade2": {
      "headline": "{H}society{/H} 谈本地",
      "bad": "Society in small towns is changing.",
      "better": "Local society is changing.",
      "best": "Rural communities are undergoing rapid change.",
      "context_note": "for local and regional issues",
      "speech_bubble": "用 communities！"
    },
    "slide4_upgrade3": {
      "headline": "{H}society{/H} 谈当代",
      "bad": "Society today is busy.",
      "better": "Society nowadays is fast-paced.",
      "best": "Contemporary culture is increasingly defined by speed.",
      "context_note": "for modern lifestyle",
      "speech_bubble": "用 contemporary culture！"
    },
    "slide5_summary": {
      "headline": "{H}3 个精准 = 10 个 society{/H}",
      "tip1": "治理 → civic life",
      "tip2": "本地 → communities",
      "tip3": "现代 → contemporary culture",
      "card_body": "Match the {Y}scope{/Y}, drop the generic word.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 圈出\n{H}你写的所有 society？{/H}"
    }
  }
}
```

---

## Post 18 — swap-problem — T3

**Topic:** Say this instead of "problem"
**Save trigger:** 6 个 problem 精确替换

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of problem",
    "slug": "swap-problem"
  },
  "slides": {
    "slide1_hook": {
      "headline": "每段 {P}problem{/P}\n=  {H}5 分写作{/H}！",
      "sublabel": "⚠ 3 个精准词替换 problem"
    },
    "slide2_upgrade1": {
      "headline": "{H}problem{/H} 谈机遇语境",
      "bad": "This is a big problem for students.",
      "better": "This is an issue for students.",
      "best": "This presents a significant challenge for students.",
      "context_note": "for opportunity-framed contexts",
      "speech_bubble": "用 challenge！"
    },
    "slide3_upgrade2": {
      "headline": "{H}problem{/H} 谈障碍",
      "bad": "There is a problem in finding jobs.",
      "better": "There is a difficulty in finding jobs.",
      "best": "Job seekers face significant obstacles.",
      "context_note": "for blockers and barriers",
      "speech_bubble": "用 obstacles！"
    },
    "slide4_upgrade3": {
      "headline": "{H}problem{/H} 谈严重困境",
      "bad": "Cities have a serious problem.",
      "better": "Cities face a serious issue.",
      "best": "Many cities find themselves in a worsening predicament.",
      "context_note": "for severe situations",
      "speech_bubble": "用 predicament！"
    },
    "slide5_summary": {
      "headline": "{H}Scale 决定选词{/H}",
      "tip1": "机遇 → challenge",
      "tip2": "障碍 → obstacle / drawback",
      "tip3": "严重 → predicament",
      "card_body": "Match {Y}scale and tone{/Y}, not just synonyms.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你的 problem 频率？{/H}"
    }
  }
}
```

---

## Post 19 — swap-help — T3

**Topic:** Say this instead of "help"
**Save trigger:** 6 个 help 替换 + 搭配

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Say this instead of help",
    "slug": "swap-help"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}help people{/P} 是 5 分\n{H}7+ 这样换{/H}！",
      "sublabel": "⚠ 3 个 help 升级搭配"
    },
    "slide2_upgrade1": {
      "headline": "{H}help{/H} 谈流程",
      "bad": "Technology helps learning.",
      "better": "Technology supports learning.",
      "best": "Technology facilitates personalised learning.",
      "context_note": "for processes and systems",
      "speech_bubble": "用 facilitate！"
    },
    "slide3_upgrade2": {
      "headline": "{H}help{/H} 谈赋能",
      "bad": "The internet helps small business.",
      "better": "The internet supports small business.",
      "best": "The internet enables small businesses to reach global markets.",
      "context_note": "for empowerment",
      "speech_bubble": "用 enable！"
    },
    "slide4_upgrade3": {
      "headline": "{H}help{/H} 谈贡献",
      "bad": "Volunteering helps the community.",
      "better": "Volunteering benefits the community.",
      "best": "Volunteering contributes meaningfully to community wellbeing.",
      "context_note": "for contribution",
      "speech_bubble": "用 contribute to！"
    },
    "slide5_summary": {
      "headline": "{H}匹配 help 的对象{/H}",
      "tip1": "流程 → facilitate",
      "tip2": "赋能 → enable",
      "tip3": "贡献 → contribute to",
      "card_body": "Pick by {Y}who is being helped how{/Y}, not just register.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你的 help 重复？{/H}"
    }
  }
}
```

---

## Post 20 — swap-study-speaking — T3

**Topic:** Speaking 别再 study study 了
**Save trigger:** 6 个 study 口语级替换

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Speaking swap for study",
    "slug": "swap-study-speaking"
  },
  "slides": {
    "slide1_hook": {
      "headline": "Speaking 5 次 {P}study{/P}\nLR {H}上不去{/H}！",
      "sublabel": "⚠ 3 个口语级 study 替换"
    },
    "slide2_upgrade1": {
      "headline": "{H}study for an exam{/H}",
      "bad": "I study for my IELTS.",
      "better": "I revise for my IELTS.",
      "best": "I've been cramming for my IELTS the past week.",
      "context_note": "for intense exam prep",
      "speech_bubble": "用 cram for！"
    },
    "slide3_upgrade2": {
      "headline": "{H}study a topic{/H}",
      "bad": "I like to study history.",
      "better": "I like to look into history.",
      "best": "I love digging into Roman history in my free time.",
      "context_note": "for topic exploration",
      "speech_bubble": "用 dig into！"
    },
    "slide4_upgrade3": {
      "headline": "{H}study a skill{/H}",
      "bad": "I need to study English again.",
      "better": "I need to go over my English again.",
      "best": "I'm brushing up on my English before the trip.",
      "context_note": "for refreshing rusty skills",
      "speech_bubble": "用 brush up on！"
    },
    "slide5_summary": {
      "headline": "{H}按 activity 选词{/H}",
      "tip1": "考试 → cram for",
      "tip2": "话题 → dig into",
      "tip3": "技能 → brush up on",
      "card_body": "Speaking values {Y}natural collocations{/Y} over fancy synonyms.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的口语词汇多样性？{/H}"
    }
  }
}
```

---

## Post 21 — swap-environment-words — T3

**Topic:** Environment topic vocabulary upgrade
**Save trigger:** 环境话题词汇升级矩阵

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Environment vocab upgrade",
    "slug": "swap-environment-words"
  },
  "slides": {
    "slide1_hook": {
      "headline": "环境只会 {P}pollution{/P}\n卡 {H}6 分{/H}！",
      "sublabel": "⚠ 3 个环境话题升级搭配"
    },
    "slide2_upgrade1": {
      "headline": "{H}environmental damage{/H}",
      "bad": "Environmental damage is growing.",
      "better": "Environmental harm is worsening.",
      "best": "Ecological degradation has accelerated over the past decade.",
      "context_note": "for long-term harm",
      "speech_bubble": "用 ecological degradation！"
    },
    "slide3_upgrade2": {
      "headline": "{H}pollution{/H}",
      "bad": "Factories cause pollution.",
      "better": "Factories produce contamination.",
      "best": "Industrial emissions are a leading source of urban contamination.",
      "context_note": "for industrial pollution",
      "speech_bubble": "用 emissions！"
    },
    "slide4_upgrade3": {
      "headline": "{H}save animals{/H}",
      "bad": "We must save animals.",
      "better": "We must protect wildlife.",
      "best": "Preserving biodiversity must be a global priority.",
      "context_note": "for ecosystems and species",
      "speech_bubble": "用 biodiversity！"
    },
    "slide5_summary": {
      "headline": "{H}领域词 > 通用词{/H}",
      "tip1": "damage → ecological degradation",
      "tip2": "pollution → emissions / contamination",
      "tip3": "save animals → preserve biodiversity",
      "card_body": "Drop the generic, pick the {Y}field-specific{/Y} term.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你\n{H}环境话题词包？{/H}"
    }
  }
}
```

---

## Post 22 — swap-education-words — T3

**Topic:** Education topic vocabulary upgrade
**Save trigger:** 教育话题词汇升级矩阵

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Education vocab upgrade",
    "slug": "swap-education-words"
  },
  "slides": {
    "slide1_hook": {
      "headline": "教育只会 {P}student / teach{/P}\n{H}7 分上不去{/H}！",
      "sublabel": "⚠ 3 个教育话题升级搭配"
    },
    "slide2_upgrade1": {
      "headline": "{H}student{/H}",
      "bad": "Students need more support.",
      "better": "Learners need more support.",
      "best": "Undergraduates often require targeted academic mentoring.",
      "context_note": "pupils for K-12, undergrads for uni",
      "speech_bubble": "用 undergraduates！"
    },
    "slide3_upgrade2": {
      "headline": "{H}learn{/H}",
      "bad": "Children learn languages fast.",
      "better": "Children acquire languages fast.",
      "best": "Young learners internalise grammatical patterns at remarkable speed.",
      "context_note": "for deep cognitive learning",
      "speech_bubble": "用 internalise！"
    },
    "slide4_upgrade3": {
      "headline": "{H}teach{/H}",
      "bad": "Teachers teach values.",
      "better": "Teachers impart values.",
      "best": "Effective educators mentor students well beyond the curriculum.",
      "context_note": "for guidance and formation",
      "speech_bubble": "用 mentor！"
    },
    "slide5_summary": {
      "headline": "{H}匹配 register + age group{/H}",
      "tip1": "student → undergraduate / pupil",
      "tip2": "learn → internalise / acquire",
      "tip3": "teach → mentor / impart",
      "card_body": "Choose by {Y}who is learning what{/Y}.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你\n{H}教育话题词包？{/H}"
    }
  }
}
```

---

## Post 23 — swap-technology-words — T3

**Topic:** Technology topic vocabulary upgrade
**Save trigger:** 科技话题升级矩阵

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Technology vocab upgrade",
    "slug": "swap-technology-words"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Technology is good{/P}\n是 {H}5 分级写法{/H}！",
      "sublabel": "⚠ 3 个科技话题升级搭配"
    },
    "slide2_upgrade1": {
      "headline": "{H}technology{/H}",
      "bad": "Technology has changed our lives.",
      "better": "New technology has changed our lives.",
      "best": "Digital tools have reshaped daily routines across nearly every sector.",
      "context_note": "for everyday digital tech",
      "speech_bubble": "用 digital tools！"
    },
    "slide3_upgrade2": {
      "headline": "{H}use technology{/H}",
      "bad": "Companies use new technology.",
      "better": "Companies adopt new technology.",
      "best": "Forward-looking firms leverage AI to streamline their operations.",
      "context_note": "for strategic adoption",
      "speech_bubble": "用 leverage！"
    },
    "slide4_upgrade3": {
      "headline": "{H}convenient{/H}",
      "bad": "Apps make life convenient.",
      "better": "Apps make life easier.",
      "best": "Modern apps deliver a remarkably seamless user experience.",
      "context_note": "for digital UX",
      "speech_bubble": "用 seamless！"
    },
    "slide5_summary": {
      "headline": "{H}行业内行词{/H}",
      "tip1": "technology → digital tools",
      "tip2": "use → leverage / adopt",
      "tip3": "convenient → seamless / streamlined",
      "card_body": "Sound like someone {Y}inside the field{/Y}, not outside it.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你\n{H}科技话题词包？{/H}"
    }
  }
}
```

---

## Post 24 — swap-health-words — T3

**Topic:** Health topic vocabulary upgrade
**Save trigger:** 健康话题升级矩阵

```json
{
  "post_meta": {
    "template": "T3",
    "topic": "Health vocab upgrade",
    "slug": "swap-health-words"
  },
  "slides": {
    "slide1_hook": {
      "headline": "健康只会 {P}healthy / hospital{/P}\n{H}LR 卡 6{/H}！",
      "sublabel": "⚠ 3 个健康话题升级搭配"
    },
    "slide2_upgrade1": {
      "headline": "{H}healthy{/H}",
      "bad": "Exercise keeps you healthy.",
      "better": "Exercise keeps you fit.",
      "best": "Regular exercise has a measurable impact on long-term well-being.",
      "context_note": "for holistic wellness",
      "speech_bubble": "用 well-being！"
    },
    "slide3_upgrade2": {
      "headline": "{H}sick{/H}",
      "bad": "Many people are sick today.",
      "better": "Many people are unwell today.",
      "best": "A growing number of adults suffer from chronic conditions.",
      "context_note": "for academic register",
      "speech_bubble": "用 suffer from！"
    },
    "slide4_upgrade3": {
      "headline": "{H}doctor / hospital{/H}",
      "bad": "Doctors at the hospital are busy.",
      "better": "Doctors at the clinic are busy.",
      "best": "Physicians at major healthcare facilities are increasingly overstretched.",
      "context_note": "for systemic professional context",
      "speech_bubble": "用 physician！"
    },
    "slide5_summary": {
      "headline": "{H}从口语到学术 register{/H}",
      "tip1": "healthy → well-being / fitness",
      "tip2": "sick → suffer from / unwell",
      "tip3": "doctor → physician / medical professional",
      "card_body": "Move from {Y}casual nouns{/Y} into academic register.",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你\n{H}健康话题词包？{/H}"
    }
  }
}
```

---

## Post 25 — fix-task1-pie-chart — T4

**Topic:** Fix this Task 1 pie chart paragraph
**Save trigger:** 饼图比例 + 对比词包

```json
{
  "post_meta": {
    "template": "T4",
    "topic": "Fix Task 1 pie chart paragraph",
    "slug": "fix-task1-pie-chart"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}饼图{/P}写成列百分比\n看 {H}7+ 怎么改{/H}！",
      "sublabel": "⚠ 真实学生段落到高分版本"
    },
    "slide2_original": {
      "pill_label": "Band 6",
      "headline": "原段落",
      "card_body": "{Y}Cars made up 45%. Buses made up 22%. Bikes made up 18%. Trains made up 10%. Other was 5%.{/Y}",
      "speech_bubble": "纯列举！"
    },
    "slide3_problems": {
      "headline": "{H}3 个问题{/H}",
      "issue1": "全是 made up 加数字, 没分组",
      "issue2": "没说哪个是 standout",
      "issue3": "缺比较语言 (twice / nearly half)"
    },
    "slide4_improved": {
      "pill_label": "Band 7+",
      "headline": "改写段落",
      "card_body": "{Y}Cars dominated the modal split at 45%, accounting for nearly half of all journeys, while buses and bikes together made up a further 40%. Trains and other modes played only a marginal role, jointly representing just 15%.{/Y}",
      "speech_bubble": "分组加对比！"
    },
    "slide5_key_changes": {
      "headline": "{H}3 个关键改动{/H}",
      "change1": "动词升级: dominated / accounting for",
      "change2": "分组: 把相近的合并",
      "change3": "比较: nearly half / marginal"
    },
    "slide6_cta": {
      "headline": "想让 AI 改\n{H}你的饼图段落？{/H}"
    }
  }
}
```

---

## Post 26 — fix-task1-bar-multi-year — T4

**Topic:** Fix this Task 1 bar chart with multiple years
**Save trigger:** 时间轴 trend 表达模板

```json
{
  "post_meta": {
    "template": "T4",
    "topic": "Fix Task 1 multi-year bar chart",
    "slug": "fix-task1-bar-multi-year"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}5 年柱图{/P}写成 5 段\n看 {H}7+ 怎么改{/H}！",
      "sublabel": "⚠ 流水账段落变成趋势型段落"
    },
    "slide2_original": {
      "pill_label": "Band 6",
      "headline": "原段落",
      "card_body": "{Y}In 2018 sales were 20. In 2019 sales were 24. In 2020 sales were 30. In 2021 sales were 35. In 2022 sales were 38.{/Y}",
      "speech_bubble": "year by year！"
    },
    "slide3_problems": {
      "headline": "{H}3 个问题{/H}",
      "issue1": "没有 trend 概括",
      "issue2": "没指出 standout 年",
      "issue3": "没和其他类别交叉对比"
    },
    "slide4_improved": {
      "pill_label": "Band 7+",
      "headline": "改写段落",
      "card_body": "{Y}Sales rose steadily across the five-year period, climbing from 20 units in 2018 to 38 in 2022, an increase of nearly 90%. The sharpest jump occurred between 2019 and 2020, while the trend slowed slightly in the final year.{/Y}",
      "speech_bubble": "趋势加高点！"
    },
    "slide5_key_changes": {
      "headline": "{H}3 个关键改动{/H}",
      "change1": "Trend 句覆盖全周期",
      "change2": "Standout 年 (2019 到 2020 突变)",
      "change3": "百分比对比加 slowed phrasing"
    },
    "slide6_cta": {
      "headline": "想让 AI 改\n{H}你的多年柱图？{/H}"
    }
  }
}
```

---

## Post 27 — fix-part2-future-plan — T4

**Topic:** Fix this Speaking Part 2 future plan answer
**Save trigger:** 未来 plan 时态 + 细节 + 动机模板

```json
{
  "post_meta": {
    "template": "T4",
    "topic": "Fix Part 2 future plan answer",
    "slug": "fix-part2-future-plan"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}未来计划{/P} 一句话讲完？\n看 {H}7+ 怎么撑{/H}！",
      "sublabel": "⚠ Part 2 future plan 真实学生答案修复"
    },
    "slide2_original": {
      "pill_label": "Band 6",
      "headline": "原答案",
      "card_body": "{Y}I want to study abroad next year. I will go to the UK. I will study business. I think it will be good for my future.{/Y}",
      "speech_bubble": "干巴巴！"
    },
    "slide3_problems": {
      "headline": "{H}3 个问题{/H}",
      "issue1": "全是 simple future (will + V)",
      "issue2": "没有细节 (city / programme)",
      "issue3": "没有动机 backstory"
    },
    "slide4_improved": {
      "pill_label": "Band 7+",
      "headline": "改写答案",
      "card_body": "{Y}So next September I'll be heading to Edinburgh to do a master's in marketing analytics, which has actually been on my mind since my second year of uni, when I did an internship at a small e-commerce firm and realised I loved the data side more than the creative side. The plan is to come back to Chengdu in 2027 and join my friend's start-up.{/Y}",
      "speech_bubble": "故事加动机！"
    },
    "slide5_key_changes": {
      "headline": "{H}3 个关键改动{/H}",
      "change1": "Continuous future (I'll be heading)",
      "change2": "Specific city, programme, year",
      "change3": "Backstory 解释为什么"
    },
    "slide6_cta": {
      "headline": "想让 AI 改\n{H}你的 Part 2 未来题？{/H}"
    }
  }
}
```

---

## Post 28 — fix-task2-problem-solution — T4

**Topic:** Fix this Task 2 problem-solution answer
**Save trigger:** Problem-solution 段落 8 句结构

```json
{
  "post_meta": {
    "template": "T4",
    "topic": "Fix Task 2 problem-solution paragraph",
    "slug": "fix-task2-problem-solution"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}P-S 题{/P} 问题和方案混着写\n看 {H}7+ 怎么 restructure{/H}！",
      "sublabel": "⚠ 真实段落修复"
    },
    "slide2_original": {
      "pill_label": "Band 6",
      "headline": "原段落",
      "card_body": "{Y}Many cities have traffic problems and pollution and also it is bad for health. So governments should build more buses and people should drive less and ride bikes which is good.{/Y}",
      "speech_bubble": "全堆一起！"
    },
    "slide3_problems": {
      "headline": "{H}3 个问题{/H}",
      "issue1": "问题和方案混在一段",
      "issue2": "因果关系不清",
      "issue3": "方案太 generic (drive less)"
    },
    "slide4_improved": {
      "pill_label": "Band 7+",
      "headline": "改写为 2 段",
      "card_body": "{Y}P-段: Heavy car dependence is the root cause of urban congestion, which in turn drives air pollution and respiratory illness in densely populated districts.{/Y}\n\n{Y}S-段: A targeted response is to invest in dedicated bus rapid transit corridors, combined with congestion pricing in city centres, as Singapore has demonstrated successfully.{/Y}",
      "speech_bubble": "分开写！"
    },
    "slide5_key_changes": {
      "headline": "{H}3 个关键改动{/H}",
      "change1": "Problem 独立成段加因果链",
      "change2": "Solution 独立成段加具体",
      "change3": "Real-world example (Singapore)"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的 P-S 结构？{/H}"
    }
  }
}
```

---

## Post 29 — fix-gt-informal-letter — T4

**Topic:** Fix this GT informal letter
**Save trigger:** 非正式信件 opener / closer / 缩写规则

```json
{
  "post_meta": {
    "template": "T4",
    "topic": "Fix GT informal letter",
    "slug": "fix-gt-informal-letter"
  },
  "slides": {
    "slide1_hook": {
      "headline": "给{P}朋友的信{/P}写得像\n给 {H}老板{/H}, 怎么改？",
      "sublabel": "⚠ Informal letter register 修复"
    },
    "slide2_original": {
      "pill_label": "Band 6",
      "headline": "原信件",
      "card_body": "{Y}Dear Mark, I am writing this letter to inform you that I have recently relocated to a new apartment. I would like to invite you to visit at your earliest convenience. Yours sincerely, Mei.{/Y}",
      "speech_bubble": "太僵了！"
    },
    "slide3_problems": {
      "headline": "{H}3 个问题{/H}",
      "issue1": "'I am writing to inform' 太正式",
      "issue2": "整封没有缩写",
      "issue3": "'Yours sincerely' 给朋友？"
    },
    "slide4_improved": {
      "pill_label": "Band 7+",
      "headline": "改写信件",
      "card_body": "{Y}Hi Mark, hope you're doing well! Just a quick note to say I've finally moved into the new place near the river, and it's so much better than my old flat. You've got to come over and check it out, maybe next weekend? Let me know what works for you. Take care, Mei.{/Y}",
      "speech_bubble": "温度有了！"
    },
    "slide5_key_changes": {
      "headline": "{H}3 个关键改动{/H}",
      "change1": "Casual opener (Hi 加 hope you're well)",
      "change2": "Contractions (I've / you've / it's)",
      "change3": "Warm sign-off (Take care)"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的 letter register？{/H}"
    }
  }
}
```

---

## Post 30 — fix-part3-cause-effect — T4

**Topic:** Fix this Speaking Part 3 cause-effect answer
**Save trigger:** Cause-effect 4 步答题模板

```json
{
  "post_meta": {
    "template": "T4",
    "topic": "Fix Part 3 cause-effect answer",
    "slug": "fix-part3-cause-effect"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Why do people travel?{/P}\n30 秒答完, 看 {H}7+ 怎么撑{/H}！",
      "sublabel": "⚠ Part 3 因果题真实学生答案修复"
    },
    "slide2_original": {
      "pill_label": "Band 6",
      "headline": "原答案",
      "card_body": "{Y}People travel because they want to relax. They are tired from work. So they want to go somewhere new. That's all.{/Y}",
      "speech_bubble": "太浅了！"
    },
    "slide3_problems": {
      "headline": "{H}3 个问题{/H}",
      "issue1": "只有一个 surface cause",
      "issue2": "没有具体例子",
      "issue3": "没有 nuance 或 counter"
    },
    "slide4_improved": {
      "pill_label": "Band 7+",
      "headline": "改写答案",
      "card_body": "{Y}On the surface, people travel to unwind, but I think there's actually a deeper pull, which is the chance to step outside their usual identity for a while. A friend of mine, for instance, said her trip to Iceland was less about the scenery and more about being totally anonymous. That said, not everyone travels for self-reinvention, some people genuinely just want sunshine and a quiet beach.{/Y}",
      "speech_bubble": "深度加例子！"
    },
    "slide5_key_changes": {
      "headline": "{H}3 个关键改动{/H}",
      "change1": "Surface cause 加 deeper cause",
      "change2": "Concrete example (Iceland friend)",
      "change3": "Counter-consideration (not everyone)"
    },
    "slide6_cta": {
      "headline": "想让 AI 练\n{H}你的 Part 3 因果题？{/H}"
    }
  }
}
```

---

## Post 31 — fix-listening-s3-matching — T4

**Topic:** Fix this Listening Section 3 matching question
**Save trigger:** S3 配对题 attitude 词雷达

```json
{
  "post_meta": {
    "template": "T4",
    "topic": "Fix Listening S3 matching errors",
    "slug": "fix-listening-s3-matching"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}S3 配对题{/P}\n对 1 错 2? 看 {H}7+ 怎么救{/H}！",
      "sublabel": "⚠ 真实学生错题路径分析"
    },
    "slide2_original": {
      "pill_label": "Band 6",
      "headline": "学生错题",
      "card_body": "Q: How does the tutor feel about the data section? Student picked B {Y}'satisfied'{/Y}. Audio: {Y}'I mean, it's there, but honestly I'd expected more depth from a final-year project...'{/Y}",
      "speech_bubble": "听漏了！"
    },
    "slide3_problems": {
      "headline": "{H}3 个问题{/H}",
      "issue1": "只听 fact, 没抓 attitude 词",
      "issue2": "'honestly' / 'I'd expected more' 没识别",
      "issue3": "礼貌话误判成 satisfied"
    },
    "slide4_improved": {
      "pill_label": "Band 7+",
      "headline": "正确路径",
      "card_body": "Pre-listen scan options for {Y}attitude markers{/Y}: satisfied / disappointed / surprised / frustrated. Listen for {Y}'honestly / to be fair / I'd hoped / a bit'{/Y}. Tutor is clearly {Y}disappointed{/Y}, not satisfied.",
      "speech_bubble": "听语气词！"
    },
    "slide5_key_changes": {
      "headline": "{H}3 个关键策略{/H}",
      "change1": "预扫 attitude 词进听力大脑",
      "change2": "Hedge 词 (honestly, a bit) 是暗示",
      "change3": "Speaker identification 别混"
    },
    "slide6_cta": {
      "headline": "想让 AI 训练\n{H}你的 S3 配对题？{/H}"
    }
  }
}
```

---

## Post 32 — fix-reading-summary-completion — T4

**Topic:** Fix this Reading summary completion
**Save trigger:** Summary 填空 3 步法

```json
{
  "post_meta": {
    "template": "T4",
    "topic": "Fix Reading summary completion",
    "slug": "fix-reading-summary-completion"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Summary 填空{/P}\n错一半? 看 {H}7+ 路径{/H}！",
      "sublabel": "⚠ Reading 真实错题修复"
    },
    "slide2_original": {
      "pill_label": "Band 6",
      "headline": "学生错题",
      "card_body": "Q: Researchers found that bee colonies declined due to ______. Student wrote {Y}'pollution'{/Y}. Passage said: {Y}'... a complex interaction of habitat loss and emerging pathogens.'{/Y}",
      "speech_bubble": "猜错了！"
    },
    "slide3_problems": {
      "headline": "{H}3 个错因{/H}",
      "issue1": "Scope 找错段落",
      "issue2": "没认 paraphrase (decline 等于 loss)",
      "issue3": "Word form 没核 (single noun)"
    },
    "slide4_improved": {
      "pill_label": "Band 7+",
      "headline": "正确路径",
      "card_body": "Step 1: 定位 summary 覆盖的段落 (only the conclusion paragraph). Step 2: 找 paraphrase: {Y}decline ↔ loss / shrinkage{/Y}. Step 3: 核词性, 题干前是 'due to', 后接 noun, 答案是 {Y}pathogens{/Y}.",
      "speech_bubble": "3 步定位！"
    },
    "slide5_key_changes": {
      "headline": "{H}3 个关键步骤{/H}",
      "change1": "先定 summary scope",
      "change2": "再找 paraphrase",
      "change3": "最后核 word form"
    },
    "slide6_cta": {
      "headline": "想让 AI 训练\n{H}你的 summary 题？{/H}"
    }
  }
}
```

---

## Post 33 — 30-day-band6-plan — T5

**Topic:** 30-day band 6 plan for late starters
**Save trigger:** Week-by-week 30 日任务表

```json
{
  "post_meta": {
    "template": "T5",
    "topic": "30-day band 6 plan",
    "slug": "30-day-band6-plan"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}30 天{/P}冲 {H}6 分{/H}\n这样安排！",
      "sublabel": "⚠ 还有 30 天考试? 别瞎练"
    },
    "slide2_step1": {
      "pill_label": "Week 1",
      "headline": "{H}诊断加熟悉格式{/H}",
      "step_desc": "Day 1: 完整 1 套 mock (限时), 找出最弱技能。Day 2 到 7: 每个 section 做 2 套熟悉题型。",
      "speech_bubble": "先摸底！"
    },
    "slide3_step2": {
      "pill_label": "Week 2",
      "headline": "{H}专攻最弱{/H}",
      "step_desc": "70% 时间砸在最弱技能 (e.g. Writing), 模板加 30 个高频词加 2 道真题。其他技能维持 30 分钟一天。",
      "speech_bubble": "攻一点！"
    },
    "slide4_step3": {
      "pill_label": "Week 3",
      "headline": "{H}3 套完整 mock{/H}",
      "step_desc": "周二, 周四, 周日各一套 limited-time mock, 中间日复盘错题, 错题归类成 3 大类。",
      "speech_bubble": "实战！"
    },
    "slide5_avoid": {
      "pill_label": "千万别这样",
      "headline": "{H}最后一周乱冲{/H}",
      "card_body": "❌ Week 4 还在背新单词。✅ Week 4 只复盘错题加调整作息, 考前 2 天轻量练保持手感。",
      "speech_bubble": "别熬夜！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你\n{H}30 日 6 分计划？{/H}"
    }
  }
}
```

---

## Post 34 — reading-pacing-60min — T5

**Topic:** Reading 60-minute pacing breakdown
**Save trigger:** Per-passage timer 卡

```json
{
  "post_meta": {
    "template": "T5",
    "topic": "Reading 60-min pacing",
    "slug": "reading-pacing-60min"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Reading 60 分钟{/P}\n这样分 {H}7+ 节奏{/H}！",
      "sublabel": "⚠ 平均分配等于最后一篇崩"
    },
    "slide2_step1": {
      "pill_label": "Passage 1",
      "headline": "{H}17 分钟{/H}",
      "step_desc": "最简单, 拿满 13 题。2 分钟 skim, 13 分钟做题, 2 分钟核答案。心态稳第一篇。",
      "speech_bubble": "稳！"
    },
    "slide3_step2": {
      "pill_label": "Passage 2",
      "headline": "{H}20 分钟{/H}",
      "step_desc": "难度上升, 题型变化多 (matching headings, true-false)。2 分钟 skim, 17 分钟做题, 1 分钟标记不确定。",
      "speech_bubble": "提速！"
    },
    "slide4_step3": {
      "pill_label": "Passage 3",
      "headline": "{H}20 分钟加 3 分钟 transfer{/H}",
      "step_desc": "最难, 别恋战。难题先标记跳过, 简单题先拿分, 留 3 分钟回 P1 加 P2 检查 transfer 加空题猜答案。",
      "speech_bubble": "保底！"
    },
    "slide5_avoid": {
      "pill_label": "千万别这样",
      "headline": "{H}每篇平均 20 分钟{/H}",
      "card_body": "❌ Passage 1 慢慢做, P3 没时间。✅ {Y}前轻后重{/Y}, 留 3 分钟检查 transfer。",
      "speech_bubble": "别恋战！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你\n{H}限时 Reading 模考？{/H}"
    }
  }
}
```

---

## Post 35 — listening-last-30s — T5

**Topic:** Listening last 30 seconds rescue routine
**Save trigger:** Transfer time 3 步法

```json
{
  "post_meta": {
    "template": "T5",
    "topic": "Listening last 30s rescue",
    "slug": "listening-last-30s"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}录音停了{/P}\n最后 {H}10 分钟救命{/H}！",
      "sublabel": "⚠ Transfer 阶段最容易丢分"
    },
    "slide2_step1": {
      "pill_label": "Step 1",
      "headline": "{H}先 Transfer 答案{/H}",
      "step_desc": "拼写双查加大小写加单复数 (不少 -s)。Listening 答案纸特别容易写错 article 和 plural。",
      "speech_bubble": "拼写！"
    },
    "slide3_step2": {
      "pill_label": "Step 2",
      "headline": "{H}空题 best-guess{/H}",
      "step_desc": "全部空题必须写答案。单选写 B (统计上 B 是最高分布), 填空写最合理的 word form (noun, -ing form)。",
      "speech_bubble": "别留白！"
    },
    "slide4_step3": {
      "pill_label": "Step 3",
      "headline": "{H}Pattern check{/H}",
      "step_desc": "扫一眼答案分布。5 题填空全大写? 形似词 (their / there) 有没有写反? 高频拼写错 (necessary, accommodation) 再扫。",
      "speech_bubble": "再扫一遍！"
    },
    "slide5_avoid": {
      "pill_label": "千万别这样",
      "headline": "{H}留空题{/H}",
      "card_body": "❌ 不会的题留空。✅ 25% 猜对 vs 0% 错没, 同一道分。{Y}永远写答案{/Y}, 哪怕瞎猜。",
      "speech_bubble": "猜也写！"
    },
    "slide6_cta": {
      "headline": "想让 AI 训练\n{H}你的 transfer time？{/H}"
    }
  }
}
```

---

## Post 36 — speaking-recover-bad-part2 — T5

**Topic:** Speaking recovery from a bad Part 2
**Save trigger:** 3 个 Part 3 翻盘动作

```json
{
  "post_meta": {
    "template": "T5",
    "topic": "Speaking recover bad Part 2",
    "slug": "speaking-recover-bad-part2"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Part 2{/P} 讲砸了\nPart 3 还能 {H}翻盘{/H}！",
      "sublabel": "⚠ 别崩, 后半场决定分数"
    },
    "slide2_step1": {
      "pill_label": "Move 1",
      "headline": "{H}归零加调节奏{/H}",
      "step_desc": "深呼吸加微笑加放慢语速。考官给你 30 秒空白其实是 reset 信号。{Y}'Hmm, that's actually a really interesting question, let me think for a sec...'{/Y}",
      "speech_bubble": "深呼吸！"
    },
    "slide3_step2": {
      "pill_label": "Move 2",
      "headline": "{H}抛出 2 个最强 pattern{/H}",
      "step_desc": "把平时练熟的 2 个高分句型 (cleft, concession) 在 Part 3 前 2 题立刻用出来。{Y}'What's really driving this, in my view, is...'{/Y}",
      "speech_bubble": "用大招！"
    },
    "slide4_step3": {
      "pill_label": "Move 3",
      "headline": "{H}1 个抽象题秀深度{/H}",
      "step_desc": "Part 3 后半通常有 abstract 题, 用 surface cause 加 deeper cause 加 counter 框架答 1 题就够 examiner 调整印象。",
      "speech_bubble": "秀肌肉！"
    },
    "slide5_avoid": {
      "pill_label": "千万别这样",
      "headline": "{H}全程懊恼{/H}",
      "card_body": "❌ 在 Part 3 还想着 Part 2 没讲好。✅ 4 criteria 综合打分, Part 3 占 1/3, {Y}心态归零是真分数{/Y}。",
      "speech_bubble": "向前看！"
    },
    "slide6_cta": {
      "headline": "想让 AI 教\n{H}心态加翻盘策略？{/H}"
    }
  }
}
```

---

## Post 37 — writing-last-5min-check — T5

**Topic:** Writing review checklist for the last 5 minutes
**Save trigger:** 5-min checklist (5 items)

```json
{
  "post_meta": {
    "template": "T5",
    "topic": "Writing last 5 min check",
    "slug": "writing-last-5min-check"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}写完不查{/P}\n平均丢 {H}0.5 分{/H}！",
      "sublabel": "⚠ 最后 5 分钟 5 项 check"
    },
    "slide2_step1": {
      "pill_label": "Step 1",
      "headline": "{H}字数到了吗{/H}",
      "step_desc": "Task 1 大于等于 150, Task 2 大于等于 250。每行平均字数乘行数估算, 差 20 字就补 1 句具体例子。",
      "speech_bubble": "数一下！"
    },
    "slide3_step2": {
      "pill_label": "Step 2 加 3",
      "headline": "{H}大小写加时态{/H}",
      "step_desc": "Step 2: 句首大写加句末标点。Step 3: 每个动词扫一眼时态, Task 1 chart 用过去, Task 2 现在或一般。",
      "speech_bubble": "扫动词！"
    },
    "slide4_step3": {
      "pill_label": "Step 4 加 5",
      "headline": "{H}单复数加拼写{/H}",
      "step_desc": "Step 4: 复数加 -s, 不可数不加 (information, advice)。Step 5: 高频错词 (environment, government, because) 扫一眼。",
      "speech_bubble": "拼写！"
    },
    "slide5_avoid": {
      "pill_label": "千万别这样",
      "headline": "{H}重读改内容{/H}",
      "card_body": "❌ 最后 5 分钟还在加新观点。✅ {Y}只查机械错{/Y}, 不动结构。每项 1 分钟, 5 分钟搞定。",
      "speech_bubble": "别改内容！"
    },
    "slide6_cta": {
      "headline": "想让 AI 帮你\n{H}做 last-check 模拟？{/H}"
    }
  }
}
```

---

## Post 38 — choose-target-band — T5

**Topic:** Choosing your target band realistically
**Save trigger:** 目标分诊断 3 步

```json
{
  "post_meta": {
    "template": "T5",
    "topic": "Choose target band realistically",
    "slug": "choose-target-band"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}目标分{/P}定错\n备考方向 {H}全错{/H}！",
      "sublabel": "⚠ 3 步合理定目标"
    },
    "slide2_step1": {
      "pill_label": "Step 1",
      "headline": "{H}先做 1 套 baseline{/H}",
      "step_desc": "限时完整 1 套真题, 算 4 个分项加总分。这是你的 {Y}起点{/Y}, 不是终点。别看 1 套就慌。",
      "speech_bubble": "先测试！"
    },
    "slide3_step2": {
      "pill_label": "Step 2",
      "headline": "{H}算时间预算{/H}",
      "step_desc": "考试日期减今天等于备考周数。每周能投 15 小时? 25? 分摊到 4 个技能, 算每个技能能涨多少。",
      "speech_bubble": "算时间！"
    },
    "slide4_step3": {
      "pill_label": "Step 3",
      "headline": "{H}主分加子分目标{/H}",
      "step_desc": "总分 7.0 等于 Listening 7.5, Reading 7.5, Writing 6.5, Speaking 6.5。{Y}写口短板补不上来{/Y}, 用 L 加 R 拉高总分。",
      "speech_bubble": "分项定！"
    },
    "slide5_avoid": {
      "pill_label": "千万别这样",
      "headline": "{H}全要 8 分{/H}",
      "card_body": "❌ Baseline 5.5 直接定 8。✅ {Y}0.5 到 1 band 提升空间{/Y} 是现实目标, 全要 8 等于全没。",
      "speech_bubble": "别贪心！"
    },
    "slide6_cta": {
      "headline": "想让 AI 帮你\n{H}诊断加定目标分？{/H}"
    }
  }
}
```

---

## Post 39 — use-band-descriptors — T5

**Topic:** How to use band descriptors as study tool
**Save trigger:** 4 criteria 每周对照清单

```json
{
  "post_meta": {
    "template": "T5",
    "topic": "Use band descriptors as study tool",
    "slug": "use-band-descriptors"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}不看评分细则{/P}\n=  {H}闭眼考试{/H}！",
      "sublabel": "⚠ 官方 descriptors 才是 game rules"
    },
    "slide2_step1": {
      "pill_label": "Step 1",
      "headline": "{H}每周聚焦 1 个 criterion{/H}",
      "step_desc": "Week 1: Task Response。Week 2: Coherence and Cohesion。Week 3: Lexical Resource。Week 4: Grammar。",
      "speech_bubble": "一周一项！"
    },
    "slide3_step2": {
      "pill_label": "Step 2",
      "headline": "{H}自评加对照{/H}",
      "step_desc": "写完自评一遍, 对照官方 descriptor 6 分, 7 分, 8 分描述, 找出你的作文符合哪一层。",
      "speech_bubble": "对照！"
    },
    "slide4_step3": {
      "pill_label": "Step 3",
      "headline": "{H}找 7 分差距点{/H}",
      "step_desc": "7 分 Coherence 要求 {Y}'logical progression throughout'{/Y}。你的段落之间有逻辑链接吗? 找出 1 个具体缺陷。",
      "speech_bubble": "找差距！"
    },
    "slide5_avoid": {
      "pill_label": "千万别这样",
      "headline": "{H}靠感觉{/H}",
      "card_body": "❌ '感觉这篇还行'。✅ Descriptors 是 {Y}game rules{/Y}, 直接对标具体描述, 不要感觉。",
      "speech_bubble": "对细则！"
    },
    "slide6_cta": {
      "headline": "想让 AI 用\n{H}官方 descriptors 评你？{/H}"
    }
  }
}
```

---

## Post 40 — ac-vs-gt-choice — T5

**Topic:** Choosing IELTS Academic vs General Training
**Save trigger:** A 类 / G 类决策矩阵

```json
{
  "post_meta": {
    "template": "T5",
    "topic": "Academic vs General Training choice",
    "slug": "ac-vs-gt-choice"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}A 类 vs G 类{/P}\n选错差 {H}0.5 到 1 band{/H}！",
      "sublabel": "⚠ 报名前必看决策矩阵"
    },
    "slide2_step1": {
      "pill_label": "Step 1",
      "headline": "{H}看用途{/H}",
      "step_desc": "{Y}留学加学术 → AC{/Y}。{Y}移民加工作签证加技校 → GT{/Y}。先查目标国家或学校的官方要求, 不要听中介。",
      "speech_bubble": "查官网！"
    },
    "slide3_step2": {
      "pill_label": "Step 2",
      "headline": "{H}看难度差异{/H}",
      "step_desc": "GT Reading 比 AC 简单一截 (信件加通知 vs 学术文章)。AC Writing Task 1 是图表, GT 是信件。Listening 加 Speaking 完全相同。",
      "speech_bubble": "GT 偏简单！"
    },
    "slide4_step3": {
      "pill_label": "Step 3",
      "headline": "{H}选你能拿分的{/H}",
      "step_desc": "如果用途允许 GT, 而你 Reading 弱, 选 GT。如果留学硬性要求 AC, 那只能练学术读写。",
      "speech_bubble": "拿分优先！"
    },
    "slide5_avoid": {
      "pill_label": "千万别这样",
      "headline": "{H}先报名再问{/H}",
      "card_body": "❌ 先报了 AC 才发现签证只接受 GT。✅ {Y}报名前查目标机构 official acceptance list{/Y}。",
      "speech_bubble": "先查！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你\n{H}A 加 G 模拟体验？{/H}"
    }
  }
}
```

---

## Post 41 — myth-need-course — T6

**Topic:** Myth: You need an IELTS course to pass
**Save trigger:** 自学 vs 报班对比表

```json
{
  "post_meta": {
    "template": "T6",
    "topic": "Myth: need a course",
    "slug": "myth-need-course"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}必须报班{/P}才能过\n是 {H}错的{/H}！",
      "sublabel": "⚠ 80% 7+ 学生没报过线下班"
    },
    "slide2_myth": {
      "pill_label": "误区",
      "headline": "{H}\"线下班等于高分捷径\"{/H}",
      "myth_quote": "中介说: 一定要报我们的封闭班, 不报班自己 7 分上不去。",
      "speech_bubble": "真的吗？"
    },
    "slide3_why_wrong": {
      "headline": "{H}为什么错{/H}",
      "reason1": "线下班大部分时间在抄板书",
      "reason2": "1v1 真题反馈 > 集体讲座",
      "reason3": "考分靠练习量, 不是听课量"
    },
    "slide4_truth": {
      "pill_label": "真相",
      "headline": "{H}自学加 AI 反馈足够{/H}",
      "truth_card": "{Y}80% 7+ 学生{/Y} 主要靠真题加 AI 评分加偶尔 1 到 2 节 1v1 答疑。线下班 ROI 远低于 targeted self-study。",
      "speech_bubble": "练才重要！"
    },
    "slide5_action": {
      "headline": "{H}立刻这样做{/H}",
      "action_desc": "Diagnostic 1 套真题, 找出最弱技能, 用 AI 每天批改 1 篇加 1 段 Speaking, 周末做 1 套 mock, 卡点找老师 1 对 1 答疑。",
      "speech_bubble": "练起来！"
    },
    "slide6_cta": {
      "headline": "想让 AI 帮你\n{H}免费自学路径？{/H}"
    }
  }
}
```

---

## Post 42 — myth-british-better — T6

**Topic:** Myth: British English scores higher than American
**Save trigger:** 发音评分细则真相

```json
{
  "post_meta": {
    "template": "T6",
    "topic": "Myth: British accent scores higher",
    "slug": "myth-british-better"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}英音{/P} 等于高分?\n{H}假的{/H}！",
      "sublabel": "⚠ 美音也能拿 9 分"
    },
    "slide2_myth": {
      "pill_label": "误区",
      "headline": "{H}\"英音等于 native 等于高分\"{/H}",
      "myth_quote": "你说话有美式口音, 雅思考官会扣分, 必须练英音。",
      "speech_bubble": "假的！"
    },
    "slide3_why_wrong": {
      "headline": "{H}为什么错{/H}",
      "reason1": "Pronunciation 4 criteria 不评地区口音",
      "reason2": "Clarity 加 intelligibility 才是评分维度",
      "reason3": "考官来自全球 (澳, 加, 美, 英, 印)"
    },
    "slide4_truth": {
      "pill_label": "真相",
      "headline": "{H}清晰 > 哪种口音{/H}",
      "truth_card": "Both varieties fully accepted. 反而 {Y}混着用 (一会 British, 一会 American){/Y} 会扣 pronunciation 一致性分。",
      "speech_bubble": "选一种！"
    },
    "slide5_action": {
      "headline": "{H}立刻这样做{/H}",
      "action_desc": "选你最容易发清晰的那一种, 一致用到底, 重点练 individual sounds (TH, R, V-W) 而不是 accent labels。",
      "speech_bubble": "一致就好！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的发音 features？{/H}"
    }
  }
}
```

---

## Post 43 — myth-rigid-stance — T6

**Topic:** Myth: Writing 2 essays needs a hard-line stance
**Save trigger:** Stance options 决策图

```json
{
  "post_meta": {
    "template": "T6",
    "topic": "Myth: rigid stance required",
    "slug": "myth-rigid-stance"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Task 2 必须{/P}一边倒?\n{H}假的{/H}！",
      "sublabel": "⚠ 平衡观点也能 7+"
    },
    "slide2_myth": {
      "pill_label": "误区",
      "headline": "{H}\"必须 strongly agree 或 disagree\"{/H}",
      "myth_quote": "中介说: Task 2 必须一边倒, 平衡观点是 6 分。",
      "speech_bubble": "假的！"
    },
    "slide3_why_wrong": {
      "headline": "{H}为什么错{/H}",
      "reason1": "Task Response 看 consistency, 不是 strength",
      "reason2": "Nuanced 'agree to a large extent' 也能 8 分",
      "reason3": "Real-world 论证本来就不是非黑即白"
    },
    "slide4_truth": {
      "pill_label": "真相",
      "headline": "{H}立场清晰 > 立场强硬{/H}",
      "truth_card": "{Y}Strong stance{/Y} works. {Y}Nuanced stance (agree to extent){/Y} works. 唯一不行的是 {Y}中途变立场{/Y}, 一会 agree 一会 disagree。",
      "speech_bubble": "保持一致！"
    },
    "slide5_action": {
      "headline": "{H}立刻这样做{/H}",
      "action_desc": "拿到题先 30 秒决定, 哪个立场你能写出更具体的论证, 选那个, intro 明确写出, 全篇保持一致。别 mid-essay 跳。",
      "speech_bubble": "30 秒决定！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你 Task 2 立场一致性？{/H}"
    }
  }
}
```

---

## Post 44 — myth-idioms-required — T6

**Topic:** Myth: You need to use idioms in Speaking to get 7+
**Save trigger:** 何时用 idiom 决策表

```json
{
  "post_meta": {
    "template": "T6",
    "topic": "Myth: idioms required for 7+",
    "slug": "myth-idioms-required"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}口语必须 idiom{/P}\n上 7? {H}假的{/H}！",
      "sublabel": "⚠ 强用 idiom 反扣分"
    },
    "slide2_myth": {
      "pill_label": "误区",
      "headline": "{H}\"Idioms 等于高分保证\"{/H}",
      "myth_quote": "中介说: 每个 Part 都要塞 idiom, 越多越好, 这才是 native-like。",
      "speech_bubble": "假的！"
    },
    "slide3_why_wrong": {
      "headline": "{H}为什么错{/H}",
      "reason1": "Wrong-context idiom 扣分 > 不用 idiom",
      "reason2": "Examiner 一听就知道是背的",
      "reason3": "LR 看 collocations 加 precision, 不是 idiom 数量"
    },
    "slide4_truth": {
      "pill_label": "真相",
      "headline": "{H}1 到 2 个 natural idiom 就够{/H}",
      "truth_card": "Examiner wants {Y}precision and natural collocation{/Y}, not forced idioms. {Y}'It's been a real eye-opener'{/Y} natural beats {Y}'as cold as ice'{/Y} forced.",
      "speech_bubble": "自然才行！"
    },
    "slide5_action": {
      "headline": "{H}立刻这样做{/H}",
      "action_desc": "选 5 个你完全 internalised 的 idiom, 只在它们恰好适合时用, 其他时候用精准 collocation 就行。",
      "speech_bubble": "宁缺勿滥！"
    },
    "slide6_cta": {
      "headline": "想让 AI 测\n{H}你的 idiom 适配度？{/H}"
    }
  }
}
```

---

## Post 45 — myth-examiner-mood — T6

**Topic:** Myth: Speaking score depends on examiner's mood
**Save trigger:** Examiner 实际打分维度

```json
{
  "post_meta": {
    "template": "T6",
    "topic": "Myth: examiner mood decides",
    "slug": "myth-examiner-mood"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}口语分{/P}看考官心情?\n{H}假的{/H}！",
      "sublabel": "⚠ 是这 4 个 criteria 决定的"
    },
    "slide2_myth": {
      "pill_label": "误区",
      "headline": "{H}\"考官心情决定分数\"{/H}",
      "myth_quote": "学生说: 我那场考官一直黑脸, 肯定给我打低分。",
      "speech_bubble": "假的！"
    },
    "slide3_why_wrong": {
      "headline": "{H}为什么错{/H}",
      "reason1": "Fluency, LR, GR, Pron 4 项标准化",
      "reason2": "录音加 quality-check 全过程",
      "reason3": "随机抽 sample 由 chief examiner 复评"
    },
    "slide4_truth": {
      "pill_label": "真相",
      "headline": "{H}4 criteria 客观打分{/H}",
      "truth_card": "考官面无表情是 {Y}保持中立{/Y}, 不是不满。打分时严格按 descriptors 来。{Y}'Lucky examiner'{/Y} 是心态毒, 不是真分数。",
      "speech_bubble": "心态正！"
    },
    "slide5_action": {
      "headline": "{H}立刻这样做{/H}",
      "action_desc": "平均练 4 个 criteria 而不是赌一个面孔。考前提醒自己: 考官是 quality-checked 的, 表情不打分。",
      "speech_bubble": "练 4 项！"
    },
    "slide6_cta": {
      "headline": "想让 AI 按\n{H}真实 4 criteria 评你？{/H}"
    }
  }
}
```

---

## Post 46 — myth-no-first-person — T6

**Topic:** Myth: You shouldn't use first-person "I" in writing
**Save trigger:** "I" 使用场景表

```json
{
  "post_meta": {
    "template": "T6",
    "topic": "Myth: no first person in essays",
    "slug": "myth-no-first-person"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Task 2 不能用 \"I\"{/P}\n{H}假的{/H}！",
      "sublabel": "⚠ Examiner 鼓励有立场"
    },
    "slide2_myth": {
      "pill_label": "误区",
      "headline": "{H}\"学术写作要避免 I\"{/H}",
      "myth_quote": "中介说: Task 2 是 academic writing, 必须用 'It is believed that' 不用 I。",
      "speech_bubble": "假的！"
    },
    "slide3_why_wrong": {
      "headline": "{H}为什么错{/H}",
      "reason1": "Task 2 是 opinion essay, 不是 research paper",
      "reason2": "Avoiding 'I' 等于立场模糊等于 TR 扣分",
      "reason3": "Stance markers (I argue, In my view) 是高分特征"
    },
    "slide4_truth": {
      "pill_label": "真相",
      "headline": "{H}I 用在立场, 不用在证据{/H}",
      "truth_card": "{Y}'I argue that...' / 'In my view, the case for X is stronger because...'{/Y} 都是 7+ 写法。{Y}'Studies have shown...'{/Y} 用在证据部分。",
      "speech_bubble": "分场景！"
    },
    "slide5_action": {
      "headline": "{H}立刻这样做{/H}",
      "action_desc": "Intro 表明立场用 'I' (e.g. I would argue)。Body 证据用 impersonal (e.g. research suggests)。Conclusion 重申立场用 'I' 又可以。",
      "speech_bubble": "分层用！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你的 stance 加 register？{/H}"
    }
  }
}
```

---

## Post 47 — myth-skip-breakfast — T6

**Topic:** Myth: Skipping breakfast helps you focus
**Save trigger:** 考试日 nutrition 清单

```json
{
  "post_meta": {
    "template": "T6",
    "topic": "Myth: skip breakfast for focus",
    "slug": "myth-skip-breakfast"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}考试当天{/P}\n不吃早饭? {H}大脑崩{/H}！",
      "sublabel": "⚠ 考前 nutrition 清单"
    },
    "slide2_myth": {
      "pill_label": "误区",
      "headline": "{H}\"空腹更清醒\"{/H}",
      "myth_quote": "学生说: 我考试紧张吃不下, 反正空腹更专注。",
      "speech_bubble": "假的！"
    },
    "slide3_why_wrong": {
      "headline": "{H}为什么错{/H}",
      "reason1": "考试 2.5 小时, 血糖下降影响 working memory",
      "reason2": "Reading 加 Writing 大脑耗葡萄糖",
      "reason3": "饿肚子放大焦虑感"
    },
    "slide4_truth": {
      "pill_label": "真相",
      "headline": "{H}轻早餐等于最佳状态{/H}",
      "truth_card": "{Y}Light protein (鸡蛋, 酸奶){/Y} 加 {Y}complex carbs (燕麦, 全麦面包){/Y}, 考前 1 小时吃完。{Y}别灌大量水{/Y}, 中场没厕所。",
      "speech_bubble": "轻加早！"
    },
    "slide5_action": {
      "headline": "{H}立刻这样做{/H}",
      "action_desc": "前晚备好: 燕麦加香蕉加鸡蛋加一小杯黑咖啡。考前 1 小时吃完。带 1 根能量 bar 放包里 (Writing 前补)。",
      "speech_bubble": "提前备！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给你\n{H}考试日全流程清单？{/H}"
    }
  }
}
```

---

## Post 48 — myth-ai-unreliable — T6

**Topic:** Myth: AI scoring is unreliable
**Save trigger:** AI evaluation 使用法

```json
{
  "post_meta": {
    "template": "T6",
    "topic": "Myth: AI scoring unreliable",
    "slug": "myth-ai-unreliable"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}AI 评分不准{/P}\n? {H}过时了{/H}！",
      "sublabel": "⚠ AI vs 人工一致性比你想象高"
    },
    "slide2_myth": {
      "pill_label": "误区",
      "headline": "{H}\"AI 看不出 band 8\"{/H}",
      "myth_quote": "中介说: AI 评分只能看语法错, 看不懂 cohesion 和 ideas, 必须人工。",
      "speech_bubble": "过时了！"
    },
    "slide3_why_wrong": {
      "headline": "{H}为什么错{/H}",
      "reason1": "GPT, Claude 类 IELTS 评分与 examiner 一致性 0.7 到 0.9",
      "reason2": "AI sample 量大, bias 比单个老师小",
      "reason3": "AI 反馈秒级, 练得多等于进步快"
    },
    "slide4_truth": {
      "pill_label": "真相",
      "headline": "{H}AI 日常加人工细节等于最优{/H}",
      "truth_card": "AI 评分给你 {Y}每天都能练{/Y} 的反馈循环。人工评分用在 {Y}考前 final review{/Y} 看 nuance。两者结合, 不是二选一。",
      "speech_bubble": "结合用！"
    },
    "slide5_action": {
      "headline": "{H}立刻这样做{/H}",
      "action_desc": "Daily: AI 评 1 篇 Writing 加 1 段 Speaking。Weekly: 人工或老师看 1 篇做深度复盘。{Y}量加质都要{/Y}。",
      "speech_bubble": "都用！"
    },
    "slide6_cta": {
      "headline": "想看 IELTSBoost.AI\n{H}评分一致性数据？{/H}"
    }
  }
}
```

---

## Post 49 — second-conditional-formula — T7

**Topic:** Second conditional formula for Part 3 hypothetical
**Save trigger:** Second conditional 句型卡

```json
{
  "post_meta": {
    "template": "T7",
    "topic": "Second conditional formula",
    "slug": "second-conditional-formula"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}假设题{/P}\n时态错 {H}减 0.5{/H}！",
      "sublabel": "⚠ Second conditional 公式"
    },
    "slide2_formula": {
      "pill_label": "公式",
      "headline": "{H}Second Conditional{/H}",
      "formula_display": "If + past simple, ... would + base verb",
      "card_body": "{Y}If I won the lottery, I would buy a small flat near the sea.{/Y}",
      "speech_bubble": "记住公式！"
    },
    "slide3_component1": {
      "pill_label": "成分 ①",
      "headline": "{H}If-clause 用 past simple{/H}",
      "card_body": "{Y}If I had{/Y} more time, ... {Y}If I won{/Y}, ... {Y}If I lived{/Y} in Paris, ...",
      "common_error": "❌ If I {Y}would have{/Y} more time, ...",
      "speech_bubble": "过去式！"
    },
    "slide4_component2": {
      "pill_label": "成分 ②",
      "headline": "{H}Main clause 用 would + base{/H}",
      "card_body": "..., {Y}I would buy{/Y} ... / {Y}I would probably travel{/Y} ... / {Y}I would consider{/Y} ...",
      "common_error": "❌ ..., I {Y}will{/Y} buy a flat (混 first conditional)",
      "speech_bubble": "would + base！"
    },
    "slide5_example": {
      "headline": "{H}完整 P3 模板{/H}",
      "card_body": "Q: What would you do if you won the lottery?\n\nA: {Y}Honestly, if I won a large amount, I would probably do something fairly boring with most of it, like paying off my parents' mortgage and putting the rest into index funds. I might travel a bit, but I wouldn't quit my job straight away.{/Y}",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 练\n{H}你的假设句型？{/H}"
    }
  }
}
```

---

## Post 50 — passive-task1-process — T7

**Topic:** Passive voice formula for Task 1 processes
**Save trigger:** 被动语态 3-step

```json
{
  "post_meta": {
    "template": "T7",
    "topic": "Passive voice for Task 1 process",
    "slug": "passive-task1-process"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}流程图{/P}必须 {H}被动{/H}\n这个公式背下来！",
      "sublabel": "⚠ 主动写流程等于 6 分天花板"
    },
    "slide2_formula": {
      "pill_label": "公式",
      "headline": "{H}Passive Process{/H}",
      "formula_display": "Subject (item) + is / are + past participle + (by / at / in)",
      "card_body": "{Y}The mixture is heated to 200°C in a furnace.{/Y}",
      "speech_bubble": "记公式！"
    },
    "slide3_component1": {
      "pill_label": "成分 ①",
      "headline": "{H}Subject 等于流程中的物{/H}",
      "card_body": "{Y}The beans / The mixture / The components / The packaged goods{/Y} are the subjects, not the workers.",
      "common_error": "❌ The workers {Y}heat{/Y} the metal (主动)",
      "speech_bubble": "物当主语！"
    },
    "slide4_component2": {
      "pill_label": "成分 ②",
      "headline": "{H}5 个高频 process 动词{/H}",
      "card_body": "{Y}heated / cooled / mixed / processed / shipped{/Y}. 也可: {Y}filtered / extracted / packaged / distributed{/Y}.",
      "common_error": "❌ Then they {Y}do{/Y} the next step (口语化)",
      "speech_bubble": "动词专业！"
    },
    "slide5_example": {
      "headline": "{H}4 步流程示范{/H}",
      "card_body": "{Y}First, the raw beans are collected from farms. Subsequently, they are washed and dried in large tanks. The dried beans are then roasted at 220°C, before being packaged and shipped to retailers.{/Y}",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的流程图被动？{/H}"
    }
  }
}
```

---

## Post 51 — cleft-sentence-formula — T7

**Topic:** Cleft sentence for emphasis
**Save trigger:** Cleft 模板 + 3 例句

```json
{
  "post_meta": {
    "template": "T7",
    "topic": "Cleft sentence formula",
    "slug": "cleft-sentence-formula"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Cleft 句型{/P}\n直接证明 {H}grammatical range{/H}！",
      "sublabel": "⚠ 1 个 cleft 等于 7+ tick"
    },
    "slide2_formula": {
      "pill_label": "公式",
      "headline": "{H}Cleft Sentence{/H}",
      "formula_display": "It is / was + [emphasized] + that / who + rest",
      "card_body": "{Y}It is education, not punishment, that reforms criminals.{/Y}",
      "speech_bubble": "强调来了！"
    },
    "slide3_component1": {
      "pill_label": "成分 ①",
      "headline": "{H}强调对象{/H}",
      "card_body": "Can emphasize {Y}a noun{/Y} ({Y}It is education that...{/Y}), {Y}a person{/Y} ({Y}It is parents who...{/Y}), or {Y}a circumstance{/Y} ({Y}It was during the 1990s that...{/Y}).",
      "common_error": "❌ 强调动词 (very rare in IELTS)",
      "speech_bubble": "强调名词！"
    },
    "slide4_component2": {
      "pill_label": "成分 ②",
      "headline": "{H}3 个使用场景{/H}",
      "context1": "Contrast: It is X, not Y, that...",
      "context2": "Emphasis: It is precisely X that...",
      "context3": "Refute: It is not X but Y that...",
      "speech_bubble": "3 种用法！"
    },
    "slide5_example": {
      "headline": "{H}3 个 Task 2 例句{/H}",
      "card_body": "{Y}It is the absence of opportunity, rather than laziness, that drives long-term unemployment.{/Y}\n\n{Y}It was the introduction of compulsory schooling that transformed social mobility.{/Y}\n\n{Y}It is not technology itself but how we use it that determines outcomes.{/Y}",
      "speech_bubble": "1 篇 1 个就够！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的句型多样性？{/H}"
    }
  }
}
```

---

## Post 52 — inversion-formula — T7

**Topic:** Inversion formula for advanced cohesion
**Save trigger:** 3 个 inversion 触发词

```json
{
  "post_meta": {
    "template": "T7",
    "topic": "Inversion formula",
    "slug": "inversion-formula"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}倒装句{/P}\n让你立刻 {H}native-like{/H}！",
      "sublabel": "⚠ 1 个 inversion 等于 grammar tick"
    },
    "slide2_formula": {
      "pill_label": "公式",
      "headline": "{H}Inversion{/H}",
      "formula_display": "[Trigger] + auxiliary + subject + verb...",
      "card_body": "{Y}Not only does this policy reduce traffic, but it also lowers emissions.{/Y}",
      "speech_bubble": "倒过来！"
    },
    "slide3_component1": {
      "pill_label": "成分 ①",
      "headline": "{H}3 个高频 trigger{/H}",
      "trigger1": "Not only ... but also ...",
      "trigger2": "Rarely / Seldom / Hardly",
      "trigger3": "Only when / Only by ...",
      "speech_bubble": "选熟的！"
    },
    "slide4_component2": {
      "pill_label": "成分 ②",
      "headline": "{H}词序: 助动词提前{/H}",
      "card_body": "❌ {Y}Not only this policy reduces traffic{/Y}, ... (没倒装)\n\n✅ {Y}Not only does this policy reduce traffic{/Y}, ... (does 提前)",
      "common_error": "❌ 忘记把 do / does / did / have 提前",
      "speech_bubble": "助动词提前！"
    },
    "slide5_example": {
      "headline": "{H}Task 2 完整例子{/H}",
      "card_body": "{Y}Not only does universal healthcare improve individual outcomes, but it also reduces long-term costs to the state. Rarely has a single policy delivered such dual benefits at this scale.{/Y}",
      "speech_bubble": "1 篇 1 个就够！"
    },
    "slide6_cta": {
      "headline": "想让 AI 检测\n{H}你的倒装句？{/H}"
    }
  }
}
```

---

## Post 53 — relative-clause-formula — T7

**Topic:** Relative clauses with which/who/whose formula
**Save trigger:** Which / who / whose / where 决策表

```json
{
  "post_meta": {
    "template": "T7",
    "topic": "Relative clauses formula",
    "slug": "relative-clause-formula"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}定语从句{/P}用错\n语法 {H}扣分{/H}！",
      "sublabel": "⚠ Which / who / whose / where 4 步公式"
    },
    "slide2_formula": {
      "pill_label": "公式",
      "headline": "{H}Relative Clauses{/H}",
      "formula_display": "Noun + who / which / whose / where + clause",
      "card_body": "{Y}Students who study abroad often develop greater independence.{/Y}",
      "speech_bubble": "记规则！"
    },
    "slide3_component1": {
      "pill_label": "成分 ①",
      "headline": "{H}选哪个 relative pronoun{/H}",
      "rule1": "who: people",
      "rule2": "which: things",
      "rule3": "whose: possession",
      "rule4": "where: places",
      "speech_bubble": "对号入座！"
    },
    "slide4_component2": {
      "pill_label": "成分 ②",
      "headline": "{H}限定 vs 非限定{/H}",
      "card_body": "限定 (no comma): {Y}Students who study abroad{/Y} develop independence. (specifies which students)\n\n非限定 (with comma): {Y}My brother, who studies in London{/Y}, calls every week. (extra info)",
      "common_error": "❌ which for people / who for things / 缺逗号",
      "speech_bubble": "看逗号！"
    },
    "slide5_example": {
      "headline": "{H}双从句高复杂度{/H}",
      "card_body": "{Y}Cities that invest in public transport, which is often more sustainable than private cars, tend to see reduced emissions and improved air quality.{/Y}",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的从句复杂度？{/H}"
    }
  }
}
```

---

## Post 54 — topic-sentence-transition — T7

**Topic:** Topic sentence + transition formula
**Save trigger:** Topic sentence 3 元素 + 过渡词菜单

```json
{
  "post_meta": {
    "template": "T7",
    "topic": "Topic sentence transition formula",
    "slug": "topic-sentence-transition"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}段首句{/P}\n决定段落 {H}得分上限{/H}！",
      "sublabel": "⚠ 3 元素加过渡词公式"
    },
    "slide2_formula": {
      "pill_label": "公式",
      "headline": "{H}Topic Sentence{/H}",
      "formula_display": "[Connector to prev] + [Claim] + [Forecast of evidence]",
      "card_body": "{Y}Beyond the economic case, equity considerations equally favour the policy, particularly in regions where wage gaps have widened.{/Y}",
      "speech_bubble": "3 个零件！"
    },
    "slide3_component1": {
      "pill_label": "成分 ①",
      "headline": "{H}Connector 菜单{/H}",
      "category1": "Contrast: However / By contrast / Yet",
      "category2": "Addition: Moreover / Beyond this / In addition",
      "category3": "Cause: As a consequence / This means that",
      "category4": "Example: A clear illustration of this is",
      "speech_bubble": "按功能选！"
    },
    "slide4_component2": {
      "pill_label": "成分 ②",
      "headline": "{H}Claim 加 Forecast{/H}",
      "card_body": "Claim 等于 {Y}本段新立场{/Y} (equity considerations equally favour the policy). Forecast 等于 {Y}你下面会用什么证据{/Y} (particularly in regions where wage gaps have widened).",
      "common_error": "❌ Topic sentence 直接给例子, 没 claim",
      "speech_bubble": "Claim 先行！"
    },
    "slide5_example": {
      "headline": "{H}Task 2 段落示范{/H}",
      "card_body": "Body para topic sentence: {Y}While the financial benefits are significant, the deeper rationale for the policy lies in its long-term social impact, as evidenced by educational outcomes in similar programmes overseas.{/Y}",
      "speech_bubble": "段段精彩！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的段间衔接？{/H}"
    }
  }
}
```

---

## Post 55 — part1-wh-because-example — T7

**Topic:** Speaking Part 1 wh + because + example formula
**Save trigger:** 3-元素 P1 模板

```json
{
  "post_meta": {
    "template": "T7",
    "topic": "Part 1 wh-because-example formula",
    "slug": "part1-wh-because-example"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}Part 1{/P}\n1 个公式等于 {H}25 秒答案{/H}！",
      "sublabel": "⚠ Wh 加 because 加 example"
    },
    "slide2_formula": {
      "pill_label": "公式",
      "headline": "{H}P1 Formula{/H}",
      "formula_display": "Yes/No + Wh-detail + because + brief example",
      "card_body": "{Y}Q: Do you like cooking? A: Yeah, I actually do, especially on weekends when I'm not in a rush, because it's the one part of my day that feels a bit creative, like last Sunday I tried making my mum's pumpkin soup from scratch.{/Y}",
      "speech_bubble": "3 步走！"
    },
    "slide3_component1": {
      "pill_label": "成分 ①",
      "headline": "{H}Direct 加 Wh-extension{/H}",
      "card_body": "Direct: {Y}Yes / No / Kind of{/Y}. Wh-extension: {Y}when / where / why I do this{/Y} ({Y}especially on weekends when...{/Y}).",
      "common_error": "❌ 只回答 Yes 然后停",
      "speech_bubble": "加 wh！"
    },
    "slide4_component2": {
      "pill_label": "成分 ②",
      "headline": "{H}Because 加 Example{/H}",
      "card_body": "Because: {Y}because it's the one part of my day that feels creative{/Y} (reason). Example: {Y}like last Sunday I tried...{/Y} (concrete instance).",
      "common_error": "❌ Because 接抽象大道理, 没具体例子",
      "speech_bubble": "具体例子！"
    },
    "slide5_example": {
      "headline": "{H}3 题模板示范{/H}",
      "card_body": "Q: Do you prefer morning or night?\nA: {Y}Definitely mornings, especially before everyone wakes up, because that's when I get my clearest thinking done, like I usually write in my journal between 6 and 7.{/Y}\n\n(2 到 3 sentences, 大约 25 sec, natural delivery)",
      "speech_bubble": "这才是 7+！"
    },
    "slide6_cta": {
      "headline": "想让 AI 给\n{H}你的 P1 答案打分？{/H}"
    }
  }
}
```

---

## Post 56 — concession-counter-formula — T7

**Topic:** Concession + counter formula for Task 2 sophistication
**Save trigger:** Concession 短语 5 个 + counter 短语 5 个

```json
{
  "post_meta": {
    "template": "T7",
    "topic": "Concession-counter formula",
    "slug": "concession-counter-formula"
  },
  "slides": {
    "slide1_hook": {
      "headline": "{P}让步加反驳{/P}\n证明你 {H}思维成熟{/H}！",
      "sublabel": "⚠ 7+ 必备 reasoning pattern"
    },
    "slide2_formula": {
      "pill_label": "公式",
      "headline": "{H}Concession 加 Counter{/H}",
      "formula_display": "[Concession to opposing view] + [pivot] + [stronger counter]",
      "card_body": "{Y}Admittedly, screen time can interfere with sleep. However, the more pressing concern is the erosion of sustained attention.{/Y}",
      "speech_bubble": "让步再打！"
    },
    "slide3_component1": {
      "pill_label": "成分 ①",
      "headline": "{H}Concession 菜单{/H}",
      "phrase1": "Admittedly, ...",
      "phrase2": "Granted, ...",
      "phrase3": "While it is true that ...",
      "phrase4": "Of course, ...",
      "phrase5": "Whilst opponents may argue ...",
      "speech_bubble": "先承认！"
    },
    "slide4_component2": {
      "pill_label": "成分 ②",
      "headline": "{H}Counter 菜单{/H}",
      "phrase1": "However, ...",
      "phrase2": "Nevertheless, ...",
      "phrase3": "Yet ...",
      "phrase4": "On closer examination, ...",
      "phrase5": "The reality is that ...",
      "speech_bubble": "再反击！"
    },
    "slide5_example": {
      "headline": "{H}Task 2 完整例子{/H}",
      "card_body": "{Y}Granted, banning private cars in city centres would impose short-term inconvenience on commuters. Yet on closer examination, the long-term gains in air quality and public health considerably outweigh this temporary friction, as demonstrated by Oslo's experience since 2019.{/Y}",
      "speech_bubble": "一段 1 组就够！"
    },
    "slide6_cta": {
      "headline": "想让 AI 评\n{H}你的 reasoning 深度？{/H}"
    }
  }
}
```

---

## Summary

**Total posts produced:** 56 (one for every outline in Agent 1's `outlines.md`).

**Count per template:**
- T1 — Mistakes: 8 (posts 1 to 8)
- T2 — Band 6 vs Band 8: 8 (posts 9 to 16)
- T3 — Say This Instead: 8 (posts 17 to 24)
- T4 — Real Answer Fix: 8 (posts 25 to 32)
- T5 — Exam Strategy: 8 (posts 33 to 40)
- T6 — Myth Busting: 8 (posts 41 to 48)
- T7 — Mini Lesson / Formula: 8 (posts 49 to 56)

**Skipped or merged outlines:** None. All 56 outlines were expanded into full 6-slide post blocks.

**T3 topic-vocab posts (21 to 24) note:** Agent 1 supplied 5 paired upgrades per topic (environment / education / technology / health). The T3 template has 3 upgrade slides, so I picked the strongest 3 per topic and consolidated the remaining items into the slide 5 summary tips and context notes rather than splitting into extra posts. Specifically:
- Post 21 (environment): kept damage / pollution / save-animals as the 3 upgrade slides; the "global warming → climate crisis" and the implicit "convenient" angle live in the summary line. Animals to biodiversity covers the original biodiversity / wildlife pair.
- Post 22 (education): kept student / learn / teach as the 3 upgrade slides; school to institution and knowledge to expertise are implied in the registers-by-age summary.
- Post 23 (technology): kept technology / use / convenient as the 3 upgrades; phone and internet collapsed into the field-specific summary.
- Post 24 (health): kept healthy / sick / doctor-hospital (combined) as 3 upgrades; disease to ailment lives in the summary.

**T7 formula posts (49 to 56) note:** Per Agent 1's flag about a potential `formula_block` field, the canonical reference draft has no such field, so I used the schema in agent_2_prompt.md (`slide2_formula` plus `slide3_component1`, `slide4_component2`, `slide5_example`). Each `slide2_formula` includes a `formula_display` string holding the formula itself (in addition to `headline`, `card_body`, `speech_bubble`) so the image-gen pipeline can render it as a large central element. Components include `common_error` callouts where the outline asked for them. Recommend Agent 4 standardise `formula_display` as an official field name.

**Consistency conventions used (for Agent 3 and Agent 4):**
- Every slide has `headline` (Chinese, max 2 lines) and most have `speech_bubble`.
- `card_body` is the English example block; only English target words wrapped in `{Y}...{/Y}`.
- `{P}...{/P}` used for the hook-slide power word (e.g. number, key term being attacked).
- `{H}...{/H}` used on the key Chinese phrase in headlines and on accent words in body text.
- All CTAs end with a question framed `{H}...?{/H}` and assume the slide 6 image template carries the `IELTSBoost.AI` + free AI correction + 1-minute result block. The CTA `headline` is the only varying text.
- No em-dashes inside JSON string values; commas, periods, and colons used instead. Em-dashes preserved in markdown post-header lines only (structural, not content).

**Friction for round-2 prompt refinement (for Agent 4):**

1. **T7 formula field naming:** agent_2_prompt.md lists `slide2_formula` but does not specify the inner field for the formula itself. I introduced `formula_display`; please ratify or rename. Same for `common_error` (used in T7 slides 3 / 4 to call out the typical mistake, useful pedagogically but not in the schema).
2. **T2 reason fields:** agent_2_prompt.md says "adapt to what the slide needs but keep the field names consistent." I used `reason1` / `reason2` / `reason3` on `slide3_why_weak` and `slide5_why_strong` (consistent with the archive). Recommend formalising this in the prompt.
3. **T4 issue / change fields:** used `issue1/2/3` on `slide3_problems` and `change1/2/3` on `slide5_key_changes`. Same recommendation.
4. **T5 step_desc:** used `step_desc` as the body field for steps 1 to 3 and `card_body` for the avoid slide. Worth standardising one name.
5. **T6 myth_quote / truth_card / action_desc:** used these distinct body field names so the image pipeline can style them differently (quote block vs reveal block vs to-do block). Worth formalising.
6. **T3 upgrade slide fields:** `bad` / `better` / `best` / `context_note` mirror the archive. Solid pattern, recommend codifying.
7. **Speech bubble length:** kept all under 6 Chinese characters per the reference draft; some natural ones wanted to be 7 to 8 characters. Worth relaxing to 8 max.
8. **CTA wording:** the universal CTA in the reference draft is `"想知道你的口语\n{H}能拿几分？{/H}"` (a 2-line question). I varied the question line per post but kept the 2-line shape. Recommend Agent 4 confirm this is the canonical CTA pattern and have Agent 3 verify on every post.
9. **Outline to slide mapping for T2 (Band 6 vs 8):** the schema has `slide3_why_weak` and `slide5_why_strong` as 3-reason slides, but Agent 1's outlines sometimes only give a body bullet ("6 分弱点 3 条" etc.) rather than specific reasons. I inferred the 3 reasons in each case; Agent 3 should sanity-check fit.
10. **Markdown header em-dashes:** the post headers and the template label use em-dashes (e.g. `## Post 1 — gt-letter-tone-mistakes — T1`). I preserved these for structural readability, treating the no-em-dash rule as applying to JSON / slide content. Agent 4 may want to clarify scope explicitly in the prompt.

Handoff to Agent 3 (review).
