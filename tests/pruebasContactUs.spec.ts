import {test,expect} from '@playwright/test'
import {ContactUs} from '../paginas/contactUs';
import {Inicio} from '../paginas/inicio'
import TestData from '../datosPrueba/datosUsuarios.json';

let paginaContactUs: ContactUs;
let paginaInicio: Inicio;

test.beforeEach(async ({page})=>{
    paginaContactUs = new ContactUs(page);
    paginaInicio = new Inicio(page);

    await page.goto('https://www.automationexercise.com/');
    await page.waitForLoadState('networkidle');
});

test('TC06 - Contact us Form', async ({page}) => {
    await paginaInicio.botonContactUs.click();

    let dataForm = TestData.datosFormulario;

    /*Tenes que ver como manipular los dialogos emergentes de JS en el navegador */

    await paginaContactUs.llenarFormularioContacto(dataForm);
    page.on('dialog', async (d1) => { /*Lo que hacemos aquí es colocar un listener (page.on) antes de que se dispare el evento. Le decimos que lo que tiene que escuchar es un diálogo emergente y luego de la coma le indicamos que es un proceso asíncrono y entre paréntesis le pasamos el nombre del la instanciaque representa al diálogo (d1) */
        console.log(d1.type());
        await d1.accept(); /*Luuego, aplicamos uno de los métodos de los diálogos que es justamente aceptar el diálogo*/
    });
    await paginaContactUs.botonSubmit.click();
    await expect(page.locator('#contact-page').getByText('Success! Your details have been submitted successfully.')).toBeVisible(); /*Lo que hace esto es limitar la busqueda en el formulario donde se encuentra ya que este mensaje existe dos veces para una acción completamente distinta */
});

test('TC07 - Validate the test cases page', async ({page}) => {
    await paginaInicio.botonTestCases.click();
    await expect(page.locator('#form').getByText('Test Cases', {exact:true})).toBeVisible();
});






