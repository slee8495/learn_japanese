# learn_japanese — Project Reference

**GitHub repo:** https://github.com/slee8495/learn_japanese
**Live app:** deployed on Vercel (japanese-app project)
**App subdirectory:** `japanese-app/` (the actual Vite app lives one level below repo root)

This document exists so a future Claude session (working in a *different* repo, e.g. `learn_math`) can read it, look at the actual `learn_japanese` GitHub repo for concrete code, and rebuild the same product philosophy for a new subject — without re-deriving decisions that were already made and refined here through many rounds of user feedback.

---

## 1. Who this is for and why it exists

Built for a Korean-speaking couple (husband + wife) to learn Japanese together, independently, from their phones. Origin conversation (verbatim log preserved in `claude.md` at repo root) — read that file for the full back-and-forth if you want the raw reasoning trail, not just the conclusions below.

Core ask, distilled: **"If we just open the app and follow what it tells us every day for a year, we should end up conversational."** ~10 minutes/day. No login, no backend, no cost.

---

## 2. Product philosophy (the part worth copying)

These are the decisions that survived multiple rounds of user pushback — treat them as defaults, not just "how it happened to turn out":

1. **Web app (PWA), not native mobile.** No App Store review, no $99/year account, deploy in one command (`npx vercel`). Add to iOS home screen via Safari share sheet → looks and feels like a native app (see `manifest.json` + `apple-mobile-web-app-*` meta tags in `index.html`). This was an explicit, reasoned tradeoff — don't silently "upgrade" to React Native later without the user asking.

2. **No backend, no login, no accounts.** All progress lives in `localStorage`, keyed by a self-chosen display name (not auth). This means: two people can use the exact same URL on their own phones and get fully independent progress tracking, with zero setup. This was a specific requirement (couple learning together, separately) — the "multi-profile via localStorage key, no server" pattern is the reusable trick.

3. **A day-number curriculum, not a lesson-picker.** There is a fixed **start date** (`START = { y: 2026, m: 6, d: 28 }` in `curriculum.js`) and everything derives from `dayNumber = floor((today - start) / 1 day) + 1`. Day 1, Day 2, ... Day 365+. The home screen always shows "Day X" and today's 4 tasks. This is what makes "just follow what the app says" work — the user never has to decide what to study next.

4. **Home screen is a dashboard, not a lesson.** First screen = today's Day number, streak, 4 task cards (character drill / vocab / grammar / sentences), a 7-day strip, and a full month calendar you can open to jump to *any* past day and redo it. There is deliberately **no separate "progress" tab** — it was built once (`ProgressView.jsx` still exists in the tree but is unused/dead — a cleanup opportunity, not a pattern to copy) and the user correctly said the home screen already shows everything that matters. Don't build a redundant progress view; put progress signal directly on the home dashboard.

5. **Every day teaches 4 things, ~10 minutes total:**
   - **Characters** (kana drill): today's character *row* (e.g. あ/ア row) in both writing systems together, plus a **randomized reading-practice** subset of real words built from that row's characters. Randomization is seeded (`seededShuffle(arr, seed)` using `dayNum` + row index) so the same day always reproduces the same set, but different days show different word combinations — the explicit fix for "if I always drill the same 3 words I'll just memorize them, not actually learn to *read*."
   - **Vocabulary**: 5 new words/day, cycling through a curated pool (hiragana/katakana/kanji mixed deliberately from day 1 — kanji is not gated behind some "advanced" wall, it just appears with furigana).
   - **Grammar**: one grammar point per day, cycling through a leveled pool (N5 → N4 → N3 → N2), each with an explanation, bullet-point rules, and example sentences.
   - **Sentences**: 3 sentences/day, drawn from a pool that widens in difficulty as `dayNum` increases (beginner-only early, then + intermediate, then + advanced).
   - All four are marked done independently per day; home shows `doneCount/4`.

6. **Timezone correctness matters more than it sounds.** Early bug: Day number was computed off the device's local midnight, which caused an off-by-one for the user relative to when the curriculum was authored. Fixed by pinning "today" to a **fixed reference timezone** (`America/Los_Angeles`, via `Intl.DateTimeFormat`) rather than the device's local time — see `getCaliforniaToday()` in `curriculum.js`. Whatever the equivalent app does, pick one canonical timezone for "what day is it" and don't rely on raw `new Date()`.

7. **Full history is always reachable.** Initial instinct was to cap "review past days" at a 7-day window — the user explicitly rejected this ("why only 7 days, I want everything"). Current behavior: a full month-view calendar (`CalendarView.jsx`) lets you jump to *any* day since `START` and redo/review it. Default to unlimited history access, not an arbitrary recent-window cap.

8. **Be honest about hand-authored data limits.** User initially asked for 2000/5000-entry word lists. The honest answer given (and the one to repeat for `learn_math` or any similar app): hand-writing thousands of entries bloats the bundle and isn't sustainable — better to (a) size hand-authored "daily curriculum" data in the hundreds, tightly curated and sequenced, and (b) pull a much larger **reference/browse corpus** from a real open dataset via a one-time fetch script, kept separate from the daily-curriculum data. See §4 for exactly how that split was implemented here (JMdict via Jisho API, Tatoeba sentences).

9. **No fluff copy.** A motivational tagline ("꾸준함이 실력이 돼요" / "consistency builds skill") was added to the start screen and then explicitly removed on user request — keep chrome minimal, don't add motivational filler the user didn't ask for and may find corny later.

10. **Tap-to-hear pronunciation everywhere**, via the browser's built-in `SpeechSynthesisUtterance` (Web Speech API, `lang: "ja-JP"`) — zero audio files, zero cost, works offline after first load in most browsers. No external TTS service needed.

---

## 3. Architecture

Plain Vite + React (no Next.js, no router library — everything is a `useState` tab switch in `App.jsx`), styled with Tailwind CSS v4 via the `@tailwindcss/vite` plugin. No backend, no database, no API routes.

```
japanese-app/
  index.html                 # PWA meta tags, apple-mobile-web-app-*, manifest link
  public/manifest.json       # PWA manifest (name, icons, standalone display, theme color)
  public/icon-*.png, favicon.svg
  vite.config.js             # react() + tailwindcss() plugins only
  scripts/
    fetch-vocab.js           # one-time: pulls JLPT N5–N2 words from Jisho API → jlpt-words.json
    fetch-sentences.js       # one-time: pulls graded sentences from Tatoeba → tatoeba-sentences.json
  src/
    main.jsx
    App.jsx                  # root: profile gate + tab shell + bottom nav
    data/
      kana.js                 # hiragana[] / katakana[] tables — { char, romaji }, static, hand-authored
      curriculum.js            # THE core file — day-number math, per-day lesson assembly, hand-authored vocabPool/sentences/kanaReadingWords
      grammar.js               # 105 grammar lessons, leveled N5→N2, hand-authored
      vocabulary.js             # separate hand-authored vocab list (browsable, ~450 entries)
      jlpt-words.json          # generated, NOT hand-written — 960 entries (N5:100, N4:160, N3:300, N2:400), fetched once via scripts/fetch-vocab.js
      tatoeba-sentences.json   # generated — graded sentences (beginner/intermediate/advanced) fetched once via scripts/fetch-sentences.js
    hooks/
      useDailyProgress.js      # localStorage read/write, streak calc, week-status calc — keyed by profile name
      useProgress.js
    components/
      Home.jsx                 # dashboard: Day X, streak, 4 task cards, 7-day strip, "open full calendar" button
      CalendarView.jsx         # full month calendar modal, jump to any past day
      DailyLesson.jsx          # renders one of 4 task types (kana/words/grammar/sentence) for a given day
      Flashcard.jsx            # flashcard quiz mode (character → romaji)
      ReadingDrill.jsx
      VocabBook.jsx            # browsable dictionary view over jlpt-words.json (960 words), with furigana
      GrammarLesson.jsx
      KanaChart.jsx             # full hiragana/katakana reference chart
      Furigana.jsx              # renders kanji with small reading annotation above it
      ProgressView.jsx          # UNUSED / dead — built early, superseded by dashboard-on-home (see §2.4); don't resurrect this pattern
    utils/
      romajiToHiragana.js
  claude.md                    # full raw conversation log this project was built from (Korean) — read for reasoning trail
```

### Data model split (the reusable idea)

Two very different kinds of data, stored differently, on purpose:

- **Curriculum data** (`curriculum.js`, `grammar.js`, `kana.js`): small, hand-authored, hand-sequenced. This is what "Day N" pulls from — it must be curated and ordered, so it can't come from a bulk API dump. Kept in the hundreds of entries, not thousands, deliberately.
- **Reference/browse corpus** (`jlpt-words.json`, `tatoeba-sentences.json`): large, machine-fetched once via a `scripts/*.js` node script hitting a public API (Jisho.org for JMdict-based JLPT vocab, Tatoeba.org for graded example sentences), checked in as static JSON, never re-fetched at runtime. This is what backs the standalone browsable "단어장" (vocab book) tab — depth for browsing, not sequencing for daily lessons.

### Progress/state model

- `localStorage["jp_profile"]` — current user's chosen display name (no auth, just a text field).
- `localStorage["jp_daily_<profileName>"]` — `{ "YYYY-MM-DD": { kana: true, words: true, grammar: true, sentence: true } }`, one object per profile name, so switching the name effectively switches "accounts" with zero backend.
- Day number and calendar-date are always derived from the fixed `START` date + LA-timezone "today", never stored directly.

### Curriculum generation logic (`getDayLesson(dayNum)` in `curriculum.js`)

- Kana row cycles every 10 days (`d % 10`) through the gojūon rows, pairing hiragana + katakana for the same row each day.
- Reading-practice words for that row are seeded-shuffled per day so the subset changes daily without being truly random (reproducible if you revisit a past day).
- Vocab: 5-word sliding window over `vocabPool`, advances 5/day, wraps around.
- Grammar: 1 new lesson/day, cycles through the full leveled `grammarPool`.
- Sentences: 3/day from a pool that grows (`getSentencePool(dayNum)`) — beginner-only through day 60, +intermediate through day 180, +advanced after that.
- A `theme` string per day is derived from a `phase` (기초 글자 → N5 기초 → N5 심화 → N4 일상 → N4 심화 based on day ranges) + the current kana row, purely for display on the home header.

---

## 4. How to replicate this for a different subject (e.g. `learn_math`)

If you're Claude reading this from a `learn_math` repo: the subject-specific content (kana tables, JLPT words, grammar points) obviously doesn't transfer, but the **shape** should:

1. Same platform choice logic applies — ask the user, but default to recommending a web PWA over native unless they push back, for the same reasons (§2.1).
2. Same profile-less multi-user pattern: `localStorage` keyed by a self-chosen name, no auth, no backend — if the app needs to support multiple learners on separate devices with zero setup.
3. Same day-number curriculum pattern: pick one canonical timezone, compute `dayNumber` from a fixed start date, and make the home screen a dashboard driven by that number — not a menu the user has to navigate every time.
4. Same data split: hand-curate a small, ordered "daily curriculum" dataset (this is the product), and separately pull a larger reference/browse corpus from a real open dataset via a one-time fetch script if you need depth (this is a bonus feature, not the core loop). For math this might mean: hand-author a sequenced problem/concept curriculum, and separately pull a large practice-problem bank from an open source if one exists.
5. Same "full history, no artificial window" default for review/practice-past-days features.
6. Same minimalism on copy/chrome — no motivational filler text unless asked.
7. Go read the actual code at https://github.com/slee8495/learn_japanese before designing — this doc is a summary, the repo is the source of truth for exact patterns (e.g. how `seededShuffle` works, how the calendar modal is built, how `Furigana.jsx` renders ruby-text-equivalent annotations — math's analogue might be rendering formulas/steps).

---

## 5. Known rough edges (don't silently "fix" without asking — but worth knowing about)

- `ProgressView.jsx` and `useProgress.js` appear to be dead code from an earlier iteration (a separate "progress" tab) that was superseded by putting all progress signal on the home dashboard. Not deleted yet.
- `vocabulary.js` (451 hand-authored entries) and `jlpt-words.json` (960 fetched entries) overlap in purpose somewhat — worth checking which one `VocabBook.jsx` actually renders (currently: `jlpt-words.json`) before assuming both are live.
- Deploy is manual (`npx vercel` / `npx vercel --prod`, see `.vercel/README.txt` at repo root of the app) — there is no CI/CD pipeline.
