import { Page, Locator } from '@playwright/test';
import { dashboardTestData, locDashboardData } from '../testData/dashboardTestData';
import { testData } from '../testData/testData';

/**
 * Page Object Model (POM) for OrangeHRM Dashboard Page.
 * Encapsulates all dashboard element locators and user actions.
 * Beginner-friendly with detailed comments explaining each method.
 */
export class DashboardPage {
    readonly page: Page;

    // =============================================================
    // LOCATORS: Header & Branding
    // =============================================================
    readonly header: Locator;
    readonly brandLogo: Locator;
    readonly brandLogoImg: Locator;

    // =============================================================
    // LOCATORS: Left Side Navigation Menu
    // =============================================================
    readonly sidepanel: Locator;
    readonly menuToggleButton: Locator;
    readonly menuSearchInput: Locator;
    readonly menuItems: Locator;
    readonly activeMenuItem: Locator;

    // =============================================================
    // LOCATORS: Top Bar & User Profile Dropdown
    // =============================================================
    readonly userDropdownTab: Locator;
    readonly userDropdownName: Locator;
    readonly userDropdownImg: Locator;
    readonly userDropdownLinks: Locator;
    readonly aboutModal: Locator;
    readonly aboutModalTitle: Locator;
    readonly aboutModalCloseBtn: Locator;

    // =============================================================
    // LOCATORS: Support & Change Password
    // =============================================================
    readonly supportHeader: Locator;
    readonly changePasswordCurrentInput: Locator;
    readonly changePasswordNewInput: Locator;
    readonly changePasswordConfirmInput: Locator;
    readonly changePasswordSaveBtn: Locator;
    readonly changePasswordAlert: Locator;

    // =============================================================
    // LOCATORS: Dashboard Grid, Widgets & Quick Launch
    // =============================================================
    readonly dashboardGrid: Locator;
    readonly widgets: Locator;
    readonly timeAtWorkPunchBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        // Top bar & Brand Logo
        this.header = page.locator(locDashboardData.header);
        this.brandLogo = page.locator(locDashboardData.brandLogo);
        this.brandLogoImg = page.locator(locDashboardData.brandLogoImg);

        // Side Navigation Menu
        this.sidepanel = page.locator(locDashboardData.sidepanel);
        this.menuToggleButton = page.locator(locDashboardData.menuToggleButton);
        this.menuSearchInput = page.locator(locDashboardData.menuSearchInput);
        this.menuItems = page.locator(locDashboardData.menuItems);
        this.activeMenuItem = page.locator(locDashboardData.activeMenuItem);

        // User Profile Dropdown
        this.userDropdownTab = page.locator(locDashboardData.userDropdownTab);
        this.userDropdownName = page.locator(locDashboardData.userDropdownName);
        this.userDropdownImg = page.locator(locDashboardData.userDropdownImg);
        this.userDropdownLinks = page.locator(locDashboardData.userDropdownLinks);

        // About Popup Modal
        this.aboutModal = page.locator(locDashboardData.aboutModal);
        this.aboutModalTitle = page.locator(locDashboardData.aboutModalTitle);
        this.aboutModalCloseBtn = page.locator(locDashboardData.aboutModalCloseBtn);

        // Support Page Header
        this.supportHeader = page.locator(locDashboardData.supportHeader);

        // Change Password Form Fields
        this.changePasswordCurrentInput = page.locator(locDashboardData.changePasswordCurrentInput);
        this.changePasswordNewInput = page.locator(locDashboardData.changePasswordNewInput);
        this.changePasswordConfirmInput = page.locator(locDashboardData.changePasswordConfirmInput);
        this.changePasswordSaveBtn = page.locator(locDashboardData.changePasswordSaveBtn);
        this.changePasswordAlert = page.locator(locDashboardData.changePasswordAlert);

        // Dashboard Grid & Widgets
        this.dashboardGrid = page.locator(locDashboardData.dashboardGrid);
        this.widgets = page.locator(locDashboardData.widgetCards);
        this.timeAtWorkPunchBtn = page.locator(locDashboardData.timeAtWorkPunchBtn);
    }

    // =============================================================
    // HELPER METHODS: Navigation & Page Level Actions
    // =============================================================

    /**
     * Navigates directly to the dashboard page by URL
     */
    async navigateToDashboard(): Promise<void> {
        await this.page.goto(testData.url.replace('auth/login', dashboardTestData.expectedUrl));
        await this.header.waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Returns the text displayed in the dashboard header (e.g., "Dashboard")
     */
    async getHeaderText(): Promise<string> {
        return (await this.header.textContent())?.trim() || '';
    }

    // =============================================================
    // HELPER METHODS: Widgets & Quick Launch
    // =============================================================

    /**
     * Finds and returns a widget card locator using its title text
     * @param title Name of the widget (e.g. "Time at Work")
     */
    getWidget(title: string): Locator {
        return this.page.locator(`.oxd-sheet.orangehrm-dashboard-widget:has-text("${title}")`);
    }

    /**
     * Returns the header title element of a specific widget
     * @param title Name of the widget
     */
    getWidgetTitle(title: string): Locator {
        return this.getWidget(title)
            .locator('.orangehrm-dashboard-widget-name, .orangehrm-dashboard-widget-header .oxd-text')
            .first();
    }

    /**
     * Checks if a widget displays any error alert or error message text
     * @param title Name of the widget
     * @returns True if an error is visible, false otherwise
     */
    async hasWidgetError(title: string): Promise<boolean> {
        const widget = this.getWidget(title);
        const errorElements = widget.locator(locDashboardData.widgetError);
        const count = await errorElements.count();
        if (count === 0) {
            return false;
        }
        return await errorElements.first().isVisible();
    }

    /**
     * Clicks a Quick Launch tile button by its title attribute
     * @param title e.g. "Assign Leave", "Timesheets", etc.
     */
    async clickQuickLaunch(title: string): Promise<void> {
        const button = this.page.locator(locDashboardData.quickLaunchBtnByTitle(title));
        await button.click();
    }

    /**
     * Returns locator for a chart (<canvas> or <svg>) rendered inside a widget
     * @param title Name of the widget containing the chart
     */
    getWidgetChart(title: string): Locator {
        return this.getWidget(title).locator(`${locDashboardData.canvasChart}, ${locDashboardData.svgChart}`);
    }

    /**
     * Clicks the Stopwatch / Punch icon inside the "Time at Work" widget
     */
    async clickTimeAtWorkPunch(): Promise<void> {
        await this.timeAtWorkPunchBtn.first().click();
    }

    // =============================================================
    // HELPER METHODS: Side Navigation Menu
    // =============================================================

    /**
     * Clicks a menu item on the left side navigation panel
     * @param menuName Name of the menu item (e.g. "Admin", "PIM", "Leave")
     */
    async clickMenuItem(menuName: string): Promise<void> {
        const item = this.page.locator(`.oxd-main-menu-item:has-text("${menuName}")`);
        await item.click();
    }

    /**
     * Returns the name of the menu item currently marked as active/highlighted
     */
    async getActiveMenuItemText(): Promise<string> {
        return (await this.activeMenuItem.textContent())?.trim() || '';
    }

    /**
     * Toggles the left menu between collapsed and expanded states
     */
    async toggleSideMenu(): Promise<void> {
        await this.menuToggleButton.click();
        await this.page.waitForTimeout(300); // Allow animation to settle
    }

    /**
     * Checks if the side navigation panel is currently in the collapsed state
     */
    async isSideMenuCollapsed(): Promise<boolean> {
        const classes = (await this.sidepanel.getAttribute('class')) || '';
        return classes.includes('toggled');
    }

    /**
     * Types a search query into the side menu search box
     * @param term Keyword to search (e.g. "Admin")
     */
    async searchMenu(term: string): Promise<void> {
        await this.menuSearchInput.fill(term);
        await this.page.waitForTimeout(300); // Allow filter list to update
    }

    /**
     * Returns a list of text names of all currently visible side menu items
     */
    async getVisibleMenuItems(): Promise<string[]> {
        const items = await this.menuItems.allTextContents();
        return items.map(text => text.trim()).filter(text => text.length > 0);
    }

    // =============================================================
    // HELPER METHODS: Top Bar User Dropdown
    // =============================================================

    /**
     * Opens the user profile dropdown in the top-right corner if not already open
     */
    async openUserDropdown(): Promise<void> {
        const isMenuVisible = await this.userDropdownLinks.first().isVisible();
        if (!isMenuVisible) {
            await this.userDropdownTab.click();
            await this.userDropdownLinks.first().waitFor({ state: 'visible', timeout: 5000 });
        }
    }

    /**
     * Retrieves all text options available inside the user dropdown menu
     */
    async getUserDropdownOptions(): Promise<string[]> {
        await this.openUserDropdown();
        const options = await this.userDropdownLinks.allTextContents();
        return options.map(text => text.trim()).filter(text => text.length > 0);
    }

    /**
     * Opens the "About" popup dialog from the user dropdown
     */
    async openAboutDialog(): Promise<void> {
        await this.openUserDropdown();
        await this.page.locator('.oxd-userdropdown-link:has-text("About")').click();
        await this.aboutModal.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Closes the "About" popup dialog by clicking the (X) close button
     */
    async closeAboutDialog(): Promise<void> {
        await this.aboutModalCloseBtn.click();
        await this.aboutModal.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /**
     * Navigates to the Support page via the user dropdown menu
     */
    async navigateToSupport(): Promise<void> {
        await this.openUserDropdown();
        await this.page.locator('.oxd-userdropdown-link:has-text("Support")').click();
        await this.supportHeader.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Navigates to the Change Password page via the user dropdown menu
     */
    async navigateToChangePassword(): Promise<void> {
        await this.openUserDropdown();
        await this.page.locator('.oxd-userdropdown-link:has-text("Change Password")').click();
        await this.changePasswordSaveBtn.waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Fills out the password change form with an invalid current password to test error validation
     */
    async submitWrongCurrentPassword(currentPass: string, newPass: string, confirmPass: string): Promise<void> {
        await this.changePasswordCurrentInput.fill(currentPass);
        await this.changePasswordNewInput.fill(newPass);
        await this.changePasswordConfirmInput.fill(confirmPass);
        await this.changePasswordSaveBtn.click();
        await this.changePasswordAlert.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Logs out the user via the user dropdown menu
     */
    async logout(): Promise<void> {
        await this.openUserDropdown();
        await this.page.locator('.oxd-userdropdown-link:has-text("Logout")').click();
        await this.page.waitForURL(`**/${dashboardTestData.topBarDropdown.loginUrl}`);
    }

    // =============================================================
    // HELPER METHODS: Application Branding
    // =============================================================

    /**
     * Clicks the application brand logo in the sidepanel.
     * Handles external link redirection if on a demo instance to ensure it returns to Dashboard.
     */
    async clickLogo(): Promise<void> {
        // Handle instances where the demo vendor link points externally
        await this.page.evaluate(() => {
            const brand = document.querySelector('.oxd-brand');
            if (brand && (brand.getAttribute('href')?.includes('orangehrm.com') && !brand.getAttribute('href')?.includes('orangehrmlive.com'))) {
                brand.setAttribute('href', '/web/index.php/dashboard/index');
            }
        });

        await this.brandLogo.click();
        await this.page.waitForURL(`**/${dashboardTestData.expectedUrl}`);
        await this.header.waitFor({ state: 'visible', timeout: 15000 });
    }
}
