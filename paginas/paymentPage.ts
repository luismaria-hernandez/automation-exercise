import {Page, Locator} from "@playwright/test";

export class PaymentPage {

    readonly page: Page;
    readonly nameOnCard: Locator;
    readonly cardNumber: Locator;
    readonly cvc: Locator;
    readonly expirationMonth: Locator;
    readonly expirationYear: Locator;
    readonly paymentButton: Locator;
    readonly successMessage: Locator;

    constructor (page: Page) {
        this.page = page;
        this.nameOnCard = page.locator('[data-qa="name-on-card"]');
        this.cardNumber = page.locator('[data-qa="card-number"]');
        this.cvc = page.locator('[data-qa="cvc"]');
        this.expirationMonth = page.locator('[data-qa="expiry-month"]');
        this.expirationYear = page.locator('[data-qa="expiry-year"]');
        this.paymentButton = page.locator('[data-qa="pay-button"]');
        this.successMessage = page.getByText('Your order has been placed successfully!', {exact:true});
    }

    async llenarDatosPago (tarjeta: any) {
        await this.nameOnCard.fill((tarjeta.nameOnCard).toString());
        await this.cardNumber.fill((tarjeta.cardNumber).toString());
        await this.cvc.fill((tarjeta.cvc).toString());
        await this.expirationMonth.fill((tarjeta.expirationMonth).toString());
        await this.expirationYear.fill((tarjeta.expirationYear).toString());
    }
}
