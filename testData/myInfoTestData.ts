/**
 * Test Data for OrangeHRM "My Info" Module
 * Beginner-friendly and well documented test constants.
 */

export const myInfoTestData = {
    // Expected Page URLs and Header Titles
    urls: {
        personalDetails: 'pim/viewPersonalDetails',
        contactDetails: 'pim/contactDetails',
        emergencyContacts: 'pim/viewEmergencyContacts',
        dependents: 'pim/viewDependents',
        immigration: 'pim/viewImmigration',
        job: 'pim/viewJobDetails',
        salary: 'pim/viewSalaryList',
        reportTo: 'pim/viewReportToDetails',
        qualifications: 'pim/viewQualifications',
        memberships: 'pim/viewMemberships',
        updatePassword: 'pim/updatePassword',
        photograph: 'pim/viewPhotograph',
    },

    // 1. Personal Details Test Data
    personalDetails: {
        nickname: 'AlexDev',
        gender: 'Male' as const,
        nationality: 'American',
        maritalStatus: 'Single',
        dob: '1995-05-15',
        futureDob: '2099-01-01',
        driverLicense: 'DL-987654321',
        licenseExpiryDate: '2032-12-31',
        bloodType: 'O+',
        maxName30: 'A'.repeat(30),
        maxName31: 'A'.repeat(31),
    },

    // 2. Contact Details Test Data
    contactDetails: {
        street1: '123 Market Street',
        street2: 'Suite 400',
        city: 'San Francisco',
        state: 'California',
        zip: '94105',
        country: 'United States',
        homePhone: '1234567890',
        mobilePhone: '9876543210',
        workPhone: '5551234567',
        invalidPhone: 'invalid-phone-xyz',
        workEmail: 'admin.work@orangehrm.com',
        otherEmail: 'admin.other@orangehrm.com',
        invalidEmail: 'invalid-email-format',
    },

    // 3. Emergency Contacts Test Data
    emergencyContact: {
        name: 'Sarah Connor',
        relationship: 'Sister',
        homePhone: '1234567890',
        mobilePhone: '9876543210',
        workPhone: '5551234567',
        updatedRelationship: 'Spouse',
    },

    // 4. Dependents Test Data
    dependent: {
        name: 'Tommy Connor',
        relationship: 'Child',
        dob: '2015-06-12',
        updatedName: 'Thomas Connor',
    },

    // 5. Immigration Test Data
    immigration: {
        docType: 'Passport',
        number: 'PASS98765432',
        issuedDate: '2020-01-01',
        expiryDate: '2030-01-01',
        invalidExpiryDate: '2019-01-01', // Before issue date
        eligibleStatus: 'Active',
        issuedBy: 'US State Department',
        comments: 'Primary passport for official business travel.',
        updatedComments: 'Renewed passport record.',
    },

    // 6. Qualifications Test Data
    qualifications: {
        workExperience: {
            company: 'Apex QA Tech Labs',
            jobTitle: 'QA Automation Engineer',
            fromDate: '2021-01-01',
            toDate: '2023-12-31',
            invalidToDate: '2020-01-01', // Before from date
            comment: 'Built automated end-to-end tests using Playwright & TypeScript.',
            updatedJobTitle: 'Lead QA Engineer',
        },
        education: {
            level: "Bachelor's Degree",
            institute: 'MIT University',
            major: 'Computer Science',
            year: '2020',
            gpa: '3.9',
        },
        skill: {
            name: 'Playwright',
            yearsOfExperience: '3',
            comments: 'Expert in Playwright, TypeScript, and POM architecture.',
        },
        language: {
            name: 'Spanish',
            fluency: 'Writing',
            competency: 'Good',
            comments: 'Professional working proficiency.',
        },
        license: {
            type: 'Certified Tester Foundation Level (CTFL)',
            number: 'ISTQB-998877',
            issuedDate: '2021-05-10',
            expiryDate: '2031-05-10',
        },
    },

    // 7. Attachments Test Data
    attachment: {
        filePath: 'testData/sample-doc.txt',
        comment: 'Automated test attachment comment for verification.',
        invalidFilePath: 'testData/invalid-file.xyz',
    },

    // 8. Photo Upload Test Data
    photo: {
        validPhotoPath: 'testData/sample-avatar.png',
        invalidPhotoPath: 'testData/invalid-file.xyz',
    },

    // 9. Memberships Test Data
    memberships: {
        membership: 'British Computer Society (BCS)',
        subscriptionPaidBy: 'Company',
        amount: '250',
        currency: 'United States Dollar',
    },

    // 10. Change Password Test Data (Safety First!)
    passwordChange: {
        wrongCurrentPassword: 'WrongCurrentPass999!',
        newPassword: 'NewSecurePass123!',
        mismatchedConfirm: 'DifferentPass456!',
        weakPassword: '123',
    },

    // 11. Expected Validation & Toast Messages
    expectedMessages: {
        required: 'Required',
        invalidPhone: 'Allows numbers and only + - / ( )',
        invalidEmail: 'Expected format: admin@example.com',
        toDateBeforeFromDate: 'To date should be after from date',
        expiryBeforeIssue: 'Expiry date should be after issued date',
        passwordsDoNotMatch: 'Passwords do not match',
        weakPasswordLength: 'Should have at least 7 characters',
        fileTypeNotAllowed: 'File type not allowed',
        successSaved: 'Successfully Saved',
        successUpdated: 'Successfully Updated',
        successDeleted: 'Successfully Deleted',
    },
};

export const locMyInfoData = {
    // Navigation & Tabs
    myInfoMenuLink: 'a[href*="viewMyDetails"]',
    employeeHeaderImage: '.orangehrm-edit-employee-image, img.employee-image',
    tabItems: '.orangehrm-tabs-item',

    // Personal Details Selectors
    firstNameInput: 'input[name="firstName"]',
    middleNameInput: 'input[name="middleName"]',
    lastNameInput: 'input[name="lastName"]',
    nicknameInput: '.oxd-input-group:has-text("Nickname") input',
    employeeIdInput: '.oxd-input-group:has-text("Employee Id") input',
    otherIdInput: '.oxd-input-group:has-text("Other Id") input',
    driverLicenseInput: '.oxd-input-group:has-text("Driver\'s License Number") input',
    licenseExpiryInput: '.oxd-input-group:has-text("License Expiry Date") input',
    nationalitySelect: '.oxd-input-group:has-text("Nationality") .oxd-select-text',
    maritalStatusSelect: '.oxd-input-group:has-text("Marital Status") .oxd-select-text',
    dobInput: '.oxd-input-group:has-text("Date of Birth") input',
    genderMaleRadio: '.oxd-input-group:has-text("Gender") label:has-text("Male")',
    genderFemaleRadio: '.oxd-input-group:has-text("Gender") label:has-text("Female")',
    personalDetailsSaveBtn: '.orangehrm-edit-employee-content form button[type="submit"]',

    // Custom Fields (Blood Type)
    bloodTypeSelect: '.oxd-input-group:has-text("Blood Type") .oxd-select-text',
    customFieldsSaveBtn: '.orangehrm-custom-fields button[type="submit"]',

    // Contact Details Selectors
    street1Input: '.oxd-input-group:has-text("Street 1") input',
    street2Input: '.oxd-input-group:has-text("Street 2") input',
    cityInput: '.oxd-input-group:has-text("City") input',
    stateInput: '.oxd-input-group:has-text("State/Province") input',
    zipInput: '.oxd-input-group:has-text("Zip/Postal Code") input',
    countrySelect: '.oxd-input-group:has-text("Country") .oxd-select-text',
    homePhoneInput: '.oxd-input-group:has-text("Home") input',
    mobilePhoneInput: '.oxd-input-group:has-text("Mobile") input',
    workPhoneInput: '.oxd-input-group:has-text("Work"):not(:has-text("Email")) input',
    workEmailInput: '.oxd-input-group:has-text("Work Email") input',
    otherEmailInput: '.oxd-input-group:has-text("Other Email") input',
    contactDetailsSaveBtn: 'button[type="submit"]',

    // Common CRUD Buttons & Modals
    addButton: 'button:has-text("Add")',
    saveButton: 'button[type="submit"]',
    cancelButton: 'button:has-text("Cancel")',
    deleteButton: 'button:has-text("Delete")',
    tableRows: '.oxd-table-card',
    editRowIcon: 'button i.bi-pencil-fill, button:has(.bi-pencil-fill)',
    deleteRowIcon: 'button i.bi-trash, button:has(.bi-trash)',
    dialogConfirmDeleteBtn: '.orangehrm-dialog-popup button:has-text("Yes, Delete")',
    dialogCancelDeleteBtn: '.orangehrm-dialog-popup button:has-text("No, Cancel")',

    // Attachments Selectors
    attachmentsHeader: 'h6:has-text("Attachments")',
    addAttachmentButton: '.orangehrm-attachment-header button:has-text("Add"), div:has(h6:has-text("Attachments")) button:has-text("Add")',
    attachmentFileInput: 'input[type="file"]',
    attachmentCommentTextarea: 'textarea[placeholder="Type comment here"], textarea',

    // Photograph Selectors
    photoFileInput: 'input[type="file"]',
    photoSaveButton: 'button[type="submit"]',

    // Change Password Selectors
    userDropdown: '.oxd-userdropdown-tab',
    changePasswordLink: '.oxd-userdropdown-link:has-text("Change Password")',
    currentPasswordInput: '.oxd-input-group:has-text("Current Password") input',
    newPasswordInput: '.oxd-grid-item:has(label:text-is("Password")) input',
    confirmPasswordInput: '.oxd-input-group:has-text("Confirm Password") input',
    passwordSaveButton: 'button[type="submit"]',
    passwordCancelButton: 'button:has-text("Cancel")',

    // Messages & Alerts
    fieldErrorMessage: '.oxd-input-field-error-message',
    toast: '.oxd-toast',
    successToast: '.oxd-toast--success',
    errorToast: '.oxd-toast--error, .oxd-toast--danger',
    alertContentText: '.oxd-alert-content-text',
    dropdownOption: '.oxd-select-dropdown [role="option"], .oxd-select-dropdown div',
    loadingSpinner: '.oxd-loading-spinner',
};
