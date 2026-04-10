# IELTSBoost
AI powered IELTS prep platform focused on writing, speaking, score improvement, and optional human tutor support.

## Core vision

IELTSBoost is a bilingual IELTS preparation platform designed primarily for Chinese and English speaking learners. The first real user is Lina, who is taking the IELTS exam in 10 days. The immediate goal is to build a genuinely useful product for her daily practice and improvement. The longer term goal is to turn this into a scalable business.

This product should feel practical, modern, and outcome focused.

The user should feel:
- I can practice quickly
- I can submit my work in whatever format is easiest
- I get useful feedback immediately
- I can track my progress over time
- I know exactly what to improve next

The platform should be AI first, but designed so that it can later support human tutor services, including Lina and possibly other tutors.

## Product positioning

This is not just an AI chatbot and not just a static IELTS practice site.

This is:
- an AI IELTS improvement platform
- focused on measurable band score improvement
- built around personalized feedback and progress tracking
- bilingual in English and Simplified Chinese
- designed for real practice workflows, including handwritten essays and uploaded documents

## Target users

### Primary initial user
Lina, preparing for the IELTS exam in 10 days.

### Early public users
Chinese IELTS learners who:
- are paying too much for tutoring
- want a cheaper alternative
- want fast writing and speaking feedback
- may prefer explanations in Chinese
- may write by hand or in other apps before uploading work

### Longer term users
- IELTS learners globally
- users who want AI plus human tutor support
- users who want structured prep plans toward a target band score

## Core product principles

1. Outcome over novelty
The product should help users improve band score, not just impress them with AI.

2. Fast feedback
Users should be able to submit work and get results quickly.

3. Flexible input
Users must be able to submit essays through text, images, and PDFs. Later this can expand further.

4. Bilingual support
The platform must support both English and Simplified Chinese in a clean way.

5. Clear next steps
Feedback should not be generic. It should tell users exactly what to improve next.

6. Real world practice
The product should support how users actually practice, including handwritten work and external documents.

7. Personalization
Over time, the system should track recurring mistakes and adapt recommendations.

## Initial product scope

The first version should focus on:
- Writing
- Speaking
- Basic dashboard
- Mistake tracking
- Bilingual support

Reading and listening can come later.

## Core feature set

# 1. Writing module

The writing module is the highest priority.

Users should be able to submit IELTS Writing Task 1 or Task 2 through multiple input methods:
- typed directly into a text box
- pasted text
- uploaded image
- uploaded PDF

Future support may include DOCX, but not required initially.

## Writing input requirements

### Input methods
1. Text input
- Large writing area
- User can type or paste
- Optional word count display
- Optional timer later

2. Image upload
- JPG and PNG initially
- User can upload photo of handwritten essay
- Mobile friendly

3. PDF upload
- Extract text from PDF if possible
- If PDF is image based, use OCR

## OCR and extraction pipeline
All non text submissions should be converted into text before scoring.

Flow:
1. User uploads image or PDF
2. System extracts text
3. System displays extracted text in editable format
4. User reviews and corrects extraction if needed
5. User submits final text for scoring

This editable preview is important because OCR is imperfect.

## Writing feedback requirements
Once the final essay text is submitted, the system should generate:
- estimated overall band score
- estimated score by the 4 IELTS criteria
  - Task Achievement / Task Response
  - Coherence and Cohesion
  - Lexical Resource
  - Grammatical Range and Accuracy
- strengths
- weaknesses
- sentence level feedback
- grammar and vocabulary improvement suggestions
- stronger rewritten examples
- optional higher band sample rewrite
- top 3 things to fix next

## Writing feedback language
The user should be able to choose feedback language:
- English
- Simplified Chinese

The UI language and feedback language should be separately controlled.

## Writing mistake tracking
The system should categorize repeated mistakes over time, for example:
- grammar
- awkward phrasing
- weak vocabulary
- repetition
- structure
- coherence issues

This should feed the dashboard and future study recommendations.

# 2. Speaking module

The speaking module should allow users to practice IELTS speaking in a structured way.

Initial version can be lightweight.

## Speaking practice flow
- User selects Speaking Part 1, 2, or 3
- System generates or displays prompt
- User responds by text or audio
- AI analyzes response
- AI returns:
  - estimated band feedback
  - feedback on fluency, grammar, vocabulary, coherence
  - suggested stronger response
  - possible better phrasing

Later versions can improve audio analysis.

## Feedback language
Speaking feedback should also support:
- English
- Simplified Chinese

# 3. Dashboard

The dashboard should give users a sense of progress and direction.

Initial dashboard can include:
- estimated current writing level
- recent submissions
- recent speaking submissions
- frequent mistakes
- improvement trend over time
- top recommended next practice items

Later this can expand into:
- target band score
- exam date
- countdown
- readiness estimate
- personalized study plan

# 4. Bilingual support

This is a major product differentiator and must be implemented well.

## Language system
There should be a top right language toggle for UI language:
- EN
- 中文

This should persist across sessions if possible.

## Separate controls
There are two separate concepts:
1. UI language
2. Feedback language

UI language affects:
- buttons
- labels
- navigation
- instructions

Feedback language affects:
- AI explanations
- error descriptions
- band analysis
- vocabulary suggestions
- grammar explanations

The app should allow a clean experience without mixing both languages all over the interface.

## Chinese support details
Use Simplified Chinese.
Chinese explanations should feel natural and useful for learners, not like awkward machine translation.

Where useful, examples can include:
- English phrase
- Chinese explanation
- why it is better

# 5. Human tutor layer, later roadmap

The platform should eventually support human tutors.

Initial human layer idea:
- Lina can be the first featured tutor
- users can optionally book human review or sessions

Longer term:
- tutor profiles
- tutor listings
- speaking mock interview sessions
- essay review services
- commission based marketplace

Do not build the full marketplace in V1, but keep architecture flexible enough that this can be layered in later.

## Product roadmap

### Phase 1
Build for Lina to use immediately.
Focus on:
- writing input flexibility
- OCR
- writing feedback
- speaking practice
- simple dashboard
- bilingual UI and bilingual feedback

### Phase 2
Open to public users.
Add:
- authentication
- saved history
- cleaner dashboard
- more structured practice flows
- better progress analytics

### Phase 3
Premium and hybrid platform.
Add:
- tutor booking
- manual review
- coaching
- possibly marketplace

## Technical direction

The app should be modern and clean.
It should feel premium, not cluttered.

### Frontend considerations
- modern SaaS design
- simple navigation
- mobile friendly enough for uploads
- top right language toggle
- clean writing submission experience
- editable OCR preview before scoring

### Backend considerations
Need support for:
- user submissions
- file upload handling
- OCR / text extraction
- AI scoring pipeline
- result storage
- progress tracking
- language selection
- future tutor layer

## Suggested initial page structure

1. Landing page
2. Dashboard
3. Writing practice
4. Speaking practice
5. Submission history
6. Settings

Later pages:
- tutor section
- pricing
- study plan
- reading
- listening

## UX notes

### Writing page
Must support:
- paste or type essay
- upload image
- upload PDF
- editable extracted text preview
- submit for analysis
- see clear feedback

### Feedback page
Should clearly display:
- overall estimated band
- criterion scores
- what was done well
- what needs improvement
- specific corrections
- rewritten stronger examples
- next recommended focus

### Dashboard
Should feel actionable, not just informational.

Good examples:
- Your most common grammar mistake this week
- Your coherence score is improving
- Practice Task 2 argument structure next

## Important build priorities

Priority order:
1. Writing submission and analysis
2. OCR and extracted text review
3. Bilingual system
4. Speaking practice
5. Dashboard and mistake tracking
6. Authentication and persistence
7. Tutor layer later

## Non goals for V1
Do not overbuild these initially:
- full tutor marketplace
- reading and listening full library
- gamification heavy features
- social features
- institution admin tools
- overly complex analytics

## Success criteria for V1
V1 is successful if:
- Lina genuinely uses it
- Lina finds feedback useful
- Lina improves through repeated practice
- the platform handles text, image, and PDF submissions cleanly
- English and Chinese experience both feel usable
- the dashboard helps identify recurring weaknesses

## Brand
Project name: IELTSBoost

Tone:
- clear
- practical
- confidence building
- modern
- premium but approachable

This should feel like a real product from day one, even if the first version is narrow.



## Authentication and User Access

The platform should support modern authentication methods.

### Required auth providers
- Google login (initial implementation)
- WeChat login (priority for Chinese market, implemented shortly after)

Users should be able to:
- sign up and log in easily
- persist their data across sessions
- access submission history and progress

WeChat login is especially important for:
- Chinese students
- mobile-first usage
- trust and familiarity in China

---

## Database and Backend

The platform will use Supabase as the core backend.

Supabase will be used for:
- PostgreSQL database
- authentication (Google and later WeChat)
- file storage (images, PDFs)
- row level security for user data

The system should be designed around Supabase from the beginning.

---

## Data Tracking and Storage

The system must store all relevant data for each user interaction.

For writing submissions, store:
- original input type (text, image, PDF)
- original uploaded file (if applicable)
- extracted text
- final edited text
- timestamp
- task type (Task 1 or Task 2)

For AI feedback, store:
- overall band estimate
- criterion scores
- full structured feedback response
- detected mistake categories
- feedback language used

For speaking submissions, store:
- prompt used
- user response (text or transcript)
- AI feedback
- timestamp

This data will later be used for:
- progress tracking
- dashboard analytics
- personalization
- improvement recommendations

---

## Usage Limits and Pricing

The platform should implement a freemium model.

### Free tier
- 2 writing submissions per day
- limited speaking submissions per day (start with 2 later)
- access to dashboard and history

### Pro tier
- unlimited writing submissions
- unlimited speaking practice
- full access to all features

### Pricing
- Pro plan: 200 RMB per month

The system must track:
- daily usage counts per user
- reset usage counts daily
- enforce limits on submission endpoints

---

## Usage Tracking System

Each user should have:
- daily submission count (writing)
- daily submission count (speaking)
- plan type (free or pro)

The backend should:
- check usage before allowing submission
- return clear error when limit is reached
- suggest upgrading to Pro

---

## Future monetization expansion

Later additions may include:
- pay per essay review
- tutor session booking
- premium coaching plans

The system should be designed so pricing and plans can evolve.