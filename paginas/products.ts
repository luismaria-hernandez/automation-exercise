import {Page, Locator} from '@playwright/test';

export class Products {

    readonly page: Page;
    readonly tituloProductos: Locator;
    readonly firstProductViewButton: Locator;
    readonly searchBar: Locator;
    readonly searchButton: Locator;
    readonly categoryWoman: Locator;
    readonly subCategoryWoman: Locator;
    readonly categoryMan: Locator;
    readonly subCategoryMan: Locator;
    readonly brandPolo: Locator;
    readonly brandBabyhug: Locator;

    constructor (page: Page) {
        this.page = page;
        this.tituloProductos = page.getByText('ALL PRODUCTS');
        this.firstProductViewButton = page.locator('a[href="/product_details/1"]'); //.getByText('View Product');
        this.searchBar = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.categoryWoman = page.locator('a[href="#Women"]');
        this.subCategoryWoman = page.getByRole('link',{name: "Dress "})
        this.categoryMan = page.locator('a[href="#Men"]');
        this.subCategoryMan = page.getByRole('link', {name: "Tshirts " })
        this.brandPolo = page.locator('a[href="/brand_products/Polo"]');
        this.brandBabyhug = page.locator('a[href="/brand_products/Babyhug"]');
    }

    async buscarProducto (product: string) {
        await this.searchBar.fill(product);
        await this.searchButton.click();
    }
}