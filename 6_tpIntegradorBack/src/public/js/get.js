const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");

getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); //Evitamos el envio por defecto HTML del formulario

    // Optimizacion 1: Saltamos el FormData + Object.fromEntries
    // Extraemos el id del producto
    const idProd = event.target.idProd.value.trim();

    // Optimizacion 2: Nos aseguramos de que se haya enviado un id valido
    if (!idProd) {
        mostrarError("Ingresá un id valido");
        return;
    }

    // Optimizacion 3: Guardamos la url en una variable para no hardcodearla en el fetch
    const urlBase = "http://localhost:3000/api/products";
    
    try {
        // Vamos a hacer el fetch a una URL personalizada
        const response = await fetch(`${urlBase}/${idProd}`);
        console.log(response);
        /*
        Response {type: 'cors', url: 'http://localhost:3000/api/products/2', redirected: false, status: 404, ok: false, …}
        */

        // Procesamos los datos que devuelve el servidor
        const datos = await response.json();

        // Optimizacion 4: Evaluamos si el servidor respondio correctamente (200 -> ok)
        if (!response.ok) { // Que hacer si la respuesta no es 200 (404 o 500)
            mostrarError(datos.message);
            return; // La sentencia return FINALIZA la restante ejecucion del codigo
        }

        const producto = datos.payload;

        console.log(producto); 
        /* {
            "id": 41,
            "name": "Fernet Cola Chabona",
            "image": "https://pointlaventanita.com/wp-content/uploads/2024/05/chabona.webp",
            "category": "drink",
            "price": "4300.00",
            "active": 1
        }*/

        renderizarProducto(producto);

    } catch (error) {
        console.error("Error al obtener el producto");

        // Optimizacion 5: Mostramos otro error por pantalla
        mostrarError(error.message);
    }
});

// Imprimimos producto
function renderizarProducto(producto) {
    let htmlProducto = `
    <ul>
        <li class="lista-producto">
            <img src="${producto.image}" alt="${producto.name}">
            <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: $${producto.price}</strong></p>
        </li>
    </ul>
    `;

    contenedorProductos.innerHTML = htmlProducto;
}

// Imprimimos mensaje de error
function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${mensaje}</p>
    `;
}