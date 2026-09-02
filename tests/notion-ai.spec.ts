import { expect, test } from '@playwright/test';
import { NotionPage } from '../pages/notion.page';

test.describe('Notion AI authenticated workflow', () => {
  let notion: NotionPage;
  let testPageCreated = false;

  test.beforeEach(async ({ page }) => {
    notion = new NotionPage(page);
    await notion.openWorkspace();
  });

  test.afterEach(async () => {
    if (testPageCreated) {
      await notion.moveCurrentPageToTrash();
    }
  });

  test('creates and names a blank page @smoke', async ({ page }) => {
    const title = `QA Automation Test ${Date.now()}`;

    await notion.createBlankPage(title);
    testPageCreated = true;

    await expect(page).toHaveTitle(new RegExp(title, 'i'));
  });

  test('opens the Notion AI composer from a blank page @smoke', async () => {
    await notion.createBlankPage(`QA AI Composer Test ${Date.now()}`);
    testPageCreated = true;

    await notion.openAIComposer();

    await expect(notion.aiPrompt).toBeEditable();
  });

  test('generates a relevant AI response @ai-generation', async ({}, testInfo) => {
    test.skip(
      process.env.RUN_NOTION_AI !== 'true',
      'Opt in with RUN_NOTION_AI=true to avoid consuming Notion AI usage accidentally.',
    );

    await notion.createBlankPage(`QA AI Generation Test ${Date.now()}`);
    testPageCreated = true;
    await notion.openAIComposer();

    const result = await notion.generateAIContent(
      'In one sentence, explain why risk-based testing is useful in software quality assurance.',
    );

    expect(result.responseText.length).toBeGreaterThan(20);
    expect(result.responseText).toMatch(/risk|test|quality|software/i);
    expect(result.durationMs).toBeLessThan(45_000);

    await testInfo.attach('notion-ai-metrics.json', {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });
  });
});
