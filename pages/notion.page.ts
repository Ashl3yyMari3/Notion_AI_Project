import { expect, Locator, Page } from '@playwright/test';

export class NotionPage {
  readonly page: Page;
  readonly aiPrompt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.aiPrompt = page
      .locator([
        'textarea[placeholder*="Ask" i]',
        '[contenteditable="true"][data-placeholder*="Ask" i]',
        '[role="dialog"] textarea',
        '[role="dialog"] [contenteditable="true"]',
      ].join(', '))
      .last();
  }

  async openWorkspace(): Promise<void> {
    // The root URL now serves Notion's marketing site, even for signed-in users.
    // The login route redirects an authenticated session into the web workspace.
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('body')).toBeVisible();

    const privateSection = this.getPrivateSectionButton();
    const alwaysOpenNotion = this.page
      .getByRole('link', { name: /always open notion/i })
      .first();
    const openNotion = this.page
      .getByRole('button', { name: /^open notion$/i })
      .first();

    await expect(
      privateSection.or(alwaysOpenNotion).or(openNotion).first(),
    ).toBeVisible({ timeout: 30_000 });

    if (await alwaysOpenNotion.isVisible().catch(() => false)) {
      await alwaysOpenNotion.click();
    } else if (await openNotion.isVisible().catch(() => false)) {
      await openNotion.click();
    }

    const loginPrompt = this.page
      .getByRole('heading', { name: /log in|sign in/i })
      .or(this.page.getByRole('button', { name: /continue with email/i }))
      .first();

    await expect(privateSection.or(loginPrompt).first()).toBeVisible({
      timeout: 30_000,
    });

    if (await loginPrompt.isVisible().catch(() => false)) {
      throw new Error(
        'Notion authentication is missing or expired. Run `npm run auth`, sign in, and close the recorder window before running the tests.',
      );
    }

    await expect(privateSection).toBeVisible({ timeout: 30_000 });
  }

  async createBlankPage(title: string): Promise<void> {
    const privateSection = this.getPrivateSectionButton();
    await privateSection.hover();

    const newPageButton = this.page
      .getByRole('button', { name: 'Add a page', exact: true })
      .filter({ visible: true })
      .first();

    await expect(newPageButton).toBeVisible();
    await newPageButton.click();

    const titleInput = this.page
      .getByPlaceholder('New page', { exact: true })
      .or(this.page.getByPlaceholder('Untitled', { exact: true }))
      .or(this.page.locator('[contenteditable="true"][aria-label*="title" i]'))
      .first();

    await expect(titleInput).toBeVisible();
    await titleInput.fill(title);

    await expect.poll(async () => {
      return (await titleInput.inputValue().catch(async () => titleInput.textContent())) ?? '';
    }).toContain(title);

    // A new page can open with Notion's "Get started with" overlay expanded.
    await this.page.keyboard.press('Escape');
  }

  async openAIComposer(): Promise<void> {
    const pageBody = this.page
      .getByRole('main')
      .getByPlaceholder(' ', { exact: true })
      .first();

    await expect(pageBody).toBeVisible();
    await pageBody.click();

    // Notion documents this as the shortcut for starting AI on a new line.
    await pageBody.press('Space');
    await expect(this.aiPrompt).toBeVisible();
  }

  async generateAIContent(
    prompt: string,
    timeoutMs = 45_000,
  ): Promise<{ durationMs: number; responseText: string }> {
    const beforeText = await this.getDocumentText();

    await this.aiPrompt.fill(prompt);
    const startedAt = Date.now();
    await this.aiPrompt.press('Enter');

    const keepResponseButton = this.page
      .getByRole('button', { name: /insert below|keep|done/i })
      .last();

    await expect(keepResponseButton).toBeVisible({ timeout: timeoutMs });
    const durationMs = Date.now() - startedAt;
    await keepResponseButton.click();

    await expect.poll(
      async () => (await this.getDocumentText()).length,
      { timeout: timeoutMs },
    ).toBeGreaterThan(beforeText.length + 20);

    const afterText = await this.getDocumentText();
    return {
      durationMs,
      responseText: afterText.slice(beforeText.length).trim(),
    };
  }

  async moveCurrentPageToTrash(): Promise<void> {
    await this.page.keyboard.press('Escape').catch(() => undefined);

    const actionsButton = this.page
      .getByRole('banner')
      .getByRole('button', { name: /actions|more/i })
      .last();
    if (!(await actionsButton.isVisible().catch(() => false))) return;

    await actionsButton.click();
    const trashAction = this.page
      .getByRole('menuitem', { name: /move to trash|delete/i })
      .or(this.page.getByText(/move to trash/i))
      .last();

    if (await trashAction.isVisible().catch(() => false)) {
      await trashAction.click();
    }
  }

  private async getDocumentText(): Promise<string> {
    const scopedBlocks = this.page.locator(
      '.notion-page-content [data-content-editable-leaf="true"]',
    );
    const blocks = (await scopedBlocks.count()) > 0
      ? scopedBlocks
      : this.page.locator('[data-content-editable-leaf="true"]');

    return (await blocks.allInnerTexts()).join(' ').replace(/\s+/g, ' ').trim();
  }

  private getPrivateSectionButton(): Locator {
    return this.page
      .getByRole('navigation', { name: /sidebar/i })
      .getByRole('button', { name: 'Private', exact: true })
      .first();
  }
}
