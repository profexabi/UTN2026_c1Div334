// Redireccion a inicio////////////////////
let nombreUsuario = sessionStorage.getItem("nombreUsuario");

// Redirige si no existe un nombre de usuario
if(!nombreUsuario){
	window.location.href = "index.html";
}




// Variables////////////////////////////////
let productos = []; // Agregamos la variable global productos
let cuadriculaProductos = document.querySelector(".product-grid");
let barraBusqueda = document.querySelector(".search-bar");

let botonesCarrito = document.querySelectorAll(".add-to-cart");
let objetosCarrito = document.getElementById("cart-items");
let precioCarrito = document.getElementById("total-price");
let contadorCarrito = document.getElementById("cart-count");

let boton_imprimir = document.getElementById("btn-imprimir");

let carrito = [];




// Obtener productos////////////////////////////////////////////
const url = "http://localhost:3000/api/products"; // Guardamos en una variable la url de nuestro endpoint

async function obtenerProductos() {
    try {
        let respuesta = await fetch(url); // Hacemos una peticion a nuestro nuevo endpoint en http://localhost:3000/api/products

        let data = await respuesta.json();

        console.log(data); // Nuestros productos estan disponibles dentro de payload { payload: Array(19) }

        productos = data.payload; // Aca guardamos en la variable productos el array de productos que contiene "payload"

        mostrarProductos(productos);
        
        

    } catch(error) {
        console.error(error);
    }
}




// Mostrar productos////////////////////////////////
function mostrarProductos(array) {
    let cartaProducto = "";
    
    for(let i = 0; i < array.length; i++) {    
        cartaProducto += `
            <div class="product-card">
                <img src="${array[i].image}" alt="${array[i].name}">
                <h3>${array[i].name}</h3>
                <p>$${array[i].price}</p>
                <button class="add-to-cart" onclick="agregarCarrito(${array[i].id})">Agregar a carrito</button>
            </div>
        `;
    }
    cuadriculaProductos.innerHTML = cartaProducto;
    //console.log(cartaProducto)
}




// Saludar usuario/////////////////////////////////
function saludarUsuario() {
    let saludoUsuario = document.getElementById("saludo-usuario");
    saludoUsuario.innerHTML = `Bienvenidx ${nombreUsuario}!`;
}




function mostrarCarrito() {
    let carritoCompra = "";
    precioTotal = 0;

    carrito.forEach((producto, indice) => {
        carritoCompra += `
            <li class="item-block">
                <p class="item-name">${producto.name} - $${producto.price}</p>
                <button class="delete-button" onclick="eliminarProducto(${indice})">Eliminar</button>
            </li>
            `;

        precioTotal += parseInt(producto.price, 10);
    });

    // Imprimir html de producto
    objetosCarrito.innerHTML = carritoCompra;

    // Mostrar precio total y contador carrito
    precioCarrito.innerHTML = `$${precioTotal}`;

    // Mostrar el numero de objetos en el array carrito
    contadorCarrito.innerHTML = carrito.length;
    

    // Ocultar carrito si no hay productos
    if(carrito.length > 0) {
        document.getElementById("empty-cart").classList.remove("hidden");
        document.getElementById("empty-cart").classList.add("visible");
        
        document.getElementById("btn-imprimir").classList.remove("hidden");
        document.getElementById("btn-imprimir").classList.add("visible");
    } else {
        document.getElementById("empty-cart").classList.remove("visible");
        document.getElementById("empty-cart").classList.add("hidden");
        document.getElementById("btn-imprimir").classList.remove("visible");
        document.getElementById("btn-imprimir").classList.add("hidden");
        

        objetosCarrito.innerHTML = `<p class="info-carrito">No hay productos en el carrito.</p>`;
    }
}




// Filtrar productos////////////////////////////////
barraBusqueda.addEventListener("keyup", filtrarProductos);

function filtrarProductos() {
	let valorBusqueda = barraBusqueda.value;
	// console.log(valorBusqueda)

	let productosFiltrados = productos.filter((producto) => { 
		return producto.name.includes(valorBusqueda);
	});
	mostrarProductos(productosFiltrados);
}




// Imprimir tickets pdf ////////////////////////////////
// let boton_imprimir = document.getElementById("btn-imprimir");
boton_imprimir.addEventListener("click", imprimirTicket);

function imprimirTicket() {
    console.table(carrito);

    // Creamos el array vacio de ids de productos para registrar posteriormente que productos estan asociados a esta venta
    const idProductos = [];



    /* Gracias al CDN
        <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
    */
        
    // Extraemos la clase jspdf que se anexa al objeto global window
    const { jsPDF } = window.jspdf;

    // Creamos una nueva instancia de jsPDF
    const doc = new jsPDF();

    // Vamos a trabajar con dos ejes: x (horizontal) e y (vertical)
    let y = 10;

    // Definimos el tama;o de la fuente para el primer texto
    doc.setFontSize(18);

    // Escribimos el texto "Llama-ticket de compra" en las posiciones x=10 y 10 del pdf
    doc.text("Llama-ticket de compra:", 10, y);

    // Aumentamos 10px el espacio despues del titulo
    y += 10;

    // Reducimos el tamaño dela fuente para los productos
    doc.setFontSize(12);

    carrito.forEach(producto => {
        idProductos.push(producto.id); // Llenando el array de ids de producto

        doc.text(`${producto.name} / ${producto.price}`, 20, y);

        // La posicion verftical se incrementa en 7 puntos en cada linea para evitar solapamiento
        y += 7;
    });

    // Calculamos el precio total usando reduce
    const precioTotal = carrito.reduce((total, producto) => total + parseInt(producto.price) ,0);

    // Añadimos otro espacio vertical de 5 para separar los productos del total
    y +=5;

    // Escribimos el total del ticket en el pdf, debajo del listado de productos
    doc.text(`Total $${precioTotal}`, 10, y);

    // Imprimimos el ticket
    doc.save("ticket.pdf"); // Sugerencia: Usen fechas para poner de nombre

        
    // Llamada a registrar venta
    registrarVenta(precioTotal, idProductos);

}




// Creando ventas //////////////////////////////////////
/* Insertando ventas

Que debemos enviar a nuestra API?
Nuestro endpoint espera algo equivalente a los campos de la tabla tickets
    - nombreUsuario
    - precioTotal
    - fechaEmision

Ademas, en la tabla tickets_productos vincularemos los productos de la venta, por tanto enviaremos tambien los ids de los productos vendidos

Ejemplo de JSON a enviar
    {
        "nombreUsuario": "Morena",
        "precioTotal": 2000,
        "fechaEmision": "2025-12-01T20:30"
        "productos": [1, 5]
    }


Nuestra API deberia:
    1. Insertar la venta en tickets
    2. Obtener el id creado de la venta
    3. Insertar lso productos en productos_tickets
*/
async function registrarVenta(precioTotal, idProductos) {
    try {
        // let nombreUsuario = sessionStorage.getItem("nombreUsuario");

        const fecha = new Date();

        // Visualizamos por consola todos los datos que le mandaremos al endpoint /api/sales
        console.log(fecha);         // Mon Dec 01 2025 22:01:57 GMT-0300 (Argentina Standard Time)
        console.log(nombreUsuario); // Gabi
        console.log(precioTotal);   // 1550
        console.log(idProductos);   // [ 13, 12, 11 ]

        // Formato MySQL para timestamp
        // Tenemos que formatear la fecha para que la acepte mysql
        const fechaFormato = fecha.toISOString().slice(0, 19).replace("T", " "); // MySQL no acepta fechas en formato ISO con milisegundos ni con la Z

        console.log(fechaFormato); // 2025-12-02 01:07:10
        

        
        // Preparamos en el objeto data la informacion que le enviaremos al endpoint /api/sales en formato JSON en nuestra peticion POST
        const data = {
            nombreUsuario: nombreUsuario,
            precioTotal: precioTotal,
            fechaEmision: fechaFormato,
            productos: idProductos
        }

        /* Simulacion de redireccion sin envio de datos

        alert("Venta registrada con exito");
        // Limpieza y redireccion
        sessionStorage.removeItem("nombreUsuario"); // Eliminamos el nombre de usuario 
        // sessionStorage.removeItem("carrito")
        window.location.href = "index.html";
        */

        // TO DO, completar esto con el endpoint app.post("api/sales")

        const response = await fetch("http://localhost:3000/api/sales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if(response.ok) {
            console.log("Venta registrada: ", result);
            alert(result.message);

            // Limpieza y redireccion
            sessionStorage.removeItem("nombreUsuario"); // Eliminamos el nombre de usuario 
            // sessionStorage.removeItem("carrito")
            window.location.href = "index.html";

        } else {
            console.error(result);
            alert("Error en la venta: " + result.message)
        }



    } catch (error) {
        console.error("Error al enviar los datos", error);
        alert("Error al registrar la venta");
    }
}





// Agregar a carrito////////////////////////////////
function agregarCarrito(id) {

	//console.log(`id del producto: ${id}`);
	let frutaSeleccionada = productos.find(fruta => fruta.id === id);
	carrito.push(frutaSeleccionada);

	mostrarCarrito();
}




function eliminarProducto(index) {
    // Eliminar un elemento del array carrito a partir de su indice con splice()
    carrito.splice(index, 1);
    mostrarCarrito();
}




function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}




// Funcion inicializadora
function init() {
    obtenerProductos();
    saludarUsuario();
}

init();
