# OrangeHRM Playwright + TypeScript Test Automation Framework

A production-ready test automation framework using **Playwright** with **TypeScript** and the **Page Object Model (POM)** design pattern, built for the OrangeHRM open-source demo application.

---

## 🚀 Features & Architecture

- **Page Object Model (POM)**: Complete separation of test logic from page actions and element locators.
- **Centralized Data & Locators**:
  - `testData/testData.ts`: Holds application URLs, valid/invalid credentials, and expected assertion strings.
  - `loctestData`: Holds CSS/attribute selectors. No locators or test data are hardcoded in page classes or test specs.
- **Full Traceability & Reporting**:
  - Playwright HTML reporter configured with `open: 'never'` for CI/CD compatibility.
  - Isolated HTML reports generated per test case using `cross-env PLAYWRIGHT_HTML_OUTPUT_DIR`.
  - Artifact evidence generation: `screenshot: 'on'`, `video: 'on'`, and `trace: 'on'`.
  - Zero retries (`retries: 0`) for deterministic test verification.

---

## 📁 Project Structure

```text
playwright_project_02/
├── testData/
│   └── testData.ts             # Centralized test data (testData, adminTestData) and locators (loctestData, locAdminUserData)
├── pages/
│   ├── loginPage.ts            # LoginPage POM class
│   └── adminUserPage.ts        # AdminUserPage POM class (User Management)
├── tests/
│   ├── login.spec.ts           # Login test suite (valid, invalid, empty credentials)
│   └── adminUser.spec.ts       # Consolidated Admin User Management test suite (30 scenarios)
├── reports/                    # Generated HTML reports per scenario / area
├── package.json                # Project dependencies and npm test/report scripts
├── playwright.config.ts        # Playwright configuration (workers: 1, trace/video/screenshot)
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # Documentation and run guides
```

---

## 🛠️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

---

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Note for Windows PowerShell if script execution is restricted: you can run `npm.cmd install`)*

2. **Install Chromium browser binary**:
   ```bash
   npx playwright install chromium
   ```
   *(On Windows PowerShell: `npx.cmd playwright install chromium`)*

---

## 🧪 Test Scenarios

| Scenario | Spec File | Actions | Assertions |
|---|---|---|---|
| **Valid Login** | `tests/validLogin.spec.ts` | Navigates to login page, enters valid credentials (`Admin` / `admin123`), clicks Login. | URL contains `dashboard/index`; topbar header displays `Dashboard`. |
| **Invalid Login** | `tests/invalidLogin.spec.ts` | Navigates to login page, enters wrong credentials, clicks Login. | Alert error message shows `Invalid credentials`; URL stays on `auth/login`. |
| **Empty Login** | `tests/emptyLogin.spec.ts` | Navigates to login page, clicks Login without input. | Both username & password show `Required` (2 messages); URL stays on `auth/login`. |

---

## 🏃 Running Tests

### 1. Run All Tests Together (Default HTML Report)
```bash
npm test
```

### 2. Run Each Test Individually with Dedicated HTML Reports
To execute all scenarios sequentially, saving each scenario's HTML report in its own folder (`reports/valid-login`, `reports/invalid-login`, `reports/empty-login`):
```bash
npm run test:each
```

### 3. Run Specific Scenarios
- **Valid Login only**:
  ```bash
  npm run test:valid
  ```
- **Invalid Login only**:
  ```bash
  npm run test:invalid
  ```
- **Empty Login only**:
  ```bash
  npm run test:empty
  ```
- **Admin User Management (All 30 Tests)**:
  ```bash
  npm run test:admin
  ```
- **Admin User Management (By Area)**:
  ```bash
  npm run test:admin:add
  npm run test:admin:editdelete
  npm run test:admin:list
  npm run test:admin:search
  ```

---

## 📊 Viewing HTML Reports

To view the generated reports in your browser:

- **Default Report**:
  ```bash
  npm run report
  ```
- **Valid Login Report**:
  ```bash
  npm run report:valid
  ```
- **Invalid Login Report**:
  ```bash
  npm run report:invalid
  ```
- **Empty Login Report**:
  ```bash
  npm run report:empty
  ```
- **Admin User Management Report**:
  ```bash
  npm run report:admin
  npm run report:admin:add
  npm run report:admin:editdelete
  npm run report:admin:list
  npm run report:admin:search
  ```

---

## 📋 Coding Standards & Guidelines

1. **Zero Hardcoded Selectors / Data**: All selectors must be defined in `loctestData` and imported. All expected values and input strings must be defined in `testData`.
2. **Page Class Structure**:
   - Takes `private page: Page` in constructor.
   - Declares locator fields as string properties from `loctestData`.
   - Encapsulates actions into dedicated methods: `ValidLoginAction()`, `InvalidLoginAction()`, `EmptyLoginAction()`.
3. **Spec Structure**:
   - Calls `await page.goto(testData.url)`.
   - Instantiates POM: `let objLogin = new LoginPage(page)`.
   - Executes the corresponding action.
   - Performs clean assertions with Playwright's `expect`.
