export const testData = {
    url: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    validUsername: 'Admin',
    validPassword: 'admin123',
    invalidUsername: 'AdminWrong',
    invalidPassword: 'wrongPass123',
    expectedDashboardUrl: 'dashboard/index',
    expectedDashboardHeader: 'Dashboard',
    expectedErrorMessage: 'Invalid credentials',
    expectedRequiredMessage: 'Required',
    expectedRequiredCount: 2,
    expectedLoginUrl: 'auth/login'
};

export const loctestData = {
    usernameInputField: 'input[name="username"]',
    passwordInputField: 'input[name="password"]',
    loginButton: 'button[type="submit"]',
    alertContentText: '.oxd-alert-content-text',
    fieldErrorMessage: '.oxd-input-field-error-message',
    dashboardHeader: '.oxd-topbar-header-breadcrumb h6'
};

export const adminTestData = {
    adminUrl: 'admin/viewSystemUsers',
    saveUserUrl: 'admin/saveSystemUser',
    defaultPassword: 'Password123!',
    mismatchPassword: 'Password456!',
    duplicateUsername: 'Admin',
    invalidEmployeeName: 'NonExistentEmployee_XYZ_123',
    nonExistentUsername: 'NonExistent_User_99999_XYZ',
    shortUsername: 'user',
    longUsername: 'a'.repeat(41),
    shortPassword: 'Pass1',
    passwordNoNumber: 'PasswordWithoutNumber',
    passwordNoLetter: '12345678',
    expectedRequiredMessage: 'Required',
    expectedAlreadyExistsMessage: 'Already exists',
    expectedUsernameMinLengthMessage: 'Should be at least 5 characters',
    expectedUsernameMaxLengthMessage: 'Should not exceed 40 characters',
    expectedPasswordMinLengthMessage: 'Should have at least 7 characters',
    expectedPasswordNumberMessage: 'Your password must contain minimum 1 number',
    expectedPasswordsMismatchMessage: 'Passwords do not match',
    expectedInvalidEmployeeMessage: 'Invalid',
    expectedSuccessToast: 'Successfully Saved',
    expectedUpdatedToast: 'Successfully Updated',
    expectedDeletedToast: 'Successfully Deleted'
};

export const locAdminUserData = {
    adminMenuLink: 'a[href*="viewAdminModule"]',
    userManagementHeader: '.oxd-topbar-header-breadcrumb h6',
    addButton: 'button:has-text("Add")',
    saveButton: 'button[type="submit"]',
    cancelButton: 'button:has-text("Cancel")',
    searchButton: 'button:has-text("Search")',
    resetButton: 'button:has-text("Reset")',
    roleSelect: '.oxd-input-group:has-text("User Role") .oxd-select-text',
    statusSelect: '.oxd-input-group:has-text("Status") .oxd-select-text',
    employeeNameInput: '.oxd-input-group:has-text("Employee Name") input',
    usernameInput: '.oxd-input-group:has-text("Username") input',
    passwordInput: '.oxd-input-group:has-text("Password"):not(:has-text("Confirm")) input',
    confirmPasswordInput: '.oxd-input-group:has-text("Confirm Password") input',
    searchUsernameInput: '.oxd-table-filter .oxd-input-group:has-text("Username") input',
    searchRoleSelect: '.oxd-table-filter .oxd-input-group:has-text("User Role") .oxd-select-text',
    searchEmployeeInput: '.oxd-table-filter .oxd-input-group:has-text("Employee Name") input',
    searchStatusSelect: '.oxd-table-filter .oxd-input-group:has-text("Status") .oxd-select-text',
    tableRows: '.oxd-table-card',
    selectAllCheckbox: '.oxd-table-header .oxd-checkbox-input',
    rowCheckboxes: '.oxd-table-card .oxd-checkbox-input',
    deleteSelectedButton: 'button:has-text("Delete Selected")',
    recordsCountText: '.orangehrm-horizontal-padding span',
    usernameSortHeader: '.oxd-table-header-cell:has-text("Username")',
    sortIcon: '.oxd-table-header-sort',
    sortDropdownAsc: '.oxd-table-header-sort-dropdown li:has-text("Ascending")',
    sortDropdownDesc: '.oxd-table-header-sort-dropdown li:has-text("Descending")',
    paginationContainer: '.oxd-pagination',
    toast: '.oxd-toast',
    successToast: '.oxd-toast--success',
    infoToast: '.oxd-toast--info',
    dialogPopup: '.orangehrm-dialog-popup',
    dialogConfirmDeleteBtn: '.orangehrm-dialog-popup button:has-text("Yes, Delete")',
    dialogCancelDeleteBtn: '.orangehrm-dialog-popup button:has-text("No, Cancel")'
};

export { myInfoTestData, locMyInfoData } from './myInfoTestData';
export { dashboardTestData, locDashboardData } from './dashboardTestData';
