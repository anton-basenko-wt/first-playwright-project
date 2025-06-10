import { test, expect } from '@playwright/test';
import { YoutubeVideoPage } from "../pages/youtube-video.page";
import { BasePO } from '../pages/base-PO'

test.beforeEach(async ({ page }) => {
    const videoPage = new YoutubeVideoPage(page);
    await videoPage.goto();
    await page.waitForLoadState('load');
});

test.describe('Page check', () => {
    test('title should be YouTube', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);
        await videoPage.checkPageTitle();
    });

    test('YouTube logo should be visible', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);
        await BasePO.elementIsVisible(videoPage.logo);
    });
});

test.describe('Search check', () => {
    test('Search bar is visible', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);
        await BasePO.elementIsVisible(videoPage.searchBar);
    });

    test('Search', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);

        await videoPage.search('news');
        await expect(page).toHaveURL(/\/.*news.*/)
    });
});

test.describe('Sign in Pop Up', () => {
    test('sign in pop up should pop up when subscribing', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);
        await BasePO.clickElement(videoPage.subscribeButton);
        await videoPage.checkSignInPopUp();
    });

    test('sign in pop up should pop up when liking the video', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);
        await BasePO.clickElement(videoPage.likeButton);
        await videoPage.checkSignInPopUp();
    });

    test('sign in pop up should pop up when disliking the video', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);
        await BasePO.clickElement(videoPage.dislikeButton);
        await videoPage.checkSignInPopUp();
    });

    test('sign in redirect', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);
        await BasePO.clickElement(videoPage.likeButton);
        await videoPage.checkSignInPopUp();
        await BasePO.clickElement(videoPage.signInPopUpButton);

        await expect(page).toHaveURL(/accounts\.google\.com.*\/signin\/.*/);
    });
});

test.describe('Play/pause video', () => {
    test('pause video', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);

        // Check if video is playing
        await expect(videoPage.videoPlayer).toContainClass('playing-mode');

        // Pause the video
        await videoPage.videoPlayer.press('f');
        await videoPage.videoPlayer.press('k');
        await page.waitForTimeout(5000);

        // Check if it's paused
        await expect(videoPage.videoPlayer).toContainClass('paused-mode');
    });

    test('play video', async ({ page }) => {
        const videoPage = new YoutubeVideoPage(page);

        // Check if video is playing
        await expect(videoPage.videoPlayer).toContainClass('playing-mode');

        // Pause the video
        await videoPage.videoPlayer.press('f');
        await videoPage.videoPlayer.press('k');
        await page.waitForTimeout(3000);

        // Play the video
        await videoPage.videoPlayer.press('k');
        await page.waitForTimeout(5000);

        // Check if it's playing
        await expect(videoPage.videoPlayer).toContainClass('playing-mode');
    });
});