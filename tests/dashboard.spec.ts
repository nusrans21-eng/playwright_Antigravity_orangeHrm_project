import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { testData, loctestData } from '../testData/testData';
import { dashboardTestData } from '../testData/dashboardTestData';

/**
 * OrangeHRM - Dashboard Module Automation Test Suite
 *
 * Beginner-friendly test implementation covering all 20 required scenarios across 5 areas:
 *  - Area 1: Page & Widgets (Scenarios 1 - 3)
 *  - Area 2: Quick Launch (Scenario 4, Data-Driven)
 *  - Area 3: Side Menu (Scenarios 5 - 8)
 *  - Area 4: Top Bar (Scenarios 9 - 14)
 *  - Area 5: General (Scenarios 15 - 20)
 */

test.describe('OrangeHRM - Dashboard Module Automation Suite', () => {
    let dashboardPage: DashboardPage;

    // Login and navigate to the Dashboard page before running each test
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Step 1: Open the OrangeHRM login page
        await page.goto(testData.url, { waitUntil: 'domcontentloaded' });

        // Step 2: Perform valid login using predefined admin credentials
        await loginPage.ValidLoginAction();

        // Step 3: Wait until the dashboard URL is reached
        await page.waitForURL(`**/${testData.expectedDashboardUrl}`);

        // Step 4: Initialize the Dashboard Page Object and wait for the header to be visible
        dashboardPage = new DashboardPage(page);
        await dashboardPage.header.waitFor({ state: 'visible', timeout: 15000 });
    });

    // =========================================================================
    // AREA 1: PAGE & WIDGETS
    // =========================================================================
    test.describe('Area 1: Page & Widgets', () => {

        // Scenario 1: Header "Dashboard" and URL are correct after login
        test('1. Header "Dashboard" and URL are correct after login', async ({ page }) => {
            // Step 1: Verify that the current page URL ends with 'dashboard/index'
            await expect(page).toHaveURL(new RegExp(dashboardTestData.expectedUrl));

            // Step 2: Verify that the top bar breadcrumb header is visible
            await expect(dashboardPage.header).toBeVisible();

            // Step 3: Verify that the header text equals "Dashboard"
            await expect(dashboardPage.header).toHaveText(dashboardTestData.expectedHeader);
        });

        // Scenario 2: Verify all 7 widgets are visible on the Dashboard
        test('2. All 7 widgets are visible on Dashboard', async () => {
            // Loop through each expected widget name and verify its card is visible
            for (const widgetName of dashboardTestData.widgets) {
                const widget = dashboardPage.getWidget(widgetName);
                await expect(widget, `Widget "${widgetName}" should be visible on dashboard`).toBeVisible({
                    timeout: 10000
                });
            }
        });

        // Scenario 3: Each widget has a title and loads without an error message
        test('3. Each widget has a title and loads without an error message', async () => {
            // For each of the 7 widgets:
            for (const widgetName of dashboardTestData.widgets) {
                // Step 1: Verify the widget title header is visible and contains the widget name
                const widgetTitle = dashboardPage.getWidgetTitle(widgetName);
                await expect(widgetTitle, `Widget "${widgetName}" title should be visible`).toBeVisible();
                await expect(widgetTitle).toContainText(widgetName);

                // Step 2: Verify that no error alert banner is present inside the widget
                const hasError = await dashboardPage.hasWidgetError(widgetName);
                expect(hasError, `Widget "${widgetName}" should not display any error message`).toBeFalsy();
            }
        });
    });

    // =========================================================================
    // AREA 2: QUICK LAUNCH (DATA-DRIVEN)
    // =========================================================================
    test.describe('Area 2: Quick Launch', () => {

        // Scenario 4: Data-driven testing for each of the 6 Quick Launch tiles
        // Runs an independent test for each tile: Assign Leave, Leave List, Timesheets, Apply Leave, My Leave, My Timesheet
        dashboardTestData.quickLaunchTiles.forEach((tile) => {
            test(`4.${tile.id} Quick Launch tile "${tile.name}" navigates to correct page`, async ({ page }) => {
                // Step 1: Click the Quick Launch button for the specified tile
                await dashboardPage.clickQuickLaunch(tile.name);

                // Step 2: Verify the browser navigates to the expected URL for this tile
                await expect(
                    page,
                    `Clicking tile "${tile.name}" should open URL containing "${tile.expectedUrl}"`
                ).toHaveURL(new RegExp(tile.expectedUrl));
            });
        });
    });

    // =========================================================================
    // AREA 3: SIDE MENU
    // =========================================================================
    test.describe('Area 3: Side Menu', () => {

        // Scenario 5: Every menu item opens the right page and URL
        test('5. Every menu item opens the right page and URL', async ({ page }) => {
            // Set extended timeout because we are verifying 12 different module pages
            test.setTimeout(120000);

            for (const menu of dashboardTestData.sideMenuItems) {
                // Step 1: Click the side menu item
                await dashboardPage.clickMenuItem(menu.name);

                // Step 2: Verify the page navigates to the expected module URL
                await expect(
                    page,
                    `Menu item "${menu.name}" should navigate to URL matching "${menu.expectedUrl}"`
                ).toHaveURL(new RegExp(menu.expectedUrl), { timeout: 15000 });

                // Step 3: If on Maintenance (which requires admin authentication), return to Dashboard before continuing
                if (menu.name === 'Maintenance') {
                    await dashboardPage.navigateToDashboard();
                }
            }
        });

        // Scenario 6: Active menu item is highlighted
        test('6. Active menu item is highlighted', async () => {
            // Step 1: Verify the active menu item element is visible
            await expect(dashboardPage.activeMenuItem).toBeVisible();

            // Step 2: Verify that "Dashboard" is the currently highlighted/active item
            const activeText = await dashboardPage.getActiveMenuItemText();
            expect(activeText).toBe(dashboardTestData.expectedHeader);
        });

        // Scenario 7: Collapse and expand the menu with the toggle
        test('7. Collapse and expand the menu with the toggle', async () => {
            // Step 1: Confirm the menu is expanded by default (does not have 'toggled' class)
            expect(await dashboardPage.isSideMenuCollapsed()).toBeFalsy();

            // Step 2: Click the toggle button to collapse the side menu
            await dashboardPage.toggleSideMenu();

            // Step 3: Verify the side menu is now collapsed (has 'toggled' class)
            expect(await dashboardPage.isSideMenuCollapsed()).toBeTruthy();

            // Step 4: Click the toggle button again to expand the side menu back
            await dashboardPage.toggleSideMenu();

            // Step 5: Verify the side menu is expanded again
            expect(await dashboardPage.isSideMenuCollapsed()).toBeFalsy();
        });

        // Scenario 8: Menu search with a valid term, a partial term and a no-match term
        test('8. Menu search with a valid term, a partial term and a no-match term', async () => {
            // Case 1: Search with a valid exact term ("Admin")
            await dashboardPage.searchMenu(dashboardTestData.menuSearch.validTerm);
            let visibleItems = await dashboardPage.getVisibleMenuItems();
            expect(visibleItems).toEqual(dashboardTestData.menuSearch.expectedValidMatches);

            // Case 2: Search with a partial term ("ea") -> should match "Leave"
            await dashboardPage.searchMenu(dashboardTestData.menuSearch.partialTerm);
            visibleItems = await dashboardPage.getVisibleMenuItems();
            expect(visibleItems).toContain(dashboardTestData.menuSearch.expectedPartialMatch);

            // Case 3: Search with a no-match term ("nonexistentxyz") -> should show 0 results
            await dashboardPage.searchMenu(dashboardTestData.menuSearch.noMatchTerm);
            visibleItems = await dashboardPage.getVisibleMenuItems();
            expect(visibleItems.length).toBe(dashboardTestData.menuSearch.expectedNoMatchCount);
        });
    });

    // =========================================================================
    // AREA 4: TOP BAR
    // =========================================================================
    test.describe('Area 4: Top Bar', () => {

        // Scenario 9: Username and avatar visible
        test('9. Username and avatar visible', async () => {
            // Step 1: Verify the logged-in user's name is displayed in the top bar
            await expect(dashboardPage.userDropdownName).toBeVisible();
            const username = (await dashboardPage.userDropdownName.textContent())?.trim();
            expect(username).toBeTruthy();

            // Step 2: Verify the user profile avatar image is visible and has a source URL
            await expect(dashboardPage.userDropdownImg).toBeVisible();
            const avatarSrc = await dashboardPage.userDropdownImg.getAttribute('src');
            expect(avatarSrc).toBeTruthy();
        });

        // Scenario 10: Dropdown shows About, Support, Change Password, Logout
        test('10. Dropdown shows About, Support, Change Password, Logout', async () => {
            // Step 1: Open the user dropdown and retrieve all available menu options
            const options = await dashboardPage.getUserDropdownOptions();

            // Step 2: Verify the options match ['About', 'Support', 'Change Password', 'Logout']
            expect(options).toEqual(dashboardTestData.topBarDropdown.expectedOptions);
        });

        // Scenario 11: About dialog opens and closes
        test('11. About dialog opens and closes', async () => {
            // Step 1: Open the About dialog via the user dropdown
            await dashboardPage.openAboutDialog();

            // Step 2: Verify the dialog popup is visible and displays the title "About"
            await expect(dashboardPage.aboutModal).toBeVisible();
            await expect(dashboardPage.aboutModalTitle).toHaveText(dashboardTestData.topBarDropdown.aboutModalTitle);

            // Step 3: Close the dialog by clicking the (X) button
            await dashboardPage.closeAboutDialog();

            // Step 4: Verify the dialog is closed / hidden
            await expect(dashboardPage.aboutModal).toBeHidden();
        });

        // Scenario 12: Support page opens
        test('12. Support page opens', async ({ page }) => {
            // Step 1: Click "Support" in the user profile dropdown
            await dashboardPage.navigateToSupport();

            // Step 2: Verify the URL contains 'help/support'
            await expect(page).toHaveURL(new RegExp(dashboardTestData.topBarDropdown.supportUrl));

            // Step 3: Verify the main heading "Getting Started with OrangeHRM" is displayed
            await expect(dashboardPage.supportHeader.first()).toBeVisible({ timeout: 10000 });
        });

        // Scenario 13: Change Password page opens, with wrong current password -> error (do not submit a real change)
        test('13. Change Password page opens, with wrong current password -> error', async ({ page }) => {
            // Step 1: Open the Change Password page via user dropdown
            await dashboardPage.navigateToChangePassword();
            await expect(page).toHaveURL(new RegExp(dashboardTestData.topBarDropdown.changePasswordUrl));

            // Step 2: Fill out form with a deliberately wrong current password and click Save
            await dashboardPage.submitWrongCurrentPassword(
                dashboardTestData.topBarDropdown.wrongCurrentPassword,
                dashboardTestData.topBarDropdown.newPassword,
                dashboardTestData.topBarDropdown.confirmPassword
            );

            // Step 3: Verify an error message appears stating "Current Password is Incorrect"
            await expect(dashboardPage.changePasswordAlert.first()).toBeVisible({ timeout: 15000 });
            await expect(dashboardPage.changePasswordAlert.first()).toContainText(
                dashboardTestData.topBarDropdown.expectedPasswordError
            );
        });

        // Scenario 14: Logout returns to the login page; Back does not show the Dashboard
        test('14. Logout returns to the login page; Back does not show the Dashboard', async ({ page }) => {
            // Step 1: Click Logout from the user dropdown
            await dashboardPage.logout();

            // Step 2: Verify we are redirected to the login page
            await expect(page).toHaveURL(new RegExp(dashboardTestData.topBarDropdown.loginUrl));
            await expect(page.locator(loctestData.usernameInputField)).toBeVisible({ timeout: 15000 });

            // Step 3: Press browser Back button
            await page.goBack();
            await page.waitForTimeout(1500);

            // Step 4: Verify Dashboard content (header and widgets) is NOT visible / session is closed
            await expect(dashboardPage.header).toBeHidden();
            await expect(dashboardPage.dashboardGrid).toBeHidden();
        });
    });

    // =========================================================================
    // AREA 5: GENERAL
    // =========================================================================
    test.describe('Area 5: General', () => {

        // Scenario 15: Logo click returns to the Dashboard
        test('15. Logo click returns to the Dashboard', async ({ page }) => {
            // Step 1: Navigate away from Dashboard to the Admin module first
            await page.goto(testData.url.replace('auth/login', 'admin/viewSystemUsers'));
            await page.locator('.oxd-topbar-header-breadcrumb').waitFor({ state: 'visible', timeout: 15000 });

            // Step 2: Click the application brand logo
            await dashboardPage.clickLogo();

            // Step 3: Verify the user is navigated back to the Dashboard
            await expect(page).toHaveURL(new RegExp(dashboardTestData.expectedUrl));
            await expect(dashboardPage.header).toHaveText(dashboardTestData.expectedHeader);
        });

        // Scenario 16: Refresh keeps you logged in on the same page
        test('16. Refresh keeps you logged in on the same page', async ({ page }) => {
            // Step 1: Refresh the current browser page
            await page.reload();
            await dashboardPage.header.waitFor({ state: 'visible', timeout: 15000 });

            // Step 2: Verify the user remains on the Dashboard without being logged out
            await expect(page).toHaveURL(new RegExp(dashboardTestData.expectedUrl));
            await expect(dashboardPage.header).toHaveText(dashboardTestData.expectedHeader);
            await expect(dashboardPage.dashboardGrid).toBeVisible();
        });

        // Scenario 17: Tab title is "OrangeHRM"
        test('17. Tab title is "OrangeHRM"', async ({ page }) => {
            // Verify the browser tab title equals "OrangeHRM"
            await expect(page).toHaveTitle(dashboardTestData.tabTitle);
        });

        // Scenario 18: Widget charts render (canvas/svg present)
        test('18. Widget charts render (canvas/svg present)', async () => {
            // Verify that each chart widget renders its <canvas> or <svg> chart element
            for (const widgetName of dashboardTestData.chartWidgets) {
                const chart = dashboardPage.getWidgetChart(widgetName);
                await expect(chart.first(), `Chart in widget "${widgetName}" should render`).toBeVisible({
                    timeout: 10000
                });
            }
        });

        // Scenario 19: "Time at Work" Punch In/Out icon navigates to Attendance
        test('19. "Time at Work" Punch In/Out icon navigates to Attendance', async ({ page }) => {
            // Step 1: Click the Stopwatch / Punch icon in the "Time at Work" widget
            await dashboardPage.clickTimeAtWorkPunch();

            // Step 2: Verify the URL navigates to the Attendance module (punchIn / punchOut)
            await expect(page).toHaveURL(dashboardTestData.attendanceUrlPattern);
        });

        // Scenario 20: Responsive: the layout is usable at 1366x768, 768x1024 and 375x667
        test('20. Responsive: the layout is usable at 1366x768, 768x1024 and 375x667', async ({ page }) => {
            // Test across Desktop (1366x768), Tablet (768x1024), and Mobile (375x667) resolutions
            for (const vp of dashboardTestData.viewports) {
                // Step 1: Resize the browser viewport
                await page.setViewportSize({ width: vp.width, height: vp.height });
                await page.waitForTimeout(500);

                // Step 2: Verify the dashboard grid layout remains visible and functional
                await expect(
                    dashboardPage.dashboardGrid,
                    `Dashboard grid should be visible and usable at ${vp.width}x${vp.height} (${vp.name})`
                ).toBeVisible();
            }
        });
    });
});
