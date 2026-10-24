/**
 * Test Data and Locators for OrangeHRM "Dashboard" Module
 * Beginner-friendly and well-documented test constants.
 */

export const dashboardTestData = {
    // -------------------------------------------------------------
    // 1. Dashboard Page URL & Headers
    // -------------------------------------------------------------
    expectedHeader: 'Dashboard',
    expectedUrl: 'dashboard/index',
    tabTitle: 'OrangeHRM',

    // -------------------------------------------------------------
    // 2. Expected Dashboard Widgets (7 Widgets in total)
    // -------------------------------------------------------------
    widgets: [
        'Time at Work',
        'My Actions',
        'Quick Launch',
        'Buzz Latest Posts',
        'Employees on Leave Today',
        'Employee Distribution by Sub Unit',
        'Employee Distribution by Location'
    ],

    // -------------------------------------------------------------
    // 3. Quick Launch Navigation Tiles (Data-Driven Testing)
    // Each entry specifies the tile title and the URL it should open.
    // -------------------------------------------------------------
    quickLaunchTiles: [
        { id: 1, name: 'Assign Leave', expectedUrl: 'leave/assignLeave' },
        { id: 2, name: 'Leave List', expectedUrl: 'leave/viewLeaveList' },
        { id: 3, name: 'Timesheets', expectedUrl: 'time/viewEmployeeTimesheet' },
        { id: 4, name: 'Apply Leave', expectedUrl: 'leave/applyLeave' },
        { id: 5, name: 'My Leave', expectedUrl: 'leave/viewMyLeaveList' },
        { id: 6, name: 'My Timesheet', expectedUrl: 'time/viewMyTimesheet' }
    ],

    // -------------------------------------------------------------
    // 4. Side Menu Items (All 12 Navigation Options)
    // Supports matching both the module endpoint and the redirected view page.
    // -------------------------------------------------------------
    sideMenuItems: [
        { name: 'Admin', expectedUrl: 'admin/(viewAdminModule|viewSystemUsers)' },
        { name: 'PIM', expectedUrl: 'pim/(viewPimModule|viewEmployeeList)' },
        { name: 'Leave', expectedUrl: 'leave/(viewLeaveModule|viewLeaveList)' },
        { name: 'Time', expectedUrl: 'time/(viewTimeModule|viewEmployeeTimesheet)' },
        { name: 'Recruitment', expectedUrl: 'recruitment/(viewRecruitmentModule|viewCandidates)' },
        { name: 'My Info', expectedUrl: 'pim/(viewPersonalDetails|viewMyDetails)' },
        { name: 'Performance', expectedUrl: 'performance/(viewPerformanceModule|searchEvaluatePerformanceReview)' },
        { name: 'Dashboard', expectedUrl: 'dashboard/index' },
        { name: 'Directory', expectedUrl: 'directory/viewDirectory' },
        { name: 'Maintenance', expectedUrl: 'maintenance/(viewMaintenanceModule|purgeEmployee)' },
        { name: 'Claim', expectedUrl: 'claim/(viewClaimModule|viewAssignClaim)' },
        { name: 'Buzz', expectedUrl: 'buzz/viewBuzz' }
    ],

    // -------------------------------------------------------------
    // 5. Side Menu Search Filter Scenarios
    // -------------------------------------------------------------
    menuSearch: {
        // Valid exact search: searching "Admin" should filter down to just "Admin"
        validTerm: 'Admin',
        expectedValidMatches: ['Admin'],

        // Partial search: searching "ea" should match "Leave"
        partialTerm: 'ea',
        expectedPartialMatch: 'Leave',

        // No-match search: searching an unknown string should show 0 results
        noMatchTerm: 'nonexistentxyz',
        expectedNoMatchCount: 0
    },

    // -------------------------------------------------------------
    // 6. Top Bar User Dropdown Data
    // -------------------------------------------------------------
    topBarDropdown: {
        // Options expected inside the user profile dropdown
        expectedOptions: ['About', 'Support', 'Change Password', 'Logout'],

        // About dialog
        aboutModalTitle: 'About',

        // Support page
        supportUrl: 'help/support',
        supportHeading: 'Getting Started with OrangeHRM',

        // Change Password form test data
        changePasswordUrl: 'pim/updatePassword',
        wrongCurrentPassword: 'WrongPassword123!',
        newPassword: 'NewSecurePassword123!',
        confirmPassword: 'NewSecurePassword123!',
        expectedPasswordError: 'Current Password is Incorrect',

        // Login page URL (after logout)
        loginUrl: 'auth/login'
    },

    // -------------------------------------------------------------
    // 7. Widgets containing dynamic visual charts (Canvas / SVG)
    // -------------------------------------------------------------
    chartWidgets: [
        'Time at Work',
        'Employee Distribution by Sub Unit',
        'Employee Distribution by Location'
    ],

    // -------------------------------------------------------------
    // 8. Attendance Punch In / Punch Out URL pattern
    // -------------------------------------------------------------
    attendanceUrlPattern: /.*attendance\/punch(In|Out)?/,

    // -------------------------------------------------------------
    // 9. Responsive Screen Resolutions to Test
    // -------------------------------------------------------------
    viewports: [
        { name: 'Desktop', width: 1366, height: 768 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
    ]
};

/**
 * UI Element Selectors (Locators) for the Dashboard Module
 */
export const locDashboardData = {
    // Top Bar & Branding
    header: '.oxd-topbar-header-breadcrumb h6',
    brandLogo: '.oxd-brand',
    brandLogoImg: '.oxd-brand-banner img, .oxd-brand-logo img',

    // Side Navigation Panel
    sidepanel: '.oxd-sidepanel',
    menuToggleButton: '.oxd-main-menu-button',
    menuSearchInput: '.oxd-main-menu-search input',
    menuItems: '.oxd-main-menu-item',
    activeMenuItem: '.oxd-main-menu-item.active',

    // User Profile Dropdown
    userDropdownTab: '.oxd-userdropdown-tab',
    userDropdownName: '.oxd-userdropdown-name',
    userDropdownImg: '.oxd-userdropdown-img',
    userDropdownLinks: '.oxd-userdropdown-link',

    // About Popup Dialog
    aboutModal: '.oxd-dialog-container-default',
    aboutModalTitle: '.oxd-dialog-container-default h6.orangehrm-main-title',
    aboutModalCloseBtn: '.oxd-dialog-close-button',

    // Support Page Heading
    supportHeader: 'h6:has-text("Getting Started with OrangeHRM"), .orangehrm-support-title',

    // Change Password Form Inputs & Buttons
    changePasswordCurrentInput: '.oxd-input-group:has-text("Current Password") input',
    changePasswordNewInput: '.oxd-input-group:has-text("Password"):not(:has-text("Current")):not(:has-text("Confirm")) input',
    changePasswordConfirmInput: '.oxd-input-group:has-text("Confirm Password") input',
    changePasswordSaveBtn: 'button[type="submit"]',
    changePasswordAlert: '.oxd-alert-content-text, .oxd-toast-content-text, .oxd-toast--error',

    // Dashboard Grid & Widget Containers
    dashboardGrid: '.orangehrm-dashboard-grid',
    widgets: '.orangehrm-dashboard-widget',
    widgetCards: '.oxd-sheet.orangehrm-dashboard-widget',
    widgetTitles: '.orangehrm-dashboard-widget-name, .orangehrm-dashboard-widget-header .oxd-text',
    widgetError: '.oxd-alert--error, .oxd-text--error',

    // Quick Launch Buttons
    quickLaunchCard: '.orangehrm-quick-launch-card',
    quickLaunchBtnByTitle: (title: string) => `button[title="${title}"]`,

    // "Time at Work" Punch In/Out button
    timeAtWorkPunchBtn: '.orangehrm-dashboard-widget:has-text("Time at Work") button.orangehrm-attendance-card-action, .orangehrm-dashboard-widget:has-text("Time at Work") button:has(.bi-stopwatch)',

    // Charts Elements
    canvasChart: 'canvas',
    svgChart: 'svg',

    // Mobile Hamburger Menu Button
    hamburgerBtn: '.oxd-topbar-header-hamburger, .oxd-topbar-header-top button'
};
