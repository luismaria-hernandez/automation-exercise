import {Page, Locator} from '@playwright/test';

export class RegistroLogin {

    readonly page: Page;
    readonly tituloSingUp: Locator;
    readonly campoName: Locator;
    readonly campoEmail: Locator;
    readonly botonSignUp: Locator;
    readonly tituloLogin: Locator;
    readonly campoEmail2: Locator;
    readonly password: Locator;
    readonly botonLogin: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tituloSingUp = page.getByText('New User Signup!', {exact:true});
        this.campoName = page.locator('[data-qa="signup-name"]');
        this.campoEmail = page.locator('[data-qa="signup-email"]');
        this.botonSignUp = page.locator('[data-qa="signup-button"]');
        this.tituloLogin = page.getByText('Login to your account', {exact: true});
        this.campoEmail2 = page.locator('[data-qa="login-email"]');
        this.password = page.locator('[data-qa="login-password"]');
        this.botonLogin = page.locator('[data-qa="login-button"]');
    }

    async irPaginaRegistroLogin(){
        await this.page.goto('https://www.automationexercise.com/login');
    }

    async llenarFormulario(nombreUsuario: string, emailUsuario: string) {
        await this.campoName.fill(nombreUsuario);
        await this.campoEmail.fill(emailUsuario);
    }

    async llenarFormularioLogin(email: string, password: string) {
        await this.campoEmail2.fill(email);
        await this.password.fill(password);
    }

}