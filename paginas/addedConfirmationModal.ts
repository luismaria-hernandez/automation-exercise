import {Locator, Page} from "@playwright/test"

export class AddedConfirmationModal {

    readonly page: Page
    readonly titulo: Locator;
    readonly mensaje: Locator;
    readonly viewCartLink: Locator;
    readonly continueShoppingButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.titulo = page.getByText('Added!');
        this.mensaje = page.getByText('Your product has been added to cart.');
        this.viewCartLink = page.getByText('View Cart');
        this.continueShoppingButton = page.getByText('Continue Shopping');
    }

} 