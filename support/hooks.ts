import { Before, After, Status, AfterAll } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import fs from 'fs';
import path from 'path';

const screenshotDir = path.join('reports', 'screenshots');

/**
 * Launch browser before each scenario.
 */
Before(async function (this: CustomWorld) {
  await this.init();
});

/**
 * Capture screenshot on failure, attach to Allure, and close browser.
 */
After(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name.replace(/[^\w]/g, '_');

  // Always capture screenshot
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  const screenshotPath = path.join(screenshotDir, `${scenarioName}.png`);
  const screenshotBuffer = await this.page.screenshot({ path: screenshotPath });
  if (typeof this.attach === 'function') {
    this.attach(screenshotBuffer, 'image/png');
  }
  console.log(`📸 Screenshot captured: ${screenshotPath}`);

  let videoPath;
  if (this.page && this.page.video) {
    try {
      const video = this.page.video();
      if (video) {
        videoPath = await video.path();
      }
    } catch (err) {
      console.warn('⚠️ Error getting video path:', err);
    }
  }

  try {
    if (this.page?.isClosed() === false) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    console.log('🔒 Browser closed.');
  } catch (error) {
    console.warn('⚠️ Error during browser cleanup:', error);
  }

  // Attach video after context is closed
  if (videoPath && fs.existsSync(videoPath)) {
    try {
      const videoBuffer = fs.readFileSync(videoPath);
      if (typeof this.attach === 'function') {
        this.attach(videoBuffer, 'video/webm');
      }
      console.log(`🎥 Video attached: ${videoPath}`);
    } catch (err) {
      console.warn('⚠️ Error attaching video:', err);
    }
  }
});

AfterAll(async function () {
  process.exit(0);
});
