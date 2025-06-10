import { expect, Locator, Page } from '@playwright/test';

export class BasePO {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    static async elementIsVisible(element: Locator) {
        await expect(element).toBeVisible();
    }

    static async clickElement(element: Locator) {
        await element.click();
    }
}