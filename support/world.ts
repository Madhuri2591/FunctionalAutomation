import { setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  attach: any;

  constructor(options: IWorldOptions) {
    this.attach = options.attach;
  }

  async init(): Promise<void> {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext({
      recordVideo: { dir: 'reports/videos/' }
    });
    this.page = await this.context.newPage();
  }

  async close(): Promise<void> {
    await Promise.all([
      this.page?.close(),
      this.context?.close(),
      this.browser?.close()
    ]);
  }
}

setWorldConstructor(CustomWorld);
