import {test, expect} from "@playwright/test";
import { Products } from "../paginas/products";
import { Inicio } from "../paginas/inicio";
import {AddedConfirmationModal} from "../paginas/addedConfirmationModal";
import {CheckoutModal} from "../paginas/checkoutModal";
import { AccountInformation } from "../paginas/accountInformation";
import { RegistroLogin } from "../paginas/registroUsuario";
import {BackendUtils} from "../utils/backendUtils";
import {faker} from "@faker-js/faker";
import {PaymentPage} from "../paginas/paymentPage";
import TestData from "../datosPrueba/datosUsuarios.json";
import Review from "../datosPrueba/reviewProducts.json"
import DatosTarjeta from "../datosPrueba/datosTarjeta.json"
import * as fs from "node:fs/promises";
import * as path from "node:path";

let product: Products;
let homePage : Inicio;
let modal: AddedConfirmationModal;
let checkoutModal: CheckoutModal;
let registroLogin: RegistroLogin;
let accountInformation: AccountInformation;
let paymentPage: PaymentPage;
let registroUsuario: RegistroLogin;

test.beforeEach(async ({page}) => {

    product = new Products(page);
    homePage = new Inicio(page);
    modal = new AddedConfirmationModal(page);
    checkoutModal = new CheckoutModal(page);
    registroLogin = new RegistroLogin(page);
    accountInformation = new AccountInformation(page);
    paymentPage = new PaymentPage(page);
    registroUsuario = new RegistroLogin(page);

    await page.goto('https://www.automationexercise.com');
    await page.waitForLoadState('networkidle');
});

test('TC12 - Add product in cart', async ({page}) => {
    await homePage.botonProducts.click();
    await page.locator('[data-product-id="1"]').first().click();
    await expect(modal.titulo).toBeVisible();
    await modal.continueShoppingButton.click();
    await page.locator('[data-product-id="2"]').first().click();
    await expect(modal.titulo).toBeVisible();
    await modal.viewCartLink.first().click();
    await expect(page.getByText('Blue Top')).toBeVisible();
    await expect(page.getByText('Men Tshirt')).toBeVisible();

});

test('TC13 - Verify product quantity in Cart', async ({page}) => {
    await homePage.botonProducts.click();
    await page.locator('a[href="/product_details/1"]').click();
    await page.locator('#quantity').fill('4');
    await page.getByText('Add to cart').click();
    await expect(modal.titulo).toBeVisible();
    await modal.viewCartLink.click();
    await expect(page.locator('.cart_quantity').getByText('4')).toBeVisible();
});

test('TC14 - Place Order: Register while checkout', async ({page}) => {
    
    const usuario = TestData.datosRegistro;
    const tarjeta = DatosTarjeta.tarjeta;
    const name = faker.person.firstName();
    const email = 'testmail'+Math.floor((Math.random() * 1000000) + 1)+'@mail.com';

    await test.step('Step 1 - Select a product', async ()=> {
        await homePage.botonProducts.click();
        await page.locator('[data-product-id="1"]').first().click();
        await expect(modal.titulo).toBeVisible();
        await modal.viewCartLink.click();
    });

    await test.step('Step 2 - Registrarse en la página', async () => {
        await page.getByText('Proceed To Checkout', {exact:true}).click();
        await checkoutModal.registerLoginLink.click();
        await registroLogin.llenarFormulario(name,email);
        await registroLogin.botonSignUp.click();
        await accountInformation.llenarFormulario(usuario);
        await accountInformation.botonCreateAccount.first().click();
        await expect(page.locator('[data-qa="account-created"]')).toHaveText("Account Created!");
    });
    
    await test.step('Step 3 - Proceed to checkout',async () => {
        await homePage.cartButton.click();
        await page.getByText('Proceed To Checkout').click();
        await page.getByRole('link', { name: 'Place Order' }).click();
        await paymentPage.llenarDatosPago(tarjeta);
        await paymentPage.paymentButton.click();
        await expect(page.locator('[data-qa="order-placed"]')).toHaveText('Order Placed!');

    });

    await test.step('Step 4 - Delete the account', async () => {
        await page.locator('a[href="/delete_account"]').click();
        await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
    });

});

test('TC15 - Register before checkout', async ({page}) => {

    const tarjeta = DatosTarjeta.tarjeta;
    const usuario = TestData.datosRegistro;
    const name = faker.person.firstName();
    const email = 'testmail'+Math.floor((Math.random() * 1000000) + 1)+'@mail.com';

    await test.step('Step 1 - Create and account', async () => {
        await homePage.botonRegistrar.click();
        await registroLogin.llenarFormulario(name,email);
        await registroLogin.botonSignUp.click();
        await accountInformation.llenarFormulario(usuario);
        await accountInformation.botonCreateAccount.click();
        await expect(page.locator('[data-qa="account-created"]')).toHaveText('Account Created!');
    });

    await test.step('Step 2 - Add products to the cart', async () => {
        await homePage.botonProducts.click();
        await page.locator('[data-product-id="1"]').first().click();
        await expect(modal.titulo).toBeVisible();
        await modal.viewCartLink.click();
    });

    await test.step('Step 3 - Proceed to checkout', async () => {
        await homePage.cartButton.click();
        await page.getByText('Proceed To Checkout').click();
        await page.getByRole('link', { name: 'Place Order' }).click();
        await paymentPage.llenarDatosPago(tarjeta);
        await paymentPage.paymentButton.click();
        await expect(page.locator('[data-qa="order-placed"]')).toHaveText('Order Placed!');
    });

    await test.step('Step 4 - Delete the account', async () => {
        await page.locator('a[href="/delete_account"]').click();
        await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
    });
});

test('TC16 - Place order: Login before checkout', async ({page,request}) => {

    const tarjeta = DatosTarjeta.tarjeta;
    const nuevoUsuario = await BackendUtils.crearUsuarioAPI(request);
    const email = (nuevoUsuario.email).toString();
    const password = (nuevoUsuario.password).toString();

    await test.step('Step 1 - Login user', async ()=> {
        await registroLogin.llenarFormularioLogin(email,password);
        await expect(page.locator('a[href="/logout"]')).toHaveText(' Logout');
    });

    await test.step('Step2 - Add products to the cart', async () => {
        await homePage.botonProducts.click();
        await page.locator('[data-product-id="1"]').first().click();
        await expect(modal.titulo).toBeVisible();
        await modal.viewCartLink.click();
    });

    await test.step('Step 3 - proceed to checkout', async () => {
        await homePage.cartButton.click();
        await page.getByText('Proceed To Checkout').click();
        await page.getByRole('link', { name: 'Place Order' }).click();
        await paymentPage.llenarDatosPago(tarjeta);
        await paymentPage.paymentButton.click();
        await expect(page.locator('[data-qa="order-placed"]')).toHaveText('Order Placed!');
    });

    await test.step('Step 4 - Delete the account', async () => {
        await page.locator('a[href="/delete_account"]').click();
        await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
    });
});

test('TC17 - Remove products from Cart', async ({page,request})  => {

    const producto = await BackendUtils.traerTodosLosProductos(request);

    await homePage.botonProducts.click();
    await product.searchBar.fill(producto.name.toString());
    await product.searchButton.click();
    await page.locator(`[data-product-id="${producto.id}"]`).first().click();
    await expect(modal.titulo).toBeVisible();
    await modal.viewCartLink.click();
    await page.locator(`a[data-product-id="${producto.id}"]`).click();
    await expect(page.getByText('Cart is empty! Click here to buy products.')).toBeVisible();

});

test('TC18 - View category products', async ({page}) => {
    await homePage.botonProducts.click();
    await product.categoryWoman.click();
    await product.subCategoryWoman.click();
    await expect(page.getByText('Women - Dress Products')).toBeVisible();
    await product.categoryMan.click();
    await product.subCategoryMan.click();
    await expect(page.getByText('Men - Tshirts Products')).toBeVisible();
});

test('TC19 - View & Cart Brand products', async ({page}) => {
    await homePage.botonProducts.click();
    await product.brandPolo.click()
    await expect(page.getByText('Brand - Polo Products')).toBeVisible();
    await product.brandBabyhug.click()
    await expect(page.getByText('Brand - Babyhug Products')).toBeVisible();
});

test('TC20 - Search Products and verify cart after login', async ({page, request}) => {
    const producto = await BackendUtils.traerTodosLosProductos(request);
    const usuario = TestData.usuariosRegistrados.email;
    const password = TestData.usuariosRegistrados.password;

    await homePage.botonProducts.click();
    await product.searchBar.fill(producto.name);
    await product.searchButton.click();
    await page.locator(`[data-product-id="${producto.id}"]`).first().click();
    await modal.viewCartLink.click();
    await page.getByRole('link', {name: ' Signup / Login' }).click();
    await registroLogin.llenarFormularioLogin(usuario,password);
    await registroLogin.botonLogin.click();
    await homePage.cartButton.click();
    await expect(page.getByText(producto.name)).toBeVisible();
});

test('TC21 - Add review on a product' , async ({page,request}) => {
    const producto = await BackendUtils.traerTodosLosProductos(request);
    const newReview = Review.reviews;
    
    await homePage.botonProducts.click();
    await product.searchBar.fill(producto.name);
    await product.searchButton.click();
    await page.locator(`[data-product-id="${producto.id}"]`).first().click();
    await modal.viewCartLink.click();
    await page.getByRole('link',{name:producto.name}).click();
    await page.locator('#name').fill(newReview.name);
    await page.locator('#email').fill(newReview.email);
    await page.locator('#review').fill(newReview.message);
    await page.locator('#button-review').click();
    await expect(page.getByText('Thank you for your review.')).toBeVisible();

});

test('TC22 - Add to cart from recommended items', async ({page}) => {
    const randomNumber = Math.floor((Math.random() * 6) + 1);
    
    await page.locator('#recommended-item-carousel').locator(`[data-product-id="${randomNumber}"]`).click();
    await modal.viewCartLink.click();
    await expect(page.locator(`a[href="/product_details/${randomNumber}"]`)).toBeVisible();
});

test('TC23 - Verify address details in checkout page', async ({page,request}) => {
    const nuevoUsuario = await BackendUtils.crearUsuarioAPI(request);
    const producto = await BackendUtils.traerTodosLosProductos(request);
    console.log(nuevoUsuario);

    await homePage.botonRegistrar.click();
    await registroLogin.llenarFormularioLogin(nuevoUsuario.email,nuevoUsuario.password);
    await registroLogin.botonLogin.click();
    await expect(page.getByRole('link', {name:nuevoUsuario.name}));
    await homePage.botonProducts.click();
    await product.searchBar.fill(producto.name);
    await product.searchButton.click();
    await page.locator(`[data-product-id="${producto.id}"]`).first().click();
    await modal.viewCartLink.click();
    await page.getByText('Proceed To Checkout').click();
    await expect(page.locator('#address_delivery').getByText(nuevoUsuario.address1)).toBeVisible();
    await expect(page.locator('#address_invoice').getByText(nuevoUsuario.address1)).toBeVisible();
    await page.getByRole('link', {name:" Delete Account"}).click();
    await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();

});

test('TC24 - Download invoice after purchase', async ({page,request}) => {
    const nuevoUsuario = await BackendUtils.crearUsuarioAPI(request);
    const producto = await BackendUtils.traerTodosLosProductos(request);

    await homePage.botonProducts.click();
    await product.searchBar.fill(producto.name);
    await product.searchButton.click();
    await page.locator(`[data-product-id="${producto.id}"]`).first().click();
    await modal.viewCartLink.click()
    await page.getByText('Proceed To Checkout').click();
    await checkoutModal.registerLoginLink.click();
    await registroLogin.llenarFormularioLogin(nuevoUsuario.email,nuevoUsuario.password);
    await registroLogin.botonLogin.click();
    await expect(page.getByText(nuevoUsuario.name)).toBeVisible();
    await homePage.cartButton.click();
    await page.getByText('Proceed To Checkout').click();
    await page.getByRole('link', {name:'Place Order'}).click();
    await paymentPage.nameOnCard.fill(DatosTarjeta.tarjeta.nameOnCard);
    await paymentPage.cardNumber.fill(DatosTarjeta.tarjeta.cardNumber);
    await paymentPage.cvc.fill(DatosTarjeta.tarjeta.cvc);
    await paymentPage.expirationMonth.fill(DatosTarjeta.tarjeta.expirationMonth);
    await paymentPage.expirationYear.fill(DatosTarjeta.tarjeta.expirationYear);
    await paymentPage.paymentButton.click();
    await page.getByText('Download Invoice').click();
    await page.getByRole('link', {name:" Delete Account"}).click();
    await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
});

test('TC25 - Verify Scroll Up using "Arrow" button and Scroll Down functionality', async ({page,request}) => {
    await page.getByText('Subscription').scrollIntoViewIfNeeded();
    await expect(page.getByText('Subscription')).toBeVisible();
    await page.locator('#scrollUp').click();
    await expect(page.getByRole('heading', {name: 'AutomationExercise'})).toBeVisible();
});

test('TC26 - Verify Scroll Up without "Arrow" button and Scroll Down functionality', async ({page}) => {
    await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight));
    await expect(page.getByText('Subscription')).toBeVisible();
    await page.evaluate(() => window.scrollTo(0,0));
    await expect(page.getByRole('heading', {name: 'AutomationExercise'})).toBeVisible();

});