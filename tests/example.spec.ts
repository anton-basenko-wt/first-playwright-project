import { test } from '@playwright/test';
import { ExamplePage } from "../pages/example.page";

test('has title', async ({ page }) => {
  const examplePage = new ExamplePage(page);
  await examplePage.goto();
  await examplePage.checkTitle();
});

test('get started link', async ({ page }) => {
  const examplePage = new ExamplePage(page);
  await examplePage.goto();
  await examplePage.clickGetStartedLink();
  await examplePage.expectInstallationHeadingVisible();
});
