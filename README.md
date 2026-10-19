<p align="center">
  <img src="assets/readme-banner.svg" alt="Exam Angel — Your next attempt, better prepared. Generate, practice, review." width="100%">
</p>

# Exam Angel

**A lightweight, browser-based practice studio that turns AI-written questions into interactive mock tests.**

Take a built-in Computer Networks test, or generate a test with your preferred AI assistant and import it in plain text. Answer at your own pace, flag questions with notes, and export your attempt for feedback.

> The application currently displays **Mock Test Studio** in its interface. Exam Angel is the repository name. The application lives in `index.html` and supports both single-answer and multiple-answer questions in the same test.

[Quick start](#quick-start) · [How it works](#how-it-works) · [Import format](#mock-test-import-format) · [Privacy & limitations](#privacy--limitations) · [Deploy](#deploy-to-github-pages)

## At a glance

- **No installation or build required:** one HTML file with embedded CSS and vanilla JavaScript.
- **No backend, account, API key, framework, or external runtime dependency.**
- **AI-assisted, not AI-connected:** you manually exchange text with an AI assistant of your choice.
- **Local-first practice:** imported tests and attempt progress are stored in your browser when storage is available.

## Features

| Feature | What it does |
| --- | --- |
| Built-in practice | Two Computer Networks mock papers, with 50 questions each and three sections. |
| Mixed question types | Single-answer radio buttons and multiple-answer checkboxes, with explicit per-question selection instructions. |
| Custom test imports | Paste AI-generated text or upload a `.txt` file. |
| Import preview | Inspect detected questions, sections, marks, and parser warnings before adding a test. |
| Test setup | Configure the title, marks per correct answer, negative marking, and time limit for imported tests. |
| Flexible timing | Use a stopwatch or a countdown that automatically submits when tracked time reaches the limit. |
| Question navigation | Move with Previous/Next, jump using the question grid, or use keyboard shortcuts. |
| Review notes | Mark questions for review and write an optional comment about your doubt. |
| Saved progress | Resume an attempt, revisit a submission, or start a new attempt. |
| Personal test library | Rename or delete imported tests saved in the current browser. |
| Answer export | Download or copy a text report with questions, selections, review notes, timing, and AI-checking instructions. |
| Adaptive interface | Responsive layout and automatic light/dark colors based on your system preference. |

**Important:** the app does not contain an answer key or calculate correctness or scores. Marks and penalties are configuration included in the exported report for external checking.

## Quick start

### Option 1 — Open the file

Download or clone the repository, then open `index.html` in a modern browser.

```bash
git clone https://github.com/Farhan0629/Exam-Angel.git
cd Exam-Angel
```

The application has no network dependency of its own. Direct-file storage and clipboard behavior can vary by browser; use the local-server option if you encounter restrictions.

### Option 2 — Run a local static server (recommended)

With Python 3 installed:

```bash
cd Exam-Angel
python3 -m http.server 8000
```

Visit **http://localhost:8000**. Keep using the same origin and port if you want to access the same browser-saved tests and progress.

No `npm install`, environment variables, database, or compilation step is needed.

## How it works

### 1. Start with an existing paper

On the home screen, choose a built-in paper and select **Start test**. These papers use the bundled defaults: 2 marks per correct answer, no negative marking, and no time limit.

### 2. Create your own practice test

1. Select **Upload mock test**.
2. Download the format file or copy its instructions. A repository copy is available at [`examples/mock-test-format.txt`](examples/mock-test-format.txt).
3. Give it to ChatGPT, Claude, Gemini, or another assistant. Fill in the topic, difficulty, question count, marking scheme, and time limit.
4. Ask the assistant to follow the format exactly and omit answers, hints, and explanations.
5. Paste its reply or upload the returned `.txt` file.
6. Review the preview and warnings. Invalid questions may be skipped; verify the resulting count and content.
7. Select **Add to My Tests & set up**, adjust the settings, and start.

To try the importer immediately, use [`examples/sample-test.txt`](examples/sample-test.txt). It contains one single-answer question and one multiple-answer question, with a five-minute limit and a per-question mark override.

### 3. Practice and review

- **Single-answer questions:** select one radio option; choosing another replaces your selection.
- **Multiple-answer questions:** select all correct options using checkboxes; selecting a checked option again deselects it.
- Use **Clear answer** to remove every selection for the current question. Deselecting the last checkbox makes the question unanswered.
- Progress and summary counts count questions, not the number of checked options.
- Use **Mark for review** to flag a question and add a comment.
- Navigate with the grid, Previous/Next buttons, or keyboard shortcuts.
- Return to the test list and use **Resume** to continue saved progress.
- Submit when ready, or let the countdown submit automatically.

### 4. Export for feedback

On the submission screen, select **Download answers (.txt)** or **Copy to clipboard**. The report includes:

- Test title, export timestamp, and tracked time taken.
- Answered, unanswered, and marked-for-review counts.
- Full question text, type (`single` or `multiple`), and options, plus all selected letters in a stable order (for example `A, C`).
- Section labels, question-specific marks, and review comments.
- Marking instructions and a request for explanations, section scores, and revision topics.

Send the report to your chosen AI assistant for checking. Independently verify important answers and scores: AI feedback can be incorrect.

## Keyboard shortcuts

While the test screen is active and you are not typing in a text field:

| Key | Action |
| --- | --- |
| `←` | Previous question |
| `→` | Next question |
| `1`–`6` | Select A–F for a single-answer question; toggle A–F for a multiple-answer question |
| `Tab` / `Shift+Tab` | Move focus between controls |
| `Space` | Activate a focused option (toggle a checkbox or select a radio) |

## Mock-test import format

Use plain text, consecutive question numbers, and 2–6 options labeled A–F, one option per line. Add `[Type: multiple]` to the question line to enable multiple selections. `[Type: single]` is optional: questions without a type remain single-answer, including legacy imports and the built-in papers. Prefer the exact markers and header names shown below.

```text
=== BEGIN MOCK TEST ===
TEST_TITLE: Your Practice Test
SUBJECT: Computer Networks
TOTAL_QUESTIONS: 2
MARKS_PER_CORRECT: 2
NEGATIVE_MARKS_PER_WRONG: 0.5
TOTAL_MARKS: 6
TIME_LIMIT_MINUTES: 10
INSTRUCTIONS: Choose one option for single-answer questions and all correct options for multiple-answer questions. Exact match, no partial credit.

SECTION: Fundamentals
SECTION_NOTE: Read carefully.

Q1. [Topic: UDP] What is the size of a UDP header?
A. 4 bytes
B. 8 bytes
C. 16 bytes
D. 20 bytes

Q2. [Type: multiple] [Topic: TCP] [Marks: 4] Which statements describe TCP? Select all correct options.
A. It provides reliable, in-order delivery.
B. It is connectionless.
C. It supports flow control.
D. It never retransmits segments.
=== END MOCK TEST ===
```

### Field reference

| Field | Meaning |
| --- | --- |
| `TEST_TITLE` | Display name of the imported test. |
| `SUBJECT` | Subject metadata for the test. |
| `TOTAL_QUESTIONS` | Expected valid question count; mismatches produce a warning. |
| `MARKS_PER_CORRECT` | Default mark value for questions without an override. |
| `NEGATIVE_MARKS_PER_WRONG` | Penalty magnitude written into the export instructions. |
| `TOTAL_MARKS` | Expected sum of question marks; the app uses its computed sum if this differs. |
| `TIME_LIMIT_MINUTES` | Whole-minute countdown; `0` means stopwatch only. |
| `INSTRUCTIONS` | Instructions retained in the exported report. |
| `SECTION` / `SECTION_NOTE` | Optional section heading and note. |
| `[Type: single]` / `[Type: multiple]` | Selection mode for this question; omitted means single. Use only one Type tag. Values are case-insensitive. |
| `[Topic: ...]` | Optional topic shown above the question. |
| `[Marks: n]` | Optional per-question mark override. |

Unsupported or duplicate Type tags block import with an error instead of silently changing the selection mode. Malformed tags such as `[Type multiple]` also block import. Correct them to `[Type: multiple]` or `[Type: single]` and review the preview before adding the test. The preview reports the multiple-answer question count and labels each previewed question's type.

### Multiple-answer grading policy

The app still does **not** grade locally. Exported instructions tell the external checker to apply these rules:

- A single-answer question is correct only when its selected option is correct.
- A multiple-answer question is correct only when the selected set exactly matches the correct set, regardless of selection order.
- Missing a correct option or choosing an extra option makes the entire question wrong; **no partial credit**.
- Award the question's mark override, or the configured default, for a correct question.
- Apply the configured wrong-answer penalty **once per question**, never once per selected option.
- A question with no selected options is unanswered and receives 0 marks.

The AI generation instructions request at least two correct options for multiple-answer questions. The importer cannot verify this without an answer key; validate the generated content independently.

Questions can have multiline text before option A. Use plain-text math such as `x^2`, `sqrt(5)`, or `10 Mbps`; there is no LaTeX renderer. Do not include answer keys or explanations. The parser ignores some answer/explanation lines, but it is not a general-purpose content sanitizer or question-quality checker.

## Timing and saved progress

- The timer tracks active, visible-page time. **It pauses while the document is hidden**, while on the home screen, and after submission; it is not a wall-clock exam deadline or proctoring mechanism.
- Progress is saved after interactions, periodically during a running test, and on page-hide events when browser storage is available.
- There is one stored attempt per test, not a historical attempt archive. Starting a new attempt replaces the old saved attempt; download your report first.
- A manually submitted attempt can be reopened with **Back to test** while it has not reached its configured time limit.
- Imported tests and their settings persist in the library. Edits to bundled test settings are not stored in that imported-test library.

### Browser storage keys

| Key | Contents |
| --- | --- |
| `mocktest_library_v1` | Imported tests and their settings. |
| `mocktest_v2_<test-id>` | Current attempt: selected option-index arrays, flags, comments, current position, elapsed time, and submission state. Old numeric single-answer selections are converted to one-element arrays on load. |
| `mocktest1_state_v1` | Legacy attempt key read for the first built-in test when needed. |

Existing storage keys are retained, so previous single-answer progress remains available. Loading an attempt filters duplicate, out-of-range, and invalid selection values. Empty arrays are treated as unanswered. Multiple selections are sorted for consistent exports. Older app versions do not understand the new array format: avoid switching back to an old application version after saving an updated attempt.

## Privacy & limitations

- The supplied app contains no external scripts, analytics, fetch calls, or built-in AI service connection. Imports are parsed locally.
- Browser storage is not encrypted by the app. Avoid sensitive personal information in test content or comments, especially on shared devices.
- Data does not sync between devices, browser profiles, origins, or private-browsing sessions. Clearing site data can erase your library and progress.
- If storage is blocked or full, persistence may fail. Keep original import files and export important attempts.
- Clipboard access can be blocked by browser permissions or insecure contexts. Use the download buttons instead.
- Any report you manually send to an external AI service is subject to that service's privacy terms.
- Imported tests contain no reliable ground-truth answer key; neither the app nor the parser verifies factual accuracy or the correct number of valid options for either question type.
- This is a personal practice tool, not a secure exam platform. It has no authentication, proctoring, server-side enforcement, or protected assessment records.

## Repository structure

```text
Exam-Angel/
├── index.html                     # Main application (HTML, CSS, vanilla JavaScript)
├── README.md                      # Setup, usage, format, and limitations
├── .gitignore                     # Excludes optional local test dependencies/output
├── assets/
│   └── readme-banner.svg          # Custom, editable vector README banner
├── examples/
│   ├── mock-test-format.txt        # AI instructions, kept in sync with the app
│   └── sample-test.txt             # Mixed single/multiple-answer sample
└── tests/
    └── regression.cjs              # Optional Playwright browser regression suite
```

## Deploy to GitHub Pages

The project can be served by any static host. To use GitHub Pages, if it is available for your repository and account:

1. Open **Settings → Pages** in the GitHub repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/ (root)**, then save.
4. After GitHub finishes publishing, open the URL shown in the Pages settings.

With GitHub's standard project-site naming, the expected address is `https://farhan0629.github.io/Exam-Angel/`. This is an expected URL, not a claim that Pages is already enabled. The root `index.html` lets the project open without a filename in the URL.

## Development

Edit `index.html` directly. Main code areas are the CSS theme/layout, bundled `TESTS`, `FORMAT_TXT`, `parseTest`, library and attempt persistence, screen rendering, and `buildTxt` export generation.

Suggested checks after making changes:

- Open the home screen and start both built-in papers.
- Import the sample file; confirm two questions, six total marks, and a five-minute countdown.
- Check malformed imports, missing fields, and preview warnings.
- Select/clear single and multiple answers, add a review comment, navigate, reload, and resume.
- Verify old numeric answers still load, unknown types fail import, and exports list every selected letter.
- Submit manually and confirm the exported report contains your selections and notes.
- Test countdown auto-submission and hidden-tab timing behavior.
- Check narrow mobile layouts and both system color schemes.

### Run the browser regression tests (optional)

The application itself remains dependency-free. The development-only test suite requires Node.js 20+ and Playwright:

```bash
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tests/regression.cjs
```

To use an existing Chromium installation, set `CHROMIUM_PATH` to its executable path. Set `QA_DIR` to a directory if you also want screenshots. The suite uses a temporary local server and isolated browser context; it does not modify repository content or your real browser's saved data.

Coverage includes legacy saved-answer migration, mixed imports, invalid type tags, radio/checkbox behavior, mouse and keyboard toggling, unanswered counts, navigation, review notes, reload/resume, manual and automatic submission, exports/downloads, clipboard copying, and narrow-screen overflow checks.

## Contributing

Open an issue to describe a bug or improvement. For changes, use a focused branch and pull request, explain the behavior affected, and include reproduction steps or screenshots where relevant. Do not commit API keys, personal reports, or browser-storage dumps.

## License

No license has been selected in this repository. Do not assume permission to redistribute or relicense the code; contact the repository owner for terms.
