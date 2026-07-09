# Douyin Post Ideas — Multi-Agent Pipeline

Goal: produce **50+ post ideas** for the IELTSBoost Douyin slideshow content engine, as a single canonical `post_ideas.md` Michael can review and feed into image generation.

## Files in this folder

| File | Owner | Purpose |
|---|---|---|
| `outlines.md` | Agent 1 | 50+ short outlines, one per idea |
| `post_ideas.md` | Agent 2 | Full 6-slide JSON content for every outline — the deliverable |
| `review_notes.md` | Agent 3 | Per-post verdict + aggregate patterns |
| `agent_4_log.md` | Agent 4 (me) | Process notes + record of every prompt refinement |
| `agent_prompts/agent_1_prompt.md` | Agent 4 maintains | The prompt to paste when launching Agent 1 |
| `agent_prompts/agent_2_prompt.md` | Agent 4 maintains | The prompt for Agent 2 |
| `agent_prompts/agent_3_prompt.md` | Agent 4 maintains | The prompt for Agent 3 |

## How to run the loop

Each agent is launched in its own session (or as a subagent call). Recommended flow:

1. **Round 1 — Agent 1** — paste the contents of `agent_prompts/agent_1_prompt.md` into a fresh Claude session. It writes `outlines.md`.
2. **Round 1 — Agent 2** — paste `agent_prompts/agent_2_prompt.md`. It reads `outlines.md` and writes `post_ideas.md`.
3. **Round 1 — Agent 3** — paste `agent_prompts/agent_3_prompt.md`. It reads `post_ideas.md` and writes `review_notes.md`.
4. **Agent 4 between rounds** — Michael returns to this session, says "review the round", I read all three outputs, refine whichever prompts produced weak results, and log the change in `agent_4_log.md`.
5. **Round 2+** — re-run the affected agents with the updated prompts until `review_notes.md` shows the SHIP rate is high enough.

## What Agent 4 does not do

I do not generate ideas, write posts, or run the reviews. I tune the prompts. The other three agents do the actual production work — they get fresh context each session and benefit from a tight, evolving prompt rather than a long conversation history.

## When the loop is done

`post_ideas.md` should have 50+ posts, mostly marked SHIP by Agent 3, distributed across the 7 weekly templates. Michael then picks which ones to push into the existing draft/image-gen pipeline (`drafts/` folder one level up).
