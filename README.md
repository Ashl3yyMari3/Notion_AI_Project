# 🧠 Notion AI — Quality Evaluation & Playwright Automation

![Type](https://img.shields.io/badge/Type-AI%20SaaS-blue)
![Focus](https://img.shields.io/badge/Focus-Risk--Based%20Testing-orange)
![Automation](https://img.shields.io/badge/Automation-Playwright%20%7C%20TypeScript-green)

## 📋 Overview

This QA case study evaluates Notion AI’s functionality, response behavior, usability, and reliability. The project combines risk-based manual testing with a maintainable Playwright and TypeScript automation suite for authenticated Notion workflows.

The automation verifies that a user can create and name a page, open the Notion AI composer, and—when explicitly enabled—submit a prompt and validate the resulting response.

## 🎯 Test Objectives

- Verify page creation and title persistence
- Confirm that the AI composer opens from a blank page
- Validate that an AI response is nonempty and relevant to the prompt
- Measure AI response time against a defined threshold
- Capture traces, screenshots, videos, and response metrics when failures occur
- Protect authentication data and avoid placing credentials or session files in source control

## 🧪 Automated Coverage

| Test | Type | Default Run |
| --- | --- | --- |
| Create and name a blank page | Smoke / functional | Yes |
| Open the Notion AI composer | Smoke / UI | Yes |
| Generate and validate an AI response | Functional / AI behavior / performance | Opt-in |

The generation test is opt-in because it sends a real request to Notion AI and may use an account’s AI allowance.

## 🛠 Tech Stack

- Playwright Test
- TypeScript
- Page Object Model
- Chromium
- Saved authentication state
- HTML reports, traces, screenshots, videos, and JSON test attachments

## 📂 Project Structure

```text
Notion_AI_Project/
├── pages/
│   └── notion.page.ts
├── tests/
│   └── notion-ai.spec.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Setup

### 1. Clone and install

```bash
git clone https://github.com/Ashl3yyMari3/Notion_AI_Project.git
cd Notion_AI_Project
npm install
```

The test scripts automatically check for the required Chromium browser. If a browser-installation error still appears, run:

```bash
npx playwright install chromium
```

### 2. Save a local authenticated session

```bash
npm run auth
```

A Chromium recorder window will open. Sign in to your own Notion account, confirm that the workspace loads, and then close the browser window. Playwright saves the session locally at `playwright/.auth/notion.json`.

> The authentication file can contain sensitive cookies and is excluded by `.gitignore`. Never commit or share it.

### 3. Run the default smoke tests

```bash
npm test
```

To watch the browser during execution:

```bash
npm run test:headed
```

### 4. Run the opt-in AI generation test

```bash
npm run test:ai
```

## 📊 Assertions & Evidence

The suite checks:

- The authenticated workspace opens instead of redirecting to login
- A new page can be created and assigned a unique title
- The AI prompt field becomes visible and editable
- Generated content contains meaningful text related to testing or quality
- Response time remains below the configured 45-second threshold

On failure, Playwright retains diagnostic evidence in `test-results/`. The HTML report is generated in `playwright-report/` and can be opened with:

```bash
npm run report
```

## 🧩 Design Decisions

- **Page Object Model:** Notion-specific locators and actions are centralized in `pages/notion.page.ts`.
- **Unique test data:** Timestamped titles reduce collisions between test runs.
- **Cleanup:** Each test attempts to move the page it created to trash.
- **Secure authentication:** Tests reuse local browser state instead of storing usernames or passwords.
- **Controlled AI usage:** AI generation is separated from the default deterministic smoke suite.
- **Failure evidence:** Traces, screenshots, and videos are retained only when a test fails.

## ⚠️ Live-Site Testing Note

This suite runs against the live Notion web application. Notion can change its UI, accessible labels, subscription behavior, or AI workflow without notice. If a test fails, review the Playwright trace first to determine whether the product changed or the test contains a defect.

## 📌 Manual & Exploratory Testing Focus

The broader case study also covers:

- Prompt handling and input validation
- AI response relevance and clarity
- Repeated or inconsistent output
- Error states and graceful failure behavior
- Response latency
- Accessibility and usability
- User feedback and trust

## 🚀 Future Enhancements

- Add Firefox and WebKit coverage after validating authenticated-session compatibility
- Add visual regression checks for the AI composer
- Record trend data for response latency across repeated runs
- Add a safe CI workflow using encrypted authentication state and a dedicated test workspace

---

**Ashley Cichy**  
QA Engineer | Computer Science Student  
[GitHub](https://github.com/Ashl3yyMari3) • [LinkedIn](https://linkedin.com/in/ashl3yymari3)
