import { APIRequestContext, expect } from "@playwright/test";
import {faker} from "@faker-js/faker";

export class BackendUtils {
    static async crearUsuarioAPI(request: APIRequestContext) {
        
        const email = 'testmail'+(Math.floor(Math.random() * 1000000) + 1) + '@mail.com';
        const password = 'password'+(Math.floor(Math.random() * 1000000) + 1);
        const name = faker.person.fullName();
        const address1 = 'Testing address 123'

        const requestResponse = await request.post('https://automationexercise.com/api/createAccount', {
            form: { /*Este es el formato que espera el servidor. Antes usábamos "data, y ahora usamos "form" */
                name: name,
                email: email,
                password: password,
                title: 'Mr',
                birth_date: '13',
                birth_month: 'June',
                birth_year: '1988',
                firstname:  faker.person.firstName(),
                lastname: faker.person.lastName(),
                company: 'Testing Company',
                address1: address1,
                address2: 'N/A',
                country: 'United States',
                zipcode: '1234',
                state: 'Test State',
                city: 'Test City',
                mobile_number: '123456789'
            }
        });

        await expect(requestResponse.status()).toBe(200);
        const responseBody = await requestResponse.json();
        await expect(responseBody.responseCode).toBe(201);
        return {email,password,address1,name};
    }

    static async traerTodosLosProductos (request: APIRequestContext) {
        
        const respuestaAPI = await request.get('https://automationexercise.com/api/productsList');
        expect(respuestaAPI.status()).toBe(200);
        const respuestaJson = await respuestaAPI.json();
        const numAleatorio = Math.floor((Math.random() * respuestaJson.products.length));
        console.log(numAleatorio);
        const name = await respuestaJson.products[numAleatorio].name;
        const id = await respuestaJson.products[numAleatorio].id;

        return await {id,name}
    }

}