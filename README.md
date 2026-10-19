<p align="center">
  <img src="assets/readme-banner.svg" alt="Exam Angel — Your next attempt, better prepared. Generate, practice, review." width="100%">
</p>

# Exam Angel

**A lightweight, browser-based practice studio that turns AI-written questions into interactive mock tests.**

Take a built-in Computer Networks test, or generate a test with your preferred AI assistant and import it in plain text. Answer at your own pace, flag questions with notes, and export your attempt for feedback.

> The application currently displays **Mock Test Studio** in its interface. Exam Angel is the repository name. This repository includes the supplied application unchanged, with a conventional `index.html` entry point.

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

To try the importer immediately, use [`examples/sample-test.txt`](examples/sample-test.txt). It contains two questions with a five-minute limit and a per-question mark override.

### 3. Practice and review

- Select one option per question; use **Clear answer** to remove a selection.
- Use **Mark for review** to flag a question and add a comment.
- Navigate with the grid, Previous/Next buttons, or keyboard shortcuts.
- Return to the test list and use **Resume** to continue saved progress.
- Submit when ready, or let the countdown submit automatically.

### 4. Export for feedback

On the submission screen, select **Download answers (.txt)** or **Copy to clipboard**. The report includes:

- Test title, export timestamp, and tracked time taken.
- Answered, unanswered, and marked-for-review counts.
- Full question text and options, plus your selected answer.
- Section labels, question-specific marks, and review comments.
- Marking instructions and a request for explanations, section scores, and revision topics.

Send the report to your chosen AI assistant for checking. Independently verify important answers and scores: AI feedback can be incorrect.

## Keyboard shortcuts

While the test screen is active and you are not typing in a text field:

| Key | Action |
| --- | --- |
| `←` | Previous question |
| `→` | Next question |
| `1`–`6` | Select the corresponding available option, A–F |

## Mock-test import format

Use plain text, consecutive question numbers, and 2–6 options labeled A–F, one option per line. Prefer the exact markers and header names shown below.

```text
=== BEGIN MOCK TEST ===
TEST_TITLE: Your Practice Test
SUBJECT: Computer Networks
TOTAL_QUESTIONS: 2
MARKS_PER_CORRECT: 2
NEGATIVE_MARKS_PER_WRONG: 0.5
TOTAL_MARKS: 6
TIME_LIMIT_MINUTES: 10
INSTRUCTIONS: Choose one option for each question.

SECTION: Fundamentals
SECTION_NOTE: Read carefully.

Q1. [Topic: UDP] What is the size of a UDP header?
A. 4 bytes
B. 8 bytes
C. 16 bytes
D. 20 bytes

Q2. [Topic: TCP] [Marks: 4] Which transport protocol provides reliable, in-order delivery?
A. UDP
B. TCP
C. IP
D. ICMP
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
| `[Topic: ...]` | Optional topic shown above the question. |
| `[Marks: n]` | Optional per-question mark override. |

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
| `mocktest_v2_<test-id>` | Current attempt: selected answers, flags, comments, current position, elapsed time, and submission state. |
| `mocktest1_state_v1` | Legacy attempt key read for the first built-in test when needed. |

## Privacy & limitations

- The supplied app contains no external scripts, analytics, fetch calls, or built-in AI service connection. Imports are parsed locally.
- Browser storage is not encrypted by the app. Avoid sensitive personal information in test content or comments, especially on shared devices.
- Data does not sync between devices, browser profiles, origins, or private-browsing sessions. Clearing site data can erase your library and progress.
- If storage is blocked or full, persistence may fail. Keep original import files and export important attempts.
- Clipboard access can be blocked by browser permissions or insecure contexts. Use the download buttons instead.
- Any report you manually send to an external AI service is subject to that service's privacy terms.
- Imported tests contain no reliable ground-truth answer key; neither the app nor the parser verifies factual accuracy or that exactly one option is correct.
- This is a personal practice tool, not a secure exam platform. It has no authentication, proctoring, server-side enforcement, or protected assessment records.

## Repository structure

```text
Exam-Angel/
├── index.html                     # Main entry point; copy of the supplied app
├── mock_test-4.html                # Original uploaded HTML, preserved unchanged
├── README.md                      # Setup, usage, format, and limitations
├── assets/
│   └── readme-banner.svg          # Custom, editable vector README banner
└── examples/
    ├── mock-test-format.txt        # AI instructions extracted from the app
    └── sample-test.txt             # Ready-to-import example
```

`index.html` and `mock_test-4.html` initially have identical contents. Use `index.html` for development and hosting; the second file preserves the original upload.

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
- Select/clear answers, add a review comment, navigate, reload, and resume.
- Submit manually and confirm the exported report contains your selections and notes.
- Test countdown auto-submission and hidden-tab timing behavior.
- Check narrow mobile layouts and both system color schemes.

There is no bundled automated test runner or package-manager configuration.

## Contributing

Open an issue to describe a bug or improvement. For changes, use a focused branch and pull request, explain the behavior affected, and include reproduction steps or screenshots where relevant. Do not commit API keys, personal reports, or browser-storage dumps.

## License

No license has been selected in this repository. Do not assume permission to redistribute or relicense the code; contact the repository owner for terms.
