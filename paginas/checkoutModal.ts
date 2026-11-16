import {Page,Locator} from "@playwright/test";

export class CheckoutModal {
    readonly page: Page;
    readonly titulo: Locator;
    readonly mensaje: Locator;
    readonly registerLoginLink: Locator;
    readonly continueOnCartButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.titulo = page.getByText('Checkout');
        this.mensaje = page.getByText('Register / Login account to proceed on checkout.');
        this.registerLoginLink = page.getByRole('link', { name: 'Register / Login' });
        this.continueOnCartButton = page.getByText('Continue On Cart');
    }
}