import {test, expect} from '@playwright/test';
import {Inicio} from '../paginas/inicio';
import {RegistroLogin} from '../paginas/registroUsuario';
import TestData from '../datosPrueba/datosUsuarios.json'
import {AccountInformation} from '../paginas/accountInformation';
import {faker} from '@faker-js/faker';

let paginaPrincipal: Inicio;
let registroLogin: RegistroLogin;
let accountInformation: AccountInformation;

test.beforeEach(async ({page}) => {
    paginaPrincipal = new Inicio(page);
    registroLogin = new RegistroLogin(page);
    accountInformation = new AccountInformation(page);

    await paginaPrincipal.irAlSitio();
    await page.waitForLoadState('networkidle');
});

test('TC01 - Register User', async ({page}) => {
    await paginaPrincipal.botonRegistrar.click();
    await expect(registroLogin.tituloSingUp).toBeVisible();

    let usuario = TestData.datosRegistro;
    let nombreUsuario = TestData.usaurios.username;
    let emailUsuario = 'testmail'+ Math.floor(Math.random() * 1000000 + 1).toString() +'@test.com';

    await registroLogin.llenarFormulario(nombreUsuario,emailUsuario);
    await registroLogin.botonSignUp.click();
    await accountInformation.llenarFormulario(usuario);
    await accountInformation.botonCreateAccount.click();
    await expect(page.getByText('ACCOUNT CREATED!', {exact:true})).toBeVisible();
});

test('TC02 - Login user with correct email and password', async ({page}) => {
    await paginaPrincipal.botonRegistrar.click();
    await expect(registroLogin.tituloLogin).toBeVisible();

    let userEmail = TestData.usuariosRegistrados.email;
    let password = TestData.usuariosRegistrados.password;

    await registroLogin.llenarFormularioLogin(userEmail,password);
    await registroLogin.botonLogin.click();
    await expect(page.getByText(' Logout',{exact : true})).toBeVisible();
    
});

test('TC03 - Login user with incorrect email and password', async ({page}) => {
    await paginaPrincipal.botonRegistrar.click();
    await expect(registroLogin.tituloLogin).toBeVisible();
    
    let userMail = 'somemail@test.com';
    let password = 'somepassword';

    await registroLogin.llenarFormularioLogin(userMail,password);
    await registroLogin.botonLogin.click();
    await expect(page.getByText('Your email or password is incorrect!', {exact : true})).toBeVisible();
});

test('TC04 - Logout user', async ({page})=> {
    await paginaPrincipal.botonRegistrar.click();
    await expect(registroLogin.tituloLogin).toBeVisible();

    let userEmail = TestData.usuariosRegistrados.email;
    let password = TestData.usuariosRegistrados.password;

    await registroLogin.llenarFormularioLogin(userEmail,password);
    await registroLogin.botonLogin.click();
    await expect(page.getByText(' Logout', {exact: true})).toBeVisible();
    await page.getByText(' Logout', {exact: true}).click();
    await expect(page.waitForURL('https://www.automationexercise.com/login'));
});

test('TC05 - Register with and existing email account', async ({page}) => {
    await registroLogin.irPaginaRegistroLogin();
    await expect(registroLogin.tituloSingUp).toBeVisible();
    
    let userName = faker.person.firstName();
    let userMail = TestData.usuariosRegistrados.email;

    await registroLogin.llenarFormulario(userName,userMail);
    await registroLogin.botonSignUp.click();
    await expect(page.getByText('Email Address already exist!')).toBeVisible();

});