import { Page, expect } from "@playwright/test";

export class ExamplePage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('https://playwright.dev/');
    }

    async checkTitle() {
        await expect(this.page).toHaveTitle(/Playwright/);
    }

    async clickGetStartedLink() {
        await this.page.getByRole('link', { name: 'Get Started' }).click();
    }

    async expectInstallationHeadingVisible() {
        await expect(this.page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    }
}