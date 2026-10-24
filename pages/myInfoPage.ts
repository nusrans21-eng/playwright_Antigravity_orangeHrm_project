import { Page, Locator, expect } from '@playwright/test';
import { locMyInfoData, myInfoTestData } from '../testData/myInfoTestData';

/**
 * Page Object Model for the OrangeHRM "My Info" Module.
 * Designed to be clean, modular, and beginner-friendly.
 */
export class MyInfoPage {
    readonly page: Page;

    // Navigation and Main Elements
    readonly myInfoMenuLink: Locator;
    readonly employeeHeaderImage: Locator;
    readonly tabItems: Locator;

    // Personal Details Inputs
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly nicknameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly otherIdInput: Locator;
    readonly driverLicenseInput: Locator;
    readonly licenseExpiryInput: Locator;
    readonly nationalitySelect: Locator;
    readonly maritalStatusSelect: Locator;
    readonly dobInput: Locator;
    readonly genderMaleRadio: Locator;
    readonly genderFemaleRadio: Locator;
    readonly personalDetailsSaveBtn: Locator;

    // Custom Fields (Blood Type)
    readonly bloodTypeSelect: Locator;
    readonly customFieldsSaveBtn: Locator;

    // Contact Details Inputs
    readonly street1Input: Locator;
    readonly street2Input: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipInput: Locator;
    readonly countrySelect: Locator;
    readonly homePhoneInput: Locator;
    readonly mobilePhoneInput: Locator;
    readonly workPhoneInput: Locator;
    readonly workEmailInput: Locator;
    readonly otherEmailInput: Locator;
    readonly contactDetailsSaveBtn: Locator;

    // Common Action Buttons & Tables
    readonly addButton: Locator;
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly tableRows: Locator;
    readonly dialogConfirmDeleteBtn: Locator;
    readonly dialogCancelDeleteBtn: Locator;

    // Attachments
    readonly addAttachmentButton: Locator;
    readonly attachmentFileInput: Locator;
    readonly attachmentCommentTextarea: Locator;

    // Photo Upload
    readonly photoFileInput: Locator;
    readonly photoSaveButton: Locator;

    // Change Password
    readonly userDropdown: Locator;
    readonly changePasswordLink: Locator;
    readonly currentPasswordInput: Locator;
    readonly newPasswordInput: Locator;
    readonly confirmPasswordInput: Locator;

    // Feedback & Validation Elements
    readonly fieldErrorMessage: Locator;
    readonly toast: Locator;
    readonly successToast: Locator;
    readonly errorToast: Locator;
    readonly alertContentText: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.myInfoMenuLink = this.page.locator(locMyInfoData.myInfoMenuLink);
        this.employeeHeaderImage = this.page.locator(locMyInfoData.employeeHeaderImage).first();
        this.tabItems = this.page.locator(locMyInfoData.tabItems);

        // Personal Details
        this.firstNameInput = this.page.locator(locMyInfoData.firstNameInput);
        this.middleNameInput = this.page.locator(locMyInfoData.middleNameInput);
        this.lastNameInput = this.page.locator(locMyInfoData.lastNameInput);
        this.nicknameInput = this.page.locator(locMyInfoData.nicknameInput);
        this.employeeIdInput = this.page.locator(locMyInfoData.employeeIdInput);
        this.otherIdInput = this.page.locator(locMyInfoData.otherIdInput);
        this.driverLicenseInput = this.page.locator(locMyInfoData.driverLicenseInput);
        this.licenseExpiryInput = this.page.locator(locMyInfoData.licenseExpiryInput);
        this.nationalitySelect = this.page.locator(locMyInfoData.nationalitySelect);
        this.maritalStatusSelect = this.page.locator(locMyInfoData.maritalStatusSelect);
        this.dobInput = this.page.locator(locMyInfoData.dobInput);
        this.genderMaleRadio = this.page.locator(locMyInfoData.genderMaleRadio);
        this.genderFemaleRadio = this.page.locator(locMyInfoData.genderFemaleRadio);
        this.personalDetailsSaveBtn = this.page.locator(locMyInfoData.personalDetailsSaveBtn).first();

        // Custom Fields
        this.bloodTypeSelect = this.page.locator(locMyInfoData.bloodTypeSelect);
        this.customFieldsSaveBtn = this.page.locator(locMyInfoData.customFieldsSaveBtn).first();

        // Contact Details
        this.street1Input = this.page.locator(locMyInfoData.street1Input);
        this.street2Input = this.page.locator(locMyInfoData.street2Input);
        this.cityInput = this.page.locator(locMyInfoData.cityInput);
        this.stateInput = this.page.locator(locMyInfoData.stateInput);
        this.zipInput = this.page.locator(locMyInfoData.zipInput);
        this.countrySelect = this.page.locator(locMyInfoData.countrySelect);
        this.homePhoneInput = this.page.locator(locMyInfoData.homePhoneInput);
        this.mobilePhoneInput = this.page.locator(locMyInfoData.mobilePhoneInput);
        this.workPhoneInput = this.page.locator(locMyInfoData.workPhoneInput);
        this.workEmailInput = this.page.locator(locMyInfoData.workEmailInput);
        this.otherEmailInput = this.page.locator(locMyInfoData.otherEmailInput);
        this.contactDetailsSaveBtn = this.page.locator(locMyInfoData.contactDetailsSaveBtn).first();

        // Action Buttons & Table
        this.addButton = this.page.locator(locMyInfoData.addButton);
        this.saveButton = this.page.locator(locMyInfoData.saveButton);
        this.cancelButton = this.page.locator(locMyInfoData.cancelButton);
        this.tableRows = this.page.locator(locMyInfoData.tableRows);
        this.dialogConfirmDeleteBtn = this.page.locator(locMyInfoData.dialogConfirmDeleteBtn);
        this.dialogCancelDeleteBtn = this.page.locator(locMyInfoData.dialogCancelDeleteBtn);

        // Attachments
        this.addAttachmentButton = this.page.locator(locMyInfoData.addAttachmentButton).first();
        this.attachmentFileInput = this.page.locator(locMyInfoData.attachmentFileInput);
        this.attachmentCommentTextarea = this.page.locator(locMyInfoData.attachmentCommentTextarea);

        // Photograph
        this.photoFileInput = this.page.locator(locMyInfoData.photoFileInput);
        this.photoSaveButton = this.page.locator(locMyInfoData.photoSaveButton).first();

        // Change Password
        this.userDropdown = this.page.locator(locMyInfoData.userDropdown);
        this.changePasswordLink = this.page.locator(locMyInfoData.changePasswordLink);
        this.currentPasswordInput = this.page.locator(locMyInfoData.currentPasswordInput);
        this.newPasswordInput = this.page.locator(locMyInfoData.newPasswordInput);
        this.confirmPasswordInput = this.page.locator(locMyInfoData.confirmPasswordInput);

        // Messages
        this.fieldErrorMessage = this.page.locator(locMyInfoData.fieldErrorMessage);
        this.toast = this.page.locator(locMyInfoData.toast);
        this.successToast = this.page.locator(locMyInfoData.successToast);
        this.errorToast = this.page.locator(locMyInfoData.errorToast);
        this.alertContentText = this.page.locator(locMyInfoData.alertContentText);
    }

    // ==========================================
    // 1. NAVIGATION & HELPER METHODS
    // ==========================================

    /**
     * Navigate to "My Info" page via left sidebar menu
     */
    async navigateToMyInfo() {
        await this.myInfoMenuLink.first().click();
        await this.page.waitForURL(`**/${myInfoTestData.urls.personalDetails}/**`);
        await this.waitForSpinner();
    }

    /**
     * Click a specific sub-tab by its visible title (e.g. "Contact Details")
     */
    async clickSubTab(tabName: string) {
        const tab = this.page.locator(locMyInfoData.tabItems).filter({ hasText: tabName }).first();
        await tab.click();
        await this.waitForSpinner();
    }

    /**
     * Wait for OrangeHRM loading spinner to disappear
     */
    async waitForSpinner() {
        await this.page.locator(locMyInfoData.loadingSpinner).waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    }

    /**
     * Select an option from an OrangeHRM custom dropdown (.oxd-select-text)
     */
    async selectDropdownOption(dropdownLocator: Locator, optionText: string) {
        await dropdownLocator.click();
        const option = this.page.locator('.oxd-select-dropdown [role="option"], .oxd-select-dropdown div')
            .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
            .first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    /**
     * Clear an input safely using Backspace / Select All (OrangeHRM inputs are reactive)
     */
    async clearInput(inputLocator: Locator) {
        await inputLocator.click();
        await this.page.keyboard.press('ControlOrMeta+A');
        await this.page.keyboard.press('Backspace');
    }

    // ==========================================
    // 2. PERSONAL DETAILS METHODS
    // ==========================================

    /**
     * Update Personal Details form fields
     */
    async fillPersonalDetails(data: {
        nickname?: string;
        gender?: 'Male' | 'Female';
        nationality?: string;
        maritalStatus?: string;
        dob?: string;
        driverLicense?: string;
        expiryDate?: string;
    }) {
        if (data.nickname !== undefined && await this.nicknameInput.isVisible().catch(() => false)) {
            await this.clearInput(this.nicknameInput);
            await this.nicknameInput.fill(data.nickname);
        }

        if (data.gender) {
            if (data.gender === 'Male') {
                await this.genderMaleRadio.click();
            } else {
                await this.genderFemaleRadio.click();
            }
        }

        if (data.nationality) {
            await this.selectDropdownOption(this.nationalitySelect, data.nationality);
        }

        if (data.maritalStatus) {
            await this.selectDropdownOption(this.maritalStatusSelect, data.maritalStatus);
        }

        if (data.dob) {
            await this.clearInput(this.dobInput);
            await this.dobInput.fill(data.dob);
        }

        if (data.driverLicense) {
            await this.clearInput(this.driverLicenseInput);
            await this.driverLicenseInput.fill(data.driverLicense);
        }

        if (data.expiryDate) {
            await this.clearInput(this.licenseExpiryInput);
            await this.licenseExpiryInput.fill(data.expiryDate);
        }
    }

    /**
     * Click Save on Personal Details form (first form)
     */
    async savePersonalDetails() {
        await this.personalDetailsSaveBtn.click();
    }

    /**
     * Update Blood Type in the Custom Fields form
     */
    async updateBloodType(bloodType: string) {
        await this.selectDropdownOption(this.bloodTypeSelect, bloodType);
        await this.customFieldsSaveBtn.click();
    }

    // ==========================================
    // 3. CONTACT DETAILS METHODS
    // ==========================================

    /**
     * Update Contact Details form fields
     */
    async fillContactDetails(data: {
        street1?: string;
        street2?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
        homePhone?: string;
        mobilePhone?: string;
        workPhone?: string;
        workEmail?: string;
        otherEmail?: string;
    }) {
        if (data.street1 !== undefined) {
            await this.clearInput(this.street1Input);
            await this.street1Input.fill(data.street1);
        }
        if (data.street2 !== undefined) {
            await this.clearInput(this.street2Input);
            await this.street2Input.fill(data.street2);
        }
        if (data.city !== undefined) {
            await this.clearInput(this.cityInput);
            await this.cityInput.fill(data.city);
        }
        if (data.state !== undefined) {
            await this.clearInput(this.stateInput);
            await this.stateInput.fill(data.state);
        }
        if (data.zip !== undefined) {
            await this.clearInput(this.zipInput);
            await this.zipInput.fill(data.zip);
        }
        if (data.country !== undefined) {
            await this.selectDropdownOption(this.countrySelect, data.country);
        }
        if (data.homePhone !== undefined) {
            await this.clearInput(this.homePhoneInput);
            await this.homePhoneInput.fill(data.homePhone);
        }
        if (data.mobilePhone !== undefined) {
            await this.clearInput(this.mobilePhoneInput);
            await this.mobilePhoneInput.fill(data.mobilePhone);
        }
        if (data.workPhone !== undefined) {
            await this.clearInput(this.workPhoneInput);
            await this.workPhoneInput.fill(data.workPhone);
        }
        if (data.workEmail !== undefined) {
            await this.clearInput(this.workEmailInput);
            await this.workEmailInput.fill(data.workEmail);
        }
        if (data.otherEmail !== undefined) {
            await this.clearInput(this.otherEmailInput);
            await this.otherEmailInput.fill(data.otherEmail);
        }
    }

    async saveContactDetails() {
        await this.contactDetailsSaveBtn.click();
    }

    // ==========================================
    // 4. EMERGENCY CONTACTS METHODS
    // ==========================================

    async addEmergencyContact(data: {
        name: string;
        relationship: string;
        homePhone?: string;
        mobilePhone?: string;
        workPhone?: string;
    }) {
        await this.addButton.first().click();
        await this.page.locator('.oxd-input-group:has-text("Name") input').fill(data.name);
        await this.page.locator('.oxd-input-group:has-text("Relationship") input').fill(data.relationship);

        if (data.homePhone) {
            await this.page.locator('.oxd-input-group:has-text("Home Telephone") input').fill(data.homePhone);
        }
        if (data.mobilePhone) {
            await this.page.locator('.oxd-input-group:has-text("Mobile") input').fill(data.mobilePhone);
        }
        if (data.workPhone) {
            await this.page.locator('.oxd-input-group:has-text("Work Telephone") input').fill(data.workPhone);
        }

        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async editEmergencyContact(currentName: string, updatedRelationship: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: currentName }).first();
        await row.locator('button:has(.bi-pencil-fill), button i.bi-pencil-fill').click();
        const relationshipInput = this.page.locator('.oxd-input-group:has-text("Relationship") input');
        await this.clearInput(relationshipInput);
        await relationshipInput.fill(updatedRelationship);
        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async deleteEmergencyContact(name: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: name }).first();
        await row.locator('button:has(.bi-trash), button i.bi-trash').click();
        await this.dialogConfirmDeleteBtn.click();
        await this.waitForSpinner();
    }

    // ==========================================
    // 5. DEPENDENTS METHODS
    // ==========================================

    async addDependent(data: { name: string; relationship: string; dob?: string }) {
        await this.addButton.first().click();
        await this.page.locator('.oxd-input-group:has-text("Name") input').fill(data.name);

        // Relationship dropdown or input
        const relGroup = this.page.locator('.oxd-input-group:has-text("Relationship")');
        if (await relGroup.locator('.oxd-select-text').isVisible().catch(() => false)) {
            await this.selectDropdownOption(relGroup.locator('.oxd-select-text'), data.relationship);
        } else {
            await relGroup.locator('input').fill(data.relationship);
        }

        if (data.dob) {
            await this.page.locator('.oxd-input-group:has-text("Date of Birth") input').fill(data.dob);
        }

        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async editDependent(currentName: string, updatedName: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: currentName }).first();
        await row.locator('button:has(.bi-pencil-fill), button i.bi-pencil-fill').click();
        const nameInput = this.page.locator('.oxd-input-group:has-text("Name") input');
        await this.clearInput(nameInput);
        await nameInput.fill(updatedName);
        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async deleteDependent(name: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: name }).first();
        await row.locator('button:has(.bi-trash), button i.bi-trash').click();
        await this.dialogConfirmDeleteBtn.click();
        await this.waitForSpinner();
    }

    // ==========================================
    // 6. IMMIGRATION METHODS
    // ==========================================

    async addImmigrationRecord(data: {
        docType?: 'Passport' | 'Visa';
        number: string;
        issuedDate?: string;
        expiryDate?: string;
        eligibleStatus?: string;
        issuedBy?: string;
        comments?: string;
    }) {
        await this.addButton.first().click();

        if (data.docType) {
            await this.page.locator(`.oxd-input-group:has-text("Document") label:has-text("${data.docType}")`).click();
        }

        await this.page.locator('.oxd-input-group:has-text("Number") input').fill(data.number);

        if (data.issuedDate) {
            await this.page.locator('.oxd-input-group:has-text("Issued Date") input').fill(data.issuedDate);
        }

        if (data.expiryDate) {
            await this.page.locator('.oxd-input-group:has-text("Expiry Date") input').fill(data.expiryDate);
        }

        if (data.eligibleStatus) {
            await this.page.locator('.oxd-input-group:has-text("Eligible Status") input').fill(data.eligibleStatus);
        }

        if (data.issuedBy) {
            await this.page.locator('.oxd-input-group:has-text("Issued By") input').fill(data.issuedBy);
        }

        if (data.comments) {
            await this.page.locator('.oxd-input-group:has-text("Comments") textarea').fill(data.comments);
        }

        await this.page.locator('form button[type="submit"]').click();
    }

    async editImmigrationRecord(recordNumber: string, updatedComments: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: recordNumber }).first();
        await row.locator('button:has(.bi-pencil-fill), button i.bi-pencil-fill').click();
        const commentsArea = this.page.locator('.oxd-input-group:has-text("Comments") textarea');
        await this.clearInput(commentsArea);
        await commentsArea.fill(updatedComments);
        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async deleteImmigrationRecord(recordNumber: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: recordNumber }).first();
        await row.locator('button:has(.bi-trash), button i.bi-trash').click();
        await this.dialogConfirmDeleteBtn.click();
        await this.waitForSpinner();
    }

    // ==========================================
    // 7. QUALIFICATIONS METHODS
    // ==========================================

    async addWorkExperience(data: {
        company: string;
        jobTitle: string;
        fromDate?: string;
        toDate?: string;
        comment?: string;
    }) {
        const workSection = this.page.locator('div.orangehrm-horizontal-padding').filter({ hasText: 'Work Experience' }).first();
        await workSection.locator('button:has-text("Add")').click();

        await this.page.locator('.oxd-input-group:has-text("Company") input').fill(data.company);
        await this.page.locator('.oxd-input-group:has-text("Job Title") input').fill(data.jobTitle);

        if (data.fromDate) {
            await this.page.locator('.oxd-input-group:has-text("From") input').fill(data.fromDate);
        }

        if (data.toDate) {
            await this.page.locator('.oxd-input-group:has-text("To") input').fill(data.toDate);
        }

        if (data.comment) {
            await this.page.locator('.oxd-input-group:has-text("Comment") textarea').fill(data.comment);
        }

        await this.page.locator('form button[type="submit"]').click();
    }

    async editWorkExperience(company: string, updatedJobTitle: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: company }).first();
        await row.locator('button:has(.bi-pencil-fill), button i.bi-pencil-fill').click();
        const jobTitleInput = this.page.locator('.oxd-input-group:has-text("Job Title") input');
        await this.clearInput(jobTitleInput);
        await jobTitleInput.fill(updatedJobTitle);
        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async deleteWorkExperience(company: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: company }).first();
        await row.locator('button:has(.bi-trash), button i.bi-trash').click();
        await this.dialogConfirmDeleteBtn.click();
        await this.waitForSpinner();
    }

    // Data-driven helper for Education, Skills, Languages, Licenses
    async addQualificationItem(sectionTitle: string, fillAction: () => Promise<void>) {
        const section = this.page.locator('div.orangehrm-horizontal-padding').filter({ hasText: sectionTitle }).first();
        await section.locator('button:has-text("Add")').click();
        await fillAction();
        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async deleteQualificationItem(recordText: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: recordText }).first();
        await row.locator('button:has(.bi-trash), button i.bi-trash').click();
        await this.dialogConfirmDeleteBtn.click();
        await this.waitForSpinner();
    }

    // ==========================================
    // 8. ATTACHMENTS & PROFILE PHOTO METHODS
    // ==========================================

    async addAttachment(filePath: string, comment?: string) {
        await this.addAttachmentButton.click();
        await this.attachmentFileInput.setInputFiles(filePath);
        if (comment) {
            await this.attachmentCommentTextarea.fill(comment);
        }
        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async deleteAttachment(identifier: string) {
        const row = this.page.locator('.oxd-table-card, table tr').filter({ hasText: identifier }).first();
        await row.locator('button:has(.bi-trash), button i.bi-trash').click();
        await this.dialogConfirmDeleteBtn.click();
        await this.waitForSpinner();
    }

    async goToPhotoUpload() {
        await this.employeeHeaderImage.click();
        await this.page.waitForURL(`**/${myInfoTestData.urls.photograph}/**`);
        await this.waitForSpinner();
    }

    async uploadProfilePhoto(filePath: string) {
        await this.photoFileInput.setInputFiles(filePath);
    }

    async saveProfilePhoto() {
        await this.photoSaveButton.click();
        await this.waitForSpinner();
    }

    // ==========================================
    // 9. MEMBERSHIPS METHODS
    // ==========================================

    async addMembership(data: {
        membership: string;
        subscriptionPaidBy?: string;
        amount?: string;
        currency?: string;
    }) {
        await this.addButton.first().click();
        await this.selectDropdownOption(this.page.locator('.oxd-input-group:has-text("Membership") .oxd-select-text'), data.membership);

        if (data.subscriptionPaidBy) {
            await this.selectDropdownOption(this.page.locator('.oxd-input-group:has-text("Subscription Paid By") .oxd-select-text'), data.subscriptionPaidBy);
        }

        if (data.amount) {
            await this.page.locator('.oxd-input-group:has-text("Subscription Amount") input').fill(data.amount);
        }

        if (data.currency) {
            await this.selectDropdownOption(this.page.locator('.oxd-input-group:has-text("Currency") .oxd-select-text'), data.currency);
        }

        await this.page.locator('form button[type="submit"]').click();
        await this.waitForSpinner();
    }

    async deleteMembership(membershipName: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: membershipName }).first();
        await row.locator('button:has(.bi-trash), button i.bi-trash').click();
        await this.dialogConfirmDeleteBtn.click();
        await this.waitForSpinner();
    }

    // ==========================================
    // 10. CHANGE PASSWORD METHODS (SAFETY FIRST)
    // ==========================================

    async goToChangePassword() {
        await this.userDropdown.click();
        await this.changePasswordLink.click();
        await this.page.waitForURL(`**/${myInfoTestData.urls.updatePassword}`);
        await this.waitForSpinner();
    }

    async fillChangePasswordForm(data: {
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }) {
        if (data.currentPassword !== undefined) {
            await this.currentPasswordInput.fill(data.currentPassword);
        }
        if (data.newPassword !== undefined) {
            await this.newPasswordInput.fill(data.newPassword);
        }
        if (data.confirmPassword !== undefined) {
            await this.confirmPasswordInput.fill(data.confirmPassword);
        }
    }

    async submitChangePassword() {
        await this.page.locator('button[type="submit"]').click();
    }

    async cancelChangePassword() {
        const cancelBtn = this.page.locator('button:has-text("Cancel")');
        if (await cancelBtn.isVisible().catch(() => false)) {
            await cancelBtn.click();
        }
        await this.waitForSpinner();
    }
}
