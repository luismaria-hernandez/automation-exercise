import {Page, Locator} from "@playwright/test";

export class AccountInformation {
    readonly page: Page;
    readonly radioButtonGender1: Locator;
    readonly radioButtonGneder2: Locator;
    readonly txtPassword: Locator;
    readonly dropDay: Locator;
    readonly dropMonth: Locator;
    readonly dropYear: Locator;
    readonly checkNewsletter: Locator;
    readonly checkOffers: Locator;
    readonly txtFirstName: Locator;
    readonly txtLastName: Locator;
    readonly txtCompany: Locator;
    readonly txtAddress1: Locator;
    readonly txtAddress2: Locator;
    readonly dropCountry: Locator;
    readonly txtState: Locator;
    readonly txtCity:Locator;
    readonly txtZipCode: Locator;
    readonly txtMobileNumber: Locator;
    readonly botonCreateAccount: Locator;

    constructor (page: Page) {
        this.page = page;
        this.radioButtonGender1 = page.locator('#id_gender1');
        this.radioButtonGneder2 = page.locator('#id_gender2');
        this.txtPassword = page.locator('[data-qa="password"]');
        this.dropDay = page.locator('[data-qa="days"]');
        this.dropMonth = page.locator('[data-qa="months"]');
        this.dropYear = page.locator('[data-qa="years"]');
        this.checkNewsletter = page.getByRole('checkbox', {name:'newsletter'});
        this.checkOffers = page.getByRole('checkbox', {name: 'optin'});
        this.txtFirstName = page.locator('[data-qa="first_name"]');
        this.txtLastName = page.locator('[data-qa="last_name"]');
        this.txtCompany = page.locator('[data-qa="company"]');
        this.txtAddress1 = page.locator('[data-qa="address"]');
        this.txtAddress2 = page.locator('[data-qa="address2"]');
        this.dropCountry = page.locator('[data-qa="country"]');
        this.txtState = page.locator('[data-qa="state"]');
        this.txtCity = page.locator('[data-qa="city"]');
        this.txtZipCode = page.locator('[data-qa="zipcode"]');
        this.txtMobileNumber = page.locator('[data-qa="mobile_number"]');
        this.botonCreateAccount = page.locator('[data-qa="create-account"]');

    }

    async seleccionarDias(){
        const options = await this.dropDay.locator('option').allInnerTexts();
        const randomDay = options[Math.floor((Math.random() * options.length) + 1)];
        await this.dropDay.selectOption({label: randomDay});
    }

    async seleccionarMeses() {
        const options = await this.dropMonth.locator('option').allInnerTexts();
        const randomMonth = options[Math.floor((Math.random() * options.length) + 1)];
        await this.dropMonth.selectOption({label: randomMonth});
    }

    async seleccionarAnios() {
        const options = await this.dropYear.locator('option').allInnerTexts();
        const randomYear = options[Math.floor((Math.random() * options.length) + 1)];
        await this.dropYear.selectOption({label: randomYear});
    }

    async seleccionarPais () {
        const options = await this.dropCountry.locator('option').allInnerTexts();
        const randomCountry = options[Math.floor((Math.random() * options.length) + 1)];
        await this.dropCountry.selectOption({label: randomCountry});
    }

    async llenarFormulario (usuario: any) {
        await this.radioButtonGneder2.check();
        await this.txtPassword.fill((usuario.password).toString());
        await this.seleccionarDias();
        await this.seleccionarMeses();
        await this.seleccionarAnios();
        await this.checkNewsletter.check();
        await this.txtLastName.fill((usuario.name).toString());
        await this.txtFirstName.fill((usuario.lastname).toString());
        await this.txtCompany.fill((usuario).toString());
        await this.txtAddress1.fill((usuario.address1).toString());
        await this.txtAddress2.fill((usuario.address2).toString());
        await this.seleccionarPais();
        await this.txtState.fill((usuario.state).toString());
        await this.txtCity.fill((usuario.city).toString());
        await this.txtZipCode.fill((usuario.zip).toString());
        await this.txtMobileNumber.fill((usuario.mobile).toString());
    }

}