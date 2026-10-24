import { Page, Locator } from '@playwright/test';
import { adminTestData, locAdminUserData } from '../testData/testData';

export class AdminUserPage {
    readonly page: Page;

    // Main Navigation & Buttons
    readonly adminMenuLink: Locator;
    readonly userManagementHeader: Locator;
    readonly addButton: Locator;
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;

    // Add / Edit User Form
    readonly roleSelect: Locator;
    readonly statusSelect: Locator;
    readonly employeeNameInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;

    // Search Form
    readonly searchUsernameInput: Locator;
    readonly searchRoleSelect: Locator;
    readonly searchEmployeeInput: Locator;
    readonly searchStatusSelect: Locator;

    // Table & Actions
    readonly tableRows: Locator;
    readonly selectAllCheckbox: Locator;
    readonly rowCheckboxes: Locator;
    readonly deleteSelectedButton: Locator;
    readonly recordsCountText: Locator;
    readonly usernameSortHeader: Locator;
    readonly paginationContainer: Locator;
    readonly toast: Locator;
    readonly successToast: Locator;
    readonly infoToast: Locator;
    readonly dialogPopup: Locator;
    readonly dialogConfirmDeleteBtn: Locator;
    readonly dialogCancelDeleteBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.adminMenuLink = this.page.locator(locAdminUserData.adminMenuLink);
        this.userManagementHeader = this.page.locator(locAdminUserData.userManagementHeader);
        this.addButton = this.page.locator(locAdminUserData.addButton);
        this.saveButton = this.page.locator(locAdminUserData.saveButton);
        this.cancelButton = this.page.locator(locAdminUserData.cancelButton);
        this.searchButton = this.page.locator(locAdminUserData.searchButton);
        this.resetButton = this.page.locator(locAdminUserData.resetButton);

        this.roleSelect = this.page.locator(locAdminUserData.roleSelect);
        this.statusSelect = this.page.locator(locAdminUserData.statusSelect);
        this.employeeNameInput = this.page.locator(locAdminUserData.employeeNameInput);
        this.usernameInput = this.page.locator(locAdminUserData.usernameInput);
        this.passwordInput = this.page.locator(locAdminUserData.passwordInput);
        this.confirmPasswordInput = this.page.locator(locAdminUserData.confirmPasswordInput);

        this.searchUsernameInput = this.page.locator(locAdminUserData.searchUsernameInput);
        this.searchRoleSelect = this.page.locator(locAdminUserData.searchRoleSelect);
        this.searchEmployeeInput = this.page.locator(locAdminUserData.searchEmployeeInput);
        this.searchStatusSelect = this.page.locator(locAdminUserData.searchStatusSelect);

        this.tableRows = this.page.locator(locAdminUserData.tableRows);
        this.selectAllCheckbox = this.page.locator(locAdminUserData.selectAllCheckbox);
        this.rowCheckboxes = this.page.locator(locAdminUserData.rowCheckboxes);
        this.deleteSelectedButton = this.page.locator(locAdminUserData.deleteSelectedButton);
        this.recordsCountText = this.page.locator(locAdminUserData.recordsCountText);
        this.usernameSortHeader = this.page.locator(locAdminUserData.usernameSortHeader);
        this.paginationContainer = this.page.locator(locAdminUserData.paginationContainer);
        this.toast = this.page.locator(locAdminUserData.toast);
        this.successToast = this.page.locator(locAdminUserData.successToast);
        this.infoToast = this.page.locator(locAdminUserData.infoToast);
        this.dialogPopup = this.page.locator(locAdminUserData.dialogPopup);
        this.dialogConfirmDeleteBtn = this.page.locator(locAdminUserData.dialogConfirmDeleteBtn);
        this.dialogCancelDeleteBtn = this.page.locator(locAdminUserData.dialogCancelDeleteBtn);
    }

    /**
     * Navigate to Admin User Management page
     */
    async navigateToAdmin() {
        await this.adminMenuLink.first().click();
        await this.page.waitForURL(`**/${adminTestData.adminUrl}`);
        await this.waitForTableToLoad();
    }

    /**
     * Navigate to Add User form
     */
    async navigateToAddUser() {
        await this.addButton.click();
        await this.page.waitForURL(`**/${adminTestData.saveUserUrl}`);
        await this.saveButton.waitFor({ state: 'visible' });
    }

    /**
     * Wait for table data / spinner to settle
     */
    async waitForTableToLoad() {
        await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    }

    /**
     * Select option from an OrangeHRM select dropdown
     */
    async selectDropdownOption(dropdownLocator: Locator, optionText: string) {
        await dropdownLocator.click();
        const option = this.page.locator('.oxd-select-dropdown [role="option"], .oxd-select-dropdown div')
            .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
            .first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    async selectRole(role: 'Admin' | 'ESS') {
        await this.selectDropdownOption(this.roleSelect, role);
    }

    async selectStatus(status: 'Enabled' | 'Disabled') {
        await this.selectDropdownOption(this.statusSelect, status);
    }

    async selectSearchRole(role: 'Admin' | 'ESS') {
        await this.selectDropdownOption(this.searchRoleSelect, role);
    }

    async selectSearchStatus(status: 'Enabled' | 'Disabled') {
        await this.selectDropdownOption(this.searchStatusSelect, status);
    }

    /**
     * Select employee name from autocomplete dropdown
     */
    async selectEmployeeName(prefix: string = 'a'): Promise<string> {
        await this.employeeNameInput.fill(prefix);
        const option = this.page.locator('.oxd-autocomplete-dropdown [role="option"]').first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        const selectedText = (await option.innerText()).trim();
        await option.click();
        await this.page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        return selectedText;
    }

    /**
     * Select employee name in search filter
     */
    async selectSearchEmployeeName(name: string) {
        await this.searchEmployeeInput.fill(name);
        const option = this.page.locator('.oxd-autocomplete-dropdown [role="option"]').first();
        if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
            await option.click();
            await this.page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        }
    }

    /**
     * Retrieve the first valid employee name from the current table
     */
    async getFirstEmployeeNameFromTable(): Promise<string> {
        await this.waitForTableToLoad();
        const empCell = this.tableRows.first().locator('.oxd-table-cell').nth(3);
        return (await empCell.innerText()).trim();
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(password: string) {
        await this.confirmPasswordInput.fill(password);
    }

    async clickSave() {
        await this.saveButton.click();
    }

    async clickCancel() {
        await this.cancelButton.click();
        await this.page.waitForURL(`**/${adminTestData.adminUrl}`);
        await this.waitForTableToLoad();
    }

    /**
     * Fill Add User form completely
     */
    async fillAddUserForm(data: {
        role: 'Admin' | 'ESS';
        status: 'Enabled' | 'Disabled';
        employeeName?: string;
        username: string;
        password?: string;
        confirmPassword?: string;
    }): Promise<string> {
        await this.selectRole(data.role);
        await this.selectStatus(data.status);
        
        let emp = data.employeeName;
        if (!emp) {
            emp = await this.selectEmployeeName('a');
        } else {
            await this.employeeNameInput.fill(emp);
            const opt = this.page.locator('.oxd-autocomplete-dropdown [role="option"]').first();
            if (await opt.isVisible({ timeout: 5000 }).catch(() => false)) {
                await opt.click();
                await this.page.locator('.oxd-autocomplete-dropdown').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
            }
        }

        await this.fillUsername(data.username);
        const pwd = data.password ?? adminTestData.defaultPassword;
        const confirmPwd = data.confirmPassword ?? pwd;
        await this.fillPassword(pwd);
        await this.fillConfirmPassword(confirmPwd);
        return emp;
    }

    /**
     * Search with provided filters
     */
    async searchUser(filters: {
        username?: string;
        role?: 'Admin' | 'ESS';
        employeeName?: string;
        status?: 'Enabled' | 'Disabled';
    }) {
        if (filters.username !== undefined) {
            await this.searchUsernameInput.fill(filters.username);
        }
        if (filters.role !== undefined) {
            await this.selectSearchRole(filters.role);
        }
        if (filters.employeeName !== undefined) {
            await this.selectSearchEmployeeName(filters.employeeName);
        }
        if (filters.status !== undefined) {
            await this.selectSearchStatus(filters.status);
        }
        const respPromise = this.page.waitForResponse(
            resp => resp.url().includes('/api/v2/admin/users') && resp.status() === 200,
            { timeout: 15000 }
        ).catch(() => null);
        await this.searchButton.click();
        await respPromise;
        await this.waitForTableToLoad();
    }

    async clickReset() {
        const respPromise = this.page.waitForResponse(
            resp => resp.url().includes('/api/v2/admin/users') && resp.status() === 200,
            { timeout: 15000 }
        ).catch(() => null);
        await this.resetButton.click();
        await respPromise;
        await this.waitForTableToLoad();
    }

    /**
     * Field validation error locator for any labeled field
     */
    getFieldErrorMessage(fieldLabel: string): Locator {
        return this.page.locator(`.oxd-input-group:has-text("${fieldLabel}") .oxd-input-group__message`);
    }

    /**
     * Find row matching username
     */
    getRowByUsername(username: string): Locator {
        return this.tableRows.filter({
            has: this.page.locator('.oxd-table-cell:nth-child(2)').filter({ hasText: new RegExp(`^\\s*${username}\\s*$`, 'i') })
        });
    }

    async clickEditUser(username: string) {
        const row = this.getRowByUsername(username);
        await row.locator('button:has(.bi-pencil-fill), .bi-pencil-fill').first().click();
        await this.page.waitForURL(/.*admin\/saveSystemUser.*/);
        await this.saveButton.waitFor({ state: 'visible' });
    }

    async clickDeleteUser(username: string) {
        const row = this.getRowByUsername(username);
        await row.locator('button:has(.bi-trash), .bi-trash').first().click();
        await this.dialogPopup.waitFor({ state: 'visible' });
    }

    async confirmDelete() {
        const respPromise = this.page.waitForResponse(
            resp => resp.url().includes('/api/v2/admin/users') && resp.request().method() === 'DELETE',
            { timeout: 15000 }
        ).catch(() => null);
        await this.dialogConfirmDeleteBtn.click();
        await respPromise;
        await this.waitForTableToLoad();
    }

    async cancelDelete() {
        await this.dialogCancelDeleteBtn.click();
        await this.dialogPopup.waitFor({ state: 'hidden' });
    }

    /**
     * Safely search and delete a user if they exist in the list (cleanup helper)
     */
    async deleteUserIfExists(username: string) {
        await this.navigateToAdmin();
        await this.searchUser({ username });
        const row = this.getRowByUsername(username);
        if (await row.isVisible({ timeout: 3000 }).catch(() => false)) {
            await this.clickDeleteUser(username);
            await this.confirmDelete();
        }
    }

    /**
     * Get records found number from text e.g. "(17) Records Found"
     */
    async getRecordsCount(): Promise<number> {
        const text = await this.recordsCountText.innerText();
        const match = text.match(/\((\d+)\)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    /**
     * Get array of all usernames currently visible in the table
     */
    async getUsernamesList(): Promise<string[]> {
        await this.waitForTableToLoad();
        const count = await this.tableRows.count();
        const names: string[] = [];
        for (let i = 0; i < count; i++) {
            const cell = this.tableRows.nth(i).locator('.oxd-table-cell').nth(1);
            names.push((await cell.innerText()).trim());
        }
        return names;
    }
}
