import { Page } from "@playwright/test";
import { testData } from "../testData/testData";
import { loctestData } from "../testData/testData";

export class LoginPage {
    constructor(private page: Page) {}

    //Locators
    usernameInputField = loctestData.usernameInputField;
    passwordInputField = loctestData.passwordInputField;
    loginButton = loctestData.loginButton;
    alertContentText = loctestData.alertContentText;
    fieldErrorMessage = loctestData.fieldErrorMessage;
    dashboardHeader = loctestData.dashboardHeader;

    async ValidLoginAction() {
        await this.page.locator(this.usernameInputField).fill(testData.validUsername);
        await this.page.locator(this.passwordInputField).fill(testData.validPassword);
        await this.page.locator(this.loginButton).click();
    }

    async InvalidLoginAction() {
        await this.page.locator(this.usernameInputField).fill(testData.invalidUsername);
        await this.page.locator(this.passwordInputField).fill(testData.invalidPassword);
        await this.page.locator(this.loginButton).click();
    }

    async EmptyLoginAction() {
        await this.page.locator(this.loginButton).click();
    }
}
