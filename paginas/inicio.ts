import { Page, Locator } from "@playwright/test";

export class Inicio {
    readonly page: Page;
    readonly botonRegistrar: Locator;
    readonly botonContactUs: Locator;
    readonly botonTestCases: Locator;
    readonly botonProducts: Locator;
    readonly subEmail: Locator;
    readonly subButton: Locator;
    readonly cartButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.botonRegistrar = page.getByText(' Signup / Login');
        this.botonContactUs = page.getByText(' Contact us');
        this.botonTestCases = page.locator('#header').getByText(' Test Cases',{exact:true});
        this.botonProducts = page.getByText(' Products');
        this.subEmail = page.locator('input[type="email"]');
        this.subButton = page.locator('button[type="submit"]');
        this.cartButton = page.locator('#header').getByText(' Cart', {exact:true});
    }

    async irAlSitio(){
        await this.page.goto('https://www.automationexercise.com');
    }

}