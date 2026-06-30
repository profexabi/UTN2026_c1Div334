const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
// Optimizacion 3: Para no hardcodear la url, guardamos la base de la url en una variable
const urlBase = "http://localhost:3000/api/products";

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

    
    try {
        // Vamos a hacer el fetch a una URL personalizada
        const response = await fetch(`${urlBase}/${idProd}`);
        console.log(response);

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
    }
});


// Imprimimos mensaje de error
function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${mensaje}</p>
    `;
}

// Imprimimos mensaje de exito
function mostrarExito(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-exito">${mensaje}</p>
    `;
}

// Mostrar producto con un boton de eliminacion
function renderizarProducto(producto) {
    let htmlProducto = `
    <ul>
        <li class="lista-producto">
            <img src="${producto.image}" alt="${producto.name}">
            <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: $${producto.price}</strong></p>
            <input type="button" id="deleteProduct-button" value="Eliminar Producto">
        </li>
    </ul>
    `;

    contenedorProductos.innerHTML = htmlProducto;

    // Le asignamos un evento click a nuestro boton "Eliminar producto"
    const deleteProductButton = document.getElementById("deleteProduct-button");

    deleteProductButton.addEventListener("click", event => {
        event.stopPropagation(); // Evitamos la propagacion de eventos

        const confirmacion = confirm("Querés eliminar este producto?");
        
        if(!confirmacion) {
            alert("Eliminacion cancelada");
        } else {
            eliminarProducto(producto.id);
        }
    });
}

async function eliminarProducto(id) {
    try {
        const response = await fetch(`${urlBase}/${id}`, {
            method: "DELETE",
        });


        const result = await response.json();
        // OPCIONAL: Si devuelven un 204, el result deberia ser null
        // const result = response.status !== 204? await response.json() || null;

        if(response.ok) {
            mostrarExito(result.message);

            /* Ahora que mostramos un mensaje, este ya reemplaza a la vista
            // Eliminado el producto, actualizamos la vista
            contenedorProductos.innerHTML = "";
            */

        } else {
            console.error("Error: ", result.message);
            mostrarError("No se pudo eliminar el producto");
        }

    } catch (error) {
        console.error("Error en la solicitud DELETE: ", error);
        mostrarError("Ocurrio un error al eliminar un producto");
    }
}