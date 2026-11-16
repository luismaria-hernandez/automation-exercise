import {Page, Locator} from '@playwright/test'

export class ContactUs {

    readonly page:Page;
    readonly campoName: Locator;
    readonly campoEmail: Locator;
    readonly campoSubject: Locator;
    readonly camporMessage: Locator;
    readonly campoUpload: Locator;
    readonly botonSubmit: Locator;

    constructor (page: Page) {
        this.page = page;
        this.campoName = page.locator('[data-qa="name"]');
        this.campoEmail = page.locator('[data-qa="email"]');
        this.campoSubject = page.locator('[data-qa="subject"]');
        this.camporMessage = page.locator('[data-qa="message"]');
        this.campoUpload = page.locator('input[type="file"]');
        this.botonSubmit = page.getByRole('button', {name: 'submit' });
    }

    async llenarFormularioContacto (datosForm: {name: string, email: string, subject: string, message: string} ) {
        await this.campoName.fill(datosForm.name);
        await this.campoEmail.fill(datosForm.email);
        await this.campoSubject.fill(datosForm.subject);
        await this.camporMessage.fill(datosForm.message);
        await this.campoUpload.setInputFiles('archivos_prueba/archivoPrueba.txt');
    }

}