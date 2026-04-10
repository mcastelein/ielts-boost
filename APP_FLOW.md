# IELTSBoost App Flow

## Writing Flow

1. User opens Writing page
2. User:
   - types OR
   - uploads image OR
   - uploads PDF

3. If upload:
   → OCR runs
   → extracted text shown

4. User edits text

5. User clicks Submit

6. System:
   → checks usage limits
   → sends to AI

7. AI returns structured feedback

8. Store:
   - submission
   - feedback

9. Show results page

---

## Dashboard Flow

1. Load user submissions
2. Aggregate:
   - recent scores
   - mistake categories
3. Show:
   - trend
   - recommendations

---

## Speaking Flow

1. User selects part
2. System shows prompt
3. User responds
4. AI evaluates
5. Show feedback

---

## Usage Limit Flow

1. User submits
2. Check:
   - plan_type
   - daily count

3. If free + limit reached:
   → block
   → show upgrade prompt

4. Else:
   → allow