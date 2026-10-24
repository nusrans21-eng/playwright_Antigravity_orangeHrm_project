import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { testData, loctestData } from '../testData/testData';

test.describe('OrangeHRM Login Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testData.url);
    });

    test('Verify login with valid credentials', async ({ page }) => {
        let objLogin = new LoginPage(page);
        await objLogin.ValidLoginAction();

        await expect(page).toHaveURL(new RegExp(testData.expectedDashboardUrl));
        await expect(page.locator(loctestData.dashboardHeader)).toHaveText(testData.expectedDashboardHeader);
    });

    test('Verify login with invalid credentials', async ({ page }) => {
        let objLogin = new LoginPage(page);
        await objLogin.InvalidLoginAction();

        await expect(page.locator(loctestData.alertContentText)).toBeVisible();
        await expect(page.locator(loctestData.alertContentText)).toHaveText(testData.expectedErrorMessage);
        await expect(page).toHaveURL(new RegExp(testData.expectedLoginUrl));
    });

    test('Verify login with empty credentials', async ({ page }) => {
        let objLogin = new LoginPage(page);
        await objLogin.EmptyLoginAction();

        const errorMessages = page.locator(loctestData.fieldErrorMessage);
        await expect(errorMessages).toHaveCount(testData.expectedRequiredCount);
        await expect(errorMessages.first()).toHaveText(testData.expectedRequiredMessage);
        await expect(errorMessages.nth(1)).toHaveText(testData.expectedRequiredMessage);
        await expect(page).toHaveURL(new RegExp(testData.expectedLoginUrl));
    });
});
