# IELTSBoost Full Task Breakdown

This document lists the full task roadmap for building IELTSBoost, starting from a useful V1 for Lina and extending toward a more complete platform.

Each task includes:
- goal
- explanation
- deliverables
- notes / dependencies where relevant

---

# Phase 0: Product definition and setup

## Task 0.1 Define V1 boundaries
### Goal
Lock the first version to a manageable and useful scope.

### Explanation
The platform can grow large very quickly. Before building, define exactly what the first version includes so development stays focused. Since Lina is the first real user and has an exam in 10 days, V1 should optimize for immediate usefulness.

### Deliverables
- written V1 scope
- written non goals
- feature priority order

### V1 should include
- writing text input
- image upload
- PDF upload
- OCR to editable text
- writing scoring and feedback
- bilingual UI
- bilingual feedback
- basic speaking practice
- simple dashboard
- submission history
- mistake tracking at a basic level

### V1 should exclude
- full tutor marketplace
- reading/listening complete system
- advanced payments
- full admin back office
- institution features

---

## Task 0.2 Define user journeys
### Goal
Clarify the main flows before coding.

### Explanation
The system should support realistic user paths. This reduces confusion when implementing routes, UI, and database design.

### Deliverables
Document the following flows:
1. New user visits landing page
2. User switches app language
3. User opens writing page
4. User pastes essay
5. User uploads handwritten image
6. User uploads PDF
7. User reviews extracted text
8. User submits essay
9. User views writing feedback
10. User checks dashboard
11. User practices speaking
12. User views submission history
13. User changes feedback language

---

## Task 0.3 Decide core tech stack
### Goal
Choose the fastest and most maintainable stack.

### Explanation
Because the goal is fast execution, stack choice should favor speed and quality. Keep the app clean and simple.

### Deliverables
Choose:
- frontend framework
- backend framework or server routes
- database
- auth provider
- file storage solution
- OCR / AI pipeline method
- deployment target

### Notes
A fast modern stack such as Next.js plus a hosted database and object storage is likely the best route.

---

# Phase 1: Information architecture and UI planning

## Task 1.1 Define app sitemap
### Goal
Decide the core page structure.

### Explanation
The project needs a clear information architecture so the UI feels intentional.

### Deliverables
Define routes/pages for:
- landing page
- dashboard
- writing
- speaking
- history
- settings

Future routes:
- tutors
- pricing
- reading
- listening
- study plan

---

## Task 1.2 Define navigation structure
### Goal
Make moving through the product simple.

### Explanation
Users should immediately understand where to practice, where to see progress, and where to adjust preferences.

### Deliverables
Design:
- main sidebar or top nav
- top right language toggle
- feedback language selector location
- mobile fallback nav

---

## Task 1.3 Define design system direction
### Goal
Make the product feel premium and consistent.

### Explanation
Even a fast built product should feel deliberate. A lightweight design system prevents messy UI later.

### Deliverables
Define:
- color palette
- typography
- spacing rules
- button styles
- card styles
- form styles
- upload area style
- feedback score card style
- chart style

---

## Task 1.4 Create wireframes for all core pages
### Goal
Map the full user interface before implementation.

### Explanation
Wireframes allow fast iteration and keep Claude aligned when building.

### Deliverables
Wireframes for:
- landing page
- dashboard
- writing page
- OCR review page/state
- writing results page
- speaking page
- history page
- settings page

---

# Phase 2: Internationalization and bilingual architecture

## Task 2.1 Create UI language system
### Goal
Support English and Simplified Chinese across the interface.

### Explanation
The app needs a clean language toggle that changes interface text without cluttering the UI.

### Deliverables
- language dictionary structure
- English copy set
- Simplified Chinese copy set
- toggle component
- persistence behavior

### Notes
This should cover:
- nav labels
- buttons
- forms
- instructions
- placeholders
- empty states
- upload messages
- errors

---

## Task 2.2 Separate UI language from feedback language
### Goal
Allow users to use one UI language while receiving AI feedback in another language.

### Explanation
This is important because some users may want Chinese UI but English feedback, or vice versa.

### Deliverables
- app state model for UI language
- app state model for feedback language
- settings and defaults
- submission payload support for feedback language

---

## Task 2.3 Write bilingual UX copy
### Goal
Ensure the app feels natural in both languages.

### Explanation
Copy should not feel machine translated. It should be written in a helpful, learner friendly way.

### Deliverables
Write bilingual copy for:
- onboarding text
- writing instructions
- upload instructions
- OCR review instructions
- speaking instructions
- dashboard helper text
- error messages
- success messages

---

# Phase 3: Data model and backend structure

## Task 3.1 Design core database schema
### Goal
Create a schema that supports current features and future expansion.

### Explanation
The database should handle users, submissions, results, languages, and future tutor features without rework.

### Deliverables
Define tables for:
- users
- user_settings
- writing_submissions
- writing_extracted_text_versions
- writing_feedback_results
- speaking_submissions
- speaking_feedback_results
- mistake_categories
- user_mistake_events
- practice_sessions
- future tutor tables placeholder plan

---

## Task 3.2 Design file storage structure
### Goal
Store uploaded files cleanly and safely.

### Explanation
The system must support uploaded images and PDFs tied to submissions.

### Deliverables
Define storage paths / conventions for:
- original uploads
- processed files if needed
- user scoped storage
- temporary OCR artifacts if needed

---

## Task 3.3 Define submission lifecycle states
### Goal
Standardize status handling for uploads and analysis.

### Explanation
Submissions move through several states. These should be explicit.

### Deliverables
Define states such as:
- draft
- uploaded
- text_extracted
- awaiting_user_review
- ready_for_analysis
- analysis_in_progress
- analysis_complete
- analysis_failed

---

# Phase 4: Authentication and user settings

## Task 4.1 Implement authentication
### Goal
Allow users to sign in and retain history.

### Explanation
Lina and later users need persistent history and settings.

### Deliverables
- sign up
- sign in
- sign out
- session persistence

---

## Task 4.2 Build user settings model
### Goal
Persist personalization choices.

### Explanation
Users should not need to reset language preferences constantly.

### Deliverables
Settings for:
- UI language
- feedback language
- target band score later
- exam date later

---

# Phase 5: Writing input system

## Task 5.1 Build writing page UI
### Goal
Create the main writing practice interface.

### Explanation
This page is the core of the product. It should support all input methods cleanly.

### Deliverables
Writing page with:
- task type selector
- prompt selector or prompt display area
- large text area
- upload area
- word count
- submission controls
- feedback language selector
- clear instructions

---

## Task 5.2 Build text submission flow
### Goal
Support users typing or pasting directly.

### Explanation
This is the simplest path and must be smooth.

### Deliverables
- text input component
- validation
- task type association
- save draft behavior if desired
- submit button

---

## Task 5.3 Build image upload flow
### Goal
Allow handwritten essays and screenshots to be submitted.

### Explanation
Many users will practice by hand or outside the app, so image upload is a major differentiator.

### Deliverables
- image upload component
- accepted file type validation
- preview display
- upload progress state
- backend file handling

---

## Task 5.4 Build PDF upload flow
### Goal
Allow document based submissions.

### Explanation
Users may write in Word or export to PDF. This should be supported.

### Deliverables
- PDF upload component
- validation
- backend handling
- extraction path for text PDF and image based PDF

---

## Task 5.5 Build OCR/text extraction pipeline
### Goal
Convert uploaded files into editable text.

### Explanation
All writing analysis should work from final text, regardless of source format.

### Deliverables
- extraction service
- OCR integration for images
- PDF text extraction
- fallback OCR for scanned PDFs
- extraction result object

---

## Task 5.6 Build extracted text review step
### Goal
Let users confirm and fix extracted text before scoring.

### Explanation
OCR is imperfect. Users need control over final text.

### Deliverables
- extracted text editor UI
- original file preview if useful
- warning if extraction quality is uncertain
- confirm and continue flow

---

## Task 5.7 Add writing prompt support
### Goal
Structure the submission around IELTS style tasks.

### Explanation
Users should know whether they are answering Task 1 or Task 2 and what the prompt is.

### Deliverables
- task selector
- prompt text area or chosen prompt display
- optional prompt library later

---

## Task 5.8 Add word count logic
### Goal
Provide useful IELTS specific guidance.

### Explanation
IELTS writing tasks have minimum word expectations. This is a simple but high value feature.

### Deliverables
- live word count
- under minimum warning
- task dependent thresholds

---

# Phase 6: Writing scoring and feedback engine

## Task 6.1 Define writing evaluation schema
### Goal
Standardize the format of the feedback result.

### Explanation
The front end and AI output need a stable structure.

### Deliverables
JSON style response schema including:
- overall_band_estimate
- criterion_scores
- strengths
- weaknesses
- sentence_feedback
- grammar_issues
- vocabulary_issues
- rewrite_examples
- top_3_priorities
- summary_message

---

## Task 6.2 Write English scoring prompt
### Goal
Generate useful and consistent writing analysis in English.

### Explanation
The AI prompt should produce structured IELTS style feedback, not vague tutor chatter.

### Deliverables
Prompt that instructs the model to:
- estimate band
- score criteria
- explain clearly
- give actionable feedback
- avoid overclaiming official score status

---

## Task 6.3 Write Simplified Chinese scoring prompt
### Goal
Generate useful and natural feedback in Chinese.

### Explanation
This should not be a raw translation of English feedback. It should feel like clear teacher style guidance for Chinese learners.

### Deliverables
Chinese version of the scoring prompt and output handling.

---

## Task 6.4 Build scoring API route / service
### Goal
Run writing analysis when text is submitted.

### Explanation
This service takes final text plus metadata and returns structured feedback.

### Deliverables
- backend analysis endpoint
- model call integration
- result parsing
- error handling
- storage of results

---

## Task 6.5 Build writing results page
### Goal
Display the feedback clearly and persuasively.

### Explanation
The feedback page is where the product proves its value.

### Deliverables
Results UI showing:
- overall band score
- criterion cards
- strengths
- weaknesses
- highlighted issues
- rewrites
- top 3 next improvements
- optionally original text side by side

---

## Task 6.6 Build mistake categorization layer
### Goal
Track recurring writing weaknesses over time.

### Explanation
This powers personalization and makes the app more valuable than a one off grader.

### Deliverables
- rules or AI based tagging for mistakes
- categories stored to database
- per submission mistake events
- summary generation

---

# Phase 7: Speaking module

## Task 7.1 Design speaking practice flow
### Goal
Create a lightweight but useful first version of speaking practice.

### Explanation
Speaking should be valuable quickly, even if audio analysis is basic at first.

### Deliverables
Define flow for:
- select part 1, 2, or 3
- receive prompt
- answer by text or audio
- get feedback

---

## Task 7.2 Build speaking page UI
### Goal
Let users practice speaking in a focused environment.

### Deliverables
- part selector
- prompt area
- response input area
- optional audio upload/record later
- submit button
- feedback language control

---

## Task 7.3 Build speaking prompt library or generator
### Goal
Provide realistic IELTS speaking questions.

### Deliverables
- initial set of prompts for Part 1, 2, 3
- data structure for prompts
- optional randomizer

---

## Task 7.4 Build speaking feedback engine
### Goal
Return useful AI feedback on speaking responses.

### Explanation
Even if users submit text initially, the app can still help with content, structure, vocabulary, and coherence.

### Deliverables
Feedback including:
- estimated level/band style feedback
- strengths
- weaknesses
- stronger response
- better phrase suggestions

---

## Task 7.5 Add audio workflow later if desired
### Goal
Support a more realistic speaking experience.

### Deliverables
- audio recording/upload
- transcription step
- feedback on transcript
- optional fluency observations

---

# Phase 8: Dashboard and progress tracking

## Task 8.1 Design dashboard data model
### Goal
Determine what the dashboard should summarize.

### Explanation
The dashboard should turn raw submission history into actionable guidance.

### Deliverables
Define initial widgets for:
- estimated writing trend
- recent speaking activity
- frequent mistakes
- recommended next focus
- latest scores
- total submissions

---

## Task 8.2 Build dashboard UI
### Goal
Give users a practical overview of progress.

### Deliverables
Dashboard with:
- welcome summary
- recent activity cards
- charts or trend summaries
- recurring issue section
- next recommended action section

---

## Task 8.3 Build recommendation logic
### Goal
Suggest what users should practice next.

### Explanation
This is one of the main ways the product becomes personalized.

### Deliverables
Simple recommendation logic based on:
- most common mistakes
- lowest scoring criterion
- recent inactivity
- task type imbalance

---

## Task 8.4 Build submission history pages
### Goal
Allow users to review prior work and feedback.

### Deliverables
- writing history list
- speaking history list
- detail pages
- filters by type/date later

---

# Phase 9: QA, edge cases, and polish

## Task 9.1 Handle upload edge cases
### Goal
Prevent frustrating failures.

### Explanation
Uploads are messy in the real world.

### Deliverables
Support or gracefully fail for:
- blurry images
- rotated images
- huge files
- unsupported file types
- low text extraction quality
- empty PDFs
- mixed language content

---

## Task 9.2 Handle scoring failures gracefully
### Goal
Keep user trust even when AI output fails.

### Deliverables
- retry logic if appropriate
- user friendly error states
- partial save of submission
- ability to resubmit

---

## Task 9.3 Review bilingual consistency
### Goal
Ensure the app feels complete in both languages.

### Deliverables
- audit all major pages in English
- audit all major pages in Chinese
- review truncation / layout issues
- review unnatural translation

---

## Task 9.4 Improve mobile usability
### Goal
Make uploads and quick practice usable on phones.

### Explanation
Many users will upload handwritten photos from mobile.

### Deliverables
- mobile responsive writing page
- mobile friendly upload flow
- mobile readable results page
- top right language toggle behavior on mobile

---

# Phase 10: Landing page and launch readiness

## Task 10.1 Build landing page
### Goal
Present IELTSBoost as a real product.

### Explanation
Even before full growth, the landing page should communicate value clearly.

### Deliverables
Landing page sections:
- hero
- benefits
- how it works
- writing / speaking highlights
- bilingual support highlight
- CTA to try
- optional Lina story later

---

## Task 10.2 Write value proposition copy
### Goal
Make the positioning clear and compelling.

### Deliverables
Copy focused on:
- instant IELTS writing feedback
- bilingual support
- upload handwritten essays
- progress tracking
- AI plus future human help

---

## Task 10.3 Add analytics / event tracking
### Goal
Understand real user behavior once launched.

### Deliverables
Track:
- signups
- language choice
- writing submissions
- upload type usage
- speaking usage
- feedback viewed
- repeat sessions

---

# Phase 11: Tutor layer planning, later

## Task 11.1 Define tutor assisted product model
### Goal
Design the hybrid AI plus human future.

### Explanation
Human help can become a premium layer once the AI product works.

### Deliverables
Define options such as:
- Lina as featured tutor
- essay review add on
- speaking mock sessions
- premium coaching package

---

## Task 11.2 Design tutor data model
### Goal
Prepare for future tutor support.

### Deliverables
Future schema planning for:
- tutors
- tutor_profiles
- tutor_availability
- tutor_bookings
- tutor_reviews
- tutor_services

---

## Task 11.3 Define marketplace vs curated model
### Goal
Choose how tutor support should evolve.

### Explanation
An open marketplace adds operational complexity. A curated model is likely better initially.

### Deliverables
Decision document comparing:
- featured tutor only
- curated small tutor network
- open marketplace later

---

# Phase 12: Longer term extensions

## Task 12.1 Reading module planning
### Goal
Expand to additional IELTS sections later.

### Deliverables
Feature concept for:
- question sets
- timing
- score tracking
- explanations

---

## Task 12.2 Listening module planning
### Goal
Expand IELTS coverage later.

### Deliverables
Feature concept for:
- audio questions
- transcripts
- explanations
- score tracking

---

## Task 12.3 Study plan engine
### Goal
Create personalized prep plans.

### Deliverables
Plan engine based on:
- target band
- current band
- exam date
- weak areas
- recommended daily tasks

---

## Task 12.4 Pricing and monetization design
### Goal
Prepare for business viability.

### Deliverables
Possible plans:
- free tier
- pro subscription
- premium review
- tutor sessions

---

# Suggested build order

## Immediate build order
1. V1 boundary definition
2. page structure and wireframes
3. language system
4. database schema
5. auth and settings
6. writing page
7. image/PDF upload
8. OCR extraction
9. editable extraction review
10. scoring engine
11. results page
12. submission history
13. mistake categorization
14. dashboard
15. speaking module
16. landing page polish

## Immediate practical first slice
If building the smallest useful version first:
1. auth optional or minimal
2. writing text input
3. image upload
4. OCR
5. editable extracted text
6. writing scoring
7. bilingual feedback
8. basic results page
9. save submissions
10. simple dashboard

---

# Definition of done for V1

V1 is done when:
- a user can open IELTSBoost
- switch UI language between English and Chinese
- choose writing task mode
- paste an essay or upload image/PDF
- review extracted text
- submit for analysis
- receive structured IELTS style feedback
- view results in selected feedback language
- return later and see prior submissions
- view a dashboard with basic progress and recurring weaknesses
- use an initial speaking practice flow

---

# Key product differentiators to preserve during build

These should not get lost:
1. bilingual UI and feedback
2. handwritten essay support
3. PDF support
4. editable OCR review
5. practical feedback, not generic feedback
6. recurring mistake tracking
7. future AI plus human tutor layer

---

# Final instruction for implementation

When implementing, prioritize usefulness over perfection.
The platform should be narrow but excellent in the core experience:
submit practice, get strong feedback, understand what to improve next.


## Task X.1 Implement Supabase Auth

### Goal
Enable user authentication using Supabase.

### Deliverables
- Supabase project setup
- enable Google OAuth
- login UI
- session persistence
- protected routes

---

## Task X.2 Add WeChat login (Phase 2 priority)

### Goal
Support Chinese users with native login.

### Explanation
WeChat login is critical for adoption in China but may require additional setup.

### Deliverables
- WeChat OAuth integration
- mapping to Supabase user
- fallback handling

### Note
This can be implemented after initial launch if needed.


## Task X.3 Set up Supabase database schema

### Goal
Create all core tables in Supabase.

### Deliverables
Tables:

users (handled by Supabase auth)

user_settings
- id
- user_id
- ui_language
- feedback_language
- plan_type
- created_at

writing_submissions
- id
- user_id
- input_type (text, image, pdf)
- original_file_url
- extracted_text
- final_text
- task_type
- created_at

writing_feedback
- id
- submission_id
- overall_band
- task_score
- coherence_score
- lexical_score
- grammar_score
- feedback_json
- created_at

usage_tracking
- id
- user_id
- date
- writing_count
- speaking_count

speaking_submissions
- id
- user_id
- prompt
- response_text
- created_at

speaking_feedback
- id
- submission_id
- feedback_json
- created_at


## Task X.4 Implement daily usage limits

### Goal
Limit free users to 2 writing submissions per day.

### Explanation
This enforces monetization while still allowing meaningful free usage.

### Deliverables
- middleware or API check before submission
- increment usage counter after submission
- reset counts daily

---

## Task X.5 Enforce Pro unlimited usage

### Goal
Allow Pro users unlimited submissions.

### Deliverables
- plan_type check
- bypass usage limits for Pro users

---

## Task X.6 Add upgrade prompts

### Goal
Encourage conversion to Pro.

### Deliverables
- error message when limit reached
- UI prompt suggesting upgrade
- simple upgrade CTA


## Task X.7 Define subscription model

### Goal
Support Pro plan at 200 RMB per month.

### Deliverables
- pricing page
- plan metadata in database
- user plan assignment

---

## Task X.8 Integrate payment provider (later)

### Goal
Enable payments for Chinese and global users.

### Options
- Stripe (global)
- WeChat Pay / Alipay (China)

### Note
This can be delayed until after validation.


## Task X.9 Store all AI outputs

### Goal
Persist every AI response for analysis and product improvement.

### Explanation
This is critical for:
- debugging
- improving prompts
- building future ML models
- user history

### Deliverables
- store full raw AI response JSON
- store parsed structured fields
- link to submission