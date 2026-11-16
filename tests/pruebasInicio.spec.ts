import {test, expect} from "@playwright/test";
import { Inicio} from "../paginas/inicio";

let homePage: Inicio

test.beforeEach (async ({page}) => {

    homePage = new Inicio(page);

    await page.goto('https://www.automationexercise.com/');
    await page.waitForLoadState('networkidle');
});

test('TC10 - Verify subscription in home page', async ({page}) => {
    
    const testEmail = 'testUser'+Math.floor((Math.random() * 1000000) + 1)+'@test.com';

    await homePage.subEmail.fill(testEmail);
    await homePage.subButton.click();
    await expect(page.getByText('SUBSCRIPTION')).toBeVisible();
    await expect(page.locator('#footer').getByText('You have been successfully subscribed')).toBeVisible();
});

test('TC11 - Verify Subscription in cart page', async ({page}) => {
    const testEmail = 'testUser'+Math.floor((Math.random() * 1000000) + 1)+'@test.com';

    await homePage.cartButton.click()
    await homePage.subEmail.fill(testEmail);
    await homePage.subButton.click();
    await expect(page.getByText('SUBSCRIPTION')).toBeVisible();
    await expect(page.locator('#footer').getByText('You have been successfully subscribed')).toBeVisible();
});

