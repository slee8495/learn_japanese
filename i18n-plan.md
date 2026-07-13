# Bilingual Support (Korean / English UI) — Future Idea, Not Started

**Status:** Not scheduled. User explicitly said "일단은 마음속에 넣어놔" (just keep this in mind for now) —
do not start implementing until asked. This file exists so a future Claude session can pick this
up immediately without re-deriving the context below.

## The ask

The app is currently 100% Korean-facing (built for a Korean-speaking couple — see
`learn_japanese.md` for full product background). The user asked whether it could also serve
English-speaking learners, with the entry point being: at profile creation (the `ProfileSetup`
screen in `japanese-app/src/App.jsx`), let the user pick a flag — 🇰🇷 Korean or 🇬🇧 English — in
addition to typing a name.

**Confirmed requirement from the conversation:** it must NOT be a one-time onboarding-only choice.
Someone who already has a profile and has been using the app in Korean must be able to switch to
English later (and back), the same way progress already persists per profile. So `language` needs
to be a persisted, per-profile, changeable setting — not baked in at signup only.

## Scope — two very different sizes of work

1. **UI chrome translation (small, mechanical).** Every hardcoded Korean string across the
   component tree (buttons, headers, task labels, empty states, motivational strings, etc.) —
   dozens of strings spread across roughly 15 files in `japanese-app/src/components/` and
   `App.jsx`. Bounded, low-risk work.

2. **Content translation (large, the actual effort).** Every Korean `meaning` field throughout the
   real curriculum data needs an English counterpart:
   - `japanese-app/src/data/curriculum.js` — `vocabPool` (~450 entries), `grammarPool` (~30 lessons,
     each with `title`/`rule`/`tip`/`examples[].m`), `sentences` (~45), `kanaReadingWords`.
   - `japanese-app/src/data/grammar.js` and `japanese-app/src/data/vocabulary.js` — the standalone
     문법 레슨 / 단어장 tabs, separate from the daily curriculum.
   - Note: `japanese-app/src/data/jlpt-words.json` (used by `VocabBook.jsx`) already stores its
     `meaning` field in **English**, since it's sourced from JMdict/Jisho — already inconsistent
     with the rest of the app's Korean-only content. Worth reconciling either direction once this
     is tackled.

## Suggested approach when this gets picked up

- Split into two phases: (a) UI-only translation first — ships fast, useful even before content
  translation is done (English UI chrome + still-Korean `meaning` fields as a fallback), then
  (b) full content translation as a separate pass.
- Model `language` as a per-profile persisted value (e.g. `jp_lang_${profile}` in localStorage,
  following the existing convention of `jp_profile`, `jp_dayprogress_${profile}`,
  `jp_pinned_${profile}`, etc. — see `japanese-app/src/hooks/useDailyProgress.js` for the pattern).
  Expose a way to change it after onboarding too (e.g. next to the existing "프로필 전환" button in
  the header), not just at the `ProfileSetup` screen.
- For UI strings, prefer one small `strings.ko` / `strings.en` lookup table over scattering
  ternaries through every component — keeps future string additions from silently forgetting the
  other language.
- For content, a hand-translation pass over 500+ entries isn't realistic — do an LLM-assisted batch
  translation pass over `curriculum.js` (and the other two data files) rather than translating
  entry-by-entry by hand.

## Not yet decided (ask the user when this is picked up)

- Which flag/variant for English — the user only said "영국 국기" (🇬🇧 UK flag) explicitly; confirm
  before assuming 🇬🇧 vs 🇺🇸.
- Exact placement of the later-changeable language toggle (settings area doesn't exist yet as a
  concept in this app — closest existing analog is the profile-switch button in `App.jsx`'s header).
