const contenedorProductos = document.getElementById("contenedor-productos");
const postProductForm = document.getElementById("postProduct-form");
const postUserForm = document.getElementById("postUser-form");

//////////////////
// Optimizacion 3: Validacion previa de los datos en el cliente
function validarFormulario(data) {

    const errores = [];

    if (!data.name || data.name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!data.price || isNaN(data.price) || Number(data.price) < 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    // Recordatorio, no validamos imagen porque posteriormente usaremos Multer

    if (!data.category) {
        errores.push("Debe seleccionar una categoria");
    }

    return errores;
}

// Optimizacion 4: Creamos una funcion para mostrar posibles mensajes al crear un producto
function mostrarMensaje(tipo, mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}


postUserForm.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.table(data);

    try {
        const urlBase = "http://localhost:3000/api/users/"
        const response = await fetch(urlBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        console.log(response);
        const result = await response.json();

        // Optimizacion 5: Manejamos respuestas no ok del servidor
        if (!response.ok) {
            mostrarMensaje("error", result.message);
            return;
        }

        // alert(result.message);
        console.log(result.message);

        // Optimizacion 4: Reutilizamos la funcion de mostrarMensaje
        mostrarMensaje("exito", result.message);

    } catch (error) {
        console.error("Error al enviar los datos: ", error);
        mostrarMensaje("error", "Error al procesar la solcitud")
    }

})


postProductForm.addEventListener("submit", async event => {
    event.preventDefault(); // Detenemos el envio por defecto del formulario

    /* Obtenemos la data del formulario:

        1. Transformamos la informacion del form en un objeto FormData

        2. Transformamos la info del FormData a un objeto normal JS

        3. Con la info en objetos JS, lo enviamos en el body de la request
    */

    // Obtenemos la info del formulario
    const formData = new FormData(event.target); // Guardamos la info del form en un objeto nativo FormData
    console.log(formData);
    /*
    FormData(4) { name → "Fernet Branca", image → "https://http2.mlstatic.com/D_Q_NP_2X_685551-MLA99433693010_112025-E.webp", category → "drink", price → "17000" }

    Las entries del FormData son:
        0: name → "Fernet Branca"
        1: image → "https://http2.mlstatic.com/D_Q_NP_2X_685551-MLA99433693010_112025-E.webp"
        2: category → "drink"​
        3: price → "17000"
    */

   // Transformamos este objeto nativo en un objeto JavaScript normal
   const data = Object.fromEntries(formData.entries());
   console.log(data);           

    // La idea de esto es poder parsear este objeto como JSON en el body de la peticion
    /*
    {
        "name": "Fernet Branca",
        "image": "https://http2.mlstatic.com/D_Q_NP_2X_685551-MLA99433693010_112025-E.webp",
        "category": "drink",
        "price": "123"
    }
    */

    // Optimizacion 1: Parseamos price antes de enviarlo, FormData devuelve todo como strings y el back espera price como numero
    data.price = Number(data.price);


    // Optimizacion 2: Llamamos a la funcion para validar los datos del formulario
    const errores = validarFormulario(data);
    if (errores.length > 0) {
        mostrarMensaje("error", errores.join("\n"));
        return;
    }


    // Ahora este objeto ya puede enviarse anexado al cuerpo (body) de la peticion HTTP (HTTP Request)
    try {
        const urlBase = "http://localhost:3000/api/products/"
        const response = await fetch(urlBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        console.log(response);
        const result = await response.json();

        // Optimizacion 5: Manejamos respuestas no ok del servidor
        if (!response.ok) {
            mostrarMensaje("error", result.message);
            return;
        }

        // alert(result.message);
        console.log(result.message);

        // Optimizacion 4: Reutilizamos la funcion de mostrarMensaje
        mostrarMensaje("exito", result.message);

    } catch (error) {
        console.error("Error al enviar los datos: ", error);
        mostrarMensaje("error", "Error al procesar la solcitud")
    }
});
