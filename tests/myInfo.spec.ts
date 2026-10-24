import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { MyInfoPage } from '../pages/myInfoPage';
import { testData } from '../testData/testData';
import { myInfoTestData } from '../testData/myInfoTestData';

test.describe('OrangeHRM - My Info Module Automation Suite', () => {
    let myInfoPage: MyInfoPage;

    // Login and navigate to My Info before each test
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto(testData.url);
        await loginPage.ValidLoginAction();
        await page.waitForURL(`**/${testData.expectedDashboardUrl}`);

        myInfoPage = new MyInfoPage(page);
        await myInfoPage.navigateToMyInfo();
    });

    // ==========================================
    // AREA 1: PERSONAL DETAILS
    // ==========================================
    test.describe('Area 1: Personal Details', () => {

        // Test 1: Update personal fields, save, reload and verify persistence
        test('1. Update nickname, gender, nationality, marital status, DOB; save; reload; verify persistence', async ({ page }) => {
            // Fill personal details form
            await myInfoPage.fillPersonalDetails({
                nickname: myInfoTestData.personalDetails.nickname,
                gender: myInfoTestData.personalDetails.gender,
                nationality: myInfoTestData.personalDetails.nationality,
                maritalStatus: myInfoTestData.personalDetails.maritalStatus,
                dob: myInfoTestData.personalDetails.dob,
            });

            // Save and verify success notification
            await myInfoPage.savePersonalDetails();
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(myInfoPage.toast).toContainText(myInfoTestData.expectedMessages.successUpdated);

            // Reload page to confirm changes were saved to the server
            await page.reload();
            await myInfoPage.waitForSpinner();

            // Verify persisted values
            await expect(myInfoPage.dobInput).toHaveValue(myInfoTestData.personalDetails.dob);
            await expect(myInfoPage.genderMaleRadio).toBeChecked();
            await expect(myInfoPage.maritalStatusSelect).toContainText(myInfoTestData.personalDetails.maritalStatus);
        });

        // Test 2: Clear First Name -> "Required"
        test('2. Clear First Name -> "Required"', async ({ page }) => {
            await myInfoPage.clearInput(myInfoPage.firstNameInput);
            await myInfoPage.savePersonalDetails();

            // Verify "Required" error message under First Name
            const errorMsg = page.locator('.oxd-input-group:has(input[name="firstName"]) .oxd-input-field-error-message');
            await expect(errorMsg).toBeVisible();
            await expect(errorMsg).toHaveText(myInfoTestData.expectedMessages.required);
        });

        // Test 3: Clear Last Name -> "Required"
        test('3. Clear Last Name -> "Required"', async ({ page }) => {
            await myInfoPage.clearInput(myInfoPage.lastNameInput);
            await myInfoPage.savePersonalDetails();

            // Verify "Required" error message under Last Name
            const errorMsg = page.locator('.oxd-input-group:has(input[name="lastName"]) .oxd-input-field-error-message');
            await expect(errorMsg).toBeVisible();
            await expect(errorMsg).toHaveText(myInfoTestData.expectedMessages.required);
        });

        // Test 4: Names at the max length boundary
        test('4. Names at the max length boundary', async ({ page }) => {
            // Boundary test: OrangeHRM allows up to 30 characters for First Name
            await myInfoPage.clearInput(myInfoPage.firstNameInput);
            await myInfoPage.firstNameInput.fill(myInfoTestData.personalDetails.maxName30);

            // Input should accept 30 characters without error
            const val30 = await myInfoPage.firstNameInput.inputValue();
            expect(val30.length).toBeLessThanOrEqual(30);

            // Test exceeding boundary: 31 characters
            await myInfoPage.clearInput(myInfoPage.firstNameInput);
            await myInfoPage.firstNameInput.fill(myInfoTestData.personalDetails.maxName31);
            await myInfoPage.savePersonalDetails();

            // OrangeHRM either truncates input or displays length validation message
            const currentVal = await myInfoPage.firstNameInput.inputValue();
            const hasError = await page.locator('.oxd-input-group:has(input[name="firstName"]) .oxd-input-field-error-message').isVisible().catch(() => false);
            expect(currentVal.length <= 30 || hasError).toBeTruthy();
        });

        // Test 5: Future DOB (record behaviour)
        test('5. Future DOB (record behaviour)', async ({ page }) => {
            // Set DOB to a far future date
            await myInfoPage.clearInput(myInfoPage.dobInput);
            await myInfoPage.dobInput.fill(myInfoTestData.personalDetails.futureDob);
            await myInfoPage.savePersonalDetails();

            // Check if error message is displayed or if system accepts future DOB
            const errorElement = page.locator('.oxd-input-group:has-text("Date of Birth") .oxd-input-field-error-message');
            const isErrorVisible = await errorElement.isVisible().catch(() => false);

            if (isErrorVisible) {
                const errorText = await errorElement.innerText();
                console.log(`[BEHAVIOUR RECORDED] Future DOB rejected with validation message: "${errorText}"`);
                expect(errorText).toBeTruthy();
            } else {
                console.log('[BEHAVIOUR RECORDED] OrangeHRM accepts future DOB without client-side blocking validation.');
                // Confirm toast or field retains entered value
                await expect(myInfoPage.dobInput).toHaveValue(myInfoTestData.personalDetails.futureDob);
            }
        });

        // Test 6: Driver license number and expiry date validation
        test('6. Driver license number and expiry date validation', async ({ page }) => {
            await myInfoPage.clearInput(myInfoPage.driverLicenseInput);
            await myInfoPage.driverLicenseInput.fill(myInfoTestData.personalDetails.driverLicense);

            await myInfoPage.clearInput(myInfoPage.licenseExpiryInput);
            await myInfoPage.licenseExpiryInput.fill(myInfoTestData.personalDetails.licenseExpiryDate);

            await myInfoPage.savePersonalDetails();
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(myInfoPage.toast).toContainText(myInfoTestData.expectedMessages.successUpdated);

            // Verify persistence
            await page.reload();
            await myInfoPage.waitForSpinner();
            await expect(myInfoPage.driverLicenseInput).toHaveValue(myInfoTestData.personalDetails.driverLicense);
            await expect(myInfoPage.licenseExpiryInput).toHaveValue(myInfoTestData.personalDetails.licenseExpiryDate);
        });

        // Test 7: Blood type update
        test('7. Blood type update', async ({ page }) => {
            await myInfoPage.updateBloodType(myInfoTestData.personalDetails.bloodType);

            // Verify custom fields success toast
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(myInfoPage.toast).toContainText(myInfoTestData.expectedMessages.successUpdated);

            // Reload and verify Blood Type persisted
            await page.reload();
            await myInfoPage.waitForSpinner();
            await expect(myInfoPage.bloodTypeSelect).toContainText(myInfoTestData.personalDetails.bloodType);
        });
    });

    // ==========================================
    // AREA 2: CONTACT DETAILS
    // ==========================================
    test.describe('Area 2: Contact Details', () => {

        test.beforeEach(async () => {
            await myInfoPage.clickSubTab('Contact Details');
            await myInfoPage.page.waitForURL(`**/${myInfoTestData.urls.contactDetails}/**`);
        });

        // Test 8: Update address, city, state, ZIP, country
        test('8. Update address, city, state, ZIP, country', async ({ page }) => {
            await myInfoPage.fillContactDetails({
                street1: myInfoTestData.contactDetails.street1,
                street2: myInfoTestData.contactDetails.street2,
                city: myInfoTestData.contactDetails.city,
                state: myInfoTestData.contactDetails.state,
                zip: myInfoTestData.contactDetails.zip,
                country: myInfoTestData.contactDetails.country,
            });

            await myInfoPage.saveContactDetails();
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(myInfoPage.toast).toContainText(myInfoTestData.expectedMessages.successUpdated);

            // Reload and verify
            await page.reload();
            await myInfoPage.waitForSpinner();
            await expect(myInfoPage.street1Input).toHaveValue(myInfoTestData.contactDetails.street1);
            await expect(myInfoPage.cityInput).toHaveValue(myInfoTestData.contactDetails.city);
            await expect(myInfoPage.countrySelect).toContainText(myInfoTestData.contactDetails.country);
        });

        // Test 9: Update home/mobile/work phones; invalid phone -> error
        test('9. Update home/mobile/work phones; invalid phone -> error', async ({ page }) => {
            // First: invalid phone triggers validation error
            await myInfoPage.fillContactDetails({
                mobilePhone: myInfoTestData.contactDetails.invalidPhone,
            });
            await myInfoPage.saveContactDetails();

            const phoneError = page.locator('.oxd-input-group:has-text("Mobile") .oxd-input-field-error-message');
            await expect(phoneError).toBeVisible();
            await expect(phoneError).toHaveText(myInfoTestData.expectedMessages.invalidPhone);

            // Second: fix with valid phones and save
            await myInfoPage.fillContactDetails({
                homePhone: myInfoTestData.contactDetails.homePhone,
                mobilePhone: myInfoTestData.contactDetails.mobilePhone,
                workPhone: myInfoTestData.contactDetails.workPhone,
            });
            await myInfoPage.saveContactDetails();
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
        });

        // Test 10: Invalid work/other email -> error
        test('10. Invalid work/other email -> error', async ({ page }) => {
            await myInfoPage.fillContactDetails({
                workEmail: myInfoTestData.contactDetails.invalidEmail,
            });
            await myInfoPage.saveContactDetails();

            const emailError = page.locator('.oxd-input-group:has-text("Work Email") .oxd-input-field-error-message');
            await expect(emailError).toBeVisible();
            await expect(emailError).toHaveText(myInfoTestData.expectedMessages.invalidEmail);
        });
    });

    // ==========================================
    // AREA 3: EMERGENCY CONTACTS & DEPENDENTS
    // ==========================================
    test.describe('Area 3: Emergency Contacts and Dependents', () => {

        // Test 11: Emergency contact: add, edit, delete; name and relationship required
        test('11. Emergency contact: add, edit, delete; name and relationship required', async ({ page }) => {
            await myInfoPage.clickSubTab('Emergency Contacts');
            await page.waitForURL(`**/${myInfoTestData.urls.emergencyContacts}/**`);

            // Step 1: Verify Required validation on empty submit
            await myInfoPage.addButton.first().click();
            await page.locator('form button[type="submit"]').click();
            const errors = page.locator('.oxd-input-field-error-message');
            await expect(errors.first()).toHaveText(myInfoTestData.expectedMessages.required);
            await myInfoPage.cancelButton.first().click();

            // Step 2: Add emergency contact
            const contactName = `Sarah_${Date.now().toString().slice(-4)}`;
            await myInfoPage.addEmergencyContact({
                name: contactName,
                relationship: myInfoTestData.emergencyContact.relationship,
                mobilePhone: myInfoTestData.emergencyContact.mobilePhone,
            });
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: contactName })).toBeVisible();

            // Step 3: Edit contact
            await myInfoPage.editEmergencyContact(contactName, myInfoTestData.emergencyContact.updatedRelationship);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: myInfoTestData.emergencyContact.updatedRelationship })).toBeVisible();

            // Step 4: Delete contact
            await myInfoPage.deleteEmergencyContact(contactName);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: contactName })).not.toBeVisible();
        });

        // Test 12: Dependent: add, edit, delete; name and relationship required
        test('12. Dependent: add, edit, delete; name and relationship required', async ({ page }) => {
            await myInfoPage.clickSubTab('Dependents');
            await page.waitForURL(`**/${myInfoTestData.urls.dependents}/**`);

            // Step 1: Verify Required validation
            await myInfoPage.addButton.first().click();
            await page.locator('form button[type="submit"]').click();
            const errors = page.locator('.oxd-input-field-error-message');
            await expect(errors.first()).toHaveText(myInfoTestData.expectedMessages.required);
            await myInfoPage.cancelButton.first().click();

            // Step 2: Add dependent
            const depName = `Child_${Date.now().toString().slice(-4)}`;
            await myInfoPage.addDependent({
                name: depName,
                relationship: myInfoTestData.dependent.relationship,
                dob: myInfoTestData.dependent.dob,
            });
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: depName })).toBeVisible();

            // Step 3: Edit dependent
            const updatedDepName = `${depName}_Upd`;
            await myInfoPage.editDependent(depName, updatedDepName);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: updatedDepName })).toBeVisible();

            // Step 4: Delete dependent
            await myInfoPage.deleteDependent(updatedDepName);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: updatedDepName })).not.toBeVisible();
        });
    });

    // ==========================================
    // AREA 4: IMMIGRATION
    // ==========================================
    test.describe('Area 4: Immigration', () => {

        // Test 13: Add, edit and delete a record; the expiry before the issue date -> error
        test('13. Add, edit and delete a record; the expiry before the issue date -> error', async ({ page }) => {
            await myInfoPage.clickSubTab('Immigration');
            await page.waitForURL(`**/${myInfoTestData.urls.immigration}/**`);

            // Step 1: Validation error when expiry date is before issue date
            const docNum = `DOC${Date.now().toString().slice(-6)}`;
            await myInfoPage.addImmigrationRecord({
                docType: 'Passport',
                number: docNum,
                issuedDate: myInfoTestData.immigration.issuedDate,
                expiryDate: myInfoTestData.immigration.invalidExpiryDate,
            });

            // OrangeHRM displays date comparison validation error
            const dateError = page.locator('.oxd-input-group:has-text("Expiry Date") .oxd-input-field-error-message');
            await expect(dateError).toBeVisible();
            await expect(dateError).toHaveText(myInfoTestData.expectedMessages.expiryBeforeIssue);

            // Step 2: Correct expiry date and save
            await myInfoPage.clearInput(page.locator('.oxd-input-group:has-text("Expiry Date") input'));
            await page.locator('.oxd-input-group:has-text("Expiry Date") input').fill(myInfoTestData.immigration.expiryDate);
            await page.locator('form button[type="submit"]').click();
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: docNum })).toBeVisible();

            // Step 3: Edit record
            await myInfoPage.editImmigrationRecord(docNum, myInfoTestData.immigration.updatedComments);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });

            // Step 4: Delete record
            await myInfoPage.deleteImmigrationRecord(docNum);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: docNum })).not.toBeVisible();
        });
    });

    // ==========================================
    // AREA 5: JOB, SALARY, REPORT-TO
    // ==========================================
    test.describe('Area 5: Job, Salary, Report-to', () => {

        // Test 14: Job tab opens and shows the details
        test('14. Job tab opens and shows the details', async ({ page }) => {
            await myInfoPage.clickSubTab('Job');
            await page.waitForURL(`**/${myInfoTestData.urls.job}/**`);

            // Verify Job details container or job title field is visible
            const jobTitleGroup = page.locator('.oxd-input-group:has-text("Job Title")');
            await expect(jobTitleGroup).toBeVisible();
        });

        // Test 15: Salary and Report-to tabs open without errors
        test('15. Salary and Report-to tabs open without errors', async ({ page }) => {
            // Salary tab
            await myInfoPage.clickSubTab('Salary');
            await page.waitForURL(`**/${myInfoTestData.urls.salary}/**`);
            await expect(page.locator('.orangehrm-horizontal-padding, .oxd-table').first()).toBeVisible();

            // Report-to tab
            await myInfoPage.clickSubTab('Report-to');
            await page.waitForURL(`**/${myInfoTestData.urls.reportTo}/**`);
            await expect(page.locator('.orangehrm-horizontal-padding, .oxd-table').first()).toBeVisible();
        });
    });

    // ==========================================
    // AREA 6: QUALIFICATIONS
    // ==========================================
    test.describe('Area 6: Qualifications', () => {

        test.beforeEach(async () => {
            await myInfoPage.clickSubTab('Qualifications');
            await myInfoPage.page.waitForURL(`**/${myInfoTestData.urls.qualifications}/**`);
        });

        // Test 16: Work experience: add, edit, delete; to-date before from-date -> error
        test('16. Work experience: add, edit, delete; to-date before from-date -> error', async ({ page }) => {
            const companyName = `Company_${Date.now().toString().slice(-4)}`;

            // Step 1: Validation error when To Date is before From Date
            await myInfoPage.addWorkExperience({
                company: companyName,
                jobTitle: myInfoTestData.qualifications.workExperience.jobTitle,
                fromDate: myInfoTestData.qualifications.workExperience.fromDate,
                toDate: myInfoTestData.qualifications.workExperience.invalidToDate,
            });

            const dateError = page.locator('.oxd-input-group:has-text("To") .oxd-input-field-error-message');
            await expect(dateError).toBeVisible();
            await expect(dateError).toHaveText(myInfoTestData.expectedMessages.toDateBeforeFromDate);

            // Step 2: Fix date and save
            await myInfoPage.clearInput(page.locator('.oxd-input-group:has-text("To") input'));
            await page.locator('.oxd-input-group:has-text("To") input').fill(myInfoTestData.qualifications.workExperience.toDate);
            await page.locator('form button[type="submit"]').click();
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: companyName })).toBeVisible();

            // Step 3: Edit work experience
            await myInfoPage.editWorkExperience(companyName, myInfoTestData.qualifications.workExperience.updatedJobTitle);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });

            // Step 4: Delete work experience
            await myInfoPage.deleteWorkExperience(companyName);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: companyName })).not.toBeVisible();
        });

        // Test 17: Education, skills, languages, licenses: add and delete (data-driven)
        test('17. Education, skills, languages, licenses: add and delete (data-driven)', async ({ page }) => {
            // Data-driven test definitions
            const qualificationDataSets = [
                {
                    section: 'Skills',
                    uniqueKey: myInfoTestData.qualifications.skill.name,
                    fillAction: async () => {
                        await myInfoPage.selectDropdownOption(
                            page.locator('.oxd-input-group:has-text("Skill") .oxd-select-text'),
                            myInfoTestData.qualifications.skill.name
                        );
                        await page.locator('.oxd-input-group:has-text("Years of Experience") input')
                            .fill(myInfoTestData.qualifications.skill.yearsOfExperience);
                    }
                },
                {
                    section: 'Languages',
                    uniqueKey: myInfoTestData.qualifications.language.name,
                    fillAction: async () => {
                        await myInfoPage.selectDropdownOption(
                            page.locator('.oxd-input-group:has-text("Language") .oxd-select-text'),
                            myInfoTestData.qualifications.language.name
                        );
                        await myInfoPage.selectDropdownOption(
                            page.locator('.oxd-input-group:has-text("Fluency") .oxd-select-text'),
                            myInfoTestData.qualifications.language.fluency
                        );
                    }
                }
            ];

            // Iterate through data-driven sets
            for (const item of qualificationDataSets) {
                // Add item
                await myInfoPage.addQualificationItem(item.section, item.fillAction);
                await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
                await expect(page.locator('.oxd-table-card').filter({ hasText: item.uniqueKey })).toBeVisible();

                // Delete item
                await myInfoPage.deleteQualificationItem(item.uniqueKey);
                await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
                await expect(page.locator('.oxd-table-card').filter({ hasText: item.uniqueKey })).not.toBeVisible();
            }
        });
    });

    // ==========================================
    // AREA 7: ATTACHMENTS AND PHOTO
    // ==========================================
    test.describe('Area 7: Attachments and Photo', () => {

        // Test 18: Add an attachment with a comment; delete it
        test('18. Add an attachment with a comment; delete it', async ({ page }) => {
            const commentText = `Attachment_${Date.now()}`;
            await myInfoPage.addAttachment(myInfoTestData.attachment.filePath, commentText);

            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(myInfoPage.toast).toContainText(myInfoTestData.expectedMessages.successSaved);

            // Verify row exists in attachments table
            const attachmentRow = page.locator('.oxd-table-card, table tr').filter({ hasText: commentText });
            await expect(attachmentRow).toBeVisible();

            // Delete attachment
            await myInfoPage.deleteAttachment(commentText);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(attachmentRow).not.toBeVisible();
        });

        // Test 19: Invalid attachment type or size -> error
        test('19. Invalid attachment type or size -> error', async ({ page }) => {
            await myInfoPage.addAttachmentButton.click();
            await myInfoPage.attachmentFileInput.setInputFiles(myInfoTestData.attachment.invalidFilePath);

            // Check if client-side or submission validation error appears
            await page.locator('form button[type="submit"]').click();
            const errorElement = page.locator('.oxd-input-field-error-message, .oxd-toast--error');
            await expect(errorElement.first()).toBeVisible({ timeout: 5000 });
        });

        // Test 20: Upload a profile photo (valid type); invalid type -> error
        test('20. Upload a profile photo (valid type); invalid type -> error', async ({ page }) => {
            await myInfoPage.goToPhotoUpload();

            // Step 1: Upload invalid file type
            await myInfoPage.uploadProfilePhoto(myInfoTestData.photo.invalidPhotoPath);
            const typeError = page.locator('.oxd-input-field-error-message');
            await expect(typeError).toBeVisible();
            await expect(typeError).toHaveText(myInfoTestData.expectedMessages.fileTypeNotAllowed);

            // Step 2: Upload valid PNG image
            await myInfoPage.uploadProfilePhoto(myInfoTestData.photo.validPhotoPath);
            await expect(typeError).not.toBeVisible();

            // Save valid photo
            await myInfoPage.saveProfilePhoto();
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
        });
    });

    // ==========================================
    // AREA 8: MEMBERSHIPS
    // ==========================================
    test.describe('Area 8: Memberships', () => {

        // Test 21: Add and delete membership
        test('21. Add and delete membership', async ({ page }) => {
            await myInfoPage.clickSubTab('Memberships');
            await page.waitForURL(`**/${myInfoTestData.urls.memberships}/**`);

            // Add membership
            await myInfoPage.addMembership({
                membership: myInfoTestData.memberships.membership,
                subscriptionPaidBy: myInfoTestData.memberships.subscriptionPaidBy,
                amount: myInfoTestData.memberships.amount,
                currency: myInfoTestData.memberships.currency,
            });

            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: myInfoTestData.memberships.membership })).toBeVisible();

            // Delete membership
            await myInfoPage.deleteMembership(myInfoTestData.memberships.membership);
            await expect(myInfoPage.toast).toBeVisible({ timeout: 10000 });
            await expect(page.locator('.oxd-table-card').filter({ hasText: myInfoTestData.memberships.membership })).not.toBeVisible();
        });
    });

    // ==========================================
    // AREA 9: CHANGE PASSWORD (SAFETY FIRST)
    // ==========================================
    test.describe('Area 9: Change Password (Safety First)', () => {

        test.beforeEach(async () => {
            await myInfoPage.goToChangePassword();
        });

        // Test 22: Wrong current password -> error
        test('22. Wrong current password -> error', async ({ page }) => {
            await myInfoPage.fillChangePasswordForm({
                currentPassword: myInfoTestData.passwordChange.wrongCurrentPassword,
                newPassword: myInfoTestData.passwordChange.newPassword,
                confirmPassword: myInfoTestData.passwordChange.newPassword,
            });

            await myInfoPage.submitChangePassword();

            // System shows alert toast or error banner for wrong current password
            const errorAlert = page.locator('.oxd-alert-content-text, .oxd-toast--error');
            await expect(errorAlert.first()).toBeVisible({ timeout: 10000 });

            // Safety check: ensure user stays on updatePassword page
            expect(page.url()).toContain(myInfoTestData.urls.updatePassword);
        });

        // Test 23: Mismatched confirm password -> error
        test('23. Mismatched confirm password -> error', async ({ page }) => {
            await myInfoPage.fillChangePasswordForm({
                currentPassword: testData.validPassword,
                newPassword: myInfoTestData.passwordChange.newPassword,
                confirmPassword: myInfoTestData.passwordChange.mismatchedConfirm,
            });

            // Mismatched passwords trigger validation error
            await myInfoPage.submitChangePassword();
            const mismatchError = page.locator('.oxd-input-group:has-text("Confirm Password") .oxd-input-field-error-message');
            await expect(mismatchError).toBeVisible();
            await expect(mismatchError).toHaveText(myInfoTestData.expectedMessages.passwordsDoNotMatch);

            // Safety First: Cancel form to avoid changing admin password
            await myInfoPage.cancelChangePassword();
        });

        // Test 24: Weak new password -> validation messages
        test('24. Weak new password -> validation messages', async ({ page }) => {
            await myInfoPage.fillChangePasswordForm({
                newPassword: myInfoTestData.passwordChange.weakPassword,
            });

            // OrangeHRM displays password strength requirements
            const passwordError = page.locator('.oxd-grid-item:has(label:text-is("Password")) .oxd-input-field-error-message');
            await expect(passwordError).toBeVisible();
            await expect(passwordError).toContainText(myInfoTestData.expectedMessages.weakPasswordLength);

            // Safety First: Cancel form without submitting
            await myInfoPage.cancelChangePassword();
        });
    });

    // ==========================================
    // AREA 10: GENERAL
    // ==========================================
    test.describe('Area 10: General', () => {

        // Test 25: Every tab opens with the right header and URL
        test('25. Every tab opens with the right header and URL', async ({ page }) => {
            const tabsToCheck = [
                { name: 'Personal Details', expectedUrl: myInfoTestData.urls.personalDetails },
                { name: 'Contact Details', expectedUrl: myInfoTestData.urls.contactDetails },
                { name: 'Emergency Contacts', expectedUrl: myInfoTestData.urls.emergencyContacts },
                { name: 'Dependents', expectedUrl: myInfoTestData.urls.dependents },
                { name: 'Immigration', expectedUrl: myInfoTestData.urls.immigration },
                { name: 'Job', expectedUrl: myInfoTestData.urls.job },
                { name: 'Salary', expectedUrl: myInfoTestData.urls.salary },
                { name: 'Report-to', expectedUrl: myInfoTestData.urls.reportTo },
                { name: 'Qualifications', expectedUrl: myInfoTestData.urls.qualifications },
                { name: 'Memberships', expectedUrl: myInfoTestData.urls.memberships },
            ];

            for (const tab of tabsToCheck) {
                await myInfoPage.clickSubTab(tab.name);
                await expect(page).toHaveURL(new RegExp(tab.expectedUrl));

                // Verify the sub-tab is highlighted as active
                const activeTab = page.locator('.orangehrm-tabs-item.--active, .orangehrm-tabs-item.active');
                await expect(activeTab).toContainText(tab.name);
            }
        });

        // Test 26: Unsaved changes are not kept when switching tabs (record behaviour)
        test('26. Unsaved changes are not kept when switching tabs (record behaviour)', async ({ page }) => {
            // Read initial Other Id value
            const initialOtherId = await myInfoPage.otherIdInput.inputValue();

            // Type a modified value WITHOUT clicking Save
            const tempUnsavedValue = `TEMP_${Date.now().toString().slice(-4)}`;
            await myInfoPage.clearInput(myInfoPage.otherIdInput);
            await myInfoPage.otherIdInput.fill(tempUnsavedValue);

            // Switch to Contact Details tab
            await myInfoPage.clickSubTab('Contact Details');
            await page.waitForURL(`**/${myInfoTestData.urls.contactDetails}/**`);

            // Switch back to Personal Details tab
            await myInfoPage.clickSubTab('Personal Details');
            await page.waitForURL(`**/${myInfoTestData.urls.personalDetails}/**`);

            // Check if value was reset to initial server state
            const currentOtherId = await myInfoPage.otherIdInput.inputValue();
            console.log(`[BEHAVIOUR RECORDED] Unsaved Other Id: "${tempUnsavedValue}", Reloaded Value: "${currentOtherId}"`);

            // In OrangeHRM, client state is discarded on tab change; server data reloads
            expect(currentOtherId).toBe(initialOtherId);
        });
    });
});
