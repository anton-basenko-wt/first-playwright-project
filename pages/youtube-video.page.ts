import { expect, Locator, Page } from '@playwright/test';

export class YoutubeVideoPage {
    readonly page: Page;
    readonly logo: Locator;
    readonly searchBar: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly likeButton: Locator;
    readonly dislikeButton: Locator;
    readonly subscribeButton: Locator;

    readonly videoPlayer: Locator;
    readonly signInPopUp: Locator;

    readonly signInPopUpButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logo = this.page.getByRole('link', { name: 'YouTube Home' });
        this.searchBar = this.page.getByRole('search');

        this.searchButton = this.page.getByRole('button', { name: 'Search', exact: true })
        this.likeButton = this.page.getByRole('button', { name: 'like this video along with' });
        this.dislikeButton = this.page.getByRole('button', { name: 'Dislike this video' });
        this.subscribeButton = this.page.getByRole('button', { name: 'Subscribe' });

        this.videoPlayer = this.page.locator('.html5-video-player');
        this.signInPopUp = this.page.locator('#contentWrapper').filter({ hasText: 'Sign in to' });

        this.searchInput = this.searchBar.locator('input');
        this.signInPopUpButton = this.signInPopUp.locator('#button');
    }

    async goto() {
        await this.page.goto('/watch?v=wM6exo00T5I');
    }

    async checkPageTitle() {
        await expect(this.page).toHaveTitle(/YouTube/);
    }

    async checkSignInPopUp() {
        await expect(this.signInPopUp).toBeVisible();
        await expect(this.signInPopUpButton).toBeVisible();
    }

    async search(text: string) {
        await this.searchInput.fill(text);
        await this.searchButton.click();
    }
}