## Ejemplo de creacion de tickets con [jsPDF](https://github.com/parallax/jsPDF)
```js
// Imprimir tickets PDF /////////////////////////////////////
boton_imprimir.addEventListener("click", imprimirTicket);

/* Gracias al CDN ya podemos usar las funcionalidades que trae jsPDF
<!-- CDN para usar jsPDF -->
<script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>*/

function imprimirTicket() { // Idealmente, primero se registra la venta, luego se imprime el ticket
    console.table(carrito); // Visualizamos el carrito


    // Gracias al CDN ya podemos usar todas las funcionalidades de jsPDF
    // <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>

    // Para registrar las ventas a posteriori, guardaremos los ids de los produtos del carrito
    let idProductos = [];

    // Gracias al CDN, extraemos la clase jspdf del objeto global window
    const { jsPDF } = window.jspdf;

    // Creamos una nueva instancia del document usando la clase jsPDF
    const doc = new jsPDF(); // En doc inicializamos todos los metodos para crear pdfs


    // Definimos el margen superior de 40 en el eje y -> eje vertical, el eje x -> eje horizontal
    let y = 40;

    // Establecemos el tama;o de 32px para el primer texto
    doc.setFontSize(32);

    // Escribimos el texto ticket compra en la posicion x=80, y=40
    doc.text("Llama-ticket de compra:", 40, y); 

    // Definimos el espacio despues del titulo
    y += 25;

    // Definimos el tamaño de fuente para los productos del ticket
    doc.setFontSize(16);

    // Iteramos el carriot e imprimmos nombre y precio
    carrito.forEach(producto => {
        idProductos.push(producto.id); // Llenamos el array de ids de productos para registrar la venta despues

        doc.text(`${producto.name}  /  $${producto.price}`, 60, y); // Craemos el texto por cada producto

        y += 20; // Incrementamos la posicion vertical para EVITAR SOLAPAMIENTO
    });


    // Calculamos el precio total del ticket usando reduce
    const precioTotal = carrito.reduce((total, producto) => total + parseInt(producto.price)  , 0);

    // Añadimos otro espacio de 10 para separar el precio total de los productos
    y += 10;

    // Establecemos un tamaño más grande para el precio
    doc.setFontSize(24);

    // Escribimos el precio total del tickets
    doc.text(`Total: ${precioTotal}`, 40, y);

    // Imprimimos el ticket de venta
    /*
let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}]
    */

    // Creamos el formato de nombre del ticket -> pedido lucas-2026-06-24T15:21:21.973Z.pdf
    let fecha = new Date();
    let nombreTicket = `pedido-${nombreUsuario}-${fecha.toISOString()}.pdf`;

    // Imprimimos el ticket de venta
    doc.save(nombreTicket);
    

    /* De cara a la defensa, la funcionalidad ticket podria concluir aca con las siguientes lineas para hacer limpieza de session 
    y redireccion

    alert("Venta creada con exito");
    sessionStorage.removeItem("nombreUsuario");
    // sessionStorage.removeItem("carrito"); // Si guardamos el carrito en session
    window.location.href = "index.html"
    */



    // Llamado a registrar ventas y que haga la redireccion -> fetch POST /api/sales -> luego crearemos este endpoint app.post("/api/sales")
    //registrarVenta(precioTotal, idProductos);

    /*
    // Despues de que hayamos hecho la peticion POST a la tabla ventas: 
    // 1. Imprimir ticket con productos del carrito -> 
    // 2. Peticion POST a ventas -> 
    // 3. Limpiar la variable de sesion con el nombre del cliente y redirigir al index

    // Limpieza de variables en sesion y redireccion para resetear la app
    sessionStorage.removeItem("nombreUsuario");
    // sessionStorage.removeItem("carrito"); // Si guardamos el carrito en session
    window.location.href = "index.html"
    */
}
```