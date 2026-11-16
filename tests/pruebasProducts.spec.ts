import {test, expect} from '@playwright/test';
import {Products} from '../paginas/products';
import { Inicio } from '../paginas/inicio';
import ProductsData from '../datosPrueba/products.json'

let products: Products;
let inicio: Inicio;

test.beforeEach (async ({page}) => {
    products = new Products(page);
    inicio = new Inicio(page);

    await page.goto('https://www.automationexercise.com/');
    await page.waitForLoadState('networkidle');
});

test('TC08 - Verify all products and product detail page', async ({page}) => {
    await inicio.botonProducts.click();
    await expect(products.tituloProductos).toBeVisible();
    await products.firstProductViewButton.click();
    await expect(page.getByText('Blue Top')).toBeVisible();
    await expect(page.getByText('Category: Women > Tops')).toBeVisible();
    await expect(page.getByText('Availability:')).toBeVisible();
    await expect(page.getByText('Condition:')).toBeVisible();
    await expect(page.getByText('Brand:')).toBeVisible();
});

test('TC09 - Validate the search of the products', async ({page}) => {
    await inicio.botonProducts.click();
    await expect(products.tituloProductos).toBeVisible();
    const tamanioLista = ProductsData.products.length;
    const numeroAleatorio = Math.floor((Math.random() * tamanioLista) + 1);
    const randomProduct = ProductsData.products[numeroAleatorio].name;
    await products.buscarProducto(randomProduct.toString());
    await expect(page.getByText('SEARCHED PRODUCTS')).toBeVisible();
    await expect(page.locator('p', {hasText: randomProduct.toString()}).first()).toBeVisible(); /* Lo que hago aqui es buscar el párrafo que tenga el texto del producto que está almacenado en la variable. Como hay dos textos que se muestran en la tarjeta, le digo que diractamente valide la primera que aparezca */
});

