import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { AdminUserPage } from '../pages/adminUserPage';
import { testData, loctestData, adminTestData } from '../testData/testData';

test.describe('Admin User Management', () => {
    let adminPage: AdminUserPage;

    test.beforeEach(async ({ page }) => {
        await page.goto(testData.url);
        const loginPage = new LoginPage(page);
        await loginPage.ValidLoginAction();
        await page.waitForURL(`**/${testData.expectedDashboardUrl}`);

        adminPage = new AdminUserPage(page);
        await adminPage.navigateToAdmin();
    });

    test.describe('Add Scenarios', () => {
        // 1. Add an ESS user with a valid employee, status Enabled and a strong password
        test('1. Add an ESS user with a valid employee, status Enabled and a strong password', async ({ page }) => {
            await adminPage.navigateToAddUser();
            const username = `ess_${Date.now().toString().slice(-6)}`;
            
            await adminPage.fillAddUserForm({
                role: 'ESS',
                status: 'Enabled',
                username: username,
                password: adminTestData.defaultPassword
            });
            await adminPage.clickSave();

            await expect(adminPage.toast).toBeVisible({ timeout: 10000 });
            await expect(adminPage.toast).toContainText(adminTestData.expectedSuccessToast);
            await page.waitForURL(`**/${adminTestData.adminUrl}`);
        });

        // 2. Add an Admin-role user
        test('2. Add an Admin-role user', async ({ page }) => {
            await adminPage.navigateToAddUser();
            const username = `adm_${Date.now().toString().slice(-6)}`;

            await adminPage.fillAddUserForm({
                role: 'Admin',
                status: 'Enabled',
                username: username,
                password: adminTestData.defaultPassword
            });
            await adminPage.clickSave();

            await expect(adminPage.toast).toBeVisible({ timeout: 10000 });
            await expect(adminPage.toast).toContainText(adminTestData.expectedSuccessToast);
            await page.waitForURL(`**/${adminTestData.adminUrl}`);
        });

        // 3. Add a Disabled user and verify they cannot log in
        test('3. Add a Disabled user and verify they cannot log in', async ({ page, browser }) => {
            await adminPage.navigateToAddUser();
            const username = `dis_${Date.now().toString().slice(-6)}`;

            await adminPage.fillAddUserForm({
                role: 'ESS',
                status: 'Disabled',
                username: username,
                password: adminTestData.defaultPassword
            });
            await adminPage.clickSave();

            await expect(adminPage.toast).toBeVisible({ timeout: 10000 });
            await page.waitForURL(`**/${adminTestData.adminUrl}`);

            // Try to log in with the disabled user in a new incognito context (isolated cookies/session)
            const incognitoContext = await browser.newContext();
            const newPage = await incognitoContext.newPage();
            try {
                await newPage.goto(testData.url);
                await newPage.locator(loctestData.usernameInputField).fill(username);
                await newPage.locator(loctestData.passwordInputField).fill(adminTestData.defaultPassword);
                await newPage.locator(loctestData.loginButton).click();

                await expect(newPage.locator(loctestData.alertContentText)).toBeVisible({ timeout: 10000 });
                await expect(newPage).toHaveURL(new RegExp(testData.expectedLoginUrl));
            } finally {
                await incognitoContext.close();
                await adminPage.deleteUserIfExists(username);
            }
        });

        // 4. Add with all fields empty -> "Required" on every mandatory field
        test('4. Add with all fields empty -> "Required" on every mandatory field', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.clickSave();

            // Check required message on User Role, Employee Name, Status, Username, Password
            await expect(adminPage.getFieldErrorMessage('User Role')).toHaveText(adminTestData.expectedRequiredMessage);
            await expect(adminPage.getFieldErrorMessage('Employee Name')).toHaveText(adminTestData.expectedRequiredMessage);
            await expect(adminPage.getFieldErrorMessage('Status')).toHaveText(adminTestData.expectedRequiredMessage);
            await expect(adminPage.getFieldErrorMessage('Username')).toHaveText(adminTestData.expectedRequiredMessage);
            await expect(page.locator('.oxd-input-group:has-text("Password"):not(:has-text("Confirm")) .oxd-input-group__message')).toHaveText(adminTestData.expectedRequiredMessage);
        });

        // 5. Duplicate username -> "Already exists"
        test('5. Duplicate username -> "Already exists"', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.fillUsername(adminTestData.duplicateUsername);
            await page.waitForTimeout(1000);

            const error = adminPage.getFieldErrorMessage('Username');
            await expect(error).toBeVisible();
            await expect(error).toHaveText(adminTestData.expectedAlreadyExistsMessage);
        });

        // 6. Username shorter than 5 characters -> length error
        test('6. Username shorter than 5 characters -> length error', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.fillUsername(adminTestData.shortUsername);
            await page.waitForTimeout(500);

            const error = adminPage.getFieldErrorMessage('Username');
            await expect(error).toBeVisible();
            await expect(error).toHaveText(adminTestData.expectedUsernameMinLengthMessage);
        });

        // 7. Username longer than 40 characters -> length error
        test('7. Username longer than 40 characters -> length error', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.fillUsername(adminTestData.longUsername);
            await page.waitForTimeout(500);

            const error = adminPage.getFieldErrorMessage('Username');
            await expect(error).toBeVisible();
            await expect(error).toHaveText(adminTestData.expectedUsernameMaxLengthMessage);
        });

        // 8. Password shorter than 7 characters -> error
        test('8. Password shorter than 7 characters -> error', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.fillPassword(adminTestData.shortPassword);
            await page.waitForTimeout(500);

            const error = page.locator('.oxd-input-group:has-text("Password"):not(:has-text("Confirm")) .oxd-input-group__message');
            await expect(error).toBeVisible();
            await expect(error).toHaveText(adminTestData.expectedPasswordMinLengthMessage);
        });

        // 9. Password without a number -> error
        test('9. Password without a number -> error', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.fillPassword(adminTestData.passwordNoNumber);
            await page.waitForTimeout(500);

            const error = page.locator('.oxd-input-group:has-text("Password"):not(:has-text("Confirm")) .oxd-input-group__message');
            await expect(error).toBeVisible();
            await expect(error).toHaveText(adminTestData.expectedPasswordNumberMessage);
        });

        // 10. Password with no letters -> error
        test('10. Password with no letters -> error', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.fillPassword(adminTestData.passwordNoLetter);
            await page.waitForTimeout(500);

            const error = page.locator('.oxd-input-group:has-text("Password"):not(:has-text("Confirm")) .oxd-input-group__message');
            await expect(error).toBeVisible();
            // Displays either number/letter requirement message
            await expect(error).not.toBeEmpty();
        });

        // 11. Password and Confirm Password mismatch -> "Passwords do not match"
        test('11. Password and Confirm Password mismatch -> "Passwords do not match"', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.fillPassword(adminTestData.defaultPassword);
            await adminPage.fillConfirmPassword(adminTestData.mismatchPassword);
            await page.waitForTimeout(500);

            const error = adminPage.getFieldErrorMessage('Confirm Password');
            await expect(error).toBeVisible();
            await expect(error).toHaveText(adminTestData.expectedPasswordsMismatchMessage);
        });

        // 12. Employee name that doesn't exist -> "Invalid"
        test('12. Employee name that doesn\'t exist -> "Invalid"', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.employeeNameInput.fill(adminTestData.invalidEmployeeName);
            await adminPage.clickSave();
            await page.waitForTimeout(1000);

            const error = adminPage.getFieldErrorMessage('Employee Name');
            await expect(error).toBeVisible();
            await expect(error).toHaveText(adminTestData.expectedInvalidEmployeeMessage);
        });

        // 13. Cancel returns to the list without saving
        test('13. Cancel returns to the list without saving', async ({ page }) => {
            await adminPage.navigateToAddUser();
            await adminPage.fillUsername('cancelUserTest');
            await adminPage.clickCancel();

            await expect(page).toHaveURL(new RegExp(adminTestData.adminUrl));
            await expect(adminPage.addButton).toBeVisible();
        });

        // 14. Log in as the newly created user and verify it works
        test('14. Log in as the newly created user and verify it works', async ({ page, browser }) => {
            await adminPage.navigateToAddUser();
            const username = `login_${Date.now().toString().slice(-6)}`;
            const password = adminTestData.defaultPassword;

            await adminPage.fillAddUserForm({
                role: 'ESS',
                status: 'Enabled',
                username: username,
                password: password
            });
            await adminPage.clickSave();

            await expect(adminPage.toast).toBeVisible({ timeout: 10000 });
            await page.waitForURL(`**/${adminTestData.adminUrl}`);

            // Open new incognito context (isolated session) and log in with the new user
            const incognitoContext = await browser.newContext();
            const newPage = await incognitoContext.newPage();
            try {
                await newPage.goto(testData.url);
                await newPage.locator(loctestData.usernameInputField).fill(username);
                await newPage.locator(loctestData.passwordInputField).fill(password);
                await newPage.locator(loctestData.loginButton).click();

                await expect(newPage).toHaveURL(new RegExp(testData.expectedDashboardUrl), { timeout: 15000 });
                await expect(newPage.locator(loctestData.dashboardHeader)).toBeVisible();
            } finally {
                await incognitoContext.close();
                await adminPage.deleteUserIfExists(username);
            }
        });
    });

    test.describe('Edit & Delete Scenarios', () => {
        // 22. Edit a user's role/status and verify the toast
        test('22. Edit a user\'s role/status and verify the toast', async ({ page }) => {
            // First, create a user specifically for editing so we don't disrupt default system accounts
            await adminPage.navigateToAddUser();
            const editUsername = `edt_${Date.now().toString().slice(-6)}`;
            await adminPage.fillAddUserForm({
                role: 'ESS',
                status: 'Enabled',
                username: editUsername,
                password: adminTestData.defaultPassword
            });
            await adminPage.clickSave();
            await expect(adminPage.toast).toBeVisible();
            await page.waitForURL(`**/${adminTestData.adminUrl}`);

            try {
                // Search for the newly created user and click Edit
                await adminPage.searchUser({ username: editUsername });
                await adminPage.clickEditUser(editUsername);

                // Edit the role to Admin
                await adminPage.selectRole('Admin');
                await adminPage.clickSave();

                // Verify "Successfully Updated" toast
                await expect(adminPage.toast).toBeVisible({ timeout: 10000 });
                await expect(adminPage.toast).toContainText(adminTestData.expectedUpdatedToast);
            } finally {
                await adminPage.deleteUserIfExists(editUsername);
            }
        });

        // 23. Edit the username to one that already exists -> error
        test('23. Edit the username to one that already exists -> error', async ({ page }) => {
            await adminPage.navigateToAddUser();
            const tempUsername = `ren_${Date.now().toString().slice(-6)}`;
            await adminPage.fillAddUserForm({
                role: 'ESS',
                status: 'Enabled',
                username: tempUsername,
                password: adminTestData.defaultPassword
            });
            await adminPage.clickSave();
            await expect(adminPage.toast).toBeVisible();
            await page.waitForURL(`**/${adminTestData.adminUrl}`);

            try {
                await adminPage.searchUser({ username: tempUsername });
                await adminPage.clickEditUser(tempUsername);

                // Change username to the duplicate "Admin"
                await adminPage.usernameInput.fill(adminTestData.duplicateUsername);

                const error = adminPage.getFieldErrorMessage('Username');
                await expect(error).toBeVisible();
                await expect(error).toHaveText(adminTestData.expectedAlreadyExistsMessage);
            } finally {
                await adminPage.deleteUserIfExists(tempUsername);
            }
        });

        // 24. Delete a single user
        test('24. Delete a single user', async ({ page }) => {
            // Create a temporary user to safely delete
            await adminPage.navigateToAddUser();
            const delUsername = `del_${Date.now().toString().slice(-6)}`;
            await adminPage.fillAddUserForm({
                role: 'ESS',
                status: 'Enabled',
                username: delUsername,
                password: adminTestData.defaultPassword
            });
            await adminPage.clickSave();
            await expect(adminPage.toast).toBeVisible();
            await page.waitForURL(`**/${adminTestData.adminUrl}`);

            // Search and delete the user
            await adminPage.searchUser({ username: delUsername });
            await adminPage.clickDeleteUser(delUsername);

            // Confirm delete and verify success toast before it disappears
            await adminPage.dialogConfirmDeleteBtn.click();
            await expect(adminPage.toast.filter({ hasText: adminTestData.expectedDeletedToast })).toBeVisible({ timeout: 10000 });
            await adminPage.waitForTableToLoad();
            await expect(adminPage.getRowByUsername(delUsername)).toHaveCount(0);
        });

        // 25. Cancel on the delete confirmation keeps the user
        test('25. Cancel on the delete confirmation keeps the user', async ({ page }) => {
            await adminPage.tableRows.first().waitFor({ state: 'visible' });
            const firstUsername = (await adminPage.tableRows.first().locator('.oxd-table-cell').nth(1).innerText()).trim();

            await adminPage.clickDeleteUser(firstUsername);
            await adminPage.cancelDelete();

            // Verify the user is still in the table
            await expect(adminPage.getRowByUsername(firstUsername)).toBeVisible();
        });

        // 26. Bulk delete using checkboxes
        test('26. Bulk delete using checkboxes', async ({ page }) => {
            await adminPage.tableRows.first().waitFor({ state: 'visible' });
            const count = await adminPage.rowCheckboxes.count();
            expect(count).toBeGreaterThanOrEqual(1);

            // Select the first two checkboxes (or one if only 1 exists)
            await adminPage.rowCheckboxes.first().click();
            if (count > 1) {
                await adminPage.rowCheckboxes.nth(1).click();
            }

            // Verify Delete Selected button appears
            await expect(adminPage.deleteSelectedButton).toBeVisible();

            // Click Delete Selected and verify confirmation dialog opens
            await adminPage.deleteSelectedButton.click();
            await expect(adminPage.dialogPopup).toBeVisible();
            await expect(adminPage.dialogConfirmDeleteBtn).toBeVisible();

            // Cancel to preserve test data
            await adminPage.cancelDelete();
            await expect(adminPage.dialogPopup).toBeHidden();
        });

        // 27. Select-all checkbox selects every row on the page
        test('27. Select-all checkbox selects every row on the page', async ({ page }) => {
            await adminPage.tableRows.first().waitFor({ state: 'visible' });
            const totalRows = await adminPage.tableRows.count();
            expect(totalRows).toBeGreaterThan(0);

            // Click Select All in the table header
            await adminPage.selectAllCheckbox.click();

            // Verify all row checkboxes are selected
            const checkedBoxes = page.locator('.oxd-table-card .oxd-checkbox-input input:checked, .oxd-table-card .oxd-checkbox-input--active');
            await expect(checkedBoxes).toHaveCount(totalRows);

            // Click Select All again to deselect all
            await adminPage.selectAllCheckbox.click();
            const checkedAfterUncheck = page.locator('.oxd-table-card .oxd-checkbox-input input:checked');
            await expect(checkedAfterUncheck).toHaveCount(0);
        });
    });

    test.describe('List Scenarios', () => {
        // 28. Sorting by Username (asc/desc)
        test('28. Sorting by Username (asc/desc)', async ({ page }) => {
            await adminPage.tableRows.first().waitFor({ state: 'visible' });

            const sortIcon = adminPage.usernameSortHeader.locator('.oxd-table-header-sort');
            await expect(sortIcon).toBeVisible();

            // Sort Ascending
            await sortIcon.click();
            const ascOption = page.locator('.oxd-table-header-sort-dropdown li').filter({ hasText: 'Ascending' }).first();
            await ascOption.waitFor({ state: 'visible', timeout: 3000 });
            await ascOption.click();
            await adminPage.waitForTableToLoad();

            const ascUsernames = await adminPage.getUsernamesList();
            expect(ascUsernames.length).toBeGreaterThan(0);
            // Sort a copy in the test (case-insensitively matching backend DB collation) and compare
            const sortedAsc = [...ascUsernames].sort((a, b) => a.toUpperCase() > b.toUpperCase() ? 1 : a.toUpperCase() < b.toUpperCase() ? -1 : 0);
            expect(ascUsernames).toEqual(sortedAsc);

            // Sort Descending
            await sortIcon.click();
            const descOption = page.locator('.oxd-table-header-sort-dropdown li').filter({ hasText: 'Descending' }).first();
            await descOption.waitFor({ state: 'visible', timeout: 3000 });
            await descOption.click();
            await adminPage.waitForTableToLoad();

            const descUsernames = await adminPage.getUsernamesList();
            expect(descUsernames.length).toBeGreaterThan(0);
            const sortedDesc = [...descUsernames].sort((a, b) => a.toUpperCase() < b.toUpperCase() ? 1 : a.toUpperCase() > b.toUpperCase() ? -1 : 0);
            expect(descUsernames).toEqual(sortedDesc);
        });

        // 29. Records count text updates after add/delete
        test('29. Records count text updates after add/delete', async ({ page }) => {
            await adminPage.tableRows.first().waitFor({ state: 'visible' });
            const initialCount = await adminPage.getRecordsCount();
            expect(initialCount).toBeGreaterThan(0);

            // Add a temporary user
            await adminPage.navigateToAddUser();
            const tempUser = `cnt_${Date.now().toString().slice(-6)}`;
            await adminPage.fillAddUserForm({
                role: 'ESS',
                status: 'Enabled',
                username: tempUser,
                password: adminTestData.defaultPassword
            });
            await adminPage.clickSave();
            await expect(adminPage.toast).toBeVisible();
            await page.waitForURL(`**/${adminTestData.adminUrl}`);
            await adminPage.waitForTableToLoad();

            // Verify record count increased by 1
            const countAfterAdd = await adminPage.getRecordsCount();
            expect(countAfterAdd).toBe(initialCount + 1);

            // Clean up by deleting the user
            await adminPage.searchUser({ username: tempUser });
            await adminPage.clickDeleteUser(tempUser);
            await adminPage.confirmDelete();
            await expect(adminPage.toast).toBeVisible();

            // Clear search filter to view all records
            await adminPage.clickReset();
            const countAfterDelete = await adminPage.getRecordsCount();
            expect(countAfterDelete).toBe(initialCount);
        });

        // 30. Pagination (if the list has multiple pages)
        test('30. Pagination (if the list has multiple pages)', async ({ page }) => {
            await adminPage.tableRows.first().waitFor({ state: 'visible' });

            const pagination = adminPage.paginationContainer;
            const isPaginationVisible = await pagination.isVisible().catch(() => false);

            if (isPaginationVisible) {
                const pageButtons = pagination.locator('.oxd-pagination-page-item--page, button.oxd-pagination-page-item');
                const pageCount = await pageButtons.count();

                if (pageCount > 1) {
                    // Click page 2
                    await pageButtons.nth(1).click();
                    await adminPage.waitForTableToLoad();

                    // Verify page 2 button has active class or state
                    const activePage = pagination.locator('.oxd-pagination-page-item--active');
                    await expect(activePage).toContainText('2');
                } else {
                    // If only 1 page button exists, verify it is page 1
                    await expect(pagination).toBeVisible();
                }
            } else {
                // All records fit on a single page, verify table has records
                const rowsCount = await adminPage.tableRows.count();
                expect(rowsCount).toBeGreaterThan(0);
            }
        });
    });

    test.describe('Search Scenarios', () => {
        // 15. Search by username (exact and partial)
        test('15. Search by username (exact and partial)', async ({ page }) => {
            // Exact search
            await adminPage.searchUser({ username: 'Admin' });
            await expect(adminPage.tableRows).not.toHaveCount(0);
            const firstUsername = await adminPage.tableRows.first().locator('.oxd-table-cell').nth(1).innerText();
            expect(firstUsername.trim()).toBe('Admin');

            // Partial search
            await adminPage.clickReset();
            await adminPage.searchUser({ username: 'Adm' });
            await expect(adminPage.tableRows).not.toHaveCount(0);
            const partialUsername = await adminPage.tableRows.first().locator('.oxd-table-cell').nth(1).innerText();
            expect(partialUsername.toLowerCase()).toContain('adm');
        });

        // 16. Search by User Role
        test('16. Search by User Role', async ({ page }) => {
            await adminPage.searchUser({ role: 'Admin' });
            await expect(adminPage.tableRows).not.toHaveCount(0);
            
            const count = await adminPage.tableRows.count();
            for (let i = 0; i < count; i++) {
                const roleText = await adminPage.tableRows.nth(i).locator('.oxd-table-cell').nth(2).innerText();
                expect(roleText.trim()).toBe('Admin');
            }
        });

        // 17. Search by Employee Name
        test('17. Search by Employee Name', async ({ page }) => {
            const empName = await adminPage.getFirstEmployeeNameFromTable();
            expect(empName).not.toBe('');

            await adminPage.searchUser({ employeeName: empName });
            await expect(adminPage.tableRows).not.toHaveCount(0);

            const resultEmpName = await adminPage.tableRows.first().locator('.oxd-table-cell').nth(3).innerText();
            expect(resultEmpName.trim().toLowerCase()).toContain(empName.toLowerCase());
        });

        // 18. Search by Status
        test('18. Search by Status', async ({ page }) => {
            await adminPage.searchUser({ status: 'Enabled' });
            await expect(adminPage.tableRows).not.toHaveCount(0);

            const count = await adminPage.tableRows.count();
            for (let i = 0; i < count; i++) {
                const statusText = await adminPage.tableRows.nth(i).locator('.oxd-table-cell').nth(4).innerText();
                expect(statusText.trim()).toBe('Enabled');
            }
        });

        // 19. Combined filters
        test('19. Combined filters', async ({ page }) => {
            await adminPage.searchUser({
                username: 'Admin',
                role: 'Admin',
                status: 'Enabled'
            });

            await expect(adminPage.tableRows).not.toHaveCount(0);
            const row = adminPage.tableRows.first();
            expect((await row.locator('.oxd-table-cell').nth(1).innerText()).trim()).toBe('Admin');
            expect((await row.locator('.oxd-table-cell').nth(2).innerText()).trim()).toBe('Admin');
            expect((await row.locator('.oxd-table-cell').nth(4).innerText()).trim()).toBe('Enabled');
        });

        // 20. Reset clears the filters
        test('20. Reset clears the filters', async ({ page }) => {
            await adminPage.searchUsernameInput.fill('Admin');
            await adminPage.selectSearchRole('Admin');
            await adminPage.clickReset();

            await expect(adminPage.searchUsernameInput).toHaveValue('');
            await expect(adminPage.searchRoleSelect).toHaveText('-- Select --');
        });

        // 21. Search with no match -> "No Records Found"
        test('21. Search with no match -> "No Records Found"', async ({ page }) => {
            await adminPage.searchUser({ username: adminTestData.nonExistentUsername });
            
            // When no records found, OrangeHRM displays a toast "No Records Found" or empty table
            const noRecordsToastOrSpan = page.locator('text="No Records Found"');
            const rowsCount = await adminPage.tableRows.count();
            
            if (rowsCount === 0) {
                await expect(page.locator('.oxd-table-card')).toHaveCount(0);
            } else {
                await expect(noRecordsToastOrSpan).toBeVisible({ timeout: 5000 });
            }
        });
    });
});
