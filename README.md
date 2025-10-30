# Notion_AI_Project

# 🧠 Notion AI — Quality Evaluation & AI Behavior Testing

![Badge](https://img.shields.io/badge/Type-AI%20SaaS-blue)
![Badge](https://img.shields.io/badge/Focus-Risk--based%20Testing-orange)
![Badge](https://img.shields.io/badge/Tools-Manual%20Testing%20%7C%20Playwright%20%7C%20Lighthouse-green)

---

## 📋 Overview
**Goal:** Evaluate Notion AI’s ability to generate accurate, relevant, and usable text responses across multiple prompt types.  
**Objective:** Identify defects in AI behavior, response latency, and user feedback mechanisms.  

**Tech Stack:** Manual Testing · Playwright JS · Chrome DevTools · Postman (mock API) · Google Sheets (test tracking)

---

## 🧩 Test Objectives
- Verify text generation accuracy and contextual relevance  
- Ensure system gracefully handles invalid or empty inputs  
- Measure performance latency across repeated prompts  
- Evaluate UX feedback and accessibility compliance  

---

## 🧪 Test Scope
| **Type** | **Focus Area** | **Tool** |
|-----------|----------------|-----------|
| Manual | Prompt handling & validation | Notion AI workspace |
| Automation | Regression flow (login → create page → generate content) | Playwright |
| Usability | Accessibility, layout, error states | Lighthouse |
| Performance | Response time tracking | DevTools Network tab |
| Mock API | Simulated prompt/response testing | Postman |

---

## ✅ Key Artifacts
- **Test Cases:** [📄 Test_Cases.csv](./artifacts/Test_Cases.csv)  
- **Bug Report:** [🐞 Bug_Report.csv](./artifacts/Bug_Report.csv)  
- **Automation Example:** [⚙️ Playwright Spec](./automation/playwright/example.spec.ts)  
- **Screenshots:** [🖼️ Evidence Folder](./assets/screenshots/)  

---

## 🧾 Example Findings
| **ID** | **Summary** | **Severity** | **Status** |
|---------|--------------|---------------|-------------|
| BUG-001 | Empty “Improve this text” prompt generates random text instead of validation message | Medium | Open |
| BUG-002 | AI summary occasionally repeats first sentence | Low | Open |
| BUG-003 | Latency spike when sending multiple prompts quickly | Medium | Open |

---

## 📈 Results & Impact
- Tested 6 AI command flows, found 2 UX-level issues  
- Average response latency: 5.2s (acceptable)  
- Proposed input validation improvements and progress indicators  
- Demonstrated understanding of **AI testing ethics**, **usability**, and **automation consistency**

---

## 💡 Reflection
> “Testing Notion AI taught me how to evaluate not just functionality, but *behavior* — how AI interprets human input, where it fails gracefully (or doesn’t), and how UX clarity affects user trust. It strengthened my skills in risk-based testing and cross-functional collaboration.”

---

## 🚀 Future Enhancements
- Expand automation coverage with Playwright parameterized tests  
- Add mock API verification using test data sets  
- Introduce CI pipeline for regression suite  

---

📅 **Date:** October 2025  
👩‍💻 **Tester:** Ashley Cichy  
📄 **Version:** v1.0 — Initial QA Case Study
